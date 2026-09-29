
// import { useEffect, useState } from 'react';
// import {
//     UserPlus, Save, Eye, EyeOff, Mail, Phone, User, Key,
//     Shield, AlertCircle,
//     EyeIcon,
//     Loader2
// } from 'lucide-react';
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from "@/components/ui/table";
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
// import axios from 'axios';
// import { toast } from 'react-toastify';

// const baseURL = import.meta.env.VITE_BASE_URL;
// const UserManagement = () => {
//     const [users, setUsers] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [showPassword, setShowPassword] = useState(false);

//     const [roles, setRoles] = useState([]);
//     const [errors, setErrors] = useState({});
//     const [formData, setFormData] = useState({
//         name: '',
//         phone: '',
//         email: '',
//         password: '',
//         role_id: '',
//         usertype: null,
//         is_verified: 1
//     });

//     const fetchRoles = async () => {
//         try {
//             const res = await axios.get(`${baseURL}/api/admin/getAllRoles`, {
//                 headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
//             });
//             if (res.data.success) setRoles(res.data.roles);
//         } catch (error) {
//             toast.error('Error fetching roles');
//         }
//     };

//     const validateForm = () => {
//         const newErrors = {};
//         if (!formData.name?.trim()) newErrors.name = 'Name is required';
//         if (!formData.phone?.trim()) newErrors.phone = 'Phone number is required';
//         else if (!/^[0-9]{10,15}$/.test(formData.phone)) newErrors.phone = 'Invalid phone number';
//         if (!formData.email?.trim()) newErrors.email = 'Email is required';
//         else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';
//         if (!formData.password) newErrors.password = 'Password is required';
//         else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
//         if (!formData.role_id) newErrors.role_id = 'Please select a role';

//         setErrors(newErrors);
//         return Object.keys(newErrors).length === 0;
//     };

//     const handleInputChange = (e) => {
//         const { name, value } = e.target;


//         setFormData(prev => ({ ...prev, [name]: value }));
//         if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
//     };


//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         if (!validateForm()) {
//             toast.warning('Please fill all required fields');
//             return;
//         }



//         setLoading(true);

//         try {
//             const submitData = {
//                 ...formData,

//             };





//             const res = await axios.post(`${baseURL}/api/admin/addUser`, submitData, {
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem("token")}`,
//                     'Content-Type': 'application/json'
//                 }
//             });




//             toast.success('User created successfully!');
            
//             // onUserAdded?.(res.data.user);
            
//             fetchUsers();
//             return

//         } catch (error) {
//             // toast.error(error.response?.data?.message || 'Failed to create user');
//         } finally {
//             setLoading(false);
//         }
//     };
//     // Fetch users
//     const fetchUsers = async () => {
//         setLoading(true)
//         try {
//             const res = await axios.get(`${baseURL}/api/admin/getAllUsers`, {
//                 headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
//             });
//             if (res.data.data.status === 200) {

//                 setUsers(res.data.data.users);
//             }
//         } catch (error) {
//             setLoading(false)
//             toast.error('Error fetching users');
//         } finally {
//             setLoading(false)
//         }
//     };

//     useEffect(() => {
//         fetchUsers();
//         fetchRoles()
//     }, []);


//     const [permission, setPermission] = useState([])
//     const getUserPermission = async (userId) => {


//         try {
//             const res = await axios.get(`${baseURL}/api/admin/getRoleWithPermissions`, {
//                 params: {
//                     role_id: userId
//                 },
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem("token")}`,
//                 },
//             });


//             if (res.data.success) {
//                 setPermission(res.data.data)
//             }
//         } catch (error) {
//             toast.error('Error deleting user');
//         }
//     };

//     const handleStatusChange = async (user) => {
//         const updatedStatus = !user.is_active;

//         const res = await axios.post(
//             `${baseURL}/api/admin/updateUser/${user.id}`,
//             {
//                 is_active: updatedStatus ? "1" : "0",
//             },
//             {
//                 headers: {
//                     Authorization: `Bearer ${localStorage.getItem("token")}`,
//                 },
//             }
//         );
//         fetchUsers()

//     };

//     const filteredUsers = users?.filter(user =>
//         user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         user.phone?.includes(searchTerm)
//     );

//     return (


//         <div className="space-y-6">
//             {/* Header */}
//             <div className="">
//                 <div className="w-full flex items-center justify-between gap-4">

//                     {/* Left Side */}
//                     <div className="flex items-center gap-2">
//                         <h2 className="text-xl whitespace-nowrap font-semibold dark:text-white">User Management</h2>

//                     </div>

//                     {/* Right Side Buttons */}
//                     <div className=" gap-2  sm:gap-3  sm:w-auto">
//                         <AlertDialog

//                         >
//                             <AlertDialogTrigger asChild>
//                                 <Button variant="outline"
//                                     className='text-white bg-[#0446DB] rounded-sm'
//                                 >
//                                     <UserPlus className="w-4 h-4" />
//                                     Add New User
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
//                                                 <UserPlus className="w-6 h-6 text-[#524bba]" />
//                                             </div>
//                                             <div>
//                                                 <h2 className="text-xl font-semibold text-[#524bba]">Add New User</h2>
//                                                 <p className="text-sm text-[#524bba]">Create user with granular permissions</p>
//                                             </div>
//                                         </div>
//                                     </AlertDialogTitle>
//                                     <AlertDialogDescription>
//                                         <form onSubmit={handleSubmit} className="flex flex-col">
//                                             <div className="flex-1 overflow-y-auto p-6">
//                                                 <div className="space-y-6">
//                                                     {/* Basic Info */}
//                                                     <div className="bg-gray-50 rounded-lg p-4">
//                                                         <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
//                                                             <User className="w-4 h-4" />
//                                                             Basic Information
//                                                         </h3>
//                                                         <div className="grid grid-cols-2 gap-4">
//                                                             {/* Name */}
//                                                             <div>
//                                                                 <label className="block text-left font-medium text-gray-600 mb-1">
//                                                                     Full Name <span className="text-red-500">*</span>
//                                                                 </label>
//                                                                 <div className="relative">
//                                                                     <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                                                                     <input
//                                                                         type="text"
//                                                                         name="name"
//                                                                         value={formData.name}
//                                                                         onChange={handleInputChange}
//                                                                         className={`w-full pl-9 pr-3 py-2 border rounded-lg text-sm ${errors.name ? 'border-red-500' : 'border-gray-300'
//                                                                             }`}
//                                                                         placeholder="Enter full name"
//                                                                     />
//                                                                 </div>
//                                                                 {errors.name && (
//                                                                     <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
//                                                                         <AlertCircle className="w-3 h-3" />
//                                                                         {errors.name}
//                                                                     </p>
//                                                                 )}
//                                                             </div>

