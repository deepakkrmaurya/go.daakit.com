// import React, { useState } from 'react';
// import GenerateUPI from '../../utils/GenerateUPI';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { jwtDecode } from 'jwt-decode';

// const baseUrl = import.meta.env.VITE_BASE_URL;

// function Recharge() {
//   const token = localStorage.getItem("token");
//   const decoded = jwtDecode(token);
//   const [CouponApply, setCouponApply] = useState({});
//   const [selectedAmount, setSelectedAmount] = useState('');
//   const [customAmount, setCustomAmount] = useState('');
//   const [coupon, setcoupon] = useState(null);

//   const rechargeAmounts = [100, 200, 500, 1000, 2000, 5000];

//   const handleAmountSelect = (amount) => {
//     setSelectedAmount(amount);
//     setCustomAmount('');
//   };

//   const handleCustomAmountChange = (e) => {
//     const value = e.target.value;
//     setCustomAmount(value);
//     setSelectedAmount(value ? parseInt(value) : 0);
//   };

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       minimumFractionDigits: 0,
//     }).format(amount);
//   };

//   const applyCoupon = async () => {
//     try {
//       if (!selectedAmount || !coupon) {
//         toast.error("Please select amount and coupon");
//         return;
//       }

//       const response = await axios.post(`${baseUrl}/api/admin/validateCoupon`,
//         {
//           coupon_code: coupon,
//           rechargeAmount: selectedAmount
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         });
//       setCouponApply(response.data);
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Failed to apply coupon");
//     }
//   };

//   return (
//     <div className="bg-[#EEEEEE] min-h-screen  lg:py-10 px-3  flex items-center justify-center">
//       <div className="max-w-lg w-full bg-white md:rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 hover:shadow-3xl">
//         {/* Header with improved gradient */}
//         <div className="bg-[#0446DB] p-2 text-white relative overflow-hidden">
//           <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
//           <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

//           <div className="relative z-10">
//             <div className="flex justify-between items-center mb-2">
//               <h1 className="text-3xl font-bold">Recharge</h1>
//               <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
//                 <span className="text-2xl">💰</span>
//               </div>
//             </div>
//             <p className="text-blue-100 opacity-90">Add funds to your wallet</p>
//           </div>
//         </div>

//         {/* Recharge Content */}
//         <div className="p-8">
//           <div className="space-y-6">
//             <div className="text-center mb-2">
//               <h2 className="text-2xl font-semibold text-gray-800 mb-2">Recharge Your Wallet</h2>
//               <p className="text-gray-600">Choose an amount to add to your wallet</p>
//             </div>

//             {/* Amount Selection Grid */}
//             <div className="space-y-4">
//               <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
//                 Quick Select Amount
//               </label>
//               <div className="grid grid-cols-3 gap-3">
//                 {rechargeAmounts.map(amount => (
//                   <button
//                     key={amount}
//                     className={`py-2 rounded border-2 transition-all duration-200 transform hover:scale-105 hover:shadow-md ${selectedAmount === amount && !customAmount
//                       ? 'border-[rgb(86,78,193)] bg-gradient-to-br from-blue-50 to-blue-100 text-[rgb(86,78,193)] shadow-md scale-105'
//                       : 'border-gray-200 hover:border-blue-300 bg-white text-gray-700'
//                       }`}
//                     onClick={() => handleAmountSelect(amount)}
//                   >
//                     <div className="text-lg">{formatCurrency(amount)}</div>
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Custom Amount Input */}
//             <div className="space-y-3">
//               <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
//                 Or Enter Custom Amount
//               </label>
//               <div className="relative">
//                 <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 font-bold">₹</span>
//                 <input
//                   type="number"
//                   disabled={CouponApply.success ? true : false}
//                   className={`w-full py-2 px-3 pl-10 border-2 border-gray-200 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${CouponApply.success ? "bg-gray-200" : ""}`}
//                   placeholder="Enter custom amount"
//                   value={customAmount || selectedAmount || ''}
//                   onChange={handleCustomAmountChange}
//                   min="1"
//                 />
//               </div>
//               <span className="text-green-500 text-sm font-semibold">
//                 {CouponApply.success
//                   ? `Coupon applied successfully! You saved ₹${CouponApply.discountAmount}`
//                   : ""}
//               </span>
              
