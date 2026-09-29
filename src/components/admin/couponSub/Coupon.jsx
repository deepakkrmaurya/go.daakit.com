// import React, { useEffect, useState } from 'react';
// import { Link } from 'react-router-dom';
// import { FaEdit, FaTrash, FaCopy, FaEye, FaSearch, FaFilter } from 'react-icons/fa';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button"
// import { Loader2 } from 'lucide-react';
// const baseURL = import.meta.env.VITE_BASE_URL;
// export default function Coupon() {
//     const [coupons, setCoupons] = useState([]);

//     const [searchTerm, setSearchTerm] = useState('');
//     const [statusFilter, setStatusFilter] = useState('all');
//     const [deleteConfirm, setDeleteConfirm] = useState(null);

//     // Filter coupons based on search and status
//     const filteredCoupons = coupons.filter(coupon => {
//         const matchesSearch = coupon.coupon_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             coupon.coupon_code.toLowerCase().includes(searchTerm.toLowerCase());
//         const matchesStatus = statusFilter === 'all' || coupon.status === statusFilter;
//         return matchesSearch && matchesStatus;
//     });

//     const handleDelete = async (id) => {
//         try {
//             const res = await axios.delete(`${baseURL}/api/admin/deleteCoupon`, {
//                 data: { coupon_id: id }, // ✅ send body data here
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem("token")}`,
//                 },
//             });

//             toast.success(res.data.message)
//             getAllCoupons()
//             setDeleteConfirm(null)
//         } catch (error) {
//             toast.error(error.response.data.message)
//             setDeleteConfirm(null)
//         }

//     };

//     const copyToClipboard = (text) => {
//         navigator.clipboard.writeText(text);
//         // You can add a toast notification here
//         alert('Coupon code copied to clipboard!');
//     };

//     const getStatusBadge = (status) => {
//         const statusConfig = {
//             active: { color: 'bg-green-100 text-green-800', text: 'Active' },
//             expired: { color: 'bg-red-100 text-red-800', text: 'Expired' },
//             upcoming: { color: 'bg-blue-100 text-blue-800', text: 'Upcoming' },
//             paused: { color: 'bg-yellow-100 text-yellow-800', text: 'Paused' }
//         };

//         const config = statusConfig[status] || statusConfig.active;
//         return (
//             <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
//                 {config.text}
//             </span>
//         );
//     };

//     const getDiscountText = (coupon) => {
//         if (coupon.coupon_type === 'percentage') {
//             return `${coupon.discount_amount}%${coupon.discount_amount_upto ? ` upto ₹${coupon.discount_amount_upto}` : ''}`;
//         }
//         return `₹${coupon.discount_amount}`;
//     };

//     const getAllCoupons = async () => {
//         try {
//             const res = await axios.get(`${baseURL}/api/admin/getAllCoupons`,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${localStorage.getItem("token")}`,
//                     },

//                 });
//             setCoupons(res.data.data)

//         } catch (error) {
//             toast.error(error.response.data.message)
//         }
//     }
//     useEffect(() => {
//         getAllCoupons()
//     }, [])
//     // Delete Confirmation Modal
//     const DeleteConfirmationModal = () => {
//         if (!deleteConfirm) return null;

//         const coupon = coupons.find(c => c.id === deleteConfirm);

//         return (
//             <div className="fixed inset-0  bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//                 <div className="bg-blue-400  rounded-sm max-w-md w-full p-6">
//                     <h3 className="text-lg font-semibold text-red-600 mb-2">Delete Coupon</h3>
//                     <p className="text-white mb-4">
//                         Are you sure you want to delete coupon <strong>"{coupon?.coupon_name}"</strong>?
//                         This action cannot be undone.
//                     </p>
//                     <div className="flex justify-end gap-3">
//                         <button
//                             onClick={() => setDeleteConfirm(null)}
//                             className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             onClick={() => handleDelete(deleteConfirm)}
//                             className="px-4 py-2 bg-red-600 text-white rounded-sm hover:bg-red-700 font-medium transition-colors"
//                         >
//                             Delete
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         );
//     };


//     const [loadingPage, setLoadingPage] = useState(true);

// useEffect(() => {
//   const timer = setTimeout(() => {
//     setLoadingPage(false);
//   }, 2000);

//   return () => clearTimeout(timer);
// }, []);

