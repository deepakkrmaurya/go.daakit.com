
// "use client";

// import { useState, useRef, useEffect } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";

// import {
//   Search,
//   ChevronDown,
//   Package,
//   Hash,
//   X,
//   Loader2,
//   Check,
//   Inbox,
// } from "lucide-react";

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// import {
//   InputGroup,
//   InputGroupAddon,
//   InputGroupButton,
//   InputGroupInput,
// } from "@/components/ui/input-group";
// import AxiosInstance from "../../Helper/axiosInstance";
// import { useNavigate } from "react-router-dom";

// const baseURL = import.meta.env.VITE_BASE_URL;

// // Replace with your actual backend endpoint
// const SEARCH_API = "/api/orders";

// const searchOptions = [
//   {
//     label: "AWB Number",
//     value: "awb_number",
//     icon: Package,
//   },
  
// ];

// export default function OrderSearch() {
//   const [searchType, setSearchType] = useState("awb_number");
//   const [searchValue, setSearchValue] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [orders, setOrders] = useState([]);
//   const [hasSearched, setHasSearched] = useState(false);

//   const requestRef = useRef(null);
//   const inputRef = useRef(null);

//   useEffect(() => {
//     return () => {
//       requestRef.current?.abort();
//     };
//   }, []);

//   const selectedOption =
//     searchOptions.find((item) => item.value === searchType) ||
//     searchOptions[0];

//   const SelectedIcon = selectedOption.icon;
//   const trimmedValue = searchValue.trim();

//   // -----------------------------
//   // Validation
//   // -----------------------------
//   const validateSearch = (value, type = searchType) => {
//     const trimmed = value.trim();

//     if (!trimmed) {
//       return "Please enter a search value";
//     }

//     if (trimmed.length > 100) {
//       return "Maximum 100 characters allowed";
//     }

//     if (type === "order_id") {
//       if (!/^\d+$/.test(trimmed)) {
//         return "Order ID must contain numbers only";
//       }
//     }

//     if (type === "awb_number") {
//       if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
//         return "AWB Number can contain letters, numbers, hyphens and underscores only";
//       }
//     }

//     return "";
//   };

//   const validationError = trimmedValue
//     ? validateSearch(trimmedValue)
//     : "";

//   const isSearchDisabled =
//     loading || !trimmedValue || !!validationError;

//   // -----------------------------
//   // Input Change
//   // -----------------------------
//   const handleInputChange = (e) => {
//     const value = e.target.value;

//     if (value.length > 100) return;

//     setSearchValue(value);
//     setError("");
//   };

//   const navigate = useNavigate()

//   // -----------------------------
//   // API Search
//   // -----------------------------
//   const fetchOrders = async (params) => {
//     if (requestRef.current) return;

//     const controller = new AbortController();
//     requestRef.current = controller;

//     setLoading(true);
//     setError("");
//     setHasSearched(false);

//     try {
//       const token = localStorage.getItem("token");

//       if (!token) {
//         throw new Error("Session expired. Please login again.");
//       }

      


//       const {data} = await AxiosInstance.get(`/api/admin/getAwbCompleteHistory/${params?.awb_number}`)

    
//        const {awb_number} = data.data?.order
//        navigate(`/admin/order-history?awb_number=${awb_number}`)
//        setSearchValue("")

     
//     } catch (err) {
//       if (axios.isCancel(err)) return;

//       setOrders([]);
//       setHasSearched(false);

//       const message =
//         err?.response?.data?.message ||
//         err?.message ||
//         "Failed to search orders";

//       setError(message);
//       toast.error(message);
//     } finally {
//       if (requestRef.current === controller) {
//         requestRef.current = null;
//         setLoading(false);
//       }
//     }
//   };

//   // -----------------------------
//   // Search Submit
//   // -----------------------------
//   const handleSearch = async (e) => {
//     e.preventDefault();

//     if (loading || requestRef.current) return;

//     const value = searchValue.trim();
//     const message = validateSearch(value);

