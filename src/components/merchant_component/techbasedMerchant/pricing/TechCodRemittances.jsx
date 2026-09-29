// import { useState, useEffect } from "react";
// import axios from "axios";

// import { Button } from "@/components/ui/button"

// import { FaRegCopy } from "react-icons/fa";
// import { CiCircleCheck } from "react-icons/ci";
// import { toast } from "react-toastify";
// import AxiosInstance from "../../../../Helper/axiosInstance";

// const baseURL = import.meta.env.VITE_BASE_URL;
// const frontEndURL = import.meta.env.VITE_FRONTEND_URL;

// function TechCodRemittances() {
//   const [editItem, setEditItem] = useState(null);
//   const [formData, setFormData] = useState({
//     orderId: "",
//     remarks: "",
//     status: "received",
//   });
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

//   const filters = ["All", "Pending", "Initiated", "Received"];
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
//       const params = {
//         page,
//         limit,
//         start_date: advanceFilters.startDate,
//         end_date: advanceFilters.endDate,
//         rider_id: advanceFilters.rider_id,
//         merchant_order_id: advanceFilters.order_id,
//         awb_number: advanceFilters.awb_number,
//         status: selectedFilter === "All" ? "" : selectedFilter,
//       };
//       const res = await AxiosInstance.get(
//         "/api/tech-merchant/getRidersCodRemittance",
//         {
//           params,
//         },
//       );

//       setData(res.data.data || []);
//       setTotalPages(Math.max(1, res.data.totalPages));
//       setPendingAmount(
//         indianFormat(Number(res.data.overallStatusSummary?.pending)),
//       );
//       setInitiatedAmount(
//         indianFormat(Number(res.data.overallStatusSummary?.initiated)),
//       );
//       setReceivedAmount(
//         indianFormat(Number(res.data.overallStatusSummary?.received)),
//       );
//       setAdjustedAmount(
//         indianFormat(Number(res.data.overallStatusSummary?.adjusted)),
//       );
//       setTotalAmount(
//         indianFormat(
//           Number(res.data.overallStatusSummary?.pending) +
//             Number(res.data.overallStatusSummary?.initiated) +
//             Number(res.data.overallStatusSummary?.received) +
//             Number(res.data.overallStatusSummary?.adjusted),
//         ),
//       );
//     } catch (err) {
//       toast.error(
//         err.response?.data?.message || err.message || "Failed to fetch data:",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleEditClick = (item) => {
//     setEditItem(item);
//     setFormData({
//       orderId: item.order_id,
//       remarks:
//         selectedFilter === "Pending"
//           ? "Remittance is received  by Admin"
//           : selectedFilter === "Adjusted"
//             ? "Remittance is received by Admin"
//             : "Remittance is received by Admin",
//       receivedBy: item.receivedBy || "",
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const res = await AxiosInstance.post(
//         "/api/tech-merchant/uploadCODRemittance",
//         {
//           remarks: formData.remarks,
//           status: "received",
//           order_id: formData.orderId,
//         },
//       );

//       fetchData();
//       setEditItem(null);
//       setFormData({ orderId: "", remarks: "", receivedBy: "" });
//     } catch (err) {
//       toast.error(
//         err.response?.data?.message ||
//           err.message ||
//           "Error while updating remittance",
//       );
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
//         `${baseURL}/api/merchant/adjustCodRemittanceAtVendor`,
//         {
//           order_id,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         },
//       );
//       setSelectedBulkAmount(0);
//       setSelectedBulkOrders([]);
//       fetchData();
//     } catch (err) {
//       toast.error(
//         err.response?.data?.message ||
//           err.message ||
//           "Error whilte adjusting Remittances",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
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
//     try {
//       const res = await axios.post(
//         `${baseURL}/api/techbasedmerchant/uploadCODRemittance`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//             "Content-Type": "multipart/form-data",
//           },
//         },
//       );
//       toast.success("File uploaded successfully");
//       fetchData();
//     } catch (err) {
//       toast.error(
//         err.response?.data?.message ||
//           err.message ||
//           "Error while uploading file to take action on bulk orders",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const exportCSV = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.post(
//         `${baseURL}/api/techbasedmerchant/exportCodRemittance`,
//         {
//           // POST body (if required, else can be empty {})
//           status: selectedFilter === "All" ? "" : selectedFilter,
//           order_id: advanceFilters.order_id,
//           awb_number: advanceFilters.awbNumber,
//           rider_id: advanceFilters.rider_id,
//           start_date: advanceFilters.startDate,
//           end_date: advanceFilters.endDate,
//         },
//         {
//           responseType: "blob",
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         },
//       );

//       const url = window.URL.createObjectURL(new Blob([res.data]));
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", "orders.csv");
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//     } catch (err) {
//       toast.error(
//         err.response?.data?.message || err.message || "Failed to export orders",
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <div className="bg-[#EEEEEE] min-h-screen w-full">
//         {/* Right Sidebar for filters */}
//         <div
//           className={`fixed top-0 right-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
//             isFilterOpen ? "translate-x-0" : "translate-x-full"
//           }`}
//         >
//           <div className="flex items-center justify-between p-4 border-b">
//             <h2 className="text-xl font-semibold">Advance Filters</h2>
//             <Button
//               onClick={() => {
//                 setIsFilterOpen(false);
//               }}
//               className="text-gray-500 hover:text-black text-2xl font-bold"
//             >
//               &times;
//             </Button>
//           </div>
//           <div className="p-4">
//             <div className="flex flex-wrap items-end gap-4">
//               {/* Start Date */}
//               <div>
//                 <label className="block text-xs text-gray-600 mb-1">
//                   Start Date
//                 </label>
//                 <input
//                   type="date"
//                   value={advanceFilters.startDate}
//                   onChange={(e) =>
//                     setAdvanceFilters((prev) => ({
//                       ...prev,
//                       startDate: e.target.value,
//                     }))
//                   }
//                   className="border px-3 py-1 rounded-md text-sm"
//                 />
//               </div>

//               {/* End Date */}
//               <div>
//                 <label className="block text-xs text-gray-600 mb-1">
//                   End Date
//                 </label>
//                 <input
//                   type="date"
//                   value={advanceFilters.endDate}
//                   onChange={(e) =>
//                     setAdvanceFilters((prev) => ({
//                       ...prev,
//                       endDate: e.target.value,
//                     }))
//                   }
//                   className="border px-3 py-1 rounded-md text-sm"
//                 />
//               </div>

//               {/* Order ID */}
//               <div>
//                 <label className="block text-xs text-gray-600 mb-1">
//                   Order ID
//                 </label>
//                 <input
//                   type="text"
//                   value={advanceFilters.order_id}
//                   onChange={(e) =>
//                     setAdvanceFilters((prev) => ({
//                       ...prev,
//                       order_id: e.target.value,
//                     }))
//                   }
//                   placeholder="Enter Id(s)"
//                   className="border px-3 py-1 rounded-md text-sm"
//                 />
//               </div>

//               {/* AWB Number */}
//               <div>
//                 <label className="block text-xs text-gray-600 mb-1">
//                   AWB Number
//                 </label>
//                 <input
//                   type="text"
//                   value={advanceFilters.awb_number}
//                   onChange={(e) =>
//                     setAdvanceFilters((prev) => ({
//                       ...prev,
//                       awb_number: e.target.value,
//                     }))
//                   }
//                   placeholder="Enter AWB Number(s)"
//                   className="border px-3 py-1 rounded-md text-sm"
//                 />
//               </div>

