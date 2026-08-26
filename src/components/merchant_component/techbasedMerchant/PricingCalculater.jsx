import React, { useState } from 'react';
import { Package, MapPin, IndianRupee, Weight, TrendingUp, Calendar, Shield, Truck, Ruler } from 'lucide-react';
import axios from 'axios';

const MerchantPricingCalculator = () => {
    const [formData, setFormData] = useState({
        pickup_pincode: '226001',
        destination_pincode: '226002',
        order_value: '1000',
        order_weight: '20',
        order_type: 'cod',

    });

    const [pricingData, setPricingData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('sdd'); // 'sdd' or 'ndd'

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {

            const response = await axios.post(
                "http://localhost:5000/api/pricing/getSDDNDDPricing",
                formData,
                {

                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            console.log(response.data)




            setPricingData(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(price);
    };

    const data =
        activeTab === 'sdd'
            ? pricingData?.pricing?.SDD || []
            : pricingData?.pricing?.NDD || [];

    return (

        <div className="min-h-screen bg-[#EEEEEE]">
            {/* Header Section */}
            <header className="bg-[#564ec1] shadow-lg">
                <div className=" mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 sm:space-y-4 lg:space-y-0">
                        <div className="text-center lg:text-left">
                            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">Merchant Shipping Calculator</h1>
                            <p className="text-indigo-100 mt-1 sm:mt-2 text-sm sm:text-base">Calculate SDD & NDD shipping rates for your orders</p>
                        </div>


                    </div>
                </div>
            </header>
            <div className=" relative -top-10   mx-auto mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">


                {/* Main Content */}
                <div className="grid grid-cols-1  lg:grid-cols-3 gap-6">
                    {/* Form Section */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                            <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-blue-600" />
                                Order Details
                            </h2>

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* First Row - Pickup and Destination */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-gray-500" />
                                            Pickup Pincode
                                        </label>
                                        <input
                                            type="text"
                                            name="pickup_pincode"
                                            value={formData.pickup_pincode}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                            placeholder="226001"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-gray-500" />
                                            Destination Pincode
                                        </label>
                                        <input
                                            type="text"
                                            name="destination_pincode"
                                            value={formData.destination_pincode}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                            placeholder="226002"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Second Row - Value and Weight */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                            <IndianRupee className="w-4 h-4 text-gray-500" />
                                            Order Value (₹)
                                        </label>
                                        <input
                                            type="number"
                                            name="order_value"
                                            value={formData.order_value}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                            placeholder="1000"
                                            min="0"
                                            step="1"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                            <Weight className="w-4 h-4 text-gray-500" />
                                            Order Weight (g)
                                        </label>
                                        <input
                                            type="number"
                                            name="order_weight"
                                            value={formData.order_weight}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                            placeholder="20"
                                            min="0"
                                            step="1"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Third Row - Length and Breadth (NEW) */}
                                {/* <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                            <Ruler className="w-4 h-4 text-gray-500" />
                                            Length (cm)
                                        </label>
                                        <input
                                            type="number"
                                            name="length"
                                            value={formData.length}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                            placeholder="10"
                                            min="0"
                                            step="0.1"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                            <Ruler className="w-4 h-4 text-gray-500" />
                                            Breadth (cm)
                                        </label>
                                        <input
                                            type="number"
                                            name="breadth"
                                            value={formData.breadth}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                            placeholder="10"
                                            min="0"
                                            step="0.1"
                                            required
                                        />
                                    </div>
                                </div> */}

                                {/* Fourth Row - Merchant ID and Order Type */}
                                <div className="grid grid-cols-2 gap-3">
                                    {/* <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                            <Shield className="w-4 h-4 text-gray-500" />
                                            Merchant ID
                                        </label>
                                        <input
                                            type="number"
                                            name="merchant_id"
                                            value={formData.merchant_id}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                            placeholder="15"
                                            min="1"
                                            required
                                        />
                                    </div> */}

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Order Type</label>
                                        <div className="flex gap-4 mt-2">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="order_type"
                                                    value="cod"
                                                    checked={formData.order_type === 'cod'}
                                                    onChange={handleInputChange}
                                                    className="w-4 h-4 text-blue-600"
                                                />
                                                <span className="text-gray-700">COD</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="order_type"
                                                    value="prepaid"
                                                    checked={formData.order_type === 'prepaid'}
                                                    onChange={handleInputChange}
                                                    className="w-4 h-4 text-blue-600"
                                                />
                                                <span className="text-gray-700">Prepaid</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button - Full Width */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-[#564ec1] text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            Calculating...
                                        </>
                                    ) : (
                                        <>
                                            <Truck className="w-5 h-5" />
                                            Calculate Rates
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Results Section */}
                    <div className="lg:col-span-2">
                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-red-700">{error}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {!pricingData && !loading && !error && (
                            <div className="bg-white rounded-xl shadow-lg p-12 border border-gray-100 flex flex-col items-center justify-center text-center">
                                <Truck className="w-16 h-16 text-gray-400 mb-4" />
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Rates Calculated Yet</h3>
                                <p className="text-gray-500">Fill in the order details and click "Calculate Rates" to see shipping prices</p>
                            </div>
                        )}

                        {loading && (
                            <div className="bg-white rounded-xl shadow-lg p-12 border border-gray-100 flex flex-col items-center justify-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                                <p className="text-gray-600">Fetching the best rates for you...</p>
                            </div>
                        )}

                        {pricingData && pricingData.success && (
                            <div className="space-y-6">
                                {/* Tab Navigation */}
                                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                                    <div className="flex border-b border-gray-200">
                                        <button
                                            onClick={() => setActiveTab('sdd')}
                                            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors relative ${activeTab === 'sdd'
                                                ? 'text-blue-600 border-b-2 border-blue-600'
                                                : 'text-gray-500 hover:text-gray-700'
                                                }`}
                                        >
                                            <div className="flex items-center justify-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                Same Day Delivery (SDD)
                                            </div>
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('ndd')}
                                            className={`flex-1 px-6 py-4 text-sm font-medium transition-colors relative ${activeTab === 'ndd'
                                                ? 'text-blue-600 border-b-2 border-blue-600'
                                                : 'text-gray-500 hover:text-gray-700'
                                                }`}
                                        >
                                            <div className="flex items-center justify-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                Next Day Delivery (NDD)
                                            </div>
                                        </button>
                                    </div>

                                    {/* Pricing Table */}
                                    <div className="p-6">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b border-gray-200">
                                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Weight Slab</th>
                                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Weight Limit</th>
                                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Shipping Rate</th>
                                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">COD Charge</th>
                                                    <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Final Price</th>
                                                </tr>
                                            </thead>
                                            {/* <tbody>


                                                {data?.length > 0 ? (
                                                    data?.map((item, index) => (
                                                          <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                                                <td className="py-4 px-4">
                                                                    <span className="font-medium text-gray-800">{item?.slab}g</span>
                                                                </td>
                                                                <td className="py-4 px-4 text-gray-600">{item?.weight_limit}g</td>
                                                                <td className="py-4 px-4">
                                                                    <span className="text-green-600 font-medium">{formatPrice(item?.calculated_price)}</span>
                                                                </td>
                                                                <td className="py-4 px-4">
                                                                    {item?.cod_charge > 0 ? (
                                                                        <span className="text-orange-600 font-medium">{formatPrice(item?.cod_charge)}</span>
                                                                    ) : (
                                                                        <span className="text-gray-400">-</span>
                                                                    )}
                                                                </td>
                                                                <td className="py-4 px-4">
                                                                    <span className="bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-full text-sm">
                                                                        {formatPrice(item?.final_price)}
                                                                    </span>
                                                                </td>
                                                            </tr>
                                                     ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="5" className="text-center py-4 text-gray-500">
                                                            No Data Available
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody> */}

                                            
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>


    );
};

export default MerchantPricingCalculator;