import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaEdit,
  FaTrash,
  FaCopy,
  FaSearch,
  FaFilter,
  FaMapMarkerAlt,
  FaTimes,
} from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import GoogleMap from "../../googlemap";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";


const baseURL = import.meta.env.VITE_BASE_URL;

function HubList() {
  const [hubs, setHubs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // --- Edit Modal State ---
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingHub, setEditingHub] = useState(null);

  const [formData, setFormData] = useState({
    hub_name: "",
    hub_code: "",
    hub_type: "",
    username: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    latitude: "",
    longitude: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hubTypes = [
    { value: "FM", label: "FM" },
    { value: "SORTING", label: "SORTING" },
    { value: "LM", label: "LM" },
  ];

  // --- Form Handlers ---
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

    if (!formData.hub_name?.trim()) newErrors.hub_name = "Hub name is required";
    if (!formData.hub_code?.trim()) newErrors.hub_code = "Hub code is required";
    if (!formData.hub_type) newErrors.hub_type = "Please select a hub type";
    if (!formData.username?.trim()) newErrors.username = "Username is required";
    if (!formData.address?.trim()) newErrors.address = "Address is required";
    if (!formData.city?.trim()) newErrors.city = "City is required";
    if (!formData.state) newErrors.state = "Please select a state";
    if (!formData.pincode?.trim()) {
      newErrors.pincode = "Pincode is required";
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "Pincode must be 6 digits";
    }

    if (formData.latitude && !/^-?\d+(\.\d+)?$/.test(formData.latitude)) {
      newErrors.latitude = "Invalid latitude format";
    }
    if (formData.longitude && !/^-?\d+(\.\d+)?$/.test(formData.longitude)) {
      newErrors.longitude = "Invalid longitude format";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      // Pass the hub id from editingHub along with formData
      await handleUpdateHub({ id: editingHub.id, ...formData });
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setEditModalOpen(false);
    setEditingHub(null);
    setFormData({
      hub_name: "",
      hub_code: "",
      hub_type: "",
      username: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      latitude: "",
      longitude: "",
    });
    setErrors({});
  };

  const fetchCurrentLocatipon = async ({ selectedLocation }) => {
    const { lat, lng } = selectedLocation;
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
    }));
  };

  // --- Open Edit Modal ---
  const openEditModal = (hub) => {
    setEditingHub(hub);
    setFormData({
      hub_name: hub.hub_name || "",
      hub_code: hub.hub_code || "",
      hub_type: hub.hub_type || "",
      username: hub.username || "",
      address: hub.address || "",
      city: hub.city || "",
      state: hub.state || "",
      pincode: hub.pincode || "",
      latitude: hub.latitude || "",
      longitude: hub.longitude || "",
    });
    setErrors({});
    setEditModalOpen(true);
  };

  // --- API Calls ---
  const getAllHubs = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/facility/getAllHubs`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setHubs(res?.data?.data || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch hubs");
    }
  };

  const handleUpdateHub = async (updatedData) => {
    try {
      const res = await axios.post(
        `${baseURL}/api/facility/updateHub/${updatedData.id}`,
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res?.data?.success) {
        toast.success(res?.data?.message);
      }
      handleClose(); // close modal after success
      getAllHubs(); // refresh list
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update hub");
      throw error;
    }
  };

  useEffect(() => {
    getAllHubs();
  }, []);

  // --- Filter & helpers ---
  const filteredHubs = hubs.filter((hub) => {
    const matchesSearch =
      hub.hub_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hub.hub_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hub.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hub.state?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || hub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Hub code copied to clipboard!");
  };

  const getHubTypeBadge = (hubType) => {
    const typeConfig = {
      distribution: {
        color: "bg-purple-100 text-purple-800",
        text: "Distribution",
      },
      logistics: { color: "bg-blue-100 text-blue-800", text: "Logistics" },
      warehouse: { color: "bg-amber-100 text-amber-800", text: "Warehouse" },
      regional: { color: "bg-green-100 text-green-800", text: "Regional" },
      main: { color: "bg-red-100 text-red-800", text: "Main Hub" },
    };

    const config = typeConfig[hubType] || {
      color: "bg-gray-100 text-gray-800",
      text: hubType,
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.text}
      </span>
    );
  };

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
      loadingPage ? (
         <div className=" w-full h-[90vh] flex justify-center items-center">
          <div>
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <p className="mt-2">Loading Hub Details...</p>
          </div>
        </div>
      ):(
        <>
      <div className="min-h-screen  dark:bg-neutral-800">
        <div className="mx-auto">
          <div className=" sticky top-0 dark:bg-neutral-900 py-[24px]  h-auto px-[24px]">
            <div className="flex flex-wrap items-center justify-between">
              <h1 className="text-2xl dark:text-white">Hub Management</h1>
              <div className="flex flex-wrap items-end gap-4 text-white">
                <Link
                  to={"/vendor/hub_create"}
                  className="inline-flex items-center px-3 py-1 bg-[#0446DB] text-[#EEEEEE] font-medium rounded-[8px] focus:ring-2 focus:ring-[#554dc0] focus:ring-offset-2 transition-colors"
                >
                  + Add New Hub
                </Link>
              </div>
            </div>
          </div>

          {/* Hubs Table */}
          <div className="bg-white dark:bg-neutral-900 shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-neutral-800 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Hub Details
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Hub Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Username
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-neutral-900 divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredHubs?.map((hub) => (
                    <tr
                      key={hub?.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                    >
                      <td className="px-5 py-1">
                        <div>
                          <div className="flex items-center gap-3">
                            <div>
                              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                                {hub?.hub_name}
                              </div>
                              <div className="flex items-center gap-2 mt-1">
                                <code className="text-xs font-mono bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded border">
                                  {hub?.hub_code}
                                </code>
                                <button
                                  onClick={() => copyToClipboard(hub?.hub_code)}
                                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                                  title="Copy hub code"
                                >
                                  <FaCopy className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-1">
                        <div className="space-y-2">
                          <div>{getHubTypeBadge(hub?.hub_type)}</div>
                        </div>
                      </td>
                      <td className="px-5 py-1">
                        <div className="text-sm text-gray-900 dark:text-white">
                          <div className="font-medium whitespace-nowrap">
                            {hub.address}, {hub.city}, {hub.state}
                          </div>
                          <div className="text-gray-600 dark:text-gray-400 mt-1">
                            Pincode: {hub?.pincode}
                          </div>
                          {hub?.latitude && hub?.longitude && (
                            <div className="text-xs text-gray-500 mt-1">
                              Lat:{hub?.latitude}°, <br /> Lon:{hub?.longitude}°
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-1">
                        <div className="text-sm">
                          <div className="text-gray-900 dark:text-white font-medium">
                            {hub?.username}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-1">
                        <div className="flex items-center gap-2">
                          {/* Edit Button */}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditModal(hub)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <FaEdit className="w-4 h-4 mr-1" /> Edit
                          </Button>

                         
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {filteredHubs.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <FaMapMarkerAlt className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No hubs found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  {searchTerm || statusFilter !== "all"
                    ? "Try adjusting your search or filter criteria"
                    : "Get started by creating your first hub"}
                </p>
                {!searchTerm && statusFilter === "all" && (
                  <Link
                    to={"/vendor/hub_create"}
                    className="inline-flex items-center px-6 py-3 bg-[#554dc0] text-white font-medium rounded-lg hover:bg-[#4a44a5] transition-colors"
                  >
                    Create Your First Hub
                  </Link>
                )}
              </div>
            )}

            {/* Pagination */}
            {filteredHubs.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    Showing{" "}
                    <span className="font-medium">{filteredHubs.length}</span>{" "}
                    of <span className="font-medium">{hubs.length}</span> hubs
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                      Previous
                    </button>
                    <button className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal - using Dialog */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent className="!max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Hub</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Hub Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hub Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="hub_name"
                    value={formData.hub_name}
                    onChange={handleChange}
                    className={`w-full px-4 py-1 border rounded-[8px] focus:ring-blue-500 focus:border-blue-500 ${
                      errors.hub_name ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.hub_name && (
                    <p className="mt-1 text-sm text-red-600">{errors.hub_name}</p>
                  )}
                </div>

                {/* Hub Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hub Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="hub_code"
                    value={formData.hub_code}
                    onChange={handleChange}
                    className={`w-full px-4 py-1 border rounded-[8px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.hub_code ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.hub_code && (
                    <p className="mt-1 text-sm text-red-600">{errors.hub_code}</p>
                  )}
                </div>

                {/* Hub Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hub Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="hub_type"
                    value={formData.hub_type}
                    onChange={handleChange}
                    className={`w-full px-4 py-1 border rounded-[8px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.hub_type ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="">Select Hub Type</option>
                    {hubTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  {errors.hub_type && (
                    <p className="mt-1 text-sm text-red-600">{errors.hub_type}</p>
                  )}
                </div>

                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className={`w-full px-4 py-1 border rounded-[8px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.username ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.username && (
                    <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                  )}
                </div>

                {/* Address */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    className={`w-full px-4 py-1 border rounded-[8px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.address ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                  )}
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={`w-full px-4 py-1 border rounded-[8px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.city ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                  )}
                </div>

                {/* State */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className={`w-full px-4 py-1 border rounded-[8px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.state ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.state && (
                    <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                  )}
                </div>

                {/* Pincode */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pincode <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    maxLength="6"
                    className={`w-full px-4 py-1 border rounded-[8px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.pincode ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.pincode && (
                    <p className="mt-1 text-sm text-red-600">{errors.pincode}</p>
                  )}
                </div>
              </div>

              {/* Coordinates Section */}
              <div className="border-t pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Latitude */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Latitude
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="latitude"
                        value={formData.latitude || ""}
                        onChange={handleChange}
                        placeholder="e.g., 19.0760"
                        className={`w-full px-4 py-1 border rounded-[8px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.latitude ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <span className="text-gray-400">°</span>
                      </div>
                    </div>
                    {errors.latitude && (
                      <p className="mt-1 text-sm text-red-600">{errors.latitude}</p>
                    )}
                  </div>

                  {/* Longitude */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Longitude
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        name="longitude"
                        value={formData.longitude || ""}
                        onChange={handleChange}
                        placeholder="e.g., 72.8777"
                        className={`w-full px-4 py-1 border rounded-[8px] focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${
                          errors.longitude ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <span className="text-gray-400">°</span>
                      </div>
                    </div>
                    {errors.longitude && (
                      <p className="mt-1 text-sm text-red-600">{errors.longitude}</p>
                    )}
                  </div>
                </div>
                <div className="my-10">
                  <GoogleMap fetchCurrentLocatipon={fetchCurrentLocatipon} />
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit"
               className='bg-[#0446DB]'
              disabled={isSubmitting}>
                {isSubmitting ? "Updating..." : "Update Hub"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
        </>

      )
    }
    </>
  );
}

export default HubList;
