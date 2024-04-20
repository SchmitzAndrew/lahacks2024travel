"use client"

import { useEffect, useState } from 'react';
import Container from "@/components/ui/Container";

export default function Guide() {
    // State variables to store latitude and longitude
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);

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

    return (
        <>
            <Container>
                <>
                <h1> Your Location </h1>
                {/* Check directly if latitude and longitude are not 0 */}
                {(latitude !== 0 || longitude !== 0) && (
                    <div>
                        <p>Latitude: {latitude}</p>
                        <p>Longitude: {longitude}</p>
                    </div>
                )}
                </>
            </Container>
        </>
    );
}