//               {/* Rider ID */}
//               <div>
//                 <label className="block text-xs text-gray-600 mb-1">
//                   Rider ID
//                 </label>
//                 <select
//                   value={advanceFilters.rider_id}
//                   onChange={(e) => {
//                     setAdvanceFilters((prev) => ({
//                       ...prev,
//                       rider_id: e.target.value,
//                     }));
//                   }}
//                   className="border px-3 py-1 rounded-md text-sm w-[82%]"
//                 >
//                   <option value="">All Riders</option>
//                   {riders.map((rider) => (
//                     <option key={rider.id} value={rider.id}>
//                       FP{vendorId}_{rider.id} | {rider.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* Update Button */}
//               <div>
//                 <button
//                   onClick={() => {
//                     setFilterUpdate(true);
//                     setIsFilterOpen(false);
//                   }}
//                   className="bg-[rgb(85,77,192)] text-white px-4 py-2 rounded-md hover:bg-indigo-800 transition text-sm mx-2"
//                 >
//                   Filter
//                 </button>
//                 <button
//                   onClick={() => {
//                     resetAdvanceFilters();
//                     setFilterUpdate(true);
//                     setIsFilterOpen(false);
//                   }}
//                   className="bg-[rgb(85,77,192)] text-white px-4 py-2 rounded-md hover:bg-indigo-800 transition text-sm mx-2"
//                 >
//                   Reset
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Heading */}
//         <div className=" bg-[#0446DB] py-3 px-3">
//           <div className="flex flex-wrap items-center justify-between">
//             {/* Heading */}
//             <h1 className="text-2xl text-white">COD Remittances</h1>
//             <div className="flex flex-wrap items-end gap-4 text-white">
//               <div className="text-white">
//                 <label className="pb-2.5 mx-2">Bulk Action</label>
//                 <input
//                   type="file"
//                   name="bulk_remittance"
//                   onChange={handleChange}
//                   accept=".csv"
//                   className="bg-white text-[rgb(85,77,192)] font-medium rounded-sm shadow hover:bg-indigo-100 transition cursor-pointer file:mr-2 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-[rgb(85,77,192)] file:bg-white file:hover:bg-indigo-100"
//                 />
//               </div>

//               <Button
//                 onClick={exportCSV}
//                 className="bg-white text-[#0446DB] font-medium px-5 py-2 rounded-sm shadow hover:bg-indigo-100 transition"
//               >
//                 Export
//               </Button>
//               <Button
//                 onClick={() => setIsFilterOpen(true)}
//                 className="bg-white text-[#0446DB] font-medium px-5 py-2 rounded-sm shadow hover:bg-indigo-100 transition"
//               >
//                 Filter
//               </Button>
//             </div>
//           </div>
//         </div>

//         <div className=" z-10 bg-white rounded-sm">
//           {/* Filters */}
//           <div className="">
//             <div className="flex flex-wrap justify-center gap-3 mb-6">
//               {/* Status Filters */}
//               {filters.map((filter) => (
//                 <Button
//                   key={filter}
//                   onClick={() => {
//                     setSelectedFilter(filter);
//                     setPage(1);
//                   }}
//                   className={`px-4 py-2 rounded-full border transition font-medium mt-5 ${
//                     selectedFilter === filter
//                       ? "bg-[#0446DB] text-white"
//                       : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
//                   }`}
//                 >
//                   {filter}
//                   {/* {filter === "Received"
//                                             ? "Submitted"
//                                             : filter === "Adjusted"
//                                                 ? "Received"
//                                                 : filter}{" "} */}
//                   (
//                   {filter === "All"
//                     ? totalAmount
//                     : filter === "Pending"
//                       ? pendingAmount
//                       : filter === "Adjusted"
//                         ? adjustedAmount
//                         : filter === "Initiated"
//                           ? initiatedAmount
//                           : receivedAmount}
//                   )
//                 </Button>
//               ))}
//             </div>
//           </div>

//           {/* Bulk Assignment */}
//           {selectedBulkOrders.length > 0 && selectedFilter === "Initiated" && (
//             <div className="mb-10 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
//               <h2 className="text-xl font-bold text-gray-800 mb-5">
//                 Bulk Assignment ({selectedBulkOrders.length} Selected)
//               </h2>

//               <div className="overflow-x-auto">
//                 <table className="min-w-full table-auto border border-gray-200 rounded-md overflow-hidden">
//                   <thead className="bg-gray-100 text-gray-600 text-sm font-semibold">
//                     <tr>
//                       <th className="px-4 py-3 text-left border-b">Order ID</th>
//                       <th className="px-4 py-3 text-left border-b">
//                         Order Amount
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="text-gray-800 text-sm">
//                     {selectedBulkOrders.map((order) => (
//                       <tr key={order.id} className="hover:bg-gray-50">
//                         <td className="px-4 py-2 border-b">{order.id}</td>
//                         <td className="px-4 py-2 border-b">
//                           {Number(order.amount)}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                   <tfoot>
//                     <tr className="bg-indigo-50 text-indigo-700 font-semibold text-sm">
//                       <td className="px-4 py-2 border-t">Total Amount</td>
//                       <td className="px-4 py-2 border-t">
//                         {Number(selectedBulkAmount).toLocaleString()}
//                       </td>
//                     </tr>
//                   </tfoot>
//                 </table>
//               </div>

//               <div className="mt-6 flex flex-wrap items-center gap-4">
//                 <button
//                   onClick={() => handleBulkAdjustment()}
//                   className="bg-[rgb(85,77,192)] hover:bg-indigo-800 transition text-white px-5 py-2 rounded-md shadow font-medium"
//                 >
//                   Adjust COD
//                 </button>
//                 <button
//                   className="bg-red-500 hover:bg-red-800 transition text-white px-5 py-2 rounded-md shadow font-medium"
//                   onClick={() => {
//                     setSelectedBulkOrders([]);
//                     setSelectedBulkAmount(0);
//                   }}
//                 >
//                   Clear Selected Orders
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* Table */}
//           <div className="overflow-x-auto bg-white">
//             <table className="min-w-full divide-y divide-gray-200 text-sm">
//               <thead className="bg-gray-100 text-gray-600 font-semibold">
//                 <tr>
//                   {selectedFilter === "Initiated" && (
//                     <th className="px-6 py-4">
//                       <div>
//                         <span>
//                           <input
//                             type="checkbox"
//                             className="w-4 h-4 text-indigo-600 rounded border-gray-300"
//                             checked={selectedBulkOrders.length === data.length}
//                             onChange={toggleSelectAll}
//                           />
//                         </span>
//                       </div>
//                     </th>
//                   )}

//                   <th className="px-6 py-3 text-left">RIDER</th>
//                   <th className="px-6 py-3 text-left">ORDER ID</th>
//                   <th className="px-6 py-3 text-left">AMOUNT</th>
//                   <th className="px-6 py-3 text-left">RECEIVED BY</th>
//                   <th className="px-6 py-3 text-left">REMARKS</th>
//                   <th className="px-6 py-3 text-left">STATUS</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {data.length > 0 ? (
//                   data.map((d, index) => {
//                     let isSelected;
//                     if (selectedFilter === "Initiated") {
//                       isSelected = selectedBulkOrders.some(
//                         (o) => o.id === d.id,
//                       );
//                     }
//                     return (
//                       <tr key={index} className="hover:bg-gray-50">
//                         {selectedFilter === "Initiated" && (
//                           <td className="px-6 py-4">
//                             <input
//                               type="checkbox"
//                               checked={isSelected}
//                               onChange={(e) => {
//                                 if (selectedFilter === "Initiated") {
//                                   if (e.target.checked) {
//                                     setSelectedBulkOrders((prev) => [
//                                       ...prev,
//                                       d,
//                                     ]);
//                                     setSelectedBulkAmount(
//                                       (prev) => Number(prev) + Number(d.amount),
//                                     );
//                                   } else {
//                                     setSelectedBulkOrders((prev) =>
//                                       prev.filter((o) => o.id !== d.id),
//                                     );
//                                     setSelectedBulkAmount(
//                                       (prev) => Number(prev) - Number(d.amount),
//                                     );
//                                   }
//                                 }
//                               }}
//                               className="w-4 h-4 text-[rgb(85,77,192)] border-gray-300 rounded"
//                             />
//                           </td>
//                         )}
//                         <td className="px-6 py-4">
//                           {`FP${vendorId}_${d.rider_id}`}, {d.rider_name}
//                         </td>
//                         <td className="px-6 py-4">
//                           <p className="text-l text-gray-800 flex items-center">
//                             <a
//                               href={`${frontEndURL}/track-order?awb_number=${d.awb_number}`}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="underline text-blue-700 hover:text-blue-500"
//                             >
//                               {d.awb_number}
//                             </a>
//                             <button
//                               className="pl-2 text-lg text-gray-600 hover:text-[rgb(85,77,192)] transition"
//                               onClick={() => {
//                                 navigator.clipboard.writeText(d.awb_number);
//                                 setCopySuccess(d.awb_number);
//                                 setTimeout(() => {
//                                   setCopySuccess(null);
//                                 }, 2000);
//                               }}
//                             >
//                               {copySuccess === d.awb_number ? (
//                                 <CiCircleCheck />
//                               ) : (
//                                 <FaRegCopy />
//                               )}
//                             </button>
//                           </p>
//                           <p className="text-s text-gray-500">
//                             {new Date(d.updated_at).toLocaleString("en-IN", {
//                               timeZone: "Asia/Kolkata",
//                               day: "2-digit",
//                               month: "2-digit",
//                               year: "numeric",
//                               hour: "2-digit",
//                               minute: "2-digit",
//                               hour12: true,
//                             })}
//                           </p>

