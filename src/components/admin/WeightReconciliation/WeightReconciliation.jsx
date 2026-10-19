
import { AppWindowIcon, ChartNoAxesCombined, CodeIcon, Scale } from "lucide-react";

import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import Dispute from "./Dispute";
import { useState } from "react";
import WeightMIS from "./WeightMIS";

export default function WeightReconciliation() {

    const [title,setTitle]=useState('Weight Reconciliation')
    const [subTitle,setSubTitle]=useState('Manage and review weight discrepancies')
  return (
    <div className="w-full space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {title}
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {subTitle}
        </p>
      </div>

      <Tabs defaultValue="preview" className="w-full">
       <TabsList className="grid h-12 w-full max-w-md grid-cols-2 gap-1.5 rounded-sm border border-gray-300 bg-gray-100 p-1.5 shadow-sm dark:border-gray-700 dark:bg-gray-800">

  <TabsTrigger
    value="preview"
    onClick={() => {
      setTitle("Weight MIS");
      setSubTitle("Operations Overview");
    }}
    className="
      flex h-full items-center justify-center gap-2
      rounded-sm px-5 text-sm font-semibold
      text-gray-600 transition-all duration-200
      hover:bg-blue-50 hover:text-[#0446DB]
      data-[state=active]:bg-[#0446DB]
      data-[state=active]:text-white
      data-[state=active]:shadow-md
      data-[state=active]:hover:bg-[#0339B5]
      dark:text-gray-300
      dark:hover:bg-gray-700
      dark:data-[state=active]:bg-[#0446DB]
      dark:data-[state=active]:text-white
    "
  >
    <ChartNoAxesCombined className="h-[18px] w-[18px]" />
    Weight MIS
  </TabsTrigger>

  <TabsTrigger
    value="code"
    onClick={() => {
      setTitle("All Discrepancies");
      setSubTitle("Weight MIS · All batches");
    }}
    className="
      flex h-full items-center justify-center gap-2
      rounded-sm px-5 text-sm font-semibold
      text-gray-600 transition-all duration-200
      hover:bg-blue-50 hover:text-[#0446DB]
      data-[state=active]:bg-[#0446DB]
      data-[state=active]:text-white
      data-[state=active]:shadow-md
      data-[state=active]:hover:bg-[#0339B5]
      dark:text-gray-300
      dark:hover:bg-gray-700
      dark:data-[state=active]:bg-[#0446DB]
      dark:data-[state=active]:text-white
    "
  >
    <Scale className="h-[18px] w-[18px]" />
    Discrepancies
  </TabsTrigger>

</TabsList>

        <TabsContent value="preview" className="mt-5">
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
            <WeightMIS/>
          </div>
        </TabsContent>

        <TabsContent value="code" className="mt-5">
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
            <Dispute/>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
