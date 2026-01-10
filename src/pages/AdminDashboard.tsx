import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, Eye, Upload, X, ImagePlus } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

// API Configuration
const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Types
interface Kecamatan {
  id: number;
  nama: string;
  created_at: string;
  updated_at: string;
}

interface JenisBantuan {
  id: number;
  nama: string;
  created_at: string;
  updated_at: string;
}

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

interface FormData {
  nama_kepala_keluarga: string;
  jumlah_anggota_keluarga: number;
  kecamatan: number;
  nama_desa: string;
  alamat: string;
  jenis_bantuan: number;
  pendapatan_per_bulan: number;
  latitude: number | null;
  longitude: number | null;
}

const statusColors: Record<string, string> = {
  'Sangat Miskin': 'bg-destructive text-destructive-foreground',
  'Miskin': 'bg-secondary text-secondary-foreground',
  'Rentan Miskin': 'bg-accent text-accent-foreground',
};

// Helper function to determine status based on income
const getEconomicStatus = (income: string): string => {
  const incomeNum = parseFloat(income);
  if (incomeNum < 1000000) return 'Sangat Miskin';
  if (incomeNum < 2000000) return 'Miskin';
  return 'Rentan Miskin';
};

export default function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPenerima, setSelectedPenerima] = useState<PenerimaBantuan | null>(null);
  const [penerimaToDelete, setPenerimaToDelete] = useState<PenerimaBantuan | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Data states
  const [penerimaBantuan, setPenerimaBantuan] = useState<PenerimaBantuan[]>([]);
  const [kecamatanList, setKecamatanList] = useState<Kecamatan[]>([]);
  const [jenisBantuanList, setJenisBantuanList] = useState<JenisBantuan[]>([]);
  
  // Form states
  const [formData, setFormData] = useState<FormData>({
    nama_kepala_keluarga: '',
    jumlah_anggota_keluarga: 0,
    kecamatan: 0,
    nama_desa: '',
    alamat: '',
    jenis_bantuan: 0,
    pendapatan_per_bulan: 0,
    latitude: null,
    longitude: null,
  });

  // File upload states
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);

  const { toast } = useToast();

  // Fetch data on component mount
  useEffect(() => {
    fetchAllData();
  }, []);

  // Fetch all required data
  const fetchAllData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchPenerimaBantuan(),
        fetchKecamatan(),
        fetchJenisBantuan(),
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: 'Error',
        description: 'Gagal memuat data. Silakan refresh halaman.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch Penerima Bantuan
  const fetchPenerimaBantuan = async (search?: string) => {
    try {
      const url = search 
        ? `${API_BASE_URL}/penerima-bantuan/?search=${encodeURIComponent(search)}`
        : `${API_BASE_URL}/penerima-bantuan/`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch');
      
      const data = await response.json();
      setPenerimaBantuan(data.results || data);
    } catch (error) {
      console.error('Error fetching penerima bantuan:', error);
      toast({
        title: 'Error',
        description: 'Gagal memuat data penerima bantuan',
        variant: 'destructive',
      });
    }
  };

  // Fetch Kecamatan
  const fetchKecamatan = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/kecamatan/`);
      if (!response.ok) throw new Error('Failed to fetch');
      
      const data = await response.json();
      setKecamatanList(data.results || data);
    } catch (error) {
      console.error('Error fetching kecamatan:', error);
    }
  };

  // Fetch Jenis Bantuan
  const fetchJenisBantuan = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/jenis-bantuan/`);
      if (!response.ok) throw new Error('Failed to fetch');
      
      const data = await response.json();
      setJenisBantuanList(data.results || data);
    } catch (error) {
      console.error('Error fetching jenis bantuan:', error);
    }
  };

  // Handle search with debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        fetchPenerimaBantuan(searchQuery);
      } else {
        fetchPenerimaBantuan();
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Handle form input change
  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      nama_kepala_keluarga: '',
      jumlah_anggota_keluarga: 0,
      kecamatan: 0,
      nama_desa: '',
      alamat: '',
      jenis_bantuan: 0,
      pendapatan_per_bulan: 0,
      latitude: null,
      longitude: null,
    });
    setSelectedFiles([]);
    setSelectedPenerima(null);
  };

  // Open dialog for create
  const handleCreate = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  // Open dialog for edit
  const handleEdit = (penerima: PenerimaBantuan) => {
    setSelectedPenerima(penerima);
    setFormData({
      nama_kepala_keluarga: penerima.nama_kepala_keluarga,
      jumlah_anggota_keluarga: penerima.jumlah_anggota_keluarga,
      kecamatan: penerima.kecamatan,
      nama_desa: penerima.nama_desa,
      alamat: penerima.alamat,
      jenis_bantuan: penerima.jenis_bantuan,
      pendapatan_per_bulan: parseFloat(penerima.pendapatan_per_bulan),
      latitude: penerima.latitude ? parseFloat(penerima.latitude) : null,
      longitude: penerima.longitude ? parseFloat(penerima.longitude) : null,
    });
    setIsDialogOpen(true);
  };

  // Handle view detail
  const handleView = (penerima: PenerimaBantuan) => {
    setSelectedPenerima(penerima);
    setIsViewDialogOpen(true);
  };

  // Handle form submit (Create or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const url = selectedPenerima
        ? `${API_BASE_URL}/penerima-bantuan/${selectedPenerima.id}/`
        : `${API_BASE_URL}/penerima-bantuan/`;

      const method = selectedPenerima ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(JSON.stringify(errorData));
      }

      const savedData = await response.json();

      // Upload photos if any
      if (selectedFiles.length > 0) {
        await uploadPhotos(savedData.id);
      }

      toast({
        title: 'Berhasil',
        description: selectedPenerima 
          ? 'Data penerima bantuan berhasil diperbarui'
          : 'Data penerima bantuan berhasil ditambahkan',
      });

      setIsDialogOpen(false);
      resetForm();
      fetchPenerimaBantuan();
    } catch (error) {
      console.error('Error saving data:', error);
      toast({
        title: 'Error',
        description: 'Gagal menyimpan data. Periksa kembali inputan Anda.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Upload photos
  const uploadPhotos = async (penerimaId: number) => {
    setUploadingPhotos(true);
    try {
      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('penerima_bantuan', penerimaId.toString());

        const response = await fetch(`${API_BASE_URL}/photos/upload/`, {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to upload photo');
        }
      }

      toast({
        title: 'Berhasil',
        description: `${selectedFiles.length} foto berhasil diupload`,
      });
    } catch (error) {
      console.error('Error uploading photos:', error);
      toast({
        title: 'Warning',
        description: 'Beberapa foto gagal diupload',
        variant: 'destructive',
      });
    } finally {
      setUploadingPhotos(false);
    }
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(prev => [...prev, ...filesArray].slice(0, 10)); // Max 10 photos
    }
  };

  // Remove selected file
  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Handle delete
  const confirmDelete = (penerima: PenerimaBantuan) => {
    setPenerimaToDelete(penerima);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!penerimaToDelete) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/penerima-bantuan/${penerimaToDelete.id}/`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) throw new Error('Failed to delete');

      toast({
        title: 'Berhasil',
        description: 'Data penerima bantuan berhasil dihapus',
      });

      fetchPenerimaBantuan();
    } catch (error) {
      console.error('Error deleting data:', error);
      toast({
        title: 'Error',
        description: 'Gagal menghapus data',
        variant: 'destructive',
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setPenerimaToDelete(null);
    }
  };

  // Delete photo
  const handleDeletePhoto = async (photoId: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/photos/${photoId}/`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete photo');

      toast({
        title: 'Berhasil',
        description: 'Foto berhasil dihapus',
      });

      // Refresh data
      if (selectedPenerima) {
        const updatedResponse = await fetch(
          `${API_BASE_URL}/penerima-bantuan/${selectedPenerima.id}/`
        );
        const updatedData = await updatedResponse.json();
        setSelectedPenerima(updatedData);
      }
      fetchPenerimaBantuan();
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast({
        title: 'Error',
        description: 'Gagal menghapus foto',
        variant: 'destructive',
      });
    }
  };

  const filteredPenerima = penerimaBantuan;

  return (
    <DashboardLayout 
      title="Kelola Data Penerima" 
      subtitle="Input dan kelola data penerima bantuan sosial"
    >
      {/* Actions Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari nama, desa, atau kecamatan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Button className="gap-2" onClick={handleCreate}>
          <Plus className="h-4 w-4" />
          Tambah Data
        </Button>
      </motion.div>

      {/* Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={(open) => {
        setIsDialogOpen(open);
        if (!open) resetForm();
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedPenerima ? 'Edit Data Penerima' : 'Tambah Data Penerima Baru'}
            </DialogTitle>
          </DialogHeader>
          
          <form className="space-y-4 mt-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="headName">Nama Kepala Keluarga *</Label>
                <Input
                  id="headName"
                  placeholder="Masukkan nama lengkap"
                  value={formData.nama_kepala_keluarga}
                  onChange={(e) => handleInputChange('nama_kepala_keluarga', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="familyMembers">Jumlah Anggota Keluarga *</Label>
                <Input
                  id="familyMembers"
                  type="number"
                  placeholder="5"
                  min="1"
                  value={formData.jumlah_anggota_keluarga || ''}
                  onChange={(e) => handleInputChange('jumlah_anggota_keluarga', parseInt(e.target.value))}
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="district">Kecamatan *</Label>
                <Select
                  value={formData.kecamatan.toString()}
                  onValueChange={(value) => handleInputChange('kecamatan', parseInt(value))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kecamatan" />
                  </SelectTrigger>
                  <SelectContent>
                    {kecamatanList.map((k) => (
                      <SelectItem key={k.id} value={k.id.toString()}>
                        {k.nama}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="village">Desa/Kelurahan *</Label>
                <Input
                  id="village"
                  placeholder="Nama desa"
                  value={formData.nama_desa}
                  onChange={(e) => handleInputChange('nama_desa', e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Alamat Lengkap *</Label>
              <Input
                id="address"
                placeholder="Jl. Contoh No. 123, RT/RW"
                value={formData.alamat}
                onChange={(e) => handleInputChange('alamat', e.target.value)}
                required
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="aidType">Jenis Bantuan *</Label>
                <Select
                  value={formData.jenis_bantuan.toString()}
                  onValueChange={(value) => handleInputChange('jenis_bantuan', parseInt(value))}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih jenis bantuan" />
                  </SelectTrigger>
                  <SelectContent>
                    {jenisBantuanList.map((j) => (
                      <SelectItem key={j.id} value={j.id.toString()}>
                        {j.nama}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="income">Pendapatan/Bulan (Rp) *</Label>
                <Input
                  id="income"
                  type="number"
                  placeholder="1000000"
                  min="0"
                  value={formData.pendapatan_per_bulan || ''}
                  onChange={(e) => handleInputChange('pendapatan_per_bulan', parseFloat(e.target.value))}
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="lat">Koordinat Latitude</Label>
                <Input
                  id="lat"
                  type="number"
                  step="any"
                  placeholder="-7.1500"
                  value={formData.latitude || ''}
                  onChange={(e) => handleInputChange('latitude', e.target.value ? parseFloat(e.target.value) : null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lng">Koordinat Longitude</Label>
                <Input
                  id="lng"
                  type="number"
                  step="any"
                  placeholder="111.8800"
                  value={formData.longitude || ''}
                  onChange={(e) => handleInputChange('longitude', e.target.value ? parseFloat(e.target.value) : null)}
                />
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Foto Rumah/Keluarga (Opsional, Maks. 10 foto)</Label>
              
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => document.getElementById('photo-upload')?.click()}
                >
                  <ImagePlus className="h-4 w-4 mr-2" />
                  Pilih Foto ({selectedFiles.length}/10)
                </Button>
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              {/* Preview selected files */}
              {selectedFiles.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                      >
                        <X className="h-3 w-3" />
                      </button>
                      <p className="text-xs text-muted-foreground mt-1 truncate">
                        {file.name}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Show existing photos when editing */}
              {selectedPenerima && selectedPenerima.photos.length > 0 && (
                <div className="mt-4">
                  <Label className="text-sm text-muted-foreground">Foto yang sudah ada:</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {selectedPenerima.photos.map((photo) => (
                      <div key={photo.id} className="relative group">
                        <img
                          src={photo.file_path}
                          alt="Foto"
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeletePhoto(photo.id)}
                          className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  resetForm();
                }}
                disabled={isSubmitting}
              >
                Batal
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="mr-2">Menyimpan...</span>
                    {uploadingPhotos && <span>(Upload foto...)</span>}
                  </>
                ) : (
                  'Simpan Data'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Detail Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detail Penerima Bantuan</DialogTitle>
          </DialogHeader>

          {selectedPenerima && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Nama Kepala Keluarga</Label>
                  <p className="font-medium">{selectedPenerima.nama_kepala_keluarga}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Jumlah Anggota Keluarga</Label>
                  <p className="font-medium">{selectedPenerima.jumlah_anggota_keluarga} orang</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Kecamatan</Label>
                  <p className="font-medium">{selectedPenerima.kecamatan_nama}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Desa</Label>
                  <p className="font-medium">{selectedPenerima.nama_desa}</p>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">Alamat Lengkap</Label>
                <p className="font-medium">{selectedPenerima.alamat}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground">Jenis Bantuan</Label>
                  <p className="font-medium">
                    <Badge variant="outline">{selectedPenerima.jenis_bantuan_nama}</Badge>
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Pendapatan/Bulan</Label>
                  <p className="font-medium">
                    Rp {parseFloat(selectedPenerima.pendapatan_per_bulan).toLocaleString('id-ID')}
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">Status Ekonomi</Label>
                <p className="font-medium">
                  <Badge className={cn('text-xs', statusColors[getEconomicStatus(selectedPenerima.pendapatan_per_bulan)])}>
                    {getEconomicStatus(selectedPenerima.pendapatan_per_bulan)}
                  </Badge>
                </p>
              </div>

              {(selectedPenerima.latitude && selectedPenerima.longitude) && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Latitude</Label>
                    <p className="font-medium">{selectedPenerima.latitude}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Longitude</Label>
                    <p className="font-medium">{selectedPenerima.longitude}</p>
                  </div>
                </div>
              )}

              {selectedPenerima.photos.length > 0 && (
                <div>
                  <Label className="text-muted-foreground">Foto-foto</Label>
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {selectedPenerima.photos.map((photo) => (
                      <img
                        key={photo.id}
                        src={photo.file_path}
                        alt="Foto"
                        className="w-full h-32 object-cover rounded-lg border cursor-pointer hover:opacity-80 transition"
                        onClick={() => window.open(photo.file_path, '_blank')}
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div>
                  <Label className="text-muted-foreground">Dibuat pada</Label>
                  <p>{new Date(selectedPenerima.created_at).toLocaleString('id-ID')}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Terakhir diupdate</Label>
                  <p>{new Date(selectedPenerima.updated_at).toLocaleString('id-ID')}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Data penerima bantuan <strong>{penerimaToDelete?.nama_kepala_keluarga}</strong> akan dihapus permanen. 
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Data Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="stat-card overflow-hidden p-0"
      >
        {isLoading ? (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">Memuat data...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama KK</TableHead>
                    <TableHead>Lokasi</TableHead>
                    <TableHead>Jenis Bantuan</TableHead>
                    <TableHead>Pendapatan</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPenerima.map((penerima) => (
                    <TableRow key={penerima.id}>
                      <TableCell className="font-medium">
                        <div>
                          <p>{penerima.nama_kepala_keluarga}</p>
                          <p className="text-xs text-muted-foreground">
                            {penerima.jumlah_anggota_keluarga} anggota keluarga
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{penerima.nama_desa}</p>
                          <p className="text-xs text-muted-foreground">{penerima.kecamatan_nama}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{penerima.jenis_bantuan_nama}</Badge>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm">
                          Rp {parseFloat(penerima.pendapatan_per_bulan).toLocaleString('id-ID')}
                        </p>
                      </TableCell>
                      <TableCell>
                        <Badge className={cn('text-xs', statusColors[getEconomicStatus(penerima.pendapatan_per_bulan)])}>
                          {getEconomicStatus(penerima.pendapatan_per_bulan)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleView(penerima)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleEdit(penerima)}
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => confirmDelete(penerima)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredPenerima.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">Tidak ada data yang ditemukan.</p>
              </div>
            )}
          </>
        )}
      </motion.div>
    </DashboardLayout>
  );
}