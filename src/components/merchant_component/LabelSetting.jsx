


// import React, { useEffect, useState } from 'react';
// import { Printer, Mail, Phone, Eye, EyeOff, Package, Save, HelpCircle } from 'lucide-react';
// import standard from '@/assets/standard-printer.png'
// import thermal from '@/assets/thermal-printer.png'
// import axios from 'axios';
// import { toast } from 'react-toastify';
// const baseURL = import.meta.env.VITE_BASE_URL;
// const LabelSettings = () => {
//     const [activeTab, setActiveTab] = useState('label'); // 'label' or 'support'

//     // State for label settings
//     const [labelType, setLabelType] = useState(''); // 'standard' or 'thermal'

//     // State for support settings
//     const [supportSettings, setSupportSettings] = useState({
//         support_email: '',
//         support_phone: '',
//         hide_warehouse_address: '0',
//         hide_warehouse_phone_number: '0',
//         hide_product_detail: "0"
//     });

//     const getLabelSettings = async () => {
//         try {
//             const response = await axios.get(
//                 `${baseURL}/api/merchant/getLabelSettings`,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${localStorage.getItem("token")}`,
//                     },
//                 }
//             );
//             if (response.data.success) {
//                 setSupportSettings({
//                     support_email: response.data.data?.support_email,
//                     support_phone: response.data.data?.support_phone,
//                     hide_warehouse_address: response.data.data?.hide_warehouse_address,
//                     hide_warehouse_phone_number: response.data.data?.hide_warehouse_phone_number,
//                     hide_product_detail: response.data.data?.hide_product_detail
//                 })
//             }

//         } catch (error) {

//         }
//     }


//     const handleSupportChange = (e) => {
//         const { name, value, type, checked } = e.target;

//         setSupportSettings(prev => ({
//             ...prev,
//             [name]: type === 'checkbox' ? checked ? "1" : "0" : value
//         }));
//     };

//     const handleSave = async () => {

//         if (activeTab === 'label') {
//             try {
//                 const response = await axios.post(
//                     `${baseURL}/api/merchant/changeMerchantLabelFormat`,
//                     { label_type: labelType },
//                     {
//                         headers: {
//                             Authorization: `Bearer ${localStorage.getItem("token")}`,
//                         },
//                     }
//                 );

//                 toast.success(response.data.message)
//                 return
//             } catch (error) {
//                 toast.error(error.response.data.message)
//                 return
//             }
//         }



//         const label = {
//             label_settings: supportSettings
//         }
//         try {
//             const response = await axios.post(
//                 `${baseURL}/api/merchant/updateLabelSettings`,
//                 label,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${localStorage.getItem("token")}`,
//                     },
//                 }
//             );

//             toast.success(response.data.message)
//             getLabelSettings()
//         } catch (error) {
//             toast.error('Something went wrong')
//             return
//         }
//     };

//     const getLabelType = async () => {
//         try {
//             const response = await axios.get(
//                 `${baseURL}/api/merchant/getLabelType`,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${localStorage.getItem("token")}`,
//                     },
//                 }
//             );
//             setLabelType(response?.data?.data?.label_type)

//         } catch (error) {
//             toast.error('Something went wrong')
//             return
//         }
//     }
//     useEffect(() => {
//         getLabelSettings()
//         getLabelType()
//     }, [])

//     return (

//         <div className="min-h-screen bg-[#EEEEEE]">
//             {/* Header Section */}
//             <header className="bg-[#0446DB] shadow-lg">
//                 <div className=" mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
//                     <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 sm:space-y-4 lg:space-y-0">
//                         <div className="text-center lg:text-left">
//                             <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">Label & Support Settings</h1>
//                             {/* <p className=' text-xl text-white'>Configure your label printing preferences and support information</p> */}
//                         </div>


//                     </div>
//                 </div>
//             </header>
//             <div className=" relative -top-10  mx-auto mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">


