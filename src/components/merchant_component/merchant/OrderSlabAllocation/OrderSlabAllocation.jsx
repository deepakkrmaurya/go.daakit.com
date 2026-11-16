

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
  {
    id: "SLAB_5000GM",
    title: "5,000 g",
    subtitle: "Up to 5 kg",
    weightSlabG: 5000,
  },
];

// Only show weight slabs supported by the selected service.
const SERVICE_SLABS = {
  SDD: [500, 2000, 5000],
  NDD: [500, 2000, 5000],
  HDL60MIN: [500, 1000],
  HLD120MIN: [500, 1000],
  HLD4HRS: [500, 1000],
};

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
    id: "HDL60MIN",
    title: "HDL60MIN",
    subtitle: "Hyperlocal 60-min delivery",
    dot: "bg-teal-600",
  },
  {
    id: "HLD120MIN",
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
  HLD4HRS: "bg-teal-50 text-teal-700 border-teal-100",
  HLD: "bg-teal-50 text-teal-700 border-teal-100",
  HDL60MIN: "bg-teal-50 text-teal-700 border-teal-100",
  HLD120MIN: "bg-teal-50 text-teal-700 border-teal-100",
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

const normalizeCondition = (v) => {
  if (!v) return null;
  if (typeof v === "string") {
    try { return JSON.parse(v); } catch { return null; }
  }
  return v;
};

const weightLabel = (w) => {
  if (!w) return "Any weight";
  if (["BETWEEN", "NOT_BETWEEN"].includes(w.operator))
    return `${w.operator} (${w.from_g}, ${w.to_g}] g`;
  return `${w.operator} ${w.value_g} g`;
};

const mapApiRuleToUi = (item) => {
  const pickupCondition = normalizeCondition(item.pickup_condition);
  const destinationCondition = normalizeCondition(item.destination_condition);
  const weightCondition = normalizeCondition(item.weight_condition);
  const pickupPincodes = pickupCondition?.pincodes?.map(String) || [];
  const destinationPincodes = destinationCondition?.pincodes?.map(String) || [];
  const service = item.service || "";
  const weightSlabG = Number(item.weight_slab_g || 0);
  const isActive = Number(item.is_active) === 1 || item.is_active === true;
  return {
    id: item.rule_id ?? item.id,
    priority: Number(item.priority),
    logicalOperator: item.logical_operator || "AND",
    pickupCondition,
    destinationCondition,
    weightCondition,
    pickupPincodes,
    destinationPincodes,
    pickupPincode: pickupPincodes[0] || "",
    weight: weightLabel(weightCondition),
    weightSlabG,
    service,
    allocateTo: `${service}-${weightSlabG}gm`,
    status: isActive ? "Active" : "Inactive",
    isActive,
    createdAt: item.created_at,
    updatedAt: item.updated_at,
    rule: `${item.logical_operator || "AND"} · ${service} · ${weightLabel(weightCondition)}`,
  };
};


/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function OrderSlabAllocation() {
  const [isActive, setIsActive] = useState(true);
  const [enabled, setEnabled] = useState({ pickup: false, destination: false, weight: true });
  const [logicalOperator, setLogicalOperator] = useState("AND");
  const [pickupOperator, setPickupOperator] = useState("IN");
  const [destinationOperator, setDestinationOperator] = useState("IN");
  const [weightOperator, setWeightOperator] = useState("BETWEEN");
  const [pickupPincodes, setPickupPincodes] = useState([]);
  const [destinationPincodes, setDestinationPincodes] = useState([]);
  const [pickupInput, setPickupInput] = useState("");
  const [destinationInput, setDestinationInput] = useState("");
  const [minWeight, setMinWeight] = useState("0");
  const [maxWeight, setMaxWeight] = useState("500");
  const [weightValue, setWeightValue] = useState("500");
  const [selectedSlab, setSelectedSlab] = useState("SLAB_500GM");
  const [selectedService, setSelectedService] = useState("SDD");
  const [priority, setPriority] = useState("1");
  const [destinationCsvFile, setDestinationCsvFile] = useState(null);
  const [uploadingCsv, setUploadingCsv] = useState(false);
  const [rules, setRules] = useState([]);
  const [loadingRules, setLoadingRules] = useState(false);
  const [savingRule, setSavingRule] = useState(false);
  const [deletingRuleId, setDeletingRuleId] = useState(null);
  const [editingRuleId, setEditingRuleId] = useState(null);
  const [page, setPage] = useState(1);
  const limit = 20;
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit, totalPages: 1 });
  const [search, setSearch] = useState("");
  const [serviceFilter, setServiceFilter] = useState("All services");
  const editFormRef = useRef(null);
  const pickupInputRef = useRef(null);
  const activeGroups = Object.values(enabled).filter(Boolean).length;
  const availableSlabs = SLABS.filter(slab =>
    (SERVICE_SLABS[selectedService] || []).includes(slab.weightSlabG)
  );
  const selectedSlabData = availableSlabs.find(s => s.id === selectedSlab);
  const slabValue = selectedSlabData?.weightSlabG;

  const fetchRules = async (requestedPage = page) => {
    try {
      setLoadingRules(true);
      const response = await api.get(`${API_BASE}/getMerchantServiceAllocationRules`, {
        params: { page: requestedPage, limit },
      });
      const body = response.data;
      const raw = body?.data;
      const items = Array.isArray(raw) ? raw :
        Array.isArray(raw?.rules) ? raw.rules :
        Array.isArray(raw?.rows) ? raw.rows :
        Array.isArray(raw?.items) ? raw.items : [];
      const mapped = items.map(mapApiRuleToUi);
      setRules(mapped);
      const pg = body?.pagination || raw?.pagination || {};
      setPagination({
        total: Number(pg.total ?? pg.totalRecords ?? mapped.length),
        page: Number(pg.page ?? requestedPage),
        limit: Number(pg.limit ?? limit),
        totalPages: Number(pg.totalPages ?? pg.total_pages ?? 1),
      });
    } catch (error) {
      console.error("[Allocation Rules] GET Error:", error?.response?.data || error);
      toast.error(getErrorMessage(error, "Failed to fetch allocation rules"));
      setRules([]);
    } finally { setLoadingRules(false); }
  };

  useEffect(() => { fetchRules(page); }, [page]);
  useEffect(() => {
    if (editingRuleId) editFormRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [editingRuleId]);

  const addPincode = (raw, type) => {
    const code = normalizePincode(raw);
    if (code.length !== 6) { toast.error("Enter a valid 6 digit pincode"); return; }
    const setter = type === "pickup" ? setPickupPincodes : setDestinationPincodes;
    setter(prev => [...new Set([...prev, code])]);
    if (type === "pickup") setPickupInput(""); else setDestinationInput("");
  };
  const removePincode = (code, type) => {
    const setter = type === "pickup" ? setPickupPincodes : setDestinationPincodes;
    setter(prev => prev.filter(p => p !== code));
  };
  const handlePincodeChange = (raw, type) => {
    const code = normalizePincode(raw);
    if (code.length === 6) { addPincode(code, type); return; }
    if (type === "pickup") setPickupInput(code); else setDestinationInput(code);
  };
  const handlePincodePaste = (e, type) => {
    e.preventDefault();
    const values = e.clipboardData.getData("text").split(/[\s,;]+/).filter(Boolean);
    const valid = values.filter(p => /^\d{6}$/.test(p));
    if (valid.length !== values.length) toast.warn("Invalid pincodes skipped");
    const setter = type === "pickup" ? setPickupPincodes : setDestinationPincodes;
    setter(prev => [...new Set([...prev, ...valid])]);
    if (type === "pickup") setPickupInput(""); else setDestinationInput("");
  };

  const resetForm = () => {
    setIsActive(true);
    setEnabled({ pickup: false, destination: false, weight: true });
    setLogicalOperator("AND");
    setPickupOperator("IN"); setDestinationOperator("IN"); setWeightOperator("BETWEEN");
    setPickupPincodes([]); setDestinationPincodes([]);
    setPickupInput(""); setDestinationInput("");
    setDestinationCsvFile(null);
    setMinWeight("0"); setMaxWeight("500"); setWeightValue("500");
    setSelectedSlab("SLAB_500GM");
    setSelectedService("SDD"); setPriority("1"); setEditingRuleId(null);
  };
  const resetChanges = () => { resetForm(); toast.info("Changes reset"); };

  const buildPayload = () => {
    const pick = [...new Set([...pickupPincodes, ...(pickupInput.length === 6 ? [pickupInput] : [])])];
    const dest = [...new Set([...destinationPincodes, ...(destinationInput.length === 6 ? [destinationInput] : [])])];
    if (!activeGroups) throw new Error("Enable at least one condition group");
    if (enabled.pickup && !pick.length) throw new Error("Add at least one pickup pincode");
    if (enabled.destination && !dest.length && !destinationCsvFile)
      throw new Error("Add destination pincodes or upload a CSV");
    if (enabled.pickup && pickupInput && pickupInput.length !== 6) throw new Error("Complete pickup pincode");
    if (enabled.destination && destinationInput && destinationInput.length !== 6) throw new Error("Complete destination pincode");
    let weightCondition = null;
    if (enabled.weight) {
      if (["BETWEEN", "NOT_BETWEEN"].includes(weightOperator)) {
        if (minWeight === "" || maxWeight === "" ||
          !Number.isInteger(Number(minWeight)) || !Number.isInteger(Number(maxWeight)) ||
          Number(minWeight) < 0 || Number(maxWeight) <= Number(minWeight))
          throw new Error("Enter a valid weight range (from < to)");
        weightCondition = { operator: weightOperator, from_g: Number(minWeight), to_g: Number(maxWeight) };
      } else {
        if (weightValue === "" || !Number.isInteger(Number(weightValue)) || Number(weightValue) < 0)
          throw new Error("Enter a valid non-negative weight in grams");
        weightCondition = { operator: weightOperator, value_g: Number(weightValue) };
      }
    }
    if (!Number.isInteger(slabValue) || slabValue <= 0 ||
        !(SERVICE_SLABS[selectedService] || []).includes(slabValue))
      throw new Error("Select a valid weight slab for the selected service");
    if (!Number.isInteger(Number(priority)) || Number(priority) < 1) throw new Error("Priority must be a positive integer");
    if (!SERVICES.some(s => s.id === selectedService)) throw new Error("Select a valid service");
    return {
      logical_operator: activeGroups === 1 ? "AND" : logicalOperator,
      pickup_condition: enabled.pickup ? { operator: pickupOperator, pincodes: pick } : null,
      destination_condition: enabled.destination ? { operator: destinationOperator, pincodes: dest } : null,
      weight_condition: weightCondition,
      weight_slab_g: slabValue,
      service: selectedService,
      priority: Number(priority),
      is_active: isActive ? 1 : 0,
    };
  };

  const saveRule = async () => {
    let payload;
    try { payload = buildPayload(); } catch (e) { toast.error(e.message); return; }
    try {
      setSavingRule(true);
      // Both CREATE and UPDATE always send the exact same JSON contract.
      // CSV pincodes are parsed into destination_condition.pincodes on the client.
      const response = editingRuleId
        ? await api.put(`${API_BASE}/updateMerchantServiceAllocationRule/${editingRuleId}`, payload)
        : await api.post(`${API_BASE}/createMerchantServiceAllocationRule`, payload);
      toast.success(response?.data?.message || (editingRuleId ? "Rule updated" : "Rule created"));
      resetForm();
      await fetchRules(page);
    } catch (error) {
      const existing = error?.response?.status === 409 ? error?.response?.data?.data : null;
      if (existing?.existing_rule_id) {
        toast.error(`Same rule already exists (#${existing.existing_rule_id}). Edit/reactivate it instead.`);
      } else {
        toast.error(getErrorMessage(error, "Failed to save allocation rule"));
      }
      console.error("[Allocation Rules] Save Error:", error?.response?.data || error);
    } finally { setSavingRule(false); }
  };

  const handleEdit = (item) => {
    const pick = item.pickupCondition;
    const dest = item.destinationCondition;
    const weight = item.weightCondition;
    setEditingRuleId(item.id);
    setIsActive(item.isActive);
    setEnabled({ pickup: !!pick, destination: !!dest, weight: !!weight });
    setLogicalOperator(item.logicalOperator);
    setPickupOperator(pick?.operator || "IN");
    setDestinationOperator(dest?.operator || "IN");
    setWeightOperator(weight?.operator || "BETWEEN");
    setPickupPincodes(pick?.pincodes?.map(String) || []);
    setDestinationPincodes(dest?.pincodes?.map(String) || []);
    setPickupInput(""); setDestinationInput(""); setDestinationCsvFile(null);
    setMinWeight(String(weight?.from_g ?? "0"));
    setMaxWeight(String(weight?.to_g ?? "500"));
    setWeightValue(String(weight?.value_g ?? "500"));
    setSelectedService(item.service);
    const allowedSlabs = SERVICE_SLABS[item.service] || [];
    const knownSlab = SLABS.find(s =>
      s.weightSlabG === item.weightSlabG && allowedSlabs.includes(s.weightSlabG)
    );
    // Never silently overwrite an existing unsupported slab during editing.
    setSelectedSlab(knownSlab?.id || "");
    if (!knownSlab) toast.warn("This rule has an unsupported slab. Select an available slab before updating.");
    setPriority(String(item.priority));
    toast.info(`Rule #${item.id} loaded for editing`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this allocation rule?")) return;
    try {
      setDeletingRuleId(id);
      const response = await api.delete(`${API_BASE}/deleteMerchantServiceAllocationRule/${id}`);
      toast.success(response?.data?.message || "Allocation rule deleted");
      if (editingRuleId === id) resetForm();
      if (rules.length === 1 && page > 1) setPage(p => p - 1);
      else await fetchRules(page);
    } catch (error) {
      toast.error(getErrorMessage(error, "Failed to delete allocation rule"));
    } finally { setDeletingRuleId(null); }
  };

  const handleDestinationCsvUpload = e => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".csv") || file.size > 2 * 1024 * 1024) {
      toast.error("Upload a .csv file under 2 MB"); return;
    }
    setUploadingCsv(true);
    const reader = new FileReader();
    reader.onload = event => {
      try {
        const cells = String(event.target.result || "").split(/[\s,;\t]+/).filter(Boolean);
        const valid = [...new Set(cells.filter(c => /^\d{6}$/.test(c)))];
        if (!valid.length) { toast.error("No valid six-digit pincodes found"); return; }
        setDestinationPincodes(prev => [...new Set([...prev, ...valid])]);
        setDestinationCsvFile(file);
        setEnabled(prev => ({ ...prev, destination: true }));
        toast.success(`${valid.length} pincodes imported`);
      } catch { toast.error("Could not parse CSV"); }
      finally { setUploadingCsv(false); }
    };
    reader.onerror = () => { toast.error("Failed to read CSV"); setUploadingCsv(false); };
    reader.readAsText(file);
  };

  

