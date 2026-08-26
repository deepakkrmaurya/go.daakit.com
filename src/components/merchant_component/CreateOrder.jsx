import React, { useEffect, useMemo, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import {
  FileText,
  Info,
  MapPin,
  Package,
  Plus,
  ShieldCheck,
  Trash2,
} from "lucide-react";

import terms_and_conditions from "../../assets/terms_and_conditions.pdf";

import Shield_icon from "../../assets/Shield_icon.jpeg";
import { toast } from "react-toastify";

const baseURL = import.meta.env.VITE_BASE_URL;

const merchantFrontAPI = `${String(baseURL || "").replace(/\/$/, "")}/api/merchant`;

const apiRequest = async (path, options = {}) => {
  const token =
    localStorage.getItem("merchantToken") || localStorage.getItem("token");

  const url = `${merchantFrontAPI}${path}`;

  try {
    const response = await fetch(url, {
      ...options,

      headers: {
        "Content-Type": "application/json",

        ...(token
          ? {
              "x-auth-token": token,
            }
          : {}),

        ...(options.headers || {}),
      },
    });

    const responseText = await response.text();

    console.log("Merchant API Response");
    console.log("Status:", response.status);
    console.log("Status text:", response.statusText);
    console.log("Content-Type:", response.headers.get("content-type"));
    console.log("Raw response:", responseText);

    let result = {};

    try {
      result = responseText ? JSON.parse(responseText) : {};
    } catch {
      result = {
        success: false,

        message: responseText || "Invalid server response",
      };
    }

    if (!response.ok || result.success === false) {
      throw new Error(
        result.message ||
          result.error ||
          `Request failed: ${response.status} ${response.statusText}`,
      );
    }

    return result;
  } catch (error) {
    console.error("Merchant API Error:", {
      url,

      method: options.method || "GET",

      message: error.message,

      error,
    });

    throw error;
  }
};

const toApiAddress = (address, includeCoordinates = true) => ({
  contact_name: address.contactName,

  phone: address.phone,

  address_line: address.addressLine,

  pincode: address.pincode,

  city: address.city,

  state: address.state,

  country: address.country || "India",

  ...(includeCoordinates
    ? {
        latitude: address.latitude || null,

        longitude: address.longitude || null,
      }
    : {}),
});

const fromApiAddress = (draft, prefix) => ({
  contactName: draft[`${prefix}_contact_name`] ?? "",

  phone: draft[`${prefix}_phone`] ?? "",

  addressLine: draft[`${prefix}_address_line`] ?? "",

  pincode: draft[`${prefix}_pincode`] ?? "",

  city: draft[`${prefix}_city`] ?? "",

  state: draft[`${prefix}_state`] ?? "",

  country: draft[`${prefix}_country`] ?? "India",

  latitude:
    draft[`${prefix}_latitude`] ??
    (prefix === "pickup" ? draft.latitude : "") ??
    "",

  longitude:
    draft[`${prefix}_longitude`] ??
    (prefix === "pickup" ? draft.longitude : "") ??
    "",
});

const inputClass =
  "h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-800 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 disabled:bg-slate-50 disabled:text-slate-400";

const initialAddress = {
  contactName: "",

  phone: "",

  addressLine: "",

  pincode: "",

  city: "",

  state: "",

  country: "India",

  latitude: "",

  longitude: "",
};

const emptyItem = () => ({
  id: `${Date.now()}-${Math.random()}`,

  sku: "",

  productName: "",

  quantity: 1,

  unitPrice: 0,

  weight: "",

  dimensions: "",
});

function Field({ label, required, error, className = "", ...props }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs font-medium text-slate-600">
        {label} {required && <span className="text-red-500">*</span>}
      </span>

      <input
        className={`${inputClass} ${error ? "border-red-500 focus:border-red-500 focus:ring-red-500/10" : ""}`}
        aria-invalid={Boolean(error)}
        {...props}
        onKeyDown={(e) =>
          props.type === "number" &&
          ["e", "E", "+", "-"].includes(e.key) &&
          e.preventDefault()
        }
      />

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </label>
  );
}

function Toggle({ checked, onChange, disabled = false }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${
        checked ? "bg-[#064574]" : "bg-slate-300"
      } disabled:cursor-not-allowed disabled:opacity-50`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all  cursor-pointer ${
          checked ? "left-[22px]" : "left-0.5"
        }`}
      />
    </button>
  );
}

