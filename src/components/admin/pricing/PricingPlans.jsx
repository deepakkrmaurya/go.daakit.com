// // import React, { useEffect, useState, useRef } from "react";
// // import axios from "axios";
// // import { toast } from "react-toastify";
// // import Loader from "../Loader";
// // import { Link, useNavigate } from "react-router-dom";

// // const baseURL = import.meta.env.VITE_BASE_URL;

// // function PricingPlans() {
// //   const [loading, setLoading] = useState(false);
// //   const [activeTab, setActiveTab] = useState("pricing-plans");
// //   const [filter, setFilterData] = useState('');
// //   const [plans, setPlans] = useState([]);
// //   const [pricing, setPricing] = useState([]);
// //   const [Vendorpricing, setvendorPricing] = useState([]);
// //   const [dropdownOpen, setDropdownOpen] = useState(null);
// //   const [planModel, setPlanModel] = useState(false);
// //   const [PlanWithComparison, setPlanWithComparison] = useState([]);
// //   const [formData, setFormData] = useState({
// //     plan_name: "",
// //     plan_type: "",
// //     percentage_value: ""
// //   });

// //   const [editingData, setEditingData] = useState({});
// //   const [VendoreditingData, setVendoreditingData] = useState({});
// //   const [vendorOriginalData, setVendorOriginalData] = useState({});
// //   const [originalData, setOriginalData] = useState({});
// //   const navigate = useNavigate()
// //   const tabs = [
// //     { id: "pricing-plans", label: "Pricing Plans" },
// //     { id: "standard-landing", label: "Standard Landing Courier Price" },
// //     // { id: "standard-vendor", label: "Standard Landing Vendor Price" },
// //   ];

// //   const filterPricingplan = plans.filter((e) =>
// //     e.plan_name.toLowerCase().includes(filter.toLowerCase())
// //   );

// //   // agar filterPricingplan empty ho (length === 0), to poora plans array de do
// //   const finalData = filterPricingplan.length > 0 ? filterPricingplan : plans;

// //   const getAllPlans = async () => {
// //     setLoading(true);
// //     try {
// //       const res = await axios.get(`${baseURL}/api/admin/getAllPlans`, {
// //         headers: {
// //           Authorization: `Bearer ${localStorage.getItem("token")}`,
// //         },
// //       });
// //       setPlans([...res.data.data]);
// //       setLoading(false);
// //     } catch (error) {

// //       toast.error("Failed to fetch plans");
// //     }
// //   };

// //   const toggleDropdown = (index) => {
// //     setDropdownOpen(dropdownOpen === index ? null : index);
// //   };

// //   const handleOptionClick = async (option, plan) => {
// //     setDropdownOpen(null);

// //     if (option === "View Pricing") {
// //       try {
// //         const PlanWithComparison = await axios.get(
// //           `${baseURL}/api/admin/getPlanWithComparison/${plan.id}`,
// //           {
// //             headers: {
// //               Authorization: `Bearer ${localStorage.getItem("token")}`,
// //             },
// //           }
// //         );

// //         setPlanWithComparison(PlanWithComparison.data.data);
// //       } catch (error) {

// //         toast.error("Failed to fetch pricing details");
// //       }
// //     } else if (option === "Edit Pricing") {

// //     }
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     setLoading(true);

// //     try {
// //       const res = await axios.post(
// //         `${baseURL}/api/admin/createPlan`,
// //         formData,
// //         {
// //           headers: {
// //             Authorization: `Bearer ${localStorage.getItem("token")}`,
// //           },
// //         }
// //       );
// //       toast.success(res.data.message);
// //       getAllPlans();
// //       setPlanModel(false);
// //       setFormData({ plan_name: "", plan_type: "" });
// //       navigate(`/admin/updatePlanDetails/${res.data.plan_id}`)
// //     } catch (error) {

// //       toast.error(error.response?.data?.message || "Failed to create plan");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleInputChange = (e) => {
// //     const { name, value } = e.target;
// //     setFormData(prev => ({
// //       ...prev,
// //       [name]: value
// //     }));

// //     if (value === 'Standard') {

// //       setFormData(prev => ({
// //         ...prev,
// //         percentage_value: ""
// //       }));
// //     }
// //   };

// //   const getDefaultPricing = async () => {
// //     setLoading(true);
// //     try {
// //       const getPricings = await axios.get(`${baseURL}/api/admin/getPricings`, {
// //         headers: {
// //           Authorization: `Bearer ${localStorage.getItem("token")}`,
// //         },
// //       });

// //       setPricing(getPricings.data.data);
// //       // Initialize editing data with the fetched data
// //       const initialEditingData = {};

// //       getPricings.data.data.forEach((item, index) => {
// //         initialEditingData[index] = {
// //           ...item,
// //           courier_id: item.courier_id // Ensure courier_id is included
// //         };
// //       });

// //       setEditingData(initialEditingData);
// //       setOriginalData(initialEditingData);

// //     } catch (error) {

// //       toast.error("Failed to fetch pricing data");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const getVendorPricing = async () => {
// //     setLoading(true);
// //     try {

// //       const getVendorPricings = await axios.get(`${baseURL}/api/admin/getVendorPricings`, {
// //         headers: {
// //           Authorization: `Bearer ${localStorage.getItem("token")}`,
// //         },
// //       });
// //       setvendorPricing(getVendorPricings.data.data)

// //       const initialvendorEditingData = {};

// //       getVendorPricings.data.data.forEach((item, index) => {
// //         initialvendorEditingData[index] = {
// //           ...item,
// //           vendor_id: item.vendor_id // Ensure vendor_id is included
// //         };
// //       });

// //       setVendoreditingData(initialvendorEditingData);
// //       setVendorOriginalData(initialvendorEditingData);
// //     } catch (error) {

// //       toast.error("Failed to fetch pricing data");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handlePricingChange = (index, field, value) => {
// //     setEditingData(prev => ({
// //       ...prev,
// //       [index]: {
// //         ...prev[index],
// //         [field]: value
// //       }
// //     }));
// //   };

// //   const handleVendorPricingChange = (index, field, value) => {
// //     setVendoreditingData(prev => ({
// //       ...prev,
// //       [index]: {
// //         ...prev[index],
// //         [field]: value
// //       }
// //     }));
// //   };

// //   const isFieldChanged = (index, field) => {
// //     return editingData[index]?.[field] !== originalData[index]?.[field];
// //   };

// //   const isVendorFieldChanged = (index, field) => {
// //     return VendoreditingData[index]?.[field] !== vendorOriginalData[index]?.[field];
// //   };

// //   const hasCourierChanges = (courierId) => {
// //     return Object.keys(editingData).some(index => {
// //       const item = editingData[index];
// //       return item.courier_id === courierId &&
// //         Object.keys(item).some(field =>
// //           field !== 'courier_id' && isFieldChanged(parseInt(index), field)
// //         );
// //     });
// //   };

// //   const hasVendorChangesForVendor = (vendorId) => {
// //     return Object.keys(VendoreditingData).some(index => {
// //       const item = VendoreditingData[index];
// //       return item.vendor_id === vendorId &&
// //         Object.keys(item).some(field =>
// //           field !== 'vendor_id' && isVendorFieldChanged(parseInt(index), field)
// //         );
// //     });
// //   };

// //   const handlePricingSubmit = async (e) => {
// //     e.preventDefault();
// //     setLoading(true);

// //     try {
// //       // Prepare data with only changed couriers
// //       const couriersMap = {};

// //       // Group changed pricing data by courier_id
// //       Object.keys(editingData).forEach(index => {
// //         const editedItem = editingData[index];
// //         const originalItem = originalData[index];
// //         const courierId = editedItem.courier_id;

// //         // Check if this item has any changes
// //         const hasChanges = Object.keys(editedItem).some(field =>
// //           field !== 'courier_id' && isFieldChanged(parseInt(index), field)
// //         );

// //         if (hasChanges) {
// //           if (!couriersMap[courierId]) {
// //             couriersMap[courierId] = {
// //               courier_id: courierId,
// //               pricings: []
// //             };
// //           }

// //           // Include all fields for the changed pricing entry
// //           couriersMap[courierId].pricings.push({
// //             id: editedItem.id,
// //             additional: editedItem.additional || '',
// //             additional_ndd: editedItem.additional_ndd || '',
// //             additional_sdd: editedItem.additional_sdd || '',
// //             additional_turant: editedItem.additional_turant || '',
// //             cod_percentage: editedItem.cod_percentage || '',
// //             courier_display_name: editedItem.courier_display_name || '',
// //             minimum_cod: editedItem.minimum_cod || '',
// //             ndd: editedItem.ndd || '',
// //             sdd: editedItem.sdd || '',
// //             slab: editedItem.slab || '',
// //             turant: editedItem.turant || ''
// //           });
// //         }
// //       });

// //       // Convert the map to array format (only couriers with changes)
// //       const updatedData = {
// //         couriers: Object.values(couriersMap)
// //       };

// //       if (updatedData.couriers.length === 0) {
// //         toast.info("No changes to save");
// //         setLoading(false);
// //         return;
// //       }

// //       // Send only the changed data to the API
// //       const res = await axios.post(
// //         `${baseURL}/api/admin/updateOrCreateMultipleCourierPricings`,
// //         updatedData,
// //         {
// //           headers: {
// //             Authorization: `Bearer ${localStorage.getItem("token")}`,
// //           },
// //         }
// //       );

// //       toast.success(res.data.message);

// //       // Refresh the pricing data
// //       getDefaultPricing();

// //     } catch (error) {

// //       toast.error(error.response?.data?.message || "Failed to update pricing");

// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const handleVendorPricingSubmit = async (e) => {
// //     e.preventDefault();
// //     setLoading(true);

// //     try {
// //       // Prepare data with only changed vendors
// //       const vendorsMap = {};

// //       // Group changed pricing data by vendor_id
// //       Object.keys(VendoreditingData).forEach(index => {
// //         const editedItem = VendoreditingData[index];
// //         const originalItem = vendorOriginalData[index];
// //         const vendorId = editedItem.vendor_id;

// //         // Check if this item has any changes
// //         const hasChanges = Object.keys(editedItem).some(field =>
// //           field !== 'vendor_id' && isVendorFieldChanged(parseInt(index), field)
// //         );

// //         if (hasChanges) {
// //           if (!vendorsMap[vendorId]) {
// //             vendorsMap[vendorId] = {
// //               vendor_id: vendorId,
// //               pricings: []
// //             };
// //           }

// //           // Include all fields for the changed pricing entry
// //           vendorsMap[vendorId].pricings.push({
// //             id: editedItem.id,
// //             additional: editedItem.additional || '',
// //             additional_ndd: editedItem.additional_ndd || '',
// //             additional_sdd: editedItem.additional_sdd || '',
// //             additional_turant: editedItem.additional_turant || '',
// //             cod_percentage: editedItem.cod_percentage || '',
// //             courier_display_name: editedItem.courier_display_name || '',
// //             minimum_cod: editedItem.minimum_cod || '',
// //             ndd: editedItem.ndd || '',
// //             sdd: editedItem.sdd || '',
// //             slab: editedItem.slab || '',
// //             turant: editedItem.turant || ''
// //           });
// //         }
// //       });

// //       // Convert the map to array format (only vendors with changes)
// //       const updatedData = {
// //         vendors: Object.values(vendorsMap)
// //       };

// //       if (updatedData.vendors.length === 0) {
// //         toast.info("No changes to save");
// //         setLoading(false);
// //         return;
// //       }

// //       // Send only the changed data to the API
// //       const res = await axios.post(
// //         `${baseURL}/api/admin/updateOrCreateMultipleVendorPricings`,
// //         updatedData,
// //         {
// //           headers: {
// //             Authorization: `Bearer ${localStorage.getItem("token")}`,
// //           },
// //         }
// //       );

// //       toast.success(res.data.message);

// //       // Refresh the pricing data
// //       getVendorPricing();

// //     } catch (error) {

// //       toast.error(error.response?.data?.message || "Failed to update vendor pricing");

// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const resetChanges = () => {
// //     setEditingData({ ...originalData });
// //     toast.info("Changes reset");
// //   };

// //   const resetVendorChanges = () => {
// //     setVendoreditingData({ ...vendorOriginalData });
// //     toast.info("Vendor changes reset");
// //   };

// //   const hasChanges = () => {
// //     return Object.keys(editingData).some(index =>
// //       Object.keys(editingData[index]).some(field =>
// //         field !== 'courier_id' && isFieldChanged(parseInt(index), field)
// //       )
// //     );
// //   };

// //   const hasVendorChanges = () => {
// //     return Object.keys(VendoreditingData).some(index =>
// //       Object.keys(VendoreditingData[index]).some(field =>
// //         field !== 'vendor_id' && isVendorFieldChanged(parseInt(index), field)
// //       )
// //     );
// //   };

// //   // Get unique couriers for display
// //   const getUniqueCouriers = () => {
// //     const couriersMap = {};
// //     pricing.forEach((price, index) => {
// //       const courierId = editingData[index]?.courier_id;
// //       if (courierId && !couriersMap[courierId]) {
// //         couriersMap[courierId] = {
// //           courier_id: courierId,
// //           courier_display_name: editingData[index]?.courier_display_name,
// //           hasChanges: hasCourierChanges(courierId)
// //         };
// //       }
// //     });
// //     return Object.values(couriersMap);
// //   };

// //   const getUniqueVendors = () => {
// //     const vendorMap = {};
// //     Vendorpricing.forEach((price, index) => {
// //       const vendorId = VendoreditingData[index]?.vendor_id;
// //       if (vendorId && !vendorMap[vendorId]) {
// //         vendorMap[vendorId] = {
// //           vendor_id: vendorId,
// //           vendor_name: VendoreditingData[index]?.vendor_name,
// //           hasChanges: hasVendorChangesForVendor(vendorId)
// //         };
// //       }
// //     });
// //     return Object.values(vendorMap);
// //   };

// //   useEffect(() => {
// //     getDefaultPricing();
// //     getAllPlans();
// //     // getVendorPricing()
// //   }, []);

