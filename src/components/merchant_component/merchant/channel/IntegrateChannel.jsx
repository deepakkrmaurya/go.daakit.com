import React, { useState } from "react";
import { ShoppingBag, ArrowRight, Store, PackageCheck, Mail, KeyRound, EyeOff, Eye, MapPin, Warehouse, Loader2 } from "lucide-react";
import easyCom  from '@/assets/Easycom.png'
import { Button } from "@/components/ui/button";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import toast from "react-hot-toast";
import AxiosInstance from "@/Helper/axiosInstance";
import { useNavigate } from "react-router-dom";

const IntegrateChannel = () => {
  return (
    <div className="min-h-screen bg-[#f7f9fc] dark:bg-[#080d17]">
      <div className="">
        <div className="">
          <h1 className="text-[26px] font-bold tracking-tight dark:text-white">
            Integrate Channel
          </h1>

          <p className="mt-1 text-[12px] dark:text-blue-100">
            Choose a platform to connect with your DAAKIT Go account.
          </p>
        </div>
      </div>

      <main className=" py-3">
        <div className="grid max-w-[720px] grid-cols-1 gap-5 sm:grid-cols-2">
          {/* SHOPIFY */}
          {/* <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-[#0d1421]">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
              <h2 className="text-[15px] font-bold text-slate-900 dark:text-white">
                Shopify
              </h2>

              <ShopifyDialog />
            </div>

            <div className="flex min-h-[205px] flex-col items-center justify-center px-7 py-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#8DBE3F] shadow-sm">
                <ShoppingBag
                  className="h-8 w-8 text-white"
                  strokeWidth={2.3}
                />
              </div>

              <p className="mt-5 max-w-[230px] text-xs leading-5 text-slate-500 dark:text-slate-400">
                Sync orders from your Shopify store automatically.
              </p>
            </div>
          </div> */}

          {/* EASYCOM */}
          <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-[#0d1421]">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
              <h2 className="text-[15px] font-bold text-slate-900 dark:text-white">
                Easycom
              </h2>

              <EasycomDialog />
            </div>

            <div className="flex min-h-[205px] flex-col items-center justify-center px-7 py-8 text-center">
              <div className="h-16 w-16 overflow-hidden rounded-xl">
                <img
                  src={easyCom}
                  alt="EasyEcom"
                  className="h-full w-full object-cover"
                />
              </div>

              <p className="mt-5 max-w-[230px] text-xs leading-5 text-slate-500 dark:text-slate-400">
                Connect Easycom marketplace orders seamlessly.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

/* =========================
   SHOPIFY DIALOG
========================= */

const ShopifyDialog = () => {
  const handleContinue = () => {
    console.log("Shopify Integration");
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger
       
      >
         <Button
            type="button"
            className="h-9 cursor-pointer gap-1.5 rounded-lg bg-[#1263e9] px-4 text-xs font-semibold text-white shadow-sm hover:bg-[#0446DB]"
          >

        Integrate
        <ArrowRight className="h-3.5 w-3.5" />
          </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="max-w-md overflow-hidden rounded-2xl border-slate-200 bg-white p-0 dark:border-slate-800 dark:bg-[#0d1421]">
        <div className="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#8DBE3F]/10">
            <ShoppingBag className="h-5 w-5 text-[#78a934]" />
          </div>

          <AlertDialogHeader className="text-left">
            <AlertDialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
              Integrate Shopify
            </AlertDialogTitle>

            <AlertDialogDescription className="mt-1 leading-6 text-slate-500 dark:text-slate-400">
              Connect your Shopify store with DAAKIT Go to automatically
              sync orders and shipment updates.
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>

        <div className="px-6 py-5">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
            <div className="flex gap-3">
              <Store className="mt-0.5 h-5 w-5 shrink-0 text-[#0446DB]" />

              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Shopify Store
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                  You will need your Store URL, API Key, Admin API Access
                  Token and API Secret Key.
                </p>
              </div>
            </div>
          </div>
        </div>

        <AlertDialogFooter className="border-t border-slate-200 bg-slate-50 px-6 my-1 dark:border-slate-800 dark:bg-slate-900/40">
          <AlertDialogCancel className="cursor-pointer">
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleContinue}
            className="cursor-pointer bg-[#0446DB] text-white hover:bg-[#0339b4]"
          >
            Continue
            <ArrowRight className="ml-2 h-4 w-4" />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

/* =========================
   EASYCOM DIALOG
========================= */



const EasycomDialog = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
    api_key: "",
    location_key: "",
    location_name: "",
    local_warehouse_id: "",
    connection_name: "default",
    environment: "production",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm({
      email: "",
      password: "",
      api_key: "",
      location_key: "",
      location_name: "",
      local_warehouse_id: "",
      connection_name: "default",
      environment: "production",
    });

    setShowPassword(false);
  };


  const navigate = useNavigate()

  const handleContinue = async (e) => {
    e?.preventDefault();

    if (loading) return;

    if (!form.email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!form.password.trim()) {
      toast.error("Password is required");
      return;
    }

    if (!form.api_key.trim()) {
      toast.error("API key is required");
      return;
    }

    if (!form.location_key.trim()) {
      toast.error("Location key is required");
      return;
    }

    if (!form.location_name.trim()) {
      toast.error("Location name is required");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        email: form.email.trim(),
        password: form.password,
        api_key: form.api_key.trim(),
        location_key: form.location_key.trim(),
        location_name: form.location_name.trim(),

        
      };

      console.log("EasyEcom Payload:", payload);

      const response = await AxiosInstance.post(
        "/api/oms/easyecom/get_tooken",
        payload
      );

      if (response?.data?.success === false) {
        throw new Error(
          response?.data?.message ||
            "Unable to connect EasyEcom account"
        );
      }

      toast.success(
        response?.data?.message ||
          "EasyEcom integrated successfully"
      );

      setOpen(false);
      resetForm();
      navigate('/merchant/channels')

      // Agar OMS list refresh karni ho:
      // getOms();
    } catch (error) {
      console.error(
        "EasyEcom integration error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to integrate EasyEcom"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={(value) => {
        if (loading) return;
        setOpen(value);
      }}
    >
      {/* ================= TRIGGER ================= */}

      <AlertDialogTrigger asChild>
        <Button
          type="button"
          className="h-9 cursor-pointer gap-1.5 rounded-lg bg-[#0446DB] px-4 text-xs font-semibold text-white shadow-sm hover:bg-[#0446DB]"
        >
          Integrate

          <ArrowRight className="h-3.5 w-3.5" />
        </Button>
      </AlertDialogTrigger>

      {/* ================= DIALOG ================= */}

      <AlertDialogContent
        className="
          flex
          max-h-[95dvh]
          w-[calc(100%-24px)]
          max-w-xl
          flex-col
          overflow-hidden
          rounded-2xl
          border-slate-200
          bg-white
          p-0
          dark:border-slate-800
          dark:bg-[#0d1421]
          sm:max-h-[90vh]
        "
      >
        {/* ================= HEADER ================= */}

        <div className="shrink-0 border-b border-slate-200 px-4 py-4 dark:border-slate-800 sm:px-6 sm:py-5">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
              <img
                src={easyCom}
                alt="EasyEcom"
                className="h-full w-full object-contain"
              />
            </div>

            <AlertDialogHeader className="min-w-0 flex-1 text-left">
              <AlertDialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
                Integrate EasyEcom
              </AlertDialogTitle>

              <AlertDialogDescription className="mt-1 text-sm leading-5 text-slate-500 dark:text-slate-400 sm:leading-6">
                Connect your EasyEcom account with
                DAAKIT Go to manage and sync marketplace
                orders.
              </AlertDialogDescription>
            </AlertDialogHeader>
          </div>
        </div>

        {/* ================= SCROLLABLE BODY ================= */}

        <div
          className="
            min-h-0
            flex-1
            overflow-y-auto
            overscroll-contain
            px-4
            py-4
            sm:px-6
            sm:py-5
          "
        >
          {/* ACCOUNT INFO */}

          <div className="mb-5 rounded-xl border border-blue-100 bg-blue-50/60 p-4 dark:border-blue-500/20 dark:bg-blue-500/5">
            <div className="flex gap-3">
              <PackageCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#0446DB]" />

              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  EasyEcom Account
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                  Enter your EasyEcom credentials and
                  location details to complete the
                  integration.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* ================= EMAIL ================= */}

            <InputField
              label="Email"
              name="email"
              type="email"
              required
              placeholder="Enter EasyEcom email"
              value={form.email}
              onChange={handleChange}
              icon={Mail}
            />

            {/* ================= PASSWORD ================= */}

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Password{" "}
                <span className="text-red-500">
                  *
                </span>
              </label>

              <div className="relative">
                <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Enter EasyEcom password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  className="
                    h-11
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    pl-10
                    pr-11
                    text-sm
                    text-slate-800
                    outline-none
                    transition
                    placeholder:text-slate-400
                    focus:border-[#0446DB]
                    focus:bg-white
                    focus:ring-4
                    focus:ring-blue-500/10
                    dark:border-slate-700
                    dark:bg-slate-900
                    dark:text-white
                    dark:placeholder:text-slate-500
                    dark:focus:border-blue-500
                    dark:focus:bg-slate-900
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (prev) => !prev
                    )
                  }
                  className="
                    absolute
                    right-3
                    top-1/2
                    flex
                    h-8
                    w-8
                    -translate-y-1/2
                    items-center
                    justify-center
                    rounded-lg
                    text-slate-400
                    transition
                    hover:bg-slate-100
                    hover:text-slate-700
                    dark:hover:bg-slate-800
                    dark:hover:text-slate-200
                  "
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* ================= API KEY ================= */}

            <InputField
              label="API Key"
              name="api_key"
              type="text"
              required
              placeholder="Enter API key"
              value={form.api_key}
              onChange={handleChange}
              icon={KeyRound}
            />

            {/* ================= LOCATION ================= */}

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <InputField
                label="Location Key"
                name="location_key"
                type="text"
                required
                placeholder="Location key"
                value={form.location_key}
                onChange={handleChange}
                icon={MapPin}
              />

              <InputField
                label="Location Name"
                name="location_name"
                type="text"
                required
                placeholder="Location name"
                value={form.location_name}
                onChange={handleChange}
                icon={MapPin}
              />
            </div>

            {/* 
              Agar future me ye fields show karne hain:

              <InputField
                label="Local Warehouse ID"
                name="local_warehouse_id"
                required
                placeholder="Enter local warehouse ID"
                value={form.local_warehouse_id}
                onChange={handleChange}
                icon={Warehouse}
              />

              <InputField
                label="Connection Name"
                name="connection_name"
                required
                placeholder="default"
                value={form.connection_name}
                onChange={handleChange}
                icon={PackageCheck}
              />

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Environment
                </label>

                <select
                  name="environment"
                  value={form.environment}
                  onChange={handleChange}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-800 outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-white"
                >
                  <option value="production">
                    Production
                  </option>

                  <option value="sandbox">
                    Sandbox
                  </option>
                </select>
              </div>
            */}
          </div>
        </div>

        {/* ================= FIXED FOOTER ================= */}

        <AlertDialogFooter
          className="
            shrink-0
            border-t
            border-slate-200
            bg-white
            px-4
            my-0
            dark:border-slate-800
            dark:bg-[#0d1421]
            sm:flex-row
            sm:justify-end
            sm:gap-2
            sm:px-6
            sm:py-4
          "
        >
          <AlertDialogCancel
            disabled={loading}
            className="
              m-0
              h-10
              w-full
              cursor-pointer
              rounded-lg
              border-slate-200
              bg-white
              text-slate-700
              hover:bg-slate-50
              disabled:cursor-not-allowed
              disabled:opacity-60
              dark:border-slate-700
              dark:bg-slate-900
              dark:text-slate-200
              dark:hover:bg-slate-800
              sm:w-auto
              sm:min-w-[90px]
            "
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            type="button"
            disabled={loading}
            onClick={handleContinue}
            className="
              m-0
              h-10
              w-full
              min-w-[120px]
              cursor-pointer
              rounded-lg
              bg-[#0446DB]
              text-white
              shadow-sm
              transition
              hover:bg-[#0339b4]
              disabled:cursor-not-allowed
              disabled:opacity-60
              sm:w-auto
            "
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                Integrate
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

/* =========================================================
   INPUT FIELD
========================================================= */

const InputField = ({
  label,
  required,
  icon: Icon,
  ...props
}) => {
  return (
    <div className="w-full">
      <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        )}

        <input
          {...props}
          className={`
            h-11
            w-full
            rounded-xl
            border
            border-slate-200
            bg-slate-50
            ${Icon ? "pl-10" : "pl-3"}
            pr-3
            text-sm
            text-slate-800
            outline-none
            transition
            placeholder:text-slate-400
            focus:border-[#0446DB]
            focus:bg-white
            focus:ring-4
            focus:ring-blue-500/10
            dark:border-slate-700
            dark:bg-slate-900
            dark:text-white
            dark:placeholder:text-slate-500
            dark:focus:border-blue-500
            dark:focus:bg-slate-900
          `}
        />
      </div>
    </div>
  );
};





export default IntegrateChannel;