//                 {/* Tabs */}
//                 <div className="border-b rounded p-3 bg-white border-gray-200">
//                     <div className="flex space-x-8">
//                         <button
//                             onClick={() => setActiveTab('label')}
//                             className={`pb-4 px-1 font-medium text-sm transition-colors relative ${activeTab === 'label'
//                                 ? 'text-blue-600 border-b-2 border-blue-600'
//                                 : 'text-gray-500 hover:text-gray-700'
//                                 }`}
//                         >
//                             <div className="flex items-center gap-2">
//                                 <Printer className="w-4 h-4" />
//                                 Label Size
//                             </div>
//                         </button>
//                         <button
//                             onClick={() => setActiveTab('support')}
//                             className={`pb-4 px-1 font-medium text-sm transition-colors relative ${activeTab === 'support'
//                                 ? 'text-blue-600 border-b-2 border-blue-600'
//                                 : 'text-gray-500 hover:text-gray-700'
//                                 }`}
//                         >
//                             <div className="flex items-center gap-2">
//                                 <HelpCircle className="w-4 h-4" />
//                                 Support Settings
//                             </div>
//                         </button>
//                     </div>
//                 </div>

//                 {/* Tab Content */}
//                 <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
//                     {activeTab === 'label' && (
//                         <div className="space-y-6">
//                             <h2 className="text-lg font-semibold text-gray-800 mb-4">Choose Label Size</h2>

//                             <div className=' flex flex-col md:flex-row gap-2'>
//                                 {/* Standard Desktop Printer Option */}
//                                 <div
//                                     onClick={() => setLabelType('standard')}
//                                     className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${labelType === 'standard'
//                                         ? 'border-blue-500 bg-blue-50'
//                                         : 'border-gray-200 hover:border-gray-300'
//                                         }`}
//                                 >
//                                     <div className="flex items-start gap-4">
//                                         <div className="flex-shrink-0">
//                                             <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
//                                                 <Printer className="w-6 h-6 text-blue-600" />
//                                             </div>
//                                         </div>
//                                         <div className="flex-1">
//                                             <div className="flex items-center justify-between mb-2">
//                                                 <h3 className="font-semibold text-gray-800">Standard Desktop Printers</h3>
//                                                 <span className="text-sm text-gray-500">Size A4 (8" × 11")</span>
//                                             </div>
//                                             <p className="text-sm text-gray-600 mb-4">Four Labels Printed on one Sheet</p>


//                                             <img src={standard} className=' h-48' />

//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Thermal Label Printer Option */}
//                                 <div
//                                     onClick={() => setLabelType('thermal')}
//                                     className={`border-2 rounded-xl p-6 cursor-pointer transition-all ${labelType === 'thermal'
//                                         ? 'border-blue-500 bg-blue-50'
//                                         : 'border-gray-200 hover:border-gray-300'
//                                         }`}
//                                 >
//                                     <div className="flex items-start gap-4">
//                                         <div className="flex-shrink-0">
//                                             <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
//                                                 <Printer className="w-6 h-6 text-purple-600" />
//                                             </div>
//                                         </div>
//                                         <div className="flex-1">
//                                             <div className="flex items-center justify-between mb-2">
//                                                 <h3 className="font-semibold text-gray-800">Thermal Label Printers</h3>
//                                                 <span className="text-sm text-gray-500">Size (4" × 6")</span>
//                                             </div>
//                                             <p className="text-sm text-gray-600 mb-4">Single Label on one Sheet</p>

//                                             {/* Label Visual Representation */}

//                                             <img src={thermal} className=' h-48' />

//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>


//                         </div>
//                     )}

//                     {activeTab === 'support' && (
//                         <div className="space-y-6">
//                             <h2 className="text-lg font-semibold text-gray-800 mb-4">Support Configuration</h2>

//                             {/* Support Email */}
//                             <div className="space-y-2">
//                                 <label className="block text-sm font-medium text-gray-700">
//                                     Support Email
//                                 </label>
//                                 <div className="relative">
//                                     <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                                     <input
//                                         type="email"
//                                         name="support_email"
//                                         value={supportSettings.support_email}
//                                         onChange={handleSupportChange}
//                                         placeholder="support@example.com"
//                                         className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                                     />
//                                 </div>
//                             </div>