//     return (
//         <>
//         {
//             loadingPage ?(
//                <div className=" w-full h-[90vh] flex justify-center items-center">
//                   <div>
//                     <Loader2 className="h-8 w-8 animate-spin mx-auto" />
//                     <p className="mt-2"> Loading Coupon Details...</p>
//                   </div>
//                 </div>
//             ):(

//         <div className="min-h-screen bg-[#f5f8fb] dark:bg-neutral-900 ">
//             <div className=" mx-auto">
//                 {/* Header */}
//                 <div className=" px-4 py-5 sm:px-6 sm:py-6">
//                     <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
//                         <div className="w-full lg:w-auto">
//                             <h1 className="text-2xl font-bold text-gray-800 dark:text-white sm:text-3xl">Coupon Management</h1>

//                         </div>

//                         <div className='flex w-full flex-col gap-3 sm:flex-row lg:max-w-2xl'>
//                             <div className="relative w-full sm:flex-1">
//                                 <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0446DB]" />
//                                 <Input
//                                     type="text"
//                                     placeholder="Search coupons by name or code..."
//                                     value={searchTerm}
//                                     onChange={(e) => setSearchTerm(e.target.value)}
//                                     className="w-full bg-white pl-10 pr-4 py-3 text-sm text-gray-900 border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors dark:text-white sm:text-base"
//                                 />
//                             </div>
//                             <Link
//                                 to={'/admin/add/coupon'}
//                                 className="inline-flex w-full items-center justify-center rounded-sm text-white px-5 py-1 text-sm font-semibold bg-[#0446DB] sm:w-auto sm:shrink-0 sm:px-6 sm:text-base"
//                             >
//                                 Add New Coupon
//                             </Link>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Coupons Table */}
//                 <div className="bg-white dark:bg-neutral-900 rounded-sm shadow-sm  overflow-hidden">
//                     <div className="overflow-x-auto">
//                         <table className="w-full">
//                             <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200">
//                                 <tr>
//                                     <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                         Coupon Details
//                                     </th>
//                                     <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                         Discount
//                                     </th>
//                                     <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                         discount type
//                                     </th>
//                                     <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                         Validity
//                                     </th>
//                                     <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                         Coupon Limit
//                                     </th>
//                                     <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                         Status
//                                     </th>
//                                     <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                         Coupon Type
//                                     </th>
//                                     <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                         Coupon Used
//                                     </th>
//                                     <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                         Discount Amount Upto
//                                     </th>
//                                     <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                         User Wise Limit
//                                     </th>
//                                     <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                                         Actions
//                                     </th>
//                                 </tr>
//                             </thead>
//                             <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200">
//                                 {filteredCoupons.map((coupon) => (
//                                     <tr key={coupon.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
//                                         <td className="px-6 py-4 whitespace-nowrap">
//                                             <div>
//                                                 <div className="flex items-center gap-3">

