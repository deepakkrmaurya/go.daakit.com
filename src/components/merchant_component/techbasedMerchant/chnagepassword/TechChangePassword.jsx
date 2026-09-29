import React, { useState } from "react";
import {
  EyeIcon,
  EyeSlashIcon,
  LockClosedIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { toast } from "react-toastify";
import AxiosInstance from "../../../../Helper/axiosInstance";

const baseURL = import.meta.env.VITE_BASE_URL;

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);
  const [errors, setErrors] = useState({});

  const passwordChecks = {
    length: formData.password.length >= 6,
    match:
      formData.password.length > 0 &&
      formData.confirmPassword.length > 0 &&
      formData.password === formData.confirmPassword,
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.password.trim()) {
      newErrors.password = "New password is required";
    } else if (formData.password.length < 6) {
      newErrors.password =
        "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword =
        "Please confirm your password";
    } else if (
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Authentication token not found");
      return;
    }

    try {
      setLoading(true);
      const res = AxiosInstance.post('/api/tech-merchant/changeMerchantPassword',{
          password: formData.password,
          confirmPassword: formData.confirmPassword,
        },)
     

      
        toast.success(
          res?.data?.message ||
            "Password changed successfully!"
        );

        setFormData({
          password: "",
          confirmPassword: "",
        });

        setErrors({});
        setShowPassword(false);
        setShowConfirmPassword(false);
     
    } catch (error) {
      console.error(
        "Error changing password:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "Error changing password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        h-[90vh]
        flex justify-center items-center
        w-full
        bg-[#EEEEEE]
        p-3
        sm:p-5
        lg:p-6

        dark:bg-neutral-950
      "
    >
      <div className="mx-auto w-full max-w-[560px]">
        <div
          className="
            overflow-hidden
            rounded-sm
            border
            border-neutral-200
            bg-white
            shadow-sm

            dark:border-neutral-800
            dark:bg-neutral-900
          "
        >
          {/* HEADER */}

          <div
            className="
              border-b
              border-neutral-200
              px-5
              py-5

              dark:border-neutral-800

              sm:px-6
            "
          >
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-11
                  w-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#0446DB]/10
                  text-[#0446DB]

                  dark:bg-[#0446DB]/20
                  dark:text-blue-300
                "
              >
                <LockClosedIcon className="h-5 w-5" />
              </div>

              <div>
                <h1
                  className="
                    text-lg
                    font-bold
                    text-neutral-900

                    sm:text-xl

                    dark:text-white
                  "
                >
                  Change Password
                </h1>

                <p
                  className="
                    mt-0.5
                    text-sm
                    text-neutral-500

                    dark:text-neutral-400
                  "
                >
                  Update your account password
                </p>
              </div>
            </div>
          </div>

          {/* FORM */}

          <form
            onSubmit={handleSubmit}
            className="space-y-5 p-5 sm:p-6"
          >
            {/* NEW PASSWORD */}

            <div>
              <label
                htmlFor="password"
                className="
                  mb-2
                  block
                  text-sm
                  font-semibold
                  text-neutral-700

                  dark:text-neutral-200
                "
              >
                New Password{" "}
                <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <LockClosedIcon
                  className="
                    pointer-events-none
                    absolute
                    left-3
                    top-1/2
                    h-[18px]
                    w-[18px]
                    -translate-y-1/2
                    text-neutral-400
                  "
                />

                <input
                  id="password"
                  type={
                    showPassword ? "text" : "password"
                  }
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  autoComplete="new-password"
                  className={`
                    h-11
                    w-full
                    rounded-sm
                    border
                    bg-white
                    pl-10
                    pr-11
                    text-sm
                    text-neutral-900
                    outline-none
                    transition-all

                    placeholder:text-neutral-400

                    dark:bg-neutral-800
                    dark:text-white
                    dark:placeholder:text-neutral-500

                    ${
                      errors.password
                        ? `
                          border-red-500
                          focus:border-red-500
                          focus:ring-1
                          focus:ring-red-500
                        `
                        : `
                          border-neutral-200
                          focus:border-[#0446DB]
                          focus:ring-1
                          focus:ring-[#0446DB]

                          dark:border-neutral-700
                        `
                    }
                  `}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                  className="
                    absolute
                    right-2
                    top-1/2
                    flex
                    h-8
                    w-8
                    -translate-y-1/2
                    items-center
                    justify-center
                    rounded-md
                    text-neutral-400

                    hover:bg-neutral-100
                    hover:text-neutral-700

                    dark:hover:bg-neutral-700
                    dark:hover:text-white
                  "
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>

              {errors.password && (
                <p className="mt-1.5 text-xs font-medium text-red-500">
                  {errors.password}
                </p>
              )}
            </div>

            {/* CONFIRM PASSWORD */}

            <div>
              <label
                htmlFor="confirmPassword"
                className="
                  mb-2
                  block
                  text-sm
                  font-semibold
                  text-neutral-700

                  dark:text-neutral-200
                "
              >
                Confirm Password{" "}
                <span className="text-red-500">*</span>
              </label>

              <div className="relative">
                <LockClosedIcon
                  className="
                    pointer-events-none
                    absolute
                    left-3
                    top-1/2
                    h-[18px]
                    w-[18px]
                    -translate-y-1/2
                    text-neutral-400
                  "
                />

                <input
                  id="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                  className={`
                    h-11
                    w-full
                    rounded-sm
                    border
                    bg-white
                    pl-10
                    pr-11
                    text-sm
                    text-neutral-900
                    outline-none
                    transition-all

                    placeholder:text-neutral-400

                    dark:bg-neutral-800
                    dark:text-white
                    dark:placeholder:text-neutral-500

                    ${
                      errors.confirmPassword
                        ? `
                          border-red-500
                          focus:border-red-500
                          focus:ring-1
                          focus:ring-red-500
                        `
                        : `
                          border-neutral-200
                          focus:border-[#0446DB]
                          focus:ring-1
                          focus:ring-[#0446DB]

                          dark:border-neutral-700
                        `
                    }
                  `}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      (prev) => !prev
                    )
                  }
                  className="
                    absolute
                    right-2
                    top-1/2
                    flex
                    h-8
                    w-8
                    -translate-y-1/2
                    items-center
                    justify-center
                    rounded-md
                    text-neutral-400

                    hover:bg-neutral-100
                    hover:text-neutral-700

                    dark:hover:bg-neutral-700
                    dark:hover:text-white
                  "
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="h-5 w-5" />
                  ) : (
                    <EyeIcon className="h-5 w-5" />
                  )}
                </button>
              </div>

              {errors.confirmPassword && (
                <p className="mt-1.5 text-xs font-medium text-red-500">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* REQUIREMENTS */}

            <div
              className="
                rounded-xl
                border
                border-[#0446DB]/15
                bg-[#0446DB]/[0.04]
                p-4

                dark:border-[#0446DB]/30
                dark:bg-[#0446DB]/10
              "
            >
              <p
                className="
                  mb-3
                  text-sm
                  font-semibold
                  text-neutral-800

                  dark:text-neutral-200
                "
              >
                Password Requirements
              </p>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <CheckCircleIcon
                    className={`h-4 w-4 ${
                      passwordChecks.length
                        ? "text-emerald-500"
                        : "text-neutral-300 dark:text-neutral-600"
                    }`}
                  />

                  <span
                    className="
                      text-xs
                      text-neutral-600

                      dark:text-neutral-400
                    "
                  >
                    At least 6 characters long
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <CheckCircleIcon
                    className={`h-4 w-4 ${
                      passwordChecks.match
                        ? "text-emerald-500"
                        : "text-neutral-300 dark:text-neutral-600"
                    }`}
                  />

                  <span
                    className="
                      text-xs
                      text-neutral-600

                      dark:text-neutral-400
                    "
                  >
                    Both passwords must match
                  </span>
                </div>
              </div>
            </div>

            {/* SUBMIT */}

            <button
              type="submit"
              disabled={loading}
              className="
                flex
                h-11
                w-full
                items-center
                justify-center
                gap-2
                rounded-sm
                bg-[#0446DB]
                px-5
                text-sm
                font-semibold
                text-white
                shadow-sm
                transition-all

                hover:bg-[#0339B5]
                hover:shadow-md

                disabled:cursor-not-allowed
                disabled:opacity-60
              "
            >
              {loading ? (
                <>
                  <span
                    className="
                      h-4
                      w-4
                      animate-spin
                      rounded-full
                      border-2
                      border-white/40
                      border-t-white
                    "
                  />

                  Changing Password...
                </>
              ) : (
                <>
                  <LockClosedIcon className="h-4 w-4" />
                  Change Password
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;