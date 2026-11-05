

import { useEffect, useMemo, useState } from "react";

import axios from "axios";

import Select from "react-select";

import { toast } from "react-toastify";

import {Link} from 'react-router-dom'

import {

  Building2,

  Search,

  MapPin,

  Mail,

  Phone,

  User,

  Eye,

  X,

  Hash,

  ChevronLeft,

  ChevronRight,

  RefreshCw,

  Plus,

  CircleCheck,

  CircleX,

  MapPinned,

  CalendarDays,



} from "lucide-react";



/* =========================================================*

   API
========================================================= */



const baseURL = import.meta.env.VITE_BASE_URL;



const DC_LIST_API = `${String(baseURL || "").replace(

  /\/$/,

  ""

)}/api/dc/list`;



/* =========================================================*

   STATUS OPTIONS
========================================================= */



const statusOptions = [

  {

    value: "all",

    label: "All Status",

  },

  {

    value: "active",

    label: "Active",

  },

  {

    value: "inactive",

    label: "Inactive",

  },

];



/* =========================================================*

   COMPONENT
========================================================= */



function DistributionCenterListing() {

  const [dcList, setDcList] = useState([]);



  const [loading, setLoading] = useState(true);



  const [search, setSearch] = useState("");



  const [statusFilter, setStatusFilter] = useState(

    statusOptions[0]

  );



  const [selectedDC, setSelectedDC] = useState(null);



  const [viewModalOpen, setViewModalOpen] =

    useState(false);



  const [currentPage, setCurrentPage] = useState(1);



  const [pageSize] = useState(10);



  const [isDarkMode, setIsDarkMode] = useState(() =>

    document.documentElement.classList.contains("dark")

  );



  /* =========================================================*

     DARK MODE WATCHER
  ========================================================= */
  useEffect(() => {

    const observer = new MutationObserver(() => {

      setIsDarkMode(

        document.documentElement.classList.contains("dark")

      );

    });



    observer.observe(document.documentElement, {

      attributes: true,

      attributeFilter: ["class"],

    });



    return () => observer.disconnect();

  }, []);



  /* =========================================================*

     GET DC LIST API
     Backend:
     router.get("/list", verifyRoleAccess(), listDcs);
     Final:
     GET /api/dc/list
  ========================================================= */
  const fetchDCs = async () => {

    try {

      setLoading(true);



      const token =

        localStorage.getItem("merchantToken") ||

        localStorage.getItem("token");



      const response = await axios.get(DC_LIST_API, {

        headers: {

          "Content-Type": "application/json",



          ...(token

            ? {

                Authorization: `Bearer ${token}`,

                "x-auth-token": token,

              }

            : {}),

        },

      });



     



      if (response?.data?.success === false) {

        setDcList([]);



        toast.error(

          response?.data?.message ||

            "Failed to fetch Distribution Centers"

        );



        return;

      }



      /*

       * Different common response structures handle kar raha hai:
*       \

       * 1.
       * {
       *   success: true,
       *   data: [...]
       * }
*       \

       * 2.
       * {
       *   success: true,
       *   data: {
       *      dcs: [...]
       *   }
       * }
*       \

       * 3.
       * {
       *   success: true,
       *   dcs: [...]
       * }
       */
      let list = [];



      if (Array.isArray(response?.data?.data)) {

        list = response.data.data;

      } else if (

        Array.isArray(response?.data?.data?.dcs)

      ) {

        list = response.data.data.dcs;

      } else if (Array.isArray(response?.data?.dcs)) {

        list = response.data.dcs;

      }



      setDcList(list);

    } catch (error) {

      console.error(

        "DC List API Error:",

        error?.response?.data || error

      );



      setDcList([]);



      toast.error(

        error?.response?.data?.message ||

          error?.response?.data?.error ||

          error?.message ||

          "Failed to fetch Distribution Centers"

      );

    } finally {

      setLoading(false);

    }

  };



  /* =========================================================*

     INITIAL FETCH
  ========================================================= */
  useEffect(() => {

    fetchDCs();

  }, []);



  /* =========================================================*

     ACTIVE COUNT
  ========================================================= */
  const activeCount = useMemo(() => {

    return dcList.filter(

      (item) => Number(item.status) === 1

    ).length;

  }, [dcList]);



  /* =========================================================*

     INACTIVE COUNT
  ========================================================= */
  const inactiveCount = useMemo(() => {

    return dcList.filter(

      (item) => Number(item.status) === 0

    ).length;

  }, [dcList]);



  /* =========================================================*

     FILTER DATA
  ========================================================= */
  const filteredDCs = useMemo(() => {

    let data = [...dcList];



    /* SEARCH */



    const query = search.trim().toLowerCase();



    if (query) {

      data = data.filter((item) => {

        const searchableValues = [

          item.dc_name,

          item.dc_code,

          item.username,

          item.email,

          item.phone,

          item.address,

          item.city,

          item.state,

          item.pincode,

        ];



        return searchableValues.some((value) =>

          String(value || "")

            .toLowerCase()

            .includes(query)

        );

      });

    }



    /* STATUS */



    if (statusFilter?.value === "active") {

      data = data.filter(

        (item) => Number(item.status) === 1

      );

    }



    if (statusFilter?.value === "inactive") {

      data = data.filter(

        (item) => Number(item.status) === 0

      );

    }



    return data;

  }, [dcList, search, statusFilter]);



  /* =========================================================*

     RESET PAGE AFTER FILTER
  ========================================================= */
  useEffect(() => {

    setCurrentPage(1);

  }, [search, statusFilter]);



  /* =========================================================*

     PAGINATION
  ========================================================= */
  const totalItems = filteredDCs.length;



  const totalPages = Math.max(

    1,

    Math.ceil(totalItems / pageSize)

  );



  useEffect(() => {

    if (currentPage > totalPages) {

      setCurrentPage(totalPages);

    }

  }, [currentPage, totalPages]);



  const paginatedDCs = useMemo(() => {

    const start = (currentPage - 1) * pageSize;



    const end = start + pageSize;



    return filteredDCs.slice(start, end);

  }, [filteredDCs, currentPage, pageSize]);



  const showingFrom =

    totalItems === 0

      ? 0

      : (currentPage - 1) * pageSize + 1;



  const showingTo = Math.min(

    currentPage * pageSize,

    totalItems

  );



  /* =========================================================*

     VIEW DC
  ========================================================= */
  const handleView = (item) => {

    setSelectedDC(item);



    setViewModalOpen(true);

  };



  const closeViewModal = () => {

    setViewModalOpen(false);



    setSelectedDC(null);

  };



  /* =========================================================*

     FORMAT DATE
  ========================================================= */
  const formatDate = (date) => {

    if (!date) {

      return "—";

    }



    const parsedDate = new Date(date);



    if (Number.isNaN(parsedDate.getTime())) {

      return "—";

    }



    return parsedDate.toLocaleDateString("en-IN", {

      day: "2-digit",

      month: "short",

      year: "numeric",

    });

  };



  /* =========================================================*

     SELECT STYLES
  ========================================================= */
  const selectStyles = {

    control: (base, state) => ({

      ...base,



      minHeight: "42px",



      borderRadius: "8px",



      backgroundColor: isDarkMode

        ? "#171717"

        : "#ffffff",



      borderColor: state.isFocused

        ? "#0446DB"

        : isDarkMode

          ? "#404040"

          : "#d1d5db",



      boxShadow: state.isFocused

        ? "0 0 0 2px rgba(4,70,219,0.10)"

        : "none",



      "&:hover": {

        borderColor: state.isFocused

          ? "#0446DB"

          : isDarkMode

            ? "#525252"

            : "#9ca3af",

      },

    }),



    singleValue: (base) => ({

      ...base,



      color: isDarkMode ? "#f5f5f5" : "#111827",

    }),



    input: (base) => ({

      ...base,



      color: isDarkMode ? "#f5f5f5" : "#111827",

    }),



    placeholder: (base) => ({

      ...base,



      color: isDarkMode ? "#737373" : "#9ca3af",

    }),



    dropdownIndicator: (base) => ({

      ...base,



      color: isDarkMode ? "#a3a3a3" : "#6b7280",

    }),



    indicatorSeparator: (base) => ({

      ...base,



      backgroundColor: isDarkMode

        ? "#404040"

        : "#e5e7eb",

    }),



    menu: (base) => ({

      ...base,



      zIndex: 999,



      backgroundColor: isDarkMode

        ? "#171717"

        : "#ffffff",



      border: `1px solid ${

        isDarkMode ? "#404040" : "#e5e7eb"

      }`,

    }),



    option: (base, state) => ({

      ...base,



      cursor: "pointer",



      color: state.isSelected

        ? "#ffffff"

        : isDarkMode

          ? "#e5e5e5"

          : "#111827",



      backgroundColor: state.isSelected

        ? "#0446DB"

        : state.isFocused

          ? isDarkMode

            ? "#262626"

            : "#eff6ff"

          : isDarkMode

            ? "#171717"

            : "#ffffff",

    }),

  };



  /* =========================================================*

     UI
  ========================================================= */
  return (

    <div className="flex h-[calc(100dvh-100px)] min-h-[420px] flex-col overflow-hidden bg-gray-50/40 text-gray-900 dark:bg-neutral-950 dark:text-neutral-100">

      {/* =====================================================*

          HEADER
*      ===================================================== */}



      <div className="z-20 shrink-0 border-b border-gray-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900 md:px-6">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#0446DB] dark:bg-blue-950/30 dark:text-blue-400">

              <Building2 className="h-5 w-5" />

            </div>



            <div>

              <h1 className="text-xl font-bold text-gray-800 dark:text-white md:text-2xl">

                Distribution Centers

              </h1>



              <p className="mt-0.5 text-sm text-gray-500 dark:text-neutral-400">

                View and manage all Distribution Centers.

              </p>

            </div>

          </div>



          {/* ADD DC */}

          <Link

           to={'/admin/onboarding/distribution-center'}

          >



          <button

            type="button"



            className="flex h-10 items-center justify-center gap-2 rounded-lg bg-[#0446DB] px-4 text-sm font-semibold text-white transition hover:bg-[#0339b5]"

          >

            <Plus className="h-4 w-4" />



            Add Distribution Center

          </button>

          </Link>



        </div>

      </div>



      {/* =====================================================*

          CONTENT
*      ===================================================== */}



      <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-3 md:p-4">

        {/* ===================================================*

            TABLE CARD
*        =================================================== */}



        <div className="flex min-h-0 flex-1 flex-col overflow-hidden border border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">

          {/* =================================================*

              FILTERS
*          ================================================= */}



          <div className="z-10 flex shrink-0 flex-col gap-3 border-b border-gray-200 bg-white p-3 dark:border-neutral-800 dark:bg-neutral-900 lg:flex-row lg:items-center lg:justify-between">

            {/* SEARCH */}



            <div className="relative w-full lg:max-w-md">

              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />



              <input

                type="text"

                value={search}

                onChange={(e) => setSearch(e.target.value)}

                placeholder="Search name, code, city, email..."

                className="h-[42px] w-full rounded-lg border border-gray-300 bg-white pl-10 pr-9 text-sm outline-none transition placeholder:text-gray-400 focus:border-[#0446DB] focus:ring-2 focus:ring-blue-500/10 dark:border-neutral-700 dark:bg-neutral-950 dark:text-white"

              />



              {search && (

                <button

                  type="button"

                  onClick={() => setSearch("")}

                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 dark:hover:text-white"

                >

                  <X className="h-4 w-4" />

                </button>

              )}

            </div>



            {/* FILTER RIGHT */}



            <div className="flex items-center gap-3">

              <div className="w-full z-50 min-w-[180px] sm:w-[180px]">

                <Select

                  options={statusOptions}

                  value={statusFilter}

                  onChange={(option) =>

                    setStatusFilter(

                      option || statusOptions[0]

                    )

                  }

                  isSearchable={false}

                  styles={selectStyles}

                />

              </div>



              {/* REFRESH */}



              <button

                type="button"

                onClick={fetchDCs}

                disabled={loading}

                className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-lg border border-gray-300 bg-white text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-300 dark:hover:bg-neutral-800"

                title="Refresh"

              >

                <RefreshCw

                  className={`h-4 w-4 ${

                    loading ? "animate-spin" : ""

                  }`}

                />

              </button>

            </div>

          </div>



          {/* =================================================*

              LOADING
*          ================================================= */}



          {loading ? (

            <div className="flex min-h-0 flex-1 items-center justify-center overflow-auto">

              <div className="flex flex-col items-center gap-3">

                <RefreshCw className="h-7 w-7 animate-spin text-[#0446DB]" />



                <p className="text-sm font-medium text-gray-500 dark:text-neutral-400">

                  Loading Distribution Centers...

                </p>

              </div>

            </div>

          ) : (

            <>

              {/* =============================================*

                  TABLE
*              ============================================= */}



              <div className="min-h-0 flex-1 overflow-auto overscroll-contain">

                <table className="w-full min-w-[1150px]">

                  <thead className="sticky top-0  bg-gray-50 shadow-[0_1px_0_0_#e5e7eb] dark:bg-neutral-800">

                    <tr className="border-b border-gray-200 dark:border-neutral-800">

                      <TableHeading>

                        Distribution Center

                      </TableHeading>



                      <TableHeading>

                        Code

                      </TableHeading>



                      <TableHeading>

                        Username

                      </TableHeading>



                      <TableHeading>

                        Contact

                      </TableHeading>



                      <TableHeading>

                        Location

                      </TableHeading>



                      <TableHeading>

                        Status

                      </TableHeading>







                      <TableHeading center>

                        Action

                      </TableHeading>

                    </tr>

                  </thead>



                  <tbody>

                    {paginatedDCs.length > 0 ? (

                      paginatedDCs.map((item, index) => {

                        const id =

                          item.dc_id ??

                          item.id ??

                          index;



                        return (

                          <tr

                            key={id}

                            className="border-b border-gray-100 transition last:border-0 hover:bg-gray-50/70 dark:border-neutral-800 dark:hover:bg-neutral-800/40"

                          >

                            {/* =============================*

                                DC
*                            ============================= */}



                            <td className="px-4 py-4">

                              <div className="flex items-center gap-3">

                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400">

                                  <Building2 className="h-4 w-4" />

                                </div>



                                <div className="min-w-0">

                                  <p className="max-w-[230px] truncate text-sm font-semibold text-gray-900 dark:text-neutral-100">

                                    {item.dc_name || "—"}

                                  </p>



                                  <p className="mt-0.5 text-xs text-gray-400">

                                    ID: {id}

                                  </p>

                                </div>

                              </div>

                            </td>



                            {/* =============================*

                                CODE
*                            ============================= */}



                            <td className="px-4 py-4">

                              <span className="inline-flex rounded-md bg-gray-100 px-2.5 py-1 font-mono text-xs font-semibold text-gray-700 dark:bg-neutral-800 dark:text-neutral-300">

                                {item.dc_code || "—"}

                              </span>

                            </td>



                            {/* =============================*

                                USERNAME
*                            ============================= */}



                            <td className="px-4 py-4">

                              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-neutral-300">

                                <User className="h-3.5 w-3.5 shrink-0 text-gray-400" />



                                <span className="max-w-[150px] truncate">

                                  {item.username || "—"}

                                </span>

                              </div>

                            </td>



                            {/* =============================*

                                CONTACT
*                            ============================= */}



                            <td className="px-4 py-4">

                              <div className="space-y-1.5">

                                <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-neutral-300">

                                  <Mail className="h-3.5 w-3.5 shrink-0 text-gray-400" />



                                  <span className="max-w-[190px] truncate">

                                    {item.email || "—"}

                                  </span>

                                </div>



                                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-neutral-400">

                                  <Phone className="h-3.5 w-3.5 shrink-0 text-gray-400" />



                                  <span>

                                    {item.phone || "—"}

                                  </span>

                                </div>

                              </div>

                            </td>



                            {/* =============================*

                                LOCATION
*                            ============================= */}



                            <td className="px-4 py-4">

                              <div className="flex items-start gap-2">

                                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />



                                <div>

                                  <p className="text-sm font-medium text-gray-700 dark:text-neutral-300">

                                    {item.city || "—"}

                                  </p>



                                  <p className="mt-0.5 text-xs text-gray-400">

                                    {item.state || "—"}



                                    {item.pincode

                                      ? ` • ${item.pincode}`

                                      : ""}

                                  </p>

                                </div>

                              </div>

                            </td>



                            {/* =============================*

                                STATUS
*                            ============================= */}



                            <td className="px-4 py-4">

                              {Number(item.status) === 1 ? (

                                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700 dark:bg-green-950/30 dark:text-green-400">

                                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />



                                  Active

                                </span>

                              ) : (

                                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700 dark:bg-red-950/30 dark:text-red-400">

                                  <span className="h-1.5 w-1.5 rounded-full bg-red-500" />



                                  Inactive

                                </span>

                              )}

                            </td>





                            {/* =============================*

                                ACTION
*                            ============================= */}



                            <td className="px-4 py-4">

                              <div className="flex justify-center">

                                <button

                                  type="button"

                                  onClick={() =>

                                    handleView(item)

                                  }

                                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#0446DB] dark:border-neutral-700 dark:text-neutral-400 dark:hover:border-blue-900 dark:hover:bg-blue-950/30 dark:hover:text-blue-400"

                                  title="View Distribution Center"

                                >

                                  <Eye className="h-4 w-4" />

                                </button>

                              </div>

                            </td>

                          </tr>

                        );

                      })

                    ) : (

                      <tr>

                        <td

                          colSpan={8}

                          className="px-4 py-16 text-center"

                        >

                          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-neutral-800">

                            <Building2 className="h-5 w-5 text-gray-400" />

                          </div>



                          <p className="mt-3 text-sm font-semibold text-gray-700 dark:text-neutral-300">

                            No Distribution Center found

                          </p>



                          <p className="mt-1 text-xs text-gray-400">

                            Try changing your search or status

                            filter.

                          </p>

                        </td>

                      </tr>

                    )}

                  </tbody>

                </table>

              </div>



              {/* =============================================*

                  PAGINATION
*              ============================================= */}



              <div className="z-10 flex shrink-0 flex-col gap-3 border-t border-gray-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900 sm:flex-row sm:items-center sm:justify-between">

                <p className="text-xs text-gray-500 dark:text-neutral-400">

                  Showing{" "}

                  <span className="font-semibold">

                    {showingFrom}

                  </span>{" "}

                  to{" "}

                  <span className="font-semibold">

                    {showingTo}

                  </span>{" "}

                  of{" "}

                  <span className="font-semibold">

                    {totalItems}

                  </span>{" "}

                  Distribution Centers

                </p>



                <div className="flex items-center gap-2">

                  {/* PREVIOUS */}



                  <button

                    type="button"

                    disabled={currentPage === 1}

                    onClick={() =>

                      setCurrentPage((prev) =>

                        Math.max(1, prev - 1)

                      )

                    }

                    className="flex h-9 items-center gap-1 rounded-lg border border-gray-200 px-3 text-xs font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"

                  >

                    <ChevronLeft className="h-4 w-4" />



                    Previous

                  </button>



                  {/* PAGE */}



                  <div className="flex h-9 min-w-[65px] items-center justify-center rounded-lg bg-[#0446DB] px-3 text-xs font-semibold text-white">

                    {currentPage} / {totalPages}

                  </div>



                  {/* NEXT */}



                  <button

                    type="button"

                    disabled={currentPage === totalPages}

                    onClick={() =>

                      setCurrentPage((prev) =>

                        Math.min(totalPages, prev + 1)

                      )

                    }

                    className="flex h-9 items-center gap-1 rounded-lg border border-gray-200 px-3 text-xs font-medium text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-800"

                  >

                    Next



                    <ChevronRight className="h-4 w-4" />

                  </button>

                </div>

              </div>

            </>

          )}

        </div>

      </div>



      {/* =====================================================*

          VIEW DC MODAL
*      ===================================================== */}



      {viewModalOpen && selectedDC && (

        <div

          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"

          onMouseDown={(e) => {

            if (e.target === e.currentTarget) {

              closeViewModal();

            }

          }}

        >

          <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">

            {/* ===============================================*

                MODAL HEADER
*            =============================================== */}



            <div className="flex items-start justify-between border-b border-gray-200 px-5 py-4 dark:border-neutral-800">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0446DB] dark:bg-blue-950/30 dark:text-blue-400">

                  <Building2 className="h-5 w-5" />

                </div>



                <div>

                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">

                    {selectedDC.dc_name || "Distribution Center"}

                  </h2>



                  <p className="mt-0.5 text-xs text-gray-500 dark:text-neutral-400">

                    {selectedDC.dc_code || "—"}

                  </p>

                </div>

              </div>



              <button

                type="button"

                onClick={closeViewModal}

                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-neutral-800 dark:hover:text-white"

              >

                <X className="h-5 w-5" />

              </button>

            </div>



            {/* ===============================================*

                MODAL BODY
*            =============================================== */}



            <div className="max-h-[70vh] overflow-y-auto p-5">

              {/* STATUS */}



              <div className="mb-5 flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-neutral-800 dark:bg-neutral-950">

                <div>

                  <p className="text-xs text-gray-500 dark:text-neutral-400">

                    Current Status

                  </p>



                  <p className="mt-1 text-sm font-semibold text-gray-800 dark:text-neutral-200">

                    Distribution Center

                  </p>

                </div>



                {Number(selectedDC.status) === 1 ? (

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1.5 text-xs font-semibold text-green-700 dark:bg-green-950/30 dark:text-green-400">

                    <CircleCheck className="h-3.5 w-3.5" />



                    Active

                  </span>

                ) : (

                  <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-700 dark:bg-red-950/30 dark:text-red-400">

                    <CircleX className="h-3.5 w-3.5" />



                    Inactive

                  </span>

                )}

              </div>



              {/* =============================================*

                  DETAILS
*              ============================================= */}



              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <DetailCard

                  icon={Hash}

                  label="DC ID"

                  value={

                    selectedDC.dc_id ??

                    selectedDC.id ??

                    "—"

                  }

                />



                <DetailCard

                  icon={Hash}

                  label="DC Code"

                  value={selectedDC.dc_code || "—"}

                />



                <DetailCard

                  icon={User}

                  label="Username"

                  value={selectedDC.username || "—"}

                />



                <DetailCard

                  icon={Mail}

                  label="Email Address"

                  value={selectedDC.email || "—"}

                />



                <DetailCard

                  icon={Phone}

                  label="Phone Number"

                  value={selectedDC.phone || "—"}

                />



                <DetailCard

                  icon={MapPinned}

                  label="City / Town"

                  value={selectedDC.city || "—"}

                />



                <DetailCard

                  icon={MapPin}

                  label="State"

                  value={selectedDC.state || "—"}

                />



                <DetailCard

                  icon={Hash}

                  label="Pincode"

                  value={selectedDC.pincode || "—"}

                />





              </div>



              {/* =============================================*

                  ADDRESS
*              ============================================= */}



              <div className="mt-4 rounded-xl border border-gray-200 p-4 dark:border-neutral-800">

                <div className="flex items-start gap-3">

                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500 dark:bg-neutral-800 dark:text-neutral-400">

                    <MapPin className="h-4 w-4" />

                  </div>



                  <div>

                    <p className="text-xs font-medium text-gray-500 dark:text-neutral-400">

                      Complete Address

                    </p>



                    <p className="mt-1.5 text-sm leading-6 text-gray-800 dark:text-neutral-200">

                      {selectedDC.address || "—"}

                    </p>

                  </div>

                </div>

              </div>

            </div>



            {/* ===============================================*

                MODAL FOOTER
*            =============================================== */}



            <div className="flex justify-end border-t border-gray-200 bg-gray-50 px-5 py-4 dark:border-neutral-800 dark:bg-neutral-950/50">

              <button

                type="button"

                onClick={closeViewModal}

                className="h-10 rounded-lg bg-[#0446DB] px-5 text-sm font-semibold text-white transition hover:bg-[#0339b5]"

              >

                Close

              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}



/* =========================================================*

   SUMMARY CARD
========================================================= */



function SummaryCard({

  title,

  value,

  icon: Icon,

  iconClass,

}) {

  return (

    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">

      <div className="flex items-center justify-between">

        <div>

          <p className="text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-neutral-400">

            {title}

          </p>



          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">

            {value}

          </p>

        </div>



        <div

          className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconClass}`}

        >

          <Icon className="h-5 w-5" />

        </div>

      </div>

    </div>

  );

}



/* =========================================================*

   TABLE HEADING
========================================================= */



function TableHeading({ children, center = false }) {

  return (

    <th

      className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-neutral-400 ${

        center ? "text-center" : "text-left"

      }`}

    >

      {children}

    </th>

  );

}



/* =========================================================*

   DETAIL CARD
========================================================= */



function DetailCard({

  icon: Icon,

  label,

  value,

}) {

  return (

    <div className="rounded-xl border border-gray-200 p-4 dark:border-neutral-800">

      <div className="flex items-start gap-3">

        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-gray-500 dark:bg-neutral-800 dark:text-neutral-400">

          <Icon className="h-4 w-4" />

        </div>



        <div className="min-w-0">

          <p className="text-xs font-medium text-gray-500 dark:text-neutral-400">

            {label}

          </p>



          <p className="mt-1 break-words text-sm font-semibold text-gray-800 dark:text-neutral-200">

            {value}

          </p>

        </div>

      </div>

    </div>

  );

}



export default DistributionCenterListing;