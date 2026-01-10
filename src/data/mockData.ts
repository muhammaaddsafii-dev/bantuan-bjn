// Mock data for Bojonegoro Social Aid Dashboard

export interface Household {
  id: string;
  headName: string;
  address: {
    village: string;
    district: string;
    fullAddress: string;
  };
  coordinates: [number, number]; // [lat, lng]
  aidType: 'PKH' | 'BPNT' | 'BST' | 'BLT' | 'Raskin';
  economicStatus: 'Sangat Miskin' | 'Miskin' | 'Rentan Miskin';
  yearOfAid: number;
  images: string[];
  familyMembers: number;
  monthlyIncome: number;
}

export interface District {
  name: string;
  totalRecipients: number;
  villages: string[];
}

// Bojonegoro districts (kecamatan)
export const districts: District[] = [
  { name: 'Bojonegoro', totalRecipients: 1250, villages: ['Kadipaten', 'Klangon', 'Kauman'] },
  { name: 'Kepohbaru', totalRecipients: 890, villages: ['Kepohbaru', 'Sidomulyo', 'Sugihwaras'] },
  { name: 'Baureno', totalRecipients: 720, villages: ['Baureno', 'Trojalu', 'Padang'] },
  { name: 'Kanor', totalRecipients: 650, villages: ['Kanor', 'Tambakrejo', 'Sumberwangi'] },
  { name: 'Sumberejo', totalRecipients: 580, villages: ['Sumberejo', 'Kedungrejo', 'Sumuragung'] },
  { name: 'Kapas', totalRecipients: 510, villages: ['Kapas', 'Semanding', 'Mojosari'] },
  { name: 'Dander', totalRecipients: 480, villages: ['Dander', 'Ngumpakdalem', 'Sumberarum'] },
  { name: 'Trucuk', totalRecipients: 420, villages: ['Trucuk', 'Soko', 'Sedeng'] },
];

