import { motion } from 'framer-motion';
import { Users, Home, Wallet, TrendingUp, Map, ArrowRight } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { InteractiveMap } from '@/components/map/InteractiveMap';
import { AidDistributionChart } from '@/components/charts/AidDistributionChart';
import { DistrictChart } from '@/components/charts/DistrictChart';
import { YearlyTrendChart } from '@/components/charts/YearlyTrendChart';
import { households, statistics } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function Dashboard() {
  const { isAdmin } = useAuth();

  return (
    <DashboardLayout 
      title="Dashboard" 
      subtitle="Monitoring Bantuan Sosial Kabupaten Bojonegoro"
    >
      {/* Stats Grid */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Penerima Bantuan"
          value={statistics.totalRecipients.toLocaleString('id-ID')}
          subtitle="Kepala Keluarga"
          icon={Users}
          trend={{ value: 7.8, isPositive: true }}
          variant="primary"
          delay={0}
        />
        <StatCard
          title="Rumah Tangga Miskin"
          value={statistics.totalPoorHouseholds.toLocaleString('id-ID')}
          subtitle="Data terdaftar"
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
          value="28"
          subtitle="dari 28 kecamatan"
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
            <h3 className="text-sm font-semibold text-foreground">
              Peta Sebaran Penerima Bantuan
            </h3>
            <Link to="/map">
              <Button variant="ghost" size="sm" className="gap-2">
                <Map className="h-4 w-4" />
                Lihat Peta Lengkap
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
          <div className="h-80">
            <InteractiveMap households={households} />
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
