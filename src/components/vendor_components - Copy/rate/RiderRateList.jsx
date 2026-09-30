
// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import {
//     Plus,
//     Edit2,
//     Trash2,
//     Search,
//     Filter,
//     Download,
//     Eye,
//     CheckCircle,
//     XCircle,
//     MoreVertical,
//     Loader2,
//     AlertCircle,
//     ChevronLeft,
//     ChevronRight
// } from 'lucide-react';
// import { Link } from 'react-router-dom';
// import toast from 'react-hot-toast';

// const baseURL = import.meta.env.VITE_BASE_URL;

// const RiderRateList = () => {
//     const [rates, setRates] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [selectedFilter, setSelectedFilter] = useState('all');
//     const [selectedRates, setSelectedRates] = useState([]);
//     const [deleteModal, setDeleteModal] = useState({ isOpen: false, rateId: null, rateName: '' });
//     const [editModal, setEditModal] = useState({ isOpen: false, rate: null });
//     const [actionLoading, setActionLoading] = useState(false);
//     const [error, setError] = useState('');
//     const [currentPage, setCurrentPage] = useState(1);
//     const [itemsPerPage] = useState(10);
//     const [isMobile, setIsMobile] = useState(false);
//     const [formData, setFormData] = useState({
//         rate_id: "",
//         rateType: "",
//         rate: "",
//         orderMode: ""
//     });
//     // Check if mobile screen
//     useEffect(() => {
//         const checkMobile = () => {
//             setIsMobile(window.innerWidth < 768);
//         };

//         checkMobile();
//         window.addEventListener('resize', checkMobile);

//         return () => window.removeEventListener('resize', checkMobile);
//     }, []);

//     const getRates = async () => {
//         try {
//             setLoading(true);
//             const res = await axios.get(`${baseURL}/api/vendor/getVendorRates`, {
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem("token")}`,
//                 },
//             });
//             setRates(res.data.rates || []);
//             setError('');
//         } catch (error) {
//             console.error('Error fetching rates:', error);
//             setError('Failed to load rider rates. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };
//     const isValidForm = () => {
//         if (!formData.type || !formData.rateType || !formData.rate || !formData.orderMode) {
//             return false;
//         }
//         if (formData.type === "individual" && !formData.rider) {
//             return false;
//         }
//         return true;
//     };
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData(prev => ({
//             ...prev,
//             [name]: value
//         }));

//         if (name === "type") {
//             setFormData(prev => ({ ...prev, rider: "" }));
//         }
//     };
//     const rateValues = [
//         { value: "SDD", label: "Same Day Delivery" },
//         { value: "NDD", label: "Next Day Delivery" },
//         // { value: "Turant", label: "Turant" },
//     ];

//     const rateTypeValues = [
//         { value: "perorder", label: "Per Order" },
//         { value: "perkms", label: "Per Kilometer" }
//     ];

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         try {
//             // Prepare form data for submission
//             const submissionData = {
//                 rate_for: formData.type,
//                 ...(formData.type === "individual" && { riderId: formData.rider }),
//                 rateType: formData.rateType,
//                 rate: parseFloat(formData.rate),
//                 orderMode: formData.orderMode,
//             };


//             const res = await axios.post(`${baseURL}/api/vendor/updateVendorRate`,
//                 {
//                     "rate_id": editModal.rate.id,
//                     "rate_type": submissionData.rateType || editModal.rate.rate_type,
//                     "rate": submissionData.rate || editModal.rate.rate,
//                     "order_mode": submissionData.orderMode || editModal.rate.order_mode
//                 }
//                 , {
//                     headers: {
//                         Authorization: `Bearer ${localStorage.getItem("token")}`,
//                     },
//                 });
//             if (res.data.success) {
//                 getRates()
//                 setEditModal({ isOpen: false, rate: null })
//                 toast.success(res.data.message)
//                 setFormData({
//                     rate_id: "",
//                     rateType: "",
//                     rate: "",
//                     orderMode: ""
//                 });
//             }


//         } catch (err) {
//             toast.error(err.response?.data?.message || "Failed to create rider rate")
            
//         } finally {
//             setLoading(false);
//         }
//     };
//     useEffect(() => {
//         getRates();
//     }, []);

//     const handleDelete = async (rateId, rateName) => {
//         setDeleteModal({ isOpen: true, rateId, rateName });
//     };

//     const confirmDelete = async () => {
//         try {
//             setActionLoading(true);
//             await axios.post(`${baseURL}/api/vendor/deleteVendorRate`,
//                 {
//                     rate_id: deleteModal.rateId
//                 },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${localStorage.getItem("token")}`,
//                     },
//                 }
//             );

//             setRates(rates.filter(rate => rate.id !== deleteModal.rateId));
//             setDeleteModal({ isOpen: false, rateId: null, rateName: '' });
//             setError('');
//         } catch (error) {
//             console.error('Error deleting rate:', error);
//             setError('Failed to delete rate. Please try again.');
//         } finally {
//             setActionLoading(false);
//         }
//     };

//     const handleEdit = (rate) => {
//         setEditModal({ isOpen: true, rate });
//     };

//     const handleBulkDelete = () => {
//         if (selectedRates.length === 0) return;

//         const rateNames = rates
//             .filter(rate => selectedRates.includes(rate.id))
//             .map(rate => rate.rider_name || 'All Riders')
//             .join(', ');

//         setDeleteModal({
//             isOpen: true,
//             rateId: 'bulk',
//             rateName: rateNames
//         });
//     };

//     const handleSelectAll = (e) => {
//         if (e.target.checked) {
//             setSelectedRates(filteredRates.map(rate => rate.id));
//         } else {
//             setSelectedRates([]);
//         }
//     };

//     const handleSelectRate = (rateId) => {
//         if (selectedRates.includes(rateId)) {
//             setSelectedRates(selectedRates.filter(id => id !== rateId));
//         } else {
//             setSelectedRates([...selectedRates, rateId]);
//         }
//     };

//     const formatDate = (dateString) => {
//         return new Date(dateString).toLocaleDateString('en-US', {
//             year: 'numeric',
//             month: 'short',
//             day: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit'
//         });
//     };

//     const formatCurrency = (amount) => {
//         return `₹${parseFloat(amount).toFixed(2)}`;
//     };

//     const getRateTypeBadge = (type) => {
//         const config = {
//             perorder: { color: 'bg-blue-100 text-blue-800', label: 'Per Order' },
//             perkms: { color: 'bg-green-100 text-green-800', label: 'Per KM' }
//         };
//         const cfg = config[type] || { color: 'bg-gray-100 text-gray-800', label: type };
//         return (
//             <span className={`px-2 py-1 rounded-full text-xs font-semibold ${cfg.color} whitespace-nowrap`}>
//                 {cfg.label}
//             </span>
//         );
//     };

//     const getModeBadge = (mode) => {
//         const config = {
//             SDD: { color: 'bg-purple-100 text-purple-800', label: 'Same Day' },
//             NDD: { color: 'bg-amber-100 text-amber-800', label: 'Next Day' }
//         };
//         const cfg = config[mode] || { color: 'bg-gray-100 text-gray-800', label: mode };
//         return (
//             <span className={`px-2 py-1 rounded-full text-xs font-semibold ${cfg.color} whitespace-nowrap`}>
//                 {cfg.label}
//             </span>
//         );
//     };

