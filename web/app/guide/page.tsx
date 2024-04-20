"use client"

import { useEffect, useState } from 'react';
import Container from "@/components/ui/Container";
import AnimatedButton from "@/components/ui/AnimatedButton";

export default function Guide() {
    // State variables to store latitude and longitude
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);

    const [places, setPlaces] = useState<any[] | null>(null);

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                // Update state with the new latitude and longitude
                setLatitude(position.coords.latitude);
                setLongitude(position.coords.longitude);
                console.log(position.coords.latitude)
            }, function (error) {
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
                    ["lat", latitude.toString()],
                    ["long", longitude.toString()],
                    ["numPlaces", "5"],
                    ["radius", "10000"]
                ]);

                const serverUrl = process.env.NEXT_PUBLIC_FLASK_URL;
                console.log(serverUrl);
                const response = await fetch(`${serverUrl}/places?${queryParams}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                const data = await response.json();
                console.log("Returned Places:")
                console.log(data)
                console.log(typeof data)
                if (data.success) {
                    setPlaces(data.places);
                }
            }
        }
        fetchPlaces();
    }, [latitude, longitude])



    return (
        <>
            <Container>
                <>
                    <div>
                        <h2> Your Starting Location </h2>
                        <div>
                            <p>Latitude: {latitude}</p>
                            <p>Longitude: {longitude}</p>
                        </div>
                    </div>
                    <div>
                        <h2> Nearby Places </h2>
                        {places === null ? (
                            <p>Loading places...</p>
                        ) : places.length > 0 ? (
                            <ul>
                                {places.map((place, index) => (
                                    <li key={index} className="mb-4">
                                        <h3 className="text-lg font-semibold">{place.name}</h3>
                                        <img src={place.image_url} alt={place.name} className="w-full h-auto" />
                                        <p>{place.description}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No places found.</p>
                        )}
                    </div>
                </>
            </Container>
        </>
    );
}