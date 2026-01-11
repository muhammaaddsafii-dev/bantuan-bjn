import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Building2, Map, BarChart3, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { InteractiveMap } from '@/components/map/InteractiveMap';
import { StatCard } from '@/components/dashboard/StatCard';
import { AidDistributionChart } from '@/components/charts/AidDistributionChart';
import { YearlyTrendChart } from '@/components/charts/YearlyTrendChart';
import { statistics } from '@/data/mockData';
import { Button } from '@/components/ui/button';

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

export default function PublicDashboard() {
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
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate statistics from API data
  const totalRecipients = penerimaBantuan.length;
  const recipientsWithCoordinates = penerimaBantuan.filter(p => p.latitude && p.longitude).length;
  const sangatMiskin = penerimaBantuan.filter(p => getEconomicStatus(p.pendapatan_per_bulan) === 'Sangat Miskin').length;
  const uniqueKecamatan = new Set(penerimaBantuan.map(p => p.kecamatan)).size;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Building2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-foreground">Bansos Bojonegoro</h1>
              <p className="text-xs text-muted-foreground">Dashboard Publik</p>
            </div>
          </div>
          
          <Link to="/login">
            <Button variant="outline" size="sm">
              Login Admin
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="gradient-hero py-16 text-primary-foreground">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-2xl"
          >
            <h1 className="mb-4 text-3xl font-bold md:text-4xl">
              Sistem Informasi Bantuan Sosial
            </h1>
            <p className="mb-6 text-lg text-primary-foreground/80">
              Kabupaten Bojonegoro - Transparansi data penerima bantuan sosial 
              untuk mendukung pengentasan kemiskinan.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/map">
                <Button size="lg" variant="secondary" className="gap-2">
                  <Map className="h-4 w-4" />
                  Lihat Peta
                </Button>
              </Link>
              <Link to="/statistics">
                <Button size="lg" variant="outline" className="gap-2 border-primary-foreground/30 text-black hover:bg-primary-foreground/10">
                  <BarChart3 className="h-4 w-4" />
                  Statistik
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="container mx-auto -mt-8 px-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Penerima Bantuan"
            value={isLoading ? '...' : totalRecipients.toLocaleString('id-ID')}
            subtitle="Kepala Keluarga"
            icon={Users}
            variant="primary"
            delay={0}
          />
          <StatCard
            title="Rumah Tangga Sangat Miskin"
            value={isLoading ? '...' : sangatMiskin.toLocaleString('id-ID')}
            subtitle="Data terdaftar"
            icon={Building2}
            delay={0.1}
          />
          <StatCard
            title="Anggaran Tersalurkan"
            value={`Rp ${(statistics.totalBudgetAllocated / 1000000000).toFixed(1)}M`}
            subtitle="Tahun 2024"
            icon={BarChart3}
            variant="secondary"
            delay={0.2}
          />
          <StatCard
            title="Kecamatan Tercakup"
            value={isLoading ? '...' : uniqueKecamatan.toString()}
            subtitle="dari 28 kecamatan"
            icon={Map}
            delay={0.3}
          />
        </div>
      </section>

      {/* Map Section */}
      <section className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="stat-card overflow-hidden p-0"
        >
          <div className="flex items-center justify-between border-b border-border p-4">
            <div>
              <h2 className="font-semibold text-foreground">Peta Sebaran Penerima Bantuan</h2>
              <p className="text-sm text-muted-foreground">
                Klik marker untuk melihat detail ({recipientsWithCoordinates} lokasi terdata)
              </p>
            </div>
            <Link to="/map">
              <Button variant="ghost" size="sm" className="gap-2">
                Peta Lengkap
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
          <div className="h-96">
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
      </section>

      {/* Charts Section */}
      <section className="container mx-auto px-4 pb-12">
        <div className="grid gap-6 lg:grid-cols-2">
          <AidDistributionChart data={statistics.aidTypeDistribution} />
          <YearlyTrendChart data={statistics.yearlyTrend} />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/50 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Building2 className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">Pemerintah Kabupaten Bojonegoro</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Dinas Sosial - Sistem Informasi Bantuan Sosial © 2024
          </p>
        </div>
      </footer>
    </div>
  );
}