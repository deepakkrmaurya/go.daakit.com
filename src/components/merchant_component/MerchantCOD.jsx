// import axios from "axios";
// import { useEffect, useState } from "react";
// import Loader from "../Loader";
// import { TbReportAnalytics } from "react-icons/tb";
// import { FaPlaneArrival } from "react-icons/fa";
// import { GiCancel } from "react-icons/gi";
// import { toast } from "react-toastify";

// const baseURL = import.meta.env.VITE_BASE_URL;

// export default function MerchantCOD() {
//   const [loading, setLoading] = useState(false);
//   const [analytics, setAnalytics] = useState({});

//   const [popupData, setPopupData] = useState(null);

//   const getAnalytics = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(
//         `${baseURL}/api/merchant/getMerchantRemittanceSummary`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       setAnalytics(res.data);
//     } catch (err) {
//       toast.error(err.response?.data?.message || err.message || "Error while fetching analytics");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const openPopUp = (remmitance) => {
//     setPopupData(remmitance);
//   }

//   const closePopUp = () => {
//     setPopupData(null);
//   };

//   useEffect(() => {
//     getAnalytics();
//   }, []);

//   return (
//     <>
//       {loading ? (
//         <Loader />
//       ) : (
//         <div className="bg-gray-100 min-h-screen w-full">
//           {/* Top Heading Stripe */}
//           <div className="relative z-0 mb-6 bg-[#0446DB] py-[24px] shadow-md h-30 px-[24px]">
//             <div className="flex flex-wrap items-center justify-between">
//               {/* Heading */}
//               <h1 className="text-2xl text-white">Remittance</h1>
//             </div>
//           </div>

//           <div className="max-w-full px-4 -mt-20 relative z-10">
//             <div>
//               <div className="bg-white p-6 rounded-sm shadow-md border border-gray-200">
//                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                   <div className="flex flex-col justify-center items-center bg-gray-50 p-4 rounded-sm shadow-sm border border-gray-100">
//                     <span className="text-gray-600 font-medium">Total COD</span>
//                     <span className="text-xl font-bold text-[#0446DB]">
//                       ₹{Number(analytics?.total_cod).toLocaleString()}
//                     </span>
//                   </div>
//                   <div className="flex flex-col justify-center items-center bg-gray-50 p-4 rounded-sm shadow-sm border border-gray-100">
//                     <span className="text-gray-600 font-medium">Remaining</span>
//                     <span className="text-xl font-bold text-yellow-600">
//                       ₹{Number(analytics?.remaining_cod_amount).toLocaleString()}
//                     </span>
//                   </div>
//                   <div className="flex flex-col justify-center items-center bg-gray-50 p-4 rounded-sm shadow-sm border border-gray-100">
//                     <span className="text-gray-600 font-medium">Paid</span>
//                     <span className="text-xl font-bold text-green-600">
//                       ₹{Number(analytics?.total_paid_remittance_amount).toLocaleString()}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {analytics?.remittance_records?.length > 0 && (
//               <div className="overflow-x-auto mt-8 rounded-sm shadow-md border border-gray-200">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-[#0446DB] text-white">
//                     <tr>
//                       <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
//                         ID
//                       </th>
//                       <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
//                         Amount
//                       </th>
//                       <th className="px-6 py-3 whitespace-nowrap text-left text-sm font-semibold uppercase tracking-wider">
//                         REMITTANCE AMOUNT
//                       </th>
//                       <th className="px-6 py-3 whitespace-nowrap text-left text-sm font-semibold uppercase tracking-wider">
//                         FREIGHT DEDUCTION
//                       </th>
//                       <th className="px-6 py-3 whitespace-nowrap text-left text-sm font-semibold uppercase tracking-wider">
                        
