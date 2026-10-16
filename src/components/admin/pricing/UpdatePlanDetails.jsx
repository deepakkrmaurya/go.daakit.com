// // import "leaflet/dist/leaflet.css";
// // import { useState, useEffect } from "react";
// // import Loader from "../../Loader";
// // import { useParams } from "react-router-dom";
// // import axios from "axios";
// // import { toast } from "react-toastify";

// // const baseURL = import.meta.env.VITE_BASE_URL;

// // function UpdatePlanDetails() {
// //     const [loading, setLoading] = useState(false);
// //     const [formData, setFormData] = useState({});
// //     const { plan_id } = useParams();
// //     const [pricing, setPricing] = useState([]);

// //     useEffect(() => {
// //         (async () => {
// //             setLoading(true);
// //             try {
// //                 const res = await axios.get(`${baseURL}/api/admin/getPlanWithComparison/${plan_id}`,
// //                     {
// //                         headers: {
// //                             Authorization: `Bearer ${localStorage.getItem("token")}`,
// //                         },
// //                     }
// //                 );

// //                 // Extract plan_pricing from the response
// //                 const pricingData = res?.data?.data.map(({ plan_pricing }) => plan_pricing);
// //                 setPricing(pricingData);

// //                 // Initialize form data with the actual API response
// //                 const initialFormData = {};
// //                 pricingData?.forEach(plan => {
// //                     initialFormData[plan?.slab] = { ...plan };
// //                 });
// //                 setFormData(initialFormData);

// //             } catch (error) {
// //                 console.error("Error fetching plan data:", error);
// //                 toast.error("Error fetching plan data");
// //             } finally {
// //                 setLoading(false);
// //             }
// //         })();
// //     }, [plan_id]);

// //     const handleInputChange = (slab, field, value) => {
// //         setFormData(prev => ({
// //             ...prev,
// //             [slab]: {
// //                 ...prev[slab],
// //                 [field]: value
// //             }
// //         }));
// //     };

// //     const handleSubmit = async (e) => {
// //         e.preventDefault();
// //         setLoading(true);

// //         // Prepare data in the required format
// //         const submitData = {
// //             slabs: Object.keys(formData).map(slab => ({
// //                 slab: formData[slab]?.slab,
// //                 sdd: formData[slab]?.sdd,
// //                 ndd: formData[slab]?.ndd,
// //                 turant: formData[slab]?.turant,
// //                 additional_sdd: formData[slab]?.additional_sdd,
// //                 additional_ndd: formData[slab]?.additional_ndd,
// //                 additional_turant: formData[slab]?.additional_turant,
// //                 cod_percentage: formData[slab]?.cod_percentage,
// //                 additional: formData[slab]?.additional,
// //                 minimum_cod: formData[slab]?.minimum_cod
// //             }))
// //         };

// //         try {
// //             const res = await axios.post(
// //                 `${baseURL}/api/admin/updatePlanDetails/${plan_id}`,
// //                 submitData,
// //                 {
// //                     headers: {
// //                         Authorization: `Bearer ${localStorage.getItem("token")}`,
// //                         'Content-Type': 'application/json'
// //                     },
// //                 }
// //             );

// //             toast.success(res.data.message);