//                           <p className="text-s text-gray-400">
//                             Order ID:{" "}
//                             {d.merchant_order_id?.length <= 20
//                               ? d.merchant_order_id
//                               : d.merchant_order_id?.slice(0, 20) + "..."}
//                             <button
//                               className="pl-2 text-lg text-gray-600 hover:text-[rgb(85,77,192)] transition"
//                               onClick={() => {
//                                 navigator.clipboard.writeText(
//                                   d.merchant_order_id,
//                                 );
//                                 setCopySuccess(d.merchant_order_id);
//                                 setTimeout(() => {
//                                   setCopySuccess(null);
//                                 }, 2000);
//                               }}
//                             >
//                               {copySuccess === d.merchant_order_id ? (
//                                 <CiCircleCheck />
//                               ) : (
//                                 <FaRegCopy />
//                               )}
//                             </button>
//                           </p>
//                         </td>
//                         <td className="px-6 py-4">{d.amount}</td>
//                         <td className="px-6 py-4">{d.received_by || "-"}</td>
//                         <td className="px-6 py-4">{d.remarks || "NA"}</td>
//                         <td className="px-6 py-4">
//                           {d.status === "pending" ? (
//                             <button className="bg-red-100 text-red-800 text-xs font-medium px-3 py-1 rounded-full">
//                               Pending
//                             </button>
//                           ) : d.status === "initiated" ? (
//                             <button
//                               onClick={() => handleEditClick(d)}
//                               className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full"
//                             >
//                               Initiated
//                             </button>
//                           ) : d.status === "received" ? (
//                             <span className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
//                               Received
//                             </span>
//                           ) : (
//                             <span className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
//                               Submitted
//                             </span>
//                           )}
//                         </td>
//                       </tr>
//                     );
//                   })
//                 ) : (
//                   <tr key={"No record found"}>
//                     <td
//                       colSpan="6"
//                       className="text-center px-6 py-6 text-gray-500"
//                     >
//                       No records found.
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           <div className="py-2 flex justify-center items-center gap-4">
//             <Button
//               onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
//               disabled={page === 1}
//               className={`px-4 py-2 rounded-sm text-sm font-medium ${
//                 page === 1
//                   ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                   : "bg-[#0446DB] text-white"
//               }`}
//             >
//               Previous
//             </Button>
//             <span className="text-gray-700">
//               Page {page} of {totalPages}
//             </span>
//             <Button
//               onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
//               disabled={page === totalPages}
//               className={`px-4 py-2 rounded-sm text-sm font-medium ${
//                 page === totalPages
//                   ? "bg-gray-300 text-gray-500 cursor-not-allowed"
//                   : "bg-[#0446DB] text-white"
//               }`}
//             >
//               Next
//             </Button>
//           </div>
//         </div>

//         {/* Modal */}
//         {editItem && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(46,46,46,0.5)]">
//             <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
//               {/* Modal Header */}
//               <div className="bg-[rgb(85,77,192)] px-6 py-4">
//                 <h2 className="text-xl font-semibold text-white">
//                   Update Remittance
//                 </h2>
//               </div>

//               {/* Modal Form */}
//               {/* onSubmit={handleSubmit} */}
//               <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
//                 {/* Order ID */}
//                 <div>
//                   <label className="block text-sm text-gray-700 font-medium mb-1">
//                     Order ID
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.orderId}
//                     readOnly
//                     className="w-full px-4 py-2 border border-gray-300 bg-gray-100 rounded-lg"
//                   />
//                 </div>

//                 {/* Remarks */}
//                 <div>
//                   <label className="block text-sm text-gray-700 font-medium mb-1">
//                     Remarks
//                   </label>
//                   <textarea
//                     className="w-full px-4 py-2 border border-gray-300 rounded-lg"
//                     value={formData.remarks}
//                     onChange={(e) =>
//                       setFormData({ ...formData, remarks: e.target.value })
//                     }
//                     required
//                   />
//                 </div>

//                 {/* New Status */}
//                 <div>
//                   <label className="block text-sm text-gray-700 font-medium mb-1">
//                     New Status
//                   </label>
//                   <input
//                     type="text"
//                     value="Received"
//                     readOnly
//                     className="w-full px-4 py-2 border border-gray-300 bg-green-100 text-green-500 rounded-lg"
//                   />
//                 </div>

//                 {/* Buttons */}
//                 <div className="flex justify-end space-x-3 pt-2">
//                   <button
//                     type="button"
//                     onClick={() => setEditItem(null)}
//                     className="px-5 py-2 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="px-5 py-2 rounded-lg bg-[rgb(85,77,192)] text-white hover:bg-indigo-800 transition"
//                   >
//                     Submit
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }

// export default TechCodRemittances;




import { useEffect, useState } from "react";
import axios from "axios";
import { FaRegCopy } from "react-icons/fa";
import { CiCircleCheck } from "react-icons/ci";
import { toast } from "react-toastify";

import AxiosInstance from "../../../../Helper/axiosInstance";

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

import {
  CalendarDays,
  Filter,
  PackageSearch,
  RotateCcw,
  Search,
  Truck,
  Upload,
  Download,
  X,
} from "lucide-react";

const baseURL = import.meta.env.VITE_BASE_URL;
const frontEndURL = import.meta.env.VITE_FRONTEND_URL;

