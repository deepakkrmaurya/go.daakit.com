import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Info,
  ChevronDown,
  Loader2,
  ArrowLeft,
  Eye,
  EyeOff,
} from "lucide-react";

const AddShopifyDetails = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  const [formData, setFormData] = useState({
    channelName: "",
    storeUrl: "",
    apiKey: "",
    accessToken: "",
    apiSecret: "",
    fulfillStatus: "booked",
    updateShipment: true,
    cancelOrders: true,
    markAsPaid: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      console.log("Shopify Data:", formData);

      // Add your API here

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "h-11 w-full rounded-sm border border-slate-200 bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:placeholder:text-slate-500";

  return (
    <div className="min-h-screen bg-[#f7f9fc] dark:bg-[#080d17]">
      {/* Header */}
      <header className="">
        <div className="px-5">
          

          <h1 className="text-2xl font-bold tracking-tight dark:text-white md:text-[28px]">
            Add Shopify Details
          </h1>
        </div>
      </header>

      {/* Main */}
      <main className="px-5 py-2">
        <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_390px]">
          {/* Form */}
          <div className="overflow-hidden rounded-sm border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#0d1421]">
            <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Shopify Add Information
              </h2>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-5 p-5 sm:p-6">
                {/* Channel Name */}
                <FieldLabel label="Channel Name" required />

                <input
                  type="text"
                  name="channelName"
                  value={formData.channelName}
                  onChange={handleChange}
                  placeholder="Channel Name"
                  required
                  className={inputClass}
                />

                {/* Store URL */}
                <div>
                  <FieldLabel label="Store URL" required />

                  <input
                    type="text"
                    name="storeUrl"
                    value={formData.storeUrl}
                    onChange={handleChange}
                    placeholder="Enter Store URL"
                    required
                    className={inputClass}
                  />

                  <p className="mt-1.5 text-[11px] text-slate-400">
                    Store URL should be like yourstore.myshopify.com
                  </p>
                </div>

                {/* API Key */}
                <div>
                  <FieldLabel label="API Key" required />

                  <input
                    type="text"
                    name="apiKey"
                    value={formData.apiKey}
                    onChange={handleChange}
                    placeholder="API Key"
                    required
                    className={inputClass}
                  />
                </div>

                {/* Access Token */}
                <div>
                  <FieldLabel
                    label="Admin API Access token"
                    required
                  />

                  <div className="relative">
                    <input
                      type={showToken ? "text" : "password"}
                      name="accessToken"
                      value={formData.accessToken}
                      onChange={handleChange}
                      placeholder="Enter Admin API Access Token"
                      required
                      className={`${inputClass} pr-11`}
                    />

                    <button
                      type="button"
                      onClick={() => setShowToken((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-[#0446DB]"
                    >
                      {showToken ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Secret */}
                <div>
                  <FieldLabel label="API secret key" required />

                  <div className="relative">
                    <input
                      type={showSecret ? "text" : "password"}
                      name="apiSecret"
                      value={formData.apiSecret}
                      onChange={handleChange}
                      placeholder="Enter Shared Secret"
                      required
                      className={`${inputClass} pr-11`}
                    />

                    <button
                      type="button"
                      onClick={() => setShowSecret((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-[#0446DB]"
                    >
                      {showSecret ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Fulfill */}
                <div className="border-t border-slate-100 pt-5 dark:border-slate-800">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Fulfill Orders
                  </h3>

                  <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                    Select when to Auto Fulfill the Order in Shopify?
                  </p>

                  <div className="relative mt-3 w-full sm:w-[270px]">
                    <select
                      name="fulfillStatus"
                      value={formData.fulfillStatus}
                      onChange={handleChange}
                      className={`${inputClass} appearance-none pr-10`}
                    >
                      <option value="booked">
                        Order is Booked
                      </option>

                      <option value="shipped">
                        Order is Shipped
                      </option>

                      <option value="delivered">
                        Order is Delivered
                      </option>
                    </select>

                    <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  </div>

                  <div className="mt-5 space-y-3">
                    <CheckboxField
                      name="updateShipment"
                      checked={formData.updateShipment}
                      onChange={handleChange}
                      label="Automatically update the shipment status in Shopify."
                    />

                    <CheckboxField
                      name="cancelOrders"
                      checked={formData.cancelOrders}
                      onChange={handleChange}
                      label="Cancel orders"
                    />

                    <CheckboxField
                      name="markAsPaid"
                      checked={formData.markAsPaid}
                      onChange={handleChange}
                      label="Mark as paid"
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex justify-end border-t border-slate-100 px-5 py-4 sm:px-6 dark:border-slate-800">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex h-10 min-w-[110px] items-center justify-center gap-2 rounded-sm bg-[#1263e9] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0446DB] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}

                  {loading ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>

          {/* Guidelines */}
          <aside className="overflow-hidden rounded-sm border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#0d1421]">
            <div className="flex items-center gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-lime-50 text-lime-600 dark:bg-lime-500/10 dark:text-lime-400">
                <Info className="h-4 w-4" />
              </div>

              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Guidelines for Integrate Shopify Channel
              </h2>
            </div>

            <div className="px-6 py-5">
              <ol className="space-y-3 text-xs leading-5 text-slate-600 dark:text-slate-400">
                <li>
                  Log in to the Shopify Admin Panel via the Shopify URL.
                </li>

                <li>
                  Click on login, put your login credentials to process.
                </li>

                <li>Go to the "Settings".</li>

                <li>
                  Go to the "Apps and sales Channels".
                </li>

                <li>
                  Click on the "Develop Apps" button.
                </li>

                <li>Click on "Create an App".</li>

                <li>
                  Enter the Name of the App and click on "Create App".
                </li>

                <li>
                  Go to API Settings to get the API Key & Secret Key,
                  copy and put them on the form.
                </li>

                <li>
                  Click on "Configure Admin API Scope", check all
                  permissions, then click on save.
                </li>

                <li>
                  Click on "Configure Storefront API Integration",
                  check all permissions, then click on save.
                </li>

                <li>
                  Click on "Install App" button & Copy the "Admin API
                  Access Token", then put the same token on the form.
                </li>
              </ol>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

const FieldLabel = ({ label, required = false }) => {
  return (
    <label className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-300">
      {label}

      {required && (
        <span className="ml-1 text-red-500">*</span>
      )}
    </label>
  );
};

const CheckboxField = ({
  name,
  checked,
  onChange,
  label,
}) => {
  return (
    <label className="flex cursor-pointer items-start gap-2.5">
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
        className="mt-0.5 h-4 w-4 cursor-pointer rounded border-slate-300 accent-[#1263e9]"
      />

      <span className="text-xs leading-5 text-slate-600 dark:text-slate-300">
        {label}
      </span>
    </label>
  );
};

export default AddShopifyDetails;