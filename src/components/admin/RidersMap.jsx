// import Select from "react-select";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";


// // Fix default icon issue in Leaflet
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
//   iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
//   shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
// });

// const baseURL = import.meta.env.VITE_BASE_URL;

// function RidersMap() {
//   const [loading, setLoading] = useState(false);
//   const [vendor, setVendor] = useState("");
//   const [vendorsOption, setVendorsOption] = useState([]);
//   const [riders, setRiders] = useState([]);

//   const fetchVendors = async (input) => {
//     setLoading(true);

//     try {
//       const res = await axios.get(`${baseURL}/api/admin/getAllVendors`, {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//         params: {
//           limit: 1000,
//         }
//       });
//       const tempArr = [{value: "", label: "All Riders"}, {value: "self", label: "Self Riders"}];
//       res?.data?.data?.forEach(element=>{
//         tempArr.push({value: element.id, label: `FP${element.id}: ${element.vendor_name}`})
//       })
//       setVendorsOption(tempArr);
//     } catch (err) {
//       toast.error(
//         err.response?.data?.message || err.message || "Error fetching vendors: "
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   const getLocations = async (input) => {
//     setLoading(true);
//     let vendor_id = null;
//     let rider_type = null;
//     if(!input){
//         vendor_id = null;
//         rider_type = null;
//     }
//     else if (input === "self") {
//       rider_type = "self";
//     } else {
//       vendor_id = input;
//     }
//     try {
//       const res = await axios.get(`${baseURL}/api/admin/getRidersLocation`, {
//         params: { vendor_id, rider_type },
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });
//       setRiders(res.data.data);
//       // console.log(res.data.data);
//     } catch (err) {
//       toast.error("Can't get location");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     getLocations();
//     fetchVendors();
//   }, []);
//   const defaultCenter =
//     riders.length > 0
//       ? [riders[0].latitude, riders[0].longitude]
//       : [28.6139, 77.209]; // Default to New Delhi

//   return (
//     <>
     
//         <div className="bg-gray-100 dark:bg-neutral-800 h-screen w-full">
//           {/* Heading Strip */}
//           <div className="relative z-0 py-2   px-[24px]">
//             <div className="flex flex-wrap items-center justify-between w-full">
//               {/* Heading */}
//               <h1 className="text-2xl dark:text-white">Live Location</h1>
//               <div className="ml-auto w-[200px] z-50 relative">
//                 <Select
//                   required
//                   options={vendorsOption}
//                   isSearchable
//                   value={vendorsOption.find((option) => option.value === vendor)}
//                   onChange={(selectedOption) => {
//                     setVendor(selectedOption?.value)
//                     getLocations(selectedOption?.value)
//                   }}
//                   placeholder="Select Vendor"
//                   className="text-sm"
//                   classNamePrefix="react-select"
//                   menuPortalTarget={document.body} // Renders menu at top level
//                   styles={{
//                     menuPortal: (base) => ({ ...base, zIndex: 9999 }),
//                     menu: (base) => ({ ...base, zIndex: 9999 }),
//                   }}
//                 />
//               </div>
//             </div>
//           </div>
//           <div className="px-2 z-99 h-[90vh] ">
//             <div className=" ">
//               <MapContainer
//                  className=" z-10"
//                 center={defaultCenter}
//                 zoom={13}
//                 style={{ height: "800px", width: "100%" }}
//               >
//                 <TileLayer
//                   attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
//                   url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                 />
//                 {riders?.map((rider) => (
//                   <Marker
//                     key={rider.rider_id}
//                     position={[rider.latitude, rider.longitude]}
//                     eventHandlers={{
//                       mouseover: (e) => {
//                         e.target.openPopup();
//                       },
//                       mouseout: (e) => {
//                         e.target.closePopup();
//                       },
//                     }}
//                   >
//                     <Popup>
//                       <div className="text-sm">
//                         <p className="font-bold text-indigo-600">
//                           {rider.name}
//                           <span className="mt-2 text-xs text-gray-700">
//                             <span className="font-mono bg-gray-100 p-1 rounded">
//                               {rider.vendor_id
//                                 ? `FP${rider.vendor_id}_${rider.rider_id}`
//                                 : `DKT_${rider.rider_id}`}
//                             </span>
//                           </span>
//                           <span className="mt-2 text-xs text-gray-700">
//                             {
//                             new Date(rider.updated_at).toLocaleString(
//                                   "en-IN",
//                                   {
//                                     timeZone: "Asia/Kolkata",
//                                     hour: "2-digit",
//                                     minute: "2-digit",
//                                     hour12: true,
//                                   }
//                                 )}
//                           </span>
//                         </p>
//                         <p>📍 Lat: {Number(rider.latitude)?.toFixed(4)}</p>
//                         <p>📍 Lng: {Number(rider.longitude)?.toFixed(4)}</p>
//                       </div>
//                     </Popup>
//                   </Marker>
//                 ))}
//               </MapContainer>
//             </div>
//           </div>
//         </div>
   