const filteredRules = useMemo(() => {
  const q = search.trim().toLowerCase();

  return rules.filter((item) => {
    if (
      serviceFilter !== "All services" &&
      item.service !== serviceFilter
    ) {
      return false;
    }

    if (!q) return true;

    return [
      item.status,
      item.rule,
      item.service,
      item.allocateTo,
      item.weight,
      item.priority,
      item.logicalOperator,
      ...(item.pickupPincodes || []),
      ...(item.destinationPincodes || []),
    ].some((value) =>
      String(value ?? "").toLowerCase().includes(q)
    );
  });
}, [rules, search, serviceFilter]);


  const activeCount = rules.filter(r => r.isActive).length;
  const canPrev = page > 1;
  const canNext = page < Number(pagination.totalPages || 1);


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
                Allocate services using optional pickup, destination and weight
                conditions with AND/OR and priority.
              </p>
            </div>

            <span className="inline-flex w-fit items-center gap-1 rounded-full bg-white px-3 py-1 text-[12px] font-bold text-[#138A4A] sm:text-[14px]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#22C55E]" />
              {activeCount} active on this page
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full mt-5">
        {/* Stepper */}
        <div className="mb-5 overflow-x-auto rounded-xl border border-[#DFE5EC] bg-white shadow-[0_1px_2px_rgba(16,24,40,0.02)]">
          <div className="flex min-w-[360px] items-center px-3 py-2.5 sm:min-w-[420px] sm:px-5 sm:py-3">
            <StepItem number="1" title="Conditions" />
            <StepItem number="2" title="Operators" />
            <StepItem number="3" title="Allocation" active last />
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
            {/* Condition groups: optional, at least one must be enabled */}
            <div className="py-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-[15px] font-bold">Define rule conditions</h2>
                  <p className="mt-1 text-xs text-[#7B8798]">Enable one, two or all three conditions.</p>
                </div>
                {activeGroups > 1 && (
                  <div className="flex items-center gap-2">
                    <FieldLabel>Combine with</FieldLabel>
                    <Select value={logicalOperator} onChange={e => setLogicalOperator(e.target.value)}>
                      <option value="AND">AND (all must match)</option>
                      <option value="OR">OR (any can match)</option>
                    </Select>
                  </div>
                )}
              </div>
              {[
                { key: "pickup", title: "Pickup pincode", operator: pickupOperator, setOperator: setPickupOperator,
                  codes: pickupPincodes, input: pickupInput, setInput: setPickupInput },
                { key: "destination", title: "Destination pincode", operator: destinationOperator,
                  setOperator: setDestinationOperator, codes: destinationPincodes, input: destinationInput, setInput: setDestinationInput },
              ].map(group => (
                <div key={group.key} className="rounded-xl border border-[#DDE4EC] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-[13px] font-bold">{group.title}</h3>
                    <div className="flex items-center gap-2 text-xs">
                      <span>{enabled[group.key] ? "Enabled" : "Disabled"}</span>
                      <Toggle enabled={enabled[group.key]} onChange={() => setEnabled(prev => ({ ...prev, [group.key]: !prev[group.key] }))} />
                    </div>
                  </div>
                  {enabled[group.key] && (
                    <div className="mt-3 space-y-3">
                      <div className="max-w-[220px]">
                        <FieldLabel>Operator</FieldLabel>
                        <Select value={group.operator} onChange={e => group.setOperator(e.target.value)}>
                          <option value="IN">IN</option>
                          <option value="NOT_IN">NOT IN</option>
                        </Select>
                      </div>
                      <div className="flex min-h-10 flex-wrap items-center gap-1.5 rounded-lg border border-[#D8E0EA] px-2 py-1.5">
                        {group.codes.map(code => (
                          <span key={code} className="inline-flex items-center gap-1 rounded-md bg-[#EEF4FF] px-2 py-1 text-[11px] font-semibold text-[#0446DB]">
                            {code}
                            <button type="button" onClick={() => removePincode(code, group.key)} aria-label={`Remove ${code}`}><X size={12}/></button>
                          </span>
                        ))}
                        <input
                          ref={group.key === "pickup" ? pickupInputRef : undefined}
                          value={group.input}
                          onChange={e => handlePincodeChange(e.target.value, group.key)}
                          onPaste={e => handlePincodePaste(e, group.key)}
                          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); if (group.input.length === 6) addPincode(group.input, group.key); } }}
                          placeholder="Enter 6-digit pincode" inputMode="numeric" maxLength={6}
                          className="h-7 min-w-[160px] flex-1 bg-transparent text-xs outline-none"/>
                      </div>
                      {group.key === "destination" && (
                        <div className="flex flex-wrap items-center gap-2">
                          <label className="cursor-pointer rounded-md border border-[#D8E0EA] px-3 py-2 text-xs font-semibold text-[#0446DB]">
                            {uploadingCsv ? "Reading CSV..." : "Import destination CSV"}
                            <input type="file" accept=".csv" className="hidden" disabled={uploadingCsv} onChange={handleDestinationCsvUpload}/>
                          </label>
                          {destinationCsvFile && <span className="text-xs text-[#667085]">{destinationCsvFile.name} (imported into list)
                            <button type="button" className="ml-2 text-red-500" onClick={() => setDestinationCsvFile(null)}>Clear file</button>
                          </span>}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
              <div className="rounded-xl border border-[#DDE4EC] p-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-[13px] font-bold">Weight condition</h3>
                  <div className="flex items-center gap-2 text-xs">
                    <span>{enabled.weight ? "Enabled" : "Disabled"}</span>
                    <Toggle enabled={enabled.weight} onChange={() => setEnabled(prev => ({ ...prev, weight: !prev.weight }))}/>
                  </div>
                </div>
                {enabled.weight && (
                  <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div><FieldLabel>Operator</FieldLabel>
                      <Select value={weightOperator} onChange={e => setWeightOperator(e.target.value)}>
                        {["BETWEEN", "NOT_BETWEEN", "EQ", "GT", "GTE", "LT", "LTE"].map(op => <option key={op} value={op}>{op}</option>)}
                      </Select>
                    </div>
                    {["BETWEEN", "NOT_BETWEEN"].includes(weightOperator) ? (
                      <>
                        <div><FieldLabel>From (g, exclusive)</FieldLabel><Input type="number" min="0" step="1" value={minWeight} onChange={e => setMinWeight(e.target.value)}/></div>
                        <div><FieldLabel>To (g, inclusive)</FieldLabel><Input type="number" min="1" step="1" value={maxWeight} onChange={e => setMaxWeight(e.target.value)}/></div>
                      </>
                    ) : <div><FieldLabel>Value (g)</FieldLabel><Input type="number" min="0" step="1" value={weightValue} onChange={e => setWeightValue(e.target.value)}/></div>}
                  </div>
                )}
              </div>
            </div>
            {/* Allocation output */}
            <div className="border-t border-[#EDF0F4] py-5">
              <div className="mb-4 flex items-center gap-3"><SectionNumber>02</SectionNumber><h2 className="text-[15px] font-bold">Choose allocation result</h2></div>
              <div>
                <FieldLabel required>Select service</FieldLabel>
                <div className="grid grid-cols-1 gap-2.5 md:grid-cols-3">
                  {SERVICES.map(service => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      selected={selectedService === service.id}
                      onClick={() => {
                        if (selectedService === service.id) return;
                        setSelectedService(service.id);
                        // Reset the slab so an old service's slab is never submitted.
                        setSelectedSlab("SLAB_500GM");
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="mt-5">
                <FieldLabel required>Select weight slab</FieldLabel>
                <p className="mb-2 text-xs text-[#7B8798]">
                  {selectedService === "SDD" || selectedService === "NDD"
                    ? "Available slabs: 500g, 2000g, 5000g"
                    : "Available slabs: 500g, 1000g"}
                </p>
                <div className="grid grid-cols-2 gap-2.5 md:grid-cols-3">
                  {availableSlabs.map(slab => (
                    <SlabCard
                      key={slab.id}
                      slab={slab}
                      selected={selectedSlab === slab.id}
                      onClick={() => setSelectedSlab(slab.id)}
                    />
                  ))}
                </div>
              </div>
              <div className="mt-4 max-w-[315px]"><FieldLabel required>Rule priority (smaller wins)</FieldLabel>
                 
                <Input type="number" min="1" step="1" value={priority} onChange={e => setPriority(e.target.value)}/>
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
                    : "Save rule"}
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
                  placeholder="Search status, service, weight..."
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
                <option>HDL60MIN</option>
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
                        {item.pickupCondition ? `${item.pickupCondition.operator}: ${item.pickupPincodes.length} pincodes` : "Any"}
                      </strong>
                    </div>
                    <div>
                      <span className="block text-[#98A2B3]">Destination</span>
                      <strong className="mt-1 block text-[#344054]">
                        {item.destinationCondition ? `${item.destinationCondition.operator}: ${item.destinationPincodes.length} pincodes` : "Any"}
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
                          {String(item.id)}
                        </span>
                      </td>
                      <td className="px-3 py-4 text-[13px] text-[#475467]">
                        {item.pickupCondition ? `${item.pickupCondition.operator}: ${item.pickupPincodes.length} pincodes` : "Any"}
                      </td>
                      <td className="px-3 py-4 text-[13px] text-[#475467]">
                        {item.destinationCondition ? `${item.destinationCondition.operator}: ${item.destinationPincodes.length} pincodes` : "Any"}
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
                      
                      <td className="px-3 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold ${
                            Number(item.priority) === 1
                              ? "border-red-200 bg-red-50 text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400"
                              : Number(item.priority) === 2
                              ? "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400"
                              : "border-green-200 bg-green-50 text-green-700 dark:border-green-500/20 dark:bg-green-500/10 dark:text-green-400"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              Number(item.priority) === 1
                                ? "bg-red-500"
                                : Number(item.priority) === 2
                                ? "bg-amber-500"
                                : "bg-green-500"
                            }`}
                          />

                          {Number(item.priority) === 1
                            ? "High"
                            : Number(item.priority) === 2
                            ? "Medium"
                            : "Low"}
                        </span>
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
