
import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  Search,
  Plus,
  Trash2,
  X,
  Loader2,
  CreditCard,
  CalendarDays,
  IndianRupee,
  Layers3,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import AxiosInstance from "@/Helper/axiosInstance";

const baseURL = import.meta.env.VITE_BASE_URL;

export default function Analytics() {
  const [showModal, setShowModal] = useState(false);
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    plan_name: "",
    amount: "",
    validity: "",
  });

  // ================================
  // AUTH HEADER
  // ================================

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  // ================================
  // GET ALL PLANS
  // ================================

  const getAllSubscriptionPlans = async () => {
    try {
      setLoading(true);

      const res = await AxiosInstance.get(
        `${baseURL}/api/admin/getAllSubscriptionPlans`,
        
      );

      const plans = Array.isArray(res?.data?.data)
        ? res.data.data
        : [];

      setSubscriptionPlans(plans);
    } catch (error) {
      console.error("Subscription plans error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to fetch subscription plans",
      );
    } finally {
      setLoading(false);
    }
  };

  // ================================
  // FILTER PLANS
  // ================================

  const filteredPlans = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) {
      return subscriptionPlans;
    }

    return subscriptionPlans.filter((plan) => {
      const name = String(plan?.plan_name || "").toLowerCase();
      const amount = String(plan?.amount || "").toLowerCase();
      const validity = String(plan?.validity || "").toLowerCase();

      return (
        name.includes(search) ||
        amount.includes(search) ||
        validity.includes(search)
      );
    });
  }, [subscriptionPlans, searchTerm]);

  // ================================
  // STARTING PRICE
  // ================================

  const startingPrice = useMemo(() => {
    if (!subscriptionPlans.length) {
      return 0;
    }

    const prices = subscriptionPlans
      .map((plan) => Number(plan?.amount))
      .filter((amount) => Number.isFinite(amount));

    if (!prices.length) {
      return 0;
    }

    return Math.min(...prices);
  }, [subscriptionPlans]);

  // ================================
  // RESET FORM
  // ================================

  const resetForm = () => {
    setFormData({
      plan_name: "",
      amount: "",
      validity: "",
    });
  };

  // ================================
  // CLOSE MODAL
  // ================================

  const closeModal = () => {
    if (creating) return;

    setShowModal(false);
    resetForm();
  };

  // ================================
  // CREATE PLAN
  // ================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.plan_name.trim()) {
      toast.error("Plan name is required");
      return;
    }

    if (
      formData.amount === "" ||
      Number(formData.amount) < 0
    ) {
      toast.error("Please enter a valid price");
      return;
    }

    if (
      !formData.validity ||
      Number(formData.validity) < 1
    ) {
      toast.error("Validity must be at least 1 day");
      return;
    }

    try {
      setCreating(true);

      const res = await AxiosInstance.post(
        `/api/admin/createSubscriptionPlan`,
        {
          plan_name: formData.plan_name.trim(),
          amount: formData.amount,
          validity: formData.validity,
        },
        
      );

      toast.success(
        res?.data?.message ||
          "Subscription plan created successfully",
      );

      setShowModal(false);
      resetForm();

      await getAllSubscriptionPlans();
    } catch (error) {
      console.error("Create plan error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to create plan",
      );
    } finally {
      setCreating(false);
    }
  };

  // ================================
  // DELETE PLAN
  // ================================

  const deletePlan = async (planId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this subscription plan?",
    );

    if (!confirmed) return;

    try {
      setDeletingId(planId);

      const res = await AxiosInstance.delete(
        `${baseURL}/api/admin/deleteSubscriptionPlanById/${planId}`,
        
      );

      toast.success(
        res?.data?.message ||
          "Subscription plan deleted successfully",
      );

      await getAllSubscriptionPlans();
    } catch (error) {
      console.error("Delete plan error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to delete plan",
      );
    } finally {
      setDeletingId(null);
    }
  };

  // ================================
  // INITIAL LOAD
  // ================================

  useEffect(() => {
    getAllSubscriptionPlans();
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-slate-900 transition-colors dark:bg-[#090d16] dark:text-slate-100">

      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <div className=" dark:border-white/10 dark:bg-[#071a46]">
        <div className="mx-auto ">

          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

            {/* Heading */}

            <div>
              

              <h1 className="text-2xl font-bold tracking-tight dark:text-white sm:text-3xl">
                Subscription Plans
              </h1>

              <p className="mt-1 max-w-2xl text-sm dark:text-blue-100">
                Create and manage your subscription plans,
                pricing and validity.
              </p>
            </div>

            {/* Search + Button */}

            <div className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto">

              {/* Search */}

              <div className="relative w-full sm:min-w-[330px]">

                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(e.target.value)
                  }
                  placeholder="Search plan, price or validity..."
                  className="
                    h-11
                    w-full
                    rounded-sm
                    border
                    border-white/20
                    bg-white
                    pl-10
                    pr-10
                    text-sm
                    text-slate-900
                    shadow-sm
                    outline-none
                    transition
                    placeholder:text-slate-400
                    focus:border-blue-300
                    focus:ring-4
                    focus:ring-blue-200/30

                    dark:border-white/10
                    dark:bg-slate-950
                    dark:text-white
                    dark:placeholder:text-slate-500
                    dark:focus:border-blue-500
                    dark:focus:ring-blue-500/10
                  "
                />

                {searchTerm && (
                  <button
                    type="button"
                    onClick={() =>
                      setSearchTerm("")
                    }
                    className="
                      absolute
                      right-3
                      top-1/2
                      -translate-y-1/2
                      rounded-md
                      p-1
                      text-slate-400
                      transition
                      hover:bg-slate-100
                      hover:text-slate-700

                      dark:hover:bg-slate-800
                      dark:hover:text-white
                    "
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Add Button */}

              <button
                type="button"
                onClick={() => setShowModal(true)}
                className="
                  inline-flex
                  h-11
                  shrink-0
                  items-center
                  justify-center
                  gap-2
                  rounded-sm
                  bg-white
                  px-5
                  text-sm
                  font-bold
                  text-[#0446DB]
                  shadow-sm
                  transition
                  hover:bg-blue-50
                  active:scale-[0.98]

                  dark:bg-blue-600
                  dark:text-white
                  dark:hover:bg-blue-500
                "
              >
                <Plus className="h-4 w-4" />

                Add New Plan
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ================================= */}
      {/* CONTENT */}
      {/* ================================= */}

      <main className="mx-auto">

        

        {/* ================================= */}
        {/* TABLE CARD */}
        {/* ================================= */}

        <section className="overflow-hidden rounded-sm border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#0f1623]">

          {/* Table Header */}

          <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">

            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                All Subscription Plans
              </h2>

              <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                Manage pricing and validity for every
                subscription plan.
              </p>
            </div>

            <button
              type="button"
              onClick={getAllSubscriptionPlans}
              disabled={loading}
              className="
                inline-flex
                h-9
                items-center
                justify-center
                gap-2
                self-start
                rounded-sm
                border
                border-slate-200
                bg-white
                px-3
                text-xs
                font-semibold
                text-slate-600
                transition
                hover:bg-slate-50
                disabled:cursor-not-allowed
                disabled:opacity-60

                dark:border-slate-700
                dark:bg-slate-900
                dark:text-slate-300
                dark:hover:bg-slate-800

                sm:self-auto
              "
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${
                  loading ? "animate-spin" : ""
                }`}
              />

              Refresh
            </button>
          </div>

          {/* ================================= */}
          {/* LOADING */}
          {/* ================================= */}

          {loading ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center">

              <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-blue-50 dark:bg-blue-500/10">
                <Loader2 className="h-6 w-6 animate-spin text-[#0446DB] dark:text-blue-400" />
              </div>

              <p className="mt-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
                Loading subscription plans...
              </p>
            </div>
          ) : filteredPlans.length === 0 ? (

            /* ================================= */
            /* EMPTY STATE */
            /* ================================= */

            <div className="flex min-h-[340px] flex-col items-center justify-center px-5 text-center">

              <div className="flex h-14 w-14 items-center justify-center rounded-sm border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900">
                <Search className="h-6 w-6 text-slate-400" />
              </div>

              <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
                {searchTerm
                  ? "No plans found"
                  : "No subscription plans yet"}
              </h3>

              <p className="mt-1 max-w-md text-sm text-slate-500 dark:text-slate-400">
                {searchTerm
                  ? `No plan found matching "${searchTerm}".`
                  : "Create your first subscription plan to get started."}
              </p>

              <button
                type="button"
                onClick={
                  searchTerm
                    ? () => setSearchTerm("")
                    : () => setShowModal(true)
                }
                className="mt-5 inline-flex h-10 items-center gap-2 rounded-sm bg-[#0446DB] px-4 text-sm font-semibold text-white transition hover:bg-[#0339b3]"
              >
                {searchTerm ? (
                  <>
                    <X className="h-4 w-4" />
                    Clear Search
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" />
                    Create Plan
                  </>
                )}
              </button>
            </div>
          ) : (
            <>
              {/* ================================= */}
              {/* DESKTOP TABLE */}
              {/* ================================= */}

              <div className="hidden overflow-x-auto md:block">
                <table className="w-full">

                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/80 dark:border-slate-800 dark:bg-slate-900/60">

                      <TableHeading className="w-20">
                        #
                      </TableHeading>

                      <TableHeading>
                        Plan Name
                      </TableHeading>

                      <TableHeading>
                        Price
                      </TableHeading>

                      <TableHeading>
                        Validity
                      </TableHeading>

                      <TableHeading className="w-36 text-right">
                        Actions
                      </TableHeading>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">

                    {filteredPlans.map(
                      (plan, index) => (
                        <tr
                          key={plan?.id ?? index}
                          className="transition hover:bg-slate-50/80 dark:hover:bg-slate-900/60"
                        >

                          {/* ID */}

                          <td className="px-5 py-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                            {String(
                              index + 1,
                            ).padStart(2, "0")}
                          </td>

                          {/* PLAN */}

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">

                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-blue-50 text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400">
                                <CreditCard className="h-4 w-4" />
                              </div>

                              <div>
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                  {plan?.plan_name ||
                                    "Unnamed Plan"}
                                </p>

                                <p className="mt-0.5 text-xs text-slate-400">
                                  Plan ID:{" "}
                                  {plan?.id ?? "—"}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* PRICE */}

                          <td className="px-5 py-4">
                            <span className="inline-flex items-center text-sm font-bold text-slate-900 dark:text-white">

                              <IndianRupee className="h-3.5 w-3.5" />

                              {Number(
                                plan?.amount || 0,
                              ).toLocaleString(
                                "en-IN",
                              )}
                            </span>
                          </td>

                          {/* VALIDITY */}

                          <td className="px-5 py-4">

                            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">

                              <CalendarDays className="h-3.5 w-3.5" />

                              {plan?.validity} days
                            </span>
                          </td>

                          {/* DELETE */}

                          <td className="px-5 py-4 text-right">

                            <button
                              type="button"
                              onClick={() =>
                                deletePlan(
                                  plan?.id,
                                )
                              }
                              disabled={
                                deletingId ===
                                plan?.id
                              }
                              className="
                                inline-flex
                                h-9
                                items-center
                                justify-center
                                gap-1.5
                                rounded-sm
                                border
                                border-red-200
                                bg-white
                                px-3
                                text-xs
                                font-semibold
                                text-red-600
                                transition
                                hover:bg-red-50
                                disabled:cursor-not-allowed
                                disabled:opacity-60

                                dark:border-red-500/20
                                dark:bg-slate-900
                                dark:text-red-400
                                dark:hover:bg-red-500/10
                              "
                            >
                              {deletingId ===
                              plan?.id ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="h-3.5 w-3.5" />
                              )}

                              Delete
                            </button>
                          </td>
                        </tr>
                      ),
                    )}
                  </tbody>
                </table>
              </div>

              {/* ================================= */}
              {/* MOBILE CARDS */}
              {/* ================================= */}

              <div className="divide-y divide-slate-100 md:hidden dark:divide-slate-800">

                {filteredPlans.map(
                  (plan, index) => (
                    <div
                      key={plan?.id ?? index}
                      className="p-4"
                    >
                      <div className="flex items-start justify-between gap-3">

                        <div className="flex min-w-0 items-center gap-3">

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-blue-50 text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400">

                            <CreditCard className="h-5 w-5" />
                          </div>

                          <div className="min-w-0">

                            <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                              {plan?.plan_name ||
                                "Unnamed Plan"}
                            </p>

                            <p className="mt-0.5 text-xs text-slate-400">
                              Plan #{index + 1}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            deletePlan(plan?.id)
                          }
                          disabled={
                            deletingId === plan?.id
                          }
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-red-200 text-red-600 transition hover:bg-red-50 disabled:opacity-60 dark:border-red-500/20 dark:text-red-400 dark:hover:bg-red-500/10"
                        >
                          {deletingId ===
                          plan?.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3">

                        {/* PRICE */}

                        <div className="rounded-sm bg-slate-50 p-3 dark:bg-slate-900">

                          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                            Price
                          </p>

                          <p className="mt-1 flex items-center text-sm font-bold text-slate-900 dark:text-white">

                            <IndianRupee className="h-3.5 w-3.5" />

                            {Number(
                              plan?.amount || 0,
                            ).toLocaleString(
                              "en-IN",
                            )}
                          </p>
                        </div>

                        {/* VALIDITY */}

                        <div className="rounded-sm bg-slate-50 p-3 dark:bg-slate-900">

                          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                            Validity
                          </p>

                          <p className="mt-1 text-sm font-bold text-slate-900 dark:text-white">
                            {plan?.validity} days
                          </p>
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>

              {/* ================================= */}
              {/* FOOTER */}
              {/* ================================= */}

              <div className="flex flex-col gap-1 border-t border-slate-200 bg-slate-50/70 px-5 py-3 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between">

                <p>
                  Showing{" "}
                  <span className="font-bold text-slate-700 dark:text-slate-200">
                    {filteredPlans.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-slate-700 dark:text-slate-200">
                    {subscriptionPlans.length}
                  </span>{" "}
                  plans
                </p>

                {searchTerm && (
                  <p>
                    Filter:{" "}
                    <span className="font-semibold text-[#0446DB] dark:text-blue-400">
                      "{searchTerm}"
                    </span>
                  </p>
                )}
              </div>
            </>
          )}
        </section>
      </main>

      {/* ================================= */}
      {/* CREATE PLAN MODAL */}
      {/* ================================= */}

      {showModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-[2px]"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closeModal();
            }
          }}
        >
          <div className="w-full max-w-md overflow-hidden rounded-sm border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-[#111827]">

            {/* MODAL HEADER */}

            <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-700">

              <div className="flex gap-3">

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-blue-50 text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400">

                  <Plus className="h-5 w-5" />
                </div>

                <div>

                  <h2 className="text-base font-bold text-slate-900 dark:text-white">
                    Create New Plan
                  </h2>

                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    Add pricing and validity for the
                    subscription.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={creating}
                className="rounded-sm p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* ================================= */}
            {/* FORM */}
            {/* ================================= */}

            <form onSubmit={handleSubmit}>

              <div className="space-y-4 p-5">

                {/* PLAN NAME */}

                <FormField
                  label="Plan Name"
                  required
                  type="text"
                  placeholder="e.g. Basic, Professional"
                  value={formData.plan_name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      plan_name:
                        e.target.value,
                    }))
                  }
                />

                {/* PRICE */}

                <FormField
                  label="Price"
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  prefix={
                    <IndianRupee className="h-4 w-4" />
                  }
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      amount:
                        e.target.value,
                    }))
                  }
                />

                {/* VALIDITY */}

                <FormField
                  label="Validity"
                  required
                  type="number"
                  min="1"
                  placeholder="e.g. 30"
                  value={formData.validity}
                  suffix="days"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      validity:
                        e.target.value,
                    }))
                  }
                />
              </div>

              {/* ================================= */}
              {/* MODAL FOOTER */}
              {/* ================================= */}

              <div className="flex gap-3 border-t border-slate-200 bg-slate-50/80 p-5 dark:border-slate-700 dark:bg-slate-900/60">

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={creating}
                  className="
                    h-10
                    flex-1
                    rounded-sm
                    border
                    border-slate-300
                    bg-white
                    px-4
                    text-sm
                    font-semibold
                    text-slate-700
                    transition
                    hover:bg-slate-50
                    disabled:opacity-50

                    dark:border-slate-700
                    dark:bg-slate-900
                    dark:text-slate-200
                    dark:hover:bg-slate-800
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={creating}
                  className="
                    inline-flex
                    h-10
                    flex-1
                    items-center
                    justify-center
                    gap-2
                    rounded-sm
                    bg-[#0446DB]
                    px-4
                    text-sm
                    font-semibold
                    text-white
                    transition
                    hover:bg-[#0339b3]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  {creating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      Create Plan
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================================= */
/* SUMMARY CARD */
/* ================================= */

function SummaryCard({
  icon,
  label,
  value,
  helper,
}) {
  return (
    <div className="rounded-sm border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-[#0f1623]">

      <div className="flex items-start justify-between gap-3">

        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {label}
          </p>

          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {helper}
          </p>
        </div>

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-blue-50 text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400">
          {icon}
        </div>
      </div>
    </div>
  );
}

/* ================================= */
/* TABLE HEADING */
/* ================================= */

function TableHeading({
  children,
  className = "",
}) {
  return (
    <th
      className={`
        px-5
        py-3
        text-left
        text-[11px]
        font-bold
        uppercase
        tracking-wider
        text-slate-500
        dark:text-slate-400
        ${className}
      `}
    >
      {children}
    </th>
  );
}

/* ================================= */
/* FORM FIELD */
/* ================================= */

function FormField({
  label,
  required,
  prefix,
  suffix,
  className = "",
  ...props
}) {
  return (
    <div>

      <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">

        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      <div className="relative">

        {prefix && (
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {prefix}
          </div>
        )}

        <input
          required={required}
          {...props}
          className={`
            h-11
            w-full
            rounded-sm
            border
            border-slate-300
            bg-white
            px-3
            text-sm
            text-slate-900
            outline-none
            transition
            placeholder:text-slate-400
            focus:border-[#0446DB]
            focus:ring-4
            focus:ring-blue-100

            dark:border-slate-700
            dark:bg-slate-900
            dark:text-white
            dark:placeholder:text-slate-500
            dark:focus:border-blue-500
            dark:focus:ring-blue-500/10

            ${prefix ? "pl-9" : ""}
            ${suffix ? "pr-14" : ""}
            ${className}
          `}
        />

        {suffix && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}