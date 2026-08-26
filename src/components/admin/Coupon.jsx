import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash, FaCopy, FaEye, FaSearch, FaFilter } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"
const baseURL = import.meta.env.VITE_BASE_URL;
export default function Coupon() {
    const [coupons, setCoupons] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [deleteConfirm, setDeleteConfirm] = useState(null);

    // Filter coupons based on search and status
    const filteredCoupons = coupons.filter(coupon => {
        const matchesSearch = coupon.coupon_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            coupon.coupon_code.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || coupon.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleDelete = async (id) => {
        try {
            const res = await axios.delete(`${baseURL}/api/admin/deleteCoupon`, {
                data: { coupon_id: id }, // ✅ send body data here
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            toast.success(res.data.message)
            getAllCoupons()
            setDeleteConfirm(null)
        } catch (error) {
            toast.error(error.response.data.message)
            setDeleteConfirm(null)
        }

    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        // You can add a toast notification here
        alert('Coupon code copied to clipboard!');
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            active: { color: 'bg-green-100 text-green-800', text: 'Active' },
            expired: { color: 'bg-red-100 text-red-800', text: 'Expired' },
            upcoming: { color: 'bg-blue-100 text-blue-800', text: 'Upcoming' },
            paused: { color: 'bg-yellow-100 text-yellow-800', text: 'Paused' }
        };

        const config = statusConfig[status] || statusConfig.active;
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
                {config.text}
            </span>
        );
    };

    const getDiscountText = (coupon) => {
        if (coupon.coupon_type === 'percentage') {
            return `${coupon.discount_amount}%${coupon.discount_amount_upto ? ` upto ₹${coupon.discount_amount_upto}` : ''}`;
        }
        return `₹${coupon.discount_amount}`;
    };

    const getAllCoupons = async () => {
        try {
            const res = await axios.get(`${baseURL}/api/admin/getAllCoupons`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },

                });
            setCoupons(res.data.data)

        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
    useEffect(() => {
        getAllCoupons()
    }, [])
    // Delete Confirmation Modal
    const DeleteConfirmationModal = () => {
        if (!deleteConfirm) return null;

        const coupon = coupons.find(c => c.id === deleteConfirm);

        return (
            <div className="fixed inset-0  bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-blue-400  rounded-lg max-w-md w-full p-6">
                    <h3 className="text-lg font-semibold text-red-600 mb-2">Delete Coupon</h3>
                    <p className="text-white mb-4">
                        Are you sure you want to delete coupon <strong>"{coupon?.coupon_name}"</strong>?
                        This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => setDeleteConfirm(null)}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => handleDelete(deleteConfirm)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 ">
            <div className=" mx-auto">
                {/* Header */}
                <div className="bg-[#0446DB] px-4 py-5 sm:px-6 sm:py-6">
                    <div className="flex w-full flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="w-full lg:w-auto">
                            <h1 className="text-2xl font-bold text-white dark:text-white sm:text-3xl">Coupon Management</h1>

                        </div>

                        <div className='flex w-full flex-col gap-3 sm:flex-row lg:max-w-2xl'>
                            <div className="relative w-full sm:flex-1">
                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0446DB]" />
                                <Input
                                    type="text"
                                    placeholder="Search coupons by name or code..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full bg-white pl-10 pr-4 py-3 text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors dark:text-white sm:text-base"
                                />
                            </div>
                            <Link
                                to={'/admin/add/coupon'}
                                className="inline-flex w-full items-center justify-center rounded-lg bg-white px-5 py-1 text-sm font-semibold text-[#0446DB] sm:w-auto sm:shrink-0 sm:px-6 sm:text-base"
                            >
                                Add New Coupon
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Coupons Table */}
                <div className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Coupon Details
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Discount
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        discount type
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Validity
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Coupon Limit
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Coupon Type
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Coupon Used
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Discount Amount Upto
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        User Wise Limit
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200">
                                {filteredCoupons.map((coupon) => (
                                    <tr key={coupon.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div>
                                                <div className="flex items-center gap-3">

                                                    <div>
                                                        <div className="text-sm font-medium dark:text-white text-gray-900">
                                                            {coupon.coupon_name}
                                                        </div>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <code className="text-sm font-mono bg-gray-100 dark:bg-gray-800 dark:text-white px-2 py-1 rounded border">
                                                                {coupon.coupon_code}
                                                            </code>
                                                            <button
                                                                onClick={() => copyToClipboard(coupon.coupon_code)}
                                                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                                                title="Copy coupon code"
                                                            >
                                                                <FaCopy className="w-3 h-3" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                {coupon.description && (
                                                    <p className="text-sm dark:text-white text-gray-500 mt-2">{coupon.description}</p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 dark:text-white whitespace-nowrap">
                                            <div className="text-sm font-medium dark:text-white text-gray-900">
                                                {getDiscountText(coupon)}
                                            </div>
                                            {coupon.minimum_amount_recharge > 0 && (
                                                <div className="text-sm dark:text-white text-gray-500 mt-1">
                                                    Min: ₹{coupon.minimum_amount_recharge}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap dark:text-white">
                                            {coupon.discount_type}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 dark:text-white">
                                                {new Date(coupon.start_date).toLocaleDateString()}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-white">
                                                to {new Date(coupon.end_date).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900 dark:text-white">
                                                {coupon.coupon_limit}
                                            </div>

                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {getStatusBadge(coupon.coupon_status)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap dark:text-white">
                                            {coupon.coupon_type}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap dark:text-white">
                                            {coupon.coupon_used}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap dark:text-white">
                                            {coupon.discount_amount_upto}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap dark:text-white">
                                            {coupon.user_wise_limit}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">

                                                <button
                                                    onClick={() => setDeleteConfirm(coupon.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete coupon"
                                                >
                                                    <FaTrash className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Empty State */}
                    {filteredCoupons.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <FaCopy className="w-16 h-16 mx-auto" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No coupons found</h3>
                            <p className="text-gray-500 mb-4">
                                {searchTerm || statusFilter !== 'all'
                                    ? 'Try adjusting your search or filter criteria'
                                    : 'Get started by creating your first coupon'
                                }
                            </p>
                            {(!searchTerm && statusFilter === 'all') && (
                                <Link
                                    to={'/admin/add/coupon'}
                                    className="inline-flex items-center px-6 py-3 bg-[#0446DB] text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Create Your First Coupon
                                </Link>
                            )}
                        </div>
                    )}

                    {/* Pagination (optional) */}
                    {filteredCoupons.length > 0 && (
                        <div className="px-6 py-4 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-700 dark:text-white">
                                    Showing <span className="font-medium">{filteredCoupons.length}</span> of{' '}
                                    <span className="font-medium">{coupons.length}</span> coupons
                                </div>
                                <div className="flex gap-2">
                                    <button className="px-3 dark:text-white py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                                        Previous
                                    </button>
                                    <button className="px-3 dark:text-white py-1 text-sm border border-gray-300 rounded hover:bg-gray-50">
                                        Next
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal />
        </div>
    );
}