function TechCodRemittances() {
  const [editItem, setEditItem] = useState(null);

  const [formData, setFormData] = useState({
    orderId: "",
    remarks: "",
    status: "received",
  });

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

  const [selectedBulkAmount, setSelectedBulkAmount] = useState(0);

  const filters = [
    "All",
    "Pending",
    "Initiated",
    "Received",
  ];

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

  /*
   * =========================================
   * Reset Advanced Filters
   * =========================================
   */
  const resetAdvanceFilters = async () => {
    const today = new Date();

    const oneMonthAgo = new Date();

    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    setAdvanceFilters({
      endDate: today.toISOString().split("T")[0],
      startDate: oneMonthAgo.toISOString().split("T")[0],
      rider_id: "",
      order_id: "",
      awb_number: "",
    });
  };

  /*
   * =========================================
   * Indian Currency Format
   * =========================================
   */
  const indianFormat = (num) => {
    return Number(num || 0).toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    });
  };

  /*
   * =========================================
   * Initial Default Date
   * =========================================
   */
  useEffect(() => {
    resetAdvanceFilters();
  }, []);

  /*
   * =========================================
   * Fetch Data
   * =========================================
   */
  const fetchData = async () => {
    setLoading(true);

    try {
      const params = {
        page,
        limit,

        start_date: advanceFilters.startDate,

        end_date: advanceFilters.endDate,

        rider_id: advanceFilters.rider_id,

        merchant_order_id: advanceFilters.order_id,

        awb_number: advanceFilters.awb_number,

        status:
          selectedFilter === "All" ? "" : selectedFilter.toLowerCase(),
      };

      const res = await AxiosInstance.get(
        "/api/tech-merchant/getRidersCodRemittance",
        {
          params,
        }
      );

      

      setData(res?.data?.data || []);

      setTotalPages(
        Math.max(1, Number(res?.data?.totalPages || 1))
      );

      setPendingAmount(
        indianFormat(
          Number(
            res?.data?.overallStatusSummary?.pending || 0
          )
        )
      );

      setInitiatedAmount(
        indianFormat(
          Number(
            res?.data?.overallStatusSummary?.initiated || 0
          )
        )
      );

      setReceivedAmount(
        indianFormat(
          Number(
            res?.data?.overallStatusSummary?.received || 0
          )
        )
      );

      setAdjustedAmount(
        indianFormat(
          Number(
            res?.data?.overallStatusSummary?.adjusted || 0
          )
        )
      );

      setTotalAmount(
        indianFormat(
          Number(
            res?.data?.overallStatusSummary?.pending || 0
          ) +
            Number(
              res?.data?.overallStatusSummary?.initiated ||
                0
            ) +
            Number(
              res?.data?.overallStatusSummary?.received || 0
            ) +
            Number(
              res?.data?.overallStatusSummary?.adjusted || 0
            )
        )
      );

      /*
       * If your API sends riders / vendor ID
       * you can set them here.
       */
      if (res?.data?.riders) {
        setRiders(res.data.riders);
      }

      if (res?.data?.vendor_id) {
        setVendorId(res.data.vendor_id);
      }
    } catch (err) {
      console.error(err);

      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to fetch data"
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * =========================================
   * Edit
   * =========================================
   */
  const handleEditClick = (item) => {
    setEditItem(item);

    setFormData({
      orderId: item?.order_id || "",
      remarks: "Remittance is received by Admin",
      status: "received",
    });
  };

  /*
   * =========================================
   * Submit Remittance
   * =========================================
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      await AxiosInstance.post(
        "/api/tech-merchant/uploadCODRemittance",
        {
          remarks: formData.remarks,
          status: "received",
          order_id: formData.orderId,
        }
      );

      toast.success(
        "Remittance updated successfully"
      );

      await fetchData();

      setEditItem(null);

      setFormData({
        orderId: "",
        remarks: "",
        status: "received",
      });
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Error while updating remittance"
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * =========================================
   * Select All
   * =========================================
   */
  const toggleSelectAll = () => {
    if (
      selectedBulkOrders.length === data.length
    ) {
      setSelectedBulkOrders([]);
      setSelectedBulkAmount(0);
    } else {
      setSelectedBulkOrders(data);

      const total = data.reduce(
        (sum, current) =>
          sum + Number(current?.amount || 0),
        0
      );

      setSelectedBulkAmount(total);
    }
  };

  /*
   * =========================================
   * Bulk Adjustment
   * =========================================
   */
  const handleBulkAdjustment = async () => {
    if (!selectedBulkOrders.length) {
      toast.error("Please select orders first");
      return;
    }

    setLoading(true);

    const order_id = selectedBulkOrders
      .map((o) => o.order_id)
      .join(",");

    try {
      await axios.post(
        `${baseURL}/api/merchant/adjustCodRemittanceAtVendor`,
        {
          order_id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "token"
            )}`,
          },
        }
      );

      toast.success(
        "COD remittance adjusted successfully"
      );

      setSelectedBulkAmount(0);

      setSelectedBulkOrders([]);

      await fetchData();
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Error while adjusting remittances"
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * =========================================
   * Status / Pagination Fetch
   * =========================================
   */
  useEffect(() => {
    fetchData();
  }, [selectedFilter, page]);

  /*
   * =========================================
   * Apply Advanced Filter
   * =========================================
   */
  useEffect(() => {
    if (filterUpdate) {
      fetchData();

      setFilterUpdate(false);
    }
  }, [filterUpdate]);

  /*
   * =========================================
   * Upload CSV
   * =========================================
   */
  const handleChange = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setLoading(true);

    const uploadData = new FormData();

    uploadData.append("file", file);

    try {
      const res = await AxiosInstance.post('/api/tech-merchant/updateCODRemittance',uploadData)
    
      toast.success(
        "File uploaded successfully"
      );

      await fetchData();
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Error while uploading file"
      );
    } finally {
      setLoading(false);

      e.target.value = "";
    }
  };

  /*
   * =========================================
   * Export CSV
   * =========================================
   */
  const exportCSV = async () => {
    setLoading(true);
  
    try { 

      const res = await AxiosInstance.get('/api/tech-merchant/exportCodRemittance',{
          status:
            selectedFilter === "All"
              ? ""
              : selectedFilter,

          order_id: advanceFilters.order_id,

          awb_number:
            advanceFilters.awb_number,

          rider_id: advanceFilters.rider_id,

          start_date:
            advanceFilters.startDate,

          end_date:
            advanceFilters.endDate,
        },)
      

      const url =
        window.URL.createObjectURL(
          new Blob([res.data])
        );

      const link =
        document.createElement("a");

      link.href = url;

      link.setAttribute(
        "download",
        "cod-remittances.csv"
      );

      document.body.appendChild(link);

      link.click();

      link.remove();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to export orders"
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * =========================================
   * Copy Function
   * =========================================
   */
  const handleCopy = async (value) => {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(
        value
      );

      setCopySuccess(value);

      setTimeout(() => {
        setCopySuccess(null);
      }, 2000);
    } catch {
      toast.error("Unable to copy");
    }
  };

  /*
   * =========================================
   * Apply Filter
   * =========================================
   */
  const handleApplyFilter = () => {
    setPage(1);

    setFilterUpdate(true);

    setIsFilterOpen(false);
  };

  /*
   * =========================================
   * Reset Filter
   * =========================================
   */
  const handleResetFilters = async () => {
    await resetAdvanceFilters();

    setPage(1);

    setFilterUpdate(true);
  };

  return (
    <>
      <div
        className="
          min-h-screen w-full
        
          text-gray-900
          transition-colors

          dark:bg-neutral-900
          dark:text-neutral-100
        "
      >
        {/* ================= HEADER ================= */}

        <div
          className="
             px-4 py-4
            

            dark:bg-neutral-950
            dark:border-b
            dark:border-neutral-800
          "
        >
          <div
            className="
              flex flex-col gap-4

              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >
            <div>
              <h1 className="text-2xl font-semibold darl:text-white">
                COD Remittances
              </h1>

              <p className="mt-1 text-sm dark:text-blue-100 ">
                Manage rider COD collections and
                remittance records
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Upload CSV */}

              <label
                className="
                  flex cursor-pointer items-center gap-2
                  rounded-md border border-white/30
                  bg-white px-4 py-2
                  text-sm font-medium
                  text-[#0446DB]
                  shadow-sm transition

                  hover:bg-blue-50

                  dark:border-neutral-700
                  dark:bg-neutral-800
                  dark:text-neutral-200
                  dark:hover:bg-neutral-700
                "
              >
                <Upload className="h-4 w-4" />

                <span>Bulk Upload</span>

                <input
                  type="file"
                  name="bulk_remittance"
                  onChange={handleChange}
                  accept=".csv"
                  className="hidden"
                />
              </label>

              {/* Export */}

              <Button
                type="button"
                onClick={exportCSV}
                disabled={loading}
                className="
                  gap-2 rounded-md
                  border border-white/30
                  bg-white px-4 py-2
                  font-medium text-[#0446DB]
                  shadow-sm transition

                  hover:bg-blue-50
                  hover:text-[#0446DB]

                  dark:border-neutral-700
                  dark:bg-neutral-800
                  dark:text-neutral-200
                  dark:hover:bg-neutral-700
                "
              >
                <Download className="h-4 w-4" />

                Export
              </Button>

              {/* ============= FILTER DRAWER ============= */}

              <Drawer
                direction="right"
                open={isFilterOpen}
                onOpenChange={
                  setIsFilterOpen
                }
              >
                <DrawerTrigger
                  render={
                    <Button
                      variant="outline"
                      className="
                        gap-2 rounded-md
                        border-white/30
                        bg-white px-4 py-2
                        font-medium
                        text-[#0446DB]
                        shadow-sm transition

                        hover:bg-blue-50
                        hover:text-[#0446DB]

                        dark:border-neutral-700
                        dark:bg-neutral-800
                        dark:text-blue-400
                        dark:hover:bg-neutral-700
                      "
                    />
                  }
                >
                  <Button 
                   className="
                        gap-2 rounded-md
                        border-white/30
                        bg-white px-4 py-2
                        font-medium
                        text-[#0446DB]
                        shadow-sm transition

                        hover:bg-blue-50
                        hover:text-[#0446DB]

                        dark:border-neutral-700
                        dark:bg-neutral-800
                        dark:text-blue-400
                        dark:hover:bg-neutral-700
                      "
                  >

                  <Filter className="h-4 w-4" />
                  Filter
                  </Button>
                </DrawerTrigger>

                <DrawerContent
                  className="
                    ml-auto h-full
                    w-full max-w-[420px]
                    rounded-none

                    border-l border-gray-200
                    bg-white

                    dark:border-neutral-700
                    dark:bg-neutral-900
                    dark:text-neutral-100
                  "
                >
                  {/* Drawer Header */}

                  <DrawerHeader
                    className="
                      border-b border-gray-200
                      px-5 py-5

                      dark:border-neutral-800
                    "
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <DrawerTitle
                          className="
                            flex items-center gap-2
                            text-xl font-semibold
                            text-gray-900

                            dark:text-neutral-100
                          "
                        >
                          <Filter
                            className="
                              h-5 w-5
                              text-[#0446DB]

                              dark:text-blue-400
                            "
                          />

                          Advanced Filters
                        </DrawerTitle>

                        <DrawerDescription
                          className="
                            mt-1 text-sm
                            text-gray-500

                            dark:text-neutral-400
                          "
                        >
                          Filter COD remittance
                          records.
                        </DrawerDescription>
                      </div>

                      <DrawerClose
                        render={
                          <button
                            type="button"
                            className="
                              flex h-8 w-8
                              items-center
                              justify-center
                              rounded-md

                              text-gray-500
                              transition

                              hover:bg-gray-100
                              hover:text-gray-800

                              dark:text-neutral-400
                              dark:hover:bg-neutral-800
                              dark:hover:text-white
                            "
                          />
                        }
                      >
                        <X className="h-4 w-4" />
                      </DrawerClose>
                    </div>
                  </DrawerHeader>

                  {/* Drawer Body */}

                  <div
                    className="
                      flex-1 space-y-5
                      overflow-y-auto p-5
                    "
                  >
                    {/* Date Grid */}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {/* Start Date */}

                      <div>
                        <label
                          className="
                            mb-2 flex items-center gap-2
                            text-sm font-medium
                            text-gray-700

                            dark:text-neutral-300
                          "
                        >
                          <CalendarDays className="h-4 w-4 text-gray-400 dark:text-neutral-500" />

                          Start Date
                        </label>

                        <input
                          type="date"
                          value={
                            advanceFilters.startDate
                          }
                          onChange={(e) =>
                            setAdvanceFilters(
                              (prev) => ({
                                ...prev,

                                startDate:
                                  e.target
                                    .value,
                              })
                            )
                          }
                          onClick={(e) =>
                            e.currentTarget.showPicker?.()
                          }
                          className="
                            w-full rounded-md
                            border border-gray-300
                            bg-white
                            px-3 py-2.5
                            text-sm text-gray-800
                            outline-none transition

                            focus:border-[#0446DB]
                            focus:ring-2
                            focus:ring-blue-500/10

                            dark:border-neutral-700
                            dark:bg-neutral-800
                            dark:text-neutral-100
                            dark:[color-scheme:dark]
                          "
                        />
                      </div>

                      {/* End Date */}

                      <div>
                        <label
                          className="
                            mb-2 flex items-center gap-2
                            text-sm font-medium
                            text-gray-700

                            dark:text-neutral-300
                          "
                        >
                          <CalendarDays className="h-4 w-4 text-gray-400 dark:text-neutral-500" />

                          End Date
                        </label>

                        <input
                          type="date"
                          value={
                            advanceFilters.endDate
                          }
                          onChange={(e) =>
                            setAdvanceFilters(
                              (prev) => ({
                                ...prev,

                                endDate:
                                  e.target
                                    .value,
                              })
                            )
                          }
                          onClick={(e) =>
                            e.currentTarget.showPicker?.()
                          }
                          className="
                            w-full rounded-md
                            border border-gray-300
                            bg-white
                            px-3 py-2.5
                            text-sm text-gray-800
                            outline-none transition

                            focus:border-[#0446DB]
                            focus:ring-2
                            focus:ring-blue-500/10

                            dark:border-neutral-700
                            dark:bg-neutral-800
                            dark:text-neutral-100
                            dark:[color-scheme:dark]
                          "
                        />
                      </div>
                    </div>

                    {/* Order ID */}

                    <div>
                      <label
                        className="
                          mb-2 flex items-center gap-2
                          text-sm font-medium
                          text-gray-700

                          dark:text-neutral-300
                        "
                      >
                        <PackageSearch className="h-4 w-4 text-gray-400 dark:text-neutral-500" />

                        Order ID
                      </label>

                      <input
                        type="text"
                        value={
                          advanceFilters.order_id
                        }
                        onChange={(e) =>
                          setAdvanceFilters(
                            (prev) => ({
                              ...prev,

                              order_id:
                                e.target
                                  .value,
                            })
                          )
                        }
                        placeholder="Enter Order ID"
                        className="
                          w-full rounded-md
                          border border-gray-300
                          bg-white
                          px-3 py-2.5
                          text-sm text-gray-800
                          outline-none transition

                          placeholder:text-gray-400

                          focus:border-[#0446DB]
                          focus:ring-2
                          focus:ring-blue-500/10

                          dark:border-neutral-700
                          dark:bg-neutral-800
                          dark:text-neutral-100
                          dark:placeholder:text-neutral-500
                        "
                      />
                    </div>

                    {/* AWB */}

                    <div>
                      <label
                        className="
                          mb-2 flex items-center gap-2
                          text-sm font-medium
                          text-gray-700

                          dark:text-neutral-300
                        "
                      >
                        <Search className="h-4 w-4 text-gray-400 dark:text-neutral-500" />

                        AWB Number
                      </label>

                      <input
                        type="text"
                        value={
                          advanceFilters.awb_number
                        }
                        onChange={(e) =>
                          setAdvanceFilters(
                            (prev) => ({
                              ...prev,

                              awb_number:
                                e.target
                                  .value,
                            })
                          )
                        }
                        placeholder="Enter AWB Number"
                        className="
                          w-full rounded-md
                          border border-gray-300
                          bg-white
                          px-3 py-2.5
                          text-sm text-gray-800
                          outline-none transition

                          placeholder:text-gray-400

                          focus:border-[#0446DB]
                          focus:ring-2
                          focus:ring-blue-500/10

                          dark:border-neutral-700
                          dark:bg-neutral-800
                          dark:text-neutral-100
                          dark:placeholder:text-neutral-500
                        "
                      />
                    </div>

                    {/* Rider */}

                    <div>
                      <label
                        className="
                          mb-2 flex items-center gap-2
                          text-sm font-medium
                          text-gray-700

                          dark:text-neutral-300
                        "
                      >
                        <Truck className="h-4 w-4 text-gray-400 dark:text-neutral-500" />

                        Rider
                      </label>

                      <select
                        value={
                          advanceFilters.rider_id
                        }
                        onChange={(e) =>
                          setAdvanceFilters(
                            (prev) => ({
                              ...prev,

                              rider_id:
                                e.target
                                  .value,
                            })
                          )
                        }
                        className="
                          w-full rounded-md
                          border border-gray-300
                          bg-white
                          px-3 py-2.5
                          text-sm text-gray-800
                          outline-none transition

                          focus:border-[#0446DB]
                          focus:ring-2
                          focus:ring-blue-500/10

                          dark:border-neutral-700
                          dark:bg-neutral-800
                          dark:text-neutral-100
                        "
                      >
                        <option value="">
                          All Riders
                        </option>

                        {riders.map(
                          (rider) => (
                            <option
                              key={rider.id}
                              value={rider.id}
                            >
                              FP{vendorId}_
                              {rider.id} |{" "}
                              {rider.name}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  </div>

                  {/* Drawer Footer */}

                  <DrawerFooter
                    className="
                      border-t border-gray-200
                      bg-gray-50

                      dark:border-neutral-800
                      dark:bg-neutral-950
                    "
                  >
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={
                          handleResetFilters
                        }
                        className="
                          flex items-center
                          justify-center gap-2
                          rounded-md

                          border border-gray-300
                          bg-white
                          px-4 py-2.5

                          text-sm font-medium
                          text-gray-700

                          transition

                          hover:bg-gray-100

                          dark:border-neutral-700
                          dark:bg-neutral-800
                          dark:text-neutral-300
                          dark:hover:bg-neutral-700
                        "
                      >
                        <RotateCcw className="h-4 w-4" />

                        Reset
                      </button>

                      <button
                        type="button"
                        onClick={
                          handleApplyFilter
                        }
                        className="
                          flex items-center
                          justify-center gap-2
                          rounded-md

                          bg-[#0446DB]
                          px-4 py-2.5

                          text-sm font-medium
                          text-white

                          transition

                          hover:bg-blue-700

                          dark:bg-blue-600
                          dark:hover:bg-blue-500
                        "
                      >
                        <Filter className="h-4 w-4" />

                        Apply Filter
                      </button>
                    </div>

                    <DrawerClose
                      render={
                        <Button
                          variant="ghost"
                          className="
                            w-full

                            text-gray-500

                            hover:bg-gray-100
                            hover:text-gray-800

                            dark:text-neutral-400
                            dark:hover:bg-neutral-800
                            dark:hover:text-white
                          "
                        />
                      }
                    >
                      Cancel
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </div>
          </div>
        </div>

        {/* ================= MAIN CONTENT ================= */}

        <div className="px-3 py-2 ">
          {/* ================= STATUS FILTER ================= */}

          <div
            className="
              
              border-gray-200
              dark:border-neutral-700
              dark:bg-neutral-800
              py-2
            "
          >
            <div
              className="
                flex flex-wrap
                justify-center gap-2
               
              "
            >
              {filters.map((filter) => (
                <Button
                  key={filter}
                  type="button"
                  onClick={() => {
                    setSelectedFilter(filter);

                    setPage(1);

                    setSelectedBulkOrders([]);

                    setSelectedBulkAmount(0);
                  }}
                  className={`
                    rounded-full border
                    px-4 py-2
                    text-sm font-medium
                    transition

                    ${
                      selectedFilter ===
                      filter
                        ? `
                          border-[#0446DB]
                          bg-[#0446DB]
                          text-white

                          hover:bg-blue-700

                          dark:border-blue-500
                          dark:bg-blue-600
                        `
                        : `
                          border-gray-300
                          bg-white
                          text-gray-700

                          hover:bg-gray-100

                          dark:border-neutral-700
                          dark:bg-neutral-900
                          dark:text-neutral-300
                          dark:hover:bg-neutral-700
                        `
                    }
                  `}
                >
                  {filter}

                  <span>
                    (
                    {filter === "All"
                      ? totalAmount
                      : filter ===
                          "Pending"
                        ? pendingAmount
                        : filter ===
                            "Adjusted"
                          ? adjustedAmount
                          : filter ===
                              "Initiated"
                            ? initiatedAmount
                            : receivedAmount}
                    )
                  </span>
                </Button>
              ))}
            </div>
          </div>

          {/* ================= BULK ASSIGNMENT ================= */}

          {selectedBulkOrders.length > 0 &&
            selectedFilter ===
              "Initiated" && (
              <div
                className="
                  mt-4 rounded-md
                  border border-gray-200
                  bg-white p-5
                  shadow-sm

                  dark:border-neutral-700
                  dark:bg-neutral-800
                "
              >
                <div
                  className="
                    mb-4 flex
                    flex-col gap-3

                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                  "
                >
                  <div>
                    <h2
                      className="
                        text-lg font-semibold
                        text-gray-800

                        dark:text-neutral-100
                      "
                    >
                      Bulk Adjustment
                    </h2>

                    <p
                      className="
                        mt-1 text-sm
                        text-gray-500

                        dark:text-neutral-400
                      "
                    >
                      {
                        selectedBulkOrders.length
                      }{" "}
                      order(s) selected
                    </p>
                  </div>

                  <div
                    className="
                      rounded-md
                      bg-blue-50
                      px-4 py-2
                      text-sm
                      font-semibold
                      text-[#0446DB]

                      dark:bg-blue-500/10
                      dark:text-blue-400
                    "
                  >
                    Total:{" "}
                    {indianFormat(
                      selectedBulkAmount
                    )}
                  </div>
                </div>

                <div
                  className="
                    overflow-x-auto
                    rounded-md
                    border border-gray-200

                    dark:border-neutral-700
                  "
                >
                  <table className="min-w-full text-sm">
                    <thead
                      className="
                        bg-gray-50
                        text-gray-600

                        dark:bg-neutral-900
                        dark:text-neutral-400
                      "
                    >
                      <tr>
                        <th className="px-4 py-3 text-left">
                          Order ID
                        </th>

                        <th className="px-4 py-3 text-left">
                          Order Amount
                        </th>
                      </tr>
                    </thead>

                    <tbody
                      className="
                        divide-y
                        divide-gray-100

                        dark:divide-neutral-700
                      "
                    >
                      {selectedBulkOrders.map(
                        (order) => (
                          <tr
                            key={
                              order.id
                            }
                            className="
                              text-gray-700

                              hover:bg-gray-50

                              dark:text-neutral-300
                              dark:hover:bg-neutral-900/60
                            "
                          >
                            <td className="px-4 py-3">
                              {order.id}
                            </td>

                            <td className="px-4 py-3">
                              {indianFormat(
                                order.amount
                              )}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>

                    <tfoot>
                      <tr
                        className="
                          bg-blue-50
                          font-semibold
                          text-[#0446DB]

                          dark:bg-blue-500/10
                          dark:text-blue-400
                        "
                      >
                        <td className="px-4 py-3">
                          Total Amount
                        </td>

                        <td className="px-4 py-3">
                          {indianFormat(
                            selectedBulkAmount
                          )}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    disabled={loading}
                    onClick={
                      handleBulkAdjustment
                    }
                    className="
                      rounded-md
                      bg-[#0446DB]
                      px-5 py-2

                      text-sm
                      font-medium
                      text-white

                      transition

                      hover:bg-blue-700

                      disabled:cursor-not-allowed
                      disabled:opacity-60

                      dark:bg-blue-600
                      dark:hover:bg-blue-500
                    "
                  >
                    Adjust COD
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedBulkOrders(
                        []
                      );

                      setSelectedBulkAmount(
                        0
                      );
                    }}
                    className="
                      rounded-md
                      bg-red-500
                      px-5 py-2

                      text-sm
                      font-medium
                      text-white

                      transition

                      hover:bg-red-600

                      dark:bg-red-600
                      dark:hover:bg-red-500
                    "
                  >
                    Clear Selected
                  </button>
                </div>
              </div>
            )}

          {/* ================= TABLE ================= */}

          <div
            className="
              mt-4 overflow-hidden
              rounded-md
              border border-gray-200
              bg-white
              shadow-sm

              dark:border-neutral-700
              dark:bg-neutral-800
            "
          >
            {loading && (
              <div
                className="
                  flex items-center
                  justify-center
                  border-b
                  border-gray-200
                  py-3

                  dark:border-neutral-700
                "
              >
                <div
                  className="
                    h-5 w-5
                    animate-spin
                    rounded-full
                    border-2

                    border-gray-300
                    border-t-[#0446DB]

                    dark:border-neutral-600
                    dark:border-t-blue-500
                  "
                />
              </div>
            )}

            <div className="overflow-x-auto">
              <table
                className="
                  min-w-full
                  divide-y
                  divide-gray-200
                  text-sm

                  dark:divide-neutral-700
                "
              >
                <thead
                  className="
                    bg-gray-100
                    font-semibold
                    text-gray-600

                    dark:bg-neutral-900
                    dark:text-neutral-400
                  "
                >
                  <tr>
                    {selectedFilter ===
                      "Initiated" && (
                      <th className="px-6 py-4">
                        <input
                          type="checkbox"
                          className="
                            h-4 w-4
                            rounded
                            border-gray-300
                            accent-[#0446DB]

                            dark:border-neutral-600
                          "
                          checked={
                            data.length >
                              0 &&
                            selectedBulkOrders.length ===
                              data.length
                          }
                          onChange={
                            toggleSelectAll
                          }
                        />
                      </th>
                    )}

                    <th className="whitespace-nowrap px-6 py-3 text-left">
                      RIDER
                    </th>

                    <th className="whitespace-nowrap px-6 py-3 text-left">
                      ORDER ID
                    </th>

                    <th className="whitespace-nowrap px-6 py-3 text-left">
                      AMOUNT
                    </th>

                    <th className="whitespace-nowrap px-6 py-3 text-left">
                      RECEIVED BY
                    </th>

                    <th className="whitespace-nowrap px-6 py-3 text-left">
                      REMARKS
                    </th>

                    <th className="whitespace-nowrap px-6 py-3 text-left">
                      STATUS
                    </th>
                  </tr>
                </thead>

                <tbody
                  className="
                    divide-y
                    divide-gray-100
                    bg-white

                    dark:divide-neutral-700
                    dark:bg-neutral-800
                  "
                >
                  {data.length > 0 ? (
                    data.map(
                      (d, index) => {
                        const isSelected =
                          selectedBulkOrders.some(
                            (o) =>
                              o.id ===
                              d.id
                          );

                        return (
                          <tr
                            key={
                              d?.id ??
                              index
                            }
                            className="
                              transition-colors

                              hover:bg-gray-50

                              dark:hover:bg-neutral-900/60
                            "
                          >
                            {selectedFilter ===
                              "Initiated" && (
                              <td className="px-6 py-4">
                                <input
                                  type="checkbox"
                                  checked={
                                    isSelected
                                  }
                                  className="
                                    h-4 w-4
                                    rounded
                                    border-gray-300
                                    accent-[#0446DB]

                                    dark:border-neutral-600
                                  "
                                  onChange={(
                                    e
                                  ) => {
                                    if (
                                      e
                                        .target
                                        .checked
                                    ) {
                                      setSelectedBulkOrders(
                                        (
                                          prev
                                        ) => [
                                          ...prev,
                                          d,
                                        ]
                                      );

                                      setSelectedBulkAmount(
                                        (
                                          prev
                                        ) =>
                                          Number(
                                            prev ||
                                              0
                                          ) +
                                          Number(
                                            d.amount ||
                                              0
                                          )
                                      );
                                    } else {
                                      setSelectedBulkOrders(
                                        (
                                          prev
                                        ) =>
                                          prev.filter(
                                            (
                                              o
                                            ) =>
                                              o.id !==
                                              d.id
                                          )
                                      );

                                      setSelectedBulkAmount(
                                        (
                                          prev
                                        ) =>
                                          Number(
                                            prev ||
                                              0
                                          ) -
                                          Number(
                                            d.amount ||
                                              0
                                          )
                                      );
                                    }
                                  }}
                                />
                              </td>
                            )}

                            {/* Rider */}

                            <td
                              className="
                                whitespace-nowrap
                                px-6 py-4

                                text-gray-700

                                dark:text-neutral-300
                              "
                            >
                              <div>
                                <p className="font-medium">
                                  FP
                                  {vendorId}
                                  _
                                  {
                                    d.rider_id
                                  }
                                </p>

                                <p
                                  className="
                                    mt-0.5
                                    text-xs
                                    text-gray-500

                                    dark:text-neutral-500
                                  "
                                >
                                  {d.rider_name ||
                                    "-"}
                                </p>
                              </div>
                            </td>

                            {/* Order */}

                            <td className="min-w-[230px] px-6 py-4">
                              <div>
                                <div className="flex items-center">
                                  <a
                                    href={`${frontEndURL}/track-order?awb_number=${d.awb_number}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="
                                      font-medium
                                      text-blue-700
                                      underline

                                      hover:text-blue-500

                                      dark:text-blue-400
                                      dark:hover:text-blue-300
                                    "
                                  >
                                    {
                                      d.awb_number
                                    }
                                  </a>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleCopy(
                                        d.awb_number
                                      )
                                    }
                                    className="
                                      pl-2
                                      text-lg
                                      text-gray-500
                                      transition

                                      hover:text-[#0446DB]

                                      dark:text-neutral-400
                                      dark:hover:text-blue-400
                                    "
                                  >
                                    {copySuccess ===
                                    d.awb_number ? (
                                      <CiCircleCheck className="text-green-500" />
                                    ) : (
                                      <FaRegCopy />
                                    )}
                                  </button>
                                </div>

                                <p
                                  className="
                                    mt-1
                                    text-xs
                                    text-gray-500

                                    dark:text-neutral-400
                                  "
                                >
                                  {d.updated_at
                                    ? new Date(
                                        d.updated_at
                                      ).toLocaleString(
                                        "en-IN",
                                        {
                                          timeZone:
                                            "Asia/Kolkata",

                                          day: "2-digit",

                                          month:
                                            "2-digit",

                                          year: "numeric",

                                          hour: "2-digit",

                                          minute:
                                            "2-digit",

                                          hour12:
                                            true,
                                        }
                                      )
                                    : "-"}
                                </p>

                                <div
                                  className="
                                    mt-1 flex
                                    items-center

                                    text-xs
                                    text-gray-400

                                    dark:text-neutral-500
                                  "
                                >
                                  <span>
                                    Order ID:{" "}
                                    {d
                                      ?.merchant_order_id
                                      ?.length >
                                    20
                                      ? `${d.merchant_order_id.slice(
                                          0,
                                          20
                                        )}...`
                                      : d.merchant_order_id ||
                                        "-"}
                                  </span>

                                  {d?.merchant_order_id && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleCopy(
                                          d.merchant_order_id
                                        )
                                      }
                                      className="
                                        pl-2
                                        text-base
                                        text-gray-500

                                        hover:text-[#0446DB]

                                        dark:text-neutral-400
                                        dark:hover:text-blue-400
                                      "
                                    >
                                      {copySuccess ===
                                      d.merchant_order_id ? (
                                        <CiCircleCheck className="text-green-500" />
                                      ) : (
                                        <FaRegCopy />
                                      )}
                                    </button>
                                  )}
                                </div>
                              </div>
                            </td>

                            {/* Amount */}

                            <td
                              className="
                                whitespace-nowrap
                                px-6 py-4
                                font-semibold

                                text-gray-800

                                dark:text-neutral-200
                              "
                            >
                              {indianFormat(
                                d.amount
                              )}
                            </td>

                            {/* Received By */}

                            <td
                              className="
                                whitespace-nowrap
                                px-6 py-4

                                text-gray-700

                                dark:text-neutral-300
                              "
                            >
                              {d.received_by ||
                                "-"}
                            </td>

                            {/* Remarks */}

                            <td
                              className="
                                min-w-[180px]
                                px-6 py-4

                                text-gray-700

                                dark:text-neutral-300
                              "
                            >
                              {d.remarks ||
                                "NA"}
                            </td>

                            {/* Status */}

                            <td className="whitespace-nowrap px-6 py-4">
                              {d.status ===
                              "pending" ? (
                                <span
                                  className="
                                    inline-flex
                                    rounded-full
                                    bg-red-100
                                    px-3 py-1

                                    text-xs
                                    font-medium
                                    text-red-800

                                    dark:bg-red-500/10
                                    dark:text-red-400
                                  "
                                >
                                  Pending
                                </span>
                              ) : d.status ===
                                "initiated" ? (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleEditClick(
                                      d
                                    )
                                  }
                                  className="
                                    rounded-full
                                    bg-blue-100
                                    px-3 py-1

                                    text-xs
                                    font-medium
                                    text-blue-800

                                    transition

                                    hover:bg-blue-200

                                    dark:bg-blue-500/10
                                    dark:text-blue-400
                                    dark:hover:bg-blue-500/20
                                  "
                                >
                                  Initiated
                                </button>
                              ) : d.status ===
                                "received" ? (
                                <span
                                  className="
                                    inline-flex
                                    rounded-full
                                    bg-green-100
                                    px-3 py-1

                                    text-xs
                                    font-medium
                                    text-green-700

                                    dark:bg-green-500/10
                                    dark:text-green-400
                                  "
                                >
                                  Received
                                </span>
                              ) : (
                                <span
                                  className="
                                    inline-flex
                                    rounded-full
                                    bg-green-100
                                    px-3 py-1

                                    text-xs
                                    font-medium
                                    text-green-700

                                    dark:bg-green-500/10
                                    dark:text-green-400
                                  "
                                >
                                  Submitted
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      }
                    )
                  ) : (
                    <tr>
                      <td
                        colSpan={
                          selectedFilter ===
                          "Initiated"
                            ? 7
                            : 6
                        }
                        className="
                          px-6 py-14
                          text-center
                          text-gray-500

                          dark:text-neutral-400
                        "
                      >
                        <div className="flex flex-col items-center">
                          <PackageSearch
                            className="
                              mb-3
                              h-9 w-9
                              text-gray-300

                              dark:text-neutral-600
                            "
                          />

                          <p className="font-medium">
                            No records found
                          </p>

                          <p className="mt-1 text-xs">
                            Try changing your
                            filters.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* ================= PAGINATION ================= */}

            <div
              className="
                flex flex-col
                items-center
                justify-between gap-3

                border-t
                border-gray-200

                bg-gray-50
                px-4 py-3

                sm:flex-row

                dark:border-neutral-700
                dark:bg-neutral-900
              "
            >
              <span
                className="
                  text-sm text-gray-600

                  dark:text-neutral-400
                "
              >
                Page{" "}
                <span className="font-semibold">
                  {page}
                </span>{" "}
                of{" "}
                <span className="font-semibold">
                  {totalPages}
                </span>
              </span>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  onClick={() =>
                    setPage((prev) =>
                      Math.max(
                        prev - 1,
                        1
                      )
                    )
                  }
                  disabled={page === 1}
                  className={`
                    rounded-md px-4 py-2
                    text-sm font-medium

                    ${
                      page === 1
                        ? `
                          cursor-not-allowed
                          bg-gray-200
                          text-gray-400

                          dark:bg-neutral-800
                          dark:text-neutral-600
                        `
                        : `
                          bg-[#0446DB]
                          text-white

                          hover:bg-blue-700

                          dark:bg-blue-600
                          dark:hover:bg-blue-500
                        `
                    }
                  `}
                >
                  Previous
                </Button>

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
                  disabled={
                    page === totalPages
                  }
                  className={`
                    rounded-md px-4 py-2
                    text-sm font-medium

                    ${
                      page ===
                      totalPages
                        ? `
                          cursor-not-allowed
                          bg-gray-200
                          text-gray-400

                          dark:bg-neutral-800
                          dark:text-neutral-600
                        `
                        : `
                          bg-[#0446DB]
                          text-white

                          hover:bg-blue-700

                          dark:bg-blue-600
                          dark:hover:bg-blue-500
                        `
                    }
                  `}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* ================= UPDATE MODAL ================= */}

        {editItem && (
          <div
            className="
              fixed inset-0 z-50
              flex items-center
              justify-center

              bg-black/50
              px-4

              backdrop-blur-[2px]
            "
          >
            <div
              className="
                w-full max-w-lg
                overflow-hidden
                rounded-xl

                border
                border-gray-200

                bg-white
                shadow-2xl

                dark:border-neutral-700
                dark:bg-neutral-900
              "
            >
              {/* Modal Header */}

              <div
                className="
                  flex items-center
                  justify-between

                  bg-[#0446DB]
                  px-6 py-4

                  dark:bg-neutral-950
                  dark:border-b
                  dark:border-neutral-800
                "
              >
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    Update Remittance
                  </h2>

                  <p className="mt-0.5 text-xs text-blue-100 dark:text-neutral-400">
                    Update COD remittance
                    status.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setEditItem(null)
                  }
                  className="
                    flex h-8 w-8
                    items-center
                    justify-center

                    rounded-md
                    text-white/80

                    transition

                    hover:bg-white/10
                    hover:text-white
                  "
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Form */}

              <form
                onSubmit={handleSubmit}
                className="space-y-5 px-6 py-6"
              >
                {/* Order ID */}

                <div>
                  <label
                    className="
                      mb-1.5 block
                      text-sm
                      font-medium
                      text-gray-700

                      dark:text-neutral-300
                    "
                  >
                    Order ID
                  </label>

                  <input
                    type="text"
                    value={
                      formData.orderId
                    }
                    readOnly
                    className="
                      w-full rounded-md
                      border border-gray-300
                      bg-gray-100
                      px-4 py-2.5

                      text-sm
                      text-gray-600

                      outline-none

                      dark:border-neutral-700
                      dark:bg-neutral-800
                      dark:text-neutral-400
                    "
                  />
                </div>

                {/* Remarks */}

                <div>
                  <label
                    className="
                      mb-1.5 block
                      text-sm
                      font-medium
                      text-gray-700

                      dark:text-neutral-300
                    "
                  >
                    Remarks
                  </label>

                  <textarea
                    rows={4}
                    value={
                      formData.remarks
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,

                        remarks:
                          e.target.value,
                      })
                    }
                    required
                    placeholder="Enter remarks"
                    className="
                      w-full resize-none
                      rounded-md

                      border
                      border-gray-300

                      bg-white
                      px-4 py-2.5

                      text-sm
                      text-gray-800

                      outline-none

                      transition

                      placeholder:text-gray-400

                      focus:border-[#0446DB]
                      focus:ring-2
                      focus:ring-blue-500/10

                      dark:border-neutral-700
                      dark:bg-neutral-800
                      dark:text-neutral-100
                      dark:placeholder:text-neutral-500
                    "
                  />
                </div>

                {/* New Status */}

                <div>
                  <label
                    className="
                      mb-1.5 block
                      text-sm
                      font-medium
                      text-gray-700

                      dark:text-neutral-300
                    "
                  >
                    New Status
                  </label>

                  <input
                    type="text"
                    value="Received"
                    readOnly
                    className="
                      w-full rounded-md

                      border
                      border-green-200

                      bg-green-50
                      px-4 py-2.5

                      text-sm
                      font-medium
                      text-green-600

                      outline-none

                      dark:border-green-500/20
                      dark:bg-green-500/10
                      dark:text-green-400
                    "
                  />
                </div>

                {/* Buttons */}

                <div
                  className="
                    flex justify-end
                    gap-3 pt-2
                  "
                >
                  <button
                    type="button"
                    onClick={() =>
                      setEditItem(null)
                    }
                    className="
                      rounded-md

                      border
                      border-gray-300

                      bg-white
                      px-5 py-2.5

                      text-sm
                      font-medium
                      text-gray-700

                      transition

                      hover:bg-gray-100

                      dark:border-neutral-700
                      dark:bg-neutral-800
                      dark:text-neutral-300
                      dark:hover:bg-neutral-700
                    "
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="
                      rounded-md

                      bg-[#0446DB]
                      px-5 py-2.5

                      text-sm
                      font-medium
                      text-white

                      transition

                      hover:bg-blue-700

                      disabled:cursor-not-allowed
                      disabled:opacity-60

                      dark:bg-blue-600
                      dark:hover:bg-blue-500
                    "
                  >
                    {loading
                      ? "Updating..."
                      : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default TechCodRemittances;