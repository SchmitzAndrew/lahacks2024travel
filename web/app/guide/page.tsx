"use client"

import { useEffect, useState } from 'react';
import Container from "@/components/ui/Container";
import AnimatedButton from "@/components/ui/AnimatedButton";

export default function Guide() {
    // State variables to store latitude and longitude
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);

    const [places, setPlaces] = useState<any[]>([]);

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function(position) {
                // Update state with the new latitude and longitude
                setLatitude(position.coords.latitude);
                setLongitude(position.coords.longitude);
                console.log(position.coords.latitude)
            }, function(error) {
                console.error("Error Code = " + error.code + " - " + error.message);
            });
        } else {
            console.log("Geolocation is not supported by this browser.");
        }
    }, []);

    useEffect(() => {
        const fetchPlaces = async () => {
            if (latitude !== null && longitude !== null) {
                const queryParams = new URLSearchParams([
                    ["latitude", latitude.toString()],
                    ["longitude", longitude.toString()]
                ]);
                
                const serverUrl = process.env.NEXT_PUBLIC_FLASK_URL;
                console.log(serverUrl);
                const response = await fetch(`${serverUrl}/api/places?${queryParams}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                const data = await response.json();
                console.log(data)
            }
        }
        fetchPlaces();
    }, [latitude, longitude])



    return (
        <>
            <Container>
                <>
                <h1> Your Starting Location </h1>
                    <div>
                        <p>Latitude: {latitude}</p>
                        <p>Longitude: {longitude}</p>
                    </div>

                </>
            </Container>
        </>
    );
}