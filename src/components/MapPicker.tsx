import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { MapPin, X } from 'lucide-react';

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapPickerProps {
  latitude: number | null;
  longitude: number | null;
  onLocationSelect: (lat: number, lng: number) => void;
  onClose?: () => void;
}

// Component to handle map clicks
function LocationMarker({ 
  position, 
  setPosition 
}: { 
  position: [number, number] | null; 
  setPosition: (pos: [number, number]) => void;
}) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return position === null ? null : <Marker position={position} />;
}

export function MapPicker({ latitude, longitude, onLocationSelect, onClose }: MapPickerProps) {
  // Default center: Bojonegoro
  const defaultCenter: [number, number] = [-7.150370, 111.882050];
  const [position, setPosition] = useState<[number, number] | null>(
    latitude && longitude ? [latitude, longitude] : null
  );
  const [mapCenter, setMapCenter] = useState<[number, number]>(
    latitude && longitude ? [latitude, longitude] : defaultCenter
  );

  const handleConfirm = () => {
    if (position) {
      onLocationSelect(position[0], position[1]);
    }
  };

  const handleUseCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setPosition([lat, lng]);
          setMapCenter([lat, lng]);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Tidak dapat mengakses lokasi. Pastikan izin lokasi diaktifkan.');
        }
      );
    } else {
      alert('Geolocation tidak didukung di browser Anda.');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Pilih Lokasi di Peta</h3>
          <p className="text-sm text-muted-foreground">
            Klik pada peta untuk menandai lokasi
          </p>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Coordinates Display */}
      {position && (
        <div className="p-3 bg-muted rounded-lg">
          <p className="text-sm">
            <strong>Koordinat Terpilih:</strong>
          </p>
          <p className="text-sm font-mono">
            Latitude: {position[0].toFixed(6)} | Longitude: {position[1].toFixed(6)}
          </p>
        </div>
      )}

      {/* Map Container */}
      <div className="relative rounded-lg overflow-hidden border" style={{ height: '400px' }}>
        <MapContainer
          center={mapCenter}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker position={position} setPosition={setPosition} />
        </MapContainer>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={handleUseCurrentLocation}
          className="flex-1"
        >
          <MapPin className="h-4 w-4 mr-2" />
          Gunakan Lokasi Saat Ini
        </Button>
        <Button
          type="button"
          onClick={handleConfirm}
          disabled={!position}
          className="flex-1"
        >
          Konfirmasi Lokasi
        </Button>
      </div>

      <p className="text-xs text-muted-foreground text-center">
        💡 Tips: Zoom in untuk akurasi lebih baik. Klik pada lokasi rumah penerima bantuan.
      </p>
    </div>
  );
}