// //   return (
// //     <>
// //       {loading && <Loader />}
// //       <div className="bg-gray-100 dark:bg-gray-900 min-h-screen w-full">
// //         {/* Heading Strip */}
// //         <div className="relative z-0 mb-6 bg-[#0446DB] dark:bg-gray-900 py-[20px] shadow-md h-38 px-[24px]">
// //           <div className="md:flex justify-between items-center space-y-1">
// //             <div>
// //               <h1 className="text-xl font-bold text-white">Pricing Plans</h1>
// //               {/* <p className="text-indigo-200 mt-1">Manage your pricing strategies</p> */}
// //             </div>
// //             <div className=" md:flex  justify-between items-center gap-3 space-y-1">
// //               <div>
// //                 <input type="text"
// //                   onChange={(e) => setFilterData(e.target.value)}
// //                   className=" rounded w-full bg-white py-2 px-3 text-black font-semibold"
// //                   placeholder=" search plan "
// //                 />
// //               </div>
// //               <button
// //                 onClick={() => setPlanModel(true)}
// //                 className="bg-white text-indigo-700 font-medium px-4 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg hover:bg-gray-50 flex items-center gap-2">
// //                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
// //                 </svg>
// //                 Create Plan
// //               </button>
// //             </div>
// //           </div>
// //         </div>

// //         <div className="px-2  z-99">
// //           <div className="-mt-10 md:-mt-20 relative">
// //             <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden">
// //               <div className="border-b border-gray-200">
// //                 <div className="px-6">
// //                   <div className="flex gap-6">
// //                     {tabs.map((tab) => (
// //                       <button
// //                         key={tab.id}
// //                         onClick={() => {
// //                           setActiveTab(tab.id);
// //                           if (tab.id === "pricing-plans") setPlanWithComparison([]);
// //                         }}
// //                         className={`py-4 px-1 whitespace-nowrap font-medium text-sm border-b-2 transition-all duration-200 ${activeTab === tab.id
// //                           ? "border-indigo-600 text-indigo-600"
// //                           : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 "
// //                           }`}
// //                       >
// //                         {tab.label}
// //                       </button>
// //                     ))}
// //                   </div>
// //                 </div>
// //               </div>

// //               <div className="p-0 px-5">
// //                 {activeTab === "pricing-plans" && (
// //                   <div className=" mt-2 h-screen">
// //                     <div className=" w-full flex justify-between items-center mb-4">
// //                       <h3 className="text-lg font-semibold dark:text-white">Pricing Comparison</h3>

// //                       <button
// //                         onClick={() => setPlanWithComparison([])}
// //                         className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-all duration-200"
// //                       >
// //                         Back to Plans
// //                       </button>

// //                     </div>
// //                     {PlanWithComparison.length > 0 ? (
// //                       <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-700">

// //                         <table className="w-full  border-collapse">
// //                           <thead>
// //                             <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200">
// //                               <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
// //                                 Slab
// //                               </th>
// //                               <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
// //                                 Additional
// //                               </th>
// //                               <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
// //                                 SDD
// //                               </th>
// //                               <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
// //                                 NDD
// //                               </th>
// //                               <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
// //                                 Turant
// //                               </th>
// //                               <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
// //                                 Additional SDD
// //                               </th>
// //                               <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
// //                                 Additional NDD
// //                               </th>
// //                               <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
// //                                 Additional Turant
// //                               </th>
// //                               <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
// //                                 COD Percentage
// //                               </th>

// //                               <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
// //                                 MINIMUM COD
// //                               </th>
// //                             </tr>
// //                           </thead>
// //                           <tbody>
// //                             {PlanWithComparison?.map((price, index) => (
// //                               <tr key={index} className={`hover:bg-indigo-50 overflow-x-auto dark:hover:bg-gray-800 dark:bg-gray-900 transition-colors duration-150 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
// //                                 <td className="py-4 px-4 text-gray-600">
// //                                   <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ">
// //                                     {price?.slab}
// //                                   </span>
// //                                 </td>
// //                                 <td className="py-4 px-4 text-gray-800 font-medium dark:text-white">
// //                                   {price?.plan_pricing?.additional}
// //                                 </td>
// //                                 <td className="py-4 px-4 whitespace-nowrap text-gray-600">
// //                                   <span className="inline-block items-center px-2.5 py-0.5 rounded-full text-xs font-medium ">
// //                                     {price?.plan_pricing?.sdd}
// //                                     {/* <span className={`${price?.difference?.sdd <= 0 ? "text-red-600" : "text-green-700"}`}>
// //                                       &nbsp;{price?.difference?.sdd}
// //                                     </span> |
// //                                     <span className={``}>
// //                                       &nbsp;{price?.lowest_courier_pricing?.sdd?.display_name}
// //                                     </span> */}
// //                                   </span>
// //                                 </td>
// //                                 <td className="py-4 px-4 whitespace-nowrap text-gray-600">
// //                                   <span className="inline-bolck items-center px-2.5 py-0.5 rounded-full text-xs font-medium ">
// //                                     {price?.plan_pricing?.ndd}
// //                                     {/* <span className={`${price?.difference?.ndd <= 0 ? "text-red-600" : "text-green-700"}`}>
// //                                       &nbsp;{price?.difference?.ndd}
// //                                     </span>|
// //                                     <span className={``}>
// //                                       &nbsp;{price?.lowest_courier_pricing?.ndd?.display_name}
// //                                     </span> */}
// //                                   </span>
// //                                 </td>
// //                                 <td className="py-4 px-4 whitespace-nowrap text-gray-600">
// //                                   <span className="inline-block items-center px-2.5 py-0.5 rounded-full text-xs font-medium ">
// //                                     {price?.plan_pricing?.turant}
// //                                     {/* <span className={`${price?.difference?.turant <= 0 ? "text-red-600" : "text-green-700"}`}>
// //                                       &nbsp;{price?.difference?.turant}
// //                                     </span>|
// //                                     <span className={``}>
// //                                       &nbsp;{price?.lowest_courier_pricing?.turant?.display_name}
// //                                     </span> */}
// //                                   </span>
// //                                 </td>
// //                                 <td className="py-4 px-4 whitespace-nowrap text-gray-600">
// //                                   <span className="inline-block items-center px-2.5 py-0.5 rounded-full text-xs font-medium ">
// //                                     {price?.plan_pricing?.additional_sdd}
// //                                     {/* <span className={`${price?.difference?.additional_sdd <= 0 ? "text-red-600" : "text-green-700"}`}>
// //                                       &nbsp;{price?.difference?.additional_sdd}
// //                                     </span> |
// //                                     <span className={``}>
// //                                       &nbsp;{price?.lowest_courier_pricing?.additional_sdd?.display_name}
// //                                     </span> */}
// //                                   </span>
// //                                 </td>
// //                                 <td className="py-4 px-4 whitespace-nowrap text-gray-600">
// //                                   <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ">
// //                                     {price?.plan_pricing?.additional_ndd}
// //                                     {/* <span className={`${price?.difference?.additional_ndd <= 0 ? "text-red-600" : "text-green-700"}`}>
// //                                       &nbsp;{price?.difference?.additional_ndd}
// //                                     </span> |
// //                                     <span className={``}>
// //                                       &nbsp;{price?.lowest_courier_pricing?.additional_ndd?.display_name}
// //                                     </span> */}
// //                                   </span>
// //                                 </td>
// //                                 <td className="py-4 px-4 whitespace-nowrap text-gray-600">
// //                                   <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ">
// //                                     {price?.plan_pricing?.additional_turant}
// //                                     {/* <span className={`${price?.difference?.additional_turant <= 0 ? "text-red-600" : "text-green-700"}`}>
// //                                       &nbsp;{price?.difference?.additional_turant}
// //                                     </span>|
// //                                     <span className={``}>
// //                                       &nbsp;{price?.lowest_courier_pricing?.additional_turant?.display_name}
// //                                     </span> */}
// //                                   </span>
// //                                 </td>
// //                                 <td className="py-4 px-4 whitespace-nowrap text-gray-600">
// //                                   <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ">
// //                                     {price?.plan_pricing?.cod_percentage}
// //                                     {/* <span className={`${price?.difference?.cod_percentage <= 0 ? "text-red-600" : "text-green-700"}`}>
// //                                       &nbsp;{price?.difference?.cod_percentage}
// //                                     </span> |
// //                                     <span className={``}>
// //                                       &nbsp;{price?.lowest_courier_pricing?.cod_percentage?.display_name}
// //                                     </span> */}
// //                                   </span>
// //                                 </td>
// //                                 <td className="py-4 px-4 whitespace-nowrap text-gray-600">
// //                                   <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ">
// //                                     {price?.plan_pricing?.minimum_cod}
// //                                     {/* <span className={`${price?.difference?.cod_percentage <= 0 ? "text-red-600" : "text-green-700"}`}>
// //                                       &nbsp;{price?.difference?.cod_percentage}
// //                                     </span> |
// //                                     <span className={``}>
// //                                       &nbsp;{price?.lowest_courier_pricing?.cod_percentage?.display_name}
// //                                     </span> */}
// //                                   </span>
// //                                 </td>
// //                               </tr>
// //                             ))}
// //                           </tbody>
// //                         </table>
// //                       </div>
// //                     ) : (
// //                       <table className="min-w-full border-collapse ">
// //                         <thead>
// //                           <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200">
// //                             <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
// //                               SN
// //                             </th>
// //                             <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
// //                               PLAN NAME
// //                             </th>
// //                             <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
// //                               PLAN TYPE
// //                             </th>
// //                             <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
// //                               ACTION
// //                             </th>
// //                           </tr>
// //                         </thead>
// //                         <tbody>
// //                           {finalData?.map((plan, index) => (
// //                             <tr key={index} className={`hover:bg-indigo-50 border-b dark:border-[#554dc0] dark:hover:bg-gray-800 dark:bg-gray-900 transition-colors duration-150 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
// //                               <td className="py-4 px-4 dark:text-white text-gray-800 font-medium">
// //                                 {index + 1}
// //                               </td>
// //                               <td className="py-4 px-4 dark:text-white text-gray-800 font-medium">
// //                                 {plan?.plan_name}
// //                               </td>
// //                               <td className="py-4 px-4 text-gray-600 dark:text-white">
// //                                 <span className="inline-flex items-center  px-2.5 py-0.5 rounded-full text-xs font-medium ">
// //                                   {plan?.plan_type}
// //                                 </span>
// //                               </td>
// //                               {/* <td className="py-4 px-4 relative">
// //                                 <div className="relative">
// //                                   <button
// //                                     onClick={() => toggleDropdown(index)}
// //                                     className="bg-[#0446DB] text-white text-sm font-semibold px-3 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 w-full sm:w-auto justify-center"
// //                                   >
// //                                     <span className="hidden sm:inline">View More</span>
// //                                     <span className="sm:hidden">⋯</span>
// //                                     <svg
// //                                       className={`w-4 h-4 transition-transform duration-200 hidden sm:block ${dropdownOpen === index ? "rotate-180" : ""}`}
// //                                       fill="none"
// //                                       stroke="currentColor"
// //                                       viewBox="0 0 24 24"
// //                                     >
// //                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
// //                                     </svg>
// //                                   </button>

// //                                   {dropdownOpen === index && (
// //                                     <div className="absolute right-0 z-50  mt-0 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg z-10 border border-gray-200 transform transition-all duration-200">
// //                                       <div className="py-1">
// //                                         <button
// //                                           onClick={() => handleOptionClick("View Pricing", plan)}
// //                                           className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150 border-b border-gray-100"
// //                                         >
// //                                           <div className="flex items-center gap-2 dark:text-white">
// //                                             <svg className="w-4 h-4 text-gray-400 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
// //                                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
// //                                             </svg>
// //                                             View Pricing
// //                                           </div>
// //                                         </button>
// //                                         <Link to={`/admin/updatePlanDetails/${plan.id}`}>
// //                                           <button
// //                                             onClick={() => handleOptionClick("Edit Pricing", plan)}
// //                                             className="block w-full text-left dark:text-white px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
// //                                           >
// //                                             <div className="flex items-center gap-2">
// //                                               <svg className="w-4 h-4 text-gray-400 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
// //                                               </svg>
// //                                               Edit Pricing
// //                                             </div>
// //                                           </button>
// //                                         </Link>
// //                                       </div>
// //                                     </div>
// //                                   )}
// //                                 </div>
// //                               </td> */}
// //                               <td className="py-4 px-4 relative overflow-visible">
// //                                 <div>
// //                                   <button
// //                                     onClick={() => toggleDropdown(index)}
// //                                     className="bg-[#0446DB] text-white text-sm font-semibold
// //                  px-3 py-2 rounded-lg transition-all duration-200
// //                  shadow-md hover:shadow-lg
// //                  flex items-center gap-2
// //                  w-48 justify-center"
// //                                   >
// //                                     <span className="hidden sm:inline">View More</span>
// //                                     <span className="sm:hidden">⋯</span>

// //                                     <svg
// //                                       className={`w-4 h-4 transition-transform duration-200 hidden sm:block ${dropdownOpen === index ? "rotate-180" : ""
// //                                         }`}
// //                                       fill="none"
// //                                       stroke="currentColor"
// //                                       viewBox="0 0 24 24"
// //                                     >
// //                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
// //                                     </svg>
// //                                   </button>

// //                                   {dropdownOpen === index && (
// //                                     <div
// //                                       className="absolute left-10 top-full -mt-4
// //                    w-48
// //                    bg-white dark:bg-gray-900
// //                    rounded-lg shadow-lg
// //                    border border-gray-200
// //                    z-50"
// //                                     >
// //                                       <button
// //                                         onClick={() => handleOptionClick("View Pricing", plan)}
// //                                         className="block w-full text-left px-4 py-3 text-sm
// //                      text-gray-700 dark:text-white
// //                      hover:bg-gray-100 dark:hover:bg-gray-800
// //                      border-b"
// //                                       >
// //                                         <div className="flex items-center gap-2">
// //                                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
// //                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
// //                                           </svg>
// //                                           View Pricing
// //                                         </div>
// //                                       </button>

// //                                       <Link to={`/admin/updatePlanDetails/${plan.id}`}>
// //                                         <button
// //                                           onClick={() => handleOptionClick("Edit Pricing", plan)}
// //                                           className="block w-full text-left px-4 py-3 text-sm
// //                        text-gray-700 dark:text-white
// //                        hover:bg-gray-100 dark:hover:bg-gray-800"
// //                                         >
// //                                           <div className="flex items-center gap-2">
// //                                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
// //                                             </svg>
// //                                             Edit Pricing
// //                                           </div>
// //                                         </button>
// //                                       </Link>
// //                                     </div>
// //                                   )}
// //                                 </div>
// //                               </td>

