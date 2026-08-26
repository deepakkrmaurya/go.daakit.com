import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Select from "react-select";
import Loader from "../Loader";
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

  return (
    <>

      <div className="bg-gray-100 min-h-screen w-full">


        {/* Heading Strip */}
        <div className="mb-6 bg-[#0446DB] dark:bg-gray-900 py-[24px] shadow-md h-38 px-[24px]">
          <div className="flex flex-wrap items-center justify-between">
            {/* Heading */}
            <h1 className="text-2xl text-white">Rider Details</h1>
            <div className="flex flex-wrap items-end gap-4 text-white">
              <Drawer direction="right"
                open={isFilterOpen}
                onOpenChange={setIsFilterOpen}
              >
                <DrawerTrigger asChild>
                  <Button variant="outline"
                    className="bg-white text-[#0446DB] font-medium px-5 py-5 rounded-lg shadow hover:bg-indigo-100 transition"
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

                    <div className="no-scrollbar overflow-y-auto ">
                      <div className="p-4 w-full">
                        <div className="flex flex-wrap  items-end gap-4">
                          {/* Rider ID */}

                          <Field className="mx-auto w-full">
                            <FieldLabel htmlFor="enddate">End Date</FieldLabel>
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
                            <label className="block text-xs text-gray-600 mb-1">
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
                              className="border w-full px-3 py-2 rounded text-sm"
                            />
                          </div>

                          {/* Facility City */}
                          <div className=" w-full">
                            <label className="block text-xs text-gray-600 mb-1">
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
                              className="border w-full  py-0 rounded"
                            />
                          </div>

                          {/* Facility Zone */}
                          <div className=" w-full">
                            <label className="block text-xs text-gray-600 mb-1">
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
                              className="border w-full px-3 py-2 rounded text-sm"
                            />
                          </div>

                          {/* Update Button */}
                          <div className=" w-full flex">
                            <button
                              onClick={() => {
                                setFilterUpdate(true);
                                setIsFilterOpen(false);
                              }}
                              className="bg-[#0446DB] w-1/2 text-white px-4 py-2 rounded-md hover:bg-indigo-800 transition text-sm mx-1"
                            >
                              Filter
                            </button>
                            <button
                              onClick={() => {
                                resetAdvanceFilters();
                                setFilterUpdate(true);
                                setIsFilterOpen(false);
                              }}
                              className="bg-[#0446DB] w-1/2 text-white px-4 py-2 rounded-md hover:bg-indigo-800 transition text-sm mx-1"
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
        <div className="mx-6 z-10 bg-white dark:bg-gray-900 rounded-md">
          <div className="max-w-full -mt-20 relative z-10">
            <table className="min-w-full divide-y divide-gray-200 text-left ">
              <thead className="bg-gray-100 dark:bg-gray-900 text-gray-600 text-sm font-semibold text-center">
                <tr>
                  <th className="px-6 py-3">RIDER ID</th>
                  <th className="px-6 py-3">RIDER NAME</th>
                  <th className="px-6 py-3">ACCOUNT STATUS</th>
                  <th className="px-6 py-3">ACTIVE</th>
                  <th className="px-6 py-3">AVAILABLE</th>
                  <th className="px-6 py-3">RIDER DOCUMENT</th>
                  <th className="px-6 py-3">CHANGE PASSWORD</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 divide-y divide-gray-200">
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
                        className="hover:bg-gray-50 transition-colors duration-200 text-center"
                      >
                        <td className="px-6 py-4">
                          FP{rider.vendor_id}_{rider.id}
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
                          className="pl-25 text-2xl hover:text-gray-500 hover:cursor-pointer hover:text-3xl"
                          onClick={() => {
                            setPopup(rider);
                          }}
                        >
                          <TbFileInfo />
                        </td>

                        <td>
                          <button
                            className="px-2 py-1 bg-blue-100 text-blue-500 rounded-2xl hover:cursor-pointer hover:bg-blue-200"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(46,46,46,0.5)]">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden border border-gray-200">
              <div className="bg-[#0446DB] pt-4 pb-2 px-6">
                <h2 className="text-2xl font-bold text-white text-center">
                  Rider Details
                </h2>
              </div>



              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSave();
                }}
                className="px-6 py-1 space-y-1 bg-white"
              >
                {/* Basic Info */}
                <section>
                  <h3 className="text-lg font-semibold text-[#0446DB] border-b">
                    Basic Details
                  </h3>
                  <div className="grid grid-cols-2 gap-x-1">
                    <div>
                      <strong>ID:</strong> FP{popup.vendor_id}_{popup.id}
                    </div>
                    <div>
                      <strong>Account Status:</strong>{" "}
                      {popup.account_status ? (
                        <span className="text-green-600 font-semibold">
                          Active
                        </span>
                      ) : (
                        <span className="text-red-600 font-semibold">
                          Not Active
                        </span>
                      )}
                    </div>
                    <div>
                      <strong>Active:</strong>{" "}
                      {popup.is_active ? (
                        <span className="text-green-600 font-semibold">
                          Active
                        </span>
                      ) : (
                        <span className="text-red-600 font-semibold">
                          Not Active
                        </span>
                      )}
                    </div>
                    <div>
                      <strong>Availability:</strong>{" "}
                      {popup.is_available ? (
                        <span className="text-green-600 font-semibold">
                          Available
                        </span>
                      ) : (
                        <span className="text-red-600 font-semibold">
                          Not Available
                        </span>
                      )}
                    </div>
                    <div>
                      <strong>KYC:</strong>{" "}
                      {popup?.kyc_verified === '1' ? (
                        <span className="text-green-600 font-semibold">
                          KYC Verified
                        </span>
                      ) : (
                        <span className="text-red-600 font-semibold">
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
                        className={`border p-1 w-full rounded focus:ring-2 focus:ring-indigo-400 focus:outline-none disabled:bg-gray-100 ${!isEditing && "cursor-not-allowed"
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
                        className={`border p-1 w-full rounded focus:ring-2 focus:ring-indigo-400 focus:outline-none disabled:bg-gray-100 ${!isEditing && "cursor-not-allowed"
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
                        className={`border p-1 w-full rounded focus:ring-2 focus:ring-indigo-400 focus:outline-none disabled:bg-gray-100 ${!isEditing && "cursor-not-allowed"
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
                        className={`border p-1 w-full rounded focus:ring-2 focus:ring-indigo-400 focus:outline-none disabled:bg-gray-100 ${!isEditing && "cursor-not-allowed"
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
                        className={`border p-1 w-full rounded focus:ring-2 focus:ring-indigo-400 focus:outline-none disabled:bg-gray-100 ${!isEditing && "cursor-not-allowed"
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
                        className={`border p-1 w-full rounded focus:ring-2 focus:ring-indigo-400 focus:outline-none disabled:bg-gray-100 ${!isEditing && "cursor-not-allowed"
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
                        className={`border p-1 w-full rounded focus:ring-2 focus:ring-indigo-400 focus:outline-none disabled:bg-gray-100 ${!isEditing && "cursor-not-allowed"
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
                        className={`border p-1 w-full rounded focus:ring-2 focus:ring-indigo-400 focus:outline-none disabled:bg-gray-100 ${!isEditing && "cursor-not-allowed"
                          }`}
                      />
                    </div>
                  </div>
                </section>

                {/* Document Info */}
                <section className="pt-1">
                  <h3 className="text-lg font-semibold text-[#0446DB] mb-1 border-b pb-1">
                    KYC Details
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
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
                              className="text-indigo-600 hover:underline"
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
                <section className="pt-1">
                  <h3 className="text-lg font-semibold text-[#0446DB] mb-3 border-b pb-1">
                    Bank Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <strong>Bank Name:</strong>
                      <input
                        name="bank_name"
                        value={formData?.bank_name || ""}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder={formData?.bank_name || "NA"}
                        className={`border p-1 w-full rounded focus:ring-2 focus:ring-indigo-400 focus:outline-none disabled:bg-gray-100 ${!isEditing && "cursor-not-allowed"
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
                        className={`border p-1 w-full rounded focus:ring-2 focus:ring-indigo-400 focus:outline-none disabled:bg-gray-100 ${!isEditing && "cursor-not-allowed"
                          }`}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    {/* Branch Field */}
                    <div className="flex flex-col">
                      <strong>Branch:</strong>
                      <input
                        name="bank_branch"
                        value={formData?.bank_branch || ""}
                        onChange={handleChange}
                        disabled={!isEditing}
                        placeholder={formData?.bank_branch || "NA"}
                        className={`border p-1 w-full rounded focus:ring-2 focus:ring-indigo-400 focus:outline-none disabled:bg-gray-100 ${!isEditing && "cursor-not-allowed"
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
                        className={`border p-1 w-full rounded focus:ring-2 focus:ring-indigo-400 focus:outline-none disabled:bg-gray-100 ${!isEditing && "cursor-not-allowed"
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
                            className="text-indigo-600 hover:underline text-sm"
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
                          accept="image/*,application/pdf"
                          className="border p-1 w-full rounded focus:ring-2 focus:ring-indigo-400 focus:outline-none disabled:bg-gray-100"
                        />
                      </div>
                    )}
                  </div>
                </section>

                {/* Footer Buttons */}
                <div className="pt-1 text-right space-x-3">
                  {isEditing ? (
                    <>
                      <button
                        type="submit"
                        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setFormData(popup);
                          setIsEditing(false);
                        }}
                        className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
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
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
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
                    className="bg-[#0446DB] text-white px-4 py-2 rounded hover:bg-indigo-800 transition"
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {changePasswordPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-gray-200">
              {/* Header */}
              <div className="bg-[#0446DB] px-6 py-4">
                <h2 className="text-2xl font-semibold text-white text-center">
                  Change Password
                </h2>
              </div>

              {/* Form */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handlePasswordChange();
                }}
                className="px-6 py-6 bg-white space-y-6"
              >
                {/* User Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
                  <div>
                    <label className="block font-medium mb-1">ID:</label>
                    <p className="bg-gray-100 p-2 rounded">
                      {changePasswordPopup.id}
                    </p>
                  </div>
                  <div>
                    <label className="block font-medium mb-1">
                      Rider Name:
                    </label>
                    <p className="bg-gray-100 p-2 rounded">
                      {changePasswordPopup.name}
                    </p>
                  </div>
                </div>

                {/* Password Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium mb-1">
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
                      className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-medium mb-1">
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
                      className="w-full border px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="submit"
                    className="bg-[#0446DB] text-white px-5 py-2 rounded-md hover:bg-indigo-800 transition"
                  >
                    Submit
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setChangePasswordPopup(null);
                      setNewPassword(null);
                    }}
                    className="bg-gray-200 text-gray-800 px-5 py-2 rounded-md hover:bg-gray-300 transition"
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

    </>
  );
}

export default VendorAllRiders;
