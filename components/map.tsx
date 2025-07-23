"use client";

import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

interface Location {
  id: string | number;
  lat: number;
  lng: number;
  title: string;
}

interface MapProps {
  locations: Location[];
}

export function Map({ locations }: MapProps) {
  const center = locations.length > 0 ? { lat: locations[0].lat, lng: locations[0].lng } : { lat: 40.7128, lng: -74.0060 };

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden">
      <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
        <GoogleMap
          center={center}
          zoom={12}
        >
          {locations.map((location) => (
            <Marker key={location.id} position={{ lat: location.lat, lng: location.lng }} title={location.title} />
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}
