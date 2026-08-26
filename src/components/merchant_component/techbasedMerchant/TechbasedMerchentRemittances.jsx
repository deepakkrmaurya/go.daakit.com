
import axios from "axios";
import { useEffect, useState } from "react";
import Loader from "../../Loader";
import { toast } from "react-toastify";

const baseURL = import.meta.env.VITE_BASE_URL;

export default function TechbasedMerchentRemittances() {
  const [loading, setLoading] = useState(false);
  const [analytics, setAnalytics] = useState({});

  const [popupData, setPopupData] = useState(null);

  const getAnalytics = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${baseURL}/api/techbasedmerchant/getMerchantRemittanceSummary`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setAnalytics(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || "Error while fetching analytics");
    } finally {
      setLoading(false);
    }
  };

  const openPopUp = (remmitance)=>{
    setPopupData(remmitance);
  } 

  const closePopUp = () => {
    setPopupData(null);
  };

  useEffect(() => {
    getAnalytics();
  }, []);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="bg-gray-100 min-h-screen w-full">
          {/* Top Heading Stripe */}
          <div className="relative z-0 mb-6 bg-[rgb(85,77,192)] py-[24px] shadow-md h-30 px-[24px]">
            <div className="flex flex-wrap items-center justify-between">
              {/* Heading */}
              <h1 className="text-2xl text-white">Remittance</h1>
            </div>
          </div>

          <div className="max-w-full px-4 -mt-20 relative z-10">
            <div>
              <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col justify-center items-center bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100">
                    <span className="text-gray-600 font-medium">Total COD</span>
                    <span className="text-xl font-bold text-[rgb(85,77,192)]">
                      ₹{Number(analytics?.total_cod).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-col justify-center items-center bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100">
                    <span className="text-gray-600 font-medium">Remaining</span>
                    <span className="text-xl font-bold text-yellow-600">
                      ₹{Number(analytics?.remaining_cod_amount).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-col justify-center items-center bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-100">
                    <span className="text-gray-600 font-medium">Paid</span>
                    <span className="text-xl font-bold text-green-600">
                      ₹{Number(analytics?.total_paid_remittance_amount).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {analytics?.remittance_records?.length > 0 && (
              <div className="overflow-x-auto mt-8 rounded-xl shadow-md border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-[rgb(85,77,192)] text-white">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 whitespace-nowrap text-left text-sm font-semibold uppercase tracking-wider">
                        REMITTANCE AMOUNT
                      </th>
                      <th className="px-6 py-3 whitespace-nowrap text-left text-sm font-semibold uppercase tracking-wider">
                        FREIGHT DEDUCTION
                      </th>
                      <th className="px-6 py-3 whitespace-nowrap text-left text-sm font-semibold uppercase tracking-wider">
                        
                       {String('convenience FEE').toLocaleUpperCase()}
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                        AWB Number
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                        UTR Number
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider">
                        Uplode Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {analytics?.remittance_records.map((remittance) => (
                      <tr key={remittance.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm text-gray-800">
                          {remittance.id}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800">
                          ₹{Number(remittance.amount).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800">
                          ₹{Number(remittance.remittance_amount).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800">
                          ₹{Number(remittance.freight_deductions).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800">
                          ₹{Number(remittance.convenience_fee).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800">
                          {remittance.awb_number.split(',').length === 1 ? (
                            <>{remittance.awb_number}</>
                          ) : (
                            <>
                              <button
                                onClick={()=>openPopUp(remittance)}
                                className="hover:cursor-pointer"
                              >
                                {`${remittance.awb_number.split(',')[0]}...`}
                              </button>
                            </>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800">
                          {remittance.utr_number}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800">
                          {new Date(remittance.created_at).toLocaleString(
                            "en-IN",
                            {
                              timeZone: "Asia/Kolkata",
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            }
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 👇 Popup Modal */}
      {popupData && (
        <div className="fixed inset-0 bg-[rgba(46,46,46,0.5)] flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-h-[70vh] overflow-y-auto">
            <h2 className="text-lg font-semibold mb-4">AWB Numbers</h2>
            <ul className="list-disc pl-5 space-y-1">
              {popupData.awb_numbers.split(",").map((awb, idx) => (
                <li key={idx} className="text-gray-700">
                  {awb}
                </li>
              ))}
            </ul>
            <button
              onClick={closePopUp}
              className="mt-4 px-4 py-2 bg-[rgb(85,77,192)] text-white rounded hover:bg-indigo-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}


