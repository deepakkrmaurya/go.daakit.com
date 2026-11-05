import React, { useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  Search,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { toast } from "react-toastify";
const PencilIcon = () => {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_10128_39788)">
        <path
          d="M6.41663 2.33301H2.33329C2.02387 2.33301 1.72713 2.45592 1.50833 2.67472C1.28954 2.89351 1.16663 3.19026 1.16663 3.49967V11.6663C1.16663 11.9758 1.28954 12.2725 1.50833 12.4913C1.72713 12.7101 2.02387 12.833 2.33329 12.833H10.5C10.8094 12.833 11.1061 12.7101 11.3249 12.4913C11.5437 12.2725 11.6666 11.9758 11.6666 11.6663V7.58301"
          stroke="currentColor"
          strokeWidth="1.16667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M10.7916 1.45814C11.0237 1.22608 11.3384 1.0957 11.6666 1.0957C11.9948 1.0957 12.3096 1.22608 12.5416 1.45814C12.7737 1.6902 12.9041 2.00495 12.9041 2.33314C12.9041 2.66133 12.7737 2.97608 12.5416 3.20814L6.99996 8.74981L4.66663 9.33314L5.24996 6.99981L10.7916 1.45814Z"
          stroke="currentColor"
          strokeWidth="1.16667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      <defs>
        <clipPath id="clip0_10128_39788">
          <rect width="14" height="14" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

/* =========================================================
   API CLIENT
========================================================= */

const API_BASE = "/api/merchant";
const BASE_URL = import.meta.env.VITE_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

/* =========================================================
   CONSTANTS
========================================================= */

const BRAND = "#0446DB";
const BRAND_HOVER = "#0338B0";
const BRAND_SOFT = "#EEF4FF";
const BRAND_RING = "rgba(4,70,219,0.12)";

const SLABS = [
  {
    id: "SLAB_500GM",
    title: "500 g",
    subtitle: "Up to 500 g",
    weightSlabG: 500,
  },
  {
    id: "SLAB_1000GM",
    title: "1,000 g",
    subtitle: "Up to 1 kg",
    weightSlabG: 1000,
  },
  {
    id: "SLAB_2000GM",
    title: "2,000 g",
    subtitle: "Up to 2 kg",
    weightSlabG: 2000,
  },
];

const SERVICES = [
  {
    id: "SDD",
    title: "SDD",
    subtitle: "Same-day delivery",
    dot: "bg-blue-600",
  },
  {
    id: "NDD",
    title: "NDD",
    subtitle: "Next-day delivery",
    dot: "bg-purple-600",
  },
  {
    id: "HLD60MIN",
    title: "HLD60MIN",
    subtitle: "Hyperlocal 60-min delivery",
    dot: "bg-teal-600",
  },
  {
    id: "HLD60MIN",
    title: "HLD120MIN",
    subtitle: "Hyperlocal 120-min delivery",
    dot: "bg-teal-600",
  },
  {
    id: "HLD4HRS",
    title: "HLD4HRS",
    subtitle: "Hyperlocal 4-hr delivery",
    dot: "bg-teal-600",
  },
];

const SERVICE_STYLES = {
  SDD: "bg-blue-50 text-blue-700 border-blue-100",
  NDD: "bg-purple-50 text-purple-700 border-purple-100",
  HLD4HR: "bg-teal-50 text-teal-700 border-teal-100",
  HLD: "bg-teal-50 text-teal-700 border-teal-100",
  HDL60MINS: "bg-teal-50 text-teal-700 border-teal-100",
  HLD120MINS: "bg-teal-50 text-teal-700 border-teal-100",
};

/* =========================================================
   SHARED UI
========================================================= */

function SectionNumber({ children }) {
  return (
    <div
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold text-white sm:h-8 sm:w-8"
      style={{ background: BRAND }}
    >
      {children}
    </div>
  );
}

function FieldLabel({ children, required = false, className = "" }) {
  return (
    <label
      className={`mb-2 block text-[12px] font-bold text-[#344054] sm:text-[13px] ${className}`}
    >
      {children}
      {required && <span className="ml-1 text-red-500">*</span>}
    </label>
  );
}

function Input({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={`h-9 w-full rounded-lg border border-[#D8E0EA] bg-white px-3 text-[12px] text-[#172033] outline-none transition placeholder:text-[#A4AFBF] focus:border-[#0446DB] focus:ring-2 sm:h-10 sm:text-[13px] ${className}`}
      style={{ "--tw-ring-color": BRAND_RING }}
    />
  );
}

function Select({ children, className = "", ...props }) {
  return (
    <div className="relative">
      <select
        {...props}
        className={`h-9 w-full cursor-pointer appearance-none rounded-lg border border-[#D8E0EA] bg-white px-3 pr-9 text-[12px] text-[#172033] outline-none transition focus:border-[#0446DB] focus:ring-2 sm:h-10 sm:text-[13px] ${className}`}
        style={{ "--tw-ring-color": BRAND_RING }}
      >
        {children}
      </select>
      <ChevronDown
        size={14}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#8A97A8]"
      />
    </div>
  );
}

function Toggle({ enabled, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      aria-label="Toggle rule"
      className="relative h-6 w-10 cursor-pointer rounded-full transition"
      style={{ background: enabled ? BRAND : "#CBD5E1" }}
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
          enabled ? "left-5" : "left-1"
        }`}
      />
    </button>
  );
}

function StepItem({ number, title, active = false, last = false }) {
  return (
    <>
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <span
          className={`flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-bold sm:h-5 sm:w-5 sm:text-[11px] ${
            active ? "bg-[#F59E0B] text-white" : "text-white"
          }`}
          style={!active ? { background: BRAND } : undefined}
        >
          {active ? (
            <Check
              size={8}
              strokeWidth={3}
              className="sm:h-[10px] sm:w-[10px]"
            />
          ) : (
            number
          )}
        </span>

        <span
          className={`text-[11px] font-semibold sm:text-[14px] ${
            active ? "text-[#D97706]" : "text-[#344054]"
          }`}
        >
          {title}
        </span>
      </div>

      {!last && (
        <ChevronRight
          size={12}
          className="mx-0.5 shrink-0 text-[#A6B0BF] sm:mx-1 sm:h-[15px] sm:w-[15px]"
        />
      )}
    </>
  );
}

function SlabCard({ slab, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative min-h-[68px] cursor-pointer rounded-lg border px-3 py-3 text-left transition ${
        selected
          ? "border-2 bg-[#EEF4FF]"
          : "border-[#D8E0EA] bg-white hover:border-[#9DBCF7] hover:bg-[#F8FBFF]"
      }`}
      style={selected ? { borderColor: BRAND } : undefined}
    >
      {selected && (
        <span
          className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full text-white"
          style={{ background: BRAND }}
        >
          <Check size={10} strokeWidth={3} />
        </span>
      )}
      <div
        className={`text-[15px] font-extrabold ${
          selected ? "" : "text-[#172033]"
        }`}
        style={selected ? { color: BRAND } : undefined}
      >
        {slab.title}
      </div>
      <div className="mt-1 text-[10px] text-[#7B8798] sm:text-[11px]">
        {slab.subtitle}
      </div>
    </button>
  );
}