//     if (message) {
//       setError(message);
//       return;
//     }

//     setError("");

//     await fetchOrders({
//       [searchType]: value,
//     });
//   };

//   // -----------------------------
//   // Clear Search
//   // -----------------------------
//   const handleClear = () => {
//     if (loading) return;

//     setSearchValue("");
//     setError("");
//     setOrders([]);
//     setHasSearched(false);

//     inputRef.current?.focus();
//   };

//   // -----------------------------
//   // Change Search Type
//   // -----------------------------
//   const handleSearchTypeChange = (type) => {
//     if (loading) return;

//     setSearchType(type);
//     setSearchValue("");
//     setError("");
//     setOrders([]);
//     setHasSearched(false);

//     inputRef.current?.focus();
//   };

//   return (
//     <div className="w-full space-y-4">
//       {/* ================= SEARCH FORM ================= */}
//       <form
//         onSubmit={handleSearch}
//         className="w-full max-w-xl"
//         noValidate
//       >
//         <InputGroup
//           className="
//             !h-11 !w-full !rounded-lg
//             !border !border-gray-300
//             !bg-white shadow-sm
//             transition-all duration-200
//             hover:!border-blue-300
//             focus-within:!border-[#0446DB]
//             focus-within:!ring-2
//             focus-within:!ring-blue-500/15
//             dark:!border-gray-600
//             dark:!bg-gray-900
//             dark:hover:!border-blue-500
//           "
//         >
//           {/* Search Type Dropdown */}
//           <InputGroupAddon align="inline-start">
//             <DropdownMenu>
//               <DropdownMenuTrigger asChild>
//                 <InputGroupButton
//                   type="button"
//                   variant="ghost"
//                   disabled={loading}
//                   className="
//                     flex h-9 shrink-0 items-center
//                     gap-2 rounded-md px-3
//                     text-sm font-medium
//                     !text-gray-800
//                     !opacity-100
//                     transition-colors
//                     hover:!bg-blue-50
//                     hover:!text-[#0446DB]
//                     dark:!text-gray-200
//                     dark:hover:!bg-gray-800
//                     disabled:cursor-not-allowed
//                   "
//                 >
//                   <SelectedIcon
//                     className="
//                       h-[17px] w-[17px]
//                       shrink-0 text-[#0446DB]
//                       dark:text-blue-400
//                     "
//                   />

//                   <span className="whitespace-nowrap">
//                     {selectedOption.label}
//                   </span>

//                   <ChevronDown
//                     className="
//                       h-4 w-4 shrink-0
//                       text-gray-500
//                       dark:text-gray-400
//                     "
//                   />
//                 </InputGroupButton>
//               </DropdownMenuTrigger>

//               <DropdownMenuContent
//                 align="start"
//                 sideOffset={8}
//                 className="
//                   z-50 w-48 rounded-lg
//                   border border-gray-200
//                   bg-white p-1.5 shadow-xl
//                   dark:border-gray-700
//                   dark:bg-gray-900
//                 "
//               >
//                 {searchOptions.map((item) => {
//                   const Icon = item.icon;
//                   const isSelected = searchType === item.value;

//                   return (
//                     <DropdownMenuItem
//                       key={item.value}
//                       onSelect={() =>
//                         handleSearchTypeChange(item.value)
//                       }
//                       className="
//                         flex cursor-pointer
//                         items-center justify-between
//                         gap-2 rounded-md
//                         px-3 py-2.5 text-sm
//                         font-medium
//                         text-gray-700
//                         focus:bg-blue-50
//                         focus:text-[#0446DB]
//                         dark:text-gray-200
//                         dark:focus:bg-gray-800
//                       "
//                     >
//                       <div className="flex items-center gap-2.5">
//                         <Icon
//                           className={`h-4 w-4 ${
//                             isSelected
//                               ? "text-[#0446DB]"
//                               : "text-gray-500"
//                           }`}
//                         />

//                         <span>{item.label}</span>
//                       </div>