//               {/* Coupon Input */}
//               <div className="relative">
//                 <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">Coupon</label>
//                 <div className='flex gap-1'>
//                   <input
//                     type="text"
//                     className="w-full py-2 px-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
//                     placeholder="Enter coupon"
//                     onChange={(e) => setcoupon(e.target.value)}
//                     min="1"
//                   />
//                   <button
//                     disabled={coupon ? false : true}
//                     onClick={() => applyCoupon()}
//                     className={`${coupon ? 'bg-[#0446DB]' : 'bg-gray-500'} cursor-pointer shadow-lg hover:shadow-xl  px-3 rounded text-white transition-all duration-200`}>
//                     Apply
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Selected Amount Display */}
//             {(selectedAmount > 0) && (
//               <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
//                 <div className="flex justify-between items-center">
//                   <span className="font-semibold text-gray-700">Total Amount:</span>
//                   <span className="text-2xl font-bold text-green-600">
//                     {formatCurrency(selectedAmount)}
//                   </span>
//                 </div>
//               </div>
//             )}

//             {/* Pay Button */}
//             {!selectedAmount ? (
//               <div
//                 className={`w-full text-center py-2 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 bg-gray-300 cursor-not-allowed`}
//               >
//                 Pay
//               </div>
//             ) : (
//               <GenerateUPI
//                 text={`Pay ${formatCurrency(selectedAmount)} →`}
//                 disabled={!selectedAmount || selectedAmount === 0}
//                 amount={selectedAmount}
//                 coupon={coupon ? coupon : ""}
//                 className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 bg-[rgb(86,78,193)] shadow-lg hover:shadow-xl text-white`}
//               />
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Recharge;



import React, { useState } from "react";
import GenerateUPI from "../../utils/GenerateUPI";
import axios from "axios";
import { toast } from "react-toastify";
import { Wallet, BadgePercent, IndianRupee, CheckCircle2 } from "lucide-react";

const baseUrl = import.meta.env.VITE_BASE_URL;

