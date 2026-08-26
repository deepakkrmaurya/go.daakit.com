
// import { useEffect, useState } from "react";
// import { Search, X } from "lucide-react";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";

// const baseURL = import.meta.env.VITE_BASE_URL;

// const Searching = () => {
//   const [query, setQuery] = useState("");
//   const [order, setOrders] = useState({});
//   const [close, Setclose] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

//   const navigate = useNavigate();

//   // Navigate with data
//   const goToPage = () => {
//     Setclose(false)
//     navigate("/techbased_merchant/order-tracking", {
//       state: order,
//     });
//   };

//   const fetchOrders = async () => {
//     if (!query.trim()) {
//       setOrders({});
//       Setclose(false);
//       return;
//     }

//     try {
//       setIsLoading(true);

//       const res = await axios.get(
//         `${baseURL}/api/techbasedmerchant/getOrderDetailsByMerchant`,
//         {
//           params: {
//             awb_number: query,
//             token: localStorage.getItem("token"),
//           },
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );

//       setOrders(res.data || {});
//       Setclose(true);
//     } catch (err) {
//       toast.error(
//         err.response?.data?.message ||
//         err.message ||
//         "An error occurred while fetching orders."
//       );
//       Setclose(false);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Debounce search
//   useEffect(() => {
//     const delayDebounceFn = setTimeout(() => {
//       if (query.length > 0) fetchOrders();
//     }, 500);

//     return () => clearTimeout(delayDebounceFn);
//   }, [query]);

//   // ORDER DETAILS COMPONENT
//   const OrderDetails = ({ order, goToPage }) => {
//     return (
//       <div
//         onClick={goToPage}
//         className="mt-32 sm:mt-30 bg-[rgb(86,78,193)] p-3 sm:p-4 rounded-lg text-white shadow-lg border border-green-100 relative cursor-pointer"
//       >
//         {/* Close Button */}
//         <button
//           onClick={(e) => {
//             e.stopPropagation();
//             Setclose(false);
//             setOrders({});
//             setQuery("");
//           }}
//           className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
//         >
//           <X size={16} />
//         </button>

//         <div className="space-y-2 sm:space-y-3 text-sm sm:text-base">
//           <p className="flex gap-2">
//             <span className="font-semibold min-w-[80px]">AWB:</span>
//             <span className="text-green-400">
//               {order?.order?.awb_number || "N/A"}
//             </span>
//           </p>

//           <p className="flex gap-2">
//             <span className="font-semibold min-w-[80px]">Status:</span>
//             <span
//               className={`px-2 py-1 rounded-full text-xs font-medium ${order?.order?.status === "delivered"
//                   ? "bg-green-500" :
//                   order?.order?.status === "booked"
//                     ? "bg-green-500"
//                     : order?.order?.status === "cancelled"
//                       ? "bg-red-500"
//                       : order?.order?.status === "pending"
//                         ? "bg-blue-500"
//                         : "bg-gray-500"
//                 }`}
//             >
//               {order?.order?.status || "Unknown"}
//             </span>
//           </p>

//           <p className="flex gap-2">
//             <span className="font-semibold min-w-[80px]">Delivery City:</span>
//             <span>{order?.order?.delivery_city || "N/A"}</span>
//           </p>

//           {order?.order?.customer_name && (
//             <p className="flex gap-2">
//               <span className="font-semibold min-w-[80px]">Customer:</span>
//               <span>{order?.order?.customer_name}</span>
//             </p>
//           )}

//           {order?.order?.order_date && (
//             <p className="flex gap-2">
//               <span className="font-semibold min-w-[80px]">Order Date:</span>
//               <span>
//                 {new Date(order?.order?.order_date).toLocaleDateString()}
//               </span>
//             </p>
//           )}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="relative w-full max-w-md mx-auto lg:mx-0">
//       {/* Search Input */}
//       <div className="relative">
//         <input
//           type="text"
//           placeholder="Enter AWB/Order Number"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           className="w-full px-10 py-2 sm:py-2 pl-10 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-[rgb(86,78,193)] placeholder-[rgb(86,78,193)] text-sm sm:text-base"
//         />

//         {/* Search Icon */}
//         <Search
//           size={19}
//           className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//         />

//         {/* Clear / Loader */}
//         {query && (
//           <button
//             onClick={() => {
//               setQuery("");
//               setOrders({});
//               Setclose(false);
//             }}
//             className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
//           >
//             {isLoading ? (
//               <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500" />
//             ) : (
//               <X size={16} />
//             )}
//           </button>
//         )}
//       </div>

