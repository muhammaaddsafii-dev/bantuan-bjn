import { useState } from 'react';
import { motion } from 'framer-motion';
import { Maximize2, Minimize2, Layers, Filter, X, Building2 } from 'lucide-react';
import { InteractiveMap } from '@/components/map/InteractiveMap';
import { households, districts, aidTypeLabels } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

export default function MapView() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAidTypes, setSelectedAidTypes] = useState<string[]>([]);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const filteredHouseholds = households.filter((h) => {
    const matchesAidType = selectedAidTypes.length === 0 || selectedAidTypes.includes(h.aidType);
    const matchesDistrict = selectedDistricts.length === 0 || selectedDistricts.includes(h.address.district);
    return matchesAidType && matchesDistrict;
  });

  const toggleAidType = (type: string) => {
    setSelectedAidTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const toggleDistrict = (district: string) => {
    setSelectedDistricts((prev) =>
      prev.includes(district) ? prev.filter((d) => d !== district) : [...prev, district]
    );
  };

  const clearFilters = () => {
    setSelectedAidTypes([]);
    setSelectedDistricts([]);
  };

  const hasActiveFilters = selectedAidTypes.length > 0 || selectedDistricts.length > 0;

  return (
    <div className="relative h-screen w-full">
      {/* Top Bar */}
      <div className="absolute left-0 right-0 top-0 z-[1000] flex items-center justify-between bg-background/95 px-4 py-3 backdrop-blur shadow-sm">
        <div className="flex items-center gap-3">
          <Link to="/public" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Building2 className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">Peta Bansos</span>
          </Link>
          <Badge variant="secondary" className="text-xs">
            {filteredHouseholds.length} lokasi
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={showFilters ? 'default' : 'outline'}
            size="sm"
            className="gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4" />
            Filter
            {hasActiveFilters && (
              <Badge className="ml-1 h-5 w-5 rounded-full p-0 text-xs">
                {selectedAidTypes.length + selectedDistricts.length}
              </Badge>
            )}
          </Button>
          <Button variant="outline" size="icon" onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="absolute right-4 top-16 z-[1000] w-72 rounded-xl bg-card p-4 shadow-elevated"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Filter Data</h3>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setShowFilters(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Aid Types */}
          <div className="mb-4">
            <p className="mb-2 text-sm font-medium text-muted-foreground">Jenis Bantuan</p>
            <div className="flex flex-wrap gap-2">
              {Object.keys(aidTypeLabels).map((type) => (
                <Badge
                  key={type}
                  variant={selectedAidTypes.includes(type) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleAidType(type)}
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>

          {/* Districts */}
          <div className="mb-4">
            <p className="mb-2 text-sm font-medium text-muted-foreground">Kecamatan</p>
            <div className="max-h-40 space-y-1 overflow-y-auto">
              {districts.map((district) => (
                <button
                  key={district.name}
                  onClick={() => toggleDistrict(district.name)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition',
                    selectedDistricts.includes(district.name)
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  )}
                >
                  <span>{district.name}</span>
                  <span className="text-xs opacity-70">{district.totalRecipients}</span>
                </button>
              ))}
            </div>
          </div>

          {hasActiveFilters && (
            <Button variant="outline" size="sm" className="w-full" onClick={clearFilters}>
              Hapus Semua Filter
            </Button>
          )}
        </motion.div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-[1000] rounded-xl bg-card p-4 shadow-elevated">
        <div className="flex items-center gap-2 mb-3">
          <Layers className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Legenda</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-destructive" />
            <span className="text-xs text-muted-foreground">Sangat Miskin</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full" style={{ background: '#f59e0b' }} />
            <span className="text-xs text-muted-foreground">Miskin</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-accent" />
            <span className="text-xs text-muted-foreground">Rentan Miskin</span>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="h-full w-full pt-14">
        <InteractiveMap households={filteredHouseholds} zoom={11} />
      </div>
    </div>
  );
}
