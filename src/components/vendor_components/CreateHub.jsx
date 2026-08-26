import axios from 'axios';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import GoogleMap from '../googlemap';
const baseURL = import.meta.env.VITE_BASE_URL;
function CreateHub() {
    const [formData, setFormData] = useState({
        hub_name: '',
        hub_code: '',
        hub_type: '',
        username: '',
        password: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        latitude: '',
        longitude: ''
    });

    const [errors, setErrors] = useState({});

    const hubTypes = [
        { value: 'FM', label: 'FM' },
        { value: 'SORTING', label: 'SORTING' },
        { value: 'LM', label: 'LM' },
    ];

    const fetchCurrentLocatipon = async ({ selectedLocation, prefix }) => {

        const { lat, lng } = selectedLocation;
        setFormData({
            ...formData,
            latitude: lat,
            longitude: lng
        })


    }

    const states = [
        { value: '', label: 'Select State' },
        { value: 'maharashtra', label: 'Maharashtra' },
        { value: 'delhi', label: 'Delhi' },
        { value: 'karnataka', label: 'Karnataka' },
        { value: 'tamil_nadu', label: 'Tamil Nadu' },
        { value: 'gujarat', label: 'Gujarat' },
        { value: 'rajasthan', label: 'Rajasthan' }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.hub_name.trim()) newErrors.hub_name = 'Hub name is required';
        if (!formData.hub_code.trim()) newErrors.hub_code = 'Hub code is required';
        if (!formData.hub_type) newErrors.hub_type = 'Please select a hub type';
        if (!formData.username.trim()) newErrors.username = 'Username is required';
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.state) newErrors.state = 'Please select a state';
        if (!formData.pincode.trim()) {
            newErrors.pincode = 'Pincode is required';
        } else if (!/^\d{6}$/.test(formData.pincode)) {
            newErrors.pincode = 'Pincode must be 6 digits';
        }

        if (formData.latitude && !/^-?\d+(\.\d+)?$/.test(formData.latitude)) {
            newErrors.latitude = 'Invalid latitude format';
        }
        if (formData.longitude && !/^-?\d+(\.\d+)?$/.test(formData.longitude)) {
            newErrors.longitude = 'Invalid longitude format';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();

            const validationErrors = validateForm();

            if (Object.keys(validationErrors).length === 0) {
                const res = await axios.post(
                    `${baseURL}/api/hub/registerHub`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                            "Content-Type": "application/json"
                        }
                    }
                );

                if (res?.data?.success) {
                    toast.success(res?.data?.message)
                }

                setFormData({
                    hub_name: '',
                    hub_code: '',
                    hub_type: '',
                    username: '',
                    password: '',
                    address: '',
                    city: '',
                    state: '',
                    pincode: '',
                    latitude: '',
                    longitude: ''
                });
            } else {
                setErrors(validationErrors);
            }
        } catch (error) {
            if (error?.response?.status == 400) {
                toast.error(error?.response?.data?.message);
                return
            }
            toast.error('Somthing went wrong, please try again.')
        }
    };

    const handleReset = () => {
        setFormData({
            hub_name: '',
            hub_code: '',
            hub_type: '',
            username: '',
            password: '',
            address: '',
            city: '',
            state: '',
            pincode: '',
            latitude: '',
            longitude: ''
        });
        setErrors({});
    };

    return (
        <div className="min-h-screen bg-gray-50 py-0 ">
            <div className=" mx-auto">

                <div className="mb-0 bg-[#0446DB] dark:bg-gray-900 py-[24px] shadow-md h-auto px-[24px]">
                    <div className="flex flex-wrap items-center justify-between">
                        {/* Heading */}
                        <h1 className="text-2xl text-white">Create New Hub</h1>
                        <div className="flex flex-wrap items-end gap-4 text-white">



                        </div>
                    </div>
                </div>
                <div className="bg-[#f8fafc] shadow-lg rounded-xl overflow-hidden">
                    

                    <form onSubmit={handleSubmit} className="p-8">
                        <div className="space-y-8">
                            {/* Hub Information Section */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                                    Hub Information
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Hub Name */}
                                    <div>
                                        <label htmlFor="hub_name" className="block text-sm font-medium text-gray-700 mb-1">
                                            Hub Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="hub_name"
                                            name="hub_name"
                                            value={formData.hub_name}
                                            onChange={handleChange}
                                            placeholder="Enter hub name"
                                            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${errors.hub_name ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors.hub_name && (
                                            <p className="mt-1 text-sm text-red-600">{errors.hub_name}</p>
                                        )}
                                    </div>

                                    {/* Hub Code */}
                                    <div>
                                        <label htmlFor="hub_code" className="block text-sm font-medium text-gray-700 mb-1">
                                            Hub Code <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="hub_code"
                                            name="hub_code"
                                            value={formData.hub_code}
                                            onChange={handleChange}
                                            placeholder="Enter hub code"
                                            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${errors.hub_code ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors.hub_code && (
                                            <p className="mt-1 text-sm text-red-600">{errors.hub_code}</p>
                                        )}
                                    </div>

                                    {/* Hub Type */}
                                    <div>
                                        <label htmlFor="hub_type" className="block text-sm font-medium text-gray-700 mb-1">
                                            Hub Type <span className="text-red-500">*</span>
                                        </label>
                                        {/* <input
                                            type="text"
                                            id="hub_type"
                                            name="hub_type"
                                            value={formData.hub_type}
                                            onChange={handleChange}
                                            placeholder="Enter Hub Type"
                                            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${errors.hub_type ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                        /> */}
                                        <select
                                            id="hub_type"
                                            name="hub_type"
                                            value={formData.hub_type}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none bg-white ${errors.hub_type ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                        >
                                            {hubTypes.map((type) => (
                                                <option key={type.value} value={type.value}>
                                                    {type.label}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.hub_type && (
                                            <p className="mt-1 text-sm text-red-600">{errors.hub_type}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Credentials Section */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                                    Login Credentials
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Username */}
                                    <div>
                                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                            Username <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="username"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleChange}
                                            placeholder="Enter username"
                                            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${errors.username ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors.username && (
                                            <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                                        )}
                                    </div>

                                    {/* Password */}
                                    <div>
                                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                            Password <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="password"
                                            id="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            placeholder="Enter password"
                                            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${errors.password ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors.password && (
                                            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                                        )}
                                        <p className="mt-1 text-xs text-gray-500">Must be at least 6 characters long</p>
                                    </div>
                                </div>
                            </div>

                            {/* Address Section */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-200">
                                    Address Details
                                </h3>
                                <div className="space-y-6">
                                    {/* Address */}
                                    <div>
                                        <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                                            Address <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            id="address"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            placeholder="Enter complete address"
                                            rows="3"
                                            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none ${errors.address ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                        />
                                        {errors.address && (
                                            <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {/* City */}
                                        <div>
                                            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                                                City <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="city"
                                                name="city"
                                                value={formData.city}
                                                onChange={handleChange}
                                                placeholder="Enter city"
                                                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${errors.city ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                            />
                                            {errors.city && (
                                                <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                                            )}
                                        </div>

                                        {/* State */}
                                        <div>
                                            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                                                State <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="state"
                                                name="state"
                                                value={formData.state}
                                                onChange={handleChange}
                                                placeholder="Enter State"
                                                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${errors.pincode ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                            />

                                        </div>

                                        {/* Pincode */}
                                        <div>
                                            <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                                                Pincode <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                id="pincode"
                                                name="pincode"
                                                value={formData.pincode}
                                                onChange={handleChange}
                                                placeholder="6-digit pincode"
                                                maxLength="6"
                                                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${errors.pincode ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                            />
                                            {errors.pincode && (
                                                <p className="mt-1 text-sm text-red-600">{errors.pincode}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Coordinates Section */}
                            <div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Latitude */}
                                    <div>
                                        <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-1">
                                            Latitude
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                id="latitude"
                                                name="latitude"
                                                value={formData.latitude}
                                                onChange={handleChange}
                                                placeholder="19.0760"
                                                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${errors.latitude ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                            />
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                <span className="text-gray-400">°</span>
                                            </div>
                                        </div>
                                        {errors.latitude && (
                                            <p className="mt-1 text-sm text-red-600">{errors.latitude}</p>
                                        )}
                                    </div>

                                    {/* Longitude */}
                                    <div>
                                        <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-1">
                                            Longitude
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                id="longitude"
                                                name="longitude"
                                                value={formData.longitude}
                                                onChange={handleChange}
                                                placeholder="72.8777"
                                                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${errors.longitude ? 'border-red-500' : 'border-gray-300'
                                                    }`}
                                            />
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                                                <span className="text-gray-400">°</span>
                                            </div>
                                        </div>
                                        {errors.longitude && (
                                            <p className="mt-1 text-sm text-red-600">{errors.longitude}</p>
                                        )}

                                    </div>
                                    <GoogleMap
                                        fetchCurrentLocatipon={fetchCurrentLocatipon}

                                    />
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-4">
                            <button
                                type="button"
                                onClick={handleReset}
                                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                            >
                                Reset Form
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-3 bg-[#0446DB] text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-md hover:shadow-lg"
                            >
                                Create Hub
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateHub;