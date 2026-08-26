
import "../../../styles/blink.css";
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../../Loader";
import {
    FaSearch,
    FaFilter,
    FaDownload,
    FaTimes,
    FaCopy,
    FaCheck,
    FaBox,
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaWeightHanging,
    FaRulerCombined,
    FaShippingFast,
    FaCreditCard,
    FaMoneyBillWave,
    FaExchangeAlt,
    FaWallet,
    FaHistory,
    FaReceipt
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { toast } from "react-toastify";

const baseURL = import.meta.env.VITE_BASE_URL;

function TechbasedTransaction() {
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [transactions, setTransactions] = useState([]);
    const [page, setPage] = useState(1);
    const [totalTransactions, setTotalTransactions] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [popup, setPopup] = useState(null);
    const [selectedBulkTransactions, setSelectedBulkTransactions] = useState([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterUpdate, setFilterUpdate] = useState(false);

    const [advanceFilters, setAdvanceFilters] = useState({
        startDate: "",
        endDate: "",
        txn_ref: "",
        txn_for: "",
        type: ""
    });

    const transactionTypes = [
        { value: "", label: "All Types" },
        { value: "credit", label: "Credit" },
        { value: "debit", label: "Debit" }
    ];

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${baseURL}/api/techbasedmerchant/getWalletHistory`, {
                params: {
                    start_date: advanceFilters.startDate,
                    end_date: advanceFilters.endDate,
                    txn_ref: advanceFilters.txn_ref,
                    txn_for: advanceFilters.txn_for,
                    type: advanceFilters.type,
                    page: page,
                    limit: 10
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            setTransactions(res.data.data || []);
            setTotalTransactions(res.data.total || 0);
            setTotalPages(Math.max(1, res.data.totalPages || 1));
        } catch (err) {
            toast.error(
                err.response?.data?.message ||
                err.message ||
                "An error occurred while fetching transactions."
            );
        } finally {
            setLoading(false);
        }
    };

    const toCapitalizeEachWord = (str) => {
        if (!str) return "";
        return str
            .split(" ")
            .map((word) => {
                if (!word) return "";
                return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            })
            .join(" ");
    };

    const getTransactionIcon = (type) => {
        switch (type) {
            case 'credit':
                return <FaMoneyBillWave className="text-green-500" />;
            case 'debit':
                return <FaCreditCard className="text-red-500" />;
            default:
                return <FaExchangeAlt className="text-blue-500" />;
        }
    };

    const getAmountColor = (type) => {
        return type === 'credit' ? 'text-green-600' : 'text-red-600';
    };

    const getAmountSymbol = (type) => {
        return type === 'credit' ? '+' : '-';
    };

    const resetAdvanceFilters = async () => {
        const today = new Date();
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        setAdvanceFilters({
            endDate: today.toISOString().split("T")[0],
            startDate: oneMonthAgo.toISOString().split("T")[0],
            txn_ref: "",
            txn_for: "",
            type: ""
        });
    };

    const handleSearch = () => {
        if (searchTerm) {
            setAdvanceFilters({ ...advanceFilters, txn_ref: searchTerm });
        }
        setFilterUpdate(prev => !prev);
        setPage(1);
    };

    const clearSearch = () => {
        setSearchTerm("");
        setAdvanceFilters({ ...advanceFilters, txn_ref: "" });
        setFilterUpdate(prev => !prev);
        setPage(1);
    };

    const exportCSV = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${baseURL}/api/techbasedmerchant/exportWalletHistory`, {
                params: {
                    start_date: advanceFilters.startDate,
                    end_date: advanceFilters.endDate,
                    txn_ref: advanceFilters.txn_ref,
                    txn_for: advanceFilters.txn_for,
                    type: advanceFilters.type,
                },
                responseType: "blob",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `transactions_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success("Transactions exported successfully");
        } catch (err) {
            toast.error(err.response?.data?.message || err.message || "Failed to export transactions");
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(amount || 0);
    };

    useEffect(() => {
        resetAdvanceFilters();
    }, []);

    useEffect(() => {
        fetchTransactions();
        setSelectedBulkTransactions([]);
    }, [page, filterUpdate]);

    return (
        <>
            {!loading ? (
                <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                    {/* Header Section */}
                    <div className="bg-[#0446DB] shadow-xl">
                        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                                <div className="text-center lg:text-left">
                                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                                        Transaction History
                                    </h1>
                                    <p className="text-indigo-100 text-sm sm:text-base">
                                        Track and manage all your financial transactions
                                    </p>
                                </div>

                                <div className="flex flex-col sm:flex-row gap-3 items-center">
                                    {/* Search Bar */}
                                    <div className="relative w-full sm:w-80">
                                        <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    placeholder="Search by reference number..."
                                                    value={searchTerm}
                                                    onChange={(e) => setSearchTerm(e.target.value)}
                                                    className="w-full pl-10 pr-20 py-3 rounded-xl border-0 focus:ring-2   bg-white text-[#0446DB "
                                                />
                                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0446DB] w-4 h-4" />
                                                <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex gap-1">
                                                    {searchTerm && (
                                                        <button
                                                            type="button"
                                                            onClick={clearSearch}
                                                            className="p-1 bg-[#0446DB]"
                                                        >
                                                            <FaTimes className="w-3 h-3" />
                                                        </button>
                                                    )}
                                                    <button
                                                        type="submit"
                                                        className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-lg transition-all duration-200 backdrop-blur-sm"
                                                    >
                                                        <FaSearch className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2 w-full sm:w-auto">
                                        <button
                                            onClick={exportCSV}
                                            className="flex items-center gap-2 bg-white text-[#0446DB] bg-opacity-20 hover:bg-opacity-30  font-medium px-4 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm flex-1 sm:flex-none justify-center"
                                        >
                                            <FaDownload className="w-4 h-4" />
                                            <span className="hidden sm:inline">Export</span>
                                        </button>

                                        <Drawer direction="right">
                                            <DrawerTrigger asChild>

                                                <Button variant="outline"
                                                    className="flex items-center gap-2 bg-white text-[#0446DB] font-medium px-4 py-3 rounded-xl shadow-md hover:shadow-lg hover:bg-indigo-50 transition-all duration-300"
                                                >
                                                    <FaFilter className="text-sm" />
                                                    <span>Filter</span>
                                                </Button>
                                            </DrawerTrigger>
                                            <DrawerContent>
                                                <DrawerHeader>
                                                    <DrawerTitle>Filter</DrawerTitle>
                                                    {/* <DrawerDescription>Set your daily activity goal.</DrawerDescription> */}
                                                </DrawerHeader>

                                                <div>


                                                    <div className="p-6 h-[calc(100vh-80px)] overflow-y-auto">
                                                        <div className="space-y-6">
                                                            {/* Date Range */}
                                                            <div>
                                                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                                                    Date Range
                                                                </label>
                                                                <div className="grid grid-cols-1 gap-3">
                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-600 mb-2">
                                                                            Start Date
                                                                        </label>
                                                                        <input
                                                                            type="date"
                                                                            value={advanceFilters.startDate}
                                                                            onChange={(e) =>
                                                                                setAdvanceFilters((prev) => ({
                                                                                    ...prev,
                                                                                    startDate: e.target.value,
                                                                                }))
                                                                            }
                                                                            className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                                                                        />
                                                                    </div>

                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-600 mb-2">
                                                                            End Date
                                                                        </label>
                                                                        <input
                                                                            type="date"
                                                                            value={advanceFilters.endDate}
                                                                            onChange={(e) =>
                                                                                setAdvanceFilters((prev) => ({
                                                                                    ...prev,
                                                                                    endDate: e.target.value,
                                                                                }))
                                                                            }
                                                                            className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>



                                                            {/* Reference Number */}
                                                            <div>
                                                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                                                    Reference Number
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={advanceFilters.txn_ref}
                                                                    onChange={(e) =>
                                                                        setAdvanceFilters((prev) => ({
                                                                            ...prev,
                                                                            txn_ref: e.target.value,
                                                                        }))
                                                                    }
                                                                    placeholder="Enter reference number"
                                                                    className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                                                                />
                                                            </div>

                                                            {/* Transaction For */}
                                                            <div>
                                                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                                                    Transaction For
                                                                </label>
                                                                <input
                                                                    type="text"
                                                                    value={advanceFilters.txn_for}
                                                                    onChange={(e) =>
                                                                        setAdvanceFilters((prev) => ({
                                                                            ...prev,
                                                                            txn_for: e.target.value,
                                                                        }))
                                                                    }
                                                                    placeholder="Enter transaction purpose"
                                                                    className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                                                                />
                                                            </div>
                                                        </div>

                                                        {/* Action Buttons */}
                                                        <div className="flex flex-col gap-3 mt-8 pt-6 border-t border-gray-200">
                                                            <Button
                                                                onClick={() => {
                                                                    setFilterUpdate((prev) => !prev);
                                                                    
                                                                    setPage(1);
                                                                }}
                                                                className="w-full bg-indigo-600 text-white px-6 py-4 rounded-xl hover:bg-indigo-700 transition-colors duration-200 font-semibold shadow-lg hover:shadow-xl"
                                                            >
                                                                Apply Filters
                                                            </Button>
                                                            <Button
                                                                onClick={() => {
                                                                    resetAdvanceFilters();
                                                                    setFilterUpdate((prev) => !prev);
                                                            
                                                                    setPage(1);
                                                                }}
                                                                className="w-full bg-gray-500 text-white px-6 py-4 rounded-xl hover:bg-gray-600 transition-colors duration-200 font-semibold shadow-lg hover:shadow-xl"
                                                            >
                                                                Reset Filters
                                                            </Button>
                                                        </div>
                                                    </div>

                                                </div>
                                                <DrawerFooter>
                                                    <DrawerClose asChild>
                                                        <Button variant="outline">Cancel</Button>
                                                    </DrawerClose>
                                                </DrawerFooter>
                                            </DrawerContent>
                                        </Drawer>

                                        {/* <button
                                            onClick={() => setIsFilterOpen(true)}
                                            className="flex items-center gap-2 bg-white text-[#0446DB] bg-opacity-20 hover:bg-opacity-30  font-medium px-4 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm flex-1 sm:flex-none justify-center"
                                        >
                                            <FaFilter className="w-4 h-4" />
                                            <span className="hidden sm:inline">Filters</span>
                                        </button> */}

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>



                    {/* Filters Sidebar */}
                    <div
                        className={`fixed inset-0 z-50 transform transition-all duration-300 ease-in-out ${isFilterOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                            }`}
                    >
                        <div
                            className={`absolute inset-0  bg-opacity-50 backdrop-blur-sm transition-opacity duration-300 ${isFilterOpen ? "opacity-100" : "opacity-0"
                                }`}
                            onClick={() => setIsFilterOpen(false)}
                        />

                        <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ${isFilterOpen ? "translate-x-0" : "translate-x-full"
                            }`}>
                            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                                    <FaFilter className="text-indigo-600 w-5 h-5" />
                                    Advanced Filters
                                </h2>
                                <button
                                    onClick={() => setIsFilterOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-100"
                                >
                                    <FaTimes className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-6 h-[calc(100vh-80px)] overflow-y-auto">
                                <div className="space-y-6">
                                    {/* Date Range */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            Date Range
                                        </label>
                                        <div className="grid grid-cols-1 gap-3">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-600 mb-2">
                                                    Start Date
                                                </label>
                                                <input
                                                    type="date"
                                                    value={advanceFilters.startDate}
                                                    onChange={(e) =>
                                                        setAdvanceFilters((prev) => ({
                                                            ...prev,
                                                            startDate: e.target.value,
                                                        }))
                                                    }
                                                    className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-600 mb-2">
                                                    End Date
                                                </label>
                                                <input
                                                    type="date"
                                                    value={advanceFilters.endDate}
                                                    onChange={(e) =>
                                                        setAdvanceFilters((prev) => ({
                                                            ...prev,
                                                            endDate: e.target.value,
                                                        }))
                                                    }
                                                    className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Transaction Type */}
                                    {/* <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            Transaction Type
                                        </label>
                                        <select
                                            value={advanceFilters.type}
                                            onChange={(e) =>
                                                setAdvanceFilters((prev) => ({
                                                    ...prev,
                                                    type: e.target.value,
                                                }))
                                            }
                                            className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                                        >
                                            {transactionTypes.map((type) => (
                                                <option key={type.value} value={type.value}>
                                                    {type.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div> */}

                                    {/* Reference Number */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            Reference Number
                                        </label>
                                        <input
                                            type="text"
                                            value={advanceFilters.txn_ref}
                                            onChange={(e) =>
                                                setAdvanceFilters((prev) => ({
                                                    ...prev,
                                                    txn_ref: e.target.value,
                                                }))
                                            }
                                            placeholder="Enter reference number"
                                            className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                                        />
                                    </div>

                                    {/* Transaction For */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-3">
                                            Transaction For
                                        </label>
                                        <input
                                            type="text"
                                            value={advanceFilters.txn_for}
                                            onChange={(e) =>
                                                setAdvanceFilters((prev) => ({
                                                    ...prev,
                                                    txn_for: e.target.value,
                                                }))
                                            }
                                            placeholder="Enter transaction purpose"
                                            className="w-full border border-gray-300 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                                        />
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-col gap-3 mt-8 pt-6 border-t border-gray-200">
                                    <button
                                        onClick={() => {
                                            setFilterUpdate((prev) => !prev);
                                            setIsFilterOpen(false);
                                            setPage(1);
                                        }}
                                        className="w-full bg-indigo-600 text-white px-6 py-4 rounded-xl hover:bg-indigo-700 transition-colors duration-200 font-semibold shadow-lg hover:shadow-xl"
                                    >
                                        Apply Filters
                                    </button>
                                    <button
                                        onClick={() => {
                                            resetAdvanceFilters();
                                            setFilterUpdate((prev) => !prev);
                                            setIsFilterOpen(false);
                                            setPage(1);
                                        }}
                                        className="w-full bg-gray-500 text-white px-6 py-4 rounded-xl hover:bg-gray-600 transition-colors duration-200 font-semibold shadow-lg hover:shadow-xl"
                                    >
                                        Reset Filters
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <main className="mx-auto px-4 sm:px-6 lg:px-8 -mt-4 relative z-10">
                        {/* Transactions Table */}
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                            {/* Mobile Cards View */}
                            <div className="lg:hidden">
                                {loading ? (
                                    <div className="flex justify-center items-center py-16">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                                    </div>
                                ) : transactions.length > 0 ? (
                                    <div className="divide-y divide-gray-100">
                                        {transactions.map((transaction, index) => (
                                            <div key={index} className="p-4 hover:bg-gray-50 transition-colors duration-200">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-gray-100 rounded-lg">
                                                            {getTransactionIcon(transaction.type)}
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-gray-900">
                                                                {toCapitalizeEachWord(transaction.txn_for || 'Transaction')}
                                                            </p>
                                                            <p className="text-sm text-gray-500">
                                                                {new Date(transaction.created_at).toLocaleDateString('en-IN', {
                                                                    day: '2-digit',
                                                                    month: 'short',
                                                                    year: 'numeric'
                                                                })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className={`text-right ${getAmountColor(transaction.type)}`}>
                                                        <p className="font-bold">
                                                            {getAmountSymbol(transaction.type)}{formatCurrency(transaction.amount)}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {toCapitalizeEachWord(transaction.type)}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <p className="text-gray-500">Reference</p>
                                                        <p className="font-medium truncate">{transaction.txn_ref || 'N/A'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-500">Closing Balance</p>
                                                        <p className="font-medium">{formatCurrency(transaction.balance_after)}</p>
                                                    </div>
                                                </div>

                                                {transaction.remarks && (
                                                    <div className="mt-3">
                                                        <p className="text-gray-500 text-sm">Remarks</p>
                                                        <p className="text-sm text-gray-700 mt-1">{transaction.remarks}</p>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-16">
                                        <FaReceipt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                        <p className="text-lg font-medium text-gray-500">No transactions found</p>
                                        <p className="text-gray-400 mt-2">Try adjusting your filters or search terms</p>
                                    </div>
                                )}
                            </div>

                            {/* Desktop Table View */}
                            <div className="hidden lg:block overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Transaction
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Reference No
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Type
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Amount
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Closing Balance
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Remarks
                                            </th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                                Date & Time
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {transactions.length > 0 ? (
                                            transactions.map((transaction, index) => (
                                                <tr key={index} className="hover:bg-gray-50 transition-colors duration-200">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className="p-2 bg-gray-100 rounded-lg">
                                                                {getTransactionIcon(transaction.type)}
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-gray-900">
                                                                    {toCapitalizeEachWord(transaction.txn_for || 'Transaction')}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-mono text-sm text-gray-600">
                                                                {transaction.txn_ref || 'N/A'}
                                                            </span>
                                                            {transaction.txn_ref && (
                                                                <button
                                                                    onClick={() => {
                                                                        navigator.clipboard.writeText(transaction.txn_ref);
                                                                        toast.success('Reference copied!');
                                                                    }}
                                                                    className="text-gray-400 hover:text-indigo-600 transition-colors"
                                                                >
                                                                    <FaCopy className="w-3 h-3" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${transaction.type === 'credit'
                                                            ? 'bg-green-100 text-green-800'
                                                            : 'bg-red-100 text-red-800'
                                                            }`}>
                                                            {toCapitalizeEachWord(transaction.type)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`font-bold ${getAmountColor(transaction.type)}`}>
                                                            {getAmountSymbol(transaction.type)}{formatCurrency(transaction.amount)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 font-medium text-gray-900">
                                                        {formatCurrency(transaction.balance_after)}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <p className="text-sm text-gray-600 max-w-xs truncate">
                                                            {transaction.remarks || 'No remarks'}
                                                        </p>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="text-sm text-gray-500">
                                                            <div>{new Date(transaction.created_at).toLocaleDateString('en-IN')}</div>
                                                            <div>{new Date(transaction.created_at).toLocaleTimeString('en-IN', {
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}</div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="px-6 py-16 text-center">
                                                    <FaReceipt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                                    <p className="text-lg font-medium text-gray-500">No transactions found</p>
                                                    <p className="text-gray-400 mt-2">Try adjusting your filters or search terms</p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {transactions.length > 0 && (
                                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        <p className="text-sm text-gray-700 text-center sm:text-left">
                                            Showing page {page} of {totalPages} • {totalTransactions} total transactions
                                        </p>
                                        <div className="flex items-center gap-2 justify-center">
                                            <button
                                                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                                                disabled={page === 1}
                                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${page === 1
                                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                    : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg"
                                                    }`}
                                            >
                                                Previous
                                            </button>
                                            <span className="px-4 py-2 text-sm text-gray-700">
                                                Page {page} of {totalPages}
                                            </span>
                                            <button
                                                onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                                                disabled={page === totalPages}
                                                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${page === totalPages
                                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                    : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg"
                                                    }`}
                                            >
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </main>
                </div>
            ) : (
                <Loader />
            )}
        </>
    );
}

export default TechbasedTransaction;