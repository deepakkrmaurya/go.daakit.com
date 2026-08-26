// OrderSuccess.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Download, Printer, Copy, Truck, Package, MapPin, Calendar, User } from 'lucide-react';

const OrderSuccess = () => {
    const [orderDetails, setOrderDetails] = useState(null);
    const [copySuccess, setCopySuccess] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Dummy order data - replace with actual data from your API
    const dummyOrder = {
        orderId: 'ORD' + Math.floor(100000 + Math.random() * 900000),
        trackingNumber: 'TRK' + Math.floor(1000000000 + Math.random() * 9000000000),
        date: new Date().toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }),
        time: new Date().toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit'
        }),
        status: 'Confirmed',
        estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        }),
        serviceType: 'Turant Delivery',
        totalAmount: '₹1,250.00',
        shippingCost: '₹150.00',
        paymentMethod: 'Prepaid',
        pickupAddress: {
            name: 'John Doe',
            address: '123 Business Park, Sector 22',
            city: 'Gurugram',
            state: 'Haryana',
            pincode: '122022',
            phone: '+91 9876543210'
        },
        deliveryAddress: {
            name: 'Jane Smith',
            address: '456 Residential Complex, Sector 45',
            city: 'Gurugram',
            state: 'Haryana',
            pincode: '122003',
            phone: '+91 9876543211'
        },
        items: [
            {
                name: 'Premium Headphones',
                sku: 'SKU001',
                quantity: 1,
                price: '₹999.00',
                weight: '500g'
            },
            {
                name: 'Phone Case',
                sku: 'SKU002',
                quantity: 2,
                price: '₹499.00',
                weight: '200g'
            }
        ]
    };

    useEffect(() => {
        // Check if there's order data in location state (when navigating from create order)
        if (location.state && location.state.orderData) {
            setOrderDetails(location.state.orderData);
        } else {
            // Use dummy data for now
            setOrderDetails(dummyOrder);
        }

        // Clear any stored form data
        localStorage.removeItem('draftOrder');
    }, [location]);

    const handlePrint = () => {
        window.print();
    };

    const handleCopyTracking = () => {
        if (orderDetails?.trackingNumber) {
            navigator.clipboard.writeText(orderDetails.trackingNumber);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        }
    };

    const handleDownloadPDF = () => {
        // In a real app, this would generate/download a PDF
        alert('PDF download feature would be implemented here');
    };

    const handleCreateAnother = () => {
        navigate('/merchant/create_order/turant');
    };

    if (!orderDetails) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-blue-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Success Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-12 h-12 text-green-600" />
                        </div>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                        Order Created Successfully!
                    </h1>
                    <p className="text-lg text-gray-600">
                        Your order has been confirmed and is being processed.
                    </p>
                </div>

                {/* Order Summary Card */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Order Summary</h2>
                            <p className="text-gray-600">Keep this information for your records</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={handleCreateAnother}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                            >
                                <Copy className="w-4 h-4" />
                                Copy
                            </button>
                            <button
                                onClick={handlePrint}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <Printer className="w-4 h-4" />
                                Print
                            </button>
                            
                        </div>
                    </div>

                    {/* Order Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="space-y-4">
                            <div className="bg-blue-50 p-4 rounded-xl">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <Package className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Order Information</h3>
                                        <p className="text-sm text-gray-600">Order details & tracking</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Order ID:</span>
                                        <span className="font-semibold">{orderDetails.orderId}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Tracking Number:</span>
                                        <span className="font-semibold text-blue-600">{orderDetails.trackingNumber}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Order Date:</span>
                                        <span>{orderDetails.date} at {orderDetails.time}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Status:</span>
                                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                            {orderDetails.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-green-50 p-4 rounded-xl">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                        <Calendar className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Delivery Information</h3>
                                        <p className="text-sm text-gray-600">Estimated timeline</p>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Service Type:</span>
                                        <span className="font-semibold">{orderDetails.serviceType}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Estimated Delivery:</span>
                                        <span className="font-semibold">{orderDetails.estimatedDelivery}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Payment Method:</span>
                                        <span>{orderDetails.paymentMethod}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-purple-50 p-4 rounded-xl">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <Truck className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Payment Summary</h3>
                                        <p className="text-sm text-gray-600">Order value & charges</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Items Total:</span>
                                        <span>₹{(parseFloat(orderDetails.totalAmount.replace('₹', '').replace(',', '')) - parseFloat(orderDetails.shippingCost.replace('₹', '').replace(',', ''))).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Shipping Cost:</span>
                                        <span className="font-semibold">{orderDetails.shippingCost}</span>
                                    </div>
                                    <div className="border-t pt-3">
                                        <div className="flex justify-between text-lg font-bold">
                                            <span>Total Amount:</span>
                                            <span className="text-green-600">{orderDetails.totalAmount}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-orange-50 p-4 rounded-xl">
                                <h4 className="font-semibold text-gray-900 mb-3">Order Items</h4>
                                <div className="space-y-2">
                                    {orderDetails.items.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center p-2 bg-white rounded-lg">
                                            <div>
                                                <p className="font-medium">{item.name}</p>
                                                <p className="text-sm text-gray-500">SKU: {item.sku} • Qty: {item.quantity}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">{item.price}</p>
                                                <p className="text-sm text-gray-500">{item.weight}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Address Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-gray-50 p-5 rounded-xl">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <User className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Pickup Address</h3>
                                    <p className="text-sm text-gray-600">From where we'll collect</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="font-medium">{orderDetails.pickupAddress.name}</p>
                                <p className="text-gray-600">{orderDetails.pickupAddress.address}</p>
                                <p className="text-gray-600">{orderDetails.pickupAddress.city}, {orderDetails.pickupAddress.state} - {orderDetails.pickupAddress.pincode}</p>
                                <p className="text-gray-600">📞 {orderDetails.pickupAddress.phone}</p>
                            </div>
                        </div>

                        <div className="bg-gray-50 p-5 rounded-xl">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                    <MapPin className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Delivery Address</h3>
                                    <p className="text-sm text-gray-600">Where we'll deliver</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="font-medium">{orderDetails.deliveryAddress.name}</p>
                                <p className="text-gray-600">{orderDetails.deliveryAddress.address}</p>
                                <p className="text-gray-600">{orderDetails.deliveryAddress.city}, {orderDetails.deliveryAddress.state} - {orderDetails.deliveryAddress.pincode}</p>
                                <p className="text-gray-600">📞 {orderDetails.deliveryAddress.phone}</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Print Styles */}
            <style>{`
                @media print {
                    .no-print {
                        display: none !important;
                    }
                    body {
                        background: white !important;
                    }
                    .bg-gradient-to-b {
                        background: white !important;
                    }
                    .shadow-lg {
                        box-shadow: none !important;
                    }
                    .border {
                        border: 1px solid #ddd !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default OrderSuccess;