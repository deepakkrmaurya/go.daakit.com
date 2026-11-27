
import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import GoogleMap from "../../googlemap";
import {
  Building2,
  UserRound,
  LockKeyhole,
  MapPin,
  MapPinned,
  RotateCcw,
  Plus,
  AlertCircle,
  Navigation,
  Hash,
  Map,
} from "lucide-react";

const baseURL = import.meta.env.VITE_BASE_URL;

function CreateHub() {
  const [formData, setFormData] = useState({
    hub_name: "",
    hub_code: "",
    hub_type: "",
    username: "",
    password: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    latitude: "",
    longitude: "",
  });

  const [errors, setErrors] = useState({});

  const hubTypes = [
    { value: "FM", label: "FM" },
    { value: "SORTING", label: "SORTING" },
    { value: "LM", label: "LM" },
  ];

  const fetchCurrentLocatipon = async ({
    selectedLocation,
    prefix,
  }) => {
    const { lat, lng } = selectedLocation;

    setFormData({
      ...formData,
      latitude: lat,
      longitude: lng,
    });
  };

  const states = [
    { value: "", label: "Select State" },
    {
      value: "maharashtra",
      label: "Maharashtra",
    },
    { value: "delhi", label: "Delhi" },
    { value: "karnataka", label: "Karnataka" },
    {
      value: "tamil_nadu",
      label: "Tamil Nadu",
    },
    { value: "gujarat", label: "Gujarat" },
    { value: "rajasthan", label: "Rajasthan" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.hub_name.trim())
      newErrors.hub_name = "Hub name is required";

    if (!formData.hub_code.trim())
      newErrors.hub_code = "Hub code is required";

    if (!formData.hub_type)
      newErrors.hub_type =
        "Please select a hub type";

    if (!formData.username.trim())
      newErrors.username = "Username is required";

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password =
        "Password must be at least 6 characters";
    }

    if (!formData.address.trim())
      newErrors.address = "Address is required";

    if (!formData.city.trim())
      newErrors.city = "City is required";

    if (!formData.state)
      newErrors.state =
        "Please select a state";

    if (!formData.pincode.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (
      !/^\d{6}$/.test(formData.pincode)
    ) {
      newErrors.pincode =
        "Pincode must be 6 digits";
    }

    if (
      formData.latitude &&
      !/^-?\d+(\.\d+)?$/.test(
        formData.latitude,
      )
    ) {
      newErrors.latitude =
        "Invalid latitude format";
    }

    if (
      formData.longitude &&
      !/^-?\d+(\.\d+)?$/.test(
        formData.longitude,
      )
    ) {
      newErrors.longitude =
        "Invalid longitude format";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      const validationErrors = validateForm();

      if (
        Object.keys(validationErrors).length === 0
      ) {
        const res = await axios.post(
          `${baseURL}/api/facility/registerHub`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(
                "token",
              )}`,
              "Content-Type": "application/json",
            },
          },
        );

        if (res?.data?.success) {
          toast.success(res?.data?.message);
        }

        setFormData({
          hub_name: "",
          hub_code: "",
          hub_type: "",
          username: "",
          password: "",
          address: "",
          city: "",
          state: "",
          pincode: "",
          latitude: "",
          longitude: "",
        });
      } else {
        setErrors(validationErrors);
      }
    } catch (error) {
      if (error?.response?.status == 400) {
        toast.error(
          error?.response?.data?.message,
        );
        return;
      }

      toast.error(
        "Somthing went wrong, please try again.",
      );
    }
  };

  const handleReset = () => {
    setFormData({
      hub_name: "",
      hub_code: "",
      hub_type: "",
      username: "",
      password: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      latitude: "",
      longitude: "",
    });

    setErrors({});
  };

  /* ======================================================
     REUSABLE CLASSES
  ====================================================== */

  const inputClass = (error) => `
    h-10
    w-full
    rounded-sm
    border
    bg-white
    px-3
    text-sm
    text-neutral-800
    outline-none
    transition
    placeholder:text-neutral-400
    focus:border-[#0446DB]
    focus:ring-2
    focus:ring-[#0446DB]/10
    dark:bg-neutral-900
    dark:text-neutral-100
    dark:placeholder:text-neutral-500
    ${
      error
        ? "border-red-400 dark:border-red-700"
        : "border-neutral-300 dark:border-neutral-700"
    }
  `;

  const ErrorMessage = ({ message }) => {
    if (!message) return null;

    return (
      <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
        <AlertCircle className="h-3.5 w-3.5" />
        {message}
      </p>
    );
  };

  const SectionHeader = ({
    icon: Icon,
    title,
    description,
  }) => (
    <div className="mb-5 flex items-start gap-3 border-b border-neutral-200 pb-4 dark:border-neutral-800">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-blue-50 text-[#0446DB] dark:bg-blue-950/40 dark:text-blue-400">
        <Icon className="h-[18px] w-[18px]" />
      </div>

      <div>
        <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
          {title}
        </h2>

        <p className="mt-1 text-xs leading-5 text-neutral-500 dark:text-neutral-400">
          {description}
        </p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F7F8FA] dark:bg-neutral-950">
      {/* ==================================================
          PAGE HEADER
      =================================================== */}

      <div className=" dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-xl font-semibold dark:text-white">
                Create New Hub
              </h1>

              <p className="mt-0.5 text-xs dark:text-neutral-400">
                Add hub information, credentials
                and location details.
              </p>
            </div>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-sm border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white">
            <Building2 className="h-3.5 w-3.5" />
            Hub Management
          </div>
        </div>
      </div>

      {/* ==================================================
          CONTENT
      =================================================== */}

      <div className="">
        <form
          onSubmit={handleSubmit}
          className="mx-auto max-w-[1500px]"
        >
          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            {/* ============================================
                HUB INFORMATION
            ============================================= */}

            <section className="rounded-sm border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:p-5">
              <SectionHeader
                icon={Building2}
                title="Hub Information"
                description="Enter basic information and choose the operational hub type."
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* HUB NAME */}

                <div>
                  <label
                    htmlFor="hub_name"
                    className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300"
                  >
                    Hub Name
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <div className="relative">
                    <Building2 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

                    <input
                      type="text"
                      id="hub_name"
                      name="hub_name"
                      value={formData.hub_name}
                      onChange={handleChange}
                      placeholder="e.g. Lucknow Hub"
                      className={`${inputClass(
                        errors.hub_name,
                      )} !pl-9`}
                    />
                  </div>

                  <ErrorMessage
                    message={errors.hub_name}
                  />
                </div>

                {/* HUB CODE */}

                <div>
                  <label
                    htmlFor="hub_code"
                    className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300"
                  >
                    Hub Code
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <div className="relative">
                    <Hash className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

                    <input
                      type="text"
                      id="hub_code"
                      name="hub_code"
                      value={formData.hub_code}
                      onChange={handleChange}
                      placeholder="e.g. LKO-01"
                      className={`${inputClass(
                        errors.hub_code,
                      )} !pl-9`}
                    />
                  </div>

                  <ErrorMessage
                    message={errors.hub_code}
                  />
                </div>
              </div>

              {/* HUB TYPE */}

              <div className="mt-5">
                <label className="mb-2 block text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  Hub Type
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <div className="grid grid-cols-3 gap-2">
                  {hubTypes.map((type) => {
                    const selected =
                      formData.hub_type ===
                      type.value;

                    return (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() =>
                          handleChange({
                            target: {
                              name: "hub_type",
                              value: type.value,
                            },
                          })
                        }
                        className={`relative h-11 rounded-sm border text-sm font-medium transition ${
                          selected
                            ? "border-[#0446DB] bg-blue-50 text-[#0446DB] ring-1 ring-[#0446DB]/10 dark:bg-blue-950/30 dark:text-blue-400"
                            : "border-neutral-200 bg-white text-neutral-600 hover:border-blue-300 hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
                        }`}
                      >
                        {type.label}

                        {selected && (
                          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#0446DB]" />
                        )}
                      </button>
                    );
                  })}
                </div>

                <ErrorMessage
                  message={errors.hub_type}
                />
              </div>
            </section>

            {/* ============================================
                LOGIN CREDENTIALS
            ============================================= */}

            <section className="rounded-sm border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:p-5">
              <SectionHeader
                icon={LockKeyhole}
                title="Login Credentials"
                description="Configure the username and password used to access this hub."
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* USERNAME */}

                <div>
                  <label
                    htmlFor="username"
                    className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300"
                  >
                    Username
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <div className="relative">
                    <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="Enter username"
                      className={`${inputClass(
                        errors.username,
                      )} !pl-9`}
                    />
                  </div>

                  <ErrorMessage
                    message={errors.username}
                  />
                </div>

                {/* PASSWORD */}

                <div>
                  <label
                    htmlFor="password"
                    className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300"
                  >
                    Password
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

                    <input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter password"
                      className={`${inputClass(
                        errors.password,
                      )} !pl-9`}
                    />
                  </div>

                  <ErrorMessage
                    message={errors.password}
                  />

                  {!errors.password && (
                    <p className="mt-1.5 text-[11px] text-neutral-400">
                      Minimum 6 characters
                      required.
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* ============================================
                ADDRESS DETAILS
            ============================================= */}

            <section className="rounded-sm border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:p-5 xl:col-span-2">
              <SectionHeader
                icon={MapPin}
                title="Address Details"
                description="Enter the complete physical address of the hub."
              />

              {/* ADDRESS */}

              <div>
                <label
                  htmlFor="address"
                  className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300"
                >
                  Complete Address
                  <span className="ml-1 text-red-500">
                    *
                  </span>
                </label>

                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter complete hub address..."
                  rows={3}
                  className={`w-full resize-none rounded-sm border bg-white px-3 py-2.5 text-sm text-neutral-800 outline-none transition placeholder:text-neutral-400 focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:bg-neutral-900 dark:text-neutral-100 ${
                    errors.address
                      ? "border-red-400 dark:border-red-700"
                      : "border-neutral-300 dark:border-neutral-700"
                  }`}
                />

                <ErrorMessage
                  message={errors.address}
                />
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
                {/* CITY */}

                <div>
                  <label
                    htmlFor="city"
                    className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300"
                  >
                    City
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                    className={inputClass(
                      errors.city,
                    )}
                  />

                  <ErrorMessage
                    message={errors.city}
                  />
                </div>

                {/* STATE */}

                <div>
                  <label
                    htmlFor="state"
                    className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300"
                  >
                    State
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Enter state"
                    className={inputClass(
                      errors.state,
                    )}
                  />

                  <ErrorMessage
                    message={errors.state}
                  />
                </div>

                {/* PINCODE */}

                <div>
                  <label
                    htmlFor="pincode"
                    className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300"
                  >
                    Pincode
                    <span className="ml-1 text-red-500">
                      *
                    </span>
                  </label>

                  <input
                    type="text"
                    id="pincode"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="6-digit pincode"
                    maxLength="6"
                    className={inputClass(
                      errors.pincode,
                    )}
                  />

                  <ErrorMessage
                    message={errors.pincode}
                  />
                </div>
              </div>
            </section>

            {/* ============================================
                HUB LOCATION
            ============================================= */}

            <section className="overflow-hidden rounded-sm border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900 xl:col-span-2">
              <div className="p-4 sm:p-5">
                <SectionHeader
                  icon={MapPinned}
                  title="Hub Location"
                  description="Enter coordinates manually or select the hub location directly from the map."
                />

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* LATITUDE */}

                  <div>
                    <label
                      htmlFor="latitude"
                      className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300"
                    >
                      Latitude
                    </label>

                    <div className="relative">
                      <Navigation className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

                      <input
                        type="text"
                        id="latitude"
                        name="latitude"
                        value={formData.latitude}
                        onChange={handleChange}
                        placeholder="28.6139"
                        className={`${inputClass(
                          errors.latitude,
                        )} !pl-9 !pr-8`}
                      />

                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400">
                        °
                      </span>
                    </div>

                    <ErrorMessage
                      message={errors.latitude}
                    />
                  </div>

                  {/* LONGITUDE */}

                  <div>
                    <label
                      htmlFor="longitude"
                      className="mb-1.5 block text-xs font-medium text-neutral-700 dark:text-neutral-300"
                    >
                      Longitude
                    </label>

                    <div className="relative">
                      <Navigation className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 rotate-90 text-neutral-400" />

                      <input
                        type="text"
                        id="longitude"
                        name="longitude"
                        value={formData.longitude}
                        onChange={handleChange}
                        placeholder="77.2090"
                        className={`${inputClass(
                          errors.longitude,
                        )} !pl-9 !pr-8`}
                      />

                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400">
                        °
                      </span>
                    </div>

                    <ErrorMessage
                      message={errors.longitude}
                    />
                  </div>
                </div>
              </div>

              {/* MAP */}

              <div className="border-t border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-950/40 sm:p-4">
                <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <Map className="h-4 w-4 text-[#0446DB]" />

                    <p className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                      Select location from map
                    </p>
                  </div>

                  {(formData.latitude ||
                    formData.longitude) && (
                    <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-neutral-500">
                      <span className="rounded-sm border border-neutral-200 bg-white px-2 py-1 dark:border-neutral-700 dark:bg-neutral-900">
                        Lat:{" "}
                        {formData.latitude || "—"}
                      </span>

                      <span className="rounded-sm border border-neutral-200 bg-white px-2 py-1 dark:border-neutral-700 dark:bg-neutral-900">
                        Lng:{" "}
                        {formData.longitude || "—"}
                      </span>
                    </div>
                  )}
                </div>

                <div className="overflow-hidden rounded-sm border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
                  <GoogleMap
                    fetchCurrentLocatipon={
                      fetchCurrentLocatipon
                    }
                  />
                </div>
              </div>
            </section>
          </div>

          {/* =================================================
              FORM ACTIONS
          ================================================== */}

          <div className="mt-4 flex flex-col-reverse gap-2 rounded-sm border border-neutral-200 bg-white px-4 py-3 shadow-sm dark:border-neutral-800 dark:bg-neutral-900 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              Fields marked with{" "}
              <span className="font-semibold text-red-500">
                *
              </span>{" "}
              are required.
            </p>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex h-9 items-center justify-center gap-2 rounded-sm border border-neutral-300 bg-white px-4 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </button>

              <button
                type="submit"
                className="inline-flex h-9 items-center justify-center gap-2 rounded-sm bg-[#0446DB] px-5 text-sm font-medium text-white shadow-sm transition hover:bg-[#0339B8] focus:outline-none focus:ring-2 focus:ring-[#0446DB]/20"
              >
                <Plus className="h-4 w-4" />
                Create Hub
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateHub;