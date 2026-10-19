 <div className=" md:flex  items-center justify-between ">
                  <div className="flex-shrink-0">
                    <h1 className="text-2xl font-bold dark:text-white">
                      Order Details
                    </h1>
                  </div>

                  <div className="flex-1 max-w-xl mx-8">
                    <form
                      className="flex w-full"
                      onSubmit={(e) => {
                        e.preventDefault();
                        handleSearch();
                      }}
                    >
                      <input
                        type="text"
                        placeholder="Search by AWB Number..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="flex-grow px-4 py-2.5 rounded-l-lg text-sm text-black bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0446DB] focus:border-transparent"
                      />
                      <button
                        type="submit"
                        className="bg-white px-5 py-2.5 rounded-r-lg border border-l-0 border-gray-300 text-gray-600 hover:bg-indigo-100 hover:text-[#0446DB] transition"
                      >
                        <FaSearch />
                      </button>
                    </form>
                  </div>

                  <div className="flex items-center gap-4">
                    <Link to="/admin/bookOrders" className="block w-full">
                      <CustomButton
                        variant="outline"
                        size="md"
                        icon={FaTasks}
                        className="w-full mt-1 whitespace-nowrap rounded-sm"
                      >
                        Assignment Console
                      </CustomButton>
                    </Link>

                    <CustomButton
                      variant="outline"
                      size="md"
                      icon={FaFileExport}
                      onClick={exportCSV}
                      className="w-full mt-1 rounded-sm "
                    >
                      Export
                    </CustomButton>

                    <Drawer
                      direction="right"
                      open={isDesktopFilterDrawerOpen}
                      onOpenChange={setIsDesktopFilterDrawerOpen}
                    >
                      <DrawerTrigger asChild>
                        <CustomButton
                          variant="outline"
                          size="md"
                          icon={FaFilter}
                          className="w-full mt-1 rounded-sm"
                        >
                          Filter
                        </CustomButton>
                      </DrawerTrigger>
                      <DrawerContent>
                        <DrawerHeader>
                          <DrawerTitle>Filter</DrawerTitle>
                        </DrawerHeader>
                        <div className="no-scrollbar overflow-y-auto px-4">
                          <form
                            onSubmit={(e) => e.preventDefault()}
                            className=" w-full"
                          >
                            <div className="gap-y-2 mb-2">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                <div>
                                  <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">
                                    Start Date
                                  </label>
                                  <input
                                    type="date"
                                    value={advanceFilters.startDate}
                                    max={advanceFilters.endDate || undefined}
                                    onClick={openDatePicker}
                                    onFocus={openDatePicker}
                                    onChange={(e) =>
                                      updateAdvanceFilter(
                                        "startDate",
                                        e.target.value,
                                      )
                                    }
                                    className="w-full cursor-pointer border dark:border-gray-700 bg-white text-gray-900 dark:bg-gray-800 
      dark:text-white px-3 py-2 rounded-sm text-sm 
      focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                  />
                                </div>

                                {/* End Date */}
                                <div>
                                  <label className="block text-xs text-gray-600 dark:text-gray-300 mb-1">
                                    End Date
                                  </label>
                                  <input
                                    type="date"
                                    value={advanceFilters.endDate}
                                    min={advanceFilters.startDate || undefined}
                                    onClick={openDatePicker}
                                    onFocus={openDatePicker}
                                    onChange={(e) =>
                                      updateAdvanceFilter(
                                        "endDate",
                                        e.target.value,
                                      )
                                    }
                                    className="w-full cursor-pointer border dark:border-gray-700 bg-white text-gray-900 dark:bg-gray-800 
      dark:text-white px-3 py-2 rounded-sm text-sm 
      focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                  />
                                </div>
                              </div>

                              <div className=" mt-2 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                <div>
                                  <label className="block text-xs dark:text-white text-gray-600 mb-1">
                                    Order Specific
                                  </label>
                                  <select
                                    value={advanceFilters.order_specific}
                                    onChange={(e) => {
                                      setAdvanceFilters((prev) => ({
                                        ...prev,
                                        order_specific: e.target.value,
                                      }));
                                    }}
                                    className="w-full border dark:border-gray-700 dark:bg-gray-800 
      dark:text-white px-3 py-2 rounded-sm text-sm 
      focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                  >
                                    <option value="">All orders</option>
                                    <option value="Turant">Turant</option>
                                    <option value="SDD">
                                      Same Day Delivery
                                    </option>
                                    <option value="NDD">
                                      Next Day Delivery
                                    </option>
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-xs dark:text-white text-gray-600 mb-1">
                                    AWB Number(s)
                                  </label>
                                  <input
                                    type="text"
                                    value={advanceFilters.awbNumber}
                                    onChange={(e) =>
                                      setAdvanceFilters((prev) => ({
                                        ...prev,
                                        awbNumber: e.target.value,
                                      }))
                                    }
                                    placeholder="AWB Number(s)"
                                    className="w-full border dark:border-gray-700 dark:bg-gray-800 
      dark:text-white px-3 py-2 rounded-sm text-sm 
      focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                  />
                                </div>
                              </div>

                              <div className=" mt-2 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                <div>
                                  {console.log(merchantList)}
                                  <label className="block text-xs dark:text-white text-gray-600 mb-1">
                                    Merchant ID
                                  </label>
                                  <select  
                                  className="w-full border dark:border-gray-700 dark:bg-gray-800 
      dark:text-white px-3 py-2 rounded-sm text-sm 
      focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                  value={advanceFilters.merchant_id}
                                    onChange={(e) =>
                                      setAdvanceFilters((prev) => ({
                                        ...prev,
                                        merchant_id: e.target.value,
                                      }))
                                    }
                                   
                                  >
                                    <option value="">Select Merchant</option>
                                    {
                                      merchantList?.map((m)=>{
                                        return (
                                         <option value={m.id}>{m?.id}:{m?.name}</option>
                                        )
                                      })
                                    }
                                  </select>

                                  
                                  
                                </div>

                                <div>
                                  <label className="block text-xs dark:text-white text-gray-600 mb-1">
                                    City
                                  </label>

                                  <input
                                    type="text"
                                    value={advanceFilters.city}
                                    onChange={(e) =>
                                      setAdvanceFilters((prev) => ({
                                        ...prev,
                                        city: e.target.value,
                                      }))
                                    }
                                    placeholder="Enter City"
                                    className="w-full border dark:border-gray-700 dark:bg-gray-800 
      dark:text-white px-3 py-2 rounded-sm text-sm 
      focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                  />
                                </div>
                              </div>

                              <div className=" mt-2 grid  grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                <div>
                                  <label className="block text-xs dark:text-white text-gray-600 mb-1">
                                    Vendor ID
                                  </label>

                                  <select 
                                  value={advanceFilters.vendor_id}
                                    onChange={(e) =>
                                      setAdvanceFilters((prev) => ({
                                        ...prev,
                                        vendor_id: e.target.value,
                                      }))
                                    }
                                   className="w-full border dark:border-gray-700 dark:bg-gray-800 
      dark:text-white px-3 py-2 rounded-sm text-sm 
      focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                 
                                  >
                                    <option value="">Select Vendor</option>
                                    {vendorList?.map((v) => {
                                      
                                      return (
                                        <option value={v?.id}>{v?.id}:{v?.vendor_name}</option>
                                      );
                                    })}
                                  </select>
                                  
                                </div>

                                <div>
                                  <label className="block text-xs dark:text-white text-gray-600 mb-1">
                                    Pincode
                                  </label>
                                  <input
                                    type="text"
                                    value={advanceFilters.pincode}
                                    onChange={(e) =>
                                      setAdvanceFilters((prev) => ({
                                        ...prev,
                                        pincode: e.target.value,
                                      }))
                                    }
                                    placeholder="Enter Pincode"
                                    className="w-full border dark:border-gray-700 dark:bg-gray-800 
                          dark:text-white px-3 py-2 rounded-sm text-sm 
                             focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                  />
                                </div>
                              </div>

                              <div className=" mt-2">
                                <label className="block text-xs dark:text-white text-gray-600 mb-1">
                                  Rider ID
                                </label>
                                <input
                                  type="number"
                                  value={advanceFilters.rider_id}
                                  onChange={(e) =>
                                    setAdvanceFilters((prev) => ({
                                      ...prev,
                                      rider_id: e.target.value,
                                    }))
                                  }
                                  placeholder="Integer Only"
                                  className="w-full border dark:border-gray-700 dark:bg-gray-800 
      dark:text-white px-3 py-2 rounded-sm text-sm 
      focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                              </div>
                            </div>

                            <div className=" w-full flex">
                              <button
                                type="submit"
                                onClick={applyFilters}
                                className="bg-[#0446DB] w-1/2 text-white px-4 py-2 rounded-md hover:bg-indigo-800 transition text-sm mx-2"
                              >
                                Filter
                              </button>
                              <button
                                type="button"
                                onClick={resetFilters}
                                className="bg-[#0446DB] w-1/2 text-white px-4 py-2 rounded-md hover:bg-indigo-800 transition text-sm mx-2"
                              >
                                Reset
                              </button>
                            </div>
                          </form>
                        </div>
                        <DrawerFooter>
                          <Button
                            onClick={() => setIsDesktopFilterDrawerOpen(false)}
                            variant="outline"
                          >
                            Cancel
                          </Button>
                        </DrawerFooter>
                      </DrawerContent>
                    </Drawer>
                  </div>
                </div>