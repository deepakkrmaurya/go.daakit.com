import Select from "react-select";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Loader from "../Loader";

// Fix default icon issue in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const baseURL = import.meta.env.VITE_BASE_URL;

function LiveLocation() {
  const [loading, setLoading] = useState(false);
  const [vendor, setVendor] = useState("");
  const [vendorsOption, setVendorsOption] = useState([]);
  const [riders, setRiders] = useState([]);

//   const fetchVendors = async (input) => {
//     setLoading(true);

//     try {
//       const res = await axios.get(`${baseURL}/api/merchant/getVendorRiders`, {
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

  const getLocations = async (input) => {
    setLoading(true);
    let vendor_id = null;
    let rider_type = null;
    if(!input){
        vendor_id = null;
        rider_type = null;
    }
    else if (input === "self") {
      rider_type = "self";
    } else {
      vendor_id = input;
    }
    try {
      const res = await axios.get(`${baseURL}/api/merchant/getRidersLocation`, {
        params: { vendor_id, rider_type },
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
    // fetchVendors();
  }, []);
  const defaultCenter =
    riders.length > 0
      ? [riders[0].latitude, riders[0].longitude]
      : [28.6139, 77.209]; // Default to New Delhi

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="bg-gray-100 min-h-screen w-full">
          {/* Heading Strip */}
          <div className="relative z-0 mb-6 bg-[rgb(85,77,192)] py-[33px] shadow-md h-38 px-[24px]">
            <div className="flex flex-wrap items-center justify-between w-full">
              {/* Heading */}
              <h1 className="text-2xl text-white">Live Location</h1>
              {/* <div className="ml-auto w-[200px] z-50 relative">
                <Select
                  required
                  options={vendorsOption}
                  isSearchable
                  value={vendorsOption.find((option) => option.value === vendor)}
                  onChange={(selectedOption) => {
                    setVendor(selectedOption?.value)
                    getLocations(selectedOption?.value)
                  }}
                  placeholder="Select Vendor"
                  className="text-sm"
                  classNamePrefix="react-select"
                  menuPortalTarget={document.body} // Renders menu at top level
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    menu: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                />
              </div> */}
            </div>
          </div>
          <div className="px-2 z-99 ">
            <div className="-mt-16 md:-mt-24 relative ">
              <MapContainer
                 className=" z-10"
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

export default LiveLocation;