// Sample household data around Bojonegoro
export const households: Household[] = [
  {
    id: '1',
    headName: 'Budi Santoso',
    address: { village: 'Kadipaten', district: 'Bojonegoro', fullAddress: 'Jl. Mawar No. 12, RT 02/RW 05' },
    coordinates: [-7.1502, 111.8818],
    aidType: 'PKH',
    economicStatus: 'Sangat Miskin',
    yearOfAid: 2024,
    images: [
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=400',
      'https://images.unsplash.com/photo-1449844908441-8829872d2607?w=400',
      'https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?w=400',
    ],
    familyMembers: 5,
    monthlyIncome: 800000,
  },
  {
    id: '2',
    headName: 'Siti Aminah',
    address: { village: 'Klangon', district: 'Bojonegoro', fullAddress: 'Jl. Melati No. 8, RT 01/RW 03' },
    coordinates: [-7.1485, 111.8765],
    aidType: 'BPNT',
    economicStatus: 'Miskin',
    yearOfAid: 2024,
    images: [
      'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400',
    ],
    familyMembers: 4,
    monthlyIncome: 1200000,
  },
  {
    id: '3',
    headName: 'Ahmad Wijaya',
    address: { village: 'Kepohbaru', district: 'Kepohbaru', fullAddress: 'Dusun Krajan RT 03/RW 02' },
    coordinates: [-7.1320, 111.9150],
    aidType: 'BST',
    economicStatus: 'Rentan Miskin',
    yearOfAid: 2023,
    images: [
      'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=400',
      'https://images.unsplash.com/photo-1430285561322-7808604715df?w=400',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400',
    ],
    familyMembers: 6,
    monthlyIncome: 1500000,
  },
  {
    id: '4',
    headName: 'Sumarni',
    address: { village: 'Baureno', district: 'Baureno', fullAddress: 'Jl. Raya Baureno No. 45' },
    coordinates: [-7.1650, 111.9420],
    aidType: 'BLT',
    economicStatus: 'Sangat Miskin',
    yearOfAid: 2024,
    images: [
      'https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=400',
      'https://images.unsplash.com/photo-1494526585095-c41746248156?w=400',
    ],
    familyMembers: 3,
    monthlyIncome: 600000,
  },
  {
    id: '5',
    headName: 'Parno Sugianto',
    address: { village: 'Kanor', district: 'Kanor', fullAddress: 'Dusun Ngasem RT 05/RW 01' },
    coordinates: [-7.1780, 111.8540],
    aidType: 'Raskin',
    economicStatus: 'Miskin',
    yearOfAid: 2023,
    images: [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400',
      'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400',
    ],
    familyMembers: 7,
    monthlyIncome: 900000,
  },
  {
    id: '6',
    headName: 'Dewi Lestari',
    address: { village: 'Sumberejo', district: 'Sumberejo', fullAddress: 'Jl. Kenanga No. 23, RT 04/RW 06' },
    coordinates: [-7.1390, 111.8450],
    aidType: 'PKH',
    economicStatus: 'Sangat Miskin',
    yearOfAid: 2024,
    images: [
      'https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=400',
      'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=400',
    ],
    familyMembers: 4,
    monthlyIncome: 750000,
  },
  {
    id: '7',
    headName: 'Joko Susilo',
    address: { village: 'Kapas', district: 'Kapas', fullAddress: 'Dusun Bakalan RT 02/RW 04' },
    coordinates: [-7.1550, 111.8650],
    aidType: 'BPNT',
    economicStatus: 'Miskin',
    yearOfAid: 2024,
    images: [
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400',
      'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=400',
      'https://images.unsplash.com/photo-1599427303058-f04cbcf4756f?w=400',
    ],
    familyMembers: 5,
    monthlyIncome: 1100000,
  },
  {
    id: '8',
    headName: 'Mulyono',
    address: { village: 'Dander', district: 'Dander', fullAddress: 'Jl. Pahlawan No. 67' },
    coordinates: [-7.1420, 111.9050],
    aidType: 'BST',
    economicStatus: 'Rentan Miskin',
    yearOfAid: 2023,
    images: [
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400',
    ],
    familyMembers: 4,
    monthlyIncome: 1400000,
  },
  {
    id: '9',
    headName: 'Sri Wahyuni',
    address: { village: 'Trucuk', district: 'Trucuk', fullAddress: 'Dusun Gedangan RT 01/RW 02' },
    coordinates: [-7.1280, 111.8920],
    aidType: 'PKH',
    economicStatus: 'Sangat Miskin',
    yearOfAid: 2024,
    images: [
      'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=400',
      'https://images.unsplash.com/photo-1600566752734-2a0cd66c42f5?w=400',
      'https://images.unsplash.com/photo-1600566752229-250ed79470f8?w=400',
    ],
    familyMembers: 6,
    monthlyIncome: 700000,
  },
  {
    id: '10',
    headName: 'Bambang Purnomo',
    address: { village: 'Kauman', district: 'Bojonegoro', fullAddress: 'Jl. Gatot Subroto No. 15' },
    coordinates: [-7.1510, 111.8880],
    aidType: 'BLT',
    economicStatus: 'Miskin',
    yearOfAid: 2024,
    images: [
      'https://images.unsplash.com/photo-1602941525421-8f8b81d3edbb?w=400',
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?w=400',
    ],
    familyMembers: 5,
    monthlyIncome: 1000000,
  },
];

// Statistics data
export const statistics = {
  totalRecipients: 5500,
  totalPoorHouseholds: 4200,
  totalBudgetAllocated: 8500000000, // in IDR
  yearlyTrend: [
    { year: 2020, recipients: 3200 },
    { year: 2021, recipients: 3800 },
    { year: 2022, recipients: 4500 },
    { year: 2023, recipients: 5100 },
    { year: 2024, recipients: 5500 },
  ],
  aidTypeDistribution: [
    { type: 'PKH', count: 1800, color: 'hsl(215, 70%, 45%)' },
    { type: 'BPNT', count: 1500, color: 'hsl(175, 50%, 45%)' },
    { type: 'BST', count: 1100, color: 'hsl(155, 55%, 45%)' },
    { type: 'BLT', count: 700, color: 'hsl(35, 85%, 55%)' },
    { type: 'Raskin', count: 400, color: 'hsl(280, 50%, 55%)' },
  ],
  districtDistribution: districts.map(d => ({
    district: d.name,
    recipients: d.totalRecipients,
  })),
};

// Aid type labels
export const aidTypeLabels: Record<string, string> = {
  PKH: 'Program Keluarga Harapan',
  BPNT: 'Bantuan Pangan Non-Tunai',
  BST: 'Bantuan Sosial Tunai',
  BLT: 'Bantuan Langsung Tunai',
  Raskin: 'Beras untuk Keluarga Miskin',
};

// Economic status colors
export const economicStatusColors: Record<string, string> = {
  'Sangat Miskin': 'destructive',
  'Miskin': 'secondary',
  'Rentan Miskin': 'accent',
};