//                             {/* Support Phone */}
//                             <div className="space-y-2">
//                                 <label className="block text-sm font-medium text-gray-700">
//                                     Support Phone
//                                 </label>
//                                 <div className="relative">
//                                     <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                                     <input
//                                         type="tel"
//                                         name="support_phone"
//                                         value={supportSettings.support_phone}
//                                         onChange={handleSupportChange}
//                                         placeholder="+91 98765 43210"
//                                         className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                                     />
//                                 </div>
//                             </div>

//                             {/* Divider */}
//                             <div className="border-t border-gray-200 my-4"></div>

//                             {/* Visibility Settings */}
//                             <h3 className="text-md font-medium text-gray-800 mb-3">Visibility Preferences</h3>

//                             {/* Hide Warehouse Address */}
//                             <div className="flex items-center justify-between py-3 border-b border-gray-100">
//                                 <div className="flex items-start gap-3">
//                                     <EyeOff className="w-4 h-4 text-gray-400 mt-1" />
//                                     <div>
//                                         <p className="font-medium text-gray-700">Hide Warehouse Address</p>
//                                         <p className="text-xs text-gray-500">Don't show warehouse address on labels</p>
//                                     </div>
//                                 </div>
//                                 <label className="relative inline-flex items-center cursor-pointer">
//                                     <input
//                                         type="checkbox"
//                                         name="hide_warehouse_address"
//                                         checked={supportSettings.hide_warehouse_address === '1' ? 1 : 0}
//                                         onChange={handleSupportChange}
//                                         className="sr-only peer"
//                                     />
//                                     <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//                                 </label>
//                             </div>

//                             {/* Hide Warehouse Phone Number */}
//                             <div className="flex items-center justify-between py-3 border-b border-gray-100">
//                                 <div className="flex items-start gap-3">
//                                     <EyeOff className="w-4 h-4 text-gray-400 mt-1" />
//                                     <div>
//                                         <p className="font-medium text-gray-700">Hide Warehouse Phone Number</p>
//                                         <p className="text-xs text-gray-500">Don't show warehouse phone on labels</p>
//                                     </div>
//                                 </div>
//                                 <label className="relative inline-flex items-center cursor-pointer">
//                                     <input
//                                         type="checkbox"
//                                         name="hide_warehouse_phone_number"
//                                         checked={supportSettings.hide_warehouse_phone_number === '1' ? 1 : 0}
//                                         onChange={handleSupportChange}
//                                         className="sr-only peer"
//                                     />
//                                     <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//                                 </label>
//                             </div>

//                             {/* Hide Product Detail */}
//                             <div className="flex items-center justify-between py-3 border-b border-gray-100">
//                                 <div className="flex items-start gap-3">
//                                     <EyeOff className="w-4 h-4 text-gray-400 mt-1" />
//                                     <div>
//                                         <p className="font-medium text-gray-700">Hide Product Details</p>
//                                         <p className="text-xs text-gray-500">Don't show product information on labels</p>
//                                     </div>
//                                 </div>
//                                 <label className="relative inline-flex items-center cursor-pointer">
//                                     <input
//                                         type="checkbox"
//                                         name="hide_product_detail"
//                                         checked={supportSettings.hide_product_detail === '1' ? 1 : 0}
//                                         onChange={handleSupportChange}
//                                         className="sr-only peer"
//                                     />
//                                     <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//                                 </label>
//                             </div>
//                         </div>
//                     )}

//                     {/* Save Button */}
//                     <div className="mt-8 pt-4 border-t border-gray-200">
//                         <button
//                             onClick={handleSave}
//                             className="inline-flex items-center gap-2 cursor-pointer px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
//                         >
//                             <Save className="w-4 h-4" />
//                             Save Settings
//                         </button>
//                     </div>
//                 </div>


//             </div>
//         </div>


