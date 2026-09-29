// import { useState, useEffect } from "react";
// import axios from "axios";
// import Loader from "../../Loader";

// import { FaFileDownload, FaFilter } from "react-icons/fa";
// import { toast } from "react-toastify";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Drawer,
//   DrawerContent,

//   DrawerFooter,
//   DrawerHeader,
//   DrawerTitle,
//   DrawerTrigger,
// } from "@/components/ui/drawer"
// import { Button } from "@/components/ui/button"
// import { Loader2 } from "lucide-react";
// import AxiosInstance from "../../../Helper/axiosInstance";
// const baseURL = import.meta.env.VITE_BASE_URL;

// function RemittanceStatusVendor() {
//    const [selectedStatus, setSelectedStatus] = useState("All");
//   const [loading, setLoading] = useState(false);
//   const [data, setData] = useState([]);
//   const [vendorCodSummary, setVendorCodSummary] = useState();
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(20);
//   const [totalPages, setTotalPages] = useState(1);

//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [advanceFilters, setAdvanceFilters] = useState({
//     startDate: "",
//     endDate: "",
//     vendor_id: "",
//   });
//   const [filterUpdate, setFilterUpdate] = useState(false);

//   //Set Default Date Range of one month from today
//   const resetAdvanceFilters = async () => {
//     const today = new Date();
//     const oneMonthAgo = new Date();
//     oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

//     setAdvanceFilters({
//       endDate: today.toISOString().split("T")[0],
//       startDate: oneMonthAgo.toISOString().split("T")[0],
//       vendor_id: "",
//     });
//   };


//   function toCapitalizeEachWord(str) {
//     return str
//       .split(" ")
//       .map((word) => {
//         if (!word) return "";
//         return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
//       })
//       .join(" ");
//   }

//   const openDatePicker = (event) => {
//     try {
//       event.currentTarget.showPicker?.();
//     } catch {
//       // Some browsers block programmatic picker opening; normal focus still works.
//     }
//   };

//   const updateAdvanceFilter = (name, value) => {
//     setAdvanceFilters((prev) => {
//       if (name === "startDate") {
//         return {
//           ...prev,
//           startDate: value,
//           endDate: prev.endDate && value && prev.endDate < value ? value : prev.endDate,
//         };
//       }

//       if (name === "endDate") {
//         return {
//           ...prev,
//           startDate: prev.startDate && value && prev.startDate > value ? value : prev.startDate,
//           endDate: value,
//         };
//       }

//       return { ...prev, [name]: value };
//     });
//   };

//   const applyFilters = () => {
//     if (
//       advanceFilters.startDate &&
//       advanceFilters.endDate &&
//       advanceFilters.startDate > advanceFilters.endDate
//     ) {
//       toast.error("Start date cannot be after end date.");
//       return;
//     }

//     setPage(1);
//     setFilterUpdate(true);
//     setIsFilterOpen(false);
//   };

//   const resetFilters = () => {
//     resetAdvanceFilters();
//     setPage(1);
//     setFilterUpdate(true);
//     setIsFilterOpen(false);
//   };

//   const indianFormat = (num) => {
//     const temp = num.toLocaleString("en-IN", {
//       style: "currency",
//       currency: "INR",
//     });
//     return temp;
//   };

//   useEffect(() => {
//     resetAdvanceFilters();
//   }, []);

//   // Fetch data from API
//   const fetchData = async () => {
//     setLoading(true);
//     try {

//       const res = await AxiosInstance.get('/api/admin/fetchVendorSubmittedRecords',{
//         params: {
//             page,
//             limit,
//             start_date: advanceFilters.startDate,
//             end_date: advanceFilters.endDate,
//             vendor_id: advanceFilters.vendor_id,
//           }
//       })
      
//       setVendorCodSummary(res?.data?.vendorCodSummary)
//       setData(res?.data?.data || []);
//       setTotalPages(Math.max(1, res.data.totalPages));
//     } catch (err) {
//       toast.error(err.response?.data?.message || err.message || "Failed to fetch data:");
//     } finally {
//       setLoading(false);
//     }
//   };


//  const codStatusTabs = [
//   { key: "total", label: "All" },
//   { key: "pending", label: "Pending" },
//   { key: "initiated", label: "Initiated" },
//   { key: "received", label: "Received" },
//   { key: "adjusted", label: "Adjusted" },
// ];

// const codSummary = vendorCodSummary?.[0] || {};

//   useEffect(() => {
//     fetchData();
//   }, [page]);

//   useEffect(() => {
//     if (filterUpdate) {
//       fetchData();
//       setFilterUpdate(false);
//     }
//   }, [filterUpdate]);
  

//   const [loadingPage, setLoadingPage] = useState(true);

// useEffect(() => {
//   const timer = setTimeout(() => {
//     setLoadingPage(false);
//   }, 2000);

//   return () => clearTimeout(timer);
// }, []);


//   return (
//     <>
//        {
//         loadingPage ?(
//            <div className=" w-full h-[90vh] flex justify-center items-center">
//                   <div>
//                     <Loader2 className="h-8 w-8 animate-spin mx-auto" />
//                     <p className="mt-2"> Loading Vendor Remittance Details...</p>
//                   </div>
//                 </div>
//         ):(