// //                             </tr>
// //                           ))}
// //                         </tbody>
// //                       </table>
// //                     )}
// //                   </div>
// //                 )}

// //                 {activeTab === "standard-landing" && (
// //                   <div>
// //                     <form onSubmit={handlePricingSubmit}>
// //                       <div className="flex justify-between items-center mb-4">
// //                         <h3 className="text-lg font-semibold dark:text-white">Standard Landing Price</h3>
// //                         <div className="flex gap-2 mt-2">
// //                           {hasChanges() && (
// //                             <button
// //                               type="button"
// //                               onClick={resetChanges}
// //                               className="bg-gray-500 whitespace-nowrap hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-all duration-200"
// //                             >
// //                               Reset Changes
// //                             </button>
// //                           )}
// //                           <button
// //                             type="submit"
// //                             disabled={!hasChanges()}
// //                             className={`px-4 py-2 whitespace-nowrap rounded-lg transition-all duration-200 ${hasChanges()
// //                               ? 'bg-green-500 hover:bg-green-600 text-white'
// //                               : 'bg-gray-300 text-gray-500 cursor-not-allowed'
// //                               }`}
// //                           >
// //                             Save Changes
// //                           </button>
// //                         </div>
// //                       </div>

// //                       {/* Show which couriers have changes */}
// //                       {hasChanges() && (
// //                         <div className="mb-4 p-3 bg-blue-50 dark:bg-gray-800 rounded-lg">
// //                           <h4 className="text-sm font-semibold text-blue-800 mb-2">Couriers with changes:</h4>
// //                           <div className="flex flex-wrap gap-2">
// //                             {getUniqueCouriers().map(courier => (
// //                               courier.hasChanges && (
// //                                 <span key={courier.courier_id} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
// //                                   {courier.courier_display_name}
// //                                 </span>
// //                               )
// //                             ))}
// //                           </div>
// //                         </div>
// //                       )}

// //                       <div className="overflow-x-auto">
// //                         <table className="min-w-full border-collapse">
// //                           <thead>
// //                             <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200">
// //                               <th className="py-4 px-4 whitespace-nowrap text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
// //                                 Courier Display Name
// //                               </th>
// //                               <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
// //                                 Slab
// //                               </th>
// //                               <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
// //                                 Additional
// //                               </th>
// //                               <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
// //                                 SDD
// //                               </th>
// //                               <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
// //                                 NDD
// //                               </th>
// //                               <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
// //                                 Turant
// //                               </th>
// //                               <th className="py-4 px-4 whitespace-nowrap text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
// //                                 Additional SDD
// //                               </th>
// //                               <th className="py-4 px-4 whitespace-nowrap text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
// //                                 Additional NDD
// //                               </th>
// //                               <th className="py-4 px-4 whitespace-nowrap text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
// //                                 Additional Turant
// //                               </th>
// //                               <th className="py-4 px-4 whitespace-nowrap text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
// //                                 COD Percentage
// //                               </th>
// //                               <th className="py-4 px-4 whitespace-nowrap text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
// //                                 Minimum COD
// //                               </th>
// //                             </tr>
// //                           </thead>
// //                           <tbody>
// //                             {(() => {
// //                               const groupedPricing = {};

// //                               // Group pricing by courier_id
// //                               pricing.forEach((price, index) => {
// //                                 const courierId = editingData[index]?.courier_id;
// //                                 if (!groupedPricing[courierId]) {
// //                                   groupedPricing[courierId] = [];
// //                                 }
// //                                 groupedPricing[courierId].push({ price, index });
// //                               });

// //                               let rows = [];

// //                               Object.keys(groupedPricing).forEach(courierId => {
// //                                 const courierPricings = groupedPricing[courierId];
// //                                 const firstIndex = courierPricings[0].index;

// //                                 courierPricings.forEach((item, rowIndex) => {
// //                                   const { price, index } = item;
// //                                   rows.push(
// //                                     <tr key={index} className={`hover:bg-indigo-50 dark:border-blue-400 dark:hover:bg-gray-800 border dark:bg-gray-900 transition-colors duration-150 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
// //                                       {/* Courier Display Name with rowspan for first row of each courier group */}
// //                                       {rowIndex === 0 ? (
// //                                         <td rowSpan={courierPricings.length} class=" px-4  dark:text-white py-2 text-center align-middle font-semibold">
// //                                           {editingData[firstIndex]?.courier_display_name}
// //                                           <div>courier_id : {editingData[firstIndex]?.courier_id}</div>
// //                                         </td>
// //                                       ) : null}

// //                                       <td className="py-4 px-4 dark:text-white text-gray-600">
// //                                         {editingData[index]?.slab || ''}
// //                                       </td>
// //                                       <td className="py-4 px-4 dark:text-white text-gray-800 font-medium">
// //                                         {editingData[index]?.additional || ''}
// //                                       </td>
// //                                       <td className="py-4 px-4 dark:text-white text-gray-600">
// //                                         <input
// //                                           type="text"
// //                                           value={editingData[index]?.sdd || ''}
// //                                           onChange={(e) => handlePricingChange(index, 'sdd', e.target.value)}
// //                                           className={`w-20 border dark:bg-gray-800 px-2 py-1 rounded ${isFieldChanged(index, 'sdd')
// //                                             ? 'border-green-500 bg-green-50'
// //                                             : 'border-gray-300'
// //                                             }`}
// //                                         />
// //                                       </td>
// //                                       <td className="py-4 px-4 dark:text-white text-gray-600">
// //                                         <input
// //                                           type="text"
// //                                           value={editingData[index]?.ndd || ''}
// //                                           onChange={(e) => handlePricingChange(index, 'ndd', e.target.value)}
// //                                           className={`w-20 border dark:bg-gray-800 px-2 py-1 rounded ${isFieldChanged(index, 'ndd')
// //                                             ? 'border-green-500 bg-green-50'
// //                                             : 'border-gray-300'
// //                                             }`}
// //                                         />
// //                                       </td>
// //                                       <td className="py-4 px-4 dark:text-white text-gray-600">
// //                                         <input
// //                                           type="text"
// //                                           value={editingData[index]?.turant || ''}
// //                                           onChange={(e) => handlePricingChange(index, 'turant', e.target.value)}
// //                                           className={`w-20 border dark:bg-gray-800 px-2 py-1 rounded ${isFieldChanged(index, 'turant')
// //                                             ? 'border-green-500 bg-green-50'
// //                                             : 'border-gray-300'
// //                                             }`}
// //                                         />
// //                                       </td>
// //                                       <td className="py-4 px-4 dark:text-white text-gray-600">
// //                                         <input
// //                                           type="text"
// //                                           value={editingData[index]?.additional_sdd || ''}
// //                                           onChange={(e) => handlePricingChange(index, 'additional_sdd', e.target.value)}
// //                                           className={`w-20 border dark:bg-gray-800 px-2 py-1 rounded ${isFieldChanged(index, 'additional_sdd')
// //                                             ? 'border-green-500 bg-green-50'
// //                                             : 'border-gray-300'
// //                                             }`}
// //                                         />
// //                                       </td>
// //                                       <td className="py-4 px-4 dark:text-white text-gray-600">
// //                                         <input
// //                                           type="text"
// //                                           value={editingData[index]?.additional_ndd || ''}
// //                                           onChange={(e) => handlePricingChange(index, 'additional_ndd', e.target.value)}
// //                                           className={`w-20 border dark:bg-gray-800 px-2 py-1 rounded ${isFieldChanged(index, 'additional_ndd')
// //                                             ? 'border-green-500 bg-green-50'
// //                                             : 'border-gray-300'
// //                                             }`}
// //                                         />
// //                                       </td>
// //                                       <td className="py-4 px-4 dark:text-white text-gray-600">
// //                                         <input
// //                                           type="text"
// //                                           value={editingData[index]?.additional_turant || ''}
// //                                           onChange={(e) => handlePricingChange(index, 'additional_turant', e.target.value)}
// //                                           className={`w-20 border dark:bg-gray-800 px-2 py-1 rounded ${isFieldChanged(index, 'additional_turant')
// //                                             ? 'border-green-500 bg-green-50'
// //                                             : 'border-gray-300'
// //                                             }`}
// //                                         />
// //                                       </td>
// //                                       <td className="py-4 px-4 dark:text-white text-gray-600">
// //                                         <input
// //                                           type="text"
// //                                           value={editingData[index]?.cod_percentage || ''}
// //                                           onChange={(e) => handlePricingChange(index, 'cod_percentage', e.target.value)}
// //                                           className={`w-20 border dark:bg-gray-800 px-2 py-1 rounded ${isFieldChanged(index, 'cod_percentage')
// //                                             ? 'border-green-500 bg-green-50'
// //                                             : 'border-gray-300'
// //                                             }`}
// //                                         />
// //                                       </td>
// //                                       <td className="py-4 px-4 dark:text-white text-gray-600">
// //                                         <input
// //                                           type="text"
// //                                           value={editingData[index]?.minimum_cod || ''}
// //                                           onChange={(e) => handlePricingChange(index, 'minimum_cod', e.target.value)}
// //                                           className={`w-20 border dark:bg-gray-800 px-2 py-1 rounded ${isFieldChanged(index, 'minimum_cod')
// //                                             ? 'border-green-500 bg-green-50'
// //                                             : 'border-gray-300'
// //                                             }`}
// //                                         />
// //                                       </td>
// //                                     </tr>
// //                                   );
// //                                 });
// //                               });

// //                               return rows;
// //                             })()}
// //                           </tbody>
// //                         </table>
// //                       </div>
// //                     </form>
// //                   </div>
// //                 )}

// //                 {activeTab === "standard-vendor" && (
// //                   <div>
// //                     <form onSubmit={handleVendorPricingSubmit}>
// //                       <div className="flex justify-between items-center mb-4">
// //                         <h3 className="text-lg font-semibold  dark:text-white">Standard Landing Vendor Price</h3>
// //                         <div className="flex gap-2 mt-2">
// //                           {hasVendorChanges() && (
// //                             <button
// //                               type="button"
// //                               onClick={resetVendorChanges}
// //                               className="bg-gray-500 whitespace-nowrap hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-all duration-200"
// //                             >
// //                               Reset Changes
// //                             </button>
// //                           )}
// //                           <button
// //                             type="submit"
// //                             disabled={!hasVendorChanges()}
// //                             className={`px-4 py-2 whitespace-nowrap rounded-lg transition-all duration-200 ${hasVendorChanges()
// //                               ? 'bg-green-500 hover:bg-green-600 text-white'
// //                               : 'bg-gray-300 text-gray-500 cursor-not-allowed'
// //                               }`}
// //                           >
// //                             Save Changes
// //                           </button>
// //                         </div>
// //                       </div>

// //                       {/* Show which vendors have changes */}
// //                       {hasVendorChanges() && (
// //                         <div className="mb-4 p-3 bg-blue-50 dark:bg-gray-800 rounded-lg">
// //                           <h4 className="text-sm font-semibold text-blue-800 mb-2">Vendors with changes:</h4>
// //                           <div className="flex flex-wrap gap-2">
// //                             {getUniqueVendors().map(vendor => (
// //                               vendor.hasChanges && (
// //                                 <span key={vendor.vendor_id} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
// //                                   {vendor.vendor_name}
// //                                 </span>
// //                               )
// //                             ))}
// //                           </div>
// //                         </div>
// //                       )}

// //                       <div className="overflow-x-auto">
// //                         <table className="min-w-full border-collapse">
// //                           <thead>
// //                             <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200">
// //                               <th className="py-4 whitespace-nowrap px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
// //                                 Courier Display Name
// //                               </th>
// //                               <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
// //                                 Slab
// //                               </th>
// //                               <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
// //                                 Additional
// //                               </th>
// //                               <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
// //                                 SDD
// //                               </th>
// //                               <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
// //                                 NDD
// //                               </th>
// //                               <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
// //                                 Turant
// //                               </th>
// //                               <th className="py-4 whitespace-nowrap px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
// //                                 Additional SDD
// //                               </th>
// //                               <th className="py-4 whitespace-nowrap px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
// //                                 Additional NDD
// //                               </th>
// //                               <th className="py-4 whitespace-nowrap px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
// //                                 Additional Turant
// //                               </th>
// //                               <th className="py-4 whitespace-nowrap px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
// //                                 COD Percentage
// //                               </th>
// //                               <th className="py-4 whitespace-nowrap px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
// //                                 Minimum COD
// //                               </th>
// //                             </tr>
// //                           </thead>
// //                           <tbody>
// //                             {(() => {
// //                               const groupedPricing = {};

// //                               // Group pricing by vendor_id
// //                               Vendorpricing.forEach((price, index) => {
// //                                 const vendorId = VendoreditingData[index]?.vendor_id;
// //                                 if (!groupedPricing[vendorId]) {
// //                                   groupedPricing[vendorId] = [];
// //                                 }
// //                                 groupedPricing[vendorId].push({ price, index });
// //                               });

// //                               let rows = [];

// //                               Object.keys(groupedPricing).forEach(vendorId => {
// //                                 const vendorPricings = groupedPricing[vendorId];
// //                                 const firstIndex = vendorPricings[0].index;

// //                                 vendorPricings.forEach((item, rowIndex) => {
// //                                   const { price, index } = item;
// //                                   rows.push(
// //                                     <tr key={index} className={`hover:bg-indigo-50 dark:hover:bg-gray-800 dark:bg-gray-900 border dark:border-blue-400 transition-colors duration-150 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
// //                                       {/* Courier Display Name with rowspan for first row of each vendor group */}
// //                                       {rowIndex === 0 ? (
// //                                         <td rowSpan={vendorPricings.length} class=" px-4 py-2 dark:text-white text-center align-middle font-semibold">
// //                                           {VendoreditingData[firstIndex]?.courier_display_name}
// //                                           <div>vendor Name : {VendoreditingData[firstIndex]?.vendor_name}</div>
// //                                           <div>vendor_id : {VendoreditingData[firstIndex]?.vendor_id}</div>
// //                                         </td>
// //                                       ) : null}

