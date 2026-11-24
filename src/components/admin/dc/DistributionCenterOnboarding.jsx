
import { useEffect, useMemo, useState } from "react";

import axios from "axios";

import Select from "react-select";

import CreatableSelect from "react-select/creatable";

import { toast } from "react-toastify";

import { Country, State, City } from "country-state-city";

import {

  Building2,

  User,

  Mail,

  Phone,

  Lock,

  MapPin,

  Loader2,

  EyeOff,

  Eye,

  Hash,

  Map as MapIcon,

} from "lucide-react";

const baseURL = import.meta.env.VITE_BASE_URL;


const DC_ONBOARDING_API = `${String(baseURL || "").replace(

  /\/$/,

  ""

)}/api/dc/create`;


const initialFormData = {

  dc_name: "",

  dc_code: "",

  username: "",

  password: "",

  phone: "",

  email: "",

  address: "",


  state: "",


  state_name: "",


  city: "",


  city_state_code: "",

  pincode: "",

};

function DistributionCenterOnboarding() {

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState(initialFormData);

  const [showPassword, setShowPassword] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(() =>

    document.documentElement.classList.contains("dark")

  );


  useEffect(() => {

    const observer = new MutationObserver(() => {

      setIsDarkMode(

        document.documentElement.classList.contains("dark")

      );

    });

    observer.observe(document.documentElement, {

      attributes: true,

      attributeFilter: ["class"],

    });

    return () => observer.disconnect();

  }, []);


  const india = useMemo(() => {

    return Country.getCountryByCode("IN");

  }, []);


  const stateOptions = useMemo(() => {

    const states = State.getStatesOfCountry("IN") || [];

    return states

      .filter((state) => state?.name)

      .map((state) => ({

        value: state.isoCode,

        label: state.name,

        isoCode: state.isoCode,

        countryCode: state.countryCode,

      }))

      .sort((a, b) => a.label.localeCompare(b.label));

  }, []);


  const cityOptions = useMemo(() => {

    const cities = City.getCitiesOfCountry("IN") || [];

    return cities

      .filter((city) => city?.name)

      .map((city, index) => ({


        value: `${city.name}-${city.stateCode || "IN"}-${index}`,

        label: city.name,

        cityName: city.name,

        stateCode: city.stateCode || "",

        countryCode: city.countryCode || "IN",

        latitude: city.latitude,

        longitude: city.longitude,

      }))

      .sort((a, b) => a.label.localeCompare(b.label));

  }, []);


  const selectedState = useMemo(() => {

    if (!formData.state) {

      return null;

    }

    return (

      stateOptions.find(

        (state) => state.value === formData.state

      ) || null

    );

  }, [stateOptions, formData.state]);


  const selectedCity = useMemo(() => {

    if (!formData.city) {

      return null;

    }


    if (formData.city_state_code) {

      const exactCity = cityOptions.find(

        (city) =>

          city.cityName?.toLowerCase() ===

            formData.city.toLowerCase() &&

          city.stateCode === formData.city_state_code

      );

      if (exactCity) {

        return exactCity;

      }

    }


    const existingCity = cityOptions.find(

      (city) =>

        city.cityName?.toLowerCase() ===

        formData.city.toLowerCase()

    );

    if (existingCity) {

      return existingCity;

    }


    return {

      value: formData.city,

      label: formData.city,

      cityName: formData.city,

      stateCode: "",

      __isNew__: true,

    };

  }, [

    cityOptions,

    formData.city,

    formData.city_state_code,

  ]);


  const handleChange = (e) => {

    const { name, value } = e.target;

    setFormData((prev) => ({

      ...prev,

      [name]: value,

    }));

  };


  const handleDCCodeChange = (e) => {

    const value = e.target.value

      .toUpperCase()

      .replace(/[^A-Z0-9-]/g, "");

    setFormData((prev) => ({

      ...prev,

      dc_code: value,

    }));

  };


  const handleUsernameChange = (e) => {

    const value = e.target.value

      .replace(/\s/g, "")

      .toLowerCase();

    setFormData((prev) => ({

      ...prev,

      username: value,

    }));

  };


  const handlePhoneChange = (e) => {

    const value = e.target.value

      .replace(/\D/g, "")

      .slice(0, 10);

    setFormData((prev) => ({

      ...prev,

      phone: value,

    }));

  };


  const handlePincodeChange = (e) => {

    const value = e.target.value

      .replace(/\D/g, "")

      .slice(0, 6);

    setFormData((prev) => ({

      ...prev,

      pincode: value,

    }));

  };


  const handleStateChange = (selectedOption) => {

    setFormData((prev) => ({

      ...prev,

      state: selectedOption?.value || "",

      state_name: selectedOption?.label || "",

    }));

  };


  const handleCityChange = (selectedOption) => {


    if (!selectedOption) {

      setFormData((prev) => ({

        ...prev,

        city: "",

        city_state_code: "",

      }));

      return;

    }


    const cityName =

      selectedOption.cityName ||

      selectedOption.label ||

      selectedOption.value ||

      "";

    setFormData((prev) => ({

      ...prev,

      city: cityName.trim(),

      city_state_code: selectedOption.stateCode || "",

    }));

  };


  const handleCreateCity = (inputValue) => {

    const cityName = inputValue.trim();

    if (!cityName) {

      return;

    }

    setFormData((prev) => ({

      ...prev,

      city: cityName,


      city_state_code: "",

    }));

    toast.success(`${cityName} selected as City / Town`);

  };


  const isValidNewCity = (inputValue) => {

    const value = inputValue.trim();

    if (!value) {

      return false;

    }

    const alreadyExists = cityOptions.some(

      (city) =>

        city.cityName?.toLowerCase() ===

        value.toLowerCase()

    );

    return !alreadyExists;

  };


  const validateForm = () => {

    const dcName = formData.dc_name.trim();

    const dcCode = formData.dc_code.trim();

    const username = formData.username.trim();

    const password = formData.password;

    const email = formData.email.trim();

    const phone = formData.phone.trim();

    const address = formData.address.trim();

    const state = formData.state;

    const city = formData.city.trim();

    const pincode = formData.pincode.trim();


    if (!dcName) {

      toast.error(

        "Distribution Center name is required"

      );

      return false;

    }


    if (!dcCode) {

      toast.error(

        "Distribution Center code is required"

      );

      return false;

    }


    if (!username) {

      toast.error("Username is required");

      return false;

    }

    if (username.length < 3) {

      toast.error(

        "Username must be at least 3 characters"

      );

      return false;

    }


    if (!password) {

      toast.error("Password is required");

      return false;

    }

    if (password.length < 6) {

      toast.error(

        "Password must be at least 6 characters"

      );

      return false;

    }


    if (!email) {

      toast.error("Email address is required");

      return false;

    }

    
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(email.trim())) {
  toast.error("Enter a valid email address");
  return false;
}



    if (

      phone &&

      !/^\d{10}$/.test(phone)

    ) {

      toast.error(

        "Phone number must be exactly 10 digits"

      );

      return false;

    }


    if (!address) {

      toast.error("Address is required");

      return false;

    }


    if (!state) {

      toast.error("Please select state");

      return false;

    }


    if (!city) {

      toast.error(

        "Please select or enter City / Town"

      );

      return false;

    }


    if (!pincode) {

      toast.error("Pincode is required");

      return false;

    }

    if (!/^\d{6}$/.test(pincode)) {

      toast.error(

        "Pincode must be exactly 6 digits"

      );

      return false;

    }

    return true;

  };


  const handleReset = () => {

    setFormData(initialFormData);

    setShowPassword(false);

  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    if (!validateForm()) {

      return;

    }

    try {

      setLoading(true);

      const token =

        localStorage.getItem("merchantToken") ||

        localStorage.getItem("token");


      const payload = {

        dc_name: formData.dc_name.trim(),

        dc_code: formData.dc_code.trim(),

        username: formData.username.trim(),

        password: formData.password,

        phone:

          formData.phone.trim() || null,

        email:

          formData.email.trim(),

        address:

          formData.address.trim() || null,

        city:

          formData.city.trim() || null,

        state:

          formData.state_name || null,

        pincode:

          formData.pincode.trim() || null,

      };

      console.log(

        "DC Create Payload:",

        payload

      );

      const response = await axios.post(

        DC_ONBOARDING_API,

        payload,

        {

          headers: {

            "Content-Type":

              "application/json",

            ...(token

              ? {

                  Authorization:

                    `Bearer ${token}`,

                  "x-auth-token":

                    token,

                }

              : {}),

          },

        }

      );

      if (response?.data?.success) {

        toast.success(

          response?.data?.message ||

            "DC created successfully"

        );

        handleReset();

        return;

      }

      toast.error(

        response?.data?.message ||

          "Failed to create Distribution Center"

      );

    } catch (error) {

      console.error(

        "Create DC Error:",

        error?.response?.data || error

      );

      toast.error(

        error?.response?.data?.message ||

          error?.response?.data?.error ||

          error?.message ||

          "Failed to create Distribution Center"

      );

    } finally {

      setLoading(false);

    }

  };


  const selectStyles = {

    control: (base, state) => ({

      ...base,

      minHeight: "46px",

      borderRadius: "10px",

      backgroundColor: isDarkMode

        ? "#171717"

        : "#ffffff",

      borderColor: state.isFocused

        ? "#554dc0"

        : isDarkMode

          ? "#404040"

          : "#d1d5db",

      boxShadow: state.isFocused

        ? "0 0 0 2px rgba(85,77,192,0.16)"

        : "none",

      color: isDarkMode

        ? "#f5f5f5"

        : "#111827",

      "&:hover": {

        borderColor:

          state.isFocused

            ? "#554dc0"

            : isDarkMode

              ? "#525252"

              : "#9ca3af",

      },

    }),

    valueContainer: (base) => ({

      ...base,

      color: isDarkMode

        ? "#f5f5f5"

        : "#111827",

    }),

    singleValue: (base) => ({

      ...base,

      color: isDarkMode

        ? "#f5f5f5"

        : "#111827",

    }),

    input: (base) => ({

      ...base,

      color: isDarkMode

        ? "#f5f5f5"

        : "#111827",

    }),

    placeholder: (base) => ({

      ...base,

      color: isDarkMode

        ? "#737373"

        : "#9ca3af",

    }),

    dropdownIndicator: (base) => ({

      ...base,

      color: isDarkMode

        ? "#a3a3a3"

        : "#6b7280",

    }),

    clearIndicator: (base) => ({

      ...base,

      color: isDarkMode

        ? "#a3a3a3"

        : "#6b7280",

    }),

    indicatorSeparator: (base) => ({

      ...base,

      backgroundColor: isDarkMode

        ? "#404040"

        : "#e5e7eb",

    }),

    menu: (base) => ({

      ...base,

      zIndex: 9999,

      backgroundColor: isDarkMode

        ? "#171717"

        : "#ffffff",

      border: `1px solid ${

        isDarkMode

          ? "#404040"

          : "#e5e7eb"

      }`,

      boxShadow: isDarkMode

        ? "0 12px 32px rgba(0,0,0,0.35)"

        : "0 12px 32px rgba(15,23,42,0.12)",

    }),

    menuList: (base) => ({

      ...base,

      maxHeight: "300px",

      backgroundColor: isDarkMode

        ? "#171717"

        : "#ffffff",

    }),

    option: (base, state) => ({

      ...base,

      cursor: "pointer",

      color: state.isSelected

        ? "#ffffff"

        : isDarkMode

          ? "#e5e5e5"

          : "#111827",

      backgroundColor:

        state.isSelected

          ? "#0446DB"

          : state.isFocused

            ? isDarkMode

              ? "#262626"

              : "#eff6ff"

            : isDarkMode

              ? "#171717"

              : "#ffffff",

      "&:active": {

        backgroundColor:

          "#0446DB",

        color: "#ffffff",

      },

    }),

    noOptionsMessage: (base) => ({

      ...base,

      color: isDarkMode

        ? "#a3a3a3"

        : "#6b7280",

    }),

  };


  const inputClass =

    "h-[46px] w-full rounded-[10px] border border-gray-300 bg-white pl-10 pr-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#554dc0] focus:ring-2 focus:ring-[#554dc0]/10 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500 dark:focus:border-[#7c72ff] dark:focus:ring-[#7c72ff]/20";


  return (

    <div className="flex h-[calc(100dvh-100px)] min-h-0 flex-col overflow-hidden text-gray-900 dark:bg-neutral-950 dark:text-neutral-100">


      


      <div className="min-h-0 flex-1 overflow-hidden px-4 pb-3 pt-3">

        <form

          onSubmit={handleSubmit}

          className="flex h-full min-h-0 flex-col overflow-hidden rounded-sm border border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-900"

        >


          <div className="z-10 shrink-0 border-b border-gray-200 bg-white px-6 py-4 dark:border-neutral-800 dark:bg-neutral-900 md:px-8">

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-[#554dc0] dark:bg-indigo-950/40 dark:text-indigo-300">

                <Building2 className="h-5 w-5" />

              </div>

              <div>

                <h2 className="text-xl font-semibold text-gray-900 dark:text-neutral-100">

                  Distribution Center Information

                </h2>

                <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">

                  Enter account and location details to onboard

                  a Distribution Center.

                </p>

              </div>

            </div>

          </div>


          <div className="grid min-h-0 flex-1 grid-cols-1 gap-8 overflow-y-auto overscroll-contain p-6 md:p-8 lg:grid-cols-2">


            <div className="space-y-5">

              <div className="mb-6">

                <h3 className="text-base font-semibold text-gray-900 dark:text-neutral-100">

                  Account Details

                </h3>

                <p className="mt-1 text-xs text-gray-500 dark:text-neutral-400">

                  Basic Distribution Center and login

                  information.

                </p>

              </div>


              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-neutral-300">

                  Distribution Center Name{" "}

                  <span className="text-red-500">

                    *

                  </span>

                </label>

                <div className="relative">

                  <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-neutral-500" />

                  <input

                    type="text"

                    name="dc_name"

                    value={formData.dc_name}

                    onChange={handleChange}

                    placeholder="Enter distribution center name"

                    autoComplete="organization"

                    className={inputClass}

                  />

                </div>

              </div>


              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-neutral-300">

                  Distribution Center Code{" "}

                  <span className="text-red-500">

                    *

                  </span>

                </label>

                <div className="relative">

                  <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-neutral-500" />

                  <input

                    type="text"

                    name="dc_code"

                    value={formData.dc_code}

                    onChange={handleDCCodeChange}

                    placeholder="Example: DC-UP-001"

                    autoComplete="off"

                    className={inputClass}

                  />

                </div>

                <p className="mt-1.5 text-xs text-gray-400 dark:text-neutral-500">

                  DC code must be unique.

                </p>

              </div>


              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-neutral-300">

                  Username{" "}

                  <span className="text-red-500">

                    *

                  </span>

                </label>

                <div className="relative">

                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-neutral-500" />

                  <input

                    type="text"

                    name="username"

                    value={formData.username}

                    onChange={handleUsernameChange}

                    placeholder="Enter login username"

                    autoComplete="username"

                    className={inputClass}

                  />

                </div>

              </div>


              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-neutral-300">

                  Email Address{" "}

                  <span className="text-red-500">

                    *

                  </span>

                </label>

                <div className="relative">

                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-neutral-500" />

                  <input

                    type="email"

                    name="email"

                    value={formData.email}

                    onChange={handleChange}

                    placeholder="dc@example.com"

                    autoComplete="email"

                    className={inputClass}

                  />

                </div>

              </div>


              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-neutral-300">

                  Phone Number

                </label>

                <div className="relative">

                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-neutral-500" />

                  <input

                    type="text"

                    inputMode="numeric"

                    maxLength={10}

                    name="phone"

                    value={formData.phone}

                    onChange={handlePhoneChange}

                    placeholder="10 digit mobile number"

                    autoComplete="tel"

                    className={inputClass}

                  />

                </div>

              </div>


              <div>

                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-neutral-300">

                  Password{" "}

                  <span className="text-red-500">

                    *

                  </span>

                </label>

                <div className="relative">

                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-neutral-500" />

                  <input

                    type={

                      showPassword

                        ? "text"

                        : "password"

                    }

                    name="password"

                    value={formData.password}

                    onChange={handleChange}

                    placeholder="Minimum 6 characters"

                    autoComplete="new-password"

                    className={`${inputClass} pr-11`}

                  />

                  <button

                    type="button"

                    onClick={() =>

                      setShowPassword(

                        (prev) => !prev

                      )

                    }

                    className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center justify-center text-gray-400 transition hover:text-gray-700 dark:text-neutral-500 dark:hover:text-neutral-200"

                  >

                    {showPassword ? (

                      <EyeOff className="h-5 w-5" />

                    ) : (

                      <Eye className="h-5 w-5" />

                    )}

                  </button>

                </div>

              </div>

            </div>


            <div>

              <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-5 dark:border-neutral-800 dark:bg-neutral-950/60">

                <div className="mb-5 flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-[#554dc0] dark:bg-indigo-950/50 dark:text-indigo-300">

                    <MapPin className="h-4 w-4" />

                  </div>

                  <div>

                    <h3 className="font-semibold text-gray-900 dark:text-neutral-100">

                      Distribution Center Location

                    </h3>

                    <p className="text-xs text-gray-500 dark:text-neutral-400">

                      Select state and search or enter City /

                      Town.

                    </p>

                  </div>

                </div>

                <div className="space-y-5">


                  <div>

                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-neutral-300">

                      Address{" "}

                      <span className="text-red-500">

                        *

                      </span>

                    </label>

                    <div className="relative">

                      <MapIcon className="absolute left-3 top-3.5 h-4 w-4 text-gray-400 dark:text-neutral-500" />

                      <textarea

                        name="address"

                        value={formData.address}

                        onChange={handleChange}

                        rows={4}

                        placeholder="Enter complete Distribution Center address"

                        className="w-full resize-none rounded-[10px] border border-gray-300 bg-white py-3 pl-10 pr-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#554dc0] focus:ring-2 focus:ring-[#554dc0]/10 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:placeholder:text-neutral-500"

                      />

                    </div>

                  </div>


                  <div>

                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-neutral-300">

                      State{" "}

                      <span className="text-red-500">

                        *

                      </span>

                    </label>

                    <Select

                      options={stateOptions}

                      value={selectedState}

                      onChange={handleStateChange}

                      isSearchable

                      isClearable

                      placeholder="Search or select state"

                      styles={selectStyles}

                      noOptionsMessage={() =>

                        "No state found"

                      }

                    />

                  </div>


                  <div>

                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-neutral-300">

                      City / Town{" "}

                      <span className="text-red-500">

                        *

                      </span>

                    </label>

                    <CreatableSelect

                      options={cityOptions}

                      value={selectedCity}

                      onChange={handleCityChange}

                      onCreateOption={handleCreateCity}

                      isValidNewOption={isValidNewCity}

                      isSearchable

                      isClearable

                      placeholder="Search or type City / Town"

                      styles={selectStyles}

                      formatCreateLabel={(

                        inputValue

                      ) =>

                        `Use "${inputValue}" as City / Town`

                      }

                      noOptionsMessage={({

                        inputValue,

                      }) =>

                        inputValue

                          ? `No result found for "${inputValue}"`

                          : "Search City / Town"

                      }

                    />

                  </div>


                  <div>

                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-neutral-300">

                      Pincode{" "}

                      <span className="text-red-500">

                        *

                      </span>

                    </label>

                    <div className="relative">

                      <Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-neutral-500" />

                      <input

                        type="text"

                        inputMode="numeric"

                        maxLength={6}

                        name="pincode"

                        value={formData.pincode}

                        onChange={handlePincodeChange}

                        placeholder="6 digit pincode"

                        className={inputClass}

                      />

                    </div>

                  </div>

                </div>

              </div>

            </div>

          </div>


          <div className="z-10 flex shrink-0 flex-col gap-3 border-t border-gray-200 bg-gray-50 px-6 py-3 dark:border-neutral-800 dark:bg-neutral-950 sm:flex-row sm:items-center sm:justify-between md:px-8">

            <p className="text-xs text-gray-500 dark:text-neutral-500">

              Fields marked with{" "}

              <span className="text-red-500">

                *

              </span>{" "}

              are required.

            </p>

            <div className="flex items-center gap-3">


              <button

                type="button"

                disabled={loading}

                onClick={handleReset}

                className="h-11 rounded-sm border border-gray-300 bg-white px-5 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800"

              >

                Reset

              </button>


              <button

                type="submit"

                disabled={loading}

                className="flex h-11 min-w-[190px] items-center justify-center gap-2 rounded-sm bg-[#0446DB] px-6 text-sm font-semibold text-white shadow-md transition hover:bg-[#0339b5] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"

              >

                {loading ? (

                  <>

                    <Loader2 className="h-4 w-4 animate-spin" />

                    Creating DC...

                  </>

                ) : (

                  <>

                    <Building2 className="h-4 w-4" />

                    Create Distribution Center

                  </>

                )}

              </button>

            </div>

          </div>

        </form>

      </div>

    </div>

  );

}

export default DistributionCenterOnboarding;