// //         } catch (error) {
// //             console.error("Error updating plan:", error);
// //             toast.error("Error updating plan pricing. Please try again.");
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     return (
// //         <>
// //             {loading ? (
// //                 <Loader />
// //             ) : (
// //                 <div className="bg-gray-100 dark:bg-gray-900 min-h-screen w-full">
// //                     {/* Heading Strip */}
// //                     <div className="relative z-0 mb-6 bg-[rgb(85,77,192)] dark:bg-gray-900 py-[33px] shadow-md h-38 px-[24px]">
// //                         <div className="flex flex-wrap items-center justify-between w-full">
// //                             {/* Heading */}
// //                             <h1 className="text-2xl text-white">Update Plan Details</h1>
// //                             <div className="ml-auto w-[200px] z-50 relative">
// //                                 {/* Additional content can go here */}
// //                             </div>
// //                         </div>
// //                     </div>

// //                     <div className="px-1 z-99">
// //                         <div className="-mt-20 md:-mt-24 relative">
// //                             <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
// //                                 <div className="mb-6">

// //                                     <p className="text-gray-600 dark:text-white">
// //                                         Update pricing details for each weight slab
// //                                     </p>
// //                                 </div>

// //                                 <div className="overflow-x-auto">
// //                                     <table className="min-w-full border-collapse border border-gray-300">
// //                                         <thead>
// //                                             <tr className="bg-gray-50 dark:bg-gray-900">
// //                                                 <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border border-gray-300">
// //                                                     Slab (grams)
// //                                                 </th>
// //                                                 <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border border-gray-300">
// //                                                     Additional Weight
// //                                                 </th>
// //                                                 <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border border-gray-300">
// //                                                     SDD
// //                                                 </th>
// //                                                 <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border border-gray-300">
// //                                                     NDD
// //                                                 </th>
// //                                                 <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border border-gray-300">
// //                                                     Turant
// //                                                 </th>
// //                                                 <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border border-gray-300">
// //                                                     Additional SDD
// //                                                 </th>
// //                                                 <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border border-gray-300">
// //                                                     Additional NDD
// //                                                 </th>
// //                                                 <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border border-gray-300">
// //                                                     Additional Turant
// //                                                 </th>
// //                                                 <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border border-gray-300">
// //                                                     COD Percentage
// //                                                 </th>
// //                                                 <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border border-gray-300">
// //                                                     Minimum COD
// //                                                 </th>
// //                                             </tr>
// //                                         </thead>
// //                                         <tbody>
// //                                             {pricing?.map((plan, index) => (
// //                                                 <tr
// //                                                     key={plan?.slab}
// //                                                     className={`transition-colors dark:bg-gray-900 duration-150 ${
// //                                                         index % 2 === 0 ? "bg-white" : "bg-gray-50"
// //                                                     } hover:bg-indigo-50 dark:hover:bg-gray-800`}
// //                                                 >
// //                                                     {/* Slab - Read Only */}
// //                                                     <td className="py-4 px-4 text-gray-600 dark:text-white font-medium border border-gray-300">
// //                                                         {plan?.slab}
// //                                                     </td>

// //                                                     {/* Additional Weight */}
// //                                                     <td className="py-2 px-4 border border-gray-300 dark:text-white">
// //                                                         {/* <input
// //                                                             type="text"
// //                                                             value={formData[plan.slab]?.additional || ""}
// //                                                             onChange={(e) => handleInputChange(plan.slab, 'additional', e.target.value)}
// //                                                             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                                                             placeholder="Additional weight"
// //                                                         /> */}
// //                                                         {formData[plan?.slab]?.additional || ""}
// //                                                     </td>

// //                                                     {/* SDD */}
// //                                                     <td className="py-2 px-4 border border-gray-300 dark:text-white">
// //                                                         <input
// //                                                             type="text"
// //                                                             value={formData[plan?.slab]?.sdd || ""}
// //                                                             onChange={(e) => handleInputChange(plan?.slab, 'sdd', e.target.value)}
// //                                                             className="w-18 px-3 py-2 border dark:text-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                                                             placeholder="SDD"
// //                                                         />
// //                                                     </td>

// //                                                     {/* NDD */}
// //                                                     <td className="py-2 px-4 border border-gray-300 dark:text-white">
// //                                                         <input
// //                                                             type="text"
// //                                                             value={formData[plan?.slab]?.ndd || ""}
// //                                                             onChange={(e) => handleInputChange(plan?.slab, 'ndd', e.target.value)}
// //                                                             className="w-18 px-3 py-2 border border-gray-300 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                                                             placeholder="NDD"
// //                                                         />
// //                                                     </td>

// //                                                     {/* Turant */}
// //                                                     <td className="py-2 px-4 border border-gray-300 dark:text-white">
// //                                                         <input
// //                                                             type="text"
// //                                                             value={formData[plan?.slab]?.turant || ""}
// //                                                             onChange={(e) => handleInputChange(plan?.slab, 'turant', e.target.value)}
// //                                                             className="w-18 px-3 py-2 border border-gray-300 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                                                             placeholder="Turant"
// //                                                         />
// //                                                     </td>

// //                                                     {/* Additional SDD */}
// //                                                     <td className="py-2 px-4 border border-gray-300 dark:text-white">
// //                                                         <input
// //                                                             type="text"
// //                                                             value={formData[plan?.slab]?.additional_sdd || ""}
// //                                                             onChange={(e) => handleInputChange(plan?.slab, 'additional_sdd', e.target.value)}
// //                                                             className="w-full px-3 py-2 border border-gray-300 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                                                             placeholder="Additional SDD"
// //                                                         />
// //                                                     </td>

// //                                                     {/* Additional NDD */}
// //                                                     <td className="py-2 px-4 border border-gray-300 dark:text-white">
// //                                                         <input
// //                                                             type="text"
// //                                                             value={formData[plan?.slab]?.additional_ndd || ""}
// //                                                             onChange={(e) => handleInputChange(plan?.slab, 'additional_ndd', e.target.value)}
// //                                                             className="w-full px-3 py-2 border border-gray-300 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                                                             placeholder="Additional NDD"
// //                                                         />
// //                                                     </td>

// //                                                     {/* Additional Turant */}
// //                                                     <td className="py-2 px-4 border border-gray-300 dark:text-white">
// //                                                         <input
// //                                                             type="text"
// //                                                             value={formData[plan?.slab]?.additional_turant || ""}
// //                                                             onChange={(e) => handleInputChange(plan?.slab, 'additional_turant', e.target.value)}
// //                                                             className="w-full px-3 py-2 border border-gray-300 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                                                             placeholder="Additional Turant"
// //                                                         />
// //                                                     </td>

// //                                                     {/* COD Percentage */}
// //                                                     <td className="py-2 px-4 border border-gray-300 dark:text-white">
// //                                                         <input
// //                                                             type="text"
// //                                                             value={formData[plan?.slab]?.cod_percentage || ""}
// //                                                             onChange={(e) => handleInputChange(plan?.slab, 'cod_percentage', e.target.value)}
// //                                                             className="w-full px-3 py-2 border border-gray-300 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                                                             placeholder="COD %"
// //                                                         />
// //                                                     </td>

// //                                                     {/* Minimum COD */}
// //                                                     <td className="py-2 px-4 border border-gray-300 dark:text-white">
// //                                                         <input
// //                                                             type="text"
// //                                                             value={formData[plan?.slab]?.minimum_cod || ""}
// //                                                             onChange={(e) => handleInputChange(plan?.slab, 'minimum_cod', e.target.value)}
// //                                                             className="w-full px-3 py-2 border border-gray-300 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
// //                                                             placeholder="Min COD"
// //                                                         />
// //                                                     </td>
// //                                                 </tr>
// //                                             ))}
// //                                         </tbody>
// //                                     </table>
// //                                 </div>

// //                                 <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-gray-200">
// //                                     <button
// //                                         type="button"
// //                                         onClick={() => window.history.back()}
// //                                         className="px-6 py-2 border dark:text-white border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
// //                                     >
// //                                         Cancel
// //                                     </button>
// //                                     <button
// //                                         type="submit"
// //                                         className="px-6 py-2 bg-[#554dc0] dark:text-white text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
// //                                     >
// //                                         Update Plans
// //                                     </button>
// //                                 </div>
// //                             </form>
// //                         </div>
// //                     </div>
// //                 </div>
// //             )}
// //         </>
// //     );
// // }

// // export default UpdatePlanDetails;

// // import "leaflet/dist/leaflet.css";

// // import { useState, useEffect } from "react";

// // import Loader from "../../Loader";

// // import { useParams } from "react-router-dom";

// // import axios from "axios";

// // import { toast } from "react-toastify";
// // import { Loader2 } from "lucide-react";

// // const baseURL = import.meta.env.VITE_BASE_URL;

// // function UpdatePlanDetails() {

// //     const [loading, setLoading] = useState(false);

// //     const [formData, setFormData] = useState({});

// //     const { plan_id } = useParams();

// //     const [pricing, setPricing] = useState([]);

// //     useEffect(() => {

// //         (async () => {

// //             setLoading(true);

// //             try {

// //                 const res = await axios.get(`${baseURL}/api/admin/getPlanWithComparison/${plan_id}`,

// //                     {

// //                         headers: {

// //                             Authorization: `Bearer ${localStorage.getItem("token")}`,

// //                         },

// //                     }

// //                 );

// //                 // Extract plan_pricing from the response

// //                 const pricingData = res?.data?.data.map(({ plan_pricing }) => plan_pricing);

// //                 setPricing(pricingData);

// //                 // Initialize form data with the actual API response

// //                 const initialFormData = {};

// //                 pricingData?.forEach(plan => {

// //                     initialFormData[plan?.slab] = { ...plan };

// //                 });

// //                 setFormData(initialFormData);

// //             } catch (error) {

// //                 console.error("Error fetching plan data:", error);

// //                 toast.error("Error fetching plan data");

// //             } finally {

// //                 setLoading(false);

// //             }

// //         })();

// //     }, [plan_id]);

// //     const handleInputChange = (slab, field, value) => {

// //         setFormData(prev => ({

// //             ...prev,

// //             [slab]: {

// //                 ...prev[slab],

// //                 [field]: value

// //             }

// //         }));

// //     };

// //     const handleSubmit = async (e) => {

// //         e.preventDefault();

// //         setLoading(true);

// //         // Prepare data in the required format

// //         const submitData = {

// //             slabs: Object.keys(formData).map(slab => ({

// //                 slab: formData[slab]?.slab,

// //                 sdd: formData[slab]?.sdd,

// //                 ndd: formData[slab]?.ndd,

// //                 turant: formData[slab]?.turant,

// //                 additional_sdd: formData[slab]?.additional_sdd,

// //                 additional_ndd: formData[slab]?.additional_ndd,

// //                 additional_turant: formData[slab]?.additional_turant,

// //                 cod_percentage: formData[slab]?.cod_percentage,

// //                 additional: formData[slab]?.additional,

// //                 minimum_cod: formData[slab]?.minimum_cod

// //             }))

// //         };

// //         try {

// //             const res = await axios.post(

// //                 `${baseURL}/api/admin/updatePlanDetails/${plan_id}`,

// //                 submitData,

// //                 {

// //                     headers: {

// //                         Authorization: `Bearer ${localStorage.getItem("token")}`,

// //                         'Content-Type': 'application/json'

// //                     },

// //                 }

// //             );

// //             toast.success(res.data.message);

// //         } catch (error) {

// //             console.error("Error updating plan:", error);

// //             toast.error("Error updating plan pricing. Please try again.");

// //         } finally {

// //             setLoading(false);

// //         }

// //     };

// //      const [loadingPage, setLoadingPage] = useState(true);

// //   useEffect(() => {
// //     const timer = setTimeout(() => {
// //       setLoadingPage(false);
// //     }, 2000);

// //     return () => clearTimeout(timer);
// //   }, []);

// //     return (

// //         <>

// //             {loadingPage ? (

// //                  <div className=" w-full h-[90vh] flex justify-center items-center">
// //             <div>
// //               <Loader2 className="h-8 w-8 animate-spin mx-auto" />
// //               <p className="mt-2"> Loading Plan Details...</p>
// //             </div>
// //           </div>

// //             ) : (

// //                 <div className="flex h-[calc(99dvh-80px)] min-h-0 w-full flex-col overflow-hidden bg-[#f5f8fb] dark:bg-neutral-900">

// //                     {/* Heading Strip */}

// //                     <div className="z-20 shrink-0 border-b pb-4 dark:border-gray-700 dark:bg-gray-900">

// //                         <div className="flex flex-wrap items-center justify-between w-full">

// //                             {/* Heading */}

// //                             <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Update Plan Details</h1>

// //                             <div className="ml-auto w-[200px] z-50 relative">

// //                                 {/* Additional content can go here */}

// //                             </div>

// //                         </div>

// //                     </div>

// //                     <div className="flex min-h-0 flex-1 flex-col p-3">

// //                         <div className="flex min-h-0 flex-1 flex-col">

// //                             <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-sm border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">

// //                                 <div className="mb-4 shrink-0">
// //                                     <p className="text-gray-600 dark:text-white">

// //                                         Update pricing details for each weight slab

// //                                     </p>

// //                                 </div>
// //                                 <div className="min-h-0 flex-1 overflow-auto overscroll-contain">

// //                                     <table className="min-w-full border-collapse border border-gray-300">

// //                                         <thead className="sticky top-0 z-20 bg-gray-50 dark:bg-gray-800">

// //                                             <tr className="bg-gray-50 dark:bg-gray-800">

// //                                                 <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border border-gray-300">

// //                                                     Slab (grams)

// //                                                 </th>

// //                                                 <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border border-gray-300">

// //                                                     Additional Weight

// //                                                 </th>

// //                                                 <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border border-gray-300">

// //                                                     SDD

// //                                                 </th>

// //                                                 <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border border-gray-300">

// //                                                     NDD

// //                                                 </th>

// //                                                 <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border border-gray-300">

// //                                                     Turant

// //                                                 </th>

// //                                                 <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border border-gray-300">

// //                                                     Additional SDD

// //                                                 </th>

// //                                                 <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border border-gray-300">

// //                                                     Additional NDD

// //                                                 </th>

// //                                                 <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border border-gray-300">

// //                                                     Additional Turant

// //                                                 </th>

// //                                                 <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border border-gray-300">

// //                                                     COD Percentage

// //                                                 </th>

// //                                                 <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border border-gray-300">

// //                                                     Minimum COD

// //                                                 </th>

// //                                             </tr>

// //                                         </thead>

// //                                         <tbody>

// //                                             {pricing?.map((plan, index) => (

// //                                                 <tr

// //                                                     key={plan?.slab}

// //                                                     className={`transition-colors dark:bg-gray-900 duration-150 ${

// //                                                         index % 2 === 0 ? "bg-white" : "bg-gray-50"

// //                                                     } hover:bg-indigo-50 dark:hover:bg-gray-800`}

// //                                                 >

// //                                                     {/* Slab - Read Only */}

// //                                                     <td className="py-4 px-4 text-gray-600 dark:text-white font-medium border border-gray-300">

// //                                                         {plan?.slab}

// //                                                     </td>

// //                                                     {/* Additional Weight */}

// //                                                     <td className="py-2 px-4 border border-gray-300 dark:text-white">

// //                                                         {/* Additional Weight is read-only */}

// //                                                         {formData[plan?.slab]?.additional || ""}

// //                                                     </td>

// //                                                     {/* SDD */}

// //                                                     <td className="py-2 px-4 border border-gray-300 dark:text-white">

// //                                                         <input

// //                                                             type="text"

// //                                                             value={formData[plan?.slab]?.sdd || ""}

// //                                                             onChange={(e) => handleInputChange(plan?.slab, 'sdd', e.target.value)}

// //                                                             className="w-18 px-3 py-2 border dark:text-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"

// //                                                             placeholder="SDD"

// //                                                         />

// //                                                     </td>

// //                                                     {/* NDD */}

// //                                                     <td className="py-2 px-4 border border-gray-300 dark:text-white">

// //                                                         <input

// //                                                             type="text"

// //                                                             value={formData[plan?.slab]?.ndd || ""}

// //                                                             onChange={(e) => handleInputChange(plan?.slab, 'ndd', e.target.value)}

// //                                                             className="w-18 px-3 py-2 border border-gray-300 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"

// //                                                             placeholder="NDD"

// //                                                         />

// //                                                     </td>

// //                                                     {/* Turant */}

// //                                                     <td className="py-2 px-4 border border-gray-300 dark:text-white">

// //                                                         <input

// //                                                             type="text"

// //                                                             value={formData[plan?.slab]?.turant || ""}

// //                                                             onChange={(e) => handleInputChange(plan?.slab, 'turant', e.target.value)}

// //                                                             className="w-18 px-3 py-2 border border-gray-300 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"

// //                                                             placeholder="Turant"

// //                                                         />

// //                                                     </td>

// //                                                     {/* Additional SDD */}

// //                                                     <td className="py-2 px-4 border border-gray-300 dark:text-white">

// //                                                         <input

// //                                                             type="text"

// //                                                             value={formData[plan?.slab]?.additional_sdd || ""}

// //                                                             onChange={(e) => handleInputChange(plan?.slab, 'additional_sdd', e.target.value)}

// //                                                             className="w-full px-3 py-2 border border-gray-300 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"

// //                                                             placeholder="Additional SDD"

// //                                                         />

// //                                                     </td>

// //                                                     {/* Additional NDD */}

// //                                                     <td className="py-2 px-4 border border-gray-300 dark:text-white">

// //                                                         <input

// //                                                             type="text"

// //                                                             value={formData[plan?.slab]?.additional_ndd || ""}

// //                                                             onChange={(e) => handleInputChange(plan?.slab, 'additional_ndd', e.target.value)}

// //                                                             className="w-full px-3 py-2 border border-gray-300 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"

// //                                                             placeholder="Additional NDD"

// //                                                         />

// //                                                     </td>

// //                                                     {/* Additional Turant */}

// //                                                     <td className="py-2 px-4 border border-gray-300 dark:text-white">

// //                                                         <input

// //                                                             type="text"

// //                                                             value={formData[plan?.slab]?.additional_turant || ""}

// //                                                             onChange={(e) => handleInputChange(plan?.slab, 'additional_turant', e.target.value)}

// //                                                             className="w-full px-3 py-2 border border-gray-300 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"

// //                                                             placeholder="Additional Turant"

// //                                                         />

// //                                                     </td>

// //                                                     {/* COD Percentage */}

// //                                                     <td className="py-2 px-4 border border-gray-300 dark:text-white">

// //                                                         <input

// //                                                             type="text"

// //                                                             value={formData[plan?.slab]?.cod_percentage || ""}

// //                                                             onChange={(e) => handleInputChange(plan?.slab, 'cod_percentage', e.target.value)}

// //                                                             className="w-full px-3 py-2 border border-gray-300 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"

// //                                                             placeholder="COD %"

// //                                                         />

// //                                                     </td>

// //                                                     {/* Minimum COD */}

// //                                                     <td className="py-2 px-4 border border-gray-300 dark:text-white">

// //                                                         <input

// //                                                             type="text"

// //                                                             value={formData[plan?.slab]?.minimum_cod || ""}

// //                                                             onChange={(e) => handleInputChange(plan?.slab, 'minimum_cod', e.target.value)}

// //                                                             className="w-full px-3 py-2 border border-gray-300 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"

// //                                                             placeholder="Min COD"

// //                                                         />

// //                                                     </td>

// //                                                 </tr>

// //                                             ))}

// //                                         </tbody>

// //                                     </table>

// //                                 </div>

// //                                 <div className="mt-4 flex shrink-0 justify-end space-x-4 border-t border-gray-200 bg-white pt-4 dark:bg-gray-900">

// //                                     <button

// //                                         type="button"

// //                                         onClick={() => window.history.back()}

// //                                         className="px-6 py-2 border dark:text-white border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"

// //                                     >

// //                                         Cancel

// //                                     </button>

// //                                     <button

// //                                         type="submit"

// //                                         className="px-6 py-2 bg-[#0446DB] dark:text-white text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"

// //                                     >

// //                                         Update Plans

// //                                     </button>

// //                                 </div>

// //                             </form>

// //                         </div>

// //                     </div>

// //                 </div>

// //             )}

// //         </>

// //     );

// // }

// // export default UpdatePlanDetails;

// import React, { useCallback, useEffect, useMemo, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { useNavigate, useParams } from "react-router-dom";
// import { ArrowLeft, Plus, RefreshCw, Save, Loader2, Trash2 } from "lucide-react";

// const baseURL = import.meta.env.VITE_BASE_URL;
// const fields = [
//   ["slab", "Slab (g)"], ["additional", "Additional Weight"], ["sdd", "SDD"], ["ndd", "NDD"],
//   ["hld30min", "HLD 30 min"], ["hld60min", "HLD 60 min"], ["hld120min", "HLD 120 min"], ["hld4hrs", "HLD 4 hrs"],
//   ["additional_sdd", "Additional SDD"], ["additional_ndd", "Additional NDD"],
//   ["additional_hld30min", "Additional HLD 30 min"], ["additional_hld60min", "Additional HLD 60 min"],
//   ["additional_hld120min", "Additional HLD 120 min"], ["additional_hld4hrs", "Additional HLD 4 hrs"],
//   ["cod_percentage", "COD %"], ["minimum_cod", "Minimum COD"], ["rto_percentage", "RTO %"],
// ];
// const keys = fields.map(([key]) => key);
// const auth = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });
// const blankRow = () => Object.fromEntries(keys.map((key) => [key, key === "minimum_cod" ? "0" : ""]));
// const errorMessage = (error, fallback) => error?.response?.data?.message || fallback;
// const buttonBase = "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50";

// export default function UpdatePlanDetails() {
//   const { plan_id } = useParams();
//   const navigate = useNavigate();
//   const [rows, setRows] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [notFound, setNotFound] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [dirty, setDirty] = useState(false);
//   const [newRowKeys, setNewRowKeys] = useState([]);
//   const [nextKey, setNextKey] = useState(0);

//   const fetchDetails = useCallback(async () => {
//     setLoading(true);
//     setNotFound(false);
//     try {
//       const response = await axios.get(`${baseURL}/api/admin/getPlanWithComparison/${encodeURIComponent(plan_id)}`, { headers: auth() });
//       const data = Array.isArray(response.data?.data) ? response.data.data : [];
//       // Null-valued placeholder is returned for an existing plan without details.
//       const realRows = data.filter((r) => r && r.slab != null && String(r.slab).trim() !== "");
//       setRows(realRows.map((r, index) => ({ ...blankRow(), ...Object.fromEntries(keys.map((key) => [key, r[key] == null ? "" : String(r[key])])), _key: `saved-${r.id ?? index}` })));
//       setNewRowKeys([]);
//       setErrors({});
//       setDirty(false);
//     } catch (error) {
//       if (error?.response?.status === 404) setNotFound(true);
//       toast.error(errorMessage(error, "Failed to load plan details"));
//     } finally { setLoading(false); }
//   }, [plan_id]);

//   useEffect(() => { fetchDetails(); }, [fetchDetails]);

//   const updateField = (rowKey, field, value) => {
//     if (value !== "" && !/^\d*(?:\.\d{0,4})?$/.test(value)) return;
//     if (value.length > 18) return;
//     setRows((prev) => prev.map((r) => r._key === rowKey ? { ...r, [field]: value } : r));
//     setDirty(true);
//     setErrors((prev) => { const next = { ...prev }; delete next[`${rowKey}.${field}`]; return next; });
//   };

//   const addSlab = () => {
//     const key = `new-${nextKey}`;
//     setNextKey((n) => n + 1);
//     setRows((prev) => [...prev, { ...blankRow(), _key: key }]);
//     setNewRowKeys((prev) => [...prev, key]);
//     setDirty(true);
//   };

//   const removeNewSlab = (key) => {
//     // There is no delete endpoint in the supplied documentation; only unsaved rows can be removed.
//     if (!newRowKeys.includes(key)) return;
//     setRows((prev) => prev.filter((r) => r._key !== key));
//     setNewRowKeys((prev) => prev.filter((k) => k !== key));
//     setDirty(true);
//   };

//   const validation = useMemo(() => {
//     const next = {};
//     const slabs = new Set();
//     rows.forEach((r) => {
//       const slab = String(r.slab ?? "").trim();
//       if (!slab || !Number.isFinite(Number(slab)) || Number(slab) <= 0) next[`${r._key}.slab`] = "Slab must be greater than 0";
//       else if (slabs.has(Number(slab))) next[`${r._key}.slab`] = "Duplicate slab";
//       else slabs.add(Number(slab));
//       keys.filter((key) => key !== "slab").forEach((key) => {
//         const value = String(r[key] ?? "").trim();
//         if (value && (!/^\d+(?:\.\d{1,4})?$/.test(value) || !Number.isFinite(Number(value)))) next[`${r._key}.${key}`] = "Invalid non-negative number";
//         if (value && ["cod_percentage", "rto_percentage"].includes(key) && Number(value) > 100) next[`${r._key}.${key}`] = "Cannot exceed 100%";
//       });
//     });
//     return next;
//   }, [rows]);

//   const save = async (event) => {
//     event.preventDefault();
//     if (!rows.length) { toast.error("Add at least one pricing slab"); return; }
//     if (Object.keys(validation).length) { setErrors(validation); toast.error("Please correct the highlighted fields"); return; }
//     setSaving(true);
//     try {
//       const slabs = rows.map((row) => Object.fromEntries(keys.map((key) => [key, String(row[key] ?? "").trim() === "" ? (key === "minimum_cod" ? "0" : null) : String(row[key]).trim()])));
//       const response = await axios.post(`${baseURL}/api/admin/updatePlanDetails/${encodeURIComponent(plan_id)}`, { slabs }, { headers: { ...auth(), "Content-Type": "application/json" } });
//       toast.success(response.data?.message || "Pricing details saved successfully");
//       await fetchDetails();
//     } catch (error) { toast.error(errorMessage(error, "Unable to save pricing details")); }
//     finally { setSaving(false); }
//   };

//   const goBack = () => {
//     if (dirty && !window.confirm("You have unsaved changes. Leave this page?")) return;
//     navigate(-1);
//   };

//   return (
//     <div className="flex h-[calc(100dvh-80px)] min-h-0 w-full flex-col overflow-hidden bg-[#f5f8fb] text-slate-900 dark:bg-neutral-950 dark:text-white">
//       <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-5 py-4 dark:border-neutral-800 dark:bg-neutral-900"><div className="flex items-center gap-3"><button type="button" onClick={goBack} aria-label="Go back" className="rounded-md border border-slate-200 p-2 hover:bg-slate-50 dark:border-neutral-700"><ArrowLeft size={18} /></button><div><h1 className="text-xl font-semibold">Update Plan Details</h1><p className="mt-1 text-xs text-slate-500">Plan ID: {plan_id} · Manage pricing by weight slab</p></div></div><div className="flex items-center gap-2"><button type="button" onClick={() => { if (!dirty || window.confirm("Discard unsaved changes and reload?")) fetchDetails(); }} disabled={loading || saving} className={`${buttonBase} border border-slate-200 dark:border-neutral-700`}><RefreshCw size={16} /> Refresh</button><button type="button" onClick={addSlab} disabled={loading || saving || notFound} className={`${buttonBase} bg-[#0446DB] text-white hover:bg-blue-700`}><Plus size={16} /> Add Slab</button></div></header>
//       <form onSubmit={save} className="flex min-h-0 flex-1 flex-col p-3 sm:p-5"><section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900"><div className="shrink-0 border-b border-slate-200 px-4 py-3 dark:border-neutral-800"><h2 className="font-semibold">Weight Slab Pricing</h2><p className="mt-1 text-xs text-slate-500">{rows.length} slab(s) · Empty values are sent as null (minimum COD defaults to 0)</p></div>
//         <div className="min-h-0 flex-1 overflow-auto overscroll-contain">
//           {loading ? <div className="flex h-full items-center justify-center gap-2 text-sm text-slate-500"><Loader2 size={20} className="animate-spin" /> Loading plan details...</div> : notFound ? <div className="p-12 text-center text-sm text-red-600">Plan not found (404). Check the plan ID.</div> : rows.length === 0 ? <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center"><p className="font-semibold">No pricing slabs yet</p><p className="text-sm text-slate-500">This plan has no detail rows. Add a slab to start configuring pricing.</p><button type="button" onClick={addSlab} className={`${buttonBase} bg-[#0446DB] text-white`}><Plus size={16} /> Add First Slab</button></div> :
//             <table className="w-full min-w-max border-separate border-spacing-0 text-sm"><thead className="sticky top-0 z-20"><tr>{fields.map(([key, label]) => <th key={key} className="whitespace-nowrap border-b border-slate-200 bg-slate-50 px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">{label}</th>)}<th className="sticky right-0 border-b border-slate-200 bg-slate-50 px-3 py-3 text-left text-xs font-semibold uppercase text-slate-600 dark:border-neutral-700 dark:bg-neutral-800">Action</th></tr></thead><tbody>{rows.map((row) => <tr key={row._key} className="hover:bg-blue-50/40 dark:hover:bg-neutral-800/60">{fields.map(([key, label]) => <td key={key} className="border-b border-slate-100 px-2 py-2 dark:border-neutral-800"><input aria-label={`${label} for slab ${row.slab || "new"}`} inputMode="decimal" value={row[key] ?? ""} onChange={(e) => updateField(row._key, key, e.target.value)} placeholder={key === "slab" ? "Required" : "—"} readOnly={key === "slab" && !newRowKeys.includes(row._key)} title={errors[`${row._key}.${key}`] || ""} className={`w-28 rounded-md border bg-white px-2.5 py-2 text-sm outline-none focus:border-[#0446DB] dark:bg-neutral-900 ${errors[`${row._key}.${key}`] ? "border-red-500" : "border-slate-200 dark:border-neutral-700"} ${key === "slab" && !newRowKeys.includes(row._key) ? "cursor-not-allowed bg-slate-100 font-semibold dark:bg-neutral-800" : ""}`} /></td>)}<td className="sticky right-0 border-b border-slate-100 bg-white px-3 py-2 dark:border-neutral-800 dark:bg-neutral-900">{newRowKeys.includes(row._key) ? <button type="button" onClick={() => removeNewSlab(row._key)} title="Remove unsaved slab" className="rounded-md p-2 text-red-600 hover:bg-red-50"><Trash2 size={16} /></button> : <span className="text-xs text-slate-400">Saved</span>}</td></tr>)}</tbody></table>}
//         </div>
//         <footer className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900"><p className="text-xs text-slate-500">{dirty ? "Unsaved changes" : "All changes saved"} · {Object.keys(errors).length ? `${Object.keys(errors).length} validation issue(s)` : "Ready"}</p><div className="flex items-center gap-2"><button type="button" onClick={goBack} className={`${buttonBase} border border-slate-200 dark:border-neutral-700`}>Cancel</button><button type="submit" disabled={loading || saving || notFound || rows.length === 0 || !dirty} className={`${buttonBase} bg-[#0446DB] text-white hover:bg-blue-700`}>{saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save Pricing</button></div></footer>
//       </section></form>
//     </div>
//   );
// }

// import React, { useCallback, useEffect, useMemo, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { useNavigate, useParams } from "react-router-dom";
// import { ArrowLeft, Plus, RefreshCw, Save, Loader2, Trash2 } from "lucide-react";

// const baseURL = import.meta.env.VITE_BASE_URL;
// const fields = [
//   ["slab", "Slab (g)"], ["additional", "Additional Weight"], ["sdd", "SDD"], ["ndd", "NDD"],
//   ["hld30min", "HLD 30 min"], ["hld60min", "HLD 60 min"], ["hld120min", "HLD 120 min"], ["hld4hrs", "HLD 4 hrs"],
//   ["additional_sdd", "Additional SDD"], ["additional_ndd", "Additional NDD"],
//   ["additional_hld30min", "Additional HLD 30 min"], ["additional_hld60min", "Additional HLD 60 min"],
//   ["additional_hld120min", "Additional HLD 120 min"], ["additional_hld4hrs", "Additional HLD 4 hrs"],
//   ["cod_percentage", "COD %"], ["minimum_cod", "Minimum COD"], ["rto_percentage", "RTO %"],
// ];
// const keys = fields.map(([key]) => key);
// const slabOptions = ["500", "2000", "5000", "10000"];
// const auth = () => ({ Authorization: `Bearer ${localStorage.getItem("token")}` });
// const blankRow = () => Object.fromEntries(keys.map((key) => [key, key === "minimum_cod" ? "0" : ""]));
// const errorMessage = (error, fallback) => error?.response?.data?.message || fallback;
// const buttonBase = "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50";

// export default function UpdatePlanDetails() {
//   const { plan_id } = useParams();
//   const navigate = useNavigate();
//   const [rows, setRows] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [notFound, setNotFound] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [dirty, setDirty] = useState(false);
//   const [newRowKeys, setNewRowKeys] = useState([]);
//   const [nextKey, setNextKey] = useState(0);

//   const fetchDetails = useCallback(async () => {
//     setLoading(true);
//     setNotFound(false);
//     try {
//       const response = await axios.get(`${baseURL}/api/admin/getPlanWithComparison/${encodeURIComponent(plan_id)}`, { headers: auth() });
//       const data = Array.isArray(response.data?.data) ? response.data.data : [];
//       // Null-valued placeholder is returned for an existing plan without details.
//       const realRows = data.filter((r) => r && r.slab != null && String(r.slab).trim() !== "");
//       setRows(realRows.map((r, index) => ({ ...blankRow(), ...Object.fromEntries(keys.map((key) => [key, r[key] == null ? "" : String(r[key])])), _key: `saved-${r.id ?? index}` })));
//       setNewRowKeys([]);
//       setErrors({});
//       setDirty(false);
//     } catch (error) {
//       if (error?.response?.status === 404) setNotFound(true);
//       toast.error(errorMessage(error, "Failed to load plan details"));
//     } finally { setLoading(false); }
//   }, [plan_id]);

//   useEffect(() => { fetchDetails(); }, [fetchDetails]);

//   const updateField = (rowKey, field, value) => {
//     if (value !== "" && !/^\d*(?:\.\d{0,4})?$/.test(value)) return;
//     if (value.length > 18) return;
//     setRows((prev) => prev.map((r) => r._key === rowKey ? { ...r, [field]: value } : r));
//     setDirty(true);
//     setErrors((prev) => { const next = { ...prev }; delete next[`${rowKey}.${field}`]; return next; });
//   };

//   const addSlab = () => {
//     const key = `new-${nextKey}`;
//     setNextKey((n) => n + 1);
//     setRows((prev) => [...prev, { ...blankRow(), _key: key }]);
//     setNewRowKeys((prev) => [...prev, key]);
//     setDirty(true);
//   };

//   const removeNewSlab = (key) => {
//     // There is no delete endpoint in the supplied documentation; only unsaved rows can be removed.
//     if (!newRowKeys.includes(key)) return;
//     setRows((prev) => prev.filter((r) => r._key !== key));
//     setNewRowKeys((prev) => prev.filter((k) => k !== key));
//     setDirty(true);
//   };

//   const validation = useMemo(() => {
//     const next = {};
//     const slabs = new Set();
//     rows.forEach((r) => {
//       const slab = String(r.slab ?? "").trim();
//       if (!slab || !Number.isFinite(Number(slab)) || Number(slab) <= 0) next[`${r._key}.slab`] = "Slab must be greater than 0";
//       else if (slabs.has(Number(slab))) next[`${r._key}.slab`] = "Duplicate slab";
//       else slabs.add(Number(slab));
//       keys.filter((key) => key !== "slab").forEach((key) => {
//         const value = String(r[key] ?? "").trim();
//         if (value && (!/^\d+(?:\.\d{1,4})?$/.test(value) || !Number.isFinite(Number(value)))) next[`${r._key}.${key}`] = "Invalid non-negative number";
//         if (value && ["cod_percentage", "rto_percentage"].includes(key) && Number(value) > 100) next[`${r._key}.${key}`] = "Cannot exceed 100%";
//       });
//     });
//     return next;
//   }, [rows]);

//   const save = async (event) => {
//     event.preventDefault();
//     if (!rows.length) { toast.error("Add at least one pricing slab"); return; }
//     if (Object.keys(validation).length) { setErrors(validation); toast.error("Please correct the highlighted fields"); return; }
//     setSaving(true);
//     try {
//       const slabs = rows.map((row) => Object.fromEntries(keys.map((key) => [key, String(row[key] ?? "").trim() === "" ? (key === "minimum_cod" ? "0" : null) : String(row[key]).trim()])));
//       const response = await axios.post(`${baseURL}/api/admin/updatePlanDetails/${encodeURIComponent(plan_id)}`, { slabs }, { headers: { ...auth(), "Content-Type": "application/json" } });
//       toast.success(response.data?.message || "Pricing details saved successfully");
//       await fetchDetails();
//     } catch (error) { toast.error(errorMessage(error, "Unable to save pricing details")); }
//     finally { setSaving(false); }
//   };

//   const goBack = () => {
//     if (dirty && !window.confirm("You have unsaved changes. Leave this page?")) return;
//     navigate(-1);
//   };

//   return (
//     <div className="flex h-[calc(100dvh-80px)] min-h-0 w-full flex-col overflow-hidden bg-[#f5f8fb] text-slate-900 dark:bg-neutral-950 dark:text-white">
//       <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-5 py-4 dark:border-neutral-800 dark:bg-neutral-900"><div className="flex items-center gap-3"><button type="button" onClick={goBack} aria-label="Go back" className="rounded-md border border-slate-200 p-2 hover:bg-slate-50 dark:border-neutral-700"><ArrowLeft size={18} /></button><div><h1 className="text-xl font-semibold">Update Plan Details</h1><p className="mt-1 text-xs text-slate-500">Plan ID: {plan_id} · Manage pricing by weight slab</p></div></div><div className="flex items-center gap-2"><button type="button" onClick={() => { if (!dirty || window.confirm("Discard unsaved changes and reload?")) fetchDetails(); }} disabled={loading || saving} className={`${buttonBase} border border-slate-200 dark:border-neutral-700`}><RefreshCw size={16} /> Refresh</button><button type="button" onClick={addSlab} disabled={loading || saving || notFound} className={`${buttonBase} bg-[#0446DB] text-white hover:bg-blue-700`}><Plus size={16} /> Add Slab</button></div></header>
//       <form onSubmit={save} className="flex min-h-0 flex-1 flex-col p-3 sm:p-5"><section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900"><div className="shrink-0 border-b border-slate-200 px-4 py-3 dark:border-neutral-800"><h2 className="font-semibold">Weight Slab Pricing</h2><p className="mt-1 text-xs text-slate-500">{rows.length} slab(s) · Empty values are sent as null (minimum COD defaults to 0)</p></div>
//         <div className="min-h-0 flex-1 overflow-auto overscroll-contain">
//           {loading ? <div className="flex h-full items-center justify-center gap-2 text-sm text-slate-500"><Loader2 size={20} className="animate-spin" /> Loading plan details...</div> : notFound ? <div className="p-12 text-center text-sm text-red-600">Plan not found (404). Check the plan ID.</div> : rows.length === 0 ? <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center"><p className="font-semibold">No pricing slabs yet</p><p className="text-sm text-slate-500">This plan has no detail rows. Add a slab to start configuring pricing.</p><button type="button" onClick={addSlab} className={`${buttonBase} bg-[#0446DB] text-white`}><Plus size={16} /> Add First Slab</button></div> :
//             <table className="w-full min-w-max border-separate border-spacing-0 text-sm"><thead className="sticky top-0 z-20"><tr>{fields.map(([key, label]) => <th key={key} className="whitespace-nowrap border-b border-slate-200 bg-slate-50 px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">{label}</th>)}<th className="sticky right-0 border-b border-slate-200 bg-slate-50 px-3 py-3 text-left text-xs font-semibold uppercase text-slate-600 dark:border-neutral-700 dark:bg-neutral-800">Action</th></tr></thead><tbody>{rows.map((row) => <tr key={row._key} className="hover:bg-blue-50/40 dark:hover:bg-neutral-800/60">{fields.map(([key, label]) => <td key={key} className="border-b border-slate-100 px-2 py-2 dark:border-neutral-800">{key === "slab" ? (
//   <select
//     aria-label={`Slab (g) for ${row._key}`}
//     value={row.slab ?? ""}
//     onChange={(e) => updateField(row._key, "slab", e.target.value)}
//     disabled={!newRowKeys.includes(row._key)}
//     title={errors[`${row._key}.slab`] || ""}
//     className={`w-32 rounded-md border bg-white px-2.5 py-2 text-sm outline-none focus:border-[#0446DB] dark:bg-neutral-900 ${errors[`${row._key}.slab`] ? "border-red-500" : "border-slate-200 dark:border-neutral-700"} ${!newRowKeys.includes(row._key) ? "cursor-not-allowed bg-slate-100 font-semibold dark:bg-neutral-800" : ""}`}
//   >
//     <option value="">Select slab</option>
//     {row.slab && !slabOptions.includes(String(row.slab)) && <option value={row.slab}>{row.slab} g (existing)</option>}
//     {slabOptions.map((value) => <option key={value} value={value} disabled={rows.some((other) => other._key !== row._key && String(other.slab) === value)}>{value} g</option>)}
//   </select>
// ) : (
//   <input aria-label={`${label} for slab ${row.slab || "new"}`} inputMode="decimal" value={row[key] ?? ""} onChange={(e) => updateField(row._key, key, e.target.value)} placeholder="—" title={errors[`${row._key}.${key}`] || ""} className={`w-28 rounded-md border bg-white px-2.5 py-2 text-sm outline-none focus:border-[#0446DB] dark:bg-neutral-900 ${errors[`${row._key}.${key}`] ? "border-red-500" : "border-slate-200 dark:border-neutral-700"}`} />
// )}</td>)}<td className="sticky right-0 border-b border-slate-100 bg-white px-3 py-2 dark:border-neutral-800 dark:bg-neutral-900">{newRowKeys.includes(row._key) ? <button type="button" onClick={() => removeNewSlab(row._key)} title="Remove unsaved slab" className="rounded-md p-2 text-red-600 hover:bg-red-50"><Trash2 size={16} /></button> : <span className="text-xs text-slate-400">Saved</span>}</td></tr>)}</tbody></table>}
//         </div>
//         <footer className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900"><p className="text-xs text-slate-500">{dirty ? "Unsaved changes" : "All changes saved"} · {Object.keys(errors).length ? `${Object.keys(errors).length} validation issue(s)` : "Ready"}</p><div className="flex items-center gap-2"><button type="button" onClick={goBack} className={`${buttonBase} border border-slate-200 dark:border-neutral-700`}>Cancel</button><button type="submit" disabled={loading || saving || notFound || rows.length === 0 || !dirty} className={`${buttonBase} bg-[#0446DB] text-white hover:bg-blue-700`}>{saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save Pricing</button></div></footer>
//       </section></form>
//     </div>
//   );
// }

import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  RefreshCw,
  Save,
  Loader2,
  Trash2,
} from "lucide-react";

