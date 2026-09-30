// import { useState, useEffect } from "react";
// import axios from "axios";
// import { FaRegCopy } from "react-icons/fa";
// import { CiCircleCheck } from "react-icons/ci";
// import { toast } from "react-toastify";
// import { Loader2 } from "lucide-react";
// import { Button } from "@/components/ui/button"

// const baseURL = import.meta.env.VITE_BASE_URL;
// const frontEndURL = import.meta.env.VITE_FRONTEND_URL;


// function VendorCodRemittance() {
//   const [loading, setLoading] = useState(false);
//   const [vendorId, setVendorId] = useState(null);
//   const [data, setData] = useState([]);
//   const [page, setPage] = useState(1);
//   const [limit, setLimit] = useState(20);
//   const [totalPages, setTotalPages] = useState(1);
//   const [copySuccess, setCopySuccess] = useState(null);
//   const [pendingAmount, setPendingAmount] = useState("");
//   const [riders, setRiders] = useState([]);
//   const [riderOptions, setRiderOptions] = useState([]);

//   const [initiatedAmount, setInitiatedAmount] = useState("");
//   const [receivedAmount, setReceivedAmount] = useState("");
//   const [adjustedAmount, setAdjustedAmount] = useState(0);
//   const [totalAmount, setTotalAmount] = useState("");
//   const [selectedBulkOrders, setSelectedBulkOrders] = useState([]);
//   const [selectedBulkAmount, setSelectedBulkAmount] = useState([]);

//   const filters = ["All", "Pending", "Initiated", "Adjusted", "Received"];
//   const [selectedFilter, setSelectedFilter] = useState("All");

//   const [isFilterOpen, setIsFilterOpen] = useState(false);
//   const [advanceFilters, setAdvanceFilters] = useState({
//     startDate: "",
//     endDate: "",
//     rider_id: "",
//     order_id: "",
//     awb_number: "",
//   });
//   const [filterUpdate, setFilterUpdate] = useState(false);

//   //Set Default Date Range of one month from today
//   const resetAdvanceFilters = async () => {
//     const today = new Date();
//     const oneMonthAgo = new Date();
//     oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

//     setAdvanceFilters((prev) => ({
//       endDate: today.toISOString().split("T")[0],
//       startDate: oneMonthAgo.toISOString().split("T")[0],
//       rider_id: "",
//       order_id: "",
//       awb_number: "",
//     }));
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
//       const res = await axios.get(
//         `${baseURL}/api/vendor/getVendorCodRemittance`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//           params: {
//             page,
//             limit,
//             start_date: advanceFilters.startDate,
//             end_date: advanceFilters.endDate,
//             rider_id: advanceFilters.rider_id,
//             order_ids: advanceFilters.order_id,
//             awb_numbers: advanceFilters.awb_number,
//             status: selectedFilter === "All" ? "" : selectedFilter,
//           },
//         }
//       );
     
//       setData(res.data.data || []);
//       setTotalPages(Math.max(1, res.data.totalPages));
//       setPendingAmount(indianFormat(Number(res.data?.overallSummary?.pendingAmount)));
//       setInitiatedAmount(indianFormat(Number(res.data?.overallSummary?.initiatedAmount)));
//       setReceivedAmount(indianFormat(Number(res.data?.overallSummary?.receivedAmount)));
//       setAdjustedAmount(indianFormat(Number(res.data?.overallSummary?.adjustedAmount)));
//       setTotalAmount(
//         indianFormat(
//           Number(res.data?.overallSummary?.pendingAmount) +
//           Number(res.data?.overallSummary?.initiatedAmount) +
//             Number(res.data?.overallSummary?.receivedAmount) +
//             Number(res.data?.overallSummary?.adjustedAmount)
//         )
//       );
//       setVendorId(res.data.filters.vendor_id);
      
//     } catch (err) {
//       toast.error(err.response?.data?.message || err.message || "Failed to fetch data:");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchRiders = async (order_ids) => {
//     setLoading(true);
//     try {
//       const res = await axios.get(`${baseURL}/api/vendor/getVendorRiders`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         params: {
//           limit: 10000,
//         },
//       });
//       setRiders(res.data.data || []);
//     } catch (err) {
//       toast.error(err.response?.data?.message || err.message || "Failed to load riders");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleSelectAll = () => {
//     if (selectedBulkOrders.length === data.length) {
//       setSelectedBulkOrders([]);
//       setSelectedBulkAmount(0);
//     } else {
//       setSelectedBulkOrders(data);
//       let total = 0;
//       data.forEach((d) => {
//         total += Number(d.amount);
//       });
//       setSelectedBulkAmount(total);
//     }
//   };

//   const handleBulkAdjustment = async () => {
//     setLoading(true);
//     const order_id = selectedBulkOrders.map((o) => o.order_id).join(",");
//     try {
//       const res = await axios.post(
//         `${baseURL}/api/vendor/adjustCodRemittanceAtVendor`,
//         {
//           order_id,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       setSelectedBulkAmount(0);
//       setSelectedBulkOrders([]);
//       fetchData();
//     } catch (err) {
//       toast.error(err.response?.data?.message || err.message || "Error whilte adjusting Remittances");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     fetchRiders();
//   }, [selectedFilter, page]);

//   useEffect(() => {
//     if (filterUpdate) {
//       fetchData();
//       setFilterUpdate(false);
//     }
//   }, [filterUpdate]);

//   const handleChange = async (e) => {
//     setLoading(true);
//     const file = e.target.files[0];
//     const formData = new FormData();
//     formData.append("file", file);
//     console.log(formData)
//     try {
//       const res = await axios.post(
//         `${baseURL}/api/vendor/submitrecord`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );
//       toast.success("File uploaded successfully");
//       fetchData();
//     } catch (err) {
//       toast.error(err.response?.data?.message || err.message || "Error while uploading file to take action on bulk orders");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const downloadSample = async ()=>{
//     setLoading(true);
//     try {
//       const res = await axios.get(
//         `${baseURL}/api/vendor/downloadSampleFile`,
//         {
//           responseType: "blob",
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );

//       const url = window.URL.createObjectURL(new Blob([res.data]));
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", "sample.csv");
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//     } catch (err) {
//       toast.error(err.response?.data?.message || err.message || "Failed to export orders");
//     } finally {
//       setLoading(false);
//     }
//   }