//     const getRateForBadge = (rateFor, riderName) => {
//         if (rateFor === 'all') {
//             return (
//                 <span className="px-2 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800 whitespace-nowrap">
//                     All Riders
//                 </span>
//             );
//         }
//         return (
//             <div className="flex flex-col min-w-0">
//                 <span className="px-2 py-1 rounded-full text-xs font-semibold bg-pink-100 text-pink-800 mb-1 whitespace-nowrap">
//                     Individual
//                 </span>
//                 <span className="text-xs text-gray-600 truncate" title={riderName}>
//                     {riderName}
//                 </span>
//             </div>
//         );
//     };

//     // Filter rates based on search and filter
//     const filteredRates = rates.filter(rate => {
//         const matchesSearch =
//             rate.rider_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//             rate.rate?.toString().includes(searchTerm) ||
//             rate.rate_type?.toLowerCase().includes(searchTerm.toLowerCase());

//         const matchesFilter =
//             selectedFilter === 'all' ||
//             (selectedFilter === 'individual' && rate.rate_for === 'individual') ||
//             (selectedFilter === 'allRiders' && rate.rate_for === 'all');

//         return matchesSearch && matchesFilter;
//     });

//     // Pagination logic
//     const indexOfLastItem = currentPage * itemsPerPage;
//     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//     const currentRates = filteredRates.slice(indexOfFirstItem, indexOfLastItem);
//     const totalPages = Math.ceil(filteredRates.length / itemsPerPage);

//     const handlePageChange = (pageNumber) => {
//         setCurrentPage(pageNumber);
//     };

    

//     if (loading) {
//         return (
//             <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
//                 <div className="text-center">
//                     <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
//                     <p className="mt-4 text-lg text-gray-600">Loading rider rates...</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//             {/* Header */}
//             <div className="bg-[#0446DB] text-white">
//                 <div className="mx-auto px-3 sm:px-4 lg:px-6 py-3">
//                     <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
//                         <div className="flex-1 min-w-0">
//                             <h1 className="text-2xl sm:text-3xl font-bold truncate">Rider Rate Management</h1>
//                             <p className="text-purple-200 mt-1 text-sm sm:text-base truncate">
//                                 Manage and monitor your rider rates and delivery charges
//                             </p>
//                         </div>
//                         <Link to={`/vendor/rider_rate/create`} className="flex-shrink-0 mt-3 sm:mt-0">
//                             <button className="flex items-center gap-2 bg-white text-[#0446DB] px-4 py-1 rounded-[8px] font-semibold shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base whitespace-nowrap">
//                                 <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
//                                 Add New Rate
//                             </button>
//                         </Link>
//                     </div>
//                 </div>
//             </div>

//             <div className="mx-auto">
//                 {/* Error Message */}
//                 {error && (
//                     <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200  flex items-start sm:items-center gap-2 sm:gap-3">
//                         <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 flex-shrink-0 mt-0.5" />
//                         <p className="text-red-700 text-sm sm:text-base flex-1">{error}</p>
//                         <button
//                             onClick={() => setError('')}
//                             className="text-red-500 hover:text-red-700 flex-shrink-0"
//                         >
//                             <XCircle className="w-4 h-4 sm:w-5 sm:h-5" />
//                         </button>
//                     </div>
//                 )}

//                 {/* Controls */}
//                 <div className="bg-white rounded-[8px] p-4 sm:p-6 mb-4 sm:mb-6">
//                     <div className="flex flex-col gap-3">
//                         <div className="flex flex-col sm:flex-row gap-3">
//                             {/* Search */}
//                             {/* <div className="relative flex-1">
//                                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                                 <input
//                                     type="text"
//                                     placeholder="Search rates..."
//                                     value={searchTerm}
//                                     onChange={(e) => setSearchTerm(e.target.value)}
//                                     className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
//                                 />
//                             </div> */}

//                             {/* Filter */}
//                             <div className="relative sm:w-48">
//                                 <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                                 <select
//                                     value={selectedFilter}
//                                     onChange={(e) => setSelectedFilter(e.target.value)}
//                                     className="w-full pl-9 pr-4 py-1 border border-gray-300 rounded-[8px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base appearance-none"
//                                 >
//                                     <option value="all">All Types</option>
//                                     <option value="individual">Individual</option>
//                                     <option value="allRiders">All Riders</option>
//                                 </select>
//                             </div>
//                         </div>

//                         {/* Bulk Actions */}
//                         {selectedRates.length > 0 && (
//                             <div className="flex items-center gap-2">
//                                 <button
//                                     onClick={handleBulkDelete}
//                                     className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg sm:rounded-xl hover:bg-red-700 transition-colors text-sm sm:text-base"
//                                 >
//                                     <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
//                                     Delete ({selectedRates.length})
//                                 </button>
//                             </div>
//                         )}
//                     </div>
//                 </div>

               
//                     <>
//                         <div className="bg-white  overflow-hidden">
//                             <div className="overflow-x-auto">
//                                 <div className="min-w-[800px] md:min-w-full">
//                                     <table className="w-full divide-y divide-gray-200">
//                                         <thead className="bg-gray-50">
//                                             <tr>
//                                                 <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
//                                                     Rider / Rate For
//                                                 </th>
//                                                 <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
//                                                     Rate Details
//                                                 </th>
//                                                 <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
//                                                     Order Mode
//                                                 </th>
//                                                 <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
//                                                     Amount
//                                                 </th>
//                                                 <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
//                                                     Created
//                                                 </th>
//                                                 <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap">
//                                                     Actions
//                                                 </th>
//                                             </tr>
//                                         </thead>
//                                         <tbody className="bg-white divide-y divide-gray-100">
//                                             {currentRates.length === 0 ? (
//                                                 <tr>
//                                                     <td colSpan="6" className="px-6 py-12 text-center">
//                                                         <div className="text-gray-400">
//                                                             <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                                                             </svg>
//                                                             <p className="text-lg font-medium text-gray-600">No rates found</p>
//                                                             <p className="text-gray-500 mt-2">
//                                                                 {searchTerm ? 'Try adjusting your search' : 'Add your first rider rate'}
//                                                             </p>
//                                                         </div>
//                                                     </td>
//                                                 </tr>
//                                             ) : (
//                                                 currentRates.map((rate) => (
//                                                     <tr
//                                                         key={rate.id}
//                                                         className={`hover:bg-gray-50 transition-colors ${selectedRates.includes(rate.id) ? 'bg-blue-50' : ''}`}
//                                                     >
//                                                         <td className="px-4 py-3 whitespace-nowrap">
//                                                             <div className="flex items-center">
                                                               
