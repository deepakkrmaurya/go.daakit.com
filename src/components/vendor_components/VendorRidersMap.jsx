import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../Loader";
import { Loader2 } from "lucide-react";

// Fix default icon issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const baseURL = import.meta.env.VITE_BASE_URL;

function VendorRidersMap() {
  const [loading, setLoading] = useState(false);

  const [riders, setRiders] = useState([]);

  const getLocations = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${baseURL}/api/vendor/getRidersLocation`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setRiders(res.data.data);
    } catch (err) {
      toast.error("Can't get location");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLocations();
  }, []);

  const defaultCenter =
    riders.length > 0
      ? [riders[0].latitude, riders[0].longitude]
      : [28.6139, 77.209]; // Default to New Delhi

  return (
    <>
      {loading ? (
       <div className=" w-full h-[90vh] flex justify-center items-center">
            <div>
              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
              <p className="mt-2">Loading Map...</p>
            </div>
          </div>
      ) : (
        <div className="bg-gray-100 min-h-screen w-full">
          {/* Heading Strip */}
          <div className="mb-6 bg-[#0446DB] py-[24px] shadow-md h-38 px-[24px]">
            <div className="flex flex-wrap items-center justify-between">
              {/* Heading */}
              <h1 className="text-2xl text-white">Live Location</h1>
            </div>
          </div>
          <div className="mx-6 z-10 rounded-md">
            <div className="-mt-20 relative z-10">
              <MapContainer
                center={defaultCenter}
                zoom={13}
                style={{ height: "500px", width: "100%" }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/">OSM</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {riders?.map((rider) => (
                  <Marker
                    key={rider.rider_id}
                    position={[rider.latitude, rider.longitude]}
                    eventHandlers={{
                      mouseover: (e) => {
                        e.target.openPopup();
                      },
                      mouseout: (e) => {
                        e.target.closePopup();
                      },
                    }}
                  >
                    <Popup>
                      <div className="text-sm">
                        <p className="font-bold text-indigo-600">
                          {rider.name}
                          <span className="mt-2 text-xs text-gray-700">
                            <span className="font-mono bg-gray-100 p-1 rounded">
                              {rider.vendor_id
                                ? `FP${rider.vendor_id}_${rider.rider_id}`
                                : `DKT_${rider.rider_id}`}
                            </span>
                          </span>
                          <span className="mt-2 text-xs text-gray-700">
                            {
                            new Date(rider.updated_at).toLocaleString(
                                  "en-IN",
                                  {
                                    timeZone: "Asia/Kolkata",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: true,
                                  }
                                )}
                          </span>
                        </p>
                        <p>📍 Lat: {Number(rider.latitude)?.toFixed(4)}</p>
                        <p>📍 Lng: {Number(rider.longitude)?.toFixed(4)}</p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default VendorRidersMap;
