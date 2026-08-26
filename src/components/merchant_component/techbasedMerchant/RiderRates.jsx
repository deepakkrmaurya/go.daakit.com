import axios from 'axios';
import React, { useEffect, useState } from 'react';
import {
    Plus,
    Edit2,
    Trash2,
    Search,
    Filter,
    Download,
    Eye,
    CheckCircle,
    XCircle,
    MoreVertical,
    Loader2,
    AlertCircle,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const baseURL = import.meta.env.VITE_BASE_URL;

const RiderRates = () => {
    const [rates, setRates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [selectedRates, setSelectedRates] = useState([]);
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, rateId: null, rateName: '' });
    const [editModal, setEditModal] = useState({ isOpen: false, rate: null });
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [isMobile, setIsMobile] = useState(false);
    const [formData, setFormData] = useState({
        rate_id: "",
        rateType: "",
        rate: "",
        orderMode: ""
    });
    // Check if mobile screen
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const getRates = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${baseURL}/api/techbasedmerchant/getMerchantRates`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            setRates(res.data.rates || []);
            setError('');
        } catch (error) {
            console.error('Error fetching rates:', error);
            setError('Failed to load rider rates. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    const isValidForm = () => {
        if (!formData.type || !formData.rateType || !formData.rate || !formData.orderMode) {
            return false;
        }
        if (formData.type === "individual" && !formData.rider) {
            return false;
        }
        return true;
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === "type") {
            setFormData(prev => ({ ...prev, rider: "" }));
        }
    };
    const rateValues = [
        { value: "SDD", label: "Same Day Delivery" },
        { value: "NDD", label: "Next Day Delivery" },
        // { value: "Turant", label: "Turant" },
    ];

    const rateTypeValues = [
        { value: "perorder", label: "Per Order" },
        { value: "perkms", label: "Per Kilometer" }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Prepare form data for submission
            const submissionData = {
                rate_for: formData.type,
                ...(formData.type === "individual" && { riderId: formData.rider }),
                rateType: formData.rateType,
                rate: parseFloat(formData.rate),
                orderMode: formData.orderMode,
            };


            const res = await axios.post(`${baseURL}/api/techbasedmerchant/updateMerchantRate`,
                {
                    "rate_id": editModal.rate.id,
                    "rate_type": submissionData.rateType || editModal.rate.rate_type,
                    "rate": submissionData.rate || editModal.rate.rate,
                    "order_mode": submissionData.orderMode || editModal.rate.order_mode
                }
                , {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
            if (res.data.success) {
                getRates()
                setEditModal({ isOpen: false, rate: null })
                toast.success(res.data.message)
                setFormData({
                    rate_id: "",
                    rateType: "",
                    rate: "",
                    orderMode: ""
                });
            }


        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to create rider rate")
            
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        getRates();
    }, []);

    const handleDelete = async (rateId, rateName) => {
        setDeleteModal({ isOpen: true, rateId, rateName });
    };

    const confirmDelete = async () => {
        try {
            setActionLoading(true);
            await axios.post(`${baseURL}/api/techbasedmerchant/deleteMerchantRate`,
                {
                    rate_id: deleteModal.rateId
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            setRates(rates.filter(rate => rate.id !== deleteModal.rateId));
            setDeleteModal({ isOpen: false, rateId: null, rateName: '' });
            setError('');
        } catch (error) {
            console.error('Error deleting rate:', error);
            setError('Failed to delete rate. Please try again.');
        } finally {
            setActionLoading(false);
        }
    };

    const handleEdit = (rate) => {
        setEditModal({ isOpen: true, rate });
    };

    const handleBulkDelete = () => {
        if (selectedRates.length === 0) return;

        const rateNames = rates
            .filter(rate => selectedRates.includes(rate.id))
            .map(rate => rate.rider_name || 'All Riders')
            .join(', ');

        setDeleteModal({
            isOpen: true,
            rateId: 'bulk',
            rateName: rateNames
        });
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedRates(filteredRates.map(rate => rate.id));
        } else {
            setSelectedRates([]);
        }
    };

    const handleSelectRate = (rateId) => {
        if (selectedRates.includes(rateId)) {
            setSelectedRates(selectedRates.filter(id => id !== rateId));
        } else {
            setSelectedRates([...selectedRates, rateId]);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount) => {
        return `₹${parseFloat(amount).toFixed(2)}`;
    };

    const getRateTypeBadge = (type) => {
        const config = {
            perorder: { color: 'bg-blue-100 text-blue-800', label: 'Per Order' },
            perkms: { color: 'bg-green-100 text-green-800', label: 'Per KM' }
        };
        const cfg = config[type] || { color: 'bg-gray-100 text-gray-800', label: type };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${cfg.color} whitespace-nowrap`}>
                {cfg.label}
            </span>
        );
    };

    const getModeBadge = (mode) => {
        const config = {
            SDD: { color: 'bg-purple-100 text-purple-800', label: 'Same Day' },
            NDD: { color: 'bg-amber-100 text-amber-800', label: 'Next Day' }
        };
        const cfg = config[mode] || { color: 'bg-gray-100 text-gray-800', label: mode };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${cfg.color} whitespace-nowrap`}>
                {cfg.label}
            </span>
        );
    };

    const getRateForBadge = (rateFor, riderName) => {
        if (rateFor === 'all') {
            return (
                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 whitespace-nowrap">
                    All Riders
                </span>
            );
        }
        return (
            <div className="flex flex-col min-w-0">
                <span className="px-2 py-1 rounded-full text-xs font-semibold bg-pink-100 text-pink-800 mb-1 whitespace-nowrap">
                    Individual
                </span>
                <span className="text-xs text-gray-600 truncate" title={riderName}>
                    {riderName}
                </span>
            </div>
        );
    };

    // Filter rates based on search and filter
    const filteredRates = rates.filter(rate => {
        const matchesSearch =
            rate.rider_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            rate.rate?.toString().includes(searchTerm) ||
            rate.rate_type?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter =
            selectedFilter === 'all' ||
            (selectedFilter === 'individual' && rate.rate_for === 'individual') ||
            (selectedFilter === 'allRiders' && rate.rate_for === 'all');

        return matchesSearch && matchesFilter;
    });

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentRates = filteredRates.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredRates.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const MobileRateCard = ({ rate }) => (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-3">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="h-8 w-8 flex items-center justify-center bg-indigo-100 rounded-lg">
                            <svg className="h-4 w-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                        </div>
                        {getRateForBadge(rate.rate_for, rate.rider_name)}
                    </div>
                    <div className="text-xs text-gray-500">ID: {rate.id}</div>
                </div>
                <div className="flex gap-1">
                    <button
                        onClick={() => handleEdit(rate)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                    >
                        <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                        onClick={() => handleDelete(rate.id, rate.rider_name || 'All Riders')}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                    <div className="text-xs text-gray-500 mb-1">Rate Type</div>
                    <div className="mb-2">{getRateTypeBadge(rate.rate_type)}</div>
                </div>
                <div>
                    <div className="text-xs text-gray-500 mb-1">Order Mode</div>
                    <div>{getModeBadge(rate.order_mode)}</div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                    <div className="text-xs text-gray-500 mb-1">Amount</div>
                    <div className="text-lg font-bold text-gray-800">
                        {formatCurrency(rate.rate)}
                    </div>
                    <div className="text-xs text-gray-500">
                        {rate.rate_type === 'perkms' ? 'per kilometer' : 'per order'}
                    </div>
                </div>
                <div>
                    <div className="text-xs text-gray-500 mb-1">Created</div>
                    <div className="text-sm text-gray-900">
                        {new Date(rate.created_at).toLocaleDateString()}
                    </div>
                    <div className="text-xs text-gray-500">
                        {new Date(rate.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
                    <p className="mt-4 text-lg text-gray-600">Loading rider rates...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Header */}
            <div className="bg-[rgb(86,78,193)] text-white">
                <div className="mx-auto px-3 sm:px-4 lg:px-6 py-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div className="flex-1 min-w-0">
                            <h1 className="text-2xl sm:text-3xl font-bold truncate">Rider Rate Management</h1>
                            <p className="text-purple-200 mt-1 text-sm sm:text-base truncate">
                                Manage and monitor your rider rates and delivery charges
                            </p>
                        </div>
                        <Link to={`/techbased_merchant/rider/rate`} className="flex-shrink-0 mt-3 sm:mt-0">
                            <button className="flex items-center gap-2 bg-white text-[rgb(86,78,193)] px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base whitespace-nowrap">
                                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                                Add New Rate
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="mx-auto px-3 sm:px-4 lg:px-6 py-6 -mt-4 sm:-mt-6">
                {/* Error Message */}
                {error && (
                    <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-xl flex items-start sm:items-center gap-2 sm:gap-3">
                        <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <p className="text-red-700 text-sm sm:text-base flex-1">{error}</p>
                        <button
                            onClick={() => setError('')}
                            className="text-red-500 hover:text-red-700 flex-shrink-0"
                        >
                            <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                    </div>
                )}

                {/* Controls */}
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col sm:flex-row gap-3">
                            {/* Search */}
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search rates..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                                />
                            </div>

                            {/* Filter */}
                            <div className="relative sm:w-48">
                                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <select
                                    value={selectedFilter}
                                    onChange={(e) => setSelectedFilter(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base appearance-none"
                                >
                                    <option value="all">All Types</option>
                                    <option value="individual">Individual</option>
                                    <option value="allRiders">All Riders</option>
                                </select>
                            </div>
                        </div>

                        {/* Bulk Actions */}
                        {selectedRates.length > 0 && (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleBulkDelete}
                                    className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg sm:rounded-xl hover:bg-red-700 transition-colors text-sm sm:text-base"
                                >
                                    <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                    Delete ({selectedRates.length})
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile View - Cards */}
                {isMobile ? (
                    <div className="space-y-3">
                        {currentRates.length === 0 ? (
                            <div className="bg-white rounded-xl p-6 text-center">
                                <div className="text-gray-400">
                                    <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <p className="text-base font-medium text-gray-600">No rates found</p>
                                    <p className="text-gray-500 text-sm mt-1">
                                        {searchTerm ? 'Try adjusting your search' : 'Add your first rider rate'}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            currentRates.map((rate) => (
                                <MobileRateCard key={rate.id} rate={rate} />
                            ))
                        )}
                    </div>
                ) : (
                    /* Desktop View - Table */
                    <>
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <div className="min-w-[800px] md:min-w-full">
                                    <table className="w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                                                    Rider / Rate For
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                                                    Rate Details
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                                                    Order Mode
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                                                    Amount
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                                                    Created
                                                </th>
                                                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-100">
                                            {currentRates.length === 0 ? (
                                                <tr>
                                                    <td colSpan="6" className="px-6 py-12 text-center">
                                                        <div className="text-gray-400">
                                                            <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                            </svg>
                                                            <p className="text-lg font-medium text-gray-600">No rates found</p>
                                                            <p className="text-gray-500 mt-2">
                                                                {searchTerm ? 'Try adjusting your search' : 'Add your first rider rate'}
                                                            </p>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ) : (
                                                currentRates.map((rate) => (
                                                    <tr
                                                        key={rate.id}
                                                        className={`hover:bg-gray-50 transition-colors ${selectedRates.includes(rate.id) ? 'bg-blue-50' : ''}`}
                                                    >
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="h-8 w-8 flex-shrink-0 flex items-center justify-center bg-indigo-100 rounded-lg">
                                                                    <svg className="h-4 w-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                                                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                                    </svg>
                                                                </div>
                                                                <div className="ml-3 min-w-0">
                                                                    {getRateForBadge(rate.rate_for, rate.rider_name)}
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            <div className="flex flex-col gap-1">
                                                                {getRateTypeBadge(rate.rate_type)}
                                                                <span className="text-xs text-gray-500">ID: {rate.id}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            {getModeBadge(rate.order_mode)}
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            <div className="text-base font-bold text-gray-800">
                                                                {formatCurrency(rate.rate)}
                                                            </div>
                                                            <div className="text-xs text-gray-500">
                                                                {rate.rate_type === 'perkms' ? 'per kilometer' : 'per order'}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            <div className="text-sm text-gray-900">
                                                                {formatDate(rate.created_at)}
                                                            </div>
                                                            <div className="text-xs text-gray-500">
                                                                Updated: {new Date(rate.updated_at).toLocaleDateString()}
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-3 whitespace-nowrap">
                                                            <div className="flex items-center gap-1">
                                                                <button
                                                                    onClick={() => handleEdit(rate)}
                                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                                    title="Edit"
                                                                >
                                                                    <Edit2 className="w-4 h-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(rate.id, rate.rider_name || 'All Riders')}
                                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                    title="Delete"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* Pagination/Info */}
                {(filteredRates.length > 0) && (
                    <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600">
                        <div className="mb-3 sm:mb-0">
                            Showing <span className="font-semibold">{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredRates.length)}</span> of{' '}
                            <span className="font-semibold">{filteredRates.length}</span> rates
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className={`p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                <ChevronLeft className="w-4 h-4" />
                                <span className="hidden sm:inline">Previous</span>
                            </button>

                            <div className="flex items-center gap-1">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNumber;
                                    if (totalPages <= 5) {
                                        pageNumber = i + 1;
                                    } else if (currentPage <= 3) {
                                        pageNumber = i + 1;
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNumber = totalPages - 4 + i;
                                    } else {
                                        pageNumber = currentPage - 2 + i;
                                    }

                                    return (
                                        <button
                                            key={pageNumber}
                                            onClick={() => handlePageChange(pageNumber)}
                                            className={`w-8 h-8 rounded-lg flex items-center justify-center ${currentPage === pageNumber
                                                ? 'bg-blue-600 text-white'
                                                : 'border border-gray-300 hover:bg-gray-50'
                                                }`}
                                        >
                                            {pageNumber}
                                        </button>
                                    );
                                })}
                            </div>

                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className={`p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                <span className="hidden sm:inline">Next</span>
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Delete Modal */}
            {deleteModal.isOpen && (
                <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl max-w-sm sm:max-w-md w-full p-4 sm:p-6 mx-2">
                        <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                            <div className="h-10 w-10 sm:h-12 sm:w-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <Trash2 className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
                            </div>
                            <div className="min-w-0">
                                <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">Delete Rate</h3>
                                <p className="text-gray-600 text-sm sm:text-base">This action cannot be undone.</p>
                            </div>
                        </div>

                        <p className="mb-4 sm:mb-6 text-gray-700 text-sm sm:text-base">
                            Are you sure you want to delete{' '}
                            {deleteModal.rateId === 'bulk' ? 'selected rates' : `rate for "${deleteModal.rateName}"`}?
                        </p>

                        <div className="flex gap-2 sm:gap-3 justify-end">
                            <button
                                onClick={() => setDeleteModal({ isOpen: false, rateId: null, rateName: '' })}
                                className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-colors text-sm sm:text-base"
                                disabled={actionLoading}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg sm:rounded-xl hover:bg-red-700 transition-colors flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base"
                                disabled={actionLoading}
                            >
                                {actionLoading ? (
                                    <>
                                        <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
                                        Deleting...
                                    </>
                                ) : (
                                    'Delete'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editModal.isOpen && (
                <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl max-w-sm sm:max-w-lg w-full p-4 sm:p-6 mx-2">
                        <div className="flex justify-between items-center mb-4 sm:mb-6">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Edit Rate</h3>
                            <button
                                onClick={() => setEditModal({ isOpen: false, rate: null })}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-3 sm:space-y-4">
                            <div className="p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl">

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Rate Type */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Rate Type <span className="text-red-500">*</span>
                                        </label>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {rateTypeValues.map((rt) => {
                                                const selectedRateType =
                                                    formData.rateType || editModal.rate.rate_type;

                                                return (
                                                    <button
                                                        key={rt.value}
                                                        type="button"
                                                        onClick={() =>
                                                            handleChange({
                                                                target: { name: "rateType", value: rt.value },
                                                            })
                                                        }
                                                        className={`p-4 border rounded-xl text-left transition-all duration-200 ${selectedRateType === rt.value
                                                            ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                                                            : "border-gray-300 hover:border-blue-300 hover:bg-gray-50"
                                                            }`}
                                                    >
                                                        <div className="font-medium text-gray-800">
                                                            {rt.label}
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        <input
                                            type="hidden"
                                            name="rateType"
                                            value={formData.rateType}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    {/* Rate Amount */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Rate Amount <span className="text-red-500">*</span>
                                        </label>

                                        <div className="relative">
                                            <input
                                                type="number"
                                                name="rate"
                                                value={formData.rate || editModal.rate.rate}
                                                onChange={handleChange}
                                                step="0.01"
                                                min="0"
                                                className="w-full p-3 pl-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                placeholder="Enter rate amount"
                                                required
                                            />
                                            <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                                                <span className="text-gray-500">₹</span>
                                            </div>
                                        </div>

                                        <p className="mt-2 text-sm text-gray-500">
                                            {formData.rateType === "perorder"
                                                ? "Amount per order"
                                                : formData.rateType === "perkms"
                                                    ? "Amount per kilometer"
                                                    : "Enter the rate amount"}
                                        </p>
                                    </div>

                                    {/* Order Mode */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Order Mode <span className="text-red-500">*</span>
                                        </label>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {/* If per-order → show list of modes */}
                                            {(formData.rateType === "perorder" ||
                                                editModal.rate.rate_type === "perorder") &&
                                                rateValues.map((mode) => {
                                                    const selectedOrderMode =
                                                        formData.orderMode || editModal.rate.order_mode;

                                                    return (
                                                        <button
                                                            key={mode.value}
                                                            type="button"
                                                            onClick={() =>
                                                                handleChange({
                                                                    target: {
                                                                        name: "orderMode",
                                                                        value: mode.value,
                                                                    },
                                                                })
                                                            }
                                                            className={`p-4 border rounded-xl text-left transition-all duration-200 ${selectedOrderMode === mode.value
                                                                ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                                                                : "border-gray-300 hover:border-blue-300 hover:bg-gray-50"
                                                                }`}
                                                        >
                                                            <div className="font-medium text-gray-800">
                                                                {mode.label}
                                                            </div>
                                                        </button>
                                                    );
                                                })}

                                            {/* If per-km → only show Turant */}
                                            {(formData.rateType === "perkms" || editModal.rate.rate_type === "perkms") && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleChange({
                                                            target: { name: "orderMode", value: "Turant" },
                                                        })
                                                    }
                                                    className={`p-4 border rounded-xl text-left transition-all duration-200 ${(formData.orderMode ||
                                                        editModal.rate.order_mode) === "Turant"
                                                        ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                                                        : "border-gray-300 hover:border-blue-300 hover:bg-gray-50"
                                                        }`}
                                                >
                                                    <div className="font-medium text-gray-800">Turant</div>
                                                </button>
                                            )}
                                        </div>

                                        <input
                                            type="hidden"
                                            name="orderMode"
                                            value={formData.orderMode}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-3 ${!loading
                                            ? "bg-[rgb(86,78,193)] text-white shadow-lg hover:shadow-xl"
                                            : "bg-gray-200 text-gray-500 cursor-not-allowed"
                                            }`}
                                    >
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Update Rate...
                                            </>
                                        ) : (
                                            "Update Rider Rate"
                                        )}
                                    </button>
                                </form>

                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default RiderRates;