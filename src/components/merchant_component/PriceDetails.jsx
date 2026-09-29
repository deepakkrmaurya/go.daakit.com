
// import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import Loader from "../Loader";
// import { Link, useNavigate } from "react-router-dom";

// const baseURL = import.meta.env.VITE_BASE_URL;

// function PricingDetails() {

//     const [loading, setLoading] = useState(false);

//     const [pricing, setPricing] = useState([]);


//     const [editingData, setEditingData] = useState({});
//     const [originalData, setOriginalData] = useState({});



//     const getAllPlans = async () => {
//         setLoading(true);

//         try {
//             const res = await axios.get(`${baseURL}/api/merchant/getMerchantPlanDetails`, {
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem("token")}`,
//                 },
//             });

           
//             setPricing(res.data?.data)
//             setLoading(false);
//         } catch (error) {
//             toast.error("Failed to fetch plans");
//         }finally{
//             setLoading(false);
//         }
//     };


//     const handlePricingChange = (index, field, value) => {
//         setEditingData(prev => ({
//             ...prev,
//             [index]: {
//                 ...prev[index],
//                 [field]: value
//             }
//         }));
//     };



//     const isFieldChanged = (index, field) => {
//         return editingData[index]?.[field] !== originalData[index]?.[field];
//     };


//     useEffect(() => {
//         // getDefaultPricing();
//         getAllPlans();
//         // getVendorPricing()
//     }, []);

//     return (
//         <>
//             {loading && <Loader />}
//             <div className="bg-gray-100 dark:bg-gray-900 min-h-screen w-full">
//                 {/* Heading Strip */}
//                 <div className="relative z-0 mb-6 bg-[#0446DB] dark:bg-gray-900 py-[20px] shadow-md h-20 px-[24px]">
//                     <div className="md:flex justify-between items-center space-y-1">
//                         <div>
//                             <h1 className="text-xl font-bold text-white">Pricing Plans</h1>
//                             {/* <p className="text-indigo-200 mt-1">Manage your pricing strategies</p> */}
//                         </div>

//                     </div>
//                 </div>

//                 <div className="px-2  z-99">
//                     <div className="-mt-10  relative">
//                         <div className="bg-white dark:bg-gray-900 rounded shadow overflow-hidden">


//                             <div className="py-5  px-5">
//                                 <div className="overflow-x-auto">
//                                     <table className="min-w-full border-collapse">
//                                         <thead>
//                                             <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200">
//                                                 <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
//                                                     Slab
//                                                 </th>
//                                                 <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
//                                                     Additional
//                                                 </th>
//                                                 <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
//                                                     SDD
//                                                 </th>
//                                                 <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
//                                                     NDD
//                                                 </th>
//                                                 <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
//                                                     Turant
//                                                 </th>
//                                                 <th className="py-4 px-4 whitespace-nowrap text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
//                                                     Additional SDD
//                                                 </th>
//                                                 <th className="py-4 px-4 whitespace-nowrap text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
//                                                     Additional NDD
//                                                 </th>
//                                                 <th className="py-4 px-4 whitespace-nowrap text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
//                                                     Additional Turant
//                                                 </th>
//                                                 <th className="py-4 px-4 whitespace-nowrap text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
//                                                     COD Percentage
//                                                 </th>
//                                                 <th className="py-4 px-4 whitespace-nowrap text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
//                                                     Minimum COD
//                                                 </th>
//                                             </tr>
//                                         </thead>

//                                         <tbody>
//                                             {Array.isArray(pricing) && pricing.length > 0 ? (
//                                                 pricing.map((item, index) => (
//                                                     <tr key={index} className={`hover:bg-indigo-50 dark:border-blue-400 dark:hover:bg-gray-800 border dark:bg-gray-900 transition-colors duration-150 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>