const baseURL = import.meta.env.VITE_BASE_URL;
const fields = [
  ["slab", "Slab (g)"],
  ["additional", "Additional Weight"],
  ["sdd", "SDD"],
  ["ndd", "NDD"],
//   ["hld30min", "HLD 30 min"],
//   ["hld60min", "HLD 60 min"],
//   ["hld120min", "HLD 120 min"],
//   ["hld4hrs", "HLD 4 hrs"],
  ["additional_sdd", "Additional SDD"],
  ["additional_ndd", "Additional NDD"],
//   ["additional_hld30min", "Additional HLD 30 min"],
//   ["additional_hld60min", "Additional HLD 60 min"],
//   ["additional_hld120min", "Additional HLD 120 min"],
//   ["additional_hld4hrs", "Additional HLD 4 hrs"],
  ["cod_percentage", "COD %"],
  ["minimum_cod", "Minimum COD"],
  ["rto_percentage", "RTO %"],
];
const keys = fields.map(([key]) => key);
const slabOptions = ["500", "2000", "5000", "10000"];
const auth = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});
const blankRow = () =>
  Object.fromEntries(
    keys.map((key) => [key, key === "minimum_cod" ? "0" : ""]),
  );
const errorMessage = (error, fallback) =>
  error?.response?.data?.message || fallback;
