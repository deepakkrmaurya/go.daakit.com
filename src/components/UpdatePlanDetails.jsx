
import "leaflet/dist/leaflet.css";
import { useState, useEffect } from "react";
import Loader from "./Loader";
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const baseURL = import.meta.env.VITE_BASE_URL;

function UpdatePlanDetails() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({});
    const { plan_id } = useParams();
    const [pricing, setPricing] = useState([]);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${baseURL}/api/admin/getPlanWithComparison/${plan_id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );

                // Extract plan_pricing from the response
                const pricingData = res?.data?.data.map(({ plan_pricing }) => plan_pricing);
                setPricing(pricingData);

                // Initialize form data with the actual API response
                const initialFormData = {};
                pricingData?.forEach(plan => {
                    initialFormData[plan?.slab] = { ...plan };
                });
                setFormData(initialFormData);

            } catch (error) {
                console.error("Error fetching plan data:", error);
                toast.error("Error fetching plan data");
            } finally {
                setLoading(false);
            }
        })();
    }, [plan_id]);

    const handleInputChange = (slab, field, value) => {
        setFormData(prev => ({
            ...prev,
            [slab]: {
                ...prev[slab],
                [field]: value
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Prepare data in the required format
        const submitData = {
            slabs: Object.keys(formData).map(slab => ({
                slab: formData[slab]?.slab,
                sdd: formData[slab]?.sdd,
                ndd: formData[slab]?.ndd,
                turant: formData[slab]?.turant,
                additional_sdd: formData[slab]?.additional_sdd,
                additional_ndd: formData[slab]?.additional_ndd,
                additional_turant: formData[slab]?.additional_turant,
                cod_percentage: formData[slab]?.cod_percentage,
                additional: formData[slab]?.additional,
                minimum_cod: formData[slab]?.minimum_cod
            }))
        };

        

        try {
            const res = await axios.post(
                `${baseURL}/api/admin/updatePlanDetails/${plan_id}`,
                submitData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        'Content-Type': 'application/json'
                    },
                }
            );

            toast.success(res.data.message);

        } catch (error) {
            console.error("Error updating plan:", error);
            toast.error("Error updating plan pricing. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <div className="bg-gray-100 dark:bg-gray-900 min-h-screen w-full">
                    {/* Heading Strip */}
                    <div className="relative z-0 mb-6 bg-[rgb(85,77,192)] dark:bg-gray-900 py-[33px] shadow-md h-38 px-[24px]">
                        <div className="flex flex-wrap items-center justify-between w-full">
                            {/* Heading */}
                            <h1 className="text-2xl text-white">Update Plan Details</h1>
                            <div className="ml-auto w-[200px] z-50 relative">
                                {/* Additional content can go here */}
                            </div>
                        </div>
                    </div>

                    <div className="px-1 z-99">
                        <div className="-mt-20 md:-mt-24 relative">
                            <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
                                <div className="mb-6">
                                    
                                    <p className="text-gray-600 dark:text-white">
                                        Update pricing details for each weight slab
                                    </p>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="min-w-full border-collapse border border-gray-300">
                                        <thead>
                                            <tr className="bg-gray-50 dark:bg-gray-900">
                                                <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border border-gray-300">
                                                    Slab (grams)
                                                </th>
                                                <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border border-gray-300">
                                                    Additional Weight
                                                </th>
                                                <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border border-gray-300">
                                                    SDD
                                                </th>
                                                <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border border-gray-300">
                                                    NDD
                                                </th>
                                                <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border border-gray-300">
                                                    Turant
                                                </th>
                                                <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border border-gray-300">
                                                    Additional SDD
                                                </th>
                                                <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border border-gray-300">
                                                    Additional NDD
                                                </th>
                                                <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border border-gray-300">
                                                    Additional Turant
                                                </th>
                                                <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border border-gray-300">
                                                    COD Percentage
                                                </th>
                                                <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider border border-gray-300">
                                                    Minimum COD
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {pricing?.map((plan, index) => (
                                                <tr 
                                                    key={plan?.slab} 
                                                    className={`transition-colors dark:bg-gray-900 duration-150 ${
                                                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                                    } hover:bg-indigo-50 dark:hover:bg-gray-800`}
                                                >
                                                    {/* Slab - Read Only */}
                                                    <td className="py-4 px-4 text-gray-600 dark:text-white font-medium border border-gray-300">
                                                        {plan?.slab}
                                                    </td>
                                                    
                                                    {/* Additional Weight */}
                                                    <td className="py-2 px-4 border border-gray-300 dark:text-white">
                                                        {/* <input
                                                            type="text"
                                                            value={formData[plan.slab]?.additional || ""}
                                                            onChange={(e) => handleInputChange(plan.slab, 'additional', e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            placeholder="Additional weight"
                                                        /> */}
                                                        {formData[plan?.slab]?.additional || ""}
                                                    </td>
                                                    
                                                    {/* SDD */}
                                                    <td className="py-2 px-4 border border-gray-300 dark:text-white">
                                                        <input
                                                            type="text"
                                                            value={formData[plan?.slab]?.sdd || ""}
                                                            onChange={(e) => handleInputChange(plan?.slab, 'sdd', e.target.value)}
                                                            className="w-18 px-3 py-2 border dark:text-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            placeholder="SDD"
                                                        />
                                                    </td>
                                                    
                                                    {/* NDD */}
                                                    <td className="py-2 px-4 border border-gray-300 dark:text-white">
                                                        <input
                                                            type="text"
                                                            value={formData[plan?.slab]?.ndd || ""}
                                                            onChange={(e) => handleInputChange(plan?.slab, 'ndd', e.target.value)}
                                                            className="w-18 px-3 py-2 border border-gray-300 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            placeholder="NDD"
                                                        />
                                                    </td>
                                                    
                                                    {/* Turant */}
                                                    <td className="py-2 px-4 border border-gray-300 dark:text-white">
                                                        <input
                                                            type="text"
                                                            value={formData[plan?.slab]?.turant || ""}
                                                            onChange={(e) => handleInputChange(plan?.slab, 'turant', e.target.value)}
                                                            className="w-18 px-3 py-2 border border-gray-300 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            placeholder="Turant"
                                                        />
                                                    </td>
                                                    
                                                    {/* Additional SDD */}
                                                    <td className="py-2 px-4 border border-gray-300 dark:text-white">
                                                        <input
                                                            type="text"
                                                            value={formData[plan?.slab]?.additional_sdd || ""}
                                                            onChange={(e) => handleInputChange(plan?.slab, 'additional_sdd', e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            placeholder="Additional SDD"
                                                        />
                                                    </td>
                                                    
                                                    {/* Additional NDD */}
                                                    <td className="py-2 px-4 border border-gray-300 dark:text-white">
                                                        <input
                                                            type="text"
                                                            value={formData[plan?.slab]?.additional_ndd || ""}
                                                            onChange={(e) => handleInputChange(plan?.slab, 'additional_ndd', e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            placeholder="Additional NDD"
                                                        />
                                                    </td>
                                                    
                                                    {/* Additional Turant */}
                                                    <td className="py-2 px-4 border border-gray-300 dark:text-white">
                                                        <input
                                                            type="text"
                                                            value={formData[plan?.slab]?.additional_turant || ""}
                                                            onChange={(e) => handleInputChange(plan?.slab, 'additional_turant', e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            placeholder="Additional Turant"
                                                        />
                                                    </td>
                                                    
                                                    {/* COD Percentage */}
                                                    <td className="py-2 px-4 border border-gray-300 dark:text-white">
                                                        <input
                                                            type="text"
                                                            value={formData[plan?.slab]?.cod_percentage || ""}
                                                            onChange={(e) => handleInputChange(plan?.slab, 'cod_percentage', e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            placeholder="COD %"
                                                        />
                                                    </td>
                                                    
                                                    {/* Minimum COD */}
                                                    <td className="py-2 px-4 border border-gray-300 dark:text-white">
                                                        <input
                                                            type="text"
                                                            value={formData[plan?.slab]?.minimum_cod || ""}
                                                            onChange={(e) => handleInputChange(plan?.slab, 'minimum_cod', e.target.value)}
                                                            className="w-full px-3 py-2 border border-gray-300 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                            placeholder="Min COD"
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="flex justify-end space-x-4 mt-6 pt-6 border-t border-gray-200">
                                    <button
                                        type="button"
                                        onClick={() => window.history.back()}
                                        className="px-6 py-2 border dark:text-white border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-[#554dc0] dark:text-white text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                    >
                                        Update Plans
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default UpdatePlanDetails;
