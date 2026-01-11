import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Map, Filter, Search, X } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { InteractiveMap } from '@/components/map/InteractiveMap';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// API Configuration
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Types (sama dengan AdminDashboard)
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

interface Kecamatan {
  id: number;
  nama: string;
  created_at: string;
  updated_at: string;
}

interface JenisBantuan {
  id: number;
  nama: string;
  created_at: string;
  updated_at: string;
}

const getEconomicStatus = (income: string): string => {
  const incomeNum = parseFloat(income);
  if (incomeNum < 1000000) return 'Sangat Miskin';
  if (incomeNum < 2000000) return 'Miskin';
  return 'Rentan Miskin';
};

const statusColors: Record<string, string> = {
  'Sangat Miskin': 'bg-red-500 text-white',
  'Miskin': 'bg-amber-500 text-white',
  'Rentan Miskin': 'bg-green-500 text-white',
};

export default function MapView() {
  const [penerimaBantuan, setPenerimaBantuan] = useState<PenerimaBantuan[]>([]);
  const [kecamatanList, setKecamatanList] = useState<Kecamatan[]>([]);
  const [jenisBantuanList, setJenisBantuanList] = useState<JenisBantuan[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKecamatan, setSelectedKecamatan] = useState<string>('all');
  const [selectedJenisBantuan, setSelectedJenisBantuan] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const { toast } = useToast();

  // Fetch data on mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchPenerimaBantuan(),
        fetchKecamatan(),
        fetchJenisBantuan(),
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Gagal memuat data. Silakan refresh halaman.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPenerimaBantuan = async () => {
    try {
      let allPenerima: PenerimaBantuan[] = [];
      let nextUrl: string | null = `${API_BASE_URL}/penerima-bantuan/`;
      
      // Loop through all pages to get ALL data
      while (nextUrl) {
        const response = await fetch(nextUrl);
        if (!response.ok) throw new Error('Failed to fetch');
        
        const data = await response.json();
        
        // Check if response has pagination
        if (data.results) {
          allPenerima = [...allPenerima, ...data.results];
          nextUrl = data.next; // Get next page URL
        } else {
          // No pagination, just set the data
          allPenerima = data;
          nextUrl = null;
        }
      }
      
      setPenerimaBantuan(allPenerima);
      console.log(`✅ Loaded ${allPenerima.length} penerima bantuan`);
    } catch (error) {
      console.error('Error fetching penerima bantuan:', error);
    }
  };

  const fetchKecamatan = async () => {
    try {
      let allKecamatan: Kecamatan[] = [];
      let nextUrl: string | null = `${API_BASE_URL}/kecamatan/`;
      
      while (nextUrl) {
        const response = await fetch(nextUrl);
        if (!response.ok) throw new Error('Failed to fetch');
        
        const data = await response.json();
        if (data.results) {
          allKecamatan = [...allKecamatan, ...data.results];
          nextUrl = data.next;
        } else {
          allKecamatan = data;
          nextUrl = null;
        }
      }
      
      setKecamatanList(allKecamatan);
    } catch (error) {
      console.error('Error fetching kecamatan:', error);
    }
  };

  const fetchJenisBantuan = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/jenis-bantuan/`);
      if (!response.ok) throw new Error('Failed to fetch');
      
      const data = await response.json();
      setJenisBantuanList(data.results || data);
    } catch (error) {
      console.error('Error fetching jenis bantuan:', error);
    }
  };

  // Filter data
  const filteredData = penerimaBantuan.filter((p) => {
    // Search filter
    const matchSearch = 
      p.nama_kepala_keluarga.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.kecamatan_nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.nama_desa.toLowerCase().includes(searchQuery.toLowerCase());

    // Kecamatan filter
    const matchKecamatan = 
      selectedKecamatan === 'all' || 
      p.kecamatan.toString() === selectedKecamatan;

    // Jenis Bantuan filter
    const matchJenisBantuan = 
      selectedJenisBantuan === 'all' || 
      p.jenis_bantuan.toString() === selectedJenisBantuan;

    // Status filter
    const status = getEconomicStatus(p.pendapatan_per_bulan);
    const matchStatus = 
      selectedStatus === 'all' || 
      status === selectedStatus;

    return matchSearch && matchKecamatan && matchJenisBantuan && matchStatus;
  });

  // Statistics
  const totalWithCoordinates = penerimaBantuan.filter(p => p.latitude && p.longitude).length;
  const filteredWithCoordinates = filteredData.filter(p => p.latitude && p.longitude).length;
  
  const statusCounts = {
    'Sangat Miskin': filteredData.filter(p => getEconomicStatus(p.pendapatan_per_bulan) === 'Sangat Miskin').length,
    'Miskin': filteredData.filter(p => getEconomicStatus(p.pendapatan_per_bulan) === 'Miskin').length,
    'Rentan Miskin': filteredData.filter(p => getEconomicStatus(p.pendapatan_per_bulan) === 'Rentan Miskin').length,
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedKecamatan('all');
    setSelectedJenisBantuan('all');
    setSelectedStatus('all');
  };

  const hasActiveFilters = 
    searchQuery !== '' || 
    selectedKecamatan !== 'all' || 
    selectedJenisBantuan !== 'all' || 
    selectedStatus !== 'all';

  return (
    <DashboardLayout title="Peta Persebaran Penerima Bantuan" subtitle="Visualisasi geografis data penerima bantuan sosial di Bojonegoro">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Map className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold gradient-text">Peta Persebaran Penerima Bantuan</h1>
            <p className="text-muted-foreground mt-1">
              Visualisasi geografis data penerima bantuan sosial di Bojonegoro
            </p>
          </div>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
      >
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Penerima</p>
              <p className="text-2xl font-bold">{filteredData.length}</p>
            </div>
            <Badge variant="outline">{totalWithCoordinates} terdata</Badge>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Sangat Miskin</p>
              <p className="text-2xl font-bold text-red-500">{statusCounts['Sangat Miskin']}</p>
            </div>
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Miskin</p>
              <p className="text-2xl font-bold text-amber-500">{statusCounts['Miskin']}</p>
            </div>
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Rentan Miskin</p>
              <p className="text-2xl font-bold text-green-500">{statusCounts['Rentan Miskin']}</p>
            </div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="stat-card mb-6"
      >
        <div className="flex items-center gap-2 mb-4">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-semibold">Filter Data</h3>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="ml-auto"
            >
              <X className="h-4 w-4 mr-1" />
              Clear Filters
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari nama, desa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Kecamatan Filter */}
          <Select value={selectedKecamatan} onValueChange={setSelectedKecamatan}>
            <SelectTrigger>
              <SelectValue placeholder="Semua Kecamatan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kecamatan</SelectItem>
              {kecamatanList.map((k) => (
                <SelectItem key={k.id} value={k.id.toString()}>
                  {k.nama}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Jenis Bantuan Filter */}
          <Select value={selectedJenisBantuan} onValueChange={setSelectedJenisBantuan}>
            <SelectTrigger>
              <SelectValue placeholder="Semua Jenis Bantuan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Jenis Bantuan</SelectItem>
              {jenisBantuanList.map((j) => (
                <SelectItem key={j.id} value={j.id.toString()}>
                  {j.nama}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger>
              <SelectValue placeholder="Semua Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="Sangat Miskin">Sangat Miskin</SelectItem>
              <SelectItem value="Miskin">Miskin</SelectItem>
              <SelectItem value="Rentan Miskin">Rentan Miskin</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {hasActiveFilters && (
          <div className="mt-3 text-sm text-muted-foreground">
            Menampilkan {filteredWithCoordinates} dari {totalWithCoordinates} data yang memiliki koordinat
          </div>
        )}
      </motion.div>

      {/* Map */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="stat-card p-0 overflow-hidden"
      >
        {isLoading ? (
          <div className="h-[500px] flex items-center justify-center">
            <p className="text-muted-foreground">Memuat peta...</p>
          </div>
        ) : (
          <InteractiveMap
            penerimaBantuan={filteredData}
            center={[-7.15, 111.88]}
            zoom={12}
          />
        )}
      </motion.div>

      {/* Legend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="stat-card mt-6"
      >
        <h3 className="font-semibold mb-3">Keterangan</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-red-500 border-2 border-white shadow-md"></div>
            <span className="text-sm">Sangat Miskin (Pendapatan &lt; Rp 1.000.000)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-amber-500 border-2 border-white shadow-md"></div>
            <span className="text-sm">Miskin (Pendapatan Rp 1.000.000 - 2.000.000)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-green-500 border-2 border-white shadow-md"></div>
            <span className="text-sm">Rentan Miskin (Pendapatan &gt; Rp 2.000.000)</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3">
          💡 Klik marker pada peta untuk melihat detail penerima bantuan. Anda dapat drag dan zoom peta untuk navigasi.
        </p>
      </motion.div>
    </DashboardLayout>
  );
}