function DaakitShield({ checked, onChange }) {
  const benefits = [
    {
      icon: MapPin,

      title: "Up to Rs. 500000",

      description: "Security Coverage",

      color: "bg-blue-50 text-[#0446DB]",
    },

    {
      icon: FileText,

      title: "Within 7-Days",

      description: "Claim Settlement",

      color: "bg-orange-50 text-orange-500",
    },

    {
      icon: Package,

      title: "10,000+",

      description: "Shipments Shielded",

      color: "bg-blue-50 text-[#0446DB]",
    },
  ];

  return (
    <section className="overflow-hidden rounded-2xl border border-[#d5e2ef] bg-gradient-to-r  from-[#eef9ff] via-white to-[#fff3ec] p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <img
            className="grid h-12 w-12 shrink-0 place-items-center rounded-full border-4 border-white bg-[#0b67e8] text-white shadow-md "
            src={Shield_icon}
            alt="Shield Icon"
          />

          <div>
            <h2 className="text-base font-bold text-slate-950 sm:text-lg">
              Your Shipment Is Covered Under{" "}
              <span className="text-[#075ee5]">Shield by DAAKit!</span>
            </h2>

            <p className="mt-1 text-sm text-[#315f9f]">
              You have successfully opted for security coverage on your order(s)
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 sm:justify-end">
          <span className="text-sm text-[#315f9f]">Shield Your Shipment</span>

          <Toggle checked={checked} onChange={onChange} />
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[220px_minmax(0,1fr)] lg:items-center">
        <div className="text-sm font-semibold leading-6 text-slate-950">
          Why Choose
          <br />
          <span className="text-[#075ee5]">Daakit Shield?</span>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {benefits.map(({ icon: Icon, title, description, color }) => (
            <div
              key={title}
              className="flex min-h-16 items-center gap-3 rounded-xl border border-[#d5e2ef] bg-white/90 px-4 py-3"
            >
              <span
                className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${color}`}
              >
                <Icon size={20} />
              </span>

              <div>
                <p className="text-xs font-bold text-slate-950">{title}</p>

                <p className="mt-1 text-xs text-[#315f9f]">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-start gap-2 text-xs leading-5 text-[#315f9f] sm:text-sm">
        <Info size={16} className="mt-0.5 shrink-0" />

        <p>
          <a
            href={terms_and_conditions}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-slate-950 underline"
          >
            Terms And Condition
          </a>{" "}
          <span className="ml-1">
            *Applicable for all shipments greater than Rs. 2000. Without Daakit
            Shield, shipment damage and loss liability is limited to Rs. 2000
            only.
          </span>
        </p>
      </div>
    </section>
  );
}

function Section({ number, title, subtitle, action, children }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-slate-100 text-sm font-semibold text-[#083d68]">
            {number}
          </span>

          <div>
            <h2 className="text-sm font-semibold text-slate-900">{title}</h2>

            {subtitle && (
              <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
            )}
          </div>
        </div>

        {action}
      </div>

      {children}
    </section>
  );
}

function AddressFields({
  value,

  onChange,

  disabled = false,

  serviceability = false,

  pincodeLoading = false,

  errors = {},

  optional = false,

  showCoordinates = true,

  onValidate,

  onPincodeBlur,
}) {
  const update = (key, nextValue) => {
    const nextAddress =
      key === "pincode" && nextValue !== value.pincode
        ? { ...value, pincode: nextValue, city: "", state: "" }
        : { ...value, [key]: nextValue };

    onChange(nextAddress);

    onValidate?.(key, nextValue);
  };

  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-3">
      <Field
        label="Contact name"
        required={!optional}
        placeholder="Enter contact name"
        error={errors.contactName}
        value={value.contactName}
        disabled={disabled}
        onChange={(e) => update("contactName", e.target.value)}
      />

      <Field
        label="Phone"
        required={!optional}
        placeholder="Enter 10-digit mobile number"
        error={errors.phone}
        inputMode="numeric"
        maxLength={10}
        value={value.phone}
        disabled={disabled}
        onChange={(e) => update("phone", e.target.value.replace(/\D/g, ""))}
      />

      <Field
        label="Address line"
        required={!optional}
        placeholder="House no., street, area, landmark"
        error={errors.addressLine}
        value={value.addressLine}
        disabled={disabled}
        onChange={(e) => update("addressLine", e.target.value)}
      />

      <div>
        <Field
          label="Pincode"
          required={!optional}
          placeholder="Enter 6-digit pincode"
          error={errors.pincode}
          value={value.pincode}
          disabled={disabled}
          maxLength={6}
          inputMode="numeric"
          onChange={(e) => update("pincode", e.target.value.replace(/\D/g, ""))}
          onBlur={(e) => onPincodeBlur?.(e.target.value)}
        />

        {serviceability && (
          <p
            className={`mt-1.5 text-[11px] ${
              pincodeLoading ? "text-[#0446DB]" : "text-slate-500"
            }`}
          >
            {pincodeLoading
              ? "Fetching city and state..."
              : "City and state will auto-fill on blur"}
          </p>
        )}
      </div>

      <Field
        label="City"
        required={!optional}
        placeholder="Enter city"
        error={errors.city}
        value={value.city}
        disabled={disabled}
        onChange={(e) => update("city", e.target.value)}
      />

      <Field
        label="State"
        required={!optional}
        placeholder="Enter state"
        error={errors.state}
        value={value.state}
        disabled={disabled}
        onChange={(e) => update("state", e.target.value)}
      />

      <Field
        label="Country"
        required={!optional}
        placeholder="Enter country"
        error={errors.country}
        value={value.country}
        disabled={disabled}
        onChange={(e) => update("country", e.target.value)}
      />

      {showCoordinates && (
        <>
          <Field
            label="Latitude"
            required={!optional}
            type="text"
            inputMode="decimal"
            placeholder="e.g. 28.4595"
            error={errors.latitude}
            value={value.latitude ?? ""}
            disabled={disabled}
            onChange={(e) => {
              const inputValue = e.target.value;

              if (/^-?\d*\.?\d*$/.test(inputValue)) {
                update("latitude", inputValue);
              }
            }}
          />

          <Field
            label="Longitude"
            required={!optional}
            type="text"
            inputMode="decimal"
            placeholder="e.g. 77.0266"
            error={errors.longitude}
            value={value.longitude ?? ""}
            disabled={disabled}
            onChange={(e) => {
              const inputValue = e.target.value;

              if (/^-?\d*\.?\d*$/.test(inputValue)) {
                update("longitude", inputValue);
              }
            }}
          />
        </>
      )}
    </div>
  );
}

export default function CreateOrder() {
  const navigate = useNavigate();

  const location = useLocation();

  const queryDraftId = new URLSearchParams(location.search).get("draft_id");

  // const draftId = location.state?.editOrder?.id || queryDraftId || null;
  const editDraftId = location.state?.editOrder?.id || queryDraftId || null;
  const copyDraftId = location.state?.copyOrder?.id || null;
  // const isEditMode = Boolean(draftId);
  const draftId = copyDraftId || editDraftId;
  const isCopyMode = Boolean(copyDraftId);
  const isEditMode = Boolean(editDraftId) && !isCopyMode;

  const [pickupAddress, setPickupAddress] = useState(initialAddress);

  const [deliveryAddress, setDeliveryAddress] = useState(initialAddress);

  const [returnAddress, setReturnAddress] = useState(initialAddress);

  const [deliverySameAsPickup, setDeliverySameAsPickup] = useState(false);

  const [returnSameAsPickup, setReturnSameAsPickup] = useState(true);

  const [insurance, setInsurance] = useState(false);
  const [insuranceManuallyChanged, setInsuranceManuallyChanged] =
    useState(false);

  const [insuranceLimit, setInsuranceLimit] = useState(0);

  const [insuranceLimitLoading, setInsuranceLimitLoading] = useState(true);

  const [errors, setErrors] = useState({});

  const [order, setOrder] = useState({
    orderType: "Prepaid",

    invoiceNumber: "",

    totalAmount: "",

    codAmount: "",

    totalWeight: "",

    boxes: "1",

    length: "",

    breadth: "",

    height: "",
  });

  const [items, setItems] = useState([emptyItem()]);

  const [submitting, setSubmitting] = useState(false);

  const [loadingDraft, setLoadingDraft] = useState(isEditMode);

  const [pincodeLoading, setPincodeLoading] = useState({
    pickup: false,

    delivery: false,

    return: false,
  });

  const {
    pickup: pickupErrors,

    delivery: deliveryErrors,

    return: returnErrors,
  } = useMemo(() => {
    const addressErrors = {
      pickup: {},

      delivery: {},

      return: {},
    };

    Object.entries(errors).forEach(([path, message]) => {
      const [section, field] = path.split(".");

      if (addressErrors[section] && field) {
        addressErrors[section][field] = message;
      }
    });

    return addressErrors;
  }, [errors]);

  useEffect(() => {
    if (!draftId) return;

    const loadDraft = async () => {
      try {
        setLoadingDraft(true);

        const result = await apiRequest(`/draft/${draftId}`);

        const draft = result.draft;

        setPickupAddress(fromApiAddress(draft, "pickup"));

        setDeliveryAddress(fromApiAddress(draft, "delivery"));

        setReturnAddress(fromApiAddress(draft, "return"));

        setReturnSameAsPickup(Boolean(Number(draft.same_as_pickup_return)));

        // setInsurance(Boolean(Number(draft.opt_insurance)));
        const savedInsurance = draft.is_insurance ?? draft.opt_insurance ?? 0;

        setInsurance(Boolean(Number(savedInsurance)));

        // Edit mode mein DB ka saved 0/1 preserve rahega
        setInsuranceManuallyChanged(isEditMode);
        setOrder({
          orderType:
            String(draft.order_type).toLowerCase() === "cod"
              ? "COD"
              : "Prepaid",

          // invoiceNumber: draft.orderno || "",
          invoiceNumber: isCopyMode
            ? `${draft.orderno || ""}-Copy`
            : draft.orderno || "",

          totalAmount: draft.total_amount ?? "",

          codAmount: draft.collectable_amount ?? "",

          totalWeight: draft.total_weight ?? "",

          boxes: "1",

          length: draft.package_length ?? "",

          breadth: draft.package_breadth ?? "",

          height: draft.package_height ?? "",
        });

        setItems(
          result.items?.length
            ? result.items.map((item) => ({
                id: String(item.id),

                sku: item.product_sku || "",

                productName: item.product_name || "",

                quantity: item.product_quantity ?? 1,

                unitPrice: item.product_price ?? 0,

                weight: item.product_weight ?? "",

                dimensions: item.dimensions || "",
              }))
            : [emptyItem()],
        );
      } catch (error) {
        toast.error(error.message);

        navigate("/merchant/order-draft");
      } finally {
        setLoadingDraft(false);
      }
    };

    loadDraft();
  }, [draftId, isCopyMode, navigate]);

  useEffect(() => {
    let isMounted = true;

    const fetchInsuranceLimit = async () => {
      try {
        setInsuranceLimitLoading(true);

        const result = await apiRequest("/getInsuranceLimit");

        const fetchedLimit = Number(
          result?.data?.insurance_limit ?? result?.insurance_limit ?? 0,
        );

        // const fetchedLimit = Number(result?.data?.insurance_limit || 0);

        if (isMounted) {
          setInsuranceLimit(
            Number.isFinite(fetchedLimit) && fetchedLimit > 0
              ? fetchedLimit
              : 0,
          );
        }

        console.log("Insurance limit:", fetchedLimit);
      } catch (error) {
        console.error("Get insurance limit failed:", error);

        if (isMounted) {
          setInsuranceLimit(0);
        }
      } finally {
        if (isMounted) {
          setInsuranceLimitLoading(false);
        }
      }
    };

    fetchInsuranceLimit();

    return () => {
      isMounted = false;
    };
  }, []);

  const updateError = (path, message = "") => {
    setErrors((current) => {
      if (message) {
        if (current[path] === message) return current;

        return { ...current, [path]: message };
      }

      if (!current[path]) return current;

      const nextErrors = { ...current };

      delete nextErrors[path];

      return nextErrors;
    });
  };

  const handlePincodeLookup = async (section, pincode) => {
    const normalizedPincode = String(pincode || "").trim();

    if (!/^\d{6}$/.test(normalizedPincode)) {
      updateError(
        `${section}.pincode`,

        normalizedPincode
          ? "Pincode must contain exactly 6 digits"
          : section === "return"
            ? ""
            : "This field is required",
      );

      return;
    }

    setPincodeLoading((current) => ({ ...current, [section]: true }));

    try {
      const result = await apiRequest(
        `/pincode/${encodeURIComponent(normalizedPincode)}`,
      );

      const locationData = result?.data?.location;

      if (!locationData?.city || !locationData?.state) {
        throw new Error("City and state not found for this pincode");
      }

      const applyLocation = (setter) => {
        setter((current) =>
          current.pincode === normalizedPincode
            ? {
                ...current,

                city: locationData.city,

                state: locationData.state,

                country: current.country || "India",
              }
            : current,
        );
      };

      if (section === "pickup") applyLocation(setPickupAddress);

      if (section === "delivery") applyLocation(setDeliveryAddress);

      if (section === "return") applyLocation(setReturnAddress);

      updateError(`${section}.pincode`);

      updateError(`${section}.city`);

      updateError(`${section}.state`);

      toast.success(`${locationData.city}, ${locationData.state} auto-filled`);
    } catch (error) {
      updateError(`${section}.pincode`, error.message || "Pincode not found");

      toast.error(error.message || "Unable to fetch pincode details");
    } finally {
      setPincodeLoading((current) => ({ ...current, [section]: false }));
    }
  };

  const getOrderError = (key, value, nextOrder) => {
    if (key === "invoiceNumber" && !String(value).trim())
      return "Order / invoice number is required";

    if (key === "totalAmount" && (!value || Number(value) <= 0))
      return "Total amount must be greater than 0";

    if (
      key === "codAmount" &&
      nextOrder.orderType === "COD" &&
      (!value || Number(value) <= 0)
    )
      return "Collectable amount is required for COD";

    if (key === "totalWeight" && (!value || Number(value) <= 0))
      return "Weight must be greater than 0";

    if (
      key === "boxes" &&
      (!Number.isInteger(Number(value)) || Number(value) < 1)
    )
      return "Enter at least 1 box";

    if (
      ["length", "breadth", "height"].includes(key) &&
      (!value || Number(value) <= 0)
    )
      return "Value must be greater than 0";

    return "";
  };

  const updateOrder = (key, value) => {
    const nextOrder = { ...order, [key]: value };

    setOrder(nextOrder);

    updateError(`order.${key}`, getOrderError(key, value, nextOrder));

    if (key === "orderType" && value !== "COD") {
      setErrors((current) => {
        const nextErrors = { ...current };

        delete nextErrors["order.codAmount"];

        return nextErrors;
      });
    }
  };

  const volumetricWeight = useMemo(() => {
    const result =
      (Number(order.length) * Number(order.breadth) * Number(order.height)) /
      5000;

    return Number.isFinite(result) ? result : 0;
  }, [order.length, order.breadth, order.height]);

  const deadWeight = Number(order.totalWeight || 0) / 1000;

  const chargeableWeight = Math.max(volumetricWeight, deadWeight);

  const orderValue = Number(order.totalAmount || 0);

  const configuredInsuranceLimit = Number(insuranceLimit || 0);

  const isInsuranceActive =
    !insuranceLimitLoading && configuredInsuranceLimit >= 2000;

  const isShieldEligible =
    isInsuranceActive && orderValue >= configuredInsuranceLimit;

  // useEffect(() => {

  //   setInsurance(isShieldEligible);

  // }, [isShieldEligible]);

  // useEffect(() => {
  //   if (isShieldEligible) {
  //     setInsurance(true);
  //   }
  // }, [isShieldEligible]);
  // useEffect(() => {
  //   // Amount ₹2000 se kam hote hi toggle OFF
  //   if (!insuranceLimitLoading && !isShieldEligible) {
  //     setInsurance(false);
  //   }
  // }, [isShieldEligible, insuranceLimitLoading]);

  // useEffect(() => {
  //   if (insuranceLimitLoading) return;

  //   setInsurance(isShieldEligible);
  // }, [isShieldEligible, insuranceLimitLoading]);

  useEffect(() => {
    if (insuranceLimitLoading || loadingDraft) return;

    // Amount limit se kam hua to automatically OFF
    if (!isShieldEligible) {
      setInsurance(false);
      setInsuranceManuallyChanged(false);
      return;
    }

    // Pehli baar amount limit cross kare to automatically ON
    if (!insuranceManuallyChanged) {
      setInsurance(true);
    }
  }, [
    isShieldEligible,
    insuranceLimitLoading,
    loadingDraft,
    insuranceManuallyChanged,
  ]);

  const changeSameAsPickup = (type, checked) => {
    if (type === "delivery") {
      setDeliverySameAsPickup(checked);

      if (checked) setDeliveryAddress({ ...pickupAddress });

      toast.success(
        checked
          ? "Delivery address copied from pickup"
          : "Delivery address unlocked for editing",
      );
    } else {
      setReturnSameAsPickup(checked);

      if (checked) setReturnAddress({ ...pickupAddress });

      toast.success(
        checked
          ? "Return address copied from pickup"
          : "Return address unlocked for editing",
      );
    }
  };

  // const handleInsuranceChange = (checked) => {
  //   setInsurance(checked);

  //   if (checked) {
  //     toast.success("Daakit Shield enabled for this shipment");
  //   } else {
  //     toast.info("Daakit Shield disabled for this shipment");
  //   }
  // };

  const handleInsuranceChange = (checked) => {
    // User OFF karega to false, ON karega to true
    setInsurance(checked);
    setInsuranceManuallyChanged(true);

    if (checked) {
      toast.success("Daakit Shield enabled");
    } else {
      toast.info("Daakit Shield disabled");
    }
  };

  const updateItem = (id, key, value) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, [key]: value } : item,
      ),
    );

    let message = "";

    if (key === "productName" && !String(value).trim())
      message = "Product name is required";

    if (
      key === "quantity" &&
      (!Number.isInteger(Number(value)) || Number(value) < 1)
    )
      message = "Quantity must be at least 1";

    if (key === "unitPrice" && (value === "" || Number(value) < 0))
      message = "Enter a valid unit price";

    if (key === "weight" && value !== "" && Number(value) <= 0)
      message = "Weight must be greater than 0";

    if (
      key === "dimensions" &&
      value &&
      !/^\d+(?:\.\d+)?\s*[xX]\s*\d+(?:\.\d+)?\s*[xX]\s*\d+(?:\.\d+)?$/.test(
        value,
      )
    ) {
      message = "Use L x B x H format, e.g. 20x15x10";
    }

    updateError(`items.${id}.${key}`, message);
  };

  const validateAddressInput = (prefix, key, value, options = {}) => {
    const { optional = false, indianMobile = false } = options;

    const text = String(value || "").trim();

    let message = "";

    if (
      !optional &&
      [
        "contactName",

        "phone",

        "addressLine",

        "pincode",

        "city",

        "state",

        "country",
      ].includes(key) &&
      !text
    ) {
      message = "This field is required";
    } else if (
      key === "phone" &&
      text &&
      !(indianMobile ? /^[6-9]\d{9}$/.test(text) : /^\d{10,12}$/.test(text))
    ) {
      message = indianMobile
        ? "Enter a valid 10-digit Indian mobile number"
        : "Enter a valid 10-digit Indian mobile number";
    } else if (key === "pincode" && text && !/^\d{6}$/.test(text)) {
      message = "Pincode must contain exactly 6 digits";
    } else if (
      key === "latitude" &&
      text &&
      !/^-?(?:90(?:\.0+)?|(?:[0-8]?\d)(?:\.\d+)?)$/.test(text)
    ) {
      message = "Enter a valid latitude (-90 to 90)";
    } else if (
      key === "longitude" &&
      text &&
      !/^-?(?:180(?:\.0+)?|(?:1[0-7]\d|\d?\d)(?:\.\d+)?)$/.test(text)
    ) {
      message = "Enter a valid longitude (-180 to 180)";
    }

    updateError(`${prefix}.${key}`, message);
  };

  const removeItem = (id) => {
    setItems((current) =>
      current.length === 1 ? current : current.filter((item) => item.id !== id),
    );
  };

  const validateAddress = (address, prefix, options = {}) => {
    const nextErrors = {};

    const { optional = false, indianMobile = false } = options;

    const hasValue = [
      "contactName",

      "phone",

      "addressLine",

      "pincode",

      "city",

      "state",

      "latitude",

      "longitude",
    ].some((key) => String(address[key] || "").trim());

    if (optional && !hasValue) return nextErrors;

    const requiredFields = [
      "contactName",

      "phone",

      "addressLine",

      "pincode",

      "city",

      "state",

      "country",
    ];

    requiredFields.forEach((key) => {
      if (!String(address[key] || "").trim())
        nextErrors[`${prefix}.${key}`] = "This field is required";
    });

    if (
      address.phone &&
      !(indianMobile
        ? /^[6-9]\d{9}$/.test(address.phone)
        : /^\d{10,12}$/.test(address.phone))
    ) {
      nextErrors[`${prefix}.phone`] = indianMobile
        ? "Enter a valid 10-digit Indian mobile number"
        : "Phone number must contain 10 to 12 digits";
    }

    if (address.pincode && !/^\d{6}$/.test(address.pincode))
      nextErrors[`${prefix}.pincode`] = "Pincode must contain exactly 6 digits";

    if (
      address.latitude &&
      !/^-?(?:90(?:\.0+)?|(?:[0-8]?\d)(?:\.\d+)?)$/.test(address.latitude)
    )
      nextErrors[`${prefix}.latitude`] = "Enter a valid latitude (-90 to 90)";

    if (
      address.longitude &&
      !/^-?(?:180(?:\.0+)?|(?:1[0-7]\d|\d?\d)(?:\.\d+)?)$/.test(
        address.longitude,
      )
    )
      nextErrors[`${prefix}.longitude`] =
        "Enter a valid longitude (-180 to 180)";

    return nextErrors;
  };

  const validateForm = () => {
    const nextErrors = {
      ...validateAddress(pickupAddress, "pickup"),

      ...(deliverySameAsPickup
        ? {}
        : validateAddress(deliveryAddress, "delivery", { indianMobile: true })),

      ...(returnSameAsPickup
        ? {}
        : validateAddress(returnAddress, "return", { optional: true })),
    };

    if (!order.invoiceNumber.trim())
      nextErrors["order.invoiceNumber"] = "Order / invoice number is required";

    if (!order.totalAmount || Number(order.totalAmount) <= 0)
      nextErrors["order.totalAmount"] = "Total amount must be greater than 0";

    if (
      order.orderType === "COD" &&
      (!order.codAmount || Number(order.codAmount) <= 0)
    )
      nextErrors["order.codAmount"] = "Collectable amount is required for COD";

    if (!order.totalWeight || Number(order.totalWeight) <= 0)
      nextErrors["order.totalWeight"] = "Weight must be greater than 0";

    if (!Number.isInteger(Number(order.boxes)) || Number(order.boxes) < 1)
      nextErrors["order.boxes"] = "Enter at least 1 box";

    ["length", "breadth", "height"].forEach((key) => {
      if (!order[key] || Number(order[key]) <= 0)
        nextErrors[`order.${key}`] = "Value must be greater than 0";
    });

    items.forEach((item) => {
      if (!item.productName.trim())
        nextErrors[`items.${item.id}.productName`] = "Product name is required";

      if (!Number.isInteger(Number(item.quantity)) || Number(item.quantity) < 1)
        nextErrors[`items.${item.id}.quantity`] = "Quantity must be at least 1";

      if (item.unitPrice === "" || Number(item.unitPrice) < 0)
        nextErrors[`items.${item.id}.unitPrice`] = "Enter a valid unit price";

      if (item.weight !== "" && Number(item.weight) <= 0)
        nextErrors[`items.${item.id}.weight`] = "Weight must be greater than 0";

      if (
        item.dimensions &&
        !/^\d+(?:\.\d+)?\s*[xX]\s*\d+(?:\.\d+)?\s*[xX]\s*\d+(?:\.\d+)?$/.test(
          item.dimensions,
        )
      )
        nextErrors[`items.${item.id}.dimensions`] =
          "Use L x B x H format, e.g. 20x15x10";
    });

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const buildPayload = () => ({
    pickup_address: {
      contact_name: pickupAddress.contactName.trim(),

      phone: pickupAddress.phone.trim(),

      address_line: pickupAddress.addressLine.trim(),

      pincode: pickupAddress.pincode.trim(),

      city: pickupAddress.city.trim(),

      state: pickupAddress.state.trim(),
      country: pickupAddress.country.trim() || "India",
      latitude: pickupAddress.latitude || null,
      longitude: pickupAddress.longitude || null,
    },

    delivery_address: {
      contact_name: deliveryAddress.contactName.trim(),
      phone: deliveryAddress.phone.trim(),
      address_line: deliveryAddress.addressLine.trim(),
      pincode: deliveryAddress.pincode.trim(),
      city: deliveryAddress.city.trim(),
      state: deliveryAddress.state.trim(),
      country: deliveryAddress.country.trim() || "India",
    },

    return_address: {
      contact_name: (returnSameAsPickup
        ? pickupAddress.contactName
        : returnAddress.contactName
      ).trim(),

      phone: (returnSameAsPickup
        ? pickupAddress.phone
        : returnAddress.phone
      ).trim(),

      address_line: (returnSameAsPickup
        ? pickupAddress.addressLine
        : returnAddress.addressLine
      ).trim(),

      pincode: (returnSameAsPickup
        ? pickupAddress.pincode
        : returnAddress.pincode
      ).trim(),

      city: (returnSameAsPickup
        ? pickupAddress.city
        : returnAddress.city
      ).trim(),

      state: (returnSameAsPickup
        ? pickupAddress.state
        : returnAddress.state
      ).trim(),

      country:
        (returnSameAsPickup
          ? pickupAddress.country
          : returnAddress.country
        ).trim() || "India",

      latitude: returnSameAsPickup
        ? pickupAddress.latitude || null
        : returnAddress.latitude || null,

      longitude: returnSameAsPickup
        ? pickupAddress.longitude || null
        : returnAddress.longitude || null,
    },
    same_as_pickup_return: returnSameAsPickup,
    opt_insurance: insurance ? 1 : 0,
    order_details: {
      order_type: order.orderType.toLowerCase(),
      orderno: order.invoiceNumber.trim(),
      merchant_order_id: order.invoiceNumber.trim(),
      total_amount: Number(order.totalAmount),
      collectable_amount:
        order.orderType === "COD" ? Number(order.codAmount) : 0,
      total_weight: String(order.totalWeight),
      number_of_boxes: 1,
      package_length: String(order.length),
      breadth: String(order.breadth),
      height: String(order.height),
      latitude: pickupAddress.latitude || null,
      longitude: pickupAddress.longitude || null,
      opt_insurance: insurance ? 1 : 0,

      items: items.map((item) => ({
        sku: item.sku.trim() || null,
        product_name: item.productName.trim(),
        quantity: Number(item.quantity),
        unit_price: Number(item.unitPrice),
        weight: String(item.weight),
        dimensions: item.dimensions.trim() || null,
      })),
    },
  });

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Please fix the highlighted fields");

      return;
    }

    const insuranceValue = isShieldEligible && insurance ? 1 : 0;

    const payload = buildPayload();

    try {
      setSubmitting(true);

      await apiRequest(isEditMode ? `/draft/${draftId}` : "/saveDraft", {
        method: isEditMode ? "PUT" : "POST",

        body: JSON.stringify(payload),
      });

      toast.success(
        isEditMode
          ? "Draft updated successfully"
          : isCopyMode
            ? "Copied order saved as new draft"
            : "Order saved as draft",
      );

      navigate("/merchant/order-draft");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingDraft) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#f5f8fb] text-sm text-slate-600">
        Loading draft...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f8fb] text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">
        <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Create Order</h1>

            <p className="mt-1 text-sm text-slate-500">
              Enter the order details and save it as a draft.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={submitting}
              onClick={() => navigate("/merchant/order-draft")}
              className="h-10 rounded-md  bg-red-500 text-white px-4 text-sm font-medium shadow-sm hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={submitting}
              onClick={handleSubmit}
              className="h-10 rounded-md  bg-[#0446DB] text-white px-4 text-sm font-medium shadow-sm hover:bg-[#072d87] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
            >
              {submitting
                ? "Saving..."
                : isEditMode
                  ? "Update Draft"
                  : "Save as Draft"}
            </button>
          </div>
        </div>
      </header>

      <main className="grid gap-6 p-4 sm:p-6 lg:p-8">
        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <Section
            number="1"
            title="Pickup Address"
            subtitle="Pincode triggers a serviceability check on blur"
          >
            <AddressFields
              value={pickupAddress}
              onChange={setPickupAddress}
              showCoordinates
              serviceability
              pincodeLoading={pincodeLoading.pickup}
              errors={pickupErrors}
              onValidate={(key, value) =>
                validateAddressInput("pickup", key, value)
              }
              onPincodeBlur={(pincode) =>
                handlePincodeLookup("pickup", pincode)
              }
            />
          </Section>

          <Section number="2" title="Delivery Address">
            <AddressFields
              value={deliveryAddress}
              onChange={setDeliveryAddress}
              showCoordinates={false}
              serviceability
              pincodeLoading={pincodeLoading.delivery}
              errors={deliveryErrors}
              onValidate={(key, value) =>
                validateAddressInput("delivery", key, value, {
                  indianMobile: true,
                })
              }
              onPincodeBlur={(pincode) =>
                handlePincodeLookup("delivery", pincode)
              }
            />
          </Section>

          <Section
            number="3"
            title="Return Address"
            action={
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Same as Pickup</span>

                <Toggle
                  checked={returnSameAsPickup}
                  onChange={(checked) => changeSameAsPickup("return", checked)}
                />
              </div>
            }
          >
            <AddressFields
              value={returnSameAsPickup ? pickupAddress : returnAddress}
              onChange={setReturnAddress}
              disabled={returnSameAsPickup}
              showCoordinates
              serviceability
              pincodeLoading={pincodeLoading.return}
              optional
              errors={returnErrors}
              onValidate={(key, value) =>
                validateAddressInput("return", key, value, { optional: true })
              }
              onPincodeBlur={(pincode) =>
                handlePincodeLookup("return", pincode)
              }
            />
          </Section>

          <Section number="4" title="Order Details">
            <div className="grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-3">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-slate-600">
                  Order type <span className="text-red-500">*</span>
                </span>

                <select
                  value={order.orderType}
                  onChange={(e) => updateOrder("orderType", e.target.value)}
                  className={inputClass}
                >
                  <option>Prepaid</option>

                  <option>COD</option>
                </select>
              </label>

              <Field
                label="Order / invoice no"
                required
                placeholder="e.g. USER-ORDER-789"
                error={errors["order.invoiceNumber"]}
                value={order.invoiceNumber}
                onChange={(e) => updateOrder("invoiceNumber", e.target.value)}
              />

              <Field
                label="Total amount (INR)"
                required
                placeholder="e.g. 2500"
                error={errors["order.totalAmount"]}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={order.totalAmount}
                onChange={(e) => {
                  const value = e.target.value;

                  if (/^\d*$/.test(value)) {
                    updateOrder("totalAmount", value);
                  }
                }}
              />

              <Field
                label="Collectable amount (COD)"
                type="number"
                min="0"
                placeholder="e.g. 2500.00"
                error={errors["order.codAmount"]}
                value={order.codAmount}
                disabled={order.orderType !== "COD"}
                onChange={(e) => updateOrder("codAmount", e.target.value)}
              />

              <Field
                label="Total weight (grams)"
                required
                placeholder="e.g. 6500"
                error={errors["order.totalWeight"]}
                type="number"
                min="0"
                value={order.totalWeight}
                onChange={(e) => updateOrder("totalWeight", e.target.value)}
              />

              <Field
                label="Number of boxes"
                required
                // type="number"
                value="1"
                readOnly
              />

              <Field
                label="Package length (cm)"
                required
                placeholder="e.g. 20"
                error={errors["order.length"]}
                type="number"
                min="0"
                value={order.length}
                onChange={(e) => updateOrder("length", e.target.value)}
              />

              <Field
                label="Breadth (cm)"
                required
                placeholder="e.g. 15"
                error={errors["order.breadth"]}
                type="number"
                min="0"
                value={order.breadth}
                onChange={(e) => updateOrder("breadth", e.target.value)}
              />

              <Field
                label="Height (cm)"
                required
                placeholder="e.g. 10"
                error={errors["order.height"]}
                type="number"
                min="0"
                value={order.height}
                onChange={(e) => updateOrder("height", e.target.value)}
              />
            </div>
          </Section>

          {isShieldEligible && (
            <DaakitShield
              checked={insurance}
              onChange={handleInsuranceChange}
            />
          )}

          <Section
            number="5"
            title="Line Items"
            subtitle="Add at least one product to your order"
          >
            <div className="space-y-4">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300"
                >
                  {/* Item header */}

                  <div className="mb-4 flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-blue-50 text-xs font-semibold text-[#0446DB]">
                        {index + 1}
                      </span>

                      <p className="text-sm font-semibold text-slate-700">
                        Item {index + 1}
                      </p>
                    </div>

                    <button
                      type="button"
                      aria-label={`Delete item ${index + 1}`}
                      disabled={items.length === 1}
                      onClick={() => removeItem(item.id)}
                      className="grid h-9 w-9 place-items-center rounded-lg border border-transparent text-slate-400 transition hover:border-red-100 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>

                  {/* Item fields */}

                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-[1fr_2fr_120px_160px]">
                    <Field
                      label="SKU"
                      placeholder="e.g. SKU-1001"
                      value={item.sku}
                      onChange={(e) =>
                        updateItem(item.id, "sku", e.target.value)
                      }
                    />

                    <Field
                      label="Product name"
                      required
                      placeholder="Enter product name"
                      error={errors[`items.${item.id}.productName`]}
                      value={item.productName}
                      onChange={(e) =>
                        updateItem(item.id, "productName", e.target.value)
                      }
                    />

                    <Field
                      label="Qty"
                      required
                      type="number"
                      min="1"
                      placeholder="1"
                      error={errors[`items.${item.id}.quantity`]}
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(item.id, "quantity", e.target.value)
                      }
                    />

                    <Field
                      label="Unit price (₹)"
                      required
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="499.00"
                      error={errors[`items.${item.id}.unitPrice`]}
                      value={item.unitPrice}
                      onChange={(e) =>
                        updateItem(item.id, "unitPrice", e.target.value)
                      }
                    />
                  </div>
                </div>
              ))}

              {/* Add item */}

              <button
                type="button"
                onClick={() => setItems((current) => [...current, emptyItem()])}
                className="inline-flex h-10 items-center gap-2 rounded-lg border border-dashed border-[#0446DB] bg-blue-50 px-4 text-sm font-semibold text-[#0446DB] transition hover:bg-blue-100 cursor-pointer"
              >
                <Plus size={17} />
                Add another item
              </button>
            </div>
          </Section>
        </form>
      </main>
    </div>
  );
}
