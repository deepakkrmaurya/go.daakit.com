// import { useEffect, useMemo, useState } from "react";

// import {

//   UserPlus,

//   Save,

//   Eye,

//   EyeOff,

//   Mail,

//   Phone,

//   User,

//   KeyRound,

//   Shield,

//   AlertCircle,

//   EyeIcon,

//   Loader2,

//   Search,

//   Users,

//   UserCheck,

//   UserX,

//   RefreshCw,

//   X,

//   MapPin,

//   LockKeyhole,

// } from "lucide-react";

// import {

//   Table,

//   TableBody,

//   TableCell,

//   TableHead,

//   TableHeader,

//   TableRow,

// } from "@/components/ui/table";

// import {

//   AlertDialog,

//   AlertDialogCancel,

//   AlertDialogContent,

//   AlertDialogDescription,

//   AlertDialogFooter,

//   AlertDialogHeader,

//   AlertDialogTitle,

//   AlertDialogTrigger,

// } from "@/components/ui/alert-dialog";

// import { Button } from "@/components/ui/button";

// import axios from "axios";

// import { toast } from "react-toastify";

// const baseURL = import.meta.env.VITE_BASE_URL;

// const UserManagement = () => {

//   const [users, setUsers] = useState([]);

//   const [loading, setLoading] = useState(false);

//   const [creating, setCreating] = useState(false);

//   const [searchTerm, setSearchTerm] = useState("");

//   const [showPassword, setShowPassword] = useState(false);

//   const [roles, setRoles] = useState([]);

//   const [errors, setErrors] = useState({});

//   const [permission, setPermission] = useState([]);

//   const [permissionLoading, setPermissionLoading] =

//     useState(false);

//   const [formData, setFormData] = useState({

//     name: "",

//     phone: "",

//     email: "",

//     password: "",

//     role_id: "",

//     usertype: "",

//     is_verified: 1,

//   });

//   const getHeaders = () => ({

//     Authorization: `Bearer ${localStorage.getItem("token")}`,

//   });

//   const fetchRoles = async () => {

//     try {

//       const res = await axios.get(

//         `${baseURL}/api/admin/getAllRoles`,

//         {

//           headers: getHeaders(),

//         }

//       );

//       if (res?.data?.success) {

//         setRoles(res?.data?.roles || []);

//       }

//     } catch (error) {

//       console.error("Fetch Roles Error:", error);

//       toast.error("Error fetching roles");

//     }

//   };

//   const fetchUsers = async () => {

//     try {

//       setLoading(true);

//       const res = await axios.get(

//         `${baseURL}/api/admin/getAllUsers`,

//         {

//           headers: getHeaders(),

//         }

//       );

//       if (res?.data?.data?.status === 200) {

//         setUsers(res?.data?.data?.users || []);

//       }

//     } catch (error) {

//       console.error("Fetch Users Error:", error);

//       toast.error("Error fetching users");

//     } finally {

//       setLoading(false);

//     }

//   };

//   useEffect(() => {

//     fetchUsers();

//     fetchRoles();

//   }, []);

//   const validateForm = () => {

//     const newErrors = {};

//     if (!formData.name?.trim()) {

//       newErrors.name = "Name is required";

//     }

//     if (!formData.phone?.trim()) {

//       newErrors.phone = "Phone number is required";

//     } else if (!/^[0-9]{10,15}$/.test(formData.phone)) {

//       newErrors.phone = "Enter a valid phone number";

//     }
// if (!formData.email?.trim()) {
//   newErrors.email = "Email is required";
// } else if (
//   !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
// ) {
//   newErrors.email = "Enter a valid email address";
// }

//     if (!formData.password) {

//       newErrors.password = "Password is required";

//     } else if (formData.password.length < 6) {

//       newErrors.password =

//         "Password must be at least 6 characters";

//     }

//     if (!formData.role_id) {

//       newErrors.role_id = "Please select a role";

//     }

//     setErrors(newErrors);

//     return Object.keys(newErrors).length === 0;

//   };

//   const handleInputChange = (e) => {

//     const { name, value } = e.target;

//     setFormData((prev) => ({

//       ...prev,

//       [name]: value,

//     }));

//     if (errors[name]) {

//       setErrors((prev) => ({

//         ...prev,

//         [name]: null,

//       }));

//     }

//   };

//   const resetForm = () => {

//     setFormData({

//       name: "",

//       phone: "",

//       email: "",

//       password: "",

//       role_id: "",

//       usertype: "",

//       is_verified: 1,

//     });

//     setErrors({});

//     setShowPassword(false);

//   };

//   const handleSubmit = async (e) => {

//     e.preventDefault();

//     if (!validateForm()) {

//       toast.warning("Please fill all required fields");

//       return;

//     }

//     try {

//       setCreating(true);

//       const submitData = {

//         ...formData,

//       };

//       const res = await axios.post(

//         `${baseURL}/api/admin/addUser`,

//         submitData,

//         {

//           headers: {

//             ...getHeaders(),

//             "Content-Type": "application/json",

//           },

//         }

//       );

//       toast.success(

//         res?.data?.message || "User created successfully!"

//       );

//       resetForm();

//       fetchUsers();

//     } catch (error) {

//       console.error("Create User Error:", error);

//       toast.error(

//         error?.response?.data?.message ||

//           "Failed to create user"

//       );

//     } finally {

//       setCreating(false);

//     }

//   };

//   const getUserPermission = async (roleId) => {

//     try {

//       setPermissionLoading(true);

//       setPermission([]);

//       const res = await axios.get(

//         `${baseURL}/api/admin/getRoleWithPermissions`,

//         {

//           params: {

//             role_id: roleId,

//           },

//           headers: getHeaders(),

//         }

//       );

//       if (res?.data?.success) {

//         setPermission(res?.data?.data || []);

//       }

//     } catch (error) {

//       console.error("Permission Error:", error);

//       toast.error("Error fetching user permissions");

//     } finally {

//       setPermissionLoading(false);

//     }

//   };

//   const handleStatusChange = async (user) => {

//     try {

//       const updatedStatus = !Boolean(user?.is_active);

//       await axios.post(

//         `${baseURL}/api/admin/updateUser/${user.id}`,

//         {

//           is_active: updatedStatus ? "1" : "0",

//         },

//         {

//           headers: getHeaders(),

//         }

//       );

//       toast.success(

//         updatedStatus

//           ? "User activated successfully"

//           : "User deactivated successfully"

//       );

//       fetchUsers();

//     } catch (error) {

//       console.error("Status Change Error:", error);