//                                                         <td className="py-4 px-4 dark:text-white text-gray-600">
//                                                             <input
//                                                                 type="text"
//                                                                 readOnly
//                                                                 value={item?.slab || ''}
//                                                                 className={`w-20 border dark:bg-gray-800 px-2 py-1 rounded ${isFieldChanged(index, 'sdd')
//                                                                     ? 'border-green-500 bg-green-50'
//                                                                     : 'border-gray-300'
//                                                                     }`}
//                                                             />
//                                                         </td>
//                                                         <td className="py-4 px-4 dark:text-white text-gray-600">
//                                                             <input
//                                                                 type="text"
//                                                                 value={item?.additional || ''}

//                                                                 className={`w-20 border dark:bg-gray-800 px-2 py-1 rounded ${isFieldChanged(index, 'sdd')
//                                                                     ? 'border-green-500 bg-green-50'
//                                                                     : 'border-gray-300'
//                                                                     }`}
//                                                             />
//                                                         </td>
//                                                         <td className="py-4 px-4 dark:text-white text-gray-600">
//                                                             <input
//                                                                 type="text"
//                                                                 value={item?.sdd || ''}
//                                                                 className={`w-20 border dark:bg-gray-800 px-2 py-1 rounded ${isFieldChanged(index, 'sdd')
//                                                                     ? 'border-green-500 bg-green-50'
//                                                                     : 'border-gray-300'
//                                                                     }`}
//                                                             />
//                                                         </td>
//                                                         <td className="py-4 px-4 dark:text-white text-gray-600">
//                                                             <input
//                                                                 type="text"
//                                                                 value={item?.ndd || ''}
//                                                                 className={`w-20 border dark:bg-gray-800 px-2 py-1 rounded ${isFieldChanged(index, 'sdd')
//                                                                     ? 'border-green-500 bg-green-50'
//                                                                     : 'border-gray-300'
//                                                                     }`}
//                                                             />
//                                                         </td>
//                                                         <td className="py-4 px-4 dark:text-white text-gray-600">
//                                                             <input
//                                                                 type="text"
//                                                                 value={item?.turant || ''}
//                                                                 className={`w-20 border dark:bg-gray-800 px-2 py-1 rounded ${isFieldChanged(index, 'sdd')
//                                                                     ? 'border-green-500 bg-green-50'
//                                                                     : 'border-gray-300'
//                                                                     }`}
//                                                             />
//                                                         </td>
//                                                         <td className="py-4 px-4 dark:text-white text-gray-600">
//                                                             <input
//                                                                 type="text"
//                                                                 value={item?.additional_sdd || ''}
//                                                                 className={`w-20 border dark:bg-gray-800 px-2 py-1 rounded ${isFieldChanged(index, 'sdd')
//                                                                     ? 'border-green-500 bg-green-50'
//                                                                     : 'border-gray-300'
//                                                                     }`}
//                                                             />
//                                                         </td>
//                                                         <td className="py-4 px-4 dark:text-white text-gray-600">
//                                                             <input
//                                                                 type="text"
//                                                                 value={item?.additional_ndd || ''}
//                                                                 className={`w-20 border dark:bg-gray-800 px-2 py-1 rounded ${isFieldChanged(index, 'sdd')
//                                                                     ? 'border-green-500 bg-green-50'
//                                                                     : 'border-gray-300'
//                                                                     }`}
//                                                             />
//                                                         </td>
//                                                         <td className="py-4 px-4 dark:text-white text-gray-600">
//                                                             <input
//                                                                 type="text"
//                                                                 value={item?.additional_turant || ''}
//                                                                 className={`w-20 border dark:bg-gray-800 px-2 py-1 rounded ${isFieldChanged(index, 'sdd')
//                                                                     ? 'border-green-500 bg-green-50'
//                                                                     : 'border-gray-300'
//                                                                     }`}
//                                                             />
//                                                         </td>
//                                                         <td className="py-4 px-4 dark:text-white text-gray-600">
//                                                             <input
//                                                                 type="text"
//                                                                 value={item?.cod_percentage || ''}
//                                                                 className={`w-20 border dark:bg-gray-800 px-2 py-1 rounded ${isFieldChanged(index, 'sdd')
//                                                                     ? 'border-green-500 bg-green-50'
//                                                                     : 'border-gray-300'
//                                                                     }`}
//                                                             />
//                                                         </td>
//                                                         <td className="py-4 px-4 dark:text-white text-gray-600">
//                                                             <input
//                                                                 type="text"
//                                                                 value={item?.minimum_cod || ''}
//                                                                 className={`w-20 border dark:bg-gray-800 px-2 py-1 rounded ${isFieldChanged(index, 'sdd')
//                                                                     ? 'border-green-500 bg-green-50'
//                                                                     : 'border-gray-300'
//                                                                     }`}
//                                                             />
//                                                         </td>



