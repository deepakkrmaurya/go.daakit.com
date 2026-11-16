
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import {
  Loader2,
  MapPin,
  RefreshCw,
  Users,
  Clock3,
  Navigation,
} from "lucide-react";

/* =========================================================
   FIX LEAFLET DEFAULT MARKER
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
   COMPONENT
========================================================= */

function VendorRidersMap() {
  const [loading, setLoading] = useState(false);
  const [riders, setRiders] = useState([]);

  /* =========================================================
     GET RIDER LOCATIONS
  ========================================================= */

  const getLocations = async () => {
    setLoading(true);

    try {
      const res = await axios.get(
        `${baseURL}/api/vendor/getRidersLocation`,
        {
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

      toast.error("Can't get rider locations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLocations();
  }, []);

  /* =========================================================
     VALID RIDERS
  ========================================================= */

  const validRiders = riders.filter((rider) => {
    const latitude = Number(rider?.latitude);
    const longitude = Number(rider?.longitude);

    return (
      Number.isFinite(latitude) &&
      Number.isFinite(longitude)
    );
  });

  /* =========================================================
     DEFAULT MAP CENTER
  ========================================================= */

  const defaultCenter =
    validRiders.length > 0
      ? [
          Number(validRiders[0].latitude),
          Number(validRiders[0].longitude),
        ]
      : [28.6139, 77.209];

  /* =========================================================
     FORMAT TIME
  ========================================================= */

  const formatTime = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  /* =========================================================
     RIDER DISPLAY ID
  ========================================================= */

  const getRiderId = (rider) => {
    return rider?.vendor_id
      ? `FP${rider.vendor_id}_${rider.rider_id}`
      : `DKT_${rider.rider_id}`;
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading && riders.length === 0) {
    return (
      <div className="flex min-h-[85vh] w-full items-center justify-center bg-[#F7F8FA] dark:bg-neutral-950">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-sm border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <Loader2 className="h-6 w-6 animate-spin text-[#0446DB]" />
          </div>

          <p className="mt-3 text-sm font-medium text-gray-700 dark:text-neutral-200">
            Loading rider locations...
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Please wait while we prepare the map.
          </p>
        </div>
      </div>
    );
  }

  /* =========================================================
     JSX
  ========================================================= */

  return (
    <div className="min-h-screen w-full bg-[#F7F8FA] dark:bg-neutral-950">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className=" dark:border-neutral-800 dark:bg-neutral-900">
        <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between">

          {/* LEFT */}

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-[#0446DB]/10 text-[#0446DB] dark:bg-[#0446DB]/20 dark:text-blue-400">
              <MapPin className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                Live Rider Location
              </h1>

              <p className="mt-0.5 text-sm text-gray-500 dark:text-neutral-400">
                Monitor rider locations on the map
              </p>
            </div>
          </div>

          {/* RIGHT */}

          <div className="flex items-center gap-2">

            {/* RIDER COUNT */}

            <div className="inline-flex h-10 items-center gap-2 rounded-sm border border-gray-200 bg-gray-50 px-3 text-sm dark:border-neutral-700 dark:bg-neutral-800">
              <Users className="h-4 w-4 text-[#0446DB]" />

              <span className="text-gray-500 dark:text-neutral-400">
                Riders
              </span>

              <span className="font-semibold text-gray-900 dark:text-white">
                {validRiders.length}
              </span>
            </div>

            {/* REFRESH */}

            <button
              type="button"
              onClick={getLocations}
              disabled={loading}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-sm bg-[#0446DB] px-4 text-sm font-medium text-white shadow-sm transition hover:bg-[#0339B8] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  loading ? "animate-spin" : ""
                }`}
              />

              <span className="hidden sm:inline">
                Refresh
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <div className="p-3 sm:p-4 lg:p-6">

        {/* MAP CARD */}

        <div className="overflow-hidden rounded-sm border border-gray-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">

          {/* MAP CARD HEADER */}

          <div className="flex flex-col gap-3 border-b border-gray-200 px-4 py-3 dark:border-neutral-800 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                Rider Map
              </h2>

              <p className="mt-0.5 text-xs text-gray-500 dark:text-neutral-400">
                Hover or click a marker to view rider
                details
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-neutral-400">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />

                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
              </span>

              Live Location
            </div>
          </div>

          {/* =================================================
              MAP
          ================================================== */}

          <div className="relative">

            {/* MAP OVERLAY */}

            <div className="pointer-events-none absolute left-3 top-3 z-[500] sm:left-4 sm:top-4">
              <div className="flex items-center gap-2 rounded-sm border border-gray-200 bg-white/95 px-3 py-2 shadow-md backdrop-blur-sm">
                <Navigation className="h-4 w-4 text-[#0446DB]" />

                <div>
                  <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
                    Visible Riders
                  </p>

                  <p className="text-sm font-semibold text-gray-900">
                    {validRiders.length}
                  </p>
                </div>
              </div>
            </div>

            {validRiders.length > 0 ? (
              <MapContainer
                key={`${defaultCenter[0]}-${defaultCenter[1]}`}
                center={defaultCenter}
                zoom={13}
                scrollWheelZoom
                className="h-[520px] w-full sm:h-[600px] lg:h-[calc(100vh-230px)] lg:min-h-[580px]"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* =========================================
                    RIDER MARKERS
                ========================================== */}

                {validRiders.map((rider) => (
                  <Marker
                    key={rider.rider_id}
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
                    {/* =====================================
                        POPUP
                    ====================================== */}

                    <Popup
                      minWidth={250}
                      maxWidth={300}
                    >
                      <div className="min-w-[220px]">

                        {/* Rider Header */}

                        <div className="mb-3 flex items-center gap-3 border-b border-gray-100 pb-3">

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0446DB] text-sm font-semibold text-white">
                            {rider?.name
                              ?.charAt(0)
                              ?.toUpperCase() || "R"}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-gray-900">
                              {rider?.name ||
                                "Unknown Rider"}
                            </p>

                            <span className="mt-1 inline-flex rounded-sm bg-blue-50 px-2 py-0.5 font-mono text-[10px] font-medium text-[#0446DB]">
                              {getRiderId(rider)}
                            </span>
                          </div>
                        </div>

                        {/* DETAILS */}

                        <div className="space-y-2">

                          {/* Updated */}

                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-1.5 text-xs text-gray-500">
                              <Clock3 className="h-3.5 w-3.5" />

                              Last Update
                            </div>

                            <span className="text-xs font-medium text-gray-800">
                              {formatTime(
                                rider?.updated_at
                              )}
                            </span>
                          </div>

                          {/* Latitude */}

                          <div className="flex items-center justify-between gap-4">
                            <span className="text-xs text-gray-500">
                              Latitude
                            </span>

                            <span className="font-mono text-xs font-medium text-gray-800">
                              {Number(
                                rider.latitude
                              ).toFixed(5)}
                            </span>
                          </div>

                          {/* Longitude */}

                          <div className="flex items-center justify-between gap-4">
                            <span className="text-xs text-gray-500">
                              Longitude
                            </span>

                            <span className="font-mono text-xs font-medium text-gray-800">
                              {Number(
                                rider.longitude
                              ).toFixed(5)}
                            </span>
                          </div>
                        </div>

                        {/* STATUS */}

                        <div className="mt-3 flex items-center gap-2 rounded-sm bg-green-50 px-2.5 py-2">
                          <span className="h-2 w-2 rounded-full bg-green-500" />

                          <span className="text-xs font-medium text-green-700">
                            Location Available
                          </span>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            ) : (
              /* ===========================================
                  EMPTY STATE
              ============================================ */

              <div className="flex h-[520px] items-center justify-center bg-gray-50 dark:bg-neutral-950 sm:h-[600px]">
                <div className="max-w-sm px-5 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-sm border border-gray-200 bg-white text-gray-400 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <MapPin className="h-5 w-5" />
                  </div>

                  <h3 className="mt-3 text-sm font-semibold text-gray-900 dark:text-white">
                    No rider locations available
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-neutral-400">
                    Rider locations will appear here once
                    location data becomes available.
                  </p>

                  <button
                    type="button"
                    onClick={getLocations}
                    className="mt-4 inline-flex h-9 items-center gap-2 rounded-sm bg-[#0446DB] px-4 text-xs font-medium text-white transition hover:bg-[#0339B8]"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Refresh Locations
                  </button>
                </div>
              </div>
            )}

            {/* REFRESHING OVERLAY */}

            {loading && riders.length > 0 && (
              <div className="absolute right-3 top-3 z-[500] flex items-center gap-2 rounded-sm border border-gray-200 bg-white/95 px-3 py-2 text-xs font-medium text-gray-600 shadow-md backdrop-blur-sm sm:right-4 sm:top-4">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-[#0446DB]" />

                Updating...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VendorRidersMap;