//                                                             {/* Phone */}
//                                                             <div>
//                                                                 <label className="block text-left font-medium text-gray-600 mb-1">
//                                                                     Phone <span className="text-red-500">*</span>
//                                                                 </label>
//                                                                 <div className="relative">
//                                                                     <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                                                                     <input
//                                                                         type="tel"
//                                                                         name="phone"
//                                                                         value={formData.phone}
//                                                                         onChange={handleInputChange}
//                                                                         className={`w-full pl-9 pr-3 py-2 border rounded-lg text-sm ${errors.phone ? 'border-red-500' : 'border-gray-300'
//                                                                             }`}
//                                                                         placeholder="Enter phone number"
//                                                                     />
//                                                                 </div>
//                                                                 {errors.phone && (
//                                                                     <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
//                                                                 )}
//                                                             </div>

//                                                             {/* Email */}
//                                                             <div>
//                                                                 <label className="block text-left font-medium text-gray-600 mb-1">
//                                                                     Email <span className="text-red-500">*</span>
//                                                                 </label>
//                                                                 <div className="relative">
//                                                                     <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                                                                     <input
//                                                                         type="email"
//                                                                         name="email"
//                                                                         value={formData.email}
//                                                                         onChange={handleInputChange}
//                                                                         className={`w-full pl-9 pr-3 py-2 border rounded-lg text-sm ${errors.email ? 'border-red-500' : 'border-gray-300'
//                                                                             }`}
//                                                                         placeholder="Enter email"
//                                                                     />
//                                                                 </div>
//                                                                 {errors.email && (
//                                                                     <p className="text-xs text-red-500 mt-1">{errors.email}</p>
//                                                                 )}
//                                                             </div>

//                                                             {/* Password */}
//                                                             <div>
//                                                                 <label className="block text-left font-medium text-gray-600 mb-1">
//                                                                     Password <span className="text-red-500">*</span>
//                                                                 </label>
//                                                                 <div className="relative">
//                                                                     <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
//                                                                     <input
//                                                                         type={showPassword ? "text" : "password"}
//                                                                         name="password"
//                                                                         value={formData.password}
//                                                                         onChange={handleInputChange}
//                                                                         className={`w-full pl-9 pr-10 py-2 border rounded-lg text-sm ${errors.password ? 'border-red-500' : 'border-gray-300'
//                                                                             }`}
//                                                                         placeholder="Enter password"
//                                                                     />
//                                                                     <button
//                                                                         type="button"
//                                                                         onClick={() => setShowPassword(!showPassword)}
//                                                                         className="absolute right-3 top-1/2 transform -translate-y-1/2"
//                                                                     >
//                                                                         {showPassword ?
//                                                                             <EyeOff className="w-4 h-4 text-gray-400" /> :
//                                                                             <Eye className="w-4 h-4 text-gray-400" />
//                                                                         }
//                                                                     </button>
//                                                                 </div>
//                                                                 {errors.password && (
//                                                                     <p className="text-xs text-red-500 mt-1">{errors.password}</p>
//                                                                 )}
//                                                             </div>
//                                                         </div>
//                                                     </div>

//                                                     {/* Role Selection */}
//                                                     <div className="bg-gray-50 rounded-lg p-4">
//                                                         <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
//                                                             <Shield className="w-4 h-4" />
//                                                             Role & Access
//                                                         </h3>
//                                                         <div className="grid grid-cols-2 gap-4">
//                                                             <div>
//                                                                 <label className="block text-left font-medium text-gray-600 mb-1">
//                                                                     Select Role <span className="text-red-500">*</span>
//                                                                 </label>
//                                                                 <select
//                                                                     name='role_id'
//                                                                     value={formData.role_id}
//                                                                     onChange={handleInputChange}
//                                                                     className={`w-full px-3 py-2 border rounded-lg text-sm ${errors.role_id ? 'border-red-500' : 'border-gray-300'
//                                                                         }`}
//                                                                 >
//                                                                     <option value="">Choose a role...</option>
//                                                                     {roles.map(role => (
//                                                                         <option key={role._id} value={role.id}>
//                                                                             {role.role_name}
//                                                                         </option>
//                                                                     ))}
//                                                                 </select>
//                                                                 {errors.role_id && (
//                                                                     <p className="text-xs text-red-500 mt-1">{errors.role_id}</p>
//                                                                 )}
//                                                             </div>
//                                                             <div>
//                                                                 <label className="block text-left font-medium text-gray-600 mb-1">
//                                                                     User Type
//                                                                 </label>
//                                                                 <select
//                                                                     name="usertype"
//                                                                     value={formData.usertype}
//                                                                     onChange={handleInputChange}
//                                                                     className={`w-full px-3 py-2 border rounded-lg text-sm ${errors.role_id ? "border-red-500" : "border-gray-300"
//                                                                         }`}
//                                                                 >
//                                                                     <option value="">Select User Type</option>
//                                                                     <option value="customer">Customer</option>
//                                                                     <option value="operations">Operations</option>
//                                                                     <option value="support">Support</option>
//                                                                     <option value="finance">Finance</option>
//                                                                     {/* <option value="admin">Admin</option>
//                                                                     <option value="manager">Manager</option> */}
//                                                                     <option value="sales">Sales</option>
//                                                                     <option value="marketing">Marketing</option>
//                                                                     {/* <option value="hr">HR</option> */}
//                                                                     {/* <option value="developer">Developer</option> */}
//                                                                     {/* <option value="qa">QA</option> */}
//                                                                     {/* <option value="superadmin">Super Admin</option> */}
//                                                                 </select>
//                                                             </div>
//                                                         </div>
//                                                         <button
//                                                             type="submit"
//                                                             disabled={loading}
//                                                             className="inline-flex mt-3 items-center gap-2 px-6 py-2 bg-[#0446DB] cursor-pointer text-white text-sm font-medium rounded-lg disabled:opacity-50"
//                                                         >
//                                                             {loading ? (
//                                                                 <>
//                                                                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                                                                     Creating...
//                                                                 </>
//                                                             ) : (
//                                                                 <>
//                                                                     <Save className="w-4 h-4" />
//                                                                     Create User
//                                                                 </>
//                                                             )}
//                                                         </button>
//                                                     </div>



