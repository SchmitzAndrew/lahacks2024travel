"use client";
import { useEffect, useState } from "react";
import {
    APIProvider,
    Map,
    useMapsLibrary,
    useMap,
    } from "@vis.gl/react-google-maps";

interface IntroProps {
    centerLongitude: number;
    centerLatitude: number;
    placeLongitude: number;
    placeLatitude: number;
}

export default function Intro({centerLongitude, centerLatitude, placeLongitude, placeLatitude}: IntroProps) {
    const position = { lat: centerLatitude, lng: centerLongitude };
    const placePosition = { lat: placeLatitude, lng: placeLongitude };
    return (
        <div style={{ height: "100vh", width: "100%" }}>
            <APIProvider
                apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
            >
                <Map
                    center={position}
                    zoom={9}
                    mapId={process.env.NEXT_PUBLIC_MAP_ID}
                >
                    {/* other components or code here */}
                </Map>
            </APIProvider>
            <Directions />
        </div>
    );
}

function Directions() {
    const map = useMap();
    const routesLibrary = useMapsLibrary("routes");
    const [directionsService, setDirectionsService] =
        useState<google.maps.DirectionsService>();
    const [directionsRenderer, setDirectionsRenderer] =
        useState<google.maps.DirectionsRenderer>();
    const [routes, setRoutes] = useState<google.maps.DirectionsRoute[]>([]);
    const [routeIndex, setRouteIndex] = useState(0);
    const selected = routes[routeIndex];
    const leg = selected?.legs[0];

    useEffect(() => {
        if (!routesLibrary || !map) return;
        setDirectionsService(new routesLibrary.DirectionsService());
        setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
    }, [routesLibrary, map]);

    useEffect(() => {
        if (!directionsService || !directionsRenderer) return;

        directionsService
            .route({
                origin: "100 Front St, Toronto ON",
                destination: "500 College St, Toronto ON",
                travelMode: google.maps.TravelMode.WALKING,
                provideRouteAlternatives: true,
            })
            .then((response) => {
                directionsRenderer.setDirections(response);
                setRoutes(response.routes);
            });
    }, [directionsService, directionsRenderer]);

    if (!leg) return null;

    return (
        <div className="directions">
            <h2>[selected.summary]</h2>
            <p>
                {leg.start_address.split(",")[0]} to {leg.end_address.split(",")[0]}
            </p>
            <p>Distance: {leg.distance?.text}</p>
            <p>Distance: {leg.duration?.text}</p>

            <h2>Other Routes</h2>
            <ul>
                {routes.map((route, index) => (
                    <li key={route.summary}>
                        <button onClick={() => setRouteIndex(index)}>
                            {route.summary}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}