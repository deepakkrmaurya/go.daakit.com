// import React, { useEffect } from 'react'
// import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
// import indiaGeoJson from "../ddd/india.json";
// export default function DelhiMap() {

//     const delhiGeoJson = {
//         "type": "Feature",
//         "geometry": {
//             "type": "Polygon",
//             "coordinates": [[
//                 [76.84, 28.40],
//                 [77.50, 28.40],
//                 [77.50, 28.90],
//                 [76.84, 28.90],
//                 [76.84, 28.40]
//             ]]
//         },
//         "properties": {
//             "name": "Delhi"
//         }
//     }
//     const delhi = indiaGeoJson.features.find(
//         (e) => e.properties.NAME_1 === "Delhi"
//     );

//     return (
//         <MapContainer
//             style={{ height: "900px", width: "100%" }}
//             zoom={10}
//             center={[28.6139, 77.2090]}
//         >
//             <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

//             {/* Delhi Boundary */}
//             <GeoJSON
//                 data={delhi}
//                 style={{
//                     color: "blue",
//                     weight: 2,
//                     fillColor: "lightblue",
//                     fillOpacity: 0.3,
//                 }}
//             />
//         </MapContainer>
//     )
// }


import React, { useEffect } from "react";
import { MapContainer, TileLayer, GeoJSON, useMap } from "react-leaflet";
import indiaGeoJson from "../ddd/india.json";
import L from "leaflet";
import "leaflet.heat";
import "leaflet/dist/leaflet.css";

export default function DelhiMap() {
    const delhi = indiaGeoJson.features.find(
        (e) => e.properties.NAME_1 === "Delhi"
    );

    const heatPoints = [
        [28.7041, 77.1025, 1.0],
        [28.5355, 77.3910, 0.9],
        [28.6139, 77.2090, 1.0],
        [28.6500, 77.2300, 0.8],
        [28.4089, 77.3178, 0.9],
        [28.5500, 77.2500, 0.7],
        [28.6200, 77.1800, 0.8],
        [28.5900, 77.3000, 0.7],
    ];

    function HeatLayer() {
        const map = useMap();

        useEffect(() => {
            const heat = L.heatLayer(heatPoints, {
                radius: 45,
                blur: 25,
                maxZoom: 12,
                minOpacity: 0.5,
            }).addTo(map);

            return () => map.removeLayer(heat);
        }, [map]);

        return null;
    }

    return (
        <MapContainer
            style={{ height: "900px", width: "100%" }}
            zoom={10}
            center={[28.6139, 77.2090]}
        >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {delhi && (
                <GeoJSON
                    data={delhi}
                    style={{
                        color: "blue",
                        weight: 2,
                        fillColor: "blue",
                        fillOpacity: 0.2,
                    }}
                />
            )}

            {/* Heatmap Layer */}
            <HeatLayer />
        </MapContainer>
    );
}