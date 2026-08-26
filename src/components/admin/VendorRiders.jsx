import { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import Loader from "../Loader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { TbFileInfo } from "react-icons/tb";
import { FaRegFileImage } from "react-icons/fa6";
import { toast } from "react-toastify";
import { Loader2 } from "lucide-react";

const baseURL = import.meta.env.VITE_BASE_URL;

const options = [
  { value: "Bangalore", label: "Bangalore" },
  { value: "Delhi", label: "Delhi" },
  { value: "Gurugram", label: "Gurugram" },
  { value: "Noida", label: "Noida" },
];

function VendorRiders() {
  const [loading, setLoading] = useState(false);
  const [vendorOptions, setVendorOptions] = useState([]);
  const [vendorsData, setVendorsData] = useState([]);
  const [vendor, setVendor] = useState("");
  const [riders, setRiders] = useState([]);
  const [popup, setPopup] = useState(null);
  const [changePasswordPopup, setChangePasswordPopup] = useState(null);
  const [newPassword, setNewPassword] = useState({
    id: "",
    password: "",
    confirmPassword: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(null);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseURL}/api/admin/getAllVendors`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          limit: 200,
        },
      });
      const tempArr = [{ value: "self", label: "Self Riders" },];
      res?.data?.data?.forEach((element) => {
        tempArr.push({
          value: element.id,
          label: `FP${element.id}: ${element.vendor_name}`,
        });
      });
      setVendorsData(res.data.data);
      setVendorOptions(tempArr);
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Error fetching vendors: "
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchRiders = async (input) => {
    setLoading(true);
    let vendor_id = null;
    let rider_type = null;
    if (input === "self") {
      rider_type = "self";
    } else {
      vendor_id = input;
    }
    try {
      const res = await axios.get(`${baseURL}/api/admin/getRidersByVendorId`, {
        params: { vendor_id, rider_type, limit: 500 },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });
      setRiders(res.data.data);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        err.message ||
        "Error fetching rider's data"
      );
    } finally {
      setLoading(false);
    }
  };

  const changeVerificationStatus = async (id, status) => {
    console.log(id, status);
    setLoading(true);
    try {
      await axios.post(
        `${baseURL}/api/admin/markRiderVerified/${id}`,
        {
          account_status: status,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchRiders(vendor);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        err.message ||
        "Error while changing status"
      );
    } finally {
      setLoading(false);
    }
  };

  const changeActiveStatus = async (id, status) => {
    setLoading(true);
    try {
      await axios.post(
        `${baseURL}/api/admin/markRiderActive/${id}`,
        {
          is_active: status,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchRiders(vendor);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        err.message ||
        "Error while changing status"
      );
    } finally {
      setLoading(false);
    }
  };

  const changeAvailabilityStatus = async (id, status) => {
    setLoading(true);
    try {
      await axios.post(
        `${baseURL}/api/admin/markRiderAvailable/${id}`,
        {
          is_available: status,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchRiders(vendor);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        err.message ||
        "Error while changing status"
      );
    } finally {
      setLoading(false);
    }
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
        `${baseURL}/api/admin/updateRiderProfile/${formData.id}`,
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
      fetchRiders(vendor);
    } catch (err) {
      toast.error(
        err.response?.data?.message || err.message || "Error saving data"
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = () => {
    setLoading(true);
    try {
      const res = axios.post(
        `${baseURL}/api/admin/changeRiderPassword/${newPassword.id}`,
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
      toast.error(
        err.response?.data?.message ||
        err.message ||
        "Error in updating password"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  useEffect(() => {
    if (popup) {
      setFormData({ ...popup });
    }
  }, [popup]);

  return (
    <>

      <div className="bg-gray-100 min-h-screen">
        {/* Top Heading Stripe */}
        <div className="relative z-0 mb-6 bg-[#0446DB] py-[24px] shadow-md h-38 md:h-30  px-[24px]">
          <div className="flex flex-wrap items-center justify-between w-full">
            <h1 className="text-2xl text-white">Vendor Riders</h1>

            <div className="ml-auto w-[200px] z-50 relative">
              <Select
                required
                options={vendorOptions}
                isSearchable
                value={vendorOptions.find((option) => option.value === vendor)}
                onChange={(selectedOption) => {
                  setVendor(selectedOption?.value)
                  fetchRiders(selectedOption?.value)
                }}
                placeholder="Select Vendor"
                className="text-sm"
                classNamePrefix="react-select"
                menuPortalTarget={document.body} // Renders menu at top level
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  menu: (base) => ({ ...base, zIndex: 9999 }),
                }}
              />
            </div>
          </div>
        </div>

        <div className="px-4 -mt-20 relative z-10">
          <div className="bg-white">

            <Table className="w-full text-left  rounded-md overflow-hidden">
              <TableHeader className="bg-gray-100 text-gray-800 font-semibold">
                <TableRow>
                  <TableHead className="px-4 py-3 border-b">RIDER ID</TableHead>
                  <TableHead className="px-4 py-3 border-b">RIDER NAME</TableHead>
                  <TableHead className="px-4 py-3 border-b">ACCOUNT STATUS</TableHead>
                  <TableHead className="px-4 py-3 border-b">ACTIVE</TableHead>
                  <TableHead className="px-4 py-3 border-b">AVAILABLE</TableHead>
                  <TableHead className="px-4 py-3 border-b">RIDER DOCUMENT</TableHead>
                  <TableHead className="px-4 py-3 border-b">CHANGE PASSWORD</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {
                  loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                        <p className="text-gray-500 mt-2">Loading riders...</p>
                      </TableCell>
                    </TableRow>
                  ) :
                    riders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <p className="text-gray-500">No riders found.</p>
                        </TableCell>
                      </TableRow>
                    ) :
                      riders.map((rider) => (
                        <TableRow
                          key={rider.id}
                          className="hover:bg-gray-50 transition duration-200"
                        >
                          <TableCell className="px-4 py-3">
                            {vendor !== "self" ? `FP${vendor}_` : "DKT_"}
                            {rider.id}
                          </TableCell>
                          <TableCell className="px-4 py-3">{rider.name}</TableCell>
                          <TableCell className="pl-15">
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
                          </TableCell>
                          <TableCell className="pl-15">
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
                          </TableCell>
                          <TableCell className="pl-15">
                            <button
                              onClick={() => {
                                if (rider.account_status && rider.is_active) {
                                  changeAvailabilityStatus(
                                    rider.id,
                                    rider.is_available == 1 ? 0 : 1
                                  );
                                }
                              }}
                              className={`relative inline-flex h-7 w-12 sm:h-8 sm:w-14 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-green-200 ${rider.is_available
                                ? "bg-green-500"
                                : "bg-gray-300"
                                }`}
                            >
                              <span
                                className={`inline-block h-5 w-5 sm:h-6 sm:w-6 transform rounded-full bg-white transition-transform duration-300 shadow-sm ${rider.is_available
                                  ? "translate-x-6 sm:translate-x-7"
                                  : "translate-x-1"
                                  }`}
                              />
                            </button>
                          </TableCell>
                          <TableCell
                            className="pl-15 text-2xl hover:text-gray-500 hover:cursor-pointer hover:text-3xl"
                          >
                            <Button 
                              variant="outline" 
                              onClick={() => {
                                setPopup(rider);
                                setFormData(rider);
                                setIsEditing(false);
                              }}
                              className="text-xs font-medium text-red-600 inline-block cursor-pointer"
                            >
                              <span>
                                <TbFileInfo />
                              </span>
                            </Button>
                          </TableCell>

                          <TableCell className="pl-10">
                            <button
                              className="px-2 py-1 whitespace-nowrap bg-blue-100 text-blue-500 rounded-2xl hover:cursor-pointer hover:bg-blue-200"
                              onClick={() => {
                                setNewPassword({
                                  id: rider.id,
                                });
                                setChangePasswordPopup(rider);
                              }}
                            >
                              Change Password
                            </button>
                          </TableCell>
                        </TableRow>
                      ))}
              </TableBody>
            </Table>

          </div>
        </div>
        { popup && (
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
                      <strong>ID:</strong>
                      {vendor !== "self" ? `FP${vendor}_` : ""}
                      {popup.id}
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
                        className={`border rounded-md text-sm w-[100%]`}
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
                    Document
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
                      {popup.document_image ? (
                        <a
                          href={`${baseURL}/${popup.document_image}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:underline"
                        >
                          <FaRegFileImage className="inline text-xl" />
                        </a>
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
                <h2 className="text-2xl whitespace-nowrap font-semibold text-white text-center">
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

export default VendorRiders;