//       <div className="bg-gray-100 dark:bg-gray-900 min-h-screen w-full">
//         {/* Right Sidebar for filters */}
        

//         {/* Heading */}
//         <div className="mb-0  dark:bg-gray-900 py-2">
//           <div className="flex flex-wrap items-center justify-between">
//             {/* Heading */}
//             <h1 className="text-2xl font-semibold dark:text-white">Vendor Remittance Record</h1>
//             <div className="flex flex-wrap items-end gap-4 text-white">
//               <Drawer direction="right"
//              open={isFilterOpen}
//   onOpenChange={setIsFilterOpen}
//               >
//                 <DrawerTrigger asChild>
//                   <Button variant="outline"
//                     className="bg-white bg-[#0446DB] font-medium px-5 py-2.5 rounded-sm shadow  transition flex items-center gap-2"
//                   >
//                     <FaFilter className="text-sm" />
//                     <span>Filter</span>
//                   </Button>
//                 </DrawerTrigger>
//                 <DrawerContent>
//                   <DrawerHeader>
//                     <DrawerTitle>Filter</DrawerTitle>

//                   </DrawerHeader>
//                   <div className="p-4">
//                     <form onSubmit={(e) => {
//                       e.preventDefault()
//                       applyFilters()
//                       setIsFilterOpen(false)

//                     }}
//                       className="flex-col  w-full  items-end gap-4"
//                     >
//                       <div className="flex flex-wrap items-end gap-4">
//                         {/* Start Date */}
//                         <div className=" w-full">
//                           <label className="block text-xs dark:text-white text-gray-600 mb-1">
//                             Start Date
//                           </label>
//                           <input
//                             type="date"
//                             value={advanceFilters.startDate}
//                             max={advanceFilters.endDate || undefined}
//                             onChange={(e) => updateAdvanceFilter("startDate", e.target.value)}
//                             onClick={openDatePicker}
//                             onFocus={openDatePicker}
//                             className="border flex w-full px-3 py-1 cursor-pointer bg-white text-gray-900 dark:bg-gray-900 dark:text-white rounded-md text-sm"
//                           />
//                         </div>

//                         {/* End Date */}
//                         <div className=" w-full">
//                           <label className="block text-xs dark:text-white text-gray-600 mb-1">
//                             End Date
//                           </label>
//                           <input
//                             type="date"
//                             value={advanceFilters.endDate}
//                             min={advanceFilters.startDate || undefined}
//                             onChange={(e) => updateAdvanceFilter("endDate", e.target.value)}
//                             onClick={openDatePicker}
//                             onFocus={openDatePicker}
//                             className="border flex w-full px-3 py-1 cursor-pointer bg-white text-gray-900 dark:bg-gray-900 dark:text-white rounded-md text-sm"
//                           />
//                         </div>

//                         {/* Order ID */}
//                         <div className=" w-full">
//                           <label className="block dark:text-white text-xs text-gray-600 mb-1">
//                             Vendor ID
//                           </label>
//                           <input
//                             type="number"
//                             value={advanceFilters.vendor_id}
//                             onChange={(e) => updateAdvanceFilter("vendor_id", e.target.value)}
//                             placeholder="Only Integer Value"
//                             className="border w-full dark:text-white px-3 py-2 rounded-md text-sm"
//                           />
//                         </div>

//                         {/* Update Button */}
//                         <div className=" w-full ">
//                           <Button
//                             type="submit"
//                             onClick={applyFilters}
//                             className="bg-[#0446DB] w-full text-white px-4 py-2 rounded-md hover:bg-indigo-800 transition text-sm mx-2"
//                           >
//                             Filter
//                           </Button>
//                           <Button
//                             type="button"
//                             onClick={resetFilters}
//                             className="bg-[#0446DB] w-full text-white px-4 py-2 rounded-md hover:bg-indigo-800 transition text-sm mx-2"
//                           >
//                             Reset
//                           </Button>
//                         </div>
//                       </div>

//                     </form>
//                   </div>
//                   <DrawerFooter>
//                     <Button onClick={() => setIsFilterOpen(false)} variant="outline">Cancel</Button>
//                   </DrawerFooter>
//                 </DrawerContent>
//               </Drawer>
//             </div>
//           </div>
//         </div>

//           <div className="w-full  bg-white   dark:bg-neutral-800   left-0 px-4 z-40   ">
//                       <div className="relative flex justify-center ">
//                         <div className=" flex  overflow-x-auto  scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 pb-2">
//                           <div className="flex gap-2 min-w-max px-8 mt-3">
//                             <div className="flex flex-wrap items-center gap-2">
//   {codStatusTabs.map((item) => {
//     const summary = codSummary?.[item.key] || {
//       count: 0,
//       amount: 0,
//     };

//     const isActive = selectedStatus === item.key;