//       {/* No Results */}
//       {close && !order?.order?.awb_number && query && (
//         <div className="mt-3 bg-yellow-900 p-3 rounded-lg text-white">
//           No order found with AWB: <span className="font-mono">{query}</span>
//         </div>
//       )}

//       {/* Order Details Block */}
//       {close && order?.order?.awb_number && (
//         <OrderDetails order={order} goToPage={goToPage} />
//       )}
//     </div>
//   );
// };

// export default Searching;
import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const baseURL = import.meta.env.VITE_BASE_URL;

const Searching = () => {
  const [query, setQuery] = useState("");
  const [order, setOrders] = useState({});
  const [close, Setclose] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // Navigate with data
  const goToPage = () => {
    navigate("/techbased_merchant/order-tracking", {
      state: order,
    });
  };

  const fetchOrders = async () => {
    if (!query.trim()) {
      setOrders({});
      Setclose(false);
      return;
    }

    try {
      setIsLoading(true);

      const res = await axios.get(
        `${baseURL}/api/techbasedmerchant/getOrderDetailsByMerchant`,
        {
          params: {
            awb_number: query,
            token: localStorage.getItem("token"),
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setOrders(res.data || {});
      Setclose(true);
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "An error occurred while fetching orders."
      );
      Setclose(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const delay = setTimeout(() => {
      if (query.length > 0) fetchOrders();
    }, 500);

    return () => clearTimeout(delay);
  }, [query]);

  // ORDER DETAILS COMPONENT
  const OrderDetails = ({ order }) => {
    return (
      <div className="bg-[rgb(86,78,193)] p-4 rounded-lg text-white shadow-lg border border-green-100 relative">

        {/* Close Button */}
        <button
          onClick={() => {
            Setclose(false);
            setOrders({});
            setQuery("");
          }}
          className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 
                     text-white rounded-full p-1 transition-colors"
        >
          <X size={16} />
        </button>

        <div className="space-y-2 text-sm sm:text-base">
          <p className="flex gap-2">
            <span className="font-semibold w-24">AWB:</span>
            <span className="text-green-400">
              {order?.order?.awb_number || "N/A"}
            </span>
          </p>

          <p className="flex gap-2">
            <span className="font-semibold w-24">Status:</span>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                order?.order?.status === "delivered"
                  ? "bg-green-500"
                  : order?.order?.status === "booked"
                  ? "bg-green-500"
                  : order?.order?.status === "cancelled"
                  ? "bg-red-500"
                  : order?.order?.status === "pending"
                  ? "bg-blue-500"
                  : "bg-gray-500"
              }`}
            >
              {order?.order?.status || "Unknown"}
            </span>
          </p>

          <p className="flex gap-2">
            <span className="font-semibold w-24">Delivery City:</span>
            <span>{order?.order?.delivery_city || "N/A"}</span>
          </p>

          {order?.order?.customer_name && (
            <p className="flex gap-2">
              <span className="font-semibold w-24">Customer:</span>
              <span>{order?.order?.customer_name}</span>
            </p>
          )}

          {order?.order?.order_date && (
            <p className="flex gap-2">
              <span className="font-semibold w-24">Order Date:</span>
              <span>
                {new Date(order?.order?.order_date).toLocaleDateString()}
              </span>
            </p>
          )}
        </div>

        {/* Track Order Button */}
        <button
          onClick={goToPage}
          className="mt-3 bg-white text-[rgb(86,78,193)] font-medium px-4 py-1 rounded"
        >
          Track Order
        </button>
      </div>
    );
  };

  return (
    <div className="relative mt-20 w-full border max-w-md mx-auto lg:mx-0">

      {/* Search Box */}
      <div className="mt-20 ">
        <input
          type="text"
          placeholder="Enter AWB/Order Number"
          // value={query}
          // onChange={(e) => setQuery(e.target.value)}
          className="w-full px-10 py-2 rounded-lg border border-gray-300 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 
                     bg-white text-[rgb(86,78,193)] placeholder-[rgb(86,78,193)]"
        />

        <Search
          size={19}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setOrders({});
              Setclose(false);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500" />
            ) : (
              <X size={16} />
            )}
          </button>
        )}
      </div>

      {/* No Result Found */}
      {close && !order?.order?.awb_number && query && (
        <div className="mt-3 bg-yellow-900 p-3 rounded-lg text-white">
          No order found with AWB: <span className="font-mono">{query}</span>
        </div>
      )}

      {/* Order Details */}
      {/* close && order?.order?.awb_number */}
      { close && order?.order?.awb_number && (
        <OrderDetails order={order} />
      )}
    </div>
  );
};

export default Searching;

