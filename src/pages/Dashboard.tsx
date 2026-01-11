import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Home, Wallet, TrendingUp, Map, ArrowRight } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { InteractiveMap } from '@/components/map/InteractiveMap';
import { AidDistributionChart } from '@/components/charts/AidDistributionChart';
import { DistrictChart } from '@/components/charts/DistrictChart';
import { YearlyTrendChart } from '@/components/charts/YearlyTrendChart';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useStatistics } from '@/hooks/useStatistics';

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

export default function Dashboard() {
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  const { statistics, isLoading: statsLoading } = useStatistics();
  
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
      console.log(`✅ Dashboard: Loaded ${allPenerima.length} penerima bantuan`);
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

  // Prepare chart data from API statistics with correct structure
  const aidDistributionData = statistics?.distribusi_jenis_bantuan.map((item, index) => {
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    return {
      type: item.nama,
      count: item.total,
      color: colors[index % colors.length]
    };
  }) || [];

  const districtChartData = statistics?.distribusi_kecamatan.map(item => ({
    district: item.nama,
    recipients: item.total
  })) || [];

  const yearlyTrendData = statistics?.trend_tahunan.map(item => ({
    year: item.tahun,
    recipients: item.total
  })) || [];

  return (
    <DashboardLayout 
      title="Dashboard" 
      subtitle="Monitoring Bantuan Sosial Kabupaten Bojonegoro"
    >
      {/* Stats Grid */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Penerima Bantuan"
          value={statsLoading ? '...' : (statistics?.total_penerima || 0).toLocaleString('id-ID')}
          subtitle="Kepala Keluarga"
          icon={Users}
          trend={{ value: 7.8, isPositive: true }}
          variant="primary"
          delay={0}
        />
        <StatCard
          title="Rumah Tangga Sangat Miskin"
          value={statsLoading ? '...' : (statistics?.status_ekonomi.sangat_miskin.total || 0).toLocaleString('id-ID')}
          subtitle={statsLoading ? 'Loading...' : `${statistics?.status_ekonomi.sangat_miskin.percentage || 0}% dari total`}
          icon={Home}
          delay={0.1}
        />
        <StatCard
          title="Total Anggota Keluarga"
          value={statsLoading ? '...' : (statistics?.total_anggota_keluarga || 0).toLocaleString('id-ID')}
          subtitle="Jiwa terdaftar"
          icon={Wallet}
          variant="secondary"
          delay={0.2}
        />
        <StatCard
          title="Kecamatan Tercakup"
          value={statsLoading ? '...' : (statistics?.lokasi.total_kecamatan || 0).toString()}
          subtitle={statsLoading ? 'Loading...' : `${statistics?.lokasi.total_desa || 0} desa`}
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
                {statsLoading ? 'Loading...' : `Menampilkan ${statistics?.lokasi.total_dengan_koordinat || 0} dari ${statistics?.total_penerima || 0} data`}
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

        <AidDistributionChart data={aidDistributionData} />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <DistrictChart data={districtChartData} />
        <YearlyTrendChart data={yearlyTrendData} />
      </div>
    </DashboardLayout>
  );
}