//                                                     </tr>
//                                                 ))
//                                             ) : (
//                                                 <tr className=" w-full text-center">
//                                                     <td colSpan="5">No Data Available</td>
//                                                 </tr>
//                                             )}

//                                         </tbody>
//                                     </table>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>


//             </div>
//         </>
//     );
// }

// export default PricingDetails;





import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  BadgeIndianRupee,
  Bolt,
  Box,
  CalendarClock,
  CircleDollarSign,
  Loader2,
  Package,
  Percent,
  Sparkles,
  Truck,
  WalletCards,
} from "lucide-react";

const baseURL = import.meta.env.VITE_BASE_URL;

function PricingDetails() {
  const [loading, setLoading] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);

  const [pricing, setPricing] = useState([]);
  const [editingData, setEditingData] = useState({});
  const [originalData, setOriginalData] = useState({});

  /* =========================================================
     PAGE LOADER
  ========================================================= */

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingPage(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  /* =========================================================
     GET PRICING PLANS
  ========================================================= */

  const getAllPlans = async () => {
    setLoading(true);

    try {
      const res = await axios.get(
        `${baseURL}/api/merchant/getMerchantPlanDetails`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const data = Array.isArray(res?.data?.data)
        ? res.data.data
        : [];

      setPricing(data);

      /*
       * Keeping copy for your existing field-change logic.
       */
      const initialData = {};

      data.forEach((item, index) => {
        initialData[index] = {
          ...item,
        };
      });

      setOriginalData(initialData);
      setEditingData(initialData);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to fetch plans"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     HANDLE PRICING CHANGE
  ========================================================= */

  const handlePricingChange = (index, field, value) => {
    setEditingData((prev) => ({
      ...prev,

      [index]: {
        ...prev[index],
        [field]: value,
      },
    }));
  };

  /* =========================================================
     FIELD CHANGE CHECK
  ========================================================= */

  const isFieldChanged = (index, field) => {
    return (
      editingData[index]?.[field] !==
      originalData[index]?.[field]
    );
  };

  /* =========================================================
     GET FIELD VALUE
  ========================================================= */

  const getValue = (item, index, field) => {
    if (
      editingData[index] &&
      editingData[index][field] !== undefined
    ) {
      return editingData[index][field];
    }

    return item?.[field] ?? "";
  };

  useEffect(() => {
    getAllPlans();
  }, []);

  /* =========================================================
     INITIAL PAGE LOADER
  ========================================================= */

  if (loadingPage) {
    return (
      <div className="flex min-h-[90vh] w-full items-center justify-center bg-[#F7F8FA] px-4 dark:bg-neutral-950">
        <div className="flex flex-col items-center">
          {/* LOADER ICON */}

          <div className="relative flex h-16 w-16 items-center justify-center">
            <div className="absolute inset-0 rounded-2xl bg-[#0446DB]/10" />

            <div className="absolute inset-0 animate-ping rounded-2xl bg-[#0446DB]/5" />

            <Loader2 className="relative z-10 h-7 w-7 animate-spin text-[#0446DB]" />
          </div>

          {/* TITLE */}

          <h2 className="mt-5 text-base font-semibold text-gray-900 dark:text-white">
            Loading Pricing Plans
          </h2>

          <p className="mt-1 max-w-[300px] text-center text-sm leading-5 text-gray-500 dark:text-neutral-400">
            Please wait while we prepare your latest pricing
            details.
          </p>

          {/* DOTS */}

          <div className="mt-4 flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#0446DB] [animation-delay:-0.3s]" />

            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#0446DB] [animation-delay:-0.15s]" />

            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#0446DB]" />
          </div>
        </div>
      </div>
    );
  }

  /* =========================================================
     MAIN PAGE
  ========================================================= */

  return (
    <div className="min-h-screen w-full bg-[#F7F8FA] dark:bg-neutral-950">
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className=" dark:border-neutral-800 dark:bg-neutral-900">
        <div className="">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* LEFT */}

            <div className="flex items-center gap-3">
              

              <div>
                <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                  Pricing Plans
                </h1>

                <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                  View your shipping rates and additional
                  charges
                </p>
              </div>
            </div>

            {/* STATUS */}

            
          </div>
        </div>
      </div>

      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div className=" py-3">
       
        <div className="overflow-hidden rounded-sm border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          {/* TABLE CARD HEADER */}

          <div className="flex flex-col gap-4 border-b border-gray-100 px-5 py-5 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-sm bg-[#0446DB]/10">
                <WalletCards className="h-4 w-4 text-[#0446DB]" />
              </div>

              <div>
                <h2 className="text-base font-semibold text-gray-900 dark:text-white">
                  Shipping Rate Card
                </h2>

                <p className="mt-0.5 text-xs text-gray-500 dark:text-neutral-400">
                  Detailed pricing for each weight slab and
                  delivery mode
                </p>
              </div>
            </div>

            <span className="w-fit rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-[#0446DB] dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-300">
              {pricing?.length || 0}{" "}
              {pricing?.length === 1 ? "Plan" : "Plans"}
            </span>
          </div>

          {/* =================================================
              API LOADER
          ================================================= */}

          {loading ? (
            <div className="flex min-h-[350px] items-center justify-center">
              <div className="flex flex-col items-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-[#0446DB]/10">
                  <Loader2 className="h-6 w-6 animate-spin text-[#0446DB]" />
                </div>

                <p className="mt-4 text-sm font-medium text-gray-600 dark:text-neutral-300">
                  Fetching pricing details...
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  Please wait a moment
                </p>
              </div>
            </div>
          ) : (
            /* =================================================
               TABLE
            ================================================= */

            <div className="overflow-x-auto">
              <table className="min-w-[1250px] w-full">
                {/* =============================================
                    TABLE HEAD
                ============================================= */}

                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50/80 dark:border-neutral-800 dark:bg-neutral-950/50">
                    <TableHeading>
                      <div className="flex items-center gap-1.5">
                       
                        Slab
                      </div>
                    </TableHeading>

                    <TableHeading>
                      Additional
                    </TableHeading>

                    <TableHeading>
                      <div className="flex items-center gap-1.5">
                        <Truck className="h-3.5 w-3.5" />
                        SDD
                      </div>
                    </TableHeading>

                    <TableHeading>NDD</TableHeading>

                  

                    <TableHeading>
                      Additional SDD
                    </TableHeading>

                    <TableHeading>
                      Additional NDD
                    </TableHeading>

                   

                    <TableHeading>
                      <div className="flex items-center gap-1.5">
                        <Percent className="h-3.5 w-3.5" />
                        COD Percentage
                      </div>
                    </TableHeading>
                    

                    <TableHeading>
                      Minimum COD
                    </TableHeading>
                  </tr>
                </thead>

                {/* =============================================
                    TABLE BODY
                ============================================= */}

                <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
                  {Array.isArray(pricing) &&
                  pricing.length > 0 ? (
                    pricing.map((item, index) => (
                      <tr
                        key={index}
                        className="transition-colors duration-150 hover:bg-blue-50/30 dark:hover:bg-neutral-800/50"
                      >
                        {/* SLAB */}

                        <PricingCell>
                          <PricingInput
                            value={getValue(
                              item,
                              index,
                              "slab"
                            )}
                            readOnly
                            changed={isFieldChanged(
                              index,
                              "slab"
                            )}
                          />
                        </PricingCell>

                        {/* ADDITIONAL */}

                        <PricingCell>
                          <PricingInput
                            value={getValue(
                              item,
                              index,
                              "additional"
                            )}
                            changed={isFieldChanged(
                              index,
                              "additional"
                            )}
                            onChange={(e) =>
                              handlePricingChange(
                                index,
                                "additional",
                                e.target.value
                              )
                            }
                          />
                        </PricingCell>

                        {/* SDD */}

                        <PricingCell>
                          <PricingInput
                            value={getValue(
                              item,
                              index,
                              "sdd"
                            )}
                            changed={isFieldChanged(
                              index,
                              "sdd"
                            )}
                            onChange={(e) =>
                              handlePricingChange(
                                index,
                                "sdd",
                                e.target.value
                              )
                            }
                          />
                        </PricingCell>

                        {/* NDD */}

                        <PricingCell>
                          <PricingInput
                            value={getValue(
                              item,
                              index,
                              "ndd"
                            )}
                            changed={isFieldChanged(
                              index,
                              "ndd"
                            )}
                            onChange={(e) =>
                              handlePricingChange(
                                index,
                                "ndd",
                                e.target.value
                              )
                            }
                          />
                        </PricingCell>

                        {/* TURANT */}

                        

                        {/* ADDITIONAL SDD */}

                        <PricingCell>
                          <PricingInput
                            value={getValue(
                              item,
                              index,
                              "additional_sdd"
                            )}
                            changed={isFieldChanged(
                              index,
                              "additional_sdd"
                            )}
                            onChange={(e) =>
                              handlePricingChange(
                                index,
                                "additional_sdd",
                                e.target.value
                              )
                            }
                          />
                        </PricingCell>

                        {/* ADDITIONAL NDD */}

                        <PricingCell>
                          <PricingInput
                            value={getValue(
                              item,
                              index,
                              "additional_ndd"
                            )}
                            changed={isFieldChanged(
                              index,
                              "additional_ndd"
                            )}
                            onChange={(e) =>
                              handlePricingChange(
                                index,
                                "additional_ndd",
                                e.target.value
                              )
                            }
                          />
                        </PricingCell>

                       

                        

                        {/* COD PERCENTAGE */}

                        <PricingCell>
                          <div className="relative w-[110px]">
                            <PricingInput
                              value={getValue(
                                item,
                                index,
                                "cod_percentage"
                              )}
                              changed={isFieldChanged(
                                index,
                                "cod_percentage"
                              )}
                              onChange={(e) =>
                                handlePricingChange(
                                  index,
                                  "cod_percentage",
                                  e.target.value
                                )
                              }
                              className="pr-7"
                            />

                            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400">
                              %
                            </span>
                          </div>
                        </PricingCell>

                        {/* MINIMUM COD */}

                        <PricingCell>
                          <div className="relative w-[110px]">
                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400">
                              ₹
                            </span>

                            <PricingInput
                              value={getValue(
                                item,
                                index,
                                "minimum_cod"
                              )}
                              changed={isFieldChanged(
                                index,
                                "minimum_cod"
                              )}
                              onChange={(e) =>
                                handlePricingChange(
                                  index,
                                  "minimum_cod",
                                  e.target.value
                                )
                              }
                              className="pl-7"
                            />
                          </div>
                        </PricingCell>
                      </tr>
                    ))
                  ) : (
                    /* =========================================
                       EMPTY STATE
                    ========================================= */

                    <tr>
                      <td
                        colSpan={10}
                        className="px-6 py-20 text-center"
                      >
                        <div className="flex flex-col items-center justify-center">
                          <div className="flex h-14 w-14 items-center justify-center rounded-sm bg-gray-100 dark:bg-neutral-800">
                            <Package className="h-6 w-6 text-gray-400" />
                          </div>

                          <h3 className="mt-4 text-sm font-semibold text-gray-800 dark:text-neutral-200">
                            No Pricing Plans Available
                          </h3>

                          <p className="mt-1 max-w-sm text-xs leading-5 text-gray-400 dark:text-neutral-500">
                            No pricing information is currently
                            available for your account.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* =================================================
              FOOTER
          ================================================= */}

          {!loading && pricing?.length > 0 && (
            <div className="flex flex-col gap-2 border-t border-gray-100 bg-gray-50/50 px-5 py-4 dark:border-neutral-800 dark:bg-neutral-950/40 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#0446DB]" />

                <p className="text-xs text-gray-500 dark:text-neutral-400">
                  Showing{" "}
                  <span className="font-semibold text-gray-700 dark:text-neutral-200">
                    {pricing.length}
                  </span>{" "}
                  pricing{" "}
                  {pricing.length === 1
                    ? "plan"
                    : "plans"}
                </p>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-neutral-500">
                <CalendarClock className="h-3.5 w-3.5" />
                Current pricing structure
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   INFORMATION CARD
========================================================= */

const InfoCard = ({
  icon: Icon,
  title,
  description,
  type = "blue",
}) => {
  const styles = {
    blue: {
      icon: `
        bg-blue-50
        text-[#0446DB]
        dark:bg-blue-500/10
        dark:text-blue-300
      `,
      line: "bg-[#0446DB]",
    },

    green: {
      icon: `
        bg-green-50
        text-green-600
        dark:bg-green-500/10
        dark:text-green-400
      `,
      line: "bg-green-500",
    },

    orange: {
      icon: `
        bg-orange-50
        text-orange-600
        dark:bg-orange-500/10
        dark:text-orange-400
      `,
      line: "bg-orange-500",
    },
  };

  const current =
    styles[type] || styles.blue;

  return (
    <div className="relative overflow-hidden rounded-sm border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900">
      <div
        className={`absolute bottom-0 left-0 top-0 w-1 ${current.line}`}
      />

      <div className="flex items-center gap-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-sm ${current.icon}`}
        >
          <Icon
            className="h-5 w-5"
            strokeWidth={1.8}
          />
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>

          <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-neutral-400">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   TABLE HEADING
========================================================= */

const TableHeading = ({ children }) => {
  return (
    <th className="whitespace-nowrap px-4 py-3.5 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-neutral-400">
      {children}
    </th>
  );
};

/* =========================================================
   TABLE CELL
========================================================= */

const PricingCell = ({ children }) => {
  return (
    <td className="whitespace-nowrap px-4 py-4 align-middle">
      {children}
    </td>
  );
};

/* =========================================================
   PRICING INPUT
========================================================= */

const PricingInput = ({
  value,
  onChange,
  changed = false,
  readOnly = false,
  className = "",
}) => {
  return (
    <input
      type="text"
      value={value ?? ""}
      onChange={onChange}
      readOnly={readOnly}
      className={`
        h-9
        w-[110px]
        rounded-sm
        border
        px-3
        text-sm
        font-medium
        outline-none
        transition-all

        ${
          changed
            ? `
              border-green-400
              bg-green-50
              text-green-700
              ring-2
              ring-green-500/10

              dark:border-green-500/50
              dark:bg-green-500/10
              dark:text-green-300
            `
            : `
              border-gray-200
              bg-white
              text-gray-700

              hover:border-gray-300

              focus:border-[#0446DB]
              focus:ring-2
              focus:ring-[#0446DB]/10

              dark:border-neutral-700
              dark:bg-neutral-800
              dark:text-neutral-200
              dark:hover:border-neutral-600
            `
        }

        ${
          readOnly
            ? `
              cursor-default
              bg-gray-50
              text-gray-500

              dark:bg-neutral-800/70
              dark:text-neutral-400
            `
            : ""
        }

        ${className}
      `}
    />
  );
};

export default PricingDetails;