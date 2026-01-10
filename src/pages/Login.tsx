import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast({
          title: 'Login Berhasil',
          description: 'Selamat datang di Dashboard Bansos Bojonegoro',
        });
        navigate('/dashboard');
      } else {
        toast({
          title: 'Login Gagal',
          description: 'Email atau password salah. Coba lagi.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 gradient-hero items-center justify-center p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md text-center"
        >
          <div className="mb-8 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-sidebar-primary shadow-lg">
              <Building2 className="h-10 w-10 text-sidebar-primary-foreground" />
            </div>
          </div>
          <h1 className="mb-4 text-3xl font-bold text-primary-foreground">
            Sistem Informasi Bantuan Sosial
          </h1>
          <p className="text-lg text-primary-foreground/80">
            Kabupaten Bojonegoro
          </p>
          <div className="mt-8 rounded-xl bg-white/10 p-6 backdrop-blur">
            <p className="text-sm text-primary-foreground/90">
              Platform monitoring dan pengelolaan data penerima bantuan sosial 
              untuk mendukung pengentasan kemiskinan di Kabupaten Bojonegoro.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex w-full items-center justify-center bg-background p-8 lg:w-1/2">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile branding */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">Bansos Bojonegoro</h1>
              <p className="text-sm text-muted-foreground">Dashboard Admin</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground">Masuk ke Dashboard</h2>
            <p className="mt-2 text-muted-foreground">
              Masukkan kredensial Anda untuk mengakses sistem
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@bojonegoro.go.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  Memproses...
                </span>
              ) : (
                'Masuk'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/public" className="text-sm text-primary hover:underline">
              Lihat Dashboard Publik →
            </Link>
          </div>

          {/* Demo credentials hint */}
          <div className="mt-8 rounded-lg bg-muted p-4">
            <p className="text-xs font-medium text-muted-foreground">Demo Credentials:</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Email: admin@bojonegoro.go.id<br />
              Password: admin123
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
