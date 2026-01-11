import { motion } from 'framer-motion';
import { Users, Home, TrendingUp, Wallet } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { AidDistributionChart } from '@/components/charts/AidDistributionChart';
import { DistrictChart } from '@/components/charts/DistrictChart';
import { YearlyTrendChart } from '@/components/charts/YearlyTrendChart';
import { useStatistics } from '@/hooks/useStatistics';

export default function Statistics() {
  const { statistics, isLoading } = useStatistics();

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

  // Calculate year-over-year growth (if we have at least 2 years of data)
  const calculateGrowth = () => {
    if (!statistics?.trend_tahunan || statistics.trend_tahunan.length < 2) {
      return { value: 0, isPositive: true };
    }
    
    const sortedYears = [...statistics.trend_tahunan].sort((a, b) => a.tahun - b.tahun);
    const lastYear = sortedYears[sortedYears.length - 1];
    const previousYear = sortedYears[sortedYears.length - 2];
    
    const growth = ((lastYear.total - previousYear.total) / previousYear.total) * 100;
    
    return {
      value: Math.abs(growth),
      isPositive: growth >= 0
    };
  };

  const growthData = calculateGrowth();

  // Calculate total budget (estimasi based on average per penerima)
  const estimatedBudget = statistics ? statistics.total_penerima * 500000 : 0; // Rp 500k per penerima as estimate

  return (
    <DashboardLayout 
      title="Statistik" 
      subtitle="Data statistik bantuan sosial Kabupaten Bojonegoro"
      showSearch={false}
    >
      {/* Stats Summary */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Penerima Bantuan"
          value={isLoading ? '...' : (statistics?.total_penerima || 0).toLocaleString('id-ID')}
          subtitle="Kepala Keluarga"
          icon={Users}
          trend={{ value: growthData.value, isPositive: growthData.isPositive }}
          variant="primary"
          delay={0}
        />
        <StatCard
          title="Rumah Tangga Sangat Miskin"
          value={isLoading ? '...' : (statistics?.status_ekonomi.sangat_miskin.total || 0).toLocaleString('id-ID')}
          subtitle={isLoading ? 'Loading...' : `${statistics?.status_ekonomi.sangat_miskin.percentage || 0}% dari total`}
          icon={Home}
          delay={0.1}
        />
        <StatCard
          title="Total Anggota Keluarga"
          value={isLoading ? '...' : (statistics?.total_anggota_keluarga || 0).toLocaleString('id-ID')}
          subtitle="Jiwa terdaftar"
          icon={Wallet}
          variant="secondary"
          delay={0.2}
        />
        <StatCard
          title="Pertumbuhan Tahunan"
          value={isLoading ? '...' : `${growthData.isPositive ? '+' : '-'}${growthData.value.toFixed(1)}%`}
          subtitle="Dari tahun lalu"
          icon={TrendingUp}
          variant="accent"
          delay={0.3}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        <AidDistributionChart data={aidDistributionData} />
        <YearlyTrendChart data={yearlyTrendData} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DistrictChart data={districtChartData} />
        
        {/* Aid Type Details */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="stat-card"
        >
          <h3 className="mb-4 text-sm font-semibold text-foreground">
            Detail Jenis Bantuan
          </h3>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <p className="text-sm text-muted-foreground">Memuat data...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {aidDistributionData.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Tidak ada data jenis bantuan
                </p>
              ) : (
                aidDistributionData.map((item, index) => (
                  <motion.div
                    key={item.type}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="h-3 w-3 rounded-full flex-shrink-0" 
                        style={{ background: item.color }}
                      />
                      <div>
                        <p className="font-medium text-foreground">{item.type}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.type === 'PKH' && 'Program Keluarga Harapan'}
                          {item.type === 'BPNT' && 'Bantuan Pangan Non-Tunai'}
                          {item.type === 'BST' && 'Bantuan Sosial Tunai'}
                          {item.type === 'BLT' && 'Bantuan Langsung Tunai'}
                          {item.type === 'Raskin' && 'Beras untuk Keluarga Miskin'}
                          {/* Default for other types */}
                          {!['PKH', 'BPNT', 'BST', 'BLT', 'Raskin'].includes(item.type) && 'Bantuan Sosial'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="font-semibold text-foreground">
                        {item.count.toLocaleString('id-ID')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {statistics?.total_penerima ? 
                          ((item.count / statistics.total_penerima) * 100).toFixed(1) : 0
                        }%
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}