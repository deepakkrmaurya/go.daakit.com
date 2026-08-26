import "leaflet/dist/leaflet.css";
function Support() {

    return (
        <>

            <div className="bg-gray-100 min-h-screen w-full">
                {/* Heading Strip */}
                <div className="relative z-0 mb-6 bg-[#0446db] py-[33px] shadow-md h-38 px-[24px]">
                    <div className="flex flex-wrap items-center justify-between w-full">
                        {/* Heading */}
                        <h1 className="text-2xl text-white">Support</h1>
                    </div>
                </div>
                <div className="px-2 z-99 ">
                    <div className="-mt-16 md:-mt-24 relative ">
                        <div className="w-full flex flex-col  justify-center bg-white h-32 text-center px-4">
                            <p className="text-2xl font-semibold mb-3"><span className=" border-b">Have a Query?</span></p>

                            <div className="text-gray-700 text-sm sm:text-base leading-relaxed">
                                <p>
                                    For Support (24x7) Contact us at
                                    <span className="font-semibold"> +91 92664-26868 </span> | Email:
                                    <a href="mailto:info@daakit.com" className="text-blue-600 hover:underline ml-1">
                                        info@daakit.com
                                    </a>
                                    <span className="mx-1">/</span>
                                    <a href="mailto:support@daakit.freshdesk.com" className="text-blue-600 hover:underline">
                                        support@daakit.freshdesk.com
                                    </a>
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </>
    );
}

export default Support;
