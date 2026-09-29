import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../../../Loader";
import AxiosInstance from "../../../../Helper/axiosInstance";
import { Loader2 } from "lucide-react";
function PricingDetails() {
  const [loading, setLoading] = useState(false);

  const [pricing, setPricing] = useState([]);

  const [editingData, setEditingData] = useState({});
  const [originalData, setOriginalData] = useState({});

  const getAllPlans = async () => {
    setLoading(true);

    try {
      const res = await AxiosInstance.get("/api/tech-merchant/getMerchantPlanDetails");
      setPricing(res.data?.data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch plans");
    } finally {
        setLoading(false);
    }
  };

  const isFieldChanged = (index, field) => {
    return editingData[index]?.[field] !== originalData[index]?.[field];
  };

  useEffect(() => {
    getAllPlans();
  }, []);

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
        loadingPage ? (
           <div className=" w-full h-[90vh] flex justify-center items-center">
                  <div>
                    <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                    <p className="mt-2"> Loading Pricing Plan Details...</p>
                  </div>
                </div>
        ):(

      <div className=" dark:bg-neutral-900/50 min-h-screen w-full">
        {/* Heading Strip */}
        <div className="relative z-0 mb-2  dark:bg-neutral-800 py-2  px-[24px]">
          <div className="md:flex justify-between items-center space-y-1">
            <div>
              <h1 className="text-2xl font-bold dark:text-white">
                Pricing Plans
              </h1>
              <p className="dark:text-indigo-200 mt-1">
                Manage your pricing strategies
              </p>
            </div>
          </div>
        </div>

        <div className="  z-99">
          <div className=" relative">
            <div className="bg-white dark:bg-neutral-900 rounded shadow overflow-hidden">
              <div className=" ">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-neutral-800 border-b border-gray-200">
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
                        
                        <th className="py-4 px-4 whitespace-nowrap text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                          Additional SDD
                        </th>
                        <th className="py-4 px-4 whitespace-nowrap text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                          Additional NDD
                        </th>
                       
                        <th className="py-4 px-4 whitespace-nowrap text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                          COD Percentage
                        </th>
                      
                        <th className="py-4 px-4 whitespace-nowrap text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                          Minimum COD
                        </th>
                      </tr>
                    </thead>

                    <tbody className=" w-full ">
                      {loading ? (
                        <>
                          <tr>
                            <td colSpan={10} className="h-[200px] w-full p-0">
                              <div className="flex h-full w-full items-center justify-center">
                                <div className="flex flex-col items-center justify-center">
                                  <Loader2 className="h-8 w-8 animate-spin " />

                                  <p className="mt-2 text-sm font-medium text-gray-600 dark:text-neutral-300">
                                    Loading pricing...
                                  </p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        </>
                      ) : (
                        pricing.map((item, index) => {
                          return (
                            <tr
                              key={index}
                              className={`hover:bg-indigo-50 dark:border-blue-400 dark:hover:bg-gray-800 border dark:bg-neutral-900/50 transition-colors duration-150 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                            >
                              <td className="py-4 px-4 dark:text-white text-gray-600">
                                <input
                                  type="text"
                                  readOnly
                                  value={item?.slab || ""}
                                  className={`w-20 border dark:bg-gray-800 px-2 py-1 rounded ${
                                    isFieldChanged(index, "sdd")
                                      ? "border-green-500 bg-green-50"
                                      : "border-gray-300"
                                  }`}
                                />
                              </td>
                              <td className="py-4 px-4 dark:text-white text-gray-600">
                                <input
                                  type="text"
                                  value={item?.additional || ""}
                                  className={`w-20 border dark:bg-gray-800 px-2 py-1 rounded ${
                                    isFieldChanged(index, "sdd")
                                      ? "border-green-500 bg-green-50"
                                      : "border-gray-300"
                                  }`}
                                />
                              </td>
                              <td className="py-4 px-4 dark:text-white text-gray-600">
                                <input
                                  type="text"
                                  value={item?.sdd || ""}
                                  className={`w-20 border dark:bg-gray-800 px-2 py-1 rounded ${
                                    isFieldChanged(index, "sdd")
                                      ? "border-green-500 bg-green-50"
                                      : "border-gray-300"
                                  }`}
                                />
                              </td>
                              <td className="py-4 px-4 dark:text-white text-gray-600">
                                <input
                                  type="text"
                                  value={item?.ndd || ""}
                                  className={`w-20 border dark:bg-gray-800 px-2 py-1 rounded ${
                                    isFieldChanged(index, "sdd")
                                      ? "border-green-500 bg-green-50"
                                      : "border-gray-300"
                                  }`}
                                />
                              </td>
                              
                              <td className="py-4 px-4 dark:text-white text-gray-600">
                                <input
                                  type="text"
                                  value={item?.additional_sdd || ""}
                                  className={`w-20 border dark:bg-gray-800 px-2 py-1 rounded ${
                                    isFieldChanged(index, "sdd")
                                      ? "border-green-500 bg-green-50"
                                      : "border-gray-300"
                                  }`}
                                />
                              </td>
                              <td className="py-4 px-4 dark:text-white text-gray-600">
                                <input
                                  type="text"
                                  value={item?.additional_ndd || ""}
                                  className={`w-20 border dark:bg-gray-800 px-2 py-1 rounded ${
                                    isFieldChanged(index, "sdd")
                                      ? "border-green-500 bg-green-50"
                                      : "border-gray-300"
                                  }`}
                                />
                              </td>
                              
                              <td className="py-4 px-4 dark:text-white text-gray-600">
                                <input
                                  type="text"
                                  value={item?.cod_percentage || ""}
                                  className={`w-20 border dark:bg-gray-800 px-2 py-1 rounded ${
                                    isFieldChanged(index, "sdd")
                                      ? "border-green-500 bg-green-50"
                                      : "border-gray-300"
                                  }`}
                                />
                              </td>
                              
                              <td className="py-4 px-4 dark:text-white text-gray-600">
                                <input
                                  type="text"
                                  value={item?.minimum_cod || ""}
                                  className={`w-20 border dark:bg-gray-800 px-2 py-1 rounded ${
                                    isFieldChanged(index, "sdd")
                                      ? "border-green-500 bg-green-50"
                                      : "border-gray-300"
                                  }`}
                                />
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
        )
    }
    </>
  );
}

export default PricingDetails;