//                       {isSelected && (
//                         <Check className="h-4 w-4 text-[#0446DB]" />
//                       )}
//                     </DropdownMenuItem>
//                   );
//                 })}
//               </DropdownMenuContent>
//             </DropdownMenu>
//           </InputGroupAddon>

//           {/* Divider */}
//           <div
//             className="
//               h-6 w-px shrink-0
//               bg-gray-300
//               dark:bg-gray-700
//             "
//           />

//           {/* Search Input */}
//           <InputGroupInput
//             ref={inputRef}
//             type="text"
//             value={searchValue}
//             onChange={handleInputChange}
//             placeholder={`Search by ${selectedOption.label}...`}
//             maxLength={100}
//             autoComplete="off"
//             spellCheck={false}
//             aria-label={`Search by ${selectedOption.label}`}
//             aria-invalid={!!error || !!validationError}
//             className="
//               h-full min-w-0 flex-1
//               !bg-transparent px-3
//               text-sm font-medium
//               !text-gray-900
//               !opacity-100
//               placeholder:!text-gray-500
//               focus:!outline-none
//               dark:!text-white
//               dark:placeholder:!text-gray-400
//             "
//           />

//           {/* Clear Button */}
//           {searchValue.length > 0 && (
//             <InputGroupAddon align="inline-end">
//               <InputGroupButton
//                 type="button"
//                 variant="ghost"
//                 size="icon-xs"
//                 disabled={loading}
//                 onClick={handleClear}
//                 aria-label="Clear search"
//                 className="
//                   flex h-7 w-7 shrink-0
//                   items-center justify-center
//                   rounded-md
//                   !text-gray-500
//                   !opacity-100
//                   hover:!bg-gray-100
//                   hover:!text-gray-800
//                   dark:!text-gray-400
//                   dark:hover:!bg-gray-800
//                   dark:hover:!text-white
//                 "
//               >
//                 <X className="h-4 w-4" />
//               </InputGroupButton>
//             </InputGroupAddon>
//           )}

//           {/* Search Button */}
//           <InputGroupAddon align="inline-end">
//             <InputGroupButton
//               type="submit"
//               disabled={isSearchDisabled}
//               aria-label="Search orders"
//               className={`
//                 mr-1 flex h-9 shrink-0
//                 items-center justify-center
//                 gap-2 rounded-md px-4
//                 text-sm font-semibold
//                 transition-all duration-200

//                 ${
//                   isSearchDisabled
//                     ? `
//                       !cursor-not-allowed
//                       !bg-blue-50
//                       !text-blue-400
//                       !opacity-100
//                       !shadow-none
//                       dark:!bg-blue-950/40
//                       dark:!text-blue-400
//                     `
//                     : `
//                       !cursor-pointer
//                       !bg-[#0446DB]
//                       !text-white
//                       !opacity-100
//                       shadow-sm
//                       hover:!bg-[#0339B5]
//                       hover:!text-white
//                       hover:shadow-md
//                       active:scale-[0.98]
//                     `
//                 }
//               `}
//             >
//               {loading ? (
//                 <Loader2 className="h-4 w-4 animate-spin" />
//               ) : (
//                 <Search className="h-4 w-4" />
//               )}

//               <span>
//                 {loading ? "Searching..." : "Search"}
//               </span>
//             </InputGroupButton>
//           </InputGroupAddon>
//         </InputGroup>

//         {/* Validation Error */}
//         {/* {(error || validationError) && (
//           <p
//             role="alert"
//             className="
//               mt-1.5 text-xs
//               font-medium text-red-500
//             "
//           >
//             {error || validationError}
//           </p>
//         )} */}
//       </form>

//       {/* ================= SEARCH RESULTS ================= */}
//       {hasSearched && (
//         <div
//           className="
//             overflow-hidden rounded-lg
//             border border-gray-200
//             bg-white shadow-sm
//             dark:border-gray-700
//             dark:bg-gray-900
//           "
//         >
//           {/* Results Header */}
//           <div
//             className="
//               flex items-center
//               justify-between gap-3
//               border-b border-gray-200
//               px-4 py-3
//               dark:border-gray-700
//             "
//           >
//             <div className="flex items-center gap-2">
//               <Package className="h-4 w-4 text-[#0446DB]" />

