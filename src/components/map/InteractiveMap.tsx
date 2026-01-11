import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { createRoot } from 'react-dom/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, MapPin, Users, Home, DollarSign } from 'lucide-react';

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Types matching AdminDashboard
interface Photo {
  id: number;
  penerima_bantuan: number;
  file_path: string;
  created_at: string;
  updated_at: string;
}

interface PenerimaBantuan {
  id: number;
  nama_kepala_keluarga: string;
  jumlah_anggota_keluarga: number;
  kecamatan: number;
  kecamatan_nama: string;
  nama_desa: string;
  alamat: string;
  jenis_bantuan: number;
  jenis_bantuan_nama: string;
  pendapatan_per_bulan: string;
  latitude: string | null;
  longitude: string | null;
  photos: Photo[];
  created_at: string;
  updated_at: string;
}

interface InteractiveMapProps {
  penerimaBantuan: PenerimaBantuan[];
  center?: [number, number];
  zoom?: number;
  onMarkerClick?: (penerima: PenerimaBantuan) => void;
}

// Helper function untuk status ekonomi (sama dengan AdminDashboard)
const getEconomicStatus = (income: string): string => {
  const incomeNum = parseFloat(income);
  if (incomeNum < 1000000) return 'Sangat Miskin';
  if (incomeNum < 2000000) return 'Miskin';
  return 'Rentan Miskin';
};

// Color mapping untuk status ekonomi
const statusColors: Record<string, string> = {
  'Sangat Miskin': '#ef4444',
  'Miskin': '#f59e0b',
  'Rentan Miskin': '#22c55e',
};

// Popup Component
function PopupContent({ penerima }: { penerima: PenerimaBantuan }) {
  const status = getEconomicStatus(penerima.pendapatan_per_bulan);
  const statusColor = statusColors[status];

  return (
    <div className="p-2 min-w-[280px]">
      {/* Header */}
      <div className="mb-3">
        <h3 className="font-semibold text-base mb-1">{penerima.nama_kepala_keluarga}</h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span>{penerima.nama_desa}, {penerima.kecamatan_nama}</span>
        </div>
      </div>

      {/* Info Grid */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center gap-2 text-sm">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Anggota Keluarga:</span>
          <span className="font-medium">{penerima.jumlah_anggota_keluarga} orang</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <Home className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Jenis Bantuan:</span>
          <Badge variant="outline" className="text-xs">{penerima.jenis_bantuan_nama}</Badge>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">Pendapatan:</span>
          <span className="font-medium">Rp {parseFloat(penerima.pendapatan_per_bulan).toLocaleString('id-ID')}</span>
        </div>
      </div>

      {/* Status Badge */}
      <div className="mb-3">
        <div 
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
          style={{ backgroundColor: statusColor }}
        >
          {status}
        </div>
      </div>

      {/* Alamat */}
      <div className="text-xs text-muted-foreground mb-3 p-2 bg-muted rounded">
        {penerima.alamat}
      </div>

      {/* Photos */}
      {penerima.photos.length > 0 && (
        <div className="mb-3">
          <p className="text-xs text-muted-foreground mb-2">Foto:</p>
          <div className="grid grid-cols-3 gap-1">
            {penerima.photos.slice(0, 3).map((photo) => (
              <img
                key={photo.id}
                src={photo.file_path}
                alt="Foto"
                className="w-full h-16 object-cover rounded cursor-pointer hover:opacity-80 transition"
                onClick={() => window.open(photo.file_path, '_blank')}
              />
            ))}
          </div>
          {penerima.photos.length > 3 && (
            <p className="text-xs text-muted-foreground mt-1">
              +{penerima.photos.length - 3} foto lainnya
            </p>
          )}
        </div>
      )}

      {/* Action Button */}
      {penerima.latitude && penerima.longitude && (
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${penerima.latitude},${penerima.longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
        >
          <ExternalLink className="h-3 w-3" />
          Buka di Google Maps
        </a>
      )}
    </div>
  );
}

export function InteractiveMap({ 
  penerimaBantuan, 
  center = [-7.15, 111.88],
  zoom = 12,
  onMarkerClick
}: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Map<number, L.Marker>>(new Map());
  const [isLoaded, setIsLoaded] = useState(false);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center,
      zoom,
      zoomControl: true,
    });

    // Add tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
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
  }, [center, zoom]);

  // Add/update markers when data changes
  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded) return;

    const map = mapInstanceRef.current;
    const currentMarkers = markersRef.current;

    // Clear old markers
    currentMarkers.forEach((marker) => {
      marker.remove();
    });
    currentMarkers.clear();

    // Filter penerima that have valid coordinates
    const validPenerima = penerimaBantuan.filter(
      (p) => p.latitude && p.longitude
    );

    if (validPenerima.length === 0) {
      return;
    }

    // Add new markers
    validPenerima.forEach((penerima) => {
      const lat = parseFloat(penerima.latitude!);
      const lng = parseFloat(penerima.longitude!);
      const status = getEconomicStatus(penerima.pendapatan_per_bulan);
      const color = statusColors[status];

      // Create custom icon
      const icon = L.divIcon({
        className: 'custom-marker-container',
        html: `
          <div style="
            width: 28px;
            height: 28px;
            background: ${color};
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
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

      const marker = L.marker([lat, lng], { icon }).addTo(map);

      // Create popup
      const popupContent = document.createElement('div');
      popupContent.className = 'leaflet-popup-content-wrapper';
      
      const popup = L.popup({
        maxWidth: 320,
        className: 'custom-popup',
      }).setContent(popupContent);

      marker.bindPopup(popup);

      // Render React content in popup when opened
      marker.on('popupopen', () => {
        const root = createRoot(popupContent);
        root.render(<PopupContent penerima={penerima} />);
      });

      // Optional click handler
      if (onMarkerClick) {
        marker.on('click', () => {
          onMarkerClick(penerima);
        });
      }

      currentMarkers.set(penerima.id, marker);
    });

    // Fit bounds to show all markers
    if (validPenerima.length > 0) {
      const bounds = L.latLngBounds(
        validPenerima.map((p) => [
          parseFloat(p.latitude!),
          parseFloat(p.longitude!),
        ])
      );
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    }
  }, [penerimaBantuan, isLoaded, onMarkerClick]);

  return (
    <div 
      ref={mapRef} 
      className="h-full w-full rounded-xl border"
      style={{ minHeight: '500px' }}
    />
  );
}