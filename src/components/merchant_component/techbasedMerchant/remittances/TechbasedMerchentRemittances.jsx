
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AxiosInstance from "../../../../Helper/axiosInstance";

export default function TechbasedMerchentRemittances() {
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState({});
  const [popupData, setPopupData] = useState(null);

  const getAnalytics = async () => {
    setLoading(true);

    try {
      const result = await AxiosInstance.get(
        "/api/tech-merchant/getMerchantRemittanceSummary"
      );

      console.log(result.data);
      setAnalytics(result.data);
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Error while fetching analytics"
      );
    } finally {
      setLoading(false);
    }
  };

  const openPopUp = (remittance) => {
    setPopupData(remittance);
  };

  const closePopUp = () => {
    setPopupData(null);
  };

  useEffect(() => {
    getAnalytics();
  }, []);

  const formatAmount = (amount) => {
    return Number(amount || 0).toLocaleString("en-IN");
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getAwbNumbers = (remittance) => {
    const awbs =
      remittance?.awb_number ||
      remittance?.awb_numbers ||
      "";

    return String(awbs)
      .split(",")
      .map((awb) => awb.trim())
      .filter(Boolean);
  };

  return (
    <>
      <div className="min-h-screen w-full bg-[#f5f8fb] transition-colors dark:bg-neutral-900">
        {/* Top Heading Stripe */}
        <div className="relative z-0  px-6 py-6  dark:bg-neutral-950">
          <div className="flex flex-wrap items-center justify-between">
            <h1 className="text-2xl font-semibold dark:text-white">
              Remittance
            </h1>
          </div>
        </div>

        <div className="max-w-full ">
          {/* Summary Section */}
          <div>
            <div
              className="
                rounded-sm border border-gray-200 bg-white p-6 shadow-sm
                transition-colors
                dark:border-neutral-700
                dark:bg-neutral-800
              "
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {/* Total COD */}
                <div
                  className="
                    flex flex-col items-center justify-center rounded-sm
                    border border-gray-100 bg-gray-50 p-4 shadow-sm
                    transition-colors

                    dark:border-neutral-700
                    dark:bg-neutral-900
                  "
                >
                  <span className="font-medium text-gray-600 dark:text-neutral-400">
                    Total COD
                  </span>

                  <span className="mt-1 text-xl font-bold text-[#0446DB] dark:text-blue-400">
                    ₹{formatAmount(analytics?.total_cod)}
                  </span>
                </div>

                {/* Remaining */}
                <div
                  className="
                    flex flex-col items-center justify-center rounded-sm
                    border border-gray-100 bg-gray-50 p-4 shadow-sm
                    transition-colors

                    dark:border-neutral-700
                    dark:bg-neutral-900
                  "
                >
                  <span className="font-medium text-gray-600 dark:text-neutral-400">
                    Remaining
                  </span>

                  <span className="mt-1 text-xl font-bold text-yellow-600 dark:text-yellow-400">
                    ₹{formatAmount(analytics?.remaining_cod_amount)}
                  </span>
                </div>

                {/* Paid */}
                <div
                  className="
                    flex flex-col items-center justify-center rounded-sm
                    border border-gray-100 bg-gray-50 p-4 shadow-sm
                    transition-colors

                    dark:border-neutral-700
                    dark:bg-neutral-900
                  "
                >
                  <span className="font-medium text-gray-600 dark:text-neutral-400">
                    Paid
                  </span>

                  <span className="mt-1 text-xl font-bold text-green-600 dark:text-green-400">
                    ₹
                    {formatAmount(
                      analytics?.total_paid_remittance_amount
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Loading */}
          {loading && (
            <div
              className="
                mt-3 flex min-h-[260px] items-center justify-center rounded-sm
                border border-gray-200 bg-white shadow-sm

                dark:border-neutral-700
                dark:bg-neutral-800
              "
            >
              <div className="flex flex-col items-center gap-3">
                <div
                  className="
                    h-10 w-10 animate-spin rounded-full border-4
                    border-gray-200 border-t-[#0446DB]

                    dark:border-neutral-700
                    dark:border-t-blue-500
                  "
                />

                <p className="text-sm text-gray-500 dark:text-neutral-400">
                  Loading remittance data...
                </p>
              </div>
            </div>
          )}

          {/* Records Table */}
          {!loading &&
            analytics?.remittance_records?.length > 0 && (
              <div
                className="
                  mt-3 overflow-x-auto rounded-sm border border-gray-200
                  bg-white shadow-sm

                  dark:border-neutral-700
                  dark:bg-neutral-800
                "
              >
                <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
                  <thead className="bg-gray-50 dark:bg-neutral-900">
                    <tr>
                      <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-neutral-400">
                        ID
                      </th>

                      <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-neutral-400">
                        Amount
                      </th>

                      <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-neutral-400">
                        Remittance Amount
                      </th>

                      <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-neutral-400">
                        Freight Deduction
                      </th>

                      <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-neutral-400">
                        Convenience Fee
                      </th>

                      <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-neutral-400">
                        AWB Number
                      </th>

                      <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-neutral-400">
                        UTR Number
                      </th>

                      <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-600 dark:text-neutral-400">
                        Upload Date
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100 bg-white dark:divide-neutral-700 dark:bg-neutral-800">
                    {analytics?.remittance_records?.map(
                      (remittance) => {
                        const awbNumbers =
                          getAwbNumbers(remittance);

                        return (
                          <tr
                            key={remittance?.id}
                            className="
                              transition-colors
                              hover:bg-gray-50
                              dark:hover:bg-neutral-900/70
                            "
                          >
                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800 dark:text-neutral-300">
                              {remittance?.id}
                            </td>

                            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-800 dark:text-neutral-200">
                              ₹
                              {formatAmount(
                                remittance?.amount
                              )}
                            </td>

                            <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-green-600 dark:text-green-400">
                              ₹
                              {formatAmount(
                                remittance?.remittance_amount
                              )}
                            </td>

                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800 dark:text-neutral-300">
                              ₹
                              {formatAmount(
                                remittance?.freight_deductions
                              )}
                            </td>

                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800 dark:text-neutral-300">
                              ₹
                              {formatAmount(
                                remittance?.convenience_fee
                              )}
                            </td>

                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800 dark:text-neutral-300">
                              {awbNumbers.length <= 1 ? (
                                <span>
                                  {awbNumbers?.[0] || "-"}
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() =>
                                    openPopUp(remittance)
                                  }
                                  className="
                                    rounded-md bg-blue-50 px-2.5 py-1
                                    font-medium text-[#0446DB]
                                    transition-colors
                                    hover:bg-blue-100

                                    dark:bg-blue-500/10
                                    dark:text-blue-400
                                    dark:hover:bg-blue-500/20
                                  "
                                >
                                  {awbNumbers[0]}...
                                </button>
                              )}
                            </td>

                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800 dark:text-neutral-300">
                              {remittance?.utr_number || "-"}
                            </td>

                            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-800 dark:text-neutral-300">
                              {formatDate(
                                remittance?.created_at
                              )}
                            </td>
                          </tr>
                        );
                      }
                    )}
                  </tbody>
                </table>
              </div>
            )}

          {/* Empty State */}
          {!loading &&
            (!analytics?.remittance_records ||
              analytics?.remittance_records?.length === 0) && (
              <div
                className="
                  mt-3 flex min-h-[250px] flex-col items-center
                  justify-center rounded-sm border border-gray-200
                  bg-white px-6 text-center shadow-sm

                  dark:border-neutral-700
                  dark:bg-neutral-800
                "
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-700">
                  <span className="text-xl text-gray-400 dark:text-neutral-400">
                    ₹
                  </span>
                </div>

                <h3 className="font-semibold text-gray-800 dark:text-neutral-200">
                  No Remittance Records
                </h3>

                <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                  No remittance data is currently available.
                </p>
              </div>
            )}
        </div>
      </div>

      {/* AWB Popup Modal */}
      {popupData && (
        <div
          className="
            fixed inset-0 z-50 flex items-center justify-center
            bg-black/50 px-4 backdrop-blur-[2px]
          "
          onClick={closePopUp}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="
              w-full max-w-md overflow-hidden rounded-lg
              border border-gray-200 bg-white shadow-2xl

              dark:border-neutral-700
              dark:bg-neutral-800
            "
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-neutral-700">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-neutral-100">
                  AWB Numbers
                </h2>

                <p className="mt-0.5 text-xs text-gray-500 dark:text-neutral-400">
                  {getAwbNumbers(popupData).length} AWB
                  {getAwbNumbers(popupData).length !== 1
                    ? "s"
                    : ""}
                </p>
              </div>

              <button
                type="button"
                onClick={closePopUp}
                className="
                  flex h-8 w-8 items-center justify-center rounded-md
                  text-lg text-gray-500 transition-colors
                  hover:bg-gray-100 hover:text-gray-800

                  dark:text-neutral-400
                  dark:hover:bg-neutral-700
                  dark:hover:text-neutral-100
                "
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="max-h-[55vh] overflow-y-auto p-5">
              <div className="space-y-2">
                {getAwbNumbers(popupData).map(
                  (awb, idx) => (
                    <div
                      key={`${awb}-${idx}`}
                      className="
                        flex items-center justify-between rounded-md
                        border border-gray-200 bg-gray-50
                        px-4 py-3

                        dark:border-neutral-700
                        dark:bg-neutral-900
                      "
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="
                            flex h-7 w-7 items-center justify-center
                            rounded-full bg-blue-100 text-xs font-semibold
                            text-[#0446DB]

                            dark:bg-blue-500/10
                            dark:text-blue-400
                          "
                        >
                          {idx + 1}
                        </span>

                        <span className="text-sm font-medium text-gray-700 dark:text-neutral-300">
                          {awb}
                        </span>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end border-t border-gray-200 bg-gray-50 px-5 py-4 dark:border-neutral-700 dark:bg-neutral-900/70">
              <button
                type="button"
                onClick={closePopUp}
                className="
                  rounded-md bg-[#0446DB] px-5 py-2
                  text-sm font-medium text-white
                  transition-colors hover:bg-blue-700

                  dark:bg-blue-600
                  dark:hover:bg-blue-500
                "
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