//                                                                 <div className="ml-3 min-w-0">
//                                                                     {getRateForBadge(rate.rate_for, rate.rider_name)}
//                                                                 </div>
//                                                             </div>
//                                                         </td>
//                                                         <td className="px-4 py-3 whitespace-nowrap">
//                                                             <div className="flex flex-col gap-1">
//                                                                 <div>
//                                                                     {getRateTypeBadge(rate.rate_type)}
//                                                                 </div>
//                                                                 <span className="text-xs text-gray-500">ID: {rate.id}</span>
//                                                             </div>
//                                                         </td>
//                                                         <td className="px-4 py-3 whitespace-nowrap">
//                                                             {getModeBadge(rate.order_mode)}
//                                                         </td>
//                                                         <td className="px-4 py-3 whitespace-nowrap">
//                                                             <div className="text-base font-bold text-gray-800">
//                                                                 {formatCurrency(rate.rate)}
//                                                             </div>
//                                                             <div className="text-xs text-gray-500">
//                                                                 {rate.rate_type === 'perkms' ? 'per kilometer' : 'per order'}
//                                                             </div>
//                                                         </td>
//                                                         <td className="px-4 py-3 whitespace-nowrap">
//                                                             <div className="text-sm text-gray-900">
//                                                                 {formatDate(rate.created_at)}
//                                                             </div>
//                                                             <div className="text-xs text-gray-500">
//                                                                 Updated: {new Date(rate.updated_at).toLocaleDateString()}
//                                                             </div>
//                                                         </td>
//                                                         <td className="px-4 py-3 whitespace-nowrap">
//                                                             <div className="flex items-center gap-1">
//                                                                 <button
//                                                                     onClick={() => handleEdit(rate)}
//                                                                     className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
//                                                                     title="Edit"
//                                                                 >
//                                                                     <Edit2 className="w-4 h-4" />
//                                                                 </button>
//                                                                 <button
//                                                                     onClick={() => handleDelete(rate.id, rate.rider_name || 'All Riders')}
//                                                                     className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
//                                                                     title="Delete"
//                                                                 >
//                                                                     <Trash2 className="w-4 h-4" />
//                                                                 </button>
//                                                             </div>
//                                                         </td>
//                                                     </tr>
//                                                 ))
//                                             )}
//                                         </tbody>
//                                     </table>
//                                 </div>
//                             </div>
//                         </div>
//                     </>
               

//                 {/* Pagination/Info */}
//                 {(filteredRates.length > 0) && (
//                     <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600">
//                         <div className="mb-3 sm:mb-0">
//                             Showing <span className="font-semibold">{indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredRates.length)}</span> of{' '}
//                             <span className="font-semibold">{filteredRates.length}</span> rates
//                         </div>
//                         <div className="flex items-center gap-2">
//                             <button
//                                 onClick={() => handlePageChange(currentPage - 1)}
//                                 disabled={currentPage === 1}
//                                 className={`p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
//                                     }`}
//                             >
//                                 <ChevronLeft className="w-4 h-4" />
//                                 <span className="hidden sm:inline">Previous</span>
//                             </button>

//                             <div className="flex items-center gap-1">
//                                 {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                                     let pageNumber;
//                                     if (totalPages <= 5) {
//                                         pageNumber = i + 1;
//                                     } else if (currentPage <= 3) {
//                                         pageNumber = i + 1;
//                                     } else if (currentPage >= totalPages - 2) {
//                                         pageNumber = totalPages - 4 + i;
//                                     } else {
//                                         pageNumber = currentPage - 2 + i;
//                                     }

//                                     return (
//                                         <button
//                                             key={pageNumber}
//                                             onClick={() => handlePageChange(pageNumber)}
//                                             className={`w-8 h-8 rounded-lg flex items-center justify-center ${currentPage === pageNumber
//                                                 ? 'bg-blue-600 text-white'
//                                                 : 'border border-gray-300 hover:bg-gray-50'
//                                                 }`}
//                                         >
//                                             {pageNumber}
//                                         </button>
//                                     );
//                                 })}
//                             </div>

//                             <button
//                                 onClick={() => handlePageChange(currentPage + 1)}
//                                 disabled={currentPage === totalPages}
//                                 className={`p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-1 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
//                                     }`}
//                             >
//                                 <span className="hidden sm:inline">Next</span>
//                                 <ChevronRight className="w-4 h-4" />
//                             </button>
//                         </div>
//                     </div>
//                 )}
//             </div>

//             {/* Delete Modal */}
//             {deleteModal.isOpen && (
//                 <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center p-4 z-50">
//                     <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl max-w-sm sm:max-w-md w-full p-4 sm:p-6 mx-2">
//                         <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
//                             <div className="h-10 w-10 sm:h-12 sm:w-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
//                                 <Trash2 className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
//                             </div>
//                             <div className="min-w-0">
//                                 <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">Delete Rate</h3>
//                                 <p className="text-gray-600 text-sm sm:text-base">This action cannot be undone.</p>
//                             </div>
//                         </div>

//                         <p className="mb-4 sm:mb-6 text-gray-700 text-sm sm:text-base">
//                             Are you sure you want to delete{' '}
//                             {deleteModal.rateId === 'bulk' ? 'selected rates' : `rate for "${deleteModal.rateName}"`}?
//                         </p>

//                         <div className="flex gap-2 sm:gap-3 justify-end">
//                             <button
//                                 onClick={() => setDeleteModal({ isOpen: false, rateId: null, rateName: '' })}
//                                 className="px-3 sm:px-4 py-2 border border-gray-300 rounded-lg sm:rounded-xl hover:bg-gray-50 transition-colors text-sm sm:text-base"
//                                 disabled={actionLoading}
//                             >
//                                 Cancel
//                             </button>
//                             <button
//                                 onClick={confirmDelete}
//                                 className="px-3 sm:px-4 py-2 bg-red-600 text-white rounded-lg sm:rounded-xl hover:bg-red-700 transition-colors flex items-center gap-1.5 sm:gap-2 text-sm sm:text-base"
//                                 disabled={actionLoading}
//                             >
//                                 {actionLoading ? (
//                                     <>
//                                         <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-spin" />
//                                         Deleting...
//                                     </>
//                                 ) : (
//                                     'Delete'
//                                 )}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Edit Modal */}
//             {editModal.isOpen && (
//                 <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center p-4 z-50">
//                     <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl max-w-sm sm:max-w-lg w-full p-4 sm:p-6 mx-2">
//                         <div className="flex justify-between items-center mb-4 sm:mb-6">
//                             <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Edit Rate</h3>
//                             <button
//                                 onClick={() => setEditModal({ isOpen: false, rate: null })}
//                                 className="text-gray-400 hover:text-gray-600"
//                             >
//                                 ✕
//                             </button>
//                         </div>

//                         <div className="space-y-3 sm:space-y-4">
//                             <div className="p-3 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl">

//                                 <form onSubmit={handleSubmit} className="space-y-6">
//                                     {/* Rate Type */}
//                                     <div>
//                                         <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                             Rate Type <span className="text-red-500">*</span>
//                                         </label>

//                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                                             {rateTypeValues.map((rt) => {
//                                                 const selectedRateType =
//                                                     formData.rateType || editModal.rate.rate_type;

//                                                 return (
//                                                     <button
//                                                         key={rt.value}
//                                                         type="button"
//                                                         onClick={() =>
//                                                             handleChange({
//                                                                 target: { name: "rateType", value: rt.value },
//                                                             })
//                                                         }
//                                                         className={`p-2 border rounded-[8px] text-left transition-all duration-200 ${selectedRateType === rt.value
//                                                             ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
//                                                             : "border-gray-300 hover:border-blue-300 hover:bg-gray-50"
//                                                             }`}
//                                                     >
//                                                         <div className="font-medium text-gray-800">
//                                                             {rt.label}
//                                                         </div>
//                                                     </button>
//                                                 );
//                                             })}
//                                         </div>