//       toast.error(

//         error?.response?.data?.message ||

//           "Failed to update user status"

//       );

//     }

//   };

//   const filteredUsers = useMemo(() => {

//     const search = searchTerm.trim().toLowerCase();

//     if (!search) return users;

//     return users?.filter((user) => {

//       return (

//         user?.name?.toLowerCase().includes(search) ||

//         user?.email?.toLowerCase().includes(search) ||

//         user?.phone?.toString().includes(search) ||

//         user?.role_name?.toLowerCase().includes(search)

//       );

//     });

//   }, [users, searchTerm]);

//   const totalUsers = users?.length || 0;

//   const activeUsers =

//     users?.filter((user) => Boolean(user?.is_active))

//       ?.length || 0;

//   const inactiveUsers = totalUsers - activeUsers;

//   const getInitial = (name) => {

//     if (!name) return "U";

//     return name.trim().charAt(0).toUpperCase();

//   };

//   return (

//     <div className="flex h-[calc(100dvh-80px)] min-h-0 w-full flex-col overflow-hidden bg-[#F8FAFC] p-3 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 sm:p-4 lg:p-5">

//       <div className="mx-auto flex min-h-0 w-full flex-1 flex-col gap-3 overflow-hidden">

//         <div className="flex shrink-0 flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

//           <div>

//             <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-2xl">

//               User Management

//             </h1>

//             <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">

//               Manage users, roles, permissions and account

//               access.

//             </p>

//           </div>

//           <AlertDialog>

//             <AlertDialogTrigger asChild>

//               <button

//                 type="button"

//                 className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#0446DB] px-4 text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#0339B5] hover:shadow-md"

//               >

//                 <UserPlus className="h-4 w-4" />

//                 Add New User

//               </button>

//             </AlertDialogTrigger>

//             <AlertDialogContent className="max-h-[92vh] w-[95vw] max-w-3xl overflow-hidden border-neutral-200 bg-white p-0 dark:border-neutral-800 dark:bg-neutral-900">

//               <AlertDialogHeader className="border-b border-neutral-200 px-6 py-5 text-left dark:border-neutral-800">

//                 <AlertDialogTitle>

//                   <div className="flex items-start gap-3">

//                     <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0446DB]/10 text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400">

//                       <UserPlus className="h-5 w-5" />

//                     </div>

//                     <div>

//                       <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">

//                         Add New User

//                       </h2>

//                       <p className="mt-1 text-sm font-normal text-neutral-500 dark:text-neutral-400">

//                         Create a new account and assign the

//                         appropriate role.

//                       </p>

//                     </div>

//                   </div>

//                 </AlertDialogTitle>

//               </AlertDialogHeader>

//               <AlertDialogDescription asChild>

//                 <form

//                   onSubmit={handleSubmit}

//                   className="flex max-h-[calc(92vh-90px)] flex-col"

//                 >

//                   <div className="flex-1 overflow-y-auto p-6">

//                     <div className="space-y-6">

//                       <div>

//                         <div className="mb-4 flex items-center gap-2">

//                           <User className="h-4 w-4 text-[#0446DB] dark:text-blue-400" />

//                           <div>

//                             <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">

//                               Basic Information

//                             </h3>

//                             <p className="text-xs text-neutral-500 dark:text-neutral-400">

//                               Enter the user's personal and

//                               login information.

//                             </p>

//                           </div>

//                         </div>

//                         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

//                           <div>

//                             <label className="mb-1.5 block text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300">

//                               Full Name

//                               <span className="ml-1 text-red-500">

//                                 *

//                               </span>

//                             </label>

//                             <div className="relative">

//                               <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

//                               <input

//                                 type="text"

//                                 name="name"

//                                 value={formData.name}

//                                 onChange={handleInputChange}

//                                 placeholder="Enter full name"

//                                 className={`h-10 w-full rounded-lg border bg-white pl-9 pr-3 text-sm text-neutral-900 outline-none transition-all placeholder:text-neutral-400 focus:ring-1 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-500 ${

//                                   errors.name

//                                     ? "border-red-500 focus:border-red-500 focus:ring-red-500"

//                                     : "border-neutral-200 focus:border-[#0446DB] focus:ring-[#0446DB] dark:border-neutral-700"

//                                 }`}

//                               />

//                             </div>

//                             {errors.name && (

//                               <p className="mt-1 flex items-center gap-1 text-left text-xs text-red-500">

//                                 <AlertCircle className="h-3 w-3" />

//                                 {errors.name}

//                               </p>

//                             )}

//                           </div>

//                           <div>

//                             <label className="mb-1.5 block text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300">

//                               Phone Number

//                               <span className="ml-1 text-red-500">

//                                 *

//                               </span>

//                             </label>

//                             <div className="relative">

//                               <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

//                               <input

//                                 type="tel"

//                                 name="phone"

//                                 value={formData.phone}

//                                 onChange={handleInputChange}

//                                 placeholder="Enter phone number"

//                                 className={`h-10 w-full rounded-lg border bg-white pl-9 pr-3 text-sm text-neutral-900 outline-none transition-all placeholder:text-neutral-400 focus:ring-1 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-500 ${

//                                   errors.phone

//                                     ? "border-red-500 focus:border-red-500 focus:ring-red-500"

//                                     : "border-neutral-200 focus:border-[#0446DB] focus:ring-[#0446DB] dark:border-neutral-700"

//                                 }`}

//                               />

//                             </div>

//                             {errors.phone && (

//                               <p className="mt-1 text-left text-xs text-red-500">

//                                 {errors.phone}

//                               </p>

//                             )}

//                           </div>

//                           <div>

//                             <label className="mb-1.5 block text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300">

//                               Email Address

//                               <span className="ml-1 text-red-500">

//                                 *

//                               </span>

//                             </label>

//                             <div className="relative">

//                               <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

//                               <input

//                                 type="email"

//                                 name="email"

//                                 value={formData.email}

//                                 onChange={handleInputChange}

//                                 placeholder="name@example.com"

//                                 className={`h-10 w-full rounded-lg border bg-white pl-9 pr-3 text-sm text-neutral-900 outline-none transition-all placeholder:text-neutral-400 focus:ring-1 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-500 ${

//                                   errors.email

//                                     ? "border-red-500 focus:border-red-500 focus:ring-red-500"

//                                     : "border-neutral-200 focus:border-[#0446DB] focus:ring-[#0446DB] dark:border-neutral-700"

//                                 }`}

//                               />

//                             </div>

//                             {errors.email && (

//                               <p className="mt-1 text-left text-xs text-red-500">

