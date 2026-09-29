import { useEffect, useState } from "react";
import {
  Loader2,
  CheckCircle,
  AlertCircle,
  Users,
  IndianRupee,
  Truck,
  Zap,
} from "lucide-react";
import toast from "react-hot-toast";
import AxiosInstance from "../../../../Helper/axiosInstance";

export default function CreateRiderRate() {
  const [riders, setRiders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    type: "",
    rider: "",
    rateType: "",
    rate: "",
    orderMode: "",
  });

  const rateValues = [
    {
      value: "SDD",
      label: "Same Day Delivery",
      description: "Delivery within the same day",
    },
    {
      value: "NDD",
      label: "Next Day Delivery",
      description: "Delivery on the next day",
    },
  ];

  const rateTypeValues = [
    {
      value: "perorder",
      label: "Per Order",
      description: "Fixed charge for every order",
    },
    {
      value: "perkms",
      label: "Per Kilometer",
      description: "Charge based on delivery distance",
    },
  ];

  // =========================================================
  // FETCH RIDERS
  // =========================================================

  useEffect(() => {
    if (formData.type === "individual") {
      fetchRiders();
    }
  }, [formData.type]);

  const fetchRiders = async () => {
    try {
      setFetching(true);
      setError("");

      const res = await AxiosInstance.get(
        "/api/tech-merchant/getRidersWithoutMerchantRate"
      );

      setRiders(res?.data?.riders || []);
    } catch (err) {
      console.error("Fetch riders error:", err);

      setError(
        err?.response?.data?.message || "Failed to fetch riders"
      );
    } finally {
      setFetching(false);
    }
  };

  // =========================================================
  // HANDLE CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const updated = {
        ...prev,
        [name]: value,
      };

      // Reset rider when changing rate-for type
      if (name === "type") {
        updated.rider = "";
      }

      // Per KM always uses Turant
      if (name === "rateType") {
        if (value === "perkms") {
          updated.orderMode = "Turant";
        } else if (prev.orderMode === "Turant") {
          updated.orderMode = "";
        }
      }

      return updated;
    });

    setError("");
    setSuccess("");
  };

  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValidForm()) {
      toast.error("Please complete all required fields.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const payload = {
        rate_for: formData.type,
        rider_id:
          formData.type === "individual"
            ? formData.rider
            : undefined,
        rate_type: formData.rateType,
        rate: parseFloat(formData.rate),
        order_mode: formData.orderMode,
      };

      const result = await AxiosInstance.post(
        "/api/tech-merchant/addMerchantRate",
        payload
      );

      if (result?.data?.success) {
        const message =
          result?.data?.message ||
          "Rider rate created successfully!";

        setSuccess(message);
        toast.success(message);

        setFormData({
          type: "",
          rider: "",
          rateType: "",
          rate: "",
          orderMode: "",
        });

        setRiders([]);
      } else {
        const message =
          result?.data?.message ||
          "Failed to create rider rate";

        setError(message);
        toast.error(message);
      }
    } catch (err) {
      console.error("Create rider rate error:", err);

      const message =
        err?.response?.data?.message ||
        "Failed to create rider rate";

      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // VALIDATION
  // =========================================================

  const isValidForm = () => {
    if (
      !formData.type ||
      !formData.rateType ||
      formData.rate === "" ||
      !formData.orderMode
    ) {
      return false;
    }

    if (
      Number.isNaN(Number(formData.rate)) ||
      Number(formData.rate) < 0
    ) {
      return false;
    }

    if (
      formData.type === "individual" &&
      !formData.rider
    ) {
      return false;
    }

    return true;
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="flex min-h-[70vh] w-full items-center justify-center bg-[#F8FAFC] dark:bg-neutral-900">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-[#0446DB] dark:text-blue-400" />

          <p className="mt-3 text-sm font-medium text-neutral-500 dark:text-neutral-400">
            Creating rider rate...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // JSX
  // =========================================================

  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] p-3 text-neutral-900 transition-colors duration-200 dark:bg-neutral-900 dark:text-neutral-100 sm:p-4 lg:p-6">
      <div className="mx-auto w-full">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="mb-6">
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-2xl">
            Rider Rate Management
          </h1>

          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            Create and configure rider delivery rates
          </p>
        </div>

        {/* =====================================================
            ERROR
        ====================================================== */}

        {error && (
          <div className="mb-5 flex items-start gap-3 rounded-sm border border-red-200 bg-red-50 p-3 dark:border-red-900/50 dark:bg-red-950/20">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500 dark:text-red-400" />

            <div className="flex-1">
              <p className="text-sm font-medium text-red-700 dark:text-red-300">
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setError("")}
              className="text-red-400 transition-colors hover:text-red-600 dark:hover:text-red-300"
            >
              ×
            </button>
          </div>
        )}

        {/* =====================================================
            SUCCESS
        ====================================================== */}

        {success && (
          <div className="mb-5 flex items-start gap-3 rounded-sm border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-900/50 dark:bg-emerald-950/20">
            <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500 dark:text-emerald-400" />

            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
              {success}
            </p>
          </div>
        )}

        {/* =====================================================
            FORM
        ====================================================== */}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

            {/* =================================================
                LEFT CARD
            ================================================== */}

            <div className="rounded-sm border border-neutral-200 bg-white p-5 shadow-sm transition-colors dark:border-neutral-800 dark:bg-neutral-900 sm:p-6">

              {/* HEADER */}

              <div className="mb-6 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-[#0446DB]/10 text-[#0446DB] dark:bg-[#0446DB]/20 dark:text-blue-300">
                  <Users className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                    Rate Configuration
                  </h2>

                  <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
                    Select who this rate will apply to
                  </p>
                </div>
              </div>

              <div className="space-y-6">

                {/* RATE FOR */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-200">
                    Rate For
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      required
                      className="h-11 w-full cursor-pointer appearance-none rounded-sm border border-neutral-200 bg-white px-3 pr-10 text-sm text-neutral-800 outline-none transition-all focus:border-[#0446DB] focus:ring-1 focus:ring-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                    >
                      <option value="">
                        Select Rider Type
                      </option>

                      <option value="all">
                        All Riders
                      </option>

                      <option value="individual">
                        Individual Rider
                      </option>
                    </select>

                    <svg
                      className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400 dark:text-neutral-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>

                  <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                    Choose whether the rate applies to all riders
                    or a specific rider.
                  </p>
                </div>

                {/* INDIVIDUAL RIDER */}

                {formData.type === "individual" && (
                  <div className="animate-fadeIn">
                    <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-200">
                      Select Rider
                      <span className="ml-1 text-red-500">*</span>
                    </label>

                    {fetching ? (
                      <div className="flex h-11 items-center justify-center rounded-sm border border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin text-[#0446DB] dark:text-blue-400" />

                        <span className="text-sm text-neutral-500 dark:text-neutral-400">
                          Loading riders...
                        </span>
                      </div>
                    ) : (
                      <>
                        <div className="relative">
                          <select
                            name="rider"
                            value={formData.rider}
                            onChange={handleChange}
                            required
                            className="h-11 w-full cursor-pointer appearance-none rounded-sm border border-neutral-200 bg-white px-3 pr-10 text-sm text-neutral-800 outline-none transition-all focus:border-[#0446DB] focus:ring-1 focus:ring-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                          >
                            <option value="">
                              Select a Rider
                            </option>

                            {riders.map((rider) => (
                              <option
                                key={rider.id}
                                value={rider.id}
                              >
                                {rider.name} ({rider.id})
                              </option>
                            ))}
                          </select>

                          <svg
                            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400 dark:text-neutral-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>

                        {riders.length > 0 && (
                          <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                            {riders.length} rider
                            {riders.length !== 1 ? "s" : ""}{" "}
                            available
                          </p>
                        )}

                        {riders.length === 0 && (
                          <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                            No riders without an existing rate
                            are available.
                          </p>
                        )}
                      </>
                    )}
                  </div>
                )}

                {/* INFORMATION */}

                <div className="rounded-sm border border-blue-100 bg-blue-50/70 p-4 dark:border-blue-900/40 dark:bg-blue-950/20">
                  <div className="flex gap-3">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#0446DB] dark:text-blue-400" />

                    <p className="text-xs leading-5 text-neutral-600 dark:text-neutral-300">
                      Individual rates are applied only to the
                      selected rider. All Riders rates apply to
                      every eligible rider.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* =================================================
                RIGHT CARD
            ================================================== */}

            <div className="rounded-sm border border-neutral-200 bg-white p-5 shadow-sm transition-colors dark:border-neutral-800 dark:bg-neutral-900 sm:p-6">

              {/* HEADER */}

              <div className="mb-6 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                  <IndianRupee className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                    Rate Details
                  </h2>

                  <p className="mt-0.5 text-sm text-neutral-500 dark:text-neutral-400">
                    Configure pricing and delivery mode
                  </p>
                </div>
              </div>

              <div className="space-y-6">

                {/* RATE TYPE */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-200">
                    Rate Type
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {rateTypeValues.map((rt) => {
                      const selected =
                        formData.rateType === rt.value;

                      return (
                        <button
                          key={rt.value}
                          type="button"
                          onClick={() =>
                            handleChange({
                              target: {
                                name: "rateType",
                                value: rt.value,
                              },
                            })
                          }
                          className={`rounded-sm border p-4 text-left transition-all ${
                            selected
                              ? "border-[#0446DB] bg-[#0446DB]/5 ring-1 ring-[#0446DB] dark:border-blue-500 dark:bg-blue-500/10 dark:ring-blue-500"
                              : "border-neutral-200 bg-white hover:border-[#0446DB]/50 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-blue-500 dark:hover:bg-neutral-800"
                          }`}
                        >
                          <div
                            className={`text-sm font-semibold ${
                              selected
                                ? "text-[#0446DB] dark:text-blue-300"
                                : "text-neutral-800 dark:text-neutral-200"
                            }`}
                          >
                            {rt.label}
                          </div>

                          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                            {rt.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* RATE AMOUNT */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-200">
                    Rate Amount
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-neutral-500 dark:text-neutral-400">
                      ₹
                    </span>

                    <input
                      type="number"
                      name="rate"
                      value={formData.rate}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      placeholder="Enter rate amount"
                      required
                      className="h-11 w-full rounded-sm border border-neutral-200 bg-white pl-8 pr-3 text-sm text-neutral-900 outline-none transition-all placeholder:text-neutral-400 focus:border-[#0446DB] focus:ring-1 focus:ring-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-500"
                    />
                  </div>

                  <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                    {formData.rateType === "perorder"
                      ? "Amount charged per order"
                      : formData.rateType === "perkms"
                        ? "Amount charged per kilometer"
                        : "Enter the rider rate amount"}
                  </p>
                </div>

                {/* ORDER MODE */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-neutral-700 dark:text-neutral-200">
                    Order Mode
                    <span className="ml-1 text-red-500">*</span>
                  </label>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                    {/* PER ORDER */}

                    {formData.rateType === "perorder" &&
                      rateValues.map((mode) => {
                        const selected =
                          formData.orderMode === mode.value;

                        return (
                          <button
                            key={mode.value}
                            type="button"
                            onClick={() =>
                              handleChange({
                                target: {
                                  name: "orderMode",
                                  value: mode.value,
                                },
                              })
                            }
                            className={`rounded-sm border p-4 text-left transition-all ${
                              selected
                                ? "border-[#0446DB] bg-[#0446DB]/5 ring-1 ring-[#0446DB] dark:border-blue-500 dark:bg-blue-500/10 dark:ring-blue-500"
                                : "border-neutral-200 bg-white hover:border-[#0446DB]/50 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-blue-500 dark:hover:bg-neutral-800"
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <Truck
                                className={`mt-0.5 h-4 w-4 ${
                                  selected
                                    ? "text-[#0446DB] dark:text-blue-300"
                                    : "text-neutral-400 dark:text-neutral-500"
                                }`}
                              />

                              <div>
                                <p
                                  className={`text-sm font-semibold ${
                                    selected
                                      ? "text-[#0446DB] dark:text-blue-300"
                                      : "text-neutral-800 dark:text-neutral-200"
                                  }`}
                                >
                                  {mode.label}
                                </p>

                                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                                  {mode.description}
                                </p>
                              </div>
                            </div>
                          </button>
                        );
                      })}

                    {/* PER KM */}

                    {formData.rateType === "perkms" && (
                     <>
                       <button
  type="button"
  onClick={() =>
    handleChange({
      target: {
        name: "orderMode",
        value: "HLD",
      },
    })
  }
  className={`rounded-sm border p-4 text-left transition-all ${
    formData.orderMode === "HLD"
      ? "border-[#0446DB] bg-[#0446DB]/5 ring-1 ring-[#0446DB] dark:border-blue-500 dark:bg-blue-500/10 dark:ring-blue-500"
      : "border-neutral-200 bg-white hover:border-[#0446DB]/50 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-blue-500 dark:hover:bg-neutral-800"
  }`}
>
  <div className="flex items-center gap-2">
    <Zap
      className={`h-4 w-4 ${
        formData.orderMode === "HLD"
          ? "text-[#0446DB] dark:text-blue-300"
          : "text-neutral-400 dark:text-neutral-500"
      }`}
    />

    <div>
      <p
        className={`text-sm font-semibold ${
          formData.orderMode === "HLD"
            ? "text-[#0446DB] dark:text-blue-300"
            : "text-neutral-800 dark:text-neutral-200"
        }`}
      >
        HLD
      </p>

      <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
        Instant distance-based delivery
      </p>
    </div>
  </div>
</button>
                     </>
                    )}
                  </div>

                  {!formData.rateType && (
                    <p className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
                      Select a rate type to choose the order mode.
                    </p>
                  )}
                </div>

                {/* =================================================
                    SUBMIT
                ================================================== */}

                <div className="border-t border-neutral-100 pt-5 dark:border-neutral-800">
                  <button
                    type="submit"
                    disabled={!isValidForm() || loading}
                    className={`flex h-11 w-full items-center justify-center gap-2 rounded-sm px-5 text-sm font-semibold transition-all ${
                      isValidForm() && !loading
                        ? "bg-[#0446DB] text-white shadow-sm hover:bg-[#0339B5] hover:shadow-md"
                        : "cursor-not-allowed bg-neutral-200 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-500"
                    }`}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating Rate...
                      </>
                    ) : (
                      "Create Rider Rate"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out;
        }
      `}</style>
    </div>
  );
}