//                                                 </div>
//                                             </div>

//                                             {/* Footer */}
//                                             {/* <div className="border-t px-6 py-4 bg-gray-50">
//                                                 <div className="flex justify-end gap-3">

//                                                     <button
//                                                         type="submit"
//                                                         disabled={loading}
//                                                         className="inline-flex items-center gap-2 px-6 py-2 bg-[#0446DB] cursor-pointer text-white text-sm font-medium rounded-lg disabled:opacity-50"
//                                                     >
//                                                         {loading ? (
//                                                             <>
//                                                                 <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                                                                 Creating...
//                                                             </>
//                                                         ) : (
//                                                             <>
//                                                                 <Save className="w-4 h-4" />
//                                                                 Create User
//                                                             </>
//                                                         )}
//                                                     </button>
//                                                 </div>
//                                             </div> */}
//                                         </form>
//                                     </AlertDialogDescription>
//                                 </AlertDialogHeader>
//                                 <AlertDialogFooter>
//                                     <AlertDialogCancel>Cancel</AlertDialogCancel>
//                                     {/* <AlertDialogAction>Continue</AlertDialogAction> */}
//                                 </AlertDialogFooter>
//                             </AlertDialogContent>
//                         </AlertDialog>

//                     </div>
//                 </div>
//             </div>

//             {/* Users Table */}
//             <div className=''>
//                 <div className="bg-white   rounded-sm  overflow-hidden">
//                     <Table >
//                         <TableHeader >
//                             <TableRow>
//                                 <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</TableHead>
//                                 <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</TableHead>
//                                 <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</TableHead>
//                                 <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account Status</TableHead>
//                                 <TableHead className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</TableHead>
//                             </TableRow>
//                         </TableHeader>
//                         <TableBody className="bg-white divide-y divide-gray-200">
//                             {loading ? (
//                                 <TableRow>
//                                     <TableCell colSpan={10} className="text-center py-10">
//                                         <Loader2 className="h-8 w-8 animate-spin mx-auto" />
//                                         <p className="mt-2">Loading Users...</p>
//                                     </TableCell>
//                                 </TableRow>
//                             ) : filteredUsers?.length == 0 ? (
//                                 <TableRow>
//                                     <TableCell colSpan={10} className="text-center py-10">
//                                         No Users found
//                                     </TableCell>
//                                 </TableRow>
//                             ) : (
//                                 filteredUsers?.map((user) => (
//                                     <TableRow key={user._id} className="hover:bg-gray-50">
//                                         <TableCell className="px-6 py-4 whitespace-nowrap">
//                                             <div className="flex items-center">

//                                                 <div className="ml-4">
//                                                     <div className="text-sm font-medium text-gray-900">{user.name}</div>
//                                                     <div className="text-sm text-gray-500">{user.email}</div>
//                                                 </div>
//                                             </div>
//                                         </TableCell>
//                                         <TableCell className="px-6 py-4 whitespace-nowrap">
//                                             <div className="text-sm text-gray-900">{user.phone}</div>
//                                         </TableCell>

//                                         <TableCell className="px-6 py-4 whitespace-nowrap">
//                                             <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
//                                                 {user.role_name || 'N/A'}
//                                             </span>
//                                         </TableCell>

//                                         <TableCell className="px-6 py-4 whitespace-nowrap">
//                                             <div className="flex items-center gap-3">

//                                                 {/* Toggle Switch */}
//                                                 {/* Status Text */}
//                                                 <span
//                                                     className={`px-2 py-1 text-xs font-medium rounded-full ${user?.is_active
//                                                         ? "bg-green-100 text-green-800"
//                                                         : "bg-red-500 text-white"
//                                                         }`}
//                                                 >
//                                                     {user?.is_active ? "Active" : "Inactive"}
//                                                 </span>
//                                                 <button
//                                                     onClick={() => handleStatusChange(user)}
//                                                     className={`w-12 h-6 flex items-center rounded-full p-1 transition duration-300 ${user?.is_active ? "bg-green-500" : "bg-gray-300"
//                                                         }`}
//                                                 >
//                                                     <div
//                                                         className={`bg-white w-4 h-4 rounded-full shadow-md transform transition duration-300 ${user?.is_active ? "translate-x-6" : "translate-x-0"
//                                                             }`}
//                                                     />
//                                                 </button>