//     </>
//   );
// }

// export default RidersMap;


import Select from "react-select";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import {
  MapPin,
  RefreshCw,
  Users,
  Navigation,
  Clock3,
  UserRound,
  Store,
  ChevronDown,
} from "lucide-react";

/* =========================================================
   LEAFLET DEFAULT MARKER FIX
========================================================= */

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const baseURL = import.meta.env.VITE_BASE_URL;

/* =========================================================
   MAP AUTO FIT
========================================================= */

const FitMapToRiders = ({ riders }) => {
  const map = useMap();

  useEffect(() => {
    if (!riders?.length) return;

    const validPositions = riders
      .filter(
        (rider) =>
          Number.isFinite(Number(rider.latitude)) &&
          Number.isFinite(Number(rider.longitude))
      )
      .map((rider) => [
        Number(rider.latitude),
        Number(rider.longitude),
      ]);

    if (!validPositions.length) return;

    // Single rider
    if (validPositions.length === 1) {
      map.flyTo(validPositions[0], 15, {
        duration: 0.8,
      });

      return;
    }

    // Multiple riders
    const bounds = L.latLngBounds(validPositions);

    map.fitBounds(bounds, {
      padding: [70, 70],
      maxZoom: 15,
    });
  }, [riders, map]);

  return null;
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

function RidersMap() {
  const [loading, setLoading] = useState(false);

  const [vendor, setVendor] = useState("");

  const [vendorsOption, setVendorsOption] = useState([]);

  const [riders, setRiders] = useState([]);

  /* =======================================================
     FETCH VENDORS
  ======================================================= */

  const fetchVendors = async () => {
    try {
      const res = await axios.get(
        `${baseURL}/api/admin/getAllVendors`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "token"
            )}`,
          },

          params: {
            limit: 1000,
          },
        }
      );

      const tempArr = [
        {
          value: "",
          label: "All Riders",
        },
        {
          value: "self",
          label: "Self Riders",
        },
      ];

      res?.data?.data?.forEach((element) => {
        tempArr.push({
          value: element.id,
          label: `FP${element.id}: ${element.vendor_name}`,
        });
      });

      setVendorsOption(tempArr);
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Error fetching vendors"
      );
    }
  };

  /* =======================================================
     FETCH RIDER LOCATIONS
  ======================================================= */

  const getLocations = async (input = "") => {
    setLoading(true);

    let vendor_id = null;
    let rider_type = null;

    if (!input) {
      vendor_id = null;
      rider_type = null;
    } else if (input === "self") {
      rider_type = "self";
    } else {
      vendor_id = input;
    }

    try {
      const res = await axios.get(
        `${baseURL}/api/admin/getRidersLocation`,
        {
          params: {
            vendor_id,
            rider_type,
          },

          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "token"
            )}`,
          },
        }
      );

      setRiders(res?.data?.data || []);
    } catch (err) {
      console.error(err);

      toast.error(
        err?.response?.data?.message ||
          "Can't get rider locations"
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    getLocations();
    fetchVendors();
  }, []);

  /* =======================================================
     VALID RIDERS
  ======================================================= */

  const validRiders = useMemo(() => {
    return riders.filter(
      (rider) =>
        Number.isFinite(Number(rider.latitude)) &&
        Number.isFinite(Number(rider.longitude))
    );
  }, [riders]);

  /* =======================================================
     DEFAULT CENTER
  ======================================================= */

  const defaultCenter =
    validRiders.length > 0
      ? [
          Number(validRiders[0].latitude),
          Number(validRiders[0].longitude),
        ]
      : [28.6139, 77.209];

  /* =======================================================
     SELECTED VENDOR
  ======================================================= */

  const selectedVendor =
    vendorsOption.find(
      (option) => option.value === vendor
    ) || null;

  /* =======================================================
     DATE FORMAT
  ======================================================= */

  const formatTime = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  /* =======================================================
     REACT SELECT STYLES
  ======================================================= */

  const selectStyles = {
    menuPortal: (base) => ({
      ...base,
      zIndex: 99999,
    }),

    menu: (base) => ({
      ...base,
      zIndex: 99999,
      borderRadius: "10px",
      overflow: "hidden",
      marginTop: "6px",
    }),

    control: (base, state) => ({
      ...base,

      minHeight: "42px",
      height: "42px",

      borderRadius: "9px",

      borderColor: state.isFocused
        ? "#0446DB"
        : "#E5E7EB",

      boxShadow: state.isFocused
        ? "0 0 0 1px #0446DB"
        : "none",

      cursor: "pointer",

      "&:hover": {
        borderColor: "#0446DB",
      },
    }),

    valueContainer: (base) => ({
      ...base,
      padding: "0 10px",
    }),

    input: (base) => ({
      ...base,
      margin: 0,
      padding: 0,
    }),

    indicatorsContainer: (base) => ({
      ...base,
      height: "42px",
    }),

    option: (base, state) => ({
      ...base,

      fontSize: "13px",

      cursor: "pointer",

      backgroundColor: state.isSelected
        ? "#0446DB"
        : state.isFocused
          ? "#EFF6FF"
          : "#FFFFFF",

      color: state.isSelected
        ? "#FFFFFF"
        : "#374151",
    }),

    singleValue: (base) => ({
      ...base,
      fontSize: "13px",
      fontWeight: 500,
    }),

    placeholder: (base) => ({
      ...base,
      fontSize: "13px",
      color: "#9CA3AF",
    }),
  };

  /* =======================================================
     JSX
  ======================================================= */

  return (
    <div className="relative h-[calc(100vh-72px)] min-h-[500px] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-950">

      {/* ===================================================
          FULL SCREEN MAP
      ==================================================== */}

      <MapContainer
        center={defaultCenter}
        zoom={13}
        zoomControl={false}
        className="absolute inset-0 z-0 h-full w-full"
        style={{
          height: "100%",
          width: "100%",
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <FitMapToRiders riders={validRiders} />

        {/* =================================================
            RIDER MARKERS
        ================================================== */}

        {validRiders.map((rider) => (
          <Marker
            key={
              rider.rider_id ||
              `${rider.latitude}-${rider.longitude}`
            }
            position={[
              Number(rider.latitude),
              Number(rider.longitude),
            ]}
            eventHandlers={{
              mouseover: (e) => {
                e.target.openPopup();
              },

              mouseout: (e) => {
                e.target.closePopup();
              },
            }}
          >
            <Popup
              closeButton={false}
              minWidth={230}
            >
              <div className="min-w-[210px]">

                {/* Rider Header */}

                <div className="mb-3 flex items-center gap-3">

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#0446DB]">
                    <UserRound className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">

                    <p className="truncate text-sm font-semibold text-neutral-900">
                      {rider.name || "Unknown Rider"}
                    </p>

                    <p className="mt-0.5 text-xs text-neutral-500">
                      Rider ID
                    </p>

                  </div>

                </div>

                {/* Rider ID */}

                <div className="mb-2 flex items-center justify-between rounded-md bg-neutral-50 px-3 py-2">

                  <span className="text-xs text-neutral-500">
                    ID
                  </span>

                  <span className="font-mono text-xs font-semibold text-neutral-700">
                    {rider.vendor_id
                      ? `FP${rider.vendor_id}_${rider.rider_id}`
                      : `DKT_${rider.rider_id}`}
                  </span>

                </div>

                {/* Updated */}

                <div className="flex items-center gap-2 border-b border-neutral-100 py-2">

                  <Clock3 className="h-3.5 w-3.5 text-neutral-400" />

                  <div>
                    <p className="text-[10px] uppercase tracking-wide text-neutral-400">
                      Last Updated
                    </p>

                    <p className="text-xs font-medium text-neutral-700">
                      {formatTime(rider.updated_at)}
                    </p>
                  </div>

                </div>

                {/* Coordinates */}

                <div className="mt-2 grid grid-cols-2 gap-2">

                  <div className="rounded-md bg-neutral-50 p-2">
                    <p className="text-[10px] text-neutral-400">
                      Latitude
                    </p>

                    <p className="mt-0.5 font-mono text-xs font-medium text-neutral-700">
                      {Number(rider.latitude).toFixed(4)}
                    </p>
                  </div>

                  <div className="rounded-md bg-neutral-50 p-2">
                    <p className="text-[10px] text-neutral-400">
                      Longitude
                    </p>

                    <p className="mt-0.5 font-mono text-xs font-medium text-neutral-700">
                      {Number(rider.longitude).toFixed(4)}
                    </p>
                  </div>

                </div>

              </div>
            </Popup>
          </Marker>
        ))}

      </MapContainer>

      {/* ===================================================
          TOP LEFT TITLE
      ==================================================== */}

      <div className="pointer-events-none absolute left-4 top-4 z-[500] sm:left-5 sm:top-5">

        <div className="pointer-events-auto flex items-center gap-3 rounded-xl border border-white/70 bg-white/95 px-4 py-3 shadow-lg backdrop-blur-md dark:border-neutral-700 dark:bg-neutral-900/95">

          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0446DB] text-white shadow-sm">
            <Navigation className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-sm font-bold text-neutral-900 dark:text-white sm:text-base">
              Live Rider Tracking
            </h1>

            <div className="mt-0.5 flex items-center gap-1.5">

              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />

                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>

              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                Live locations
              </span>

            </div>
          </div>

        </div>
      </div>

      {/* ===================================================
          TOP RIGHT CONTROLS
      ==================================================== */}

      <div className="absolute right-4 top-4 z-[500] flex items-center gap-2 sm:right-5 sm:top-5">

        {/* RIDER COUNT */}

        <div className="hidden h-[42px] items-center gap-2 rounded-lg border border-white/70 bg-white/95 px-3 shadow-lg backdrop-blur-md dark:border-neutral-700 dark:bg-neutral-900/95 sm:flex">

          <Users className="h-4 w-4 text-[#0446DB] dark:text-blue-400" />

          <div>
            <p className="text-[10px] leading-none text-neutral-400">
              Riders
            </p>

            <p className="mt-1 text-xs font-bold text-neutral-800 dark:text-white">
              {validRiders.length}
            </p>
          </div>

        </div>

        {/* VENDOR FILTER */}

        <div className="w-[210px] rounded-lg bg-white shadow-lg dark:bg-neutral-900 sm:w-[270px]">

          <Select
            options={vendorsOption}
            isSearchable
            value={selectedVendor}
            onChange={(selectedOption) => {
              const value =
                selectedOption?.value ?? "";

              setVendor(value);
              getLocations(value);
            }}
            placeholder="Filter by vendor"
            className="text-sm"
            classNamePrefix="react-select"
            menuPortalTarget={document.body}
            styles={selectStyles}
          />

        </div>

        {/* REFRESH */}

        <button
          type="button"
          onClick={() => getLocations(vendor)}
          disabled={loading}
          title="Refresh rider locations"
          className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-lg border border-white/70 bg-white text-neutral-600 shadow-lg transition-all hover:bg-neutral-50 hover:text-[#0446DB] disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-blue-400"
        >
          <RefreshCw
            className={`h-4 w-4 ${
              loading ? "animate-spin" : ""
            }`}
          />
        </button>

      </div>

      {/* ===================================================
          MOBILE RIDER COUNT
      ==================================================== */}

      <div className="absolute bottom-5 left-4 z-[500] sm:hidden">

        <div className="flex items-center gap-2 rounded-lg border border-white/70 bg-white/95 px-3 py-2 shadow-lg backdrop-blur-md dark:border-neutral-700 dark:bg-neutral-900/95">

          <Users className="h-4 w-4 text-[#0446DB]" />

          <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-200">
            {validRiders.length} Riders
          </span>

        </div>

      </div>

      {/* ===================================================
          EMPTY STATE
      ==================================================== */}

      {!loading && validRiders.length === 0 && (
        <div className="pointer-events-none absolute inset-0 z-[400] flex items-center justify-center">

          <div className="pointer-events-auto mx-4 rounded-xl border border-neutral-200 bg-white/95 p-6 text-center shadow-xl backdrop-blur-md dark:border-neutral-700 dark:bg-neutral-900/95">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">

              <MapPin className="h-5 w-5 text-neutral-400" />

            </div>

            <h3 className="mt-3 text-sm font-semibold text-neutral-900 dark:text-white">
              No Rider Locations
            </h3>

            <p className="mt-1 max-w-[250px] text-xs leading-5 text-neutral-500 dark:text-neutral-400">
              No live location data is currently available
              for the selected rider group.
            </p>

          </div>

        </div>
      )}

      {/* ===================================================
          LOADING OVERLAY
      ==================================================== */}

      {loading && (
        <div className="pointer-events-none absolute inset-0 z-[600] flex items-center justify-center bg-black/5 backdrop-blur-[1px]">

          <div className="flex items-center gap-3 rounded-xl border border-white/70 bg-white/95 px-5 py-3 shadow-xl dark:border-neutral-700 dark:bg-neutral-900/95">

            <RefreshCw className="h-4 w-4 animate-spin text-[#0446DB] dark:text-blue-400" />

            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
              Updating rider locations...
            </span>

          </div>

        </div>
      )}

    </div>
  );
}

export default RidersMap;