//   const exportCSV = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(`${baseURL}/api/vendor/exportCodRemittance`, {
//         params: {
//           status: selectedFilter === "All" ? "" : selectedFilter,
//           order_id: advanceFilters.order_id,
//           awb_number: advanceFilters.awbNumber,
//           rider_id: advanceFilters.rider_id,
//           start_date: advanceFilters.startDate,
//           end_date: advanceFilters.endDate,
//         },
//         responseType: "blob",
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });

//       const url = window.URL.createObjectURL(new Blob([res.data]));
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", "orders.csv");
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//     } catch (err) {
//       toast.error(err.response?.data?.message || err.message || "Failed to export orders");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
     
//         <div className="bg-gray-100 min-h-screen w-full">
//           {/* Right Sidebar for filters */}
//           <div
//             className={`fixed rounded-tl-4xl top-0 right-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
//               isFilterOpen ? "translate-x-0" : "translate-x-full"
//             }`}
//           >
//             <div className="flex items-center justify-between p-4 border-b">
//               <h2 className="text-xl font-semibold">Advance Filters</h2>
//               <button
//                 onClick={() => {
//                   setIsFilterOpen(false);
//                 }}
//                 className="text-gray-500 hover:text-black text-2xl font-bold"
//               >
//                 &times;
//               </button>
//             </div>
//             <div className="p-4 w-full">
//               <div className="flex flex-wrap items-end gap-4">
//                 {/* Start Date */}
//                 <div className=" w-full">
//                   <label className="block text-xs text-gray-600 mb-1">
//                     Start Date
//                   </label>
//                   <input
//                     type="date"
//                     value={advanceFilters.startDate}
//                     onChange={(e) =>
//                       setAdvanceFilters((prev) => ({
//                         ...prev,
//                         startDate: e.target.value,
//                       }))
//                     }
//                     className="border w-full px-3 py-2 rounded text-sm"
//                   />
//                 </div>

//                 {/* End Date */}
//                 <div className=" w-full">
//                   <label className="block text-xs text-gray-600 mb-1">
//                     End Date
//                   </label>
//                   <input
//                     type="date"
//                     value={advanceFilters.endDate}
//                     onChange={(e) =>
//                       setAdvanceFilters((prev) => ({
//                         ...prev,
//                         endDate: e.target.value,
//                       }))
//                     }
//                     className="border w-full px-3 py-2 rounded text-sm"
//                   />
//                 </div>

//                 {/* Order ID */}
//                 <div className=" w-full">
//                   <label className="block text-xs text-gray-600 mb-1">
//                     Order ID
//                   </label>
//                   <input
//                     type="text"
//                     value={advanceFilters.order_id}
//                     onChange={(e) =>
//                       setAdvanceFilters((prev) => ({
//                         ...prev,
//                         order_id: e.target.value,
//                       }))
//                     }
//                     placeholder="Enter Id(s)"
//                     className="border w-full px-3 py-2 rounded text-sm"
//                   />
//                 </div>

//                 {/* AWB Number */}
//                 <div className=" w-full">
//                   <label className="block text-xs text-gray-600 mb-1">
//                     AWB Number
//                   </label>
//                   <input
//                     type="text"
//                     value={advanceFilters.awb_number}
//                     onChange={(e) =>
//                       setAdvanceFilters((prev) => ({
//                         ...prev,
//                         awb_number: e.target.value,
//                       }))
//                     }
//                     placeholder="Enter AWB Number(s)"
//                     className="border w-full px-3 py-2 rounded text-sm"
//                   />
//                 </div>

//                 {/* Rider ID */}
//                 <div className=" w-full">
//                   <label className="block text-xs text-gray-600 mb-1">
//                     Rider ID
//                   </label>
//                   <select
//                     value={advanceFilters.rider_id}
//                     onChange={(e) => {
//                       setAdvanceFilters((prev) => ({
//                         ...prev,
//                         rider_id: e.target.value,
//                       }));
//                     }}
//                     className="border px-3 py-2 w-full rounded"
//                   >
//                     <option value="">All Riders</option>
//                     {riders.map((rider) => (
//                       <option key={rider.id} value={rider.id}>
//                         FP{vendorId}_{rider.id} | {rider.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
                
//                 {/* Update Button */}
//                 <div className=" w-full flex">
//                   <button
//                     onClick={() => {
//                       setFilterUpdate(true);
//                       setIsFilterOpen(false);
//                     }}
//                     className="bg-[#0446DB] w-1/2 text-white px-4 py-2 rounded-md hover:bg-indigo-800 transition text-sm mx-1"
//                   >
//                     Filter
//                   </button>
//                   <button
//                     onClick={() => {
//                       resetAdvanceFilters();
//                       setFilterUpdate(true);
//                       setIsFilterOpen(false);
//                     }}
//                     className="bg-[#0446DB] w-1/2 text-white px-4 py-2 rounded-md hover:bg-indigo-800 transition text-sm mx-1"
//                   >
//                     Reset
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Heading */}
//           <div className=" bg-[#0446DB] py-[24px] shadow-md  px-[24px]">
//             <div className="flex flex-wrap items-center justify-between">
//               {/* Heading */}
//               <h1 className="text-2xl text-white">COD Remittances</h1>
//               <div className="flex flex-wrap items-end gap-4 text-white">
//                 <div className="text-white">
//                   <label className="pb-2.5 mx-2">Bulk Action</label>
//                   <input
//                     type="file"
//                     name="bulk_remittance"
//                     onChange={handleChange}
//                     accept=".csv"
//                     className="bg-white text-[#0446DB] font-medium rounded-sm shadow-sm hover:bg-indigo-100 transition cursor-pointer file:mr-2 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-[#0446DB] file:bg-white file:hover:bg-indigo-100"
//                   />
//                 </div>
//                 <button
//                   onClick={downloadSample}
//                   className="bg-white text-[#0446DB] font-medium p-2 rounded-sm shadow-sm hover:bg-indigo-100 transition"
//                 >
//                   Sample
//                 </button>
//                 <button
//                   onClick={exportCSV}
//                   className="bg-white text-[#0446DB] font-medium p-2 rounded-sm shadow-sm hover:bg-indigo-100 transition"
//                 >
//                   Export
//                 </button>
//                 <button
//                   onClick={() => setIsFilterOpen(true)}
//                   className="bg-white text-[#0446DB] font-medium p-2 rounded-sm shadow-sm hover:bg-indigo-100 transition"
//                 >
//                   Filter
//                 </button>
//               </div>
//             </div>
//           </div>

