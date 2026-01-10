import { motion } from 'framer-motion';
import { Building2, Map, Home } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md text-center"
      >
        <div className="mb-8 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-muted">
            <Building2 className="h-10 w-10 text-muted-foreground" />
          </div>
        </div>
        
        <h1 className="mb-4 text-6xl font-bold text-foreground">404</h1>
        <h2 className="mb-2 text-xl font-semibold text-foreground">Halaman Tidak Ditemukan</h2>
        <p className="mb-8 text-muted-foreground">
          Maaf, halaman yang Anda cari tidak tersedia atau telah dipindahkan.
        </p>
        
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link to="/public">
            <Button variant="default" className="w-full gap-2 sm:w-auto">
              <Home className="h-4 w-4" />
              Beranda
            </Button>
          </Link>
          <Link to="/map">
            <Button variant="outline" className="w-full gap-2 sm:w-auto">
              <Map className="h-4 w-4" />
              Lihat Peta
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