//     );
// };

// export default LabelSettings;






import React, { useEffect, useState } from "react";
import {
  Check,
  FileText,
  Headphones,
  HelpCircle,
  Loader2,
  Mail,
  MapPin,
  Package,
  Phone,
  Printer,
  Save,
  Smartphone,
} from "lucide-react";

import standard from "@/assets/standard-printer.png";
import thermal from "@/assets/thermal-printer.png";

import axios from "axios";
import { toast } from "react-toastify";

const baseURL = import.meta.env.VITE_BASE_URL;

const LabelSettings = () => {
  const [activeTab, setActiveTab] = useState("label");

  const [labelType, setLabelType] = useState("");

  const [supportSettings, setSupportSettings] = useState({
    support_email: "",
    support_phone: "",
    hide_warehouse_address: "0",
    hide_warehouse_phone_number: "0",
    hide_product_detail: "0",
  });

  const [loadingPage, setLoadingPage] = useState(true);
  const [saving, setSaving] = useState(false);

  /* =========================================================
     GET LABEL SETTINGS
  ========================================================= */

  const getLabelSettings = async () => {
    try {
      const response = await axios.get(
        `${baseURL}/api/merchant/getLabelSettings`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "token"
            )}`,
          },
        }
      );

      if (response.data.success) {
        setSupportSettings({
          support_email:
            response.data.data?.support_email || "",

          support_phone:
            response.data.data?.support_phone || "",

          hide_warehouse_address: String(
            response.data.data?.hide_warehouse_address ??
              "0"
          ),

          hide_warehouse_phone_number: String(
            response.data.data
              ?.hide_warehouse_phone_number ?? "0"
          ),

          hide_product_detail: String(
            response.data.data?.hide_product_detail ??
              "0"
          ),
        });
      }
    } catch (error) {
      console.error(
        "Get label settings error:",
        error
      );
    }
  };

  /* =========================================================
     GET LABEL TYPE
  ========================================================= */

  const getLabelType = async () => {
    try {
      const response = await axios.get(
        `${baseURL}/api/merchant/getLabelType`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "token"
            )}`,
          },
        }
      );

      setLabelType(
        response?.data?.data?.label_type || ""
      );
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong"
      );
    }
  };

  /* =========================================================
     LOAD PAGE DATA
  ========================================================= */

  const loadPageData = async () => {
    try {
      setLoadingPage(true);

      await Promise.all([
        getLabelSettings(),
        getLabelType(),
      ]);
    } finally {
      setLoadingPage(false);
    }
  };

  useEffect(() => {
    loadPageData();
  }, []);

  /* =========================================================
     HANDLE SUPPORT CHANGE
  ========================================================= */

  const handleSupportChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setSupportSettings((prev) => ({
      ...prev,

      [name]:
        type === "checkbox"
          ? checked
            ? "1"
            : "0"
          : value,
    }));
  };

  /* =========================================================
     SAVE SETTINGS
  ========================================================= */

  const handleSave = async () => {
    if (saving) return;

    try {
      setSaving(true);

      /* ===========================
         SAVE LABEL FORMAT
      =========================== */

      if (activeTab === "label") {
        if (!labelType) {
          toast.error(
            "Please select a label format"
          );
          return;
        }

        const response = await axios.post(
          `${baseURL}/api/merchant/changeMerchantLabelFormat`,
          {
            label_type: labelType,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(
                "token"
              )}`,
            },
          }
        );

        toast.success(
          response?.data?.message ||
            "Label settings updated successfully"
        );

        return;
      }

      /* ===========================
         SAVE SUPPORT SETTINGS
      =========================== */

      const label = {
        label_settings: supportSettings,
      };

      const response = await axios.post(
        `${baseURL}/api/merchant/updateLabelSettings`,
        label,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "token"
            )}`,
          },
        }
      );

      toast.success(
        response?.data?.message ||
          "Settings saved successfully"
      );

      await getLabelSettings();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================================
     VISIBILITY OPTIONS
  ========================================================= */

  const visibilityOptions = [
    {
      name: "hide_warehouse_address",
      title: "Hide Warehouse Address",
      description:
        "Don't show warehouse address on shipping labels.",
      icon: MapPin,
    },
    {
      name: "hide_warehouse_phone_number",
      title: "Hide Warehouse Phone",
      description:
        "Don't show warehouse phone number on labels.",
      icon: Smartphone,
    },
    {
      name: "hide_product_detail",
      title: "Hide Product Details",
      description:
        "Don't show product information on shipping labels.",
      icon: Package,
    },
  ];

  /* =========================================================
     PAGE LOADER
  ========================================================= */

  if (loadingPage) {
    return (
      <div className="flex h-[90vh] w-full items-center justify-center bg-[#F8FAFC] dark:bg-neutral-900">
        <div className="text-center">
          <Loader2 className="mx-auto h-7 w-7 animate-spin text-[#0446DB]" />

          <p className="mt-3 text-sm font-medium text-neutral-600 dark:text-neutral-300">
            Loading settings...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-3 text-neutral-900 transition-colors dark:bg-neutral-900 dark:text-neutral-100 sm:p-4 lg:p-6">
      <div className="mx-auto w-full">
        {/* =====================================================
            PAGE HEADER
        ===================================================== */}

        <div className="mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-2xl">
                Label & Support Settings
              </h1>

              <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                Configure shipping labels and customer
                support information.
              </p>
            </div>
          </div>
        </div>

        {/* =====================================================
            MAIN CARD
        ===================================================== */}

        <div className="overflow-hidden rounded-sm border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          {/* ===================================================
              TABS
          =================================================== */}

          <div className="border-b border-neutral-200 px-4 dark:border-neutral-800 sm:px-6">
            <div className="flex gap-6">
              {/* LABEL TAB */}

              <button
                type="button"
                onClick={() =>
                  setActiveTab("label")
                }
                className={`relative flex h-14 items-center gap-2 text-sm font-semibold transition-colors ${
                  activeTab === "label"
                    ? "text-[#0446DB] dark:text-blue-400"
                    : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                }`}
              >
                <Printer className="h-4 w-4" />

                Label Settings

                {activeTab === "label" && (
                  <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-[#0446DB]" />
                )}
              </button>

              {/* SUPPORT TAB */}

              <button
                type="button"
                onClick={() =>
                  setActiveTab("support")
                }
                className={`relative flex h-14 items-center gap-2 text-sm font-semibold transition-colors ${
                  activeTab === "support"
                    ? "text-[#0446DB] dark:text-blue-400"
                    : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
                }`}
              >
                <HelpCircle className="h-4 w-4" />

                Support Settings

                {activeTab === "support" && (
                  <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-[#0446DB]" />
                )}
              </button>
            </div>
          </div>

          {/* ===================================================
              LABEL TAB
          =================================================== */}

          {activeTab === "label" && (
            <div className="p-4 sm:p-6">
              {/* SECTION HEADER */}

              <div className="mb-6">
                <h2 className="text-base font-semibold text-neutral-900 dark:text-white">
                  Choose Label Format
                </h2>

                <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                  Select the printer and paper format used
                  for your shipping labels.
                </p>
              </div>

              {/* =================================================
                  PRINTER OPTIONS
              ================================================= */}

              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                {/* ===============================================
                    STANDARD PRINTER
                =============================================== */}

                <button
                  type="button"
                  onClick={() =>
                    setLabelType("standard")
                  }
                  className={`group relative overflow-hidden rounded-sm border text-left transition-all duration-200 ${
                    labelType === "standard"
                      ? "border-[#0446DB] bg-blue-50/50 ring-1 ring-[#0446DB] dark:border-blue-500 dark:bg-blue-500/5 dark:ring-blue-500"
                      : "border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800/40 dark:hover:border-neutral-600"
                  }`}
                >
                  {/* SELECTED */}

                  {labelType === "standard" && (
                    <div className="absolute right-4 top-4 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-[#0446DB] text-white">
                      <Check
                        className="h-4 w-4"
                        strokeWidth={3}
                      />
                    </div>
                  )}

                  <div className="p-5">
                    {/* HEADER */}

                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-sm ${
                          labelType === "standard"
                            ? "bg-[#0446DB]/10 text-[#0446DB] dark:bg-blue-500/15 dark:text-blue-400"
                            : "bg-neutral-100 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300"
                        }`}
                      >
                        <Printer className="h-5 w-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                          Standard Desktop Printer
                        </h3>

                        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                          A4 Paper • 8" × 11"
                        </p>
                      </div>
                    </div>

                    {/* DESCRIPTION */}

                    <div className="mt-4 flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
                      <FileText className="h-4 w-4 text-neutral-400" />

                      Four labels printed on one A4
                      sheet
                    </div>

                    {/* IMAGE */}

                    <div className="mt-5 flex min-h-[230px] items-center justify-center overflow-hidden rounded-sm border border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-700 dark:bg-neutral-800">
                      <img
                        src={standard}
                        alt="Standard desktop printer label"
                        className="max-h-[200px] max-w-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    </div>
                  </div>
                </button>

                {/* ===============================================
                    THERMAL PRINTER
                =============================================== */}

                <button
                  type="button"
                  onClick={() =>
                    setLabelType("thermal")
                  }
                  className={`group relative overflow-hidden rounded-sm border text-left transition-all duration-200 ${
                    labelType === "thermal"
                      ? "border-[#0446DB] bg-blue-50/50 ring-1 ring-[#0446DB] dark:border-blue-500 dark:bg-blue-500/5 dark:ring-blue-500"
                      : "border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800/40 dark:hover:border-neutral-600"
                  }`}
                >
                  {/* SELECTED */}

                  {labelType === "thermal" && (
                    <div className="absolute right-4 top-4 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-[#0446DB] text-white">
                      <Check
                        className="h-4 w-4"
                        strokeWidth={3}
                      />
                    </div>
                  )}

                  <div className="p-5">
                    {/* HEADER */}

                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-sm ${
                          labelType === "thermal"
                            ? "bg-[#0446DB]/10 text-[#0446DB] dark:bg-blue-500/15 dark:text-blue-400"
                            : "bg-neutral-100 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300"
                        }`}
                      >
                        <Printer className="h-5 w-5" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                          Thermal Label Printer
                        </h3>

                        <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                          Thermal Paper • 4" × 6"
                        </p>
                      </div>
                    </div>

                    {/* DESCRIPTION */}

                    <div className="mt-4 flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
                      <FileText className="h-4 w-4 text-neutral-400" />

                      Single shipping label on one sheet
                    </div>

                    {/* IMAGE */}

                    <div className="mt-5 flex min-h-[230px] items-center justify-center overflow-hidden rounded-sm border border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-700 dark:bg-neutral-800">
                      <img
                        src={thermal}
                        alt="Thermal printer label"
                        className="max-h-[200px] max-w-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* ===================================================
              SUPPORT TAB
          =================================================== */}

          {activeTab === "support" && (
            <div className="p-4 sm:p-6">
              {/* HEADER */}

              <div className="mb-6 flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-[#0446DB]/10 text-[#0446DB] dark:bg-blue-500/15 dark:text-blue-400">
                  <Headphones className="h-5 w-5" />
                </div>

                <div>
                  <h2 className="text-base font-semibold text-neutral-900 dark:text-white">
                    Support Configuration
                  </h2>

                  <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                    Configure the contact information
                    displayed on your shipping labels.
                  </p>
                </div>
              </div>

              {/* =================================================
                  CONTACT INFORMATION
              ================================================= */}

              <div className="rounded-sm border border-neutral-200 dark:border-neutral-800">
                {/* HEADER */}

                <div className="border-b border-neutral-200 px-5 py-4 dark:border-neutral-800">
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                    Contact Information
                  </h3>

                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    Support details shown to customers.
                  </p>
                </div>

                {/* INPUTS */}

                <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">
                  {/* EMAIL */}

                  <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-200">
                      Support Email
                    </label>

                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

                      <input
                        type="email"
                        name="support_email"
                        value={
                          supportSettings.support_email
                        }
                        onChange={
                          handleSupportChange
                        }
                        placeholder="support@example.com"
                        className="h-11 w-full rounded-sm border border-neutral-200 bg-white pl-10 pr-3 text-sm text-neutral-900 outline-none transition-all placeholder:text-neutral-400 focus:border-[#0446DB] focus:ring-1 focus:ring-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-500"
                      />
                    </div>
                  </div>

                  {/* PHONE */}

                  <div>
                    <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-200">
                      Support Phone
                    </label>

                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

                      <input
                        type="tel"
                        name="support_phone"
                        value={
                          supportSettings.support_phone
                        }
                        onChange={
                          handleSupportChange
                        }
                        placeholder="+91 XXXXX XXXXX"
                        className="h-11 w-full rounded-sm border border-neutral-200 bg-white pl-10 pr-3 text-sm text-neutral-900 outline-none transition-all placeholder:text-neutral-400 focus:border-[#0446DB] focus:ring-1 focus:ring-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* =================================================
                  VISIBILITY PREFERENCES
              ================================================= */}

              <div className="mt-5 overflow-hidden rounded-sm border border-neutral-200 dark:border-neutral-800">
                {/* HEADER */}

                <div className="border-b border-neutral-200 px-5 py-4 dark:border-neutral-800">
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                    Visibility Preferences
                  </h3>

                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    Choose what information should be
                    hidden from shipping labels.
                  </p>
                </div>

                {/* OPTIONS */}

                <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                  {visibilityOptions.map((item) => {
                    const Icon = item.icon;

                    const checked =
                      supportSettings[item.name] ===
                      "1";

                    return (
                      <div
                        key={item.name}
                        className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/40"
                      >
                        {/* LEFT */}

                        <div className="flex min-w-0 items-start gap-3">
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-sm transition-colors ${
                              checked
                                ? "bg-[#0446DB]/10 text-[#0446DB] dark:bg-blue-500/15 dark:text-blue-400"
                                : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400"
                            }`}
                          >
                            <Icon className="h-4 w-4" />
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                                {item.title}
                              </p>

                              {checked && (
                                <span className="rounded-sm bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400">
                                  Hidden
                                </span>
                              )}
                            </div>

                            <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                              {item.description}
                            </p>
                          </div>
                        </div>

                        {/* SWITCH */}

                        <label className="relative inline-flex shrink-0 cursor-pointer items-center">
                          <input
                            type="checkbox"
                            name={item.name}
                            checked={checked}
                            onChange={
                              handleSupportChange
                            }
                            className="peer sr-only"
                          />

                          <div
                            className="
                              h-6
                              w-11
                              rounded-full
                              bg-neutral-200
                              transition-colors

                              after:absolute
                              after:left-[2px]
                              after:top-[2px]
                              after:h-5
                              after:w-5
                              after:rounded-full
                              after:border
                              after:border-neutral-300
                              after:bg-white
                              after:transition-all
                              after:content-['']

                              peer-checked:bg-[#0446DB]
                              peer-checked:after:translate-x-full
                              peer-checked:after:border-white

                              peer-focus:ring-2
                              peer-focus:ring-blue-200

                              dark:bg-neutral-700
                              dark:peer-focus:ring-blue-900
                            "
                          />
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ===================================================
              FOOTER
          =================================================== */}

          <div className="flex flex-col gap-3 border-t border-neutral-200 bg-neutral-50/70 px-4 py-4 dark:border-neutral-800 dark:bg-neutral-950/30 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {activeTab === "label"
                ? "Changes will apply to newly generated shipping labels."
                : "Support and visibility changes will apply to newly generated labels."}
            </p>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-sm bg-[#0446DB] px-5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#0339B5] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabelSettings;