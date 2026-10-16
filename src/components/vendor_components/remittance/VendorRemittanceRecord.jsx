
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import {
//   CalendarDays,
//   Download,
//   FileText,
//   Filter,
//   Loader2,
//   PackageSearch,
//   RotateCcw,
//   Search,
//   X,
// } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import {
//   Drawer,
//   DrawerClose,
//   DrawerContent,
//   DrawerDescription,
//   DrawerFooter,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerTrigger,
// } from "@/components/ui/drawer";

// const baseURL = import.meta.env.VITE_BASE_URL;

// function VendorRemittanceRecord() {
//   const [loading, setLoading] = useState(false);
//   const [data, setData] = useState([]);
//   const [page, setPage] = useState(1);
//   const [limit] = useState(20);
//   const [totalPages, setTotalPages] = useState(1);

//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [advanceFilters, setAdvanceFilters] = useState({
//     startDate: "",
//     endDate: "",
//     awb_number: "",
//   });
//   const [filterUpdate, setFilterUpdate] = useState(false);

//   const resetAdvanceFilters = async () => {
//     const today = new Date();
//     const oneMonthAgo = new Date();
//     oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

//     setAdvanceFilters({
//       endDate: today.toISOString().split("T")[0],
//       startDate: oneMonthAgo.toISOString().split("T")[0],
//       awb_number: "",
//     });
//   };

//   const indianFormat = (num) =>
//     Number(num || 0).toLocaleString("en-IN", {
//       style: "currency",
//       currency: "INR",
//     });

//   useEffect(() => {
//     resetAdvanceFilters();
//   }, []);

//   const fetchData = async () => {
//     setLoading(true);

//     try {
//       const res = await axios.get(
//         `${baseURL}/api/vendor/getMyVendorSubmittedRecords`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//           params: {
//             page,
//             limit,
//             start_date: advanceFilters.startDate,
//             end_date: advanceFilters.endDate,
//             awb_number: advanceFilters.awb_number,
//           },
//         },
//       );

//       setData(res?.data?.data || []);
//       setTotalPages(Math.max(1, Number(res?.data?.total_pages || 1)));
//     } catch (err) {
//       toast.error(
//         err?.response?.data?.message ||
//           err?.message ||
//           "Failed to fetch remittance records",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [page]);

//   useEffect(() => {
//     if (filterUpdate) {
//       fetchData();
//       setFilterUpdate(false);
//     }
//   }, [filterUpdate]);

//   const handleApplyFilter = (e) => {
//     e?.preventDefault();
//     setPage(1);
//     setFilterUpdate(true);
//     setIsFilterOpen(false);
//   };

//   const handleResetFilters = async () => {
//     await resetAdvanceFilters();
//     setPage(1);
//     setFilterUpdate(true);
//     setIsFilterOpen(false);
//   };

//   const formatDate = (date) => {
//     if (!date) return "-";

//     return new Date(date).toLocaleString("en-IN", {
//       timeZone: "Asia/Kolkata",
//       day: "2-digit",
//       month: "2-digit",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//       hour12: true,
//     });
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-neutral-950 dark:text-neutral-100">
//       {/* Header */}
//       <div className="border-b border-slate-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
//         <div className="flex flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
//           <div>
//             <div className="flex items-center gap-3">
//               <div className="grid h-10 w-10 place-items-center rounded-sm bg-blue-50 text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400">
//                 <FileText className="h-5 w-5" />
//               </div>

//               <div>
//                 <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
//                   Remittance Record
//                 </h1>
//                 <p className="mt-0.5 text-sm text-slate-500 dark:text-neutral-400">
//                   View and manage your submitted remittance records.
//                 </p>
//               </div>
//             </div>
//           </div>

//           <Drawer
//             direction="right"
//             open={isFilterOpen}
//             onOpenChange={setIsFilterOpen}
//           >
//             <DrawerTrigger asChild>
//               <Button
//                 type="button"
//                 variant="outline"
//                 className="h-10 gap-2 rounded-sm border-slate-200 bg-white px-4 font-medium text-[#0446DB] shadow-sm hover:border-blue-200 hover:bg-blue-50 hover:text-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-blue-400 dark:hover:bg-neutral-700"
//               >
//                 <Filter className="h-4 w-4" />
//                 Filter
//               </Button>
//             </DrawerTrigger>

//             <DrawerContent className="ml-auto h-full w-full max-w-[420px] rounded-none border-l border-slate-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
//               <DrawerHeader className="border-b border-slate-200 px-5 py-5 text-left dark:border-neutral-800">
//                 <div className="flex items-start justify-between gap-3">
//                   <div>
//                     <DrawerTitle className="flex items-center gap-2 text-xl font-semibold text-slate-900 dark:text-white">
//                       <Filter className="h-5 w-5 text-[#0446DB] dark:text-blue-400" />
//                       Advanced Filters
//                     </DrawerTitle>
//                     <DrawerDescription className="mt-1 text-sm text-slate-500 dark:text-neutral-400">
//                       Filter remittance records by date or AWB number.
//                     </DrawerDescription>
//                   </div>

//                   <DrawerClose asChild>
//                     <button
//                       type="button"
//                       className="grid h-9 w-9 place-items-center rounded-sm text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
//                     >
//                       <X className="h-4 w-4" />
//                     </button>
//                   </DrawerClose>
//                 </div>
//               </DrawerHeader>

//               <form
//                 onSubmit={handleApplyFilter}
//                 className="flex min-h-0 flex-1 flex-col"
//               >
//                 <div className="flex-1 space-y-5 overflow-y-auto p-5">
//                   <div>
//                     <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-neutral-300">
//                       <CalendarDays className="h-4 w-4 text-slate-400" />
//                       Start Date
//                     </label>
//                     <input
//                       type="date"
//                       value={advanceFilters.startDate}
//                       onChange={(e) =>
//                         setAdvanceFilters((prev) => ({
//                           ...prev,
//                           startDate: e.target.value,
//                         }))
//                       }
//                       onClick={(e) => e.currentTarget.showPicker?.()}
//                       className="h-11 w-full rounded-sm border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-blue-500/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:[color-scheme:dark]"
//                     />
//                   </div>

//                   <div>
//                     <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-neutral-300">
//                       <CalendarDays className="h-4 w-4 text-slate-400" />
//                       End Date
//                     </label>
//                     <input
//                       type="date"
//                       value={advanceFilters.endDate}
//                       onChange={(e) =>
//                         setAdvanceFilters((prev) => ({
//                           ...prev,
//                           endDate: e.target.value,
//                         }))
//                       }
//                       onClick={(e) => e.currentTarget.showPicker?.()}
//                       className="h-11 w-full rounded-sm border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-blue-500/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:[color-scheme:dark]"
//                     />
//                   </div>

//                   <div>
//                     <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-neutral-300">
//                       <Search className="h-4 w-4 text-slate-400" />
//                       AWB Number
//                     </label>
//                     <input
//                       type="text"
//                       value={advanceFilters.awb_number}
//                       onChange={(e) =>
//                         setAdvanceFilters((prev) => ({
//                           ...prev,
//                           awb_number: e.target.value,
//                         }))
//                       }
//                       placeholder="Enter AWB Number"
//                       className="h-11 w-full rounded-sm border border-slate-300 bg-white px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#0446DB] focus:ring-2 focus:ring-blue-500/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-500"
//                     />
//                   </div>
//                 </div>

//                 <DrawerFooter className="border-t border-slate-200 bg-slate-50 p-5 dark:border-neutral-800 dark:bg-neutral-950">
//                   <div className="grid grid-cols-2 gap-3">
//                     <button
//                       type="button"
//                       onClick={handleResetFilters}
//                       className="flex h-11 items-center justify-center gap-2 rounded-sm border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
//                     >
//                       <RotateCcw className="h-4 w-4" />
//                       Reset
//                     </button>

//                     <button
//                       type="submit"
//                       className="flex h-11 items-center justify-center gap-2 rounded-sm bg-[#0446DB] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
//                     >
//                       <Filter className="h-4 w-4" />
//                       Apply Filter
//                     </button>
//                   </div>

//                   <p className="mt-1 text-center text-xs text-slate-400 dark:text-neutral-500">
//                     Press Enter to apply filters
//                   </p>
//                 </DrawerFooter>
//               </form>
//             </DrawerContent>
//           </Drawer>
//         </div>
//       </div>

//       {/* Content */}
//       <main className="">
//         <div className="overflow-hidden rounded-sm border border-slate-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
//           <div className="flex flex-col gap-2 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800">
//             <div>
//               <h2 className="font-semibold text-slate-900 dark:text-white">
//                 Submitted Records
//               </h2>
//               <p className="mt-0.5 text-xs text-slate-500 dark:text-neutral-400">
//                 Your latest remittance submissions and payment references.
//               </p>
//             </div>

//             <div className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 dark:bg-neutral-800 dark:text-neutral-300">
//               Page {page} of {totalPages}
//             </div>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-neutral-800">
//               <thead className="bg-slate-50 dark:bg-neutral-950/60">
//                 <tr>
//                   <th className="whitespace-nowrap px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-neutral-400">
//                     AWB Number
//                   </th>
//                   <th className="whitespace-nowrap px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-neutral-400">
//                     Amount
//                   </th>
//                   <th className="whitespace-nowrap px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-neutral-400">
//                     UTR Number
//                   </th>
//                   <th className="whitespace-nowrap px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-neutral-400">
//                     Upload Date
//                   </th>
//                   <th className="whitespace-nowrap px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-neutral-400">
//                     Action
//                   </th>
//                 </tr>
//               </thead>

//               <tbody className="divide-y divide-slate-100 bg-white dark:divide-neutral-800 dark:bg-neutral-900">
//                 {loading ? (
//                   <tr>
//                     <td colSpan={5} className="px-6 py-20 text-center">
//                       <Loader2 className="mx-auto h-7 w-7 animate-spin text-[#0446DB]" />
//                       <p className="mt-3 text-sm font-medium text-slate-600 dark:text-neutral-300">
//                         Loading remittance records...
//                       </p>
//                     </td>
//                   </tr>
//                 ) : data.length === 0 ? (
//                   <tr>
//                     <td colSpan={5} className="px-6 py-20 text-center">
//                       <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-400 dark:bg-neutral-800 dark:text-neutral-500">
//                         <PackageSearch className="h-6 w-6" />
//                       </div>
//                       <p className="mt-3 font-medium text-slate-700 dark:text-neutral-200">
//                         No records found
//                       </p>
//                       <p className="mt-1 text-xs text-slate-500 dark:text-neutral-400">
//                         Try changing your filter values.
//                       </p>
//                     </td>
//                   </tr>
//                 ) : (
//                   data.map((d, index) => (
//                     <tr
//                       key={d?.id ?? index}
//                       className="transition hover:bg-slate-50/80 dark:hover:bg-neutral-800/60"
//                     >
//                       <td className="whitespace-nowrap px-6 py-4">
//                         <span className="font-semibold text-[#0446DB] dark:text-blue-400">
//                           {d?.awb_number || "-"}
//                         </span>
//                       </td>

//                       <td className="whitespace-nowrap px-6 py-4 font-semibold text-slate-800 dark:text-neutral-200">
//                         {indianFormat(Number(d?.amount || 0))}
//                       </td>

//                       <td className="whitespace-nowrap px-6 py-4">
//                         <span className="rounded-md bg-slate-100 px-2.5 py-1 font-mono text-xs font-medium text-slate-700 dark:bg-neutral-800 dark:text-neutral-300">
//                           {d?.utr_number || "-"}
//                         </span>
//                       </td>

//                       <td className="whitespace-nowrap px-6 py-4 text-slate-600 dark:text-neutral-300">
//                         {formatDate(d?.created_at)}
//                       </td>

//                       <td className="whitespace-nowrap px-6 py-4">
//                         {d?.file_url ? (
//                           <a
//                             href={`${baseURL}/${d.file_url}`}
//                             target="_blank"
//                             rel="noopener noreferrer"
//                             className="inline-flex h-9 items-center gap-2 rounded-sm border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:hover:text-blue-400"
//                           >
//                             <Download className="h-4 w-4" />
//                             Download
//                           </a>
//                         ) : (
//                           <span className="text-xs text-slate-400">No file</span>
//                         )}
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row dark:border-neutral-800 dark:bg-neutral-950/60">
//             <p className="text-sm text-slate-500 dark:text-neutral-400">
//               Page{" "}
//               <span className="font-semibold text-slate-800 dark:text-neutral-200">
//                 {page}
//               </span>{" "}
//               of{" "}
//               <span className="font-semibold text-slate-800 dark:text-neutral-200">
//                 {totalPages}
//               </span>
//             </p>

//             <div className="flex items-center gap-2">
//               <button
//                 type="button"
//                 onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
//                 disabled={page === 1 || loading}
//                 className="h-9 rounded-sm border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
//               >
//                 Previous
//               </button>

//               <button
//                 type="button"
//                 onClick={() =>
//                   setPage((prev) => Math.min(prev + 1, totalPages))
//                 }
//                 disabled={page === totalPages || loading}
//                 className="h-9 rounded-sm bg-[#0446DB] px-4 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// export default VendorRemittanceRecord;





import { useEffect, useState } from "react";

import axios from "axios";

import { toast } from "react-toastify";

import {

  CalendarDays,

  Download,

  FileText,

  Filter,

  Loader2,

  PackageSearch,

  RotateCcw,

  Search,

  X,

} from "lucide-react";



import { Button } from "@/components/ui/button";

import {

  Drawer,

  DrawerClose,

  DrawerContent,

  DrawerDescription,

  DrawerFooter,

  DrawerHeader,

  DrawerTitle,

  DrawerTrigger,

} from "@/components/ui/drawer";



const baseURL = import.meta.env.VITE_BASE_URL;



function VendorRemittanceRecord() {

  const [loading, setLoading] = useState(false);

  const [data, setData] = useState([]);

  const [page, setPage] = useState(1);

  const [limit] = useState(20);

  const [totalPages, setTotalPages] = useState(1);



  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [advanceFilters, setAdvanceFilters] = useState({

    startDate: "",

    endDate: "",

    awb_number: "",

  });

  const [filterUpdate, setFilterUpdate] = useState(false);



  const resetAdvanceFilters = async () => {

    const today = new Date();

    const oneMonthAgo = new Date();

    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);



    setAdvanceFilters({

      endDate: today.toISOString().split("T")[0],

      startDate: oneMonthAgo.toISOString().split("T")[0],

      awb_number: "",

    });

  };



  const indianFormat = (num) =>

    Number(num || 0).toLocaleString("en-IN", {

      style: "currency",

      currency: "INR",

    });



  useEffect(() => {

    resetAdvanceFilters();

  }, []);



  const fetchData = async () => {

    setLoading(true);



    try {

      const res = await axios.get(

        `${baseURL}/api/vendor/getMyVendorSubmittedRecords`,

        {

          headers: {

            Authorization: `Bearer ${localStorage.getItem("token")}`,

          },

          params: {

            page,

            limit,

            start_date: advanceFilters.startDate,

            end_date: advanceFilters.endDate,

            awb_number: advanceFilters.awb_number,

          },

        },

      );



      setData(res?.data?.data || []);

      setTotalPages(Math.max(1, Number(res?.data?.total_pages || 1)));

    } catch (err) {

      toast.error(

        err?.response?.data?.message ||

          err?.message ||

          "Failed to fetch remittance records",

      );

    } finally {

      setLoading(false);

    }

  };



  useEffect(() => {

    fetchData();

  }, [page]);



  useEffect(() => {

    if (filterUpdate) {

      fetchData();

      setFilterUpdate(false);

    }

  }, [filterUpdate]);



  const handleApplyFilter = (e) => {

    e?.preventDefault();

    setPage(1);

    setFilterUpdate(true);

    setIsFilterOpen(false);

  };



  const handleResetFilters = async () => {

    await resetAdvanceFilters();

    setPage(1);

    setFilterUpdate(true);

    setIsFilterOpen(false);

  };



  const formatDate = (date) => {

    if (!date) return "-";



    return new Date(date).toLocaleString("en-IN", {

      timeZone: "Asia/Kolkata",

      day: "2-digit",

      month: "2-digit",

      year: "numeric",

      hour: "2-digit",

      minute: "2-digit",

      hour12: true,

    });

  };



  return (

    <div className="flex h-[87dvh] min-h-0 flex-col overflow-hidden bg-slate-50 text-slate-900 dark:bg-neutral-950 dark:text-neutral-100">

      {/* Header */}

      <div className="sticky top-0 z-30 shrink-0 border-b border-slate-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">

        <div className="flex flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">

          <div>

            <div className="flex items-center gap-3">

              <div className="grid h-10 w-10 place-items-center rounded-sm bg-blue-50 text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400">

                <FileText className="h-5 w-5" />

              </div>



              <div>

                <h1 className="text-xl font-bold tracking-tight sm:text-2xl">

                  Remittance Record

                </h1>

                <p className="mt-0.5 text-sm text-slate-500 dark:text-neutral-400">

                  View and manage your submitted remittance records.

                </p>

              </div>

            </div>

          </div>



          <Drawer

            direction="right"

            open={isFilterOpen}

            onOpenChange={setIsFilterOpen}

          >

            <DrawerTrigger asChild>

              <Button

                type="button"

                variant="outline"

                className="h-10 gap-2 rounded-sm border-slate-200 bg-white px-4 font-medium text-[#0446DB] shadow-sm hover:border-blue-200 hover:bg-blue-50 hover:text-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-blue-400 dark:hover:bg-neutral-700"

              >

                <Filter className="h-4 w-4" />

                Filter

              </Button>

            </DrawerTrigger>



            <DrawerContent className="ml-auto h-full w-full max-w-[420px] rounded-none border-l border-slate-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">

              <DrawerHeader className="border-b border-slate-200 px-5 py-5 text-left dark:border-neutral-800">

                <div className="flex items-start justify-between gap-3">

                  <div>

                    <DrawerTitle className="flex items-center gap-2 text-xl font-semibold text-slate-900 dark:text-white">

                      <Filter className="h-5 w-5 text-[#0446DB] dark:text-blue-400" />

                      Advanced Filters

                    </DrawerTitle>

                    <DrawerDescription className="mt-1 text-sm text-slate-500 dark:text-neutral-400">

                      Filter remittance records by date or AWB number.

                    </DrawerDescription>

                  </div>



                  <DrawerClose asChild>

                    <button

                      type="button"

                      className="grid h-9 w-9 place-items-center rounded-sm text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"

                    >

                      <X className="h-4 w-4" />

                    </button>

                  </DrawerClose>

                </div>

              </DrawerHeader>



              <form

                onSubmit={handleApplyFilter}

                className="flex min-h-0 flex-1 flex-col"

              >

                <div className="flex-1 space-y-5 overflow-y-auto p-5">

                  <div>

                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-neutral-300">

                      <CalendarDays className="h-4 w-4 text-slate-400" />

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

                      className="h-11 w-full rounded-sm border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-blue-500/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:[color-scheme:dark]"

                    />

                  </div>



                  <div>

                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-neutral-300">

                      <CalendarDays className="h-4 w-4 text-slate-400" />

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

                      className="h-11 w-full rounded-sm border border-slate-300 bg-white px-3 text-sm outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-blue-500/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:[color-scheme:dark]"

                    />

                  </div>



                  <div>

                    <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-neutral-300">

                      <Search className="h-4 w-4 text-slate-400" />

                      AWB Number

                    </label>

                    <input

                      type="text"

                      value={advanceFilters.awb_number}

                      onChange={(e) =>

                        setAdvanceFilters((prev) => ({

                          ...prev,

                          awb_number: e.target.value,

                        }))

                      }

                      placeholder="Enter AWB Number"

                      className="h-11 w-full rounded-sm border border-slate-300 bg-white px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#0446DB] focus:ring-2 focus:ring-blue-500/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-500"

                    />

                  </div>

                </div>



                <DrawerFooter className="border-t border-slate-200 bg-slate-50 p-5 dark:border-neutral-800 dark:bg-neutral-950">

                  <div className="grid grid-cols-2 gap-3">

                    <button

                      type="button"

                      onClick={handleResetFilters}

                      className="flex h-11 items-center justify-center gap-2 rounded-sm border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"

                    >

                      <RotateCcw className="h-4 w-4" />

                      Reset

                    </button>



                    <button

                      type="submit"

                      className="flex h-11 items-center justify-center gap-2 rounded-sm bg-[#0446DB] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"

                    >

                      <Filter className="h-4 w-4" />

                      Apply Filter

                    </button>

                  </div>



                  <p className="mt-1 text-center text-xs text-slate-400 dark:text-neutral-500">

                    Press Enter to apply filters

                  </p>

                </DrawerFooter>

              </form>

            </DrawerContent>

          </Drawer>

        </div>

      </div>



      {/* Content */}

      <main className="flex min-h-0 flex-1 flex-col">

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-sm border border-slate-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">

          <div className="min-h-0 flex-1 overflow-auto">

            <table className="min-w-full divide-y divide-slate-200 text-sm dark:divide-neutral-800">

              <thead className="sticky top-0 z-20 bg-slate-50 shadow-sm dark:bg-neutral-950">

                <tr>

                  <th className="whitespace-nowrap px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-neutral-400">

                    AWB Number

                  </th>

                  <th className="whitespace-nowrap px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-neutral-400">

                    Amount

                  </th>

                  <th className="whitespace-nowrap px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-neutral-400">

                    UTR Number

                  </th>

                  <th className="whitespace-nowrap px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-neutral-400">

                    Upload Date

                  </th>

                  <th className="whitespace-nowrap px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-neutral-400">

                    Action

                  </th>

                </tr>

              </thead>



              <tbody className="divide-y divide-slate-100 bg-white dark:divide-neutral-800 dark:bg-neutral-900">

                {loading ? (

                  <tr>

                    <td colSpan={5} className="px-6 py-20 text-center">

                      <Loader2 className="mx-auto h-7 w-7 animate-spin text-[#0446DB]" />

                      <p className="mt-3 text-sm font-medium text-slate-600 dark:text-neutral-300">

                        Loading remittance records...

                      </p>

                    </td>

                  </tr>

                ) : data.length === 0 ? (

                  <tr>

                    <td colSpan={5} className="px-6 py-20 text-center">

                      <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-slate-100 text-slate-400 dark:bg-neutral-800 dark:text-neutral-500">

                        <PackageSearch className="h-6 w-6" />

                      </div>

                      <p className="mt-3 font-medium text-slate-700 dark:text-neutral-200">

                        No records found

                      </p>

                      <p className="mt-1 text-xs text-slate-500 dark:text-neutral-400">

                        Try changing your filter values.

                      </p>

                    </td>

                  </tr>

                ) : (

                  data.map((d, index) => (

                    <tr

                      key={d?.id ?? index}

                      className="transition hover:bg-slate-50/80 dark:hover:bg-neutral-800/60"

                    >

                      <td className="whitespace-nowrap px-6 py-4">

                        <span className="font-semibold text-[#0446DB] dark:text-blue-400">

                          {d?.awb_number || "-"}

                        </span>

                      </td>



                      <td className="whitespace-nowrap px-6 py-4 font-semibold text-slate-800 dark:text-neutral-200">

                        {indianFormat(Number(d?.amount || 0))}

                      </td>



                      <td className="whitespace-nowrap px-6 py-4">

                        <span className="rounded-md bg-slate-100 px-2.5 py-1 font-mono text-xs font-medium text-slate-700 dark:bg-neutral-800 dark:text-neutral-300">

                          {d?.utr_number || "-"}

                        </span>

                      </td>



                      <td className="whitespace-nowrap px-6 py-4 text-slate-600 dark:text-neutral-300">

                        {formatDate(d?.created_at)}

                      </td>



                      <td className="whitespace-nowrap px-6 py-4">

                        {d?.file_url ? (

                          <a

                            href={`${baseURL}/${d.file_url}`}

                            target="_blank"

                            rel="noopener noreferrer"

                            className="inline-flex h-9 items-center gap-2 rounded-sm border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700 dark:hover:text-blue-400"

                          >

                            <Download className="h-4 w-4" />

                            Download

                          </a>

                        ) : (

                          <span className="text-xs text-slate-400">No file</span>

                        )}

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>



          {/* Pagination */}

          <div className="sticky bottom-0 z-20 shrink-0 flex flex-col items-center justify-between gap-3 border-t border-slate-200 bg-slate-50 px-5 py-4 sm:flex-row dark:border-neutral-800 dark:bg-neutral-950">

            <p className="text-sm text-slate-500 dark:text-neutral-400">

              Page{" "}

              <span className="font-semibold text-slate-800 dark:text-neutral-200">

                {page}

              </span>{" "}

              of{" "}

              <span className="font-semibold text-slate-800 dark:text-neutral-200">

                {totalPages}

              </span>

            </p>



            <div className="flex items-center gap-2">

              <button

                type="button"

                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}

                disabled={page === 1 || loading}

                className="h-9 rounded-sm border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"

              >

                Previous

              </button>



              <button

                type="button"

                onClick={() =>

                  setPage((prev) => Math.min(prev + 1, totalPages))

                }

                disabled={page === totalPages || loading}

                className="h-9 rounded-sm bg-[#0446DB] px-4 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"

              >

                Next

              </button>

            </div>

          </div>

        </div>

      </main>

    </div>

  );

}



export default VendorRemittanceRecord;
