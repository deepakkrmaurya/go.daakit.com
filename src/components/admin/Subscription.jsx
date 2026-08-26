

import { rainbowSurgePalette } from '@mui/x-charts/colorPalettes';
import { useTheme } from '@mui/material/styles';
import { MdCurrencyRupee } from "react-icons/md";
import { Search, Plus, Trash2, X, Loader2 } from 'lucide-react';
import Loader from "../Loader";
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input";
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
const baseURL = import.meta.env.VITE_BASE_URL;

export default function Analytics() {
  const theme = useTheme();
  const palette = rainbowSurgePalette(theme.palette.mode);

  const [showModal, setShowModal] = useState(false);
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    plan_name: '',
    amount: '',
    validity: ''
  });

  const getAllSubscriptionPlans = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${baseURL}/api/admin/getAllSubscriptionPlans`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setSubscriptionPlans(res?.data?.data);
      setFilteredPlans(res?.data?.data);
    } catch (error) {
      toast.error('Failed to fetch subscription plans');
    } finally {
      setLoading(false);
    }
  };

  const deletePlan = async (planId) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) return;

    try {
      const res = await axios.delete(`${baseURL}/api/admin/deleteSubscriptionPlanById/${planId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success(res?.data?.message);
      getAllSubscriptionPlans();
    } catch (error) {
      toast.error('Failed to delete plan');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${baseURL}/api/admin/createSubscriptionPlan`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success(res?.data?.message);
      setShowModal(false);
      resetForm();
      getAllSubscriptionPlans();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create plan');
    }
  };

  const resetForm = () => {
    setFormData({
      plan_name: '',
      amount: '',
      validity: ''
    });
  };

  // Search functionality
  const handleSearch = (term) => {
    setSearchTerm(term);
    if (term.trim() === '') {
      setFilteredPlans(subscriptionPlans);
    } else {
      const filtered = subscriptionPlans.filter(plan =>
        plan.plan_name?.toLowerCase().includes(term.toLowerCase()) ||
        plan.amount?.toString().includes(term) ||
        plan.validity?.toString().toLowerCase().includes(term.toLowerCase())
      );
      setFilteredPlans(filtered);
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchTerm('');
    setFilteredPlans(subscriptionPlans);
  };

  useEffect(() => {
    getAllSubscriptionPlans();
  }, []);

  return (
    <>

      <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen w-full">
        {/* Header Section */}
        <div className="relative bg-[#0446DB] shadow-xl">
          <div className="relative z-10 mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              {/* Heading */}
              <div className="text-center lg:text-left">
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                  Subscription Plans
                </h1>
                <p className="text-indigo-100 text-lg">
                  Manage your subscription plans and pricing
                </p>
              </div>

              {/* Search and Add Button Container */}
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                {/* Search Bar */}
                <div className="relative flex-1 min-w-[250px]">
                  <div className="relative">
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <Input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                      placeholder="Search plans by name, price, or validity..."
                      className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors bg-white"
                    />
                    {searchTerm && (
                      <button
                        onClick={clearSearch}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                </div>

                {/* Add Plan Button */}
                <Button
                  onClick={() => setShowModal(true)}
                  className="bg-white hover:bg-gray-50 text-blue-600 px-6 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors shadow-md hover:shadow-lg whitespace-nowrap border border-blue-200"
                >
                  <Plus className="w-5 h-5" />
                  Add New Plan
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Cards Section */}
        <div className="mx-auto px-4  -mt-4 relative z-10">
          <div className="min-h-screen bg-gray-50 rounded-xl">
            <div className="mx-auto">


              {/* Data Table */}
              <div className="bg-white overflow-hidden">
                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                  </div>
                ) : filteredPlans?.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                      <Search className="w-16 h-16 mx-auto" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {searchTerm ? 'No plans found' : 'No subscription plans found'}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {searchTerm
                        ? `No plans found matching "${searchTerm}"`
                        : 'Get started by creating your first subscription plan'
                      }
                    </p>
                    {!searchTerm && (
                      <button
                        onClick={() => setShowModal(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium"
                      >
                        Create Plan
                      </button>
                    )}
                    {searchTerm && (
                      <button
                        onClick={clearSearch}
                        className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium"
                      >
                        Clear Search
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    {/* Table */}
                    <div className="overflow-x-auto">
                      <Table >
                        <TableHeader>
                          <TableRow>
                            <TableHead >
                              #id
                            </TableHead>
                            <TableHead >
                              Plan Name
                            </TableHead>
                            <TableHead >
                              Price
                            </TableHead>
                            <TableHead >
                              Validity
                            </TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody >

                          {loading ? (
                            <TableRow>
                              <TableCell colSpan={10} className="text-center py-10">
                                <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                                <p className="mt-2">Loading...</p>
                              </TableCell>
                            </TableRow>
                          ) : filteredPlans.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={10} className="text-center py-10">
                                No orders found
                              </TableCell>
                            </TableRow>
                          ) : (
                            filteredPlans?.map((plan, key) => (
                              <TableRow
                                key={plan.id}
                                className="hover:bg-gray-50 transition-colors group"
                              >
                                <TableCell className="">
                                  <div className="flex items-center gap-3">
                                    <div>
                                      <div className="font-semibold text-gray-900">{key + 1}</div>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="">
                                  <div className="flex items-center gap-3">

                                    <div>
                                      <div className=" text-gray-900">{plan.plan_name}</div>
                                    </div>
                                  </div>
                                </TableCell>
                                <TableCell className="">
                                  <div className="flex items-baseline gap-1">
                                    <span className=" flex items-center">
                                      <MdCurrencyRupee className="mr-1" />
                                      {plan.amount}
                                    </span>
                                  </div>
                                </TableCell>
                                <TableCell className="">
                                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                                    {plan.validity} days
                                  </span>
                                </TableCell>
                                <TableCell className="">
                                  <div className="flex gap-2">
                                    <Button
                                      onClick={() => deletePlan(plan?.id)}
                                      className="p-2 flex items-center bg-white gap-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-200 hover:border-red-300"
                                      title="Delete plan"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                      Delete
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          )
                          }

                        </TableBody>
                      </Table>
                    </div>

                    {/* Table Footer */}
                    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-600">
                        <div className="mb-2 sm:mb-0">
                          Showing <span className="font-semibold">{filteredPlans?.length}</span> of{' '}
                          <span className="font-semibold">{subscriptionPlans?.length}</span> plans
                          {searchTerm && (
                            <span className="ml-2 text-blue-600">
                              (filtered by "{searchTerm}")
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Add Plan Modal */}
              {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4  bg-opacity-50">
                  <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                    {/* Modal Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                      <h2 className="text-xl font-bold text-gray-900">Create New Plan</h2>
                      <button
                        onClick={() => {
                          setShowModal(false);
                          resetForm();
                        }}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>

                    {/* Modal Content */}
                    <form onSubmit={handleSubmit} className="p-6">
                      <div className="space-y-4">
                        {/* Plan Name */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Plan Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={formData.plan_name}
                            onChange={(e) => setFormData({ ...formData, plan_name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                            placeholder="e.g., Basic, Professional"
                          />
                        </div>

                        {/* Price */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Price (₹) *
                          </label>
                          <input
                            type="number"
                            required
                            min="0"
                            step="0.01"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                            placeholder="0.00"
                          />
                        </div>

                        {/* Validity */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Validity (in days) *
                          </label>
                          <input
                            type="number"
                            required
                            min="1"
                            value={formData.validity}
                            onChange={(e) => setFormData({ ...formData, validity: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                            placeholder="e.g., 30, 365"
                          />
                        </div>
                      </div>

                      {/* Modal Footer */}
                      <div className="flex gap-3 pt-6 mt-6 border-t border-gray-200">
                        <button
                          type="button"
                          onClick={() => {
                            setShowModal(false);
                            resetForm();
                          }}
                          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                        >
                          Create Plan
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </>
  );
}