//     return (
//       <Button
//         key={item.key}
//         onClick={() => {
//           setSelectedStatus(item.key);
//         }}
//         className={`
//           my-2 flex items-center gap-2 rounded-full border px-5 py-2.5
//           text-sm font-medium tracking-wide transition-all duration-300
//           ${
//             isActive
//               ? "border-[#0446DB] bg-[#0446DB] text-white shadow-sm"
//               : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:shadow-md hover:scale-[1.02] dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
//           }
//         `}
//       >
//         <span>{item.label}</span>
//         <span
//           className={`
//             text-xs
//             ${
//               isActive
//                 ? "text-blue-100"
//                 : "text-gray-400 dark:text-gray-500"
//             }
//           `}
//         >
//           ₹{Number(summary.amount || 0).toLocaleString("en-IN")}
//         </span>
//       </Button>
//     );
//   })}
// </div>
//                           </div>
//                         </div>
          
          
//                       </div>
//                     </div>

          

//         <div className="mx-1 z-10 bg-white dark:bg-gray-900 rounded-md">
//           {/* Table */}
//           <div className="max-w-full p-4  relative z-10 overflow-x-auto bg-white dark:bg-gray-900 rounded-xl shadow">
//             <Table>
//               <TableHeader >
//                 <TableRow>
//                   <TableHead className="px-6 py-3 text-left">VENDOR ID</TableHead>
//                   <TableHead className="px-6 py-3 text-left">AWB NUMBER</TableHead>
//                   <TableHead className="px-6 py-3 text-left">AMOUNT</TableHead>
//                   <TableHead className="px-6 py-3 text-left">UPLOAD DATE</TableHead>
//                   <TableHead className="px-6 py-3 text-left">UTR NUMBER</TableHead>
//                   <TableHead className="px-6 py-3 text-left">CSV FILE</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {
//                   loading ? (
//                     <>
//                       <TableRow>
//                         <TableCell colSpan={10} className="text-center py-10">
//                           <Loader2 className="h-8 w-8 animate-spin mx-auto" />
//                           <p className="mt-2">Loading orders...</p>
//                         </TableCell>
//                       </TableRow>
//                     </>
//                   ) : data.length == 0 ? (
//                     <>
//                       <TableRow>
//                         <TableCell colSpan={10} className="text-center py-10">
//                           No found
//                         </TableCell>
//                       </TableRow>
//                     </>
//                   ) : (
//                     data.map((d, index) => {
//                       console.log(d)
//                       return (
//                         <TableRow key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
//                           <TableCell className="px-6 py-4 dark:text-white">FP_{d.vendor_id}</TableCell>
//                           <TableCell className="px-6 py-4 dark:text-white">{d.awb_numbers.map((awb)=>{
//                             return (
//                               <span>
//                                 <span>{awb}</span> <br />
//                               </span>
//                             )
//                           })}</TableCell>
//                           <TableCell className="px-6 py-4 dark:text-white">{indianFormat(Number(d.amount))}</TableCell>
//                           <TableCell className="px-6 py-4 dark:text-white">
//                             {new Date(d.created_at).toLocaleString("en-IN", {
//                               timeZone: "Asia/Kolkata",
//                               day: "2-digit",
//                               month: "2-digit",
//                               year: "numeric",
//                               hour: "2-digit",
//                               minute: "2-digit",
//                               hour12: true,
//                             })}
//                           </TableCell>
//                           <TableCell className="px-6 py-4 dark:text-white">{d.utr_number}</TableCell>
//                           <TableCell className="px-6 py-4">
//                             <a
//                               href={`${baseURL}/${d.file_url}`}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="text-[#0446Db] hover:underline"
//                             >
//                               <FaFileDownload className="inline text-xl" />
//                             </a>
//                           </TableCell>
//                         </TableRow>
//                       );
//                     })
//                   )
//                 }

//               </TableBody>
//             </Table>
//           </div>

//           {/* Pagination */}
//           <div className="py-2 flex justify-end items-center gap-4">
//             <Button
//               onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
//               disabled={page === 1}
//               className={`px-4 py-2 rounded-sm text-sm font-medium ${page === 1
//                 ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                 : "bg-[#0446DB] text-white hover:bg-indigo-800"
//                 }`}
//             >
//               Previous
//             </Button>
//             <span className="text-gray-700">
//               Page {page} of {totalPages}
//             </span>
//             <Button
//               onClick={() =>
//                 setPage((prev) => Math.min(prev + 1, totalPages))
//               }
//               disabled={page === totalPages}
//               className={`px-4 py-2 rounded-sm text-sm font-medium ${page === totalPages
//                 ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                 : "bg-[#0446DB] text-white hover:bg-indigo-800"
//                 }`}
//             >
//               Next
//             </Button>
//           </div>
//         </div>
//       </div>
//         )
//        }


//     </>
//   );
// }

// export default RemittanceStatusVendor;




import { useState, useEffect } from "react";
import { FaFileDownload, FaFilter } from "react-icons/fa";
import { toast } from "react-toastify";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { Button } from "@/components/ui/button";

import {
  Loader2,
  ChevronDown,
  IndianRupee,
  Package,
  ReceiptIndianRupee,
  Clock3,
  CheckCircle2,
  RefreshCcw,
} from "lucide-react";

import AxiosInstance from "../../../Helper/axiosInstance";

const baseURL = import.meta.env.VITE_BASE_URL;

