import { useState, useEffect } from 'react';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Types
export interface StatusEkonomi {
  total: number;
  percentage: number;
}

export interface DistribusiKecamatan {
  nama: string;
  total: number;
  sangat_miskin: number;
  miskin: number;
  rentan_miskin: number;
}

export interface DistribusiJenisBantuan {
  nama: string;
  total: number;
  percentage: number;
}

export interface DistribusiDesa {
  nama_desa: string;
  kecamatan: string;
  total: number;
}

export interface TrendBulanan {
  bulan: string;
  total: number;
  sangat_miskin: number;
  miskin: number;
  rentan_miskin: number;
}

export interface TrendTahunan {
  tahun: number;
  total: number;
  total_anggota: number;
  rata_rata_pendapatan: number;
}

export interface Statistics {
  // Overview
  total_penerima: number;
  total_anggota_keluarga: number;
  rata_rata_pendapatan: number;
  total_pendapatan: number;
  
  // Economic status
  status_ekonomi: {
    sangat_miskin: StatusEkonomi;
    miskin: StatusEkonomi;
    rentan_miskin: StatusEkonomi;
  };
  
  // Location
  lokasi: {
    total_dengan_koordinat: number;
    total_kecamatan: number;
    total_desa: number;
  };
  
  // Distributions
  distribusi_kecamatan: DistribusiKecamatan[];
  distribusi_jenis_bantuan: DistribusiJenisBantuan[];
  distribusi_desa_teratas: DistribusiDesa[];
  
  // Trends
  trend_bulanan: TrendBulanan[];
  trend_tahunan: TrendTahunan[];
}

export function useStatistics() {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatistics = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/penerima-bantuan/statistics/`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch statistics');
      }
      
      const data = await response.json();
      setStatistics(data);
      console.log('✅ Statistics loaded:', data);
    } catch (err) {
      console.error('Error fetching statistics:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  return {
    statistics,
    isLoading,
    error,
    refetch: fetchStatistics
  };
}