//               <h3
//                 className="
//                   text-sm font-semibold
//                   text-gray-900
//                   dark:text-white
//                 "
//               >
//                 Search Results
//               </h3>
//             </div>

//             <span
//               className="
//                 rounded-full
//                 bg-blue-50 px-3 py-1
//                 text-xs font-semibold
//                 text-[#0446DB]
//                 dark:bg-blue-950/40
//                 dark:text-blue-400
//               "
//             >
//               {orders.length} orders found
//             </span>
//           </div>

//           {/* Results Table */}
//           <div className="w-full overflow-x-auto">
//             <table className="w-full text-left text-sm">
//               <thead
//                 className="
//                   bg-gray-50
//                   text-xs font-semibold
//                   text-gray-600
//                   dark:bg-gray-800
//                   dark:text-gray-300
//                 "
//               >
//                 <tr>
//                   <th className="whitespace-nowrap px-4 py-3">
//                     #
//                   </th>

//                   <th className="whitespace-nowrap px-4 py-3">
//                     Order ID
//                   </th>

//                   <th className="whitespace-nowrap px-4 py-3">
//                     AWB Number
//                   </th>

//                   <th className="whitespace-nowrap px-4 py-3">
//                     Status
//                   </th>
//                 </tr>
//               </thead>

//               <tbody
//                 className="
//                   divide-y divide-gray-100
//                   dark:divide-gray-800
//                 "
//               >
//                 {orders.length > 0 ? (
//                   orders.map((order, index) => (
//                     <tr
//                       key={order.id ?? order.order_id ?? index}
//                       className="
//                         text-gray-700
//                         transition-colors
//                         hover:bg-blue-50/50
//                         dark:text-gray-200
//                         dark:hover:bg-gray-800/60
//                       "
//                     >
//                       <td className="px-4 py-3">
//                         {index + 1}
//                       </td>

//                       <td className="px-4 py-3 font-medium">
//                         {order.id ?? order.order_id ?? "—"}
//                       </td>

//                       <td className="px-4 py-3">
//                         {order.awb_number ??
//                           order.tpc_awb_number ??
//                           "—"}
//                       </td>

//                       <td className="px-4 py-3">
//                         <span
//                           className="
//                             inline-flex rounded-full
//                             bg-gray-100 px-2.5 py-1
//                             text-xs font-medium
//                             text-gray-700
//                             dark:bg-gray-800
//                             dark:text-gray-200
//                           "
//                         >
//                           {order.order_status ??
//                             order.status ??
//                             "—"}
//                         </span>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td
//                       colSpan={4}
//                       className="px-4 py-10 text-center"
//                     >
//                       <Inbox
//                         className="
//                           mx-auto mb-2
//                           h-8 w-8
//                           text-gray-400
//                         "
//                       />

//                       <p className="text-sm text-gray-500">
//                         No orders found
//                       </p>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }






"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { 
  Search, 
  ChevronDown, 
  Package, 
  X, 
  Loader2, 
  Inbox, 
  ArrowLeft,
  Check
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AxiosInstance from "../../Helper/axiosInstance";
import { useNavigate } from "react-router-dom";

const searchOptions = [
  {
    label: "AWB Number",
    value: "awb_number",
    icon: Package,
  },
];

