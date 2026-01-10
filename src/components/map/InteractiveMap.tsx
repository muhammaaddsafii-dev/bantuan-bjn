import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Household } from '@/data/mockData';
import { createRoot } from 'react-dom/client';
import { HouseholdPopup } from './HouseholdPopup';

// WebGIS Map Component for Bojonegoro Social Aid

interface MapViewProps {
  households: Household[];
  center?: [number, number];
  zoom?: number;
}

export function InteractiveMap({ 
  households, 
  center = [-7.15, 111.88],
  zoom = 12 
}: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map
    const map = L.map(mapRef.current, {
      center,
      zoom,
      zoomControl: true,
    });

    // Add tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;
    setIsLoaded(true);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Add markers when map is loaded
  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded) return;

    const map = mapInstanceRef.current;

    // Clear existing markers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Add new markers
    households.forEach((household) => {
      const colors: Record<string, string> = {
        'Sangat Miskin': '#ef4444',
        'Miskin': '#f59e0b',
        'Rentan Miskin': '#22c55e',
      };

      const icon = L.divIcon({
        className: 'custom-marker-container',
        html: `
          <div style="
            width: 28px;
            height: 28px;
            background: ${colors[household.economicStatus] || '#3b82f6'};
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="
              width: 10px;
              height: 10px;
              background: white;
              border-radius: 50%;
              opacity: 0.9;
            "></div>
          </div>
        `,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker(household.coordinates, { icon }).addTo(map);

      // Create popup content
      const popupContent = document.createElement('div');
      popupContent.className = 'household-popup-content';
      
      const popup = L.popup({
        maxWidth: 350,
        className: 'household-popup',
      }).setContent(popupContent);

      marker.bindPopup(popup);

      marker.on('popupopen', () => {
        const root = createRoot(popupContent);
        root.render(<HouseholdPopup household={household} />);
      });
    });

    // Fit bounds if we have households
    if (households.length > 0) {
      const bounds = L.latLngBounds(households.map(h => h.coordinates));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [households, isLoaded]);

  return (
    <div 
      ref={mapRef} 
      className="h-full w-full rounded-xl"
      style={{ minHeight: '400px' }}
    />
  );
}