// //                                       <td className="py-4 px-4 text-gray-600 dark:text-white">
// //                                         {VendoreditingData[index]?.slab || ''}
// //                                       </td>
// //                                       <td className="py-4 px-4 text-gray-800 font-medium dark:text-white">
// //                                         {VendoreditingData[index]?.additional || ''}
// //                                       </td>
// //                                       <td className="py-4 px-4 text-gray-600 dark:text-white">
// //                                         <input
// //                                           type="text"
// //                                           value={VendoreditingData[index]?.sdd || ''}
// //                                           onChange={(e) => handleVendorPricingChange(index, 'sdd', e.target.value)}
// //                                           className={`w-20 border px-2 py-1 dark:bg-gray-800 rounded ${isVendorFieldChanged(index, 'sdd')
// //                                             ? 'border-green-500 bg-green-50'
// //                                             : 'border-gray-300'
// //                                             }`}
// //                                         />
// //                                       </td>
// //                                       <td className="py-4 px-4 text-gray-600 dark:text-white">
// //                                         <input
// //                                           type="text"
// //                                           value={VendoreditingData[index]?.ndd || ''}
// //                                           onChange={(e) => handleVendorPricingChange(index, 'ndd', e.target.value)}
// //                                           className={`w-20 border px-2 dark:bg-gray-800 py-1 rounded ${isVendorFieldChanged(index, 'ndd')
// //                                             ? 'border-green-500 bg-green-50'
// //                                             : 'border-gray-300'
// //                                             }`}
// //                                         />
// //                                       </td>
// //                                       <td className="py-4 px-4 text-gray-600 dark:text-white">
// //                                         <input
// //                                           type="text"
// //                                           value={VendoreditingData[index]?.turant || ''}
// //                                           onChange={(e) => handleVendorPricingChange(index, 'turant', e.target.value)}
// //                                           className={`w-20 border px-2 dark:bg-gray-800 py-1 rounded ${isVendorFieldChanged(index, 'turant')
// //                                             ? 'border-green-500 bg-green-50'
// //                                             : 'border-gray-300'
// //                                             }`}
// //                                         />
// //                                       </td>
// //                                       <td className="py-4 px-4 text-gray-600 dark:text-white">
// //                                         <input
// //                                           type="text"
// //                                           value={VendoreditingData[index]?.additional_sdd || ''}
// //                                           onChange={(e) => handleVendorPricingChange(index, 'additional_sdd', e.target.value)}
// //                                           className={`w-20 border px-2 dark:bg-gray-800 py-1 rounded ${isVendorFieldChanged(index, 'additional_sdd')
// //                                             ? 'border-green-500 bg-green-50'
// //                                             : 'border-gray-300'
// //                                             }`}
// //                                         />
// //                                       </td>
// //                                       <td className="py-4 px-4 text-gray-600 dark:text-white">
// //                                         <input
// //                                           type="text"
// //                                           value={VendoreditingData[index]?.additional_ndd || ''}
// //                                           onChange={(e) => handleVendorPricingChange(index, 'additional_ndd', e.target.value)}
// //                                           className={`w-20 border px-2 dark:bg-gray-800 py-1 rounded ${isVendorFieldChanged(index, 'additional_ndd')
// //                                             ? 'border-green-500 bg-green-50'
// //                                             : 'border-gray-300'
// //                                             }`}
// //                                         />
// //                                       </td>
// //                                       <td className="py-4 px-4 text-gray-600 dark:text-white">
// //                                         <input
// //                                           type="text"
// //                                           value={VendoreditingData[index]?.additional_turant || ''}
// //                                           onChange={(e) => handleVendorPricingChange(index, 'additional_turant', e.target.value)}
// //                                           className={`w-20 border px-2 dark:bg-gray-800 py-1 rounded ${isVendorFieldChanged(index, 'additional_turant')
// //                                             ? 'border-green-500 bg-green-50'
// //                                             : 'border-gray-300'
// //                                             }`}
// //                                         />
// //                                       </td>
// //                                       <td className="py-4 px-4 text-gray-600 dark:text-white">
// //                                         <input
// //                                           type="text"
// //                                           value={VendoreditingData[index]?.cod_percentage || ''}
// //                                           onChange={(e) => handleVendorPricingChange(index, 'cod_percentage', e.target.value)}
// //                                           className={`w-20 border px-2 dark:bg-gray-800 py-1 rounded ${isVendorFieldChanged(index, 'cod_percentage')
// //                                             ? 'border-green-500 bg-green-50'
// //                                             : 'border-gray-300'
// //                                             }`}
// //                                         />
// //                                       </td>
// //                                       <td className="py-4 px-4 text-gray-600 dark:text-white">
// //                                         <input
// //                                           type="text"
// //                                           value={VendoreditingData[index]?.minimum_cod || ''}
// //                                           onChange={(e) => handleVendorPricingChange(index, 'minimum_cod', e.target.value)}
// //                                           className={`w-20 border px-2 dark:bg-gray-800 py-1 rounded ${isVendorFieldChanged(index, 'minimum_cod')
// //                                             ? 'border-green-500 bg-green-50'
// //                                             : 'border-gray-300'
// //                                             }`}
// //                                         />
// //                                       </td>
// //                                     </tr>
// //                                   );
// //                                 });
// //                               });

// //                               return rows;
// //                             })()}
// //                           </tbody>
// //                         </table>
// //                       </div>
// //                     </form>
// //                   </div>
// //                 )}
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* Create Plan Modal */}
// //         {planModel && (
// //           <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
// //             <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
// //               <div className="bg-[#0446DB] text-white p-6 rounded-t-xl">
// //                 <div className="flex justify-between items-center">
// //                   <h2 className="text-xl font-bold">Create New Plan</h2>
// //                   <button
// //                     onClick={() => setPlanModel(false)}
// //                     className="text-white hover:text-gray-200 transition-colors duration-200"
// //                   >
// //                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
// //                     </svg>
// //                   </button>
// //                 </div>
// //                 <p className="text-indigo-200 mt-1">Add a new pricing plan to your system</p>
// //               </div>

// //               <form onSubmit={handleSubmit} className="p-0">
// //                 <div className="space-y-4">
// //                   <div>
// //                     <label className="block text-sm font-medium text-gray-700 mb-2">
// //                       Plan Name *
// //                     </label>
// //                     <input
// //                       type="text"
// //                       name="plan_name"
// //                       value={formData.plan_name}
// //                       onChange={handleInputChange}
// //                       required
// //                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
// //                       placeholder="Enter plan name"
// //                     />
// //                   </div>

// //                   <div>
// //                     <label className="block text-sm font-medium text-gray-700 mb-2">
// //                       Plan Type *
// //                     </label>
// //                     <select
// //                       name="plan_type"
// //                       value={formData.plan_type}
// //                       onChange={handleInputChange}
// //                       required
// //                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
// //                     >
// //                       <option value="">Select plan type</option>
// //                       <option value="Standard">Standard</option>
// //                       <option value="percentage">Percentage</option>
// //                     </select>
// //                   </div>
// //                   {
// //                     formData.plan_type === 'percentage' && (
// //                       <div>
// //                         <label className="block text-sm font-medium text-gray-700 mb-2">
// //                           percentage_value *
// //                         </label>
// //                         <input
// //                           type="text"
// //                           name="percentage_value"
// //                           value={formData.percentage_value}
// //                           onChange={handleInputChange}
// //                           required
// //                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
// //                           placeholder="Enter plan name"
// //                         />
// //                       </div>
// //                     )
// //                   }

// //                 </div>

// //                 <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
// //                   <button
// //                     type="button"
// //                     onClick={() => setPlanModel(false)}
// //                     className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
// //                   >
// //                     Cancel
// //                   </button>
// //                   <button
// //                     type="submit"
// //                     className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200 font-medium"
// //                   >
// //                     Create Plan
// //                   </button>
// //                 </div>
// //               </form>
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //     </>
// //   );
// // }

// // export default PricingPlans;

// import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import Loader from "../../Loader";
// import { Link, useNavigate } from "react-router-dom";
// import { Loader2 } from "lucide-react";

// const baseURL = import.meta.env.VITE_BASE_URL;

// function PricingPlans() {
//   const [loading, setLoading] = useState(false);
//   const [activeTab, setActiveTab] = useState("pricing-plans");
//   const [filter, setFilterData] = useState('');
//   const [plans, setPlans] = useState([]);
//   const [pricing, setPricing] = useState([]);
//   const [Vendorpricing, setvendorPricing] = useState([]);
//   const [dropdownOpen, setDropdownOpen] = useState(null);
//   const [planModel, setPlanModel] = useState(false);
//   const [PlanWithComparison, setPlanWithComparison] = useState([]);
//   const [formData, setFormData] = useState({
//     plan_name: "",
//     plan_type: "",
//     percentage_value: ""
//   });

//   const [editingData, setEditingData] = useState({});
//   const [VendoreditingData, setVendoreditingData] = useState({});
//   const [vendorOriginalData, setVendorOriginalData] = useState({});
//   const [originalData, setOriginalData] = useState({});
//   const navigate = useNavigate()
//   const tabs = [
//     { id: "pricing-plans", label: "Pricing Plans" },
//     { id: "standard-landing", label: "Standard Landing Courier Price" },
//     // { id: "standard-vendor", label: "Standard Landing Vendor Price" },
//   ];

//   const filterPricingplan = plans.filter((e) =>
//     e.plan_name.toLowerCase().includes(filter.toLowerCase())
//   );

//   // agar filterPricingplan empty ho (length === 0), to poora plans array de do
//   const finalData = filterPricingplan.length > 0 ? filterPricingplan : plans;

//   const getAllPlans = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(`${baseURL}/api/admin/getAllPlans`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//       setPlans([...res.data.data]);
//       setLoading(false);
//     } catch (error) {

//       toast.error("Failed to fetch plans");
//     }
//   };

//   const toggleDropdown = (index) => {
//     setDropdownOpen(dropdownOpen === index ? null : index);
//   };

//   const handleOptionClick = async (option, plan) => {
//     setDropdownOpen(null);

//     if (option === "View Pricing") {
//       try {
//         const PlanWithComparison = await axios.get(
//           `${baseURL}/api/admin/getPlanWithComparison/${plan.id}`,
//           {
//             headers: {
//               Authorization: `Bearer ${localStorage.getItem("token")}`,
//             },
//           }
//         );

//         setPlanWithComparison(PlanWithComparison.data.data);
//       } catch (error) {

//         toast.error("Failed to fetch pricing details");
//       }
//     } else if (option === "Edit Pricing") {

//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const res = await axios.post(
//         `${baseURL}/api/admin/createPlan`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       toast.success(res.data.message);
//       getAllPlans();
//       setPlanModel(false);
//       setFormData({ plan_name: "", plan_type: "" });
//       navigate(`/admin/updatePlanDetails/${res.data.plan_id}`)
//     } catch (error) {

//       toast.error(error.response?.data?.message || "Failed to create plan");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));

//     if (value === 'Standard') {

//       setFormData(prev => ({
//         ...prev,
//         percentage_value: ""
//       }));
//     }
//   };

//   const getDefaultPricing = async () => {
//     setLoading(true);
//     try {
//       const getPricings = await axios.get(`${baseURL}/api/admin/getPricings`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });

//       setPricing(getPricings.data.data);
//       // Initialize editing data with the fetched data
//       const initialEditingData = {};

//       getPricings.data.data.forEach((item, index) => {
//         initialEditingData[index] = {
//           ...item,
//           courier_id: item.courier_id // Ensure courier_id is included
//         };
//       });

//       setEditingData(initialEditingData);
//       setOriginalData(initialEditingData);

//     } catch (error) {

//       toast.error("Failed to fetch pricing data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getVendorPricing = async () => {
//     setLoading(true);
//     try {

//       const getVendorPricings = await axios.get(`${baseURL}/api/admin/getVendorPricings`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//       setvendorPricing(getVendorPricings.data.data)

//       const initialvendorEditingData = {};

//       getVendorPricings.data.data.forEach((item, index) => {
//         initialvendorEditingData[index] = {
//           ...item,
//           vendor_id: item.vendor_id // Ensure vendor_id is included
//         };
//       });

//       setVendoreditingData(initialvendorEditingData);
//       setVendorOriginalData(initialvendorEditingData);
//     } catch (error) {

//       toast.error("Failed to fetch pricing data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePricingChange = (index, field, value) => {
//     setEditingData(prev => ({
//       ...prev,
//       [index]: {
//         ...prev[index],
//         [field]: value
//       }
//     }));
//   };

//   const handleVendorPricingChange = (index, field, value) => {
//     setVendoreditingData(prev => ({
//       ...prev,
//       [index]: {
//         ...prev[index],
//         [field]: value
//       }
//     }));
//   };

//   const isFieldChanged = (index, field) => {
//     return editingData[index]?.[field] !== originalData[index]?.[field];
//   };

//   const isVendorFieldChanged = (index, field) => {
//     return VendoreditingData[index]?.[field] !== vendorOriginalData[index]?.[field];
//   };

//   const hasCourierChanges = (courierId) => {
//     return Object.keys(editingData).some(index => {
//       const item = editingData[index];
//       return item.courier_id === courierId &&
//         Object.keys(item).some(field =>
//           field !== 'courier_id' && isFieldChanged(parseInt(index), field)
//         );
//     });
//   };

//   const hasVendorChangesForVendor = (vendorId) => {
//     return Object.keys(VendoreditingData).some(index => {
//       const item = VendoreditingData[index];
//       return item.vendor_id === vendorId &&
//         Object.keys(item).some(field =>
//           field !== 'vendor_id' && isVendorFieldChanged(parseInt(index), field)
//         );
//     });
//   };

//   const handlePricingSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       // Prepare data with only changed couriers
//       const couriersMap = {};

//       // Group changed pricing data by courier_id
//       Object.keys(editingData).forEach(index => {
//         const editedItem = editingData[index];
//         const originalItem = originalData[index];
//         const courierId = editedItem.courier_id;

//         // Check if this item has any changes
//         const hasChanges = Object.keys(editedItem).some(field =>
//           field !== 'courier_id' && isFieldChanged(parseInt(index), field)
//         );

//         if (hasChanges) {
//           if (!couriersMap[courierId]) {
//             couriersMap[courierId] = {
//               courier_id: courierId,
//               pricings: []
//             };
//           }

