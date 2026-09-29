import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Monitor,
  Pencil,
  Trash2,
  CheckCircle2,
} from "lucide-react";

const ChannelList = () => {
  const navigate = useNavigate();

  // API data aane par is array me set kar dena
  const channels = [
    {
      id: 1,
      type: "shopify",
      name: "shopify",
      storeName: "hjdf",
      connected: true,
    },
  ];

  const handleEdit = (channel) => {
    console.log("Edit:", channel);
  };

  const handleRemove = (channel) => {
    console.log("Remove:", channel);
  };

  return (
    <div className="min-h-screen bg-[#f7f9fc] dark:bg-[#080d17]">
      {/* Header */}
      <div className="">
        <div className="flex flex-col gap-4 px-5 py-7 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <div>
            <h1 className="text-[26px] font-bold tracking-tight dark:text-white">
              Channel Details
            </h1>

            <p className="mt-1 text-[12px] dark:text-blue-100">
              Manage your integrated sales channels and sync settings.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/merchant/channels/integrate")}
            className="inline-flex h-11 w-fit items-center justify-center gap-2 rounded-sm bg-[#0446DB] px-5 text-sm font-semibold text-white "
          >
            <Plus className="h-4 w-4" />
            New Channel
          </button>
        </div>
      </div>

      {/* Content */}
      <main className="px-5 ">
        <div className="overflow-hidden rounded-sm border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-[#0d1421]">
          {/* Card title */}
          <div className="border-b border-slate-200 px-5 py-4 dark:border-slate-800">
            <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
              Channel
            </h2>
          </div>

          {/* Desktop Table */}
          {/* Desktop Table */}
<div className="w-full overflow-x-auto">
  <table className="w-full min-w-[800px] border-collapse">
    <thead>
      <tr className="bg-[#f5f7fa] dark:bg-slate-900">
        <th className="px-5 py-3 text-center text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Channel Image
        </th>

        <th className="px-5 py-3 text-center text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Channel Name
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
      {channels.length > 0 ? (
        channels.map((channel) => (
          <tr
            key={channel.id}
            className="border-t border-slate-100 text-center transition hover:bg-slate-50/60 dark:border-slate-800 dark:hover:bg-slate-900/50"
          >
            {/* Channel Image */}
            <td className="px-5 py-4">
              <div className="flex justify-center">
                <ChannelLogo type={channel.type} />
              </div>
            </td>

            {/* Channel Name */}
            <td className="px-5 py-4 text-center">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                {channel.name}
              </p>

              <p className="mt-0.5 text-[10px] text-slate-400">
                {channel.type === "shopify" ? "Shopify" : "Easycom"}
              </p>
            </td>

            {/* Store Name */}
            <td className="px-5 py-4 text-center">
              <span className="text-sm text-slate-700 dark:text-slate-300">
                {channel.storeName || "—"}
              </span>
            </td>

            {/* Action */}
            <td className="px-5 py-4">
              <div className="flex flex-wrap items-center justify-center gap-2">
                {channel.connected && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    Connected
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => handleEdit(channel)}
                  className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-slate-200 px-3 text-xs font-medium text-slate-500 transition hover:border-[#0446DB] hover:text-[#0446DB] dark:border-slate-700 dark:text-slate-300"
                >
                  <Pencil className="h-3 w-3" />
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() => handleRemove(channel)}
                  className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-red-200 px-3 text-xs font-medium text-red-500 transition hover:bg-red-50 dark:border-red-500/30 dark:hover:bg-red-500/10"
                >
                  <Trash2 className="h-3 w-3" />
                  Remove
                </button>
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

const ChannelLogo = ({ type }) => {
  if (type === "shopify") {
    return (
      <div className="flex h-11 w-11 items-center justify-center rounded-sm border border-lime-200 bg-lime-50 text-lg font-bold text-[#78b83e] dark:border-lime-500/20 dark:bg-lime-500/10">
        S
      </div>
    );
  }

  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-sm bg-[#0968e8] font-bold text-white">
      E
    </div>
  );
};

const EmptyContent = () => (
  <div className="flex flex-col items-center justify-center px-5 text-center">
    <div className="flex h-12 w-12 items-center justify-center rounded-sm bg-slate-100 dark:bg-slate-800">
      <Monitor className="h-5 w-5 text-slate-300 dark:text-slate-500" />
    </div>

    <h3 className="mt-3 text-sm font-semibold text-slate-500 dark:text-slate-300">
      No channels connected yet
    </h3>

    <p className="mt-2 text-xs text-slate-400">
      Click New Channel to integrate Shopify or Easycom.
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