function RemittanceStatusVendor() {
  // =========================================================
  // STATES
  // =========================================================
   const [vendorList,setVendorList] = useState([])
  const [selectedStatus, setSelectedStatus] = useState("total");

  const [loading, setLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);

  const [data, setData] = useState([]);
  const [vendorCodSummary, setVendorCodSummary] = useState([]);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalPages, setTotalPages] = useState(1);

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [filterUpdate, setFilterUpdate] = useState(false);

  // Which table row dropdown is open
  const [openRow, setOpenRow] = useState(null);

  const [advanceFilters, setAdvanceFilters] = useState({
    startDate: "",
    endDate: "",
    vendor_id: "",
    awb_number:""
  });

  // =========================================================
  // STATUS TABS
  // =========================================================

  const codStatusTabs = [
    {
      key: "total",
      label: "All",
    },
    {
      key: "pending",
      label: "Pending",
    },
    {
      key: "initiated",
      label: "Initiated",
    },
    {
      key: "adjusted",
      label: "Adjusted",
    },
    {
      key: "received",
      label: "Received",
    },
  ];

  const codSummary = vendorCodSummary?.[0] || {};

  // =========================================================
  // DEFAULT DATE RANGE
  // =========================================================

  const resetAdvanceFilters = () => {
    const today = new Date();

    const oneMonthAgo = new Date();

    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    setAdvanceFilters({
      endDate: today.toISOString().split("T")[0],
      startDate: oneMonthAgo.toISOString().split("T")[0],
      vendor_id: "",
    });
  };

  const getVendorList = async()=>{
    try {
       const res = await AxiosInstance.get('api/admin/getAllVendors',{
        params:{
          limit:1000
        }
       })
       console.log(res.data?.data)
       setVendorList(res?.data?.data)
    } catch (error) {
      
    }
  }

  // =========================================================
  // INDIAN CURRENCY
  // =========================================================

  const indianFormat = (num) => {
    const amount = Number(num || 0);

    return amount.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    });
  };

  // =========================================================
  // DATE FORMAT
  // =========================================================

  const formatDate = (date) => {
    if (!date) return "-";

    try {
      return new Date(date).toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    } catch (error) {
      return "-";
    }
  };

  // =========================================================
  // OPEN DATE PICKER
  // =========================================================

  const openDatePicker = (event) => {
    try {
      event.currentTarget.showPicker?.();
    } catch {
      // Browser may block programmatic date picker.
    }
  };

  // =========================================================
  // UPDATE FILTER
  // =========================================================

  const updateAdvanceFilter = (name, value) => {
    setAdvanceFilters((prev) => {
      if (name === "startDate") {
        return {
          ...prev,

          startDate: value,

          endDate:
            prev.endDate && value && prev.endDate < value
              ? value
              : prev.endDate,
        };
      }

      if (name === "endDate") {
        return {
          ...prev,

          startDate:
            prev.startDate && value && prev.startDate > value
              ? value
              : prev.startDate,

          endDate: value,
        };
      }

      return {
        ...prev,
        [name]: value,
      };
    });
  };

  // =========================================================
  // APPLY FILTER
  // =========================================================

  const applyFilters = () => {
    if (
      advanceFilters.startDate &&
      advanceFilters.endDate &&
      advanceFilters.startDate > advanceFilters.endDate
    ) {
      toast.error("Start date cannot be after end date.");

      return;
    }

    setPage(1);

    setFilterUpdate(true);

    setIsFilterOpen(false);
  };

  // =========================================================
  // RESET FILTER
  // =========================================================

  const resetFilters = () => {
    resetAdvanceFilters();

    setPage(1);

    setFilterUpdate(true);

    setIsFilterOpen(false);
  };

  // =========================================================
  // FETCH DATA
  // =========================================================

  const fetchData = async () => {
    setLoading(true);

    try {
      const res = await AxiosInstance.get(
        "/api/admin/fetchVendorSubmittedRecords",
        {
          params: {
            page,
            limit,

            start_date: advanceFilters.startDate,

            end_date: advanceFilters.endDate,

            vendor_id: advanceFilters.vendor_id,
            awb_number : advanceFilters.awb_number,
            
            status:
              selectedStatus === "total"
                ? ""
                : selectedStatus,

          },
        }
      );

      console.log(
        "Vendor Remittance Response:",
        res?.data
      );

      console.log(
        "Vendor COD Summary:",
        res?.data?.vendorCodSummary
      );

      console.log(
        "Remittance Data:",
        res?.data?.data
      );

      setVendorCodSummary(
        res?.data?.vendorCodSummary || []
      );

      setData(res?.data?.data || []);

      setTotalPages(
        Math.max(
          1,
          Number(res?.data?.totalPages || 1)
        )
      );
    } catch (err) {
      console.error(
        "Fetch Vendor Remittance Error:",
        err
      );

      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch data"
      );

      setData([]);
      setVendorCodSummary([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INITIAL DATE
  // =========================================================

  useEffect(() => {
    resetAdvanceFilters();
    getVendorList()
  }, []);

  // =========================================================
  // FETCH ON PAGE CHANGE
  // =========================================================

  useEffect(() => {
    fetchData();
  }, [page,selectedStatus]);

  // =========================================================
  // FILTER UPDATE
  // =========================================================

  useEffect(() => {
    if (filterUpdate) {
      fetchData();

      setFilterUpdate(false);
    }
  }, [filterUpdate]);

  // =========================================================
  // PAGE LOADER
  // =========================================================

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingPage(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // =========================================================
  // STATUS CLICK
  // =========================================================

  const handleStatusChange = (status) => {
    setSelectedStatus(status);

    setPage(1);

    /*
     * Agar backend API selected status accept karti hai
     * to yahan:
     *
     * setFilterUpdate(true);
     *
     * kar dena.
     */
  };

  // =========================================================
  // FILE URL
  // =========================================================

  const getFileUrl = (fileUrl) => {
    if (!fileUrl) return "#";

    if (
      fileUrl.startsWith("http://") ||
      fileUrl.startsWith("https://")
    ) {
      return fileUrl;
    }

    // Windows "\" ko URL "/" me convert
    const normalizedPath = fileUrl.replaceAll(
      "\\",
      "/"
    );

    return `${baseURL}/${normalizedPath}`;
  };

  // =========================================================
  // FULL PAGE LOADER
  // =========================================================

  if (loadingPage) {
    return (
      <div className="flex h-[90vh] w-full items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#0446DB]" />

          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Loading Vendor Remittance Details...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen w-full bg-gray-100 dark:bg-gray-900">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="mb-0 py-2 dark:bg-gray-900">
        <div className="flex flex-wrap items-center justify-between gap-4">

          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Vendor Remittance Record
            </h1>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              View and manage vendor COD remittance records
            </p>
          </div>

          {/* =================================================
              FILTER DRAWER
          ================================================== */}

          <Drawer
            direction="right"
            open={isFilterOpen}
            onOpenChange={setIsFilterOpen}
          >
            <DrawerTrigger asChild>
              <Button
                variant="outline"
                className="flex items-center gap-2 rounded-sm bg-[#0446DB] px-5 py-2.5 font-medium text-white shadow transition hover:bg-blue-700 hover:text-white"
              >
                <FaFilter className="text-sm" />

                <span>Filter</span>
              </Button>
            </DrawerTrigger>

            <DrawerContent>

              <DrawerHeader>
                <DrawerTitle>
                  Filter Vendor Remittance
                </DrawerTitle>
              </DrawerHeader>

              <div className="p-4">

                <form
                  onSubmit={(e) => {
                    e.preventDefault();

                    applyFilters();
                  }}
                  className="flex w-full flex-col gap-5"
                >

                  {/* START DATE */}

                  <div className="w-full">
                    <label className="mb-1 block text-xs text-gray-600 dark:text-white">
                      Start Date
                    </label>

                    <input
                      type="date"
                      value={
                        advanceFilters.startDate
                      }
                      max={
                        advanceFilters.endDate ||
                        undefined
                      }
                      onChange={(e) =>
                        updateAdvanceFilter(
                          "startDate",
                          e.target.value
                        )
                      }
                      onClick={openDatePicker}
                      onFocus={openDatePicker}
                      className="flex w-full cursor-pointer rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#0446DB] dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    />
                  </div>

                  {/* END DATE */}

                  <div className="w-full">
                    <label className="mb-1 block text-xs text-gray-600 dark:text-white">
                      End Date
                    </label>

                    <input
                      type="date"
                      value={
                        advanceFilters.endDate
                      }
                      min={
                        advanceFilters.startDate ||
                        undefined
                      }
                      onChange={(e) =>
                        updateAdvanceFilter(
                          "endDate",
                          e.target.value
                        )
                      }
                      onClick={openDatePicker}
                      onFocus={openDatePicker}
                      className="flex w-full cursor-pointer rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#0446DB] dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    />
                  </div>
                  <div className="w-full">
                    <label className="mb-1 block text-xs text-gray-600 dark:text-white">
                      AWB Number
                    </label>

                    <input
                      type="text"
                      value={
                        advanceFilters.awb_number
                      }
                     
                      onChange={(e) =>
                        updateAdvanceFilter(
                          "awb_number",
                          e.target.value
                        )
                      }
                       placeholder="Enter AWB Numbers"
                      className="flex w-full cursor-pointer rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#0446DB] dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    />
                  </div>

                  {/* VENDOR ID */}

                  <div className="w-full">
                    <label className="mb-1 block text-xs text-gray-600 dark:text-white">
                      Vendor ID
                    </label>

                    <select name="" id=""
                    onChange={(e) =>
                        updateAdvanceFilter(
                          "vendor_id",
                          e.target.value
                        )
                      }
                     className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#0446DB] dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                    >
                      <option value="">Select a Vendor</option>
                      {
                        vendorList?.map((v)=>{
                       
                          return(
                             <option value={v.id}>{v.id}:{v?.vendor_name}</option>
                          )
                        })
                      }
                    </select>

                   
                  </div>

                  {/* BUTTONS */}

                  <div className="flex w-full gap-2">

                    <Button
                      type="submit"
                      className="flex-1 rounded-md bg-[#0446DB] px-4 py-2 text-sm text-white hover:bg-blue-700"
                    >
                      Apply Filter
                    </Button>

                    <Button
                      type="button"
                      onClick={resetFilters}
                      variant="outline"
                      className="flex-1 rounded-md"
                    >
                      Reset
                    </Button>

                  </div>

                </form>
              </div>

              <DrawerFooter>
                <Button
                  onClick={() =>
                    setIsFilterOpen(false)
                  }
                  variant="outline"
                >
                  Cancel
                </Button>
              </DrawerFooter>

            </DrawerContent>
          </Drawer>
        </div>
      </div>

      {/* =====================================================
          SUMMARY STATUS TABS
      ====================================================== */}

      <div className="w-full bg-white px-4 dark:bg-neutral-800">

        <div className="relative flex justify-center">

          <div className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 flex overflow-x-auto pb-2">

            <div className="mt-3 flex min-w-max gap-2 px-8">

              {codStatusTabs.map((item) => {
                const summary =
                  codSummary?.[item.key] || {
                    count: 0,
                    amount: 0,
                  };

                const isActive =
                  selectedStatus === item.key;

                return (
                  <Button
                    key={item.key}
                    type="button"
                    // onClick={() =>
                    //   handleStatusChange(
                    //     item.key
                    //   )
                    // }
                    className={`
                      my-2 flex items-center gap-2 rounded-full border
                      px-5 py-2.5 text-sm font-medium tracking-wide
                      transition-all duration-300
                      ${
                        true
                          ? "border-[#0446DB] bg-[#0446DB] text-white shadow-sm"
                          : "border-gray-200 bg-white text-gray-700 hover:scale-[1.02] hover:border-gray-300 hover:shadow-md dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                      }
                    `}
                  >
                    <span>
                      {item.label}
                    </span>


                    {/* AMOUNT */}

                    <span
                      className={`
                        text-xs
                        ${
                          true
                            ? "text-blue-100"
                            : "text-gray-400 dark:text-gray-500"
                        }
                      `}
                    >
                      {indianFormat(
                        summary.amount || 0
                      )}
                    </span>

                  </Button>
                );
              })}

            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          TABLE CONTAINER
      ====================================================== */}

      <div className="z-10 mx-1 rounded-md bg-white dark:bg-gray-900">

        <div className="relative z-10 max-w-full overflow-x-auto rounded-xl bg-white p-4 shadow dark:bg-gray-900">

          <Table>

            {/* =================================================
                TABLE HEADER
            ================================================== */}

            <TableHeader>

              <TableRow>

                <TableHead className="px-6 py-3 text-left">
                  VENDOR
                </TableHead>

                <TableHead className="px-6 py-3 text-left">
                  AWB NUMBER
                </TableHead>

                <TableHead className="px-6 py-3 text-left">
                  AMOUNT
                </TableHead>

                <TableHead className="px-6 py-3 text-left">
                  UPLOAD DATE
                </TableHead>

                <TableHead className="px-6 py-3 text-left">
                  UTR NUMBER
                </TableHead>

                <TableHead className="px-6 py-3 text-left">
                  ACTION
                </TableHead>

              </TableRow>

            </TableHeader>

            {/* =================================================
                TABLE BODY
            ================================================== */}

            <TableBody>

              {/* LOADING */}

              {loading ? (
                <TableRow>

                  <TableCell
                    colSpan={6}
                    className="py-14 text-center"
                  >
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#0446DB]" />

                    <p className="mt-2 text-sm text-gray-500">
                      Loading remittance records...
                    </p>
                  </TableCell>

                </TableRow>
              ) : data.length === 0 ? (

                /* EMPTY */

                <TableRow>

                  <TableCell
                    colSpan={6}
                    className="py-14 text-center"
                  >
                    <ReceiptIndianRupee className="mx-auto h-9 w-9 text-gray-300" />

                    <p className="mt-2 font-medium text-gray-600 dark:text-gray-300">
                      No remittance records found
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Try changing your filter
                    </p>
                  </TableCell>

                </TableRow>
              ) : (

                /* =============================================
                   DATA
                ============================================== */

                data.map((d) => {
                  const isOpen =
                    openRow === d.id;

                  return (
                    <>
                      {/* =========================================
                          MAIN ROW
                      ========================================== */}

                      <TableRow
                        key={`main-${d.id}`}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800"
                      >

                        {/* VENDOR */}

                        <TableCell className="px-6 py-4">

                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              FP_{d.vendor_id}
                            </p>

                            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                              {d.vendor_name ||
                                "-"}
                            </p>
                          </div>

                        </TableCell>

                        {/* AWB */}

                        <TableCell className="px-6 py-4 dark:text-white">

                          <div className="space-y-1">

                            {d.awb_numbers
                              ?.slice(0, 2)
                              .map((awb) => (
                                <div
                                  key={awb}
                                  className="text-sm"
                                >
                                  {awb}
                                </div>
                              ))}

                            {d.awb_numbers?.length >
                              2 && (
                              <button
                                type="button"
                                onClick={() =>
                                  setOpenRow(
                                    isOpen
                                      ? null
                                      : d.id
                                  )
                                }
                                className="text-xs font-medium text-[#0446DB]"
                              >
                                +
                                {d.awb_numbers
                                  .length - 2}{" "}
                                more
                              </button>
                            )}

                          </div>

                        </TableCell>

                        {/* AMOUNT */}

                        <TableCell className="px-6 py-4">

                          <p className="font-semibold text-gray-900 dark:text-white">
                            {indianFormat(
                              d.total_cod_amount ||
                                d.submitted_amount ||
                                0
                            )}
                          </p>

                          <p className="mt-1 text-xs text-gray-400">
                            {d.cod_order_count ||
                              0}{" "}
                            Orders
                          </p>

                        </TableCell>

                        {/* DATE */}

                        <TableCell className="px-6 py-4 text-sm text-gray-700 dark:text-gray-300">
                          {formatDate(
                            d.created_at
                          )}
                        </TableCell>

                        {/* UTR */}

                        <TableCell className="px-6 py-4">

                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {d.utr_number ||
                              "-"}
                          </span>

                        </TableCell>

                        {/* ACTION */}

                        <TableCell className="px-6 py-4">

                          <div className="flex items-center gap-2">

                            {/* DOWNLOAD */}

                            {d.file_url && (
                              <a
                                href={getFileUrl(
                                  d.file_url
                                )}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Download CSV"
                                className="
                                  flex h-9 w-9
                                  items-center justify-center
                                  rounded-md border
                                  border-gray-200
                                  bg-white text-[#0446DB]
                                  transition
                                  hover:border-[#0446DB]
                                  hover:bg-blue-50
                                  dark:border-gray-700
                                  dark:bg-gray-800
                                "
                              >
                                <FaFileDownload className="text-lg" />
                              </a>
                            )}

                            {/* DROPDOWN */}

                            <button
                              type="button"
                              title="View Details"
                              onClick={() =>
                                setOpenRow(
                                  isOpen
                                    ? null
                                    : d.id
                                )
                              }
                              className="
                                flex h-9 w-9
                                items-center justify-center
                                rounded-md border
                                border-gray-200
                                bg-white text-gray-600
                                transition
                                hover:border-[#0446DB]
                                hover:bg-blue-50
                                hover:text-[#0446DB]
                                dark:border-gray-700
                                dark:bg-gray-800
                                dark:text-gray-300
                              "
                            >
                              <ChevronDown
                                size={18}
                                className={`
                                  transition-transform
                                  duration-300
                                  ${
                                    isOpen
                                      ? "rotate-180"
                                      : ""
                                  }
                                `}
                              />
                            </button>

                          </div>

                        </TableCell>

                      </TableRow>

                      {/* =========================================
                          DROPDOWN ROW
                      ========================================== */}

                      {isOpen && (
                        <TableRow
                          key={`details-${d.id}`}
                        >

                          <TableCell
                            colSpan={6}
                            className="bg-gray-50 p-0 dark:bg-gray-950"
                          >

                            <div className="p-5">

                              {/* =================================
                                  DROPDOWN HEADER
                              ================================== */}

                              <div className="mb-5 flex flex-wrap items-center justify-between gap-4">

                                {/* <div>

                                  <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                                    Remittance Details
                                  </p>

                                  <h3 className="mt-1 text-base font-semibold text-gray-900 dark:text-white">
                                    {d.vendor_name ||
                                      "Vendor"}
                                  </h3>

                                  <p className="mt-1 text-xs text-gray-500">
                                    FP_
                                    {d.vendor_id} •
                                    Record #{d.id}
                                  </p>

                                </div> */}

                                {/* <div className="text-right">

                                  <p className="text-xs text-gray-500">
                                    Total COD Amount
                                  </p>

                                  <p className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
                                    {indianFormat(
                                      d.total_cod_amount ||
                                        0
                                    )}
                                  </p>

                                </div> */}

                              </div>

                              {/* =================================
                                  STATUS CARDS
                              ================================== */}

                              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">

                                {/* TOTAL */}

                                {/* <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">

                                  <div className="flex items-center justify-between">

                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                      Total
                                    </p>

                                    <IndianRupee className="h-4 w-4 text-gray-400" />

                                  </div>

                                  <p className="mt-3 text-lg font-bold text-gray-900 dark:text-white">
                                    {indianFormat(
                                      d.total_cod_amount ||
                                        0
                                    )}
                                  </p>

                                  <p className="mt-1 text-xs text-gray-500">
                                    {d.cod_order_count ||
                                      0}{" "}
                                    Orders
                                  </p>

                                </div> */}

                                {/* PENDING */}

                                {/* <div className="rounded-xl border border-orange-100 bg-orange-50/40 p-4 dark:border-orange-500/20 dark:bg-orange-500/5">

                                  <div className="flex items-center justify-between">

                                    <p className="text-xs font-semibold uppercase tracking-wide text-orange-600">
                                      Pending
                                    </p>

                                    <Clock3 className="h-4 w-4 text-orange-500" />

                                  </div>

                                  <p className="mt-3 text-lg font-bold text-orange-600">
                                    {indianFormat(
                                      d.pending_amount ||
                                        0
                                    )}
                                  </p>

                                  <p className="mt-1 text-xs text-gray-500">
                                    {Number(
                                      d.pending_count ||
                                        0
                                    )}{" "}
                                    Orders
                                  </p>

                                </div> */}

                                {/* INITIATED */}

                                {/* <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4 dark:border-blue-500/20 dark:bg-blue-500/5">

                                  <div className="flex items-center justify-between">

                                    <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                                      Initiated
                                    </p>

                                    <RefreshCcw className="h-4 w-4 text-blue-500" />

                                  </div>

                                  <p className="mt-3 text-lg font-bold text-blue-600">
                                    {indianFormat(
                                      d.initiated_amount ||
                                        0
                                    )}
                                  </p>

                                  <p className="mt-1 text-xs text-gray-500">
                                    {Number(
                                      d.initiated_count ||
                                        0
                                    )}{" "}
                                    Orders
                                  </p>

                                </div> */}

                                {/* RECEIVED */}

                                {/* <div className="rounded-xl border border-green-100 bg-green-50/40 p-4 dark:border-green-500/20 dark:bg-green-500/5">

                                  <div className="flex items-center justify-between">

                                    <p className="text-xs font-semibold uppercase tracking-wide text-green-600">
                                      Received
                                    </p>

                                    <CheckCircle2 className="h-4 w-4 text-green-500" />

                                  </div>

                                  <p className="mt-3 text-lg font-bold text-green-600">
                                    {indianFormat(
                                      d.received_amount ||
                                        0
                                    )}
                                  </p>

                                  <p className="mt-1 text-xs text-gray-500">
                                    {Number(
                                      d.received_count ||
                                        0
                                    )}{" "}
                                    Orders
                                  </p>

                                </div> */}

                                {/* ADJUSTED */}

                                {/* <div className="rounded-xl border border-purple-100 bg-purple-50/40 p-4 dark:border-purple-500/20 dark:bg-purple-500/5">

                                  <div className="flex items-center justify-between">

                                    <p className="text-xs font-semibold uppercase tracking-wide text-purple-600">
                                      Adjusted
                                    </p>

                                    <Package className="h-4 w-4 text-purple-500" />

                                  </div>

                                  <p className="mt-3 text-lg font-bold text-purple-600">
                                    {indianFormat(
                                      d.adjusted_amount ||
                                        0
                                    )}
                                  </p>

                                  <p className="mt-1 text-xs text-gray-500">
                                    {Number(
                                      d.adjusted_count ||
                                        0
                                    )}{" "}
                                    Orders
                                  </p>

                                </div> */}

                              </div>

                              {/* =================================
                                  OTHER DETAILS
                              ================================== */}

                              

                              {/* =================================
                                  AWB NUMBERS
                              ================================== */}

                              <div className="mt-5 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-900">

                                <div className="mb-3 flex items-center justify-between">

                                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    AWB Numbers
                                  </p>

                                  <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                                    {d.awb_numbers
                                      ?.length ||
                                      0}
                                  </span>

                                </div>

                                <div className="flex flex-wrap gap-2">

                                  {d.awb_numbers
                                    ?.length >
                                  0 ? (

                                    d.awb_numbers.map(
                                      (awb) => (
                                        <span
                                          key={
                                            awb
                                          }
                                          className="
                                            rounded-md
                                            border
                                            border-blue-100
                                            bg-blue-50
                                            px-3 py-1.5
                                            text-xs
                                            font-medium
                                            text-[#0446DB]
                                            dark:border-blue-900
                                            dark:bg-blue-950
                                            dark:text-blue-400
                                          "
                                        >
                                          {awb}
                                        </span>
                                      )
                                    )

                                  ) : (

                                    <span className="text-sm text-gray-500">
                                      No AWB
                                      numbers
                                    </span>

                                  )}

                                </div>

                              </div>

                              {/* =================================
                                  FILE
                              ================================== */}

                              

                            </div>

                          </TableCell>

                        </TableRow>
                      )}
                    </>
                  );
                })
              )}

            </TableBody>

          </Table>

        </div>

        {/* =====================================================
            PAGINATION
        ====================================================== */}

        <div className="flex items-center justify-center gap-4 py-4">

          <Button
            type="button"
            onClick={() =>
              setPage((prev) =>
                Math.max(prev - 1, 1)
              )
            }
            disabled={page === 1}
            className={`
              rounded-sm px-4 py-2
              text-sm font-medium
              ${
                page === 1
                  ? "cursor-not-allowed bg-gray-300 text-gray-500"
                  : "bg-[#0446DB] text-white hover:bg-blue-700"
              }
            `}
          >
            Previous
          </Button>

          <span className="text-sm text-gray-700 dark:text-gray-300">
            Page{" "}
            <span className="font-semibold">
              {page}
            </span>{" "}
            of{" "}
            <span className="font-semibold">
              {totalPages}
            </span>
          </span>

          <Button
            type="button"
            onClick={() =>
              setPage((prev) =>
                Math.min(
                  prev + 1,
                  totalPages
                )
              )
            }
            disabled={page === totalPages}
            className={`
              rounded-sm px-4 py-2
              text-sm font-medium
              ${
                page === totalPages
                  ? "cursor-not-allowed bg-gray-300 text-gray-500"
                  : "bg-[#0446DB] text-white hover:bg-blue-700"
              }
            `}
          >
            Next
          </Button>

        </div>

      </div>

    </div>
  );
}

export default RemittanceStatusVendor;