//           // Include all fields for the changed pricing entry
//           couriersMap[courierId].pricings.push({
//             id: editedItem.id,
//             additional: editedItem.additional || '',
//             additional_ndd: editedItem.additional_ndd || '',
//             additional_sdd: editedItem.additional_sdd || '',
//             additional_turant: editedItem.additional_turant || '',
//             cod_percentage: editedItem.cod_percentage || '',
//             courier_display_name: editedItem.courier_display_name || '',
//             minimum_cod: editedItem.minimum_cod || '',
//             ndd: editedItem.ndd || '',
//             sdd: editedItem.sdd || '',
//             slab: editedItem.slab || '',
//             turant: editedItem.turant || ''
//           });
//         }
//       });

//       // Convert the map to array format (only couriers with changes)
//       const updatedData = {
//         couriers: Object.values(couriersMap)
//       };

//       if (updatedData.couriers.length === 0) {
//         toast.info("No changes to save");
//         setLoading(false);
//         return;
//       }

//       // Send only the changed data to the API
//       const res = await axios.post(
//         `${baseURL}/api/admin/updateOrCreateMultipleCourierPricings`,
//         updatedData,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );

//       toast.success(res.data.message);

//       // Refresh the pricing data
//       getDefaultPricing();

//     } catch (error) {

//       toast.error(error.response?.data?.message || "Failed to update pricing");

//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleVendorPricingSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       // Prepare data with only changed vendors
//       const vendorsMap = {};

//       // Group changed pricing data by vendor_id
//       Object.keys(VendoreditingData).forEach(index => {
//         const editedItem = VendoreditingData[index];
//         const originalItem = vendorOriginalData[index];
//         const vendorId = editedItem.vendor_id;

//         // Check if this item has any changes
//         const hasChanges = Object.keys(editedItem).some(field =>
//           field !== 'vendor_id' && isVendorFieldChanged(parseInt(index), field)
//         );

//         if (hasChanges) {
//           if (!vendorsMap[vendorId]) {
//             vendorsMap[vendorId] = {
//               vendor_id: vendorId,
//               pricings: []
//             };
//           }

//           // Include all fields for the changed pricing entry
//           vendorsMap[vendorId].pricings.push({
//             id: editedItem.id,
//             additional: editedItem.additional || '',
//             additional_ndd: editedItem.additional_ndd || '',
//             additional_sdd: editedItem.additional_sdd || '',
//             additional_turant: editedItem.additional_turant || '',
//             cod_percentage: editedItem.cod_percentage || '',
//             courier_display_name: editedItem.courier_display_name || '',
//             minimum_cod: editedItem.minimum_cod || '',
//             ndd: editedItem.ndd || '',
//             sdd: editedItem.sdd || '',
//             slab: editedItem.slab || '',
//             turant: editedItem.turant || ''
//           });
//         }
//       });

//       // Convert the map to array format (only vendors with changes)
//       const updatedData = {
//         vendors: Object.values(vendorsMap)
//       };

//       if (updatedData.vendors.length === 0) {
//         toast.info("No changes to save");
//         setLoading(false);
//         return;
//       }

//       // Send only the changed data to the API
//       const res = await axios.post(
//         `${baseURL}/api/admin/updateOrCreateMultipleVendorPricings`,
//         updatedData,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );

//       toast.success(res.data.message);

//       // Refresh the pricing data
//       getVendorPricing();

//     } catch (error) {

//       toast.error(error.response?.data?.message || "Failed to update vendor pricing");

//     } finally {
//       setLoading(false);
//     }
//   };

//   const resetChanges = () => {
//     setEditingData({ ...originalData });
//     toast.info("Changes reset");
//   };

//   const resetVendorChanges = () => {
//     setVendoreditingData({ ...vendorOriginalData });
//     toast.info("Vendor changes reset");
//   };

//   const hasChanges = () => {
//     return Object.keys(editingData).some(index =>
//       Object.keys(editingData[index]).some(field =>
//         field !== 'courier_id' && isFieldChanged(parseInt(index), field)
//       )
//     );
//   };

//   const hasVendorChanges = () => {
//     return Object.keys(VendoreditingData).some(index =>
//       Object.keys(VendoreditingData[index]).some(field =>
//         field !== 'vendor_id' && isVendorFieldChanged(parseInt(index), field)
//       )
//     );
//   };

//   // Get unique couriers for display
//   const getUniqueCouriers = () => {
//     const couriersMap = {};
//     pricing.forEach((price, index) => {
//       const courierId = editingData[index]?.courier_id;
//       if (courierId && !couriersMap[courierId]) {
//         couriersMap[courierId] = {
//           courier_id: courierId,
//           courier_display_name: editingData[index]?.courier_display_name,
//           hasChanges: hasCourierChanges(courierId)
//         };
//       }
//     });
//     return Object.values(couriersMap);
//   };

//   const getUniqueVendors = () => {
//     const vendorMap = {};
//     Vendorpricing.forEach((price, index) => {
//       const vendorId = VendoreditingData[index]?.vendor_id;
//       if (vendorId && !vendorMap[vendorId]) {
//         vendorMap[vendorId] = {
//           vendor_id: vendorId,
//           vendor_name: VendoreditingData[index]?.vendor_name,
//           hasChanges: hasVendorChangesForVendor(vendorId)
//         };
//       }
//     });
//     return Object.values(vendorMap);
//   };

//   useEffect(() => {
//     getDefaultPricing();
//     getAllPlans();
//     // getVendorPricing()
//   }, []);

//    const [loadingPage, setLoadingPage] = useState(true);

//     useEffect(() => {
//       const timer = setTimeout(() => {
//         setLoadingPage(false);
//       }, 2000);

//       return () => clearTimeout(timer);
//     }, []);

//   return (
//     <>
//       {loadingPage && (
//          <div className=" w-full h-[90vh] flex justify-center items-center">
//                     <div>
//                       <Loader2 className="h-8 w-8 animate-spin mx-auto" />
//                       <p className="mt-2"> Loading Pricing Plans Details...</p>
//                     </div>
//                   </div>
//       )}
//       <div className="flex h-[calc(97dvh-80px)] min-h-0 w-full flex-col overflow-hidden  dark:bg-neutral-950">
//         {/* Heading Strip */}
//         <div className="relative z-30 shrink-0 border-b px-4 pb-4  dark:border-neutral-800 dark:bg-neutral-900 md:px-6">
//           <div className="md:flex justify-between items-center space-y-1">
//             <div>
//               <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Pricing Plans</h1>
//               {/* <p className="text-indigo-200 mt-1">Manage your pricing strategies</p> */}
//             </div>
//             <div className=" md:flex  justify-between items-center gap-3 space-y-1">

//               <button
//                 onClick={() => setPlanModel(true)}
//                 className="flex h-10 items-center gap-2 rounded-md bg-[#0446DB] px-4 text-sm font-medium text-white transition-colors hover:bg-[#002c8a]">
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                 </svg>
//                 Create Plan
//               </button>
//             </div>
//           </div>
//         </div>

//         <div className="min-h-0 flex-1">
//           <div className="relative h-full min-h-0">
//             <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-sm border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
//               <div className="shrink-0 border-b border-gray-200">
//                 <div className="px-6">
//                   <div className="flex gap-6">
//                     {tabs.map((tab) => (
//                       <button
//                         key={tab.id}
//                         onClick={() => {
//                           setActiveTab(tab.id);
//                           if (tab.id === "pricing-plans") setPlanWithComparison([]);
//                         }}
//                         className={`py-4 px-1 whitespace-nowrap font-medium text-sm border-b-2 transition-all duration-200 ${activeTab === tab.id
//                           ? "border-[#0446DB] text-[#0446DB]"
//                           : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 "
//                           }`}
//                       >
//                         {tab.label}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               </div>

//               <div className="min-h-0 flex-1 overflow-hidden p-0 px-5">
//                 {activeTab === "pricing-plans" && (
//                   <div className="flex h-full min-h-0 flex-col pt-2">
//                     <div className="w-full shrink-0 flex justify-between items-center mb-4">
//                       <h3 className="text-lg font-semibold dark:text-white">Pricing Comparison</h3>

//                       <button
//                         onClick={() => setPlanWithComparison([])}
//                         className="rounded-md border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
//                       >
//                         Back to Plans
//                       </button>

//                     </div>
//                     {PlanWithComparison.length > 0 ? (
//                       <div className="min-h-0 flex-1 w-full overflow-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-700">

//                         <table className="w-full  border-separate border-spacing-0">
//                           <thead className="sticky top-0 z-20 bg-gray-50 dark:bg-neutral-800">
//                             <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200">
//                               <th className="sticky top-0 z-20 bg-gray-50 dark:bg-neutral-800 py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
//                                 Slab
//                               </th>
//                               <th className="sticky top-0 z-20 bg-gray-50 dark:bg-neutral-800 py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
//                                 Additional
//                               </th>
//                               <th className="sticky top-0 z-20 bg-gray-50 dark:bg-neutral-800 py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
//                                 SDD
//                               </th>
//                               <th className="sticky top-0 z-20 bg-gray-50 dark:bg-neutral-800 py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
//                                 NDD
//                               </th>
//                               <th className="sticky top-0 z-20 bg-gray-50 dark:bg-neutral-800 py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
//                                 Turant
//                               </th>
//                               <th className="sticky top-0 z-20 bg-gray-50 dark:bg-neutral-800 py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
//                                 Additional SDD
//                               </th>
//                               <th className="sticky top-0 z-20 bg-gray-50 dark:bg-neutral-800 py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
//                                 Additional NDD
//                               </th>
//                               <th className="sticky top-0 z-20 bg-gray-50 dark:bg-neutral-800 py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
//                                 Additional Turant
//                               </th>
//                               <th className="sticky top-0 z-20 bg-gray-50 dark:bg-neutral-800 py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
//                                 COD Percentage
//                               </th>

//                               <th className="sticky top-0 z-20 bg-gray-50 dark:bg-neutral-800 py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
//                                 MINIMUM COD
//                               </th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {PlanWithComparison?.map((price, index) => (
//                               <tr key={index} className={`hover:bg-indigo-50 overflow-x-auto dark:hover:bg-gray-800 dark:bg-gray-900 transition-colors duration-150 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
//                                 <td className="py-4 px-4 text-gray-600">
//                                   <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ">
//                                     {price?.slab}
//                                   </span>
//                                 </td>
//                                 <td className="py-4 px-4 text-gray-800 font-medium dark:text-white">
//                                   {price?.plan_pricing?.additional}
//                                 </td>
//                                 <td className="py-4 px-4 whitespace-nowrap text-gray-600">
//                                   <span className="inline-block items-center px-2.5 py-0.5 rounded-full text-xs font-medium ">
//                                     {price?.plan_pricing?.sdd}
//                                     {/* <span className={`${price?.difference?.sdd <= 0 ? "text-red-600" : "text-green-700"}`}>
//                                       &nbsp;{price?.difference?.sdd}
//                                     </span> |
//                                     <span className={``}>
//                                       &nbsp;{price?.lowest_courier_pricing?.sdd?.display_name}
//                                     </span> */}
//                                   </span>
//                                 </td>
//                                 <td className="py-4 px-4 whitespace-nowrap text-gray-600">
//                                   <span className="inline-bolck items-center px-2.5 py-0.5 rounded-full text-xs font-medium ">
//                                     {price?.plan_pricing?.ndd}
//                                     {/* <span className={`${price?.difference?.ndd <= 0 ? "text-red-600" : "text-green-700"}`}>
//                                       &nbsp;{price?.difference?.ndd}
//                                     </span>|
//                                     <span className={``}>
//                                       &nbsp;{price?.lowest_courier_pricing?.ndd?.display_name}
//                                     </span> */}
//                                   </span>
//                                 </td>
//                                 <td className="py-4 px-4 whitespace-nowrap text-gray-600">
//                                   <span className="inline-block items-center px-2.5 py-0.5 rounded-full text-xs font-medium ">
//                                     {price?.plan_pricing?.turant}
//                                     {/* <span className={`${price?.difference?.turant <= 0 ? "text-red-600" : "text-green-700"}`}>
//                                       &nbsp;{price?.difference?.turant}
//                                     </span>|
//                                     <span className={``}>
//                                       &nbsp;{price?.lowest_courier_pricing?.turant?.display_name}
//                                     </span> */}
//                                   </span>
//                                 </td>
//                                 <td className="py-4 px-4 whitespace-nowrap text-gray-600">
//                                   <span className="inline-block items-center px-2.5 py-0.5 rounded-full text-xs font-medium ">
//                                     {price?.plan_pricing?.additional_sdd}
//                                     {/* <span className={`${price?.difference?.additional_sdd <= 0 ? "text-red-600" : "text-green-700"}`}>
//                                       &nbsp;{price?.difference?.additional_sdd}
//                                     </span> |
//                                     <span className={``}>
//                                       &nbsp;{price?.lowest_courier_pricing?.additional_sdd?.display_name}
//                                     </span> */}
//                                   </span>
//                                 </td>
//                                 <td className="py-4 px-4 whitespace-nowrap text-gray-600">
//                                   <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ">
//                                     {price?.plan_pricing?.additional_ndd}
//                                     {/* <span className={`${price?.difference?.additional_ndd <= 0 ? "text-red-600" : "text-green-700"}`}>
//                                       &nbsp;{price?.difference?.additional_ndd}
//                                     </span> |
//                                     <span className={``}>
//                                       &nbsp;{price?.lowest_courier_pricing?.additional_ndd?.display_name}
//                                     </span> */}
//                                   </span>
//                                 </td>
//                                 <td className="py-4 px-4 whitespace-nowrap text-gray-600">
//                                   <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ">
//                                     {price?.plan_pricing?.additional_turant}
//                                     {/* <span className={`${price?.difference?.additional_turant <= 0 ? "text-red-600" : "text-green-700"}`}>
//                                       &nbsp;{price?.difference?.additional_turant}
//                                     </span>|
//                                     <span className={``}>
//                                       &nbsp;{price?.lowest_courier_pricing?.additional_turant?.display_name}
//                                     </span> */}
//                                   </span>
//                                 </td>
//                                 <td className="py-4 px-4 whitespace-nowrap text-gray-600">
//                                   <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ">
//                                     {price?.plan_pricing?.cod_percentage}
//                                     {/* <span className={`${price?.difference?.cod_percentage <= 0 ? "text-red-600" : "text-green-700"}`}>
//                                       &nbsp;{price?.difference?.cod_percentage}
//                                     </span> |
//                                     <span className={``}>
//                                       &nbsp;{price?.lowest_courier_pricing?.cod_percentage?.display_name}
//                                     </span> */}
//                                   </span>
//                                 </td>
//                                 <td className="py-4 px-4 whitespace-nowrap text-gray-600">
//                                   <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ">
//                                     {price?.plan_pricing?.minimum_cod}
//                                     {/* <span className={`${price?.difference?.cod_percentage <= 0 ? "text-red-600" : "text-green-700"}`}>
//                                       &nbsp;{price?.difference?.cod_percentage}
//                                     </span> |
//                                     <span className={``}>
//                                       &nbsp;{price?.lowest_courier_pricing?.cod_percentage?.display_name}
//                                     </span> */}
//                                   </span>
//                                 </td>
//                               </tr>
//                             ))}
//                           </tbody>
//                         </table>
//                       </div>
//                     ) : (
//                       <div className="min-h-0 flex-1 overflow-auto">
//                       <table className="min-w-full border-separate border-spacing-0 ">
//                         <thead className="sticky top-0 z-20 bg-gray-50 dark:bg-neutral-800">
//                           <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200">
//                             <th className="sticky top-0 z-20 bg-gray-50 dark:bg-neutral-800 py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
//                               SN
//                             </th>
//                             <th className="sticky top-0 z-20 bg-gray-50 dark:bg-neutral-800 py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
//                               PLAN NAME
//                             </th>
//                             <th className="sticky top-0 z-20 bg-gray-50 dark:bg-neutral-800 py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
//                               PLAN TYPE
//                             </th>
//                             <th className="sticky top-0 z-20 bg-gray-50 dark:bg-neutral-800 py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
//                               ACTION
//                             </th>
//                           </tr>
//                         </thead>
//                         <tbody>
//                           {finalData?.map((plan, index) => (
//                             <tr key={index} className={`hover:bg-indigo-50 border-b dark:border-[#554dc0] dark:hover:bg-gray-800 dark:bg-gray-900 transition-colors duration-150 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
//                               <td className="py-4 px-4 dark:text-white text-gray-800 font-medium">
//                                 {index + 1}
//                               </td>
//                               <td className="py-4 px-4 dark:text-white text-gray-800 font-medium">
//                                 {plan?.plan_name}
//                               </td>
//                               <td className="py-4 px-4 text-gray-600 dark:text-white">
//                                 <span className="inline-flex items-center  px-2.5 py-0.5 rounded-full text-xs font-medium ">
//                                   {plan?.plan_type}
//                                 </span>
//                               </td>
//                               {/* <td className="py-4 px-4 relative">
//                                 <div className="relative">
//                                   <button
//                                     onClick={() => toggleDropdown(index)}
//                                     className="bg-[#0446DB] text-white text-sm font-semibold px-3 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2 w-full sm:w-auto justify-center"
//                                   >
//                                     <span className="hidden sm:inline">View More</span>
//                                     <span className="sm:hidden">⋯</span>
//                                     <svg
//                                       className={`w-4 h-4 transition-transform duration-200 hidden sm:block ${dropdownOpen === index ? "rotate-180" : ""}`}
//                                       fill="none"
//                                       stroke="currentColor"
//                                       viewBox="0 0 24 24"
//                                     >
//                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                                     </svg>
//                                   </button>

