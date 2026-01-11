import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MapPickerProps {
  latitude: number | null;
  longitude: number | null;
  onLocationChange: (lat: number, lng: number) => void;
}

export function MapPicker({ latitude, longitude, onLocationChange }: MapPickerProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize map only once
    if (!mapContainerRef.current || mapRef.current) return;

    const initialLat = latitude || -7.1500;
    const initialLng = longitude || 111.8800;

    // Create map
    const map = L.map(mapContainerRef.current).setView([initialLat, initialLng], 13);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Create marker
    const marker = L.marker([initialLat, initialLng], {
      draggable: true
    }).addTo(map);

    // Handle marker drag
    marker.on('dragend', () => {
      const position = marker.getLatLng();
      onLocationChange(position.lat, position.lng);
    });

    // Handle map click
    map.on('click', (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      onLocationChange(lat, lng);
    });

    mapRef.current = map;
    markerRef.current = marker;

    // Cleanup
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, []); // Only run once on mount

  // Update marker position when props change
  useEffect(() => {
    if (markerRef.current && latitude && longitude) {
      markerRef.current.setLatLng([latitude, longitude]);
      if (mapRef.current) {
        mapRef.current.setView([latitude, longitude], 13);
      }
    }
  }, [latitude, longitude]);

  return (
    <div 
      ref={mapContainerRef} 
      style={{ 
        height: '300px', 
        width: '100%', 
        borderRadius: '8px',
        border: '1px solid hsl(var(--border))'
      }} 
    />
  );
}