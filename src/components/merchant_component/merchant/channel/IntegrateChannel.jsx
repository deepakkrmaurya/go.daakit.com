import React from "react";
import { ShoppingBag, ArrowRight, Store, PackageCheck } from "lucide-react";

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

      <main className="px-5 py-10 sm:px-6 lg:px-8 lg:py-12">
        <div className="grid max-w-[720px] grid-cols-1 gap-5 sm:grid-cols-2">
          {/* SHOPIFY */}
          <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-[#0d1421]">
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
          </div>

          {/* EASYCOM */}
          <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-[#0d1421]">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
              <h2 className="text-[15px] font-bold text-slate-900 dark:text-white">
                Easycom
              </h2>

              <EasycomDialog />
            </div>

            <div className="flex min-h-[205px] flex-col items-center justify-center px-7 py-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-[#0968e8] text-2xl font-bold text-white shadow-lg shadow-blue-500/20">
                E
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
  const handleContinue = () => {
    console.log("Easycom Integration");
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
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-lg font-bold text-[#0968e8] dark:bg-blue-500/10">
            E
          </div>

          <AlertDialogHeader className="text-left">
            <AlertDialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
              Integrate Easycom
            </AlertDialogTitle>

            <AlertDialogDescription className="mt-1 leading-6 text-slate-500 dark:text-slate-400">
              Connect your Easycom account with DAAKIT Go to manage and
              sync marketplace orders.
            </AlertDialogDescription>
          </AlertDialogHeader>
        </div>

        <div className="px-6 py-5">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900/60">
            <div className="flex gap-3">
              <PackageCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#0446DB]" />

              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Easycom Account
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                  Enter your Easycom account credentials on the next step
                  to complete the integration.
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

export default IntegrateChannel;