const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50";

export default function UpdatePlanDetails() {
  const { plan_id } = useParams();
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [errors, setErrors] = useState({});
  const [dirty, setDirty] = useState(false);
  const [newRowKeys, setNewRowKeys] = useState([]);
  const [nextKey, setNextKey] = useState(0);

  const fetchDetails = useCallback(async () => {
    setLoading(true);
    setNotFound(false);
    try {
      const response = await axios.get(
        `${baseURL}/api/admin/getPlanWithComparison/${encodeURIComponent(plan_id)}`,
        { headers: auth() },
      );
      const data = Array.isArray(response.data?.data) ? response.data.data : [];
      // Null-valued placeholder is returned for an existing plan without details.
      const realRows = data.filter(
        (r) => r && r.slab != null && String(r.slab).trim() !== "",
      );
      setRows(
        realRows.map((r, index) => ({
          ...blankRow(),
          ...Object.fromEntries(
            keys.map((key) => [key, r[key] == null ? "" : String(r[key])]),
          ),
          _key: `saved-${r.id ?? index}`,
        })),
      );
      setNewRowKeys([]);
      setErrors({});
      setDirty(false);
    } catch (error) {
      if (error?.response?.status === 404) setNotFound(true);
      toast.error(errorMessage(error, "Failed to load plan details"));
    } finally {
      setLoading(false);
    }
  }, [plan_id]);

  useEffect(() => {
    fetchDetails();
  }, [fetchDetails]);

  const updateField = (rowKey, field, value) => {
    if (value !== "" && !/^\d*(?:\.\d{0,4})?$/.test(value)) return;
    if (value.length > 18) return;
    setRows((prev) =>
      prev.map((r) => (r._key === rowKey ? { ...r, [field]: value } : r)),
    );
    setDirty(true);
    setErrors((prev) => {
      const next = { ...prev };
      delete next[`${rowKey}.${field}`];
      return next;
    });
  };

  const addSlab = () => {
    const key = `new-${nextKey}`;
    setNextKey((n) => n + 1);
    setRows((prev) => [...prev, { ...blankRow(), _key: key }]);
    setNewRowKeys((prev) => [...prev, key]);
    setDirty(true);
  };

  const removeNewSlab = (key) => {
    // There is no delete endpoint in the supplied documentation; only unsaved rows can be removed.
    if (!newRowKeys.includes(key)) return;
    setRows((prev) => prev.filter((r) => r._key !== key));
    setNewRowKeys((prev) => prev.filter((k) => k !== key));
    setDirty(true);
  };

  const validation = useMemo(() => {
    const next = {};
    const slabs = new Set();
    rows.forEach((r) => {
      const slab = String(r.slab ?? "").trim();
      if (!slab || !Number.isFinite(Number(slab)) || Number(slab) <= 0)
        next[`${r._key}.slab`] = "Slab must be greater than 0";
      else if (slabs.has(Number(slab)))
        next[`${r._key}.slab`] = "Duplicate slab";
      else slabs.add(Number(slab));
      keys
        .filter((key) => key !== "slab")
        .forEach((key) => {
          const value = String(r[key] ?? "").trim();
          if (
            value &&
            (!/^\d+(?:\.\d{1,4})?$/.test(value) ||
              !Number.isFinite(Number(value)))
          )
            next[`${r._key}.${key}`] = "Invalid non-negative number";
          if (
            value &&
            ["cod_percentage", "rto_percentage"].includes(key) &&
            Number(value) > 100
          )
            next[`${r._key}.${key}`] = "Cannot exceed 100%";
        });
    });
    return next;
  }, [rows]);

  const save = async (event) => {
    event.preventDefault();
    if (!rows.length) {
      toast.error("Add at least one pricing slab");
      return;
    }
    if (Object.keys(validation).length) {
      setErrors(validation);
      toast.error("Please correct the highlighted fields");
      return;
    }
    setSaving(true);
    try {
      const slabs = rows.map((row) =>
        Object.fromEntries(
          keys.map((key) => [
            key,
            String(row[key] ?? "").trim() === ""
              ? key === "minimum_cod"
                ? "0"
                : null
              : String(row[key]).trim(),
          ]),
        ),
      );
      const response = await axios.post(
        `${baseURL}/api/admin/updatePlanDetails/${encodeURIComponent(plan_id)}`,
        { slabs },
        { headers: { ...auth(), "Content-Type": "application/json" } },
      );
      toast.success(
        response.data?.message || "Pricing details saved successfully",
      );
      await fetchDetails();
    } catch (error) {
      toast.error(errorMessage(error, "Unable to save pricing details"));
    } finally {
      setSaving(false);
    }
  };

  const goBack = () => {
    if (dirty && !window.confirm("You have unsaved changes. Leave this page?"))
      return;
    navigate(-1);
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
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-slate-200  px-5 dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={goBack}
            aria-label="Go back"
            className="rounded-md border border-slate-200 p-2 hover:bg-slate-50 dark:border-neutral-700"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl font-semibold">Update Plan Details</h1>
            <p className="mt-1 text-xs text-slate-500">
              Plan ID: {plan_id} · Manage pricing by weight slab
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (
                !dirty ||
                window.confirm("Discard unsaved changes and reload?")
              )
                fetchDetails();
            }}
            disabled={loading || saving}
            className={`${buttonBase} border border-slate-200 dark:border-neutral-700`}
          >
            <RefreshCw size={16} /> Refresh
          </button>
          <button
            type="button"
            onClick={addSlab}
            disabled={loading || saving || notFound}
            className={`${buttonBase} bg-[#0446DB] text-white hover:bg-blue-700`}
          >
            <Plus size={16} /> Add Slab
          </button>
        </div>
      </header>
      <form onSubmit={save} className="flex min-h-0 flex-1 flex-col p-3 sm:p-5">
        <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="shrink-0 border-b border-slate-200 px-4 py-3 dark:border-neutral-800">
            <h2 className="font-semibold">Weight Slab Pricing</h2>
            <p className="mt-1 text-xs text-slate-500">
              {rows.length} slab(s) · Empty values are sent as null (minimum COD
              defaults to 0)
            </p>
          </div>
          <div className="min-h-0 flex-1 overflow-auto overscroll-contain">
            {loading ? (
              <div className="flex h-full items-center justify-center gap-2 text-sm text-slate-500">
                <Loader2 size={20} className="animate-spin" /> Loading plan
                details...
              </div>
            ) : notFound ? (
              <div className="p-12 text-center text-sm text-red-600">
                Plan not found (404). Check the plan ID.
              </div>
            ) : rows.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
                <p className="font-semibold">No pricing slabs yet</p>
                <p className="text-sm text-slate-500">
                  This plan has no detail rows. Add a slab to start configuring
                  pricing.
                </p>
                <button
                  type="button"
                  onClick={addSlab}
                  className={`${buttonBase} bg-[#0446DB] text-white`}
                >
                  <Plus size={16} /> Add First Slab
                </button>
              </div>
            ) : (
              <table className="w-full min-w-max border-separate border-spacing-0 text-sm">
                <thead className="sticky top-0 z-20">
                  <tr>
                    {fields.map(([key, label]) => (
                      <th
                        key={key}
                        className="whitespace-nowrap border-b border-slate-200 bg-slate-50 px-3 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                      >
                        {label}
                      </th>
                    ))}
                    <th className="sticky right-0 border-b border-slate-200 bg-slate-50 px-3 py-3 text-left text-xs font-semibold uppercase text-slate-600 dark:border-neutral-700 dark:bg-neutral-800">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr
                      key={row._key}
                      className="hover:bg-blue-50/40 dark:hover:bg-neutral-800/60"
                    >
                      {fields.map(([key, label]) => (
                        <td
                          key={key}
                          className="border-b border-slate-100 px-2 py-2 dark:border-neutral-800"
                        >
                          {key === "slab" ? (
                            <select
                              aria-label={`Slab (g) for ${row._key}`}
                              value={row.slab ?? ""}
                              onChange={(e) =>
                                updateField(row._key, "slab", e.target.value)
                              }
                              disabled={!newRowKeys.includes(row._key)}
                              title={errors[`${row._key}.slab`] || ""}
                              className={`w-32 rounded-md border bg-white px-2.5 py-2 text-sm outline-none focus:border-[#0446DB] dark:bg-neutral-900 ${errors[`${row._key}.slab`] ? "border-red-500" : "border-slate-200 dark:border-neutral-700"} ${!newRowKeys.includes(row._key) ? "cursor-not-allowed bg-slate-100 font-semibold dark:bg-neutral-800" : ""}`}
                            >
                              <option value="">Select slab</option>
                              {row.slab &&
                                !slabOptions.includes(String(row.slab)) && (
                                  <option value={row.slab}>
                                    {row.slab} g 
                                  </option>
                                )}
                              {slabOptions.map((value) => (
                                <option
                                  key={value}
                                  value={value}
                                  disabled={rows.some(
                                    (other) =>
                                      other._key !== row._key &&
                                      String(other.slab) === value,
                                  )}
                                >
                                  {value} g
                                </option>
                              ))}
                            </select>
                          ) : key === "additional" ? (
                            <select
                              aria-label={`Additional Weight for slab ${row.slab || "new"}`}
                              value={row.additional ?? ""}
                              onChange={(e) =>
                                updateField(
                                  row._key,
                                  "additional",
                                  e.target.value,
                                )
                              }
                              className="w-32 rounded-md border border-slate-200 bg-white px-2.5 py-2 text-sm outline-none focus:border-[#0446DB] dark:border-neutral-700 dark:bg-neutral-900"
                            >
                              <option value="">Select weight</option>
                              {row.additional !== "" &&
                                row.additional != null &&
                                !slabOptions.includes(
                                  String(row.additional),
                                ) && (
                                  <option value={row.additional}>
                                    {row.additional} g 
                                  </option>
                                )}
                              {slabOptions.map((value) => (
                                <option key={value} value={value}>
                                  {value} g
                                </option>
                              ))}
                            </select>
                          ) : (
                            <input
                              aria-label={`${label} for slab ${row.slab || "new"}`}
                              inputMode="decimal"
                              value={row[key] ?? ""}
                              onChange={(e) =>
                                updateField(row._key, key, e.target.value)
                              }
                              placeholder="—"
                              title={errors[`${row._key}.${key}`] || ""}
                              className={`w-28 rounded-md border bg-white px-2.5 py-2 text-sm outline-none focus:border-[#0446DB] dark:bg-neutral-900 ${errors[`${row._key}.${key}`] ? "border-red-500" : "border-slate-200 dark:border-neutral-700"}`}
                            />
                          )}
                        </td>
                      ))}
                      <td className="sticky right-0 border-b border-slate-100 bg-white px-3 py-2 dark:border-neutral-800 dark:bg-neutral-900">
                        {newRowKeys.includes(row._key) ? (
                          <button
                            type="button"
                            onClick={() => removeNewSlab(row._key)}
                            title="Remove unsaved slab"
                            className="rounded-md p-2 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 size={16} />
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          <footer className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-slate-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900">
            <p className="text-xs text-slate-500">
              {dirty ? "Unsaved changes" : "All changes saved"} ·{" "}
              {Object.keys(errors).length
                ? `${Object.keys(errors).length} validation issue(s)`
                : "Ready"}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={goBack}
                className={`${buttonBase} border border-slate-200 dark:border-neutral-700`}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  loading || saving || notFound || rows.length === 0 || !dirty
                }
                className={`${buttonBase} bg-[#0446DB] text-white hover:bg-blue-700`}
              >
                {saving ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Save size={16} />
                )}{" "}
                Save Pricing
              </button>
            </div>
          </footer>
        </section>
      </form>
    </div>
    )
  );
}
