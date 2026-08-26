
import React, { useEffect, useState } from 'react';
import GenerateUPI from '../../../utils/GenerateUPI';
import axios from 'axios';
import { toast } from 'react-toastify';
import GenerateSubscriptionUPI from './GenerateSubscriptionUPI';
import { jwtDecode } from 'jwt-decode';

const baseUrl = import.meta.env.VITE_BASE_URL;

function Recharge() {
  const token = localStorage.getItem("token");
  const decoded = jwtDecode(token);
  const [activeTab, setActiveTab] = useState('recharge');
  const [CouponApply, setCouponApply] = useState({});
  const [selectedAmount, setSelectedAmount] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [customAmount, setCustomAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [coupon, setcoupon] = useState(null);

  const rechargeAmounts = [100, 200, 500, 1000, 2000, 5000];

  const getSubscriptionPlan = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${baseUrl}/api/techbasedmerchant/getAllSubscriptionPlans`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setSubscriptionPlans(response.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getSubscriptionPlan();
  }, []);

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
        toast.error("please select amount and coupon")
        return
      }

      const response = await axios.post(`${baseUrl}/api/coupon/validateCoupon`,
        {
          coupon_code: coupon,
          rechargeAmount: selectedAmount
        },
        {

          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      setCouponApply(response.data)

    } catch (error) {

      toast.error(error.response.data.message)
    }
  }

  return (
    <div className="bg-[#EEEEEE] h-[90vh] flex items-center justify-center">
      <div className="max-w-lg w-full bg-white md:rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl">
        {/* Header with improved gradient */}
        <div className="bg-[#0446DB] p-2 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

          <div className="relative z-10">
            <div className="flex justify-between items-center mb-2">
              <h1 className="text-3xl font-bold">{activeTab}</h1>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>
            <p className="text-blue-100 opacity-90">Add funds to your wallet {decoded.tech_based === "1" ? "or choose a subscription plan" : ""}</p>
          </div>
        </div>

        {/* Enhanced Tabs */}
        <div className="flex border-b bg-gray-50/50">
          <button
            className={`flex-1 py-5 font-semibold text-center transition-all duration-300 relative ${activeTab === 'recharge'
              ? 'text-[#0446DB] bg-white shadow-sm'
              : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
              }`}
            onClick={() => setActiveTab('recharge')}
          >
            <span className="relative z-10">💳 Recharge</span>
            {activeTab === 'recharge' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#0446DB]"></div>
            )}
          </button>
          {
            decoded.tech_based === "1" && (
              <button
                className={`flex-1 py-5 font-semibold text-center transition-all duration-300 relative ${activeTab === 'subscription'
                  ? 'text-[#0446DB] bg-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                  }`}
                onClick={() => setActiveTab('subscription')}
              >
                <span className="relative z-10">⭐ Subscription</span>
                {activeTab === 'subscription' && (
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#0446DB]"></div>
                )}
              </button>
            )
          }

        </div>

        {/* Tab Content */}
        <div className="p-8">
          {activeTab === 'recharge' ? (
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
                        ? 'border-[#0446DB] bg-gradient-to-br from-blue-50 to-blue-100 text-[#0446DB] shadow-md scale-105'
                        : 'border-gray-200 hover:border-blue-300 bg-white text-gray-700'
                        }`}
                      onClick={() => handleAmountSelect(amount)}
                    >
                      <div className=" text-lg">{formatCurrency(amount)}</div>
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
                    className={`w-full p-4 pl-10 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${CouponApply.success ? "bg-gray-200" : ""}`}
                    placeholder="Enter custom amount"
                    value={customAmount || selectedAmount || ''}
                    onChange={handleCustomAmountChange}
                    min="1"
                  />

                </div>
                <span className="text-green-500 text-sm font-semibold ">
                  {CouponApply.success
                    ? `Coupon applied successfully! You saved ₹${CouponApply.discountAmount}`
                    : ""}
                </span>
                <div className="relative">
                  <label htmlFor="" className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">Coupon</label>
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold"></span>
                  <div className=' flex gap-1'>
                    <input
                      type="text"
                      className="w-full p-4  border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                      placeholder="Enter coupon"
                      // value={customAmount}
                      onChange={(e) => setcoupon(e.target.value)}
                      min="1"
                    />
                    <button
                      disabled={coupon ? false : true}
                      onClick={() => applyCoupon()}
                      className={`${coupon ? 'bg-[#0446DB] ' : 'bg-gray-500'} cursor-pointer shadow-lg hover:shadow-xl px-4 rounded text-white`}>
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

              {
                !selectedAmount ? (
                  <div
                    className={`w-full text-center py-2 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${!selectedAmount || selectedAmount === 0
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-[#0446DB] shadow-lg hover:shadow-xl'
                      }`}
                  >
                    Pay
                  </div>
                ) : (
                  <GenerateUPI
                    text={!selectedAmount || selectedAmount === 0 ? 'Select Amount to Pay' : `Pay ${formatCurrency(selectedAmount)} →`}
                    disabled={!selectedAmount || selectedAmount === 0}
                    amount={selectedAmount}
                    coupon={coupon?coupon:""}
                    className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${!selectedAmount || selectedAmount === 0
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-[#0446DB] shadow-lg hover:shadow-xl'
                      }`}
                  >
                  </GenerateUPI>
                )
              }

            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center mb-2">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Choose a Subscription Plan</h2>
                <p className="text-gray-600">Unlock premium features with our subscription plans</p>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0446DB]"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {subscriptionPlans?.map(plan => (
                    <div
                      key={plan.id}
                      className={`p-2 border-2 rounded-2xl cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-lg ${selectedPlan?.id === plan.id
                        ? 'border-[#0446DB] bg-gradient-to-br from-blue-50 to-indigo-50 shadow-md scale-105'
                        : 'border-gray-200 hover:border-blue-300 bg-white'
                        }`}
                      onClick={() => setSelectedPlan(plan)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-xl text-gray-800">{plan.plan_name}</h3>
                            {selectedPlan?.id === plan.id && (
                              <span className="bg-[#0446DB] text-white text-xs px-2 py-1 rounded-full">Selected</span>
                            )}
                          </div>
                          <p className="text-[#0446DB] font-medium bg-blue-50 px-3 py-1 rounded-full inline-block shadow-sm">
                            {plan.validity} Days
                          </p>

                          {plan.description && (
                            <p className="text-gray-500 text-sm mt-2">{plan.description}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-[#0446DB]">{formatCurrency(plan.amount)}</p>
                          {plan.original_amount && plan.original_amount > plan.amount && (
                            <p className="text-sm text-gray-500 line-through">
                              {formatCurrency(plan.original_amount)}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Plan Features */}
                      {plan.features && Array.isArray(plan.features) && (
                        <ul className="grid grid-cols-2 gap-1 text-sm text-gray-600">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center space-x-2">
                              <span className="text-green-500">✓</span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Subscribe Button */}
              {
                !selectedPlan ? (
                  <div
                    className={`w-full text-center py-2 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${!selectedPlan
                      ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                      : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl'
                      }`}
                  >
                    Subscribe to Plan
                  </div>
                ) : (
                  <GenerateSubscriptionUPI
                    plane={`Subscribe to ${selectedPlan?.plan_name || 'Plan'}`}
                    plan_id={selectedPlan?.id}
                    amount={selectedPlan?.amount}
                    disabled={!selectedPlan}

                  >
                  </GenerateSubscriptionUPI>
                )
              }


            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Recharge;