import React, { useEffect, useState } from "react";
import {
  Printer,
  Mail,
  Phone,
  EyeOff,
  Save,
  HelpCircle,
  Check,
  FileText,
  Headphones,
  MapPin,
  Package,
  Smartphone,
  Loader2,
} from "lucide-react";

import standard from "../../../assets/standard-printer.png";
import thermal from "../../../assets/thermal-printer.png";
import toast from "react-hot-toast";
import AxiosInstance from "../../../Helper/axiosInstance";

const LabelSettings = () => {
  const [activeTab, setActiveTab] = useState("label");
  const [labelType, setLabelType] = useState("standard");

  const [supportSettings, setSupportSettings] = useState({
    support_email: "",
    support_phone: "",
    hide_warehouse_address: false,
    hide_warehouse_phone_number: false,
    hide_product_detail: false,
  });

  const handleSupportChange = (e) => {
    const { name, value, type, checked } = e.target;

    setSupportSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const getLabelSetting = async () => {
    try {
      const res = await AxiosInstance.get("/api/merchant/getLabelSettings");
      setSupportSettings((pre) => ({
        ...pre,
        support_email: res.data?.data?.support_email,
        support_phone: res.data?.data?.support_phone,
        hide_warehouse_address: res.data?.data?.hide_warehouse_address
          ? true
          : false,
        hide_warehouse_phone_number: res.data?.data?.hide_warehouse_phone_number
          ? true
          : false,
        hide_product_detail: res.data?.data?.hide_product_detail ? true : false,
      }));
      
    } catch (error) {}
  };
  const getLabelType = async () => {
    try {
      const labelType = await AxiosInstance.get("/api/merchant/getLabelType");
      setLabelType(labelType?.data?.data?.label_type);
    } catch (error) {}
  };
  const handleSave = async () => {
    if (activeTab == "label") {
     
      const res = await AxiosInstance.post(
        `/api/merchant/changeMerchantLabelFormat`,
        {
          label_type: labelType,
        },
      );
     
      toast.success(res.data?.message)
      return;
    }

    
    const label_settings = {
      support_email: supportSettings?.support_email,
      support_phone: supportSettings?.support_phone,
      hide_warehouse_address: supportSettings?.hide_warehouse_address ? 1 : 0,
      hide_warehouse_phone_number: supportSettings?.hide_warehouse_phone_number
        ? 1
        : 0,
      hide_product_detail: supportSettings?.hide_product_detail ? 1 : 0,
    };
    
    const res = await AxiosInstance.post(
      `/api/merchant/updateLabelSettings`,
      {label_settings},
    );

    getLabelSetting();

    toast.success("Settings saved successfully!");
  };

  const visibilityOptions = [
    {
      name: "hide_warehouse_address",
      title: "Hide Warehouse Address",
      description: "Don't show warehouse address on shipping labels.",
      icon: MapPin,
    },
    {
      name: "hide_warehouse_phone_number",
      title: "Hide Warehouse Phone",
      description: "Don't show warehouse phone number on labels.",
      icon: Smartphone,
    },
    {
      name: "hide_product_detail",
      title: "Hide Product Details",
      description: "Don't show product information on shipping labels.",
      icon: Package,
    },
  ];

  useEffect(() => {
    getLabelSetting();
    getLabelType();
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
            <p className="mt-2"> Loading...</p>
          </div>
        </div>
      ):(

        <div className="min-h-screen bg-[#F8FAFC] p-3 text-neutral-900 transition-colors dark:bg-neutral-900 dark:text-neutral-100 sm:p-4 lg:p-6">
          <div className="mx-auto w-full">
            {/* =====================================================
                PAGE HEADER
            ====================================================== */}
    
            <div className="mb-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-2xl">
                    Label & Support Settings
                  </h1>
    
                  <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                    Configure shipping labels and customer support information.
                  </p>
                </div>
              </div>
            </div>
    
            {/* =====================================================
                MAIN CARD
            ====================================================== */}
    
            <div className="overflow-hidden rounded-sm border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              {/* ===================================================
                  TABS
              ==================================================== */}
    
              <div className="border-b border-neutral-200 px-4 dark:border-neutral-800 sm:px-6">
                <div className="flex gap-6">
                  <button
                    type="button"
                    onClick={() => setActiveTab("label")}
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
    
                  <button
                    type="button"
                    onClick={() => setActiveTab("support")}
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
              ==================================================== */}
    
              {activeTab === "label" && (
                <div className="p-4 sm:p-6">
                  {/* Section Header */}
    
                  <div className="mb-6">
                    <h2 className="text-base font-semibold text-neutral-900 dark:text-white">
                      Choose Label Format
                    </h2>
    
                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                      Select the printer and paper format used for your shipping
                      labels.
                    </p>
                  </div>
    
                  {/* Printer Options */}
    
                  <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                    {/* =============================================
                        STANDARD PRINTER
                    ============================================== */}
    
                    <button
                      type="button"
                      onClick={() => setLabelType("standard")}
                      className={`group relative overflow-hidden rounded-sm border text-left transition-all duration-200 ${
                        labelType === "standard"
                          ? "border-[#0446DB] bg-blue-50/50 ring-1 ring-[#0446DB] dark:border-blue-500 dark:bg-blue-500/5 dark:ring-blue-500"
                          : "border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800/40 dark:hover:border-neutral-600"
                      }`}
                    >
                      {/* Selected Indicator */}
    
                      {labelType === "standard" && (
                        <div className="absolute right-4 top-4 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-[#0446DB] text-white">
                          <Check className="h-4 w-4" strokeWidth={3} />
                        </div>
                      )}
    
                      <div className="p-5">
                        {/* Printer Header */}
    
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
    
                        {/* Description */}
    
                        <div className="mt-4 flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
                          <FileText className="h-4 w-4 text-neutral-400" />
                          Four labels printed on one A4 sheet
                        </div>
    
                        {/* Image Preview */}
    
                        <div className="mt-5 flex min-h-[230px] items-center justify-center overflow-hidden rounded-sm border border-neutral-200 bg-neutral-50 p-5 dark:border-neutral-700 dark:bg-neutral-800">
                          <img
                            src={standard}
                            alt="Standard desktop printer label"
                            className="max-h-[200px] max-w-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
                          />
                        </div>
                      </div>
                    </button>
    
                    {/* =============================================
                        THERMAL PRINTER
                    ============================================== */}
    
                    <button
                      type="button"
                      onClick={() => setLabelType("thermal")}
                      className={`group relative overflow-hidden rounded-sm border text-left transition-all duration-200 ${
                        labelType === "thermal"
                          ? "border-[#0446DB] bg-blue-50/50 ring-1 ring-[#0446DB] dark:border-blue-500 dark:bg-blue-500/5 dark:ring-blue-500"
                          : "border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-md dark:border-neutral-700 dark:bg-neutral-800/40 dark:hover:border-neutral-600"
                      }`}
                    >
                      {labelType === "thermal" && (
                        <div className="absolute right-4 top-4 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-[#0446DB] text-white">
                          <Check className="h-4 w-4" strokeWidth={3} />
                        </div>
                      )}
    
                      <div className="p-5">
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
    
                        <div className="mt-4 flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-300">
                          <FileText className="h-4 w-4 text-neutral-400" />
                          Single shipping label on one sheet
                        </div>
    
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
              ==================================================== */}
    
              {activeTab === "support" && (
                <div className="p-4 sm:p-6">
                  <div className="mb-6 flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-[#0446DB]/10 text-[#0446DB] dark:bg-blue-500/15 dark:text-blue-400">
                      <Headphones className="h-5 w-5" />
                    </div>
    
                    <div>
                      <h2 className="text-base font-semibold text-neutral-900 dark:text-white">
                        Support Configuration
                      </h2>
    
                      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                        Configure the contact information displayed on your shipping
                        labels.
                      </p>
                    </div>
                  </div>
    
                  {/* =================================================
                      CONTACT INFORMATION
                  ================================================== */}
    
                  <div className="rounded-sm border border-neutral-200 dark:border-neutral-800">
                    <div className="border-b border-neutral-200 px-5 py-4 dark:border-neutral-800">
                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                        Contact Information
                      </h3>
    
                      <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                        Support details shown to customers.
                      </p>
                    </div>
    
                    <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">
                      {/* Email */}
    
                      <div>
                        <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-200">
                          Support Email
                        </label>
    
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
    
                          <input
                            type="email"
                            name="support_email"
                            value={supportSettings.support_email}
                            onChange={handleSupportChange}
                            placeholder="support@example.com"
                            className="h-11 w-full rounded-sm border border-neutral-200 bg-white pl-10 pr-3 text-sm text-neutral-900 outline-none transition-all placeholder:text-neutral-400 focus:border-[#0446DB] focus:ring-1 focus:ring-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-500"
                          />
                        </div>
                      </div>
    
                      {/* Phone */}
    
                      <div>
                        <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-200">
                          Support Phone
                        </label>
    
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
    
                          <input
                            type="tel"
                            name="support_phone"
                            value={supportSettings.support_phone}
                            onChange={handleSupportChange}
                            placeholder="+91 XXXXX XXXXX"
                            className="h-11 w-full rounded-sm border border-neutral-200 bg-white pl-10 pr-3 text-sm text-neutral-900 outline-none transition-all placeholder:text-neutral-400 focus:border-[#0446DB] focus:ring-1 focus:ring-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
              
                  {/* =================================================
                      VISIBILITY
                  ================================================== */}
    
                  <div className="mt-5 overflow-hidden rounded-sm border border-neutral-200 dark:border-neutral-800">
                    <div className="border-b border-neutral-200 px-5 py-4 dark:border-neutral-800">
                      <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                        Visibility Preferences
                      </h3>
    
                      <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                        Choose what information should be hidden from shipping
                        labels.
                      </p>
                    </div>
    
                    <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                      {visibilityOptions.map((item) => {
                        const Icon = item.icon;
                        const checked = supportSettings[item.name];
    
                        return (
                          <div
                            key={item.name}
                            className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-800/40"
                          >
                            <div className="flex min-w-0 items-start gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                                <Icon className="h-4 w-4" />
                              </div>
    
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                                  {item.title}
                                </p>
    
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
                                onChange={handleSupportChange}
                                className="peer sr-only"
                              />
    
                              <div className="h-6 w-11 rounded-full bg-neutral-200 transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-neutral-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#0446DB] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-2 peer-focus:ring-blue-200 dark:bg-neutral-700 dark:peer-focus:ring-blue-900" />
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
              ==================================================== */}
    
              <div className="flex flex-col gap-3 border-t border-neutral-200 bg-neutral-50/70 px-4 py-4 dark:border-neutral-800 dark:bg-neutral-950/30 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Changes will apply to newly generated shipping labels.
                </p>
    
                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-sm bg-[#0446DB] px-5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#0339B5] hover:shadow-md"
                >
                  <Save className="h-4 w-4" />
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    }
    </>
  );
};

export default LabelSettings;