function ServiceCard({ service, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative min-h-[66px] cursor-pointer rounded-lg border px-3 py-3 text-left transition ${
        selected
          ? "border-2 bg-[#F0F5FF]"
          : "border-[#D8E0EA] bg-white hover:border-[#9DBCF7] hover:bg-[#F8FBFF]"
      }`}
      style={selected ? { borderColor: BRAND } : undefined}
    >
      {selected && (
        <span
          className="absolute right-2 top-2 flex h-4 w-4 items-center justify-center rounded-full text-white"
          style={{ background: BRAND }}
        >
          <Check size={10} strokeWidth={3} />
        </span>
      )}
      <div className="flex items-center gap-1.5">
        <span className={`h-1.5 w-1.5 rounded-full ${service.dot}`} />
        <span className="text-[13px] font-bold text-[#172033]">
          {service.title}
        </span>
      </div>
      <div className="mt-1 text-[10px] text-[#7B8798] sm:text-[11px]">
        {service.subtitle}
      </div>
    </button>
  );
}

function StatusBadge({ status }) {
  const active = status === "Active";
  return (
    <span
      className={`inline-flex items-center gap-1 text-[13px] font-semibold ${
        active ? "text-[#16A34A]" : "text-[#94A3B8]"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          active ? "bg-[#16A34A]" : "bg-[#94A3B8]"
        }`}
      />
      {status}
    </span>
  );
}



/* =========================================================
   HELPERS
========================================================= */

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message ||
  error?.response?.data?.error?.message ||
  error?.response?.data?.error ||
  error?.message ||
  fallback;

const normalizePincode = (v) =>
  String(v || "")
    .replace(/\D/g, "")
    .slice(0, 6);

const mapApiRuleToUi = (item) => {
  const weightFrom = Number(item?.weight_from_g ?? 0);
  const weightTo = Number(item?.weight_to_g ?? 0);
  const weightSlab = Number(item?.weight_slab_g ?? 0);
  const priority = Number(item?.priority ?? 0);
  const isActive = Number(item?.is_active) === 1;

  const pickupPincode = item?.pickup_pincode ? String(item.pickup_pincode) : "";
  const destinationPincodes = Array.isArray(item?.destination_pincodes)
    ? item.destination_pincodes.map(String)
    : [];

  const service = item?.service || "";

  return {
    id: item?.id,
    priority,
    pickupPincode,
    pickupPincodes: pickupPincode ? [pickupPincode] : [],
    destinationPincodes,
    weightFromG: weightFrom,
    weightToG: weightTo,
    weightSlabG: weightSlab,
    weight: `${weightFrom}–${weightTo.toLocaleString("en-IN")} g`,
    service,
    allocateTo: `${service}_${weightSlab}GM`,
    status: isActive ? "Active" : "Inactive",
    isActive,
    createdAt: item?.created_at,
    updatedAt: item?.updated_at,
    rule: `${pickupPincode || "-"} ${service ? `· ${service}` : ""} · ${weightSlab} g`,
  };
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function OrderSlabAllocation() {
  /* -------------------- FORM -------------------- */
  const [uploadingCsv, setUploadingCsv] = useState(false);
  const [destinationCsvFile, setDestinationCsvFile] = useState(null);
  const [isActive, setIsActive] = useState(true);

  const [pickupPincodes, setPickupPincodes] = useState([]);
  const [destinationPincodes, setDestinationPincodes] = useState([]);

  const [pickupInput, setPickupInput] = useState("");
  const [destinationInput, setDestinationInput] = useState("");

  const pickupInputRef = useRef(null);

  const [minWeight, setMinWeight] = useState("0");
  const [maxWeight, setMaxWeight] = useState("500");

  const [selectedSlab, setSelectedSlab] = useState("SLAB_500GM");
  const [selectedService, setSelectedService] = useState("SDD");
  const [priority, setPriority] = useState("1");

  /* -------------------- RULES / API -------------------- */
  const [rules, setRules] = useState([]);
  const [loadingRules, setLoadingRules] = useState(false);
  const [savingRule, setSavingRule] = useState(false);
  const [deletingRuleId, setDeletingRuleId] = useState(null);
  const [editingRuleId, setEditingRuleId] = useState(null);

  const [page, setPage] = useState(1);
  const limit = 10;
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });

  /* -------------------- FILTERS -------------------- */
  const [search, setSearch] = useState("");
  const [serviceFilter, setServiceFilter] = useState("All services");

  const selectedSlabData = useMemo(
    () => SLABS.find((s) => s.id === selectedSlab) || SLABS[0],
    [selectedSlab],
  );

  /* =========================================================
     FETCH RULES
  ========================================================= */
  const fetchRules = async (requestedPage = page) => {
    try {
      setLoadingRules(true);
      const response = await api.get(
        `${API_BASE}/getMerchantServiceAllocationRules`,
        { params: { page: requestedPage, limit } },
      );

      const apiRules = Array.isArray(response?.data?.data)
        ? response.data.data
        : [];
      const mapped = apiRules.map(mapApiRuleToUi);

      setRules(mapped);
      setPagination(
        response?.data?.pagination || {
          total: mapped.length,
          page: requestedPage,
          limit,
          totalPages: 1,
        },
      );
    } catch (error) {
      console.error(
        "[Allocation Rules] GET Error:",
        error?.response?.data || error,
      );
      toast.error(getErrorMessage(error, "Failed to fetch allocation rules"));
      setRules([]);
    } finally {
      setLoadingRules(false);
    }
  };

  useEffect(() => {
    fetchRules(page);
  }, [page]);

  const editFormRef = useRef(null);

  useEffect(() => {
    if (editingRuleId) {
      setTimeout(() => {
        editFormRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, [editingRuleId]);
  /* =========================================================
     PINCODE HANDLERS
  ========================================================= */
  const addPincode = (value, type) => {
    const code = normalizePincode(value);
    if (!code) return;

    if (code.length !== 6) {
      toast.error("Please enter a valid 6 digit pincode");
      return;
    }

    if (type === "pickup") {
      setPickupPincodes([code]);
      setPickupInput("");
    } else {
      if (destinationPincodes.includes(code)) {
        toast.error("This pincode is already added");
        return;
      }
      setDestinationPincodes((prev) => [...prev, code]);
      setDestinationInput("");
    }
  };

  const removePincode = (code, type) => {
    if (type === "pickup") {
      setPickupPincodes((prev) => prev.filter((c) => c !== code));
      setPickupInput("");
      setTimeout(() => pickupInputRef.current?.focus(), 50);
    } else {
      setDestinationPincodes((prev) => prev.filter((c) => c !== code));
    }
  };

  const handlePincodeChange = (rawValue, type) => {
    const value = normalizePincode(rawValue);

    if (type === "pickup") {
      setPickupInput(value);
    } else {
      setDestinationInput(value);
    }

    if (value.length === 6) {
      setTimeout(() => addPincode(value, type), 100);
    }
  };

  const handlePincodePaste = (e, type) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text");
    const parts = pasted.split(/[\s,;]+/).filter(Boolean);

    const valid = parts
      .map((p) => String(p).replace(/\D/g, "").slice(0, 6))
      .filter((p) => p.length === 6);

    if (valid.length === 0) return;

    if (type === "pickup") {
      setPickupPincodes([valid[0]]);
    } else {
      setDestinationPincodes((prev) => {
        const merged = new Set([...prev, ...valid]);
        return Array.from(merged);
      });
      toast.success(`${valid.length} pincode(s) added`);
    }
  };

  /* =========================================================
     RESET
  ========================================================= */
  const resetForm = () => {
    setIsActive(true);
    setPickupPincodes([]);
    setDestinationPincodes([]);
    setPickupInput("");
    setDestinationInput("");
    setDestinationCsvFile(null);
    setMinWeight("0");
    setMaxWeight("500");
    setSelectedSlab("SLAB_500GM");
    setSelectedService("SDD");
    setPriority("1");
    setEditingRuleId(null);
  };

  const resetChanges = () => {
    resetForm();
    toast.success("Changes reset");
  };

  /* =========================================================
     VALIDATION
  ========================================================= */
  const validateForm = () => {
    if (minWeight === "" || maxWeight === "") {
      toast.error("Please enter a valid weight range");
      return false;
    }
    const min = Number(minWeight);
    const max = Number(maxWeight);
    if (
      !Number.isInteger(min) ||
      !Number.isInteger(max) ||
      min < 0 ||
      max <= min
    ) {
      toast.error("Please enter a valid weight range");
      return false;
    }
    if (!selectedService) {
      toast.error("Please select a service");
      return false;
    }
    if (!selectedSlabData?.weightSlabG) {
      toast.error("Please select a valid weight slab");
      return false;
    }
    if (!priority || Number(priority) < 1) {
      toast.error("Priority must be at least 1");
      return false;
    }
    return true;
  };

  /* =========================================================
     SAVE (CREATE / UPDATE) 
  ========================================================= */
  const saveRule = async () => {
    if (!validateForm()) return;

    let finalPickup = [...pickupPincodes];
    const pendingPickup = normalizePincode(pickupInput);
    if (pendingPickup.length === 6) {
      finalPickup = [pendingPickup];
      setPickupPincodes(finalPickup);
      setPickupInput("");
    }

    /* Auto-flush pending destination input */
    let finalDestination = [...destinationPincodes];
    const pendingDest = normalizePincode(destinationInput);
    if (pendingDest.length === 6 && !finalDestination.includes(pendingDest)) {
      finalDestination.push(pendingDest);
      setDestinationPincodes(finalDestination);
      setDestinationInput("");
    }

    if (finalPickup.length === 0) {
      toast.error("Pickup pincode is required");
      return;
    }

    if (finalDestination.length === 0 && !destinationCsvFile) {
      toast.error("Add at least one destination pincode or upload CSV");
      return;
    }

    try {
      setSavingRule(true);

      let response;
      if (destinationCsvFile) {
        const formData = new FormData();
        formData.append("file", destinationCsvFile);
        formData.append("pickup_pincode", finalPickup[0]);
        formData.append(
          "destination_pincodes",
          JSON.stringify(finalDestination),
        );
        formData.append("weight_from_g", String(Number(minWeight)));
        formData.append("weight_to_g", String(Number(maxWeight)));
        formData.append(
          "weight_slab_g",
          String(Number(selectedSlabData.weightSlabG)),
        );
        formData.append("service", selectedService);
        formData.append("priority", String(Number(priority)));
        formData.append("is_active", isActive ? "1" : "0");

        if (editingRuleId) {
          response = await api.put(
            `${API_BASE}/updateMerchantServiceAllocationRule/${editingRuleId}`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } },
          );
        } else {
          response = await api.post(
            `${API_BASE}/createMerchantServiceAllocationRule`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } },
          );
          console.log("Bulk Upload API Response:", response?.data);
        }
      } else {
        const payload = {
          pickup_pincode: finalPickup[0],
          destination_pincodes: finalDestination,
          weight_from_g: Number(minWeight),
          weight_to_g: Number(maxWeight),
          weight_slab_g: Number(selectedSlabData.weightSlabG),
          service: selectedService,
          priority: Number(priority),
          is_active: isActive ? 1 : 0,
        };

        if (editingRuleId) {
          response = await api.put(
            `${API_BASE}/updateMerchantServiceAllocationRule/${editingRuleId}`,
            payload,
          );
        } else {
          response = await api.post(
            `${API_BASE}/createMerchantServiceAllocationRule`,
            payload,
          );
        }
      }

      toast.success(
        response?.data?.message ||
          (editingRuleId
            ? "Allocation rule updated successfully"
            : "Allocation rule created successfully"),
      );

      setDestinationCsvFile(null);
      resetForm();
      await fetchRules(page);
    } catch (error) {
      console.error(
        "[Allocation Rules] Save Error:",
        error?.response?.data || error,
      );
      toast.error(
        getErrorMessage(
          error,
          editingRuleId
            ? "Failed to update allocation rule"
            : "Failed to create allocation rule",
        ),
      );
    } finally {
      setSavingRule(false);
    }
  };
  /* =========================================================
     EDIT
  ========================================================= */
  const handleEdit = (item) => {
    setEditingRuleId(item.id);
    setIsActive(item.isActive);
    setPickupPincodes(item.pickupPincode ? [String(item.pickupPincode)] : []);
    setDestinationPincodes(
      Array.isArray(item.destinationPincodes)
        ? item.destinationPincodes.map(String)
        : [],
    );
    setPickupInput("");
    setDestinationInput("");
    setMinWeight(String(item.weightFromG ?? ""));
    setMaxWeight(String(item.weightToG ?? ""));
    setSelectedService(item.service || "SDD");

    const matching = SLABS.find(
      (s) => Number(s.weightSlabG) === Number(item.weightSlabG),
    );
    setSelectedSlab(matching?.id || SLABS[0].id);

    setPriority(String(item.priority ?? 1));

    window.scrollTo({ top: 0, behavior: "smooth" });
    toast.info(`Rule #${item.id} loaded for editing`);
  };

  /* =========================================================
     DELETE
  ========================================================= */
  const handleDelete = async (id) => {
    if (
      !window.confirm("Are you sure you want to delete this allocation rule?")
    )
      return;

    try {
      setDeletingRuleId(id);
      const response = await api.delete(
        `${API_BASE}/deleteMerchantServiceAllocationRule/${id}`,
      );
      toast.success(
        response?.data?.message || "Allocation rule deleted successfully",
      );

      if (rules.length === 1 && page > 1) {
        setPage((p) => p - 1);
      } else {
        await fetchRules(page);
      }
    } catch (error) {
      console.error(
        "[Allocation Rules] DELETE Error:",
        error?.response?.data || error,
      );
      toast.error(getErrorMessage(error, "Failed to delete allocation rule"));
    } finally {
      setDeletingRuleId(null);
    }
  };

  const handleDestinationCsvUpload = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";

    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".csv")) {
      toast.error("Please upload a .csv file");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("CSV file must be under 2 MB");
      return;
    }

    setUploadingCsv(true);

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const text = String(event.target.result || "");

        const lines = text
          .split(/\r?\n/)
          .map((l) => l.trim())
          .filter(Boolean);

        const parsed = [];
        const invalid = [];

        for (const line of lines) {
          // split by comma / semicolon / tab
          const cells = line.split(/[,;\t]/).map((c) => c.trim());

          for (const cell of cells) {
            if (!cell) continue;

            // skip headers (starts with letters)
            if (/^[a-zA-Z]/.test(cell)) continue;

            const digits = cell.replace(/\D/g, "");

            if (digits.length !== 6) {
              invalid.push(cell);
              continue;
            }

            parsed.push(digits);
          }
        }

        // Dedupe
        const uniqueParsed = [...new Set(parsed)];

        if (uniqueParsed.length === 0) {
          toast.error("No valid 6-digit pincodes found in CSV");
          setUploadingCsv(false);
          return;
        }

        // ✅ Merge into chips (dedupe with existing)
        setDestinationPincodes((prev) => {
          const merged = new Set([...prev, ...uniqueParsed]);
          return Array.from(merged);
        });

        // Save file for backend upload on Save
        setDestinationCsvFile(file);

        toast.success(
          `${uniqueParsed.length} pincodes imported` +
            (invalid.length ? ` · ${invalid.length} invalid skipped` : ""),
        );
      } catch (err) {
        console.error("[CSV Parse] Error:", err);
        toast.error("Failed to parse CSV file");
      } finally {
        setUploadingCsv(false);
      }
    };

    reader.onerror = () => {
      toast.error("Failed to read CSV file");
      setUploadingCsv(false);
    };

    reader.readAsText(file);
  };

  /* =========================================================
     FILTERED RULES
  ========================================================= */

  const filteredRules = useMemo(() => {
    const q = search.trim().toLowerCase();

    return rules.filter((item) => {
      const matchesService =
        serviceFilter === "All services" || item.service === serviceFilter;

      if (!matchesService) return false;

      if (!q) return true;

      const status = String(item.status ?? "").toLowerCase();

      // Active / Inactive
      if (q === "active" || q === "inactive") {
        return status === q;
      }

      // Normalize Rule ID
      const ruleId = String(item.id ?? "").toLowerCase();
      const normalizedSearch = q.replace(/^0+/, "") || "0";

      // Rule ID search
      if (ruleId === normalizedSearch) {
        return true;
      }

      // Other fields search
      const text = [
        String(item.rule ?? ""),
        String(item.pickupPincode ?? ""),
        ...(item.destinationPincodes || []).map(String),
        String(item.service ?? ""),
        String(item.allocateTo ?? ""),
        String(item.weight ?? ""),
        String(item.priority ?? ""),
      ]
        .join(" ")
        .toLowerCase();

      return text.includes(q);
    });
  }, [rules, search, serviceFilter]);

  const activeCount = rules.filter((r) => r.isActive).length;

  /* =========================================================
     PAGINATION
  ========================================================= */
  const canPrev = page > 1;
  const canNext = page < Number(pagination?.totalPages || 1);

  /* =========================================================
     RENDER
  ========================================================= */
  return (
    <div ref={editFormRef} className="min-h-screen text-[#172033]">
      <header
        className=" text-white "
        
      >
        <div className="mx-auto">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-[20px] text-gray-800 font-bold tracking-[-0.2px] sm:text-[24px]">
                Order slab allocation
              </h1>
              <p className="mt-1 text-[12px] text-gray-600 sm:text-[14px]">
                Route every eligible order into the right service slab using its
                destination pincode, applicable weight and booking cut-off.
              </p>
            </div>

            <span className="inline-flex w-fit items-center gap-1 rounded-full bg-white px-3 py-1 text-[12px] font-bold text-[#138A4A] sm:text-[14px]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
              {activeCount} active rules
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full mt-5">
        {/* Stepper */}
        <div className="mb-5 overflow-x-auto rounded-xl border border-[#DFE5EC] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.02)]">
          <div className="flex min-w-[360px] items-center px-3 py-2.5 sm:min-w-[420px] sm:px-5 sm:py-3">
            <StepItem number="1" title="Pincode" />
            <StepItem number="2" title="Weight" />
            <StepItem number="3" title="Cut-off" />
            <StepItem number="4" title="Allocate slab" active last />
          </div>
        </div>

        {/* Main form */}
        <section className="overflow-hidden rounded-2xl border border-[#DDE4EC] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.02)]">
          <div className="flex items-center justify-between border-b border-[#EDF0F4] px-4 py-4 sm:px-5 sm:py-5">
            <div>
              <h1 className="text-[16px] font-bold text-[#172033] sm:text-[16px]">
                {editingRuleId
                  ? `Edit allocation rule #${editingRuleId}`
                  : "Create allocation rule"}
              </h1>
              <p className="mt-0.5 text-[13px] text-[#7B8798] sm:text-[11px]">
                Configure one clear path from order conditions to a slab.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span
                className="text-[13px] font-bold sm:text-[11px]"
                style={{ color: isActive ? BRAND : "#94A3B8" }}
              >
                {isActive ? "Active" : "Inactive"}
              </span>
              <Toggle
                enabled={isActive}
                onChange={() => {
                  const next = !isActive;
                  setIsActive(next);

                  if (next) {
                    toast.success("Rule will be Active");
                  } else {
                    toast.warn("Rule will be Inactive");
                  }
                }}
              />
            </div>
          </div>

          <div className="px-4 sm:px-5">
            {/* Section 01 */}
            <div className="border-b border-[#EDF0F4] py-5 sm:py-6">
              <div className="mb-5 flex items-center gap-3">
                <SectionNumber>01</SectionNumber>
                <h2 className="text-[15px] font-bold text-[#172033] sm:text-[14px]">
                  Define the rule scope
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                {/* Pickup (single) */}
                <div>
                  <FieldLabel required>Pickup Pincode</FieldLabel>

                  <div className="flex min-h-9 flex-wrap items-center gap-1.5 rounded-lg border border-[#D8E0EA] bg-white px-2 py-1.5 focus-within:border-[#0446DB] sm:min-h-10">
                    {pickupPincodes.length > 0 ? (
                      pickupPincodes.map((code) => (
                        <span
                          key={`pickup-${code}`}
                          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-semibold sm:text-[11px]"
                          style={{ background: BRAND_SOFT, color: BRAND }}
                        >
                          {code}
                          <button
                            type="button"
                            onClick={() => removePincode(code, "pickup")}
                            className="cursor-pointer rounded-full"
                            aria-label={`Remove pickup ${code}`}
                          >
                            <X size={10} />
                          </button>
                        </span>
                      ))
                    ) : (
                      <input
                        ref={pickupInputRef}
                        value={pickupInput}
                        onChange={(e) =>
                          handlePincodeChange(e.target.value, "pickup")
                        }
                        onPaste={(e) => handlePincodePaste(e, "pickup")}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && pickupInput.length === 6) {
                            e.preventDefault();
                            addPincode(pickupInput, "pickup");
                          }
                        }}
                        onBlur={() => {
                          if (pickupInput.length === 6) {
                            addPincode(pickupInput, "pickup");
                          }
                        }}
                        placeholder="Enter Pickup Pincode"
                        maxLength={6}
                        inputMode="numeric"
                        autoFocus
                        className="h-7 min-w-[135px] flex-1 bg-transparent px-1 text-[11px] outline-none placeholder:text-[#A4AFBF]"
                      />
                    )}
                  </div>
                </div>

                {/* Destination (multiple) */}
                <div>
                  <FieldLabel required>Destination Pincodes</FieldLabel>

                  {/* Pincode Input */}
                  <div
                    className={`flex min-h-9 flex-wrap items-center gap-1.5 rounded-lg border bg-white px-2 py-1.5 transition-colors sm:min-h-10 ${
                      destinationCsvFile
                        ? "border-[#D8E0EA] bg-[#F8FAFC]"
                        : "border-[#D8E0EA] focus-within:border-[#0446DB]"
                    }`}
                  >
                    {destinationPincodes.map((code) => (
                      <span
                        key={`destination-${code}`}
                        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-semibold sm:text-[11px]"
                        style={{
                          background: BRAND_SOFT,
                          color: BRAND,
                        }}
                      >
                        {code}

                        <button
                          type="button"
                          onClick={() => removePincode(code, "destination")}
                          className="cursor-pointer rounded-full transition-colors hover:text-red-500"
                          aria-label={`Remove destination ${code}`}
                        >
                          <X size={10} />
                        </button>
                      </span>
                    ))}

                    <input
                      value={destinationInput}
                      onChange={(e) =>
                        handlePincodeChange(e.target.value, "destination")
                      }
                      onPaste={(e) => handlePincodePaste(e, "destination")}
                      onKeyDown={(e) => {
                        if (
                          e.key === "Enter" &&
                          destinationInput.length === 6
                        ) {
                          e.preventDefault();
                          addPincode(destinationInput, "destination");
                        }

                        if (
                          e.key === "Backspace" &&
                          destinationInput === "" &&
                          destinationPincodes.length > 0
                        ) {
                          setDestinationPincodes((prev) => prev.slice(0, -1));
                        }
                      }}
                      placeholder={
                        destinationCsvFile ? "CSV uploaded" : "Add pincode"
                      }
                      maxLength={6}
                      inputMode="numeric"
                      disabled={!!destinationCsvFile}
                      className={`h-7 min-w-[100px] flex-1 bg-transparent px-1 text-[11px] outline-none placeholder:text-[#A4AFBF] ${
                        destinationCsvFile
                          ? "cursor-not-allowed text-[#98A2B3]"
                          : ""
                      }`}
                    />
                  </div>

                  {/* CSV Actions */}
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {/* Upload CSV */}
                    <label
                      className={`inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-md border border-[#D8E0EA] bg-white px-2.5 text-[11px] font-semibold transition-all sm:text-[12px] ${
                        uploadingCsv
                          ? "cursor-wait opacity-60"
                          : "hover:border-[#0446DB] hover:bg-[#EEF4FF]"
                      }`}
                      style={{ color: BRAND }}
                    >
                      {uploadingCsv ? (
                        <>
                          <RotateCcw size={13} className="animate-spin" />
                          Parsing CSV...
                        </>
                      ) : (
                        <>
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                          </svg>
                          Upload bulk CSV
                        </>
                      )}

                      <input
                        type="file"
                        accept=".csv"
                        onChange={handleDestinationCsvUpload}
                        disabled={uploadingCsv}
                        className="hidden"
                      />
                    </label>
                    {/* Uploaded File */}
                    {destinationCsvFile && (
                      <div className="inline-flex h-8 max-w-full items-center gap-2 rounded-md border border-[#D8E0EA] bg-[#F8FAFC] px-2.5">
                        <span className="max-w-[180px] truncate text-[11px] font-medium text-[#475569]">
                          {destinationCsvFile.name}
                        </span>

                        <button
                          type="button"
                          onClick={() => {
                            setDestinationCsvFile(null);
                            setDestinationInput("");
                            setDestinationPincodes([]);
                          }}
                          className="flex h-5 w-5 cursor-pointer items-center justify-center rounded-full text-[#94A3B8] transition-all hover:bg-red-500 hover:text-white"
                          aria-label="Clear uploaded CSV"
                          title="Clear CSV"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    )}
                  </div>

                 
                </div>
              </div>
            </div>

            {/* Section 02 */}
            <div className="border-b border-[#EDF0F4] py-5 sm:py-6">
              <div className="mb-5 flex items-center gap-3">
                <SectionNumber>02</SectionNumber>
                <div>
                  <h2 className="text-[15px] font-bold text-[#172033] sm:text-[14px]">
                    Set weight conditions
                  </h2>
                  <p className="mt-0.5 text-[12px] text-[#7B8798] sm:text-[11px]">
                    Define the applicable weight range for this rule.
                  </p>
                </div>
              </div>

              <div className="max-w-[520px]">
                <FieldLabel required>Min weight</FieldLabel>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Input
                      type="number"
                      min="0"
                      value={minWeight}
                      onChange={(e) => setMinWeight(e.target.value)}
                      className="pr-8"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-[#98A2B3]">
                      g
                    </span>
                  </div>
                  <span className="text-[11px] text-[#7B8798]">to</span>
                  <div className="relative flex-1">
                    <Input
                      type="number"
                      min="0"
                      value={maxWeight}
                      onChange={(e) => setMaxWeight(e.target.value)}
                      className="pr-8"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-[#98A2B3]">
                      g
                    </span>
                  </div>
                </div>
                <p className="mt-1.5 text-[11px] text-[#98A2B3]">
                  Maximum weight is inclusive.
                </p>
              </div>
            </div>

            {/* Section 03 */}
            <div className="py-5 sm:py-6">
              <div className="mb-5 flex items-center gap-3">
                <SectionNumber>03</SectionNumber>
                <div>
                  <h2 className="text-[15px] font-bold text-[#172033] sm:text-[14px]">
                    Choose the allocation result
                  </h2>
                  <p className="mt-0.5 text-[12px] text-[#7B8798] sm:text-[11px]">
                    Select the weight slab and service type for this rule.
                  </p>
                </div>
              </div>

              <div>
                <FieldLabel required className="uppercase tracking-[0.05em]">
                  Select weight slab
                </FieldLabel>
                <div className="grid grid-cols- gap-2.5 md:grid-cols-3">
                  {SLABS.map((slab) => (
                    <SlabCard
                      key={slab.id}
                      slab={slab}
                      selected={selectedSlab === slab.id}
                      onClick={() => setSelectedSlab(slab.id)}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-5">
                <FieldLabel required className="uppercase tracking-[0.05em]">
                  Select service
                </FieldLabel>
                <div className="grid grid-cols-1 gap-2.5 md:grid-cols-3">
                  {SERVICES.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      selected={selectedService === service.id}
                      onClick={() => setSelectedService(service.id)}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-4 max-w-[315px]">
                <FieldLabel required>Rule priority</FieldLabel>
                <Select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="1">1 · High</option>
                  <option value="2">2 · Medium</option>
                  <option value="3">3 · Low</option>
                </Select>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col-reverse gap-2 border-t border-[#EDF0F4] py-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={resetChanges}
                disabled={savingRule}
                className="inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#D8E0EA] bg-white px-4 text-[11px] font-semibold text-[#475467] transition hover:bg-[#F8FAFC] disabled:opacity-50"
              >
                <RotateCcw size={13} />
                {editingRuleId ? "Cancel edit" : "Reset changes"}
              </button>

              <button
                type="button"
                onClick={saveRule}
                disabled={savingRule}
                className="inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-lg px-5 text-[14px] font-bold text-white transition active:scale-[0.99] disabled:opacity-60"
                style={{ background: savingRule ? BRAND_HOVER : BRAND }}
              >
                <Check size={14} />
                {savingRule
                  ? "Saving..."
                  : editingRuleId
                    ? "Update rule"
                    : "Save & activate rule"}
              </button>
            </div>
          </div>
        </section>

        {/* Existing rules */}
        <section className="mt-5 overflow-hidden rounded-2xl border border-[#DDE4EC] bg-white">
          <div className="flex flex-col gap-3 border-b border-[#EDF0F4] px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-[16px] font-bold text-[#172033]">
                Existing rules
              </h2>
              <p className="mt-0.5 text-[12px] text-[#98A2B3]">
                Rules are evaluated from the lowest priority number upward.
              </p>
            </div>

            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
              <div className="relative w-full sm:w-[200px]">
                <Search
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[#98A2B3]"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search rule ID or status"
                  className="h-9 w-full rounded-lg border border-[#D8E0EA] bg-white pl-9 pr-3 text-[13px] outline-none focus:border-[#0446DB]"
                />
              </div>

              <Select
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
                className="h-9 w-full sm:w-[125px]"
              >
                <option>All services</option>
                <option>SDD</option>
                <option>NDD</option>
                <option>HLD60MIN</option>
                <option>HLD120MIN</option>
                <option>HLD4HRS</option>
              </Select>

              <button
                type="button"
                onClick={() => fetchRules(page)}
                disabled={loadingRules}
                className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-[#D8E0EA] bg-white px-3 text-[11px] font-semibold text-[#475467] hover:bg-[#F8FAFC] disabled:opacity-50"
              >
                <RotateCcw
                  size={13}
                  className={loadingRules ? "animate-spin" : ""}
                />
                Refresh
              </button>
            </div>
          </div>

          {/* Mobile */}
          <div className="block md:hidden">
            {loadingRules ? (
              <div className="px-4 py-10 text-center text-[12px] text-[#98A2B3]">
                Loading rules...
              </div>
            ) : filteredRules.length === 0 ? (
              <div className="px-4 py-10 text-center text-[12px] text-[#98A2B3]">
                No rules found
              </div>
            ) : (
              filteredRules.map((item) => (
                <div
                  key={item.id}
                  className="border-b border-[#EDF0F4] p-4 last:border-b-0"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="inline-flex rounded-md bg-[#F1F5F9] px-2 py-1 text-[12px] font-bold text-[#172033]">
                        {String(item.id).padStart(3, "0")}
                      </div>
                      <div className="mt-2 truncate text-[12px] font-bold text-[#172033]">
                        {item.rule}
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleEdit(item)}
                        className="
    inline-flex items-center gap-1.5
    rounded-lg
    border border-[#0446DB]
    px-2.5 py-1.5
    text-[11px] font-semibold
    text-[#0446DB]
    transition-all duration-200
    hover:bg-[#0446DB]
    hover:text-white
    hover:scale-105
    cursor-pointer
  "
                      >
                        <PencilIcon />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item.id)}
                        disabled={deletingRuleId === item.id}
                        className="
    group flex h-7 w-7 cursor-pointer items-center justify-center
    rounded-md border border-[#DCE4EF]
    transition-all duration-200
    hover:scale-110
    hover:border-red-500
    hover:bg-red-500
    disabled:cursor-not-allowed
    disabled:opacity-50
  "
                      >
                        <Trash2
                          size={14}
                          className="
      text-[#64748B]
      transition-colors duration-200
      group-hover:text-white
    "
                        />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 text-[10px]">
                    <div>
                      <span className="block text-[#98A2B3]">Pickup</span>
                      <strong className="mt-1 block text-[#344054]">
                        {item.pickupPincodes.length} pincodes
                      </strong>
                    </div>
                    <div>
                      <span className="block text-[#98A2B3]">Destination</span>
                      <strong className="mt-1 block text-[#344054]">
                        {item.destinationPincodes.length} pincodes
                      </strong>
                    </div>
                    <div>
                      <span className="block text-[#98A2B3]">Weight</span>
                      <strong className="mt-1 block text-[#344054]">
                        {item.weight}
                      </strong>
                    </div>
                    <div>
                      <span className="block text-[#98A2B3]">Priority</span>
                      <strong className="mt-1 block text-[#344054]">
                        {item.priority}
                      </strong>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span
                      className={`rounded-md border px-2 py-1 text-[9px] font-bold ${
                        SERVICE_STYLES[item.service] || SERVICE_STYLES.SDD
                      }`}
                    >
                      {item.allocateTo}
                    </span>
                    <StatusBadge status={item.status} />
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop */}
          <div className="hidden overflow-x-auto md:block ">
            <table className="w-full min-w-[880px] border-collapse  ">
              <thead>
                <tr className="bg-[#F8FAFC]">
                  {[
                    "Rule ID",
                    "Pickup Pincodes",
                    "Destination Pincodes",
                    "Weight",
                    "Allocate to",
                    "Status",
                    "Priority",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-3 py-3  text-left text-[13px] font-bold uppercase tracking-wide text-[#98A2B3]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loadingRules ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-12 text-center text-[12px] text-[#98A2B3]"
                    >
                      Loading rules...
                    </td>
                  </tr>
                ) : filteredRules.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-4 py-12 text-center text-[12px] text-[#98A2B3]"
                    >
                      No allocation rules found.
                    </td>
                  </tr>
                ) : (
                  filteredRules.map((item) => (
                    <tr
                      key={item.id}
                      className="border-t border-[#EDF0F4] transition hover:bg-[#FBFCFE]"
                    >
                      <td className="px-3 py-4">
                        <span className="inline-flex rounded-md bg-[#F1F5F9] px-2 py-1 text-[13px] font-bold text-[#172033]">
                          {String(item.id).padStart(3, "0")}
                        </span>
                      </td>
                      <td className="px-3 py-4 text-[13px] text-[#475467]">
                        {item.pickupPincodes.length} pincodes
                      </td>
                      <td className="px-3 py-4 text-[13px] text-[#475467]">
                        {item.destinationPincodes.length} pincodes
                      </td>
                      <td className="px-3 py-4 text-[13px] text-[#475467]">
                        {item.weight}
                      </td>
                      <td className="px-3 py-4">
                        <span
                          className={`inline-flex rounded-md border px-2 py-1 text-[13px] font-bold ${
                            SERVICE_STYLES[item.service] || SERVICE_STYLES.SDD
                          }`}
                        >
                          {item.allocateTo}
                        </span>
                      </td>
                      <td className="px-3 py-4">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="px-3 py-4 text-[13px] font-bold text-[#172033]">
                        {item.priority}
                      </td>
                      <td className="px-3 py-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleEdit(item)}
                            className="
    inline-flex items-center gap-1.5
    rounded-lg
    border border-[#0446DB]
    px-2.5 py-1.5
    text-[11px] font-semibold
    text-[#0446DB]
    transition-all duration-200
    hover:bg-[#0446DB]
    hover:text-white
    hover:scale-105
    cursor-pointer
  "
                          >
                            <PencilIcon />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            disabled={deletingRuleId === item.id}
                            className="
    group flex h-7 w-7 cursor-pointer items-center justify-center
    rounded-md border border-[#ff6905]
    transition-all duration-200
    hover:scale-110
    hover:border-red-500
    hover:bg-red-500
    disabled:cursor-not-allowed
    disabled:opacity-50
  "
                          >
                            <Trash2
                              size={14}
                              className="
      text-red-500
      transition-colors duration-200
      group-hover:text-white
    "
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col items-center justify-center gap-3 border-t border-[#EDF0F4] px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            {/* Page Info */}
            <div className="text-center text-[11px] font-medium text-[#667085]">
              Page{" "}
              <span className="font-semibold text-[#344054]">
                {pagination?.page || page}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-[#344054]">
                {pagination?.totalPages || 1}
              </span>
              <span className="mx-1.5 text-[#D0D5DD]">·</span>
              {pagination?.total || 0} total
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-center gap-1.5">
              <button
                type="button"
                onClick={() => canPrev && setPage((p) => p - 1)}
                disabled={!canPrev || loadingRules}
                className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#D8E0EA] bg-white px-3 text-[11px] font-semibold text-[#475467] transition hover:bg-[#0446DB] hover:text-white disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
              >
                <ChevronLeft size={13} strokeWidth={2} />
                <span>Previous</span>
              </button>

              {/* Current Page */}
              <div className="flex h-8 min-w-8 items-center justify-center rounded-lg bg-[#0446DB] px-2.5 text-[11px] font-bold text-white">
                {pagination?.page || page}
              </div>

              <button
                type="button"
                onClick={() => canNext && setPage((p) => p + 1)}
                disabled={!canNext || loadingRules}
                className="inline-flex h-8 items-center gap-1 rounded-lg border border-[#D8E0EA] bg-white px-3 text-[11px] font-semibold text-[#475467] transition hover:bg-[#0446DB] hover:text-white  hover:border-white disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
              >
                <span>Next</span>
                <ChevronRight size={13} strokeWidth={2} />
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
