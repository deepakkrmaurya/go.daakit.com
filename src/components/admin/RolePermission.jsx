
import React, { useEffect, useState } from 'react';
import { Shield, Plus, Edit2, Trash2, X, Save, Users, Lock, ChevronDown, ChevronUp, Key, Eye } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import {
    Combobox,
    ComboboxChip,
    ComboboxChips,
    ComboboxChipsInput,
    ComboboxContent,
    ComboboxEmpty,
    ComboboxItem,
    ComboboxList,
    ComboboxValue,
    useComboboxAnchor,
} from "../../components/ui/combobox"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
const baseURL = import.meta.env.VITE_BASE_URL;

const RolePermissionManager = () => {
    const frameworks = [
        "Next.js",
        "SvelteKit",
        "Nuxt.js",
        "Remix",
        "Astro",
    ]
    const anchor = useComboboxAnchor()
    const [Cityvalue, setValue] = React.useState([])
    const [Permission, setPermission] = React.useState([])
    const [roleId, setRoleId] = useState(null)
    const [rolePermission, setRolePermission] = useState(null)
    // Modal States
    const [showAddRoleModal, setShowAddRoleModal] = useState(false);
    const [showEditRoleModal, setShowEditRoleModal] = useState(false);
    const [showDeleteRoleModal, setShowDeleteRoleModal] = useState(false);

    const [showAddPermissionModal, setShowAddPermissionModal] = useState(false);
    const [showAddPermissionToRoleModal, setShowAddPermissionToRoleModal] = useState(false);
    const [showEditPermissionModal, setShowEditPermissionModal] = useState(false);
    const [showDeletePermissionModal, setShowDeletePermissionModal] = useState(false);

    // Data States
    const [roles, setRoles] = useState([]);
    const [citys, setCitys] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);
    const [selectedPermission, setSelectedPermission] = useState(null);

    // Form States
    const [roleForm, setRoleForm] = useState({
        role_name: ""
    });

    const [permissionForm, setPermissionForm] = useState({
        permission_code: "",
        description: ""
    });

    // ============ ROLE CRUD OPERATIONS ============

    // Get All Roles
    const getAllRoles = async () => {
        try {
            const res = await axios.get(`${baseURL}/api/admin/getAllRoles`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (res.data.success) {
                setRoles(res.data.roles);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error fetching roles');
        }
    };
    const getAllCitys = async () => {
        try {
            const res = await axios.get(`${baseURL}/api/admin/getAllCities`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
         
            setCitys(res.data.cities)

        } catch (error) {
            toast.error(error.response?.data?.message || 'Error fetching roles');
        }
    };

    const getAllRoleWithPremission = async (id) => {
        try {

            setRoleId(id)
            const res = await axios.get(`${baseURL}/api/admin/getRoleWithPermissions`, {
                params: {
                    role_id: id
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (res.data.success) {
                setRolePermission(res.data.data)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error fetching roles');
        }
    };


    const deleteWithRolePermission = async (permission_code) => {
       

        try {
            const res = await axios.post(`${baseURL}/api/admin/deleteRolePermission`,
                {
                    role_id: roleId,
                    permission_code: permission_code
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            getAllRoleWithPremission(roleId)
          
        } catch (error) {

        }
    }

    // Create Role
    const handleAddRole = async () => {
        if (!roleForm.role_name) {
            toast.warning('Please enter role name');
            return;
        }

        try {
            const res = await axios.post(`${baseURL}/api/admin/createRole`,
                roleForm,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            if (res.data.success) {
                toast.success(res.data.message);
                setRoleForm({ role_name: "", description: "" });
                setShowAddRoleModal(false);
                getAllRoles(); // Refresh the list
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong');
        }
    };

    // Update Role
    const handleUpdateRole = async () => {
        if (!roleForm.role_name) {
            toast.warning('Please enter role name');
            return;
        }

        try {
            const res = await axios.put(`${baseURL}/api/admin/updateRole/${selectedRole._id}`,
                roleForm,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            if (res.data.success) {
                toast.success(res.data.message);
                setRoleForm({ role_name: "", description: "" });
                setShowEditRoleModal(false);
                setSelectedRole(null);
                getAllRoles();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating role');
        }
    };

    // Delete Role
    const handleDeleteRole = async () => {
        try {
            const res = await axios.delete(`${baseURL}/api/admin/deleteRole/${selectedRole._id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (res.data.success) {
                toast.success(res.data.message);
                setShowDeleteRoleModal(false);
                setSelectedRole(null);
                getAllRoles();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error deleting role');
        }
    };



    const handleAddPermissionToRole = async () => {
        try {
            const payload = {
                role_id: String(roleId),
                permission_id_with_city: Permission.map((perm) => ({
                    permission_id: String(perm.id),
                    cities_allowed: [...Cityvalue]
                }))
            }

            const res = await axios.post(`${baseURL}/api/admin/assignPermissionsToRole`, payload, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            toast.success(res.data.message)
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong');
        }

    }

    // ============ PERMISSION CRUD OPERATIONS ============

    // Get All Permissions
    const getAllPermissions = async () => {
        try {
            const res = await axios.get(`${baseURL}/api/admin/getAllPermissionsCode`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (res.data.success) {
                setPermissions(res.data.permissions);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error fetching permissions');
        }
    };

    // Create Permission
    const handleAddPermission = async () => {
        if (!permissionForm.permission_code) {
            toast.warning('Please enter permission code');
            return;
        }

        try {
            const res = await axios.post(`${baseURL}/api/admin/createPermission`,
                permissionForm,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            if (res.data.success) {
                toast.success(res.data.message);
                setPermissionForm({ permission_code: "", description: "" });
                setShowAddPermissionModal(false);
                getAllPermissions();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Something went wrong');
        }
    };

    // Update Permission
    const handleUpdatePermission = async (id) => {
        if (!permissionForm.permission_code) {
            toast.warning('Please enter permission code');
            return;
        }

        try {

            const res = await axios.post(
                `${baseURL}/api/admin/editPermission`,
                {
                    permissions: {
                        permission_code: permissionForm.permission_code,
                        description: permissionForm.description
                    },
                    permission_id: id,
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                        "Content-Type": "application/json"
                    }
                }
            );
            
            if (res.data.success) {
                toast.success(res.data.data.message);
                setPermissionForm({ permission_code: "", description: "" });
                setShowEditPermissionModal(false);
                setSelectedPermission(null);
                getAllPermissions();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error updating permission');
        }
    };

    // Delete Permission
    const handleDeletePermission = async () => {
        try {
            const res = await axios.delete(`${baseURL}/api/admin/deletePermission/${selectedPermission._id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });
            if (res.data.success) {
                toast.success(res.data.message);
                setShowDeletePermissionModal(false);
                setSelectedPermission(null);
                getAllPermissions();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Error deleting permission');
        }
    };

    // ============ UTILITY FUNCTIONS ============

   

    const openEditPermissionModal = (permission) => {
        setSelectedPermission(permission);
        setPermissionForm({
            permission_code: permission.permission_code,
            description: permission.description || ''
        });
        setShowEditPermissionModal(true);
    };



    // Load data on component mount
    useEffect(() => {
        getAllRoles();
        getAllPermissions();
        getAllCitys()
        // getAllRoleWithPremission()
    }, []);
   
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className=" p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                    {/* Left Side */}
                    <div className="flex items-center gap-2">
                    
                        <h2 className="text-lg sm:text-xl font-semibold dar:text-white">
                            Role & Permission Management
                        </h2>
                    </div>

                    {/* Right Side Buttons */}
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">



                        <AlertDialog

                        >
                            <AlertDialogTrigger asChild>
                                <Button variant="outline"
                                    className='text-[#0446DB]'
                                >

                                    <Plus className="w-4 h-4" />
                                    Add Role
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent

                            >
                                <AlertDialogHeader

                                >
                                    <AlertDialogTitle
                                        className=''
                                    >

                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white/20 rounded-lg">

                                            </div>
                                            <div>
                                                <h2 className="text-xl font-semibold text-[#524bba]">Add New Role</h2>

                                            </div>
                                        </div>
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>

                                        <div className="p-4 w-[630px]  ">
                                            <div className="mb-4 ">
                                                <label className="block text-sm text-left font-medium text-gray-700 mb-1">Role Name *</label>
                                                <input
                                                    type="text"
                                                    value={roleForm.role_name}
                                                    onChange={(e) => setRoleForm({ ...roleForm, role_name: e.target.value })}
                                                    placeholder="Enter Role"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                                />
                                            </div>
                                            <button
                                                onClick={handleAddRole}
                                                className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg flex items-center justify-center"
                                            >
                                                <Save className="w-4 h-4 inline mr-1" />
                                                Add Role
                                            </button>
                                        </div>


                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    {/* <AlertDialogAction>Continue</AlertDialogAction> */}
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>


                        <AlertDialog

                        >
                            <AlertDialogTrigger asChild>
                                <Button variant="outline"
                                    className='text-[#0446DB]'
                                >

                                    <Plus className="w-4 h-4" />
                                    Add Permission
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent

                            >
                                <AlertDialogHeader

                                >
                                    <AlertDialogTitle
                                        className=''
                                    >

                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white/20 rounded-lg">

                                            </div>
                                            <div>
                                                <h2 className="text-xl font-semibold text-[#524bba]">Add New Permission</h2>

                                            </div>
                                        </div>
                                    </AlertDialogTitle>
                                    <AlertDialogDescription
                                        className='w-full'
                                    >


                                        <div className="p-4">
                                            <div className="mb-4">
                                                <label className="block text-left font-medium text-gray-700 mb-1">Permission Code*</label>
                                                <input
                                                    type="text"
                                                    value={permissionForm.permission_code}
                                                    
                                                    onChange={(e) => setPermissionForm({ ...permissionForm, permission_code: e.target.value })}
                                                    placeholder="e.g., view_dashboard, export_reports"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                                />
                                            </div>
                                            <div className="mb-0">
                                                <label className="block text-left font-medium text-gray-700 mb-1">Description</label>
                                                <input
                                                    type="text"
                                                    value={permissionForm.description}
                                                    onChange={(e) => setPermissionForm({ ...permissionForm, description: e.target.value })}
                                                    placeholder="Brief description of this permission"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                                />
                                            </div>
                                            <button onClick={handleAddPermission} className="px-4 mt-2 py-2 w-full bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg">
                                                <Save className="w-4 h-4 inline mr-1" />
                                                Add Permission
                                            </button>
                                        </div>




                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    {/* <AlertDialogAction>Continue</AlertDialogAction> */}
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        <button
                            onClick={() => setShowAddPermissionToRoleModal(true)}
                            className="inline-flex whitespace-nowrap justify-center items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors w-full sm:w-auto"
                        >
                            <Plus className="w-4 h-4" />
                            Add Permission To Role
                        </button>

                    </div>
                </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Roles Table */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-blue-600" />
                            <h3 className="text-lg font-semibold text-gray-800">Roles</h3>
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                {roles.length} Roles
                            </span>
                        </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role Name</th>

                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {roles.length > 0 ? (
                                    roles.map((role) => (
                                        <tr key={role._id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <p className="text-sm font-medium text-gray-800">{role.role_name}</p>
                                            </td>



                                            <td className="px-4 py-3 text-right">
                                                <button

                                                    onClick={() => getAllRoleWithPremission(role.id)}
                                                    className="text-gray-400 cursor-pointer hover:text-blue-600 mr-2"
                                                >
                                                    <Eye className="w-4 h-4 " />
                                                </button>

                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="px-4 py-8 text-center text-gray-500">
                                            No roles found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Permissions Table */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Key className="w-5 h-5 text-green-600" />
                            <h3 className="text-lg font-semibold text-gray-800">Permissions</h3>
                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                {permissions.length} Permissions
                            </span>
                        </div>
                    </div>

                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Permission Code</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {permissions.length > 0 ? (
                                    permissions.map((permission) => (
                                        <tr key={permission._id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <p className="text-sm font-medium text-gray-800">{permission.permission_code}</p>
                                            </td>
                                            <td className="px-4 py-3">
                                                <p className="text-sm text-gray-600">{permission.description || '-'}</p>
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                <button
                                                    onClick={() => openEditPermissionModal(permission)}
                                                    className="text-gray-400 cursor-pointer hover:text-blue-600 mr-2"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>

                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="px-4 py-8 text-center text-gray-500">
                                            No permissions found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ============ MODALS ============ */}





            {/* Add Role Modal */}
            {(rolePermission?.length > 0 && rolePermission) && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full mx-4 max-h-[80vh] overflow-hidden animate-fadeIn">
                        {/* Header */}
                        <div className="px-6 py-5 border-b border-gray-100 bg-white">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900">Role Permissions</h2>
                                        <p className="text-sm text-gray-500">View all permissions and assigned cities for this user</p>
                                    </div>


                                </div>

                                <button
                                    onClick={() => setRolePermission([])}
                                    className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 bg-gray-50/50 max-h-[calc(90vh-120px)] overflow-y-auto">

                            {
                                rolePermission?.map((permission) => {
                                    return (
                                        <>
                                            <div className="p-3 border relative rounded-lg bg-gray-50 mb-2">
                                                <button
                                                    onClick={() => deleteWithRolePermission(permission?.permission_code)}
                                                    className="w-4 h-4 absolute -top-1 -right-1 rounded-lg bg-red-400 flex items-center justify-center transition-colors"
                                                >
                                                    <X className="w-5 h-5 text-white" />
                                                </button>
                                                {/* Permission Code */}
                                                <p className="font-semibold text-gray-800">
                                                    {permission?.permission_code}
                                                </p>

                                                {/* Cities */}
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {Array.isArray(permission?.cities) &&
                                                        permission.cities.length > 0 ? (
                                                        permission.cities.map((city, index) => (
                                                            <span
                                                                key={index}
                                                                className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full"
                                                            >
                                                                {city}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-gray-400 text-sm">No Cities</span>
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    )
                                })
                            }


                        </div>


                    </div>
                </div>
            )}





            {/* Delete Role Modal */}
            {showDeleteRoleModal && selectedRole && (
                <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
                        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                            <Trash2 className="w-6 h-6 text-red-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">Delete Role</h3>
                        <p className="text-sm text-gray-600 text-center mb-4">
                            Are you sure you want to delete <span className="font-semibold">"{selectedRole.role_name}"</span>? This action cannot be undone.
                        </p>
                        <div className="flex gap-2">
                            <button onClick={() => setShowDeleteRoleModal(false)} className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
                                Cancel
                            </button>
                            <button onClick={handleDeleteRole} className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add Permission Modal */}
            {showAddPermissionModal && (
                <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="text-lg font-semibold text-gray-800">Add New Permission</h3>
                            <button onClick={() => setShowAddPermissionModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-4">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Permission Code *</label>
                                <input
                                    type="text"
                                    value={permissionForm.permission_code}
                                    onChange={(e) => setPermissionForm({ ...permissionForm, permission_code: e.target.value })}
                                    placeholder="e.g., view_dashboard, export_reports"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <input
                                    type="text"
                                    value={permissionForm.description}
                                    onChange={(e) => setPermissionForm({ ...permissionForm, description: e.target.value })}
                                    placeholder="Brief description of this permission"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 p-4 border-t">
                            <button onClick={() => {
                                setPermissionForm({})
                                setShowAddPermissionModal(false)
                            }} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
                                Cancel
                            </button>
                            <button onClick={handleAddPermission} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg">
                                <Save className="w-4 h-4 inline mr-1" />
                                Add Permission
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showAddPermissionToRoleModal && (
                <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="text-lg font-semibold text-gray-800">Add Permissionn To Role</h3>
                            <button onClick={() => setShowAddPermissionToRoleModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-4">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                                <select
                                    name=""
                                    id=""
                                    onChange={(e) => {
                                        setRoleId(e.target.value)
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                >
                                    <option value=""
                                    >Select Role</option>
                                    {
                                        roles.map((role) => {
                                            return (
                                                <>
                                                    <option value={role?.id}>{role?.role_name}</option>
                                                </>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Permission *</label>

                                <Combobox
                                    multiple
                                    autoHighlight
                                    items={permissions}
                                    // defaultValue={[permissions]}
                                    onValueChange={setPermission}
                                >
                                    <ComboboxChips ref={anchor} className="w-full">
                                        <ComboboxValue>
                                            {(values) => (
                                                <React.Fragment>
                                                    {values.map((value) => (
                                                        <ComboboxChip key={value.id}>{value?.permission_code}</ComboboxChip>
                                                    ))}
                                                    <ComboboxChipsInput />
                                                </React.Fragment>
                                            )}
                                        </ComboboxValue>
                                    </ComboboxChips>
                                    <ComboboxContent anchor={anchor}>
                                        <ComboboxEmpty>No items found.</ComboboxEmpty>
                                        <ComboboxList>
                                            {(item) => (
                                                <ComboboxItem key={item.id} value={item}>
                                                    {item?.permission_code}
                                                </ComboboxItem>
                                            )}
                                        </ComboboxList>
                                    </ComboboxContent>
                                </Combobox>
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>

                                <Combobox
                                    multiple
                                    autoHighlight
                                    items={citys}
                                    // defaultValue={[citys[0]]}
                                    onValueChange={setValue}
                                >
                                    <ComboboxChips ref={anchor} className="w-full">
                                        <ComboboxValue>
                                            {(values) => (
                                                <React.Fragment>
                                                    {values.map((value) => (
                                                        <ComboboxChip key={value}>{value}</ComboboxChip>
                                                    ))}
                                                    <ComboboxChipsInput />
                                                </React.Fragment>
                                            )}
                                        </ComboboxValue>
                                    </ComboboxChips>
                                    <ComboboxContent anchor={anchor}>
                                        <ComboboxEmpty>No items found.</ComboboxEmpty>
                                        <ComboboxList>
                                            {(item) => (
                                                <ComboboxItem key={item} value={item}>
                                                    {item}
                                                </ComboboxItem>
                                            )}
                                        </ComboboxList>
                                    </ComboboxContent>
                                </Combobox>
                            </div>



                        </div>
                        <div className="flex justify-end gap-2 p-4 border-t">
                            <button onClick={() => {
                                setPermissionForm({})
                                setShowAddPermissionToRoleModal(false)
                                setShowAddPermissionModal(false)
                            }} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
                                Cancel
                            </button>
                            <button onClick={handleAddPermissionToRole} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg">
                                <Save className="w-4 h-4 inline mr-1" />
                                Add
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Permission Modal */}
            {showEditPermissionModal && selectedPermission && (
                <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
                        <div className="flex items-center justify-between p-4 border-b">
                            <h3 className="text-lg font-semibold text-gray-800">Edit Permission</h3>
                            <button onClick={() => setShowEditPermissionModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-4">
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Permission Code *</label>
                                <input
                                    type="text"
                                    value={permissionForm.permission_code}
                                    disabled
                                    onChange={(e) => setPermissionForm({ ...permissionForm, permission_code: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <input
                                    type="text"
                                    value={permissionForm.description}
                                    onChange={(e) => setPermissionForm({ ...permissionForm, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 p-4 border-t">
                            <button onClick={() => {
                                setPermissionForm({
                                    permission_code: "",
                                    description: ""
                                })
                                setShowEditPermissionModal(false)
                            }} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
                                Cancel
                            </button>
                            <button onClick={() => {

                                handleUpdatePermission(selectedPermission?.id)
                            }} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg">
                                <Save className="w-4 h-4 inline mr-1" />
                                Update Permission
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Permission Modal */}
            {showDeletePermissionModal && selectedPermission && (
                <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
                        <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
                            <Trash2 className="w-6 h-6 text-red-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">Delete Permission</h3>
                        <p className="text-sm text-gray-600 text-center mb-4">
                            Are you sure you want to delete <span className="font-semibold">"{selectedPermission.permission_code}"</span>? This action cannot be undone.
                        </p>
                        <div className="flex gap-2">
                            <button onClick={() => setShowDeletePermissionModal(false)} className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
                                Cancel
                            </button>
                            <button onClick={handleDeletePermission} className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RolePermissionManager;