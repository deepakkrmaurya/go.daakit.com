
// import "../../../styles/blink.css";
// import { useEffect, useMemo, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import Loader from "../../Loader";
// import {
//   FaSearch,
//   FaFilter,
//   FaDownload,
//   FaTimes,
//   FaCopy,
//   FaMoneyBillWave,
//   FaCreditCard,
//   FaExchangeAlt,
//   FaWallet,
//   FaHistory,
//   FaReceipt,
// } from "react-icons/fa";

// import { Button } from "@/components/ui/button";

// import {
//   Drawer,
//   DrawerClose,
//   DrawerContent,
//   DrawerFooter,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerTrigger,
// } from "@/components/ui/drawer";
// import { FaArrowTrendDown, FaArrowTrendUp } from "react-icons/fa6";

// const baseURL = import.meta.env.VITE_BASE_URL;

// function TechbasedTransaction() {
//   const [loading, setLoading] = useState(true);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [transactions, setTransactions] = useState([]);
//   const [page, setPage] = useState(1);
//   const [totalTransactions, setTotalTransactions] = useState(0);
//   const [totalPages, setTotalPages] = useState(1);
//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [filterUpdate, setFilterUpdate] = useState(false);

//   const [advanceFilters, setAdvanceFilters] = useState({
//     startDate: "",
//     endDate: "",
//     txn_ref: "",
//     txn_for: "",
//     type: "",
//   });

//   const transactionTypes = [
//     { value: "", label: "All Types" },
//     { value: "credit", label: "Credit" },
//     { value: "debit", label: "Debit" },
//   ];

//   const fetchTransactions = async () => {
//     setLoading(true);

//     try {
//       const res = await axios.get(
//         `${baseURL}/api/tech-merchant/getWalletHistory`,
//         {
//           params: {
//             start_date: advanceFilters.startDate,
//             end_date: advanceFilters.endDate,
//             txn_ref: advanceFilters.txn_ref,
//             txn_for: advanceFilters.txn_for,
//             type: advanceFilters.type,
//             page,
//             limit: 10,
//           },
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );

//       setTransactions(res?.data?.data || []);
//       setTotalTransactions(res?.data?.total || 0);
//       setTotalPages(Math.max(1, res?.data?.totalPages || 1));
//     } catch (err) {
//       toast.error(
//         err?.response?.data?.message ||
//           err?.message ||
//           "An error occurred while fetching transactions."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetAdvanceFilters = () => {
//     const today = new Date();
//     const oneMonthAgo = new Date();

//     oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

//     setAdvanceFilters({
//       endDate: today.toISOString().split("T")[0],
//       startDate: oneMonthAgo.toISOString().split("T")[0],
//       txn_ref: "",
//       txn_for: "",
//       type: "",
//     });
//   };

//   useEffect(() => {
//     resetAdvanceFilters();
//   }, []);

//   useEffect(() => {
//     fetchTransactions();
//   }, [page, filterUpdate]);

//   const toCapitalizeEachWord = (str) => {
//     if (!str) return "";

//     return str
//       .split(" ")
//       .map((word) => {
//         if (!word) return "";
//         return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
//       })
//       .join(" ");
//   };

//   const getTransactionIcon = (type) => {
//     if (type === "credit") {
//       return <FaMoneyBillWave className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />;
//     }

//     if (type === "debit") {
//       return <FaCreditCard className="h-4 w-4 text-rose-600 dark:text-rose-400" />;
//     }

//     return <FaExchangeAlt className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
//   };

//   const getAmountColor = (type) =>
//     type === "credit"
//       ? "text-emerald-600 dark:text-emerald-400"
//       : "text-rose-600 dark:text-rose-400";

