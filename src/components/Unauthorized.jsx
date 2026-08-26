// import React from 'react'

// const Unauthorized = () => {
//   return (
//     <div>Unauthorized</div>
//   )
// }

// export default Unauthorized


import { Link } from "react-router";


function Unauthorized() {
  return (
    <>

      <div className="relative bg-gray-900 flex flex-col items-center justify-center min-h-screen p-6 overflow-hidden z-1">
        <div className="absolute right-0 top-0 -z-1 w-full max-w-[250px] xl:max-w-[450px]">
          <img src="/grid-01.svg" alt="grid" />
        </div>
        <div className="absolute bottom-0 left-0 -z-1 w-full max-w-[250px] rotate-180 xl:max-w-[450px]">
          <img src="/grid-01.svg" alt="grid" />
        </div>
        <div className="mx-auto w-full max-w-[242px] text-center sm:max-w-[472px]">
          <h1 className="mb-8 font-bold text-white  text-title-md dark:text-white/90 text-6xl md:text-8xl">
            401
          </h1>

          <p className="mt-1 mb-6 text-base text-white font-bold dark:text-gray-400 sm:text-lg md:text-3xl">
            You are not authorized to access this page.
          </p>

          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3.5 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
          >
            Back to Home Page
          </Link>
        </div>
        {/* <!-- Footer --> */}
        <p className="absolute text-sm text-center text-gray-500 -translate-x-1/2 bottom-6 left-1/2 dark:text-gray-400">
          &copy; {new Date().getFullYear()} - Daakit-GO
        </p>
      </div>
    </>
  );
}

export default Unauthorized;

