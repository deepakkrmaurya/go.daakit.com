import React, { useState } from "react";
import { Link } from "react-router-dom";

function Pricing() {
  const [finalData] = useState([
    { id: 1, plan_name: "Starter Plan", plan_type: "Monthly" },
    { id: 2, plan_name: "Pro Plan", plan_type: "Yearly" },
    { id: 3, plan_name: "Business Plan", plan_type: "Monthly" },
    { id: 4, plan_name: "Enterprise Plan", plan_type: "Yearly" },
    { id: 5, plan_name: "Premium Plan", plan_type: "Lifetime" },
    { id: 6, plan_name: "Growth Plan", plan_type: "Monthly" },
    { id: 7, plan_name: "Agency Plan", plan_type: "Yearly" },
    { id: 8, plan_name: "Unlimited Plan", plan_type: "Lifetime" },
  ]);

  const [dropdownOpen, setDropdownOpen] = useState(null);

  const toggleDropdown = (index) => {
    setDropdownOpen(dropdownOpen === index ? null : index);
  };

  const handleOptionClick = (action, plan) => {
    console.log(action, plan);
    setDropdownOpen(null);
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-900 h-[100vh]  w-full">
      {/* Header */}
      <div className="bg-[rgb(85,77,192)] py-5 shadow-md px-6">
        <h1 className="text-xl font-bold text-white">Pricing Plans</h1>
      </div>

      {/* Table Section */}
      <div className="flex justify-center px-1">
        <div className="w-full  bg-white dark:bg-gray-900 rounded">

          {/* Scrollable Table Container */}
          <div className="max-h-[600px] overflow-y-auto overflow-x-auto rounded-xl">
            <table className="min-w-full border-collapse">
              <thead className="sticky top-0 bg-gray-50 dark:bg-gray-800 z-10">
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 dark:text-white">SN</th>
                  <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 dark:text-white">PLAN NAME</th>
                  <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 dark:text-white">PLAN TYPE</th>
                  <th className="py-4 px-4 text-left text-sm font-semibold text-gray-700 dark:text-white">ACTION</th>
                </tr>
              </thead>

              <tbody>
                {finalData.map((plan, index) => (
                  <tr
                    key={plan.id}
                    className={`border-b dark:border-gray-700 hover:bg-indigo-50 dark:hover:bg-gray-800 transition ${
                      index % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"
                    }`}
                  >
                    <td className="py-4 px-4 font-medium text-gray-800 dark:text-white">{index + 1}</td>

                    <td className="py-4 px-4 font-medium text-gray-800 dark:text-white">
                      {plan.plan_name}
                    </td>

                    <td className="py-4 px-4">
                      <span className="px-3 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {plan.plan_type}
                      </span>
                    </td>

                    <td className="py-4 px-4 relative">
                      <button
                        onClick={() => toggleDropdown(index)}
                        className="bg-[rgb(85,77,192)] text-white text-sm font-semibold px-4 py-2 rounded-lg shadow hover:shadow-lg flex items-center gap-2"
                      >
                        View More
                        <svg
                          className={`w-4 h-4 transition-transform ${
                            dropdownOpen === index ? "rotate-180" : ""
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {dropdownOpen === index && (
                        <div className="absolute left-0 mt-2 w-44 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                          <button
                            onClick={() => handleOptionClick("View Pricing", plan)}
                            className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-800 border-b dark:border-gray-700"
                          >
                            View Pricing
                          </button>

                          <Link to={`/admin/updatePlanDetails/${plan.id}`}>
                            <button
                              onClick={() => handleOptionClick("Edit Pricing", plan)}
                              className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                              Edit Pricing
                            </button>
                          </Link>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Pricing;