<div className="flex h-[calc(100dvh-200px)] min-h-[350px] w-full flex-col overflow-hidden rounded-sm border border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
              <div className="min-h-0 flex-1 overflow-auto overscroll-contain bg-[#f5f8fb] dark:bg-neutral-900/50">
                <div className="min-w-max">
                  <div >
                    <Table>
                      <TableHeader className="sticky top-0 z-20 bg-gray-100 dark:bg-neutral-800">
                        <TableRow>
                          {selectedStatus === "booked" ||
                          selectedStatus === "pending pickup" ||
                          selectedStatus === "rto in transit" ||
                          selectedStatus === "picked" ||
                          selectedStatus === "in transit" ||
                          selectedStatus === "undelivered" ||
                          selectedStatus === "undelivered assigned" ||
                          selectedStatus === "out for delivery" ? (
                            <TableHead className=" px-2 font-semibold py-3">
                              <div>
                                <span>
                                  <input
                                    type="checkbox"
                                    className="w-4 h-4 text-indigo-600 rounded border-gray-300"
                                    checked={
                                      selectedBulkOrders.length ===
                                      orders.filter(
                                        (o) =>
                                          o.tpc_awb_number === null &&
                                          o.rider_preference === "daakit",
                                      ).length
                                    }
                                    onChange={toggleSelectAll}
                                  />
                                </span>
                              </div>
                            </TableHead>
                          ) : (
                            <>
                              <TableHead className="text-left px-2 font-semibold py-3">-</TableHead>
                            </>
                          )}

                          <TableHead className="text-left px-2 font-semibold py-3">
                            ORDER ID
                          </TableHead>
                          <TableHead className="text-left uppercase px-2 font-semibold py-3">
                            
                          Seller Details
                          </TableHead>

                          {(selectedStatus === "pending pickup" ||
                            selectedStatus === "out for delivery" ||
                            selectedStatus === "delivered" ||
                            selectedStatus === "picked" ||
                            selectedStatus === "in transit" ||
                            selectedStatus === "undelivered assigned") && (
                            <>
                              <TableHead className="text-left px-2 font-semibold py-3">RIDER ID/VENDOR ID</TableHead>
                            </>
                          )}

                          <TableHead className="text-left px-2 font-semibold py-3">CONSIGNEE ADDRESS</TableHead>
                          <TableHead className="text-left px-2 font-semibold py-3">PACKAGE DETAILS</TableHead>

                          {/* <TableHead className="text-center px-2 font-semibold py-3">ASSIGNMENT/RIDER</TableHead> */}
                          {/* <TableHead className="text-center px-2 font-semibold py-3">MAPPED/VENDOR</TableHead> */}
                          <TableHead className="text-left px-2 font-semibold py-3">STATUS</TableHead>
                          {selectedStatus === "booked" && (
                            <TableHead className="text-left px-2 font-semibold py-3">ELIGIBLE VENDORS</TableHead>
                          )}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loading ? (
                          <TableRow>
                            <TableCell
                              colSpan={10}
                              className="text-center py-10"
                            >
                              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                              <p className="mt-2">Loading orders...</p>
                            </TableCell>
                          </TableRow>
                        ) : orders.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={10}
                              className="text-center py-10"
                            >
                              No orders found
                            </TableCell>
                          </TableRow>
                        ) : (
                          orders?.map((order) => {
                            let isSelected;
                            if (selectedStatus === "booked") {
                              isSelected = selectedBulkOrders.some(
                                (o) => o.id === order.id,
                              );
                            } else if (selectedStatus === "pending pickup") {
                              isSelected = selectedBulkOrders.some(
                                (o) => o.id === order.id,
                              );
                            } else if (selectedStatus === "rto in transit") {
                              isSelected = selectedBulkOrders.some(
                                (o) => o.id === order.id,
                              );
                            }

                            return (
                              <TableRow
                                key={order.id}
                                className="hover:bg-gray-50 text-left dark:hover:bg-gray-800 border-b overflow-x-scroll"
                              >
                                {/* Select */}
                                {(selectedStatus === "booked" &&
                                  order?.rider_preference == "daakit" &&
                                  order.tpc_awb_number == null) ||
                                (selectedStatus === "pending pickup" &&
                                  order?.rider_preference == "daakit" &&
                                  order.tpc_awb_number == null) ? (
                                  <td className="py-2 text-center">
                                    {(() => {
                                      const currentIsMapped =
                                        order?.mapped_with !== null &&
                                        order?.mapped_with !== undefined;

                                      const firstSelectedIsMapped =
                                        selectedBulkOrders.length > 0
                                          ? selectedBulkOrders[0]
                                              ?.mapped_with !== null &&
                                            selectedBulkOrders[0]
                                              ?.mapped_with !== undefined
                                          : null;

                                      const isDifferentMappingType =
                                        selectedStatus === "pending pickup" &&
                                        selectedBulkOrders.length > 0 &&
                                        firstSelectedIsMapped !==
                                          currentIsMapped;

                                      if (isDifferentMappingType) {
                                        return (
                                          <span
                                            className="text-sm font-medium text-gray-400 dark:text-gray-500"
                                            title={
                                              firstSelectedIsMapped
                                                ? "Only mapped orders can be selected"
                                                : "Only unmapped orders can be selected"
                                            }
                                          >
                                            --
                                          </span>
                                        );
                                      }

                                      return (
                                        <input
                                          type="checkbox"
                                          checked={isSelected}
                                          onChange={(e) => {
                                            const isChecked = e.target.checked;

                                            if (
                                              selectedStatus === "booked" ||
                                              selectedStatus ===
                                                "pending pickup"
                                            ) {
                                              if (isChecked) {
                                                if (
                                                  selectedStatus ===
                                                    "pending pickup" &&
                                                  selectedBulkOrders.length > 0
                                                ) {
                                                  const firstIsMapped =
                                                    selectedBulkOrders[0]
                                                      ?.mapped_with !== null &&
                                                    selectedBulkOrders[0]
                                                      ?.mapped_with !==
                                                      undefined;

                                                  const thisIsMapped =
                                                    order?.mapped_with !==
                                                      null &&
                                                    order?.mapped_with !==
                                                      undefined;

                                                  if (
                                                    firstIsMapped !==
                                                    thisIsMapped
                                                  ) {
                                                    return;
                                                  }
                                                }

                                                setSelectedBulkOrders(
                                                  (prev) => {
                                                    const alreadySelected =
                                                      prev.some(
                                                        (o) =>
                                                          o.id === order.id,
                                                      );

                                                    if (alreadySelected) {
                                                      return prev;
                                                    }

                                                    const updated = [
                                                      ...prev,
                                                      order,
                                                    ];

                                                    return updated;
                                                  },
                                                );

                                                setBulkOrderWeight(
                                                  (prev) =>
                                                    Number(prev) +
                                                    Number(
                                                      order?.total_weight || 0,
                                                    ),
                                                );
                                              } else {
                                                setSelectedBulkOrders(
                                                  (prev) => {
                                                    const updated = prev.filter(
                                                      (o) => o.id !== order.id,
                                                    );

                                                    const order_ids =
                                                      updated.map((o) => o.id);

                                                    // Booked ka existing logic
                                                    if (
                                                      selectedStatus ===
                                                      "booked"
                                                    ) {
                                                      fetchVendor(order_ids);
                                                    }

                                                    return updated;
                                                  },
                                                );

                                                setBulkOrderWeight((prev) =>
                                                  Math.max(
                                                    0,
                                                    Number(prev) -
                                                      Number(
                                                        order?.total_weight ||
                                                          0,
                                                      ),
                                                  ),
                                                );
                                              }
                                            }
                                          }}
                                          className="w-4 h-4 text-[#0446DB] border-gray-300 rounded"
                                        />
                                      );
                                    })()}
                                  </td>
                                ) : selectedStatus === "picked" &&
                                  order?.pickup_stage === "at_central_hub" &&
                                  order?.rider_preference == "daakit" ? (
                                  <td className="px-6 py-4 text-center">
                                    <input
                                      type="checkbox"
                                      checked={selectedBulkOrders.some(
                                        (item) => item.id === order.id,
                                      )}
                                      onChange={(e) =>
                                        handleBulkOrderSelect(
                                          order,
                                          e.target.checked,
                                        )
                                      }
                                      className="w-4 h-4 text-[#0446DB] border-gray-300 rounded"
                                    />
                                  </td>
                                ) : selectedStatus === "rto in transit" &&
                                  order?.rider_preference == "daakit" ? (
                                  <>
                                    <td className="px-6 py-4 text-center">
                                      <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={(e) => {
                                          const isChecked = e.target.checked;

                                          if (
                                            selectedStatus === "rto in transit"
                                          ) {
                                            if (isChecked) {
                                              setSelectedBulkOrders((prev) => {
                                                const updated = [
                                                  ...prev,
                                                  order,
                                                ];
                                                const order_ids = updated.map(
                                                  (o) => o.id,
                                                );
                                                return updated;
                                              });

                                              setBulkOrderWeight(
                                                (prev) =>
                                                  Number(prev) +
                                                  Number(order.total_weight),
                                              );
                                            } else {
                                              setSelectedBulkOrders((prev) => {
                                                const updated = prev.filter(
                                                  (o) => o.id !== order.id,
                                                );
                                                const order_ids = updated.map(
                                                  (o) => o.id,
                                                );
                                                return updated;
                                              });

                                              setBulkOrderWeight(
                                                (prev) =>
                                                  Number(prev) -
                                                  Number(order.total_weight), // ✅ fixed bug
                                              );
                                            }
                                          }
                                        }}
                                        className="w-4 h-4 text-[#0446DB] border-gray-300 rounded"
                                      />
                                    </td>
                                  </>
                                ) : [
                                    "in transit",
                                    "out for delivery",
                                    "undelivered",
                                    'rto out for delivery',
                                    "undelivered assigned",
                                    "rto undelivered"
                                  ].includes(selectedStatus) &&
                                  order?.rider_preference == "daakit" ? (
                                  <>
                                    <td className="px-6 py-4 text-center">
                                      <input
                                        type="checkbox"
                                        checked={selectedBulkOrders.some(
                                          (item) => item.id === order.id,
                                        )}
                                        onChange={(e) => {
                                          const isChecked = e.target.checked;

                                          if (selectedStatus == "picked") {
                                            if (
                                              order.pickup_stage !== null &&
                                              order.pickup_stage !== "at_vendor"
                                            ) {
                                              toast.error(
                                                'Pickup stage must be empty or "at_vendor" before marking the order in transit',
                                              );

                                              return;
                                            }
                                          }

                                          if (isChecked) {
                                            setSelectedBulkOrders((prev) => {
                                              const updated = [...prev, order];
                                              const order_ids = updated.map(
                                                (o) => {
                                                  return o.id;
                                                },
                                              );
                                              return updated;
                                            });

                                            setBulkOrderWeight(
                                              (prev) =>
                                                Number(prev) +
                                                Number(order.total_weight),
                                            );
                                          } else {
                                            setSelectedBulkOrders((prev) => {
                                              const updated = prev.filter(
                                                (o) => o.id !== order.id,
                                              );
                                              const order_ids = updated.map(
                                                (o) => o.id,
                                              );
                                              return updated;
                                            });

                                            setBulkOrderWeight(
                                              (prev) =>
                                                Number(prev) -
                                                Number(order.total_weight), // ✅ fixed bug
                                            );
                                          }
                                        }}
                                        className="w-4 h-4 text-[#0446DB] border-gray-300 rounded"
                                      />
                                    </td>
                                  </>
                                ) : canMarkInTransit &&
                                  selectedStatus == "picked" &&
                                  order?.rider_preference == "daakit" ? (
                                  <>
                                    <td className="px-6 py-4 text-center">
                                      <input
                                        type="checkbox"
                                        checked={selectedBulkOrders.some(
                                          (item) => item.id === order.id,
                                        )}
                                        onChange={(e) => {
                                          const isChecked = e.target.checked;

                                          if (selectedStatus == "picked") {
                                            if (
                                              order.pickup_stage !== null &&
                                              order.pickup_stage !== "at_vendor"
                                            ) {
                                              toast.error(
                                                'Pickup stage must be empty or "at_vendor" before marking the order in transit',
                                              );

                                              return;
                                            }
                                          }

                                          if (isChecked) {
                                            setSelectedBulkOrders((prev) => {
                                              const updated = [...prev, order];
                                              const order_ids = updated.map(
                                                (o) => {
                                                  return o.id;
                                                },
                                              );
                                              return updated;
                                            });

                                            setBulkOrderWeight(
                                              (prev) =>
                                                Number(prev) +
                                                Number(order.total_weight),
                                            );
                                          } else {
                                            setSelectedBulkOrders((prev) => {
                                              const updated = prev.filter(
                                                (o) => o.id !== order.id,
                                              );
                                              const order_ids = updated.map(
                                                (o) => o.id,
                                              );
                                              return updated;
                                            });

                                            setBulkOrderWeight(
                                              (prev) =>
                                                Number(prev) -
                                                Number(order.total_weight),
                                            );
                                          }
                                        }}
                                        className="w-4 h-4 text-[#0446DB] border-gray-300 rounded"
                                      />
                                    </td>
                                  </>
                                ) : (
                                  <>
                                    <TableCell className="px-6 py-4 text-center">
                                      -
                                    </TableCell>
                                  </>
                                )}

                                {/* Order ID */}
                                <TableCell className=" py-2 text-left whitespace-pre-line">
                                  <p className="text-sm text-gray-500 dark:text-white">
                                    {new Date(order.created_at).toLocaleString(
                                      "en-IN",
                                      {
                                        timeZone: "Asia/Kolkata",
                                        day: "2-digit",
                                        month: "2-digit",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true,
                                      },
                                    )}
                                     <span
                                      className={`ml-2 inline-flex mb-1 items-center gap-1.5 rounded-full border border-dashed px-2.5 py-1 text-xs font-semibold ${
                                        order?.rider_preference === "daakit"
                                          ? "border-blue-500 bg-blue-50/50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
                                          : "border-emerald-500 bg-emerald-50/50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
                                      }`}
                                    >
                                      {order?.rider_preference === "daakit"
                                        ? "DDN"
                                        : "BYOB"}
                                    </span>
                                  </p>
                                  <p className="text-left text-gray-800 flex items-center">
                                    
                                   
                                    <Link
                                      to={`/admin/order-history?awb_number=${encodeURIComponent(order.awb_number)}`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="underline text-[#0446DB] hover:text-blue-500"
                                    >
                                      {order.awb_number}
                                    </Link>

                                    <button
                                      className="pl-2 text-lg text-gray-600 hover:text-[#0446DB] transition"
                                      onClick={() => {
                                        navigator.clipboard.writeText(
                                          order.awb_number,
                                        );
                                        setCopySuccess(order.awb_number);
                                        setTimeout(() => {
                                          setCopySuccess(null);
                                        }, 2000);
                                      }}
                                    >
                                      {copySuccess === order.awb_number ? (
                                        <CiCircleCheck />
                                      ) : (
                                        <FaRegCopy />
                                      )}
                                    </button>

                                    <Dialog className="w-5xl">
                                      <DialogTrigger asChild>
                                        <Button
                                          variant="outline"
                                          className="text-xs ml-1 font-medium  text-red-600  inline-block cursor-pointer "
                                        >
                                          <span>
                                            <TbFileInfo />
                                          </span>
                                        </Button>
                                      </DialogTrigger>
                                      <DialogContent className="sm:max-w-4xl">
                                        <DialogHeader>
                                          <DialogTitle>
                                            Order Details
                                          </DialogTitle>
                                        </DialogHeader>

                                        <div className="bg-white p-6  space-y-3 text-gray-700">
                                          {/* Basic Info */}
                                          <h3 className="font-semibold text-[#0446DB] mb-2">
                                            Basic Details
                                          </h3>
                                          <div className="grid grid-cols-2 gap-4">
                                            <div>
                                              <strong>Order ID:</strong>{" "}
                                              {order.merchant_order_id}
                                              <button
                                                className="pl-2 text-lg text-gray-600 hover:text-[#0446DB] transition"
                                                onClick={() => {
                                                  navigator.clipboard.writeText(
                                                    order.merchant_order_id,
                                                  );
                                                  setCopySuccess(
                                                    order.merchant_order_id,
                                                  );
                                                  setTimeout(() => {
                                                    setCopySuccess(null);
                                                  }, 2000);
                                                }}
                                              >
                                                {copySuccess ===
                                                order.merchant_order_id ? (
                                                  <CiCircleCheck />
                                                ) : (
                                                  <FaRegCopy />
                                                )}
                                              </button>
                                            </div>
                                            <div>
                                              <strong>AWB No:</strong>{" "}
                                              {order.awb_number}
                                              <button
                                                className="pl-2 text-lg text-gray-600 hover:text-[#0446DB] transition"
                                                onClick={() => {
                                                  navigator.clipboard.writeText(
                                                    order.awb_number,
                                                  );
                                                  setCopySuccess(
                                                    order.awb_number,
                                                  );
                                                  setTimeout(() => {
                                                    setCopySuccess(null);
                                                  }, 2000);
                                                }}
                                              >
                                                {copySuccess ===
                                                order.awb_number ? (
                                                  <CiCircleCheck />
                                                ) : (
                                                  <FaRegCopy />
                                                )}
                                              </button>
                                            </div>
                                            <div>
                                              <strong>Order Type:</strong>{" "}
                                              {order.order_type === "cod"
                                                ? "COD"
                                                : "Prepaid"}
                                            </div>
                                            <div>
                                              <strong>Order Specific:</strong>{" "}
                                              {order.order_specific}
                                            </div>
                                            <div>
                                              <strong>Order Status:</strong>{" "}
                                              {toCapitalizeEachWord(
                                                order.status,
                                              )}
                                            </div>
                                            <div>
                                              <strong>Total Amount:</strong> ₹
                                              {Number(
                                                order.total_amount,
                                              ).toLocaleString()}
                                            </div>
                                            <div>
                                              <strong>Order Weight:</strong>{" "}
                                              {Number(
                                                order.total_weight,
                                              ).toLocaleString()}
                                              g
                                            </div>
                                            <div>
                                              <strong>Charge Weight:</strong>{" "}
                                              {Number(
                                                order.charged_weight,
                                              ).toLocaleString()}
                                              g
                                            </div>
                                            <div>
                                              <strong>
                                                Number of Packets:
                                              </strong>{" "}
                                              {order.number_of_boxes}
                                            </div>
                                          </div>

                                          <div className="pt-4 border-t">
                                            <div className="flex justify-between items-center mb-2">
                                              <h3 className="font-semibold text-[#0446DB]">
                                                Delivery Details
                                              </h3>
                                              <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                  if (
                                                    editingDeliveryId ===
                                                    order.id
                                                  ) {
                                                    // Save logic here - you'll need to create an API endpoint
                                                    handleUpdateDeliveryDetails(
                                                      {
                                                        order_id: order.id,
                                                        delivery_details:
                                                          deliveryFormData,
                                                      },
                                                    );
                                                  } else {
                                                    setEditingDeliveryId(
                                                      order.id,
                                                    );
                                                    setDeliveryFormData({
                                                      delivery_contact_name:
                                                        order.delivery_contact_name,
                                                      delivery_address_line:
                                                        order.delivery_address_line,
                                                      delivery_city:
                                                        order.delivery_city,
                                                      delivery_state:
                                                        order.delivery_state,
                                                      delivery_pincode:
                                                        order.delivery_pincode,
                                                    });
                                                  }
                                                }}
                                                className="text-xs"
                                              >
                                                {editingDeliveryId === order.id
                                                  ? "Save"
                                                  : "Edit"}
                                              </Button>
                                            </div>

                                            {editingDeliveryId === order.id ? (
                                              <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                  <label className="block text-xs text-gray-600 mb-1">
                                                    Customer Name
                                                  </label>
                                                  <input
                                                    type="text"
                                                    value={
                                                      deliveryFormData.delivery_contact_name
                                                    }
                                                    onChange={(e) =>
                                                      setDeliveryFormData(
                                                        (prev) => ({
                                                          ...prev,
                                                          delivery_contact_name:
                                                            e.target.value,
                                                        }),
                                                      )
                                                    }
                                                    className="w-full border rounded-md px-2 py-1 text-sm"
                                                  />
                                                </div>
                                                <div>
                                                  <label className="block text-xs text-gray-600 mb-1">
                                                    Address
                                                  </label>
                                                  <input
                                                    type="text"
                                                    value={
                                                      deliveryFormData.delivery_address_line
                                                    }
                                                    onChange={(e) =>
                                                      setDeliveryFormData(
                                                        (prev) => ({
                                                          ...prev,
                                                          delivery_address_line:
                                                            e.target.value,
                                                        }),
                                                      )
                                                    }
                                                    className="w-full border rounded-md px-2 py-1 text-sm"
                                                  />
                                                </div>
                                                <div>
                                                  <label className="block text-xs text-gray-600 mb-1">
                                                    City
                                                  </label>
                                                  <input
                                                    type="text"
                                                    value={
                                                      deliveryFormData.delivery_city
                                                    }
                                                    onChange={(e) =>
                                                      setDeliveryFormData(
                                                        (prev) => ({
                                                          ...prev,
                                                          delivery_city:
                                                            e.target.value,
                                                        }),
                                                      )
                                                    }
                                                    className="w-full border rounded-md px-2 py-1 text-sm"
                                                  />
                                                </div>
                                                <div>
                                                  <label className="block text-xs text-gray-600 mb-1">
                                                    State
                                                  </label>
                                                  <input
                                                    type="text"
                                                    value={
                                                      deliveryFormData.delivery_state
                                                    }
                                                    onChange={(e) =>
                                                      setDeliveryFormData(
                                                        (prev) => ({
                                                          ...prev,
                                                          delivery_state:
                                                            e.target.value,
                                                        }),
                                                      )
                                                    }
                                                    className="w-full border rounded-md px-2 py-1 text-sm"
                                                  />
                                                </div>
                                                <div>
                                                  <label className="block text-xs text-gray-600 mb-1">
                                                    Pincode
                                                  </label>
                                                  <input
                                                    type="text"
                                                    value={
                                                      deliveryFormData.delivery_pincode
                                                    }
                                                    onChange={(e) =>
                                                      setDeliveryFormData(
                                                        (prev) => ({
                                                          ...prev,
                                                          delivery_pincode:
                                                            e.target.value,
                                                        }),
                                                      )
                                                    }
                                                    className="w-full border rounded-md px-2 py-1 text-sm"
                                                  />
                                                </div>
                                                <div className="flex items-end">
                                                  <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                      setEditingDeliveryId(null)
                                                    }
                                                    className="text-red-500"
                                                  >
                                                    Cancel
                                                  </Button>
                                                </div>
                                              </div>
                                            ) : (
                                              <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                  <strong>
                                                    Customer Name:
                                                  </strong>{" "}
                                                  {order.delivery_contact_name}
                                                </div>
                                                <div>
                                                  <strong>Address:</strong>{" "}
                                                  {order.delivery_address_line}
                                                </div>
                                                <div>
                                                  <strong>City:</strong>{" "}
                                                  {`${order.delivery_city}, ${order.delivery_state} - ${order.delivery_pincode}` ||
                                                    "N/A"}
                                                </div>
                                              </div>
                                            )}
                                          </div>

                                          {/* Pickup Details */}
                                          <div className="pt-4 border-t">
                                            <div className="flex justify-between items-center mb-2">
                                              <h3 className="font-semibold text-[#0446DB]">
                                                Pickup Details
                                              </h3>
                                              <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                  if (
                                                    editingPickupId === order.id
                                                  ) {
                                                    // Save logic here
                                                    handleUpdateDeliveryDetails(
                                                      {
                                                        order_id: order.id,
                                                        pickup_details:
                                                          pickupFormData,
                                                      },
                                                    );
                                                  } else {
                                                    setEditingPickupId(
                                                      order.id,
                                                    );
                                                    setPickupFormData({
                                                      pickup_contact_name:
                                                        order.pickup_contact_name ||
                                                        "",
                                                      pickup_phone:
                                                        order.pickup_phone ||
                                                        "",
                                                      pickup_address_line:
                                                        order.pickup_address_line ||
                                                        "",
                                                      pickup_city:
                                                        order.pickup_city || "",
                                                      pickup_state:
                                                        order.pickup_state ||
                                                        "",
                                                      pickup_pincode:
                                                        order.pickup_pincode ||
                                                        "",
                                                    });
                                                  }
                                                }}
                                                className="text-xs"
                                              >
                                                {editingPickupId === order.id
                                                  ? "Save"
                                                  : "Edit"}
                                              </Button>
                                            </div>

                                            {editingPickupId === order.id ? (
                                              <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                  <label className="block text-xs text-gray-600 mb-1">
                                                    Name
                                                  </label>
                                                  <input
                                                    type="text"
                                                    value={
                                                      pickupFormData.pickup_contact_name
                                                    }
                                                    onChange={(e) =>
                                                      setPickupFormData(
                                                        (prev) => ({
                                                          ...prev,
                                                          pickup_contact_name:
                                                            e.target.value,
                                                        }),
                                                      )
                                                    }
                                                    className="w-full border rounded-md px-2 py-1 text-sm"
                                                  />
                                                </div>
                                                <div>
                                                  <label className="block text-xs text-gray-600 mb-1">
                                                    Phone No
                                                  </label>
                                                  <input
                                                    type="text"
                                                    value={
                                                      pickupFormData.pickup_phone
                                                    }
                                                    onChange={(e) =>
                                                      setPickupFormData(
                                                        (prev) => ({
                                                          ...prev,
                                                          pickup_phone:
                                                            e.target.value,
                                                        }),
                                                      )
                                                    }
                                                    className="w-full border rounded-md px-2 py-1 text-sm"
                                                  />
                                                </div>
                                                <div>
                                                  <label className="block text-xs text-gray-600 mb-1">
                                                    Address
                                                  </label>
                                                  <input
                                                    type="text"
                                                    value={
                                                      pickupFormData.pickup_address_line
                                                    }
                                                    onChange={(e) =>
                                                      setPickupFormData(
                                                        (prev) => ({
                                                          ...prev,
                                                          pickup_address_line:
                                                            e.target.value,
                                                        }),
                                                      )
                                                    }
                                                    className="w-full border rounded-md px-2 py-1 text-sm"
                                                  />
                                                </div>
                                                <div>
                                                  <label className="block text-xs text-gray-600 mb-1">
                                                    City
                                                  </label>
                                                  <input
                                                    type="text"
                                                    value={
                                                      pickupFormData.pickup_city
                                                    }
                                                    onChange={(e) =>
                                                      setPickupFormData(
                                                        (prev) => ({
                                                          ...prev,
                                                          pickup_city:
                                                            e.target.value,
                                                        }),
                                                      )
                                                    }
                                                    className="w-full border rounded-md px-2 py-1 text-sm"
                                                  />
                                                </div>
                                                <div>
                                                  <label className="block text-xs text-gray-600 mb-1">
                                                    State
                                                  </label>
                                                  <input
                                                    type="text"
                                                    value={
                                                      pickupFormData.pickup_state
                                                    }
                                                    onChange={(e) =>
                                                      setPickupFormData(
                                                        (prev) => ({
                                                          ...prev,
                                                          pickup_state:
                                                            e.target.value,
                                                        }),
                                                      )
                                                    }
                                                    className="w-full border rounded-md px-2 py-1 text-sm"
                                                  />
                                                </div>
                                                <div>
                                                  <label className="block text-xs text-gray-600 mb-1">
                                                    Pincode
                                                  </label>
                                                  <input
                                                    type="text"
                                                    value={
                                                      pickupFormData.pickup_pincode
                                                    }
                                                    onChange={(e) =>
                                                      setPickupFormData(
                                                        (prev) => ({
                                                          ...prev,
                                                          pickup_pincode:
                                                            e.target.value,
                                                        }),
                                                      )
                                                    }
                                                    className="w-full border rounded-md px-2 py-1 text-sm"
                                                  />
                                                </div>
                                                <div className="flex items-end">
                                                  <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                      setEditingPickupId(null)
                                                    }
                                                    className="text-red-500"
                                                  >
                                                    Cancel
                                                  </Button>
                                                </div>
                                              </div>
                                            ) : (
                                              <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                  <strong>Name:</strong>{" "}
                                                  {order.pickup_contact_name ||
                                                    "N/A"}
                                                </div>
                                                <div>
                                                  <strong>
                                                    Pickup Phone No:
                                                  </strong>{" "}
                                                  {`${order.pickup_phone}` ||
                                                    "N/A"}
                                                </div>
                                                <div>
                                                  <strong>Address:</strong>{" "}
                                                  {order.pickup_address_line ||
                                                    "N/A"}
                                                </div>
                                                <div>
                                                  <strong>City:</strong>{" "}
                                                  {`${order.pickup_city}, ${order.pickup_state} - ${order.pickup_pincode}` ||
                                                    "N/A"}
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        </div>

                                        <DialogFooter>
                                          <DialogClose asChild>
                                            <button
                                              onClick={() => {
                                                navigate(
                                                  `/admin/order-history?awb=${order?.awb_number}`,
                                                );
                                              }}
                                              className="bg-green-500 mr-2 text-white px-4 py-2 rounded hover:bg-indigo-800 transition"
                                            >
                                              Get History
                                            </button>
                                          </DialogClose>
                                          <DialogClose asChild>
                                            <Button
                                              onClick={() => {
                                                clearAllState();
                                              }}
                                              variant="outline"
                                            >
                                              Cancel
                                            </Button>
                                          </DialogClose>
                                        </DialogFooter>
                                      </DialogContent>
                                    </Dialog>
                                  </p>
                                  
                                  {order.tpc_awb_number && (
                                    <p>
                                      {order.tpc_awb_number}
                                      <button
                                        className="pl-2 text-lg text-gray-600 hover:text-[#0446DB] transition"
                                        onClick={() => {
                                          navigator.clipboard.writeText(
                                            order.tpc_awb_number,
                                          );
                                          setCopySuccess(order.tpc_awb_number);
                                          setTimeout(() => {
                                            setCopySuccess(null);
                                          }, 2000);
                                        }}
                                      >
                                        {copySuccess ===
                                        order.tpc_awb_number ? (
                                          <CiCircleCheck />
                                        ) : (
                                          <FaRegCopy />
                                        )}
                                      </button>
                                    </p>
                                  )}

                                  

                                  
                                  <p className="text-sm whitespace-nowrap text-gray-400 dark:text-white">
                                    MOID:{" "}
                                    {order.merchant_order_id?.length <= 20
                                      ? order.merchant_order_id
                                      : `${order.merchant_order_id.slice(
                                          0,
                                          16,
                                        )}...`}
                                    <button
                                      className="pl-2 text-lg text-gray-600 dark:text-white hover:text-[#0446DB] transition"
                                      onClick={() => {
                                        navigator.clipboard.writeText(
                                          order.merchant_order_id,
                                        );
                                        setCopySuccess(order.merchant_order_id);
                                        setTimeout(() => {
                                          setCopySuccess(null);
                                        }, 2000);
                                      }}
                                    >
                                      {copySuccess ===
                                      order.merchant_order_id ? (
                                        <CiCircleCheck />
                                      ) : (
                                        <FaRegCopy />
                                      )}
                                    </button>
                                   
                                  </p>
                                </TableCell>




                                {/* SELLER DETAILS */}
                                <TableCell className=" py-2">
                                    <div className="flex flex-col gap-1.5 text-sm">
                                      <p className="text-gray-700 dark:text-gray-300">
                                        <span className="font-medium text-gray-900 dark:text-white">
                                          Merchant ID:
                                        </span>{" "}
                                        {order?.merchant_id ?? "N/A"}
                                      </p>

                                      {order?.brand_name && (
                                        <p className="text-gray-700 dark:text-gray-300">
                                          <span className="font-medium text-gray-900 dark:text-white">
                                            Brand Name:
                                          </span>{" "}
                                          {order.brand_name}
                                        </p>
                                      )}

                                      {order?.merchant_company_name && (
                                        <p className="text-gray-700 dark:text-gray-300">
                                          <span className="font-medium text-gray-900 dark:text-white">
                                            Company Name:
                                          </span>{" "}
                                          {order.merchant_company_name}
                                        </p>
                                      )}
                                    </div>
                                  </TableCell>



                                {(selectedStatus === "pending pickup" ||
                                  selectedStatus === "out for delivery" ||
                                  selectedStatus === "delivered" ||
                                  selectedStatus === "picked" ||
                                  selectedStatus === "in transit" ||
                                  selectedStatus ===
                                    "undelivered assigned") && (
                                  <>
                                    <TableCell className="text-left ">
                                      

                                      {order.mapped_dc_id !== null ? (
                                        <>DC_{order.mapped_dc_id}</>
                                      ) : order.rider_vendor_id === null &&
                                        order.rider_merchant_id === null &&
                                        order.mapped_with === null ? (
                                        <>
                                          {order.rider_id !== null
                                            ? "DKT_"
                                            : ""}
                                          {order.rider_id}
                                        </>
                                      ) : (
                                        <>
                                          {order.rider_id !== null
                                            ? `FP_${order.rider_vendor_id}_`
                                            : order.rider_merchant_id
                                              ? `M${order.rider_merchant_id}_R`
                                              : order.mapped_with
                                                ? `FP_${order.mapped_with}`
                                                : "DKT_"}

                                          {order.rider_id}
                                        </>
                                      )}

                                      {selectedStatus === "picked" && (
                                        <p>
                                          {order.pickup_stage ===
                                          "at_central_hub"
                                            ? "At Central Hub"
                                            : "At Vendor Hub"}
                                        </p>
                                      )}

                                      {/* {
                                        order.mapped_with === null && (
                                          <>
                                           -
                                          </>
                                        )
                                      } */}
                                    </TableCell>
                                  </>
                                )}

                                {/* Address */}
                                <TableCell className=" py-2 whitespace-pre-line">
                                  <p className="font-medium text-gray-800 dark:text-white">
                                    {order.delivery_contact_name}
                                  </p>
                                  <HoverCard>
                                    <HoverCardTrigger>
                                      {order.delivery_address_line.slice(0, 30)}
                                      ...
                                    </HoverCardTrigger>
                                    <HoverCardContent className="bg-[#0446DB] text-white">
                                      {order.delivery_address_line},{" "}
                                      {order.delivery_city},{" "}
                                      {order.delivery_state} -{" "}
                                      {order.delivery_pincode}
                                    </HoverCardContent>
                                  </HoverCard>
                                  <p className="text-xs text-gray-500 dark:text-white">
                                    {order.delivery_city},{" "}
                                    {order.delivery_state} -{" "}
                                    {order.delivery_pincode}
                                  </p>

                                  <p className="text-xs text-gray-400">
                                    {order.delivery_country}
                                  </p>
                                </TableCell>

                                {/* Package Details */}
                                <TableCell className=" py-2">
                                  <p>
                                    {selectedStatus !== "cancelled" && (
                                      <span className=" whitespace-nowrap dark:text-white">
                                        EDD:{" "}
                                        
                                        {order.EDD}
                                      </span>
                                    )}
                                  </p>
                                  <p>
                                    <span className="font-medium text-gray-800 dark:text-white">
                                      Weight:
                                    </span>{" "}
                                    <span className="dark:text-white">
                                      {Number(
                                        order.total_weight,
                                      ).toLocaleString()}
                                      g
                                    </span>
                                    {selectedStatus !== "cancelled" && (
                                      <span
                                        className={`ml-2 px-2 py-0.5  rounded-full text-sm font-semibold shadow-sm ${
                                          order.order_specific?.slice(0, 3) ===
                                          "NDD"
                                            ? "text-green-800 bg-green-100 border border-green-300"
                                            : order.order_specific?.slice(
                                                  0,
                                                  3,
                                                ) === "SDD"
                                              ? "text-yellow-800 bg-yellow-100 border border-yellow-300"
                                              : "text-red-800 bg-red-100 border border-red-300 animate-blink"
                                        }`}
                                      >
                                        {order.order_specific?.slice(0, 3) ===
                                        "NDD"
                                          ? "NDD"
                                          : order.order_specific?.slice(
                                                0,
                                                3,
                                              ) === "SDD"
                                            ? "SDD"
                                            : order.order_specific?.slice(
                                                  0,
                                                  6,
                                                ) === "Turant"
                                              ? "Turant"
                                              : order.order_specific}
                                      </span>
                                    )}
                                  </p>
                                  <p>
                                    <span className="font-medium dark:text-white text-gray-800">
                                      Dimensions:
                                    </span>{" "}
                                    <span className=" dark:text-white">
                                      {order.package_length}x
                                      {order.package_breadth}x
                                      {order.package_height}
                                    </span>
                                  </p>
                                </TableCell>

                                {/* Assignment */}
                                {/* {selectedStatus === "All" ? (
                                  <>
                                    <TableCell className="px-6 py-4 text-center">
                                      {order.status === "booked" ||
                                      order.status === "undelivered" ? (
                                        <>
                                          {!(
                                            isOpenIndividualAssignmnet ===
                                            order.id
                                          ) ? (
                                            <span className="px-3 py-1 rounded-full whitespace-nowrap text-xs font-medium bg-red-100 text-red-600 mb-2 inline-block cursor-pointer">
                                              Not Assigned
                                            </span>
                                          ) : (
                                            <></>
                                          )}
                                        </>
                                      ) : order.status === "pending pickup" ||
                                        order.status === "in transit" ||
                                        order.status === "picked" ||
                                        order.status === "out for delivery" ||
                                        order.status ===
                                          "undelivered assigned" ? (
                                        <>
                                          {!(
                                            isOpenIndividualAssignmnet ===
                                            order.id
                                          ) ? (
                                            order.mapped_with !== null ? (
                                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600 mb-2 inline-block cursor-pointer">
                                                Not Assigned
                                              </span>
                                            ) : (
                                              <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600 mb-2 inline-block cursor-pointer">
                                                Assigned
                                              </span>
                                            )
                                          ) : (
                                            <></>
                                          )}
                                        </>
                                      ) : order.status === "cancelled" ? (
                                        <span className="px-3 whitespace-nowrap py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
                                          Order Canceled
                                        </span>
                                      ) : order.status === "delivered" ? (
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                                          Assigned
                                        </span>
                                      ) : order.status === "rto delivered" ? (
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                                          Return To Origin
                                        </span>
                                      ) : (
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                                          Assigned
                                        </span>
                                      )}
                                    </TableCell>
                                  </>
                                ) : (
                                  <>
                                    <TableCell className="px-6 py-4 text-center">
                                      {order.status === "booked" ||
                                      order.status === "undelivered" ? (
                                        <>
                                          <span
                                            onClick={() => {
                                              if (
                                                order.status ===
                                                  "undelivered" &&
                                                order.mapped_with !== null
                                              ) {
                                                return;
                                              }
                                              if (
                                                order.tpc_awb_number !== null
                                              ) {
                                                return;
                                              }
                                            }}
                                            className="px-3 py-1 rounded-full whitespace-nowrap text-xs font-medium bg-red-100 text-red-600 mb-2 inline-block cursor-pointer"
                                          >
                                            Not Assigned
                                          </span>
                                        </>
                                      ) : order.status === "picked" &&
                                        order.rider_id == null ? (
                                        <>
                                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600 mb-2 inline-block cursor-pointer">
                                            Not Assignedd
                                          </span>
                                        </>
                                      ) : order.status === "pending pickup" ||
                                        order.status === "in transit" ||
                                        order.status === "picked" ||
                                        order.status ===
                                          "undelivered assigned" ? (
                                        <>
                                          {!(
                                            isOpenIndividualAssignmnet ===
                                            order.id
                                          ) ? (
                                            order.mapped_with !== null ||
                                            order.rider_id == null ? (
                                              <span
                                                onClick={() => {
                                                  if (
                                                    order.rider_preference ===
                                                    "self"
                                                  ) {
                                                    return;
                                                  }
                                                  if (
                                                    order.status ===
                                                    "in transit"
                                                  ) {
                                                    return;
                                                  }
                                                  if (
                                                    order.tpc_awb_number !==
                                                    null
                                                  ) {
                                                    return;
                                                  }
                                                  if (order.rider_id == null) {
                                                    return;
                                                  }

                                                  setIsOpenIndividualAssignmnet(
                                                    order.id,
                                                  );
                                                }}
                                                className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600 mb-2 inline-block cursor-pointer"
                                              >
                                                Not Assigned
                                              </span>
                                            ) : (
                                              <span
                                                onClick={() => {
                                                  if (
                                                    order.rider_preference ===
                                                    "self"
                                                  ) {
                                                    return;
                                                  }
                                                  if (
                                                    order.status ===
                                                    "in transit"
                                                  ) {
                                                    return;
                                                  }
                                                  if (
                                                    order.tpc_awb_number !==
                                                    null
                                                  ) {
                                                    return;
                                                  }
                                                  setIsOpenIndividualAssignmnet(
                                                    order.id,
                                                  );
                                                }}
                                                className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600 mb-2 inline-block cursor-pointer"
                                              >
                                                Assigned
                                              </span>
                                            )
                                          ) : (
                                            <form
                                              onSubmit={(e) => {
                                                e.preventDefault();
                                                cancelRiderAssignment(order.id);
                                                setIsOpenIndividualAssignmnet(
                                                  "",
                                                );
                                              }}
                                              className="flex items-center gap-2"
                                            >
                                              <button
                                                type="submit"
                                                className="bg-[#0446DB] text-white text-xs px-2 py-1 rounded hover:bg-indigo-800"
                                              >
                                                Cancel Rider Assignment
                                              </button>
                                              <button
                                                type="button"
                                                className="text-xs  text-gray-500 hover:underline"
                                                onClick={() =>
                                                  setIsOpenIndividualAssignmnet(
                                                    "",
                                                  )
                                                }
                                              >
                                                Close
                                              </button>
                                            </form>
                                          )}
                                        </>
                                      ) : order.status === "cancelled" ? (
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
                                          Order Canceled
                                        </span>
                                      ) : order.status === "delivered" ? (
                                        <span className="px-3 py-1 whitespace-nowrap rounded-full text-xs font-medium bg-green-100 text-green-600">
                                          Assignment Completed
                                        </span>
                                      ) : order.status === "rto in transit" ? (
                                        <>
                                          <span className="px-3 py-1 rounded-full whitespace-nowrap text-xs font-medium bg-red-100 text-red-600 mb-2 inline-block cursor-pointer">
                                            Not Assigned
                                          </span>
                                        </>
                                      ) : order.status === "rto delivered" ? (
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                                          Return To Origin
                                        </span>
                                      ) : (
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                                          Assigned
                                        </span>
                                      )}
                                    </TableCell>
                                  </>
                                )} */}

                                {/* Map */}
                                {/* {selectedStatus === "All" ? (
                                  <>
                                    <td className="px-6 py-4 text-center">
                                      {order.mapped_with === null ? (
                                        <span className="px-3 py-1 whitespace-nowrap rounded-full text-xs font-medium bg-red-100 text-red-600">
                                          Not Mapped
                                        </span>
                                      ) : order.status === "cancelled" ? (
                                        <span className="px-3 py-1 whitespace-nowrap rounded-full text-xs font-medium bg-red-100 text-red-600">
                                          Order Canceled
                                        </span>
                                      ) : order.status === "delivered" ? (
                                        <span className="px-3 py-1 whitespace-nowrap rounded-full text-xs font-medium bg-green-100 text-green-600">
                                          Order Delivered
                                        </span>
                                      ) : order.status === "rto delivered" ? (
                                        <span className="px-3 py-1 whitespace-nowrap rounded-full text-xs font-medium bg-green-100 text-green-600">
                                          Return To Origin
                                        </span>
                                      ) : order.mapped_with !== null ? (
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                                          Mapped
                                        </span>
                                      ) : (
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                                          Mapped
                                        </span>
                                      )}
                                    </td>
                                  </>
                                ) : (
                                  <>
                                    <TableCell className="px-6 py-4 text-center">
                                      {order.status === "booked" ? (
                                        <>
                                          {!(
                                            isOpenIndividualVendorAssignmnet ===
                                            order.id
                                          ) ? (
                                            <span
                                              onClick={() => {
                                                if (
                                                  order.tpc_awb_number !== null
                                                ) {
                                                  return;
                                                }
                                                fetchVendor(order.id);
                                                if (
                                                  order.rider_preference ===
                                                  "daakit"
                                                ) {
                                                  setIsOpenIndividualVendorAssignmnet(
                                                    order.id,
                                                  );
                                                  setIsOpenIndividualAssignmnet(
                                                    "",
                                                  );
                                                }
                                              }}
                                              className="px-3 py-1 whitespace-nowrap rounded-full text-xs font-medium bg-red-100 text-red-600 mb-2 inline-block cursor-pointer"
                                            >
                                              Not Mapped
                                            </span>
                                          ) : (
                                            <form
                                              onSubmit={(e) => {
                                                e.preventDefault();
                                                const selectedVendor =
                                                  assignmentState;
                                                if (!selectedVendor) {
                                                  toast.warn(
                                                    "Please select a vendor",
                                                  );
                                                  return;
                                                }
                                                assignVendor(
                                                  order.id,
                                                  selectedVendor,
                                                );
                                                setIsOpenIndividualAssignmnet(
                                                  "",
                                                );
                                              }}
                                              className="flex items-center gap-2"
                                            >
                                              <select
                                                value={assignmentState}
                                                onChange={(e) =>
                                                  setAssignmentState(
                                                    e.target.value,
                                                  )
                                                }
                                                className="border px-2 py-1 rounded-md"
                                                required
                                              >
                                                <option value="" disabled>
                                                  Select Vendor
                                                </option>
                                                {vendor.map((vendor) => (
                                                  <option
                                                    key={vendor.vendor_id}
                                                    value={vendor.vendor_id}
                                                  >
                                                    {vendor.vendor_id} :{" "}
                                                    {vendor.vendor_name}
                                                  </option>
                                                ))}
                                              </select>
                                              <button
                                                type="submit"
                                                className="bg-[#0446DB] text-white text-xs px-2 py-1 rounded hover:bg-indigo-800"
                                              >
                                                Assign
                                              </button>
                                              <button
                                                type="button"
                                                className="text-xs text-gray-500 hover:underline"
                                                onClick={() =>
                                                  setIsOpenIndividualVendorAssignmnet(
                                                    "",
                                                  )
                                                }
                                              >
                                                Close
                                              </button>
                                            </form>
                                          )}
                                        </>
                                      ) : order.status === "pending pickup" ||
                                        order.status === "out for delivery" ||
                                        order.status ===
                                          "undelivered assigned" ? (
                                        <>
                                          {!(
                                            isOpenIndividualAssignmnetMap ===
                                            order.id
                                          ) ? (
                                            order.mapped_with !== null ? (
                                              <span
                                                onClick={() => {
                                                  if (
                                                    order.status ===
                                                      "out for delivery" ||
                                                    order.status ===
                                                      "undelivered assigned"
                                                  ) {
                                                    return;
                                                  }

                                                  setIsOpenIndividualAssignmnetMap(
                                                    order.id,
                                                  );
                                                }}
                                                className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600 mb-2 inline-block cursor-pointer"
                                              >
                                                Mapped
                                              </span>
                                            ) : order.mapped_with == null ? (
                                              <>
                                                <AlertDialog>
                                                  <AlertDialogTrigger asChild>
                                                    <Button
                                                      type="button"
                                                      onClick={() => {
                                                        const order_ids = [
                                                          order.id,
                                                        ];

                                                        setFetchBulkAssignmentVendor(
                                                          true,
                                                        );
                                                        fetchVendor(order_ids);
                                                      }}
                                                      className="cursor-pointer rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-600 transition-colors hover:bg-green-200"
                                                    >
                                                      Map Vendor
                                                    </Button>
                                                  </AlertDialogTrigger>

                                                  <AlertDialogContent className="!max-w-md overflow-hidden rounded-md border border-gray-200 bg-white p-0 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
                                                   
                                                    <AlertDialogHeader className="border-b border-gray-100 px-5 py-4 text-left dark:border-neutral-800">
                                                      <AlertDialogTitle className="text-base font-semibold text-gray-900 dark:text-white">
                                                        Map Orders to Vendor
                                                      </AlertDialogTitle>

                                                      <AlertDialogDescription className="mt-1 text-sm text-gray-500 dark:text-neutral-400"></AlertDialogDescription>
                                                    </AlertDialogHeader>

                                                
                                                    <div className="px-5 py-5">
                                                      <label className="mb-2 block text-xs font-semibold text-gray-700 dark:text-neutral-300">
                                                        Select Vendor
                                                      </label>

                                                      <select
                                                        value={assignmentState}
                                                        onChange={(e) =>
                                                          setAssignmentState(
                                                            e.target.value,
                                                          )
                                                        }
                                                        className="h-11 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-[#0446DB] focus:ring-2 focus:ring-blue-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 dark:focus:ring-blue-500/10"
                                                      >
                                                        <option value="">
                                                          Select Vendor
                                                        </option>

                                                        {vendor?.map(
                                                          (vendorItem) => (
                                                            <option
                                                              key={
                                                                vendorItem.vendor_id
                                                              }
                                                              value={
                                                                vendorItem.vendor_id
                                                              }
                                                            >
                                                              {
                                                                vendorItem.vendor_id
                                                              }{" "}
                                                              :{" "}
                                                              {
                                                                vendorItem.vendor_name
                                                              }
                                                            </option>
                                                          ),
                                                        )}
                                                      </select>

                                                      {fetchBulkAssignmentVendor &&
                                                        vendor?.length ===
                                                          0 && (
                                                          <p className="mt-2 text-xs text-gray-500 dark:text-neutral-400">
                                                            Loading available
                                                            vendors...
                                                          </p>
                                                        )}
                                                    </div>

                                                  
                                                    <AlertDialogFooter className="border-t border-gray-100 bg-gray-50/70 px-5 py-4 dark:border-neutral-800 dark:bg-neutral-950/30">
                                                      <AlertDialogCancel className=" cursor-pointer rounded-md">
                                                        Cancel
                                                      </AlertDialogCancel>

                                                      <Button
                                                        type="button"
                                                        onClick={async () => {
                                                          if (
                                                            !assignmentState
                                                          ) {
                                                            toast.warn(
                                                              "Please select a vendor",
                                                            );
                                                            return;
                                                          }

                                                          const order_ids = [
                                                            order.id,
                                                          ];

                                                          await assignVendor(
                                                            order_ids,
                                                            assignmentState,
                                                          );

                                                          setSelectedBulkOrders(
                                                            [],
                                                          );
                                                          setBulkOrderWeight(0);
                                                          setFetchBulkAssignmentVendor(
                                                            false,
                                                          );
                                                          setAssignmentState(
                                                            "",
                                                          );
                                                        }}
                                                        className=" cursor-pointer rounded-md bg-[#0446DB] px-5 text-sm font-medium text-white transition hover:bg-[#0339b5]"
                                                      >
                                                        Map Vendors
                                                      </Button>
                                                    </AlertDialogFooter>
                                                  </AlertDialogContent>
                                                </AlertDialog>
                                              </>
                                            ) : (
                                              <>
                                                <span className="px-3 py-1 whitespace-nowrap rounded-full text-xs font-medium  bg-red-100 text-red-600 mb-2 inline-block cursor-pointer">
                                                  Not Mapped
                                                </span>
                                              </>
                                            )
                                          ) : (
                                            <form
                                              onSubmit={(e) => {
                                                e.preventDefault();
                                                cancelVendorAssignment(
                                                  order.id,
                                                );
                                                setIsOpenIndividualAssignmnet(
                                                  "",
                                                );
                                              }}
                                              className="flex items-center gap-2"
                                            >
                                              <button
                                                type="submit"
                                                className="bg-[#0446DB] whitespace-nowrap text-white text-xs px-2 py-1 rounded hover:bg-indigo-800"
                                              >
                                                Cancel Vendor Assignment
                                              </button>
                                              <button
                                                type="button"
                                                className="text-xs bg-red-500/20 px-2 py-1 rounded text-red-500 text-gray-500 hover:underline"
                                                onClick={() =>
                                                  setIsOpenIndividualAssignmnetMap(
                                                    "",
                                                  )
                                                }
                                              >
                                                Close
                                              </button>
                                            </form>
                                          )}
                                        </>
                                      ) : order.status === "picked" &&
                                        order?.mapped_with === null ? (
                                        <>
                                          <span className="px-3 whitespace-nowrap py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
                                            Not Mapped
                                          </span>
                                        </>
                                      ) : order.status === "cancelled" ? (
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
                                          Order Canceled
                                        </span>
                                      ) : order.status === "undelivered" ? (
                                        <>
                                          {checkVendorMapping !== null &&
                                          !checkVendorMapping?.canChangeMapping &&
                                          isOpenIndividualVendorMap ===
                                            order.id ? (
                                            <>
                                              <form
                                                onSubmit={(e) => {
                                                  e.preventDefault();
                                                  revokeVendorMapping(order.id);
                                                }}
                                                className="flex items-center gap-2"
                                              >
                                                <button
                                                  type="submit"
                                                  className="bg-[#0446DB] whitespace-nowrap text-white text-xs px-2 py-1 rounded hover:bg-indigo-800"
                                                >
                                                  Revoke Vendor Mapping
                                                </button>
                                                <button
                                                  type="button"
                                                  className="text-xs bg-red-500/20 px-2 py-1 rounded text-red-500 text-gray-500 hover:underline"
                                                  onClick={() => {
                                                    setCheckVendorMapping({
                                                      canChangeMapping: true,
                                                      currentAction: "grant",
                                                    });
                                                    setIsOpenIndividualVendorMap(
                                                      "",
                                                    );
                                                  }}
                                                >
                                                  Close
                                                </button>
                                              </form>
                                            </>
                                          ) : isOpenIndividualVendorMap ===
                                            order.id ? (
                                            <>
                                              <form
                                                onSubmit={(e) => {
                                                  e.preventDefault();
                                                  const selectedVendor =
                                                    assignmentState;
                                                  if (!selectedVendor) {
                                                    toast.warn(
                                                      "Please select a vendor",
                                                    );
                                                    return;
                                                  }
                                                  changeVendorMapping(
                                                    order.id,
                                                    selectedVendor,
                                                  );
                                                  setIsOpenIndividualVendorMap(
                                                    "",
                                                  );
                                                }}
                                                className="flex items-center gap-2"
                                              >
                                                <select
                                                  value={assignmentState}
                                                  onChange={(e) =>
                                                    setAssignmentState(
                                                      e.target.value,
                                                    )
                                                  }
                                                  className="border px-2 py-1 rounded-md"
                                                  required
                                                >
                                                  <option value="" disabled>
                                                    Select Vendor
                                                  </option>
                                                  {vendor.map((vendor) => (
                                                    <option
                                                      key={vendor.vendor_id}
                                                      value={vendor.vendor_id}
                                                    >
                                                      {vendor.vendor_id} :{" "}
                                                      {vendor.vendor_name}
                                                    </option>
                                                  ))}
                                                </select>
                                                <button
                                                  type="submit"
                                                  className="bg-[#0446DB] whitespace-nowrap text-white text-xs px-2 py-1 rounded hover:bg-indigo-800"
                                                >
                                                  Change Mapping
                                                </button>
                                                <button
                                                  type="button"
                                                  className="text-xs text-gray-500 hover:underline"
                                                  onClick={() =>
                                                    setIsOpenIndividualVendorMap(
                                                      "",
                                                    )
                                                  }
                                                >
                                                  Close
                                                </button>
                                              </form>
                                            </>
                                          ) : (
                                            <span
                                              onClick={() => {
                                                if (
                                                  order.status === "undelivered"
                                                ) {
                                                  checkVendorMappingStatus(
                                                    order.id,
                                                  );
                                                  fetchVendor(order.id);
                                                 
                                                  setIsOpenIndividualVendorMap(
                                                    order.id,
                                                  );
                                                
                                                }
                                              }}
                                              className="px-3 py-1 cursor-pointer rounded-full text-xs font-medium bg-green-100 text-green-600"
                                            >
                                              Mapped
                                            </span>
                                          )}
                                        </>
                                      ) : order.status === "delivered" ||
                                        order.status === "undelivered" ||
                                        order.status === "rto in transit" ? (
                                        <>
                                          {order.mapped_with === null ? (
                                            <span className="px-3 whitespace-nowrap py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
                                              Not Mapped
                                            </span>
                                          ) : isOpenIndividualVendorMap ===
                                            order.id ? (
                                            <>
                                              <form
                                                onSubmit={(e) => {
                                                  e.preventDefault();
                                                  const selectedVendor =
                                                    assignmentState;
                                                  if (!selectedVendor) {
                                                    toast.warn(
                                                      "Please select a vendor",
                                                    );
                                                    return;
                                                  }
                                                  changeVendorMapping(
                                                    order.id,
                                                    selectedVendor,
                                                  );
                                                  setIsOpenIndividualVendorMap(
                                                    "",
                                                  );
                                                }}
                                                className="flex items-center gap-2"
                                              >
                                                <select
                                                  value={assignmentState}
                                                  onChange={(e) =>
                                                    setAssignmentState(
                                                      e.target.value,
                                                    )
                                                  }
                                                  className="border px-2 py-1 rounded-md"
                                                  required
                                                >
                                                  <option value="" disabled>
                                                    Select Vendor
                                                  </option>
                                                  {vendor.map((vendor) => (
                                                    <option
                                                      key={vendor.vendor_id}
                                                      value={vendor.vendor_id}
                                                    >
                                                      {vendor.vendor_id} :{" "}
                                                      {vendor.vendor_name}
                                                    </option>
                                                  ))}
                                                </select>
                                                <button
                                                  type="submit"
                                                  className="bg-[#0446DB] text-white text-xs px-2 py-1 rounded hover:bg-indigo-800"
                                                >
                                                  Assign
                                                </button>
                                                <button
                                                  type="button"
                                                  className="text-xs text-gray-500 hover:underline"
                                                  onClick={() =>
                                                    setIsOpenIndividualVendorMap(
                                                      "",
                                                    )
                                                  }
                                                >
                                                  Close
                                                </button>
                                              </form>
                                            </>
                                          ) : (
                                            <span
                                              onClick={() => {
                                                if (
                                                  order.status === "undelivered"
                                                ) {
                                                  fetchVendor(order.id);
                                                  setIsOpenIndividualVendorMap(
                                                    order.id,
                                                  );
                                                  setIsOpenIndividualAssignmnetMap(
                                                    "",
                                                  );
                                                }
                                              }}
                                              className="px-3 py-1 cursor-pointer rounded-full text-xs font-medium bg-green-100 text-green-600"
                                            >
                                              Mapped
                                            </span>
                                          )}
                                        </>
                                      ) : order.status === "rto delivered" ? (
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                                          Return To Origin
                                        </span>
                                      ) : order.mapped_with !== null ? (
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                                          Mapped
                                        </span>
                                      ) : order.status === "in transit" ? (
                                        <span className="px-3 py-1 whitespace-nowrap rounded-full text-xs font-medium bg-red-100 text-red-600">
                                          Not Mapped
                                        </span>
                                      ) : (
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                                          Assigned
                                        </span>
                                      )}
                                    </TableCell>
                                  </>
                                )} */}

                                {/* Status */}
                                {selectedStatus === "All" ? (
                                  <>
                                    {/* only view ststus */}
                                    <TableCell className=" py-2 text-center">
                                      {order.status === "cancelled" ||
                                      order.status === "undelivered" ||
                                      order.status === "delivered" ||
                                      order.status === "ndr" ||
                                      order.status === "rto delivered" ? (
                                        <span
                                          className={`px-3 py-1 rounded-full whitespace-nowrap text-xs font-semibold inline-block ${
                                            order.status === "cancelled"
                                              ? "bg-red-100 text-red-600"
                                              : order.status === "undelivered"
                                                ? "bg-red-100 text-green-600"
                                                : order.status === "delivered"
                                                  ? "bg-green-100 text-green-600"
                                                  : "bg-yellow-100 text-yellow-600"
                                          } `}
                                        >
                                          {order.status === "rto delivered"
                                            ? "RTO Delivered"
                                            : order.status === "ndr"
                                              ? "NDR"
                                              : toCapitalizeEachWord(
                                                  order.status,
                                                )}
                                        </span>
                                      ) : (
                                        <span className="px-3 py-1 whitespace-nowrap rounded-full text-xs font-semibold inline-block bg-blue-100 text-blue-600">
                                          {order.status === "rto in transit"
                                            ? "RTO In Transit"
                                            : toCapitalizeEachWord(
                                                order.status,
                                              )}
                                        </span>
                                      )}
                                    </TableCell>
                                  </>
                                ) : (
                                  <>
                                    <TableCell className=" py-2 text-left">
                                      {order.status === "cancelled" ||
                                      // order.status === "undelivered" ||
                                      order.status === "delivered" ||
                                      order.status === "ndr" ||
                                      order.status === "rto delivered" ? (
                                        <span
                                          className={`px-3 py-1 rounded-full text-xs font-semibold inline-block ${
                                            order.status === "cancelled"
                                              ? "bg-red-100 text-red-600"
                                              : order.status === "undelivered"
                                                ? "bg-red-100 text-green-600"
                                                : order.status === "delivered"
                                                  ? "bg-green-100 text-green-600"
                                                  : "bg-yellow-100 text-yellow-600"
                                          } `}
                                        >
                                          {order.status === "rto delivered"
                                            ? "RTO Delivered"
                                            : order.status === "ndr"
                                              ? "NDR"
                                              : toCapitalizeEachWord(
                                                  order.status,
                                                )}
                                        </span>
                                      ) : (
                                        <>
                                          {editingStatusId === order.id ? (
                                            <form
                                              onSubmit={async (e) => {
                                                e.preventDefault();

                                                const newStatus =
                                                  e.target.elements.status
                                                    .value;

                                                if (
                                                  selectedStatus ===
                                                    "rto in transit" &&
                                                  newStatus == "rto delivered"
                                                ) {
                                             
                        
                                                  await rtoDelivered([
                                                    order.id,
                                                  ]);
                                                  return;
                                                }

                                                if (
                                                  newStatus ==
                                                  "cancel rider assignment"
                                                ) {
                                                  cancelRiderAssignments([
                                                    order.id,
                                                  ]);
                                                }

                                                await changeOrderStatus({
                                                  order_ids: [order.id],
                                                  newStatus,
                                                });
                                              }}
                                            >
                                              <div className="flex items-center gap-2">
                                                <select
                                                  name="status"
                                                  defaultValue={order.status}
                                                  onChange={(e) => {
                                                    setAssignmentState(
                                                      e.target.value,
                                                    );
                                                  }}
                                                  className="text-xs border border-gray-300 rounded-md px-2 py-1"
                                                  required
                                                >
                                                  <option value="">
                                                    Change Status
                                                  </option>
                                                  {order.status ===
                                                    "booked" && (
                                                    <>
                                                      <option value="cancelled">
                                                        Cancelled
                                                      </option>
                                                    </>
                                                  )}
                                                  {order.status ===
                                                    "picked" && (
                                                    <>
                                                      <option value="in transit">
                                                        In Transit
                                                      </option>
                                                    </>
                                                  )}
                                                  {order.status ===
                                                    "undelivered" && (
                                                    <>
                                                      <option value="undelivered assigned">
                                                        Undelivered Assigned
                                                      </option>
                                                      <option value="lost">
                                                        Lost
                                                      </option>
                                                    </>
                                                  )}
                                                  {order.status ===
                                                    "pending pickup" && (
                                                    <>
                                                      <option value="in transit">
                                                        In Transit
                                                      </option>
                                                      <option value="cancelled">
                                                        Cancelled
                                                      </option>
                                                    </>
                                                  )}
                                                  {order.status ===
                                                    "in transit" && (
                                                    <>
                                                      <option value="out for delivery">
                                                        Mark Out For Delivery
                                                      </option>
                                                      <option value="lost">
                                                        Mark Lost
                                                      </option>
                                                    </>
                                                  )}
                                                  {order.status ===
                                                    "out for delivery"  && (
                                                      <>
                                                        <option value="delivered">
                                                          Delivered
                                                        </option>
                                                        <option value="ndr">
                                                          NDR
                                                        </option>
                                                        <option value="lost">
                                                          Lost
                                                        </option>
                                                      </>
                                                    )}

                                                    {
                                                      order.status ==
                                                      "rto out for delivery" && (
                                                        <>
                                                        <option value="rto delivered">
                                                         RTO Delivered
                                                        </option>
                                                        <option value="ndr">
                                                          NDR
                                                        </option>
                                                        </>
                                                      )
                                                    }
                                                  {order.status ===
                                                    "rto in transit" && (
                                                    <>
                                                      {/* <option value="rto delivered">
                                                        RTO Delivered
                                                      </option> */}
                                                      <option value="rto out for delivery">
                                                        RTO Out For Delivery
                                                      </option>
                                                      <option value="lost">
                                                        Lost
                                                      </option>
                                                    </>
                                                  )}
                                                  {order.status ===
                                                    "rto undelivered" && (
                                                    <>
                                                      <option value="rto out for delivery">
                                                        RTO Out For Delivery
                                                      </option>
                                                      
                                                      <option value="lost">
                                                        Lost
                                                      </option>
                                                    </>
                                                  )}
                                                  {order.status ===
                                                    "undelivered assigned" && (
                                                    <>
                                                      <option value="out for delivery">
                                                        Mark Out For Delivery
                                                      </option>
                                                      <option value="cancel rider assignment">
                                                        Cancel Rider Assignemnt
                                                      </option>
                                                      <option value="lost">
                                                        Mark Lost
                                                      </option>
                                                    </>
                                                  )}
                                                </select>
                                                {assignmentState == "ndr" && (
                                                  <>
                                                    <Dialog className="w-5xl">
                                                      <DialogTrigger asChild>
                                                        <Button
                                                          variant="outline"
                                                          className="text-sm font-medium rounded-sm border py-0.5 bg-[#0446DB] hover:text-[#FFF] text-white border-[#0446DB]  hover:bg-[#0446DB] inline-block cursor-pointer"
                                                        >
                                                          <span>
                                                            Mark as NDR
                                                          </span>
                                                        </Button>
                                                      </DialogTrigger>
                                                      <DialogContent className="">
                                                        <DialogHeader>
                                                          <DialogTitle>
                                                            NDR
                                                          </DialogTitle>
                                                        </DialogHeader>

                                                        <div>
                                                          <label
                                                            htmlFor="delivery_reason"
                                                            className="block mb-1 mt-2"
                                                          >
                                                            Undelivered Reason
                                                          </label>
                                                          <select
                                                            name="delivery_reason"
                                                            id="delivery_reason"
                                                            onChange={(e) => {
                                                              setRemarks(
                                                                e.target.value,
                                                              );
                                                              setRescheduleDate(
                                                                "",
                                                              );
                                                              setSub_remarks(
                                                                "",
                                                              );
                                                            }}
                                                            className=" border w-full py-2 px-2 rounded"
                                                          >
                                                            <option value="">
                                                              -- Select Reason
                                                              --
                                                            </option>
                                                            {
                                                              (assignmentState == "ndr" && selectedStatus == 'out for delivery') && (
                                                                <>
                                                                
                                                            <option value="Address Incorrect / Incomplete">
                                                              Address Incorrect
                                                              / Incomplete
                                                            </option>
                                                            <option value="Customer Requested Reschedule">
                                                              Customer Requested
                                                              Reschedule
                                                            </option>
                                                            <option value="Customer Refused / Cancelled">
                                                              Customer Refused /
                                                              Cancelled
                                                            </option>
                                                            <option value="Delivery Attempted – Not Reachable">
                                                              Delivery Attempted
                                                              – Not Reachable
                                                            </option>
                                                            <option value="Delivery Attempted – No Response">
                                                              Delivery Attempted
                                                              – No Response
                                                            </option>
                                                            <option value="Wrong Pincode / Address">
                                                              Wrong Pincode /
                                                              Address
                                                            </option>
                                                            <option value="Wrong Contact Details">
                                                              Wrong Contact
                                                              Details
                                                            </option>
                                                            <option value="Vehicle / Weather / Road Issue">
                                                              Vehicle / Weather
                                                              / Road Issue
                                                            </option>
                                                            <option value="Package Damaged">
                                                              Package Damaged
                                                            </option>
                                                                </>
                                                              )
                                                            }

                                                           

                                                            {
                                                              selectedStatus == 'rto out for delivery' && (
                                                                <>
                                                              {[
                                                                { label: "Origin Unavailable" },
                                                                { label: "Origin Closed" },
                                                                { label: "Origin Refused" },
                                                                { label: "Contact Person Unavailable" },
                                                                { label: "Origin Not Reachable" },
                                                                { label: "Address Not Found" },
                                                                { label: "Delivery Attempt Failed" },
                                                                { label: "Other" },
                                                              ].map((e) => (
                                                                <option key={e.label} value={e.label}>
                                                                  {e.label}
                                                                </option>
                                                              ))}

                                                              gjhgjhgjhg
                                                                </>
                                                              )
                                                            }
                                                          </select>

                                                          {remarks ==
                                                            "Customer Requested Reschedule" && (
                                                            <>
                                                              <div>
                                                                <label
                                                                  htmlFor=""
                                                                  className="block mb-1 mt-2"
                                                                >
                                                                  Reschedule
                                                                  Date
                                                                </label>
                                                                <input
                                                                  type="date"
                                                                  value={
                                                                    rescheduleDate
                                                                  }
                                                                  onClick={(
                                                                    e,
                                                                  ) =>
                                                                    e.target.showPicker?.()
                                                                  }
                                                                  onChange={(
                                                                    e,
                                                                  ) =>
                                                                    setRescheduleDate(
                                                                      e.target
                                                                        .value,
                                                                    )
                                                                  }
                                                                  className=" border w-full py-2 px-2 rounded"
                                                                />
                                                              </div>
                                                            </>
                                                          )}
                                                          {remarks ==
                                                            "Customer Requested Reschedule" && (
                                                            <>
                                                              <label
                                                                htmlFor=""
                                                                className="block mb-1 mt-2 "
                                                              >
                                                                Sub Remark
                                                              </label>
                                                              <select
                                                                onChange={(
                                                                  e,
                                                                ) => {
                                                                  setSub_remarks(
                                                                    e.target
                                                                      .value,
                                                                  );
                                                                }}
                                                                className="border w-full py-2 px-2 rounded"
                                                              >
                                                                <option value="">
                                                                  -- Select
                                                                  Reason --
                                                                </option>
                                                                <option value="Unavailable at Location">
                                                                  Unavailable at
                                                                  Location
                                                                </option>
                                                                <option value="Out of Station">
                                                                  Out of Station
                                                                </option>
                                                                <option value="COD Amount Not Ready">
                                                                  COD Amount Not
                                                                  Ready
                                                                </option>
                                                                <option value="Require Different Time Slot">
                                                                  Require
                                                                  Different Time
                                                                  Slot
                                                                </option>
                                                                <option value="Other">
                                                                  Other
                                                                </option>
                                                              </select>
                                                            </>
                                                          )}
                                                          {remarks ==
                                                            "Customer Refused / Cancelled" && (
                                                            <>
                                                              <label
                                                                htmlFor=""
                                                                className="block mb-1 mt-2 "
                                                              >
                                                                Sub Remark
                                                              </label>
                                                              <select
                                                                onChange={(
                                                                  e,
                                                                ) => {
                                                                  setSub_remarks(
                                                                    e.target
                                                                      .value,
                                                                  );
                                                                }}
                                                                className="border w-full py-2 px-2 rounded"
                                                              >
                                                                <option value="">
                                                                  -- Select
                                                                  Reason --
                                                                </option>
                                                                <option value="Duplicate Order">
                                                                  Duplicate
                                                                  Order
                                                                </option>
                                                                <option value="Order Placed by Mistake">
                                                                  Order Placed
                                                                  by Mistake
                                                                </option>
                                                                <option value="COD Amount Not Ready">
                                                                  COD Amount Not
                                                                  Ready
                                                                </option>
                                                                <option value="Better Price Elsewhere">
                                                                  Better Price
                                                                  Elsewhere
                                                                </option>
                                                                <option value="Other">
                                                                  Other
                                                                </option>
                                                              </select>
                                                            </>
                                                          )}

                                                          <div>
                                                            <label
                                                              htmlFor="remark"
                                                              className="block mb-1 mt-2"
                                                            >
                                                              Remark (Optional)
                                                            </label>
                                                            <input
                                                              type="text"
                                                              value={
                                                                detailed_remarks
                                                              }
                                                              placeholder="Enter remark"
                                                              onChange={(e) =>
                                                                setdetailed_remarks(
                                                                  e.target
                                                                    .value,
                                                                )
                                                              }
                                                              className=" border w-full py-2 px-2 rounded"
                                                            />
                                                          </div>
                                                        </div>

                                                        <Button
                                                          onClick={async () => {
                                                            // const order_ids = selectedBulkOrders.map((o) => o.id);
                                                            await changeOrderStatus(
                                                              {
                                                                order_ids: [
                                                                  order.id,
                                                                ],
                                                                newStatus:
                                                                  order.status ==
                                                                  "rto out for delivery"
                                                                    ? "rto undelivered"
                                                                    : assignmentState,
                                                                remarks:
                                                                  remarks,
                                                                sub_remarks:
                                                                  sub_remarks,
                                                                detailed_remarks:
                                                                  detailed_remarks,
                                                                rescheduled_date:
                                                                  rescheduleDate,
                                                                rider_id: "",
                                                              },
                                                            );
                                                          }}
                                                          className={
                                                            "bg-[#0446DB]"
                                                          }
                                                        >
                                                          Submit
                                                        </Button>

                                                        <DialogFooter>
                                                          <DialogClose asChild>
                                                            <Button
                                                              onClick={() => {
                                                                clearAllState();
                                                              }}
                                                              variant="outline"
                                                            >
                                                              Cancel
                                                            </Button>
                                                          </DialogClose>
                                                        </DialogFooter>
                                                      </DialogContent>
                                                    </Dialog>
                                                  </>
                                                )}
                                                {(assignmentState ==
                                                  "undelivered assigned" ||
                                                  assignmentState ==
                                                    "in transit") && (
                                                  <>
                                                    <Dialog className="w-5xl">
                                                      <DialogTrigger asChild>
                                                        <Button
                                                          variant="outline"
                                                          className="text-sm font-medium rounded-sm border  bg-[#0446DB] hover:text-[#FFF] text-white border-[#0446DB]  hover:bg-[#0446DB] inline-block cursor-pointer"
                                                        >
                                                          <span>
                                                            Select Rider
                                                          </span>
                                                        </Button>
                                                      </DialogTrigger>
                                                      <DialogContent className="">
                                                        <DialogHeader>
                                                          <DialogTitle>
                                                            Select a Rider
                                                          </DialogTitle>
                                                        </DialogHeader>

                                                        <div>
                                                          <label
                                                            htmlFor="delivery_reason"
                                                            className="block mb-1 mt-2"
                                                          >
                                                            Select Rider
                                                          </label>
                                                          <select
                                                            name="delivery_reason"
                                                            id="delivery_reason"
                                                            onChange={(e) => {
                                                              setRiderID(
                                                                e.target.value,
                                                              );
                                                            }}
                                                            className=" border w-full py-2 px-2 rounded"
                                                          >
                                                            <option value="">
                                                              -- Select Rider --
                                                            </option>
                                                            {riders.map(
                                                              (rider) => (
                                                                <option
                                                                  key={rider.id}
                                                                  value={
                                                                    rider.id
                                                                  }
                                                                >
                                                                  {rider.id} :{" "}
                                                                  {rider.name}
                                                                </option>
                                                              ),
                                                            )}
                                                          </select>
                                                        </div>
                                                        <Button
                                                          onClick={async () => {
                                                            await changeOrderStatus(
                                                              {
                                                                order_ids: [
                                                                  order.id,
                                                                ],
                                                                newStatus:
                                                                  assignmentState ==
                                                                  "in transit"
                                                                    ? "in transit"
                                                                    : "undelivered assigned",
                                                                rider_id:
                                                                  riderID,
                                                              },
                                                            );
                                                          }}
                                                          className={
                                                            "bg-[#0446DB]"
                                                          }
                                                        >
                                                          Submit
                                                        </Button>

                                                        <DialogFooter>
                                                          <DialogClose asChild>
                                                            <Button
                                                              onClick={() => {
                                                                clearAllState();
                                                              }}
                                                              variant="outline"
                                                            >
                                                              Cancel
                                                            </Button>
                                                          </DialogClose>
                                                        </DialogFooter>
                                                      </DialogContent>
                                                    </Dialog>
                                                  </>
                                                )}

                                                {assignmentState &&
                                                  assignmentState !== "ndr" &&
                                                  assignmentState !==
                                                    "in transit" &&
                                                  assignmentState !==
                                                    "undelivered assigned" && (
                                                    <button
                                                      type="submit"
                                                      className="bg-[#0446DB] text-white text-xs px-2 py-1 rounded hover:bg-indigo-800"
                                                    >
                                                      Update
                                                    </button>
                                                  )}
                                                <button
                                                  type="button"
                                                  onClick={() => {
                                                    setEditingStatusId(null);
                                                    clearAllState();
                                                  }}
                                                  className="text-xs text-gray-500 hover:underline"
                                                >
                                                  Close
                                                </button>
                                              </div>
                                            </form>
                                          ) : (
                                            <>
                                              <span
                                                onClick={() => {
                                                  if (
                                                    order.rider_preference ===
                                                    "self"
                                                  ) {
                                                    return;
                                                  }
                                                  if (
                                                    order.status == "in transit"
                                                  ) {
                                                    setEditingStatusId(
                                                      order.id,
                                                    );
                                                    return;
                                                  }
                                                  if (
                                                    order.status ==
                                                    "undelivered assigned"
                                                  ) {
                                                    setEditingStatusId(
                                                      order.id,
                                                    );
                                                    return;
                                                  }
                                                  if (
                                                    order.status ==
                                                      "out for delivery" ||
                                                    order.status ==
                                                      "rto out for delivery"
                                                  ) {
                                                    setEditingStatusId(
                                                      order.id,
                                                    );
                                                    return;
                                                  }
                                                  if (
                                                    (order.status ===
                                                      "undelivered" ||
                                                      order.status ===
                                                        "picked") &&
                                                    order.mapped_with &&
                                                    (order.pickup_stage ===
                                                      null ||
                                                      order.pickup_stage ===
                                                        "at_vendor")
                                                  ) {
                                                    const vendor_ids = [
                                                      order?.mapped_with,
                                                    ];
                                                    fetchRider(vendor_ids);
                                                    setEditingStatusId(
                                                      order.id,
                                                    );
                                                    return;
                                                  }
                                                  if (
                                                    order.status ===
                                                      "pending pickup" &&
                                                    order.tpc_awb_number !==
                                                      null
                                                  ) {
                                                    return;
                                                  }
                                                  if (
                                                    selectedStatus ===
                                                    "rto in transit"
                                                  ) {
                                                    setEditingStatusId(
                                                      order.id,
                                                    );
                                                    return;
                                                  }
                                                  
                                                  if (selectedStatus ==="rto in transit" || selectedStatus=='rto undelivered') {
                                                    
                                                    setEditingStatusId(
                                                      order.id,
                                                    );
                                                    return;
                                                  }
                                                  if (
                                                    order.tpc_awb_number !==
                                                    null
                                                  ) {
                                                    return;
                                                  }
                                                  if (
                                                    order.rider_preference ===
                                                    "daakit"
                                                  ) {
                                                    if (
                                                      order.mapped_with !== null
                                                    ) {
                                                      return;
                                                    } else if (
                                                      order.status === "booked"
                                                    ) {
                                                      setEditingStatusId(
                                                        order.id,
                                                      );
                                                    }
                                                    // setEditingStatusId(order.id)
                                                  }
                                                }}
                                                className="px-3 py-1 rounded-full whitespace-nowrap text-xs font-semibold inline-block bg-blue-100 text-blue-600 cursor-pointer"
                                              >
                                                {order.status ===
                                                "rto in transit"
                                                  ? `RTO In Transit`
                                                  : toCapitalizeEachWord(
                                                      order.status,
                                                    )}
                                              </span>
                                            </>
                                          )}
                                        </>
                                      )}
                                    </TableCell>
                                  </>
                                )}
                                {/* eligible_vendors */}
                                {/* {selectedStatus === "booked" && (
                                  <TableCell className="px-6 py-1 whitespace-pre-line">
                                    
                                    {order?.tpc_awb_number !== null ? (
                                      <>
                                        <p className="font-medium   text-center px-3 whitespace-nowrap py-1 rounded-full ">
                                          -
                                        </p>
                                      </>
                                    ) : (
                                      <>
                                        <p className="font-medium bg-orange-100 text-orange-700 text-center px-3 whitespace-nowrap py-1 rounded-full dark:bg-orange-900 dark:text-orange-200">
                                          {order?.tpc_awb_number !== null
                                            ? "-"
                                            : order?.eligible_vendors
                                                ?.split(",")
                                                .join(" | ")}
                                        </p>
                                      </>
                                    )}
                                  </TableCell>
                                )} */}

                                {selectedStatus === "booked" && (
                                  <TableCell className="max-w-[220px] py-2">
                                    {order?.tpc_awb_number != null ? (
                                      <span className="block text-left text-gray-400">-</span>
                                    ) : (() => {
                                      const vendors = String(order?.eligible_vendors || "")
                                        .split(",")
                                        .map((v) => v.trim())
                                        .filter(Boolean);

                                      if (!vendors.length) {
                                        return (
                                          <span className="block text-center text-gray-400">-</span>
                                        );
                                      }

                                      return (
                                        <HoverCard openDelay={150} closeDelay={150}>
                                          <HoverCardTrigger asChild>
                                            <div className="max-w-[200px] cursor-pointer">
                                              <div className="flex items-center gap-2 rounded-md border border-orange-200 bg-orange-50 px-3 py-2 text-orange-700 transition-all duration-200 hover:border-orange-400 hover:bg-orange-100 hover:shadow-sm dark:border-orange-900 dark:bg-orange-950/40 dark:text-orange-300">
                                                <Building2 className="h-4 w-4 shrink-0" />

                                                <span className="min-w-0 flex-1 truncate text-xs font-medium">
                                                  {vendors.join(" | ")}
                                                </span>

                                                <span className="shrink-0 rounded-full bg-orange-200 px-1.5 py-0.5 text-[10px] font-semibold dark:bg-orange-900">
                                                  {vendors.length}
                                                </span>
                                              </div>
                                            </div>
                                          </HoverCardTrigger>

                                          <HoverCardContent
                                            side="top"
                                            align="start"
                                            sideOffset={8}
                                            className="z-50 w-[320px] rounded-xl border border-gray-200 bg-white p-0 shadow-xl dark:border-gray-700 dark:bg-gray-900"
                                          >
                                            {/* Header */}
                                            <div className="border-b border-gray-100 px-4 py-3 dark:border-gray-800">
                                              <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-50 text-orange-600 dark:bg-orange-950">
                                                    <Users className="h-4 w-4" />
                                                  </div>

                                                  <div>
                                                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                                                      Eligible Vendors
                                                    </h4>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                      Available vendor list
                                                    </p>
                                                  </div>
                                                </div>

                                                <span className="rounded-full bg-orange-100 px-2.5 py-1 text-xs font-semibold text-orange-700 dark:bg-orange-950 dark:text-orange-300">
                                                  {vendors.length} Total
                                                </span>
                                              </div>
                                            </div>

                                            {/* Vendor List */}
                                            <div className="max-h-[250px] space-y-1 overflow-y-auto p-2">
                                              {vendors.map((vendor, index) => (
                                                <div
                                                  key={`${vendor}-${index}`}
                                                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
                                                >
                                                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gray-100 text-xs font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                                                    {index + 1}
                                                  </span>

                                                  <span className="min-w-0 flex-1 break-words text-sm font-medium text-gray-700 dark:text-gray-200">
                                                    {vendor}
                                                  </span>

                                                  <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" />
                                                </div>
                                              ))}
                                            </div>

                                            {/* Footer */}
                                            <div className="border-t border-gray-100 px-4 py-2.5 dark:border-gray-800">
                                              <p className="text-center text-xs text-gray-400">
                                                {vendors.length} eligible vendor
                                                {vendors.length !== 1 ? "s" : ""} found
                                              </p>
                                            </div>
                                          </HoverCardContent>
                                        </HoverCard>
                                      );
                                    })()}
                                  </TableCell>
                                )}
                              </TableRow>
                            );
                          })
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>

              {totalPages > 1 && (
                <div className="z-10  flex  justify-between shrink-0 border-t border-gray-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900">
                  <div className="text-sm text-gray-600">
                    Page {page} of {totalPages}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={page === totalPages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Label>Rows per page:</Label>
                    <select
                      className="border rounded-md px-2 py-1"
                      value={limit}
                      onChange={(e) => {
                        setLimit(Number(e.target.value));
                        setPage(1);
                      }}
                    >
                      <option value={10}>10</option>
                      <option value={20}>20</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                      <option value={200}>200</option>
                    </select>
                  </div>
                </div>
              )}
            </div>









                                     ) : order.status === "undelivered" ? (
                                        <>
                                          {checkVendorMapping !== null &&
                                          !checkVendorMapping?.canChangeMapping &&
                                          isOpenIndividualVendorMap ===
                                            order.id ? (
                                            <>
                                              <form
                                                onSubmit={(e) => {
                                                  e.preventDefault();
                                                  revokeVendorMapping(order.id);
                                                }}
                                                className="flex items-center gap-2"
                                              >
                                                <button
                                                  type="submit"
                                                  className="bg-[#0446DB] whitespace-nowrap text-white text-xs px-2 py-1 rounded hover:bg-indigo-800"
                                                >
                                                  Revoke Vendor Mapping
                                                </button>
                                                <button
                                                  type="button"
                                                  className="text-xs bg-red-500/20 px-2 py-1 rounded text-red-500 text-gray-500 hover:underline"
                                                  onClick={() => {
                                                    setCheckVendorMapping({
                                                      canChangeMapping: true,
                                                      currentAction: "grant",
                                                    });
                                                    setIsOpenIndividualVendorMap(
                                                      "",
                                                    );
                                                  }}
                                                >
                                                  Close
                                                </button>
                                              </form>
                                            </>
                                          ) : isOpenIndividualVendorMap ===
                                            order.id ? (
                                            <>
                                              <form
                                                onSubmit={(e) => {
                                                  e.preventDefault();
                                                  const selectedVendor =
                                                    assignmentState;
                                                  if (!selectedVendor) {
                                                    toast.warn(
                                                      "Please select a vendor",
                                                    );
                                                    return;
                                                  }
                                                  changeVendorMapping(
                                                    order.id,
                                                    selectedVendor,
                                                  );
                                                  setIsOpenIndividualVendorMap(
                                                    "",
                                                  );
                                                }}
                                                className="flex items-center gap-2"
                                              >
                                                <select
                                                  value={assignmentState}
                                                  onChange={(e) =>
                                                    setAssignmentState(
                                                      e.target.value,
                                                    )
                                                  }
                                                  className="border px-2 py-1 rounded-md"
                                                  required
                                                >
                                                  <option value="" disabled>
                                                    Select Vendor
                                                  </option>
                                                  {vendor.map((vendor) => (
                                                    <option
                                                      key={vendor.vendor_id}
                                                      value={vendor.vendor_id}
                                                    >
                                                      {vendor.vendor_id} :{" "}
                                                      {vendor.vendor_name}
                                                    </option>
                                                  ))}
                                                </select>
                                                <button
                                                  type="submit"
                                                  className="bg-[#0446DB] whitespace-nowrap text-white text-xs px-2 py-1 rounded hover:bg-indigo-800"
                                                >
                                                  Change Mapping
                                                </button>
                                                <button
                                                  type="button"
                                                  className="text-xs text-gray-500 hover:underline"
                                                  onClick={() =>
                                                    setIsOpenIndividualVendorMap(
                                                      "",
                                                    )
                                                  }
                                                >
                                                  Close
                                                </button>
                                              </form>
                                            </>
                                          ) : (
                                            <span
                                              onClick={() => {
                                                if (
                                                  order.status === "undelivered"
                                                ) {
                                                  checkVendorMappingStatus(
                                                    order.id,
                                                  );
                                                  fetchVendor(order.id);
                                                 
                                                  setIsOpenIndividualVendorMap(
                                                    order.id,
                                                  );
                                                
                                                }
                                              }}
                                              className="px-3 py-1 cursor-pointer rounded-full text-xs font-medium bg-green-100 text-green-600"
                                            >
                                              Mapped
                                            </span>
                                          )}
                                        </>
                                      ) : order.status === "delivered" ||
                                        order.status === "undelivered" ||
                                        order.status === "rto in transit" ? (
                                        <>
                                          {order.mapped_with === null ? (
                                            <span className="px-3 whitespace-nowrap py-1 rounded-full text-xs font-medium bg-red-100 text-red-600">
                                              Not Mapped
                                            </span>
                                          ) : isOpenIndividualVendorMap ===
                                            order.id ? (
                                            <>
                                              <form
                                                onSubmit={(e) => {
                                                  e.preventDefault();
                                                  const selectedVendor =
                                                    assignmentState;
                                                  if (!selectedVendor) {
                                                    toast.warn(
                                                      "Please select a vendor",
                                                    );
                                                    return;
                                                  }
                                                  changeVendorMapping(
                                                    order.id,
                                                    selectedVendor,
                                                  );
                                                  setIsOpenIndividualVendorMap(
                                                    "",
                                                  );
                                                }}
                                                className="flex items-center gap-2"
                                              >
                                                <select
                                                  value={assignmentState}
                                                  onChange={(e) =>
                                                    setAssignmentState(
                                                      e.target.value,
                                                    )
                                                  }
                                                  className="border px-2 py-1 rounded-md"
                                                  required
                                                >
                                                  <option value="" disabled>
                                                    Select Vendor
                                                  </option>
                                                  {vendor.map((vendor) => (
                                                    <option
                                                      key={vendor.vendor_id}
                                                      value={vendor.vendor_id}
                                                    >
                                                      {vendor.vendor_id} :{" "}
                                                      {vendor.vendor_name}
                                                    </option>
                                                  ))}
                                                </select>
                                                <button
                                                  type="submit"
                                                  className="bg-[#0446DB] text-white text-xs px-2 py-1 rounded hover:bg-indigo-800"
                                                >
                                                  Assign
                                                </button>
                                                <button
                                                  type="button"
                                                  className="text-xs text-gray-500 hover:underline"
                                                  onClick={() =>
                                                    setIsOpenIndividualVendorMap(
                                                      "",
                                                    )
                                                  }
                                                >
                                                  Close
                                                </button>
                                              </form>
                                            </>
                                          ) : (
                                            <span
                                              onClick={() => {
                                                if (
                                                  order.status === "undelivered"
                                                ) {
                                                  fetchVendor(order.id);
                                                  setIsOpenIndividualVendorMap(
                                                    order.id,
                                                  );
                                                  setIsOpenIndividualAssignmnetMap(
                                                    "",
                                                  );
                                                }
                                              }}
                                              className="px-3 py-1 cursor-pointer rounded-full text-xs font-medium bg-green-100 text-green-600"
                                            >
                                              Mapped
                                            </span>
                                          )}
                                        </>
                                      ) : order.status === "rto delivered" ? (
                                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-600">
                                          Return To Origin
                                        </span>
                                      )