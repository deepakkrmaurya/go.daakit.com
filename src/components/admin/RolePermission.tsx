
// import React, { useEffect, useState } from 'react';
// import { Shield, Plus, Edit2, Trash2, X, Save, Users, Lock, ChevronDown, ChevronUp, Key, Eye } from 'lucide-react';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import {
//     Combobox,
//     ComboboxChip,
//     ComboboxChips,
//     ComboboxChipsInput,
//     ComboboxContent,
//     ComboboxEmpty,
//     ComboboxItem,
//     ComboboxList,
//     ComboboxValue,
//     useComboboxAnchor,
// } from "../../components/ui/combobox"
// import {
//     AlertDialog,
//     AlertDialogAction,
//     AlertDialogCancel,
//     AlertDialogContent,
//     AlertDialogDescription,
//     AlertDialogFooter,
//     AlertDialogHeader,
//     AlertDialogTitle,
//     AlertDialogTrigger,
// } from "@/components/ui/alert-dialog"
// import { Button } from "@/components/ui/button"
// const baseURL = import.meta.env.VITE_BASE_URL;

// const RolePermissionManager = () => {
//     const anchor = useComboboxAnchor()
//     const [Cityvalue, setValue] = React.useState([])
//     const [Permission, setPermission] = React.useState([])
//     const [roleId, setRoleId] = useState(null)
//     const [rolePermission, setRolePermission] = useState(null)
//     // Modal States
//     const [showAddRoleModal, setShowAddRoleModal] = useState(false);
//     const [showEditRoleModal, setShowEditRoleModal] = useState(false);
//     const [showDeleteRoleModal, setShowDeleteRoleModal] = useState(false);

//     const [showAddPermissionModal, setShowAddPermissionModal] = useState(false);
//     const [showAddPermissionToRoleModal, setShowAddPermissionToRoleModal] = useState(false);
//     const [showEditPermissionModal, setShowEditPermissionModal] = useState(false);
//     const [showDeletePermissionModal, setShowDeletePermissionModal] = useState(false);

//     // Data States
//     const [roles, setRoles] = useState([]);
//     const [citys, setCitys] = useState([]);
//     const [permissions, setPermissions] = useState([]);
//     const [selectedRole, setSelectedRole] = useState(null);
//     const [selectedPermission, setSelectedPermission] = useState(null);

//     // Form States
//     const [roleForm, setRoleForm] = useState({
//         role_name: ""
//     });

//     const [permissionForm, setPermissionForm] = useState({
//         permission_code: "",
//         description: ""
//     });

//     // ============ ROLE CRUD OPERATIONS ============

//     // Get All Roles
//     const getAllRoles = async () => {
//         try {
//             const res = await axios.get(`${baseURL}/api/admin/getAllRoles`, {
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem("token")}`,
//                 },
//             });
//             if (res.data.success) {
//                 setRoles(res.data.roles);
//             }
//         } catch (error) {
//             toast.error(error.response?.data?.message || 'Error fetching roles');
//         }
//     };
//     const getAllCitys = async () => {
//         try {
//             const res = await axios.get(`${baseURL}/api/admin/getAllCities`, {
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem("token")}`,
//                 },
//             });
         
//             setCitys(res.data.cities)

//         } catch (error) {
//             toast.error(error.response?.data?.message || 'Error fetching roles');
//         }
//     };

//     const getAllRoleWithPremission = async (id) => {
//         try {

//             setRoleId(id)
//             const res = await axios.get(`${baseURL}/api/admin/getRoleWithPermissions`, {
//                 params: {
//                     role_id: id
//                 },
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem("token")}`,
//                 },
//             });
//             if (res.data.success) {
//                 setRolePermission(res.data.data)
//             }
//         } catch (error) {
//             toast.error(error.response?.data?.message || 'Error fetching roles');
//         }
//     };


//     const deleteWithRolePermission = async (permission_code) => {
       

//         try {
//             const res = await axios.post(`${baseURL}/api/admin/deleteRolePermission`,
//                 {
//                     role_id: roleId,
//                     permission_code: permission_code
//                 },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${localStorage.getItem("token")}`,
//                     },
//                 }
//             );
//             getAllRoleWithPremission(roleId)
          
//         } catch (error) {

//         }
//     }

//     // Create Role
//     const handleAddRole = async () => {
//         if (!roleForm.role_name) {
//             toast.warning('Please enter role name');
//             return;
//         }

//         try {
//             const res = await axios.post(`${baseURL}/api/admin/createRole`,
//                 roleForm,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${localStorage.getItem("token")}`,
//                     },
//                 }
//             );
//             if (res.data.success) {
//                 toast.success(res.data.message);
//                 setRoleForm({ role_name: "", description: "" });
//                 setShowAddRoleModal(false);
//                 getAllRoles(); // Refresh the list
//             }
//         } catch (error) {
//             toast.error(error.response?.data?.message || 'Something went wrong');
//         }
//     };

//     // Update Role
//     const handleUpdateRole = async () => {
//         if (!roleForm.role_name) {
//             toast.warning('Please enter role name');
//             return;
//         }

//         try {
//             const res = await axios.put(`${baseURL}/api/admin/updateRole/${selectedRole._id}`,
//                 roleForm,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${localStorage.getItem("token")}`,
//                     },
//                 }
//             );
//             if (res.data.success) {
//                 toast.success(res.data.message);
//                 setRoleForm({ role_name: "", description: "" });
//                 setShowEditRoleModal(false);
//                 setSelectedRole(null);
//                 getAllRoles();
//             }
//         } catch (error) {
//             toast.error(error.response?.data?.message || 'Error updating role');
//         }
//     };

