import { useState, useCallback } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060,
};

interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
}

const MapPicker = ({ onLocationSelect }: MapPickerProps) => {
  const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(null);

  // Note: Replace with your actual Google Maps API key
  // For development, you can use the env variable approach
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "YOUR_GOOGLE_MAPS_API_KEY", // Replace with actual key
  });

  const onMapClick = useCallback(
    (e: google.maps.MapMouseEvent) => {
      if (e.latLng) {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        setMarkerPosition({ lat, lng });
        onLocationSelect(lat, lng);
      }
    },
    [onLocationSelect]
  );

  if (!isLoaded) {
    return (
      <div className="w-full h-[400px] bg-muted rounded-md flex items-center justify-center">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    );
  }

  return (
    <div className="rounded-md overflow-hidden border">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={markerPosition || defaultCenter}
        zoom={13}
        onClick={onMapClick}
      >
        {markerPosition && <Marker position={markerPosition} />}
      </GoogleMap>
      <p className="text-sm text-muted-foreground p-2 bg-muted">
        Click on the map to select the location of the issue
      </p>
    </div>
  );
};

export default MapPicker;