//                                             </div>
//                                         </TableCell>
//                                         <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">

//                                             <AlertDialog
//                                             >
//                                                 <AlertDialogTrigger asChild>
//                                                     <Button variant="outline"
//                                                         onClick={() => getUserPermission(user.role_id)}
//                                                         className='text-[#0446DB]'
//                                                     >
//                                                         <EyeIcon className="w-5 h-5" />
//                                                     </Button>
//                                                 </AlertDialogTrigger>
//                                                 <AlertDialogContent

//                                                 >
//                                                     <AlertDialogHeader

//                                                     >
//                                                         <AlertDialogTitle
//                                                             className=''
//                                                         >

//                                                             <div className="flex items-center gap-3">
//                                                                 <div>
//                                                                     <h2 className="text-lg font-semibold text-gray-900">Role Permissions</h2>
//                                                                     <p className="text-sm text-gray-500">View all permissions and assigned cities for this user</p>
//                                                                 </div>
//                                                             </div>
//                                                         </AlertDialogTitle>
//                                                         <AlertDialogDescription>
//                                                             <div className="p-6 bg-gray-50/50 max-h-[calc(90vh-120px)] overflow-y-auto">

//                                                                 {
//                                                                     permission?.map((permission) => {
//                                                                         return (
//                                                                             <>
//                                                                                 <div className="p-3 border rounded-lg bg-gray-50 mb-2">
//                                                                                     {/* Permission Code */}
//                                                                                     <p className="font-semibold text-gray-800">
//                                                                                         {permission?.permission_code}
//                                                                                     </p>

//                                                                                     {/* Cities */}
//                                                                                     <div className="flex flex-wrap gap-2 mt-2">
//                                                                                         {Array.isArray(permission?.cities) &&
//                                                                                             permission.cities.length > 0 ? (
//                                                                                             permission.cities.map((city, index) => (
//                                                                                                 <span
//                                                                                                     key={index}
//                                                                                                     className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full"
//                                                                                                 >
//                                                                                                     {city}
//                                                                                                 </span>
//                                                                                             ))
//                                                                                         ) : (
//                                                                                             <span className="text-gray-400 text-sm">No Cities</span>
//                                                                                         )}
//                                                                                     </div>
//                                                                                 </div>
//                                                                             </>
//                                                                         )
//                                                                     })
//                                                                 }


//                                                             </div>
//                                                         </AlertDialogDescription>
//                                                     </AlertDialogHeader>
//                                                     <AlertDialogFooter>
//                                                         <AlertDialogCancel>Cancel</AlertDialogCancel>
//                                                         {/* <AlertDialogAction>Continue</AlertDialogAction> */}
//                                                     </AlertDialogFooter>
//                                                 </AlertDialogContent>
//                                             </AlertDialog>

//                                         </TableCell>
//                                     </TableRow>
//                                 ))
//                             )}
//                         </TableBody>
//                     </Table>
//                 </div>
//             </div>


//         </div>


//     );
// };

// export default UserManagement;




import { useEffect, useMemo, useState } from "react";

