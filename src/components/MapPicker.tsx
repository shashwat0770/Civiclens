import { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
}

const MapPicker = ({ onLocationSelect }: MapPickerProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [mapboxToken, setMapboxToken] = useState("");
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken || isMapReady) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-74.0060, 40.7128],
      zoom: 13,
    });

    map.current.addControl(new mapboxgl.NavigationControl(), "top-right");

    map.current.on("click", (e) => {
      const { lng, lat } = e.lngLat;
      
      if (marker.current) {
        marker.current.remove();
      }
      
      marker.current = new mapboxgl.Marker()
        .setLngLat([lng, lat])
        .addTo(map.current!);
      
      onLocationSelect(lat, lng);
    });

    setIsMapReady(true);

    return () => {
      marker.current?.remove();
      map.current?.remove();
    };
  }, [mapboxToken, onLocationSelect, isMapReady]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="mapbox-token">Mapbox Public Token</Label>
        <Input
          id="mapbox-token"
          type="text"
          placeholder="Enter your Mapbox public token"
          value={mapboxToken}
          onChange={(e) => setMapboxToken(e.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          Get your free token at{" "}
          <a
            href="https://account.mapbox.com/access-tokens/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary"
          >
            mapbox.com
          </a>
        </p>
      </div>
      
      {mapboxToken && (
        <div className="rounded-md overflow-hidden border">
          <div ref={mapContainer} className="w-full h-[400px]" />
          <p className="text-sm text-muted-foreground p-2 bg-muted">
            Click on the map to select the location of the issue
          </p>
        </div>
      )}
    </div>
  );
};

export default MapPicker;