//           <div className=" z-10 bg-white rounded-md">
//             {/* Filters */}
//             <div className="max-w-full  z-10">
//               <div className="flex flex-wrap justify-center gap-3 mb-6">
//                 {/* Status Filters */}
//                 {filters.map((filter) => (
//                   <Button
//                     key={filter}
//                     onClick={() => {
//                       setSelectedFilter(filter);
//                       setPage(1);
//                     }}
//                     className={`px-4 py-2 rounded-full border transition font-medium mt-5 ${
//                       selectedFilter === filter
//                         ? "bg-[#0446DB] text-white"
//                         : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
//                     }`}
//                   >
//                     {filter === "Received"
//                       ? "Submitted"
//                       : filter === "Adjusted"
//                       ? "Received"
//                       : filter}{" "}
//                     (
//                     {filter === "All"
//                       ? totalAmount
//                       : filter === "Pending"
//                       ? pendingAmount
//                       : filter === "Adjusted"
//                       ? adjustedAmount 
//                       : filter === "Initiated" 
//                       ? initiatedAmount 
//                       : receivedAmount}
//                     )
//                   </Button>
//                 ))}
//               </div>
//             </div>

//             {/* Bulk Assignment */}
//             {selectedBulkOrders.length > 0 && selectedFilter === "Initiated" && (
//               <div className="mb-10 bg-white rounded-sm shadow-lg p-6 border border-gray-200">
//                 <h2 className="text-xl font-bold text-gray-800 mb-5">
//                   Bulk Assignment ({selectedBulkOrders.length} Selected)
//                 </h2>

//                 <div className="overflow-x-auto">
//                   <table className="min-w-full table-auto border border-gray-200 rounded-md overflow-hidden">
//                     <thead className="bg-gray-100 text-gray-600 text-sm font-semibold">
//                       <tr>
//                         <th className="px-4 py-3 text-left border-b">
//                           Order ID
//                         </th>
//                         <th className="px-4 py-3 text-left border-b">
//                           Order Amount
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="text-gray-800 text-sm">
//                       {selectedBulkOrders.map((order) => (
//                         <tr key={order.id} className="hover:bg-gray-50">
//                           <td className="px-4 py-2 border-b">{order.id}</td>
//                           <td className="px-4 py-2 border-b">
//                             {Number(order.amount)}
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                     <tfoot>
//                       <tr className="bg-indigo-50 text-indigo-700 font-semibold text-sm">
//                         <td className="px-4 py-2 border-t">Total Amount</td>
//                         <td className="px-4 py-2 border-t">
//                           {Number(selectedBulkAmount).toLocaleString()}
//                         </td>
//                       </tr>
//                     </tfoot>
//                   </table>
//                 </div>

//                 <div className="mt-6 flex flex-wrap items-center gap-4">
//                   <button
//                     onClick={() => handleBulkAdjustment()}
//                     className="bg-[#0446DB] hover:bg-indigo-800 transition text-white px-5 py-2 rounded-md shadow font-medium"
//                   >
//                     Adjust COD
//                   </button>
//                   <button
//                     className="bg-red-500 hover:bg-red-800 transition text-white px-5 py-2 rounded-md shadow font-medium"
//                     onClick={() => {
//                       setSelectedBulkOrders([]);
//                       setSelectedBulkAmount(0);
//                     }}
//                   >
//                     Clear Selected Orders
//                   </button>
//                 </div>
//               </div>
//             )}

//             {/* Table */}
//             <div className="overflow-x-auto bg-white rounded-sm shadow">
//               <table className="min-w-full divide-y divide-gray-200 text-sm">
//                 <thead className="bg-gray-100 text-gray-600 font-semibold">
//                   <tr>
//                     {selectedFilter === "Initiated" && (
//                       <th className="px-6 py-4">
//                         <div>
//                           <span>
//                             <input
//                               type="checkbox"
//                               className="w-4 h-4 text-indigo-600 rounded border-gray-300"
//                               checked={
//                                 selectedBulkOrders.length === data.length
//                               }
//                               onChange={toggleSelectAll}
//                             />
//                           </span>
//                         </div>
//                       </th>
//                     )}

//                     <th className="px-6 py-3 text-left">RIDER</th>
//                     <th className="px-6 py-3 text-left">ORDER ID</th>
//                     <th className="px-6 py-3 text-left">AMOUNT</th>
//                     <th className="px-6 py-3 text-left">RECEIVED BY</th>
//                     <th className="px-6 py-3 text-left">REMARKS</th>
//                     <th className="px-6 py-3 text-left">STATUS</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   { 
//                    loading ? (
//                      <tr key={"No record found"}>
//                         <td
//                           colSpan="6"
//                           className="text-center px-6 py-6 text-gray-500"
//                         >