//                                                     <div>
//                                                         <div className="text-sm font-medium dark:text-white text-gray-900">
//                                                             {coupon.coupon_name}
//                                                         </div>
//                                                         <div className="flex items-center gap-2 mt-1">
//                                                             <code className="text-sm font-mono bg-gray-100 dark:bg-gray-800 dark:text-white px-2 py-1 rounded border">
//                                                                 {coupon.coupon_code}
//                                                             </code>
//                                                             <button
//                                                                 onClick={() => copyToClipboard(coupon.coupon_code)}
//                                                                 className="text-gray-400 hover:text-gray-600 transition-colors"
//                                                                 title="Copy coupon code"
//                                                             >
//                                                                 <FaCopy className="w-3 h-3" />
//                                                             </button>
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                                 {coupon.description && (
//                                                     <p className="text-sm dark:text-white text-gray-500 mt-2">{coupon.description}</p>
//                                                 )}
//                                             </div>
//                                         </td>
//                                         <td className="px-6 py-4 dark:text-white whitespace-nowrap">
//                                             <div className="text-sm font-medium dark:text-white text-gray-900">
//                                                 {getDiscountText(coupon)}
//                                             </div>
//                                             {coupon.minimum_amount_recharge > 0 && (
//                                                 <div className="text-sm dark:text-white text-gray-500 mt-1">
//                                                     Min: ₹{coupon.minimum_amount_recharge}
//                                                 </div>
//                                             )}
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap dark:text-white">
//                                             {coupon.discount_type}
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap">
//                                             <div className="text-sm text-gray-900 dark:text-white">
//                                                 {new Date(coupon.start_date).toLocaleDateString()}
//                                             </div>
//                                             <div className="text-sm text-gray-500 dark:text-white">
//                                                 to {new Date(coupon.end_date).toLocaleDateString()}
//                                             </div>
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap">
//                                             <div className="text-sm text-gray-900 dark:text-white">
//                                                 {coupon.coupon_limit}
//                                             </div>

//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap">
//                                             {getStatusBadge(coupon.coupon_status)}
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap dark:text-white">
//                                             {coupon.coupon_type}
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap dark:text-white">
//                                             {coupon.coupon_used}
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap dark:text-white">
//                                             {coupon.discount_amount_upto}
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap dark:text-white">
//                                             {coupon.user_wise_limit}
//                                         </td>
//                                         <td className="px-6 py-4 whitespace-nowrap">
//                                             <div className="flex items-center gap-2">

//                                                 <button
//                                                     onClick={() => setDeleteConfirm(coupon.id)}
//                                                     className="p-2 text-red-600 hover:bg-red-50 rounded-sm transition-colors"
//                                                     title="Delete coupon"
//                                                 >
//                                                     <FaTrash className="w-4 h-4" />
//                                                 </button>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>

//                     {/* Empty State */}
//                     {filteredCoupons.length === 0 && (
//                         <div className="text-center py-12">
//                             <div className="text-gray-400 mb-4">
//                                 <FaCopy className="w-16 h-16 mx-auto" />
//                             </div>
//                             <h3 className="text-lg font-medium text-gray-900 mb-2">No coupons found</h3>
//                             <p className="text-gray-500 mb-4">
//                                 {searchTerm || statusFilter !== 'all'
//                                     ? 'Try adjusting your search or filter criteria'
//                                     : 'Get started by creating your first coupon'
//                                 }
//                             </p>
//                             {(!searchTerm && statusFilter === 'all') && (
//                                 <Link
//                                     to={'/admin/add/coupon'}
//                                     className="inline-flex items-center px-6 py-3 bg-[#0446DB] text-white font-medium rounded-sm hover:bg-blue-700 transition-colors"
//                                 >
//                                     Create Your First Coupon
//                                 </Link>
//                             )}
//                         </div>
//                     )}

//                     {/* Pagination (optional) */}
//                     {filteredCoupons.length > 0 && (
//                         <div className="px-6 py-4 border-t border-gray-200">
//                             <div className="flex items-center justify-between">
//                                 <div className="text-sm text-gray-700 dark:text-white">
//                                     Showing <span className="font-medium">{filteredCoupons.length}</span> of{' '}
//                                     <span className="font-medium">{coupons.length}</span> coupons
//                                 </div>
//                                 <div className="flex gap-2">
//                                     <button className="px-3 dark:text-white py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
//                                         Previous
//                                     </button>
//                                     <button className="px-3 dark:text-white py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
//                                         Next
//                                     </button>
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* Delete Confirmation Modal */}
//             <DeleteConfirmationModal />
//         </div>
//             )
//         }
//         </>
//     );
// }



import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaCopy,
  FaSearch,
  FaTrash,
  FaPlus,
  FaTicketAlt,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaPercentage,
  FaRupeeSign,
  FaCalendarAlt,
  FaUsers,
  FaTimes,
  FaExclamationTriangle,
} from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { Loader2, RefreshCw, SearchX } from "lucide-react";

const baseURL = import.meta.env.VITE_BASE_URL;

