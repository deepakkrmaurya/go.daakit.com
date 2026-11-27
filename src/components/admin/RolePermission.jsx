// import React, { useEffect, useRef, useState } from 'react';

// import { Shield, Plus, Edit2, Trash2, X, Save, Users, Lock, ChevronDown, ChevronUp, Key, Eye } from 'lucide-react';

// import axios from 'axios';

// import { toast } from 'react-toastify';

// import {

// useComboboxAnchor,

// } from "../../components/ui/combobox"

// import {

//     AlertDialog,

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

//     // Assignment dialog: prefill only from the selected role's existing access.
//     const [assignedRolePermissions, setAssignedRolePermissions] = useState([]);
//     const [loadingRoleAssignments, setLoadingRoleAssignments] = useState(false);
//     const roleAssignmentRequestRef = useRef(0);

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

//     // Read-only lookup. This does NOT assign, remove or update any permissions.
//     const loadAssignmentsForRole = async (selectedRoleId) => {
//         const requestId = ++roleAssignmentRequestRef.current;
//         setRoleId(selectedRoleId || null);
//         setPermission([]);
//         setValue([]);
//         setAssignedRolePermissions([]);

//         if (!selectedRoleId) {
//             setLoadingRoleAssignments(false);
//             return;
//         }

//         setLoadingRoleAssignments(true);
//         try {
//             const res = await axios.get(`${baseURL}/api/admin/getRoleWithPermissions`, {
//                 params: { role_id: selectedRoleId },
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem("token")}`,
//                 },
//             });

//             if (requestId !== roleAssignmentRequestRef.current) return;
//             if (res.data?.success === false) {
//                 throw new Error(res.data?.message || "Unable to load role permissions");
//             }

//             const entries = Array.isArray(res.data?.data) ? res.data.data : [];
//             setAssignedRolePermissions(entries);

//             // Resolve the assigned permission codes against the existing catalogue.
//             const assignedCodes = new Set(entries.map((item) =>
//                 String(item?.permission_code ?? item?.permission?.permission_code ?? "").trim()
//             ).filter(Boolean));
//             const assignedIds = new Set(entries.map((item) =>
//                 String(item?.permission_id ?? item?.permission?.id ?? "").trim()
//             ).filter(Boolean));
//             setPermission(permissions.filter((item) =>
//                 assignedCodes.has(String(item.permission_code ?? "").trim()) ||
//                 assignedIds.has(String(item.id ?? item._id ?? ""))
//             ));

//             // Current assignment form has one shared city selector. Display the
//             // union here; the per-permission mapping is also shown below.
//             const selectedCities = new Set();
//             entries.forEach((item) => {
//                 const values = item?.cities ?? item?.cities_allowed ?? [];
//                 (Array.isArray(values) ? values : []).forEach((city) => {
//                     const name = typeof city === "string"
//                         ? city
//                         : city?.city_name ?? city?.name ?? "";
//                     if (String(name).trim()) selectedCities.add(String(name).trim());
//                 });
//             });
//             setValue([...selectedCities]);
//         } catch (error) {
//             if (requestId === roleAssignmentRequestRef.current) {
//                 toast.error(error.response?.data?.message || error.message || "Error fetching role permissions");
//             }
//         } finally {
//             if (requestId === roleAssignmentRequestRef.current) {
//                 setLoadingRoleAssignments(false);
//             }
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

//         <div className="flex h-[calc(100dvh-90px)] min-h-0 flex-col gap-4 overflow-hidden ">

//             {/* Header */}

//             <div className="z-10 shrink-0  dark:border-slate-800 dark:bg-slate-950">

//                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

//                     {/* Left Side */}

//                     <div className="flex items-center gap-2">

//                         <h2 className="text-lg sm:text-xl font-semibold dar:text-white">

//                             Role & Permission Management

//                         </h2>

//                     </div>

//                     {/* Right Side Buttons */}

//                     <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">

//                         <AlertDialog>

//                             <AlertDialogTrigger asChild>

//                                 <Button variant="outline" className="h-9 gap-2 rounded-lg border-[#0446DB]/25 bg-white px-4 text-sm font-semibold text-[#0446DB] hover:bg-blue-50 dark:bg-neutral-900 dark:text-blue-400 dark:hover:bg-blue-950/40">

//                                     <Plus className="h-4 w-4" /> Add Role

//                                 </Button>

//                             </AlertDialogTrigger>

//                             <AlertDialogContent className="flex max-h-[min(90dvh,620px)] w-[calc(100vw-24px)] max-w-lg flex-col gap-0 overflow-hidden rounded-xl border border-slate-200 bg-white p-0 shadow-2xl dark:border-neutral-700 dark:bg-neutral-900">

//                                 <AlertDialogHeader className="sticky top-0 z-10 shrink-0 border-b border-slate-100 bg-white px-6 py-5 text-left dark:border-neutral-800 dark:bg-neutral-900">

//                                     <AlertDialogTitle className="flex items-center gap-3 text-lg font-semibold text-slate-900 dark:text-white">

//                                         <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0446DB]/10 text-[#0446DB] dark:bg-blue-500/15 dark:text-blue-400"><Shield className="h-5 w-5" /></span>

//                                         Add New Role

//                                     </AlertDialogTitle>

//                                     <AlertDialogDescription className="pl-[52px] text-xs text-slate-500 dark:text-slate-400">Create an administrative access role.</AlertDialogDescription>

//                                 </AlertDialogHeader>

//                                 <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">

//                                     <label htmlFor="admin-role-name" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Role Name <span className="text-red-500">*</span></label>

//                                     <input id="admin-role-name" type="text" value={roleForm.role_name} onChange={(e) => setRoleForm({ ...roleForm, role_name: e.target.value })} placeholder="e.g., Operations Manager" className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/15 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" />

//                                     <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">Use a descriptive name to identify this role.</p>

//                                 </div>

//                                 <AlertDialogFooter className="sticky bottom-0 z-10 flex shrink-0 flex-row justify-end gap-2 border-t border-slate-100 bg-slate-50 px-6 py-4 dark:border-neutral-800 dark:bg-neutral-900">

//                                     <AlertDialogCancel className="mt-0 h-9 rounded-lg border-slate-200 bg-white px-4 text-slate-700 hover:bg-slate-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white">Cancel</AlertDialogCancel>

//                                     <Button type="button" onClick={handleAddRole} className="h-9 gap-2 rounded-lg bg-[#0446DB] px-5 font-medium text-white hover:bg-[#0337ad]"><Save className="h-4 w-4" /> Add Role</Button>

//                                 </AlertDialogFooter>

//                             </AlertDialogContent>

//                         </AlertDialog>

//                         <AlertDialog>

//                             <AlertDialogTrigger asChild>

//                                 <Button variant="outline" className="h-9 gap-2 rounded-lg border-[#0446DB]/25 bg-white px-4 text-sm font-semibold text-[#0446DB] hover:bg-blue-50 dark:bg-neutral-900 dark:text-blue-400 dark:hover:bg-blue-950/40">

//                                     <Plus className="h-4 w-4" /> Add Permission

//                                 </Button>

//                             </AlertDialogTrigger>

//                             <AlertDialogContent className="flex max-h-[min(90dvh,620px)] w-[calc(100vw-24px)] max-w-lg flex-col gap-0 overflow-hidden rounded-xl border border-slate-200 bg-white p-0 shadow-2xl dark:border-neutral-700 dark:bg-neutral-900">

//                                 <AlertDialogHeader className="sticky top-0 z-10 shrink-0 border-b border-slate-100 bg-white px-6 py-5 text-left dark:border-neutral-800 dark:bg-neutral-900">

//                                     <AlertDialogTitle className="flex items-center gap-3 text-lg font-semibold text-slate-900 dark:text-white">

//                                         <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0446DB]/10 text-[#0446DB] dark:bg-blue-500/15 dark:text-blue-400"><Key className="h-5 w-5" /></span>

//                                         Add New Permission

//                                     </AlertDialogTitle>

//                                     <AlertDialogDescription className="pl-[52px] text-xs text-slate-500 dark:text-slate-400">Define a permission available to administrative roles.</AlertDialogDescription>

//                                 </AlertDialogHeader>

//                                 <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-6">

//                                     <div>

//                                         <label htmlFor="admin-permission-code" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Permission Code <span className="text-red-500">*</span></label>

//                                         <input id="admin-permission-code" type="text" value={permissionForm.permission_code} onChange={(e) => setPermissionForm({ ...permissionForm, permission_code: e.target.value })} placeholder="e.g., VIEW_DASHBOARD" className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/15 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" />

//                                     </div>

//                                     <div>

//                                         <label htmlFor="admin-permission-description" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Description</label>

//                                         <input id="admin-permission-description" type="text" value={permissionForm.description} onChange={(e) => setPermissionForm({ ...permissionForm, description: e.target.value })} placeholder="Brief description of this permission" className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/15 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white" />

//                                     </div>

//                                 </div>

//                                 <AlertDialogFooter className="sticky bottom-0 z-10 flex shrink-0 flex-row justify-end gap-2 border-t border-slate-100 bg-slate-50 px-6 py-4 dark:border-neutral-800 dark:bg-neutral-900">

//                                     <AlertDialogCancel className="mt-0 h-9 rounded-lg border-slate-200 bg-white px-4 text-slate-700 hover:bg-slate-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white">Cancel</AlertDialogCancel>

//                                     <Button type="button" onClick={handleAddPermission} className="h-9 gap-2 rounded-lg bg-[#0446DB] px-5 font-medium text-white hover:bg-[#0337ad]"><Save className="h-4 w-4" /> Add Permission</Button>

//                                 </AlertDialogFooter>

//                             </AlertDialogContent>

//                         </AlertDialog>

//                         <button

//                             onClick={() => { roleAssignmentRequestRef.current += 1; setRoleId(null); setPermission([]); setValue([]); setAssignedRolePermissions([]); setLoadingRoleAssignments(false); setShowAddPermissionToRoleModal(true); }}

//                             className="inline-flex whitespace-nowrap justify-center items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors w-full sm:w-auto"

//                         >

//                             <Plus className="w-4 h-4" />

//                             Add Permission To Role

//                         </button>

//                     </div>

//                 </div>

//             </div>

//             {/* Two Column Layout */}

//             <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-y-auto lg:grid-cols-2 lg:overflow-hidden">

//                 {/* Roles Table */}

//                 <div className="flex min-h-[260px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950 lg:min-h-0">

//                     <div className="flex items-center justify-between mb-4">

//                         <div className="flex items-center gap-2">

//                             <Users className="w-5 h-5 text-blue-600" />

//                             <h3 className="text-lg font-semibold text-gray-800">Roles</h3>

//                             <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">

//                                 {roles.length} Roles

//                             </span>

//                         </div>

//                     </div>

//                     <div className="min-h-0 flex-1 overflow-auto rounded-lg border border-slate-200 dark:border-slate-800">

//                         <table className="min-w-full divide-y divide-gray-200">

//                             <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-900">

//                                 <tr>

//                                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role Name</th>

//                                     <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>

//                                 </tr>

//                             </thead>

//                             <tbody className="divide-y divide-gray-200 bg-white dark:divide-slate-800 dark:bg-slate-950">

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

//                 <div className="flex min-h-[260px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950 lg:min-h-0">

//                     <div className="flex items-center justify-between mb-4">

//                         <div className="flex items-center gap-2">

//                             <Key className="w-5 h-5 text-green-600" />

//                             <h3 className="text-lg font-semibold text-gray-800">Permissions</h3>

//                             <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">

//                                 {permissions.length} Permissions

//                             </span>

//                         </div>

//                     </div>

//                     <div className="min-h-0 flex-1 overflow-auto rounded-lg border border-slate-200 dark:border-slate-800">

//                         <table className="min-w-full divide-y divide-gray-200">

//                             <thead className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-900">

//                                 <tr>

//                                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Permission Code</th>

//                                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>

//                                     <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>

//                                 </tr>

//                             </thead>

//                             <tbody className="divide-y divide-gray-200 bg-white dark:divide-slate-800 dark:bg-slate-950">

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

//             {/* Role Permissions Modal */}

//             {rolePermission !== null && (

//                 <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-[3px] sm:p-6">

//                     <div role="dialog" aria-modal="true" aria-labelledby="role-permissions-title" className="flex max-h-[min(85dvh,740px)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-950">

//                         <div className="z-10 flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white px-5 py-4 dark:border-slate-800 dark:bg-slate-950 sm:px-6">

//                             <div className="flex min-w-0 items-center gap-3">

//                                 <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0446DB] dark:bg-blue-950/50 dark:text-blue-400"><Shield className="h-5 w-5" /></div>

//                                 <div className="min-w-0"><h2 id="role-permissions-title" className="text-base font-semibold text-slate-900 dark:text-white">Role Permissions</h2><p className="text-xs text-slate-500 dark:text-slate-400">Assigned access permissions and service cities</p></div>

//                             </div>

//                             <button type="button" aria-label="Close role permissions" onClick={() => setRolePermission(null)} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-100 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"><X className="h-4 w-4" /></button>

//                         </div>

//                         <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-slate-50/70 p-4 dark:bg-slate-900/50 sm:p-6">

//                             {rolePermission?.length > 0 ? rolePermission.map((permission, index) => (

//                                 <div key={`${permission.permission_code}-${index}`} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">

//                                     <div className="flex items-start justify-between gap-3">

//                                         <div className="flex min-w-0 items-center gap-2"><Key className="h-4 w-4 shrink-0 text-[#0446DB]"/><span className="break-all text-sm font-semibold text-slate-900 dark:text-slate-100">{permission?.permission_code}</span></div>

//                                         <button type="button" title="Remove permission" aria-label={`Remove ${permission?.permission_code}`} onClick={() => deleteWithRolePermission(permission?.permission_code)} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-red-100 text-red-500 transition hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-950/40"><Trash2 className="h-4 w-4" /></button>

//                                     </div>

//                                     <div className="mt-3 flex flex-wrap items-center gap-1.5">{Array.isArray(permission?.cities) && permission.cities.length > 0 ? permission.cities.map((city, cityIndex) => (<span key={`${city}-${cityIndex}`} className="rounded-md border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-medium text-[#0446DB] dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300">{city}</span>)) : <span className="text-xs text-slate-400">No cities assigned</span>}</div>

//                                 </div>

//                             )) : <div className="rounded-xl border border-dashed border-slate-200 bg-white px-5 py-12 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-950">No permissions assigned to this role.</div>}

//                         </div>

//                         <div className="z-10 flex shrink-0 items-center justify-between gap-3 border-t border-slate-200 bg-white px-5 py-3 dark:border-slate-800 dark:bg-slate-950 sm:px-6">

//                             <span className="text-xs text-slate-500">{rolePermission?.length ?? 0} permission(s)</span>

//                             <button type="button" onClick={() => setRolePermission(null)} className="rounded-lg bg-[#0446DB] px-4 py-2 text-sm font-medium text-white hover:bg-blue-800">Done</button>

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

//                 <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-6">

//                     <div role="dialog" aria-modal="true" aria-labelledby="assign-role-title" className="flex max-h-[min(90dvh,760px)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-950">

//                         <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white px-5 py-4 dark:border-slate-800 dark:bg-slate-950 sm:px-6">

//                             <div className="flex min-w-0 items-center gap-3">

//                                 <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0446DB] dark:bg-blue-950/60 dark:text-blue-400"><Shield className="h-5 w-5" /></div>

//                                 <div className="min-w-0"><h3 id="assign-role-title" className="text-base font-semibold text-slate-900 dark:text-white">Assign Permissions to Role</h3><p className="text-xs text-slate-500 dark:text-slate-400">Choose permissions and their allowed cities</p></div>

//                             </div>

//                             <button type="button" aria-label="Close dialog" onClick={() => setShowAddPermissionToRoleModal(false)} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"><X className="h-4 w-4" /></button>

//                         </div>

//                         <div className="min-h-0 flex-1 space-y-5 overflow-y-auto bg-slate-50/60 px-5 py-5 dark:bg-slate-900/40 sm:px-6">

//                             <div>

//                                 <label htmlFor="assign-role-select" className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-200">Select Role <span className="text-red-500">*</span></label>

//                                 <select id="assign-role-select" value={roleId ?? ""} onChange={(e) => { void loadAssignmentsForRole(e.target.value); }} className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"><option value="">Select a role</option>{roles.map((role) => <option key={role?.id ?? role?._id} value={role?.id ?? role?._id}>{role?.role_name}</option>)}</select>

//                             </div>

//                             {loadingRoleAssignments && <p className="text-xs font-medium text-[#0446DB]" role="status">Loading existing role permissions and cities...</p>}

//                             <div>

//                                 <div className="mb-2 flex items-center justify-between gap-3"><label className="text-xs font-semibold text-slate-700 dark:text-slate-200">Permissions <span className="text-red-500">*</span></label><span className="text-xs font-medium text-[#0446DB] dark:text-blue-400">{Permission.length} selected</span></div>

//                                 <div className="max-h-48 space-y-1 overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-950">

//                                     {permissions.length ? permissions.map((permission) => {

//                                         const selected = Permission.some((item) => String(item.id ?? item._id) === String(permission.id ?? permission._id));

//                                         return <label key={permission.id ?? permission._id} className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 transition ${selected ? "bg-blue-50 dark:bg-blue-950/40" : "hover:bg-slate-50 dark:hover:bg-slate-900"}`}><input type="checkbox" disabled={loadingRoleAssignments} checked={selected} onChange={() => setPermission((previous) => selected ? previous.filter((item) => String(item.id ?? item._id) !== String(permission.id ?? permission._id)) : [...previous, permission])} className="h-4 w-4 rounded border-slate-300 accent-[#0446DB]" /><span className="break-all text-sm font-medium text-slate-700 dark:text-slate-200">{permission.permission_code}</span></label>;

