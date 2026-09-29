// import Select from "react-select";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import AxiosInstance from "../../../../Helper/axiosInstance";


// // Fix default icon issue in Leaflet
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
//   iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
//   shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
// });

// const baseURL = import.meta.env.VITE_BASE_URL;

// function LiveLocation() {
//   const [loading, setLoading] = useState(false);
//   const [vendor, setVendor] = useState("");
//   const [vendorsOption, setVendorsOption] = useState([]);
//   const [riders, setRiders] = useState([]);

//   const getLocations = async (input) => {
//     setLoading(true);
   
//     // if(!input){
//     //     vendor_id = null;
//     //     rider_type = null;
//     // }
//     // else if (input === "self") {
//     //   rider_type = "self";
//     // } else {
//     //   vendor_id = input;
//     // }
//     try {
//       const result = await AxiosInstance.get('/api/tech-merchant/getRidersLocation')
//       console.log(result.data?.data)
//       setRiders(result.data?.data);
//     } catch (err) {
//       toast.error("Can't get location");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     getLocations();
   
//   }, []);
//   const defaultCenter =
//     riders.length > 0
//       ? [riders[0].latitude, riders[0].longitude]
//       : [28.6139, 77.209];

//   return (
//     <>
      
//         <div className="bg-gray-100 min-h-screen w-full">
//           {/* Heading Strip */}
//           <div className="relative z-0 mb-6 bg-[#0446DB] py-3 dark:bg-neutral-950 shadow-md  px-[24px]">
//             <div className="flex flex-wrap items-center justify-between w-full">
//               {/* Heading */}
//               <h1 className="text-2xl text-white">Live Location</h1>
              
//             </div>
//           </div>
//           <div className="px-2 z-99 ">
//             <div className=" relative ">
//               <MapContainer
//                  className=" z-10"
//                 center={defaultCenter}
//                 zoom={13}
//                 style={{ height: "500px", width: "100%" }}
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

// export default LiveLocation;



import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  ZoomControl,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  RefreshCw,
  Users,
  Navigation,
  UserRound,
  Clock3,
  MapPin,
  LocateFixed,
} from "lucide-react";

import AxiosInstance from "../../../../Helper/axiosInstance";

/* =========================================================
   LEAFLET DEFAULT ICON FIX
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

/* =========================================================
   AUTO FIT MAP TO RIDERS
========================================================= */