import {
  UserPlus,
  Save,
  Eye,
  EyeOff,
  Mail,
  Phone,
  User,
  KeyRound,
  Shield,
  AlertCircle,
  EyeIcon,
  Loader2,
  Search,
  Users,
  UserCheck,
  UserX,
  RefreshCw,
  X,
  MapPin,
  LockKeyhole,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

import axios from "axios";
import { toast } from "react-toastify";

const baseURL = import.meta.env.VITE_BASE_URL;

const UserManagement = () => {
  /* =========================================================
     STATES
  ========================================================= */

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [roles, setRoles] = useState([]);
  const [errors, setErrors] = useState({});

  const [permission, setPermission] = useState([]);
  const [permissionLoading, setPermissionLoading] =
    useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    role_id: "",
    usertype: "",
    is_verified: 1,
  });

  /* =========================================================
     AUTH HEADER
  ========================================================= */

  const getHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  /* =========================================================
     FETCH ROLES
  ========================================================= */

  const fetchRoles = async () => {
    try {
      const res = await axios.get(
        `${baseURL}/api/admin/getAllRoles`,
        {
          headers: getHeaders(),
        }
      );

      if (res?.data?.success) {
        setRoles(res?.data?.roles || []);
      }
    } catch (error) {
      console.error("Fetch Roles Error:", error);
      toast.error("Error fetching roles");
    }
  };

  /* =========================================================
     FETCH USERS
  ========================================================= */

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${baseURL}/api/admin/getAllUsers`,
        {
          headers: getHeaders(),
        }
      );

      if (res?.data?.data?.status === 200) {
        setUsers(res?.data?.data?.users || []);
      }
    } catch (error) {
      console.error("Fetch Users Error:", error);
      toast.error("Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  /* =========================================================
     VALIDATION
  ========================================================= */

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.phone?.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[0-9]{10,15}$/.test(formData.phone)) {
      newErrors.phone = "Enter a valid phone number";
    }

    if (!formData.email?.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password =
        "Password must be at least 6 characters";
    }

    if (!formData.role_id) {
      newErrors.role_id = "Please select a role";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* =========================================================
     INPUT CHANGE
  ========================================================= */

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  /* =========================================================
     RESET FORM
  ========================================================= */

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      email: "",
      password: "",
      role_id: "",
      usertype: "",
      is_verified: 1,
    });

    setErrors({});
    setShowPassword(false);
  };

  /* =========================================================
     CREATE USER
  ========================================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.warning("Please fill all required fields");
      return;
    }

    try {
      setCreating(true);

      const submitData = {
        ...formData,
      };

      const res = await axios.post(
        `${baseURL}/api/admin/addUser`,
        submitData,
        {
          headers: {
            ...getHeaders(),
            "Content-Type": "application/json",
          },
        }
      );

      toast.success(
        res?.data?.message || "User created successfully!"
      );

      resetForm();
      fetchUsers();
    } catch (error) {
      console.error("Create User Error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to create user"
      );
    } finally {
      setCreating(false);
    }
  };

  /* =========================================================
     USER PERMISSIONS
  ========================================================= */

  const getUserPermission = async (roleId) => {
    try {
      setPermissionLoading(true);
      setPermission([]);

      const res = await axios.get(
        `${baseURL}/api/admin/getRoleWithPermissions`,
        {
          params: {
            role_id: roleId,
          },

          headers: getHeaders(),
        }
      );

      if (res?.data?.success) {
        setPermission(res?.data?.data || []);
      }
    } catch (error) {
      console.error("Permission Error:", error);

      toast.error("Error fetching user permissions");
    } finally {
      setPermissionLoading(false);
    }
  };

  /* =========================================================
     STATUS CHANGE
  ========================================================= */

  const handleStatusChange = async (user) => {
    try {
      const updatedStatus = !Boolean(user?.is_active);

      await axios.post(
        `${baseURL}/api/admin/updateUser/${user.id}`,
        {
          is_active: updatedStatus ? "1" : "0",
        },
        {
          headers: getHeaders(),
        }
      );

      toast.success(
        updatedStatus
          ? "User activated successfully"
          : "User deactivated successfully"
      );

      fetchUsers();
    } catch (error) {
      console.error("Status Change Error:", error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to update user status"
      );
    }
  };

  /* =========================================================
     FILTER USERS
  ========================================================= */

  const filteredUsers = useMemo(() => {
    const search = searchTerm.trim().toLowerCase();

    if (!search) return users;

    return users?.filter((user) => {
      return (
        user?.name?.toLowerCase().includes(search) ||
        user?.email?.toLowerCase().includes(search) ||
        user?.phone?.toString().includes(search) ||
        user?.role_name?.toLowerCase().includes(search)
      );
    });
  }, [users, searchTerm]);

  /* =========================================================
     COUNTS
  ========================================================= */

  const totalUsers = users?.length || 0;

  const activeUsers =
    users?.filter((user) => Boolean(user?.is_active))
      ?.length || 0;

  const inactiveUsers = totalUsers - activeUsers;

  /* =========================================================
     INITIAL
  ========================================================= */

  const getInitial = (name) => {
    if (!name) return "U";

    return name.trim().charAt(0).toUpperCase();
  };

  /* =========================================================
     JSX
  ========================================================= */

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 sm:p-5 lg:p-6">

      <div className="mx-auto w-full space-y-5">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-2xl">
              User Management
            </h1>

            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Manage users, roles, permissions and account
              access.
            </p>
          </div>

          {/* ADD USER */}

          <AlertDialog>

            <AlertDialogTrigger asChild>
              <button
                type="button"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#0446DB] px-4 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#0339B5] hover:shadow-md"
              >
                <UserPlus className="h-4 w-4" />

                Add New User
              </button>
            </AlertDialogTrigger>

            {/* =================================================
                ADD USER DIALOG
            ================================================== */}

            <AlertDialogContent className="max-h-[92vh] w-[95vw] max-w-3xl overflow-hidden border-neutral-200 bg-white p-0 dark:border-neutral-800 dark:bg-neutral-900">

              <AlertDialogHeader className="border-b border-neutral-200 px-6 py-5 text-left dark:border-neutral-800">

                <AlertDialogTitle>

                  <div className="flex items-start gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0446DB]/10 text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400">
                      <UserPlus className="h-5 w-5" />
                    </div>

                    <div>

                      <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                        Add New User
                      </h2>

                      <p className="mt-1 text-sm font-normal text-neutral-500 dark:text-neutral-400">
                        Create a new account and assign the
                        appropriate role.
                      </p>

                    </div>

                  </div>

                </AlertDialogTitle>

              </AlertDialogHeader>

              <AlertDialogDescription asChild>

                <form
                  onSubmit={handleSubmit}
                  className="flex max-h-[calc(92vh-90px)] flex-col"
                >

                  {/* SCROLL AREA */}

                  <div className="flex-1 overflow-y-auto p-6">

                    <div className="space-y-6">

                      {/* =======================================
                          BASIC INFORMATION
                      ======================================== */}

                      <div>

                        <div className="mb-4 flex items-center gap-2">

                          <User className="h-4 w-4 text-[#0446DB] dark:text-blue-400" />

                          <div>
                            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                              Basic Information
                            </h3>

                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                              Enter the user's personal and
                              login information.
                            </p>
                          </div>

                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                          {/* NAME */}

                          <div>

                            <label className="mb-1.5 block text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                              Full Name
                              <span className="ml-1 text-red-500">
                                *
                              </span>
                            </label>

                            <div className="relative">

                              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

                              <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Enter full name"
                                className={`h-10 w-full rounded-lg border bg-white pl-9 pr-3 text-sm text-neutral-900 outline-none transition-all placeholder:text-neutral-400 focus:ring-1 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-500 ${
                                  errors.name
                                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                    : "border-neutral-200 focus:border-[#0446DB] focus:ring-[#0446DB] dark:border-neutral-700"
                                }`}
                              />

                            </div>

                            {errors.name && (
                              <p className="mt-1 flex items-center gap-1 text-left text-xs text-red-500">
                                <AlertCircle className="h-3 w-3" />
                                {errors.name}
                              </p>
                            )}

                          </div>

                          {/* PHONE */}

                          <div>

                            <label className="mb-1.5 block text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                              Phone Number
                              <span className="ml-1 text-red-500">
                                *
                              </span>
                            </label>

                            <div className="relative">

                              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

                              <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="Enter phone number"
                                className={`h-10 w-full rounded-lg border bg-white pl-9 pr-3 text-sm text-neutral-900 outline-none transition-all placeholder:text-neutral-400 focus:ring-1 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-500 ${
                                  errors.phone
                                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                    : "border-neutral-200 focus:border-[#0446DB] focus:ring-[#0446DB] dark:border-neutral-700"
                                }`}
                              />

                            </div>

                            {errors.phone && (
                              <p className="mt-1 text-left text-xs text-red-500">
                                {errors.phone}
                              </p>
                            )}

                          </div>

                          {/* EMAIL */}

                          <div>

                            <label className="mb-1.5 block text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                              Email Address
                              <span className="ml-1 text-red-500">
                                *
                              </span>
                            </label>

                            <div className="relative">

                              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

                              <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="name@example.com"
                                className={`h-10 w-full rounded-lg border bg-white pl-9 pr-3 text-sm text-neutral-900 outline-none transition-all placeholder:text-neutral-400 focus:ring-1 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-500 ${
                                  errors.email
                                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                    : "border-neutral-200 focus:border-[#0446DB] focus:ring-[#0446DB] dark:border-neutral-700"
                                }`}
                              />

                            </div>

                            {errors.email && (
                              <p className="mt-1 text-left text-xs text-red-500">
                                {errors.email}
                              </p>
                            )}

                          </div>

                          {/* PASSWORD */}

                          <div>

                            <label className="mb-1.5 block text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                              Password
                              <span className="ml-1 text-red-500">
                                *
                              </span>
                            </label>

                            <div className="relative">

                              <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

                              <input
                                type={
                                  showPassword
                                    ? "text"
                                    : "password"
                                }
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Minimum 6 characters"
                                className={`h-10 w-full rounded-lg border bg-white pl-9 pr-10 text-sm text-neutral-900 outline-none transition-all placeholder:text-neutral-400 focus:ring-1 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-500 ${
                                  errors.password
                                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                    : "border-neutral-200 focus:border-[#0446DB] focus:ring-[#0446DB] dark:border-neutral-700"
                                }`}
                              />

                              <button
                                type="button"
                                onClick={() =>
                                  setShowPassword(
                                    !showPassword
                                  )
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors hover:text-neutral-700 dark:hover:text-white"
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </button>

                            </div>

                            {errors.password && (
                              <p className="mt-1 text-left text-xs text-red-500">
                                {errors.password}
                              </p>
                            )}

                          </div>

                        </div>

                      </div>

                      {/* =======================================
                          ROLE & ACCESS
                      ======================================== */}

                      <div className="border-t border-neutral-100 pt-5 dark:border-neutral-800">

                        <div className="mb-4 flex items-center gap-2">

                          <Shield className="h-4 w-4 text-[#0446DB] dark:text-blue-400" />

                          <div>
                            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                              Role & Access
                            </h3>

                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                              Define the user's role and
                              department.
                            </p>
                          </div>

                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                          {/* ROLE */}

                          <div>

                            <label className="mb-1.5 block text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                              Select Role
                              <span className="ml-1 text-red-500">
                                *
                              </span>
                            </label>

                            <select
                              name="role_id"
                              value={formData.role_id}
                              onChange={handleInputChange}
                              className={`h-10 w-full rounded-lg border bg-white px-3 text-sm text-neutral-800 outline-none transition-all focus:ring-1 dark:bg-neutral-800 dark:text-white ${
                                errors.role_id
                                  ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                  : "border-neutral-200 focus:border-[#0446DB] focus:ring-[#0446DB] dark:border-neutral-700"
                              }`}
                            >
                              <option value="">
                                Choose a role...
                              </option>

                              {roles?.map((role) => (
                                <option
                                  key={
                                    role._id || role.id
                                  }
                                  value={role.id}
                                >
                                  {role.role_name}
                                </option>
                              ))}

                            </select>

                            {errors.role_id && (
                              <p className="mt-1 text-left text-xs text-red-500">
                                {errors.role_id}
                              </p>
                            )}

                          </div>

                          {/* USER TYPE */}

                          <div>

                            <label className="mb-1.5 block text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                              User Type
                            </label>

                            <select
                              name="usertype"
                              value={
                                formData.usertype || ""
                              }
                              onChange={handleInputChange}
                              className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-800 outline-none transition-all focus:border-[#0446DB] focus:ring-1 focus:ring-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                            >
                              <option value="">
                                Select User Type
                              </option>

                              <option value="customer">
                                Customer
                              </option>

                              <option value="operations">
                                Operations
                              </option>

                              <option value="support">
                                Support
                              </option>

                              <option value="finance">
                                Finance
                              </option>

                              <option value="sales">
                                Sales
                              </option>

                              <option value="marketing">
                                Marketing
                              </option>

                            </select>

                          </div>

                        </div>

                      </div>

                    </div>

                  </div>

                  {/* DIALOG FOOTER */}

                  <div className="flex items-center justify-end gap-3 border-t border-neutral-200 bg-neutral-50 px-6 py-4 dark:border-neutral-800 dark:bg-neutral-950/40">

                    <AlertDialogCancel
                      type="button"
                      className="mt-0 h-10 rounded-lg border-neutral-200 px-4 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
                    >
                      Cancel
                    </AlertDialogCancel>

                    <button
                      type="submit"
                      disabled={creating}
                      className="inline-flex h-10 min-w-[130px] items-center justify-center gap-2 rounded-lg bg-[#0446DB] px-5 text-sm font-semibold text-white transition-all hover:bg-[#0339B5] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {creating ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Create User
                        </>
                      )}
                    </button>

                  </div>

                </form>

              </AlertDialogDescription>

            </AlertDialogContent>

          </AlertDialog>

        </div>

        {/* =====================================================
            STAT CARDS
        ====================================================== */}

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">

          {/* TOTAL */}

          <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                  Total Users
                </p>

                <h3 className="mt-1 text-2xl font-bold text-neutral-900 dark:text-white">
                  {totalUsers}
                </h3>

              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400">
                <Users className="h-5 w-5" />
              </div>

            </div>

          </div>

          {/* ACTIVE */}

          <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                  Active Users
                </p>

                <h3 className="mt-1 text-2xl font-bold text-neutral-900 dark:text-white">
                  {activeUsers}
                </h3>

              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                <UserCheck className="h-5 w-5" />
              </div>

            </div>

          </div>

          {/* INACTIVE */}

          <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                  Inactive Users
                </p>

                <h3 className="mt-1 text-2xl font-bold text-neutral-900 dark:text-white">
                  {inactiveUsers}
                </h3>

              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-400">
                <UserX className="h-5 w-5" />
              </div>

            </div>

          </div>

        </div>

        {/* =====================================================
            USERS TABLE CARD
        ====================================================== */}

        <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">

          {/* TABLE TOP BAR */}

          <div className="flex flex-col gap-3 border-b border-neutral-200 p-4 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">
                Users
              </h2>

              <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                {filteredUsers?.length || 0} user
                {filteredUsers?.length !== 1
                  ? "s"
                  : ""}{" "}
                found
              </p>

            </div>

            <div className="flex items-center gap-2">

              {/* SEARCH */}

              <div className="relative w-full sm:w-[280px]">

                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(e.target.value)
                  }
                  placeholder="Search name, email, phone..."
                  className="h-10 w-full rounded-lg border border-neutral-200 bg-white pl-9 pr-9 text-sm text-neutral-900 outline-none transition-all placeholder:text-neutral-400 focus:border-[#0446DB] focus:ring-1 focus:ring-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-500"
                />

                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 dark:hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}

              </div>

              {/* REFRESH */}

              <button
                type="button"
                onClick={fetchUsers}
                disabled={loading}
                title="Refresh users"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-500 transition-all hover:border-[#0446DB]/30 hover:bg-blue-50 hover:text-[#0446DB] disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:hover:text-blue-400"
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    loading ? "animate-spin" : ""
                  }`}
                />
              </button>

            </div>

          </div>

          {/* TABLE */}

          <div className="overflow-x-auto">

            <Table>

              <TableHeader>

                <TableRow className="border-neutral-200 bg-neutral-50/80 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950/40">

                  <TableHead className="min-w-[260px] px-5 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    User
                  </TableHead>

                  <TableHead className="min-w-[150px] px-5 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    Contact
                  </TableHead>

                  <TableHead className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    Role
                  </TableHead>

                  <TableHead className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    Status
                  </TableHead>

                  <TableHead className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-neutral-500">
                    Actions
                  </TableHead>

                </TableRow>

              </TableHeader>

              <TableBody>

                {/* LOADING */}

                {loading ? (
                  <TableRow>

                    <TableCell
                      colSpan={5}
                      className="h-[280px]"
                    >

                      <div className="flex flex-col items-center justify-center">

                        <Loader2 className="h-7 w-7 animate-spin text-[#0446DB] dark:text-blue-400" />

                        <p className="mt-3 text-sm font-medium text-neutral-600 dark:text-neutral-300">
                          Loading users...
                        </p>

                        <p className="mt-1 text-xs text-neutral-400">
                          Please wait a moment
                        </p>

                      </div>

                    </TableCell>

                  </TableRow>
                ) : filteredUsers?.length === 0 ? (

                  /* EMPTY */

                  <TableRow>

                    <TableCell
                      colSpan={5}
                      className="h-[280px]"
                    >

                      <div className="flex flex-col items-center justify-center">

                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
                          <Users className="h-5 w-5 text-neutral-400" />
                        </div>

                        <p className="mt-3 text-sm font-semibold text-neutral-700 dark:text-neutral-200">
                          No users found
                        </p>

                        <p className="mt-1 text-xs text-neutral-400">
                          Try changing your search.
                        </p>

                      </div>

                    </TableCell>

                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (

                    <TableRow
                      key={user._id || user.id}
                      className="border-neutral-100 transition-colors hover:bg-neutral-50/70 dark:border-neutral-800 dark:hover:bg-neutral-800/40"
                    >

                      {/* USER */}

                      <TableCell className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0446DB]/10 text-sm font-bold text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400">
                            {getInitial(user.name)}
                          </div>

                          <div className="min-w-0">

                            <p className="truncate text-sm font-semibold text-neutral-900 dark:text-white">
                              {user.name || "N/A"}
                            </p>

                            <div className="mt-1 flex items-center gap-1.5">

                              <Mail className="h-3 w-3 shrink-0 text-neutral-400" />

                              <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                                {user.email || "N/A"}
                              </p>

                            </div>

                          </div>

                        </div>

                      </TableCell>

                      {/* PHONE */}

                      <TableCell className="px-5 py-4">

                        <div className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">

                          <Phone className="h-3.5 w-3.5 text-neutral-400" />

                          {user.phone || "N/A"}

                        </div>

                      </TableCell>

                      {/* ROLE */}

                      <TableCell className="px-5 py-4">

                        <span className="inline-flex rounded-md border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-[#0446DB] dark:border-blue-900/50 dark:bg-blue-500/10 dark:text-blue-300">
                          {user.role_name || "N/A"}
                        </span>

                      </TableCell>

                      {/* STATUS */}

                      <TableCell className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <button
                            type="button"
                            onClick={() =>
                              handleStatusChange(user)
                            }
                            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                              Boolean(user?.is_active)
                                ? "bg-emerald-500"
                                : "bg-neutral-300 dark:bg-neutral-700"
                            }`}
                          >

                            <span
                              className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${
                                Boolean(user?.is_active)
                                  ? "left-6"
                                  : "left-1"
                              }`}
                            />

                          </button>

                          <div>

                            <p
                              className={`text-xs font-semibold ${
                                Boolean(user?.is_active)
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : "text-neutral-500 dark:text-neutral-400"
                              }`}
                            >
                              {Boolean(user?.is_active)
                                ? "Active"
                                : "Inactive"}
                            </p>

                            <p className="mt-0.5 text-[10px] text-neutral-400">
                              Account access
                            </p>

                          </div>

                        </div>

                      </TableCell>

                      {/* ACTION */}

                      <TableCell className="px-5 py-4 text-right">

                        <AlertDialog>

                          <AlertDialogTrigger asChild>

                            <button
                              type="button"
                              onClick={() =>
                                getUserPermission(
                                  user.role_id
                                )
                              }
                              title="View permissions"
                              className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 text-xs font-semibold text-neutral-600 transition-all hover:border-[#0446DB]/30 hover:bg-blue-50 hover:text-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-blue-500/40 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
                            >
                              <EyeIcon className="h-4 w-4" />

                              <span className="hidden xl:inline">
                                Permissions
                              </span>
                            </button>

                          </AlertDialogTrigger>

                          {/* ===============================
                              PERMISSION DIALOG
                          ================================ */}

                          <AlertDialogContent className="max-h-[90vh] w-[95vw] max-w-xl overflow-hidden border-neutral-200 bg-white p-0 dark:border-neutral-800 dark:bg-neutral-900">

                            <AlertDialogHeader className="border-b border-neutral-200 px-6 py-5 text-left dark:border-neutral-800">

                              <AlertDialogTitle>

                                <div className="flex items-start gap-3">

                                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
                                    <LockKeyhole className="h-5 w-5" />
                                  </div>

                                  <div>

                                    <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                                      Role Permissions
                                    </h2>

                                    <p className="mt-1 text-sm font-normal text-neutral-500 dark:text-neutral-400">
                                      {user.name} •{" "}
                                      {user.role_name ||
                                        "User"}
                                    </p>

                                  </div>

                                </div>

                              </AlertDialogTitle>

                            </AlertDialogHeader>

                            <AlertDialogDescription asChild>

                              <div className="max-h-[65vh] overflow-y-auto p-5">

                                {permissionLoading ? (

                                  <div className="flex min-h-[250px] flex-col items-center justify-center">

                                    <Loader2 className="h-7 w-7 animate-spin text-[#0446DB]" />

                                    <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">
                                      Loading permissions...
                                    </p>

                                  </div>

                                ) : permission?.length ===
                                  0 ? (

                                  <div className="flex min-h-[250px] flex-col items-center justify-center text-center">

                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
                                      <Shield className="h-5 w-5 text-neutral-400" />
                                    </div>

                                    <p className="mt-3 text-sm font-semibold text-neutral-700 dark:text-neutral-200">
                                      No permissions found
                                    </p>

                                    <p className="mt-1 text-xs text-neutral-400">
                                      No permissions are
                                      assigned to this role.
                                    </p>

                                  </div>

                                ) : (

                                  <div className="space-y-3">

                                    {permission.map(
                                      (item, index) => (

                                        <div
                                          key={
                                            item.id ||
                                            `${item.permission_code}-${index}`
                                          }
                                          className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-700 dark:bg-neutral-800/40"
                                        >

                                          <div className="flex items-start gap-3">

                                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-blue-50 text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400">
                                              <Shield className="h-4 w-4" />
                                            </div>

                                            <div className="min-w-0 flex-1">

                                              <p className="break-all text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                                                {
                                                  item.permission_code
                                                }
                                              </p>

                                              {/* CITIES */}

                                              <div className="mt-3">

                                                <div className="mb-2 flex items-center gap-1.5">

                                                  <MapPin className="h-3 w-3 text-neutral-400" />

                                                  <span className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400">
                                                    Assigned
                                                    Cities
                                                  </span>

                                                </div>

                                                {Array.isArray(
                                                  item.cities
                                                ) &&
                                                item.cities
                                                  .length >
                                                  0 ? (

                                                  <div className="flex flex-wrap gap-1.5">

                                                    {item.cities.map(
                                                      (
                                                        city,
                                                        cityIndex
                                                      ) => (
                                                        <span
                                                          key={
                                                            cityIndex
                                                          }
                                                          className="rounded-md border border-blue-100 bg-blue-50 px-2 py-1 text-[11px] font-medium text-blue-700 dark:border-blue-900/50 dark:bg-blue-500/10 dark:text-blue-300"
                                                        >
                                                          {
                                                            city
                                                          }
                                                        </span>
                                                      )
                                                    )}

                                                  </div>

                                                ) : (

                                                  <span className="text-xs text-neutral-400">
                                                    No cities
                                                    assigned
                                                  </span>

                                                )}

                                              </div>

                                            </div>

                                          </div>

                                        </div>

                                      )
                                    )}

                                  </div>

                                )}

                              </div>

                            </AlertDialogDescription>

                            <AlertDialogFooter className="border-t border-neutral-200 bg-neutral-50 px-5 py-4 dark:border-neutral-800 dark:bg-neutral-950/40">

                              <AlertDialogCancel className="mt-0 rounded-lg dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
                                Close
                              </AlertDialogCancel>

                            </AlertDialogFooter>

                          </AlertDialogContent>

                        </AlertDialog>

                      </TableCell>

                    </TableRow>

                  ))
                )}

              </TableBody>

            </Table>

          </div>

        </div>

      </div>

    </div>
  );
};

export default UserManagement;