//                                         <input
//                                             type="hidden"
//                                             name="rateType"
//                                             value={formData.rateType}
//                                             onChange={handleChange}
//                                             required
//                                         />
//                                     </div>

//                                     {/* Rate Amount */}
//                                     <div>
//                                         <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                             Rate Amount <span className="text-red-500">*</span>
//                                         </label>

//                                         <div className="relative">
//                                             <input
//                                                 type="number"
//                                                 name="rate"
//                                                 value={formData.rate || editModal.rate.rate}
//                                                 onChange={handleChange}
//                                                 step="0.01"
//                                                 min="0"
//                                                 className="w-full py-2 px-4 border border-gray-300 rounded-[8px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                                                 placeholder="Enter rate amount"
//                                                 required
//                                             />
//                                             <div className="absolute inset-y-0 right-0 flex items-center pr-4">
//                                                 <span className="text-gray-500">₹</span>
//                                             </div>
//                                         </div>

//                                         <p className="mt-2 text-sm text-gray-500">
//                                             {formData.rateType === "perorder"
//                                                 ? "Amount per order"
//                                                 : formData.rateType === "perkms"
//                                                     ? "Amount per kilometer"
//                                                     : "Enter the rate amount"}
//                                         </p>
//                                     </div>

//                                     {/* Order Mode */}
//                                     <div>
//                                         <label className="block text-sm font-semibold text-gray-700 mb-2">
//                                             Order Mode <span className="text-red-500">*</span>
//                                         </label>

//                                         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                                             {/* If per-order → show list of modes */}
//                                             {(formData.rateType === "perorder" ||
//                                                 editModal.rate.rate_type === "perorder") &&
//                                                 rateValues.map((mode) => {
//                                                     const selectedOrderMode =
//                                                         formData.orderMode || editModal.rate.order_mode;

//                                                     return (
//                                                         <button
//                                                             key={mode.value}
//                                                             type="button"
//                                                             onClick={() =>
//                                                                 handleChange({
//                                                                     target: {
//                                                                         name: "orderMode",
//                                                                         value: mode.value,
//                                                                     },
//                                                                 })
//                                                             }
//                                                             className={`px-2 py-2 border rounded-[8px] text-left transition-all duration-200 ${selectedOrderMode === mode.value
//                                                                 ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
//                                                                 : "border-gray-300 hover:border-blue-300 hover:bg-gray-50"
//                                                                 }`}
//                                                         >
//                                                             <div className="font-medium text-gray-800">
//                                                                 {mode.label}
//                                                             </div>
//                                                         </button>
//                                                     );
//                                                 })}

//                                             {/* If per-km → only show Turant */}
//                                             {(formData.rateType === "perkms" || editModal.rate.rate_type === "perkms") && (
//                                                 <button
//                                                     type="button"
//                                                     onClick={() =>
//                                                         handleChange({
//                                                             target: { name: "orderMode", value: "Turant" },
//                                                         })
//                                                     }
//                                                     className={`p-2 border rounded-[8px] text-left transition-all duration-200 ${(formData.orderMode ||
//                                                         editModal.rate.order_mode) === "Turant"
//                                                         ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
//                                                         : "border-gray-300 hover:border-blue-300 hover:bg-gray-50"
//                                                         }`}
//                                                 >
//                                                     <div className="font-medium text-gray-800">Turant</div>
//                                                 </button>
//                                             )}
//                                         </div>

//                                         <input
//                                             type="hidden"
//                                             name="orderMode"
//                                             value={formData.orderMode}
//                                             onChange={handleChange}
//                                             required
//                                         />
//                                     </div>

//                                     {/* Submit Button */}
//                                     <button
//                                         type="submit"
//                                         disabled={loading}
//                                         className={`w-full py-2 px-2 rounded-sm font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-3 ${!loading
//                                             ? "bg-[#0446DB] text-white shadow-lg hover:shadow-xl"
//                                             : "bg-gray-200 text-gray-500 cursor-not-allowed"
//                                             }`}
//                                     >
//                                         {loading ? (
//                                             <>
//                                                 <Loader2 className="w-5 h-5 animate-spin" />
//                                                 Update Rate...
//                                             </>
//                                         ) : (
//                                             "Update Rider Rate"
//                                         )}
//                                     </button>
//                                 </form>

//                             </div>
//                         </div>

//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default RiderRateList;




import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  X,
  IndianRupee,
  Users,
  User,
  CheckCircle2,
  PackageCheck,
  MapPinned,
  Settings2,
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const baseURL = import.meta.env.VITE_BASE_URL;