//                        {String('convenience FEE').toLocaleUpperCase()}
//                       </th>
//                       <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
//                         AWB Number
//                       </th>
//                       <th className="px-6 py-3 whitespace-nowrap text-left text-sm font-semibold uppercase tracking-wider">
//                         UTR Number
//                       </th>
//                       <th className="px-6 whitespace-nowrap py-3 text-left text-sm font-semibold uppercase tracking-wider">
//                         Uplode Date
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-100">
//                     {analytics?.remittance_records.map((remittance) => (
//                       <tr key={remittance.id} className="hover:bg-gray-50">
//                         <td className="px-6 py-4 text-sm text-gray-800">
//                           {remittance.id}
//                         </td>
//                         <td className="px-6 py-4 text-sm text-gray-800">
//                           ₹{Number(remittance.amount).toLocaleString()}
//                         </td>
//                         <td className="px-6 py-4 text-sm text-gray-800">
//                           ₹{Number(remittance.remittance_amount).toLocaleString()}
//                         </td>
//                         <td className="px-6 py-4 text-sm text-gray-800">
//                           ₹{Number(remittance.freight_deductions).toLocaleString()}
//                         </td>
//                         <td className="px-6 py-4 text-sm text-gray-800">
//                           ₹{Number(remittance.convenience_fee).toLocaleString()}
//                         </td>
//                         <td className="px-6 py-4 text-sm text-gray-800">
//                           {remittance.awb_number.split(',').length === 1 ? (
//                             <>{remittance.awb_number}</>
//                           ) : (
//                             <>
//                               <button
//                                 onClick={() => openPopUp(remittance)}
//                                 className="hover:cursor-pointer"
//                               >
//                                 {`${remittance.awb_number.split(',')[0]}...`}
//                               </button>
//                             </>
//                           )}
//                         </td>
//                         <td className="px-6 py-4 text-sm text-gray-800">
//                           {remittance.utr_number}
//                         </td>
//                         <td className="px-6 py-4 text-sm text-gray-800">
//                           {new Date(remittance.created_at).toLocaleString(
//                             "en-IN",
//                             {
//                               timeZone: "Asia/Kolkata",
//                               day: "2-digit",
//                               month: "2-digit",
//                               year: "numeric",
//                             }
//                           )}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* 👇 Popup Modal */}
//       {popupData && (
//         <div className="fixed inset-0 bg-[rgba(46,46,46,0.5)] flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded-sm shadow-lg w-96 max-h-[70vh] overflow-y-auto">
//             <h2 className="text-lg font-semibold mb-4">AWB Numbers</h2>
//             <ul className="list-disc pl-5 space-y-1">
//               {popupData.awb_numbers.split(",").map((awb, idx) => (
//                 <li key={idx} className="text-gray-700">
//                   {awb}
//                 </li>
//               ))}
//             </ul>
//             <button
//               onClick={closePopUp}
//               className="mt-4 px-4 py-2 bg-[#0446DB] text-white rounded hover:bg-indigo-600"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }





import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../Loader";
import { toast } from "react-toastify";
import {
  BadgeIndianRupee,
  Banknote,
  CircleDollarSign,
  Copy,
  ExternalLink,
  FileText,
  Hash,
  IndianRupee,
  Landmark,
  Loader2,
  Package,
  ReceiptIndianRupee,
  Search,
  WalletCards,
  X,
} from "lucide-react";

const baseURL = import.meta.env.VITE_BASE_URL;

