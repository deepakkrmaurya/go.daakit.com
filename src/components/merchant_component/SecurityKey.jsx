import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
const baseURL = import.meta.env.VITE_BASE_URL;
function SecurityKey() {
    const [profile, setProfile] = useState({});
    const maskSensitiveData = (data) => {
        if (!data) return '';
        if (data.length <= 16) return data;
        return data.substring(0, 8) + '*' + data.substring(data.length - 8);
    };
      const getMerchantProfile = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/merchant/getMerchantProfile`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setProfile(res.data.data || {});
    } catch (err) {
      console.error('profile', err);
    }
  };
  const handleCopy = (text) => {
      navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    };

  useEffect(() => {
    getMerchantProfile();
  }, []);
    return (
        <div className="bg-[#EEEEEE] min-h-screen w-full">
            {/* Heading Strip */}
            <div className="relative z-0 mb-6 bg-[#0446DB] py-[33px] shadow-md h-38 px-[24px]">
                <div className="flex flex-wrap items-center justify-between w-full">
                    {/* Heading */}
                    <h1 className="text-2xl text-white">Security key</h1>
                </div>
            </div>
            <div className="px-2 z-99 ">
                <div className="-mt-16 md:-mt-24 relative ">
                    <div className="space-y-6">
                        <div className="space-y-4 bg-white px-4 py-6 rounded">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Merchant Key</label>
                                <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
                                    <div className="flex-1 bg-gray-50 rounded-lg px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 overflow-x-auto">
                                        <code className="text-xs sm:text-sm font-mono text-gray-900 whitespace-nowrap">
                                            {maskSensitiveData(profile.merchant_key)}
                                        </code>
                                    </div>
                                    <button
                                        onClick={() => handleCopy(profile.merchant_key)}
                                        className="px-4 py-2 cursor-pointer bg-[#0446DB] text-white rounded-lg  transition-colors text-sm sm:text-base whitespace-nowrap"
                                    >
                                        Copy
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Secret Key</label>
                                <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
                                    <div className="flex-1 bg-gray-50 rounded-lg px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 overflow-x-auto">
                                        <code className="text-xs sm:text-sm font-mono text-gray-900 whitespace-nowrap">
                                            {maskSensitiveData(profile.secret_key)}
                                        </code>
                                    </div>
                                    <button
                                        onClick={() => handleCopy(profile.secret_key)}
                                        className="px-4 cursor-pointer  py-2 bg-[#0446DB] text-white rounded-lg  transition-colors text-sm sm:text-base whitespace-nowrap"
                                    >
                                        Copy
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SecurityKey