//   const getAmountSymbol = (type) => (type === "credit" ? "+" : "-");

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat("en-IN", {
//       style: "currency",
//       currency: "INR",
//       minimumFractionDigits: 2,
//     }).format(Number(amount || 0));
//   };

//   const handleSearch = () => {
//     setAdvanceFilters((prev) => ({
//       ...prev,
//       txn_ref: searchTerm.trim(),
//     }));

//     setPage(1);
//     setFilterUpdate((prev) => !prev);
//   };

//   const clearSearch = () => {
//     setSearchTerm("");

//     setAdvanceFilters((prev) => ({
//       ...prev,
//       txn_ref: "",
//     }));

//     setPage(1);
//     setFilterUpdate((prev) => !prev);
//   };

//   const exportCSV = async () => {
//     setLoading(true);

//     try {
//       const res = await axios.get(
//         `${baseURL}/api/tech-merchant/exportWalletHistory`,
//         {
//           params: {
//             start_date: advanceFilters.startDate,
//             end_date: advanceFilters.endDate,
//             txn_ref: advanceFilters.txn_ref,
//             txn_for: advanceFilters.txn_for,
//             type: advanceFilters.type,
//           },
//           responseType: "blob",
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );

//       const url = window.URL.createObjectURL(new Blob([res.data]));
//       const link = document.createElement("a");

//       link.href = url;
//       link.setAttribute(
//         "download",
//         `transactions_${new Date().toISOString().split("T")[0]}.csv`
//       );

//       document.body.appendChild(link);
//       link.click();
//       link.remove();

//       window.URL.revokeObjectURL(url);

//       toast.success("Transactions exported successfully");
//     } catch (err) {
//       toast.error(
//         err?.response?.data?.message ||
//           err?.message ||
//           "Failed to export transactions"
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const copyReference = async (value) => {
//     if (!value) return;

//     try {
//       await navigator.clipboard.writeText(value);
//       toast.success("Reference copied!");
//     } catch {
//       toast.error("Could not copy reference");
//     }
//   };

//   const stats = useMemo(() => {
//     const totalCredit = transactions.reduce((sum, txn) => {
//       if (txn?.type === "credit") {
//         return sum + Number(txn?.amount || 0);
//       }
//       return sum;
//     }, 0);

//     const totalDebit = transactions.reduce((sum, txn) => {
//       if (txn?.type === "debit") {
//         return sum + Number(txn?.amount || 0);
//       }
//       return sum;
//     }, 0);

//     const lastBalance =
//       transactions?.length > 0
//         ? Number(transactions[0]?.balance_after || 0)
//         : 0;

//     return {
//       totalCredit,
//       totalDebit,
//       lastBalance,
//     };
//   }, [transactions]);

//   const activeFilterCount = useMemo(() => {
//     return [
//       advanceFilters.startDate,
//       advanceFilters.endDate,
//       advanceFilters.txn_ref,
//       advanceFilters.txn_for,
//       advanceFilters.type,
//     ].filter(Boolean).length;
//   }, [advanceFilters]);

//   if (loading && transactions.length === 0) {
//     return <Loader />;
//   }

//   return (
//     <div className="min-h-screen bg-[#F5F7FA] dark:bg-neutral-950">
//       {/* =====================================================
//           HERO
//       ====================================================== */}
//       <section className="relative overflow-hidden border-b  px-3 py-2 border-blue-500/20 bg-[#0446DB] dark:bg-neutral-900">
       
//         <div className="relative mx-auto ">
//           <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
//             <div>
              
//               <h1 className=" text-2xl font-bold tracking-tight text-white sm:text-3xl">
//                 Transaction History
//               </h1>

//               <p className="mt-1 max-w-xl text-sm leading-6 text-blue-100/90">
//                 Track credits, debits, references and wallet balance changes.
//               </p>
//             </div>

//             <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
//               <form onSubmit={(e) => {
//                 e.preventDefault();
//                 handleSearch();
//               }}>
//                 <div className="relative min-w-0 sm:w-[320px]">
//                   <FaSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

//                   <input
//                     type="text"
//                     placeholder="Search reference number..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="w-full rounded-sm border border-white/15 bg-white px-11 py-2 pr-20 text-sm font-medium text-gray-800 outline-none transition focus:ring-4 focus:ring-white/20 dark:bg-neutral-900 dark:text-neutral-100"
//                   />

//                   <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
//                     {searchTerm && (
//                       <button
//                         type="button"
//                         onClick={clearSearch}
//                         className="flex h-8 w-8 items-center justify-center rounded-sm text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
//                       >
//                         <FaTimes className="h-3.5 w-3.5" />
//                       </button>
//                     )}

//                     <Button
//                       type="submit"
//                       className="flex h-8 w-8 items-center justify-center rounded-sm bg-[#0446DB] text-white transition hover:bg-blue-700"
//                     >
//                       <FaSearch className="h-3.5 w-3.5" />
//                     </Button>
//                   </div>
//                 </div>
//               </form>

//               <Button
//                 type="button"
//                 onClick={exportCSV}
//                 className="inline-flex items-center justify-center gap-2 rounded-sm border border-white/15 bg-white px-4 py-3 text-sm font-semibold text-[#0446DB] shadow-sm transition hover:bg-blue-50 dark:bg-neutral-900 dark:text-blue-400 dark:hover:bg-neutral-800"
//               >
//                 <FaDownload className="h-4 w-4" />
//                 Export
//               </Button>

//               <Drawer
//                 direction="right"
//                 open={isFilterOpen}
//                 onOpenChange={setIsFilterOpen}
//               >
//                 <DrawerTrigger
//                   render={
//                     <Button
//                       variant="outline"
//                       className="relative gap-2 rounded-sm border-white/15 bg-white px-4 py-3 text-sm font-semibold text-[#0446DB] shadow-sm hover:bg-blue-50 hover:text-[#0446DB] dark:border-neutral-700 dark:bg-neutral-900 dark:text-blue-400 dark:hover:bg-neutral-800"
//                     />
//                   }
//                 >
//                     <Button
//                     className="relative gap-2 rounded-sm border-white/15 bg-white px-4 py-3 text-sm font-semibold text-[#0446DB] shadow-sm hover:bg-blue-50 hover:text-[#0446DB] dark:border-neutral-700 dark:bg-neutral-900 dark:text-blue-400 dark:hover:bg-neutral-800"

//                     >

//                   <FaFilter className="h-4 w-4" />
//                   Filters
//                     </Button>

                 
//                 </DrawerTrigger>

//                 <DrawerContent className="ml-auto h-full w-full max-w-md rounded-none border-l border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
//                   <DrawerHeader className="border-b border-gray-100 px-5 py-5 dark:border-neutral-800">
//                     <div className="flex items-start justify-between gap-4">
//                       <div>
//                         <DrawerTitle className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
//                           <FaFilter className="h-4 w-4 text-[#0446DB] dark:text-blue-400" />
//                           Advanced Filters
//                         </DrawerTitle>

//                         <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
//                           Refine wallet history results.
//                         </p>
//                       </div>

//                       <DrawerClose
//                         render={
//                           <button
//                             type="button"
//                             className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-neutral-800 dark:hover:text-white"
//                           />
//                         }
//                       >
//                         <FaTimes className="h-4 w-4" />
//                       </DrawerClose>
//                     </div>
//                   </DrawerHeader>

//                   <div className="flex-1 space-y-5 overflow-y-auto p-5">
//                     <div>
//                       <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
                        
//                         Start Date
//                       </label>

//                       <input
//                         type="date"
//                         value={advanceFilters.startDate}
//                         onChange={(e) =>
//                           setAdvanceFilters((prev) => ({
//                             ...prev,
//                             startDate: e.target.value,
//                           }))
//                         }
//                         onClick={(e) => e.currentTarget.showPicker?.()}
//                         className="w-full rounded-sm border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#0446DB] focus:ring-4 focus:ring-blue-500/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:[color-scheme:dark]"
//                       />
//                     </div>

//                     <div>
//                       <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
                       
//                         End Date
//                       </label>

//                       <input
//                         type="date"
//                         value={advanceFilters.endDate}
//                         onChange={(e) =>
//                           setAdvanceFilters((prev) => ({
//                             ...prev,
//                             endDate: e.target.value,
//                           }))
//                         }
//                         onClick={(e) => e.currentTarget.showPicker?.()}
//                         className="w-full rounded-sm border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#0446DB] focus:ring-4 focus:ring-blue-500/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:[color-scheme:dark]"
//                       />
//                     </div>

//                     <div>
//                       <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
                      
//                         Reference Number
//                       </label>

//                       <input
//                         type="text"
//                         value={advanceFilters.txn_ref}
//                         onChange={(e) =>
//                           setAdvanceFilters((prev) => ({
//                             ...prev,
//                             txn_ref: e.target.value,
//                           }))
//                         }
//                         placeholder="Enter reference number"
//                         className="w-full rounded-sm border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#0446DB] focus:ring-4 focus:ring-blue-500/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500"
//                       />
//                     </div>

//                     <div>
//                       <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
                       
//                         Transaction For
//                       </label>

//                       <input
//                         type="text"
//                         value={advanceFilters.txn_for}
//                         onChange={(e) =>
//                           setAdvanceFilters((prev) => ({
//                             ...prev,
//                             txn_for: e.target.value,
//                           }))
//                         }
//                         placeholder="Enter transaction purpose"
//                         className="w-full rounded-sm border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#0446DB] focus:ring-4 focus:ring-blue-500/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500"
//                       />
//                     </div>

//                     <div>
//                       <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
//                         Transaction Type
//                       </label>

//                       <select
//                         value={advanceFilters.type}
//                         onChange={(e) =>
//                           setAdvanceFilters((prev) => ({
//                             ...prev,
//                             type: e.target.value,
//                           }))
//                         }
//                         className="w-full rounded-sm border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#0446DB] focus:ring-4 focus:ring-blue-500/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
//                       >
//                         {transactionTypes.map((type) => (
//                           <option key={type.value} value={type.value}>
//                             {type.label}
//                           </option>
//                         ))}
//                       </select>
//                     </div>
//                   </div>

//                   <DrawerFooter className="border-t border-gray-100 bg-gray-50 dark:border-neutral-800 dark:bg-neutral-950">
//                     <div className="grid grid-cols-2 gap-3">
//                       <button
//                         type="button"
//                         onClick={() => {
//                           resetAdvanceFilters();
//                           setSearchTerm("");
//                           setPage(1);
//                           setFilterUpdate((prev) => !prev);
//                         }}
//                         className="rounded-sm border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
//                       >
//                         Reset
//                       </button>

//                       <button
//                         type="button"
//                         onClick={() => {
//                           setSearchTerm(advanceFilters.txn_ref || "");
//                           setPage(1);
//                           setFilterUpdate((prev) => !prev);
//                           setIsFilterOpen(false);
//                         }}
//                         className="rounded-sm bg-[#0446DB] px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
//                       >
//                         Apply Filters
//                       </button>
//                     </div>
//                   </DrawerFooter>
//                 </DrawerContent>
//               </Drawer>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* =====================================================
//           MAIN
//       ====================================================== */}
//       <main className="mx-auto px-3 py-4 ">
//         {/* Stats */}
//         <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
//           <StatCard
//             label="Current Balance"
//             value={formatCurrency(stats.lastBalance)}
//             icon={<FaWallet />}
//             tone="blue"
//           />

//           <StatCard
//             label="Credits on Page"
//             value={formatCurrency(stats.totalCredit)}
//             icon={<FaArrowTrendUp />}
//             tone="green"
//           />

//           <StatCard
//             label="Debits on Page"
//             value={formatCurrency(stats.totalDebit)}
//             icon={<FaArrowTrendDown />}
//             tone="red"
//           />

//           <StatCard
//             label="Total Transactions"
//             value={totalTransactions.toLocaleString("en-IN")}
//             icon={<FaHistory />}
//             tone="violet"
//           />
//         </div>

//         {/* Table */}
//         <div className="mt-4 overflow-hidden rounded-sm border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
//           <div className="flex flex-col gap-2 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800">
//             <div>
//               <h2 className="text-base font-bold text-gray-900 dark:text-white">
//                 Wallet Transactions
//               </h2>

//               <p className="mt-0.5 text-xs text-gray-500 dark:text-neutral-500">
//                 Showing {transactions.length} records on this page
//               </p>
//             </div>

//             {loading && (
//               <span className="inline-flex items-center gap-2 text-xs font-medium text-[#0446DB] dark:text-blue-400">
//                 <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-blue-200 border-t-[#0446DB]" />
//                 Updating...
//               </span>
//             )}
//           </div>

//           {/* Mobile */}
//           <div className="lg:hidden">
//             {transactions.length > 0 ? (
//               <div className="divide-y divide-gray-100 dark:divide-neutral-800">
//                 {transactions.map((transaction, index) => (
//                   <div
//                     key={transaction?.id ?? index}
//                     className="p-4 transition hover:bg-gray-50 dark:hover:bg-neutral-800/50"
//                   >
//                     <div className="flex items-start justify-between gap-3">
//                       <div className="flex min-w-0 items-center gap-3">
//                         <div
//                           className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-sm ${
//                             transaction?.type === "credit"
//                               ? "bg-emerald-50 dark:bg-emerald-500/10"
//                               : "bg-rose-50 dark:bg-rose-500/10"
//                           }`}
//                         >
//                           {getTransactionIcon(transaction?.type)}
//                         </div>

//                         <div className="min-w-0">
//                           <p className="truncate font-semibold text-gray-900 dark:text-neutral-100">
//                             {toCapitalizeEachWord(
//                               transaction?.txn_for || "Transaction"
//                             )}
//                           </p>

//                           <p className="mt-0.5 text-xs text-gray-500 dark:text-neutral-500">
//                             {new Date(transaction?.created_at).toLocaleDateString(
//                               "en-IN",
//                               {
//                                 day: "2-digit",
//                                 month: "short",
//                                 year: "numeric",
//                               }
//                             )}
//                           </p>
//                         </div>
//                       </div>

//                       <div className="text-right">
//                         <p
//                           className={`font-bold ${getAmountColor(
//                             transaction?.type
//                           )}`}
//                         >
//                           {getAmountSymbol(transaction?.type)}
//                           {formatCurrency(transaction?.amount)}
//                         </p>

//                         <span
//                           className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
//                             transaction?.type === "credit"
//                               ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
//                               : "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
//                           }`}
//                         >
//                           {transaction?.type || "N/A"}
//                         </span>
//                       </div>
//                     </div>

//                     <div className="mt-4 grid grid-cols-2 gap-3 rounded-sm bg-gray-50 p-3 text-sm dark:bg-neutral-950">
//                       <div>
//                         <p className="text-[11px] uppercase tracking-wide text-gray-400 dark:text-neutral-500">
//                           Reference
//                         </p>

//                         <div className="mt-1 flex items-center gap-1">
//                           <p className="max-w-[130px] truncate font-mono text-xs font-semibold text-gray-700 dark:text-neutral-300">
//                             {transaction?.txn_ref || "N/A"}
//                           </p>

//                           {transaction?.txn_ref && (
//                             <button
//                               type="button"
//                               onClick={() => copyReference(transaction.txn_ref)}
//                               className="text-gray-400 transition hover:text-[#0446DB] dark:hover:text-blue-400"
//                             >
//                               <FaCopy className="h-3 w-3" />
//                             </button>
//                           )}
//                         </div>
//                       </div>

//                       <div className="text-right">
//                         <p className="text-[11px] uppercase tracking-wide text-gray-400 dark:text-neutral-500">
//                           Closing Balance
//                         </p>

//                         <p className="mt-1 text-xs font-semibold text-gray-800 dark:text-neutral-200">
//                           {formatCurrency(transaction?.balance_after)}
//                         </p>
//                       </div>
//                     </div>

//                     {transaction?.remarks && (
//                       <div className="mt-3">
//                         <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-neutral-500">
//                           Remarks
//                         </p>

//                         <p className="mt-1 text-sm text-gray-600 dark:text-neutral-400">
//                           {transaction.remarks}
//                         </p>
//                       </div>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <EmptyState />
//             )}
//           </div>

//           {/* Desktop */}
//           <div className="hidden overflow-x-auto lg:block">
//             <table className="w-full min-w-[1050px]">
//               <thead className="bg-gray-50 dark:bg-neutral-950">
//                 <tr>
//                   {[
//                     "Transaction",
//                     "Reference No",
//                     "Type",
//                     "Amount",
//                     "Closing Balance",
//                     "Remarks",
//                     "Date & Time",
//                   ].map((heading) => (
//                     <th
//                       key={heading}
//                       className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-[0.08em] text-gray-500 dark:text-neutral-500"
//                     >
//                       {heading}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
//                 {transactions.length > 0 ? (
//                   transactions.map((transaction, index) => (
//                     <tr
//                       key={transaction?.id ?? index}
//                       className="transition-colors hover:bg-gray-50/80 dark:hover:bg-neutral-800/50"
//                     >
//                       <td className="px-5 py-4">
//                         <div className="flex items-center gap-3">
//                           <div
//                             className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-sm ${
//                               transaction?.type === "credit"
//                                 ? "bg-emerald-50 dark:bg-emerald-500/10"
//                                 : "bg-rose-50 dark:bg-rose-500/10"
//                             }`}
//                           >
//                             {getTransactionIcon(transaction?.type)}
//                           </div>

//                           <p className="font-semibold text-gray-900 dark:text-neutral-100">
//                             {toCapitalizeEachWord(
//                               transaction?.txn_for || "Transaction"
//                             )}
//                           </p>
//                         </div>
//                       </td>

//                       <td className="px-5 py-4">
//                         <div className="flex items-center gap-2">
//                           <span className="max-w-[180px] truncate font-mono text-xs font-semibold text-gray-600 dark:text-neutral-400">
//                             {transaction?.txn_ref || "N/A"}
//                           </span>

//                           {transaction?.txn_ref && (
//                             <button
//                               type="button"
//                               onClick={() => copyReference(transaction.txn_ref)}
//                               className="text-gray-400 transition hover:text-[#0446DB] dark:hover:text-blue-400"
//                             >
//                               <FaCopy className="h-3 w-3" />
//                             </button>
//                           )}
//                         </div>
//                       </td>

//                       <td className="px-5 py-4">
//                         <span
//                           className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${
//                             transaction?.type === "credit"
//                               ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
//                               : "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
//                           }`}
//                         >
//                           {transaction?.type || "N/A"}
//                         </span>
//                       </td>

//                       <td className="px-5 py-4">
//                         <span
//                           className={`font-bold ${getAmountColor(
//                             transaction?.type
//                           )}`}
//                         >
//                           {getAmountSymbol(transaction?.type)}
//                           {formatCurrency(transaction?.amount)}
//                         </span>
//                       </td>

//                       <td className="px-5 py-4 font-semibold text-gray-900 dark:text-neutral-100">
//                         {formatCurrency(transaction?.balance_after)}
//                       </td>

//                       <td className="px-5 py-4">
//                         <p
//                           className="max-w-[220px] truncate text-sm text-gray-600 dark:text-neutral-400"
//                           title={transaction?.remarks || "No remarks"}
//                         >
//                           {transaction?.remarks || "No remarks"}
//                         </p>
//                       </td>

//                       <td className="px-5 py-4">
//                         <div className="text-xs text-gray-500 dark:text-neutral-500">
//                           <div className="font-medium">
//                             {new Date(transaction?.created_at).toLocaleDateString(
//                               "en-IN"
//                             )}
//                           </div>

//                           <div className="mt-0.5">
//                             {new Date(transaction?.created_at).toLocaleTimeString(
//                               "en-IN",
//                               {
//                                 hour: "2-digit",
//                                 minute: "2-digit",
//                               }
//                             )}
//                           </div>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan={7}>
//                       <EmptyState />
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           {transactions.length > 0 && (
//             <div className="flex flex-col gap-3 border-t border-gray-100 bg-gray-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800 dark:bg-neutral-950">
//               <p className="text-center text-xs font-medium text-gray-500 sm:text-left dark:text-neutral-500">
//                 Page {page} of {totalPages} • {totalTransactions} total
//                 transactions
//               </p>

//               <div className="flex items-center justify-center gap-2">
//                 <button
//                   type="button"
//                   onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
//                   disabled={page === 1}
//                   className="rounded-sm border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
//                 >
//                   Previous
//                 </button>

//                 <span className="rounded-sm border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
//                   {page} / {totalPages}
//                 </span>

//                 <button
//                   type="button"
//                   onClick={() =>
//                     setPage((prev) => Math.min(prev + 1, totalPages))
//                   }
//                   disabled={page === totalPages}
//                   className="rounded-sm bg-[#0446DB] px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
//                 >
//                   Next
//                 </button>
//               </div>
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }

// function StatCard({ label, value, icon, tone = "blue" }) {
//   const tones = {
//     blue: {
//       iconBox: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
//     },
//     green: {
//       iconBox:
//         "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
//     },
//     red: {
//       iconBox:
//         "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
//     },
//     violet: {
//       iconBox:
//         "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
//     },
//   };

//   const selected = tones[tone] || tones.blue;

//   return (
//     <div className="rounded-sm border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900">
//       <div className="flex items-start justify-between gap-4">
//         <div className="min-w-0">
//           <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-400 dark:text-neutral-500">
//             {label}
//           </p>

//           <p className="mt-2 truncate text-xl font-bold tracking-tight text-gray-900 dark:text-white">
//             {value}
//           </p>
//         </div>

//         <div
//           className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-sm ${selected.iconBox}`}
//         >
//           {icon}
//         </div>
//       </div>
//     </div>
//   );
// }

// function EmptyState() {
//   return (
//     <div className="px-6 py-14 text-center">
//       <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-300 dark:bg-neutral-800 dark:text-neutral-600">
//         <FaReceipt className="h-6 w-6" />
//       </div>

//       <p className="mt-4 font-semibold text-gray-700 dark:text-neutral-300">
//         No transactions found
//       </p>

//       <p className="mt-1 text-sm text-gray-400 dark:text-neutral-500">
//         Try changing your filters or search term.
//       </p>
//     </div>
//   );
// }

// export default TechbasedTransaction;


import "../../../styles/blink.css";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import Loader from "../../Loader";

import {
  FaSearch,
  FaFilter,
  FaDownload,
  FaTimes,
  FaCopy,
  FaMoneyBillWave,
  FaCreditCard,
  FaExchangeAlt,
  FaWallet,
  FaHistory,
  FaReceipt,
  FaCalendarAlt,
  FaHashtag,
  FaLayerGroup,
} from "react-icons/fa";

import {
  FaArrowTrendDown,
  FaArrowTrendUp,
} from "react-icons/fa6";

import { Button } from "@/components/ui/button";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Loader2 } from "lucide-react";

const baseURL = import.meta.env.VITE_BASE_URL;

function TechbasedTransaction() {
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filterUpdate, setFilterUpdate] = useState(false);

  const [advanceFilters, setAdvanceFilters] = useState({
    startDate: "",
    endDate: "",
    txn_ref: "",
    txn_for: "",
    type: "",
  });

  const transactionTypes = [
    { value: "", label: "All Types" },
    { value: "credit", label: "Credit" },
    { value: "debit", label: "Debit" },
  ];

  const fetchTransactions = async () => {
    setLoading(true);

    try {
      const res = await axios.get(
        `${baseURL}/api/tech-merchant/getWalletHistory`,
        {
          params: {
            start_date: advanceFilters.startDate,
            end_date: advanceFilters.endDate,
            txn_ref: advanceFilters.txn_ref,
            txn_for: advanceFilters.txn_for,
            type: advanceFilters.type,
            page,
            limit: 10,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setTransactions(res?.data?.data || []);
      setTotalTransactions(res?.data?.total || 0);
      setTotalPages(Math.max(1, res?.data?.totalPages || 1));
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "An error occurred while fetching transactions."
      );
    } finally {
      setLoading(false);
    }
  };

  const resetAdvanceFilters = () => {
    const today = new Date();
    const oneMonthAgo = new Date();

    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    setAdvanceFilters({
      endDate: today.toISOString().split("T")[0],
      startDate: oneMonthAgo.toISOString().split("T")[0],
      txn_ref: "",
      txn_for: "",
      type: "",
    });
  };

  useEffect(() => {
    resetAdvanceFilters();
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [page, filterUpdate]);

  const toCapitalizeEachWord = (str) => {
    if (!str) return "";

    return str
      .split(" ")
      .map((word) => {
        if (!word) return "";
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(" ");
  };

  const getTransactionIcon = (type) => {
    if (type === "credit") {
      return <FaMoneyBillWave className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />;
    }

    if (type === "debit") {
      return <FaCreditCard className="h-4 w-4 text-rose-600 dark:text-rose-400" />;
    }

    return <FaExchangeAlt className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
  };

  const getAmountColor = (type) =>
    type === "credit"
      ? "text-emerald-600 dark:text-emerald-400"
      : "text-rose-600 dark:text-rose-400";

  const getAmountSymbol = (type) => (type === "credit" ? "+" : "-");

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(Number(amount || 0));
  };

  const handleSearch = () => {
    setAdvanceFilters((prev) => ({
      ...prev,
      txn_ref: searchTerm.trim(),
    }));

    setPage(1);
    setFilterUpdate((prev) => !prev);
  };

  const clearSearch = () => {
    setSearchTerm("");

    setAdvanceFilters((prev) => ({
      ...prev,
      txn_ref: "",
    }));

    setPage(1);
    setFilterUpdate((prev) => !prev);
  };

  // Apply drawer filters from button OR by pressing Enter.
  // It also closes the drawer automatically.
  const handleApplyFilters = () => {
    setSearchTerm(advanceFilters.txn_ref || "");
    setPage(1);
    setFilterUpdate((prev) => !prev);
    setIsFilterOpen(false);
  };

  const handleResetFilters = () => {
    const today = new Date();
    const oneMonthAgo = new Date();

    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    setAdvanceFilters({
      endDate: today.toISOString().split("T")[0],
      startDate: oneMonthAgo.toISOString().split("T")[0],
      txn_ref: "",
      txn_for: "",
      type: "",
    });

    setSearchTerm("");
    setPage(1);
    setFilterUpdate((prev) => !prev);
    setIsFilterOpen(false);
  };

  const exportCSV = async () => {
    setLoading(true);

    try {
      const res = await axios.get(
        `${baseURL}/api/tech-merchant/exportWalletHistory`,
        {
          params: {
            start_date: advanceFilters.startDate,
            end_date: advanceFilters.endDate,
            txn_ref: advanceFilters.txn_ref,
            txn_for: advanceFilters.txn_for,
            type: advanceFilters.type,
          },
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute(
        "download",
        `transactions_${new Date().toISOString().split("T")[0]}.csv`
      );

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);

      toast.success("Transactions exported successfully");
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to export transactions"
      );
    } finally {
      setLoading(false);
    }
  };

  const copyReference = async (value) => {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
      toast.success("Reference copied!");
    } catch {
      toast.error("Could not copy reference");
    }
  };

  const stats = useMemo(() => {
    const totalCredit = transactions.reduce((sum, txn) => {
      if (txn?.type === "credit") {
        return sum + Number(txn?.amount || 0);
      }
      return sum;
    }, 0);

    const totalDebit = transactions.reduce((sum, txn) => {
      if (txn?.type === "debit") {
        return sum + Number(txn?.amount || 0);
      }
      return sum;
    }, 0);

    const lastBalance =
      transactions?.length > 0
        ? Number(transactions[0]?.balance_after || 0)
        : 0;

    return {
      totalCredit,
      totalDebit,
      lastBalance,
    };
  }, [transactions]);

  const activeFilterCount = useMemo(() => {
    return [
      advanceFilters.startDate,
      advanceFilters.endDate,
      advanceFilters.txn_ref,
      advanceFilters.txn_for,
      advanceFilters.type,
    ].filter(Boolean).length;
  }, [advanceFilters]);


      const [loadingPage, setLoadingPage] = useState(true);

useEffect(() => {
  const timer = setTimeout(() => {
    setLoadingPage(false);
  }, 2000);

  return () => clearTimeout(timer);
}, []);

  // if (loading && transactions.length === 0) {
  //   return <Loader />;
  // }




  return (
    <>
    {
      loadingPage ? (
         <div className=" w-full h-[90vh] flex justify-center items-center">
          <div>
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <p className="mt-2"> Loading Transaction Historys...</p>
          </div>
        </div>
      ):(

    <div className="min-h-screen bg-[#F5F7FA] dark:bg-neutral-950">
      {/* =====================================================
          HERO
      ====================================================== */}
      <section className="relative overflow-hidden  px-4 dark:bg-[#0B1220]">
        <div className="relative mx-auto ">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              

              <h1 className=" text-2xl font-bold tracking-tight dark:text-white sm:text-3xl">
                Transaction History
              </h1>

              <p className=" max-w-xl text-sm leading-6 dark:text-blue-100/90">
                Track credits, debits, references and wallet balance changes.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <form onSubmit={(e) => {
                e.preventDefault();
                handleSearch();
              }}>
                <div className="relative min-w-0 sm:w-[320px]">
                  <FaSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

                  <input
                    type="text"
                    placeholder="Search reference number..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-sm border border-gray-200 bg-white px-11 py-3 pr-20 text-sm font-medium text-gray-800 outline-none transition focus:ring-4 focus:ring-white/20 dark:bg-neutral-900 dark:text-neutral-100"
                  />

                  <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
                    {searchTerm && (
                      <Button
                        type="button"
                        onClick={clearSearch}
                        className="flex h-8 w-8 items-center justify-center rounded-sm text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
                      >
                        <FaTimes className="h-3.5 w-3.5" />
                      </Button>
                    )}

                    <Button
                      type="submit"
                      className="flex h-8 w-8 items-center justify-center rounded-sm bg-[#0446DB] text-white transition hover:bg-blue-700"
                    >
                      <FaSearch className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </form>

              <Button
                type="button"
                onClick={exportCSV}
                className="inline-flex items-center justify-center gap-2 rounded-sm border border-white/15 bg-white px-4 py-3 text-sm font-semibold text-[#0446DB] shadow-sm transition hover:bg-blue-50 dark:bg-neutral-900 dark:text-blue-400 dark:hover:bg-neutral-800"
              >
                <FaDownload className="h-4 w-4" />
                Export
              </Button>

              <Drawer
                direction="right"
                open={isFilterOpen}
                onOpenChange={setIsFilterOpen}
              >
                <DrawerTrigger
                  render={
                    <Button
                      variant="outline"
                      className="relative gap-2 rounded-sm border-white/15 bg-white px-4 py-3 text-sm font-semibold text-[#0446DB] shadow-sm hover:bg-blue-50 hover:text-[#0446DB] dark:border-neutral-700 dark:bg-neutral-900 dark:text-blue-400 dark:hover:bg-neutral-800"
                    />
                  }
                >
                    <Button
                type="button"
               
                className="inline-flex items-center justify-center gap-2 rounded-sm border border-white/15 bg-white px-4 py-3 text-sm font-semibold text-[#0446DB] shadow-sm transition hover:bg-blue-50 dark:bg-neutral-900 dark:text-blue-400 dark:hover:bg-neutral-800"
              >

                  <FaFilter className="h-4 w-4" />
                  Filters
              </Button>
                </DrawerTrigger>

                <DrawerContent className="ml-auto h-full w-full max-w-md rounded-none border-l border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
                  <DrawerHeader className="border-b border-gray-100 px-5 py-5 dark:border-neutral-800">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <DrawerTitle className="flex items-center gap-2 text-xl font-bold text-gray-900 dark:text-white">
                          <FaFilter className="h-4 w-4 text-[#0446DB] dark:text-blue-400" />
                          Advanced Filters
                        </DrawerTitle>

                        <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                          Refine wallet history results.
                        </p>
                      </div>

                      <DrawerClose
                        render={
                          <button
                            type="button"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-neutral-800 dark:hover:text-white"
                          />
                        }
                      >
                        <FaTimes className="h-4 w-4" />
                      </DrawerClose>
                    </div>
                  </DrawerHeader>

                  {/* 
                    Important:
                    All filter fields are inside one form.
                    Pressing Enter in any text field submits this form,
                    applies filters and closes the drawer automatically.
                  */}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleApplyFilters();
                    }}
                    className="flex min-h-0 flex-1 flex-col"
                  >
                    <div className="flex-1 space-y-5 overflow-y-auto p-5">
                      <div>
                        <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
                        
                          Start Date
                        </label>

                        <input
                          type="date"
                          value={advanceFilters.startDate}
                          onChange={(e) =>
                            setAdvanceFilters((prev) => ({
                              ...prev,
                              startDate: e.target.value,
                            }))
                          }
                          onClick={(e) => e.currentTarget.showPicker?.()}
                          className="w-full rounded-sm border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#0446DB] focus:ring-4 focus:ring-blue-500/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:[color-scheme:dark]"
                        />
                      </div>

                      <div>
                        <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
                         
                          End Date
                        </label>

                        <input
                          type="date"
                          value={advanceFilters.endDate}
                          onChange={(e) =>
                            setAdvanceFilters((prev) => ({
                              ...prev,
                              endDate: e.target.value,
                            }))
                          }
                          onClick={(e) => e.currentTarget.showPicker?.()}
                          className="w-full rounded-sm border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#0446DB] focus:ring-4 focus:ring-blue-500/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:[color-scheme:dark]"
                        />
                      </div>

                      <div>
                        <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
                          
                          Reference Number
                        </label>

                        <input
                          type="text"
                          value={advanceFilters.txn_ref}
                          onChange={(e) =>
                            setAdvanceFilters((prev) => ({
                              ...prev,
                              txn_ref: e.target.value,
                            }))
                          }
                          placeholder="Enter reference number"
                          className="w-full rounded-sm border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#0446DB] focus:ring-4 focus:ring-blue-500/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500"
                        />
                      </div>

                      <div>
                        <label className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
                          
                          Transaction For
                        </label>

                        <input
                          type="text"
                          value={advanceFilters.txn_for}
                          onChange={(e) =>
                            setAdvanceFilters((prev) => ({
                              ...prev,
                              txn_for: e.target.value,
                            }))
                          }
                          placeholder="Enter transaction purpose"
                          className="w-full rounded-sm border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#0446DB] focus:ring-4 focus:ring-blue-500/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
                          Transaction Type
                        </label>

                        <select
                          value={advanceFilters.type}
                          onChange={(e) =>
                            setAdvanceFilters((prev) => ({
                              ...prev,
                              type: e.target.value,
                            }))
                          }
                          className="w-full rounded-sm border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-[#0446DB] focus:ring-4 focus:ring-blue-500/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
                        >
                          {transactionTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      
                    </div>

                    <DrawerFooter className="border-t border-gray-100 bg-gray-50 dark:border-neutral-800 dark:bg-neutral-950">
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={handleResetFilters}
                          className="rounded-sm border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                        >
                          Reset
                        </button>

                        <button
                          type="submit"
                          className="rounded-sm bg-[#0446DB] px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                          Apply Filters
                        </button>
                      </div>
                    </DrawerFooter>
                  </form>
                </DrawerContent>
              </Drawer>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN
      ====================================================== */}
      <main className="mx-auto  px-3 py-4 ">
        

        {/* Table */}
        <div className="mt-4 overflow-hidden rounded-sm border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex flex-col gap-2 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800">
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Wallet Transactions
              </h2>

              <p className="mt-0.5 text-xs text-gray-500 dark:text-neutral-500">
                Showing {transactions.length} records on this page
              </p>
            </div>

            {loading && (
              <span className="inline-flex items-center gap-2 text-xs font-medium text-[#0446DB] dark:text-blue-400">
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-blue-200 border-t-[#0446DB]" />
                Updating...
              </span>
            )}
          </div>

          {/* Mobile */}
          <div className="lg:hidden">
            {transactions.length > 0 ? (
              <div className="divide-y divide-gray-100 dark:divide-neutral-800">
                {transactions.map((transaction, index) => (
                  <div
                    key={transaction?.id ?? index}
                    className="p-4 transition hover:bg-gray-50 dark:hover:bg-neutral-800/50"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-sm ${
                            transaction?.type === "credit"
                              ? "bg-emerald-50 dark:bg-emerald-500/10"
                              : "bg-rose-50 dark:bg-rose-500/10"
                          }`}
                        >
                          {getTransactionIcon(transaction?.type)}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate font-semibold text-gray-900 dark:text-neutral-100">
                            {toCapitalizeEachWord(
                              transaction?.txn_for || "Transaction"
                            )}
                          </p>

                          <p className="mt-0.5 text-xs text-gray-500 dark:text-neutral-500">
                            {new Date(transaction?.created_at).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p
                          className={`font-bold ${getAmountColor(
                            transaction?.type
                          )}`}
                        >
                          {getAmountSymbol(transaction?.type)}
                          {formatCurrency(transaction?.amount)}
                        </p>

                        <span
                          className={`mt-1 inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                            transaction?.type === "credit"
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                              : "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
                          }`}
                        >
                          {transaction?.type || "N/A"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 rounded-sm bg-gray-50 p-3 text-sm dark:bg-neutral-950">
                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-gray-400 dark:text-neutral-500">
                          Reference
                        </p>

                        <div className="mt-1 flex items-center gap-1">
                          <p className="max-w-[130px] truncate font-mono text-xs font-semibold text-gray-700 dark:text-neutral-300">
                            {transaction?.txn_ref || "N/A"}
                          </p>

                          {transaction?.txn_ref && (
                            <button
                              type="button"
                              onClick={() => copyReference(transaction.txn_ref)}
                              className="text-gray-400 transition hover:text-[#0446DB] dark:hover:text-blue-400"
                            >
                              <FaCopy className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-[11px] uppercase tracking-wide text-gray-400 dark:text-neutral-500">
                          Closing Balance
                        </p>

                        <p className="mt-1 text-xs font-semibold text-gray-800 dark:text-neutral-200">
                          {formatCurrency(transaction?.balance_after)}
                        </p>
                      </div>
                    </div>

                    {transaction?.remarks && (
                      <div className="mt-3">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-neutral-500">
                          Remarks
                        </p>

                        <p className="mt-1 text-sm text-gray-600 dark:text-neutral-400">
                          {transaction.remarks}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState />
            )}
          </div>

          {/* Desktop */}
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[1050px]">
              <thead className="bg-gray-50 dark:bg-neutral-950">
                <tr>
                  {[
                    "Transaction",
                    "Reference No",
                    "Type",
                    "Amount",
                    "Closing Balance",
                    "Remarks",
                    "Date & Time",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-5 py-3.5 text-left text-[11px] font-bold uppercase tracking-[0.08em] text-gray-500 dark:text-neutral-500"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
                {transactions.length > 0 ? (
                  transactions.map((transaction, index) => (
                    <tr
                      key={transaction?.id ?? index}
                      className="transition-colors hover:bg-gray-50/80 dark:hover:bg-neutral-800/50"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-sm ${
                              transaction?.type === "credit"
                                ? "bg-emerald-50 dark:bg-emerald-500/10"
                                : "bg-rose-50 dark:bg-rose-500/10"
                            }`}
                          >
                            {getTransactionIcon(transaction?.type)}
                          </div>

                          <p className="font-semibold text-gray-900 dark:text-neutral-100">
                            {toCapitalizeEachWord(
                              transaction?.txn_for || "Transaction"
                            )}
                          </p>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="max-w-[180px] truncate font-mono text-xs font-semibold text-gray-600 dark:text-neutral-400">
                            {transaction?.txn_ref || "N/A"}
                          </span>

                          {transaction?.txn_ref && (
                            <button
                              type="button"
                              onClick={() => copyReference(transaction.txn_ref)}
                              className="text-gray-400 transition hover:text-[#0446DB] dark:hover:text-blue-400"
                            >
                              <FaCopy className="h-3 w-3" />
                            </button>
                          )}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${
                            transaction?.type === "credit"
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                              : "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
                          }`}
                        >
                          {transaction?.type || "N/A"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`font-bold ${getAmountColor(
                            transaction?.type
                          )}`}
                        >
                          {getAmountSymbol(transaction?.type)}
                          {formatCurrency(transaction?.amount)}
                        </span>
                      </td>

                      <td className="px-5 py-4 font-semibold text-gray-900 dark:text-neutral-100">
                        {formatCurrency(transaction?.balance_after)}
                      </td>

                      <td className="px-5 py-4">
                        <p
                          className="max-w-[220px] truncate text-sm text-gray-600 dark:text-neutral-400"
                          title={transaction?.remarks || "No remarks"}
                        >
                          {transaction?.remarks || "No remarks"}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <div className="text-xs text-gray-500 dark:text-neutral-500">
                          <div className="font-medium">
                            {new Date(transaction?.created_at).toLocaleDateString(
                              "en-IN"
                            )}
                          </div>

                          <div className="mt-0.5">
                            {new Date(transaction?.created_at).toLocaleTimeString(
                              "en-IN",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7}>
                      <EmptyState />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {transactions.length > 0 && (
            <div className="flex flex-col gap-3 border-t border-gray-100 bg-gray-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800 dark:bg-neutral-950">
              <p className="text-center text-xs font-medium text-gray-500 sm:text-left dark:text-neutral-500">
                Page {page} of {totalPages} • {totalTransactions} total
                transactions
              </p>

              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                  className="rounded-sm border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                >
                  Previous
                </button>

                <span className="rounded-sm border border-gray-200 bg-white px-3 py-2 text-xs font-bold text-gray-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                  {page} / {totalPages}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={page === totalPages}
                  className="rounded-sm bg-[#0446DB] px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
      )
    }
    </>
  );
}

function StatCard({ label, value, icon, tone = "blue" }) {
  const tones = {
    blue: {
      iconBox: "bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400",
    },
    green: {
      iconBox:
        "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
    },
    red: {
      iconBox:
        "bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400",
    },
    violet: {
      iconBox:
        "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
    },
  };

  const selected = tones[tone] || tones.blue;

  return (
    <div className="rounded-sm border border-gray-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-gray-400 dark:text-neutral-500">
            {label}
          </p>

          <p className="mt-2 truncate text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            {value}
          </p>
        </div>

        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-sm ${selected.iconBox}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="px-6 py-14 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-300 dark:bg-neutral-800 dark:text-neutral-600">
        <FaReceipt className="h-6 w-6" />
      </div>

      <p className="mt-4 font-semibold text-gray-700 dark:text-neutral-300">
        No transactions found
      </p>

      <p className="mt-1 text-sm text-gray-400 dark:text-neutral-500">
        Try changing your filters or search term.
      </p>
    </div>
  );
}

export default TechbasedTransaction;
