
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import GoogleMap from '../googlemap';
import getLatLngFromAddress from '../FetchLocation';

const baseURL = import.meta.env.VITE_BASE_URL;

const CreateOrderTurant = () => {
    const [activeSection, setActiveSection] = useState('pickup');
    const [rider_prefrence, setRiderPrefrence] = useState('');
    const [ShippingInformation, setShippingInformation] = useState([]);
    const [showReturnAddress, setShowReturnAddress] = useState(false);
    const [isLoadingPricing, setIsLoadingPricing] = useState(false);
    const [MatchPrice, setMatchPrice] = useState(null);
    const [items, setItems] = useState([{
        product_name: '',
        quantity: '',
        unit_price: '',
        weight: '',
        dimensions: '',
        sku: "SKU001",
    }]);
    const decode = jwtDecode(localStorage.getItem("token"));
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
        setValue,
        trigger,
        getValues,
        reset
    } = useForm({
        defaultValues: {
            pickup_address: {
                country: 'India',
                longitude: "",
                latitude: ""
            },
            delivery_address: {
                country: 'India',

            },
            return_address: {
                country: 'India',
                longitude: "",
                latitude: ""
            },
            order_details: {
                order_type: 'prepaid',
                number_of_boxes: '',
                total_weight: '',
                items: [],
                longitude: "",
                latitude: "",
                order_specific:"Turant"
            }
        }
    });

    const orderType = watch('order_details.order_type');
    const orderSpecific = watch('order_details.order_specific');


    const copyDeliveryToReturn = () => {
        const deliveryData = getValues('pickup_address');
        setValue('return_address', deliveryData);
        setShowReturnAddress(true);
    };

    const addItem = () => {
        setItems([...items, {
            product_name: '',
            quantity: 1,
            unit_price: 0,
            weight: '',
            dimensions: '',
            sku: "SKU001",

        }]);
    };

    const removeItem = (index) => {
        if (items.length > 1) {
            const newItems = items.filter((_, i) => i !== index);
            setItems(newItems);
        }
    };

    // const updateItem = (index, field, value) => {
    //     const newItems = items.map((item, i) =>
    //         i === index ? { ...item, [field]: value } : item
    //     );
    //     setItems(newItems);
    // };

    const updateItem = (index, field, value) => {
        const newItems = items.map((item, i) => {
            if (i === index) {
                const updatedItem = { ...item, [field]: value };

                // Auto update dimensions
                const h = updatedItem.height || "";
                const w = updatedItem.width || "";
                const l = updatedItem.length || "";

                // If any field filled, create dimension string
                updatedItem.dimensions = [h, w, l].filter(Boolean).join(" x ");

                return updatedItem;
            }
            return item;
        });

        setItems(newItems);
    };

    const calculateTotal = () => {
        return items.reduce((total, item) => total + (item.quantity * item.unit_price), 0);
    };

    useEffect(() => {
        const total = calculateTotal();
        setValue('order_details.total_amount', String(total));
        let it = []

        items.map((i) => {

            it.push({
                dimensions: i.dimensions,
                product_name: i.product_name,
                quantity: i.quantity,
                sku: i.sku,
                unit_price: i.unit_price,
                weight: i.weight
            })
        })
        setValue('order_details.items', it);
    }, [items, setValue]);

   

    const getTurantPricings = async () => {
        try {
             let pickupAddress;
                        let ShipingAddress;
                        setIsLoadingPricing(true);
                        const formData = getValues();
                        if (!formData?.pickup_address?.latitude || !formData?.pickup_address?.longitude) {
                            const address = formData?.pickup_address?.address_line;
                            const data = await getLatLngFromAddress(address)
                            pickupAddress = data
                            
                        }
                        if (!formData?.order_details?.latitude || !formData?.order_details?.longitude) {
                            const address = formData?.delivery_address?.address_line;
                            const data = await getLatLngFromAddress(address)
                            ShipingAddress = data
                           
                        }
            
                        const breadth = Number(formData?.order_details?.breadth) || 0;
                        const height = Number(formData?.order_details?.height) || 0;
                        const length = Number(formData?.order_details?.package_length) || 0;
                        const boxes = Number(formData?.order_details?.number_of_boxes) || 1;
                        const totalWeight = Number(formData?.order_details?.total_weight) || 0;
            
                        const volumetric = (breadth * height * length) / 5000;
                        const volumetric_weight = volumetric * boxes * 1000; // grams
            
                        const data = {
                            pickup: {
                                coordinates: {
                                    latitude: formData?.pickup_address?.latitude || pickupAddress?.lat || "",
                                    longitude: formData?.pickup_address?.longitude || pickupAddress?.lng || ""
                                },
                                pincode: formData?.pickup_address?.pincode || ""
                            },
                            drop: [
                                {
                                    ref: formData?.order_details?.orderno || "",
                                    location: {
                                        coordinates: {
                                            latitude: formData?.order_details?.latitude || ShipingAddress?.lat || "",
                                            longitude: formData?.order_details?.longitude || ShipingAddress?.lng || ""
                                        },
                                        pincode: formData?.delivery_address?.pincode || ""
                                    },
                                    attributes: {
                                        cod_amount: "0",
                                        weight: totalWeight,
                                        volumetric_weight: volumetric_weight
                                    }
                                }
                            ]
                        };
            if (!data.pickup.pincode || !data.drop[0]?.location?.pincode) {

                toast.error('Please fill all required address details to calculate pricing.');
                setIsLoadingPricing(false);
                return;
            }
            if (!data.pickup.coordinates.latitude || !data.pickup.coordinates.longitude || !data.drop[0].location.coordinates.latitude || !data.drop[0].location.coordinates.longitude) {

                toast.error('Please fill all required address details to calculate pricing.');
                setIsLoadingPricing(false);
                return;
            }
            if (!data.drop[0].attributes.weight) {
                toast.error('Please fill all required order details to calculate pricing.');
                setIsLoadingPricing(false);
                return;
            }
            if (!data.drop[0].attributes.volumetric_weight) {
                toast.error('Please fill all required order details to calculate pricing.');
                setIsLoadingPricing(false);
                return;
            }
            const res = await axios.post(
                `${baseURL}/api/pricing/getTurantPricings`,
                data,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );
            if(res.data.success===false){
                toast.error(res.data.message || 'Failed to fetch pricing details');
                setIsLoadingPricing(false);
                return
            }
            if(res.data.success){
                console.log("Pricing Response:", res.data);
                setShippingInformation(res.data);
            }
        } catch (error) {
            toast.error(error.response.data.message || 'Failed to fetch pricing details');
            return
        } finally {
            setIsLoadingPricing(false);
        }
    };

    const createOrder = async () => {
        try {
            const formData = getValues();

            const orderData = {
                ...formData,
                max_price:String(ShippingInformation?.max_price) || "0",
            };

            console.log("Submitting Order Data:", orderData);

             
            const res = await axios.post(
                `${baseURL}/api/merchant/createMerchantTurantOrder`,
                orderData,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                }
            );

            toast.success(res.data.message);
            setTimeout(() => {
                reset();
                window.location.reload()
                setActiveSection('pickup')
            }, 3000)


        } catch (error) {
           
            if (error.response.status === 403) {
                toast.error(error.response?.data?.message || 'Failed to create order');
                return
            }
            if (error.response.status === 400) {
                 console.log("Create Order Error:", error.response.data.message);
                if (Array.isArray(error.response?.data?.error)) {
                    toast.error(error.response?.data?.error[0] || 'Failed to create order');
                    return
                }
                toast.error(error.response?.data?.error || error.response.data.message ||'Failed to create order');
                return
            }
            if (error.response.status === 500) {
                toast.error( 'Something went wrong. Please try again later.');
                return
            }
        }
    };

    const fetchCurrentLocatipon = async ({ selectedLocation, prefix }) => {

        const { lat, lng } = selectedLocation;
        try {
            if (prefix === 'pickup_address') {
                setValue('pickup_address.latitude', String(lat));
                setValue('pickup_address.longitude', String(lng));

            } else if (prefix === 'return_address') {
                setValue('return_address.latitude', String(lat));
                setValue('return_address.longitude', String(lng));
            } else if (prefix === 'order_details') {
                setValue('order_details.latitude', String(lat));
                setValue('order_details.longitude', String(lng));
            }


        } catch (error) {
            console.log("Location fetch on load failed:", error);
        }

    }

    const sections = [
        { id: 'pickup', label: 'Pickup Address', icon: '📦' },
        { id: 'delivery', label: 'Delivery Address', icon: '🚚' },
        { id: 'order', label: 'Order Details', icon: '📋' },
        { id: 'items', label: 'Items', icon: '🛍️' },
        { id: 'summary', label: 'Summary & Pricing', icon: '💰' }
    ];

    const validateAndProceed = async (nextSectionId) => {
        const fieldsToValidate = {
            pickup: ['pickup_address.contact_name', 'pickup_address.phone', 'pickup_address.pincode', 'pickup_address.address_line', 'pickup_address.city', 'pickup_address.state'],
            delivery: ['delivery_address.contact_name', 'delivery_address.phone', 'delivery_address.pincode', 'delivery_address.address_line', 'delivery_address.city', 'delivery_address.state'],
            order: ['order_details.order_type', 'order_details.orderno', 'order_details.total_amount'],
            items: [],
            summary: []
        };

        const fields = fieldsToValidate[activeSection] || [];

        if (fields.length > 0) {
            const isValid = await trigger(fields);
            if (!isValid) {
                toast.error('Please fix the validation errors before proceeding.');
                return;
            }
        }

        setActiveSection(nextSectionId);
    };

    const AddressSection = ({ prefix, title, icon, isRequired = true }) => (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-lg">{icon}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Name {isRequired && '*'}
                    </label>
                    <input
                        {...register(`${prefix}.contact_name`, {
                            required: isRequired && 'Contact name is required'
                        })}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${errors[prefix]?.contact_name ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="Enter contact name"
                    />
                    {errors[prefix]?.contact_name && (
                        <p className="text-red-500 text-sm mt-1">{errors[prefix].contact_name.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number {isRequired && '*'}
                    </label>
                    <input
                        {...register(`${prefix}.phone`, {
                            required: isRequired && 'Phone number is required',
                            pattern: {
                                value: /^\d{10}$/,
                                message: 'Please enter a valid 10-digit phone number'
                            }
                        })}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${errors[prefix]?.phone ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="10-digit mobile number"
                    />
                    {errors[prefix]?.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors[prefix].phone.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pincode {isRequired && '*'}
                    </label>
                    <input
                        {...register(`${prefix}.pincode`, {
                            required: isRequired && 'Pincode is required'
                        })}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${errors[prefix]?.pincode ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="Enter pincode"
                    />
                    {errors[prefix]?.pincode && (
                        <p className="text-red-500 text-sm mt-1">{errors[prefix].pincode.message}</p>
                    )}
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address Line {isRequired && '*'}
                    </label>
                    <textarea
                        {...register(`${prefix}.address_line`, {
                            required: isRequired && 'Address line is required'
                        })}
                        rows="3"
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${errors[prefix]?.address_line ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="Enter complete address"
                    />
                    {errors[prefix]?.address_line && (
                        <p className="text-red-500 text-sm mt-1">{errors[prefix].address_line.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        City {isRequired && '*'}
                    </label>
                    <input
                        {...register(`${prefix}.city`, {
                            required: isRequired && 'City is required'
                        })}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${errors[prefix]?.city ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="Enter city"
                    />
                    {errors[prefix]?.city && (
                        <p className="text-red-500 text-sm mt-1">{errors[prefix].city.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        State {isRequired && '*'}
                    </label>
                    <input
                        {...register(`${prefix}.state`, {
                            required: isRequired && 'State is required'
                        })}
                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors ${errors[prefix]?.state ? 'border-red-500' : 'border-gray-300'
                            }`}
                        placeholder="Enter state"
                    />
                    {errors[prefix]?.state && (
                        <p className="text-red-500 text-sm mt-1">{errors[prefix].state.message}</p>
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Country
                    </label>
                    <input
                        {...register(`${prefix}.country`)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                        placeholder="Enter country"
                        defaultValue="India"
                    />
                </div>
                <div>

                </div>
                {
                    (prefix === 'pickup_address' || prefix === 'return_address') && (
                        <>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    longitude
                                </label>
                                <input
                                    {...register(`${prefix}.longitude`)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                    placeholder="Enter longitude"

                                />
                            </div>
                            <div >
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    latitude
                                </label>
                                <input
                                    {...register(`${prefix}.latitude`)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                    placeholder="Enter latitude"

                                />

                            </div>
                            <div className=' flex mt-2'>
                                {/* <label onClick={() => fetchCurrentLocatipon(prefix)} className=" text-sm font-medium mb-2 py-3 bg-[rgb(86,78,193)] text-white rounded  px-3 cursor-pointer">
                                    Fetch Current Location
                                </label> */}
                                <GoogleMap
                                    fetchCurrentLocatipon={fetchCurrentLocatipon}
                                    prefix={prefix}
                                />

                            </div>
                        </>
                    )
                }


            </div>
        </div>
    );

    useEffect(() => {
        console.log("Active Section Changed:", activeSection);
        if (activeSection === 'summary') {
            console.log("Fetching Turant Pricings...");
            getTurantPricings();
        }
    }, [activeSection]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-4 px-3 sm:py-6 sm:px-4 lg:py-8 lg:px-6 xl:px-8">
            <div className="mx-auto ">
                <div className="text-center mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
                        Create New Order
                    </h1>
                    <p className="text-base sm:text-lg text-gray-600">
                        Fill in the order details for shipment
                    </p>
                    <div className="flex items-center justify-center mt-3 sm:mt-4 gap-2">

                        {/* Turant */}
                        <label className="flex items-center gap-2 cursor-pointer px-3 py-2 sm:px-4 sm:py-2 font-semibold rounded-lg hover:bg-gray-100 transition  xs:w-auto justify-center">
                            <Link to={`/merchant/create_order/turant`} className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="turant"
                                    defaultChecked
                                    className="h-4 w-4 text-[rgb(86,78,193)] focus:ring-[rgb(86,78,193)]"
                                />
                                <span className="text-sm sm:text-base text-gray-700 font-medium">Turant</span>
                            </Link>
                        </label>

                        {/* SDD / NDD */}
                        <label className="flex items-center gap-2 cursor-pointer px-3 py-2 sm:px-4 sm:py-2 rounded-lg hover:bg-gray-100 transition  xs:w-auto justify-center">
                            <Link to={`/merchant/create_order`} className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="turant"

                                    className="h-4 w-4 text-[rgb(86,78,193)] focus:ring-[rgb(86,78,193)]"
                                />
                                <span className="text-sm sm:text-base text-gray-700 font-semibold">SDD / NDD</span>
                            </Link>
                        </label>

                    </div>

                </div>

                <div className="space-y-4 sm:space-y-6">
                    {/* Progress Steps */}
                    <div className="bg-white hidden sm:block rounded-lg sm:rounded-xl lg:rounded-2xl shadow-md sm:shadow-lg p-3 sm:p-4 lg:p-6 mb-4 sm:mb-5 lg:mb-6">
                        <div className="">
                            <div className="flex items-center justify-center">
                                <div className="flex items-center space-x-1 sm:space-x-2 lg:space-x-2">
                                    {sections.map((section, index) => (
                                        <div key={section.id} className="flex items-center">
                                            <button
                                                type="button"
                                                onClick={() => setActiveSection(section.id)}
                                                className={`flex items-center gap-1 sm:gap-3 px-4 py-2 rounded-lg sm:rounded-xl lg:rounded-2xl transition-all duration-200 ${activeSection === section.id
                                                    ? 'bg-blue-50 border border-blue-200 text-[rgb(86,78,193)] font-semibold shadow-sm'
                                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                                    }`}
                                            >
                                                <span className="text-base sm:text-lg lg:text-xl flex-shrink-0">
                                                    {section.icon}
                                                </span>
                                                <span className="whitespace-nowrap text-sm sm:text-base lg:text-lg font-medium">
                                                    {section.label}
                                                </span>
                                            </button>
                                            {index < sections.length - 1 && (
                                                <div className="w-4 sm:w-4 lg:w-2 h-0.5 bg-gray-200 mx-2 sm:mx-3 lg:mx-3"></div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile View - Compact */}
                    {/* <div className="block sm:hidden">
                        <div className="flex justify-between items-center pb-2">
                           
                            <div className="flex items-center justify-evenly w-full">
                                <div className="flex items-center space-x-1 w-full justify-evenly">
                                    {sections.map((section, index) => (
                                        <div key={section.id} className="flex items-center">
                                            <button
                                                type="button"
                                                onClick={() => setActiveSection(section.id)}
                                                className={`flex flex-col items-center p-2 rounded-lg transition-all duration-200 min-w-[70px] ${activeSection === section.id
                                                    ? 'bg-blue-50 text-[rgb(86,78,193)] font-semibold border border-blue-200'
                                                    : 'text-gray-600 hover:text-gray-900'
                                                    }`}
                                            >
                                                <span className="text-sm mb-1">{section.icon}</span>
                                                <span className="text-xs text-center leading-tight font-medium whitespace-nowrap">
                                                    {section.label.split(' ')[0]}
                                                </span>
                                            </button>

                                            {index < sections.length - 1 && (
                                                <div className="w-3 h-0.5 bg-gray-200 mx-1"></div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div> */}
                    <div className="block sm:hidden px-0 pb-1">
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                            Select Section
                        </label>

                        <select
                            value={activeSection}
                            onChange={(e) => setActiveSection(e.target.value)}
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm
               focus:outline-none focus:ring-2 focus:ring-[rgb(86,78,193)]
               focus:border-[rgb(86,78,193)]"
                        >
                            {sections.map((section) => (
                                <option key={section.id} value={section.id}>
                                    {section.label}
                                </option>
                            ))}
                        </select>
                    </div>


                    {/* Pickup Address Section */}
                    {activeSection === 'pickup' && (
                        <AddressSection prefix="pickup_address" title="Pickup Address" icon="📦" />
                    )}

                    {/* Delivery Address Section */}
                    {activeSection === 'delivery' && (
                        <>
                            <AddressSection prefix="delivery_address" title="Delivery Address" icon="🚚" />

                            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                            <span className="text-sm sm:text-lg">↩️</span>
                                        </div>
                                        <div>
                                            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Return Address</h3>
                                            <p className="text-xs sm:text-sm text-gray-500">Optional - Add if different from pickup</p>
                                        </div>
                                    </div>
                                    <div className=" flex flex-col md:flex-row gap-1 ">
                                        <button
                                            type="button"
                                            onClick={copyDeliveryToReturn}
                                            className="px-3 py-2 sm:px-4 sm:py-3 bg-green-500 text-white rounded-lg sm:rounded-xl font-medium hover:bg-green-600 transition-colors text-sm sm:text-base"
                                        >
                                            Copy from Pickup
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setShowReturnAddress(!showReturnAddress)}
                                            className={`px-4 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-colors text-sm sm:text-base ${showReturnAddress
                                                ? 'bg-gray-600 text-white hover:bg-gray-700'
                                                : 'bg-orange-500 text-white hover:bg-orange-600'
                                                }`}
                                        >
                                            {showReturnAddress ? 'Remove' : 'Add Return Address'}
                                        </button>
                                    </div>
                                </div>

                                {showReturnAddress && (
                                    <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                                        <AddressSection prefix="return_address" title="Return Address" icon="↩️" isRequired={false} />
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* Order Details Section */}
                    {activeSection === 'order' && (
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-200">
                            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <span className="text-sm sm:text-lg">📋</span>
                                </div>
                                <h3 className="text-lg sm:text-xl font-bold text-gray-900">Order Details</h3>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-3 sm:mb-4">
                                        Order Type *
                                    </label>
                                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
                                        {['prepaid'].map((type) => (
                                            <label
                                                key={type}
                                                className={`relative flex cursor-pointer rounded-lg sm:rounded-xl border p-3 sm:p-4 focus:outline-none ${orderType === type
                                                    ? 'border-[rgb(86,78,193)] bg-blue-50'
                                                    : 'border-gray-300'
                                                    }`}
                                            >
                                                <input
                                                    type="radio"
                                                    {...register('order_details.order_type')}
                                                    value={type}
                                                    className="sr-only"
                                                />
                                                <div className="flex w-full items-center justify-between">
                                                    <div className="text-xs sm:text-sm">
                                                        <p className="font-medium text-gray-900">
                                                            {type === 'prepaid' ? 'Prepaid' : 'COD'}
                                                        </p>
                                                        <p className="text-gray-500">
                                                            {type === 'prepaid' ? '' : 'Collect payment on delivery'}
                                                        </p>
                                                    </div>
                                                    <div className={`shrink-0 text-white ${orderType === type ? 'bg-[rgb(86,78,193)] rounded-full' : 'bg-gray-400'
                                                        } rounded-full p-1`}>
                                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Order Number *
                                    </label>
                                    <input
                                        {...register('order_details.orderno', {
                                            required: 'Order number is required'
                                        })}
                                        className={`w-full px-3 py-2 sm:px-4 sm:py-3 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm sm:text-base ${errors.order_details?.orderno ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="Enter order number"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Total Amount *
                                    </label>
                                    <input
                                        {...register('order_details.total_amount', {
                                            required: 'Total amount is required'
                                        })}
                                        type="number"
                                        step="0.01"
                                        className={`w-full px-3 py-2 sm:px-4 sm:py-3 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm sm:text-base ${errors.order_details?.total_amount ? 'border-red-500' : 'border-gray-300'
                                            }`}
                                        placeholder="0.00"
                                    />
                                </div>

                                {orderType === 'cod' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Collectable Amount *
                                        </label>
                                        <input
                                            {...register('order_details.collectable_amount', {
                                                required: 'Collectable amount is required for COD orders'
                                            })}
                                            type="number"
                                            step="0.01"
                                            className={`w-full px-3 py-2 sm:px-4 sm:py-3 border rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm sm:text-base ${errors.order_details?.collectable_amount ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                            placeholder="Amount to collect"
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Total Weight (gm)
                                    </label>
                                    <input
                                        {...register('order_details.total_weight')}
                                        type="number"
                                        step="0.01"
                                        className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm sm:text-base"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        package_length (cm)
                                    </label>
                                    <input
                                        {...register('order_details.package_length')}
                                        type="number"
                                        step="0.01"
                                        className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm sm:text-base"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        breadth (cm)
                                    </label>
                                    <input
                                        {...register('order_details.breadth')}
                                        type="number"
                                        step="0.01"
                                        className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm sm:text-base"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        height (cm)
                                    </label>
                                    <input
                                        {...register('order_details.height')}
                                        type="number"
                                        step="0.01"
                                        className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm sm:text-base"
                                        placeholder="0.00"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Number of Boxes
                                    </label>
                                    <input
                                        {...register('order_details.number_of_boxes')}
                                        type="number"
                                        min="1"
                                        className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm sm:text-base"
                                    />
                                </div>

                                {/* <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Order Specific
                                    </label>
                                    <select
                                        {...register('order_details.order_specific')}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                    >
                                        <option value="">Select Service Type</option>
                                        <option value="Turant-500gm">Turant-500gm</option>
                                        <option value="Turant-2kg">Turant-2kg</option>
                                        <option value="Turant-5kg">Turant-5kg</option>
                                    </select>
                                </div> */}

                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Longitude
                                        </label>
                                        <input
                                            {...register(`order_details.longitude`)}
                                            className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm sm:text-base"
                                            placeholder="Enter longitude"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Latitude
                                        </label>
                                        <input
                                            {...register(`order_details.latitude`)}
                                            className="w-full px-3 py-2 sm:px-4 sm:py-3 border border-gray-300 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm sm:text-base"
                                            placeholder="Enter latitude"
                                        />

                                    </div> <br />
                                    <div className=''>

                                        <GoogleMap
                                            fetchCurrentLocatipon={fetchCurrentLocatipon}
                                            prefix={'order_details'}
                                        />
                                    </div>
                                </>
                            </div>
                        </div>
                    )}

                    {/* Items Section */}
                    {activeSection === 'items' && (
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-200">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                        <span className="text-sm sm:text-lg">🛍️</span>
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">Order Items</h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={addItem}
                                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl font-medium transition-colors text-sm sm:text-base w-full sm:w-auto"
                                >
                                    + Add Item
                                </button>
                            </div>

                            <div className="space-y-3 sm:space-y-4">
                                {items.map((item, index) => (
                                    <div key={index} className="border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 bg-gray-50">
                                        <div className="flex justify-between items-center mb-3 sm:mb-4">
                                            <h4 className="font-medium text-gray-900 text-sm sm:text-base">Item {index + 1}</h4>
                                            {items.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeItem(index)}
                                                    className="text-red-500 hover:text-red-700 p-1 rounded text-sm sm:text-base"
                                                >
                                                    ✕
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 gap-3 sm:gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Product Name *
                                                </label>
                                                <input
                                                    value={item.product_name}
                                                    onChange={(e) => updateItem(index, 'product_name', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                                                    placeholder="Product name"
                                                    required
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Quantity *
                                                    </label>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={item.quantity}
                                                        onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                                                        required
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Unit Price *
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={item.unit_price}
                                                        onChange={(e) => updateItem(index, 'unit_price', parseFloat(e.target.value))}
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        weight in (gm) *
                                                    </label>
                                                    <input
                                                        type="number"
                                                        value={item.weight}
                                                        onChange={(e) => updateItem(index, 'weight', String(e.target.value))}
                                                        placeholder='Gm'
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Dimensions (L x W x H) *
                                                    </label>

                                                    <input
                                                        type="text"

                                                        onChange={(e) => updateItem(index, 'height', e.target.value)}
                                                        placeholder="H"
                                                        className="w-14 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                                                        required
                                                    />
                                                    <input
                                                        type="text"
                                                        onChange={(e) => updateItem(index, 'width', e.target.value)}
                                                        placeholder="W"
                                                        className="w-14 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                                                        required
                                                    />
                                                    <input
                                                        type="text"

                                                        onChange={(e) => updateItem(index, 'length', e.target.value)}
                                                        placeholder="L"
                                                        className="w-14 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        SKU *
                                                    </label>

                                                    <input
                                                        type="text"
                                                        value={item.sku}
                                                        onChange={(e) => updateItem(index, 'sku', e.target.value)}
                                                        placeholder="sku"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-3 text-right">
                                            <span className="text-sm font-medium text-gray-700">
                                                Total: ₹{(item.quantity * item.unit_price).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                                <div className="flex justify-between items-center text-base sm:text-lg font-semibold">
                                    <span>Order Total:</span>
                                    <span>₹{calculateTotal().toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Summary Section */}
                    {activeSection === 'summary' && (
                        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 mb-4 sm:mb-6 border border-gray-200">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
                                <div className="flex items-center gap-2 sm:gap-3">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <span className="text-sm sm:text-lg">💰</span>
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">Summary & Pricing</h3>
                                </div>
                                {/* <select
                                    value={rider_prefrence}
                                    onChange={(e) => {
                                        setRiderPrefrence(e.target.value);
                                        if (e.target.value === 'self') {
                                            
                                            setShippingInformation(null);
                                        }
                                        if (e.target.value === 'daakit') {
                                            getTurantPricings();
                                        }
                                    }}
                                    className="border border-blue-500 py-2 px-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm sm:text-base w-full sm:w-auto"
                                >
                                    <option value="">Select Rider</option>
                                    <option value="self">Self</option>
                                    <option value="daakit">DAAkit</option>
                                </select> */}
                            </div>

                            {/* Self rider के लिए अलग display */}
                            {rider_prefrence === 'self' && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-3 sm:mb-4">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <span className="text-yellow-600 text-sm sm:text-base">ℹ️</span>
                                        <div>
                                            <h4 className="font-semibold text-yellow-800 text-sm sm:text-base">Self Delivery Selected</h4>
                                            <p className="text-yellow-700 text-xs sm:text-sm">You will handle the delivery yourself.</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            { isLoadingPricing ? (
                                <div className="text-center py-6 sm:py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto"></div>
                                    <p className="mt-3 sm:mt-4 text-gray-600 text-sm sm:text-base">Calculating shipping costs...</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                    <div className="bg-blue-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                                        <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Order Summary</h4>
                                        <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                                            <div className="flex justify-between">
                                                <span>Items Total:</span>
                                                <span>₹{calculateTotal().toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Number of Items:</span>
                                                <span>{items.length}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Order Type:</span>
                                                <span className="capitalize">{orderType}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Rider Preference:</span>
                                                <span className="capitalize">{ 'Daakit'}</span>
                                            </div>
                                        </div>
                                    </div>

                                   

                                        <div className="bg-blue-50 rounded-lg sm:rounded-xl p-3 sm:p-4">
                                            <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Shipping Information</h4>
                                            {ShippingInformation ? (
                                                <div className="space-y-2 sm:space-y-3">
                                                    <div className="p-2 sm:p-3 bg-[rgb(86,78,193)] border  rounded-lg transition-all duration-300 shadow-[0_0_20px_#4f46e5] border-[rgb(86,78,193)]">
                                                        <div className="space-y-1 text-xs sm:text-sm">
                                                            <div className="flex justify-between">
                                                                <span className="text-white font-medium">Service:</span>
                                                                <span className="font-medium text-white">{ShippingInformation?.service || 'N/A'}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="text-white font-medium ">Min Price:</span>
                                                                <span className="font-medium text-white">₹{ShippingInformation?.min_price || 0}</span>
                                                            </div>
                                                            <div className="flex justify-between">
                                                                <span className="font-medium text-white">Max Price:</span>
                                                                <span className="font-medium text-white ">₹{ShippingInformation?.max_price || 0}</span>
                                                            </div>
                                                            {/* <div className="border-t pt-1 sm:pt-2 mt-1 sm:mt-2">
                                                                <div className="flex justify-between font-semibold">
                                                                    <span>Total:</span>
                                                                    <span>₹{0}</span>
                                                                </div>
                                                            </div> */}
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-center py-3 sm:py-4 text-gray-500 text-sm sm:text-base">
                                                    No pricing information available
                                                </div>
                                            )}
                                        </div>
                                  
                                </div>
                            )}
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-200">
                        <div className="flex flex-col xs:flex-row justify-between gap-3 sm:gap-4">
                            <button
                                type="button"
                                onClick={() => {
                                    const currentIndex = sections.findIndex(s => s.id === activeSection);
                                    if (currentIndex > 0) {
                                        setActiveSection(sections[currentIndex - 1].id);
                                    }
                                }}
                                disabled={activeSection === sections[0].id}
                                className="px-4 py-2 sm:px-6 sm:py-3 border border-gray-300 text-gray-700 rounded-lg sm:rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 text-sm sm:text-base order-2 xs:order-1"
                            >
                                Previous
                            </button>

                            {activeSection === sections[sections.length - 1].id ? (
                              ( isLoadingPricing==false && ShippingInformation?.max_price) ?(
                                    <div
                                    onClick={() => createOrder()}
                                    className="px-6 py-2 cursor-pointer text-center sm:px-8 sm:py-3 bg-[rgb(86,78,193)] text-white rounded-lg sm:rounded-xl font-medium  transition-colors disabled:opacity-50 text-sm sm:text-base order-1 xs:order-2"
                                >
                                    Create Order
                                </div>
                                ):(
                                    <div
                                   
                                    className="px-6 py-2 cursor-pointer text-center sm:px-8 sm:py-3 bg-gray-400 text-white rounded-lg sm:rounded-xl font-medium  transition-colors disabled:opacity-50 text-sm sm:text-base order-1 xs:order-2"
                                >
                                    Create Order
                                </div>
                                )
                                
                            ) : (
                                <button
                                    type="button"
                                    onClick={async () => {
                                        const currentIndex = sections.findIndex(s => s.id === activeSection);
                                        if (currentIndex < sections.length - 1) {
                                            await validateAndProceed(sections[currentIndex + 1].id);
                                        }
                                    }}
                                    className="px-6 py-2 sm:px-8 sm:py-3 bg-[rgb(86,78,193)] text-white rounded-lg sm:rounded-xl font-medium  transition-colors text-sm sm:text-base order-1 xs:order-2"
                                >
                                    Next
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateOrderTurant;