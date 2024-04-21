"use client";
import { useEffect, useState } from "react";
import {
    APIProvider,
    Map,
    useMapsLibrary,
    useMap,
} from "@vis.gl/react-google-maps";

interface IntroProps {
    centerLatitude: number;
    centerLongitude: number;
    placeLatitude: number;
    placeLongitude: number;
    
}

export default function Intro({ centerLongitude, centerLatitude, placeLongitude, placeLatitude }: IntroProps) {
    const position = { lat: centerLatitude, lng: centerLongitude };
    

    return (
        <div style={{ height: "100vh", width: "100%" }}>
            <APIProvider
                apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS!}
            >
                <Map
                    center={position}
                    zoom={14}

                >
                    {/* other components or code here */}
                    <Directions centerLatitude={centerLatitude} centerLongitude={centerLongitude} placeLatitude={placeLatitude} placeLongitude={placeLongitude} />
                </Map>
            </APIProvider>
            
        </div>
    );
}

interface DirectionsProps {
    centerLatitude: number;
    centerLongitude: number;
    placeLatitude: number;
    placeLongitude: number
}

function Directions({ centerLatitude, centerLongitude, placeLatitude, placeLongitude }: DirectionsProps) {
    const map = useMap();
    const routesLibrary = useMapsLibrary("routes");
    const [directionsService, setDirectionsService] = useState<google.maps.DirectionsService>();
    const [directionsRenderer, setDirectionsRenderer] = useState<google.maps.DirectionsRenderer>();
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
        console.log("latitudeCenter", centerLatitude)
        console.log("longitudeCenter", centerLongitude)
        console.log("latitudePlace", placeLatitude)
        console.log("longitudePlace", placeLongitude)

        directionsService
            .route({
                origin: new google.maps.LatLng(centerLatitude, centerLongitude),
                destination: new google.maps.LatLng(placeLatitude, placeLongitude),
                travelMode: google.maps.TravelMode.WALKING,
                provideRouteAlternatives: false,
            })
            .then((response) => {
                directionsRenderer.setDirections(response);
                setRoutes(response.routes);
            });
    }, [directionsService, directionsRenderer]);
    console.log(directionsService)
    console.log(directionsRenderer)

    if (!leg) return null;

    return (
        <div className="directions">
            <h2>[selected.summary]</h2>
            <p>
                {leg.start_address.split(",")[0]} to {leg.end_address.split(",")[0]}
            </p>
            <p>Distance: {leg.distance?.text}</p>
            <p>Distance: {leg.duration?.text}</p>

            
        </div>
    );
}