export default function MerchantCOD() {
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState({});
  const [popupData, setPopupData] = useState(null);
  const [search, setSearch] = useState("");

  /* =====================================================
     GET ANALYTICS
  ===================================================== */

  const getAnalytics = async () => {
    setLoading(true);

    try {
      const res = await axios.get(
        `${baseURL}/api/merchant/getMerchantRemittanceSummary`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setAnalytics(res.data);
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

  /* =====================================================
     MODAL
  ===================================================== */

  const openPopUp = (remittance) => {
    setPopupData(remittance);
  };

  const closePopUp = () => {
    setPopupData(null);
  };

  /* =====================================================
     HELPERS
  ===================================================== */

  const formatCurrency = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getAwbNumbers = (remittance) => {
    const value =
      remittance?.awb_number ||
      remittance?.awb_numbers ||
      "";

    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  };

  const copyText = async (value, label = "Copied") => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} copied`);
    } catch {
      toast.error("Unable to copy");
    }
  };

  /* =====================================================
     SEARCH
  ===================================================== */

  const filteredRecords =
    analytics?.remittance_records?.filter((item) => {
      if (!search.trim()) return true;

      const query = search.toLowerCase();

      return (
        String(item?.id || "")
          .toLowerCase()
          .includes(query) ||
        String(item?.awb_number || "")
          .toLowerCase()
          .includes(query) ||
        String(item?.awb_numbers || "")
          .toLowerCase()
          .includes(query) ||
        String(item?.utr_number || "")
          .toLowerCase()
          .includes(query)
      );
    }) || [];

  useEffect(() => {
    getAnalytics();
  }, []);

  /* =====================================================
     LOADING
  ===================================================== */
   

        const [loadingPage, setLoadingPage] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingPage(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);
 

  return (
    <>
    {
      loadingPage ?(
        <div className=" w-full h-[90vh] flex justify-center items-center">
          <div>
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <p className="mt-2"> Loading COD Remittance...</p>
          </div>
        </div>
      ):(
      <div className="min-h-screen bg-[#F7F8FA] dark:bg-neutral-950">
        {/* =================================================
            HEADER
        ================================================= */}

        <div className=" dark:border-neutral-800 dark:bg-neutral-900">
          <div className="">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                

                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    COD Remittance
                  </h1>

                  <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                    Track COD collections, settlements and remittance details
                  </p>
                </div>
              </div>

             
            </div>
          </div>
        </div>

        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <div className="">
          {/* =================================================
              SUMMARY CARDS
          ================================================= */}

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <SummaryCard
              title="Total COD"
              value={formatCurrency(analytics?.total_cod)}
              description="Total COD collected"
              icon={CircleDollarSign}
              type="blue"
            />

            <SummaryCard
              title="Remaining"
              value={formatCurrency(
                analytics?.remaining_cod_amount
              )}
              description="Pending for settlement"
              icon={ReceiptIndianRupee}
              type="orange"
            />

            <SummaryCard
              title="Paid"
              value={formatCurrency(
                analytics?.total_paid_remittance_amount
              )}
              description="Successfully remitted"
              icon={Landmark}
              type="green"
            />
          </div>

          {/* =================================================
              REMITTANCE TABLE CARD
          ================================================= */}

          <div className="overflow-hidden rounded-sm border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            {/* TABLE HEADER */}

            <div className="flex flex-col gap-4 border-b border-gray-100 px-5 py-5 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-[#0446DB]/10">
                  <FileText className="h-4 w-4 text-[#0446DB]" />
                </div>

                <div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                    Remittance History
                  </h2>

                  <p className="mt-0.5 text-xs text-gray-500 dark:text-neutral-400">
                    View all your COD settlement transactions
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                {/* SEARCH */}

                <div className="relative w-full sm:w-[280px]">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search AWB, UTR or ID..."
                    className="h-10 w-full rounded-sm border border-gray-200 bg-white pl-9 pr-3 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                  />
                </div>

                {/* COUNT */}

                <span className="w-fit whitespace-nowrap rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-300">
                  {filteredRecords.length} Records
                </span>
              </div>
            </div>

            {/* =================================================
                TABLE
            ================================================= */}

            <div className="overflow-x-auto">
              <table className="min-w-[1200px] w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/80 dark:border-neutral-800 dark:bg-neutral-950/50">
                    <TableHeading>ID</TableHeading>

                    <TableHeading>Amount</TableHeading>

                    <TableHeading>
                      Remittance Amount
                    </TableHeading>

                    <TableHeading>
                      Freight Deduction
                    </TableHeading>

                    <TableHeading>
                      Convenience Fee
                    </TableHeading>

                    <TableHeading>
                      AWB Number
                    </TableHeading>

                    <TableHeading>
                      UTR Number
                    </TableHeading>

                    <TableHeading>
                      Upload Date
                    </TableHeading>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
                  {filteredRecords.length > 0 ? (
                    filteredRecords.map((remittance) => {
                      const awbNumbers =
                        getAwbNumbers(remittance);

                      return (
                        <tr
                          key={remittance.id}
                          className="transition-colors duration-150 hover:bg-gray-50/80 dark:hover:bg-neutral-800/50"
                        >
                          {/* ID */}

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-sm bg-gray-100 dark:bg-neutral-800">
                                <Hash className="h-3.5 w-3.5 text-gray-500 dark:text-neutral-400" />
                              </div>

                              <span className="text-sm font-semibold text-gray-800 dark:text-neutral-200">
                                {remittance?.id || "-"}
                              </span>
                            </div>
                          </td>

                          {/* AMOUNT */}

                          <td className="px-5 py-4">
                            <p className="whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                              {formatCurrency(
                                remittance?.amount
                              )}
                            </p>
                          </td>

                          {/* REMITTANCE AMOUNT */}

                          <td className="px-5 py-4">
                            <span className="inline-flex whitespace-nowrap rounded-md bg-green-50 px-2.5 py-1.5 text-sm font-semibold text-green-700 dark:bg-green-500/10 dark:text-green-400">
                              {formatCurrency(
                                remittance?.remittance_amount
                              )}
                            </span>
                          </td>

                          {/* FREIGHT */}

                          <td className="px-5 py-4">
                            <p className="whitespace-nowrap text-sm font-medium text-gray-600 dark:text-neutral-300">
                              {formatCurrency(
                                remittance?.freight_deductions
                              )}
                            </p>
                          </td>

                          {/* CONVENIENCE */}

                          <td className="px-5 py-4">
                            <p className="whitespace-nowrap text-sm font-medium text-gray-600 dark:text-neutral-300">
                              {formatCurrency(
                                remittance?.convenience_fee
                              )}
                            </p>
                          </td>

                          {/* AWB */}

                          <td className="px-5 py-4">
                            {awbNumbers.length === 0 ? (
                              <span className="text-sm text-gray-400">
                                -
                              </span>
                            ) : awbNumbers.length === 1 ? (
                              <div className="flex items-center gap-1">
                                <span className="whitespace-nowrap rounded-md bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-300">
                                  {awbNumbers[0]}
                                </span>

                                <button
                                  type="button"
                                  title="Copy AWB"
                                  onClick={() =>
                                    copyText(
                                      awbNumbers[0],
                                      "AWB"
                                    )
                                  }
                                  className="rounded-md p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-[#0446DB] dark:hover:bg-neutral-800"
                                >
                                  <Copy className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() =>
                                  openPopUp(remittance)
                                }
                                className="group inline-flex items-center gap-2 rounded-sm border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-[#0446DB] transition hover:border-blue-200 hover:bg-blue-100 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300 dark:hover:bg-blue-500/20"
                              >
                                <Package className="h-3.5 w-3.5" />

                                {awbNumbers[0]}

                                <span className="rounded-full bg-white px-1.5 py-0.5 text-[10px] shadow-sm dark:bg-neutral-800">
                                  +{awbNumbers.length - 1}
                                </span>
                              </button>
                            )}
                          </td>

                          {/* UTR */}

                          <td className="px-5 py-4">
                            {remittance?.utr_number ? (
                              <div className="flex items-center gap-1">
                                <span className="max-w-[180px] truncate font-mono text-xs font-medium text-gray-700 dark:text-neutral-300">
                                  {remittance.utr_number}
                                </span>

                                <button
                                  type="button"
                                  onClick={() =>
                                    copyText(
                                      remittance.utr_number,
                                      "UTR"
                                    )
                                  }
                                  title="Copy UTR"
                                  className="rounded-md p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-[#0446DB] dark:hover:bg-neutral-800"
                                >
                                  <Copy className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-400">
                                -
                              </span>
                            )}
                          </td>

                          {/* DATE */}

                          <td className="px-5 py-4">
                            <span className="whitespace-nowrap text-sm text-gray-600 dark:text-neutral-300">
                              {formatDate(
                                remittance?.created_at
                              )}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-6 py-16 text-center"
                      >
                        <div className="flex flex-col items-center justify-center">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800">
                            <FileText className="h-5 w-5 text-gray-400" />
                          </div>

                          <p className="mt-3 text-sm font-semibold text-gray-700 dark:text-neutral-300">
                            No remittance records found
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            {search
                              ? "Try searching with another AWB, UTR or ID."
                              : "Your remittance transactions will appear here."}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* TABLE FOOTER */}

            {filteredRecords.length > 0 && (
              <div className="flex flex-col gap-2 border-t border-gray-100 bg-gray-50/60 px-5 py-4 dark:border-neutral-800 dark:bg-neutral-950/40 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-gray-500 dark:text-neutral-400">
                  Showing{" "}
                  <span className="font-semibold text-gray-700 dark:text-neutral-200">
                    {filteredRecords.length}
                  </span>{" "}
                  remittance records
                </p>

                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Banknote className="h-4 w-4" />
                  COD Settlement History
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      )
    }

      {/* =====================================================
          AWB POPUP
      ===================================================== */}

      {popupData && (
        <AWBModal
          data={popupData}
          closePopUp={closePopUp}
          getAwbNumbers={getAwbNumbers}
          copyText={copyText}
        />
      )}
    </>
  );
}

/* =========================================================
   SUMMARY CARD
========================================================= */

const SummaryCard = ({
  title,
  value,
  description,
  icon: Icon,
  type = "blue",
}) => {
  const styles = {
    blue: {
      icon: `
        bg-blue-50
        text-[#0446DB]
        dark:bg-blue-500/10
        dark:text-blue-300
      `,
      line: "bg-[#0446DB]",
    },

    orange: {
      icon: `
        bg-orange-50
        text-orange-600
        dark:bg-orange-500/10
        dark:text-orange-400
      `,
      line: "bg-orange-500",
    },

    green: {
      icon: `
        bg-green-50
        text-green-600
        dark:bg-green-500/10
        dark:text-green-400
      `,
      line: "bg-green-500",
    },
  };

  const current =
    styles[type] || styles.blue;

  return (
    <div className="group relative overflow-hidden rounded-sm border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900">
      <div
        className={`absolute left-0 top-0 h-full w-1 ${current.line}`}
      />

      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-neutral-400">
            {title}
          </p>

          <h3 className="mt-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-3xl">
            {value}
          </h3>

          <p className="mt-2 text-xs text-gray-400 dark:text-neutral-500">
            {description}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-sm ${current.icon}`}
        >
          <Icon
            className="h-5 w-5"
            strokeWidth={1.8}
          />
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   TABLE HEADING
========================================================= */

const TableHeading = ({ children }) => {
  return (
    <th className="whitespace-nowrap px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-neutral-400">
      {children}
    </th>
  );
};

/* =========================================================
   AWB MODAL
========================================================= */

const AWBModal = ({
  data,
  closePopUp,
  getAwbNumbers,
  copyText,
}) => {
  const awbNumbers =
    getAwbNumbers(data);

  return (
    <div
      onClick={closePopUp}
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
    >
      <div
        onClick={(e) =>
          e.stopPropagation()
        }
        className="w-full max-w-lg overflow-hidden rounded-sm border border-gray-200 bg-white shadow-2xl dark:border-neutral-700 dark:bg-neutral-900"
      >
        {/* HEADER */}

        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-[#0446DB]/10">
              <Package className="h-4 w-4 text-[#0446DB]" />
            </div>

            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                AWB Numbers
              </h2>

              <p className="mt-0.5 text-xs text-gray-500 dark:text-neutral-400">
                {awbNumbers.length} shipments in this remittance
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={closePopUp}
            className="flex h-8 w-8 items-center justify-center rounded-sm text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-neutral-800 dark:hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* CONTENT */}

        <div className="max-h-[55vh] overflow-y-auto p-5">
          <div className="space-y-2">
            {awbNumbers.map(
              (awb, index) => (
                <div
                  key={`${awb}-${index}`}
                  className="group flex items-center justify-between gap-3 rounded-sm border border-gray-200 bg-gray-50 px-3 py-3 transition hover:border-blue-200 hover:bg-blue-50/50 dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-blue-500/30"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white text-xs font-semibold text-gray-500 shadow-sm dark:bg-neutral-900 dark:text-neutral-400">
                      {index + 1}
                    </div>

                    <span className="truncate font-mono text-sm font-semibold text-gray-700 dark:text-neutral-200">
                      {awb}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      copyText(
                        awb,
                        "AWB"
                      )
                    }
                    title="Copy AWB"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm text-gray-400 transition hover:bg-white hover:text-[#0446DB] hover:shadow-sm dark:hover:bg-neutral-900"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>
              )
            )}
          </div>
        </div>

        {/* FOOTER */}

        <div className="flex items-center justify-between gap-3 border-t border-gray-100 bg-gray-50/70 px-5 py-4 dark:border-neutral-800 dark:bg-neutral-950/50">
          <button
            type="button"
            onClick={() =>
              copyText(
                awbNumbers.join(", "),
                "All AWB numbers"
              )
            }
            className="inline-flex h-9 items-center gap-2 rounded-sm border border-gray-200 bg-white px-3 text-xs font-semibold text-gray-600 transition hover:border-[#0446DB]/30 hover:text-[#0446DB] dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
          >
            <Copy className="h-3.5 w-3.5" />
            Copy All
          </button>

          <button
            type="button"
            onClick={closePopUp}
            className="h-9 rounded-sm bg-[#0446DB] px-5 text-xs font-semibold text-white transition hover:bg-[#033BB9]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
