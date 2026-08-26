
import React, { useEffect, useState } from 'react';
import {
    UserPlus, X, Save, Eye, EyeOff, Mail, Phone, User, Key,
    Shield, Users, AlertCircle,
    EyeIcon,
    Loader2
} from 'lucide-react';
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
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import axios from 'axios';
import { toast } from 'react-toastify';

const baseURL = import.meta.env.VITE_BASE_URL;





const UserManagement = () => {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const [roles, setRoles] = useState([]);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        password: '',
        role_id: '',
        usertype: null,
        is_verified: 1
    });

    const fetchRoles = async () => {
        try {
            const res = await axios.get(`${baseURL}/api/admin/getAllRoles`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            if (res.data.success) setRoles(res.data.roles);
        } catch (error) {
            toast.error('Error fetching roles');
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name?.trim()) newErrors.name = 'Name is required';
        if (!formData.phone?.trim()) newErrors.phone = 'Phone number is required';
        else if (!/^[0-9]{10,15}$/.test(formData.phone)) newErrors.phone = 'Invalid phone number';
        if (!formData.email?.trim()) newErrors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';
        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        if (!formData.role_id) newErrors.role_id = 'Please select a role';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;


        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            toast.warning('Please fill all required fields');
            return;
        }



        setLoading(true);

        try {
            const submitData = {
                ...formData,

            };





            const res = await axios.post(`${baseURL}/api/admin/addUser`, submitData, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    'Content-Type': 'application/json'
                }
            });




            toast.success('User created successfully!');
            
            // onUserAdded?.(res.data.user);
            
            fetchUsers();
            return

        } catch (error) {
            // toast.error(error.response?.data?.message || 'Failed to create user');
        } finally {
            setLoading(false);
        }
    };
    // Fetch users
    const fetchUsers = async () => {
        setLoading(true)
        try {
            const res = await axios.get(`${baseURL}/api/admin/getAllUsers`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            if (res.data.data.status === 200) {

                setUsers(res.data.data.users);
            }
        } catch (error) {
            setLoading(false)
            toast.error('Error fetching users');
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchRoles()
    }, []);


    const [permission, setPermission] = useState([])
    const getUserPermission = async (userId) => {


        try {
            const res = await axios.get(`${baseURL}/api/admin/getRoleWithPermissions`, {
                params: {
                    role_id: userId
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });


            if (res.data.success) {
                setPermission(res.data.data)
            }
        } catch (error) {
            toast.error('Error deleting user');
        }
    };

    const handleStatusChange = async (user) => {
        const updatedStatus = !user.is_active;

        const res = await axios.post(
            `${baseURL}/api/admin/updateUser/${user.id}`,
            {
                is_active: updatedStatus ? "1" : "0",
            },
            {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );
        fetchUsers()

    };

    const filteredUsers = users?.filter(user =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm)
    );

    return (


        <div className="space-y-6">
            {/* Header */}
            <div className="bg-[#0446DB] shadow-lg p-4 sm:p-6">
                <div className="w-full flex items-center justify-between gap-4">

                    {/* Left Side */}
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl whitespace-nowrap font-semibold text-white">User Management</h2>

                    </div>

                    {/* Right Side Buttons */}
                    <div className=" gap-2  sm:gap-3  sm:w-auto">
                        <AlertDialog

                        >
                            <AlertDialogTrigger asChild>
                                <Button variant="outline"
                                    className='text-[#0446DB]'
                                >
                                    <UserPlus className="w-4 h-4" />
                                    Add New User
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
                                                <UserPlus className="w-6 h-6 text-[#524bba]" />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-semibold text-[#524bba]">Add New User</h2>
                                                <p className="text-sm text-[#524bba]">Create user with granular permissions</p>
                                            </div>
                                        </div>
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        <form onSubmit={handleSubmit} className="flex flex-col">
                                            <div className="flex-1 overflow-y-auto p-6">
                                                <div className="space-y-6">
                                                    {/* Basic Info */}
                                                    <div className="bg-gray-50 rounded-lg p-4">
                                                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                                            <User className="w-4 h-4" />
                                                            Basic Information
                                                        </h3>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            {/* Name */}
                                                            <div>
                                                                <label className="block text-left font-medium text-gray-600 mb-1">
                                                                    Full Name <span className="text-red-500">*</span>
                                                                </label>
                                                                <div className="relative">
                                                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                                    <input
                                                                        type="text"
                                                                        name="name"
                                                                        value={formData.name}
                                                                        onChange={handleInputChange}
                                                                        className={`w-full pl-9 pr-3 py-2 border rounded-lg text-sm ${errors.name ? 'border-red-500' : 'border-gray-300'
                                                                            }`}
                                                                        placeholder="Enter full name"
                                                                    />
                                                                </div>
                                                                {errors.name && (
                                                                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                                                        <AlertCircle className="w-3 h-3" />
                                                                        {errors.name}
                                                                    </p>
                                                                )}
                                                            </div>

                                                            {/* Phone */}
                                                            <div>
                                                                <label className="block text-left font-medium text-gray-600 mb-1">
                                                                    Phone <span className="text-red-500">*</span>
                                                                </label>
                                                                <div className="relative">
                                                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                                    <input
                                                                        type="tel"
                                                                        name="phone"
                                                                        value={formData.phone}
                                                                        onChange={handleInputChange}
                                                                        className={`w-full pl-9 pr-3 py-2 border rounded-lg text-sm ${errors.phone ? 'border-red-500' : 'border-gray-300'
                                                                            }`}
                                                                        placeholder="Enter phone number"
                                                                    />
                                                                </div>
                                                                {errors.phone && (
                                                                    <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                                                                )}
                                                            </div>

                                                            {/* Email */}
                                                            <div>
                                                                <label className="block text-left font-medium text-gray-600 mb-1">
                                                                    Email <span className="text-red-500">*</span>
                                                                </label>
                                                                <div className="relative">
                                                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                                    <input
                                                                        type="email"
                                                                        name="email"
                                                                        value={formData.email}
                                                                        onChange={handleInputChange}
                                                                        className={`w-full pl-9 pr-3 py-2 border rounded-lg text-sm ${errors.email ? 'border-red-500' : 'border-gray-300'
                                                                            }`}
                                                                        placeholder="Enter email"
                                                                    />
                                                                </div>
                                                                {errors.email && (
                                                                    <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                                                                )}
                                                            </div>

                                                            {/* Password */}
                                                            <div>
                                                                <label className="block text-left font-medium text-gray-600 mb-1">
                                                                    Password <span className="text-red-500">*</span>
                                                                </label>
                                                                <div className="relative">
                                                                    <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                                    <input
                                                                        type={showPassword ? "text" : "password"}
                                                                        name="password"
                                                                        value={formData.password}
                                                                        onChange={handleInputChange}
                                                                        className={`w-full pl-9 pr-10 py-2 border rounded-lg text-sm ${errors.password ? 'border-red-500' : 'border-gray-300'
                                                                            }`}
                                                                        placeholder="Enter password"
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setShowPassword(!showPassword)}
                                                                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                                                                    >
                                                                        {showPassword ?
                                                                            <EyeOff className="w-4 h-4 text-gray-400" /> :
                                                                            <Eye className="w-4 h-4 text-gray-400" />
                                                                        }
                                                                    </button>
                                                                </div>
                                                                {errors.password && (
                                                                    <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Role Selection */}
                                                    <div className="bg-gray-50 rounded-lg p-4">
                                                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                                            <Shield className="w-4 h-4" />
                                                            Role & Access
                                                        </h3>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div>
                                                                <label className="block text-left font-medium text-gray-600 mb-1">
                                                                    Select Role <span className="text-red-500">*</span>
                                                                </label>
                                                                <select
                                                                    name='role_id'
                                                                    value={formData.role_id}
                                                                    onChange={handleInputChange}
                                                                    className={`w-full px-3 py-2 border rounded-lg text-sm ${errors.role_id ? 'border-red-500' : 'border-gray-300'
                                                                        }`}
                                                                >
                                                                    <option value="">Choose a role...</option>
                                                                    {roles.map(role => (
                                                                        <option key={role._id} value={role.id}>
                                                                            {role.role_name}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                                {errors.role_id && (
                                                                    <p className="text-xs text-red-500 mt-1">{errors.role_id}</p>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <label className="block text-left font-medium text-gray-600 mb-1">
                                                                    User Type
                                                                </label>
                                                                <select
                                                                    name="usertype"
                                                                    value={formData.usertype}
                                                                    onChange={handleInputChange}
                                                                    className={`w-full px-3 py-2 border rounded-lg text-sm ${errors.role_id ? "border-red-500" : "border-gray-300"
                                                                        }`}
                                                                >
                                                                    <option value="">Select User Type</option>
                                                                    <option value="customer">Customer</option>
                                                                    <option value="operations">Operations</option>
                                                                    <option value="support">Support</option>
                                                                    <option value="finance">Finance</option>
                                                                    {/* <option value="admin">Admin</option>
                                                                    <option value="manager">Manager</option> */}
                                                                    <option value="sales">Sales</option>
                                                                    <option value="marketing">Marketing</option>
                                                                    {/* <option value="hr">HR</option> */}
                                                                    {/* <option value="developer">Developer</option> */}
                                                                    {/* <option value="qa">QA</option> */}
                                                                    {/* <option value="superadmin">Super Admin</option> */}
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <button
                                                            type="submit"
                                                            disabled={loading}
                                                            className="inline-flex mt-3 items-center gap-2 px-6 py-2 bg-[#0446DB] cursor-pointer text-white text-sm font-medium rounded-lg disabled:opacity-50"
                                                        >
                                                            {loading ? (
                                                                <>
                                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                                    Creating...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Save className="w-4 h-4" />
                                                                    Create User
                                                                </>
                                                            )}
                                                        </button>
                                                    </div>



                                                </div>
                                            </div>

                                            {/* Footer */}
                                            {/* <div className="border-t px-6 py-4 bg-gray-50">
                                                <div className="flex justify-end gap-3">

                                                    <button
                                                        type="submit"
                                                        disabled={loading}
                                                        className="inline-flex items-center gap-2 px-6 py-2 bg-[#0446DB] cursor-pointer text-white text-sm font-medium rounded-lg disabled:opacity-50"
                                                    >
                                                        {loading ? (
                                                            <>
                                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                                Creating...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Save className="w-4 h-4" />
                                                                Create User
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div> */}
                                        </form>
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    {/* <AlertDialogAction>Continue</AlertDialogAction> */}
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                    </div>
                </div>
            </div>

            {/* Users Table */}
            <div className=' px-3 relative -top-9'>
                <div className="bg-white   rounded-sm  overflow-hidden">
                    <Table >
                        <TableHeader >
                            <TableRow>
                                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</TableHead>
                                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</TableHead>
                                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</TableHead>
                                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account Status</TableHead>
                                <TableHead className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={10} className="text-center py-10">
                                        <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                                        <p className="mt-2">Loading Users...</p>
                                    </TableCell>
                                </TableRow>
                            ) : filteredUsers?.length == 0 ? (
                                <TableRow>
                                    <TableCell colSpan={10} className="text-center py-10">
                                        No Users found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredUsers?.map((user) => (
                                    <TableRow key={user._id} className="hover:bg-gray-50">
                                        <TableCell className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">

                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                    <div className="text-sm text-gray-500">{user.email}</div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">{user.phone}</div>
                                        </TableCell>

                                        <TableCell className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                                {user.role_name || 'N/A'}
                                            </span>
                                        </TableCell>

                                        <TableCell className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">

                                                {/* Toggle Switch */}
                                                {/* Status Text */}
                                                <span
                                                    className={`px-2 py-1 text-xs font-medium rounded-full ${user?.is_active
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-red-500 text-white"
                                                        }`}
                                                >
                                                    {user?.is_active ? "Active" : "Inactive"}
                                                </span>
                                                <button
                                                    onClick={() => handleStatusChange(user)}
                                                    className={`w-12 h-6 flex items-center rounded-full p-1 transition duration-300 ${user?.is_active ? "bg-green-500" : "bg-gray-300"
                                                        }`}
                                                >
                                                    <div
                                                        className={`bg-white w-4 h-4 rounded-full shadow-md transform transition duration-300 ${user?.is_active ? "translate-x-6" : "translate-x-0"
                                                            }`}
                                                    />
                                                </button>



                                            </div>
                                        </TableCell>
                                        <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">

                                            <AlertDialog
                                            >
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="outline"
                                                        onClick={() => getUserPermission(user.role_id)}
                                                        className='text-[#0446DB]'
                                                    >
                                                        <EyeIcon className="w-5 h-5" />
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
                                                                <div>
                                                                    <h2 className="text-lg font-semibold text-gray-900">Role Permissions</h2>
                                                                    <p className="text-sm text-gray-500">View all permissions and assigned cities for this user</p>
                                                                </div>
                                                            </div>
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            <div className="p-6 bg-gray-50/50 max-h-[calc(90vh-120px)] overflow-y-auto">

                                                                {
                                                                    permission?.map((permission) => {
                                                                        return (
                                                                            <>
                                                                                <div className="p-3 border rounded-lg bg-gray-50 mb-2">
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
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        {/* <AlertDialogAction>Continue</AlertDialogAction> */}
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


    );
};

export default UserManagement;