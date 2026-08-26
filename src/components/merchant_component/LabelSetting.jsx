


import React, { useEffect, useState } from 'react';
import { Printer, Mail, Phone, Eye, EyeOff, Package, Save, HelpCircle } from 'lucide-react';
import standard from '@/assets/standard-printer.png'
import thermal from '@/assets/thermal-printer.png'
import axios from 'axios';
import { toast } from 'react-toastify';
const baseURL = import.meta.env.VITE_BASE_URL;
const LabelSettings = () => {
    const [activeTab, setActiveTab] = useState('label'); // 'label' or 'support'

    // State for label settings
    const [labelType, setLabelType] = useState(''); // 'standard' or 'thermal'

    // State for support settings
    const [supportSettings, setSupportSettings] = useState({
        support_email: '',
        support_phone: '',
        hide_warehouse_address: '0',
        hide_warehouse_phone_number: '0',
        hide_product_detail: "0"
    });

    const getLabelSettings = async () => {
        try {
            const response = await axios.get(
                `${baseURL}/api/merchant/getLabelSettings`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            if (response.data.success) {
                setSupportSettings({
                    support_email: response.data.data?.support_email,
                    support_phone: response.data.data?.support_phone,
                    hide_warehouse_address: response.data.data?.hide_warehouse_address,
                    hide_warehouse_phone_number: response.data.data?.hide_warehouse_phone_number,
                    hide_product_detail: response.data.data?.hide_product_detail
                })
            }

        } catch (error) {

        }
    }


    const handleSupportChange = (e) => {
        const { name, value, type, checked } = e.target;

        setSupportSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked ? "1" : "0" : value
        }));
    };

    const handleSave = async () => {

        if (activeTab === 'label') {
            try {
                const response = await axios.post(
                    `${baseURL}/api/merchant/changeMerchantLabelFormat`,
                    { label_type: labelType },
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );

                toast.success(response.data.message)
                return
            } catch (error) {
                toast.error(error.response.data.message)
                return
            }
        }



        const label = {
            label_settings: supportSettings
        }
        try {
            const response = await axios.post(
                `${baseURL}/api/merchant/updateLabelSettings`,
                label,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            toast.success(response.data.message)
            getLabelSettings()
        } catch (error) {
            toast.error('Something went wrong')
            return
        }
    };

    const getLabelType = async () => {
        try {
            const response = await axios.get(
                `${baseURL}/api/merchant/getLabelType`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            setLabelType(response?.data?.data?.label_type)

        } catch (error) {
            toast.error('Something went wrong')
            return
        }
    }
    useEffect(() => {
        getLabelSettings()
        getLabelType()
    }, [])

    return (

        <div className="min-h-screen bg-[#EEEEEE]">
            {/* Header Section */}
            <header className="bg-[#0446DB] shadow-lg">
                <div className=" mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 sm:space-y-4 lg:space-y-0">
                        <div className="text-center lg:text-left">
                            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">Label & Support Settings</h1>
                            {/* <p className=' text-xl text-white'>Configure your label printing preferences and support information</p> */}
                        </div>


                    </div>
                </div>
            </header>
            <div className=" relative -top-10  mx-auto mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">


                {/* Tabs */}
                <div className="border-b rounded p-3 bg-white border-gray-200">
                    <div className="flex space-x-8">
                        <button
                            onClick={() => setActiveTab('label')}
                            className={`pb-4 px-1 font-medium text-sm transition-colors relative ${activeTab === 'label'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <Printer className="w-4 h-4" />
                                Label Size
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('support')}
                            className={`pb-4 px-1 font-medium text-sm transition-colors relative ${activeTab === 'support'
                                ? 'text-blue-600 border-b-2 border-blue-600'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <div className="flex items-center gap-2">
                                <HelpCircle className="w-4 h-4" />
                                Support Settings
                            </div>
                        </button>
                    </div>
                </div>

                {/* Tab Content */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                    {activeTab === 'label' && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Choose Label Size</h2>

                            <div className=' flex flex-col md:flex-row gap-2'>
                                {/* Standard Desktop Printer Option */}
                                <div
                                    onClick={() => setLabelType('standard')}
                                    className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${labelType === 'standard'
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <Printer className="w-6 h-6 text-blue-600" />
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="font-semibold text-gray-800">Standard Desktop Printers</h3>
                                                <span className="text-sm text-gray-500">Size A4 (8" × 11")</span>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-4">Four Labels Printed on one Sheet</p>


                                            <img src={standard} className=' h-48' />

                                        </div>
                                    </div>
                                </div>

                                {/* Thermal Label Printer Option */}
                                <div
                                    onClick={() => setLabelType('thermal')}
                                    className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${labelType === 'thermal'
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                                <Printer className="w-6 h-6 text-purple-600" />
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="font-semibold text-gray-800">Thermal Label Printers</h3>
                                                <span className="text-sm text-gray-500">Size (4" × 6")</span>
                                            </div>
                                            <p className="text-sm text-gray-600 mb-4">Single Label on one Sheet</p>

                                            {/* Label Visual Representation */}

                                            <img src={thermal} className=' h-48' />

                                        </div>
                                    </div>
                                </div>
                            </div>


                        </div>
                    )}

                    {activeTab === 'support' && (
                        <div className="space-y-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Support Configuration</h2>

                            {/* Support Email */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Support Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="email"
                                        name="support_email"
                                        value={supportSettings.support_email}
                                        onChange={handleSupportChange}
                                        placeholder="support@example.com"
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    />
                                </div>
                            </div>

                            {/* Support Phone */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Support Phone
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="tel"
                                        name="support_phone"
                                        value={supportSettings.support_phone}
                                        onChange={handleSupportChange}
                                        placeholder="+91 98765 43210"
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                    />
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="border-t border-gray-200 my-4"></div>

                            {/* Visibility Settings */}
                            <h3 className="text-md font-medium text-gray-800 mb-3">Visibility Preferences</h3>

                            {/* Hide Warehouse Address */}
                            <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                <div className="flex items-start gap-3">
                                    <EyeOff className="w-4 h-4 text-gray-400 mt-1" />
                                    <div>
                                        <p className="font-medium text-gray-700">Hide Warehouse Address</p>
                                        <p className="text-xs text-gray-500">Don't show warehouse address on labels</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="hide_warehouse_address"
                                        checked={supportSettings.hide_warehouse_address === '1' ? 1 : 0}
                                        onChange={handleSupportChange}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            {/* Hide Warehouse Phone Number */}
                            <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                <div className="flex items-start gap-3">
                                    <EyeOff className="w-4 h-4 text-gray-400 mt-1" />
                                    <div>
                                        <p className="font-medium text-gray-700">Hide Warehouse Phone Number</p>
                                        <p className="text-xs text-gray-500">Don't show warehouse phone on labels</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="hide_warehouse_phone_number"
                                        checked={supportSettings.hide_warehouse_phone_number === '1' ? 1 : 0}
                                        onChange={handleSupportChange}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            {/* Hide Product Detail */}
                            <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                <div className="flex items-start gap-3">
                                    <EyeOff className="w-4 h-4 text-gray-400 mt-1" />
                                    <div>
                                        <p className="font-medium text-gray-700">Hide Product Details</p>
                                        <p className="text-xs text-gray-500">Don't show product information on labels</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="hide_product_detail"
                                        checked={supportSettings.hide_product_detail === '1' ? 1 : 0}
                                        onChange={handleSupportChange}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                        </div>
                    )}

                    {/* Save Button */}
                    <div className="mt-8 pt-4 border-t border-gray-200">
                        <button
                            onClick={handleSave}
                            className="inline-flex items-center gap-2 cursor-pointer px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                        >
                            <Save className="w-4 h-4" />
                            Save Settings
                        </button>
                    </div>
                </div>


            </div>
        </div>


    );
};

export default LabelSettings;