function Recharge() {
  const [CouponApply, setCouponApply] = useState({});
  const [selectedAmount, setSelectedAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [coupon, setCoupon] = useState("");

  const rechargeAmounts = [100, 200, 500, 1000, 2000, 5000];

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount("");

    if (CouponApply?.success) {
      setCouponApply({});
    }
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value;

    setCustomAmount(value);
    setSelectedAmount(value ? Number(value) : 0);

    if (CouponApply?.success) {
      setCouponApply({});
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  const applyCoupon = async () => {
    try {
      if (!selectedAmount) {
        toast.error("Please select recharge amount");
        return;
      }

      if (!coupon.trim()) {
        toast.error("Please enter coupon code");
        return;
      }

      const response = await axios.post(
        `${baseUrl}/api/admin/validateCoupon`,
        {
          coupon_code: coupon.trim(),
          rechargeAmount: selectedAmount,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setCouponApply(response.data);

      if (response.data?.success) {
        toast.success("Coupon applied successfully");
      }
    } catch (error) {
      setCouponApply({});

      toast.error(
        error?.response?.data?.message || "Failed to apply coupon"
      );
    }
  };

  const discount = Number(CouponApply?.discountAmount || 0);

  const payableAmount = Math.max(
    Number(selectedAmount || 0) - discount,
    0
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] px-4 py-8 md:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">

        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-slate-900 md:text-2xl">
            Recharge Wallet
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Add funds to your wallet using UPI payment.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">

          {/* LEFT SIDE */}
          <div className="rounded-xl border border-slate-200 bg-white">

            {/* Card Header */}
            <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4 md:px-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                <Wallet className="h-5 w-5 text-[#0446DB]" />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Add Money
                </h2>

                <p className="text-xs text-slate-500">
                  Select a predefined amount or enter your own.
                </p>
              </div>
            </div>

            <div className="space-y-7 p-5 md:p-6">

              {/* Quick Amount */}
              <div>
                <label className="mb-3 block text-sm font-medium text-slate-700">
                  Recharge amount
                </label>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {rechargeAmounts.map((amount) => {
                    const active =
                      Number(selectedAmount) === amount &&
                      !customAmount;

                    return (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => handleAmountSelect(amount)}
                        className={`
                          relative h-12 rounded-lg border
                          text-sm font-semibold
                          transition-all duration-150
                          ${
                            active
                              ? "border-[#0446DB] bg-blue-50 text-[#0446DB] ring-1 ring-[#0446DB]"
                              : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                          }
                        `}
                      >
                        {formatCurrency(amount)}

                        {active && (
                          <CheckCircle2 className="absolute right-2 top-2 h-4 w-4 text-[#0446DB]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Amount */}
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Custom amount
                </label>

                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                  <input
                    type="number"
                    min="1"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                    placeholder="Enter recharge amount"
                    className="
                      h-11 w-full rounded-lg
                      border border-slate-200
                      bg-white pl-10 pr-4
                      text-sm text-slate-900
                      outline-none
                      placeholder:text-slate-400
                      focus:border-[#0446DB]
                      focus:ring-2 focus:ring-blue-100
                    "
                  />
                </div>
              </div>

              {/* Coupon */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-medium text-slate-700">
                    Coupon code
                  </label>

                  <span className="text-xs text-slate-400">
                    Optional
                  </span>
                </div>

                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <BadgePercent className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                    <input
                      type="text"
                      value={coupon}
                      disabled={CouponApply?.success}
                      onChange={(e) =>
                        setCoupon(e.target.value.toUpperCase())
                      }
                      placeholder="Enter coupon"
                      className="
                        h-11 w-full rounded-lg
                        border border-slate-200
                        bg-white pl-10 pr-4
                        text-sm uppercase text-slate-900
                        outline-none
                        placeholder:normal-case
                        placeholder:text-slate-400
                        focus:border-[#0446DB]
                        focus:ring-2 focus:ring-blue-100
                        disabled:bg-slate-50
                      "
                    />
                  </div>

                  <button
                    type="button"
                    onClick={applyCoupon}
                    disabled={!coupon.trim() || CouponApply?.success}
                    className="
                      h-11 rounded-lg
                      bg-slate-900 px-5
                      text-sm font-medium text-white
                      transition
                      hover:bg-slate-800
                      disabled:cursor-not-allowed
                      disabled:bg-slate-300
                    "
                  >
                    {CouponApply?.success ? "Applied" : "Apply"}
                  </button>
                </div>

                {CouponApply?.success && (
                  <div className="mt-3 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />

                    <p className="text-xs font-medium text-emerald-700">
                      Coupon applied successfully. You saved{" "}
                      {formatCurrency(discount)}.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE SUMMARY */}
          <div className="h-fit rounded-xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 px-5 py-4">
              <h2 className="text-sm font-semibold text-slate-900">
                Payment Summary
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Review recharge details before payment.
              </p>
            </div>

            <div className="p-5">

              {Number(selectedAmount) > 0 ? (
                <>
                  <div className="space-y-4">

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">
                        Recharge amount
                      </span>

                      <span className="text-sm font-medium text-slate-900">
                        {formatCurrency(selectedAmount)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">
                        Extra Credit
                      </span>

                      <span
                        className={`text-sm font-medium ${
                          discount > 0
                            ? "text-emerald-600"
                            : "text-slate-500"
                        }`}
                      >
                        {discount > 0
                          ? `+ ${formatCurrency(discount)}`
                          : formatCurrency(0)}
                      </span>
                    </div>
                    

                    <div className="border-t border-dashed border-slate-200" />

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-500">
                        Total
                      </span>

                      <span
                        className={`text-sm font-medium text-slate-500`}
                      >
{formatCurrency(Number(selectedAmount || 0) + Number(discount || 0))}
                      </span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <GenerateUPI
                      text={`Pay ${formatCurrency(selectedAmount)}`}
                      disabled={
                        !selectedAmount ||
                        Number(selectedAmount) <= 0
                      }
                      amount={selectedAmount}
                      coupon={coupon || ""}
                      className="
                        flex h-11 w-full
                        items-center justify-center
                        rounded-lg bg-[#0446DB]
                        text-sm font-semibold text-white
                        transition
                        hover:bg-[#0339B8]
                        focus:ring-2
                        focus:ring-blue-200
                      "
                    />
                  </div>

                  <p className="mt-3 text-center text-[11px] text-slate-400">
                    Secure payment powered through UPI
                  </p>
                </>
              ) : (
                <div className="flex min-h-[210px] flex-col items-center justify-center text-center">
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-slate-100">
                    <IndianRupee className="h-5 w-5 text-slate-400" />
                  </div>

                  <p className="text-sm font-medium text-slate-700">
                    No amount selected
                  </p>

                  <p className="mt-1 max-w-[220px] text-xs leading-5 text-slate-400">
                    Select or enter an amount to see your payment summary.
                  </p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Recharge;