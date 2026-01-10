import { motion } from 'framer-motion';
import { Users, Home, TrendingUp, Wallet } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { AidDistributionChart } from '@/components/charts/AidDistributionChart';
import { DistrictChart } from '@/components/charts/DistrictChart';
import { YearlyTrendChart } from '@/components/charts/YearlyTrendChart';
import { statistics } from '@/data/mockData';

export default function Statistics() {
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
          title="Pertumbuhan Tahunan"
          value="+7.8%"
          subtitle="Dari tahun lalu"
          icon={TrendingUp}
          variant="accent"
          delay={0.3}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2 mb-6">
        <AidDistributionChart data={statistics.aidTypeDistribution} />
        <YearlyTrendChart data={statistics.yearlyTrend} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DistrictChart data={statistics.districtDistribution} />
        
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
          <div className="space-y-3">
            {statistics.aidTypeDistribution.map((item, index) => (
              <motion.div
                key={item.type}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
                className="flex items-center justify-between rounded-lg bg-muted/50 p-3"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="h-3 w-3 rounded-full" 
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
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-foreground">
                    {item.count.toLocaleString('id-ID')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {((item.count / statistics.totalRecipients) * 100).toFixed(1)}%
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
