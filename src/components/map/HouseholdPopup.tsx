import { useState } from 'react';
import { Household, aidTypeLabels } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Calendar, Wallet, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HouseholdPopupProps {
  household: Household;
}

const statusColors: Record<string, string> = {
  'Sangat Miskin': 'bg-destructive text-destructive-foreground',
  'Miskin': 'bg-secondary text-secondary-foreground',
  'Rentan Miskin': 'bg-accent text-accent-foreground',
};

export function HouseholdPopup({ household }: HouseholdPopupProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === household.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? household.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="w-full overflow-hidden">
      {/* Image Gallery */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <img
          src={household.images[currentImageIndex]}
          alt={`Rumah ${household.headName}`}
          className="h-full w-full object-cover"
        />
        
        {household.images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-1.5 text-foreground shadow-md transition hover:bg-background"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-1.5 text-foreground shadow-md transition hover:bg-background"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            
            {/* Image indicators */}
            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
              {household.images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={cn(
                    'h-1.5 w-1.5 rounded-full transition',
                    idx === currentImageIndex ? 'bg-background' : 'bg-background/50'
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Content */}
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-foreground">{household.headName}</h3>
          <Badge className={cn('shrink-0 text-xs', statusColors[household.economicStatus])}>
            {household.economicStatus}
          </Badge>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2 text-muted-foreground">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p>{household.address.village}, {household.address.district}</p>
              <p className="text-xs">{household.address.fullAddress}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{household.familyMembers} anggota keluarga</span>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Penerima sejak {household.yearOfAid}</span>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Wallet className="h-4 w-4" />
            <span>Rp {household.monthlyIncome.toLocaleString('id-ID')}/bulan</span>
          </div>
        </div>

        <div className="border-t border-border pt-3">
          <Badge variant="outline" className="text-xs">
            {household.aidType} - {aidTypeLabels[household.aidType]}
          </Badge>
        </div>
      </div>
    </div>
  );
}
