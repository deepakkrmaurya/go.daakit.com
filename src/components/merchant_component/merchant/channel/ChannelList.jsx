import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Monitor,
  Pencil,
  Trash2,
} from "lucide-react";
import AxiosInstance from "../../../../Helper/axiosInstance";
import easyCom  from '@/assets/Easycom.png'
const ChannelList = () => {
  const navigate = useNavigate();

  const [channelsList, setChannelsList] = useState([]);
  const [loading, setLoading] = useState(false);

  // =========================
  // GET CHANNELS
  // =========================
  const getChannels = async () => {
    try {
      setLoading(true);

      const res = await AxiosInstance.get(
        "/api/oms/easyecom/getOmsConnections"
      );

      console.log("Channels Response:", res?.data?.data);

      setChannelsList(
        Array.isArray(res?.data?.data) ? res.data.data : []
      );
    } catch (error) {
      console.error(
        "Get Channels Error:",
        error?.response?.data || error
      );

      setChannelsList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (channel) => {
    console.log("Edit:", channel);

    // Example:
    // navigate(`/merchant/channels/edit/${channel.connection_id}`, {
    //   state: channel,
    // });
  };

  const handleRemove = (channel) => {
    console.log("Remove:", channel);
  };

  useEffect(() => {
    getChannels();
  }, []);

  return (
    <div className="min-h-screen bg-[#f7f9fc] dark:bg-[#080d17]">
      {/* Header */}
      <div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-[26px] font-bold tracking-tight text-slate-900 dark:text-white">
              Channel Details
            </h1>

            <p className="mt-1 text-[12px] text-slate-500 dark:text-blue-100">
              Manage your integrated sales channels and sync settings.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/merchant/channels/integrate")}
            className="inline-flex h-7 w-fit items-center justify-center gap-2 rounded-sm bg-[#0446DB] px-3 text-sm font-semibold text-white"
          >
            <Plus className="h-4 w-4" />
            New Channel
          </button>
        </div>
      </div>

      {/* Content */}
      <main className="py-3">
        <div className="overflow-hidden rounded-sm border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#0d1421]">
          {/* Card Header */}
          <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Channel
            </h2>
          </div>

          {/* Table */}
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse">
              <thead>
                <tr className="bg-[#f5f7fa] dark:bg-slate-900">
                  

                  <th className="px-5 py-3 text-center text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Channel Name
                  </th>
                  <th className="px-5 py-3 text-center text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Connection Name
                  </th>

                  <th className="px-5 py-3 text-center text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Store Name
                  </th>

                  <th className="px-5 py-3 text-center text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {/* Loading */}
                {loading ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="h-[220px] text-center text-sm text-slate-500 dark:text-slate-400"
                    >
                      Loading channels...
                    </td>
                  </tr>
                ) : channelsList.length > 0 ? (
                  channelsList.map((channel) => (
                    <tr
                      key={channel.connection_id}
                      className="border-t border-slate-100 text-center transition hover:bg-slate-50/60 dark:border-slate-800 dark:hover:bg-slate-900/50"
                    >
                      
                      {/* Channel Name */}
                      <td className="px-5 py-4  text-center">
                        <div className=" flex justify-center items-center gap-2">
                          <div className=" h-10 w-10 rounded-sm">
                        <img src={easyCom} height={10} className=" rounded-sm" alt="" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          {channel.provider_name || "—"}
                        </p>

                        <p className="mt-0.5 text-[10px] uppercase text-slate-400">
                          {channel.provider_code || "—"}
                        </p>
                        </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center">
                        <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                          {channel.connection_name || "—"}
                        </p>
                        </td>

                      {/* Store Name */}
                      <td className="px-5 py-4 text-center">
                       

                        {channel.credentials?.email && (
                          <p className="mt-1 text-sm text-slate-400">
                            {channel.credentials.email}
                          </p>
                        )}
                      </td>

                      {/* Action */}
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap items-center justify-center gap-2">
                          {/* Active Status */}
                          {channel.is_active === 1 ? (
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                              <span className="h-2 w-2 rounded-full bg-emerald-500" />
                              Connected
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400">
                              <span className="h-2 w-2 rounded-full bg-slate-400" />
                              Inactive
                            </span>
                          )}

                          
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <EmptyState />
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

// =========================
// CHANNEL LOGO
// =========================
const ChannelLogo = ({ type }) => {
  const provider = type?.toUpperCase();

  if (provider === "SHOPIFY") {
    return (
      <div className="flex h-11 w-11 items-center justify-center rounded-sm border border-lime-200 bg-lime-50 text-lg font-bold text-[#78b83e] dark:border-lime-500/20 dark:bg-lime-500/10">
        S
      </div>
    );
  }

  if (provider === "EASYECOM") {
    return (
      <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-[#0968e8] font-bold text-white">
        E
      </div>
    );
  }

  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-slate-100 font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-300">
      {type?.charAt(0)?.toUpperCase() || "?"}
    </div>
  );
};

// =========================
// EMPTY STATE
// =========================
const EmptyContent = () => (
  <div className="flex flex-col items-center justify-center px-5 text-center">
    <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-slate-100 dark:bg-slate-800">
      <Monitor className="h-5 w-5 text-slate-300 dark:text-slate-500" />
    </div>

    <h3 className="mt-3 text-sm font-semibold text-slate-500 dark:text-slate-300">
      No channels connected yet
    </h3>

    <p className="mt-2 text-xs text-slate-400">
      Click New Channel to integrate your sales channel.
    </p>
  </div>
);

const EmptyState = () => (
  <tr>
    <td colSpan={4} className="h-[220px]">
      <EmptyContent />
    </td>
  </tr>
);

export default ChannelList;