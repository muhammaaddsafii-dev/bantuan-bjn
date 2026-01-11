import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Home, Wallet, TrendingUp, Map, ArrowRight } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { InteractiveMap } from '@/components/map/InteractiveMap';
import { AidDistributionChart } from '@/components/charts/AidDistributionChart';
import { DistrictChart } from '@/components/charts/DistrictChart';
import { YearlyTrendChart } from '@/components/charts/YearlyTrendChart';
import { statistics } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

// API Configuration
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Types
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

const getEconomicStatus = (income: string): string => {
  const incomeNum = parseFloat(income);
  if (incomeNum < 1000000) return 'Sangat Miskin';
  if (incomeNum < 2000000) return 'Miskin';
  return 'Rentan Miskin';
};

export default function Dashboard() {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const [penerimaBantuan, setPenerimaBantuan] = useState<PenerimaBantuan[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPenerimaBantuan();
  }, []);

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
      toast({
        title: 'Error',
        description: 'Gagal memuat data penerima bantuan',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate real statistics from API data
  const totalRecipients = penerimaBantuan.length;
  const recipientsWithCoordinates = penerimaBantuan.filter(p => p.latitude && p.longitude).length;
  const sangatMiskin = penerimaBantuan.filter(p => getEconomicStatus(p.pendapatan_per_bulan) === 'Sangat Miskin').length;
  const miskin = penerimaBantuan.filter(p => getEconomicStatus(p.pendapatan_per_bulan) === 'Miskin').length;
  const rentanMiskin = penerimaBantuan.filter(p => getEconomicStatus(p.pendapatan_per_bulan) === 'Rentan Miskin').length;

  // Get unique kecamatan count
  const uniqueKecamatan = new Set(penerimaBantuan.map(p => p.kecamatan)).size;

  return (
    <DashboardLayout 
      title="Dashboard" 
      subtitle="Monitoring Bantuan Sosial Kabupaten Bojonegoro"
    >
      {/* Stats Grid */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Penerima Bantuan"
          value={totalRecipients.toLocaleString('id-ID')}
          subtitle="Kepala Keluarga"
          icon={Users}
          trend={{ value: 7.8, isPositive: true }}
          variant="primary"
          delay={0}
        />
        <StatCard
          title="Rumah Tangga Sangat Miskin"
          value={sangatMiskin.toLocaleString('id-ID')}
          subtitle={`${miskin} Miskin, ${rentanMiskin} Rentan`}
          icon={Home}
          trend={{ value: 3.2, isPositive: false }}
          delay={0.1}
        />
        <StatCard
          title="Anggaran Tersalurkan"
          value={`Rp ${(statistics.totalBudgetAllocated / 1000000000).toFixed(1)}M`}
          subtitle="Tahun 2024"
          icon={Wallet}
          variant="secondary"
          delay={0.2}
        />
        <StatCard
          title="Kecamatan Tercakup"
          value={uniqueKecamatan.toString()}
          subtitle={`${recipientsWithCoordinates} terdata lokasi`}
          icon={TrendingUp}
          delay={0.3}
        />
      </div>

      {/* Map and Charts Row */}
      <div className="mb-6 grid gap-6 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="stat-card lg:col-span-2 p-0 overflow-hidden"
        >
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div>
              <h3 className="text-sm font-semibold text-foreground">
                Peta Sebaran Penerima Bantuan
              </h3>
              <p className="text-xs text-muted-foreground">
                Menampilkan {recipientsWithCoordinates} dari {totalRecipients} data
              </p>
            </div>
            <Link to="/map">
              <Button variant="ghost" size="sm" className="gap-2">
                <Map className="h-4 w-4" />
                Lihat Peta Lengkap
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
          <div className="h-80">
            {isLoading ? (
              <div className="flex h-full items-center justify-center">
                <p className="text-sm text-muted-foreground">Memuat peta...</p>
              </div>
            ) : (
              <InteractiveMap 
                penerimaBantuan={penerimaBantuan}
                center={[-7.15, 111.88]}
                zoom={11}
              />
            )}
          </div>
        </motion.div>

        <AidDistributionChart data={statistics.aidTypeDistribution} />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <DistrictChart data={statistics.districtDistribution} />
        <YearlyTrendChart data={statistics.yearlyTrend} />
      </div>
    </DashboardLayout>
  );
}