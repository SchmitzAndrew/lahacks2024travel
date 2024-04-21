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
    console.log(centerLongitude)
    console.log(centerLatitude)
    console.log(placeLongitude)
    console.log(placeLatitude)
    

    return (
        <div style={{ height: "100vh", width: "100%" }}>
            <APIProvider
                apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS!}
            >
                <Map
                    defaultCenter={position}
                    defaultZoom={14}
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
    

    useEffect(() => {
        if (!routesLibrary || !map) return;
        setDirectionsService(new routesLibrary.DirectionsService());
        setDirectionsRenderer(new routesLibrary.DirectionsRenderer({ map }));
    }, [routesLibrary, map]);

    useEffect(() => {
        if (!directionsService || !directionsRenderer) return;

        directionsService
            .route({
                origin: new google.maps.LatLng(centerLatitude, centerLongitude),
                
                destination: new google.maps.LatLng(placeLatitude, placeLongitude),
                travelMode: google.maps.TravelMode.WALKING,
                provideRouteAlternatives: false,
            })
            .then((response) => {
                console.log("PRINT")
                console.log(new google.maps.LatLng(centerLatitude, centerLongitude))
                console.log(new google.maps.LatLng(placeLatitude, placeLongitude))
                directionsRenderer.setDirections(response);
                
            });
    }, [directionsService, directionsRenderer]);

    return null;
}

