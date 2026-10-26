
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  UserIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  BanknotesIcon,
  ShieldCheckIcon,
  XMarkIcon,
  PencilSquareIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  CheckIcon,
  ArrowUpTrayIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

const baseURL = import.meta.env.VITE_BASE_URL;

const documentTypes = [
  "aadhar",
  "pan",
  "voterid",
  "passport",
  "driving_license",
];

const companyTypes = [
  "sole Proprietorship",
  "partnership",
  "limited liability partnership",
  "private limited company",
  "public limited company",
];

const authHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

const inputClass = `
  h-11 w-full rounded-lg border border-gray-200 bg-white px-3.5
  text-sm font-medium text-gray-900 outline-none transition-all
  placeholder:text-gray-400 hover:border-gray-300
  focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10
  disabled:cursor-default disabled:border-gray-100 disabled:bg-gray-50
  disabled:text-gray-600
`;

const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-[0.08em] text-gray-500";

const primaryButton = `
  inline-flex h-10 items-center justify-center gap-2 rounded-lg
  bg-[#0446DB] px-4 text-sm font-semibold text-white shadow-sm
  transition-all hover:bg-[#0339B5] active:scale-[0.98]
  disabled:cursor-not-allowed disabled:opacity-50
`;

const secondaryButton = `
  inline-flex h-10 items-center justify-center gap-2 rounded-lg
  border border-gray-200 bg-white px-4 text-sm font-semibold text-gray-700
  transition-all hover:bg-gray-50 active:scale-[0.98]
  disabled:cursor-not-allowed disabled:opacity-50
`;

function resolveFileUrl(path) {
  if (!path) return "";
  if (path.startsWith("blob:") || path.startsWith("data:") || path.startsWith("http")) {
    return path;
  }
  return `${baseURL}/${String(path).replace(/^\/+/, "")}`;
}

function Field({ label, name, value, onChange, disabled, type = "text", placeholder = "" }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <input
        type={type}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={inputClass}
      />
    </div>
  );
}

function SelectField({ label, name, value, onChange, disabled, children, required }) {
  return (
    <div>
      <label className={labelClass}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        name={name}
        value={value ?? ""}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={inputClass}
      >
        {children}
      </select>
    </div>
  );
}