//                                 {errors.email}

//                               </p>

//                             )}

//                           </div>

//                           <div>

//                             <label className="mb-1.5 block text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300">

//                               Password

//                               <span className="ml-1 text-red-500">

//                                 *

//                               </span>

//                             </label>

//                             <div className="relative">

//                               <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

//                               <input

//                                 type={

//                                   showPassword

//                                     ? "text"

//                                     : "password"

//                                 }

//                                 name="password"

//                                 value={formData.password}

//                                 onChange={handleInputChange}

//                                 placeholder="Minimum 6 characters"

//                                 className={`h-10 w-full rounded-lg border bg-white pl-9 pr-10 text-sm text-neutral-900 outline-none transition-all placeholder:text-neutral-400 focus:ring-1 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-500 ${

//                                   errors.password

//                                     ? "border-red-500 focus:border-red-500 focus:ring-red-500"

//                                     : "border-neutral-200 focus:border-[#0446DB] focus:ring-[#0446DB] dark:border-neutral-700"

//                                 }`}

//                               />

//                               <button

//                                 type="button"

//                                 onClick={() =>

//                                   setShowPassword(

//                                     !showPassword

//                                   )

//                                 }

//                                 className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 transition-colors hover:text-neutral-700 dark:hover:text-white"

//                               >

//                                 {showPassword ? (

//                                   <EyeOff className="h-4 w-4" />

//                                 ) : (

//                                   <Eye className="h-4 w-4" />

//                                 )}

//                               </button>

//                             </div>

//                             {errors.password && (

//                               <p className="mt-1 text-left text-xs text-red-500">

//                                 {errors.password}

//                               </p>

//                             )}

//                           </div>

//                         </div>

//                       </div>

//                       <div className="border-t border-neutral-100 pt-5 dark:border-neutral-800">

//                         <div className="mb-4 flex items-center gap-2">

//                           <Shield className="h-4 w-4 text-[#0446DB] dark:text-blue-400" />

//                           <div>

//                             <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">

//                               Role & Access

//                             </h3>

//                             <p className="text-xs text-neutral-500 dark:text-neutral-400">

//                               Define the user's role and

//                               department.

//                             </p>

//                           </div>

//                         </div>

//                         <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

//                           <div>

//                             <label className="mb-1.5 block text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300">

//                               Select Role

//                               <span className="ml-1 text-red-500">

//                                 *

//                               </span>

//                             </label>

//                             <select

//                               name="role_id"

//                               value={formData.role_id}

//                               onChange={handleInputChange}

//                               className={`h-10 w-full rounded-lg border bg-white px-3 text-sm text-neutral-800 outline-none transition-all focus:ring-1 dark:bg-neutral-800 dark:text-white ${

//                                 errors.role_id

//                                   ? "border-red-500 focus:border-red-500 focus:ring-red-500"

//                                   : "border-neutral-200 focus:border-[#0446DB] focus:ring-[#0446DB] dark:border-neutral-700"

//                               }`}

//                             >

//                               <option value="">

//                                 Choose a role...

//                               </option>

//                               {roles?.map((role) => (

//                                 <option

//                                   key={

//                                     role.__id_ || role.id

//                                   }

//                                   value={role.id}

//                                 >

//                                   {role.role_name}

//                                 </option>

//                               ))}

//                             </select>

//                             {errors.role_id && (

//                               <p className="mt-1 text-left text-xs text-red-500">

//                                 {errors.role_id}

//                               </p>

//                             )}

//                           </div>

//                           <div>

//                             <label className="mb-1.5 block text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300">

//                               User Type

//                             </label>

//                             <select

//                               name="usertype"

//                               value={

//                                 formData.usertype || ""

//                               }

//                               onChange={handleInputChange}

//                               className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-800 outline-none transition-all focus:border-[#0446DB] focus:ring-1 focus:ring-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"

//                             >

//                               <option value="">

//                                 Select User Type

//                               </option>

//                               <option value="customer">

//                                 Customer

//                               </option>

//                               <option value="operations">

//                                 Operations

//                               </option>

//                               <option value="support">

//                                 Support

//                               </option>

//                               <option value="finance">

//                                 Finance

//                               </option>

//                               <option value="sales">

//                                 Sales

//                               </option>

//                               <option value="marketing">

//                                 Marketing

//                               </option>

//                             </select>

//                           </div>

//                         </div>

//                       </div>

//                     </div>

//                   </div>

//                   <div className="flex items-center justify-end gap-3 border-t border-neutral-200 bg-neutral-50 px-6 py-4 dark:border-neutral-800 dark:bg-neutral-950/40">

//                     <AlertDialogCancel

//                       type="button"

//                       className="mt-0 h-10 rounded-lg border-neutral-200 px-4 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"

//                     >

//                       Cancel

//                     </AlertDialogCancel>

//                     <button

//                       type="submit"

//                       disabled={creating}

//                       className="inline-flex h-10 min-w-[130px] items-center justify-center gap-2 rounded-lg bg-[#0446DB] px-5 text-sm font-semibold text-white transition-all hover:bg-[#0339B5] disabled:cursor-not-allowed disabled:opacity-60"

//                     >

//                       {creating ? (

//                         <>

//                           <Loader2 className="h-4 w-4 animate-spin" />

//                           Creating...

//                         </>

//                       ) : (

//                         <>

//                           <Save className="h-4 w-4" />

//                           Create User

//                         </>

//                       )}

//                     </button>

//                   </div>

//                 </form>

//               </AlertDialogDescription>

//             </AlertDialogContent>

//           </AlertDialog>

//         </div>

//         <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">

//           <div className="flex shrink-0 flex-col gap-3 border-b border-neutral-200 p-3 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between sm:p-4">

//             <div>

//               <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">

//                 Users

//               </h2>

//               <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">

//                 {filteredUsers?.length || 0} user

//                 {filteredUsers?.length !== 1

//                   ? "s"

//                   : ""}{" "}

//                 found

//               </p>

//             </div>

//             <div className="flex items-center gap-2">

//               <div className="relative w-full sm:w-[280px]">

//                 <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

//                 <input

//                   type="text"

//                   value={searchTerm}

//                   onChange={(e) =>

//                     setSearchTerm(e.target.value)

//                   }

//                   placeholder="Search name, email, phone..."

//                   className="h-10 w-full rounded-lg border border-neutral-200 bg-white pl-9 pr-9 text-sm text-neutral-900 outline-none transition-all placeholder:text-neutral-400 focus:border-[#0446DB] focus:ring-1 focus:ring-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-500"