//                           <div className=" w-full  flex justify-center items-center">
//                             <div>
//                               <Loader2 className="h-8 w-8 animate-spin mx-auto" />
//                               <p className="mt-2">Loading COD Remittances...</p>
//                             </div>
//                           </div>
//                         </td>
//                       </tr>
//                    ) : data.length == 0 ? (
//                     <tr key={"No record found"}>
//                     <td
//                       colSpan="6"
//                       className="text-center px-6 py-6 text-gray-500"
//                     >
//                       No records found.
//                     </td>
//                   </tr>
//                    ) : (
//                      data.map((d, index) => {
//                       let isSelected;
//                       if (selectedFilter === "Initiated") {
//                         isSelected = selectedBulkOrders.some(
//                           (o) => o.id === d.id
//                         );
//                       }
//                       return (
//                         <tr key={index} className="hover:bg-gray-50">
//                           {selectedFilter === "Initiated" && (
//                             <td className="px-6 py-4">
//                               <input
//                                 type="checkbox"
//                                 checked={isSelected}
//                                 onChange={(e) => {
//                                   if (selectedFilter === "Initiated") {
//                                     if (e.target.checked) {
//                                       setSelectedBulkOrders((prev) => [
//                                         ...prev,
//                                         d,
//                                       ]);
//                                       setSelectedBulkAmount(
//                                         (prev) =>
//                                           Number(prev) + Number(d.amount)
//                                       );
//                                     } else {
//                                       setSelectedBulkOrders((prev) =>
//                                         prev.filter((o) => o.id !== d.id)
//                                       );
//                                       setSelectedBulkAmount(
//                                         (prev) =>
//                                           Number(prev) - Number(d.amount)
//                                       );
//                                     }
//                                   }
//                                 }}
//                                 className="w-4 h-4 text-[#0446DB] border-gray-300 rounded"
//                               />
//                             </td>
//                           )}
//                           <td className="px-6 py-4">
//                             {`FP_${vendorId}_${d.rider_id}`}, {d.rider_name}
//                           </td>
//                           <td className="px-6 py-4">
//                             <p className="text-l text-gray-800 flex items-center">
//                               <a
//                                 href={`${frontEndURL}/track-order?awb_number=${d.awb_number}`}
//                                 target="_blank"
//                                 rel="noopener noreferrer"
//                                 className="underline text-blue-700 hover:text-blue-500"
//                               >
//                                 {d.awb_number}
//                               </a>
//                               <button
//                                 className="pl-2 text-lg text-gray-600 hover:text-[#0446DB] transition"
//                                 onClick={() => {
//                                   navigator.clipboard.writeText(d.awb_number);
//                                   setCopySuccess(d.awb_number);
//                                   setTimeout(() => {
//                                     setCopySuccess(null);
//                                   }, 2000);
//                                 }}
//                               >
//                                 {copySuccess === d.awb_number ? (
//                                   <CiCircleCheck />
//                                 ) : (
//                                   <FaRegCopy />
//                                 )}
//                               </button>
//                             </p>
//                             <p className="text-s text-gray-500">
//                               {new Date(d.updated_at).toLocaleString("en-IN", {
//                                 timeZone: "Asia/Kolkata",
//                                 day: "2-digit",
//                                 month: "2-digit",
//                                 year: "numeric",
//                                 hour: "2-digit",
//                                 minute: "2-digit",
//                                 hour12: true,
//                               })}
//                             </p>

//                             <p className="text-s text-gray-400">
//                               Order ID:{" "}
//                               {d.merchant_order_id?.length <= 20
//                                 ? d.merchant_order_id
//                                 : d.merchant_order_id?.slice(0, 20) + "..."}
//                               <button
//                                 className="pl-2 text-lg text-gray-600 hover:text-[#0446DB] transition"
//                                 onClick={() => {
//                                   navigator.clipboard.writeText(
//                                     d.merchant_order_id
//                                   );
//                                   setCopySuccess(d.merchant_order_id);
//                                   setTimeout(() => {
//                                     setCopySuccess(null);
//                                   }, 2000);
//                                 }}
//                               >
//                                 {copySuccess === d.merchant_order_id ? (
//                                   <CiCircleCheck />
//                                 ) : (
//                                   <FaRegCopy />
//                                 )}
//                               </button>
//                             </p>
//                           </td>
//                           <td className="px-6 py-4">{d.amount}</td>
//                           <td className="px-6 py-4">{d.received_by || "-"}</td>
//                           <td className="px-6 py-4">{d.remarks || "NA"}</td>
//                           <td className="px-6 py-4">
//                             {d.status === "pending" ? (
//                               <button className="bg-red-100 text-red-800 text-xs font-medium px-3 py-1 rounded-full">
//                                 Pending
//                               </button>
//                             ) : d.status === "initiated" ? (
//                               <button className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
//                                 Initiated
//                               </button>
//                             ) : d.status === "adjusted" ? (
//                               <span className="bg-yellow-100 text-yellow-700 text-xs font-medium px-3 py-1 rounded-full">
//                                 Received
//                               </span>
//                             ) : (
//                               <span className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
//                                 Submitted
//                               </span>
//                             )}
//                           </td>
//                         </tr>
//                       );
//                     })
//                    )
                  
//                   }
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination */}
//             <div className="py-3 flex justify-center items-center gap-4">
//               <button
//                 onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
//                 disabled={page === 1}
//                 className={`px-4 py-2 rounded-md text-sm font-medium ${
//                   page === 1
//                     ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                     : "bg-[#0446DB] text-white hover:bg-indigo-800"
//                 }`}
//               >
//                 Previous
//               </button>
//               <span className="text-gray-700">
//                 Page {page} of {totalPages}
//               </span>
//               <button
//                 onClick={() =>
//                   setPage((prev) => Math.min(prev + 1, totalPages))
//                 }
//                 disabled={page === totalPages}
//                 className={`px-4 py-2 rounded-md text-sm font-medium ${
//                   page === totalPages
//                     ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                     : "bg-[#0446DB] text-white hover:bg-indigo-800"
//                 }`}
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         </div>
     
//     </>
//   );
// }

// export default VendorCodRemittance;



import { useState, useEffect } from "react";

import axios from "axios";

import { FaRegCopy } from "react-icons/fa";

import { CiCircleCheck } from "react-icons/ci";

import { toast } from "react-toastify";

import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button"

const baseURL = import.meta.env.VITE_BASE_URL;

const frontEndURL = import.meta.env.VITE_FRONTEND_URL;



