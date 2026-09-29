
import { useEffect, useState } from "react";
import axios from "axios";
import Loader from "../../Loader";
import {
    FaSearch,
    FaFilter,
    FaDownload,
    FaTimes,
    FaCopy,
    FaCreditCard,
    FaMoneyBillWave,
    FaExchangeAlt,
    FaWallet,
    FaReceipt
} from "react-icons/fa";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Drawer,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer";
import { Loader2 } from "lucide-react";


const baseURL = import.meta.env.VITE_BASE_URL;

function Transaction() {
    const [limit, setLimit] = useState(10);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [transactions, setTransactions] = useState([]);
    const [page, setPage] = useState(1);
    const [totalTransactions, setTotalTransactions] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [popup, setPopup] = useState(null);
    const [selectedBulkTransactions, setSelectedBulkTransactions] = useState([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [isDrawerFilterOpen, setIsDrawerFilterOpen] = useState(false);
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

    const openDatePicker = (event) => {
        try {
            event.currentTarget.showPicker?.();
        } catch {
            return;
        }
    };

    const updateAdvanceFilter = (field, value) => {
        setAdvanceFilters((prev) => {
            const next = {
                ...prev,
                [field]: value,
            };

            if (field === "startDate" && next.endDate && value && next.endDate < value) {
                next.endDate = value;
            }

            if (field === "endDate" && next.startDate && value && next.startDate > value) {
                next.startDate = value;
            }

            return next;
        });
    };

    const applyFilters = () => {
        if (
            advanceFilters.startDate &&
            advanceFilters.endDate &&
            advanceFilters.startDate > advanceFilters.endDate
        ) {
            toast.error("Start date cannot be after end date");
            return false;
        }

        setFilterUpdate((prev) => !prev);
        setPage(1);
        setIsFilterOpen(false);
        setIsDrawerFilterOpen(false);
        return true;
    };

    const fetchTransactions = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${baseURL}/api/merchant/getWalletHistory`, {
                params: {
                    start_date: advanceFilters.startDate,
                    end_date: advanceFilters.endDate,
                    txn_ref: advanceFilters.txn_ref,
                    txn_for: advanceFilters.txn_for,
                    type: advanceFilters.type,
                    page: page,
                    limit: limit
                },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

          
            setTransactions(res.data.data || []);
            setTotalTransactions(res.data.total || 0);
            setTotalPages(Math.max(1, res.data.totalPage || 1));
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

    const resetFilters = () => {
        resetAdvanceFilters();
        setFilterUpdate((prev) => !prev);
        setPage(1);
        setIsFilterOpen(false);
        setIsDrawerFilterOpen(false);
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
        
        try {
            const res = await axios.get(`${baseURL}/api/merchant/exportWalletHistory`, {
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
           loadingPage?(
            <div className=" w-full h-[90vh] flex justify-center items-center">
          <div>
            <Loader2 className="h-8 w-8 animate-spin mx-auto" />
            <p className="mt-2"> Loading Transaction History...</p>
          </div>
        </div>
           ):(
                <div className="min-h-screen ">
                    {/* Header Section */}
                    <div className="">
                        <div className="mx-auto  py-1">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                                <div className="text-center lg:text-left">
                                    <h1 className="text-2xl sm:text-3xl  font-bold dark:text-white mb-2">
                                        Transaction History
                                    </h1>
                                    <p className="dark:text-indigo-100 text-sm sm:text-base">
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
                                                    className="w-full pl-10 pr-20 py-1 rounded-sm border-0 focus:ring-2   bg-gray-300 text-[rgb(86,78,193) "
                                                />
                                                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[rgb(86,78,193)] w-4 h-4" />
                                                <div className="absolute right-1 top-1/2 transform -translate-y-1/2 flex gap-1">
                                                    {searchTerm && (
                                                        <Button
                                                            type="button"
                                                            onClick={clearSearch}
                                                            className="p-1 text-[#0446DB] bg-white hover:bg-opacity-30 p-2 rounded transition-all duration-200 backdrop-blur-sm"
                                                        >
                                                            <FaTimes className="w-3 h-3" />
                                                        </Button>
                                                    )}
                                                    
                                                </div>
                                            </div>
                                        </form>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2 w-full sm:w-auto">
                                        <Button
                                            onClick={exportCSV}
                                            className="flex items-center gap-2 bg-white text-[#0446DB] border border-gray-200  font-medium px-4 py-3 rounded-sm  transition-all duration-300 backdrop-blur-sm flex-1 sm:flex-none justify-center"
                                        >
                                            <FaDownload className="w-4 h-4" />
                                            <span className="hidden sm:inline">Export</span>
                                        </Button>

                                        <Drawer direction="right" open={isDrawerFilterOpen} onOpenChange={setIsDrawerFilterOpen}>
                                            <DrawerTrigger asChild>
                                                <Button

                                                    className="flex items-center gap-2 bg-white text-[#0446DB]  font-medium px-4 py-3 rounded-sm border border-gray-200 transition-all duration-300 backdrop-blur-sm flex-1 sm:flex-none justify-center"
                                                >
                                                    <FaFilter className="w-4 h-4" />
                                                    <span className="hidden sm:inline">Filters</span>
                                                </Button>

                                            </DrawerTrigger>

                                            <DrawerContent className="h-full max-h-screen">
                                                <div className="mx-auto w-full max-w-sm">
                                                    <DrawerHeader>
                                                        <DrawerTitle>Advanced Filters</DrawerTitle>
                                                    </DrawerHeader>
                                                    <div className="p-4 pb-0 space-y-6">
                                                        <form onSubmit={(e) => e.preventDefault()}>
                                                            {/* Date Range */}
                                                            <div>
                                                                <label className="block text-sm font-semibold text-gray-700 mb-3">
                                                                    Date Range
                                                                </label>
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-600 mb-2">
                                                                            Start Date
                                                                        </label>
                                                                        <input
                                                                            type="date"
                                                                            value={advanceFilters.startDate}
                                                                            max={advanceFilters.endDate || undefined}
                                                                            onClick={openDatePicker}
                                                                            onFocus={openDatePicker}
                                                                            onChange={(e) => updateAdvanceFilter("startDate", e.target.value)}
                                                                            className="w-full cursor-pointer border border-gray-300 bg-white px-4 py-3 rounded-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                                                                        />
                                                                    </div>

                                                                    <div>
                                                                        <label className="block text-sm font-medium text-gray-600 mb-2">
                                                                            End Date
                                                                        </label>
                                                                        <input
                                                                            type="date"
                                                                            value={advanceFilters.endDate}
                                                                            min={advanceFilters.startDate || undefined}
                                                                            onClick={openDatePicker}
                                                                            onFocus={openDatePicker}
                                                                            onChange={(e) => updateAdvanceFilter("endDate", e.target.value)}
                                                                            className="w-full cursor-pointer border border-gray-300 bg-white px-4 py-3 rounded-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
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
                                                                    className="w-full border border-gray-300 px-4 py-3 rounded-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                                                                />
                                                            </div>

                                                            {/* Transaction For */}
                                                            <div>
                                                                <label className="block text-sm font-semibold text-gray-700 mb-3 mt-4">
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
                                                                    className="w-full border border-gray-300 px-4 py-3 rounded-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                                                                />
                                                            </div>
                                                        </form>
                                                    </div>
                                                    <DrawerFooter>
                                                        <Button
                                                            onClick={applyFilters}
                                                            className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
                                                        >
                                                            Apply Filters
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            onClick={resetFilters}
                                                            className="w-full"
                                                        >
                                                            Reset Filters
                                                        </Button>
                                                    </DrawerFooter>
                                                </div>
                                            </DrawerContent>
                                        </Drawer>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    



                    {/* Main Content */}
                    <main className="mx-auto z-10">
                        {/* Transactions Table */}
                        <div className="bg-white rounded-sm overflow-hidden">


                            {/* Desktop Table View */}
                            <div className=" overflow-x-auto p-4">
                                <div className="rounded-md border">
                                    <Table>
                                        <TableHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
                                            <TableRow>
                                                <TableHead>Transaction</TableHead>
                                                <TableHead>Reference No</TableHead>
                                                <TableHead>Type</TableHead>
                                                <TableHead>Amount</TableHead>
                                                <TableHead>Closing Balance</TableHead>
                                                <TableHead>Remarks</TableHead>
                                                <TableHead>Date & Time</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody className="divide-y divide-gray-200">
                                            { loading ?(
                                                <>
                                                <TableRow>
                                                <TableCell colSpan={7} className="h-52 text-center">
                                                    <div className="flex flex-col items-center justify-center">
                                                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />

                                                    <p className="mt-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                                                        Loading Transaction History...
                                                    </p>
                                                    </div>
                                                </TableCell>
                                                </TableRow>
                                                </>
                                            ):  transactions.length > 0 ? (
                                                transactions.map((transaction, index) => (
                                                    <TableRow key={index} className="hover:bg-gray-50 transition-colors duration-200">
                                                        <TableCell>
                                                            <div className="flex items-center gap-3">
                                                                <div className="p-2 bg-gray-100 rounded-sm">
                                                                    {getTransactionIcon(transaction.type)}
                                                                </div>
                                                                <div>
                                                                    <p className="font-medium text-gray-900">
                                                                        {toCapitalizeEachWord(transaction.txn_for || 'Transaction')}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
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
                                                        </TableCell>
                                                        <TableCell>
                                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${transaction.type === 'credit'
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-red-100 text-red-800'
                                                                }`}>
                                                                {toCapitalizeEachWord(transaction.type)}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="whitespace-nowrap">
                                                            <span className={`font-bold ${getAmountColor(transaction.type)}`}>
                                                                {getAmountSymbol(transaction.type)}{formatCurrency(transaction.amount)}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="whitespace-nowrap font-medium text-gray-900">
                                                            {formatCurrency(transaction.balance_after)}
                                                        </TableCell>
                                                        <TableCell>
                                                            <p className="text-sm text-gray-600 max-w-xs truncate">
                                                                {transaction.remarks || 'No remarks'}
                                                            </p>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="text-sm text-gray-500">
                                                                <div>{new Date(transaction.created_at).toLocaleDateString('en-IN')}</div>
                                                                <div>{new Date(transaction.created_at).toLocaleTimeString('en-IN', {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}</div>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            ) : (
                                                <TableRow>
                                                    <TableCell colSpan={7} className="h-64 text-center">
                                                        <FaReceipt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                                        <p className="text-lg font-medium text-gray-500">No transactions found</p>
                                                        <p className="text-gray-400 mt-2">Try adjusting your filters or search terms</p>
                                                    </TableCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>


                            {/* Pagination */}
                            {transactions.length > 0 && (
                                <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        <p className="text-sm text-gray-700 text-center sm:text-left">
                                            Showing page {page} of {totalPages} • {totalTransactions} total transactions
                                        </p>
                                        <div className="flex items-center gap-2 justify-center">
                                            <Button
                                                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                                                disabled={page === 1}
                                                className={`px-4 py-2 rounded-sm font-medium transition-all duration-200 ${page === 1
                                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                    : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg"
                                                    }`}
                                            >
                                                Previous
                                            </Button>
                                            <span className="px-4 py-2 text-sm text-gray-700">
                                                Page {page} of {totalPages}
                                            </span>
                                            <Button
                                                onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                                                disabled={page === totalPages}
                                                className={`px-4 py-2 rounded-sm font-medium transition-all duration-200 ${page === totalPages
                                                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                    : "bg-[#0446DB] text-white hover:bg-indigo-700 shadow-md hover:shadow-lg"
                                                    }`}
                                            >
                                                Next
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </main>
                </div>

           )
            }
            
        </>
    );
}

export default Transaction;
