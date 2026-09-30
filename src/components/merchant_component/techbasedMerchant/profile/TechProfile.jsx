
import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import Cropper from "react-easy-crop";
import {
  UserIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  BanknotesIcon,
  CalendarIcon,
  WalletIcon,
  CogIcon,
  ShieldCheckIcon,
  ClipboardDocumentListIcon,
  PhotoIcon,
  CheckBadgeIcon,
  XMarkIcon,
  PencilSquareIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PhoneIcon,
  EnvelopeIcon,
  BuildingStorefrontIcon,
  IdentificationIcon,
  ArrowTopRightOnSquareIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import AxiosInstance from "../../../../Helper/axiosInstance";
import { Country, State, City } from "country-state-city";

const baseURL = import.meta.env.VITE_BASE_URL;

const inputClass = `
  w-full rounded-sm border border-gray-200 bg-white px-4 py-3
  text-sm font-medium text-gray-800 outline-none transition-all duration-200
  placeholder:text-gray-400 hover:border-gray-300
  focus:border-[#0446DB] focus:ring-4 focus:ring-blue-500/10
  disabled:cursor-not-allowed disabled:border-gray-100 disabled:bg-gray-50 disabled:text-gray-600
  dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100
  dark:placeholder:text-neutral-600 dark:hover:border-neutral-600
  dark:focus:border-blue-500 dark:focus:ring-blue-500/10
  dark:disabled:border-neutral-800 dark:disabled:bg-neutral-800 dark:disabled:text-neutral-400
`;

const labelClass = `
  mb-2 block text-xs font-semibold uppercase tracking-wide
  text-gray-500 dark:text-neutral-400
`;

const Profile = () => {
  const [editTabPhone] = useState("phone");
  const [editPhone, setEditPhone] = useState(false);
  const [phone, setPhone] = useState("");
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [profile, setProfile] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("personal");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);

  const countries = Country.getAllCountries();
  const states = selectedCountry ? State.getStatesOfCountry(selectedCountry.isoCode) : [];
  const cities = selectedCountry && selectedState ? City.getCitiesOfState(selectedCountry.isoCode, selectedState.isoCode) : [];

  const [profileImageFile, setProfileImageFile] = useState(null);
  const [documentFile, setDocumentFile] = useState(null);
  const [chequeFile, setChequeFile] = useState(null);

  const [profilePreview, setProfilePreview] = useState(null);
  const [documentPreview, setDocumentPreview] = useState(null);
  const [chequePreview, setChequePreview] = useState(null);

  const syncCompanyLocation = (data = {}) => {
    const country = Country.getAllCountries().find((item) =>
      item.name?.toLowerCase() === data?.company_country?.toLowerCase() ||
      item.isoCode?.toLowerCase() === data?.company_country?.toLowerCase()
    ) || Country.getCountryByCode("IN") || null;

    setSelectedCountry(country);

    if (country && data?.company_state) {
      const state = State.getStatesOfCountry(country.isoCode).find((item) =>
        item.name?.toLowerCase() === data.company_state?.toLowerCase() ||
        item.isoCode?.toLowerCase() === data.company_state?.toLowerCase()
      );
      setSelectedState(state || null);
    } else {
      setSelectedState(null);
    }
  };

  const getMerchantProfile = async () => {
    try {

      const res = await AxiosInstance.get('/api/tech-merchant/getMerchantProfile')
      

      const data = res?.data?.data || {};
      setProfile(data);
      setEditForm(data);
      syncCompanyLocation(data);
    } catch (err) {
      console.error("profile", err);
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load profile",
      );
    }
  };

  useEffect(() => {
    getMerchantProfile();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm({ ...profile });
    syncCompanyLocation(profile);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm(profile);
    syncCompanyLocation(profile);
    setProfileImageFile(null);
    setDocumentFile(null);
    setChequeFile(null);
    setProfilePreview(null);
    setDocumentPreview(null);
    setChequePreview(null);
    setEditPhone(false);
    setPhone("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCountryChange = (e) => {
    const country = Country.getCountryByCode(e.target.value) || null;
    setSelectedCountry(country);
    setSelectedState(null);
    setEditForm((prev) => ({ ...prev, company_country: country?.name || "", company_state: "", company_city: "" }));
  };

  const handleStateChange = (e) => {
    if (!selectedCountry) return;
    const state = State.getStateByCodeAndCountry(e.target.value, selectedCountry.isoCode) || null;
    setSelectedState(state);
    setEditForm((prev) => ({ ...prev, company_state: state?.name || "", company_city: "" }));
  };

  const handleCityChange = (e) => {
    setEditForm((prev) => ({ ...prev, company_city: e.target.value }));
  };

  const sendOTP = async () => {
    try {
      if (!phone) {
        toast.error("Please enter a valid phone number");
        return;
      }

      if (profile.phone === phone) {
        toast.error("Please enter a different number");
        return;
      }

      if (!/^[0-9]{10}$/.test(phone)) {
        toast.error("Please enter a valid 10-digit phone number");
        return;
      }

      const response = await axios.post(
        `${baseURL}/api/otp/sendphonenumberchangeotp`,
        { phone },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response?.data?.success) {
        toast.success(response.data.message);
        setShowOTPModal(true);
        setEditPhone(false);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to send OTP",
      );
    }
  };

  const handleResendOTP = async () => {
    if (!phone) {
      toast.error("Phone number is missing");
      return;
    }

    try {
      const response = await axios.post(
        `${baseURL}/api/otp/sendphonenumberchangeotp`,
        { phone },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response?.data?.success) {
        toast.success(response.data.message || "OTP sent successfully");
      }
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to resend OTP",
      );
    }
  };

  const verifyOTP = async (otpCode) => {
    setVerificationLoading(true);

    try {
      const response = await axios.post(
        `${baseURL}/api/otp/verifyphonenumberchangeotp`,
        {
          phone,
          otp: otpCode,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response?.data?.success) {
        const formData = new FormData();

        const fields = [
          "name",
          "email",
          "profile_image",
          "company_name",
          "company_address",
          "company_country",
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
        ];

        fields.forEach((field) => {
          const value = editForm[field];

          if (value !== undefined && value !== null) {
            if (
              field === "profile_image" &&
              typeof value === "string" &&
              value.startsWith("blob:")
            ) {
              return;
            }

            formData.append(field, value);
          }
        });

        if (profileImageFile) {
          formData.append("profile_image", profileImageFile);
        } else if (profile.profile_image) {
          formData.append("profile_image", profile.profile_image);
        }

        if (documentFile) {
          formData.append("document_image", documentFile);
        } else if (profile.document_image) {
          formData.append("document_image", profile.document_image);
        }

        if (chequeFile) {
          formData.append("cheque_image", chequeFile);
        } else if (profile.cheque_image) {
          formData.append("cheque_image", profile.cheque_image);
        }

        formData.append("phone", phone);
        const res = await AxiosInstance.put('/api/tech-merchant/updateMerchantInfo',formData)
        

        if (res?.data?.success) {
          await getMerchantProfile();
          setShowOTPModal(false);
          setPhone("");
          toast.success(res.data.message || "Phone updated successfully");
        }
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "OTP verification failed",
      );
    } finally {
      setVerificationLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);

    try {
      const formData = new FormData();

      const fields = [
        "name",
        "email",
        "phone",
        "profile_image",
        "company_name",
        "company_address",
        "company_country",
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
      ];

      fields.forEach((field) => {
        const value = editForm[field];

        if (value !== undefined && value !== null) {
          if (
            field === "profile_image" &&
            typeof value === "string" &&
            value.startsWith("blob:")
          ) {
            return;
          }

          formData.append(field, value);
        }
      });

      if (profileImageFile) {
        formData.append("profile_image", profileImageFile);
      } else if (profile.profile_image) {
        formData.append("profile_image", profile.profile_image);
      }

      if (documentFile) {
        formData.append("document_image", documentFile);
      } else if (profile.document_image) {
        formData.append("document_image", profile.document_image);
      }

      if (chequeFile) {
        formData.append("cheque_image", chequeFile);
      } else if (profile.cheque_image) {
        formData.append("cheque_image", profile.cheque_image);
      }
     
     const res = await AxiosInstance.put(
  "/api/tech-merchant/updateMerchantInfo",
  formData,
  {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }
);

      setProfile(res?.data?.data || editForm);
      setEditForm(res?.data?.data || editForm);
      setIsEditing(false);

      setProfileImageFile(null);
      setDocumentFile(null);
      setChequeFile(null);
      setProfilePreview(null);
      setDocumentPreview(null);
      setChequePreview(null);

      toast.success(res?.data?.message || "Profile updated successfully");
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Error updating profile",
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // Stable image crop helpers
  // FileReader -> Data URL -> Canvas
  // Avoids blob URL / crossOrigin issues in some browsers.
  // =========================================================
  const readFileAsDataURL = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => resolve(reader.result);

      reader.onerror = () => {
        reject(new Error("Unable to read selected image."));
      };

      reader.readAsDataURL(file);
    });

  const createImage = (src) =>
    new Promise((resolve, reject) => {
      const image = new Image();

      image.onload = () => resolve(image);

      image.onerror = () => {
        reject(new Error("Selected image could not be loaded."));
      };

      image.src = src;
    });

  const getCroppedImg = async (
    imageSrc,
    pixelCrop,
    originalFileName = "profile-image",
  ) => {
    if (!imageSrc) {
      throw new Error("Image source is missing.");
    }

    if (
      !pixelCrop ||
      !Number.isFinite(pixelCrop.x) ||
      !Number.isFinite(pixelCrop.y) ||
      !Number.isFinite(pixelCrop.width) ||
      !Number.isFinite(pixelCrop.height) ||
      pixelCrop.width <= 0 ||
      pixelCrop.height <= 0
    ) {
      throw new Error("Invalid crop area.");
    }

    const image = await createImage(imageSrc);

    /*
     * IMPORTANT:
     * pixelCrop can contain negative x/y when the user zooms OUT and
     * keeps the complete image inside a square profile crop.
     *
     * Instead of clamping x/y and cutting the logo, we create a square
     * output canvas and draw only the intersecting portion of the image.
     * The remaining area becomes white padding.
     */
    const cropX = Math.round(pixelCrop.x);
    const cropY = Math.round(pixelCrop.y);
    const cropWidth = Math.max(1, Math.round(pixelCrop.width));
    const cropHeight = Math.max(1, Math.round(pixelCrop.height));

    const canvas = document.createElement("canvas");
    canvas.width = cropWidth;
    canvas.height = cropHeight;

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Canvas is not supported in this browser.");
    }

    // White background is ideal for logos and profile photos.
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, cropWidth, cropHeight);

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Intersection between requested crop and actual source image.
    const sourceX = Math.max(0, cropX);
    const sourceY = Math.max(0, cropY);

    const sourceRight = Math.min(
      image.naturalWidth,
      cropX + cropWidth,
    );

    const sourceBottom = Math.min(
      image.naturalHeight,
      cropY + cropHeight,
    );

    const sourceWidth = Math.max(0, sourceRight - sourceX);
    const sourceHeight = Math.max(0, sourceBottom - sourceY);

    if (sourceWidth <= 0 || sourceHeight <= 0) {
      throw new Error("The image is outside the crop area.");
    }

    // If crop starts outside the source image, shift drawing position.
    const destinationX = Math.max(0, -cropX);
    const destinationY = Math.max(0, -cropY);

    ctx.drawImage(
      image,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      destinationX,
      destinationY,
      sourceWidth,
      sourceHeight,
    );

    const blob = await new Promise((resolve, reject) => {
      canvas.toBlob(
        (result) => {
          if (!result) {
            reject(new Error("Could not create cropped image."));
            return;
          }

          resolve(result);
        },
        "image/jpeg",
        0.92,
      );
    });

    const baseName =
      originalFileName
        ?.replace(/\.[^/.]+$/, "")
        ?.replace(/[^a-zA-Z0-9-_]/g, "-") || "profile-image";

    return new File([blob], `${baseName}-cropped.jpg`, {
      type: "image/jpeg",
      lastModified: Date.now(),
    });
  };

  const CropModal = ({
    imageSrc,
    fileName,
    onClose,
    onCropDone,
    aspect = 1,
  }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(0.75);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [cropLoading, setCropLoading] = useState(false);
    const [cropError, setCropError] = useState("");

    const onCropComplete = useCallback((_, croppedPixels) => {
      setCroppedAreaPixels(croppedPixels);
      setCropError("");
    }, []);

    const handleCropSave = async () => {
      if (!croppedAreaPixels) {
        setCropError("Please wait for the image to finish loading.");
        return;
      }

      setCropLoading(true);
      setCropError("");

      try {
        const croppedFile = await getCroppedImg(
          imageSrc,
          croppedAreaPixels,
          fileName,
        );

        if (!(croppedFile instanceof File) || croppedFile.size === 0) {
          throw new Error("Cropped image is empty.");
        }

        await onCropDone(croppedFile);
      } catch (err) {
        console.error("Crop error:", err);

        const message =
          err?.message || "Could not crop image. Please choose another image.";

        setCropError(message);
        toast.error(message);
      } finally {
        setCropLoading(false);
      }
    };

    return (
      <div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        onClick={(e) => {
          if (e.target === e.currentTarget && !cropLoading) {
            onClose();
          }
        }}
      >
        <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-neutral-700 dark:bg-neutral-900">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-neutral-800">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Crop image
              </h3>

              <p className="mt-0.5 text-xs text-gray-500 dark:text-neutral-500">
                Zoom out to fit the complete image inside the profile frame.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={cropLoading}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="p-5">
            <div className="relative h-72 w-full overflow-hidden rounded-sm bg-neutral-950">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                minZoom={0.1}
                maxZoom={3}
                aspect={aspect}
                cropShape="rect"
                showGrid={true}
                objectFit="contain"
                restrictPosition={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-xs font-medium text-gray-500 dark:text-neutral-400">
                  Zoom
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setZoom(0.5);
                      setCrop({ x: 0, y: 0 });
                    }}
                    className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-[#0446DB] transition hover:bg-blue-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-blue-400 dark:hover:bg-neutral-700"
                  >
                    Fit Image
                  </button>

                  <span className="min-w-[38px] text-right text-xs text-gray-400">
                    {zoom.toFixed(2)}x
                  </span>
                </div>
              </div>

              <input
                type="range"
                min={0.1}
                max={3}
                step={0.05}
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full accent-[#0446DB]"
              />
            </div>

            {cropError && (
              <div className="mt-4 rounded-sm border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
                {cropError}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 border-t border-gray-100 bg-gray-50 px-5 py-4 dark:border-neutral-800 dark:bg-neutral-950">
            <button
              type="button"
              onClick={onClose}
              disabled={cropLoading}
              className="rounded-sm border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleCropSave}
              disabled={cropLoading || !croppedAreaPixels}
              className="inline-flex min-w-[120px] items-center justify-center rounded-sm bg-[#0446DB] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {cropLoading ? "Cropping..." : "Crop & Save"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const UploadWithCrop = ({
    label,
    accept = "image/*,.pdf",
    type = "profile",
  }) => {
    const [rawFile, setRawFile] = useState(null);
    const [cropSource, setCropSource] = useState("");
    const [showCrop, setShowCrop] = useState(false);
    const [fileLoading, setFileLoading] = useState(false);

    const setSelectedFile = (file, previewUrl = "") => {
      if (type === "profile") {
        setProfileImageFile(file);
        setProfilePreview(previewUrl);

        setEditForm((prev) => ({
          ...prev,
          profile_image: previewUrl,
        }));
      } else if (type === "document") {
        setDocumentFile(file);
        setDocumentPreview(previewUrl);

        setEditForm((prev) => ({
          ...prev,
          document_image: previewUrl || file,
        }));
      } else if (type === "cheque") {
        setChequeFile(file);
        setChequePreview(previewUrl);

        setEditForm((prev) => ({
          ...prev,
          cheque_image: previewUrl || file,
        }));
      }
    };

    const handleSelect = async (e) => {
      const file = e?.target?.files?.[0];

      // Allow selecting the same file again later.
      e.target.value = "";

      if (!file) return;

      const maxSize = 10 * 1024 * 1024;

      if (file.size > maxSize) {
        toast.error("File size must be less than 10 MB.");
        return;
      }

      const isImage = file.type.startsWith("image/");
      const isPdf = file.type === "application/pdf";

      if (!isImage && !isPdf) {
        toast.error("Please select a JPG, JPEG, PNG, WEBP or PDF file.");
        return;
      }

      /*
       * IMPORTANT:
       * Crop ONLY profile photo.
       * Documents / Cheque / KYC files are attached directly.
       */
      if (type !== "profile") {
        try {
          if (isImage) {
            const previewUrl = await readFileAsDataURL(file);
            setSelectedFile(file, previewUrl);
          } else {
            setSelectedFile(file, "");
          }

          toast.success(`${label} selected`);
        } catch (err) {
          console.error("File preview error:", err);

          // Even if preview fails, keep the actual file.
          setSelectedFile(file, "");

          toast.success(`${label} selected`);
        }

        return;
      }

      // Profile photo must be an image because only profile uses crop.
      if (!isImage) {
        toast.error("Profile photo must be an image.");
        return;
      }

      setFileLoading(true);

      try {
        const dataUrl = await readFileAsDataURL(file);

        // Validate browser can decode the image before opening cropper.
        await createImage(dataUrl);

        setRawFile(file);
        setCropSource(dataUrl);
        setShowCrop(true);
      } catch (err) {
        console.error("Profile image load error:", err);

        toast.error(
          err?.message ||
            "This image format is not supported. Please use JPG, PNG or WEBP.",
        );
      } finally {
        setFileLoading(false);
      }
    };

    const closeCrop = () => {
      setShowCrop(false);
      setRawFile(null);
      setCropSource("");
    };

    const handleCropDone = async (croppedFile) => {
      try {
        const previewUrl = await readFileAsDataURL(croppedFile);

        setSelectedFile(croppedFile, previewUrl);

        closeCrop();

        toast.success("Profile photo updated");
      } catch (err) {
        console.error("Cropped preview error:", err);
        throw new Error("Crop succeeded but preview could not be created.");
      }
    };

    const previewSrc =
      type === "profile"
        ? profilePreview ||
          (profile.profile_image
            ? `${baseURL}/${profile.profile_image}`
            : null)
        : type === "document"
          ? documentPreview ||
            (profile.document_image
              ? `${baseURL}/${profile.document_image}`
              : null)
          : chequePreview ||
            (profile.cheque_image
              ? `${baseURL}/${profile.cheque_image}`
              : null);

    const selectedFile =
      type === "profile"
        ? profileImageFile
        : type === "document"
          ? documentFile
          : chequeFile;

    const isSelectedPdf = selectedFile?.type === "application/pdf";

    return (
      <div className="space-y-3">
        <label className={labelClass}>{label}</label>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[minmax(0,1fr)_130px]">
          <label
            className={`group ${
              fileLoading ? "cursor-wait opacity-70" : "cursor-pointer"
            }`}
          >
            <input
              type="file"
              accept={accept}
              onChange={handleSelect}
              disabled={fileLoading}
              className="hidden"
            />

            <div className="flex min-h-[130px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/70 p-5 text-center transition group-hover:border-[#0446DB] group-hover:bg-blue-50/50 dark:border-neutral-700 dark:bg-neutral-950 dark:group-hover:border-blue-500 dark:group-hover:bg-blue-500/5">
              <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-white text-gray-400 shadow-sm group-hover:text-[#0446DB] dark:bg-neutral-800 dark:text-neutral-500 dark:group-hover:text-blue-400">
                <PhotoIcon className="h-5 w-5" />
              </div>

              <p className="mt-3 text-sm font-semibold text-gray-700 dark:text-neutral-300">
                {fileLoading ? "Reading image..." : `Upload ${label}`}
              </p>

              <p className="mt-1 text-xs text-gray-400 dark:text-neutral-500">
                {type === "profile"
                  ? "JPG, PNG or WEBP up to 10 MB • Crop enabled"
                  : "JPG, PNG, WEBP or PDF up to 10 MB"}
              </p>
            </div>
          </label>

          {isSelectedPdf ? (
            <div className="flex min-h-[130px] flex-col items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 p-3 text-center dark:border-neutral-700 dark:bg-neutral-950">
              <DocumentTextIcon className="h-8 w-8 text-red-500" />

              <p className="mt-2 max-w-full truncate text-xs font-semibold text-gray-700 dark:text-neutral-300">
                {selectedFile.name}
              </p>

              <p className="mt-1 text-[11px] text-gray-400">PDF selected</p>
            </div>
          ) : previewSrc ? (
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 p-2 dark:border-neutral-700 dark:bg-neutral-950">
              <img
                src={previewSrc}
                alt={label}
                className="h-full min-h-[110px] w-full rounded-sm object-cover"
              />
            </div>
          ) : (
            <div className="flex min-h-[130px] items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 px-3 text-center text-xs text-gray-400 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-500">
              No preview
            </div>
          )}
        </div>

        {/* Cropper is rendered ONLY for profile photo */}
        {type === "profile" && showCrop && rawFile && cropSource && (
          <CropModal
            imageSrc={cropSource}
            fileName={rawFile.name}
            onClose={closeCrop}
            onCropDone={handleCropDone}
            aspect={1}
          />
        )}
      </div>
    );
  };

  const formatDate = (dateString) =>
    dateString
      ? new Date(dateString).toLocaleDateString("en-IN", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : "N/A";

  const StatCard = ({
    icon: Icon,
    label,
    value,
    subtitle,
    validity,
    tone = "blue",
  }) => {
    const styles = {
      blue: {
        box: "bg-blue-50 dark:bg-blue-500/10",
        icon: "text-blue-600 dark:text-blue-400",
      },
      green: {
        box: "bg-emerald-50 dark:bg-emerald-500/10",
        icon: "text-emerald-600 dark:text-emerald-400",
      },
      purple: {
        box: "bg-violet-50 dark:bg-violet-500/10",
        icon: "text-violet-600 dark:text-violet-400",
      },
      orange: {
        box: "bg-orange-50 dark:bg-orange-500/10",
        icon: "text-orange-600 dark:text-orange-400",
      },
    };

    const selected = styles[tone] || styles.blue;

    return (
      <div className="group relative overflow-hidden rounded-sm border border-gray-200/80 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-[0.08em] text-gray-500 dark:text-neutral-500">
              {label}
            </p>

            <p className="mt-2 truncate text-xl font-bold tracking-tight text-gray-900 sm:text-2xl dark:text-white">
              {value}
            </p>

            {validity && (
              <p className="mt-1 text-xs text-gray-500 dark:text-neutral-400">
                Valid until {validity}
              </p>
            )}

            {subtitle && (
              <p className="mt-1 text-xs text-gray-500 dark:text-neutral-400">
                {subtitle}
              </p>
            )}
          </div>

          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-sm ${selected.box}`}
          >
            <Icon className={`h-5 w-5 ${selected.icon}`} />
          </div>
        </div>
      </div>
    );
  };

  const tabs = [
    {
      id: "personal",
      label: "Personal Info",
      description: "Profile and contact information",
      icon: UserIcon,
    },
    {
      id: "company",
      label: "Company",
      description: "Business details and GST",
      icon: BuildingOfficeIcon,
    },
    {
      id: "documents",
      label: "Company KYC",
      description: "Verification and documents",
      icon: DocumentTextIcon,
    },
    {
      id: "bank",
      label: "Bank Details",
      description: "Settlement bank account",
      icon: BanknotesIcon,
    },
  ];

  const OTPModal = ({
    isOpen,
    onClose,
    onVerify,
    onResend,
    phoneNumber,
    loading = false,
  }) => {
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [timeLeft, setTimeLeft] = useState(180);
    const [isResendDisabled, setIsResendDisabled] = useState(false);
    const otpRefs = useRef([]);

    useEffect(() => {
      if (!isOpen) return undefined;

      setOtp(["", "", "", ""]);
      setTimeLeft(180);
      setIsResendDisabled(false);

      const focusTimer = setTimeout(() => {
        otpRefs.current[0]?.focus();
      }, 100);

      return () => clearTimeout(focusTimer);
    }, [isOpen]);

    useEffect(() => {
      if (!isOpen || timeLeft <= 0) return undefined;

      const timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }, [timeLeft, isOpen]);

    if (!isOpen) return null;

    const formatTime = (seconds) => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;

      return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    };

    const handleInputChange = (index, value) => {
      const numericValue = value.replace(/\D/g, "");

      if (numericValue.length > 1) return;

      const nextOtp = [...otp];
      nextOtp[index] = numericValue;
      setOtp(nextOtp);

      if (numericValue && index < 3) {
        otpRefs.current[index + 1]?.focus();
      }
    };

    const handleKeyDown = (index, e) => {
      if (e.key === "Backspace" && !otp[index] && index > 0) {
        otpRefs.current[index - 1]?.focus();
      }
    };

    const handlePaste = (e) => {
      e.preventDefault();

      const pasted = e.clipboardData
        .getData("text")
        .replace(/\D/g, "")
        .slice(0, 4);

      if (pasted.length === 4) {
        setOtp(pasted.split(""));
        otpRefs.current[3]?.focus();
      }
    };

    const handleVerify = () => {
      const code = otp.join("");

      if (code.length === 4) {
        onVerify(code);
      }
    };

    const resend = async () => {
      if (timeLeft > 0 || isResendDisabled) return;

      setIsResendDisabled(true);

      try {
        await onResend?.();
        setTimeLeft(180);
      } finally {
        setTimeout(() => {
          setIsResendDisabled(false);
        }, 30000);
      }
    };

    return (
      <div
        className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <div className="w-full max-w-md overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl dark:border-neutral-700 dark:bg-neutral-900">
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5 dark:border-neutral-800">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Verify phone number
              </h2>

              <p className="mt-0.5 text-xs text-gray-500 dark:text-neutral-500">
                Secure your account with OTP verification.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-sm text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-neutral-800 dark:hover:text-white"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6">
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400">
                <LockClosedIcon className="h-8 w-8" />
              </div>

              <h3 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">
                Enter verification code
              </h3>

              <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                We sent a 4-digit OTP to
              </p>

              <p className="mt-1 font-semibold text-[#0446DB] dark:text-blue-400">
                +91 {phoneNumber}
              </p>
            </div>

            <div className="mt-6 flex justify-center gap-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(element) => {
                    otpRefs.current[index] = element;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  disabled={timeLeft <= 0 || loading}
                  onChange={(e) =>
                    handleInputChange(index, e.target.value)
                  }
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="h-14 w-14 rounded-sm border-2 border-gray-200 bg-white text-center text-xl font-bold text-[#0446DB] outline-none transition focus:border-[#0446DB] focus:ring-4 focus:ring-blue-500/10 disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-950 dark:text-blue-400"
                />
              ))}
            </div>

            <div className="mt-5 text-center">
              <span
                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                  timeLeft > 0
                    ? "bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400"
                    : "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                }`}
              >
                {timeLeft > 0
                  ? `Code expires in ${formatTime(timeLeft)}`
                  : "Code expired"}
              </span>
            </div>

            <button
              type="button"
              onClick={handleVerify}
              disabled={otp.join("").length !== 4 || loading || timeLeft <= 0}
              className="mt-6 flex w-full items-center justify-center rounded-sm bg-[#0446DB] px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              type="button"
              onClick={resend}
              disabled={isResendDisabled || loading || timeLeft > 0}
              className="mt-3 w-full rounded-sm border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
            >
              Resend Code
            </button>
          </div>
        </div>
      </div>
    );
  };

  const KYC = () => {
    const [kycCompanyType, setCompanyType] = useState("");
    const [kycProfile, setKycProfile] = useState({});
    const [kycEditForm, setKycEditForm] = useState({});
    const [kycEditing, setKycEditing] = useState(false);
    const [kycLoading, setKycLoading] = useState(false);

    const documentTypes = [
      "aadhar",
      "pan",
      "voterid",
      "passport",
      "driving_license",
    ];

    const companyTypes = [
      "partnership",
      "limited liability partnership",
      "private limited company",
      "public limited company",
    ];

    const getKycProfile = async () => {
      try {
        const res = await AxiosInstance.get(
          "/api/tech-merchant/getMerchantProfile",
        );

        const data = res?.data?.data || {};

        setKycProfile(data);
        setKycEditForm(data);
        setCompanyType(data?.company_type || "");
      } catch (err) {
        console.error("KYC profile error:", err);
        toast.error(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load KYC details",
        );
      }
    };

    useEffect(() => {
      getKycProfile();
    }, []);

    const isKycVerified =
      kycProfile?.kyc_verified === "1" ||
      kycProfile?.kyc_verified === 1 ||
      kycProfile?.kyc_verified === true;

    const hasKycValue = (value) => {
      if (value === undefined || value === null) return false;
      if (value instanceof File) return true;
      return String(value).trim() !== "";
    };

    const prettyKycValue = (value) => {
      if (!hasKycValue(value)) return "";

      return String(value)
        .replaceAll("_", " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
    };

    const getKycFileUrl = (file) => {
      if (!file || file instanceof File) return null;

      const value = String(file);

      if (
        value.startsWith("http://") ||
        value.startsWith("https://")
      ) {
        return value;
      }

      return `${baseURL}/${value.replace(/^\/+/, "")}`;
    };

    const hasSubmittedKyc =
      hasKycValue(kycProfile?.company_type) ||
      hasKycValue(kycProfile?.document_type) ||
      hasKycValue(kycProfile?.document_id) ||
      hasKycValue(kycProfile?.document_image) ||
      hasKycValue(kycProfile?.company_pancard_name) ||
      hasKycValue(kycProfile?.company_pancard_image) ||
      hasKycValue(kycProfile?.supporting_document_type) ||
      hasKycValue(kycProfile?.supporting_document_id) ||
      hasKycValue(kycProfile?.supporting_document_image);

    const handleKycEdit = () => {
      if (isKycVerified) {
        toast.error("Verified KYC details cannot be modified.");
        return;
      }

      setKycEditForm({ ...kycProfile });
      setCompanyType(kycProfile?.company_type || "");
      setKycEditing(true);
    };

    const handleKycCancel = () => {
      setKycEditing(false);
      setKycEditForm({ ...kycProfile });
      setCompanyType(kycProfile?.company_type || "");
    };

    const handleKycChange = (e) => {
      if (isKycVerified) return;

      const { name, value } = e.target;

      setKycEditForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    };

    const handleCompanyTypeChange = (e) => {
      if (isKycVerified) return;

      const value = e.target.value;

      setCompanyType(value);

      setKycEditForm((prev) => {
        const next = {
          ...prev,
          company_type: value,
        };

        if (value === "sole Proprietorship") {
          next.company_pancard_name = "";
          next.company_pancard_image = "";
          next.supporting_document_type = "";
          next.supporting_document_id = "";
          next.supporting_document_image = "";
        } else if (companyTypes.includes(value)) {
          next.document_type = "";
          next.document_id = "";
          next.document_image = "";
        }

        return next;
      });
    };

    const handleKycFileChange = (e) => {
      if (isKycVerified) return;

      const { name, files } = e.target;
      const file = files?.[0];

      if (!file) return;

      const maxSize = 10 * 1024 * 1024;

      if (file.size > maxSize) {
        toast.error("File size must be less than 10 MB.");
        e.target.value = "";
        return;
      }

      const isImage = file.type.startsWith("image/");
      const isPdf = file.type === "application/pdf";

      if (!isImage && !isPdf) {
        toast.error("Please select PNG, JPG, WEBP or PDF.");
        e.target.value = "";
        return;
      }

      setKycEditForm((prev) => ({
        ...prev,
        [name]: file,
      }));
    };

    const handleKycSave = async () => {
      if (isKycVerified) {
        toast.error("Verified KYC details cannot be modified.");
        return;
      }

      if (!kycCompanyType) {
        toast.error("Please select company type.");
        return;
      }

      if (kycCompanyType === "sole Proprietorship") {
        if (!hasKycValue(kycEditForm?.document_type)) {
          toast.error("Please select document type.");
          return;
        }

        if (!hasKycValue(kycEditForm?.document_id)) {
          toast.error("Please enter document ID.");
          return;
        }

        if (
          !hasKycValue(kycEditForm?.document_image) &&
          !hasKycValue(kycProfile?.document_image)
        ) {
          toast.error("Please upload document.");
          return;
        }
      }

      if (companyTypes.includes(kycCompanyType)) {
        if (!hasKycValue(kycEditForm?.company_pancard_name)) {
          toast.error("Please enter company PAN card name.");
          return;
        }

        if (
          !hasKycValue(kycEditForm?.company_pancard_image) &&
          !hasKycValue(kycProfile?.company_pancard_image)
        ) {
          toast.error("Please upload company PAN card.");
          return;
        }

        if (!hasKycValue(kycEditForm?.supporting_document_type)) {
          toast.error("Please select supporting document type.");
          return;
        }

        if (!hasKycValue(kycEditForm?.supporting_document_id)) {
          toast.error("Please enter supporting document ID.");
          return;
        }

        if (
          !hasKycValue(kycEditForm?.supporting_document_image) &&
          !hasKycValue(kycProfile?.supporting_document_image)
        ) {
          toast.error("Please upload supporting document.");
          return;
        }
      }

      setKycLoading(true);

      try {
        const formData = new FormData();

        formData.append("company_type", kycCompanyType);

        if (kycCompanyType === "sole Proprietorship") {
          formData.append(
            "document_type",
            kycEditForm?.document_type || "",
          );
          formData.append(
            "document_id",
            kycEditForm?.document_id || "",
          );

          if (kycEditForm?.document_image instanceof File) {
            formData.append(
              "document_image",
              kycEditForm.document_image,
            );
          } else if (kycProfile?.document_image) {
            formData.append(
              "document_image",
              kycProfile.document_image,
            );
          }
        }

        if (companyTypes.includes(kycCompanyType)) {
          formData.append(
            "company_pancard_name",
            kycEditForm?.company_pancard_name || "",
          );
          formData.append(
            "supporting_document_type",
            kycEditForm?.supporting_document_type || "",
          );
          formData.append(
            "supporting_document_id",
            kycEditForm?.supporting_document_id || "",
          );

          if (
            kycEditForm?.company_pancard_image instanceof File
          ) {
            formData.append(
              "company_pancard_image",
              kycEditForm.company_pancard_image,
            );
          } else if (kycProfile?.company_pancard_image) {
            formData.append(
              "company_pancard_image",
              kycProfile.company_pancard_image,
            );
          }

          if (
            kycEditForm?.supporting_document_image instanceof File
          ) {
            formData.append(
              "supporting_document_image",
              kycEditForm.supporting_document_image,
            );
          } else if (kycProfile?.supporting_document_image) {
            formData.append(
              "supporting_document_image",
              kycProfile.supporting_document_image,
            );
          }
        }

        const res = await AxiosInstance.put(
          "/api/tech-merchant/updateMerchantInfo",
          formData,
        );

        toast.success(
          res?.data?.message || "KYC updated successfully",
        );

        setKycEditing(false);

        await getKycProfile();
        await getMerchantProfile();
      } catch (err) {
        console.error("KYC save error:", err);

        toast.error(
          err?.response?.data?.message ||
            err?.message ||
            "Error updating KYC",
        );
      } finally {
        setKycLoading(false);
      }
    };

    const KycDetail = ({ label, value }) => {
      if (!hasKycValue(value)) return null;

      return (
        <div className="rounded-sm border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-950">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-neutral-500">
            {label}
          </p>

          <p className="mt-1.5 break-words text-sm font-semibold text-gray-800 dark:text-neutral-200">
            {prettyKycValue(value)}
          </p>
        </div>
      );
    };

    const KycDocument = ({ label, file }) => {
      if (!hasKycValue(file)) return null;

      const url = getKycFileUrl(file);

      return (
        <div className="rounded-sm border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-950">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-blue-50 text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400">
                <DocumentTextIcon className="h-5 w-5" />
              </span>

              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-neutral-500">
                  {label}
                </p>
                <p className="mt-1 truncate text-sm font-semibold text-gray-800 dark:text-neutral-200">
                  Uploaded document
                </p>
              </div>
            </div>

            {url && (
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-sm border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-[#0446DB] transition hover:bg-blue-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-blue-400 dark:hover:bg-neutral-800"
              >
                View Document
                <ArrowTopRightOnSquareIcon className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      );
    };

    const renderFileInput = (name, label) => {
      const selectedFile =
        kycEditForm?.[name] instanceof File
          ? kycEditForm[name]
          : null;

      const existingFile = selectedFile
        ? null
        : kycProfile?.[name] || kycEditForm?.[name];

      const existingUrl = getKycFileUrl(existingFile);

      return (
        <div>
          <label className={labelClass}>
            {label}
            <span className="ml-1 text-red-500">*</span>
          </label>

          {existingFile && !selectedFile && (
            <div className="mb-3 flex flex-col gap-3 rounded-sm border border-emerald-200 bg-emerald-50 p-3 sm:flex-row sm:items-center sm:justify-between dark:border-emerald-500/20 dark:bg-emerald-500/5">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-white text-emerald-600 shadow-sm dark:bg-neutral-900 dark:text-emerald-400">
                  <DocumentTextIcon className="h-5 w-5" />
                </span>

                <div className="min-w-0">
                  <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    Current document
                  </p>
                  <p className="truncate text-sm font-semibold text-gray-800 dark:text-neutral-200">
                    Already uploaded
                  </p>
                </div>
              </div>

              {existingUrl && (
                <a
                  href={existingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-sm border border-emerald-200 bg-white px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 dark:border-emerald-500/20 dark:bg-neutral-900 dark:text-emerald-400"
                >
                  View Document
                  <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                </a>
              )}
            </div>
          )}

          {selectedFile && (
            <div className="mb-3 rounded-sm border border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-500/20 dark:bg-blue-500/5">
              <p className="text-xs font-medium text-blue-500">
                New document selected
              </p>
              <p className="mt-1 truncate text-sm font-semibold text-gray-800 dark:text-neutral-200">
                {selectedFile.name}
              </p>
            </div>
          )}

          <label className="flex min-h-[112px] cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-4 text-center transition hover:border-[#0446DB] hover:bg-blue-50/50 dark:border-neutral-700 dark:bg-neutral-950 dark:hover:border-blue-500">
            <input
              type="file"
              name={name}
              onChange={handleKycFileChange}
              accept="image/*,.pdf"
              className="hidden"
            />

            <div>
              <PhotoIcon className="mx-auto h-6 w-6 text-gray-400 dark:text-neutral-500" />

              <p className="mt-2 text-sm font-semibold text-gray-700 dark:text-neutral-300">
                {selectedFile
                  ? "Choose another document"
                  : existingFile
                    ? "Replace document"
                    : "Choose document"}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                PNG, JPG, WEBP or PDF • Max 10 MB
              </p>
            </div>
          </label>
        </div>
      );
    };

    const renderKYCForm = () => {
      if (kycCompanyType === "sole Proprietorship") {
        return (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className={labelClass}>
                Document Type
                <span className="ml-1 text-red-500">*</span>
              </label>

              <select
                name="document_type"
                value={kycEditForm?.document_type || ""}
                onChange={handleKycChange}
                className={inputClass}
              >
                <option value="">Select Document Type</option>

                {documentTypes.map((type) => (
                  <option key={type} value={type}>
                    {prettyKycValue(type)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelClass}>
                Document ID
                <span className="ml-1 text-red-500">*</span>
              </label>

              <input
                type="text"
                name="document_id"
                value={kycEditForm?.document_id || ""}
                onChange={handleKycChange}
                placeholder="Enter document ID"
                className={inputClass}
              />
            </div>

            <div className="md:col-span-2">
              {renderFileInput(
                "document_image",
                "Upload Document",
              )}
            </div>
          </div>
        );
      }

      if (companyTypes.includes(kycCompanyType)) {
        return (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className={labelClass}>
                Company PAN Card Name
                <span className="ml-1 text-red-500">*</span>
              </label>

              <input
                type="text"
                name="company_pancard_name"
                value={
                  kycEditForm?.company_pancard_name || ""
                }
                onChange={handleKycChange}
                placeholder="Enter name as on PAN card"
                className={inputClass}
              />
            </div>

            <div className="md:col-span-2">
              {renderFileInput(
                "company_pancard_image",
                "Upload PAN Card",
              )}
            </div>

            <div>
              <label className={labelClass}>
                Supporting Document Type
                <span className="ml-1 text-red-500">*</span>
              </label>

              <select
                name="supporting_document_type"
                value={
                  kycEditForm?.supporting_document_type || ""
                }
                onChange={handleKycChange}
                className={inputClass}
              >
                <option value="">Select Document Type</option>
                <option value="bank_account_statement">
                  Bank Account Statement
                </option>
                <option value="electricity_bill">
                  Electricity Bill
                </option>
                <option value="lease_rent_agreement">
                  Lease / Rent Agreement
                </option>
                <option value="telephone_bill">
                  Telephone Bill
                </option>
              </select>
            </div>

            <div>
              <label className={labelClass}>
                Supporting Document ID
                <span className="ml-1 text-red-500">*</span>
              </label>

              <input
                type="text"
                name="supporting_document_id"
                value={
                  kycEditForm?.supporting_document_id || ""
                }
                onChange={handleKycChange}
                placeholder="Enter document ID"
                className={inputClass}
              />
            </div>

            <div className="md:col-span-2">
              {renderFileInput(
                "supporting_document_image",
                "Upload Supporting Document",
              )}
            </div>
          </div>
        );
      }

      return (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-6 py-12 text-center dark:border-neutral-700 dark:bg-neutral-950">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-gray-400 shadow-sm dark:bg-neutral-800 dark:text-neutral-500">
            <DocumentTextIcon className="h-7 w-7" />
          </div>

          <p className="mt-4 font-semibold text-gray-700 dark:text-neutral-300">
            Select your company type
          </p>

          <p className="mt-1 text-sm text-gray-500 dark:text-neutral-500">
            KYC requirements will appear here.
          </p>
        </div>
      );
    };

    const SubmittedKycDetails = () => {
      const hasDocuments =
        hasKycValue(kycProfile?.document_image) ||
        hasKycValue(kycProfile?.company_pancard_image) ||
        hasKycValue(kycProfile?.supporting_document_image);

      return (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-sm bg-blue-50 text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400">
              <IdentificationIcon className="h-5 w-5" />
            </span>

            <div>
              <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                Submitted KYC Details
              </h4>

              <p className="text-xs text-gray-500 dark:text-neutral-500">
                Only information submitted for Company KYC is shown.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <KycDetail
              label="Company Type"
              value={kycProfile?.company_type}
            />

            <KycDetail
              label="Document Type"
              value={kycProfile?.document_type}
            />

            <KycDetail
              label="Document ID"
              value={kycProfile?.document_id}
            />

            <KycDetail
              label="Company PAN Card Name"
              value={kycProfile?.company_pancard_name}
            />

            <KycDetail
              label="Supporting Document Type"
              value={kycProfile?.supporting_document_type}
            />

            <KycDetail
              label="Supporting Document ID"
              value={kycProfile?.supporting_document_id}
            />
          </div>

          {hasDocuments && (
            <div className="mt-5 border-t border-gray-100 pt-5 dark:border-neutral-800">
              <h5 className="mb-3 text-xs font-bold uppercase tracking-wide text-gray-500 dark:text-neutral-400">
                Submitted Documents
              </h5>

              <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
                <KycDocument
                  label="Identity Document"
                  file={kycProfile?.document_image}
                />

                <KycDocument
                  label="Company PAN Card"
                  file={kycProfile?.company_pancard_image}
                />

                <KycDocument
                  label="Supporting Document"
                  file={kycProfile?.supporting_document_image}
                />
              </div>
            </div>
          )}
        </div>
      );
    };

    if (isKycVerified) {
      return (
        <div className="space-y-5">
          <div className="flex flex-col gap-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 sm:flex-row sm:items-center sm:justify-between dark:border-emerald-500/20 dark:bg-emerald-500/5">
            <div className="flex items-start gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm bg-emerald-500 text-white">
                <CheckBadgeIcon className="h-6 w-6" />
              </span>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold text-emerald-900 dark:text-emerald-300">
                    KYC Verified
                  </h3>

                  <span className="rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                    Verified
                  </span>
                </div>

                <p className="mt-1 text-sm text-emerald-700 dark:text-emerald-400">
                  Your Company KYC has been verified.
                </p>
              </div>
            </div>

            <span className="inline-flex w-fit items-center gap-2 rounded-sm border border-emerald-200 bg-white px-3 py-2 text-xs font-semibold text-emerald-700 dark:border-emerald-500/20 dark:bg-neutral-900 dark:text-emerald-400">
              <LockClosedIcon className="h-4 w-4" />
              Read Only
            </span>
          </div>

          {hasSubmittedKyc ? (
            <SubmittedKycDetails />
          ) : (
            <div className="rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center dark:border-neutral-800 dark:bg-neutral-900">
              <DocumentTextIcon className="mx-auto h-8 w-8 text-gray-400" />
              <p className="mt-3 font-semibold text-gray-700 dark:text-neutral-300">
                No KYC details available
              </p>
            </div>
          )}

          <div className="flex items-start gap-3 rounded-sm border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-950">
            <LockClosedIcon className="mt-0.5 h-5 w-5 shrink-0 text-gray-400" />

            <div>
              <p className="text-sm font-semibold text-gray-700 dark:text-neutral-300">
                KYC information is locked
              </p>

              <p className="mt-1 text-xs text-gray-500 dark:text-neutral-500">
                These details cannot be changed after KYC verification.
              </p>
            </div>
          </div>
        </div>
      );
    }

    if (!kycEditing) {
      return (
        <div className="space-y-5">
          <div className="flex flex-col gap-4 rounded-2xl border border-amber-200 bg-amber-50/70 p-5 sm:flex-row sm:items-center sm:justify-between dark:border-amber-500/20 dark:bg-amber-500/5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-white text-amber-600 shadow-sm dark:bg-neutral-900 dark:text-amber-400">
                <DocumentTextIcon className="h-5 w-5" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold text-gray-900 dark:text-white">
                    Company KYC
                  </h3>

                  {hasSubmittedKyc && (
                    <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-700 dark:bg-amber-500/10 dark:text-amber-400">
                      Verification Pending
                    </span>
                  )}
                </div>

                <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                  {hasSubmittedKyc
                    ? "Below are the KYC details you submitted. You can change them until KYC is verified."
                    : "No KYC details have been submitted yet."}
                </p>
              </div>
            </div>

            <Button
              type="button"
              onClick={handleKycEdit}
              className="shrink-0 rounded-sm bg-[#0446DB] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <PencilSquareIcon className="mr-2 h-4 w-4" />
              {hasSubmittedKyc ? "Edit KYC" : "Add KYC"}
            </Button>
          </div>

          {hasSubmittedKyc ? (
            <SubmittedKycDetails />
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-12 text-center dark:border-neutral-800 dark:bg-neutral-900">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-50 text-gray-400 dark:bg-neutral-950 dark:text-neutral-500">
                <DocumentTextIcon className="h-7 w-7" />
              </div>

              <h4 className="mt-4 font-bold text-gray-900 dark:text-white">
                No KYC details submitted
              </h4>

              <p className="mt-1 text-sm text-gray-500 dark:text-neutral-500">
                Click Add KYC to enter your verification information.
              </p>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-5">
        <div className="flex flex-col gap-4 rounded-2xl border border-blue-100 bg-blue-50/70 p-5 sm:flex-row sm:items-center sm:justify-between dark:border-blue-500/20 dark:bg-blue-500/5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-white text-[#0446DB] shadow-sm dark:bg-neutral-900 dark:text-blue-400">
              <PencilSquareIcon className="h-5 w-5" />
            </div>

            <div>
              <h3 className="font-bold text-gray-900 dark:text-white">
                {hasSubmittedKyc
                  ? "Edit KYC Details"
                  : "Add KYC Details"}
              </h3>

              <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                You can update these details until your KYC is verified.
              </p>
            </div>
          </div>

          <div className="flex shrink-0 gap-2">
            <Button
              type="button"
              onClick={handleKycCancel}
              disabled={kycLoading}
              className="rounded-sm border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={handleKycSave}
              disabled={kycLoading}
              className="rounded-sm bg-[#0446DB] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {kycLoading ? "Saving..." : "Save KYC"}
            </Button>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
          <label className={labelClass}>
            Type of Company
            <span className="ml-1 text-red-500">*</span>
          </label>

          <select
            value={kycCompanyType}
            onChange={handleCompanyTypeChange}
            className={inputClass}
          >
            <option value="">Select Company Type</option>
            <option value="sole Proprietorship">
              Sole Proprietorship
            </option>
            <option value="partnership">Partnership</option>
            <option value="limited liability partnership">
              Limited Liability Partnership
            </option>
            <option value="public limited company">
              Public Limited Company
            </option>
            <option value="private limited company">
              Private Limited Company
            </option>
          </select>

          {kycCompanyType && (
            <div className="mt-6 border-t border-gray-100 pt-6 dark:border-neutral-800">
              <h4 className="mb-5 text-sm font-bold text-gray-900 dark:text-white">
                {prettyKycValue(kycCompanyType)} KYC Requirements
              </h4>

              {renderKYCForm()}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    const currentData = isEditing ? editForm : profile;

    switch (activeTab) {
      case "personal":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div>
                <label className={labelClass}>
                  Full Name <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <UserIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-neutral-500" />

                  <input
                    type="text"
                    name="name"
                    value={currentData.name || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`${inputClass} pl-11`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  Email Address <span className="text-red-500">*</span>
                </label>

                <div className="relative">
                  <EnvelopeIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-neutral-500" />

                  <input
                    type="email"
                    name="email"
                    value={currentData.email || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`${inputClass} pl-11`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  Phone Number <span className="text-red-500">*</span>
                </label>

                {editTabPhone === "phone" && (
                  <div>
                    {editPhone ? (
                      <div className="space-y-3">
                        <div className="relative">
                          <PhoneIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />

                          <input
                            type="tel"
                            name="phone"
                            value={phone}
                            maxLength={10}
                            onChange={(e) =>
                              setPhone(
                                e.target.value.replace(/\D/g, ""),
                              )
                            }
                            placeholder="Enter new 10-digit number"
                            className={`${inputClass} pl-11`}
                            autoFocus
                          />
                        </div>

                        <div className="flex gap-2">
                          <Button
                            type="button"
                            onClick={sendOTP}
                            className="rounded-sm bg-[#0446DB] px-4  text-sm font-semibold text-white transition hover:bg-blue-700"
                          >
                            Send OTP
                          </Button>

                          <Button
                            type="button"
                            onClick={() => {
                              setEditPhone(false);
                              setPhone("");
                            }}
                            className="rounded-sm border border-gray-200 bg-white px-4  text-sm font-semibold text-gray-600 transition hover:bg-gray-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <PhoneIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400 dark:text-neutral-500" />

                        <input
                          type="tel"
                          value={currentData.phone || ""}
                          disabled
                          className={`${inputClass} pl-11 pr-12`}
                        />

                        {isEditing && (
                          <button
                            type="button"
                            onClick={() => setEditPhone(true)}
                            className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-[#0446DB] transition hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-500/10"
                          >
                            <PencilSquareIcon className="h-5 w-5" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <OTPModal
                  isOpen={showOTPModal}
                  onClose={() => setShowOTPModal(false)}
                  onVerify={verifyOTP}
                  onResend={handleResendOTP}
                  phoneNumber={phone}
                  loading={verificationLoading}
                />
              </div>

              <div>
                <label className={labelClass}>Account Type</label>

                <div className="flex min-h-[46px] items-center rounded-sm border border-gray-100 bg-gray-50 px-4 text-sm font-semibold text-gray-700 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-300">
                  {currentData.account_type || "N/A"}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-6 dark:border-neutral-800">
              {isEditing ? (
                <UploadWithCrop
                  label="Profile Photo"
                  accept="image/jpeg,image/png,image/webp"
                  type="profile"
                />
              ) : (
                <div>
                  <label className={labelClass}>Profile Photo</label>

                  <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-950">
                    {profilePreview || currentData.profile_image ? (
                      <img
                        src={
                          profilePreview ||
                          `${baseURL}/${currentData.profile_image}`
                        }
                        alt="Profile"
                        className="h-20 w-20 rounded-2xl object-cover shadow-sm"
                      />
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white text-gray-400 shadow-sm dark:bg-neutral-800 dark:text-neutral-500">
                        <UserIcon className="h-8 w-8" />
                      </div>
                    )}

                    <div>
                      <p className="font-semibold text-gray-800 dark:text-neutral-200">
                        Profile picture
                      </p>

                      <p className="mt-1 text-sm text-gray-500 dark:text-neutral-500">
                        Used across your merchant account.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case "company":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div><label className={labelClass}>Company Name</label><input type="text" name="company_name" value={currentData.company_name || ""} onChange={handleChange} disabled={!isEditing} placeholder="Enter company name" className={inputClass} /></div>
              <div><label className={labelClass}>GST Number</label><input type="text" name="company_gst_number" value={currentData.company_gst_number || ""} onChange={handleChange} disabled={!isEditing} placeholder="Enter GST number" className={inputClass} /></div>
              <div className="md:col-span-2"><label className={labelClass}>Company Address</label><textarea name="company_address" value={currentData.company_address || ""} onChange={handleChange} disabled={!isEditing} placeholder="Enter registered company address" rows={3} className={`${inputClass} resize-none`} /></div>
            </div>

            <div className="border-t border-gray-100 pt-6 dark:border-neutral-800">
              <div className="mb-5"><h4 className="text-sm font-bold text-gray-900 dark:text-white">Business Location</h4><p className="mt-1 text-xs text-gray-500 dark:text-neutral-500">Select country, state and city of your registered business.</p></div>
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div><label className={labelClass}>Country</label><div className="relative"><select value={selectedCountry?.isoCode || ""} onChange={handleCountryChange} disabled={!isEditing} className={`${inputClass} appearance-none pr-10`}><option value="">Select Country</option>{countries.map((country) => <option key={country.isoCode} value={country.isoCode}>{country.name}</option>)}</select><ChevronDownIcon className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /></div></div>
                <div><label className={labelClass}>State</label><div className="relative"><select value={selectedState?.isoCode || ""} onChange={handleStateChange} disabled={!isEditing || !selectedCountry} className={`${inputClass} appearance-none pr-10`}><option value="">{selectedCountry ? "Select State" : "Select Country First"}</option>{states.map((state) => <option key={`${selectedCountry?.isoCode}-${state.isoCode}`} value={state.isoCode}>{state.name}</option>)}</select><ChevronDownIcon className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /></div></div>
                <div><label className={labelClass}>City</label><div className="relative"><select name="company_city" value={currentData.company_city || ""} onChange={handleCityChange} disabled={!isEditing || !selectedCountry || !selectedState} className={`${inputClass} appearance-none pr-10`}><option value="">{!selectedCountry ? "Select Country First" : !selectedState ? "Select State First" : "Select City"}</option>{cities.map((city, index) => <option key={`${city.name}-${index}`} value={city.name}>{city.name}</option>)}</select><ChevronDownIcon className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /></div></div>
                <div><label className={labelClass}>Pincode</label><input type="text" name="company_pincode" value={currentData.company_pincode || ""} onChange={(e) => setEditForm((prev) => ({ ...prev, company_pincode: e.target.value.replace(/\D/g, "").slice(0, 10) }))} disabled={!isEditing} placeholder="Enter pincode" className={inputClass} /></div>
              </div>
              {selectedCountry && selectedState && currentData.company_city && <div className="mt-5 rounded-sm border border-blue-100 bg-blue-50/70 p-4 dark:border-blue-500/20 dark:bg-blue-500/5"><p className="text-xs font-medium text-gray-500 dark:text-neutral-400">Selected Location</p><p className="mt-1 text-sm font-semibold text-gray-900 dark:text-white">{currentData.company_city}, {selectedState.name}, {selectedCountry.name}</p></div>}
            </div>
          </div>
        );

      case "documents":
        return <KYC />;

      case "bank":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {[
                {
                  label: "Bank Name",
                  name: "bank_name",
                  placeholder: "Enter bank name",
                },
                {
                  label: "Account Number",
                  name: "bank_account_number",
                  placeholder: "Enter account number",
                },
                {
                  label: "IFSC Code",
                  name: "bank_ifsc_code",
                  placeholder: "Enter IFSC code",
                },
                {
                  label: "Branch",
                  name: "bank_branch",
                  placeholder: "Enter branch",
                },
              ].map((field) => (
                <div key={field.name}>
                  <label className={labelClass}>{field.label}</label>

                  <input
                    type="text"
                    name={field.name}
                    value={currentData[field.name] || ""}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder={field.placeholder}
                    className={inputClass}
                  />
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-6 dark:border-neutral-800">
              {isEditing ? (
                <UploadWithCrop
                  label="Cancelled Cheque"
                  accept="image/*,.pdf"
                  type="cheque"
                />
              ) : (
                <div>
                  <label className={labelClass}>Cancelled Cheque</label>

                  {chequePreview || currentData.cheque_image ? (
                    <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-4 sm:flex-row sm:items-center dark:border-neutral-800 dark:bg-neutral-950">
                      {
                        console.log(currentData)
                      }
                      <img
                        src={
                          chequePreview ||
                          `${baseURL}/${currentData.cheque_image}`
                        }
                        alt="Cheque"
                        className="h-24 w-32 rounded-sm border border-gray-200 object-cover dark:border-neutral-700"
                      />

                      <div>
                        <p className="font-semibold text-gray-800 dark:text-neutral-200">
                          Cancelled cheque uploaded
                        </p>

                        <p className="mt-1 text-sm text-gray-500 dark:text-neutral-500">
                          Used to verify settlement bank details.
                        </p>

                        {currentData.cheque_image && !chequePreview && (
                          <a
                            href={`${baseURL}/${currentData.cheque_image}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-[#0446DB] hover:underline dark:text-blue-400"
                          >
                            View full image
                            <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 p-8 text-center text-sm text-gray-500 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-500">
                      No cancelled cheque uploaded.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const currentTab = tabs.find((tab) => tab.id === activeTab);
  const CurrentTabIcon = currentTab?.icon || UserIcon;

  const profileImageSrc =
    profilePreview ||
    (profile?.profile_image
      ? `${baseURL}/${profile.profile_image}`
      : null);

  return (
    <div className="min-h-screen bg-[#f5f6f8]  dark:bg-neutral-950">
      {/* Hero */}
      <div className="relative overflow-hidden   py-2 px-5  dark:bg-neutral-950">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 h-64 w-64 rounded-full bg-blue-300/10 blur-3xl" />

        <div className="relative mx-auto ">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              

              <h1 className="mt-1 text-2xl font-bold tracking-tight dark:text-white sm:text-3xl">
                My Profile
              </h1>

              <p className="mt-1 max-w-xl text-sm dark:text-blue-100/90">
                Manage your personal information, company profile, KYC and
                settlement details.
              </p>
            </div>

            {!isEditing ? (
              <Button
                type="button"
                onClick={handleEdit}
                className="inline-flex w-fit items-center gap-2 rounded-sm border border-white/20 bg-[#0446DB]  py-2.5 text-sm font-semibold text-white shadow-lg shadow-black/10 transition-all "
              >
                <PencilSquareIcon className="h-5 w-5" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  onClick={handleSave}
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-sm bg-emerald-500  py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <CheckBadgeIcon className="h-5 w-5" />
                  {loading ? "Saving..." : "Save Changes"}
                </Button>

                <Button
                  type="button"
                  onClick={handleCancel}
                  className="inline-flex items-center gap-2 rounded-sm border border-white/20 bg-red-500  py-2.5 text-sm font-semibold text-white backdrop-blur transition"
                >
                  <XMarkIcon className="h-5 w-5" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="">
        {/* Identity card */}
        <div className="overflow-hidden rounded-2xl border border-gray-200/70 bg-white shadow-xl shadow-gray-200/50 dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none">
          <div className="flex flex-col gap-5 p-5 sm:p-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
              <div className="relative">
                <div className="h-24 w-24 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 p-1 shadow-md dark:from-blue-500/20 dark:to-violet-500/20">
                  {profileImageSrc ? (
                    <img
                      src={profileImageSrc}
                      alt="Profile"
                      className="h-full w-full rounded-[13px] object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-[13px] bg-gray-100 dark:bg-neutral-800">
                      <UserIcon className="h-10 w-10 text-gray-400 dark:text-neutral-500" />
                    </div>
                  )}
                </div>

                <span
                  className={`absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-[3px] border-white dark:border-neutral-900 ${
                    profile?.is_active ? "bg-emerald-500" : "bg-red-500"
                  }`}
                />
              </div>

              <div>
                <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {profile?.name || "Merchant"}
                  </h2>

                  {profile?.kyc_verified === 1 && (
                    <span
                      title="KYC Verified"
                      className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white"
                    >
                      <CheckBadgeIcon className="h-4 w-4" />
                    </span>
                  )}
                </div>

                <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
                  {profile?.email || "Email not available"}
                </p>

                <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                      profile?.is_active
                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                        : "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400"
                    }`}
                  >
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        profile?.is_active
                          ? "bg-emerald-500"
                          : "bg-red-500"
                      }`}
                    />

                    {profile?.is_active
                      ? "Active Account"
                      : "Inactive Account"}
                  </span>

                  <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400">
                    {profile?.account_type || "Merchant"}
                  </span>
                   
                  {profile?.kyc_verified === 1 ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 dark:bg-violet-500/10 dark:text-violet-400">
                      <ShieldCheckIcon className="h-3.5 w-3.5" />
                      KYC Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-500/10 dark:text-orange-400">
                      KYC Pending
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-7 gap-y-4 border-t border-gray-100 pt-5 sm:grid-cols-3 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0 dark:border-neutral-800">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-neutral-500">
                  Merchant ID
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-800 dark:text-neutral-200">
                  M_{profile?.id || "-"}
                </p>
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-neutral-500">
                  Phone
                </p>
                <p className="mt-1 text-sm font-semibold text-gray-800 dark:text-neutral-200">
                  {profile?.phone || "-"}
                </p>
              </div>

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-neutral-500">
                  Company
                </p>
                <p className="mt-1 max-w-[150px] truncate text-sm font-semibold text-gray-800 dark:text-neutral-200">
                  {profile?.company_name || "Not added"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={WalletIcon}
            label="Wallet Balance"
            value={`₹${parseFloat(
              profile?.wallet_balance || 0,
            ).toLocaleString("en-IN")}`}
            subtitle="Available balance"
            tone="green"
          />

          <StatCard
            icon={BanknotesIcon}
            label="Wallet Limit"
            value={`₹${parseFloat(
              profile?.wallet_limit || 0,
            ).toLocaleString("en-IN")}`}
            subtitle="Maximum wallet limit"
            tone="blue"
          />

          <StatCard
            icon={CalendarIcon}
            label="Subscription"
            value={profile?.subscription_plan || "N/A"}
            validity={formatDate(profile?.subscription_validity)}
            tone="purple"
          />

          <StatCard
            icon={ClipboardDocumentListIcon}
            label="Merchant ID"
            value={`M_${profile?.id || "-"}`}
            subtitle="Merchant identifier"
            tone="orange"
          />
        </div>

        {/* Main body */}
        <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-[270px_minmax(0,1fr)]">
          {/* Desktop nav */}
          <aside className="hidden lg:block">
            <div className="sticky top-5 overflow-hidden rounded-sm border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <div className="border-b border-gray-100 px-5 py-4 dark:border-neutral-800">
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-400 dark:text-neutral-500">
                  Account Settings
                </p>
              </div>

              <nav className="space-y-1 p-3">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`group flex w-full items-center gap-3 rounded-sm px-3.5 py-3 text-left transition-all ${
                        isActive
                          ? "bg-[#0446DB] text-white shadow-md shadow-blue-500/20"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
                      }`}
                    >
                      <span
                        className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                          isActive
                            ? "bg-white/15"
                            : "bg-gray-100 group-hover:bg-white dark:bg-neutral-800 dark:group-hover:bg-neutral-700"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold">
                          {tab.label}
                        </span>
                        <span
                          className={`mt-0.5 block truncate text-[11px] ${
                            isActive
                              ? "text-blue-100"
                              : "text-gray-400 dark:text-neutral-500"
                          }`}
                        >
                          {tab.description}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </nav>

              <div className="m-3 mt-5 rounded-sm border border-blue-100 bg-blue-50/70 p-4 dark:border-blue-500/20 dark:bg-blue-500/5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400">
                  <ShieldCheckIcon className="h-5 w-5" />
                </div>

                <p className="mt-3 text-sm font-semibold text-gray-800 dark:text-neutral-200">
                  Account Security
                </p>

                <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-neutral-500">
                  Keep your profile, KYC and settlement information up to
                  date.
                </p>
              </div>
            </div>
          </aside>

          {/* Mobile nav */}
          <div className="lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="flex w-full items-center justify-between rounded-sm border border-gray-200 bg-white px-4 py-3.5 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400">
                  <CurrentTabIcon className="h-5 w-5" />
                </span>

                <div className="text-left">
                  <p className="text-xs text-gray-400 dark:text-neutral-500">
                    Viewing
                  </p>

                  <p className="text-sm font-semibold text-gray-900 dark:text-neutral-100">
                    {currentTab?.label}
                  </p>
                </div>
              </div>

              {mobileMenuOpen ? (
                <ChevronUpIcon className="h-5 w-5 text-gray-500" />
              ) : (
                <ChevronDownIcon className="h-5 w-5 text-gray-500" />
              )}
            </button>

            {mobileMenuOpen && (
              <div className="mt-2 rounded-sm border border-gray-200 bg-white p-2 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
                {tabs.map((tab) => {
                  const Icon = tab.icon;

                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => {
                        setActiveTab(tab.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`flex w-full items-center gap-3 rounded-sm px-3 py-3 text-sm font-medium ${
                        activeTab === tab.id
                          ? "bg-[#0446DB] text-white"
                          : "text-gray-600 hover:bg-gray-50 dark:text-neutral-300 dark:hover:bg-neutral-800"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Content */}
          <main
            className={`min-w-0 ${
              mobileMenuOpen ? "hidden lg:block" : ""
            }`}
          >
            <div className="overflow-hidden rounded-sm border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
              <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 dark:border-neutral-800">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-sm bg-blue-50 text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400">
                    <CurrentTabIcon className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 sm:text-xl dark:text-white">
                      {currentTab?.label}
                    </h3>

                    <p className="mt-0.5 text-xs text-gray-500 sm:text-sm dark:text-neutral-500">
                      {currentTab?.description}
                    </p>
                  </div>
                </div>

                {isEditing && activeTab !== "documents" && (
                  <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                    <CogIcon className="h-4 w-4" />
                    Editing Mode
                  </span>
                )}
              </div>

              <div className="p-5 sm:p-6 lg:p-7">
                {renderTabContent()}
              </div>
            </div>
          </main>
        </div>

        
      </div>
    </div>
  );
};

export default Profile;






