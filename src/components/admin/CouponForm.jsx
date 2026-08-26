

import axios from 'axios';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const baseURL = import.meta.env.VITE_BASE_URL;

function CouponForm() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        coupon_name: '',
        coupon_code: '',
        coupon_type: 'percentage',
        discount_type: 'fixed',
        discount_amount: '',
        discount_amount_upto: '',
        minimum_amount_recharge: '',
        description: '',
        start_date: '',
        end_date: '',
        coupon_limit: '',
        user_wise_limit: ''
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const generateCouponCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 8; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setFormData(prev => ({
            ...prev,
            coupon_code: code
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.coupon_name.trim()) {
            newErrors.coupon_name = 'Coupon name is required';
        }
        if (!formData.coupon_code.trim()) {
            newErrors.coupon_code = 'Coupon code is required';
        }
        if (!formData.discount_amount || formData.discount_amount <= 0) {
            newErrors.discount_amount = 'Valid discount amount is required';
        }
        if (!formData.start_date) {
            newErrors.start_date = 'Start date is required';
        }
        if (!formData.end_date) {
            newErrors.end_date = 'End date is required';
        }
        if (formData.start_date && formData.end_date && new Date(formData.start_date) > new Date(formData.end_date)) {
            newErrors.end_date = 'End date must be after start date';
        }
        if (formData.discount_type === 'upto' && (!formData.discount_amount_upto || formData.discount_amount_upto <= 0)) {
            newErrors.discount_amount_upto = 'Maximum discount amount is required for "Up To" type';
        }
        if (formData.coupon_type === 'percentage' && formData.discount_amount > 100) {
            newErrors.discount_amount = 'Percentage discount cannot exceed 100%';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const payload = {
                ...formData,
                // Convert empty strings to null for the backend
                discount_amount_upto: formData.discount_amount_upto || null,
                minimum_amount_recharge: formData.minimum_amount_recharge || null,
                coupon_limit: formData.coupon_limit || null,
                user_wise_limit: formData.user_wise_limit || null,
                description: formData.description || null
            };

            const res = await axios.post(`${baseURL}/api/admin/addCoupon`, payload, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            toast.success(res?.data?.message);
            // Reset form after successful submission
            setFormData({
                coupon_name: '',
                coupon_code: '',
                coupon_type: 'percentage',
                discount_type: 'fixed',
                discount_amount: '',
                discount_amount_upto: '',
                minimum_amount_recharge: '',
                description: '',
                start_date: '',
                end_date: '',
                coupon_limit: '',
                user_wise_limit: ''
            });

            // Redirect to coupons list after success
            setTimeout(() => navigate('/admin/coupon'), 2000);

        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create coupon');
        } finally {
            setLoading(false);
        }
    };

    const getCurrentDate = () => {
        return new Date().toISOString().split('T')[0];
    };

    return (
        <div className="min-h-screen bg-gray-100 ">
            <div className="sticky top-0 left-0  z-10 bg-[#0446DB] dark:border-b dark:border-[#0446DB] dark:bg-gray-900 py-4 md:py-6 shadow-md ">
                <div className="  mx-auto px-8  ">
                    {/* Mobile Layout */}
                    <div className=" flex flex-col space-y-4">
                      
                        <div className="flex-col items-center justify-between">
                            <h1 className="text-xl font-bold text-white">Create New Coupon</h1>
                        </div>


                    </div>


                </div>
            </div>
            <div className=" mx-auto">
                <form onSubmit={handleSubmit} className="bg-gray-100 p-6 sm:p-8">
                    {/* Basic Information Section */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                            Basic Information
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Coupon Name */}
                            <div>
                                <label htmlFor="coupon_name" className="block text-sm font-medium text-gray-700 mb-2">
                                    Coupon Name *
                                </label>
                                <input
                                    type="text"
                                    id="coupon_name"
                                    name="coupon_name"
                                    value={formData.coupon_name}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.coupon_name ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="e.g., Summer Sale, Welcome Offer"
                                />
                                {errors.coupon_name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.coupon_name}</p>
                                )}
                            </div>

                            {/* Coupon Code */}
                            <div>
                                <label htmlFor="coupon_code" className="block text-sm font-medium text-gray-700 mb-2">
                                    Coupon Code *
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        id="coupon_code"
                                        name="coupon_code"
                                        value={formData.coupon_code}
                                        onChange={handleChange}
                                        className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.coupon_code ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="e.g., SUMMER25"
                                    />
                                    <button
                                        type="button"
                                        onClick={generateCouponCode}
                                        className="px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors whitespace-nowrap"
                                    >
                                        Generate
                                    </button>
                                </div>
                                {errors.coupon_code && (
                                    <p className="mt-1 text-sm text-red-600">{errors.coupon_code}</p>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mt-6">
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="Describe the coupon purpose and terms..."
                            />
                        </div>
                    </div>

                    {/* Discount Configuration Section */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                            Discount Configuration
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Coupon Type */}
                            <div>
                                <label htmlFor="coupon_type" className="block text-sm font-medium text-gray-700 mb-2">
                                    Coupon Type
                                </label>
                                <select
                                    id="coupon_type"
                                    name="coupon_type"
                                    value={formData.coupon_type}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                >
                                    <option value="percentage">Percentage Discount</option>
                                    <option value="extra-credit">Extra Credit</option>
                                </select>
                            </div>

                            {/* Discount Type */}
                            <div>
                                <label htmlFor="discount_type" className="block text-sm font-medium text-gray-700 mb-2">
                                    Discount Type
                                </label>
                                <select
                                    id="discount_type"
                                    name="discount_type"
                                    value={formData.discount_type}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                >
                                    <option value="flat">Flat Discount</option>
                                    <option value="upto">Up To Maximum</option>
                                </select>

                            </div>

                            {/* Discount Amount */}
                            <div>
                                <label htmlFor="discount_amount" className="block text-sm font-medium text-gray-700 mb-2">
                                    {formData.coupon_type === 'percentage' ? "Discount Percentage *" : "Discount Amount *"}
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="discount_amount"
                                        name="discount_amount"
                                        value={formData.discount_amount}
                                        onChange={handleChange}
                                        min="0"
                                        step={formData.coupon_type === 'percentage' ? "0.01" : "1"}
                                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.discount_amount ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder={formData.coupon_type === 'percentage' ? "e.g., 25" : "e.g., 100"}
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                        <span className="text-gray-500">
                                            {formData.coupon_type === 'percentage' ? '%' : '₹'}
                                        </span>
                                    </div>
                                </div>
                                {errors.discount_amount && (
                                    <p className="mt-1 text-sm text-red-600">{errors.discount_amount}</p>
                                )}
                            </div>

                            {/* Discount Amount Upto */}
                            {formData.discount_type === 'upto' && (
                                <div>
                                    <label htmlFor="discount_amount_upto" className="block text-sm font-medium text-gray-700 mb-2">
                                        Discount Amount Upto *
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            id="discount_amount_upto"
                                            name="discount_amount_upto"
                                            value={formData.discount_amount_upto}
                                            onChange={handleChange}
                                            min="0"
                                            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.discount_amount_upto ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder="e.g., 1000"
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                            <span className="text-gray-500">₹</span>
                                        </div>
                                    </div>
                                    {errors.discount_amount_upto && (
                                        <p className="mt-1 text-sm text-red-600">{errors.discount_amount_upto}</p>
                                    )}
                                </div>
                            )}

                            {/* Minimum Recharge Amount */}
                            <div>
                                <label htmlFor="minimum_amount_recharge" className="block text-sm font-medium text-gray-700 mb-2">
                                    Minimum Order Recharge
                                </label>
                                <div className="relative">
                                    <input
                                        type="number"
                                        id="minimum_amount_recharge"
                                        name="minimum_amount_recharge"
                                        value={formData.minimum_amount_recharge}
                                        onChange={handleChange}
                                        min="0"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                        placeholder="e.g., 500"
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                        <span className="text-gray-500">₹</span>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* Validity & Limits Section */}
                    <div className="mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                            Validity & Limits
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Start Date */}
                            <div>
                                <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-2">
                                    Start Date *
                                </label>

                                <input
                                    type="date"
                                    id="start_date"
                                    name="start_date"
                                    value={formData.start_date}
                                    onChange={handleChange}
                                    min={getCurrentDate()}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.start_date ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                {errors.start_date && (
                                    <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>
                                )}
                            </div>

                            {/* End Date */}
                            <div>
                                <label htmlFor="end_date" className="block text-sm font-medium text-gray-700 mb-2">
                                    End Date *
                                </label>
                                <input
                                    type="date"
                                    id="end_date"
                                    name="end_date"
                                    value={formData.end_date}
                                    onChange={handleChange}
                                    min={formData.start_date || getCurrentDate()}
                                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${errors.end_date ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                {errors.end_date && (
                                    <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>
                                )}
                            </div>

                            {/* Coupon Limit */}
                            <div>
                                <label htmlFor="coupon_limit" className="block text-sm font-medium text-gray-700 mb-2">
                                    Coupon Limit
                                </label>
                                <input
                                    type="number"
                                    id="coupon_limit"
                                    name="coupon_limit"
                                    value={formData.coupon_limit}
                                    onChange={handleChange}
                                    min="0"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    placeholder="e.g., 1000"
                                />

                            </div>

                            {/* User-wise Limit */}
                            <div>
                                <label htmlFor="user_wise_limit" className="block text-sm font-medium text-gray-700 mb-2">
                                    Usage Wise Limit
                                </label>
                                <input
                                    type="number"
                                    id="user_wise_limit"
                                    name="user_wise_limit"
                                    value={formData.user_wise_limit}
                                    onChange={handleChange}
                                    min="0"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    placeholder="e.g., 1"
                                />

                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-end pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={() => navigate('/admin/coupon')}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating...
                                </span>
                            ) : (
                                'Create Coupon'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CouponForm;