const RiderRateList = () => {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedRates, setSelectedRates] = useState([]);

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    rateId: null,
    rateName: "",
  });

  const [editModal, setEditModal] = useState({
    isOpen: false,
    rate: null,
  });

  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [formData, setFormData] = useState({
    rate_id: "",
    rateType: "",
    rate: "",
    orderMode: "",
  });

  /* =========================================================
     OPTIONS
  ========================================================= */

  const rateValues = [
    {
      value: "SDD",
      label: "Same Day Delivery",
    },
    {
      value: "NDD",
      label: "Next Day Delivery",
    },
  ];

  const rateTypeValues = [
    {
      value: "perorder",
      label: "Per Order",
    },
    {
      value: "perkms",
      label: "Per Kilometer",
    },
  ];

  /* =========================================================
     GET RATES
  ========================================================= */

  const getRates = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${baseURL}/api/vendor/getVendorRates`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "token"
            )}`,
          },
        }
      );

      setRates(res?.data?.rates || []);
      setError("");
    } catch (error) {
      console.error("Error fetching rates:", error);

      setError(
        "Failed to load rider rates. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRates();
  }, []);

  /* =========================================================
     CHANGE
  ========================================================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /* =========================================================
     UPDATE RATE
  ========================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!editModal.rate) return;

    setActionLoading(true);

    try {
      const rateType =
        formData.rateType ||
        editModal.rate.rate_type;

      const rateAmount =
        formData.rate !== ""
          ? parseFloat(formData.rate)
          : parseFloat(editModal.rate.rate);

      const orderMode =
        formData.orderMode ||
        editModal.rate.order_mode;

      const res = await axios.post(
        `${baseURL}/api/vendor/updateVendorRate`,
        {
          rate_id: editModal.rate.id,
          rate_type: rateType,
          rate: rateAmount,
          order_mode: orderMode,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "token"
            )}`,
          },
        }
      );

      if (res.data.success) {
        toast.success(
          res.data.message ||
            "Rider rate updated successfully"
        );

        setEditModal({
          isOpen: false,
          rate: null,
        });

        setFormData({
          rate_id: "",
          rateType: "",
          rate: "",
          orderMode: "",
        });

        getRates();
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          "Failed to update rider rate"
      );
    } finally {
      setActionLoading(false);
    }
  };

  /* =========================================================
     EDIT
  ========================================================= */

  const handleEdit = (rate) => {
    setFormData({
      rate_id: rate.id,
      rateType: rate.rate_type || "",
      rate: rate.rate || "",
      orderMode: rate.order_mode || "",
    });

    setEditModal({
      isOpen: true,
      rate,
    });
  };

  const closeEditModal = () => {
    if (actionLoading) return;

    setEditModal({
      isOpen: false,
      rate: null,
    });

    setFormData({
      rate_id: "",
      rateType: "",
      rate: "",
      orderMode: "",
    });
  };

  /* =========================================================
     DELETE
  ========================================================= */

  const handleDelete = (rateId, rateName) => {
    setDeleteModal({
      isOpen: true,
      rateId,
      rateName,
    });
  };

  const confirmDelete = async () => {
    /*
      Bulk delete API wasn't present separately in your
      original code. Individual delete keeps the existing API.
    */

    if (deleteModal.rateId === "bulk") {
      try {
        setActionLoading(true);

        await Promise.all(
          selectedRates.map((rateId) =>
            axios.post(
              `${baseURL}/api/vendor/deleteVendorRate`,
              {
                rate_id: rateId,
              },
              {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem(
                    "token"
                  )}`,
                },
              }
            )
          )
        );

        setRates((prev) =>
          prev.filter(
            (rate) =>
              !selectedRates.includes(rate.id)
          )
        );

        setSelectedRates([]);

        setDeleteModal({
          isOpen: false,
          rateId: null,
          rateName: "",
        });

        toast.success(
          "Selected rates deleted successfully"
        );
      } catch (error) {
        console.error(
          "Error deleting rates:",
          error
        );

        toast.error(
          error?.response?.data?.message ||
            "Failed to delete selected rates"
        );
      } finally {
        setActionLoading(false);
      }

      return;
    }

    try {
      setActionLoading(true);

      await axios.post(
        `${baseURL}/api/vendor/deleteVendorRate`,
        {
          rate_id: deleteModal.rateId,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "token"
            )}`,
          },
        }
      );

      setRates((prev) =>
        prev.filter(
          (rate) =>
            rate.id !== deleteModal.rateId
        )
      );

      setDeleteModal({
        isOpen: false,
        rateId: null,
        rateName: "",
      });

      toast.success(
        "Rider rate deleted successfully"
      );
    } catch (error) {
      console.error("Error deleting rate:", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to delete rate"
      );
    } finally {
      setActionLoading(false);
    }
  };

  /* =========================================================
     BULK
  ========================================================= */

  const handleBulkDelete = () => {
    if (selectedRates.length === 0) return;

    const rateNames = rates
      .filter((rate) =>
        selectedRates.includes(rate.id)
      )
      .map(
        (rate) =>
          rate.rider_name || "All Riders"
      )
      .join(", ");

    setDeleteModal({
      isOpen: true,
      rateId: "bulk",
      rateName: rateNames,
    });
  };

  const handleSelectRate = (rateId) => {
    if (selectedRates.includes(rateId)) {
      setSelectedRates((prev) =>
        prev.filter((id) => id !== rateId)
      );
    } else {
      setSelectedRates((prev) => [
        ...prev,
        rateId,
      ]);
    }
  };

  /* =========================================================
     FORMATTERS
  ========================================================= */

  const formatDate = (dateString) => {
    if (!dateString) return "—";

    return new Date(
      dateString
    ).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount) => {
    const parsed = parseFloat(amount);

    if (Number.isNaN(parsed)) {
      return "₹0.00";
    }

    return `₹${parsed.toFixed(2)}`;
  };

  /* =========================================================
     BADGES
  ========================================================= */

  const getRateTypeBadge = (type) => {
    const config = {
      perorder: {
        label: "Per Order",
        className:
          "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-400",
      },

      perkms: {
        label: "Per KM",
        className:
          "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-400",
      },
    };

    const cfg = config[type] || {
      label: type || "—",
      className:
        "border-neutral-200 bg-neutral-50 text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
    };

    return (
      <span
        className={`inline-flex items-center rounded-sm border px-2 py-1 text-[11px] font-medium ${cfg.className}`}
      >
        {cfg.label}
      </span>
    );
  };

  const getModeBadge = (mode) => {
    const config = {
      SDD: {
        label: "Same Day",
        className:
          "border-violet-200 bg-violet-50 text-violet-700 dark:border-violet-900 dark:bg-violet-950/40 dark:text-violet-400",
      },

      NDD: {
        label: "Next Day",
        className:
          "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-400",
      },

      Turant: {
        label: "Turant",
        className:
          "border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-900 dark:bg-orange-950/40 dark:text-orange-400",
      },
    };

    const cfg = config[mode] || {
      label: mode || "—",
      className:
        "border-neutral-200 bg-neutral-50 text-neutral-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
    };

    return (
      <span
        className={`inline-flex items-center rounded-sm border px-2 py-1 text-[11px] font-medium ${cfg.className}`}
      >
        {cfg.label}
      </span>
    );
  };

  const getRateForBadge = (
    rateFor,
    riderName
  ) => {
    if (rateFor === "all") {
      return (
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400">
            <Users className="h-4 w-4" />
          </div>

          <div>
            <p className="text-sm font-medium text-neutral-900 dark:text-white">
              All Riders
            </p>

            <p className="mt-0.5 text-[11px] text-neutral-500">
              Global rate
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2.5">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-blue-50 text-[#0446DB] dark:bg-blue-950/40 dark:text-blue-400">
          <User className="h-4 w-4" />
        </div>

        <div className="min-w-0">
          <p
            title={riderName}
            className="max-w-[180px] truncate text-sm font-medium text-neutral-900 dark:text-white"
          >
            {riderName || "Individual Rider"}
          </p>

          <p className="mt-0.5 text-[11px] text-neutral-500">
            Individual rate
          </p>
        </div>
      </div>
    );
  };

  /* =========================================================
     FILTER
  ========================================================= */

  const filteredRates = rates.filter(
    (rate) => {
      const search =
        searchTerm.toLowerCase().trim();

      const matchesSearch =
        !search ||
        rate.rider_name
          ?.toLowerCase()
          .includes(search) ||
        rate.rate
          ?.toString()
          .includes(searchTerm) ||
        rate.rate_type
          ?.toLowerCase()
          .includes(search) ||
        rate.order_mode
          ?.toLowerCase()
          .includes(search);

      const matchesFilter =
        selectedFilter === "all" ||
        (selectedFilter === "individual" &&
          rate.rate_for === "individual") ||
        (selectedFilter === "allRiders" &&
          rate.rate_for === "all");

      return matchesSearch && matchesFilter;
    }
  );

  /* =========================================================
     PAGINATION
  ========================================================= */

  const indexOfLastItem =
    currentPage * itemsPerPage;

  const indexOfFirstItem =
    indexOfLastItem - itemsPerPage;

  const currentRates = filteredRates.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(
    filteredRates.length / itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    if (
      pageNumber < 1 ||
      pageNumber > totalPages
    ) {
      return;
    }

    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedFilter]);

  /* =========================================================
     LOADING
  ========================================================= */

//   if (loading) {
//     return (
//       <div className="flex min-h-[85vh] items-center justify-center  dark:bg-neutral-950">
//         <div className="text-center">
//           <div className="mx-auto flex h-12 w-12 items-center justify-center  dark:border-neutral-800 dark:bg-neutral-900">
//             <Loader2 className="h-6 w-6 animate-spin text-[#0446DB]" />
//           </div>

//           <p className="mt-3 text-sm font-medium text-neutral-700 dark:text-neutral-200">
//             Loading rider rates...
//           </p>
//         </div>
//       </div>
//     );
//   }

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
             <div className=" w-full h-[90vh] flex justify-center items-center">
          <div>
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <p className="mt-2">Loading Rider Rate...</p>
          </div>
        </div>
        ):(

    <div className="min-h-screen bg-[#F7F8FA] dark:bg-neutral-950">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className=" dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <div className="flex items-center gap-2">
             

              <h1 className="text-xl font-semibold dark:text-white">
                Rider Rate Management
              </h1>
            </div>

            <p className="mt-1 text-sm dark:text-neutral-400">
              Manage rider rates and delivery
              charges
            </p>
          </div>

          <Link to="/vendor/rider_rate/create">
            <button className="inline-flex h-9 items-center justify-center gap-2 rounded-sm bg-white px-4 text-sm font-medium text-[#0446DB] shadow-sm transition hover:bg-blue-50">
              <Plus className="h-4 w-4" />
              Add New Rate
            </button>
          </Link>
        </div>
      </div>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div className="p-3 sm:p-4 lg:p-6">

        {/* ERROR */}

        {error && (
          <div className="mb-4 flex items-start gap-3 rounded-sm border border-red-200 bg-red-50 px-4 py-3 dark:border-red-900/50 dark:bg-red-950/30">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />

            <div className="flex-1">
              <p className="text-sm font-medium text-red-700 dark:text-red-400">
                Unable to load rates
              </p>

              <p className="mt-0.5 text-xs text-red-600 dark:text-red-400/80">
                {error}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setError("")}
              className="text-red-400 transition hover:text-red-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* ===================================================
            MAIN CARD
        ==================================================== */}

        <div className="overflow-hidden rounded-sm border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">

          {/* ===============================================
              TOOLBAR
          ================================================ */}

          <div className="border-b border-neutral-200 px-4 py-4 dark:border-neutral-800">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              <div>
                <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
                  Rider Rates
                </h2>

                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                  {filteredRates.length} rate
                  configuration
                  {filteredRates.length !== 1
                    ? "s"
                    : ""}
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">

                {/* SEARCH */}

                <div className="relative min-w-0 sm:w-[260px]">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) =>
                      setSearchTerm(
                        e.target.value
                      )
                    }
                    placeholder="Search rider, rate..."
                    className="h-9 w-full rounded-sm border border-neutral-300 bg-white pl-9 pr-3 text-sm text-neutral-800 outline-none transition placeholder:text-neutral-400 focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                  />
                </div>

                {/* FILTER */}

                <div className="relative sm:w-[165px]">
                  <Filter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

                  <select
                    value={selectedFilter}
                    onChange={(e) =>
                      setSelectedFilter(
                        e.target.value
                      )
                    }
                    className="h-9 w-full appearance-none rounded-sm border border-neutral-300 bg-white pl-9 pr-8 text-sm text-neutral-700 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                  >
                    <option value="all">
                      All Types
                    </option>

                    <option value="individual">
                      Individual
                    </option>

                    <option value="allRiders">
                      All Riders
                    </option>
                  </select>
                </div>

                {selectedRates.length > 0 && (
                  <button
                    type="button"
                    onClick={handleBulkDelete}
                    className="inline-flex h-9 items-center justify-center gap-2 rounded-sm border border-red-200 bg-red-50 px-3 text-sm font-medium text-red-600 transition hover:bg-red-100 dark:border-red-900/60 dark:bg-red-950/30 dark:text-red-400"
                  >
                    <Trash2 className="h-4 w-4" />

                    Delete (
                    {selectedRates.length})
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* =================================================
              TABLE
          ================================================== */}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px]">

              <thead className="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950/50">
                <tr>
                  <th className="w-[44px] px-4 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={
                        currentRates.length >
                          0 &&
                        currentRates.every(
                          (rate) =>
                            selectedRates.includes(
                              rate.id
                            )
                        )
                      }
                      onChange={(e) => {
                        if (
                          e.target.checked
                        ) {
                          setSelectedRates(
                            (prev) => [
                              ...new Set([
                                ...prev,
                                ...currentRates.map(
                                  (rate) =>
                                    rate.id
                                ),
                              ]),
                            ]
                          );
                        } else {
                          const currentIds =
                            currentRates.map(
                              (rate) =>
                                rate.id
                            );

                          setSelectedRates(
                            (prev) =>
                              prev.filter(
                                (id) =>
                                  !currentIds.includes(
                                    id
                                  )
                              )
                          );
                        }
                      }}
                      className="h-4 w-4 cursor-pointer accent-[#0446DB]"
                    />
                  </th>

                  {[
                    "Rider / Rate For",
                    "Rate Details",
                    "Order Mode",
                    "Amount",
                    "Created",
                    "Actions",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">

                {currentRates.length ===
                0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-16 text-center"
                    >
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-sm border border-neutral-200 bg-neutral-50 text-neutral-400 dark:border-neutral-700 dark:bg-neutral-800">
                        <IndianRupee className="h-5 w-5" />
                      </div>

                      <h3 className="mt-3 text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                        No rates found
                      </h3>

                      <p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-neutral-500">
                        {searchTerm ||
                        selectedFilter !==
                          "all"
                          ? "No rates match your current search or filter."
                          : "Create your first rider rate to get started."}
                      </p>

                      {!searchTerm &&
                        selectedFilter ===
                          "all" && (
                          <Link
                            to="/vendor/rider_rate/create"
                            className="mt-4 inline-flex h-9 items-center gap-2 rounded-sm bg-[#0446DB] px-4 text-xs font-medium text-white transition hover:bg-[#0339B8]"
                          >
                            <Plus className="h-3.5 w-3.5" />
                            Add New Rate
                          </Link>
                        )}
                    </td>
                  </tr>
                ) : (
                  currentRates.map(
                    (rate) => (
                      <tr
                        key={rate.id}
                        className={`transition hover:bg-neutral-50 dark:hover:bg-neutral-800/40 ${
                          selectedRates.includes(
                            rate.id
                          )
                            ? "bg-blue-50/60 dark:bg-blue-950/20"
                            : ""
                        }`}
                      >
                        {/* CHECKBOX */}

                        <td className="px-4 py-3.5">
                          <input
                            type="checkbox"
                            checked={selectedRates.includes(
                              rate.id
                            )}
                            onChange={() =>
                              handleSelectRate(
                                rate.id
                              )
                            }
                            className="h-4 w-4 cursor-pointer accent-[#0446DB]"
                          />
                        </td>

                        {/* RIDER */}

                        <td className="px-4 py-3.5">
                          {getRateForBadge(
                            rate.rate_for,
                            rate.rider_name
                          )}
                        </td>

                        {/* RATE TYPE */}

                        <td className="px-4 py-3.5">
                          <div className="flex flex-col items-start gap-1.5">
                            {getRateTypeBadge(
                              rate.rate_type
                            )}

                            <span className="text-[11px] text-neutral-400">
                              Rate ID: #
                              {rate.id}
                            </span>
                          </div>
                        </td>

                        {/* ORDER MODE */}

                        <td className="px-4 py-3.5">
                          {getModeBadge(
                            rate.order_mode
                          )}
                        </td>

                        {/* AMOUNT */}

                        <td className="px-4 py-3.5">
                          <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                            {formatCurrency(
                              rate.rate
                            )}
                          </p>

                          <p className="mt-0.5 text-[11px] text-neutral-500">
                            {rate.rate_type ===
                            "perkms"
                              ? "per kilometer"
                              : "per order"}
                          </p>
                        </td>

                        {/* CREATED */}

                        <td className="px-4 py-3.5">
                          <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                            {formatDate(
                              rate.created_at
                            )}
                          </p>

                          <p className="mt-1 text-[11px] text-neutral-400">
                            Updated:{" "}
                            {formatDate(
                              rate.updated_at
                            )}
                          </p>
                        </td>

                        {/* ACTIONS */}

                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-1.5">

                            <button
                              type="button"
                              onClick={() =>
                                handleEdit(
                                  rate
                                )
                              }
                              title="Edit Rate"
                              className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-blue-200 text-[#0446DB] transition hover:bg-blue-50 dark:border-blue-900/60 dark:hover:bg-blue-950/30"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(
                                  rate.id,
                                  rate.rider_name ||
                                    "All Riders"
                                )
                              }
                              title="Delete Rate"
                              className="inline-flex h-8 w-8 items-center justify-center rounded-sm border border-red-200 text-red-600 transition hover:bg-red-50 dark:border-red-900/60 dark:text-red-400 dark:hover:bg-red-950/30"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>

                          </div>
                        </td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>

          {/* =================================================
              PAGINATION
          ================================================== */}

          {filteredRates.length > 0 && (
            <div className="flex flex-col gap-3 border-t border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-800 dark:bg-neutral-950/40 sm:flex-row sm:items-center sm:justify-between">

              <p className="text-xs text-neutral-500">
                Showing{" "}
                <span className="font-medium text-neutral-800 dark:text-neutral-200">
                  {indexOfFirstItem + 1}-
                  {Math.min(
                    indexOfLastItem,
                    filteredRates.length
                  )}
                </span>{" "}
                of{" "}
                <span className="font-medium text-neutral-800 dark:text-neutral-200">
                  {filteredRates.length}
                </span>{" "}
                rates
              </p>

              <div className="flex items-center gap-1">

                {/* PREVIOUS */}

                <button
                  type="button"
                  onClick={() =>
                    handlePageChange(
                      currentPage - 1
                    )
                  }
                  disabled={
                    currentPage === 1
                  }
                  className="inline-flex h-8 items-center gap-1 rounded-sm border border-neutral-300 bg-white px-2.5 text-xs font-medium text-neutral-600 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />

                  <span className="hidden sm:inline">
                    Previous
                  </span>
                </button>

                {/* PAGE NUMBERS */}

                <div className="mx-1 flex items-center gap-1">
                  {Array.from(
                    {
                      length: Math.min(
                        5,
                        totalPages
                      ),
                    },
                    (_, i) => {
                      let pageNumber;

                      if (
                        totalPages <= 5
                      ) {
                        pageNumber =
                          i + 1;
                      } else if (
                        currentPage <= 3
                      ) {
                        pageNumber =
                          i + 1;
                      } else if (
                        currentPage >=
                        totalPages - 2
                      ) {
                        pageNumber =
                          totalPages -
                          4 +
                          i;
                      } else {
                        pageNumber =
                          currentPage -
                          2 +
                          i;
                      }

                      return (
                        <button
                          key={
                            pageNumber
                          }
                          type="button"
                          onClick={() =>
                            handlePageChange(
                              pageNumber
                            )
                          }
                          className={`flex h-8 w-8 items-center justify-center rounded-sm text-xs font-medium transition ${
                            currentPage ===
                            pageNumber
                              ? "bg-[#0446DB] text-white"
                              : "border border-neutral-300 bg-white text-neutral-600 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    }
                  )}
                </div>

                {/* NEXT */}

                <button
                  type="button"
                  onClick={() =>
                    handlePageChange(
                      currentPage + 1
                    )
                  }
                  disabled={
                    currentPage ===
                    totalPages
                  }
                  className="inline-flex h-8 items-center gap-1 rounded-sm border border-neutral-300 bg-white px-2.5 text-xs font-medium text-neutral-600 transition hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
                >
                  <span className="hidden sm:inline">
                    Next
                  </span>

                  <ChevronRight className="h-3.5 w-3.5" />
                </button>

              </div>
            </div>
          )}
        </div>
      </div>

      {/* =====================================================
          DELETE MODAL
      ====================================================== */}

      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-[2px]">

          <div className="w-full max-w-md overflow-hidden rounded-sm border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">

            {/* HEADER */}

            <div className="flex items-start gap-3 border-b border-neutral-200 px-5 py-4 dark:border-neutral-800">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
                <Trash2 className="h-5 w-5" />
              </div>

              <div className="flex-1">
                <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                  Delete Rate
                </h3>

                <p className="mt-1 text-xs text-neutral-500">
                  This action cannot be
                  undone.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  !actionLoading &&
                  setDeleteModal({
                    isOpen: false,
                    rateId: null,
                    rateName: "",
                  })
                }
                className="flex h-8 w-8 items-center justify-center rounded-sm text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* CONTENT */}

            <div className="px-5 py-5">
              <p className="text-sm leading-6 text-neutral-600 dark:text-neutral-300">
                Are you sure you want to
                delete{" "}
                <span className="font-semibold text-neutral-900 dark:text-white">
                  {deleteModal.rateId ===
                  "bulk"
                    ? `${selectedRates.length} selected rate${
                        selectedRates.length >
                        1
                          ? "s"
                          : ""
                      }`
                    : `rate for "${
                        deleteModal.rateName
                      }"`}
                </span>
                ?
              </p>

              <div className="mt-4 rounded-sm border border-red-100 bg-red-50 px-3 py-2.5 dark:border-red-900/50 dark:bg-red-950/20">
                <div className="flex gap-2">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />

                  <p className="text-xs leading-5 text-red-600 dark:text-red-400">
                    Deleted rate
                    configurations cannot be
                    recovered.
                  </p>
                </div>
              </div>
            </div>

            {/* FOOTER */}

            <div className="flex justify-end gap-2 border-t border-neutral-200 bg-neutral-50 px-5 py-3 dark:border-neutral-800 dark:bg-neutral-950/40">

              <button
                type="button"
                disabled={actionLoading}
                onClick={() =>
                  setDeleteModal({
                    isOpen: false,
                    rateId: null,
                    rateName: "",
                  })
                }
                className="h-9 rounded-sm border border-neutral-300 bg-white px-4 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                disabled={actionLoading}
                className="inline-flex h-9 min-w-[100px] items-center justify-center gap-2 rounded-sm bg-red-600 px-4 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          EDIT MODAL
      ====================================================== */}

      {editModal.isOpen &&
        editModal.rate && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-3 backdrop-blur-[2px] sm:p-4">

            <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-sm border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">

              {/* HEADER */}

              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-200 bg-white px-5 py-4 dark:border-neutral-800 dark:bg-neutral-900">

                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-blue-50 text-[#0446DB] dark:bg-blue-950/40 dark:text-blue-400">
                    <Edit2 className="h-4 w-4" />
                  </div>

                  <div>
                    <h3 className="text-base font-semibold text-neutral-900 dark:text-white">
                      Edit Rider Rate
                    </h3>

                    <p className="mt-0.5 text-xs text-neutral-500">
                      Rate ID #
                      {editModal.rate.id}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={
                    closeEditModal
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-sm text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
              >
                <div className="space-y-6 p-5">

                  {/* RIDER INFO */}

                  <div className="rounded-sm border border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-700 dark:bg-neutral-800/50">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-neutral-400">
                      Rate applies to
                    </p>

                    <div className="mt-2">
                      {getRateForBadge(
                        editModal.rate
                          .rate_for,
                        editModal.rate
                          .rider_name
                      )}
                    </div>
                  </div>

                  {/* =========================================
                      RATE TYPE
                  ========================================== */}

                  <div>
                    <label className="mb-2 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                      Rate Type
                      <span className="ml-1 text-red-500">
                        *
                      </span>
                    </label>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {rateTypeValues.map(
                        (rt) => {
                          const selected =
                            formData.rateType ===
                            rt.value;

                          return (
                            <button
                              key={
                                rt.value
                              }
                              type="button"
                              onClick={() => {
                                setFormData(
                                  (
                                    prev
                                  ) => ({
                                    ...prev,
                                    rateType:
                                      rt.value,

                                    /*
                                      Reset mode when
                                      rate type changes.
                                    */
                                    orderMode:
                                      "",
                                  })
                                );
                              }}
                              className={`relative flex items-center gap-3 rounded-sm border p-3 text-left transition ${
                                selected
                                  ? "border-[#0446DB] bg-blue-50/70 ring-1 ring-[#0446DB]/10 dark:bg-blue-950/20"
                                  : "border-neutral-200 hover:border-blue-300 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                              }`}
                            >
                              <div
                                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-sm ${
                                  selected
                                    ? "bg-[#0446DB] text-white"
                                    : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800"
                                }`}
                              >
                                {rt.value ===
                                "perorder" ? (
                                  <PackageCheck className="h-4 w-4" />
                                ) : (
                                  <MapPinned className="h-4 w-4" />
                                )}
                              </div>

                              <div>
                                <p className="text-sm font-medium text-neutral-900 dark:text-white">
                                  {
                                    rt.label
                                  }
                                </p>

                                <p className="mt-0.5 text-[11px] text-neutral-500">
                                  {rt.value ===
                                  "perorder"
                                    ? "Fixed amount per order"
                                    : "Amount per kilometer"}
                                </p>
                              </div>

                              {selected && (
                                <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-[#0446DB]" />
                              )}
                            </button>
                          );
                        }
                      )}
                    </div>
                  </div>

                  {/* =========================================
                      RATE AMOUNT
                  ========================================== */}

                  <div>
                    <label className="mb-2 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                      Rate Amount
                      <span className="ml-1 text-red-500">
                        *
                      </span>
                    </label>

                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex w-11 items-center justify-center border-r border-neutral-200 text-neutral-500 dark:border-neutral-700">
                        <IndianRupee className="h-4 w-4" />
                      </div>

                      <input
                        type="number"
                        name="rate"
                        value={
                          formData.rate
                        }
                        onChange={
                          handleChange
                        }
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        required
                        className="h-11 w-full rounded-sm border border-neutral-300 bg-white pl-14 pr-4 text-sm font-medium text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                      />
                    </div>

                    <p className="mt-1.5 text-xs text-neutral-500">
                      {formData.rateType ===
                      "perorder"
                        ? "Amount paid for each completed order."
                        : formData.rateType ===
                            "perkms"
                          ? "Amount paid for each kilometer."
                          : "Enter the rider rate amount."}
                    </p>
                  </div>

                  {/* =========================================
                      ORDER MODE
                  ========================================== */}

                  <div>
                    <label className="mb-2 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                      Order Mode
                      <span className="ml-1 text-red-500">
                        *
                      </span>
                    </label>

                    {formData.rateType ===
                      "perorder" && (
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {rateValues.map(
                          (mode) => {
                            const selected =
                              formData.orderMode ===
                              mode.value;

                            return (
                              <button
                                key={
                                  mode.value
                                }
                                type="button"
                                onClick={() =>
                                  setFormData(
                                    (
                                      prev
                                    ) => ({
                                      ...prev,
                                      orderMode:
                                        mode.value,
                                    })
                                  )
                                }
                                className={`relative rounded-sm border px-4 py-3 text-left transition ${
                                  selected
                                    ? "border-[#0446DB] bg-blue-50/70 text-[#0446DB] ring-1 ring-[#0446DB]/10 dark:bg-blue-950/20 dark:text-blue-400"
                                    : "border-neutral-200 text-neutral-700 hover:border-blue-300 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"
                                }`}
                              >
                                <p className="text-sm font-medium">
                                  {
                                    mode.label
                                  }
                                </p>

                                <p className="mt-1 text-[11px] text-neutral-500">
                                  {mode.value ===
                                  "SDD"
                                    ? "Same day delivery orders"
                                    : "Next day delivery orders"}
                                </p>

                                {selected && (
                                  <CheckCircle2 className="absolute right-3 top-3 h-4 w-4 text-[#0446DB]" />
                                )}
                              </button>
                            );
                          }
                        )}
                      </div>
                    )}

                    {formData.rateType ===
                      "perkms" && (
                      <button
                        type="button"
                        onClick={() =>
                          setFormData(
                            (prev) => ({
                              ...prev,
                              orderMode:
                                "Turant",
                            })
                          )
                        }
                        className={`relative w-full rounded-sm border px-4 py-3 text-left transition ${
                          formData.orderMode ===
                          "Turant"
                            ? "border-[#0446DB] bg-blue-50/70 ring-1 ring-[#0446DB]/10 dark:bg-blue-950/20"
                            : "border-neutral-200 hover:border-blue-300 hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-9 w-9 items-center justify-center rounded-sm ${
                              formData.orderMode ===
                              "Turant"
                                ? "bg-[#0446DB] text-white"
                                : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800"
                            }`}
                          >
                            <MapPinned className="h-4 w-4" />
                          </div>

                          <div>
                            <p className="text-sm font-medium text-neutral-900 dark:text-white">
                              Turant
                            </p>

                            <p className="mt-0.5 text-[11px] text-neutral-500">
                              Distance based
                              delivery
                            </p>
                          </div>
                        </div>

                        {formData.orderMode ===
                          "Turant" && (
                          <CheckCircle2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0446DB]" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* ===========================================
                    FOOTER
                ============================================ */}

                <div className="sticky bottom-0 flex justify-end gap-2 border-t border-neutral-200 bg-neutral-50 px-5 py-3 dark:border-neutral-800 dark:bg-neutral-950">

                  <button
                    type="button"
                    onClick={
                      closeEditModal
                    }
                    disabled={
                      actionLoading
                    }
                    className="h-9 rounded-sm border border-neutral-300 bg-white px-4 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={
                      actionLoading ||
                      !formData.rateType ||
                      !formData.rate ||
                      !formData.orderMode
                    }
                    className="inline-flex h-9 min-w-[135px] items-center justify-center gap-2 rounded-sm bg-[#0446DB] px-4 text-sm font-medium text-white transition hover:bg-[#0339B8] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {actionLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        Update Rate
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
    </div>
        )
    }
    
    </>
  );
};

export default RiderRateList;