//                                   {dropdownOpen === index && (
//                                     <div className="absolute right-0 z-50  mt-0 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg z-10 border border-gray-200 transform transition-all duration-200">
//                                       <div className="py-1">
//                                         <button
//                                           onClick={() => handleOptionClick("View Pricing", plan)}
//                                           className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150 border-b border-gray-100"
//                                         >
//                                           <div className="flex items-center gap-2 dark:text-white">
//                                             <svg className="w-4 h-4 text-gray-400 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                                             </svg>
//                                             View Pricing
//                                           </div>
//                                         </button>
//                                         <Link to={`/admin/updatePlanDetails/${plan.id}`}>
//                                           <button
//                                             onClick={() => handleOptionClick("Edit Pricing", plan)}
//                                             className="block w-full text-left dark:text-white px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors duration-150"
//                                           >
//                                             <div className="flex items-center gap-2">
//                                               <svg className="w-4 h-4 text-gray-400 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                                               </svg>
//                                               Edit Pricing
//                                             </div>
//                                           </button>
//                                         </Link>
//                                       </div>
//                                     </div>
//                                   )}
//                                 </div>
//                               </td> */}
//                               <td className="py-4 px-4 relative overflow-visible">
//                                 <div>
//                                   <button
//                                     onClick={() => toggleDropdown(index)}
//                                     className="bg-[#0446DB] text-white text-sm font-semibold
//                  px-3 py-2 rounded-lg transition-all duration-200
//                  shadow-md hover:shadow-lg
//                  flex items-center gap-2
//                  w-48 justify-center"
//                                   >
//                                     <span className="hidden sm:inline">View More</span>
//                                     <span className="sm:hidden">⋯</span>

//                                     <svg
//                                       className={`w-4 h-4 transition-transform duration-200 hidden sm:block ${dropdownOpen === index ? "rotate-180" : ""
//                                         }`}
//                                       fill="none"
//                                       stroke="currentColor"
//                                       viewBox="0 0 24 24"
//                                     >
//                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                                     </svg>
//                                   </button>

//                                   {dropdownOpen === index && (
//                                     <div
//                                       className="absolute left-10 top-full -mt-4
//                    w-48
//                    bg-white dark:bg-gray-900
//                    rounded-lg shadow-lg
//                    border border-gray-200
//                    z-50"
//                                     >
//                                       <button
//                                         onClick={() => handleOptionClick("View Pricing", plan)}
//                                         className="block w-full text-left px-4 py-3 text-sm
//                      text-gray-700 dark:text-white
//                      hover:bg-gray-100 dark:hover:bg-gray-800
//                      border-b"
//                                       >
//                                         <div className="flex items-center gap-2">
//                                           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                                           </svg>
//                                           View Pricing
//                                         </div>
//                                       </button>

//                                       <Link to={`/admin/updatePlanDetails/${plan.id}`}>
//                                         <button
//                                           onClick={() => handleOptionClick("Edit Pricing", plan)}
//                                           className="block w-full text-left px-4 py-3 text-sm
//                        text-gray-700 dark:text-white
//                        hover:bg-gray-100 dark:hover:bg-gray-800"
//                                         >
//                                           <div className="flex items-center gap-2">
//                                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//                                             </svg>
//                                             Edit Pricing
//                                           </div>
//                                         </button>
//                                       </Link>
//                                     </div>
//                                   )}
//                                 </div>
//                               </td>

//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                       </div>
//                     )}
//                   </div>
//                 )}

//                 {activeTab === "standard-landing" && (
//                   <div className="h-full min-h-0">
//                     <form onSubmit={handlePricingSubmit} className="flex h-full min-h-0 flex-col">
//                       <div className="flex shrink-0 justify-between items-center mb-4">
//                         <h3 className="text-lg font-semibold dark:text-white">Standard Landing Price</h3>
//                         <div className="flex gap-2 mt-2">
//                           {hasChanges() && (
//                             <button
//                               type="button"
//                               onClick={resetChanges}
//                               className="bg-gray-500 whitespace-nowrap hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-all duration-200"
//                             >
//                               Reset Changes
//                             </button>
//                           )}
//                           <button
//                             type="submit"
//                             disabled={!hasChanges()}
//                             className={`px-4 py-2 whitespace-nowrap rounded-lg transition-all duration-200 ${hasChanges()
//                               ? 'bg-green-500 hover:bg-green-600 text-white'
//                               : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                               }`}
//                           >
//                             Save Changes
//                           </button>
//                         </div>
//                       </div>

//                       {/* Show which couriers have changes */}
//                       {hasChanges() && (
//                         <div className="mb-4 p-3 bg-blue-50 dark:bg-gray-800 rounded-lg">
//                           <h4 className="text-sm font-semibold text-blue-800 mb-2">Couriers with changes:</h4>
//                           <div className="flex flex-wrap gap-2">
//                             {getUniqueCouriers().map(courier => (
//                               courier.hasChanges && (
//                                 <span key={courier.courier_id} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                                   {courier.courier_display_name}
//                                 </span>
//                               )
//                             ))}
//                           </div>
//                         </div>
//                       )}

//                       <div className="min-h-0 flex-1 overflow-auto">
//                         <table className="min-w-full border-separate border-spacing-0">
//                           <thead className="sticky top-0 z-20 bg-gray-50 dark:bg-neutral-800">
//                             <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200">
//                               <th className="sticky top-0 z-20 bg-gray-50 dark:bg-neutral-800 py-4 px-4 whitespace-nowrap text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
//                                 Courier Display Name
//                               </th>
//                               <th className="sticky top-0 z-20 bg-gray-50 dark:bg-neutral-800 py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
//                                 Slab
//                               </th>
//                               <th className="sticky top-0 z-20 bg-gray-50 dark:bg-neutral-800 py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
//                                 Additional
//                               </th>
//                               <th className="sticky top-0 z-20 bg-gray-50 dark:bg-neutral-800 py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
//                                 SDD
//                               </th>
//                               <th className="sticky top-0 z-20 bg-gray-50 dark:bg-neutral-800 py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
//                                 NDD
//                               </th>
//                               <th className="sticky top-0 z-20 bg-gray-50 dark:bg-neutral-800 py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
//                                 Turant
//                               </th>
//                               <th className="sticky top-0 z-20 bg-gray-50 dark:bg-neutral-800 py-4 px-4 whitespace-nowrap text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
//                                 Additional SDD
//                               </th>
//                               <th className="sticky top-0 z-20 bg-gray-50 dark:bg-neutral-800 py-4 px-4 whitespace-nowrap text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
//                                 Additional NDD
//                               </th>
//                               <th className="sticky top-0 z-20 bg-gray-50 dark:bg-neutral-800 py-4 px-4 whitespace-nowrap text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
//                                 Additional Turant
//                               </th>
//                               <th className="sticky top-0 z-20 bg-gray-50 dark:bg-neutral-800 py-4 px-4 whitespace-nowrap text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
//                                 COD Percentage
//                               </th>
//                               <th className="sticky top-0 z-20 bg-gray-50 dark:bg-neutral-800 py-4 px-4 whitespace-nowrap text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
//                                 Minimum COD
//                               </th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {(() => {
//                               const groupedPricing = {};

//                               // Group pricing by courier_id
//                               pricing.forEach((price, index) => {
//                                 const courierId = editingData[index]?.courier_id;
//                                 if (!groupedPricing[courierId]) {
//                                   groupedPricing[courierId] = [];
//                                 }
//                                 groupedPricing[courierId].push({ price, index });
//                               });

//                               let rows = [];

//                               Object.keys(groupedPricing).forEach(courierId => {
//                                 const courierPricings = groupedPricing[courierId];
//                                 const firstIndex = courierPricings[0].index;

//                                 courierPricings.forEach((item, rowIndex) => {
//                                   const { price, index } = item;
//                                   rows.push(
//                                     <tr key={index} className={`hover:bg-indigo-50 dark:border-blue-400 dark:hover:bg-gray-800 border dark:bg-gray-900 transition-colors duration-150 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
//                                       {/* Courier Display Name with rowspan for first row of each courier group */}
//                                       {rowIndex === 0 ? (
//                                         <td rowSpan={courierPricings.length} class=" px-4  dark:text-white py-2 text-center align-middle font-semibold">
//                                           {editingData[firstIndex]?.courier_display_name}
//                                           <div>courier_id : {editingData[firstIndex]?.courier_id}</div>
//                                         </td>
//                                       ) : null}

//                                       <td className="py-4 px-4 dark:text-white text-gray-600">
//                                         {editingData[index]?.slab || ''}
//                                       </td>
//                                       <td className="py-4 px-4 dark:text-white text-gray-800 font-medium">
//                                         {editingData[index]?.additional || ''}
//                                       </td>
//                                       <td className="py-4 px-4 dark:text-white text-gray-600">
//                                         <input
//                                           type="text"
//                                           value={editingData[index]?.sdd || ''}
//                                           onChange={(e) => handlePricingChange(index, 'sdd', e.target.value)}
//                                           className={`w-20 border dark:bg-gray-800 px-2 py-1 rounded ${isFieldChanged(index, 'sdd')
//                                             ? 'border-green-500 bg-green-50'
//                                             : 'border-gray-300'
//                                             }`}
//                                         />
//                                       </td>
//                                       <td className="py-4 px-4 dark:text-white text-gray-600">
//                                         <input
//                                           type="text"
//                                           value={editingData[index]?.ndd || ''}
//                                           onChange={(e) => handlePricingChange(index, 'ndd', e.target.value)}
//                                           className={`w-20 border dark:bg-gray-800 px-2 py-1 rounded ${isFieldChanged(index, 'ndd')
//                                             ? 'border-green-500 bg-green-50'
//                                             : 'border-gray-300'
//                                             }`}
//                                         />
//                                       </td>
//                                       <td className="py-4 px-4 dark:text-white text-gray-600">
//                                         <input
//                                           type="text"
//                                           value={editingData[index]?.turant || ''}
//                                           onChange={(e) => handlePricingChange(index, 'turant', e.target.value)}
//                                           className={`w-20 border dark:bg-gray-800 px-2 py-1 rounded ${isFieldChanged(index, 'turant')
//                                             ? 'border-green-500 bg-green-50'
//                                             : 'border-gray-300'
//                                             }`}
//                                         />
//                                       </td>
//                                       <td className="py-4 px-4 dark:text-white text-gray-600">
//                                         <input
//                                           type="text"
//                                           value={editingData[index]?.additional_sdd || ''}
//                                           onChange={(e) => handlePricingChange(index, 'additional_sdd', e.target.value)}
//                                           className={`w-20 border dark:bg-gray-800 px-2 py-1 rounded ${isFieldChanged(index, 'additional_sdd')
//                                             ? 'border-green-500 bg-green-50'
//                                             : 'border-gray-300'
//                                             }`}
//                                         />
//                                       </td>
//                                       <td className="py-4 px-4 dark:text-white text-gray-600">
//                                         <input
//                                           type="text"
//                                           value={editingData[index]?.additional_ndd || ''}
//                                           onChange={(e) => handlePricingChange(index, 'additional_ndd', e.target.value)}
//                                           className={`w-20 border dark:bg-gray-800 px-2 py-1 rounded ${isFieldChanged(index, 'additional_ndd')
//                                             ? 'border-green-500 bg-green-50'
//                                             : 'border-gray-300'
//                                             }`}
//                                         />
//                                       </td>
//                                       <td className="py-4 px-4 dark:text-white text-gray-600">
//                                         <input
//                                           type="text"
//                                           value={editingData[index]?.additional_turant || ''}
//                                           onChange={(e) => handlePricingChange(index, 'additional_turant', e.target.value)}
//                                           className={`w-20 border dark:bg-gray-800 px-2 py-1 rounded ${isFieldChanged(index, 'additional_turant')
//                                             ? 'border-green-500 bg-green-50'
//                                             : 'border-gray-300'
//                                             }`}
//                                         />
//                                       </td>
//                                       <td className="py-4 px-4 dark:text-white text-gray-600">
//                                         <input
//                                           type="text"
//                                           value={editingData[index]?.cod_percentage || ''}
//                                           onChange={(e) => handlePricingChange(index, 'cod_percentage', e.target.value)}
//                                           className={`w-20 border dark:bg-gray-800 px-2 py-1 rounded ${isFieldChanged(index, 'cod_percentage')
//                                             ? 'border-green-500 bg-green-50'
//                                             : 'border-gray-300'
//                                             }`}
//                                         />
//                                       </td>
//                                       <td className="py-4 px-4 dark:text-white text-gray-600">
//                                         <input
//                                           type="text"
//                                           value={editingData[index]?.minimum_cod || ''}
//                                           onChange={(e) => handlePricingChange(index, 'minimum_cod', e.target.value)}
//                                           className={`w-20 border dark:bg-gray-800 px-2 py-1 rounded ${isFieldChanged(index, 'minimum_cod')
//                                             ? 'border-green-500 bg-green-50'
//                                             : 'border-gray-300'
//                                             }`}
//                                         />
//                                       </td>
//                                     </tr>
//                                   );
//                                 });
//                               });

