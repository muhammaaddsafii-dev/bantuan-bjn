import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

interface DistrictChartProps {
  data: {
    district: string;
    recipients: number;
  }[];
}

export function DistrictChart({ data }: DistrictChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="stat-card"
    >
      <h3 className="mb-4 text-sm font-semibold text-foreground">
        Penerima per Kecamatan
      </h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 10, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
            <YAxis 
              dataKey="district" 
              type="category" 
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              width={80}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: 'var(--shadow-card)',
              }}
              formatter={(value: number) => [`${value.toLocaleString('id-ID')} KK`, 'Penerima']}
            />
            <Bar 
              dataKey="recipients" 
              fill="hsl(var(--primary))"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