//                 />

//                 {searchTerm && (

//                   <button

//                     type="button"

//                     onClick={() => setSearchTerm("")}

//                     className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 dark:hover:text-white"

//                   >

//                     <X className="h-4 w-4" />

//                   </button>

//                 )}

//               </div>

//               <button

//                 type="button"

//                 onClick={fetchUsers}

//                 disabled={loading}

//                 title="Refresh users"

//                 className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-500 transition-all hover:border-[#0446DB]/30 hover:bg-blue-50 hover:text-[#0446DB] disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:hover:text-blue-400"

//               >

//                 <RefreshCw

//                   className={`h-4 w-4 ${

//                     loading ? "animate-spin" : ""

//                   }`}

//                 />

//               </button>

//             </div>

//           </div>

//           <div className="min-h-0 w-full flex-1 overflow-auto overscroll-contain [&>div]:h-full [&>div]:overflow-auto [&_table]:min-w-[820px] [&_table]:border-separate [&_table]:border-spacing-0">

//             <Table className="w-full min-w-[820px]">

//               <TableHeader className="bg-neutral-50 dark:bg-neutral-800">

//                 <TableRow className="border-neutral-200 bg-neutral-50/80 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950/40">

//                   <TableHead className="sticky top-0 z-20 min-w-[230px] border-b border-neutral-200 bg-neutral-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800">

//                     User

//                   </TableHead>

//                   <TableHead className="sticky top-0 z-20 min-w-[150px] border-b border-neutral-200 bg-neutral-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800">

//                     Contact

//                   </TableHead>

//                   <TableHead className="sticky top-0 z-20 border-b border-neutral-200 bg-neutral-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800">

//                     Role

//                   </TableHead>

//                   <TableHead className="sticky top-0 z-20 border-b border-neutral-200 bg-neutral-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800">

//                     Status

//                   </TableHead>

//                   <TableHead className="sticky top-0 z-20 border-b border-neutral-200 bg-neutral-50 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800">

//                     Actions

//                   </TableHead>

//                 </TableRow>

//               </TableHeader>

//               <TableBody>

//                 {loading ? (

//                   <TableRow>

//                     <TableCell

//                       colSpan={5}

//                       className="h-[280px]"

//                     >

//                       <div className="flex flex-col items-center justify-center">

//                         <Loader2 className="h-7 w-7 animate-spin text-[#0446DB] dark:text-blue-400" />

//                         <p className="mt-3 text-sm font-medium text-neutral-600 dark:text-neutral-300">

//                           Loading users...

//                         </p>

//                         <p className="mt-1 text-xs text-neutral-400">

//                           Please wait a moment

//                         </p>

//                       </div>

//                     </TableCell>

//                   </TableRow>

//                 ) : filteredUsers?.length === 0 ? (

//                   <TableRow>

//                     <TableCell

//                       colSpan={5}

//                       className="h-[280px]"

//                     >

//                       <div className="flex flex-col items-center justify-center">

//                         <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">

//                           <Users className="h-5 w-5 text-neutral-400" />

//                         </div>

//                         <p className="mt-3 text-sm font-semibold text-neutral-700 dark:text-neutral-200">

//                           No users found

//                         </p>

//                         <p className="mt-1 text-xs text-neutral-400">

//                           Try changing your search.

//                         </p>

//                       </div>

//                     </TableCell>

//                   </TableRow>

//                 ) : (

//                   filteredUsers.map((user) => (

//                     <TableRow

//                       key={user.__id_ || user.id}

//                       className="border-neutral-100 transition-colors hover:bg-neutral-50/70 dark:border-neutral-800 dark:hover:bg-neutral-800/40"

//                     >

//                       <TableCell className="px-5 py-4">

//                         <div className="flex items-center gap-3">

//                           <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0446DB]/10 text-sm font-bold text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400">

//                             {getInitial(user.name)}

//                           </div>

//                           <div className="min-w-0">

//                             <p className="truncate text-sm font-semibold text-neutral-900 dark:text-white">

//                               {user.name || "N/A"}

//                             </p>

//                             <div className="mt-1 flex items-center gap-1.5">

//                               <Mail className="h-3 w-3 shrink-0 text-neutral-400" />

//                               <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">

//                                 {user.email || "N/A"}

//                               </p>

//                             </div>

//                           </div>

//                         </div>

//                       </TableCell>

//                       <TableCell className="px-5 py-4">

//                         <div className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">

//                           <Phone className="h-3.5 w-3.5 text-neutral-400" />

//                           {user.phone || "N/A"}

//                         </div>

//                       </TableCell>

//                       <TableCell className="px-5 py-4">

//                         <span className="inline-flex rounded-md border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-[#0446DB] dark:border-blue-900/50 dark:bg-blue-500/10 dark:text-blue-300">

//                           {user.role_name || "N/A"}

//                         </span>

//                       </TableCell>

//                       <TableCell className="px-5 py-4">

//                         <div className="flex items-center gap-3">

//                           <button

//                             type="button"

//                             onClick={() =>

//                               handleStatusChange(user)

//                             }

//                             className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${

//                               Boolean(user?.is_active)

//                                 ? "bg-emerald-500"

//                                 : "bg-neutral-300 dark:bg-neutral-700"

//                             }`}

//                           >

//                             <span

//                               className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${

//                                 Boolean(user?.is_active)

//                                   ? "left-6"

//                                   : "left-1"

//                               }`}

//                             />

//                           </button>

//                           <div>

//                             <p

//                               className={`text-xs font-semibold ${

//                                 Boolean(user?.is_active)

//                                   ? "text-emerald-600 dark:text-emerald-400"

//                                   : "text-neutral-500 dark:text-neutral-400"

//                               }`}

//                             >

//                               {Boolean(user?.is_active)

//                                 ? "Active"

//                                 : "Inactive"}

//                             </p>

//                             <p className="mt-0.5 text-[10px] text-neutral-400">

//                               Account access

//                             </p>

//                           </div>

//                         </div>

//                       </TableCell>

//                       <TableCell className="px-5 py-4 text-right">

//                         <AlertDialog>

//                           <AlertDialogTrigger asChild>

//                             <button

//                               type="button"

//                               onClick={() =>

//                                 getUserPermission(

//                                   user.role_id

//                                 )

//                               }

//                               title="View permissions"

//                               className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 text-xs font-semibold text-neutral-600 transition-all hover:border-[#0446DB]/30 hover:bg-blue-50 hover:text-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-blue-500/40 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"

//                             >

//                               <EyeIcon className="h-4 w-4" />