export default function OrderSearch({ onClose, autoFocusMobile = false ,role}) {
  const [searchType, setSearchType] = useState("awb_number");
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [orders, setOrders] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  

  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(autoFocusMobile);

  const requestRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (autoFocusMobile && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
    return () => {
      requestRef.current?.abort();
    };
  }, [autoFocusMobile]);

  const selectedOption =
    searchOptions.find((item) => item.value === searchType) || searchOptions[0];

  const trimmedValue = searchValue.trim();

  const validateSearch = (value, type = searchType) => {
    const trimmed = value.trim();
    if (!trimmed) return "Please enter a search value";
    if (trimmed.length > 100) return "Maximum 100 characters allowed";
    if (type === "awb_number") {
      if (!/^[a-zA-Z0-9_-]+$/.test(trimmed)) {
        return "AWB Number can contain letters, numbers, hyphens and underscores only";
      }
    }
    return "";
  };

  const validationError = trimmedValue ? validateSearch(trimmedValue) : "";
  const isSearchDisabled = loading || !trimmedValue || !!validationError;

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value.length > 100) return;
    setSearchValue(value);
    setError("");
  };

  const fetchOrders = async (params) => {
    if (requestRef.current) return;
    const controller = new AbortController();
    requestRef.current = controller;

    setLoading(true);
    setError("");
    setHasSearched(false);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Session expired. Please login again.");
      
      if(["customer", "operations", "support", "finance", "sales", "marketing"].includes(role)){
       const { data } = await AxiosInstance.get(
        `/api/user/getAwbCompleteHistory/${params?.awb_number}`
      );

      const { awb_number } = data.data?.order;
      navigate(`/user/order-history?awb_number=${awb_number}`);
      setSearchValue("");
      setIsMobileSearchOpen(false); 
      
      if (onClose) onClose();
      }else{
        const { data } = await AxiosInstance.get(
        `/api/admin/getAwbCompleteHistory/${params?.awb_number}`
      );

      const { awb_number } = data.data?.order;
      navigate(`/admin/order-history?awb_number=${awb_number}`);
      setSearchValue("");
      setIsMobileSearchOpen(false); 
      
      if (onClose) onClose();
      }

      

    } catch (err) {
      if (axios.isCancel(err)) return;
      setOrders([]);
      setHasSearched(false);
      const message =
        err?.response?.data?.message || err?.message || "Failed to search orders";
      setError(message);
      toast.error(message);
    } finally {
      if (requestRef.current === controller) {
        requestRef.current = null;
        setLoading(false);
      }
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (loading || requestRef.current) return;
    const value = searchValue.trim();
    const message = validateSearch(value);
    if (message) {
      setError(message);
      return;
    }
    setError("");
    await fetchOrders({ [searchType]: value });
  };

  const handleClear = () => {
    if (loading) return;
    setSearchValue("");
    setError("");
    setOrders([]);
    setHasSearched(false);
    inputRef.current?.focus();
  };

  const handleCloseMobile = () => {
    setIsMobileSearchOpen(false);
    if (onClose) onClose();
  };


  const SearchTypeDropdown = ({ className = "" }) => {
    const SelectedIcon = selectedOption.icon;
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={`
              inline-flex h-full items-center justify-between gap-1.5
              rounded-l-xl px-3 text-sm font-semibold text-[#0446DB]
              hover:bg-blue-50/50 focus:outline-none 
              dark:text-blue-400 dark:hover:bg-neutral-800/50
              ${className}
            `}
          >
            <span className="flex items-center gap-1.5">
              <SelectedIcon className="h-4 w-4" />
              <span>{selectedOption.label}</span>
            </span>
            <ChevronDown className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          className="min-w-[180px] rounded-sm border border-gray-100 bg-white p-1.5 shadow-xl dark:border-neutral-700 dark:bg-neutral-900 z-[999]"
        >
          {searchOptions.map((item) => {
            const Icon = item.icon;
            const isSelected = searchType === item.value;

            return (
              <DropdownMenuItem
                key={item.value}
                onSelect={() => {
                  setSearchType(item.value);
                  if (inputRef.current) inputRef.current.focus();
                }}
                className="
                  flex cursor-pointer items-center justify-between
                  gap-2 rounded-lg px-3 py-2.5
                  text-sm font-medium text-gray-700
                  focus:bg-blue-50 focus:text-[#0446DB]
                  dark:text-gray-200 dark:focus:bg-neutral-800
                  dark:focus:text-blue-400
                "
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`h-4 w-4 ${isSelected ? "text-[#0446DB]" : "text-gray-500"}`} />
                  <span>{item.label}</span>
                </div>
                {isSelected && <Check className="h-4 w-4 text-[#0446DB]" strokeWidth={3} />}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div className="w-full">
      
      {/* ================= MOBILE VIEW (Jio Style Overlay) ================= */}
      <div className="block md:hidden">
        {!isMobileSearchOpen ? (
          <button
            type="button"
            onClick={() => {
              setIsMobileSearchOpen(true);
              setTimeout(() => inputRef.current?.focus(), 100);
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-neutral-800 transition-colors"
          >
            <Search className="h-5 w-5" />
          </button>
        ) : (
          <div className="fixed inset-0 z-[999] flex flex-col bg-white dark:bg-neutral-950">
            
            {/* Search Header */}
            <div className="flex items-center gap-2 border-b border-gray-100 px-4 py-3 dark:border-neutral-800">
              <button
                type="button"
                onClick={handleCloseMobile}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-neutral-800"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <form onSubmit={handleSearch} className="relative flex h-11 w-full items-center rounded-full border border-[#0446DB] bg-white pr-1.5 dark:border-blue-500 dark:bg-neutral-900">
                
                {/* ✅ Mobile Dropdown (Compact Width) */}
                <div className="h-full flex items-center shrink-0 max-w-[140px]">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className="flex h-full items-center justify-between gap-1 rounded-l-full px-2 text-xs font-semibold text-[#0446DB] focus:outline-none dark:text-blue-400"
                      >
                        <span className="flex items-center gap-1.5">
                          <Package className="h-3.5 w-3.5" />
                          <span className="truncate">{selectedOption.label}</span>
                        </span>
                        <ChevronDown className="h-3.5 w-3.5 shrink-0" />
                      </button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent
                      align="start"
                      className="min-w-[180px] rounded-sm border border-gray-100 bg-white p-1.5 shadow-xl dark:border-neutral-700 dark:bg-neutral-900 z-[999]"
                    >
                      {searchOptions.map((item) => {
                        const Icon = item.icon;
                        const isSelected = searchType === item.value;

                        return (
                          <DropdownMenuItem
                            key={item.value}
                            onSelect={() => {
                              setSearchType(item.value);
                              if (inputRef.current) inputRef.current.focus();
                            }}
                            className="flex cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 focus:bg-blue-50 focus:text-[#0446DB] dark:text-gray-200 dark:focus:bg-neutral-800 dark:focus:text-blue-400"
                          >
                            <div className="flex items-center gap-2.5">
                              <Icon className={`h-4 w-4 ${isSelected ? "text-[#0446DB]" : "text-gray-500"}`} />
                              <span>{item.label}</span>
                            </div>
                            {isSelected && <Check className="h-4 w-4 text-[#0446DB]" strokeWidth={3} />}
                          </DropdownMenuItem>
                        );
                      })}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Divider */}
                <div className="h-5 w-px shrink-0 bg-gray-200 dark:bg-neutral-700" />

                {/* ✅ Search Input (With Full Placeholder) */}
                <input
                  ref={inputRef}
                  type="text"
                  value={searchValue}
                  onChange={handleInputChange}
                  placeholder="Search By AWB......"
                  className="h-full w-full min-w-0 bg-transparent px-2 text-xs font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none dark:text-white"
                />

                {searchValue.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="mr-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-neutral-800"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}

                <button
                  type="submit"
                  disabled={isSearchDisabled}
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    isSearchDisabled ? "text-gray-400" : "bg-[#0446DB] text-white"
                  }`}
                >
                  {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-4 w-4" />}
                </button>
              </form>
            </div>

            {/* Search Body (Quick Links) */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Quick links
              </h3>
              <div className="flex flex-col">
                {searchOptions.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSearchType(item.value);
                      setTimeout(() => inputRef.current?.focus(), 100);
                    }}
                    className="flex w-full items-center border-b border-gray-100 py-4 text-left text-sm font-medium text-gray-800 hover:bg-gray-50 dark:border-neutral-800 dark:text-gray-200 dark:hover:bg-neutral-800/50"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ================= DESKTOP VIEW (LG Screen) ================= */}
      <form onSubmit={handleSearch} className="hidden w-full max-w-xl md:block relative z-50" noValidate>
        <div
          className="
            relative flex h-11 w-full items-center rounded-sm border border-gray-200 bg-white shadow-sm transition-all duration-200 
            focus-within:border-[#0446DB] focus-within:ring-2 focus-within:ring-blue-500/15 
            dark:border-neutral-700 dark:bg-neutral-900
          "
        >
          {/* ✅ Desktop Dropdown using shadcn */}
          <div className="h-full flex items-center shrink-0">
            <SearchTypeDropdown className="h-full" />
          </div>

          <div className="h-6 w-px shrink-0 bg-gray-200 dark:bg-neutral-700" />

          <input
            type="text"
            value={searchValue}
            onChange={handleInputChange}
            placeholder={`Search by ${selectedOption.label}`}
            maxLength={100}
            autoComplete="off"
            spellCheck={false}
            className="
              h-full min-w-0 flex-1 bg-transparent px-3
              text-sm font-medium text-gray-900
              placeholder:text-gray-400 focus:outline-none
              dark:text-white dark:placeholder:text-gray-500
            "
          />

          {searchValue.length > 0 && (
            <button
              type="button"
              disabled={loading}
              onClick={handleClear}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-neutral-800"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          <div className="pr-1.5">
            <button
              type="submit"
              disabled={isSearchDisabled}
              aria-label="Search"
              className={`
                flex h-9 w-9 shrink-0 items-center justify-center
                rounded-lg transition-all duration-200
                ${
                  isSearchDisabled
                    ? `cursor-not-allowed bg-gray-100 text-gray-400 dark:bg-neutral-800 dark:text-neutral-500`
                    : `cursor-pointer bg-[#0446DB] text-white shadow-sm hover:bg-[#0339B5] active:scale-[0.98]`
                }
              `}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" strokeWidth={2.5} />
              )}
            </button>
          </div>
        </div>
      </form>

      {/* ================= SEARCH RESULTS (Desktop Only) ================= */}
      {hasSearched && (
        <div className="hidden md:block mt-4 overflow-hidden rounded-sm border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-4 py-3 dark:border-neutral-800">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-[#0446DB]" />
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Search Results
              </h3>
            </div>
            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400">
              {orders.length} orders
            </span>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[500px] text-left text-xs sm:text-sm">
              <thead className="bg-gray-50 text-[11px] font-semibold text-gray-600 dark:bg-neutral-800/50 dark:text-gray-300 sm:text-xs">
                <tr>
                  <th className="whitespace-nowrap px-4 py-2.5 sm:py-3">#</th>
                  <th className="whitespace-nowrap px-4 py-2.5 sm:py-3">Order ID</th>
                  <th className="whitespace-nowrap px-4 py-2.5 sm:py-3">AWB Number</th>
                  <th className="whitespace-nowrap px-4 py-2.5 sm:py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
                {orders.length > 0 ? (
                  orders.map((order, index) => (
                    <tr key={order.id ?? index} className="text-gray-700 transition-colors hover:bg-blue-50/50 dark:text-gray-200 dark:hover:bg-neutral-800/60">
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3 font-medium">{order.id ?? "—"}</td>
                      <td className="px-4 py-3">{order.awb_number ?? "—"}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex rounded-md bg-gray-100 px-2 py-1 text-[10px] font-medium text-gray-700 dark:bg-neutral-800 dark:text-gray-200">
                          {order.order_status ?? "—"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center">
                      <Inbox className="mx-auto mb-2 h-7 w-7 text-gray-300 dark:text-neutral-600" />
                      <p className="text-xs text-gray-500">No orders found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}