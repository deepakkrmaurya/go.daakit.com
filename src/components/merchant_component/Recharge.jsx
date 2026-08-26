import React, { useState } from 'react';
import GenerateUPI from '../../utils/GenerateUPI';
import axios from 'axios';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

const baseUrl = import.meta.env.VITE_BASE_URL;

function Recharge() {
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const [CouponApply, setCouponApply] = useState({});
  const [selectedAmount, setSelectedAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [coupon, setcoupon] = useState(null);

  const rechargeAmounts = [100, 200, 500, 1000, 2000, 5000];

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    setCustomAmount(value);
    setSelectedAmount(value ? parseInt(value) : 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const applyCoupon = async () => {
    try {
      if (!selectedAmount || !coupon) {
        toast.error("Please select amount and coupon");
        return;
      }

      const response = await axios.post(`${baseUrl}/api/admin/validateCoupon`,
        {
          coupon_code: coupon,
          rechargeAmount: selectedAmount
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      setCouponApply(response.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to apply coupon");
    }
  };

  return (
    <div className="bg-[#EEEEEE] min-h-screen  lg:py-10 px-3  flex items-center justify-center">
      <div className="max-w-lg w-full bg-white md:rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl">
        {/* Header with improved gradient */}
        <div className="bg-[#0446DB] p-2 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

          <div className="relative z-10">
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-3xl font-bold">Recharge</h1>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>
            <p className="text-blue-100 opacity-90">Add funds to your wallet</p>
          </div>
        </div>

        {/* Recharge Content */}
        <div className="p-8">
          <div className="space-y-6">
            <div className="text-center mb-2">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">Recharge Your Wallet</h2>
              <p className="text-gray-600">Choose an amount to add to your wallet</p>
            </div>

            {/* Amount Selection Grid */}
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Quick Select Amount
              </label>
              <div className="grid grid-cols-3 gap-3">
                {rechargeAmounts.map(amount => (
                  <button
                    key={amount}
                    className={`py-2 rounded border-2 transition-all duration-200 transform hover:scale-105 hover:shadow-md ${selectedAmount === amount && !customAmount
                      ? 'border-[rgb(86,78,193)] bg-gradient-to-br from-blue-50 to-blue-100 text-[rgb(86,78,193)] shadow-md scale-105'
                      : 'border-gray-200 hover:border-blue-300 bg-white text-gray-700'
                      }`}
                    onClick={() => handleAmountSelect(amount)}
                  >
                    <div className="text-lg">{formatCurrency(amount)}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount Input */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                Or Enter Custom Amount
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">₹</span>
                <input
                  type="number"
                  disabled={CouponApply.success ? true : false}
                  className={`w-full py-2 px-3 pl-10 border-2 border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${CouponApply.success ? "bg-gray-200" : ""}`}
                  placeholder="Enter custom amount"
                  value={customAmount || selectedAmount || ''}
                  onChange={handleCustomAmountChange}
                  min="1"
                />
              </div>
              <span className="text-green-500 text-sm font-semibold">
                {CouponApply.success
                  ? `Coupon applied successfully! You saved ₹${CouponApply.discountAmount}`
                  : ""}
              </span>
              
              {/* Coupon Input */}
              <div className="relative">
                <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">Coupon</label>
                <div className='flex gap-1'>
                  <input
                    type="text"
                    className="w-full py-2 px-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                    placeholder="Enter coupon"
                    onChange={(e) => setcoupon(e.target.value)}
                    min="1"
                  />
                  <button
                    disabled={coupon ? false : true}
                    onClick={() => applyCoupon()}
                    className={`${coupon ? 'bg-[#0446DB]' : 'bg-gray-500'} cursor-pointer shadow-lg hover:shadow-xl  px-3 rounded text-white transition-all duration-200`}>
                    Apply
                  </button>
                </div>
              </div>
            </div>

            {/* Selected Amount Display */}
            {(selectedAmount > 0) && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-700">Total Amount:</span>
                  <span className="text-2xl font-bold text-green-600">
                    {formatCurrency(selectedAmount)}
                  </span>
                </div>
              </div>
            )}

            {/* Pay Button */}
            {!selectedAmount ? (
              <div
                className={`w-full text-center py-2 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 bg-gray-300 cursor-not-allowed`}
              >
                Pay
              </div>
            ) : (
              <GenerateUPI
                text={`Pay ${formatCurrency(selectedAmount)} →`}
                disabled={!selectedAmount || selectedAmount === 0}
                amount={selectedAmount}
                coupon={coupon ? coupon : ""}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 bg-[rgb(86,78,193)] shadow-lg hover:shadow-xl text-white`}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Recharge;