//     // Delete Role
//     const handleDeleteRole = async () => {
//         try {
//             const res = await axios.delete(`${baseURL}/api/admin/deleteRole/${selectedRole._id}`, {
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem("token")}`,
//                 },
//             });
//             if (res.data.success) {
//                 toast.success(res.data.message);
//                 setShowDeleteRoleModal(false);
//                 setSelectedRole(null);
//                 getAllRoles();
//             }
//         } catch (error) {
//             toast.error(error.response?.data?.message || 'Error deleting role');
//         }
//     };



//     const handleAddPermissionToRole = async () => {
//         try {
//             const payload = {
//                 role_id: String(roleId),
//                 permission_id_with_city: Permission.map((perm) => ({
//                     permission_id: String(perm.id),
//                     cities_allowed: [...Cityvalue]
//                 }))
//             }

//             const res = await axios.post(`${baseURL}/api/admin/assignPermissionsToRole`, payload, {
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem("token")}`,
//                 },
//             });

//             toast.success(res.data.message)
//         } catch (error) {
//             toast.error(error.response?.data?.message || 'Something went wrong');
//         }

//     }

//     // ============ PERMISSION CRUD OPERATIONS ============

//     // Get All Permissions
//     const getAllPermissions = async () => {
//         try {
//             const res = await axios.get(`${baseURL}/api/admin/getAllPermissionsCode`, {
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem("token")}`,
//                 },
//             });
//             if (res.data.success) {
//                 setPermissions(res.data.permissions);
//             }
//         } catch (error) {
//             toast.error(error.response?.data?.message || 'Error fetching permissions');
//         }
//     };

//     // Create Permission
//     const handleAddPermission = async () => {
//         if (!permissionForm.permission_code) {
//             toast.warning('Please enter permission code');
//             return;
//         }

//         try {
//             const res = await axios.post(`${baseURL}/api/admin/createPermission`,
//                 permissionForm,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${localStorage.getItem("token")}`,
//                     },
//                 }
//             );
//             if (res.data.success) {
//                 toast.success(res.data.message);
//                 setPermissionForm({ permission_code: "", description: "" });
//                 setShowAddPermissionModal(false);
//                 getAllPermissions();
//             }
//         } catch (error) {
//             toast.error(error.response?.data?.message || 'Something went wrong');
//         }
//     };

//     // Update Permission
//     const handleUpdatePermission = async (id) => {
//         if (!permissionForm.permission_code) {
//             toast.warning('Please enter permission code');
//             return;
//         }

//         try {

//             const res = await axios.post(
//                 `${baseURL}/api/admin/editPermission`,
//                 {
//                     permissions: {
//                         permission_code: permissionForm.permission_code,
//                         description: permissionForm.description
//                     },
//                     permission_id: id,
//                 },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${localStorage.getItem("token")}`,
//                         "Content-Type": "application/json"
//                     }
//                 }
//             );
            
//             if (res.data.success) {
//                 toast.success(res.data.data.message);
//                 setPermissionForm({ permission_code: "", description: "" });
//                 setShowEditPermissionModal(false);
//                 setSelectedPermission(null);
//                 getAllPermissions();
//             }
//         } catch (error) {
//             toast.error(error.response?.data?.message || 'Error updating permission');
//         }
//     };