//                               return rows;
//                             })()}
//                           </tbody>
//                         </table>
//                       </div>
//                     </form>
//                   </div>
//                 )}

//                 {activeTab === "standard-vendor" && (
//                   <div className="h-full min-h-0">
//                     <form onSubmit={handleVendorPricingSubmit} className="flex h-full min-h-0 flex-col">
//                       <div className="flex shrink-0 justify-between items-center mb-4">
//                         <h3 className="text-lg font-semibold  dark:text-white">Standard Landing Vendor Price</h3>
//                         <div className="flex gap-2 mt-2">
//                           {hasVendorChanges() && (
//                             <button
//                               type="button"
//                               onClick={resetVendorChanges}
//                               className="bg-gray-500 whitespace-nowrap hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-all duration-200"
//                             >
//                               Reset Changes
//                             </button>
//                           )}
//                           <button
//                             type="submit"
//                             disabled={!hasVendorChanges()}
//                             className={`px-4 py-2 whitespace-nowrap rounded-lg transition-all duration-200 ${hasVendorChanges()
//                               ? 'bg-green-500 hover:bg-green-600 text-white'
//                               : 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                               }`}
//                           >
//                             Save Changes
//                           </button>
//                         </div>
//                       </div>

//                       {/* Show which vendors have changes */}
//                       {hasVendorChanges() && (
//                         <div className="mb-4 p-3 bg-blue-50 dark:bg-gray-800 rounded-lg">
//                           <h4 className="text-sm font-semibold text-blue-800 mb-2">Vendors with changes:</h4>
//                           <div className="flex flex-wrap gap-2">
//                             {getUniqueVendors().map(vendor => (
//                               vendor.hasChanges && (
//                                 <span key={vendor.vendor_id} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                                   {vendor.vendor_name}
//                                 </span>
//                               )
//                             ))}
//                           </div>
//                         </div>
//                       )}

//                       <div className="min-h-0 flex-1 overflow-auto">
//                         <table className="min-w-full border-separate border-spacing-0">
//                           <thead className="sticky top-0 z-20 bg-gray-50 dark:bg-neutral-800">
//                             <tr className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200">
//                               <th className="sticky top-0 z-20 bg-gray-50 dark:bg-neutral-800 py-4 whitespace-nowrap px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
//                                 Courier Display Name
//                               </th>
//                               <th className="sticky top-0 z-20 bg-gray-50 dark:bg-neutral-800 py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
//                                 Slab
//                               </th>
//                               <th className="sticky top-0 z-20 bg-gray-50 dark:bg-neutral-800 py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
//                                 Additional
//                               </th>
//                               <th className="sticky top-0 z-20 bg-gray-50 dark:bg-neutral-800 py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
//                                 SDD
//                               </th>
//                               <th className="sticky top-0 z-20 bg-gray-50 dark:bg-neutral-800 py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
//                                 NDD
//                               </th>
//                               <th className="sticky top-0 z-20 bg-gray-50 dark:bg-neutral-800 py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
//                                 Turant
//                               </th>
//                               <th className="sticky top-0 z-20 bg-gray-50 dark:bg-neutral-800 py-4 whitespace-nowrap px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
//                                 Additional SDD
//                               </th>
//                               <th className="sticky top-0 z-20 bg-gray-50 dark:bg-neutral-800 py-4 whitespace-nowrap px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
//                                 Additional NDD
//                               </th>
//                               <th className="sticky top-0 z-20 bg-gray-50 dark:bg-neutral-800 py-4 whitespace-nowrap px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
//                                 Additional Turant
//                               </th>
//                               <th className="sticky top-0 z-20 bg-gray-50 dark:bg-neutral-800 py-4 whitespace-nowrap px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
//                                 COD Percentage
//                               </th>
//                               <th className="sticky top-0 z-20 bg-gray-50 dark:bg-neutral-800 py-4 whitespace-nowrap px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
//                                 Minimum COD
//                               </th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             {(() => {
//                               const groupedPricing = {};

//                               // Group pricing by vendor_id
//                               Vendorpricing.forEach((price, index) => {
//                                 const vendorId = VendoreditingData[index]?.vendor_id;
//                                 if (!groupedPricing[vendorId]) {
//                                   groupedPricing[vendorId] = [];
//                                 }
//                                 groupedPricing[vendorId].push({ price, index });
//                               });

//                               let rows = [];

//                               Object.keys(groupedPricing).forEach(vendorId => {
//                                 const vendorPricings = groupedPricing[vendorId];
//                                 const firstIndex = vendorPricings[0].index;

//                                 vendorPricings.forEach((item, rowIndex) => {
//                                   const { price, index } = item;
//                                   rows.push(
//                                     <tr key={index} className={`hover:bg-indigo-50 dark:hover:bg-gray-800 dark:bg-gray-900 border dark:border-blue-400 transition-colors duration-150 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
//                                       {/* Courier Display Name with rowspan for first row of each vendor group */}
//                                       {rowIndex === 0 ? (
//                                         <td rowSpan={vendorPricings.length} class=" px-4 py-2 dark:text-white text-center align-middle font-semibold">
//                                           {VendoreditingData[firstIndex]?.courier_display_name}
//                                           <div>vendor Name : {VendoreditingData[firstIndex]?.vendor_name}</div>
//                                           <div>vendor_id : {VendoreditingData[firstIndex]?.vendor_id}</div>
//                                         </td>
//                                       ) : null}

//                                       <td className="py-4 px-4 text-gray-600 dark:text-white">
//                                         {VendoreditingData[index]?.slab || ''}
//                                       </td>
//                                       <td className="py-4 px-4 text-gray-800 font-medium dark:text-white">
//                                         {VendoreditingData[index]?.additional || ''}
//                                       </td>
//                                       <td className="py-4 px-4 text-gray-600 dark:text-white">
//                                         <input
//                                           type="text"
//                                           value={VendoreditingData[index]?.sdd || ''}
//                                           onChange={(e) => handleVendorPricingChange(index, 'sdd', e.target.value)}
//                                           className={`w-20 border px-2 py-1 dark:bg-gray-800 rounded ${isVendorFieldChanged(index, 'sdd')
//                                             ? 'border-green-500 bg-green-50'
//                                             : 'border-gray-300'
//                                             }`}
//                                         />
//                                       </td>
//                                       <td className="py-4 px-4 text-gray-600 dark:text-white">
//                                         <input
//                                           type="text"
//                                           value={VendoreditingData[index]?.ndd || ''}
//                                           onChange={(e) => handleVendorPricingChange(index, 'ndd', e.target.value)}
//                                           className={`w-20 border px-2 dark:bg-gray-800 py-1 rounded ${isVendorFieldChanged(index, 'ndd')
//                                             ? 'border-green-500 bg-green-50'
//                                             : 'border-gray-300'
//                                             }`}
//                                         />
//                                       </td>
//                                       <td className="py-4 px-4 text-gray-600 dark:text-white">
//                                         <input
//                                           type="text"
//                                           value={VendoreditingData[index]?.turant || ''}
//                                           onChange={(e) => handleVendorPricingChange(index, 'turant', e.target.value)}
//                                           className={`w-20 border px-2 dark:bg-gray-800 py-1 rounded ${isVendorFieldChanged(index, 'turant')
//                                             ? 'border-green-500 bg-green-50'
//                                             : 'border-gray-300'
//                                             }`}
//                                         />
//                                       </td>
//                                       <td className="py-4 px-4 text-gray-600 dark:text-white">
//                                         <input
//                                           type="text"
//                                           value={VendoreditingData[index]?.additional_sdd || ''}
//                                           onChange={(e) => handleVendorPricingChange(index, 'additional_sdd', e.target.value)}
//                                           className={`w-20 border px-2 dark:bg-gray-800 py-1 rounded ${isVendorFieldChanged(index, 'additional_sdd')
//                                             ? 'border-green-500 bg-green-50'
//                                             : 'border-gray-300'
//                                             }`}
//                                         />
//                                       </td>
//                                       <td className="py-4 px-4 text-gray-600 dark:text-white">
//                                         <input
//                                           type="text"
//                                           value={VendoreditingData[index]?.additional_ndd || ''}
//                                           onChange={(e) => handleVendorPricingChange(index, 'additional_ndd', e.target.value)}
//                                           className={`w-20 border px-2 dark:bg-gray-800 py-1 rounded ${isVendorFieldChanged(index, 'additional_ndd')
//                                             ? 'border-green-500 bg-green-50'
//                                             : 'border-gray-300'
//                                             }`}
//                                         />
//                                       </td>
//                                       <td className="py-4 px-4 text-gray-600 dark:text-white">
//                                         <input
//                                           type="text"
//                                           value={VendoreditingData[index]?.additional_turant || ''}
//                                           onChange={(e) => handleVendorPricingChange(index, 'additional_turant', e.target.value)}
//                                           className={`w-20 border px-2 dark:bg-gray-800 py-1 rounded ${isVendorFieldChanged(index, 'additional_turant')
//                                             ? 'border-green-500 bg-green-50'
//                                             : 'border-gray-300'
//                                             }`}
//                                         />
//                                       </td>
//                                       <td className="py-4 px-4 text-gray-600 dark:text-white">
//                                         <input
//                                           type="text"
//                                           value={VendoreditingData[index]?.cod_percentage || ''}
//                                           onChange={(e) => handleVendorPricingChange(index, 'cod_percentage', e.target.value)}
//                                           className={`w-20 border px-2 dark:bg-gray-800 py-1 rounded ${isVendorFieldChanged(index, 'cod_percentage')
//                                             ? 'border-green-500 bg-green-50'
//                                             : 'border-gray-300'
//                                             }`}
//                                         />
//                                       </td>
//                                       <td className="py-4 px-4 text-gray-600 dark:text-white">
//                                         <input
//                                           type="text"
//                                           value={VendoreditingData[index]?.minimum_cod || ''}
//                                           onChange={(e) => handleVendorPricingChange(index, 'minimum_cod', e.target.value)}
//                                           className={`w-20 border px-2 dark:bg-gray-800 py-1 rounded ${isVendorFieldChanged(index, 'minimum_cod')
//                                             ? 'border-green-500 bg-green-50'
//                                             : 'border-gray-300'
//                                             }`}
//                                         />
//                                       </td>
//                                     </tr>
//                                   );
//                                 });
//                               });

//                               return rows;
//                             })()}
//                           </tbody>
//                         </table>
//                       </div>
//                     </form>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Create Plan Modal */}
//         {planModel && (
//           <div className="fixed inset-0  bg-opacity-50 backdrop-blur flex items-center justify-center z-50 ">
//             <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
//               <div className="bg-[#0446DB] text-white p-6 rounded-t-xl">
//                 <div className="flex justify-between items-center">
//                   <h2 className="text-xl font-bold">Create New Plan</h2>
//                   <button
//                     onClick={() => setPlanModel(false)}
//                     className="text-white hover:text-gray-200 transition-colors duration-200"
//                   >
//                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                     </svg>
//                   </button>
//                 </div>
//                 <p className="text-indigo-200 mt-1">Add a new pricing plan to your system</p>
//               </div>

//               <form onSubmit={handleSubmit} className="p-5">
//                 <div className="space-y-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Plan Name *
//                     </label>
//                     <input
//                       type="text"
//                       name="plan_name"
//                       value={formData.plan_name}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0446DB] focus:border-transparent transition-all duration-200"
//                       placeholder="Enter plan name"
//                     />
//                   </div>

//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Plan Type *
//                     </label>
//                     <select
//                       name="plan_type"
//                       value={formData.plan_type}
//                       onChange={handleInputChange}
//                       required
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0446DB] focus:border-transparent transition-all duration-200"
//                     >
//                       <option value="">Select plan type</option>
//                       <option value="Standard">Standard</option>
//                       <option value="percentage">Percentage</option>
//                     </select>
//                   </div>
//                   {
//                     formData.plan_type === 'percentage' && (
//                       <div>
//                         <label className="block text-sm font-medium text-gray-700 mb-2">
//                           percentage_value *
//                         </label>
//                         <input
//                           type="text"
//                           name="percentage_value"
//                           value={formData.percentage_value}
//                           onChange={handleInputChange}
//                           required
//                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0446DB] focus:border-transparent transition-all duration-200"
//                           placeholder="Enter plan name"
//                         />
//                       </div>
//                     )
//                   }

//                 </div>