//                               <span className="hidden xl:inline">

//                                 Permissions

//                               </span>

//                             </button>

//                           </AlertDialogTrigger>

//                           <AlertDialogContent className="max-h-[90vh] w-[95vw] max-w-xl overflow-hidden border-neutral-200 bg-white p-0 dark:border-neutral-800 dark:bg-neutral-900">

//                             <AlertDialogHeader className="border-b border-neutral-200 px-6 py-5 text-left dark:border-neutral-800">

//                               <AlertDialogTitle>

//                                 <div className="flex items-start gap-3">

//                                   <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">

//                                     <LockKeyhole className="h-5 w-5" />

//                                   </div>

//                                   <div>

//                                     <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">

//                                       Role Permissions

//                                     </h2>

//                                     <p className="mt-1 text-sm font-normal text-neutral-500 dark:text-neutral-400">

//                                       {user.name} •{" "}

//                                       {user.role_name ||

//                                         "User"}

//                                     </p>

//                                   </div>

//                                 </div>

//                               </AlertDialogTitle>

//                             </AlertDialogHeader>

//                             <AlertDialogDescription asChild>

//                               <div className="max-h-[65vh] overflow-y-auto p-5">

//                                 {permissionLoading ? (

//                                   <div className="flex min-h-[250px] flex-col items-center justify-center">

//                                     <Loader2 className="h-7 w-7 animate-spin text-[#0446DB]" />

//                                     <p className="mt-3 text-sm text-neutral-500 dark:text-neutral-400">

//                                       Loading permissions...

//                                     </p>

//                                   </div>

//                                 ) : permission?.length ===

//                                   0 ? (

//                                   <div className="flex min-h-[250px] flex-col items-center justify-center text-center">

//                                     <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">

//                                       <Shield className="h-5 w-5 text-neutral-400" />

//                                     </div>

//                                     <p className="mt-3 text-sm font-semibold text-neutral-700 dark:text-neutral-200">

//                                       No permissions found

//                                     </p>

//                                     <p className="mt-1 text-xs text-neutral-400">

//                                       No permissions are

//                                       assigned to this role.

//                                     </p>

//                                   </div>

//                                 ) : (

//                                   <div className="space-y-3 grid grid-cols-2 gap-3 sm:grid-cols-3">

//                                     {permission.map(

//                                       (item, index) => (

//                                         <div

//                                           key={

//                                             item.id ||

//                                             `${item.permission_code}-${index}`

//                                           }

//                                           className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-700 dark:bg-neutral-800/40"

//                                         >

//                                           <div className="flex items-start gap-3">

//                                             <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-blue-50 text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400">

//                                               <Shield className="h-4 w-4" />

//                                             </div>

//                                             <div className="min-w-0 flex-1">

//                                               <p className="break-all whitespace-nowrap text-[11px] font-semibold text-neutral-800 dark:text-neutral-200">

//                                                 {

//                                                   item.permission_code

//                                                 }

//                                               </p>

//                                               <div className="mt-3">

//                                                 <div className="mb-2 flex items-center gap-1.5">

//                                                   <MapPin className="h-3 w-3 text-neutral-400" />

//                                                   <span className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400">

//                                                     Assigned

//                                                     Cities

//                                                   </span>

//                                                 </div>

//                                                 {Array.isArray(

//                                                   item.cities

//                                                 ) &&

//                                                 item.cities

//                                                   .length >

//                                                   0 ? (

//                                                   <div className="flex flex-wrap gap-1.5">

//                                                     {item.cities.map(

//                                                       (

//                                                         city,

//                                                         cityIndex

//                                                       ) => (

//                                                         <span

//                                                           key={

//                                                             cityIndex

//                                                           }

//                                                           className="rounded-md border border-blue-100 bg-blue-50 px-2 py-1 text-[11px] font-medium text-blue-700 dark:border-blue-900/50 dark:bg-blue-500/10 dark:text-blue-300"

//                                                         >

//                                                           {

//                                                             city

//                                                           }

//                                                         </span>

//                                                       )

//                                                     )}

//                                                   </div>

//                                                 ) : (

//                                                   <span className="text-xs text-neutral-400">

//                                                     No cities

//                                                     assigned

//                                                   </span>

//                                                 )}

//                                               </div>

//                                             </div>

//                                           </div>

//                                         </div>

//                                       )

//                                     )}

//                                   </div>

//                                 )}

//                               </div>

//                             </AlertDialogDescription>

//                             <AlertDialogFooter className="border-t border-neutral-200 bg-neutral-50 px-5 my-0 dark:border-neutral-800 dark:bg-neutral-950/40">

//                               <AlertDialogCancel className="mt-0 rounded-lg dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">

//                                 Close

//                               </AlertDialogCancel>

//                             </AlertDialogFooter>

//                           </AlertDialogContent>

//                         </AlertDialog>

//                       </TableCell>

//                     </TableRow>

//                   ))

//                 )}

//               </TableBody>

//             </Table>

//           </div>

//         </div>

//       </div>

//     </div>

//   );

// };

// export default UserManagement;

import { useEffect, useMemo, useState } from "react";

