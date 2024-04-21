"use client"

import { useEffect, useState } from 'react';
import Container from "@/components/ui/Container";
import AnimatedButton from "@/components/ui/AnimatedButton";

import MagnifyingGlassIcon from "@heroicons/react/24/outline/MagnifyingGlassIcon";

import Map from "@/components/ui/Map";

interface place {
    id: number
    name: string
    description: string | undefined
    latitude: number
    longitude: number
    image_url: string
    city: string
}

export default function Guide() {
    // State variables to store latitude and longitude
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);
    const [address, setAddress] = useState<string | null>(null);

    
    const [places, setPlaces] = useState<place[] | null>(null);
    const [isLoadingLocation, setIsLoadingLocation] = useState(true);

    const handleAddressInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setAddress(event.target.value);
    };

    const handleSearch = () => {
        if (address) {
            // If address is provided, fetch places based on the address
            fetchPlaces();
        } else {
            // If no address is provided, get the current location
            getLocation();
        }
    };

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    const getLocation = () => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(function (position) {
                
                setLatitude(position.coords.latitude);
                setLongitude(position.coords.longitude);
                

                setIsLoadingLocation(false); // Update loading state here
                // Optionally, trigger fetching places right after getting the location
                fetchPlaces();
            }, function (error) {
                console.error("Error Code = " + error.code + " - " + error.message);
                setIsLoadingLocation(false); // Update loading state in case of error as well
            });
        } else {
            console.log("Geolocation is not supported by this browser.");
            setIsLoadingLocation(false); // Update loading state if geolocation is not supported
        }
    };

    const fetchPlaces = async () => {
        console.log("fetching places")
        let queryParams = new URLSearchParams();
        queryParams.append("num_places", "5");
        queryParams.append("radius", "1000");

        if (address) {
            // Send the address directly to the backend
            queryParams.append("address", address);
        } else if (latitude !== null && longitude !== null) {
            queryParams.append("lat", latitude.toString());
            queryParams.append("long", longitude.toString());
            
        } else {
            console.log("No location information available.");
            return;
        }


        const serverUrl = process.env.NEXT_PUBLIC_FLASK_URL;
        const places_response = await fetch(`${serverUrl}/places?${queryParams}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        const places_data = await places_response.json();
        if (places_data.success) {
            setPlaces(places_data.places as place[]);
            console.log("Places", places_data.places)
        } else {
            console.log('Error fetching places')
            return
        }

        const descriptions_response = await fetch(`${serverUrl}/placedescriptionsv2?${queryParams}`, {
            method: "POST",
            body: JSON.stringify({'places': places_data.places.map((place_datum: any) => ({'id': place_datum['id'], 'name': place_datum['name']}))}),
            headers: {
                "Content-Type": "application/json"
            }
        });
        
        const descriptions_data = await descriptions_response.json();
        console.log("Descriptions", descriptions_data)
        if (descriptions_data.success) {
            const descriptionsList:any[] = []
            for(let description_datum of descriptions_data.content) {
                descriptionsList.push(description_datum['description'])
            }
            setPlaces(places_data.places.map((place_datum: place) => {place_datum['description'] = descriptionsList[place_datum['id']]; return place_datum}))
            //setPlaces(descriptions_data.places as place[]);
            
        } else {
            console.log('Error fetching descriptions')
            return
        }

    };

    return (
        <>
            <div className="">
                <Container>
                    <div>
                        <div className="flex flex-col items-center">
                            <div className="pt-6 pb-3">
                                <AnimatedButton onClick={getLocation}>
                                    Use My Location 🧭
                                </AnimatedButton>
                            </div>

                            <p className=" text-gray-700">-or-</p>
                            <div>
                                <div className="relative mt-2 rounded-md shadow-sm">
                                    <input
                                        type="text"
                                        name="address"
                                        id="address"
                                        className="block w-full rounded-md border-0 py-1.5 pr-6 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
                                        placeholder="enter your address"
                                        onChange={handleAddressInput}
                                        onKeyDown={handleKeyPress}
                                    />
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" onClick={handleSearch} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>

                            {places === null ? (
                                <div>
                                    <span className="hidden">Loading places...</span>
                                </div>
                            ) : places.length > 0 ? (
                                <div>                                   
                                    <h2 className="text-2xl font-bold pt-6 text-slate-900"> Nearby Places </h2>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8">
                                        {places.map((place, index) => (
                                            index === 0 ? (
                                                // Render the first element differently
                                                <li key={index} className="mb-4 rounded-lg bg-blue-100 shadow p-3">
                                                    <h3 className="text-lg font-semibold text-slate-900">{place.name}</h3>
                                                    {!isLoadingLocation && latitude !== null && longitude !== null && (
                                                        <>
                                                        <p>{place.latitude}</p>
                                                        <p>{place.longitude}</p>
                                                        <Map centerLatitude={latitude} centerLongitude={longitude} placeLatitude={place.latitude} placeLongitude={place.longitude} />
                                                        </>
                                                    )}
                                                    <p>{place.description}</p>
                                                    <p className="text-sm text-blue-700">Featured Place</p>
                                                </li>
                                            ) : (
                                                // Render other elements
                                                <li key={index} className="mb-4 rounded-lg bg-white shadow p-3">
                                                    <h3 className="text-lg font-semibold text-slate-900">{place.name}</h3>
                                                    <img src={place.image_url} alt={place.name} className="w-full h-auto rounded-xl" />
                                                    <p>{place.description}</p>
                                                </li>
                                            )
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <p>No places found.</p>
                            )}
                        </div>
                    </div>
                </Container>
            </div>
        </>
    );
}

