
import { useCallback, useEffect, useState } from "react";

import axios from "axios";

import Select from "react-select";

import { AlertCircleIcon, BadgeCheckIcon, CheckIcon, Loader2 } from "lucide-react"

import { TbFileInfo } from "react-icons/tb";

import { FaRegFileImage } from "react-icons/fa6";

import { toast } from "react-toastify";

import { Button } from "@/components/ui/button"

import {

  Drawer,

  DrawerClose,

  DrawerContent,

  DrawerFooter,

  DrawerHeader,

  DrawerTitle,

  DrawerTrigger,

} from "@/components/ui/drawer"

import { Calendar } from "@/components/ui/calendar"

import { Field, FieldLabel } from "@/components/ui/field"

import {

  Popover,

  PopoverContent,

  PopoverTrigger,

} from "@/components/ui/popover"

import { FaFilter } from "react-icons/fa";

const baseURL = import.meta.env.VITE_BASE_URL;

const options = [

  { value: "Bangalore", label: "Bangalore" },

  { value: "Delhi", label: "Delhi" },

  { value: "Mumbai", label: "Mumbai" },

  { value: "Kolkata", label: "Kolkata" },

  { value: "Chennai", label: "Chennai" },

  { value: "Hyderabad", label: "Hyderabad" },

  { value: "Pune", label: "Pune" },

  { value: "Ahmedabad", label: "Ahmedabad" },

  { value: "Gurugram", label: "Gurugram" },

  { value: "Noida", label: "Noida" },

  { value: "Faridabad", label: "Faridabad" },

  { value: "Ghaziabad", label: "Ghaziabad" },

  { value: "Jaipur", label: "Jaipur" },

  { value: "Lucknow", label: "Lucknow" },

  { value: "Kanpur", label: "Kanpur" },

  { value: "Nagpur", label: "Nagpur" },

  { value: "Indore", label: "Indore" },

  { value: "Bhopal", label: "Bhopal" },

  { value: "Surat", label: "Surat" },

  { value: "Vadodara", label: "Vadodara" },

  { value: "Rajkot", label: "Rajkot" },

  { value: "Nashik", label: "Nashik" },

  { value: "Thane", label: "Thane" },

  { value: "Vijayawada", label: "Vijayawada" },

  { value: "Visakhapatnam", label: "Visakhapatnam" },

  { value: "Coimbatore", label: "Coimbatore" },

  { value: "Madurai", label: "Madurai" },

  { value: "Kochi", label: "Kochi" },

  { value: "Trivandrum", label: "Trivandrum" },

  { value: "Kozhikode", label: "Kozhikode" },

  { value: "Chandigarh", label: "Chandigarh" },

  { value: "Mohali", label: "Mohali" },

  { value: "Panchkula", label: "Panchkula" },

  { value: "Patna", label: "Patna" },

  { value: "Ranchi", label: "Ranchi" },

  { value: "Jamshedpur", label: "Jamshedpur" },

  { value: "Bhubaneswar", label: "Bhubaneswar" },

  { value: "Cuttack", label: "Cuttack" },

  { value: "Guwahati", label: "Guwahati" },

  { value: "Shillong", label: "Shillong" },

  { value: "Imphal", label: "Imphal" },

  { value: "Aizawl", label: "Aizawl" },

  { value: "Gangtok", label: "Gangtok" },

  { value: "Dehradun", label: "Dehradun" },

  { value: "Haridwar", label: "Haridwar" },

  { value: "Rishikesh", label: "Rishikesh" },

  { value: "Agra", label: "Agra" },

  { value: "Varanasi", label: "Varanasi" },

  { value: "Prayagraj", label: "Prayagraj" },

  { value: "Meerut", label: "Meerut" },

  { value: "Aligarh", label: "Aligarh" },

  { value: "Moradabad", label: "Moradabad" },

  { value: "Bareilly", label: "Bareilly" },

  { value: "Jodhpur", label: "Jodhpur" },

  { value: "Udaipur", label: "Udaipur" },

  { value: "Kota", label: "Kota" },

  { value: "Ajmer", label: "Ajmer" },

  { value: "Amritsar", label: "Amritsar" },

  { value: "Ludhiana", label: "Ludhiana" },

  { value: "Jalandhar", label: "Jalandhar" },

  { value: "Mangaluru", label: "Mangaluru" },

  { value: "Mysuru", label: "Mysuru" },

  { value: "Hubballi", label: "Hubballi" },

  { value: "Belagavi", label: "Belagavi" },

  { value: "Raipur", label: "Raipur" },

  { value: "Bhilai", label: "Bhilai" },

  { value: "Bilaspur", label: "Bilaspur" },

  { value: "Jabalpur", label: "Jabalpur" },

  { value: "Gwalior", label: "Gwalior" },

  { value: "Tirupati", label: "Tirupati" },

  { value: "Warangal", label: "Warangal" },

  { value: "Nellore", label: "Nellore" },

  { value: "Tirunelveli", label: "Tirunelveli" },

  { value: "Salem", label: "Salem" },

  { value: "Trichy", label: "Trichy" },

  { value: "Allahabad", label: "Allahabad" },

  { value: "Srinagar", label: "Srinagar" },

  { value: "Jammu", label: "Jammu" },

  { value: "Port Blair", label: "Port Blair" },

  { value: "Panaji", label: "Panaji" },

  { value: "Margao", label: "Margao" },

  { value: "Puducherry", label: "Puducherry" },

];