function UploadWithCrop({
  label,
  accept = "image/*,.pdf",
  currentPath,
  preview,
  onFileReady,
  disabled,
}) {
  const previewSrc = preview || resolveFileUrl(currentPath);
  const isPdf =
    previewSrc?.toLowerCase().includes(".pdf") ||
    previewSrc?.toLowerCase().startsWith("data:application/pdf");

  const selectFile = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }

    const allowedImage = file.type.startsWith("image/");
    const allowedPdf = file.type === "application/pdf";

    if (!allowedImage && !allowedPdf) {
      toast.error("Please select a valid image or PDF file");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    onFileReady(file, previewUrl);
  };

  return (
    <div>
      <label className={labelClass}>{label}</label>

      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <label
          className={`
            flex min-h-[116px] cursor-pointer flex-col items-center justify-center
            rounded-xl border border-dashed border-gray-300 bg-gray-50 px-5 py-4
            text-center transition hover:border-[#0446DB] hover:bg-blue-50/40
            ${disabled ? "pointer-events-none opacity-60" : ""}
          `}
        >
          <input
            type="file"
            accept={accept}
            onChange={selectFile}
            className="hidden"
            disabled={disabled}
          />

          <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white">
            <ArrowUpTrayIcon className="h-5 w-5 text-[#0446DB]" />
          </div>

          <p className="text-sm font-semibold text-gray-700">
            Click to upload {label.toLowerCase()}
          </p>
          <p className="mt-1 text-xs text-gray-400">
            PNG, JPG or PDF · Maximum 10MB
          </p>
        </label>

        {previewSrc && (
          <div className="flex min-h-[116px] min-w-[116px] items-center justify-center rounded-xl border border-gray-200 bg-white p-2">
            {isPdf ? (
              <a
                href={previewSrc}
                target="_blank"
                rel="noreferrer"
                className="flex h-24 w-24 flex-col items-center justify-center rounded-lg bg-red-50 text-red-600"
              >
                <DocumentTextIcon className="h-8 w-8" />
                <span className="mt-1 text-xs font-bold">View PDF</span>
              </a>
            ) : (
              <img
                src={previewSrc}
                alt={label}
                className="h-24 w-24 rounded-lg object-cover"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function OTPModal({ isOpen, onClose, onVerify, phoneNumber, loading }) {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(180);
  const [resending, setResending] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    setOtp("");
    setTimeLeft(180);
    const t = setTimeout(() => inputRef.current?.focus(), 150);
    return () => clearTimeout(t);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || timeLeft <= 0) return;
    const timer = setTimeout(() => setTimeLeft((v) => v - 1), 1000);
    return () => clearTimeout(timer);
  }, [isOpen, timeLeft]);

  const formatTime = (seconds) =>
    `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

  const resend = async () => {
    if (timeLeft > 0 || resending) return;
    setResending(true);
    try {
      const response = await axios.post(
        `${baseURL}/api/otp/sendphonenumberchangeotp`,
        { phone: phoneNumber },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response?.data?.success) {
        toast.success(response.data.message || "OTP sent successfully");
        setOtp("");
        setTimeLeft(180);
        setTimeout(() => inputRef.current?.focus(), 100);
      } else {
        toast.error(response?.data?.message || "Failed to resend OTP");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/20 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
          <div>
            <h2 className="text-base font-bold text-gray-900">Verify phone number</h2>
            <p className="mt-0.5 text-xs text-gray-500">Confirm your new mobile number.</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#0446DB]">
            <ShieldCheckIcon className="h-6 w-6" />
          </div>

          <div className="text-center">
            <h3 className="text-xl font-bold text-gray-900">Enter verification code</h3>
            <p className="mt-2 text-sm leading-6 text-gray-500">
              We sent a 4-digit OTP to{" "}
              <span className="font-semibold text-gray-900">+91 {phoneNumber}</span>
            </p>
          </div>

          <div
            className="relative mx-auto mt-6 max-w-[320px] cursor-text"
            onClick={() => timeLeft > 0 && inputRef.current?.focus()}
          >
            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
              onKeyDown={(e) => {
                if (e.key === "Enter" && otp.length === 4 && timeLeft > 0) onVerify(otp);
              }}
              maxLength={4}
              disabled={loading || timeLeft <= 0}
              className="absolute inset-0 z-10 h-14 w-full opacity-0"
            />

            <div className="pointer-events-none grid grid-cols-4 gap-3">
              {[0, 1, 2, 3].map((index) => {
                const digit = otp[index] || "";
                const active = otp.length === index || (otp.length === 4 && index === 3);
                return (
                  <div
                    key={index}
                    className={`
                      flex h-14 items-center justify-center rounded-xl border-2
                      text-xl font-bold text-gray-900 transition-all
                      ${
                        active && timeLeft > 0
                          ? "border-[#0446DB] bg-white ring-4 ring-blue-50"
                          : digit
                          ? "border-blue-200 bg-blue-50/60"
                          : "border-gray-200 bg-gray-50"
                      }
                    `}
                  >
                    {digit}
                    {active && !digit && timeLeft > 0 && (
                      <span className="h-6 w-[2px] animate-pulse bg-[#0446DB]" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <p className={`mt-4 text-center text-xs font-semibold ${timeLeft > 0 ? "text-gray-500" : "text-red-600"}`}>
            {timeLeft > 0 ? (
              <>Code expires in <span className="text-[#0446DB]">{formatTime(timeLeft)}</span></>
            ) : (
              "Verification code has expired."
            )}
          </p>

          <button
            onClick={() => onVerify(otp)}
            disabled={loading || otp.length !== 4 || timeLeft <= 0}
            className={`${primaryButton} mt-6 w-full`}
          >
            {loading ? (
              <>
                <ArrowPathIcon className="h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <CheckIcon className="h-4 w-4" />
                Verify & Update
              </>
            )}
          </button>

          <button
            onClick={resend}
            disabled={resending || timeLeft > 0}
            className={`${secondaryButton} mt-2 w-full`}
          >
            <ArrowPathIcon className={`h-4 w-4 ${resending ? "animate-spin" : ""}`} />
            {timeLeft > 0 ? `Resend in ${formatTime(timeLeft)}` : resending ? "Sending..." : "Resend Code"}
          </button>

          <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50/60 p-3">
            <p className="text-xs leading-5 text-blue-800">
              Never share this verification code with anyone. Daakit will not ask you for the OTP over a call.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function KYCSection() {
  const [companyType, setCompanyType] = useState("");
  const [profile, setProfile] = useState({});
  const [form, setForm] = useState({});
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const isKycVerified =
    profile?.kyc_verified == "1" ||
    profile?.kyc_verified === 1 ||
    profile?.kyc_verified === true;

  const loadKYC = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/vendor/getVendorProfile`, {
        headers: authHeaders(),
      });
      const data = res?.data?.data || {};
      setProfile(data);
      setForm(data);
      setCompanyType(data.company_type || "");
    } catch (error) {
      console.error("KYC profile:", error);
    }
  };

  useEffect(() => {
    loadKYC();
  }, []);

  const change = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const fileChange = (e) => {
    const { name, files } = e.target;
    if (files?.[0]) setForm((prev) => ({ ...prev, [name]: files[0] }));
  };

  const cancel = () => {
    setEditing(false);
    setForm(profile);
    setCompanyType(profile.company_type || "");
  };

  const save = async () => {
    if (isKycVerified) {
      toast.error("Your KYC is already verified and cannot be updated.");
      setEditing(false);
      return;
    }

    if (!companyType) {
      toast.error("Please select company type");
      return;
    }

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("company_type", companyType);

      [
        "document_type",
        "document_id",
        "company_pancard_name",
        "supporting_document_id",
        "supporting_document_type",
      ].forEach((key) => {
        if (form[key] !== undefined && form[key] !== null) fd.append(key, form[key]);
      });

      if (companyType === "sole Proprietorship") {
        if (form.document_image instanceof File) fd.append("document_image", form.document_image);
        else if (profile.document_image) fd.append("document_image", profile.document_image);
      } else {
        if (form.company_pancard_image instanceof File) {
          fd.append("company_pancard_image", form.company_pancard_image);
        } else if (profile.company_pancard_image) {
          fd.append("company_pancard_image", profile.company_pancard_image);
        }

        if (form.supporting_document_image instanceof File) {
          fd.append("supporting_document_image", form.supporting_document_image);
        } else if (profile.supporting_document_image) {
          fd.append("supporting_document_image", profile.supporting_document_image);
        }
      }

      const res = await axios.post(`${baseURL}/api/vendor/updateVendorInfo`, fd, {
        headers: { ...authHeaders(), "Content-Type": "multipart/form-data" },
      });

      const data = res?.data?.data || form;
      setProfile(data);
      setForm(data);
      setEditing(false);
      toast.success(res?.data?.message || "KYC updated successfully");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error updating KYC");
    } finally {
      setLoading(false);
    }
  };

  const multiCompany =
    companyType === "partnership" ||
    companyType === "limited liability partnership" ||
    companyType === "private limited company" ||
    companyType === "public limited company";

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 border-b border-gray-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-bold text-gray-900">Business verification</h3>
          <p className="mt-1 text-sm text-gray-500">Manage documents used to verify your business.</p>
        </div>

        {isKycVerified ? (
          <div className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-sm font-semibold text-emerald-700">
            <ShieldCheckIcon className="h-5 w-5" />
            KYC Verified
          </div>
        ) : !editing ? (
          <button onClick={() => setEditing(true)} className={secondaryButton}>
            <PencilSquareIcon className="h-4 w-4" />
            Edit KYC
          </button>
        ) : (
          <div className="flex gap-2">
            <button onClick={cancel} className={secondaryButton}>Cancel</button>
            <button onClick={save} disabled={loading} className={primaryButton}>
              {loading ? (
                <>
                  <ArrowPathIcon className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckIcon className="h-4 w-4" />
                  Save KYC
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {isKycVerified && (
        <div className="mb-6 overflow-hidden rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-white">
          <div className="flex items-start gap-3 p-4">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100">
              <ShieldCheckIcon className="h-5 w-5 text-emerald-700" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-sm font-bold text-emerald-900">KYC verification completed</h4>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700">
                  Locked
                </span>
              </div>
              <p className="mt-1 text-xs leading-5 text-emerald-700">
                Your business KYC has been verified. Verified KYC information is now read-only and cannot be edited from this page.
              </p>
            </div>
          </div>
        </div>
      )}

      {!isKycVerified && !editing && (
        <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50/50 p-4">
          <div className="flex items-start gap-3">
            <DocumentTextIcon className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#0446DB]" />
            <div>
              <p className="text-sm font-semibold text-gray-800">Review your KYC details</p>
              <p className="mt-1 text-xs leading-5 text-gray-500">
                You can edit these details until your KYC is verified.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <SelectField
          label="Company Type"
          value={companyType}
          onChange={(e) => {
            setCompanyType(e.target.value);
            setForm((prev) => ({ ...prev, company_type: e.target.value }));
          }}
          disabled={!editing || isKycVerified}
          required
        >
          <option value="">Select company type</option>
          {companyTypes.map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </SelectField>
      </div>

      {!companyType && (
        <div className="mt-6 rounded-xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center">
          <DocumentTextIcon className="mx-auto h-8 w-8 text-gray-300" />
          <p className="mt-2 text-sm font-semibold text-gray-600">Select your company type</p>
          <p className="mt-1 text-xs text-gray-400">Required KYC fields will appear here.</p>
        </div>
      )}

      {companyType === "sole Proprietorship" && (
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <SelectField
            label="Document Type"
            name="document_type"
            value={form.document_type}
            onChange={change}
            disabled={!editing || isKycVerified}
            required
          >
            <option value="">Select document type</option>
            {documentTypes.map((type) => (
              <option key={type} value={type}>
                {type.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </option>
            ))}
          </SelectField>

          <Field
            label="Document ID"
            name="document_id"
            value={form.document_id}
            onChange={change}
            disabled={!editing || isKycVerified}
            placeholder="Enter document ID"
          />

          <div className="md:col-span-2">
            <label className={labelClass}>Document Image</label>
            {editing && !isKycVerified ? (
              <input
                type="file"
                name="document_image"
                onChange={fileChange}
                accept="image/*,.pdf"
                className="block w-full rounded-lg border border-gray-200 bg-gray-50 p-2 text-sm text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:font-semibold file:text-[#0446DB]"
              />
            ) : profile.document_image ? (
              <a
                href={resolveFileUrl(profile.document_image)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#0446DB]"
              >
                <DocumentTextIcon className="h-5 w-5" /> View uploaded document
              </a>
            ) : (
              <p className="text-sm text-gray-400">No document uploaded</p>
            )}
          </div>
        </div>
      )}

      {multiCompany && (
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <Field
            label="Company PAN Card Name"
            name="company_pancard_name"
            value={form.company_pancard_name}
            onChange={change}
            disabled={!editing || isKycVerified}
            placeholder="Name as printed on PAN"
          />

          <div>
            <label className={labelClass}>Company PAN Card</label>
            {editing && !isKycVerified ? (
              <input
                type="file"
                name="company_pancard_image"
                onChange={fileChange}
                accept="image/*,.pdf"
                className="block w-full rounded-lg border border-gray-200 bg-gray-50 p-2 text-sm text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:font-semibold file:text-[#0446DB]"
              />
            ) : profile.company_pancard_image ? (
              <a href={resolveFileUrl(profile.company_pancard_image)} target="_blank" rel="noreferrer" className="text-sm font-semibold text-[#0446DB]">
                View PAN document
              </a>
            ) : (
              <p className="text-sm text-gray-400">No PAN document uploaded</p>
            )}
          </div>

          <SelectField
            label="Supporting Document Type"
            name="supporting_document_type"
            value={form.supporting_document_type}
            onChange={change}
            disabled={!editing || isKycVerified}
          >
            <option value="">Select supporting document</option>
            <option value="certificate_of_incorporation">Certificate of Incorporation</option>
            <option value="partnership_deed">Partnership Deed</option>
            <option value="llp_agreement">LLP Agreement</option>
            <option value="gst_certificate">GST Certificate</option>
            <option value="other">Other</option>
          </SelectField>

          <Field
            label="Supporting Document ID"
            name="supporting_document_id"
            value={form.supporting_document_id}
            onChange={change}
            disabled={!editing || isKycVerified}
            placeholder="Enter supporting document ID"
          />

          <div className="md:col-span-2">
            <label className={labelClass}>Supporting Document</label>
            {editing && !isKycVerified ? (
              <input
                type="file"
                name="supporting_document_image"
                onChange={fileChange}
                accept="image/*,.pdf"
                className="block w-full rounded-lg border border-gray-200 bg-gray-50 p-2 text-sm text-gray-600 file:mr-3 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:font-semibold file:text-[#0446DB]"
              />
            ) : profile.supporting_document_image ? (
              <a href={resolveFileUrl(profile.supporting_document_image)} target="_blank" rel="noreferrer" className="text-sm font-semibold text-[#0446DB]">
                View supporting document
              </a>
            ) : (
              <p className="text-sm text-gray-400">No supporting document uploaded</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function VendorProfile() {
  const [profile, setProfile] = useState({});
  const [editForm, setEditForm] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("personal");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [editPhone, setEditPhone] = useState(false);
  const [phone, setPhone] = useState("");
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);

  const [profileImageFile, setProfileImageFile] = useState(null);
  const [chequeFile, setChequeFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [chequePreview, setChequePreview] = useState(null);

  const getMerchantProfile = async () => {
    try {
      setPageLoading(true);
      const res = await axios.get(`${baseURL}/api/vendor/getVendorProfile`, {
        headers: authHeaders(),
      });
      const data = res?.data?.data || {};
      setProfile(data);
      setEditForm(data);
      setPhone(data.phone || "");
    } catch (error) {
      console.error("Profile:", error);
      toast.error(error?.response?.data?.message || "Unable to load profile");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    getMerchantProfile();
  }, []);

  useEffect(() => {
    return () => {
      if (profilePreview?.startsWith("blob:")) URL.revokeObjectURL(profilePreview);
      if (chequePreview?.startsWith("blob:")) URL.revokeObjectURL(chequePreview);
    };
  }, [profilePreview, chequePreview]);

  const tabs = [
    { id: "personal", label: "Personal Info", icon: UserIcon, description: "Name, email and phone" },
    { id: "company", label: "Company", icon: BuildingOfficeIcon, description: "Business information" },
    { id: "documents", label: "Company KYC", icon: DocumentTextIcon, description: "Business verification" },
    { id: "bank", label: "Bank Details", icon: BanknotesIcon, description: "Settlement account" },
  ];

  const currentTab = tabs.find((tab) => tab.id === activeTab) || tabs[0];
  const currentData = isEditing ? editForm : profile;
  const mainKycVerified =
    profile?.kyc_verified == "1" ||
    profile?.kyc_verified === 1 ||
    profile?.kyc_verified === true;

  const handleEdit = () => {
    setEditForm({ ...profile });
    setPhone(profile.phone || "");
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditPhone(false);
    setEditForm(profile);
    setPhone(profile.phone || "");
    setProfileImageFile(null);
    setChequeFile(null);
    setProfilePreview(null);
    setChequePreview(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const appendProfileFields = (fd, data) => {
    [
      "vendor_name",
      "email",
      "phone",
      "profile_image",
      "company_name",
      "company_address",
      "company_city",
      "company_state",
      "company_pincode",
      "company_gst_number",
      "bank_name",
      "bank_branch",
      "bank_account_number",
      "bank_ifsc_code",
      "document_type",
      "document_id",
    ].forEach((key) => {
      const value = data[key];
      if (value === undefined || value === null) return;
      if (key === "profile_image" && typeof value === "string" && value.startsWith("blob:")) return;
      fd.append(key, value);
    });

    if (profileImageFile) fd.set("profile_image", profileImageFile);
    else if (profile.profile_image) fd.set("profile_image", profile.profile_image);

    if (chequeFile) fd.set("cheque_image", chequeFile);
    else if (profile.cheque_image) fd.set("cheque_image", profile.cheque_image);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const fd = new FormData();
      appendProfileFields(fd, editForm);

      const res = await axios.post(`${baseURL}/api/vendor/updateVendorInfo`, fd, {
        headers: { ...authHeaders(), "Content-Type": "multipart/form-data" },
      });

      const data = res?.data?.data || editForm;
      setProfile(data);
      setEditForm(data);
      setIsEditing(false);
      setProfileImageFile(null);
      setChequeFile(null);
      setProfilePreview(null);
      setChequePreview(null);

      toast.success(res?.data?.message || "Profile updated successfully");
      getMerchantProfile();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  const sendOTP = async () => {
    const cleanPhone = phone.replace(/\D/g, "");

    if (!/^\d{10}$/.test(cleanPhone)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    if (String(profile.phone || "") === cleanPhone) {
      toast.error("Please enter a different number");
      return;
    }

    try {
      const response = await axios.post(
        `${baseURL}/api/otp/sendphonenumberchangeotp`,
        { phone: cleanPhone },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response?.data?.success) {
        toast.success(response?.data?.message || "OTP sent successfully");
        setPhone(cleanPhone);
        setShowOTPModal(true);
        setEditPhone(false);
      } else {
        toast.error(response?.data?.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to send OTP");
    }
  };

  const verifyOTP = async (otpCode) => {
    if (otpCode.length !== 4) {
      toast.error("Please enter the 4-digit OTP");
      return;
    }

    setVerificationLoading(true);

    try {
      const response = await axios.post(
        `${baseURL}/api/otp/verifyphonenumberchangeotp`,
        { phone, otp: otpCode },
        { headers: { "Content-Type": "application/json" } }
      );

      if (!response?.data?.success) {
        toast.error(response?.data?.message || "OTP verification failed");
        return;
      }

      const fd = new FormData();
      appendProfileFields(fd, editForm);
      fd.set("phone", phone);

      const res = await axios.post(`${baseURL}/api/vendor/updateVendorInfo`, fd, {
        headers: { ...authHeaders(), "Content-Type": "multipart/form-data" },
      });

      if (res?.data?.success) {
        toast.success(res?.data?.message || "Phone number updated successfully");
        setShowOTPModal(false);
        setEditPhone(false);
        setIsEditing(false);
        await getMerchantProfile();
      } else {
        toast.error(res?.data?.message || "Could not update phone number");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Verification failed");
    } finally {
      setVerificationLoading(false);
    }
  };

  const profileImage = profilePreview || resolveFileUrl(profile.profile_image);

  const renderPersonal = () => (
    <div className="grid gap-5 md:grid-cols-2">
      <Field
        label="Vendor Name"
        name="vendor_name"
        value={currentData.vendor_name}
        onChange={handleChange}
        disabled={!isEditing}
        placeholder="Enter vendor name"
      />

      <Field
        label="Email Address"
        name="email"
        type="email"
        value={currentData.email}
        onChange={handleChange}
        disabled={!isEditing}
        placeholder="name@company.com"
      />

      <div className="md:col-span-2">
        <label className={labelClass}>Phone Number</label>

        {editPhone ? (
          <div className="rounded-xl border border-blue-100 bg-blue-50/40 p-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex h-11 flex-1 overflow-hidden rounded-lg border border-gray-200 bg-white focus-within:border-[#0446DB] focus-within:ring-2 focus-within:ring-[#0446DB]/10">
                <span className="flex items-center border-r border-gray-200 bg-gray-50 px-3 text-sm font-semibold text-gray-600">+91</span>
                <input
                  type="tel"
                  inputMode="numeric"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  maxLength={10}
                  autoFocus
                  placeholder="Enter new mobile number"
                  className="min-w-0 flex-1 bg-transparent px-3 text-sm font-medium outline-none"
                />
              </div>

              <button onClick={sendOTP} className={primaryButton}>
                Send OTP
              </button>
              <button
                onClick={() => {
                  setEditPhone(false);
                  setPhone(profile.phone || "");
                }}
                className={secondaryButton}
              >
                Cancel
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500">We will verify the new number before updating your profile.</p>
          </div>
        ) : (
          <div className="relative">
            <input value={currentData.phone || ""} disabled className={`${inputClass} pr-12`} />
            {isEditing && (
              <button
                type="button"
                onClick={() => {
                  setPhone("");
                  setEditPhone(true);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-2 text-[#0446DB] hover:bg-blue-50"
                title="Change phone number"
              >
                <PencilSquareIcon className="h-4 w-4" />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="md:col-span-2">
        {isEditing ? (
          <UploadWithCrop
            label="Profile Image"
            accept="image/*"
            type="profile"
            currentPath={profile.profile_image}
            preview={profilePreview}
            onFileReady={(file, previewUrl) => {
              setProfileImageFile(file);
              setProfilePreview(previewUrl);
              setEditForm((prev) => ({ ...prev, profile_image: previewUrl }));
            }}
          />
        ) : (
          <div>
            <label className={labelClass}>Profile Image</label>
            {profileImage ? (
              <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4">
                <img src={profileImage} alt="Profile" className="h-20 w-20 rounded-xl object-cover ring-1 ring-gray-200" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">Current profile photo</p>
                  <p className="mt-1 text-xs text-gray-400">Click Edit Profile to replace this image.</p>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-400">
                No profile image uploaded
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderCompany = () => (
    <div className="grid gap-5 md:grid-cols-2">
      <Field label="Company Name" name="company_name" value={currentData.company_name} onChange={handleChange} disabled={!isEditing} />
      <Field label="GST Number" name="company_gst_number" value={currentData.company_gst_number} onChange={handleChange} disabled={!isEditing} />
      <div className="md:col-span-2">
        <Field label="Company Address" name="company_address" value={currentData.company_address} onChange={handleChange} disabled={!isEditing} />
      </div>
      <Field label="City" name="company_city" value={currentData.company_city} onChange={handleChange} disabled={!isEditing} />
      <Field label="State" name="company_state" value={currentData.company_state} onChange={handleChange} disabled={!isEditing} />
      <Field label="Pincode" name="company_pincode" value={currentData.company_pincode} onChange={handleChange} disabled={!isEditing} />
    </div>
  );

  const renderBank = () => (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Bank Name" name="bank_name" value={currentData.bank_name} onChange={handleChange} disabled={!isEditing} />
        <Field label="Account Number" name="bank_account_number" value={currentData.bank_account_number} onChange={handleChange} disabled={!isEditing} />
        <Field label="IFSC Code" name="bank_ifsc_code" value={currentData.bank_ifsc_code} onChange={handleChange} disabled={!isEditing} />
        <Field label="Branch" name="bank_branch" value={currentData.bank_branch} onChange={handleChange} disabled={!isEditing} />
      </div>

      <div className="border-t border-gray-100 pt-6">
        {isEditing ? (
          <UploadWithCrop
            label="Cancelled Cheque"
            accept="image/*,.pdf"
            type="cheque"
            currentPath={profile.cheque_image}
            preview={chequePreview}
            onFileReady={(file, previewUrl) => {
              setChequeFile(file);
              setChequePreview(previewUrl);
            }}
          />
        ) : profile.cheque_image ? (
          <div>
            <label className={labelClass}>Cancelled Cheque</label>
            <a
              href={resolveFileUrl(profile.cheque_image)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-sm font-semibold text-[#0446DB]"
            >
              <DocumentTextIcon className="h-5 w-5" />
              View cheque
            </a>
          </div>
        ) : (
          <p className="text-sm text-gray-400">No cheque uploaded.</p>
        )}
      </div>
    </div>
  );

  const renderContent = () => {
    if (activeTab === "personal") return renderPersonal();
    if (activeTab === "company") return renderCompany();
    if (activeTab === "documents") return <KYCSection />;
    if (activeTab === "bank") return renderBank();
    return null;
  };

  if (pageLoading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center bg-[#F7F8FA]">
        <div className="text-center">
          <ArrowPathIcon className="mx-auto h-7 w-7 animate-spin text-[#0446DB]" />
          <p className="mt-3 text-sm font-medium text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F8FA] ">
      <div className="mx-auto ">
        {/* PROFILE HEADER */}
        <div className="mb-5 rounded-xl border border-gray-200/80 bg-white p-4 shadow-[0_1px_2px_rgba(16,24,40,0.04)] sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <div className="relative flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gray-200 bg-gray-50">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="h-full w-full object-cover" />
                ) : (
                  <UserIcon className="h-7 w-7 text-gray-400" />
                )}
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="truncate text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                    {profile.vendor_name || "Vendor Profile"}
                  </h1>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
                      profile.is_active
                        ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                        : "bg-red-50 text-red-700 ring-1 ring-red-100"
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${profile.is_active ? "bg-emerald-500" : "bg-red-500"}`} />
                    {profile.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="mt-1 truncate text-sm text-gray-500">
                  {profile.email || "Manage account information, KYC and settlement details."}
                </p>
              </div>
            </div>

            {!isEditing ? (
              <button onClick={handleEdit} className={primaryButton}>
                <PencilSquareIcon className="h-4 w-4" />
                Edit Profile
              </button>
            ) : (
              <div className="flex flex-wrap gap-2">
                <button onClick={handleCancel} className={secondaryButton}>
                  <XMarkIcon className="h-4 w-4" />
                  Cancel
                </button>
                <button onClick={handleSave} disabled={loading} className={primaryButton}>
                  {loading ? (
                    <>
                      <ArrowPathIcon className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckIcon className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* MOBILE TAB */}
        <div className="mb-4 lg:hidden">
          <button
            onClick={() => setMobileMenuOpen((v) => !v)}
            className="flex w-full items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <currentTab.icon className="h-5 w-5 text-[#0446DB]" />
              <div className="text-left">
                <p className="text-sm font-bold text-gray-900">{currentTab.label}</p>
                <p className="text-xs text-gray-400">{currentTab.description}</p>
              </div>
            </div>
            {mobileMenuOpen ? <ChevronUpIcon className="h-5 w-5 text-gray-400" /> : <ChevronDownIcon className="h-5 w-5 text-gray-400" />}
          </button>

          {mobileMenuOpen && (
            <div className="mt-2 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition ${
                    activeTab === tab.id ? "bg-blue-50 text-[#0446DB]" : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  <div>
                    <p className="text-sm font-semibold">{tab.label}</p>
                    <div className="flex items-center gap-2">
                      <p className="mt-0.5 text-xs text-gray-400">{tab.description}</p>
                      {tab.id === "documents" && mainKycVerified && (
                        <span className="rounded-full bg-emerald-50 px-1.5 py-0.5 text-[9px] font-bold uppercase text-emerald-700">
                          Verified
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-5 lg:grid-cols-[260px_minmax(0,1fr)]">
          {/* SIDEBAR */}
          <aside className="hidden lg:block">
            <div className="sticky top-5 rounded-xl border border-gray-200/80 bg-white p-2 shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
              <div className="px-3 pb-2 pt-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gray-400">Profile Settings</p>
              </div>

              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      group flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-all
                      ${
                        activeTab === tab.id
                          ? "bg-[#0446DB] text-white shadow-sm"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }
                    `}
                  >
                    <div
                      className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${
                        activeTab === tab.id ? "bg-white/15" : "bg-gray-50 group-hover:bg-white"
                      }`}
                    >
                      <tab.icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">{tab.label}</p>
                      <div className="mt-0.5 flex items-center gap-1.5">
                        <p className={`truncate text-[11px] ${activeTab === tab.id ? "text-blue-100" : "text-gray-400"}`}>
                          {tab.description}
                        </p>
                        {tab.id === "documents" && mainKycVerified && (
                          <CheckIcon className={`h-3.5 w-3.5 flex-shrink-0 ${activeTab === tab.id ? "text-emerald-200" : "text-emerald-600"}`} />
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* CONTENT */}
          <section className="min-w-0 rounded-xl border border-gray-200/80 bg-white shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
            <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div>
                <div className="flex items-center gap-2">
                  <currentTab.icon className="h-5 w-5 text-[#0446DB]" />
                  <h2 className="text-lg font-bold text-gray-900">{currentTab.label}</h2>
                </div>
                <p className="mt-1 text-sm text-gray-500">{currentTab.description}</p>
              </div>

              {isEditing && activeTab !== "documents" && (
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700 ring-1 ring-amber-100">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
                  Editing mode
                </span>
              )}
            </div>

            <div className="p-5 sm:p-6">{renderContent()}</div>
          </section>
        </div>
      </div>

      <OTPModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        onVerify={verifyOTP}
        phoneNumber={phone}
        loading={verificationLoading}
      />
    </div>
  );
}