//     // Delete Permission
//     const handleDeletePermission = async () => {
//         try {
//             const res = await axios.delete(`${baseURL}/api/admin/deletePermission/${selectedPermission._id}`, {
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem("token")}`,
//                 },
//             });
//             if (res.data.success) {
//                 toast.success(res.data.message);
//                 setShowDeletePermissionModal(false);
//                 setSelectedPermission(null);
//                 getAllPermissions();
//             }
//         } catch (error) {
//             toast.error(error.response?.data?.message || 'Error deleting permission');
//         }
//     };

//     // ============ UTILITY FUNCTIONS ============

   

//     const openEditPermissionModal = (permission) => {
//         setSelectedPermission(permission);
//         setPermissionForm({
//             permission_code: permission.permission_code,
//             description: permission.description || ''
//         });
//         setShowEditPermissionModal(true);
//     };



//     // Load data on component mount
//     useEffect(() => {
//         getAllRoles();
//         getAllPermissions();
//         getAllCitys()
//         // getAllRoleWithPremission()
//     }, []);
   
//     return (
//         <div className="space-y-6">
//             {/* Header */}
//             <div className=" p-4 sm:p-6">
//                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

//                     {/* Left Side */}
//                     <div className="flex items-center gap-2">
                    
//                         <h2 className="text-lg sm:text-xl font-semibold dar:text-white">
//                             Role & Permission Management
//                         </h2>
//                     </div>

//                     {/* Right Side Buttons */}
//                     <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">



//                         <AlertDialog

//                         >
//                             <AlertDialogTrigger asChild>
//                                 <Button variant="outline"
//                                     className='text-[#0446DB]'
//                                 >

//                                     <Plus className="w-4 h-4" />
//                                     Add Role
//                                 </Button>
//                             </AlertDialogTrigger>
//                             <AlertDialogContent

//                             >
//                                 <AlertDialogHeader

//                                 >
//                                     <AlertDialogTitle
//                                         className=''
//                                     >

//                                         <div className="flex items-center gap-3">
//                                             <div className="p-2 bg-white/20 rounded-lg">

//                                             </div>
//                                             <div>
//                                                 <h2 className="text-xl font-semibold text-[#524bba]">Add New Role</h2>

//                                             </div>
//                                         </div>
//                                     </AlertDialogTitle>
//                                     <AlertDialogDescription>

//                                         <div className="p-4 w-[630px]  ">
//                                             <div className="mb-4 ">
//                                                 <label className="block text-sm text-left font-medium text-gray-700 mb-1">Role Name *</label>
//                                                 <input
//                                                     type="text"
//                                                     value={roleForm.role_name}
//                                                     onChange={(e) => setRoleForm({ ...roleForm, role_name: e.target.value })}
//                                                     placeholder="Enter Role"
//                                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                                                 />
//                                             </div>
//                                             <button
//                                                 onClick={handleAddRole}
//                                                 className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg flex items-center justify-center"
//                                             >
//                                                 <Save className="w-4 h-4 inline mr-1" />
//                                                 Add Role
//                                             </button>
//                                         </div>


//                                     </AlertDialogDescription>
//                                 </AlertDialogHeader>
//                                 <AlertDialogFooter>
//                                     <AlertDialogCancel>Cancel</AlertDialogCancel>
//                                     {/* <AlertDialogAction>Continue</AlertDialogAction> */}
//                                 </AlertDialogFooter>
//                             </AlertDialogContent>
//                         </AlertDialog>


//                         <AlertDialog

//                         >
//                             <AlertDialogTrigger asChild>
//                                 <Button variant="outline"
//                                     className='text-[#0446DB]'
//                                 >

//                                     <Plus className="w-4 h-4" />
//                                     Add Permission
//                                 </Button>
//                             </AlertDialogTrigger>
//                             <AlertDialogContent

//                             >
//                                 <AlertDialogHeader

//                                 >
//                                     <AlertDialogTitle
//                                         className=''
//                                     >

//                                         <div className="flex items-center gap-3">
//                                             <div className="p-2 bg-white/20 rounded-lg">

//                                             </div>
//                                             <div>
//                                                 <h2 className="text-xl font-semibold text-[#524bba]">Add New Permission</h2>

//                                             </div>
//                                         </div>
//                                     </AlertDialogTitle>
//                                     <AlertDialogDescription
//                                         className='w-full'
//                                     >


//                                         <div className="p-4">
//                                             <div className="mb-4">
//                                                 <label className="block text-left font-medium text-gray-700 mb-1">Permission Code*</label>
//                                                 <input
//                                                     type="text"
//                                                     value={permissionForm.permission_code}
                                                    
//                                                     onChange={(e) => setPermissionForm({ ...permissionForm, permission_code: e.target.value })}
//                                                     placeholder="e.g., view_dashboard, export_reports"
//                                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                                                 />
//                                             </div>
//                                             <div className="mb-0">
//                                                 <label className="block text-left font-medium text-gray-700 mb-1">Description</label>
//                                                 <input
//                                                     type="text"
//                                                     value={permissionForm.description}
//                                                     onChange={(e) => setPermissionForm({ ...permissionForm, description: e.target.value })}
//                                                     placeholder="Brief description of this permission"
//                                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                                                 />
//                                             </div>
//                                             <button onClick={handleAddPermission} className="px-4 mt-2 py-2 w-full bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg">
//                                                 <Save className="w-4 h-4 inline mr-1" />
//                                                 Add Permission
//                                             </button>
//                                         </div>




//                                     </AlertDialogDescription>
//                                 </AlertDialogHeader>
//                                 <AlertDialogFooter>
//                                     <AlertDialogCancel>Cancel</AlertDialogCancel>
//                                     {/* <AlertDialogAction>Continue</AlertDialogAction> */}
//                                 </AlertDialogFooter>
//                             </AlertDialogContent>
//                         </AlertDialog>

//                         <button
//                             onClick={() => setShowAddPermissionToRoleModal(true)}
//                             className="inline-flex whitespace-nowrap justify-center items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors w-full sm:w-auto"
//                         >
//                             <Plus className="w-4 h-4" />
//                             Add Permission To Role
//                         </button>

//                     </div>
//                 </div>
//             </div>

//             {/* Two Column Layout */}
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 {/* Roles Table */}
//                 <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
//                     <div className="flex items-center justify-between mb-4">
//                         <div className="flex items-center gap-2">
//                             <Users className="w-5 h-5 text-blue-600" />
//                             <h3 className="text-lg font-semibold text-gray-800">Roles</h3>
//                             <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
//                                 {roles.length} Roles
//                             </span>
//                         </div>
//                     </div>

//                     <div className="border border-gray-200 rounded-lg overflow-hidden">
//                         <table className="min-w-full divide-y divide-gray-200">
//                             <thead className="bg-gray-50">
//                                 <tr>
//                                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role Name</th>

//                                     <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
//                                 </tr>
//                             </thead>
//                             <tbody className="bg-white divide-y divide-gray-200">
//                                 {roles.length > 0 ? (
//                                     roles.map((role) => (
//                                         <tr key={role._id} className="hover:bg-gray-50">
//                                             <td className="px-4 py-3">
//                                                 <p className="text-sm font-medium text-gray-800">{role.role_name}</p>
//                                             </td>



//                                             <td className="px-4 py-3 text-right">
//                                                 <button

//                                                     onClick={() => getAllRoleWithPremission(role.id)}
//                                                     className="text-gray-400 cursor-pointer hover:text-blue-600 mr-2"
//                                                 >
//                                                     <Eye className="w-4 h-4 " />
//                                                 </button>

//                                             </td>
//                                         </tr>
//                                     ))
//                                 ) : (
//                                     <tr>
//                                         <td colSpan="3" className="px-4 py-8 text-center text-gray-500">
//                                             No roles found
//                                         </td>
//                                     </tr>
//                                 )}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>

//                 {/* Permissions Table */}
//                 <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
//                     <div className="flex items-center justify-between mb-4">
//                         <div className="flex items-center gap-2">
//                             <Key className="w-5 h-5 text-green-600" />
//                             <h3 className="text-lg font-semibold text-gray-800">Permissions</h3>
//                             <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
//                                 {permissions.length} Permissions
//                             </span>
//                         </div>
//                     </div>

//                     <div className="border border-gray-200 rounded-lg overflow-hidden">
//                         <table className="min-w-full divide-y divide-gray-200">
//                             <thead className="bg-gray-50">
//                                 <tr>
//                                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Permission Code</th>
//                                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
//                                     <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
//                                 </tr>
//                             </thead>
//                             <tbody className="bg-white divide-y divide-gray-200">
//                                 {permissions.length > 0 ? (
//                                     permissions.map((permission) => (
//                                         <tr key={permission._id} className="hover:bg-gray-50">
//                                             <td className="px-4 py-3">
//                                                 <p className="text-sm font-medium text-gray-800">{permission.permission_code}</p>
//                                             </td>
//                                             <td className="px-4 py-3">
//                                                 <p className="text-sm text-gray-600">{permission.description || '-'}</p>
//                                             </td>
//                                             <td className="px-4 py-3 text-right">
//                                                 <button
//                                                     onClick={() => openEditPermissionModal(permission)}
//                                                     className="text-gray-400 cursor-pointer hover:text-blue-600 mr-2"
//                                                 >
//                                                     <Edit2 className="w-4 h-4" />
//                                                 </button>

//                                             </td>
//                                         </tr>
//                                     ))
//                                 ) : (
//                                     <tr>
//                                         <td colSpan="3" className="px-4 py-8 text-center text-gray-500">
//                                             No permissions found
//                                         </td>
//                                     </tr>
//                                 )}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             </div>

//             {/* ============ MODALS ============ */}





//             {/* Add Role Modal */}
//             {(rolePermission?.length > 0 && rolePermission) && (
//                 <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//                     <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full mx-4 max-h-[80vh] overflow-hidden animate-fadeIn">
//                         {/* Header */}
//                         <div className="px-6 py-5 border-b border-gray-100 bg-white">
//                             <div className="flex items-center justify-between">
//                                 <div className="flex items-center gap-3">
//                                     <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
//                                         <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
//                                         </svg>
//                                     </div>
//                                     <div>
//                                         <h2 className="text-lg font-semibold text-gray-900">Role Permissions</h2>
//                                         <p className="text-sm text-gray-500">View all permissions and assigned cities for this user</p>
//                                     </div>


//                                 </div>

//                                 <button
//                                     onClick={() => setRolePermission([])}
//                                     className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
//                                 >
//                                     <X className="w-5 h-5 text-gray-500" />
//                                 </button>
//                             </div>
//                         </div>

//                         {/* Content */}
//                         <div className="p-6 bg-gray-50/50 max-h-[calc(90vh-120px)] overflow-y-auto">

//                             {
//                                 rolePermission?.map((permission) => {
//                                     return (
//                                         <>
//                                             <div className="p-3 border relative rounded-lg bg-gray-50 mb-2">
//                                                 <button
//                                                     onClick={() => deleteWithRolePermission(permission?.permission_code)}
//                                                     className="w-4 h-4 absolute -top-1 -right-1 rounded-lg bg-red-400 flex items-center justify-center transition-colors"
//                                                 >
//                                                     <X className="w-5 h-5 text-white" />
//                                                 </button>
//                                                 {/* Permission Code */}
//                                                 <p className="font-semibold text-gray-800">
//                                                     {permission?.permission_code}
//                                                 </p>

//                                                 {/* Cities */}
//                                                 <div className="flex flex-wrap gap-2 mt-2">
//                                                     {Array.isArray(permission?.cities) &&
//                                                         permission.cities.length > 0 ? (
//                                                         permission.cities.map((city, index) => (
//                                                             <span
//                                                                 key={index}
//                                                                 className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full"
//                                                             >
//                                                                 {city}
//                                                             </span>
//                                                         ))
//                                                     ) : (
//                                                         <span className="text-gray-400 text-sm">No Cities</span>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         </>
//                                     )
//                                 })
//                             }


//                         </div>


//                     </div>
//                 </div>
//             )}





//             {/* Delete Role Modal */}
//             {showDeleteRoleModal && selectedRole && (
//                 <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
//                     <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
//                         <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
//                             <Trash2 className="w-6 h-6 text-red-600" />
//                         </div>
//                         <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">Delete Role</h3>
//                         <p className="text-sm text-gray-600 text-center mb-4">
//                             Are you sure you want to delete <span className="font-semibold">"{selectedRole.role_name}"</span>? This action cannot be undone.
//                         </p>
//                         <div className="flex gap-2">
//                             <button onClick={() => setShowDeleteRoleModal(false)} className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
//                                 Cancel
//                             </button>
//                             <button onClick={handleDeleteRole} className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg">
//                                 Delete
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Add Permission Modal */}
//             {showAddPermissionModal && (
//                 <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
//                     <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
//                         <div className="flex items-center justify-between p-4 border-b">
//                             <h3 className="text-lg font-semibold text-gray-800">Add New Permission</h3>
//                             <button onClick={() => setShowAddPermissionModal(false)} className="text-gray-400 hover:text-gray-600">
//                                 <X className="w-5 h-5" />
//                             </button>
//                         </div>
//                         <div className="p-4">
//                             <div className="mb-4">
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Permission Code *</label>
//                                 <input
//                                     type="text"
//                                     value={permissionForm.permission_code}
//                                     onChange={(e) => setPermissionForm({ ...permissionForm, permission_code: e.target.value })}
//                                     placeholder="e.g., view_dashboard, export_reports"
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                                 />
//                             </div>
//                             <div className="mb-4">
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//                                 <input
//                                     type="text"
//                                     value={permissionForm.description}
//                                     onChange={(e) => setPermissionForm({ ...permissionForm, description: e.target.value })}
//                                     placeholder="Brief description of this permission"
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                                 />
//                             </div>
//                         </div>
//                         <div className="flex justify-end gap-2 p-4 border-t">
//                             <button onClick={() => {
//                                 setPermissionForm({})
//                                 setShowAddPermissionModal(false)
//                             }} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
//                                 Cancel
//                             </button>
//                             <button onClick={handleAddPermission} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg">
//                                 <Save className="w-4 h-4 inline mr-1" />
//                                 Add Permission
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//             {showAddPermissionToRoleModal && (
//                 <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50">
//                     <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
//                         <div className="flex items-center justify-between p-4 border-b">
//                             <h3 className="text-lg font-semibold text-gray-800">Add Permissionn To Role</h3>
//                             <button onClick={() => setShowAddPermissionToRoleModal(false)} className="text-gray-400 hover:text-gray-600">
//                                 <X className="w-5 h-5" />
//                             </button>
//                         </div>
//                         <div className="p-4">
//                             <div className="mb-4">
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
//                                 <select
//                                     name=""
//                                     id=""
//                                     onChange={(e) => {
//                                         setRoleId(e.target.value)
//                                     }}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                                 >
//                                     <option value=""
//                                     >Select Role</option>
//                                     {
//                                         roles.map((role) => {
//                                             return (
//                                                 <>
//                                                     <option value={role?.id}>{role?.role_name}</option>
//                                                 </>
//                                             )
//                                         })
//                                     }
//                                 </select>
//                             </div>
//                             <div className="mb-4">
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Permission *</label>

//                                 <Combobox
//                                     multiple
//                                     autoHighlight
//                                     items={permissions}
//                                     // defaultValue={[permissions]}
//                                     onValueChange={setPermission}
//                                 >
//                                     <ComboboxChips ref={anchor} className="w-full">
//                                         <ComboboxValue>
//                                             {(values) => (
//                                                 <React.Fragment>
//                                                     {values.map((value) => (
//                                                         <ComboboxChip key={value.id}>{value?.permission_code}</ComboboxChip>
//                                                     ))}
//                                                     <ComboboxChipsInput />
//                                                 </React.Fragment>
//                                             )}
//                                         </ComboboxValue>
//                                     </ComboboxChips>
//                                     <ComboboxContent anchor={anchor}>
//                                         <ComboboxEmpty>No items found.</ComboboxEmpty>
//                                         <ComboboxList>
//                                             {(item) => (
//                                                 <ComboboxItem key={item.id} value={item}>
//                                                     {item?.permission_code}
//                                                 </ComboboxItem>
//                                             )}
//                                         </ComboboxList>
//                                     </ComboboxContent>
//                                 </Combobox>
//                             </div>
//                             <div className="mb-4">
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>

//                                 <Combobox
//                                     multiple
//                                     autoHighlight
//                                     items={citys}
//                                     // defaultValue={[citys[0]]}
//                                     onValueChange={setValue}
//                                 >
//                                     <ComboboxChips ref={anchor} className="w-full">
//                                         <ComboboxValue>
//                                             {(values) => (
//                                                 <React.Fragment>
//                                                     {values.map((value) => (
//                                                         <ComboboxChip key={value}>{value}</ComboboxChip>
//                                                     ))}
//                                                     <ComboboxChipsInput />
//                                                 </React.Fragment>
//                                             )}
//                                         </ComboboxValue>
//                                     </ComboboxChips>
//                                     <ComboboxContent anchor={anchor}>
//                                         <ComboboxEmpty>No items found.</ComboboxEmpty>
//                                         <ComboboxList>
//                                             {(item) => (
//                                                 <ComboboxItem key={item} value={item}>
//                                                     {item}
//                                                 </ComboboxItem>
//                                             )}
//                                         </ComboboxList>
//                                     </ComboboxContent>
//                                 </Combobox>
//                             </div>



//                         </div>
//                         <div className="flex justify-end gap-2 p-4 border-t">
//                             <button onClick={() => {
//                                 setPermissionForm({})
//                                 setShowAddPermissionToRoleModal(false)
//                                 setShowAddPermissionModal(false)
//                             }} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
//                                 Cancel
//                             </button>
//                             <button onClick={handleAddPermissionToRole} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg">
//                                 <Save className="w-4 h-4 inline mr-1" />
//                                 Add
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Edit Permission Modal */}
//             {showEditPermissionModal && selectedPermission && (
//                 <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
//                     <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
//                         <div className="flex items-center justify-between p-4 border-b">
//                             <h3 className="text-lg font-semibold text-gray-800">Edit Permission</h3>
//                             <button onClick={() => setShowEditPermissionModal(false)} className="text-gray-400 hover:text-gray-600">
//                                 <X className="w-5 h-5" />
//                             </button>
//                         </div>
//                         <div className="p-4">
//                             <div className="mb-4">
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Permission Code *</label>
//                                 <input
//                                     type="text"
//                                     value={permissionForm.permission_code}
//                                     disabled
//                                     onChange={(e) => setPermissionForm({ ...permissionForm, permission_code: e.target.value })}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                                 />
//                             </div>
//                             <div className="mb-4">
//                                 <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//                                 <input
//                                     type="text"
//                                     value={permissionForm.description}
//                                     onChange={(e) => setPermissionForm({ ...permissionForm, description: e.target.value })}
//                                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                                 />
//                             </div>
//                         </div>
//                         <div className="flex justify-end gap-2 p-4 border-t">
//                             <button onClick={() => {
//                                 setPermissionForm({
//                                     permission_code: "",
//                                     description: ""
//                                 })
//                                 setShowEditPermissionModal(false)
//                             }} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
//                                 Cancel
//                             </button>
//                             <button onClick={() => {

//                                 handleUpdatePermission(selectedPermission?.id)
//                             }} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg">
//                                 <Save className="w-4 h-4 inline mr-1" />
//                                 Update Permission
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Delete Permission Modal */}
//             {showDeletePermissionModal && selectedPermission && (
//                 <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
//                     <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
//                         <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full mb-4">
//                             <Trash2 className="w-6 h-6 text-red-600" />
//                         </div>
//                         <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">Delete Permission</h3>
//                         <p className="text-sm text-gray-600 text-center mb-4">
//                             Are you sure you want to delete <span className="font-semibold">"{selectedPermission.permission_code}"</span>? This action cannot be undone.
//                         </p>
//                         <div className="flex gap-2">
//                             <button onClick={() => setShowDeletePermissionModal(false)} className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
//                                 Cancel
//                             </button>
//                             <button onClick={handleDeletePermission} className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg">
//                                 Delete
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default RolePermissionManager;



// @ts-nocheck


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

        <div className="flex h-[calc(100dvh-90px)] min-h-0 flex-col gap-4 overflow-hidden ">

            {/* Header */}

            <div className="z-10 shrink-0  dark:border-slate-800 dark:bg-slate-950">

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">



                    {/* Left Side */}

                    <div className="flex items-center gap-2">



                        <h2 className="text-lg sm:text-xl font-semibold dar:text-white">

                            Role & Permission Management

                        </h2>

                    </div>



                    {/* Right Side Buttons */}

                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">







                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="outline" className="h-9 gap-2 rounded-lg border-[#0446DB]/25 bg-white px-4 text-sm font-semibold text-[#0446DB] hover:bg-blue-50 dark:bg-neutral-900 dark:text-blue-400 dark:hover:bg-blue-950/40">
                                    <Plus className="h-4 w-4" /> Add Role
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="flex max-h-[min(90dvh,620px)] w-[calc(100vw-24px)] max-w-lg flex-col gap-0 overflow-hidden rounded-xl border border-slate-200 bg-white p-0 shadow-2xl dark:border-neutral-700 dark:bg-neutral-900">
                                <AlertDialogHeader className="sticky top-0 z-10 shrink-0 border-b border-slate-100 bg-white px-6 py-5 text-left dark:border-neutral-800 dark:bg-neutral-900">
                                    <AlertDialogTitle className="flex items-center gap-3 text-lg font-semibold text-slate-900 dark:text-white">
                                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0446DB]/10 text-[#0446DB] dark:bg-blue-500/15 dark:text-blue-400"><Shield className="h-5 w-5" /></span>
                                        Add New Role
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className="pl-[52px] text-xs text-slate-500 dark:text-slate-400">Create an administrative access role.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
                                    <label htmlFor="admin-role-name" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Role Name <span className="text-red-500">*</span></label>
                                    <input id="admin-role-name" type="text" value={roleForm.role_name} onChange={(e) => setRoleForm({ ...roleForm, role_name: e.target.value })} placeholder="e.g., Operations Manager" className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/15 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" />
                                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Use a descriptive name to identify this role.</p>
                                </div>
                                <AlertDialogFooter className="sticky bottom-0 z-10 flex shrink-0 flex-row justify-end gap-2 border-t border-slate-100 bg-slate-50 px-6 py-4 dark:border-neutral-800 dark:bg-neutral-900">
                                    <AlertDialogCancel className="mt-0 h-9 rounded-lg border-slate-200 bg-white px-4 text-slate-700 hover:bg-slate-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white">Cancel</AlertDialogCancel>
                                    <Button type="button" onClick={handleAddRole} className="h-9 gap-2 rounded-lg bg-[#0446DB] px-5 font-medium text-white hover:bg-[#0337ad]"><Save className="h-4 w-4" /> Add Role</Button>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="outline" className="h-9 gap-2 rounded-lg border-[#0446DB]/25 bg-white px-4 text-sm font-semibold text-[#0446DB] hover:bg-blue-50 dark:bg-neutral-900 dark:text-blue-400 dark:hover:bg-blue-950/40">
                                    <Plus className="h-4 w-4" /> Add Permission
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="flex max-h-[min(90dvh,620px)] w-[calc(100vw-24px)] max-w-lg flex-col gap-0 overflow-hidden rounded-xl border border-slate-200 bg-white p-0 shadow-2xl dark:border-neutral-700 dark:bg-neutral-900">
                                <AlertDialogHeader className="sticky top-0 z-10 shrink-0 border-b border-slate-100 bg-white px-6 py-5 text-left dark:border-neutral-800 dark:bg-neutral-900">
                                    <AlertDialogTitle className="flex items-center gap-3 text-lg font-semibold text-slate-900 dark:text-white">
                                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0446DB]/10 text-[#0446DB] dark:bg-blue-500/15 dark:text-blue-400"><Key className="h-5 w-5" /></span>
                                        Add New Permission
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className="pl-[52px] text-xs text-slate-500 dark:text-slate-400">Define a permission available to administrative roles.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-6">
                                    <div>
                                        <label htmlFor="admin-permission-code" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Permission Code <span className="text-red-500">*</span></label>
                                        <input id="admin-permission-code" type="text" value={permissionForm.permission_code} onChange={(e) => setPermissionForm({ ...permissionForm, permission_code: e.target.value })} placeholder="e.g., VIEW_DASHBOARD" className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/15 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" />
                                    </div>
                                    <div>
                                        <label htmlFor="admin-permission-description" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Description</label>
                                        <input id="admin-permission-description" type="text" value={permissionForm.description} onChange={(e) => setPermissionForm({ ...permissionForm, description: e.target.value })} placeholder="Brief description of this permission" className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/15 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" />
                                    </div>
                                </div>
                                <AlertDialogFooter className="sticky bottom-0 z-10 flex shrink-0 flex-row justify-end gap-2 border-t border-slate-100 bg-slate-50 px-6 py-4 dark:border-neutral-800 dark:bg-neutral-900">
                                    <AlertDialogCancel className="mt-0 h-9 rounded-lg border-slate-200 bg-white px-4 text-slate-700 hover:bg-slate-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white">Cancel</AlertDialogCancel>
                                    <Button type="button" onClick={handleAddPermission} className="h-9 gap-2 rounded-lg bg-[#0446DB] px-5 font-medium text-white hover:bg-[#0337ad]"><Save className="h-4 w-4" /> Add Permission</Button>
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

            <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-y-auto lg:grid-cols-2 lg:overflow-hidden">

                {/* Roles Table */}

                <div className="flex min-h-[260px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950 lg:min-h-0">

                    <div className="flex items-center justify-between mb-4">

                        <div className="flex items-center gap-2">

                            <Users className="w-5 h-5 text-blue-600" />

                            <h3 className="text-lg font-semibold text-gray-800">Roles</h3>

                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">

                                {roles.length} Roles

                            </span>

                        </div>

                    </div>



                    <div className="min-h-0 flex-1 overflow-auto rounded-lg border border-slate-200 dark:border-slate-800">

                        <table className="min-w-full divide-y divide-gray-200">

                            <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-900">

                                <tr>

                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role Name</th>



                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>

                                </tr>

                            </thead>

                            <tbody className="divide-y divide-gray-200 bg-white dark:divide-slate-800 dark:bg-slate-950">

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

                <div className="flex min-h-[260px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950 lg:min-h-0">

                    <div className="flex items-center justify-between mb-4">

                        <div className="flex items-center gap-2">

                            <Key className="w-5 h-5 text-green-600" />

                            <h3 className="text-lg font-semibold text-gray-800">Permissions</h3>

                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">

                                {permissions.length} Permissions

                            </span>

                        </div>

                    </div>



                    <div className="min-h-0 flex-1 overflow-auto rounded-lg border border-slate-200 dark:border-slate-800">

                        <table className="min-w-full divide-y divide-gray-200">

                            <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-900">

                                <tr>

                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Permission Code</th>

                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>

                                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>

                                </tr>

                            </thead>

                            <tbody className="divide-y divide-gray-200 bg-white dark:divide-slate-800 dark:bg-slate-950">

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











            {/* Role Permissions Modal */}
            {rolePermission !== null && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-[3px] sm:p-6">
                    <div role="dialog" aria-modal="true" aria-labelledby="role-permissions-title" className="flex max-h-[min(85dvh,740px)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-950">
                        <div className="z-10 flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white px-5 py-4 dark:border-slate-800 dark:bg-slate-950 sm:px-6">
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0446DB] dark:bg-blue-950/50 dark:text-blue-400"><Shield className="h-5 w-5" /></div>
                                <div className="min-w-0"><h2 id="role-permissions-title" className="text-base font-semibold text-slate-900 dark:text-white">Role Permissions</h2><p className="text-xs text-slate-500 dark:text-slate-400">Assigned access permissions and service cities</p></div>
                            </div>
                            <button type="button" aria-label="Close role permissions" onClick={() => setRolePermission(null)} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-100 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"><X className="h-4 w-4" /></button>
                        </div>
                        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-slate-50/70 p-4 dark:bg-slate-900/50 sm:p-6">
                            {rolePermission?.length > 0 ? rolePermission.map((permission, index) => (
                                <div key={`${permission.permission_code}-${index}`} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex min-w-0 items-center gap-2"><Key className="h-4 w-4 shrink-0 text-[#0446DB]"/><span className="break-all text-sm font-semibold text-slate-900 dark:text-slate-100">{permission?.permission_code}</span></div>
                                        <button type="button" title="Remove permission" aria-label={`Remove ${permission?.permission_code}`} onClick={() => deleteWithRolePermission(permission?.permission_code)} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-red-100 text-red-500 transition hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-950/40"><Trash2 className="h-4 w-4" /></button>
                                    </div>
                                    <div className="mt-3 flex flex-wrap items-center gap-1.5">{Array.isArray(permission?.cities) && permission.cities.length > 0 ? permission.cities.map((city, cityIndex) => (<span key={`${city}-${cityIndex}`} className="rounded-md border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-medium text-[#0446DB] dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300">{city}</span>)) : <span className="text-xs text-slate-400">No cities assigned</span>}</div>
                                </div>
                            )) : <div className="rounded-xl border border-dashed border-slate-200 bg-white px-5 py-12 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-950">No permissions assigned to this role.</div>}
                        </div>
                        <div className="z-10 flex shrink-0 items-center justify-between gap-3 border-t border-slate-200 bg-white px-5 py-3 dark:border-slate-800 dark:bg-slate-950 sm:px-6">
                            <span className="text-xs text-slate-500">{rolePermission?.length ?? 0} permission(s)</span>
                            <button type="button" onClick={() => setRolePermission(null)} className="rounded-lg bg-[#0446DB] px-4 py-2 text-sm font-medium text-white hover:bg-blue-800">Done</button>
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
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-6">
                    <div role="dialog" aria-modal="true" aria-labelledby="assign-role-title" className="flex max-h-[min(90dvh,760px)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-950">
                        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white px-5 py-4 dark:border-slate-800 dark:bg-slate-950 sm:px-6">
                            <div className="flex min-w-0 items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0446DB] dark:bg-blue-950/60 dark:text-blue-400"><Shield className="h-5 w-5" /></div>
                                <div className="min-w-0"><h3 id="assign-role-title" className="text-base font-semibold text-slate-900 dark:text-white">Assign Permissions to Role</h3><p className="text-xs text-slate-500 dark:text-slate-400">Choose permissions and their allowed cities</p></div>
                            </div>
                            <button type="button" aria-label="Close dialog" onClick={() => setShowAddPermissionToRoleModal(false)} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"><X className="h-4 w-4" /></button>
                        </div>
                        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto bg-slate-50/60 px-5 py-5 dark:bg-slate-900/40 sm:px-6">
                            <div>
                                <label htmlFor="assign-role-select" className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-200">Select Role <span className="text-red-500">*</span></label>
                                <select id="assign-role-select" value={roleId ?? ""} onChange={(e) => setRoleId(e.target.value)} className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"><option value="">Select a role</option>{roles.map((role) => <option key={role?.id ?? role?._id} value={role?.id ?? role?._id}>{role?.role_name}</option>)}</select>
                            </div>
                            <div>
                                <div className="mb-2 flex items-center justify-between gap-3"><label className="text-xs font-semibold text-slate-700 dark:text-slate-200">Permissions <span className="text-red-500">*</span></label><span className="text-xs font-medium text-[#0446DB] dark:text-blue-400">{Permission.length} selected</span></div>
                                <div className="max-h-48 space-y-1 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-950">
                                    {permissions.length ? permissions.map((permission) => {
                                        const selected = Permission.some((item) => String(item.id ?? item._id) === String(permission.id ?? permission._id));
                                        return <label key={permission.id ?? permission._id} className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 transition ${selected ? "bg-blue-50 dark:bg-blue-950/40" : "hover:bg-slate-50 dark:hover:bg-slate-900"}`}><input type="checkbox" checked={selected} onChange={() => setPermission((previous) => selected ? previous.filter((item) => String(item.id ?? item._id) !== String(permission.id ?? permission._id)) : [...previous, permission])} className="h-4 w-4 rounded border-slate-300 accent-[#0446DB]" /><span className="break-all text-sm font-medium text-slate-700 dark:text-slate-200">{permission.permission_code}</span></label>;
                                    }) : <p className="p-3 text-sm text-slate-500">No permissions available.</p>}
                                </div>
                            </div>
                            <div>
                                <div className="mb-2 flex items-center justify-between gap-3"><label className="text-xs font-semibold text-slate-700 dark:text-slate-200">Allowed Cities <span className="text-red-500">*</span></label><span className="text-xs font-medium text-[#0446DB] dark:text-blue-400">{Cityvalue.length} selected</span></div>
                                <div className="flex max-h-40 flex-wrap content-start gap-2 overflow-y-auto rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-950">
                                    {citys.length ? citys.map((city) => {
                                        const cityName = typeof city === "string" ? city : (city?.city_name ?? city?.name ?? String(city?.id ?? ""));
                                        const selected = Cityvalue.includes(cityName);
                                        return <label key={cityName} className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition ${selected ? "border-blue-200 bg-blue-50 text-[#0446DB] dark:border-blue-700 dark:bg-blue-950/50 dark:text-blue-300" : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"}`}><input type="checkbox" checked={selected} onChange={() => setValue((previous) => selected ? previous.filter((item) => item !== cityName) : [...previous, cityName])} className="h-3.5 w-3.5 accent-[#0446DB]" />{cityName}</label>;
                                    }) : <p className="text-sm text-slate-500">No cities available.</p>}
                                </div>
                            </div>
                            <p className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-400">Selected cities will apply to each selected permission.</p>
                        </div>
                        <div className="flex shrink-0 items-center justify-end gap-2 border-t border-slate-200 bg-white px-5 py-4 dark:border-slate-800 dark:bg-slate-950 sm:px-6">
                            <button type="button" onClick={() => setShowAddPermissionToRoleModal(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">Cancel</button>
                            <button type="button" onClick={handleAddPermissionToRole} className="inline-flex items-center gap-2 rounded-lg bg-[#0446DB] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0337ad]"><Save className="h-4 w-4" />Assign Permissions</button>
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










