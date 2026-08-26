import axios from 'axios';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';
import Cropper from 'react-easy-crop';
import {
  UserIcon,
  BuildingOfficeIcon,
  DocumentTextIcon,
  BanknotesIcon,
  KeyIcon,
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
  ChevronUpIcon
} from '@heroicons/react/24/outline';

const baseURL = import.meta.env.VITE_BASE_URL;
// local uploaded screenshot path provided in conversation (developer note)
const defaultAvatarPath = '/mnt/data/Screenshot 2025-11-25 at 2.22.38 PM.png';

const VendorProfile = () => {
  const [editTabPhone, setEditTabPhone] = useState('phone');
  const [editPhone, setEditPhone] = useState(false);
  const [phone, setPhone] = useState('');
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [profile, setProfile] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // File states: these are Files to be appended to FormData on save
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [documentFile, setDocumentFile] = useState(null);
  const [chequeFile, setChequeFile] = useState(null);

  // Previews (data URLs or object URLs) for immediate UI
  const [profilePreview, setProfilePreview] = useState(null);
  const [documentPreview, setDocumentPreview] = useState(null);
  const [chequePreview, setChequePreview] = useState(null);
  const inputsRef = useRef([]);
  const documentTypes = ['aadhar', 'pan', 'voterid', 'passport', 'driving_license'];

  const getMerchantProfile = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/vendor/getVendorProfile`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setProfile(res.data.data || {});
      setEditForm(res.data.data || {});
    } catch (err) {
      console.error('profile', err);
    }
  };

  useEffect(() => {
    getMerchantProfile();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm({ ...profile });
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

      const response = await axios.post(`${baseURL}/api/otp/sendphonenumberchangeotp`, {
        phone: phone,
      },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        toast.success(response.data.message)
        setShowOTPModal(true);
        setEditPhone(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
      return;
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${baseURL}/api/otp/sendpasswordchangeotp`, {
        phone: phone.replace(/\D/g, '')
      });

      if (response.data.success) {
        toast.success('New OTP sent successfully!');
        inputsRef.current[0]?.focus();
      } else {
        toast.error(response.data.message || 'Failed to resend OTP');
      }
    } catch (err) {
      toast.error('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async (otpCode) => {
    setVerificationLoading(true);
    try {
      const response = await axios.post(`${baseURL}/api/otp/verifyphonenumberchangeotp`, {
        phone: phone,
        otp: otpCode
      },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        const formData = new FormData();
        const fields = [
          'vendor_name',
          'email',
          'profile_image',
          'company_name',
          'company_address',
          'company_city',
          'company_state',
          'company_pincode',
          'company_gst_number',
          'bank_name',
          'bank_branch',
          'bank_account_number',
          'bank_ifsc_code',
          'document_type',
          'document_id'
        ];

        fields.forEach((f) => {
          if (editForm[f] !== undefined && editForm[f] !== null) {
            if (f === 'profile_image' && typeof editForm[f] === 'string' && editForm[f].startsWith('blob:')) {
              // Skip blob URLs
            } else {
              formData.append(f, editForm[f]);
            }
          }
        });

        if (profileImageFile) {
          formData.append('profile_image', profileImageFile);
        } else if (profile.profile_image) {
          formData.append('profile_image', profile.profile_image);
        }

        if (documentFile) {
          formData.append('document_image', documentFile);
        } else if (profile.document_image) {
          formData.append('document_image', profile.document_image);
        }

        if (chequeFile) {
          formData.append('cheque_image', chequeFile);
        } else if (profile.cheque_image) {
          formData.append('cheque_image', profile.cheque_image);
        }
        formData.append('phone', phone);
        
        const res = await axios.post(`${baseURL}/api/vendor/updateVendorInfo`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          }
        });

        if (res.data.success) {
          getMerchantProfile();
          setTimeout(() => {
            setVerificationLoading(false);
            setShowOTPModal(false);
            toast.success(res.data.message);
          }, 2000);
        }
      }
    } catch (error) {
      setVerificationLoading(false);
      toast.error(error?.response?.data?.message || "Verification failed");
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditForm(profile);
    setProfileImageFile(null);
    setDocumentFile(null);
    setChequeFile(null);
    setProfilePreview(null);
    setDocumentPreview(null);
    setChequePreview(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm((p) => ({ ...p, [name]: value }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      const fields = [
        'vendor_name',
        'email',
        'phone',
        'profile_image',
        'company_name',
        'company_address',
        'company_city',
        'company_state',
        'company_pincode',
        'company_gst_number',
        'bank_name',
        'bank_branch',
        'bank_account_number',
        'bank_ifsc_code',
        'document_type',
        'document_id'
      ];
      
      fields.forEach((f) => {
        if (editForm[f] !== undefined && editForm[f] !== null) {
          if (f === 'profile_image' && typeof editForm[f] === 'string' && editForm[f].startsWith('blob:')) {
            // Skip blob URLs
          } else {
            formData.append(f, editForm[f]);
          }
        }
      });

      if (profileImageFile) {
        formData.append('profile_image', profileImageFile);
      } else if (profile.profile_image) {
        formData.append('profile_image', profile.profile_image);
      }

      if (documentFile) {
        formData.append('document_image', documentFile);
      } else if (profile.document_image) {
        formData.append('document_image', profile.document_image);
      }

      if (chequeFile) {
        formData.append('cheque_image', chequeFile);
      } else if (profile.cheque_image) {
        formData.append('cheque_image', profile.cheque_image);
      }
        
      const res = await axios.post(`${baseURL}/api/vendor/updateVendorInfo`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      setProfile(res.data.data || {});
      setIsEditing(false);
      setProfileImageFile(null);
      setDocumentFile(null);
      setChequeFile(null);
      setProfilePreview(null);
      setDocumentPreview(null);
      setChequePreview(null);
      toast.success(res.data.message || 'Profile updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  const createImage = (url) =>
    new Promise((resolve, reject) => {
      const img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(e);
      img.src = url;
    });

  const getCroppedImg = async (imageSrc, pixelCrop) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        const file = new File([blob], 'cropped.jpeg', { type: blob.type || 'image/jpeg' });
        resolve(file);
      }, 'image/jpeg');
    });
  };

  const CropModal = ({ file, onClose, onCropDone, aspect = 1 }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropComplete = useCallback((croppedArea, croppedPixels) => {
      setCroppedAreaPixels(croppedPixels);
    }, []);

    const handleSave = async () => {
      try {
        const url = URL.createObjectURL(file);
        const croppedFile = await getCroppedImg(url, croppedAreaPixels);
        onCropDone(croppedFile);
      } catch (err) {
        toast.error('Could not crop image');
      } finally {
        onClose();
      }
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-lg w-[92%] max-w-lg p-4">
          <h3 className="text-lg font-semibold mb-3">Crop Image</h3>
          <div className="relative w-full h-64 bg-gray-100">
            <Cropper
              image={URL.createObjectURL(file)}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>

          <div className="mt-3">
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button onClick={onClose} className="px-3 py-2 bg-gray-200 rounded">
              Cancel
            </button>
            <button onClick={handleSave} className="px-3 py-2 bg-blue-600 text-white rounded">
              Crop & Save
            </button>
          </div>
        </div>
      </div>
    );
  };

  const UploadWithCrop = ({ label, accept = 'image/*,.pdf', type = 'profile' }) => {
    const [rawFile, setRawFile] = useState(null);
    const [showCrop, setShowCrop] = useState(false);

    const handleSelect = (e) => {
      const f = e?.target?.files ? e.target.files[0] : e;
      if (!f) return;

      if (!f.type.startsWith('image/')) {
        attachFileDirectly(f);
        return;
      }

      setRawFile(f);
      setShowCrop(true);
    };

    const attachFileDirectly = (file) => {
      const objectUrl = URL.createObjectURL(file);
      if (type === 'profile') {
        setProfileImageFile(file);
        setProfilePreview(objectUrl);
        setEditForm((p) => ({ ...p, profile_image: objectUrl }));
      } else if (type === 'document') {
        setDocumentFile(file);
        setDocumentPreview(objectUrl);
        setEditForm((p) => ({ ...p, document_image: objectUrl }));
      } else if (type === 'cheque') {
        setChequeFile(file);
        setChequePreview(objectUrl);
        setEditForm((p) => ({ ...p, cheque_image: objectUrl }));
      }
    };

    const handleCropDone = (croppedFile) => {
      attachFileDirectly(croppedFile);
    };

    const previewSrc =
      (type === 'profile' && (profilePreview || (profile.profile_image ? `${baseURL}/${profile.profile_image}` : null))) ||
      (type === 'document' && (documentPreview || (profile.document_image ? `${baseURL}/${profile.document_image}` : null))) ||
      (type === 'cheque' && (chequePreview || (profile.cheque_image ? `${baseURL}/${profile.cheque_image}` : null))) ||
      null;

    return (
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <label className="flex-1 cursor-pointer">
            <input
              type="file"
              accept={accept}
              onChange={handleSelect}
              className="hidden"
            />
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center hover:border-blue-500 transition-colors">
              <PhotoIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-xs sm:text-sm text-gray-600">Click to upload {label}</p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG, PDF up to 10MB</p>
            </div>
          </label>

          {previewSrc && (
            <div className="flex-shrink-0 flex justify-center sm:justify-start">
              {previewSrc.endsWith('.pdf') ? (
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-red-100 rounded-lg border flex items-center justify-center">
                  <DocumentTextIcon className="w-8 h-8 text-red-600" />
                  <span className="text-xs text-red-600 mt-1">PDF</span>
                </div>
              ) : (
                <img
                  src={previewSrc}
                  alt={label}
                  className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg border"
                />
              )}
            </div>
          )}
        </div>

        {showCrop && rawFile && (
          <CropModal
            file={rawFile}
            onClose={() => {
              setShowCrop(false);
              setRawFile(null);
            }}
            onCropDone={(croppedFile) => {
              setShowCrop(false);
              setRawFile(null);
              handleCropDone(croppedFile);
            }}
            aspect={1}
          />
        )}
      </div>
    );
  };

  const OTPModal = ({
    isOpen,
    onClose,
    onVerify,
    onResend,
    phoneNumber,
    loading = false
  }) => {
    const [otp, setOtp] = useState(['', '', '', '']);
    const [timeLeft, setTimeLeft] = useState(180);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isResendDisabled, setIsResendDisabled] = useState(false);

    const otpInputsRef = useRef([]);

    useEffect(() => {
      otpInputsRef.current = otpInputsRef.current.slice(0, 4);
    }, []);

    useEffect(() => {
      if (timeLeft > 0 && isOpen) {
        const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        return () => clearTimeout(timer);
      }
    }, [timeLeft, isOpen]);

    useEffect(() => {
      if (isOpen) {
        setOtp(['', '', '', '']);
        setTimeLeft(180);
        setError('');
        setSuccess('');
        setIsResendDisabled(false);

        setTimeout(() => {
          if (otpInputsRef.current[0]) {
            otpInputsRef.current[0].focus();
          }
        }, 100);
      }
    }, [isOpen]);

    const formatTime = (seconds) => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleInputChange = (index, value) => {
      const numericValue = value.replace(/\D/g, '');

      if (numericValue.length <= 1) {
        const newOtp = [...otp];
        newOtp[index] = numericValue;
        setOtp(newOtp);

        if (numericValue && index < 3) {
          otpInputsRef.current[index + 1]?.focus();
        }
      }

      if (error) setError('');
    };

    const handleKeyDown = (index, e) => {
      if (e.key === 'Backspace' && !otp[index] && index > 0) {
        otpInputsRef.current[index - 1]?.focus();
      }
    };

    const handlePaste = (e) => {
      e.preventDefault();
      const pasteData = e.clipboardData.getData('text').replace(/\D/g, '');
      if (pasteData.length === 4) {
        const newOtp = pasteData.split('').slice(0, 4);
        setOtp(newOtp);
        otpInputsRef.current[3]?.focus();
      }
    };

    const handleVerify = () => {
      if (otp.join('').length === 4) {
        onVerify(otp.join(''));
      }
    };

    const handleResendOTP = async () => {
      if (!isResendDisabled && timeLeft <= 0) {
        try {
          const response = await axios.post(`${baseURL}/api/otp/sendphonenumberchangeotp`, {
            phone: phone,
          },
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          if (response.data.success) {
            toast.success(response.data.message);
            setTimeLeft(180);
            setIsResendDisabled(true);
            setTimeout(() => setIsResendDisabled(false), 30000);
            onResend?.();
          }
        } catch (error) {
          toast.error(error.response?.data?.message || "Failed to resend OTP");
        }
      }
    };

    const handleBackdropClick = (e) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    };

    if (!isOpen) return null;

    return (
      <div
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        onClick={handleBackdropClick}
      >
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full transform transition-all duration-300 scale-100">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800">Verify Phone Number</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-1 rounded-lg hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[#0446DB] rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-[#0446DB] mb-2">
                Verify OTP
              </h1>
              <p className="text-gray-800 mb-1">
                Enter the code sent to
              </p>
              <p className="text-[#0446DB] font-semibold">{phoneNumber}</p>
            </div>

            <div className={`text-lg font-semibold text-center mb-6 ${timeLeft > 0 ? 'text-orange-400' : 'text-red-400'}`}>
              {timeLeft > 0
                ? `Time remaining: ${formatTime(timeLeft)}`
                : "Code expired"
              }
            </div>

            <div className="flex justify-center gap-3 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (otpInputsRef.current[index] = el)}
                  type="text"
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  disabled={timeLeft <= 0 || loading}
                  className="w-14 h-14 text-center text-xl font-semibold text-[#0446DB] border-2 border-[#0446DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0446DB] focus:border-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    WebkitAppearance: 'none',
                    MozAppearance: 'textfield'
                  }}
                />
              ))}
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg mb-4">
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg mb-4">
                <p className="text-green-700 text-sm font-medium">{success}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleVerify}
                disabled={otp.join('').length !== 4 || loading || timeLeft <= 0}
                className="flex-1 py-3 bg-[#0446DB] disabled:bg-[rgb(88,82,164)] text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </>
                ) : (
                  'Verify'
                )}
              </button>

              <button
                onClick={handleResendOTP}
                disabled={isResendDisabled || loading || timeLeft > 0}
                className="flex-1 py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:cursor-not-allowed"
              >
                Resend Code
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: UserIcon },
    { id: 'company', label: 'Company', icon: BuildingOfficeIcon },
    { id: 'documents', label: 'Company KYC', icon: DocumentTextIcon },
    { id: 'bank', label: 'Bank Details', icon: BanknotesIcon },
  ];

  const KYC = () => {
    const [kycCompanyType, setCompanyType] = useState('');
    const [kycProfile, setKycProfile] = useState({});
    const [kycEditForm, setKycEditForm] = useState({});
    const [kycIsEditing, setKycIsEditing] = useState(false);
    const [kycLoading, setKycLoading] = useState(false);

    const getMerchantKYCProfile = async () => {
      try {
        const res = await axios.get(`${baseURL}/api/vendor/getVendorProfile`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setKycProfile(res.data.data || {});
        setKycEditForm(res.data.data || {});
        if (res.data.data?.company_type) {
          setCompanyType(res.data.data.company_type);
        }
      } catch (err) {
        console.error('profile', err);
      }
    };

    useEffect(() => {
      getMerchantKYCProfile();
    }, []);

    const handleEdit = () => {
      setKycIsEditing(true);
      setKycEditForm({ ...kycProfile });
    };

    const handleCancel = () => {
      setKycIsEditing(false);
      setKycEditForm(kycProfile);
      setCompanyType(kycProfile.company_type || '');
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
      setKycEditForm((p) => ({ ...p, [name]: value }));
    };

    const handleFileChange = (e) => {
      const { name, files } = e.target;
      if (files && files[0]) {
        setKycEditForm((p) => ({ ...p, [name]: files[0] }));
      }
    };

    const handleSave = async () => {
      setKycLoading(true);
      try {
        const formData = new FormData();
        formData.append('company_type', kycCompanyType);

        const fields = [
          'document_type',
          'document_id',
          'company_pancard_name',
          'supporting_document_id',
          'supporting_document_type'
        ];

        fields.forEach((f) => {
          if (kycEditForm[f] !== undefined && kycEditForm[f] !== null) {
            formData.append(f, kycEditForm[f]);
          }
        });

        if (kycCompanyType === "sole Proprietorship") {
          if (kycEditForm.document_image instanceof File) {
            formData.append('document_image', kycEditForm.document_image);
          } else if (kycProfile.document_image) {
            formData.append('document_image', kycProfile.document_image);
          }
        } else if (kycCompanyType === "partnership" || 
                   kycCompanyType === "limited liability partnership" || 
                   kycCompanyType === "private limited company" || 
                   kycCompanyType === "public limited company") {
          if (kycEditForm.company_pancard_image instanceof File) {
            formData.append('company_pancard_image', kycEditForm.company_pancard_image);
          } else if (kycProfile.company_pancard_image) {
            formData.append('company_pancard_image', kycProfile.company_pancard_image);
          }

          if (kycEditForm.supporting_document_image instanceof File) {
            formData.append('supporting_document_image', kycEditForm.supporting_document_image);
          } else if (kycProfile.supporting_document_image) {
            formData.append('supporting_document_image', kycProfile.supporting_document_image);
          }
        }
        const res = await axios.post(`${baseURL}/api/vendor/updateVendorInfo`, formData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data'
          }
        });
     
        setKycProfile(res.data.data || {});
        setKycIsEditing(false);
        toast.success(res.data.message || 'KYC updated successfully');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Error updating KYC');
      } finally {
        setKycLoading(false);
      }
    };

    const renderKYCForm = () => {
      switch (kycCompanyType) {
        case "sole Proprietorship":
          return (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Document Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="document_type"
                  value={kycEditForm.document_type || ''}
                  onChange={handleChange}
                  disabled={!kycIsEditing}
                  className="border border-[#0446DB] py-2 px-3 w-full rounded text-[#0446DB] disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                >
                  <option value="">Select Document Type</option>
                  {documentTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Document ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="document_id"
                  value={kycEditForm.document_id || ''}
                  onChange={handleChange}
                  disabled={!kycIsEditing}
                  className="border border-[#0446DB] py-2 px-3 w-full rounded text-gray-700 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter document ID"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Document Image <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  name="document_image"
                  onChange={handleFileChange}
                  disabled={!kycIsEditing}
                  accept="image/*,.pdf"
                  className="border border-[#0446DB] py-2 px-3 w-full rounded text-[#0446DB] disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                {kycProfile.document_image && !kycEditForm.document_image && (
                  <p className="text-sm text-green-600 mt-1">
                    Current file: {kycProfile.document_image}
                  </p>
                )}
              </div>
            </div>
          );
        case "partnership":
        case "limited liability partnership":
        case "private limited company":
        case "public limited company":
          return (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company PAN Card Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="company_pancard_name"
                  value={kycEditForm.company_pancard_name || ''}
                  onChange={handleChange}
                  disabled={!kycIsEditing}
                  className="border border-[#0446DB] py-2 px-3 w-full rounded text-gray-700 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter name as on PAN card"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload PAN Card Image <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  name="company_pancard_image"
                  onChange={handleFileChange}
                  disabled={!kycIsEditing}
                  accept="image/*,.pdf"
                  className="border border-[#0446DB] py-2 px-3 w-full rounded text-[#0446DB] disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                {kycProfile.company_pancard_image && !kycEditForm.company_pancard_image && (
                  <p className="text-sm text-green-600 mt-1">
                    Current file: {kycProfile.company_pancard_image}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Supporting Document Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="supporting_document_type"
                  value={kycEditForm.supporting_document_type || ''}
                  onChange={handleChange}
                  disabled={!kycIsEditing}
                  className="border border-[#0446DB] py-2 px-3 w-full rounded text-[#0446DB] disabled:bg-gray-100 disabled:cursor-not-allowed"
                  required
                >
                  <option value="">Select Document Type</option>
                  <option value="bank_account_statement">Bank Account Statement</option>
                  <option value="electricity_bill">Electricity Bill</option>
                  <option value="lease_rent_agreement">Lease / Rent Agreement</option>
                  <option value="telephone_bill">Telephone Bill</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Supporting Document ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="supporting_document_id"
                  value={kycEditForm.supporting_document_id || ''}
                  onChange={handleChange}
                  disabled={!kycIsEditing}
                  className="border border-[#0446DB] py-2 px-3 w-full rounded text-gray-700 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  placeholder="Enter document ID"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload Supporting Document <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  name="supporting_document_image"
                  onChange={handleFileChange}
                  disabled={!kycIsEditing}
                  accept="image/*,.pdf"
                  className="border border-[#0446DB] py-2 px-3 w-full rounded text-[#0446DB] disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                {kycProfile.supporting_document_image && !kycEditForm.supporting_document_image && (
                  <p className="text-sm text-green-600 mt-1">
                    Current file: {kycProfile.supporting_document_image}
                  </p>
                )}
              </div>
            </div>
          );

        default:
          return (
            <div className="text-center py-8">
              <DocumentTextIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Please select a company type to view KYC requirements</p>
            </div>
          );
      }
    };

    return (
      <div className="bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {kycProfile.kyc_verified === 1 ? (
            <div className="w-full max-w-md mx-auto bg-gradient-to-r from-green-500 to-emerald-600 text-white p-4 rounded-2xl shadow-xl flex items-center gap-4">
              <div className="bg-white/20 backdrop-blur-md p-3 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="white"
                  className="w-8 h-8"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-lg font-semibold">KYC Verified</p>
                <p className="text-sm opacity-90">Your KYC is successfully completed.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8 mb-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <DocumentTextIcon className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                      <h1 className="text-xl lg:text-3xl font-bold text-gray-900">KYC Verification</h1>
                      <p className="text-gray-600 mt-1">Complete your Know Your Customer verification</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {!kycIsEditing ? (
                      <button
                        onClick={handleEdit}
                        className="flex items-center space-x-2 bg-[#0446DB] text-white px-6 py-3 rounded-xl hover:bg-[rgb(70,65,180)] transition-colors shadow-lg shadow-blue-100"
                      >
                        <span>Edit KYC</span>
                      </button>
                    ) : (
                      <div className="flex flex-col md:flex-row gap-2">
                        <button
                          onClick={handleSave}
                          disabled={kycLoading}
                          className="flex items-center space-x-2 bg-[#0446DB] text-white px-6 py-2 rounded-xl transition-colors disabled:opacity-50"
                        >
                          {kycLoading ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                          onClick={handleCancel}
                          className="flex items-center text-center space-x-2 bg-gray-600 text-white px-6 py-2 rounded-xl hover:bg-gray-700 transition-colors"
                        >
                          <span>Cancel</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Company Information</h2>
                  <p className="text-gray-600">Select your company type to view specific KYC requirements</p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Type of Company <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={kycCompanyType}
                      onChange={(e) => setCompanyType(e.target.value)}
                      disabled={!kycIsEditing}
                      className="border border-[#0446DB] py-3 px-4 w-full rounded text-[#0446DB] disabled:bg-gray-100 disabled:cursor-not-allowed"
                      required
                    >
                      <option value="">Select Company Type</option>
                      <option value="sole Proprietorship">Sole Proprietorship</option>
                      <option value="partnership">Partnership</option>
                      <option value="limited liability partnership">Limited Liability Partnership</option>
                      <option value="public limited company">Public Limited Company</option>
                      <option value="private limited company">Private Limited Company</option>
                    </select>
                  </div>

                  {kycCompanyType && (
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {kycCompanyType.charAt(0).toUpperCase() + kycCompanyType.slice(1)} KYC Requirements
                      </h3>
                      {renderKYCForm()}
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    const currentData = isEditing ? editForm : profile;

    switch (activeTab) {
      case 'personal':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="vendor_name"
                value={currentData.vendor_name || ''}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={currentData.email || ''}
                onChange={handleChange}
                disabled={!isEditing}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Phone <span className="text-red-500">*</span>
              </label>
              <div>
                {editPhone ? (
                  <div className="space-y-4">
                    <div className="flex gap-3 items-start">
                      <div className="flex-1">
                        <div className="relative">
                          <input
                            type="tel"
                            name="phone"
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Enter your phone number"
                            className="w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-white shadow-sm"
                            autoFocus
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={sendOTP}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0446DB] text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg shadow-green-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Send OTP
                      </button>
                      <button
                        onClick={() => setEditPhone(false)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="relative flex items-center gap-1">
                    <input
                      type="tel"
                      name="phone"
                      value={currentData.phone || ''}
                      onChange={handleChange}
                      disabled={true}
                      className="w-full px-1 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-700 transition-colors pl-4"
                    />
                    <svg
                      onClick={() => setEditPhone(true)}
                      className="w-6 h-6 cursor-pointer text-[#0446DB]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>

            {isEditing ? (
              <UploadWithCrop label="Profile Image" accept="image/*" type="profile" />
            ) : (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Profile Image</label>
                {profilePreview || currentData.profile_image ? (
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <img
                      src={
                        profilePreview
                          ? profilePreview
                          : currentData.profile_image
                            ? `${baseURL}/${currentData.profile_image}`
                            : defaultAvatarPath
                      }
                      alt="Profile"
                      className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg mx-auto sm:mx-0"
                    />
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm text-center sm:text-left">No photo uploaded</p>
                )}
              </div>
            )}
          </div>
        );

      case 'company':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {[
              { label: 'Company Name', name: 'company_name' },
              { label: 'GST Number', name: 'company_gst_number' },
              { label: 'Company Address', name: 'company_address' },
              { label: 'City', name: 'company_city' },
              { label: 'State', name: 'company_state' },
              { label: 'Pincode', name: 'company_pincode' }
            ].map((field) => (
              <div key={field.name} className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                <input
                  type="text"
                  name={field.name}
                  value={currentData[field.name] || ''}
                  onChange={handleChange}
                  disabled={!isEditing}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
            ))}
          </div>
        );

      case 'documents':
        return <KYC />;

      case 'bank':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {[
                { label: 'Bank Name', name: 'bank_name' },
                { label: 'Account Number', name: 'bank_account_number' },
                { label: 'IFSC Code', name: 'bank_ifsc_code' },
                { label: 'Branch', name: 'bank_branch' }
              ].map((field) => (
                <div key={field.name} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                  <input
                    type="text"
                    name={field.name}
                    value={currentData[field.name] || ''}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
              ))}
            </div>

            {isEditing ? (
              <UploadWithCrop label="Cheque Image" accept="image/*,.pdf" type="cheque" />
            ) : (
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Cheque Image</label>
                {chequePreview || currentData.cheque_image ? (
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <img
                      src={chequePreview ? chequePreview : currentData.cheque_image ? `${baseURL}/${currentData.cheque_image}` : defaultAvatarPath}
                      alt="Cheque"
                      className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg border mx-auto sm:mx-0"
                    />
                    {currentData.cheque_image && !chequePreview && (
                      <a
                        href={`${baseURL}/${currentData.cheque_image}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium text-center sm:text-left"
                      >
                        View Full Image
                      </a>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm text-center sm:text-left">No cheque image uploaded</p>
                )}
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-4 sm:py-8 px-3 sm:px-6 lg:px-8">
      <div className=" mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-8 mb-6 sm:mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-3 sm:space-x-4 mb-4 lg:mb-0">
              <div className="p-2 sm:p-3 rounded-xl">
                {profilePreview || profile?.profile_image ? (
                  <img
                    src={
                      profilePreview
                        ? profilePreview
                        : profile.profile_image
                          ? `${baseURL}/${profile.profile_image}`
                          : defaultAvatarPath
                    }
                    alt="Profile"
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover"
                  />
                ) : (
                  <UserIcon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                )}
              </div>

              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">{profile?.vendor_name}</h1>
                <p className="text-gray-600 mt-1 text-xs sm:text-sm">Manage your account information and preferences</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <span
                  className={`inline-flex items-center px-2 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold ${profile.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                >
                  <ShieldCheckIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  {profile.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>

              {!isEditing ? (
                <button
                  onClick={handleEdit}
                  className="flex items-center space-x-1 sm:space-x-2 bg-[#0446DB] text-white px-3 sm:px-6 py-2 sm:py-3 rounded-xl hover:bg-[#0446DB] transition-colors shadow-lg shadow-blue-100 text-sm sm:text-base"
                >
                  <PencilSquareIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex gap-2 sm:gap-3">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center space-x-1 sm:space-x-2 bg-green-600 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 text-sm sm:text-base"
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="flex items-center space-x-1 sm:space-x-2 bg-gray-600 text-white px-3 sm:px-6 py-2 sm:py-3 rounded-xl hover:bg-gray-700 transition-colors text-sm sm:text-base"
                  >
                    <XMarkIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Cancel</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          <div className="lg:hidden">
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="w-full flex items-center justify-between bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <span className="text-lg font-semibold text-gray-900">{tabs.find((t) => t.id === activeTab)?.label}</span>
              {mobileMenuOpen ? <ChevronUpIcon className="w-5 h-5 text-gray-600" /> : <ChevronDownIcon className="w-5 h-5 text-gray-600" />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="lg:hidden">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === tab.id ? 'bg-[#0446DB] text-white shadow-lg shadow-blue-100' : 'text-gray-600 hover:text-[#0446DB] hover:bg-blue-50'
                        }`}
                    >
                      <tab.icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          )}

          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === tab.id ? 'bg-[#0446DB] text-white shadow-lg shadow-blue-100' : 'text-gray-600 hover:text-[#0446DB] hover:bg-blue-50'
                      }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          <div className={`${mobileMenuOpen ? 'hidden lg:block' : ''} lg:col-span-3`}>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 lg:p-8">
              <div className="flex items-center justify-between mb-6 sm:mb-8">
                <div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{tabs.find((t) => t.id === activeTab)?.label}</h2>
                </div>

                {isEditing && (
                  <div className="flex items-center space-x-2 text-sm text-[#0446DB]">
                    <CogIcon className="w-4 h-4" />
                    <span className="hidden sm:inline">Editing Mode</span>
                  </div>
                )}
              </div>

              <div className="space-y-4 sm:space-y-6">{renderTabContent()}</div>
            </div>
          </div>
        </div>
      </div>

      <OTPModal
        isOpen={showOTPModal}
        onClose={() => setShowOTPModal(false)}
        onVerify={verifyOTP}
        onResend={handleResendOTP}
        phoneNumber={phone}
        loading={verificationLoading}
      />
    </div>
  );
};

export default VendorProfile;