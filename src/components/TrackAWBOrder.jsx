import axios from "axios";
import { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import moment from "moment";
import { useSearchParams } from "react-router-dom";
import Loader from "./Loader";
import { toast } from "react-toastify";

const baseURL = import.meta.env.VITE_BASE_URL;

function TrackAWBOrder() {
  const [loading, setLoading] = useState(false);
  const [searchParams]= useSearchParams();
  const [awbNumber, setAwbNumber] = useState(searchParams.get('awb_number'));
  const [trackingHistory, setTrackingHistory] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    setTrackingHistory([]);
    try {
      const res = await axios.post(`${baseURL}/api/tracking/trackawb`, {
        awb_number: awbNumber,
      });
      if (res.data?.success) {
        setTrackingHistory(res.data.tracking_history || []);
      } else {
        setError(res.data.message || "Tracking data not found.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Error fetching tracking history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    if(awbNumber){
      handleSearch();
    }
  },[])

  return (
    <div className="min-h-screen bg-white pb-10">
      {/* Top Bar */}
      <div className="fixed top-0 w-full h-17 bg-[#0446DB] shadow-md z-30 flex items-center px-6">
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-xl font-semibold text-white">
          DAAKit GO
        </h1>
      </div>

      {/* Search Bar */}
      <form
        className="flex flex-col items-center justify-center mt-28"
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
      >
        <div className="flex w-full max-w-md rounded-lg shadow-lg border-2 border-[#0446DB] overflow-hidden">
          <input
            type="text"
            placeholder="Enter AWB Number"
            value={awbNumber}
            onChange={(e) => setAwbNumber(e.target.value)}
            className="flex-grow px-4 py-2 text-sm text-black bg-white focus:outline-none"
          />
          <button
            type="submit"
            className="bg-[#0446DB] px-4 text-white hover:bg-indigo-700 transition"
          >
            <FaSearch />
          </button>
        </div>
      </form>

      {/* Tracking History */}
      {loading ? <Loader/> : 
        <div className="flex justify-center mt-6 px-4">
          <div className="w-full max-w-2xl">
            {loading && <p className="text-gray-500 text-center">Loading tracking history...</p>}
            {error && <p className="text-red-500 text-center">{error}</p>}

            {trackingHistory.length > 0 && (
              <div className="bg-gray-50 rounded-xl shadow-md p-6">
                <h2 className="text-lg font-semibold text-[#0446DB] mb-4 text-center">
                  Tracking History
                </h2>

                <div className="relative border-l-4 border-[#0446DB] pl-6">
                  {trackingHistory.map((item, index) => {
                    
                    return (
                      <div key={item.id} className="mb-8 relative pl-6">
  {/* Timeline Connector Line */}
  <div className="absolute left-0 top-6 bottom-0 w-0.5 bg-gradient-to-b from-[#0446DB] to-gray-200"></div>
  
  {/* Dot */}
  <div className="absolute left-0 top-1.5 transform -translate-x-1/2">
    <div className="relative">
      <div className="w-4 h-4 rounded-full bg-white border-3 border-[#0446DB] shadow-lg shadow-[#0446DB]/20"></div>
      <div className="absolute inset-0 rounded-full bg-[#0446DB] animate-ping opacity-20"></div>
    </div>
  </div>

  {/* Content Card */}
  <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm hover:shadow-md transition-all duration-300 p-4 group hover:border-[#0446DB]/20">
    {/* Status & Time */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
      <div className="flex items-center gap-2">
        <span className="text-sm font-bold text-gray-900 capitalize tracking-wide">
          {item.status}
        </span>
        <div className="w-1 h-1 rounded-full bg-gray-400"></div>
        <span className="text-xs font-medium text-[#0446DB] bg-[#0446DB]/10 px-2 py-1 rounded-full">
          {moment(item.event_time).format("DD MMM YYYY")}
        </span>
      </div>
      <span className="text-xs text-gray-500 font-medium">
        {moment(item.event_time).format("hh:mm A")}
      </span>
    </div>

    {/* Remarks */}
    <p className="text-sm text-gray-700 leading-relaxed mb-3 group-hover:text-gray-900 transition-colors">
      {item.remarks}
    </p>

    {/* Updated By */}
    {/* {item.updated_by && (
      <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
        <div className="w-6 h-6 bg-gradient-to-br from-[#0446DB] to-[rgb(110,103,214)] rounded-full flex items-center justify-center text-white text-xs font-bold">
          {item.updated_by.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-xs text-gray-500 font-medium">Updated by</p>
          <p className="text-xs text-gray-700 font-semibold">{item.updated_by}</p>
        </div>
      </div>
    )} */}
  </div>
</div>
                    // <div key={item.id} className="mb-8 relative">
                    //   {/* Dot */}
                    //   <div className="absolute -left-3 top-1.5 w-3 h-3 rounded-full bg-[#0446DB] border-2 border-white shadow-md"></div>

                    //   <div>
                    //     <p className="text-sm font-semibold text-gray-800 capitalize">
                    //       {item.status}
                    //     </p>
                    //     <p className="text-xs text-gray-500">
                    //       {moment(item.event_time).format("DD MMM YYYY, hh:mm A")}
                    //     </p>
                    //     <p className="text-sm text-gray-600 mt-1">{item.remarks}</p>
                    //     {item.updated_by && (
                    //       <p className="text-xs text-gray-400 mt-1">Updated by: {item.updated_by}</p>
                    //     )}
                    //   </div>
                    // </div>
                  )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      
      }

    </div>
  );
}

export default TrackAWBOrder;