function VendorCodRemittance() {

  const [loading, setLoading] = useState(false);

  const [vendorId, setVendorId] = useState(null);

  const [data, setData] = useState([]);

  const [page, setPage] = useState(1);

  const [limit, setLimit] = useState(20);

  const [totalPages, setTotalPages] = useState(1);

  const [copySuccess, setCopySuccess] = useState(null);

  const [pendingAmount, setPendingAmount] = useState("");

  const [riders, setRiders] = useState([]);

  const [riderOptions, setRiderOptions] = useState([]);

  const [initiatedAmount, setInitiatedAmount] = useState("");

  const [receivedAmount, setReceivedAmount] = useState("");

  const [adjustedAmount, setAdjustedAmount] = useState(0);

  const [totalAmount, setTotalAmount] = useState("");

  const [selectedBulkOrders, setSelectedBulkOrders] = useState([]);

  const [selectedBulkAmount, setSelectedBulkAmount] = useState([]);

  const filters = ["All", "Pending", "Initiated", "Adjusted", "Received"];

  const [selectedFilter, setSelectedFilter] = useState("All");

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [advanceFilters, setAdvanceFilters] = useState({

    startDate: "",

    endDate: "",

    rider_id: "",

    order_id: "",

    awb_number: "",

  });

  const [filterUpdate, setFilterUpdate] = useState(false);

  //Set Default Date Range of one month from today

  const resetAdvanceFilters = async () => {

    const today = new Date();

    const oneMonthAgo = new Date();

    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    setAdvanceFilters((prev) => ({

      endDate: today.toISOString().split("T")[0],

      startDate: oneMonthAgo.toISOString().split("T")[0],

      rider_id: "",

      order_id: "",

      awb_number: "",

    }));

  };

  const indianFormat = (num) => {

    const temp = num.toLocaleString("en-IN", {

      style: "currency",

      currency: "INR",

    });

    return temp;

  };

  useEffect(() => {

    resetAdvanceFilters();

  }, []);

  // Fetch data from API

  const fetchData = async () => {

    setLoading(true);

    try {

      const res = await axios.get(

        `${baseURL}/api/vendor/getVendorCodRemittance`,

        {

          headers: {

            Authorization: `Bearer ${localStorage.getItem("token")}`,

          },

          params: {

            page,

            limit,

            start_date: advanceFilters.startDate,

            end_date: advanceFilters.endDate,

            rider_id: advanceFilters.rider_id,

            order_ids: advanceFilters.order_id,

            awb_numbers: advanceFilters.awb_number,

            status: selectedFilter === "All" ? "" : selectedFilter,

          },

        }

      );

      setData(res.data.data || []);

      setTotalPages(Math.max(1, res.data.totalPages));

      setPendingAmount(indianFormat(Number(res.data?.overallSummary?.pendingAmount)));

      setInitiatedAmount(indianFormat(Number(res.data?.overallSummary?.initiatedAmount)));

      setReceivedAmount(indianFormat(Number(res.data?.overallSummary?.receivedAmount)));

      setAdjustedAmount(indianFormat(Number(res.data?.overallSummary?.adjustedAmount)));

      setTotalAmount(

        indianFormat(

          Number(res.data?.overallSummary?.pendingAmount) +

          Number(res.data?.overallSummary?.initiatedAmount) +

            Number(res.data?.overallSummary?.receivedAmount) +

            Number(res.data?.overallSummary?.adjustedAmount)

        )

      );

      setVendorId(res.data.filters.vendor_id);

    } catch (err) {

      toast.error(err.response?.data?.message || err.message || "Failed to fetch data:");

    } finally {

      setLoading(false);

    }

  };

  const fetchRiders = async (order_ids) => {

    setLoading(true);

    try {

      const res = await axios.get(`${baseURL}/api/vendor/getVendorRiders`, {

        headers: {

          Authorization: `Bearer ${localStorage.getItem("token")}`,

        },

        params: {

          limit: 10000,

        },

      });

      setRiders(res.data.data || []);

    } catch (err) {

      toast.error(err.response?.data?.message || err.message || "Failed to load riders");

    } finally {

      setLoading(false);

    }

  };

  const toggleSelectAll = () => {

    if (selectedBulkOrders.length === data.length) {

      setSelectedBulkOrders([]);

      setSelectedBulkAmount(0);

    } else {

      setSelectedBulkOrders(data);

      let total = 0;

      data.forEach((d) => {

        total += Number(d.amount);

      });

      setSelectedBulkAmount(total);

    }

  };

  const handleBulkAdjustment = async () => {

    setLoading(true);

    const order_id = selectedBulkOrders.map((o) => o.order_id).join(",");

    try {

      const res = await axios.post(

        `${baseURL}/api/vendor/adjustCodRemittanceAtVendor`,

        {

          order_id,

        },

        {

          headers: {

            Authorization: `Bearer ${localStorage.getItem("token")}`,

          },

        }

      );

      setSelectedBulkAmount(0);

      setSelectedBulkOrders([]);

      fetchData();

    } catch (err) {

      toast.error(err.response?.data?.message || err.message || "Error whilte adjusting Remittances");

    } finally {

      setLoading(false);

    }

  };

  useEffect(() => {

    fetchData();

    fetchRiders();

  }, [selectedFilter, page]);

  useEffect(() => {

    if (filterUpdate) {

      fetchData();

      setFilterUpdate(false);

    }

  }, [filterUpdate]);

  const handleChange = async (e) => {

    setLoading(true);

    const file = e.target.files[0];

    const formData = new FormData();

    formData.append("file", file);

    console.log(formData)

    try {

      const res = await axios.post(

        `${baseURL}/api/vendor/submitrecord`,

        formData,

        {

          headers: {

            Authorization: `Bearer ${localStorage.getItem("token")}`,

            "Content-Type": "multipart/form-data",

          },

        }

      );

      toast.success("File uploaded successfully");

      fetchData();

    } catch (err) {

      toast.error(err.response?.data?.message || err.message || "Error while uploading file to take action on bulk orders");

    } finally {

      setLoading(false);

    }

  };

  const downloadSample = async ()=>{

    setLoading(true);

    try {

      const res = await axios.get(

        `${baseURL}/api/vendor/downloadSampleFile`,

        {

          responseType: "blob",

          headers: {

            Authorization: `Bearer ${localStorage.getItem("token")}`,

          },

        }

      );

      const url = window.URL.createObjectURL(new Blob([res.data]));

      const link = document.createElement("a");

      link.href = url;

      link.setAttribute("download", "sample.csv");

      document.body.appendChild(link);

      link.click();

      link.remove();

    } catch (err) {

      toast.error(err.response?.data?.message || err.message || "Failed to export orders");

    } finally {

      setLoading(false);

    }

  }

  const exportCSV = async () => {

    setLoading(true);

    try {

      const res = await axios.get(`${baseURL}/api/vendor/exportCodRemittance`, {

        params: {

          status: selectedFilter === "All" ? "" : selectedFilter,

          order_id: advanceFilters.order_id,

          awb_number: advanceFilters.awbNumber,

          rider_id: advanceFilters.rider_id,

          start_date: advanceFilters.startDate,

          end_date: advanceFilters.endDate,

        },

        responseType: "blob",

        headers: {

          Authorization: `Bearer ${localStorage.getItem("token")}`,

        },

      });

      const url = window.URL.createObjectURL(new Blob([res.data]));

      const link = document.createElement("a");

      link.href = url;

      link.setAttribute("download", "orders.csv");

      document.body.appendChild(link);

      link.click();

      link.remove();

    } catch (err) {

      toast.error(err.response?.data?.message || err.message || "Failed to export orders");

    } finally {

      setLoading(false);

    }

  };

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
        <>
          <div className=" w-full h-[90vh] flex justify-center items-center">
          <div>
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <p className="mt-2">Loading COD Remittances...</p>
          </div>
        </div>
        </>
      ):(

      <div className="min-h-screen w-full bg-[#F6F8FC] text-gray-900 dark:bg-neutral-950 dark:text-white">

        {/* ===================== ADVANCE FILTER SIDEBAR ===================== */}
        {isFilterOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] dark:bg-black/50"
            onClick={() => setIsFilterOpen(false)}
          />
        )}

        <div
          className={`fixed right-0 top-0 z-50 h-full w-[92%] max-w-[390px] transform border-l border-gray-200 bg-white shadow-2xl transition-transform duration-300 ease-in-out dark:border-neutral-800 dark:bg-neutral-900 ${
            isFilterOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-5 dark:border-neutral-800">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Advance Filters
                </h2>
                <p className="mt-1 text-xs text-gray-500 dark:text-neutral-400">
                  Filter COD remittance records
                </p>
              </div>

              <button
                onClick={() => {
                  setIsFilterOpen(false);
                }}
                className="flex h-9 w-9 items-center justify-center rounded-sm border border-gray-200 text-xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
              >
                &times;
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5">
              <div className="space-y-5">

                {/* Start Date */}
                <div className="w-full">
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
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
                    className="h-11 w-full rounded-sm border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:[color-scheme:dark]"
                  />
                </div>

                {/* End Date */}
                <div className="w-full">
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
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
                    className="h-11 w-full rounded-sm border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:[color-scheme:dark]"
                  />
                </div>

                {/* Order ID */}
                <div className="w-full">
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
                    Order ID
                  </label>
                  <input
                    type="text"
                    value={advanceFilters.order_id}
                    onChange={(e) =>
                      setAdvanceFilters((prev) => ({
                        ...prev,
                        order_id: e.target.value,
                      }))
                    }
                    placeholder="Enter Id(s)"
                    className="h-11 w-full rounded-sm border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-500"
                  />
                </div>

                {/* AWB Number */}
                <div className="w-full">
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
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
                    placeholder="Enter AWB Number(s)"
                    className="h-11 w-full rounded-sm border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-500"
                  />
                </div>

                {/* Rider ID */}
                <div className="w-full">
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
                    Rider ID
                  </label>
                  <select
                    value={advanceFilters.rider_id}
                    onChange={(e) => {
                      setAdvanceFilters((prev) => ({
                        ...prev,
                        rider_id: e.target.value,
                      }));
                    }}
                    className="h-11 w-full rounded-sm border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  >
                    <option value="">All Riders</option>
                    {riders.map((rider) => (
                      <option key={rider.id} value={rider.id}>
                        FP{vendorId}_{rider.id} | {rider.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 bg-gray-50/80 p-4 dark:border-neutral-800 dark:bg-neutral-900">
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    resetAdvanceFilters();
                    setFilterUpdate(true);
                    setIsFilterOpen(false);
                  }}
                  className="h-11 rounded-sm border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
                >
                  Reset
                </button>

                <button
                  onClick={() => {
                    setFilterUpdate(true);
                    setIsFilterOpen(false);
                  }}
                  className="h-11 rounded-sm bg-[#0446DB] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0339B5]"
                >
                  Apply Filter
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== PAGE HEADER ===================== */}
        <div className="border-b border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
          <div className="px-4 py-5 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-[#0446DB]/10 text-[#0446DB] dark:bg-[#0446DB]/20 dark:text-blue-400">
                    <span className="text-lg font-bold">₹</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-2xl">
                      COD Remittances
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                      Track, manage and reconcile COD remittance records
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <label className="group relative inline-flex h-10 cursor-pointer items-center overflow-hidden rounded-sm border border-gray-200 bg-white px-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-[#0446DB]/30 hover:bg-[#0446DB]/5 hover:text-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-[#0446DB]/10 dark:hover:text-blue-400">
                  <span>Bulk Upload</span>
                  <input
                    type="file"
                    name="bulk_remittance"
                    onChange={handleChange}
                    accept=".csv"
                    className="absolute inset-0 cursor-pointer opacity-0"
                  />
                </label>

                <button
                  onClick={downloadSample}
                  className="h-10 rounded-sm border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-[#0446DB]/30 hover:bg-[#0446DB]/5 hover:text-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-[#0446DB]/10 dark:hover:text-blue-400"
                >
                  Sample
                </button>

                <button
                  onClick={exportCSV}
                  className="h-10 rounded-sm border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-[#0446DB]/30 hover:bg-[#0446DB]/5 hover:text-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-[#0446DB]/10 dark:hover:text-blue-400"
                >
                  Export
                </button>

                <button
                  onClick={() => setIsFilterOpen(true)}
                  className="h-10 rounded-sm bg-[#0446DB] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0339B5]"
                >
                  Filter
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ===================== CONTENT ===================== */}
        <div className="space-y-5 p-3 sm:p-5 lg:p-6">

          {/* Summary / Status Filters */}
          <div className=" p-2  dark:border-neutral-800 dark:bg-neutral-900">
            <div className=" flex justify-start gap-2 overflow-x-scroll">
              {filters.map((filter) => {
                const amount =
                  filter === "All"
                    ? totalAmount
                    : filter === "Pending"
                    ? pendingAmount
                    : filter === "Adjusted"
                    ? adjustedAmount
                    : filter === "Initiated"
                    ? initiatedAmount
                    : receivedAmount;

                const label =
                  filter === "Received"
                    ? "Submitted"
                    : filter === "Adjusted"
                    ? "Received"
                    : filter;

                return (
                  <Button
                    key={filter}
                    onClick={() => {
                      setSelectedFilter(filter);
                      setPage(1);
                    }}
                    className={`  justify-center rounded-full  border px-4 py-3 text-left shadow-none transition ${
                      selectedFilter === filter
                        ? "border-[#0446DB] bg-[#0446DB] text-white hover:bg-[#0446DB]"
                        : "border-gray-200 bg-white text-gray-700 hover:border-[#0446DB]/30 hover:bg-[#0446DB]/5 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-[#0446DB]/10"
                    }`}
                  >
                    <div className="w-full flex items-center justify-center gap-2">
                      <p
                        className={`text-xs font-semibold mt-1 uppercase tracking-wide ${
                          selectedFilter === filter
                            ? "text-white/75"
                            : "text-gray-400 dark:text-neutral-500"
                        }`}
                      >
                        {label}
                      </p>
                      <p className="mt-1.5 truncate text-base font-bold">
                        {amount || "₹0.00"}
                      </p>
                    </div>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* ===================== BULK ASSIGNMENT ===================== */}
          {selectedBulkOrders.length > 0 && selectedFilter === "Initiated" && (
            <div className="overflow-hidden rounded-sm border border-[#0446DB]/20 bg-white shadow-sm dark:border-blue-500/20 dark:bg-neutral-900">
              <div className="flex flex-col gap-3 border-b border-gray-200 bg-[#0446DB]/[0.04] px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800 dark:bg-[#0446DB]/10">
                <div>
                  <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                    Bulk Assignment
                  </h2>
                  <p className="mt-1 text-xs text-gray-500 dark:text-neutral-400">
                    {selectedBulkOrders.length} order(s) selected for COD adjustment
                  </p>
                </div>

                <div className="rounded-sm border border-[#0446DB]/15 bg-white px-4 py-2 dark:border-blue-500/20 dark:bg-neutral-800">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                    Selected Amount
                  </p>
                  <p className="mt-0.5 text-base font-bold text-[#0446DB] dark:text-blue-400">
                    ₹{Number(selectedBulkAmount).toLocaleString("en-IN")}
                  </p>
                </div>
              </div>

              <div className="max-h-[280px] overflow-auto">
                <table className="min-w-full text-sm">
                  <thead className="sticky top-0 bg-gray-50 text-xs uppercase tracking-wide text-gray-500 dark:bg-neutral-800 dark:text-neutral-400">
                    <tr>
                      <th className="px-5 py-3 text-left font-semibold">Order ID</th>
                      <th className="px-5 py-3 text-right font-semibold">Order Amount</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
                    {selectedBulkOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-neutral-800/50">
                        <td className="px-5 py-3 font-medium text-gray-800 dark:text-neutral-200">
                          {order.id}
                        </td>
                        <td className="px-5 py-3 text-right font-semibold text-gray-900 dark:text-white">
                          ₹{Number(order.amount).toLocaleString("en-IN")}
                        </td>
                      </tr>
                    ))}
                  </tbody>

                  <tfoot>
                    <tr className="border-t border-gray-200 bg-gray-50 font-semibold dark:border-neutral-800 dark:bg-neutral-800/60">
                      <td className="px-5 py-3 text-gray-600 dark:text-neutral-300">
                        Total Amount
                      </td>
                      <td className="px-5 py-3 text-right text-[#0446DB] dark:text-blue-400">
                        ₹{Number(selectedBulkAmount).toLocaleString("en-IN")}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>

              <div className="flex flex-wrap items-center gap-2 border-t border-gray-200 px-5 py-4 dark:border-neutral-800">
                <button
                  onClick={() => handleBulkAdjustment()}
                  className="h-10 rounded-sm bg-[#0446DB] px-4 text-sm font-semibold text-white transition hover:bg-[#0339B5]"
                >
                  Adjust COD
                </button>

                <button
                  className="h-10 rounded-sm border border-red-200 bg-red-50 px-4 text-sm font-semibold text-red-600 transition hover:bg-red-100 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
                  onClick={() => {
                    setSelectedBulkOrders([]);
                    setSelectedBulkAmount(0);
                  }}
                >
                  Clear Selected Orders
                </button>
              </div>
            </div>
          )}

          {/* ===================== TABLE ===================== */}
          <div className="overflow-hidden rounded-sm border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-neutral-800">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Remittance Records
                </h3>
                <p className="mt-1 text-xs text-gray-500 dark:text-neutral-400">
                  COD transaction and settlement details
                </p>
              </div>

              <div className="rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-600 dark:bg-neutral-800 dark:text-neutral-300">
                {data.length} Records
              </div>
            </div>

            <div className="w-full overflow-x-auto">
              <table className="min-w-[1050px] w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/80 dark:border-neutral-800 dark:bg-neutral-800/60">
                    {selectedFilter === "Initiated" && (
                      <th className="w-[60px] px-5 py-3.5 text-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-[#0446DB]"
                          checked={selectedBulkOrders.length === data.length}
                          onChange={toggleSelectAll}
                        />
                      </th>
                    )}

                    <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-neutral-400">
                      Rider
                    </th>
                    <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-neutral-400">
                      Order Details
                    </th>
                    <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-neutral-400">
                      Amount
                    </th>
                    <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-neutral-400">
                      Received By
                    </th>
                    <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-neutral-400">
                      Remarks
                    </th>
                    <th className="px-5 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-neutral-400">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
                  {loading ? (
                    <tr key={"No record found"}>
                      <td
                        colSpan={selectedFilter === "Initiated" ? "7" : "6"}
                        className="px-6 py-16 text-center text-gray-500"
                      >
                        <div className="flex w-full items-center justify-center">
                          <div>
                            <Loader2 className="mx-auto h-7 w-7 animate-spin text-[#0446DB]" />
                            <p className="mt-3 text-sm text-gray-500 dark:text-neutral-400">
                              Loading COD Remittances...
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : data.length == 0 ? (
                    <tr key={"No record found"}>
                      <td
                        colSpan={selectedFilter === "Initiated" ? "7" : "6"}
                        className="px-6 py-16 text-center"
                      >
                        <div className="mx-auto max-w-sm">
                          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-sm bg-gray-100 text-gray-400 dark:bg-neutral-800 dark:text-neutral-500">
                            ₹
                          </div>
                          <p className="mt-3 text-sm font-semibold text-gray-700 dark:text-neutral-200">
                            No records found
                          </p>
                          <p className="mt-1 text-xs text-gray-400 dark:text-neutral-500">
                            Try changing the selected status or filters.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    data.map((d, index) => {
                      let isSelected;

                      if (selectedFilter === "Initiated") {
                        isSelected = selectedBulkOrders.some(
                          (o) => o.id === d.id
                        );
                      }

                      return (
                        <tr
                          key={index}
                          className={`transition-colors hover:bg-gray-50/80 dark:hover:bg-neutral-800/40 ${
                            isSelected
                              ? "bg-[#0446DB]/[0.035] dark:bg-[#0446DB]/10"
                              : ""
                          }`}
                        >
                          {selectedFilter === "Initiated" && (
                            <td className="px-5 py-4 text-center">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={(e) => {
                                  if (selectedFilter === "Initiated") {
                                    if (e.target.checked) {
                                      setSelectedBulkOrders((prev) => [
                                        ...prev,
                                        d,
                                      ]);
                                      setSelectedBulkAmount(
                                        (prev) =>
                                          Number(prev) + Number(d.amount)
                                      );
                                    } else {
                                      setSelectedBulkOrders((prev) =>
                                        prev.filter((o) => o.id !== d.id)
                                      );
                                      setSelectedBulkAmount(
                                        (prev) =>
                                          Number(prev) - Number(d.amount)
                                      );
                                    }
                                  }
                                }}
                                className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-[#0446DB]"
                              />
                            </td>
                          )}

                          <td className="px-5 py-4 align-top">
                            <div className="min-w-[160px]">
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                {d.rider_name || "-"}
                              </p>
                              <p className="mt-1 text-xs font-medium text-gray-400 dark:text-neutral-500">
                                FP_{vendorId}_{d.rider_id}
                              </p>
                            </div>
                          </td>

                          <td className="px-5 py-4 align-top">
                            <div className="min-w-[250px]">
                              <div className="flex items-center gap-1.5">
                                <a
                                  href={`${frontEndURL}/track-order?awb_number=${d.awb_number}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-semibold text-[#0446DB] hover:underline dark:text-blue-400"
                                >
                                  {d.awb_number}
                                </a>

                                <button
                                  className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 transition hover:bg-[#0446DB]/10 hover:text-[#0446DB] dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
                                  onClick={() => {
                                    navigator.clipboard.writeText(d.awb_number);
                                    setCopySuccess(d.awb_number);
                                    setTimeout(() => {
                                      setCopySuccess(null);
                                    }, 2000);
                                  }}
                                >
                                  {copySuccess === d.awb_number ? (
                                    <CiCircleCheck className="text-lg text-emerald-500" />
                                  ) : (
                                    <FaRegCopy />
                                  )}
                                </button>
                              </div>

                              <p className="mt-1.5 text-xs text-gray-500 dark:text-neutral-400">
                                {new Date(d.updated_at).toLocaleString("en-IN", {
                                  timeZone: "Asia/Kolkata",
                                  day: "2-digit",
                                  month: "2-digit",
                                  year: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                  hour12: true,
                                })}
                              </p>

                              <div className="mt-1 flex items-center gap-1">
                                <p className="max-w-[190px] truncate text-xs text-gray-400 dark:text-neutral-500">
                                  Order ID:{" "}
                                  {d.merchant_order_id?.length <= 20
                                    ? d.merchant_order_id
                                    : d.merchant_order_id?.slice(0, 20) + "..."}
                                </p>

                                <button
                                  className="flex h-6 w-6 items-center justify-center rounded-md text-gray-400 transition hover:bg-[#0446DB]/10 hover:text-[#0446DB] dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
                                  onClick={() => {
                                    navigator.clipboard.writeText(
                                      d.merchant_order_id
                                    );
                                    setCopySuccess(d.merchant_order_id);
                                    setTimeout(() => {
                                      setCopySuccess(null);
                                    }, 2000);
                                  }}
                                >
                                  {copySuccess === d.merchant_order_id ? (
                                    <CiCircleCheck className="text-base text-emerald-500" />
                                  ) : (
                                    <FaRegCopy className="text-xs" />
                                  )}
                                </button>
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-4 align-top">
                            <span className="whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">
                              ₹{Number(d.amount || 0).toLocaleString("en-IN")}
                            </span>
                          </td>

                          <td className="px-5 py-4 align-top text-sm text-gray-600 dark:text-neutral-300">
                            {d.received_by || "-"}
                          </td>

                          <td className="px-5 py-4 align-top">
                            <p
                              className="max-w-[220px] truncate text-sm text-gray-500 dark:text-neutral-400"
                              title={d.remarks || "NA"}
                            >
                              {d.remarks || "NA"}
                            </p>
                          </td>

                          <td className="px-5 py-4 align-top">
                            {d.status === "pending" ? (
                              <span className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
                                Pending
                              </span>
                            ) : d.status === "initiated" ? (
                              <span className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400">
                                Initiated
                              </span>
                            ) : d.status === "adjusted" ? (
                              <span className="inline-flex items-center rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-600 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400">
                                Received
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-600 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">
                                Submitted
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* ===================== PAGINATION ===================== */}
            <div className="flex flex-col gap-3 border-t border-gray-200 bg-gray-50/60 px-4 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800 dark:bg-neutral-900">
              <p className="text-xs text-gray-500 dark:text-neutral-400">
                Page{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {page}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-900 dark:text-white">
                  {totalPages}
                </span>
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={page === 1}
                  className={`h-9 rounded-sm border px-4 text-sm font-semibold transition ${
                    page === 1
                      ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-600"
                      : "border-gray-200 bg-white text-gray-700 hover:border-[#0446DB]/30 hover:bg-[#0446DB]/5 hover:text-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-[#0446DB]/10 dark:hover:text-blue-400"
                  }`}
                >
                  Previous
                </button>

                <button
                  onClick={() =>
                    setPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={page === totalPages}
                  className={`h-9 rounded-sm border px-4 text-sm font-semibold transition ${
                    page === totalPages
                      ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-600"
                      : "border-[#0446DB] bg-[#0446DB] text-white hover:bg-[#0339B5]"
                  }`}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      )
    }
    </>
  );
}

export default VendorCodRemittance;

