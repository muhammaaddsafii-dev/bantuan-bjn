import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

interface YearlyTrendChartProps {
  data: {
    year: number;
    recipients: number;
  }[];
}

export function YearlyTrendChart({ data }: YearlyTrendChartProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="stat-card"
    >
      <h3 className="mb-4 text-sm font-semibold text-foreground">
        Tren Penerima Bantuan (5 Tahun Terakhir)
      </h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRecipients" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(175, 50%, 45%)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(175, 50%, 45%)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="year" 
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                boxShadow: 'var(--shadow-card)',
              }}
              formatter={(value: number) => [`${value.toLocaleString('id-ID')} KK`, 'Penerima']}
            />
            <Area
              type="monotone"
              dataKey="recipients"
              stroke="hsl(175, 50%, 45%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRecipients)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