import {
  UserPlus,
  Pencil,
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
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(false);

  const [creating, setCreating] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  // Edit and password forms are isolated from the existing create-user form.
  const [editingUser, setEditingUser] = useState(null);
  const [editData, setEditData] = useState({
    name: "",
    phone: "",
    email: "",
    role_id: "",
    usertype: "",
  });
  const [updatingUser, setUpdatingUser] = useState(false);
  const [passwordUser, setPasswordUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const [roles, setRoles] = useState([]);

  const [errors, setErrors] = useState({});

  const [permission, setPermission] = useState([]);

  const [permissionLoading, setPermissionLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",

    phone: "",

    email: "",

    password: "",

    role_id: "",

    usertype: "",

    is_verified: 1,
  });

  const getHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  });

  const fetchRoles = async () => {
    try {
      const res = await axios.get(
        `${baseURL}/api/admin/getAllRoles`,

        {
          headers: getHeaders(),
        },
      );

      if (res?.data?.success) {
        setRoles(res?.data?.roles || []);
      }
    } catch (error) {
      console.error("Fetch Roles Error:", error);

      toast.error("Error fetching roles");
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${baseURL}/api/admin/getAllUsers`,

        {
          headers: getHeaders(),
        },
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

  useEffect(() => {
    fetchUsers();

    fetchRoles();
  }, []);

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
    } else if (!/^[^\s@]+@[^\s@]+\\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.role_id) {
      newErrors.role_id = "Please select a role";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

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
        },
      );

      toast.success(res?.data?.message || "User created successfully!");

      resetForm();

      fetchUsers();
    } catch (error) {
      console.error("Create User Error:", error);

      toast.error(error?.response?.data?.message || "Failed to create user");
    } finally {
      setCreating(false);
    }
  };

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
        },
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
        },
      );

      toast.success(
        updatedStatus ? "User activated successfully" : "User deactivated successfully",
      );

      fetchUsers();
    } catch (error) {
      console.error("Status Change Error:", error);

      toast.error(error?.response?.data?.message || "Failed to update user status");
    }
  };

  const openEditUser = (user) => {
    setEditData({
      name: String(user?.name ?? ""),
      phone: String(user?.phone ?? ""),
      email: String(user?.email ?? ""),
      role_id: String(user?.role_id ?? ""),
      usertype: String(user?.usertype ?? ""),
    });
    setEditingUser(user);
  };

  const handleUpdateUser = async (event) => {
    event.preventDefault();
    if (!editingUser || updatingUser) return;
    const id = editingUser.id ?? editingUser._id;
    if (id == null) return toast.error("User ID is missing");
    const name = editData.name.trim();
    const phone = editData.phone.trim();
    const email = editData.email.trim().toLowerCase();
    if (!name) return toast.error("Name is required");
    if (!/^\d{10,15}$/.test(phone)) return toast.error("Enter a valid 10-15 digit phone number");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return toast.error("Enter a valid email address");
    if (!editData.role_id) return toast.error("Please select a role");
    setUpdatingUser(true);
    try {
      const response = await axios.post(
        `${baseURL}/api/admin/updateUser/${id}`,
        { name, phone, email, role_id: editData.role_id, usertype: editData.usertype },
        { headers: getHeaders() },
      );
      if (response?.data?.success === false)
        throw new Error(response?.data?.message || "Update failed");
      toast.success(response?.data?.message || "User updated successfully");
      setEditingUser(null);
      await fetchUsers();
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Failed to update user");
    } finally {
      setUpdatingUser(false);
    }
  };

  const openPasswordUpdate = (user) => {
    setPasswordUser(user);
    setNewPassword("");
    setConfirmPassword("");
    setPasswordVisible(false);
  };

  const handleUpdatePassword = async (event) => {
    event.preventDefault();
    if (!passwordUser || updatingPassword) return;
    const id = passwordUser.id ?? passwordUser._id;
    if (id == null) return toast.error("User ID is missing");
    if (newPassword.length < 6) return toast.error("Password must be at least 6 characters");
    if (newPassword !== confirmPassword) return toast.error("Passwords do not match");
    setUpdatingPassword(true);
    try {
      const response = await axios.post(
        `${baseURL}/api/admin/updateUser/${id}`,
        { 
          
          password: newPassword ,
          c_password: confirmPassword 


        },
        { headers: getHeaders() },
      );
      if (response?.data?.success === false)
        throw new Error(response?.data?.message || "Password update failed");
      toast.success(response?.data?.message || "Password updated successfully");
      setPasswordUser(null);
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.message || "Failed to update password");
    } finally {
      setUpdatingPassword(false);
    }
  };

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

  const totalUsers = users?.length || 0;

  const activeUsers = users?.filter((user) => Boolean(user?.is_active))?.length || 0;

  const inactiveUsers = totalUsers - activeUsers;

  const getInitial = (name) => {
    if (!name) return "U";

    return name.trim().charAt(0).toUpperCase();
  };

  return (
    <div className="flex h-[calc(100dvh-80px)] min-h-0 w-full flex-col overflow-hidden bg-[#F8FAFC] p-3 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 sm:p-4 lg:p-5">
      <div className="mx-auto flex min-h-0 w-full flex-1 flex-col gap-3 overflow-hidden">
        <div className="flex shrink-0 flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white sm:text-2xl">
              User Management
            </h1>

            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
              Manage users, roles, permissions and account access.
            </p>
          </div>

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
                        Create a new account and assign the appropriate role.
                      </p>
                    </div>
                  </div>
                </AlertDialogTitle>
              </AlertDialogHeader>

              <AlertDialogDescription asChild>
                <form onSubmit={handleSubmit} className="flex max-h-[calc(92vh-90px)] flex-col">
                  <div className="flex-1 overflow-y-auto p-6">
                    <div className="space-y-6">
                      <div>
                        <div className="mb-4 flex items-center gap-2">
                          <User className="h-4 w-4 text-[#0446DB] dark:text-blue-400" />

                          <div>
                            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                              Basic Information
                            </h3>

                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                              Enter the user's personal and login information.
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <label className="mb-1.5 block text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                              Full Name
                              <span className="ml-1 text-red-500">*</span>
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

                          <div>
                            <label className="mb-1.5 block text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                              Phone Number
                              <span className="ml-1 text-red-500">*</span>
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
                              <p className="mt-1 text-left text-xs text-red-500">{errors.phone}</p>
                            )}
                          </div>

                          <div>
                            <label className="mb-1.5 block text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                              Email Address
                              <span className="ml-1 text-red-500">*</span>
                            </label>

                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

                              <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="name\@example.com"
                                className={`h-10 w-full rounded-lg border bg-white pl-9 pr-3 text-sm text-neutral-900 outline-none transition-all placeholder:text-neutral-400 focus:ring-1 dark:bg-neutral-800 dark:text-white dark:placeholder:text-neutral-500 ${
                                  errors.email
                                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                                    : "border-neutral-200 focus:border-[#0446DB] focus:ring-[#0446DB] dark:border-neutral-700"
                                }`}
                              />
                            </div>

                            {errors.email && (
                              <p className="mt-1 text-left text-xs text-red-500">{errors.email}</p>
                            )}
                          </div>

                          <div>
                            <label className="mb-1.5 block text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                              Password
                              <span className="ml-1 text-red-500">*</span>
                            </label>

                            <div className="relative">
                              <KeyRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

                              <input
                                type={showPassword ? "text" : "password"}
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
                                onClick={() => setShowPassword(!showPassword)}
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

                      <div className="border-t border-neutral-100 pt-5 dark:border-neutral-800">
                        <div className="mb-4 flex items-center gap-2">
                          <Shield className="h-4 w-4 text-[#0446DB] dark:text-blue-400" />

                          <div>
                            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
                              Role & Access
                            </h3>

                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                              Define the user's role and department.
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <label className="mb-1.5 block text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                              Select Role
                              <span className="ml-1 text-red-500">*</span>
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
                              <option value="">Choose a role...</option>

                              {roles?.map((role) => (
                                <option key={role.id || role.id} value={role.id}>
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

                          <div>
                            <label className="mb-1.5 block text-left text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                              User Type
                            </label>

                            <select
                              name="usertype"
                              value={formData.usertype || ""}
                              onChange={handleInputChange}
                              className="h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-800 outline-none transition-all focus:border-[#0446DB] focus:ring-1 focus:ring-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-white"
                            >
                              <option value="">Select User Type</option>

                              <option value="customer">Customer</option>

                              <option value="operations">Operations</option>

                              <option value="support">Support</option>

                              <option value="finance">Finance</option>

                              <option value="sales">Sales</option>

                              <option value="marketing">Marketing</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

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

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="flex shrink-0 flex-col gap-3 border-b border-neutral-200 p-3 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between sm:p-4">
            <div>
              <h2 className="text-sm font-semibold text-neutral-900 dark:text-white">Users</h2>

              <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                {filteredUsers?.length || 0} user
                {filteredUsers?.length !== 1 ? "s" : ""} found
              </p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative w-full sm:w-[280px]">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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

              <button
                type="button"
                onClick={fetchUsers}
                disabled={loading}
                title="Refresh users"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-500 transition-all hover:border-[#0446DB]/30 hover:bg-blue-50 hover:text-[#0446DB] disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700 dark:hover:text-blue-400"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>

          <div className="min-h-0 w-full flex-1 overflow-auto overscroll-contain [&>div]:h-full [&>div]:overflow-auto [&\_table]:min-w-[820px] [&\_table]:border-separate [&\_table]:border-spacing-0">
            <Table className="w-full min-w-[820px]">
              <TableHeader className="bg-neutral-50 dark:bg-neutral-800">
                <TableRow className="border-neutral-200 bg-neutral-50/80 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950/40">
                  <TableHead className="sticky top-0 z-20 min-w-[230px] border-b border-neutral-200 bg-neutral-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800">
                    User
                  </TableHead>

                  <TableHead className="sticky top-0 z-20 min-w-[150px] border-b border-neutral-200 bg-neutral-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800">
                    Contact
                  </TableHead>

                  <TableHead className="sticky top-0 z-20 border-b border-neutral-200 bg-neutral-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800">
                    Role
                  </TableHead>

                  <TableHead className="sticky top-0 z-20 border-b border-neutral-200 bg-neutral-50 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800">
                    Status
                  </TableHead>

                  <TableHead className="sticky top-0 z-20 border-b border-neutral-200 bg-neutral-50 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-[280px]">
                      <div className="flex flex-col items-center justify-center">
                        <Loader2 className="h-7 w-7 animate-spin text-[#0446DB] dark:text-blue-400" />

                        <p className="mt-3 text-sm font-medium text-neutral-600 dark:text-neutral-300">
                          Loading users...
                        </p>

                        <p className="mt-1 text-xs text-neutral-400">Please wait a moment</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredUsers?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-[280px]">
                      <div className="flex flex-col items-center justify-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
                          <Users className="h-5 w-5 text-neutral-400" />
                        </div>

                        <p className="mt-3 text-sm font-semibold text-neutral-700 dark:text-neutral-200">
                          No users found
                        </p>

                        <p className="mt-1 text-xs text-neutral-400">Try changing your search.</p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow
                      key={user.id || user.id}
                      className="border-neutral-100 transition-colors hover:bg-neutral-50/70 dark:border-neutral-800 dark:hover:bg-neutral-800/40"
                    >
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

                      <TableCell className="px-5 py-4">
                        <div className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                          <Phone className="h-3.5 w-3.5 text-neutral-400" />

                          {user.phone || "N/A"}
                        </div>
                      </TableCell>

                      <TableCell className="px-5 py-4">
                        <span className="inline-flex rounded-md border border-blue-100 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-[#0446DB] dark:border-blue-900/50 dark:bg-blue-500/10 dark:text-blue-300">
                          {user.role_name || "N/A"}
                        </span>
                      </TableCell>

                      <TableCell className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleStatusChange(user)}
                            className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                              Boolean(user?.is_active)
                                ? "bg-emerald-500"
                                : "bg-neutral-300 dark:bg-neutral-700"
                            }`}
                          >
                            <span
                              className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all ${
                                Boolean(user?.is_active) ? "left-6" : "left-1"
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
                              {Boolean(user?.is_active) ? "Active" : "Inactive"}
                            </p>

                            <p className="mt-0.5 text-[10px] text-neutral-400">Account access</p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="px-5 py-4 text-right">
                        <div className="mb-2 flex  items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditUser(user)}
                            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-neutral-200 px-3 text-xs font-semibold text-[#0446DB] hover:bg-blue-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
                          >
                            <Pencil className="h-3.5 w-3.5" /> Edit User
                          </button>
                          <button
                            type="button"
                            onClick={() => openPasswordUpdate(user)}
                            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-neutral-200 px-3 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-800"
                          >
                            <KeyRound className="h-3.5 w-3.5" /> Password
                          </button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button
                              type="button"
                              onClick={() => getUserPermission(user.role_id)}
                              title="View permissions"
                              className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 text-xs font-semibold text-neutral-600 transition-all hover:border-[#0446DB]/30 hover:bg-blue-50 hover:text-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-blue-500/40 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
                            >
                              <EyeIcon className="h-4 w-4" />

                              <span className="hidden xl:inline">Permissions</span>
                            </button>
                          </AlertDialogTrigger>

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
                                      {user.name} • {user.role_name || "User"}
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
                                ) : permission?.length === 0 ? (
                                  <div className="flex min-h-[250px] flex-col items-center justify-center text-center">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
                                      <Shield className="h-5 w-5 text-neutral-400" />
                                    </div>

                                    <p className="mt-3 text-sm font-semibold text-neutral-700 dark:text-neutral-200">
                                      No permissions found
                                    </p>

                                    <p className="mt-1 text-xs text-neutral-400">
                                      No permissions are assigned to this role.
                                    </p>
                                  </div>
                                ) : (
                                  <div className="space-y-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                                    {permission.map((item, index) => (
                                      <div
                                        key={item.id || `${item.permission_code}-${index}`}
                                        className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-700 dark:bg-neutral-800/40"
                                      >
                                        <div className="flex items-start gap-3">
                                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-blue-50 text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400">
                                            <Shield className="h-4 w-4" />
                                          </div>

                                          <div className="min-w-0 flex-1">
                                            <p className="break-all whitespace-nowrap text-[11px] font-semibold text-neutral-800 dark:text-neutral-200">
                                              {item.permission_code}
                                            </p>

                                            <div className="mt-3">
                                              <div className="mb-2 flex items-center gap-1.5">
                                                <MapPin className="h-3 w-3 text-neutral-400" />

                                                <span className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400">
                                                  Assigned Cities
                                                </span>
                                              </div>

                                              {Array.isArray(item.cities) &&
                                              item.cities.length > 0 ? (
                                                <div className="flex flex-wrap gap-1.5">
                                                  {item.cities.map(
                                                    (
                                                      city,

                                                      cityIndex,
                                                    ) => (
                                                      <span
                                                        key={cityIndex}
                                                        className="rounded-md border border-blue-100 bg-blue-50 px-2 py-1 text-[11px] font-medium text-blue-700 dark:border-blue-900/50 dark:bg-blue-500/10 dark:text-blue-300"
                                                      >
                                                        {city}
                                                      </span>
                                                    ),
                                                  )}
                                                </div>
                                              ) : (
                                                <span className="text-xs text-neutral-400">
                                                  No cities assigned
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </AlertDialogDescription>

                            <AlertDialogFooter className="border-t border-neutral-200 bg-neutral-50 px-5 my-0 dark:border-neutral-800 dark:bg-neutral-950/40">
                              <AlertDialogCancel className="mt-0 rounded-lg dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200">
                                Close
                              </AlertDialogCancel>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                        </div>

                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Edit existing user; no changes to create or status-toggle flows. */}
      {editingUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-3 sm:p-5">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Edit user"
            className="flex max-h-[90dvh] w-full max-w-xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-neutral-900"
          >
            <div className="flex shrink-0 items-center justify-between border-b px-5 py-4 dark:border-neutral-800">
              <h2 className="text-lg font-semibold">Edit User</h2>
              <button
                type="button"
                aria-label="Close edit user"
                disabled={updatingUser}
                onClick={() => setEditingUser(null)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateUser} className="flex min-h-0 flex-1 flex-col">
              <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-y-auto p-5 sm:grid-cols-2">
                {[
                  ["name", "Full Name", "text"],
                  ["phone", "Phone Number", "tel"],
                  ["email", "Email Address", "email"],
                ].map(([key, label, type]) => (
                  <label key={key} className="block text-sm font-medium">
                    {label}
                    <input
                      required
                      type={type}
                      value={editData[key]}
                      onChange={(e) =>
                        setEditData((prev) => ({
                          ...prev,
                          [key]:
                            key === "phone"
                              ? e.target.value.replace(/\D/g, "").slice(0, 15)
                              : e.target.value,
                        }))
                      }
                      className="mt-1.5 h-10 w-full rounded-lg border border-neutral-300 bg-white px-3 text-sm outline-none focus:border-[#0446DB] dark:border-neutral-700 dark:bg-neutral-800"
                    />
                  </label>
                ))}
                <label className="block text-sm font-medium">
                  Role
                  <select
                    required
                    value={editData.role_id}
                    onChange={(e) => setEditData((prev) => ({ ...prev, role_id: e.target.value }))}
                    className="mt-1.5 h-10 w-full rounded-lg border border-neutral-300 bg-white px-3 text-sm dark:border-neutral-700 dark:bg-neutral-800"
                  >
                    <option value="">Select role</option>
                    {roles.map((role) => (
                      <option key={role.id ?? role._id} value={role.id ?? role._id}>
                        {role.role_name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm font-medium sm:col-span-2">
                  User Type
                  <select
                    value={editData.usertype}
                    onChange={(e) => setEditData((prev) => ({ ...prev, usertype: e.target.value }))}
                    className="mt-1.5 h-10 w-full rounded-lg border border-neutral-300 bg-white px-3 text-sm dark:border-neutral-700 dark:bg-neutral-800"
                  >
                    <option value="">Select User Type</option>
                    {![
                      "",
                      "customer",
                      "operations",
                      "support",
                      "finance",
                      "sales",
                      "marketing",
                    ].includes(editData.usertype) && (
                      <option value={editData.usertype}>{editData.usertype}</option>
                    )}
                    {["customer", "operations", "support", "finance", "sales", "marketing"].map(
                      (type) => (
                        <option key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                      ),
                    )}
                  </select>
                </label>
              </div>
              <div className="flex shrink-0 justify-end gap-2 border-t px-5 py-4 dark:border-neutral-800">
                <Button
                  type="button"
                  variant="outline"
                  disabled={updatingUser}
                  onClick={() => setEditingUser(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updatingUser}
                  className="bg-[#0446DB] text-white hover:bg-blue-800"
                >
                  {updatingUser ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Separate password form: password is never prefilled or displayed. */}
      {passwordUser && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-3 sm:p-5">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Update user password"
            className="w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl dark:bg-neutral-900"
          >
            <div className="flex items-center justify-between border-b px-5 py-4 dark:border-neutral-800">
              <div>
                <h2 className="text-lg font-semibold">Update Password</h2>
                <p className="mt-1 text-xs text-neutral-500">
                  {passwordUser.name || passwordUser.email}
                </p>
              </div>
              <button
                type="button"
                aria-label="Close password dialog"
                disabled={updatingPassword}
                onClick={() => setPasswordUser(null)}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleUpdatePassword} className="space-y-4 p-5">
              <label className="block text-sm font-medium">
                New Password
                <div className="relative mt-1.5">
                  <input
                    required
                    minLength={6}
                    type={passwordVisible ? "text" : "password"}
                    autoComplete="new-password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="h-10 w-full rounded-lg border border-neutral-300 bg-white px-3 pr-10 text-sm dark:border-neutral-700 dark:bg-neutral-800"
                  />
                  <button
                    type="button"
                    onClick={() => setPasswordVisible((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500"
                    aria-label={passwordVisible ? "Hide password" : "Show password"}
                  >
                    {passwordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </label>
              <label className="block text-sm font-medium">
                Confirm New Password
                <input
                  required
                  minLength={6}
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1.5 h-10 w-full rounded-lg border border-neutral-300 bg-white px-3 text-sm dark:border-neutral-700 dark:bg-neutral-800"
                />
              </label>
              <div className="flex justify-end gap-2 border-t pt-4 dark:border-neutral-800">
                <Button
                  type="button"
                  variant="outline"
                  disabled={updatingPassword}
                  onClick={() => setPasswordUser(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={updatingPassword}
                  className="bg-[#0446DB] text-white hover:bg-blue-800"
                >
                  {updatingPassword ? "Updating..." : "Update Password"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