export default function Coupon() {
  const [coupons, setCoupons] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [loadingPage, setLoadingPage] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const getAllCoupons = async (showRefreshLoader = false) => {
    if (showRefreshLoader) setRefreshing(true);

    try {
      const res = await axios.get(`${baseURL}/api/admin/getAllCoupons`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setCoupons(Array.isArray(res?.data?.data) ? res.data.data : []);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to load coupons"
      );
    } finally {
      setLoadingPage(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    getAllCoupons();
  }, []);

  const filteredCoupons = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    return coupons.filter((coupon) => {
      const name = String(coupon?.coupon_name || "").toLowerCase();
      const code = String(coupon?.coupon_code || "").toLowerCase();

      const matchesSearch =
        !search || name.includes(search) || code.includes(search);

      const currentStatus = String(
        coupon?.coupon_status || coupon?.status || ""
      ).toLowerCase();

      const matchesStatus =
        statusFilter === "all" || currentStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [coupons, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    const now = new Date();

    return coupons.reduce(
      (acc, coupon) => {
        const status = String(
          coupon?.coupon_status || coupon?.status || ""
        ).toLowerCase();

        acc.total += 1;

        if (status === "active") acc.active += 1;
        if (status === "expired") acc.expired += 1;
        if (status === "upcoming") acc.upcoming += 1;

        if (!status && coupon?.end_date) {
          const end = new Date(coupon.end_date);
          if (!Number.isNaN(end.getTime()) && end < now) acc.expired += 1;
        }

        return acc;
      },
      { total: 0, active: 0, expired: 0, upcoming: 0 }
    );
  }, [coupons]);

  const handleDelete = async (id) => {
    setDeleting(true);

    try {
      const res = await axios.delete(`${baseURL}/api/admin/deleteCoupon`, {
        data: { coupon_id: id },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      toast.success(res?.data?.message || "Coupon deleted successfully");
      setDeleteConfirm(null);
      await getAllCoupons();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to delete coupon"
      );
    } finally {
      setDeleting(false);
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Coupon code copied");
    } catch {
      toast.error("Unable to copy coupon code");
    }
  };

  const getStatusBadge = (statusValue) => {
    const status = String(statusValue || "active").toLowerCase();

    const config = {
      active: {
        label: "Active",
        classes:
          "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-400",
        dot: "bg-emerald-500",
      },
      expired: {
        label: "Expired",
        classes:
          "border-red-200 bg-red-50 text-red-700 dark:border-red-900/60 dark:bg-red-950/40 dark:text-red-400",
        dot: "bg-red-500",
      },
      upcoming: {
        label: "Upcoming",
        classes:
          "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/40 dark:text-blue-400",
        dot: "bg-blue-500",
      },
      paused: {
        label: "Paused",
        classes:
          "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-400",
        dot: "bg-amber-500",
      },
    };

    const item = config[status] || config.active;

    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${item.classes}`}
      >
        <span className={`h-1.5 w-1.5 rounded-full ${item.dot}`} />
        {item.label}
      </span>
    );
  };

  const getDiscountText = (coupon) => {
    if (coupon?.coupon_type === "percentage") {
      return `${coupon?.discount_amount || 0}%${
        coupon?.discount_amount_upto
          ? ` upto ₹${coupon.discount_amount_upto}`
          : ""
      }`;
    }

    return `₹${coupon?.discount_amount || 0}`;
  };

  const formatDate = (date) => {
    if (!date) return "—";
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return "—";

    return parsed.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const statCards = [
    {
      label: "Total Coupons",
      value: stats.total,
      icon: FaTicketAlt,
      iconBox:
        "bg-blue-50 text-[#0446DB] dark:bg-blue-950/40 dark:text-blue-400",
    },
    {
      label: "Active Coupons",
      value: stats.active,
      icon: FaCheckCircle,
      iconBox:
        "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400",
    },
    {
      label: "Upcoming",
      value: stats.upcoming,
      icon: FaClock,
      iconBox:
        "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
    },
    {
      label: "Expired",
      value: stats.expired,
      icon: FaTimesCircle,
      iconBox:
        "bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400",
    },
  ];

  const couponToDelete = coupons.find(
    (coupon) => coupon?.id === deleteConfirm
  );

//   if (loadingPage) {
//     return (
//       <div className="flex h-[80vh] w-full items-center justify-center  dark:bg-[#0b0f19]">
//         <div className="text-center">
//           <div className="mx-auto flex h-12 w-12 items-center justify-center dark:border-gray-800 dark:bg-gray-900">
//             <Loader2 className="h-8 w-8 animate-spin" />
//           </div>
//           <p className="mt-3 text-sm font-medium text-gray-500 dark:text-gray-400">
//             Loading coupon details...
//           </p>
//         </div>
//       </div>
//     );
//   }

  
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
           <div className="flex h-[80vh] w-full items-center justify-center  dark:bg-[#0b0f19]">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center dark:border-gray-800 dark:bg-gray-900">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
          <p className="mt-3 text-sm font-medium text-gray-500 dark:text-gray-400">
            Loading coupon details...
          </p>
        </div>
      </div>
        ):(
           <div className="min-h-screen bg-[#f6f8fb] pb-10 dark:bg-[#0b0f19]">
      <div className="mx-auto w-full px-4 py-5 sm:px-6 lg:px-8">
        {/* HEADER */}
        <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
           

            <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-[28px]">
              Coupon Management
            </h1>

            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Create, track and manage promotional coupons from one place.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={() => getAllCoupons(true)}
              disabled={refreshing}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-600 shadow-sm transition hover:bg-gray-50 disabled:opacity-60 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <RefreshCw
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
              Refresh
            </button>

            <Link
              to="/admin/add/coupon"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#0446DB] px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0338AF]"
            >
              <FaPlus className="h-3.5 w-3.5" />
              Add New Coupon
            </Link>
          </div>
        </div>

       

        {/* MAIN CARD */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-[0_1px_3px_rgba(16,24,40,.04)] dark:border-gray-800 dark:bg-gray-900">
          {/* TOOLBAR */}
          <div className="flex flex-col gap-3 border-b border-gray-200 p-4 lg:flex-row lg:items-center lg:justify-between dark:border-gray-800">
            <div className="relative w-full lg:max-w-md">
              <FaSearch className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by coupon name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-10 w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#0446DB] focus:bg-white focus:ring-4 focus:ring-blue-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-blue-600 dark:focus:bg-gray-900 dark:focus:ring-blue-950"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* {["all", "active", "upcoming", "expired", "paused"].map(
                (status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatusFilter(status)}
                    className={`h-9 rounded-lg px-3 text-xs font-semibold capitalize transition ${
                      statusFilter === status
                        ? "bg-[#0446DB] text-white shadow-sm"
                        : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
                    }`}
                  >
                    {status}
                  </button>
                )
              )} */}
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1450px] border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-[#F8FAFC] dark:border-gray-800 dark:bg-gray-950/60">
                  {[
                    "Coupon",
                    "Discount",
                    "Discount Type",
                    "Validity",
                    "Limit",
                    "Status",
                    "Coupon Type",
                    "Used",
                    "Max Discount",
                    "User Limit",
                    "Actions",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="whitespace-nowrap px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-[.07em] text-gray-500 dark:text-gray-400"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredCoupons.map((coupon) => (
                  <tr
                    key={coupon.id}
                    className="group transition hover:bg-blue-50/30 dark:hover:bg-gray-800/40"
                  >
                    <td className="px-5 py-4">
                      <div className="max-w-[260px]">
                        <p className="truncate text-sm font-semibold text-gray-900 dark:text-white">
                          {coupon?.coupon_name || "Untitled coupon"}
                        </p>

                        <div className="mt-1.5 flex items-center gap-2">
                          <code className="rounded-md border border-blue-100 bg-blue-50 px-2 py-1 text-[11px] font-bold text-[#0446DB] dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-400">
                            {coupon?.coupon_code || "—"}
                          </code>

                          {coupon?.coupon_code && (
                            <button
                              type="button"
                              onClick={() =>
                                copyToClipboard(coupon.coupon_code)
                              }
                              className="rounded-md p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-[#0446DB] dark:hover:bg-gray-800"
                              title="Copy coupon code"
                            >
                              <FaCopy className="h-3 w-3" />
                            </button>
                          )}
                        </div>

                        {coupon?.description && (
                          <p className="mt-2 line-clamp-1 text-xs text-gray-500 dark:text-gray-400">
                            {coupon.description}
                          </p>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
                          {coupon?.coupon_type === "percentage" ? (
                            <FaPercentage className="h-3 w-3" />
                          ) : (
                            <FaRupeeSign className="h-3 w-3" />
                          )}
                        </div>
                        <div>
                          <p className="whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">
                            {getDiscountText(coupon)}
                          </p>
                          {Number(coupon?.minimum_amount_recharge) > 0 && (
                            <p className="mt-0.5 text-[11px] text-gray-500">
                              Min ₹{coupon.minimum_amount_recharge}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="whitespace-nowrap text-sm font-medium capitalize text-gray-700 dark:text-gray-300">
                        {coupon?.discount_type || "—"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-start gap-2">
                        <FaCalendarAlt className="mt-0.5 h-3.5 w-3.5 text-gray-400" />
                        <div className="whitespace-nowrap">
                          <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                            {formatDate(coupon?.start_date)}
                          </p>
                          <p className="mt-0.5 text-[11px] text-gray-400">
                            to {formatDate(coupon?.end_date)}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {coupon?.coupon_limit ?? "—"}
                    </td>

                    <td className="px-5 py-4">
                      {getStatusBadge(
                        coupon?.coupon_status || coupon?.status
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-md bg-gray-100 px-2.5 py-1 text-xs font-semibold capitalize text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                        {coupon?.coupon_type || "—"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        <FaUsers className="h-3.5 w-3.5 text-gray-400" />
                        {coupon?.coupon_used ?? 0}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {coupon?.discount_amount_upto
                        ? `₹${coupon.discount_amount_upto}`
                        : "—"}
                    </td>

                    <td className="px-5 py-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {coupon?.user_wise_limit ?? "—"}
                    </td>

                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => setDeleteConfirm(coupon.id)}
                        className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-white px-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-900/60 dark:bg-gray-900 dark:text-red-400 dark:hover:bg-red-950/30"
                        title="Delete coupon"
                      >
                        <FaTrash className="h-3 w-3" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* EMPTY */}
          {filteredCoupons.length === 0 && (
            <div className="flex flex-col items-center justify-center border-t border-gray-100 px-5 py-16 text-center dark:border-gray-800">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100 text-gray-400 dark:bg-gray-800">
                <SearchX className="h-6 w-6" />
              </div>

              <h3 className="mt-4 text-base font-bold text-gray-900 dark:text-white">
                No coupons found
              </h3>

              <p className="mt-1 max-w-sm text-sm text-gray-500 dark:text-gray-400">
                {searchTerm || statusFilter !== "all"
                  ? "No coupons match your current search or status filter."
                  : "Create your first promotional coupon to get started."}
              </p>

              {!searchTerm && statusFilter === "all" && (
                <Link
                  to="/admin/add/coupon"
                  className="mt-5 inline-flex h-9 items-center gap-2 rounded-lg bg-[#0446DB] px-4 text-xs font-semibold text-white hover:bg-[#0338AF]"
                >
                  <FaPlus />
                  Create Coupon
                </Link>
              )}
            </div>
          )}

          {/* FOOTER */}
          {filteredCoupons.length > 0 && (
            <div className="flex flex-col gap-2 border-t border-gray-200 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between dark:border-gray-800">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Showing{" "}
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  {filteredCoupons.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-700 dark:text-gray-300">
                  {coupons.length}
                </span>{" "}
                coupons
              </p>

              {(searchTerm || statusFilter !== "all") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setStatusFilter("all");
                  }}
                  className="text-left text-xs font-semibold text-[#0446DB] hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* DELETE MODAL */}
      {deleteConfirm !== null && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget && !deleting) {
              setDeleteConfirm(null);
            }
          }}
        >
          <div className="w-full max-w-[430px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-start justify-between border-b border-gray-100 p-5 dark:border-gray-800">
              <div className="flex gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
                  <FaExclamationTriangle className="h-4 w-4" />
                </div>

                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    Delete coupon?
                  </h3>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    This action cannot be undone.
                  </p>
                </div>
              </div>

              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteConfirm(null)}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 dark:hover:bg-gray-800 dark:hover:text-gray-200"
              >
                <FaTimes className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="p-5">
              <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                Are you sure you want to delete{" "}
                <span className="font-bold text-gray-900 dark:text-white">
                  “{couponToDelete?.coupon_name || "this coupon"}”
                </span>
                ?
              </p>

              {couponToDelete?.coupon_code && (
                <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 dark:border-gray-800 dark:bg-gray-950">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Coupon Code
                  </p>
                  <p className="mt-1 font-mono text-sm font-bold text-[#0446DB]">
                    {couponToDelete.coupon_code}
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 border-t border-gray-100 bg-gray-50/60 px-5 py-4 dark:border-gray-800 dark:bg-gray-950/40">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteConfirm(null)}
                className="h-9 rounded-lg border border-gray-200 bg-white px-4 text-xs font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={() => handleDelete(deleteConfirm)}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 text-xs font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <FaTrash className="h-3 w-3" />
                    Delete Coupon
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
          </div>
        )
    }
    
    </>
  );
}

