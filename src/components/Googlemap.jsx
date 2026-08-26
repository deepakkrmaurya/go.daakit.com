import React, { useEffect, useRef, useState } from "react";
import GoogleMapReact from "google-map-react";
import { MdLocationOn } from "react-icons/md";
import { FiX } from "react-icons/fi";

const Marker = ({ text }) => (
    <div
        style={{
            color: "red",
            fontWeight: "bold",
            fontSize: "30px",
            transform: "translate(-50%, -100%)",
            display: "flex",
            alignItems: "center",
            gap: 6,
        }}
        title={text}
    >
        <span style={{ fontSize: 30, fontWeight: 600 }}>{<MdLocationOn />}</span>
    </div>
);

export default function GoogleMap({ onLocationSelect, initialLocation, fetchCurrentLocatipon, prefix }) {
    const defaultCenter = { lat: 28.3663389650907, lng: 77.31535609975124 };
    const [center, setCenter] = useState(defaultCenter);
    const [markerPosition, setMarkerPosition] = useState(defaultCenter);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [mapApiLoaded, setMapApiLoaded] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);

    const inputRef = useRef(null);
    const autocompleteRef = useRef(null);
    const mapRef = useRef(null);
    const mapsRef = useRef(null);

    useEffect(() => {
        if (initialLocation) {
            setCenter(initialLocation);
            setMarkerPosition(initialLocation);
            setLoading(false);
            return;
        }

        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser.");
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude: lat, longitude: lng } = position.coords;
                setCenter({ lat, lng });
                setMarkerPosition({ lat, lng });
                setLoading(false);
            },
            (err) => {
                setError(err.message || "Unable to retrieve your location.");
                setLoading(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            }
        );
    }, [initialLocation]);

    // Initialize Autocomplete once Maps API is loaded
    const initAutocomplete = (map, maps) => {
        mapRef.current = map;
        mapsRef.current = maps;
        setMapApiLoaded(true);

        if (!inputRef.current) return;

        try {

            autocompleteRef.current = new maps.places.Autocomplete(inputRef.current, {
                fields: ["geometry", "name", "formatted_address"],

            });

            autocompleteRef.current.addListener("place_changed", () => {
                const place = autocompleteRef.current.getPlace();
                if (!place || !place.geometry || !place.geometry.location) {
                    setError("No details available for input: '" + (place?.name || "") + "'");
                    return;
                }
                const lat = place.geometry.location.lat();
                const lng = place.geometry.location.lng();
                setCenter({ lat, lng });
                setMarkerPosition({ lat, lng });
                setSelectedLocation({ lat, lng, address: place.formatted_address || place.name });
                setError("");
                if (mapRef.current) {
                    mapRef.current.panTo({ lat, lng });
                    mapRef.current.setZoom(15);
                }
            });
        } catch (e) {
            console.error("Failed to initialize Autocomplete:", e);
            setError("Search unavailable (Places library not loaded).");
        }
    };

    const handleClick = ({ lat, lng }) => {
        setMarkerPosition({ lat, lng });
        setSelectedLocation({ lat, lng });
        setCenter({ lat, lng });

        // Reverse geocode to get address
        if (mapsRef.current) {
            const geocoder = new mapsRef.current.Geocoder();
            geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                if (status === "OK" && results && results[0]) {
                    setSelectedLocation(prev => ({
                        ...prev,
                        address: results[0].formatted_address
                    }));
                }
            });
        }
    };

    const recenterToCurrent = () => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser.");
            return;
        }
        setLoading(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude: lat, longitude: lng } = position.coords;
                setCenter({ lat, lng });
                setMarkerPosition({ lat, lng });
                setSelectedLocation({ lat, lng });
                setLoading(false);
                if (mapRef.current) {
                    mapRef.current.panTo({ lat, lng });
                    mapRef.current.setZoom(15);
                }
            },
            (err) => {
                setError(err.message || "Unable to retrieve your location.");
                setLoading(false);
            },
            { enableHighAccuracy: true }
        );
    };

    const clearSearch = () => {
        if (inputRef.current) inputRef.current.value = "";
        setError("");
    };

    const handleSearch = () => {
        const query = inputRef.current?.value?.trim();
        if (!query) {
            setError("Type a place to search.");
            return;
        }
        if (!mapsRef.current) {
            setError("Search unavailable (Maps API not ready).");
            return;
        }
        const geocoder = new mapsRef.current.Geocoder();
        geocoder.geocode({ address: query }, (results, status) => {
            if (status === "OK" && results && results[0]) {
                const loc = results[0].geometry.location;
                const lat = loc.lat();
                const lng = loc.lng();
                setCenter({ lat, lng });
                setMarkerPosition({ lat, lng });
                setSelectedLocation({ lat, lng, address: results[0].formatted_address });
                setError("");
                if (mapRef.current) {
                    mapRef.current.panTo({ lat, lng });
                    mapRef.current.setZoom(15);
                }
            } else {
                setError("Location not found.");
            }
        });
    };

    const handleSubmit = () => {
        if (selectedLocation && onLocationSelect) {
            onLocationSelect(selectedLocation);
            console.log("Submitted Location:", selectedLocation);
        }
        fetchCurrentLocatipon({ selectedLocation, prefix })
        setShowModal(false);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        if (onLocationSelect) {
            onLocationSelect(null);
        }
    };

    const openMapModal = () => {
        setShowModal(true);
    };

    return (
        <>
            {/* Button to open map modal */}
            <div
                onClick={openMapModal}
                style={{
                    // padding: "10px 20px",
                    // backgroundColor: "#0446DB",
                    // color: "white",
                    // border: "none",
                    // borderRadius: "6px",
                    // cursor: "pointer",
                    // fontSize: "16px",
                    // fontWeight: "600",
                    padding: "10px 20px",
                    backgroundColor: "#0446DB",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "16px",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"

                }}>
                Select Location on Map
            </div>

            {/* Map Modal */}
            {showModal && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1000,
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "white",
                            borderRadius: "12px",
                            width: "90%",
                            maxWidth: "1000px",
                            height: "80vh",
                            overflow: "hidden",
                            display: "flex",
                            flexDirection: "column",
                            boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
                        }}
                    >
                        {/* Modal Header */}
                        <div
                            style={{
                                padding: "16px 20px",
                                borderBottom: "1px solid #eee",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                backgroundColor: "#f8f9fa",
                            }}
                        >
                            <h3 style={{ margin: 0, color: "#333", fontSize: "18px" }}>
                                📍 Select Location
                            </h3>
                            <button
                                onClick={handleCloseModal}
                                style={{
                                    background: "none",
                                    border: "none",
                                    fontSize: "20px",
                                    cursor: "pointer",
                                    color: "#666",
                                    padding: "4px",
                                    borderRadius: "4px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <FiX size={24} />
                            </button>
                        </div>

                        {/* Map Container */}
                        <div style={{ height: "100%", width: "100%", position: "relative" }}>
                            {/* Top-left search box */}
                            <div
                                style={{
                                    position: "absolute",
                                    zIndex: 5,
                                    top: 10,
                                    left: 10,
                                    display: "flex",
                                    gap: 8,
                                    alignItems: "center",
                                    background: "rgba(255,255,255,0.95)",
                                    padding: 8,
                                    borderRadius: 8,
                                    boxShadow: "0 1px 6px rgba(0,0,0,0.2)",
                                }}
                            >
                                <input
                                    ref={inputRef}
                                    type="text"
                                    placeholder="Search places or addresses"
                                    style={{
                                        width: 280,
                                        padding: "8px 10px",
                                        borderRadius: 6,
                                        border: "1px solid #ddd",
                                        outline: "none",
                                        fontSize: 14,
                                    }}
                                    onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                                />
                                <button
                                    onClick={handleSearch}
                                    style={{
                                        padding: "8px 10px",
                                        borderRadius: 6,
                                        border: "none",
                                        background: "#0446DB",
                                        color: "white",
                                        cursor: "pointer",
                                        fontWeight: 600,
                                    }}
                                >
                                    Search
                                </button>

                                <button
                                    onClick={clearSearch}
                                    title="Clear"
                                    style={{
                                        padding: "8px",
                                        borderRadius: 6,
                                        border: "1px solid #eee",
                                        background: "white",
                                        cursor: "pointer",
                                    }}
                                >
                                    ✕
                                </button>
                            </div>

                            {loading && (
                                <div
                                    style={{
                                        position: "absolute",
                                        zIndex: 4,
                                        top: 10,
                                        right: 10,
                                        background: "rgba(255,255,255,0.9)",
                                        padding: "6px 10px",
                                        borderRadius: 6,
                                        boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                                    }}
                                >
                                    Detecting location...
                                </div>
                            )}

                            {error && (
                                <div
                                    style={{
                                        position: "absolute",
                                        zIndex: 4,
                                        top: 60,
                                        right: 10,
                                        background: "rgba(255,200,200,0.95)",
                                        color: "#600",
                                        padding: "6px 10px",
                                        borderRadius: 6,
                                        boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                                        maxWidth: 320,
                                    }}
                                >
                                    {error}
                                </div>
                            )}

                            <button
                                onClick={recenterToCurrent}
                                style={{
                                    position: "absolute",
                                    zIndex: 4,
                                    bottom: 20,
                                    left: 16,
                                    padding: "8px 22px",
                                    borderRadius: 6,
                                    border: "none",
                                    background: "#0446DB",
                                    color: "white",
                                    cursor: "pointer",
                                    fontSize: "14px",
                                    fontWeight: "600",
                                }}
                            >
                                📍 My Location
                            </button>

                            <GoogleMapReact
                                bootstrapURLKeys={{
                                    key: 'AIzaSyCavwYyxMy-eqPfjW1iUffUEP7SQ4evafM', // Add your Google Maps API key here
                                    libraries: ["places"],
                                }}
                                center={center}
                                defaultZoom={11}
                                onClick={handleClick}
                                yesIWantToUseGoogleMapApiInternals
                                onGoogleApiLoaded={({ map, maps }) => initAutocomplete(map, maps)}
                                options={{
                                    styles: [
                                        {
                                            featureType: "all",
                                            elementType: "labels",
                                            stylers: [{ visibility: "on" }]
                                        }
                                    ]
                                }}
                            >
                                <Marker
                                    lat={markerPosition.lat}
                                    lng={markerPosition.lng}
                                    text="Selected location"
                                />
                            </GoogleMapReact>
                        </div>

                        {/* Modal Footer with Selected Location Info and Actions */}
                        <div
                            style={{
                                padding: "16px 20px",
                                borderTop: "1px solid #eee",
                                backgroundColor: "#f8f9fa",
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <div>
                                <p style={{ margin: "0 0 4px 0", fontSize: "14px", color: "#666" }}>
                                    Selected Location:
                                </p>
                                <p style={{ margin: 0, fontSize: "15px", fontWeight: "600" }}>
                                    {selectedLocation?.address ||
                                        `Lat: ${markerPosition.lat.toFixed(6)}, Lng: ${markerPosition.lng.toFixed(6)}`}
                                </p>
                            </div>
                            <div style={{ display: "flex", gap: "12px" }}>
                                <button
                                    onClick={handleCloseModal}
                                    style={{
                                        padding: "10px 20px",
                                        borderRadius: "6px",
                                        border: "1px solid #dc3545",
                                        background: "white",
                                        color: "#dc3545",
                                        cursor: "pointer",
                                        fontWeight: "600",
                                        fontSize: "14px",
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={!selectedLocation}
                                    style={{
                                        padding: "10px 24px",
                                        borderRadius: "6px",
                                        border: "none",
                                        background: selectedLocation ? "#0446DB" : "#cccccc",
                                        color: "white",
                                        cursor: selectedLocation ? "pointer" : "not-allowed",
                                        fontWeight: "600",
                                        fontSize: "14px",
                                    }}
                                >
                                    Submit Location
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