//                                     }) : <p className="p-3 text-sm text-slate-500">No permissions available.</p>}

//                                 </div>

//                             </div>

//                             <div>

//                                 <div className="mb-2 flex items-center justify-between gap-3"><label className="text-xs font-semibold text-slate-700 dark:text-slate-200">Allowed Cities <span className="text-red-500">*</span></label><span className="text-xs font-medium text-[#0446DB] dark:text-blue-400">{Cityvalue.length} selected</span></div>

//                                 <div className="flex max-h-40 flex-wrap content-start gap-2 overflow-y-auto rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-950">

//                                     {citys.length ? citys.map((city) => {

//                                         const cityName = typeof city === "string" ? city : (city?.city_name ?? city?.name ?? String(city?.id ?? ""));

//                                         const selected = Cityvalue.includes(cityName);

//                                         return <label key={cityName} className={`inline-flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium transition ${selected ? "border-blue-200 bg-blue-50 text-[#0446DB] dark:border-blue-700 dark:bg-blue-950/50 dark:text-blue-300" : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"}`}><input type="checkbox" disabled={loadingRoleAssignments} checked={selected} onChange={() => setValue((previous) => selected ? previous.filter((item) => item !== cityName) : [...previous, cityName])} className="h-3.5 w-3.5 accent-[#0446DB]" />{cityName}</label>;

//                                     }) : <p className="text-sm text-slate-500">No cities available.</p>}

//                                 </div>

//                             </div>

//                         </div>

//                         <div className="flex shrink-0 items-center justify-end gap-2 border-t border-slate-200 bg-white px-5 py-4 dark:border-slate-800 dark:bg-slate-950 sm:px-6">

//                             <button type="button" onClick={() => setShowAddPermissionToRoleModal(false)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">Cancel</button>

//                             <button type="button" disabled={loadingRoleAssignments} onClick={handleAddPermissionToRole} className="inline-flex items-center gap-2 rounded-lg bg-[#0446DB] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0337ad]"><Save className="h-4 w-4" />Assign Permissions</button>

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

import React, { useEffect, useRef, useState } from "react";
import {
  Shield,
  Plus,
  Edit2,
  Trash2,
  X,
  Save,
  Users,
  Lock,
  ChevronDown,
  ChevronUp,
  Key,
  Eye,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useComboboxAnchor } from "../../components/ui/combobox";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
const baseURL = import.meta.env.VITE_BASE_URL;
const RolePermissionManager = () => {
  const anchor = useComboboxAnchor();
  const [Cityvalue, setValue] = React.useState([]);
  const [permissionCities, setPermissionCities] = useState({});
  const [permissionSearch, setPermissionSearch] = useState("");
  const [expandedCities, setExpandedCities] = useState({});
  const [bulkNotice, setBulkNotice] = useState("");
  const [assignmentError, setAssignmentError] = useState(false);
  const [savingAssignments, setSavingAssignments] = useState(false);
  const savingRef = useRef(false);
  const [Permission, setPermission] = React.useState([]);
  const [roleId, setRoleId] = useState(null);
  const [rolePermission, setRolePermission] = useState(null);
  // Assignment dialog: prefill only from the selected role's existing access.
  const [assignedRolePermissions, setAssignedRolePermissions] = useState([]);
  const [loadingRoleAssignments, setLoadingRoleAssignments] = useState(false);
  const roleAssignmentRequestRef = useRef(0);
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
    role_name: "",
  });
  const [permissionForm, setPermissionForm] = useState({
    permission_code: "",
    description: "",
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
      toast.error(error.response?.data?.message || "Error fetching roles");
    }
  };
  const getAllCitys = async () => {
    try {
      const res = await axios.get(`${baseURL}/api/admin/getAllCities`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setCitys(res.data.cities);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching roles");
    }
  };
  const getAllRoleWithPremission = async (id) => {
    try {
      setRoleId(id);
      const res = await axios.get(`${baseURL}/api/admin/getRoleWithPermissions`, {
        params: {
          role_id: id,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        setRolePermission(res.data.data);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching roles");
    }
  };
  // Read-only lookup. This does NOT assign, remove or update any permissions.
  const loadAssignmentsForRole = async (selectedRoleId) => {
    const requestId = ++roleAssignmentRequestRef.current;
    setRoleId(selectedRoleId || null);
    setPermission([]);
    setValue([]);
    setPermissionCities({});
    setAssignmentError(false);
    setPermissionSearch("");
    setExpandedCities({});
    setBulkNotice("");
    setAssignedRolePermissions([]);
    if (!selectedRoleId) {
      setLoadingRoleAssignments(false);
      return;
    }
    setLoadingRoleAssignments(true);
    try {
      const res = await axios.get(`${baseURL}/api/admin/getRoleWithPermissions`, {
        params: { role_id: selectedRoleId },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (requestId !== roleAssignmentRequestRef.current) return;
      if (res.data?.success === false) {
        throw new Error(res.data?.message || "Unable to load role permissions");
      }
      if (!Array.isArray(res.data?.data)) throw new Error("Unexpected role permissions response");
      const entries = res.data.data;
      setAssignedRolePermissions(entries);
      // Resolve the assigned permission codes against the existing catalogue.
      const assignedCodes = new Set(
        entries
          .map((item) =>
            String(item?.permission_code ?? item?.permission?.permission_code ?? "").trim(),
          )
          .filter(Boolean),
      );
      const assignedIds = new Set(
        entries
          .map((item) => String(item?.permission_id ?? item?.permission?.id ?? "").trim())
          .filter(Boolean),
      );
      setPermission(
        permissions.filter(
          (item) =>
            assignedCodes.has(String(item.permission_code ?? "").trim()) ||
            assignedIds.has(String(item.id ?? item._id ?? "")),
        ),
      );
      const mapping = {};
      for (const item of entries) {
        const id = item?.permission_id ?? item?.permission?.id;
        const code = item?.permission_code ?? item?.permission?.permission_code;
        const perm = permissions.find(
          (p) =>
            (id != null && String(p.id ?? p._id) === String(id)) ||
            (code && p.permission_code === code),
        );
        if (!perm)
          throw new Error(
            "An assigned permission is missing from the catalogue. Reload and try again.",
          );
        const key = String(perm.id ?? perm._id);
        const values = item.cities ?? item.cities_allowed ?? [];
        const names = Array.isArray(values) ? values.map(cityNameOf).filter(Boolean) : [];
        mapping[key] = [...new Set([...(mapping[key] || []), ...names])];
      }
      setPermissionCities(mapping);
    } catch (error) {
      if (requestId === roleAssignmentRequestRef.current) {
        setAssignmentError(true);
        toast.error(
          error.response?.data?.message || error.message || "Error fetching role permissions",
        );
      }
    } finally {
      if (requestId === roleAssignmentRequestRef.current) {
        setLoadingRoleAssignments(false);
      }
    }
  };
  const deleteWithRolePermission = async (permission_code) => {
    try {
      const res = await axios.post(
        `${baseURL}/api/admin/deleteRolePermission`,
        {
          role_id: roleId,
          permission_code: permission_code,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      getAllRoleWithPremission(roleId);
    } catch (error) {}
  };
  // Create Role
  const handleAddRole = async () => {
    if (!roleForm.role_name) {
      toast.warning("Please enter role name");
      return;
    }
    try {
      const res = await axios.post(`${baseURL}/api/admin/createRole`, roleForm, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        toast.success(res.data.message);
        setRoleForm({ role_name: "", description: "" });
        setShowAddRoleModal(false);
        getAllRoles(); // Refresh the list
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };
  // Update Role
  const handleUpdateRole = async () => {
    if (!roleForm.role_name) {
      toast.warning("Please enter role name");
      return;
    }
    try {
      const res = await axios.put(`${baseURL}/api/admin/updateRole/${selectedRole._id}`, roleForm, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        toast.success(res.data.message);
        setRoleForm({ role_name: "", description: "" });
        setShowEditRoleModal(false);
        setSelectedRole(null);
        getAllRoles();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating role");
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
      toast.error(error.response?.data?.message || "Error deleting role");
    }
  };
  const cityNameOf = (city) =>
    String(
      typeof city === "string" ? city : (city?.city_name ?? city?.name ?? city?.id ?? ""),
    ).trim();
  const assignmentDisabled =
    !roleId || loadingRoleAssignments || assignmentError || savingAssignments;
  const toggleCity = (values, city) =>
    values.includes(city) ? values.filter((x) => x !== city) : [...values, city];
  const permissionKey = (p) => String(p.id ?? p._id);
  const filteredPermissions = permissions.filter((p) =>
    `${p.permission_code ?? ""} ${p.description ?? ""}`
      .toLowerCase()
      .includes(permissionSearch.trim().toLowerCase()),
  );
  const allCityNames = [
    ...new Set((Array.isArray(citys) ? citys : []).map(cityNameOf).filter(Boolean)),
  ];
  const applyCitiesToAll = () => {
    if (assignmentDisabled || !Permission.length) return;
    const ids = Permission.map(permissionKey);
    const cities = [...Cityvalue];
    setPermissionCities((previous) => ({
      ...previous,
      ...Object.fromEntries(ids.map((id) => [id, [...cities]])),
    }));
    setBulkNotice(
      cities.length
        ? `Applied ${cities.length} cities to ${ids.length} permissions.`
        : `Cleared cities from ${ids.length} permissions.`,
    );
    toast.success(
      cities.length
        ? `Cities applied to ${ids.length} permissions`
        : `Cities cleared from ${ids.length} permissions`,
    );
  };
  const togglePermissionSelection = (permission) => {
    const id = permissionKey(permission);
    setPermission((previous) =>
      previous.some((p) => permissionKey(p) === id)
        ? previous.filter((p) => permissionKey(p) !== id)
        : [...previous, permission],
    );
    setBulkNotice("");
  };
  const selectVisiblePermissions = () => {
    setPermission((previous) => [
      ...new Map([...previous, ...filteredPermissions].map((p) => [permissionKey(p), p])).values(),
    ]);
    setBulkNotice("");
  };
  const closeAssignment = () => {
    if (savingRef.current) return;
    roleAssignmentRequestRef.current += 1;
    setShowAddPermissionToRoleModal(false);
    setLoadingRoleAssignments(false);
  };
  const handleAddPermissionToRole = async () => {
    if (assignmentDisabled || savingRef.current) return;
    if (!Permission.length) return toast.warning("Select at least one permission");
    savingRef.current = true;
    setSavingAssignments(true);
    try {
      const payload = {
        role_id: String(roleId),
        permission_id_with_city: Permission.map((p) => ({
          permission_id: String(p.id ?? p._id),
          cities_allowed: [...(permissionCities[String(p.id ?? p._id)] || [])],
        })),
      };
      const res = await axios.post(`${baseURL}/api/admin/assignPermissionsToRole`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      if (res.data?.success === false) throw new Error(res.data.message || "Assignment failed");
      toast.success(res.data?.message || "Permissions assigned successfully");
    //   setShowAddPermissionToRoleModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || "Something went wrong");
    } finally {
      savingRef.current = false;
      setSavingAssignments(false);
    }
  };
  const renderCityChoices = (values, onToggle) => {
    const names = [...new Set([...allCityNames, ...values].filter(Boolean))];
    return (
      <div className="flex flex-wrap gap-2">
        {names.length ? (
          names.map((name) => (
            <label
              key={name}
              className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium ${values.includes(name) ? "border-blue-200 bg-blue-50 text-[#0446DB] dark:bg-blue-950/50 dark:text-blue-300" : "border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"}`}
            >
              <input
                type="checkbox"
                disabled={assignmentDisabled}
                checked={values.includes(name)}
                onChange={() => onToggle(name)}
                className="h-3.5 w-3.5 accent-[#0446DB]"
              />
              {name}
            </label>
          ))
        ) : (
          <p className="text-xs text-slate-500">No cities available.</p>
        )}
      </div>
    );
  };
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
      toast.error(error.response?.data?.message || "Error fetching permissions");
    }
  };
  // Create Permission
  const handleAddPermission = async () => {
    if (!permissionForm.permission_code) {
      toast.warning("Please enter permission code");
      return;
    }
    try {
      const res = await axios.post(`${baseURL}/api/admin/createPermission`, permissionForm, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.data.success) {
        toast.success(res.data.message);
        setPermissionForm({ permission_code: "", description: "" });
        // setShowAddPermissionModal(false);
        getAllPermissions();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };
  // Update Permission
  const handleUpdatePermission = async (id) => {
    if (!permissionForm.permission_code) {
      toast.warning("Please enter permission code");
      return;
    }
    try {
      const res = await axios.post(
        `${baseURL}/api/admin/editPermission`,
        {
          permissions: {
            permission_code: permissionForm.permission_code,
            description: permissionForm.description,
          },
          permission_id: id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        },
      );
      if (res.data.success) {
        toast.success(res.data.data.message);
        setPermissionForm({ permission_code: "", description: "" });
        setShowEditPermissionModal(false);
        setSelectedPermission(null);
        getAllPermissions();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating permission");
    }
  };
  // Delete Permission
  const handleDeletePermission = async () => {
    try {
      const res = await axios.delete(
        `${baseURL}/api/admin/deletePermission/${selectedPermission._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      if (res.data.success) {
        toast.success(res.data.message);
        setShowDeletePermissionModal(false);
        setSelectedPermission(null);
        getAllPermissions();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting permission");
    }
  };
  // ============ UTILITY FUNCTIONS ============
  const openEditPermissionModal = (permission) => {
    setSelectedPermission(permission);
    setPermissionForm({
      permission_code: permission.permission_code,
      description: permission.description || "",
    });
    setShowEditPermissionModal(true);
  };
  // Load data on component mount
  useEffect(() => {
    getAllRoles();
    getAllPermissions();
    getAllCitys();
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
                <Button
                  variant="outline"
                  className="h-9 gap-2 rounded-lg border-[#0446DB]/25 bg-white px-4 text-sm font-semibold text-[#0446DB] hover:bg-blue-50 dark:bg-neutral-900 dark:text-blue-400 dark:hover:bg-blue-950/40"
                >
                  <Plus className="h-4 w-4" /> Add Role
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="flex max-h-[min(90dvh,620px)] w-[calc(100vw-24px)] max-w-lg flex-col gap-0 overflow-hidden rounded-xl border border-slate-200 bg-white p-0 shadow-2xl dark:border-neutral-700 dark:bg-neutral-900">
                <AlertDialogHeader className="sticky top-0 z-10 shrink-0 border-b border-slate-100 bg-white px-6 py-5 text-left dark:border-neutral-800 dark:bg-neutral-900">
                  <AlertDialogTitle className="flex items-center gap-3 text-lg font-semibold text-slate-900 dark:text-white">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0446DB]/10 text-[#0446DB] dark:bg-blue-500/15 dark:text-blue-400">
                      <Shield className="h-5 w-5" />
                    </span>
                    Add New Role
                  </AlertDialogTitle>
                  <AlertDialogDescription className="pl-[52px] text-xs text-slate-500 dark:text-slate-400">
                    Create an administrative access role.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6">
                  <label
                    htmlFor="admin-role-name"
                    className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
                  >
                    Role Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="admin-role-name"
                    type="text"
                    value={roleForm.role_name}
                    onChange={(e) => setRoleForm({ ...roleForm, role_name: e.target.value })}
                    placeholder="e.g., Operations Manager"
                    className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/15 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                  />
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    Use a descriptive name to identify this role.
                  </p>
                </div>
                <AlertDialogFooter className="sticky bottom-0 z-10 flex shrink-0 flex-row justify-end gap-2 border-t border-slate-100 bg-slate-50 px-6 py-4 dark:border-neutral-800 dark:bg-neutral-900">
                  <AlertDialogCancel className="mt-0 h-9 rounded-lg border-slate-200 bg-white px-4 text-slate-700 hover:bg-slate-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white">
                    Cancel
                  </AlertDialogCancel>
                  <Button
                    type="button"
                    onClick={handleAddRole}
                    className="h-9 gap-2 rounded-lg bg-[#0446DB] px-5 font-medium text-white hover:bg-[#0337ad]"
                  >
                    <Save className="h-4 w-4" /> Add Role
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="outline"
                  className="h-9 gap-2 rounded-lg border-[#0446DB]/25 bg-white px-4 text-sm font-semibold text-[#0446DB] hover:bg-blue-50 dark:bg-neutral-900 dark:text-blue-400 dark:hover:bg-blue-950/40"
                >
                  <Plus className="h-4 w-4" /> Add Permission
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="flex max-h-[min(90dvh,620px)] w-[calc(100vw-24px)] max-w-lg flex-col gap-0 overflow-hidden rounded-xl border border-slate-200 bg-white p-0 shadow-2xl dark:border-neutral-700 dark:bg-neutral-900">
                <AlertDialogHeader className="sticky top-0 z-10 shrink-0 border-b border-slate-100 bg-white px-6 py-5 text-left dark:border-neutral-800 dark:bg-neutral-900">
                  <AlertDialogTitle className="flex items-center gap-3 text-lg font-semibold text-slate-900 dark:text-white">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0446DB]/10 text-[#0446DB] dark:bg-blue-500/15 dark:text-blue-400">
                      <Key className="h-5 w-5" />
                    </span>
                    Add New Permission
                  </AlertDialogTitle>
                  <AlertDialogDescription className="pl-[52px] text-xs text-slate-500 dark:text-slate-400">
                    Define a permission available to administrative roles.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-6">
                  <div>
                    <label
                      htmlFor="admin-permission-code"
                      className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
                    >
                      Permission Code <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="admin-permission-code"
                      type="text"
                      value={permissionForm.permission_code}
                      onChange={(e) =>
                        setPermissionForm({ ...permissionForm, permission_code: e.target.value })
                      }
                      placeholder="e.g., VIEW_DASHBOARD"
                      className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/15 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="admin-permission-description"
                      className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200"
                    >
                      Description
                    </label>
                    <input
                      id="admin-permission-description"
                      type="text"
                      value={permissionForm.description}
                      onChange={(e) =>
                        setPermissionForm({ ...permissionForm, description: e.target.value })
                      }
                      placeholder="Brief description of this permission"
                      className="h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-[#0446DB]/15 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                    />
                  </div>
                </div>
                <AlertDialogFooter className="sticky bottom-0 z-10 flex shrink-0 flex-row justify-end gap-2 border-t border-slate-100 bg-slate-50 px-6 py-4 dark:border-neutral-800 dark:bg-neutral-900">
                  <AlertDialogCancel className="mt-0 h-9 rounded-lg border-slate-200 bg-white px-4 text-slate-700 hover:bg-slate-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-white">
                    Cancel
                  </AlertDialogCancel>
                  <Button
                    type="button"
                    onClick={handleAddPermission}
                    className="h-9 gap-2 rounded-lg bg-[#0446DB] px-5 font-medium text-white hover:bg-[#0337ad]"
                  >
                    <Save className="h-4 w-4" /> Add Permission
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <button
              onClick={() => {
                roleAssignmentRequestRef.current += 1;
                setRoleId(null);
                setPermission([]);
                setValue([]);
                setPermissionCities({});
                setAssignmentError(false);
                setPermissionSearch("");
                setExpandedCities({});
                setBulkNotice("");
                setAssignedRolePermissions([]);
                setLoadingRoleAssignments(false);
                setShowAddPermissionToRoleModal(true);
              }}
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Role Name
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Permission Code
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Description
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white dark:divide-slate-800 dark:bg-slate-950">
                {permissions.length > 0 ? (
                  permissions.map((permission) => (
                    <tr key={permission._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-800">
                          {permission.permission_code}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-sm text-gray-600">{permission.description || "-"}</p>
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
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="role-permissions-title"
            className="flex max-h-[min(85dvh,740px)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-950"
          >
            <div className="z-10 flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white px-5 py-4 dark:border-slate-800 dark:bg-slate-950 sm:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0446DB] dark:bg-blue-950/50 dark:text-blue-400">
                  <Shield className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h2
                    id="role-permissions-title"
                    className="text-base font-semibold text-slate-900 dark:text-white"
                  >
                    Role Permissions
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Assigned access permissions and service cities
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close role permissions"
                onClick={() => setRolePermission(null)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-100 dark:border-slate-800 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto bg-slate-50/70 p-4 dark:bg-slate-900/50 sm:p-6">
              {rolePermission?.length > 0 ? (
                rolePermission.map((permission, index) => (
                  <div
                    key={`${permission.permission_code}-${index}`}
                    className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2">
                        <Key className="h-4 w-4 shrink-0 text-[#0446DB]" />
                        <span className="break-all text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {permission?.permission_code}
                        </span>
                      </div>
                      <button
                        type="button"
                        title="Remove permission"
                        aria-label={`Remove ${permission?.permission_code}`}
                        onClick={() => deleteWithRolePermission(permission?.permission_code)}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-red-100 text-red-500 transition hover:bg-red-50 dark:border-red-900/40 dark:hover:bg-red-950/40"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-1.5">
                      {Array.isArray(permission?.cities) && permission.cities.length > 0 ? (
                        permission.cities.map((city, cityIndex) => (
                          <span
                            key={`${city}-${cityIndex}`}
                            className="rounded-md border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-medium text-[#0446DB] dark:border-blue-900 dark:bg-blue-950/40 dark:text-blue-300"
                          >
                            {city}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400">No cities assigned</span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-slate-200 bg-white px-5 py-12 text-center text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-950">
                  No permissions assigned to this role.
                </div>
              )}
            </div>
            <div className="z-10 flex shrink-0 items-center justify-between gap-3 border-t border-slate-200 bg-white px-5 py-3 dark:border-slate-800 dark:bg-slate-950 sm:px-6">
              <span className="text-xs text-slate-500">
                {rolePermission?.length ?? 0} permission(s)
              </span>
              <button
                type="button"
                onClick={() => setRolePermission(null)}
                className="rounded-lg bg-[#0446DB] px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
              >
                Done
              </button>
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
              Are you sure you want to delete{" "}
              <span className="font-semibold">"{selectedRole.role_name}"</span>? This action cannot
              be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteRoleModal(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteRole}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg"
              >
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
              <button
                onClick={() => setShowAddPermissionModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Permission Code *
                </label>
                <input
                  type="text"
                  value={permissionForm.permission_code}
                  onChange={(e) =>
                    setPermissionForm({ ...permissionForm, permission_code: e.target.value })
                  }
                  placeholder="e.g., view_dashboard, export_reports"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={permissionForm.description}
                  onChange={(e) =>
                    setPermissionForm({ ...permissionForm, description: e.target.value })
                  }
                  placeholder="Brief description of this permission"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t">
              <button
                onClick={() => {
                  setPermissionForm({});
                  setShowAddPermissionModal(false);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleAddPermission}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg"
              >
                <Save className="w-4 h-4 inline mr-1" />
                Add Permission
              </button>
            </div>
          </div>
        </div>
      )}
      {showAddPermissionToRoleModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-6">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="assign-role-title"
            className="flex max-h-[min(90dvh,760px)] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-950"
          >
            <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white px-5 py-4 dark:border-slate-800 dark:bg-slate-950 sm:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0446DB] dark:bg-blue-950/60 dark:text-blue-400">
                  <Shield className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h3
                    id="assign-role-title"
                    className="text-base font-semibold text-slate-900 dark:text-white"
                  >
                    Assign Permissions to Role
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Choose permissions and optionally their allowed cities
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Close dialog"
                onClick={closeAssignment}
                disabled={savingAssignments}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto bg-slate-50/60 px-5 py-5 dark:bg-slate-900/40 sm:px-6">
              <div>
                <label
                  htmlFor="assign-role-select"
                  className="mb-2 block text-xs font-semibold text-slate-700 dark:text-slate-200"
                >
                  Select Role <span className="text-red-500">*</span>
                </label>
                <select
                  id="assign-role-select"
                  disabled={savingAssignments}
                  value={roleId ?? ""}
                  onChange={(e) => {
                    void loadAssignmentsForRole(e.target.value);
                  }}
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                >
                  <option value="">Select a role</option>
                  {roles.map((role) => (
                    <option key={role?.id ?? role?._id} value={role?.id ?? role?._id}>
                      {role?.role_name}
                    </option>
                  ))}
                </select>
              </div>
              {loadingRoleAssignments && (
                <p className="text-xs font-medium text-[#0446DB]" role="status">
                  Loading existing role permissions and cities...
                </p>
              )}
              {assignmentError && (
                <p role="alert" className="text-sm text-red-600">
                  Could not load existing permissions. Select the role again or reopen this dialog.
                </p>
              )}
              {!roleId ? (
                <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500">
                  Select a role to manage its permissions.
                </div>
              ) : (
                <>
                  <section className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="text-sm font-semibold text-slate-800 dark:text-white">
                        1. Select permissions
                      </h4>
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#0446DB] dark:bg-blue-950 dark:text-blue-300">
                        {Permission.length} selected
                      </span>
                    </div>
                    <input
                      type="search"
                      value={permissionSearch}
                      onChange={(e) => setPermissionSearch(e.target.value)}
                      placeholder="Search permissions..."
                      className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm dark:border-slate-700 dark:bg-slate-950 dark:text-white"
                    />
                    <div className="flex flex-wrap gap-3 text-xs font-medium">
                      <button
                        type="button"
                        disabled={assignmentDisabled || !filteredPermissions.length}
                        onClick={selectVisiblePermissions}
                        className="text-[#0446DB] disabled:opacity-40"
                      >
                        {permissionSearch
                          ? "Select matching permissions"
                          : "Select all permissions"}
                      </button>
                      <button
                        type="button"
                        disabled={assignmentDisabled || !Permission.length}
                        onClick={() => {
                          setPermission([]);
                          setBulkNotice("");
                        }}
                        className="text-slate-500 disabled:opacity-40"
                      >
                        Clear selection
                      </button>
                    </div>
                    <div className="max-h-48 overflow-y-auto rounded-xl border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950">
                      {filteredPermissions.length ? (
                        filteredPermissions.map((permission) => {
                          const id = permissionKey(permission);
                          const selected = Permission.some((p) => permissionKey(p) === id);
                          return (
                            <label
                              key={id}
                              className="flex cursor-pointer items-center gap-3 border-b border-slate-100 px-3 py-2.5 last:border-0 dark:border-slate-800"
                            >
                              <input
                                type="checkbox"
                                checked={selected}
                                disabled={assignmentDisabled}
                                onChange={() => togglePermissionSelection(permission)}
                                className="h-4 w-4 accent-[#0446DB]"
                              />
                              <span className="min-w-0 flex-1 break-all text-xs font-medium text-slate-700 dark:text-slate-200">
                                {permission.permission_code}
                              </span>
                              {selected && (
                                <span className="shrink-0 text-xs text-slate-500">
                                  {(permissionCities[id] || []).length} cities
                                </span>
                              )}
                            </label>
                          );
                        })
                      ) : (
                        <p className="p-4 text-sm text-slate-500">No matching permissions.</p>
                      )}
                    </div>
                  </section>
                  <section className="space-y-3 rounded-xl border border-blue-200 bg-blue-50/40 p-4 dark:border-blue-800 dark:bg-blue-950/20">
                    <h4 className="text-sm font-semibold text-slate-800 dark:text-white">
                      2. Apply common cities (optional)
                    </h4>
                    <p className="text-xs text-slate-500">
                      Choose cities once, then apply them to all {Permission.length} selected
                      permissions. This replaces their previous cities.
                    </p>
                    <div className="flex gap-4 text-xs font-medium">
                      <button
                        type="button"
                        disabled={assignmentDisabled || !allCityNames.length}
                        onClick={() => {
                          setValue([...allCityNames]);
                          setBulkNotice("");
                        }}
                        className="text-[#0446DB] disabled:opacity-40"
                      >
                        Select all cities
                      </button>
                      <button
                        type="button"
                        disabled={assignmentDisabled}
                        onClick={() => {
                          setValue([]);
                          setBulkNotice("");
                        }}
                        className="text-slate-500 disabled:opacity-40"
                      >
                        Clear cities
                      </button>
                    </div>
                    {renderCityChoices(Cityvalue, (city) => {
                      setValue((prev) => toggleCity(prev, city));
                      setBulkNotice("");
                    })}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs text-slate-500">
                        {Cityvalue.length} cities selected
                      </span>
                      <button
                        type="button"
                        disabled={assignmentDisabled || !Permission.length}
                        onClick={applyCitiesToAll}
                        className="rounded-lg bg-[#0446DB] px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        {Cityvalue.length
                          ? `Apply to ${Permission.length} selected permissions`
                          : `Clear cities for ${Permission.length} selected permissions`}
                      </button>
                    </div>
                    {bulkNotice && (
                      <p
                        role="status"
                        className="text-xs font-semibold text-green-700 dark:text-green-400"
                      >
                        {bulkNotice} You can customize each below.
                      </p>
                    )}
                  </section>
                  <section className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="text-sm font-semibold text-slate-800 dark:text-white">
                        3. Review & customize cities
                      </h4>
                      <button
                        type="button"
                        disabled={!Permission.length}
                        onClick={() =>
                          setExpandedCities(
                            Object.fromEntries(Permission.map((p) => [permissionKey(p), true])),
                          )
                        }
                        className="text-xs font-medium text-[#0446DB] disabled:opacity-40"
                      >
                        Expand all
                      </button>
                    </div>
                    {!Permission.length && (
                      <p className="rounded-lg border border-dashed p-4 text-xs text-slate-500">
                        Select permissions above to customize their cities.
                      </p>
                    )}
                    {Permission.map((permission) => {
                      const id = permissionKey(permission);
                      const values = permissionCities[id] || [];
                      return (
                        <div
                          key={id}
                          className="overflow-hidden rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-950"
                        >
                          <button
                            type="button"
                            aria-expanded={!!expandedCities[id]}
                            onClick={() =>
                              setExpandedCities((prev) => ({ ...prev, [id]: !prev[id] }))
                            }
                            className="flex w-full items-center gap-3 px-3 py-3 text-left"
                          >
                            <div className="min-w-0 flex-1">
                              <p className="break-all text-xs font-semibold text-slate-800 dark:text-white">
                                {permission.permission_code}
                              </p>
                              <div className="mt-1 flex flex-wrap gap-1">
                                {values.length ? (
                                  values.map((city) => (
                                    <span
                                      key={city}
                                      className="rounded bg-blue-50 px-2 py-0.5 text-xs text-[#0446DB] dark:bg-blue-950 dark:text-blue-300"
                                    >
                                      {city}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-xs text-slate-500">No cities selected</span>
                                )}
                              </div>
                            </div>
                            <span className="shrink-0 text-xs font-medium text-[#0446DB]">
                              Edit cities
                            </span>
                            {expandedCities[id] ? (
                              <ChevronUp className="h-4 w-4 text-slate-500" />
                            ) : (
                              <ChevronDown className="h-4 w-4 text-slate-500" />
                            )}
                          </button>
                          {expandedCities[id] && (
                            <div className="space-y-3 border-t border-slate-100 p-3 dark:border-slate-800">
                              <div className="flex gap-4 text-xs font-medium">
                                <button
                                  type="button"
                                  disabled={assignmentDisabled}
                                  onClick={() => {
                                    setPermissionCities((prev) => ({
                                      ...prev,
                                      [id]: [...allCityNames],
                                    }));
                                    setBulkNotice("");
                                  }}
                                  className="text-[#0446DB]"
                                >
                                  Select all cities
                                </button>
                                <button
                                  type="button"
                                  disabled={assignmentDisabled}
                                  onClick={() => {
                                    setPermissionCities((prev) => ({ ...prev, [id]: [] }));
                                    setBulkNotice("");
                                  }}
                                  className="text-slate-500"
                                >
                                  Clear
                                </button>
                              </div>
                              {renderCityChoices(values, (city) => {
                                setPermissionCities((prev) => ({
                                  ...prev,
                                  [id]: toggleCity(prev[id] || [], city),
                                }));
                                setBulkNotice("");
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </section>
                </>
              )}
            </div>
            <div className="flex shrink-0 items-center justify-end gap-2 border-t border-slate-200 bg-white px-5 py-4 dark:border-slate-800 dark:bg-slate-950 sm:px-6">
              <button
                type="button"
                onClick={closeAssignment}
                disabled={savingAssignments}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={assignmentDisabled || !Permission.length}
                onClick={handleAddPermissionToRole}
                className="inline-flex items-center gap-2 rounded-lg bg-[#0446DB] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0337ad] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Save className="h-4 w-4" />
                {savingAssignments ? "Saving..." : `Save  permissions`}
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
              <button
                onClick={() => setShowEditPermissionModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Permission Code *
                </label>
                <input
                  type="text"
                  value={permissionForm.permission_code}
                  disabled
                  onChange={(e) =>
                    setPermissionForm({ ...permissionForm, permission_code: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={permissionForm.description}
                  onChange={(e) =>
                    setPermissionForm({ ...permissionForm, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 p-4 border-t">
              <button
                onClick={() => {
                  setPermissionForm({
                    permission_code: "",
                    description: "",
                  });
                  setShowEditPermissionModal(false);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleUpdatePermission(selectedPermission?.id);
                }}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg"
              >
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
            <h3 className="text-lg font-semibold text-gray-800 text-center mb-2">
              Delete Permission
            </h3>
            <p className="text-sm text-gray-600 text-center mb-4">
              Are you sure you want to delete{" "}
              <span className="font-semibold">"{selectedPermission.permission_code}"</span>? This
              action cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeletePermissionModal(false)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePermission}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg"
              >
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