const FitMapToRiders = ({ riders }) => {
  const map = useMap();

  useEffect(() => {
    if (!riders?.length) return;

    const positions = riders.map((rider) => [
      Number(rider.latitude),
      Number(rider.longitude),
    ]);

    if (positions.length === 1) {
      map.flyTo(positions[0], 15, {
        duration: 0.8,
      });

      return;
    }

    const bounds = L.latLngBounds(positions);

    map.fitBounds(bounds, {
      padding: [80, 80],
      maxZoom: 15,
    });
  }, [riders, map]);

  return null;
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

function LiveLocation() {
  const [loading, setLoading] = useState(false);
  const [riders, setRiders] = useState([]);

  /* =======================================================
     GET RIDER LOCATIONS
  ======================================================= */

  const getLocations = async () => {
    try {
      setLoading(true);

      const result = await AxiosInstance.get(
        "/api/tech-merchant/getRidersLocation"
      );

      setRiders(result?.data?.data || []);
    } catch (err) {
      console.error("Get Rider Location Error:", err);

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
  }, []);

  /* =======================================================
     VALID RIDERS
  ======================================================= */

  const validRiders = useMemo(() => {
    return riders.filter((rider) => {
      const lat = Number(rider.latitude);
      const lng = Number(rider.longitude);

      return (
        Number.isFinite(lat) &&
        Number.isFinite(lng) &&
        lat >= -90 &&
        lat <= 90 &&
        lng >= -180 &&
        lng <= 180
      );
    });
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
     FORMAT DATE
  ======================================================= */

  const formatDateTime = (date) => {
    if (!date) return "Not available";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not available";
    }

    return parsedDate.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  /* =======================================================
     RIDER DISPLAY ID
  ======================================================= */

  const getRiderDisplayId = (rider) => {
    if (rider.vendor_id) {
      return `FP${rider.vendor_id}_${rider.rider_id}`;
    }

    return `DKT_${rider.rider_id}`;
  };

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
          width: "100%",
          height: "100%",
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ZoomControl position="bottomright" />

        <FitMapToRiders riders={validRiders} />

        {/* =================================================
            RIDER MARKERS
        ================================================== */}

        {validRiders.map((rider, index) => (
          <Marker
            key={
              rider.rider_id ||
              `${rider.latitude}-${rider.longitude}-${index}`
            }
            position={[
              Number(rider.latitude),
              Number(rider.longitude),
            ]}
          >
            <Popup
              minWidth={260}
              maxWidth={300}
              closeButton
            >
              <div className="min-w-[240px]">

                {/* RIDER HEADER */}

                <div className="flex items-center gap-3 border-b border-neutral-100 pb-3">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#0446DB]">
                    <UserRound className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="truncate text-sm font-bold text-neutral-900">
                      {rider.name || "Unknown Rider"}
                    </p>

                    <div className="mt-1 flex items-center gap-1.5">

                      <span className="h-2 w-2 rounded-full bg-emerald-500" />

                      <span className="text-[11px] font-medium text-emerald-600">
                        Location Available
                      </span>

                    </div>

                  </div>

                </div>

                {/* RIDER ID */}

                <div className="mt-3 flex items-center justify-between rounded-lg bg-neutral-50 px-3 py-2.5">

                  <span className="text-xs text-neutral-500">
                    Rider ID
                  </span>

                  <span className="font-mono text-xs font-semibold text-neutral-800">
                    {getRiderDisplayId(rider)}
                  </span>

                </div>

                {/* LAST UPDATED */}

                <div className="mt-3 flex items-start gap-2.5">

                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-neutral-100">
                    <Clock3 className="h-3.5 w-3.5 text-neutral-500" />
                  </div>

                  <div>

                    <p className="text-[10px] font-medium uppercase tracking-wide text-neutral-400">
                      Last Updated
                    </p>

                    <p className="mt-0.5 text-xs font-medium text-neutral-700">
                      {formatDateTime(rider.updated_at)}
                    </p>

                  </div>

                </div>

                {/* LOCATION */}

                <div className="mt-3 flex items-start gap-2.5">

                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-blue-50">
                    <MapPin className="h-3.5 w-3.5 text-[#0446DB]" />
                  </div>

                  <div>

                    <p className="text-[10px] font-medium uppercase tracking-wide text-neutral-400">
                      Coordinates
                    </p>

                    <p className="mt-0.5 font-mono text-[11px] text-neutral-700">
                      {Number(rider.latitude).toFixed(5)},{" "}
                      {Number(rider.longitude).toFixed(5)}
                    </p>

                  </div>

                </div>

              </div>
            </Popup>
          </Marker>
        ))}

      </MapContainer>

      {/* ===================================================
          TOP LEFT TITLE CARD
      ==================================================== */}

      <div className="pointer-events-none absolute left-4 top-4 z-[500] sm:left-5 sm:top-5">

        <div className="pointer-events-auto flex items-center gap-3 rounded-xl border border-white/70 bg-white/95 px-4 py-3 shadow-lg backdrop-blur-md dark:border-neutral-700 dark:bg-neutral-900/95">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#0446DB] text-white shadow-sm">
            <Navigation className="h-5 w-5" />
          </div>

          <div>

            <h1 className="text-sm font-bold text-neutral-900 dark:text-white sm:text-base">
              Live Rider Tracking
            </h1>

            <div className="mt-1 flex items-center gap-2">

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
          TOP RIGHT ACTIONS
      ==================================================== */}

      <div className="absolute right-4 top-4 z-[500] flex items-center gap-2 sm:right-5 sm:top-5">

        {/* RIDER COUNT */}

        <div className="flex h-11 items-center gap-3 rounded-xl border border-white/70 bg-white/95 px-4 shadow-lg backdrop-blur-md dark:border-neutral-700 dark:bg-neutral-900/95">

          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-blue-50 text-[#0446DB] dark:bg-blue-500/10 dark:text-blue-400">
            <Users className="h-4 w-4" />
          </div>

          <div className="hidden sm:block">

            <p className="text-[10px] leading-none text-neutral-400">
              Total Riders
            </p>

            <p className="mt-1 text-xs font-bold text-neutral-800 dark:text-white">
              {validRiders.length}
            </p>

          </div>

          <span className="text-sm font-bold text-neutral-800 dark:text-white sm:hidden">
            {validRiders.length}
          </span>

        </div>

        {/* REFRESH BUTTON */}

        <button
          type="button"
          onClick={getLocations}
          disabled={loading}
          title="Refresh Locations"
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/70 bg-white/95 text-neutral-600 shadow-lg backdrop-blur-md transition-all hover:-translate-y-0.5 hover:text-[#0446DB] disabled:cursor-not-allowed disabled:opacity-60 dark:border-neutral-700 dark:bg-neutral-900/95 dark:text-neutral-300 dark:hover:text-blue-400"
        >
          <RefreshCw
            className={`h-4 w-4 ${
              loading ? "animate-spin" : ""
            }`}
          />
        </button>

      </div>

      {/* ===================================================
          BOTTOM LEFT INFO
      ==================================================== */}

      {validRiders.length > 0 && (
        <div className="absolute bottom-5 left-4 z-[500] sm:left-5">

          <div className="flex items-center gap-2 rounded-lg border border-white/70 bg-white/90 px-3 py-2 shadow-md backdrop-blur-md dark:border-neutral-700 dark:bg-neutral-900/90">

            <LocateFixed className="h-3.5 w-3.5 text-[#0446DB] dark:text-blue-400" />

            <span className="text-[11px] font-medium text-neutral-600 dark:text-neutral-300">
              Showing {validRiders.length} rider
              {validRiders.length !== 1 ? "s" : ""}
            </span>

          </div>

        </div>
      )}

      {/* ===================================================
          EMPTY STATE
      ==================================================== */}

      {!loading && validRiders.length === 0 && (
        <div className="pointer-events-none absolute inset-0 z-[400] flex items-center justify-center">

          <div className="pointer-events-auto mx-4 w-full max-w-[320px] rounded-xl border border-neutral-200 bg-white/95 p-6 text-center shadow-xl backdrop-blur-md dark:border-neutral-700 dark:bg-neutral-900/95">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">

              <MapPin className="h-5 w-5 text-neutral-400" />

            </div>

            <h3 className="mt-3 text-sm font-semibold text-neutral-900 dark:text-white">
              No Rider Locations
            </h3>

            <p className="mt-1 text-xs leading-5 text-neutral-500 dark:text-neutral-400">
              Rider location data is currently not available.
            </p>

            <button
              type="button"
              onClick={getLocations}
              className="mt-4 inline-flex h-9 items-center justify-center gap-2 rounded-lg bg-[#0446DB] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#0339B5]"
            >
              <RefreshCw className="h-3.5 w-3.5" />

              Try Again
            </button>

          </div>

        </div>
      )}

      {/* ===================================================
          LOADING OVERLAY
      ==================================================== */}

      {loading && (
        <div className="pointer-events-none absolute inset-0 z-[600] flex items-center justify-center bg-black/[0.04] backdrop-blur-[1px]">

          <div className="flex items-center gap-3 rounded-xl border border-white/70 bg-white/95 px-5 py-3 shadow-xl dark:border-neutral-700 dark:bg-neutral-900/95">

            <RefreshCw className="h-4 w-4 animate-spin text-[#0446DB] dark:text-blue-400" />

            <span className="text-sm font-medium text-neutral-700 dark:text-neutral-200">
              Updating locations...
            </span>

          </div>

        </div>
      )}

    </div>
  );
}

export default LiveLocation;