//                 <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
//                   <button
//                     type="button"
//                     onClick={() => setPlanModel(false)}
//                     className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="flex-1 px-4 py-2 bg-[#0446DB] cursor-pointer text-white rounded-lg  transition-colors duration-200 font-medium"
//                   >
//                     Create Plan
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// }

// export default PricingPlans;

import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  RefreshCw,
  Eye,
  Pencil,
  X,
  Loader2,
  Package,
  ArrowLeft,
} from "lucide-react";

const baseURL = import.meta.env.VITE_BASE_URL;
const fields = [
  ["slab", "Slab (g)"],
  ["additional", "Additional"],
  ["sdd", "SDD"],
  ["ndd", "NDD"],
  // ["hld30min", "HLD 30 min"],
  // ["hld60min", "HLD 60 min"],
  // ["hld120min", "HLD 120 min"],
  // ["hld4hrs", "HLD 4 hrs"],
  ["additional_sdd", "Add. SDD"],
  ["additional_ndd", "Add. NDD"],
  // ["additional_hld30min", "Add. HLD 30 min"],
  // ["additional_hld60min", "Add. HLD 60 min"],
  // ["additional_hld120min", "Add. HLD 120 min"],
  // ["additional_hld4hrs", "Add. HLD 4 hrs"],
  ["cod_percentage", "COD %"],
  ["minimum_cod", "Min COD"],
  ["rto_percentage", "RTO %"],
];
const auth = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});
const errorMessage = (error, fallback) =>
  error?.response?.data?.message || fallback;
const getId = (plan) => plan?.plan_id ?? plan?.id;
const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50";

export default function PricingPlans() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ plan_name: "", plan_type: "custom" });
  const [errors, setErrors] = useState({});
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [details, setDetails] = useState([]);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const loadPlans = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseURL}/api/admin/getAllPlans`, {
        headers: auth(),
      });
      setPlans(Array.isArray(response.data?.data) ? response.data.data : []);
    } catch (error) {
      toast.error(errorMessage(error, "Unable to fetch pricing plans"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPlans();
  }, [loadPlans]);

  const filtered = useMemo(
    () =>
      plans.filter(
        (p) =>
          String(p.plan_name ?? "")
            .toLowerCase()
            .includes(search.trim().toLowerCase()) ||
          String(getId(p) ?? "").includes(search.trim()),
      ),
    [plans, search],
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const visiblePlans = filtered.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage,
  );

  const viewDetails = async (plan) => {
    const id = getId(plan);
    if (id == null) {
      toast.error("Plan ID is missing");
      return;
    }
    setSelectedPlan(plan);
    setDetails([]);
    setDetailLoading(true);
    try {
      const response = await axios.get(
        `${baseURL}/api/admin/getPlanWithComparison/${encodeURIComponent(id)}`,
        { headers: auth() },
      );
      const rows = Array.isArray(response.data?.data) ? response.data.data : [];
      // A new plan returns a single placeholder with null slab and id; this is not a saved slab.
      setDetails(
        rows.filter(
          (row) => row && row.slab != null && String(row.slab).trim() !== "",
        ),
      );
    } catch (error) {
      toast.error(errorMessage(error, "Unable to load plan details"));
    } finally {
      setDetailLoading(false);
    }
  };

  const createPlan = async (event) => {
    event.preventDefault();
    const name = form.plan_name.trim();
    const type = form.plan_type.trim();
    const nextErrors = {};
    if (name.length < 2 || name.length > 100)
      nextErrors.plan_name = "Enter a plan name between 2 and 100 characters";
    else if (!/^[\p{L}\p{N}][\p{L}\p{N} ._()&/-]*$/u.test(name))
      nextErrors.plan_name = "Plan name contains unsupported characters";
    if (!type || type.length > 50 || !/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(type))
      nextErrors.plan_type = "Enter a valid plan type";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    setCreating(true);
    try {
      const response = await axios.post(
        `${baseURL}/api/admin/createPlan`,
        { plan_name: name, plan_type: type },
        { headers: { ...auth(), "Content-Type": "application/json" } },
      );
      toast.success(response.data?.message || "Plan created successfully");
      setModal(false);
      setForm({ plan_name: "", plan_type: "custom" });
      await loadPlans();
      const id =
        response.data?.plan_id ??
        response.data?.data?.plan_id ??
        response.data?.data?.id;
      if (id != null) navigate(`/admin/updatePlanDetails/${id}`);
      else
        toast.info("Plan created. Select Edit Details to add pricing slabs.");
    } catch (error) {
      toast.error(errorMessage(error, "Failed to create plan"));
    } finally {
      setCreating(false);
    }
  };


  const [loadingPage, setLoadingPage] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoadingPage(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    
      loadingPage ? (
        <div className=" w-full h-[90vh] flex justify-center items-center">
            <div>
              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
              <p className="mt-2"> Loading Pricing Plans Details...</p>
            </div>
          </div>
      ):(

        <div className="flex h-[calc(100dvh-80px)] min-h-0 w-full flex-col overflow-hidden bg-[#f5f8fb] text-slate-900 dark:bg-neutral-950 dark:text-white">
          <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-slate-200  px-5 pb-4 dark:border-neutral-800 dark:bg-neutral-900">
            <div>
              <h1 className="text-xl font-semibold">Pricing Plans</h1>
              <p className="mt-1 text-xs text-slate-500 dark:text-neutral-400">
                Manage pricing plans and weight-based rate slabs
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={loadPlans}
                disabled={loading}
                className={`${buttonBase} border border-slate-200 bg-white hover:bg-slate-50 dark:border-neutral-700 dark:bg-neutral-800`}
              >
                <RefreshCw size={16} className={loading ? "animate-spin" : ""} />{" "}
                Refresh
              </button>
              <button
                type="button"
                onClick={() => {
                  setErrors({});
                  setModal(true);
                }}
                className={`${buttonBase} bg-[#0446DB] text-white hover:bg-[#0039b6]`}
              >
                <Plus size={16} /> Create Plan
              </button>
            </div>
          </header>
    
          <main className="flex min-h-0 flex-1 flex-col ">
            <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-sm border border-slate-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3 dark:border-neutral-800">
                <div className="flex items-center gap-2">
                  {selectedPlan && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPlan(null);
                        setDetails([]);
                      }}
                      className="rounded-md border border-slate-200 p-2 hover:bg-slate-50 dark:border-neutral-700"
                      aria-label="Back to plans"
                    >
                      <ArrowLeft size={16} />
                    </button>
                  )}
                  <div>
                    
                    <p className="text-xs text-slate-500">
                      {selectedPlan
                        ? `Plan ID: ${getId(selectedPlan)}`
                        : `${filtered.length} plans found`}
                    </p>
                  </div>
                </div>
                {selectedPlan ? (
                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/admin/updatePlanDetails/${getId(selectedPlan)}`)
                    }
                    className={`${buttonBase} bg-[#0446DB] text-white`}
                  >
                    <Pencil size={15} /> Edit Details
                  </button>
                ) : (
                  <div className="relative w-full max-w-xs">
                    <Search
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                      }}
                      placeholder="Search plan name or ID"
                      maxLength={100}
                      className="w-full rounded-md border border-slate-200 bg-transparent py-2 pl-9 pr-3 text-sm outline-none focus:border-[#0446DB] dark:border-neutral-700"
                    />
                  </div>
                )}
              </div>
              <div className="min-h-0 flex-1 overflow-auto overscroll-contain">
                {selectedPlan ? (
                  detailLoading ? (
                    <div className="flex h-full items-center justify-center gap-2 text-sm text-slate-500">
                      <Loader2 className="animate-spin" size={18} /> Loading plan
                      details...
                    </div>
                  ) : details.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
                      <Package className="text-slate-400" size={30} />
                      <h3 className="font-semibold">No pricing slabs added</h3>
                      <p className="max-w-md text-sm text-slate-500">
                        This plan exists but has no detail records. Add its first
                        slab using Edit Details.
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          navigate(
                            `/admin/updatePlanDetails/${getId(selectedPlan)}`,
                          )
                        }
                        className={`${buttonBase} bg-[#0446DB] text-white`}
                      >
                        Add Pricing Slab
                      </button>
                    </div>
                  ) : (
                    <table className="min-w-max w-full border-separate border-spacing-0 text-sm">
                      <thead className="sticky top-0 z-20">
                        <tr>
                          {fields.map(([key, label]) => (
                            <th
                              key={key}
                              className="whitespace-nowrap border-b border-slate-200 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase text-slate-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                            >
                              {label}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {details.map((row, i) => (
                          <tr
                            key={row.id ?? `${row.slab}-${i}`}
                            className="hover:bg-blue-50/50 dark:hover:bg-neutral-800/70"
                          >
                            {fields.map(([key]) => (
                              <td
                                key={key}
                                className="whitespace-nowrap border-b border-slate-100 px-4 py-3 dark:border-neutral-800"
                              >
                                {row[key] == null ? "—" : String(row[key])}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )
                ) : (
                  <table className="w-full min-w-[680px] border-separate border-spacing-0 text-sm">
                    <thead className="sticky top-0 z-20">
                      <tr>
                        {["Plan ID", "Plan Name", "Plan Type", "Actions"].map(
                          (label) => (
                            <th
                              key={label}
                              className="border-b border-slate-200 bg-slate-50 px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                            >
                              {label}
                            </th>
                          ),
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {visiblePlans.map((plan, i) => (
                        <tr
                          key={getId(plan) ?? i}
                          className="hover:bg-blue-50/50 dark:hover:bg-neutral-800/70"
                        >
                          <td className="border-b border-slate-100 px-5 py-4 font-medium dark:border-neutral-800">
                            {getId(plan) ?? "—"}
                          </td>
                          <td className="border-b border-slate-100 px-5 py-4 font-semibold capitalize dark:border-neutral-800">
                            {plan.plan_name ?? "—"}
                          </td>
                          <td className="border-b border-slate-100 px-5 py-4 dark:border-neutral-800">
                            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs capitalize text-[#0446DB] dark:bg-blue-950">
                              {plan.plan_type ?? "—"}
                            </span>
                          </td>
                          <td className="border-b border-slate-100 px-5 py-4 dark:border-neutral-800">
                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => viewDetails(plan)}
                                className={`${buttonBase} border border-slate-200 px-3 py-1.5 dark:border-neutral-700`}
                              >
                                <Eye size={14} /> View
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  navigate(
                                    `/admin/updatePlanDetails/${getId(plan)}`,
                                  )
                                }
                                className={`${buttonBase} bg-[#0446DB] px-3 py-1.5 text-white`}
                              >
                                <Pencil size={14} /> Edit Details
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
                {!selectedPlan && !loading && filtered.length === 0 && (
                  <div className="p-12 text-center text-sm text-slate-500">
                    No plans found.
                  </div>
                )}
              </div>
              {!selectedPlan && (
                <footer className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white px-4 py-3 text-sm dark:border-neutral-800 dark:bg-neutral-900">
                  <span className="text-slate-500">
                    Showing {filtered.length ? (currentPage - 1) * perPage + 1 : 0}–
                    {Math.min(currentPage * perPage, filtered.length)} of{" "}
                    {filtered.length}
                  </span>
                  <div className="flex items-center gap-2">
                    <label htmlFor="plan-page-size" className="text-slate-500">
                      Rows
                    </label>
                    <select
                      id="plan-page-size"
                      value={perPage}
                      onChange={(e) => {
                        setPerPage(Number(e.target.value));
                        setPage(1);
                      }}
                      className="rounded border border-slate-200 bg-transparent px-2 py-1 dark:border-neutral-700"
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                    </select>
                    <button
                      type="button"
                      disabled={currentPage <= 1}
                      onClick={() => setPage((p) => p - 1)}
                      className={`${buttonBase} border border-slate-200 px-3 py-1 disabled:opacity-40 dark:border-neutral-700`}
                    >
                      Previous
                    </button>
                    <span>
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      type="button"
                      disabled={currentPage >= totalPages}
                      onClick={() => setPage((p) => p + 1)}
                      className={`${buttonBase} border border-slate-200 px-3 py-1 disabled:opacity-40 dark:border-neutral-700`}
                    >
                      Next
                    </button>
                  </div>
                </footer>
              )}
            </section>
          </main>
          {modal && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
              onMouseDown={(e) => {
                if (e.target === e.currentTarget && !creating) setModal(false);
              }}
            >
              <form
                onSubmit={createPlan}
                className="w-full max-w-md rounded-xl bg-white p-6 shadow-2xl dark:bg-neutral-900"
              >
                <div className="mb-5 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Create Pricing Plan</h2>
                  <button
                    type="button"
                    disabled={creating}
                    onClick={() => setModal(false)}
                    aria-label="Close"
                  >
                    <X size={20} />
                  </button>
                </div>
                <label
                  className="mb-1 block text-sm font-medium"
                  htmlFor="plan-name"
                >
                  Plan Name *
                </label>
                <input
                  id="plan-name"
                  value={form.plan_name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, plan_name: e.target.value }))
                  }
                  maxLength={100}
                  placeholder="e.g. Premium"
                  className="mb-1 w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 outline-none focus:border-[#0446DB] dark:border-neutral-700"
                />
                {errors.plan_name && (
                  <p className="mb-3 text-xs text-red-600">{errors.plan_name}</p>
                )}
                <label
                  className="mb-1 mt-4 block text-sm font-medium"
                  htmlFor="plan-type"
                >
                  Plan Type *
                </label>
                <input
                  id="plan-type"
                  value={form.plan_type}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, plan_type: e.target.value }))
                  }
                  maxLength={50}
                  placeholder="custom"
                  className="mb-1 w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 outline-none focus:border-[#0446DB] dark:border-neutral-700"
                />
                {errors.plan_type && (
                  <p className="text-xs text-red-600">{errors.plan_type}</p>
                )}
                <p className="mt-3 text-xs text-slate-500">
                  Creating a plan does not automatically add pricing slabs.
                </p>
                <div className="mt-6 flex justify-end gap-2">
                  <button
                    type="button"
                    disabled={creating}
                    onClick={() => setModal(false)}
                    className={`${buttonBase} border border-slate-200 dark:border-neutral-700`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className={`${buttonBase} bg-[#0446DB] text-white`}
                  >
                    {creating && <Loader2 size={15} className="animate-spin" />}{" "}
                    Create Plan
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )
    
  );
}
