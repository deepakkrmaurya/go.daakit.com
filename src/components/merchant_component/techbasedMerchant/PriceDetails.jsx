
import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../../Loader";
const baseURL = import.meta.env.VITE_BASE_URL;
function PricingDetails() {

    const [loading, setLoading] = useState(false);

    const [pricing, setPricing] = useState([]);


    const [editingData, setEditingData] = useState({});
    const [originalData, setOriginalData] = useState({});



    const getAllPlans = async () => {
        setLoading(true);

        try {
            const res = await axios.get(`${baseURL}/api/merchant/getMerchantPlanDetails`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            console.log(res.data?.data)
            setPricing(res.data?.data)
            
            setLoading(false);
        } catch (error) {

            toast.error("Failed to fetch plans");
        }finally{
            setLoading(false);
        }
    };






    const isFieldChanged = (index, field) => {
        return editingData[index]?.[field] !== originalData[index]?.[field];
    };


    useEffect(() => {
        // getDefaultPricing();
        getAllPlans();
        // getVendorPricing()
    }, []);

    return (
        <>
            {loading && <Loader />}
            <div className="bg-gray-100 dark:bg-gray-900 min-h-screen w-full">
                {/* Heading Strip */}
                <div className="relative z-0 mb-6 bg-[rgb(85,77,192)] dark:bg-gray-900 py-[20px] shadow-md h-20 px-[24px]">
                    <div className="md:flex justify-between items-center space-y-1">
                        <div>
                            <h1 className="text-xl font-bold text-white">Pricing Plans</h1>
                            {/* <p className="text-indigo-200 mt-1">Manage your pricing strategies</p> */}
                        </div>

                    </div>
                </div>

                <div className="px-2  z-99">
                    <div className="-mt-10  relative">
                        <div className="bg-white dark:bg-gray-900 rounded shadow overflow-hidden">


                            <div className="py-5  px-5">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full border-collapse">
                                        <thead>
                                            <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200">
                                                <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                                    Slab
                                                </th>
                                                <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                                    Additional
                                                </th>
                                                <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                                    SDD
                                                </th>
                                                <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                                    NDD
                                                </th>
                                                <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                                    Turant
                                                </th>
                                                <th className="py-4 px-4 whitespace-nowrap text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                                    Additional SDD
                                                </th>
                                                <th className="py-4 px-4 whitespace-nowrap text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                                    Additional NDD
                                                </th>
                                                <th className="py-4 px-4 whitespace-nowrap text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                                    Additional Turant
                                                </th>
                                                <th className="py-4 px-4 whitespace-nowrap text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                                    COD Percentage
                                                </th>
                                                <th className="py-4 px-4 whitespace-nowrap text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                                                    Minimum COD
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {pricing.map((item, index) => {
                                                return (
                                                    <tr key={index} className={`hover:bg-indigo-50 dark:border-blue-400 dark:hover:bg-gray-800 border dark:bg-gray-900 transition-colors duration-150 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>

                                                        <td className="py-4 px-4 dark:text-white text-gray-600">
                                                            <input
                                                                type="text"
                                                                readOnly
                                                                value={item?.slab || ''}
                                                                className={`w-20 border dark:bg-gray-800 px-2 py-1 rounded ${isFieldChanged(index, 'sdd')
                                                                    ? 'border-green-500 bg-green-50'
                                                                    : 'border-gray-300'
                                                                    }`}
                                                            />
                                                        </td>
                                                        <td className="py-4 px-4 dark:text-white text-gray-600">
                                                            <input
                                                                type="text"
                                                                value={item?.additional || ''}
                                                               
                                                                className={`w-20 border dark:bg-gray-800 px-2 py-1 rounded ${isFieldChanged(index, 'sdd')
                                                                    ? 'border-green-500 bg-green-50'
                                                                    : 'border-gray-300'
                                                                    }`}
                                                            />
                                                        </td>
                                                        <td className="py-4 px-4 dark:text-white text-gray-600">
                                                            <input
                                                                type="text"
                                                                value={item?.sdd || ''}
                                                                className={`w-20 border dark:bg-gray-800 px-2 py-1 rounded ${isFieldChanged(index, 'sdd')
                                                                    ? 'border-green-500 bg-green-50'
                                                                    : 'border-gray-300'
                                                                    }`}
                                                            />
                                                        </td>
                                                        <td className="py-4 px-4 dark:text-white text-gray-600">
                                                            <input
                                                                type="text"
                                                                value={item?.ndd || ''}
                                                                className={`w-20 border dark:bg-gray-800 px-2 py-1 rounded ${isFieldChanged(index, 'sdd')
                                                                    ? 'border-green-500 bg-green-50'
                                                                    : 'border-gray-300'
                                                                    }`}
                                                            />
                                                        </td>
                                                        <td className="py-4 px-4 dark:text-white text-gray-600">
                                                            <input
                                                                type="text"
                                                                value={item?.turant || ''}
                                                                className={`w-20 border dark:bg-gray-800 px-2 py-1 rounded ${isFieldChanged(index, 'sdd')
                                                                    ? 'border-green-500 bg-green-50'
                                                                    : 'border-gray-300'
                                                                    }`}
                                                            />
                                                        </td>
                                                        <td className="py-4 px-4 dark:text-white text-gray-600">
                                                            <input
                                                                type="text"
                                                                value={item?.additional_sdd || ''}
                                                                className={`w-20 border dark:bg-gray-800 px-2 py-1 rounded ${isFieldChanged(index, 'sdd')
                                                                    ? 'border-green-500 bg-green-50'
                                                                    : 'border-gray-300'
                                                                    }`}
                                                            />
                                                        </td>
                                                        <td className="py-4 px-4 dark:text-white text-gray-600">
                                                            <input
                                                                type="text"
                                                                value={item?.additional_ndd || ''}
                                                                className={`w-20 border dark:bg-gray-800 px-2 py-1 rounded ${isFieldChanged(index, 'sdd')
                                                                    ? 'border-green-500 bg-green-50'
                                                                    : 'border-gray-300'
                                                                    }`}
                                                            />
                                                        </td>
                                                        <td className="py-4 px-4 dark:text-white text-gray-600">
                                                            <input
                                                                type="text"
                                                                value={item?.additional_turant || ''}
                                                                className={`w-20 border dark:bg-gray-800 px-2 py-1 rounded ${isFieldChanged(index, 'sdd')
                                                                    ? 'border-green-500 bg-green-50'
                                                                    : 'border-gray-300'
                                                                    }`}
                                                            />
                                                        </td>
                                                        <td className="py-4 px-4 dark:text-white text-gray-600">
                                                            <input
                                                                type="text"
                                                                value={item?.cod_percentage || ''}
                                                                className={`w-20 border dark:bg-gray-800 px-2 py-1 rounded ${isFieldChanged(index, 'sdd')
                                                                    ? 'border-green-500 bg-green-50'
                                                                    : 'border-gray-300'
                                                                    }`}
                                                            />
                                                        </td>
                                                        <td className="py-4 px-4 dark:text-white text-gray-600">
                                                            <input
                                                                type="text"
                                                                value={item?.minimum_cod || ''}
                                                                className={`w-20 border dark:bg-gray-800 px-2 py-1 rounded ${isFieldChanged(index, 'sdd')
                                                                    ? 'border-green-500 bg-green-50'
                                                                    : 'border-gray-300'
                                                                    }`}
                                                            />
                                                        </td>
                                                       
                                                        
                                                        
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </>
    );
}

export default PricingDetails;