function VendorAllRiders() {

  const [open, setOpen] = useState(false)

  const [endopen, setEndOpen] = useState(false)

  const [ridersData, setRidersData] = useState([]);

  const [loading, setLoading] = useState(false);

  const [popup, setPopup] = useState(null);

  const [changePasswordPopup, setChangePasswordPopup] = useState(null);

  const [newPassword, setNewPassword] = useState({

    id: "",

    password: "",

    confirmPassword: "",

  });

  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState(null);

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [advanceFilters, setAdvanceFilters] = useState({

    rider_id: "",

    facility_city: "",

    facility_zone: "",

    start_date: "",

    end_date: "",

  });

  const [filterUpdate, setFilterUpdate] = useState(false);

  const resetAdvanceFilters = () => {

    setAdvanceFilters({

      rider_id: "",

      facility_city: "",

      facility_zone: "",

    });

  };

  const handleChange = (e) => {

    const { name, value, files } = e.target;

    if (e.target.type === "file") {

      setFormData({ ...formData, [name]: files[0] });

    } else {

      setFormData({ ...formData, [name]: value });

    }

  };

  //Change

  const handleSave = async () => {

    setLoading(true);

    try {

      const data = new FormData();

      for (const key in formData) {

        data.append(key, formData[key]);

      }

      await axios.post(

        `${baseURL}/api/vendor/updateRiderProfile/${formData.id}`,

        data,

        {

          headers: {

            Authorization: `Bearer ${localStorage.getItem("token")}`,

            "Content-Type": "multipart/form-data",

          },

        }

      );

      setIsEditing(false);

      setPopup(null);

      fetchRiders();

    } catch (err) {

      toast.error(err.response?.data?.message || err.message || "Error saving data");

    } finally {

      setLoading(false);

    }

  };

  const fetchRiders = useCallback(async () => {

    setLoading(true);

    try {

      const res = await axios.get(`${baseURL}/api/vendor/getVendorRiders`, {

        params: {

          rider_id: advanceFilters?.rider_id,

          facility_city: advanceFilters?.facility_city,

          facility_zone: advanceFilters?.facility_zone,

          start_date: advanceFilters?.start_date,

          end_date: advanceFilters?.end_date,

        },

        headers: {

          Authorization: `Bearer ${localStorage.getItem("token")}`,

        },

      });

      setRidersData(res.data.data);

    } catch (err) {

      toast.error(err.response?.data?.message || err.message || "Error fetching riders");

    } finally {

      setLoading(false);

    }

  }, [advanceFilters, baseURL]);

  const changeVerificationStatus = async (id, status) => {

    setLoading(true);

    try {

      await axios.post(

        `${baseURL}/api/vendor/markRiderVerified/${id}`,

        {

          account_status: status,

        },

        {

          headers: {

            Authorization: `Bearer ${localStorage.getItem("token")}`,

          },

        }

      );

      fetchRiders();

    } catch (err) {

      toast.error(err.response?.data?.message || err.message || "Error while changing status");

    } finally {

      setLoading(false);

    }

  };

  const changeActiveStatus = async (id, status) => {

    setLoading(true);

    try {

      await axios.post(

        `${baseURL}/api/vendor/markRiderActive/${id}`,

        {

          is_active: status,

        },

        {

          headers: {

            Authorization: `Bearer ${localStorage.getItem("token")}`,

          },

        }

      );

      fetchRiders();

    } catch (err) {

      toast.error(err.response?.data?.message || err.message || "Error while changing status");

    } finally {

      setLoading(false);

    }

  };

  const changeAvailabilityStatus = async (id, status) => {

    setLoading(true);

    try {

      await axios.post(

        `${baseURL}/api/vendor/markRiderAvailable/${id}`,

        {

          is_available: status,

        },

        {

          headers: {

            Authorization: `Bearer ${localStorage.getItem("token")}`,

          },

        }

      );

      fetchRiders();

    } catch (err) {

      toast.error(err.response?.data?.message || err.message || "Error while changing status");

    } finally {

      setLoading(false);

    }

  };

  const handlePasswordChange = () => {

    setLoading(true);

    try {

      const res = axios.post(

        `${baseURL}/api/vendor/changeRiderPassword/${newPassword.id}`,

        {

          password: newPassword.password,

          confirmPassword: newPassword.confirmPassword,

        },

        {

          headers: {

            Authorization: `Bearer ${localStorage.getItem("token")}`,

          },

        }

      );

      setChangePasswordPopup(null);

      setNewPassword({

        id: "",

        password: "",

        newPassword: "",

      });

      toast.success("Password Changed successfully");

    } catch (err) {

      toast.error(err.response?.data?.message || err.message || "Error in updating password");

    } finally {

      setLoading(false);

    }

  };

  const verifyKyc = async () => {

    setLoading(true);

    try {

      const data = new FormData();

      // for (const key in formData) {

      //   data.append(key, formData[key]);

      //   if (data.get("kyc_verified") === "0") {

      //   }

      // }

      data.set("kyc_verified", "1");









      const res = await axios.post(

        `${baseURL}/api/vendor/updateRiderProfile/${formData.id}`,

        data,

        {

          headers: {

            Authorization: `Bearer ${localStorage.getItem("token")}`,

            "Content-Type": "multipart/form-data",

          },

        }

      );





      setIsEditing(false);

      setPopup(null);

      fetchRiders();

    } catch (err) {

      toast.error(err.response?.data?.message || err.message || "Error saving data");

    } finally {

      setLoading(false);

    }

  }

  const formatToDMY = (dateStr) => {

    if (!dateStr) return "";

    const date = new Date(dateStr);

    const dd = String(date.getDate()).padStart(2, "0");

    const mm = String(date.getMonth() + 1).padStart(2, "0");

    const yyyy = date.getFullYear();

    return `${dd}/${mm}/${yyyy}`;

  };





  useEffect(() => {

    fetchRiders();

  }, []);

  useEffect(() => {

    if (popup) {

      setFormData({ ...popup });

    }

  }, [popup]);

  useEffect(() => {

    if (filterUpdate) {

      fetchRiders();

      setFilterUpdate(false);

    }

  }, [filterUpdate]);


      const [loadingPage, setLoadingPage] = useState(true);

useEffect(() => {
  const timer = setTimeout(() => {
    setLoadingPage(false);
  }, 2000);

  return () => clearTimeout(timer);
}, []);

  return (

    <>
    {
      loadingPage ?(
         <div className=" w-full h-[90vh] flex justify-center items-center">
          <div>
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <p className="mt-2">Loading Rider Details...</p>
          </div>
        </div>
      ):(

      <div className="min-h-screen w-full bg-[#F6F8FC] text-gray-900 dark:bg-neutral-950 dark:text-white">



        {/* Heading Strip */}

        <div className=" px-4 py-5  dark:border-neutral-800 dark:bg-neutral-900 sm:px-6 lg:px-8">

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            {/* Heading */}

            <h1 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white sm:text-2xl">Rider Details</h1>

            <div className="flex flex-wrap items-center gap-2">

              <Drawer direction="right"

                open={isFilterOpen}

                onOpenChange={setIsFilterOpen}

              >

                <DrawerTrigger asChild>

                  <Button variant="outline"

                    className="h-10 gap-2 rounded-sm border-gray-200 bg-white px-4 text-sm font-semibold text-[#0446DB] shadow-sm hover:border-[#0446DB]/30 hover:bg-[#0446DB]/5 dark:border-neutral-700 dark:bg-neutral-800 dark:text-blue-400 dark:hover:bg-[#0446DB]/10"

                  >

                    <FaFilter className="text-sm" />

                    <span>Filter</span>

                  </Button>

                </DrawerTrigger>

                <DrawerContent>

                  <DrawerHeader>

                    <DrawerTitle>Advance Filters</DrawerTitle>

                    {/* <DrawerDescription>Set your daily activity goal.</DrawerDescription> */}

                  </DrawerHeader>

                  <form

                    onSubmit={(e) => {

                      e.preventDefault();





                      setFilterUpdate((prev) => !prev);

                      setIsFilterOpen(false); // Drawer Close

                    }}

                  >

                    <div className="no-scrollbar flex-1 overflow-y-auto px-5 py-2">

                      <div className="w-full py-3">

                        <div className="flex flex-col gap-4">

                          {/* Rider ID */}

                          <Field className="mx-auto w-full">

                            <FieldLabel htmlFor="enddate">Start Date</FieldLabel>

                            <Popover open={open} onOpenChange={setOpen}>

                              <PopoverTrigger asChild>

                                <Button

                                  variant="outline"

                                  id="enddate"

                                  className="justify-start w-full font-normal"

                                >

                                  {advanceFilters.start_date ? formatToDMY(advanceFilters.start_date) : "Select date"}

                                </Button>

                              </PopoverTrigger>

                              <PopoverContent className="w-auto overflow-hidden p-0" align="start">

                                <Calendar

                                  mode="single"

                                  selected={advanceFilters.start_date}

                                  defaultMonth={advanceFilters.start_date}

                                  captionLayout="dropdown"

                                  onSelect={(date) => {

                                    const formattedDate = `${date.getFullYear()}/${(date.getMonth() + 1)

                                      .toString()

                                      .padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}`;

                                    setAdvanceFilters({

                                      ...advanceFilters,

                                      start_date: formattedDate

                                    })

                                    setOpen(false)

                                  }}

                                />

                              </PopoverContent>

                            </Popover>

                          </Field>

                          <Field className="mx-auto w-full">

                            <FieldLabel htmlFor="enddate">End Date</FieldLabel>

                            <Popover open={endopen} onOpenChange={setEndOpen}>

                              <PopoverTrigger asChild>

                                <Button

                                  variant="outline"

                                  id="enddate"

                                  className="justify-start w-full font-normal"

                                >

                                  {advanceFilters.end_date ? formatToDMY(advanceFilters.end_date) : "Select date"}

                                </Button>

                              </PopoverTrigger>

                              <PopoverContent className="w-auto overflow-hidden p-0" align="start">

                                <Calendar

                                  mode="single"

                                  selected={advanceFilters.end_date}

                                  defaultMonth={advanceFilters.end_date}

                                  captionLayout="dropdown"

                                  onSelect={(date) => {

                                    const formattedDate = `${date.getFullYear()}/${(date.getMonth() + 1)

                                      .toString()

                                      .padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}`;

                                    setAdvanceFilters({

                                      ...advanceFilters,

                                      end_date: formattedDate

                                    })

                                    setEndOpen(false)

                                  }}

                                />

                              </PopoverContent>

                            </Popover>

                          </Field>

                          <div className=" w-full">

                            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">

                              Rider ID

                            </label>

                            <input

                              type="text"

                              value={advanceFilters.rider_id}

                              onChange={(e) =>

                                setAdvanceFilters((prev) => ({

                                  ...prev,

                                  rider_id: e.target.value,

                                }))

                              }

                              placeholder="Enter Id(s)"

                              className="h-11 w-full rounded-sm border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"

                            />

                          </div>

                          {/* Facility City */}

                          <div className=" w-full">

                            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">

                              Facility City

                            </label>

                            <Select

                              required

                              options={options}

                              isSearchable

                              value={options.find(

                                (option) => option.value === advanceFilters?.facility_city

                              )}

                              onChange={(selectedOption) =>

                                setAdvanceFilters((prev) => ({

                                  ...prev,

                                  facility_city: selectedOption?.value || "",

                                }))

                              }

                              placeholder="Select City"

                              className="w-full rounded-sm text-sm dark:text-black"

                            />

                          </div>

                          {/* Facility Zone */}

                          <div className=" w-full">

                            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400">

                              Facility Zone

                            </label>

                            <input

                              type="text"

                              value={advanceFilters.facility_zone}

                              onChange={(e) =>

                                setAdvanceFilters((prev) => ({

                                  ...prev,

                                  facility_zone: e.target.value,

                                }))

                              }

                              placeholder="Enter Facility Zone"

                              className="h-11 w-full rounded-sm border border-gray-200 bg-white px-3 text-sm text-gray-800 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"

                            />

                          </div>

                          {/* Update Button */}

                          <div className="w-full flex gap-2 pt-2">

                            <button

                              onClick={() => {

                                setFilterUpdate(true);

                                setIsFilterOpen(false);

                              }}

                              className="h-10 w-1/2 rounded-sm bg-[#0446DB] px-4 text-sm font-semibold text-white transition hover:bg-[#0339B5]"

                            >

                              Filter

                            </button>

                            <button

                              onClick={() => {

                                resetAdvanceFilters();

                                setFilterUpdate(true);

                                setIsFilterOpen(false);

                              }}

                              className="h-10 w-1/2 rounded-sm bg-[#0446DB] px-4 text-sm font-semibold text-white transition hover:bg-[#0339B5]"

                            >

                              Reset

                            </button>

                          </div>

                        </div>

                      </div>

                    </div>

                  </form>

                  <DrawerFooter>

                    <DrawerClose asChild>

                      <Button variant="outline">Cancel</Button>

                    </DrawerClose>

                  </DrawerFooter>

                </DrawerContent>

              </Drawer>





            </div>

          </div>

        </div>

        {/* Main Content */}

        <div className="overflow-hidden rounded-sm border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">

          <div className="w-full overflow-x-auto">

            <table className="min-w-[1050px] w-full border-collapse text-left">

              <thead className="border-b border-gray-200 bg-gray-50/80 text-center text-gray-500 dark:border-neutral-800 dark:bg-neutral-800/60 dark:text-neutral-400">

                <tr>

                  <th className="whitespace-nowrap px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider">RIDER ID</th>

                  <th className="whitespace-nowrap px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider">RIDER NAME</th>

                  <th className="whitespace-nowrap px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider">ACCOUNT STATUS</th>

                  <th className="whitespace-nowrap px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider">ACTIVE</th>

                  <th className="whitespace-nowrap px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider">AVAILABLE</th>

                  <th className="whitespace-nowrap px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider">RIDER DOCUMENT</th>

                  <th className="whitespace-nowrap px-5 py-3.5 text-[11px] font-semibold uppercase tracking-wider">CHANGE PASSWORD</th>

                </tr>

              </thead>

              <tbody className="divide-y divide-gray-100 text-gray-700 dark:divide-neutral-800 dark:text-neutral-300">

                {

                  loading ? (

                    <>

                      <tr key={"No record found"}>

                        <td

                          colSpan="6"

                          className="text-center px-6 py-6 text-gray-500"

                        >

                          <div className=" w-full  flex justify-center items-center">

                            <div>

                              <Loader2 className="h-8 w-8 animate-spin mx-auto" />

                              <p className="mt-2">Loading Remittance Record...</p>

                            </div>

                          </div>

                        </td>

                      </tr>

                    </>

                  ) : ridersData.length == 0 ? (

                    <>

                      <tr key={"No record found"}>

                        <td

                          colSpan="6"

                          className="text-center px-6 py-6 text-gray-500"

                        >

                          No records found.

                        </td>

                      </tr>

                    </>

                  ) : (

                    ridersData.map((rider) => (

                      <tr

                        key={rider.id}

                        className="text-center transition-colors duration-200 hover:bg-gray-50/80 dark:hover:bg-neutral-800/50"

                      >

                        <td className="px-6 py-4">

                          FP_{rider.vendor_id}_{rider.id}

                        </td>

                        <td className="px-6 py-4">{rider.name}</td>

                        <td className="">

                          <button

                            onClick={() => {

                              changeVerificationStatus(

                                rider.id,

                                rider.account_status == 1 ? 0 : 1

                              );

                            }}

                            className={`relative inline-flex h-7 w-12 sm:h-8 sm:w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-200 ${rider.account_status ? "bg-green-500" : "bg-gray-300"

                              }`}

                          >

                            <span

                              className={`inline-block h-5 w-5 sm:h-6 sm:w-6 transform rounded-full bg-white transition-transform duration-300 shadow-sm ${rider.account_status

                                ? "translate-x-6 sm:translate-x-7"

                                : "translate-x-1"

                                }`}

                            />

                          </button>

                        </td>

                        <td className="">

                          <button

                            onClick={() => {

                              if (rider.account_status) {

                                changeActiveStatus(

                                  rider.id,

                                  rider.is_active == 1 ? 0 : 1

                                );

                              }

                            }}

                            className={`relative inline-flex h-7 w-12 sm:h-8 sm:w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-200 ${rider.is_active ? "bg-green-500" : "bg-gray-300"

                              }`}

                          >

                            <span

                              className={`inline-block h-5 w-5 sm:h-6 sm:w-6 transform rounded-full bg-white transition-transform duration-300 shadow-sm ${rider.is_active

                                ? "translate-x-6 sm:translate-x-7"

                                : "translate-x-1"

                                }`}

                            />

                          </button>

                        </td>

                        <td className="">

                          <button

                            onClick={() => {

                              if (rider.account_status && rider.is_active) {

                                changeAvailabilityStatus(

                                  rider.id,

                                  rider.is_available == 1 ? 0 : 1

                                );

                              }

                            }}

                            className={`relative inline-flex h-7 w-12 sm:h-8 sm:w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-200 ${rider.is_available ? "bg-green-500" : "bg-gray-300"

                              }`}

                          >

                            <span

                              className={`inline-block h-5 w-5 sm:h-6 sm:w-6 transform rounded-full bg-white transition-transform duration-300 shadow-sm ${rider.is_available

                                ? "translate-x-6 sm:translate-x-7"

                                : "translate-x-1"

                                }`}

                            />

                          </button>

                        </td>

                        <td

                          className="text-xl text-[#0446DB] hover:cursor-pointer hover:text-[#0339B5] dark:text-blue-400"

                          onClick={() => {

                            setPopup(rider);

                          }}

                        >

                          <TbFileInfo />

                        </td>

                        <td>

                          <button

                            className="rounded-sm border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-semibold text-[#0446DB] transition hover:cursor-pointer hover:bg-blue-100 dark:border-blue-500/20 dark:bg-blue-500/10 dark:text-blue-400"

                            onClick={() => {

                              setNewPassword({

                                id: rider.id,

                              });

                              setChangePasswordPopup(rider);

                            }}

                          >

                            Change Password

                          </button>

                        </td>

                      </tr>

                    ))

                  )

                }

              </tbody>

            </table>

          </div>

        </div>

        {popup && (

          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px] backdrop-blur-[2px]">

            <div className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-sm border border-gray-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">

              <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4 dark:border-neutral-800 dark:bg-neutral-900">

                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">

                  Rider Details

                </h2>

              </div>





              <form

                onSubmit={(e) => {

                  e.preventDefault();

                  handleSave();

                }}

                className="max-h-[calc(92vh-72px)] space-y-5 overflow-y-auto bg-white px-6 py-5 dark:bg-neutral-900"

              >

                {/* Basic Info */}

                <section>

                  <h3 className="mb-4 border-b border-gray-200 pb-2 text-sm font-semibold uppercase tracking-wide text-[#0446DB] dark:border-neutral-800 dark:text-blue-400">

                    Basic Details

                  </h3>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                    <div>

                      <strong>ID:</strong> FP_{popup.vendor_id}_{popup.id}

                    </div>

                    <div>

                      <strong>Account Status:</strong>{" "}

                      {popup.account_status ? (

                        <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">

                          Active

                        </span>

                      ) : (

                        <span className="inline-flex rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">

                          Not Active

                        </span>

                      )}

                    </div>

                    <div>

                      <strong>Active:</strong>{" "}

                      {popup.is_active ? (

                        <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">

                          Active

                        </span>

                      ) : (

                        <span className="inline-flex rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">

                          Not Active

                        </span>

                      )}

                    </div>

                    <div>

                      <strong>Availability:</strong>{" "}

                      {popup.is_available ? (

                        <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">

                          Available

                        </span>

                      ) : (

                        <span className="inline-flex rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">

                          Not Available

                        </span>

                      )}

                    </div>

                    <div>

                      <strong>KYC:</strong>{" "}

                      {popup?.kyc_verified === '1' ? (

                        <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400">

                          KYC Verified

                        </span>

                      ) : (

                        <span className="inline-flex rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-700 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">

                          KYC Not Verified

                        </span>

                      )}

                    </div>

                    <div>

                    </div>

                    <div>

                      <strong>Rider Name:</strong>

                      <input

                        name="name"

                        value={formData?.name || ""}

                        onChange={handleChange}

                        disabled={!isEditing}

                        placeholder={formData?.name || "NA"}

                        className={`h-10 w-full rounded-sm border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:disabled:bg-neutral-800/60 ${!isEditing && "cursor-not-allowed"

                          }`}

                      />

                    </div>

                    <div>

                      <strong>Address:</strong>

                      <input

                        name="address_line"

                        value={formData?.address_line || ""}

                        onChange={handleChange}

                        disabled={!isEditing}

                        placeholder={formData?.address_line || "NA"}

                        className={`h-10 w-full rounded-sm border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:disabled:bg-neutral-800/60 ${!isEditing && "cursor-not-allowed"

                          }`}

                      />

                    </div>

                    <div>

                      <strong>City:</strong>

                      <input

                        name="city"

                        value={formData?.city || ""}

                        onChange={handleChange}

                        disabled={!isEditing}

                        placeholder={formData?.city || "NA"}

                        className={`h-10 w-full rounded-sm border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:disabled:bg-neutral-800/60 ${!isEditing && "cursor-not-allowed"

                          }`}

                      />

                    </div>

                    <div>

                      <strong>State:</strong>

                      <input

                        name="state"

                        value={formData?.state || ""}

                        onChange={handleChange}

                        disabled={!isEditing}

                        placeholder={formData?.state || "NA"}

                        className={`h-10 w-full rounded-sm border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:disabled:bg-neutral-800/60 ${!isEditing && "cursor-not-allowed"

                          }`}

                      />

                    </div>

                    <div>

                      <strong>Pincode:</strong>

                      <input

                        name="pincode"

                        value={formData?.pincode || ""}

                        onChange={handleChange}

                        disabled={!isEditing}

                        placeholder={formData?.pincode || "NA"}

                        className={`h-10 w-full rounded-sm border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:disabled:bg-neutral-800/60 ${!isEditing && "cursor-not-allowed"

                          }`}

                      />

                    </div>

                    <div>

                      <strong>Facility City:</strong>

                      <Select

                        isDisabled={!isEditing}

                        required

                        options={options}

                        isSearchable

                        value={options.find(

                          (option) => option.value === formData?.facility_city

                        )}

                        onChange={(selectedOption) =>

                          setFormData((prev) => ({

                            ...prev,

                            facility_city: selectedOption?.value || "",

                          }))

                        }

                        placeholder={formData?.facility_city || "NA"}

                        className="border rounded-md text-sm w-[100%]"

                      />

                    </div>

                    <div>

                      <strong>Facility Zone:</strong>

                      <input

                        name="facility_zone"

                        value={formData?.facility_zone || ""}

                        onChange={handleChange}

                        disabled={!isEditing}

                        placeholder={formData?.facility_zone || "NA"}

                        className={`h-10 w-full rounded-sm border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:disabled:bg-neutral-800/60 ${!isEditing && "cursor-not-allowed"

                          }`}

                      />

                    </div>

                    <div>

                      <strong>Phone No:</strong>

                      <input

                        name="phone"

                        value={formData?.phone || ""}

                        onChange={handleChange}

                        disabled={!isEditing}

                        placeholder={formData?.phone || "NA"}

                        className={`h-10 w-full rounded-sm border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:disabled:bg-neutral-800/60 ${!isEditing && "cursor-not-allowed"

                          }`}

                      />

                    </div>

                    <div>

                      <strong>Email:</strong>

                      <input

                        name="email"

                        value={formData?.email || ""}

                        onChange={handleChange}

                        disabled={!isEditing}

                        placeholder={formData?.email || "NA"}

                        className={`h-10 w-full rounded-sm border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:disabled:bg-neutral-800/60 ${!isEditing && "cursor-not-allowed"

                          }`}

                      />

                    </div>

                  </div>

                </section>

                {/* Document Info */}

                <section className="rounded-sm border border-gray-200 bg-gray-50/40 p-4 dark:border-neutral-800 dark:bg-neutral-800/30">

                  <h3 className="mb-4 border-b border-gray-200 pb-2 text-sm font-semibold uppercase tracking-wide text-[#0446DB] dark:border-neutral-800 dark:text-blue-400">

                    KYC Details

                  </h3>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                    <div>

                      <strong>Type:</strong> {popup.document_type || "N/A"}

                    </div>

                    <div>

                      <strong>ID:</strong> {popup.document_id}

                    </div>

                    <div>

                      <strong>File:</strong>{" "}

                      {/* ""popup.document_image"" */}

                      {popup.document_image ? (

                        <div>

                          <div>

                            <a

                              href={`${baseURL}/${popup.document_image}`}

                              target="_blank"

                              rel="noopener noreferrer"

                              className="font-medium text-[#0446DB] hover:underline dark:text-blue-400"

                            >

                              <FaRegFileImage className="inline text-xl" />

                            </a>

                          </div>

                          <div>

                            {

                              popup?.kyc_verified === "0" ? (

                                <button

                                  type="button"

                                  onClick={() => verifyKyc()}

                                  className="bg-red-500 text-white flex items-center gap-1 px-12 py-2 mt-6 rounded"><BadgeCheckIcon />Verify KYC</button>

                              ) : (

                                <button type="button" className="bg-green-500/20 w-full text-green-800 flex items-center justify-center gap-1 px-12 py-2 mt-6 rounded"><BadgeCheckIcon /> KYC Verified</button>

                              )

                            }

                          </div>

                        </div>

                      ) : (

                        <span className="text-gray-400 text-sm cursor-not-allowed">

                          <FaRegFileImage className="inline text-xl mr-1" />

                          No Image Available

                        </span>

                      )}

                    </div>

                  </div>

                </section>

                {/* Bank Info */}

                <section className="rounded-sm border border-gray-200 bg-gray-50/40 p-4 dark:border-neutral-800 dark:bg-neutral-800/30">

                  <h3 className="mb-4 border-b border-gray-200 pb-2 text-sm font-semibold uppercase tracking-wide text-[#0446DB] dark:border-neutral-800 dark:text-blue-400">

                    Bank Details

                  </h3>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                    <div>

                      <strong>Bank Name:</strong>

                      <input

                        name="bank_name"

                        value={formData?.bank_name || ""}

                        onChange={handleChange}

                        disabled={!isEditing}

                        placeholder={formData?.bank_name || "NA"}

                        className={`h-10 w-full rounded-sm border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:disabled:bg-neutral-800/60 ${!isEditing && "cursor-not-allowed"

                          }`}

                      />

                    </div>

                    <div>

                      <strong>Account No:</strong>

                      <input

                        name="bank_account_number"

                        value={formData?.bank_account_number || ""}

                        onChange={handleChange}

                        disabled={!isEditing}

                        placeholder={formData?.bank_account_number || "NA"}

                        className={`h-10 w-full rounded-sm border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:disabled:bg-neutral-800/60 ${!isEditing && "cursor-not-allowed"

                          }`}

                      />

                    </div>

                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">

                    {/* Branch Field */}

                    <div className="flex flex-col">

                      <strong>Branch:</strong>

                      <input

                        name="bank_branch"

                        value={formData?.bank_branch || ""}

                        onChange={handleChange}

                        disabled={!isEditing}

                        placeholder={formData?.bank_branch || "NA"}

                        className={`h-10 w-full rounded-sm border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:disabled:bg-neutral-800/60 ${!isEditing && "cursor-not-allowed"

                          }`}

                      />

                    </div>

                    {/* IFSC Field */}

                    <div className="flex flex-col">

                      <strong>IFSC Code:</strong>

                      <input

                        name="bank_ifsc_code"

                        value={formData?.bank_ifsc_code || ""}

                        onChange={handleChange}

                        disabled={!isEditing}

                        placeholder={formData?.bank_ifsc_code || "NA"}

                        className={`h-10 w-full rounded-sm border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:disabled:bg-neutral-800/60 ${!isEditing && "cursor-not-allowed"

                          }`}

                      />

                    </div>

                    {/* Cheque Image Field */}

                    {!isEditing ? (

                      <div className="flex flex-col">

                        <strong>Cheque Image:</strong>

                        {popup.cheque_image ? (

                          <a

                            href={`${baseURL}/${popup.cheque_image}`}

                            target="_blank"

                            rel="noopener noreferrer"

                            className="font-medium text-[#0446DB] hover:underline dark:text-blue-400 text-sm"

                          >

                            <FaRegFileImage className="inline text-xl mr-1" />

                            View Image

                          </a>

                        ) : (

                          <span className="text-gray-400 text-sm cursor-not-allowed">

                            <FaRegFileImage className="inline text-xl mr-1" />

                            No Image Available

                          </span>

                        )}

                      </div>

                    ) : (

                      <div className="flex flex-col">

                        <strong>Upload Cheque Image:</strong>

                        <input

                          type="file"

                          name="cheque_image"

                          onChange={handleChange}

                          disabled={!isEditing}

                          accept="image/\,application/pdf"

                          className="h-10 w-full rounded-sm border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 disabled:cursor-not-allowed disabled:bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:disabled:bg-neutral-800/60"

                        />

                      </div>

                    )}

                  </div>

                </section>

                {/* Footer Buttons */}

                <div className="rounded-sm border border-gray-200 bg-gray-50/40 p-4 dark:border-neutral-800 dark:bg-neutral-800/30 text-right space-x-3">

                  {isEditing ? (

                    <>

                      <button

                        type="submit"

                        className="rounded-sm bg-[#0446DB] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0339B5]"

                      >

                        Save

                      </button>

                      <button

                        type="button"

                        onClick={() => {

                          setFormData(popup);

                          setIsEditing(false);

                        }}

                        className="rounded-sm border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"

                      >

                        Cancel

                      </button>

                    </>

                  ) : (

                    <button

                      type="button"

                      onClick={() => {

                        setIsEditing(true);

                        setFormData(popup);

                      }}

                      className="rounded-sm bg-[#0446DB] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0339B5]"

                    >

                      Edit

                    </button>

                  )}

                  <button

                    type="button"

                    onClick={() => {

                      setPopup(null);

                      setFormData(null);

                      setIsEditing(false);

                    }}

                    className="rounded-sm border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"

                  >

                    Close

                  </button>

                </div>

              </form>

            </div>

          </div>

        )}

        {changePasswordPopup && (

          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]">

            <div className="w-full max-w-xl overflow-hidden rounded-sm border border-gray-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">

              {/* Header */}

              <div className="border-b border-gray-200 bg-white px-6 py-4 dark:border-neutral-800 dark:bg-neutral-900">

                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">

                  Change Password

                </h2>

              </div>

              {/* Form */}

              <form

                onSubmit={(e) => {

                  e.preventDefault();

                  handlePasswordChange();

                }}

                className="space-y-5 bg-white px-6 py-5 dark:bg-neutral-900"

              >

                {/* User Info */}

                <div className="grid grid-cols-1 gap-4 text-sm text-gray-700 sm:grid-cols-2 dark:text-neutral-300">

                  <div>

                    <label className="mb-1.5 block text-xs font-semibold text-gray-600 dark:text-neutral-300">ID:</label>

                    <p className="rounded-sm border border-gray-200 bg-gray-50 p-2.5 dark:border-neutral-700 dark:bg-neutral-800">

                      {changePasswordPopup.id}

                    </p>

                  </div>

                  <div>

                    <label className="mb-1.5 block text-xs font-semibold text-gray-600 dark:text-neutral-300">

                      Rider Name:

                    </label>

                    <p className="rounded-sm border border-gray-200 bg-gray-50 p-2.5 dark:border-neutral-700 dark:bg-neutral-800">

                      {changePasswordPopup.name}

                    </p>

                  </div>

                </div>

                {/* Password Inputs */}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  <div>

                    <label className="mb-1.5 block text-xs font-semibold text-gray-600 dark:text-neutral-300">

                      New Password

                    </label>

                    <input

                      type="password"

                      name="password"

                      value={newPassword.password}

                      onChange={(e) =>

                        setNewPassword({

                          ...newPassword,

                          password: e.target.value,

                        })

                      }

                      required

                      className="h-11 w-full rounded-sm border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"

                    />

                  </div>

                  <div>

                    <label className="mb-1.5 block text-xs font-semibold text-gray-600 dark:text-neutral-300">

                      Confirm Password

                    </label>

                    <input

                      type="password"

                      name="confirmPassword"

                      value={newPassword.confirmPassword}

                      onChange={(e) =>

                        setNewPassword({

                          ...newPassword,

                          confirmPassword: e.target.value,

                        })

                      }

                      required

                      className="h-11 w-full rounded-sm border border-gray-200 bg-white px-3 text-sm outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/10 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"

                    />

                  </div>

                </div>

                {/* Action Buttons */}

                <div className="flex justify-end gap-2 border-t border-gray-200 pt-4 dark:border-neutral-800">

                  <button

                    type="submit"

                    className="rounded-sm bg-[#0446DB] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#0339B5]"

                  >

                    Submit

                  </button>

                  <button

                    type="button"

                    onClick={() => {

                      setChangePasswordPopup(null);

                      setNewPassword(null);

                    }}

                    className="rounded-sm border border-gray-200 bg-white px-5 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"

                  >

                    Close

                  </button>

                </div>

              </form>

            </div>

          </div>

        )}

      </div>
      )
    }


    </>

  );

}

export default VendorAllRiders;