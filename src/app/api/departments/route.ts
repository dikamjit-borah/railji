import { NextResponse } from 'next/server';

// Mock data for departments
const departments = [
  {
    id: 'civil',
    name: 'Civil Engg',
    fullName: 'Civil Engineering Department',
    description: 'Infrastructure, bridges, tracks & construction',
    icon: 'building',
    color: {
      gradient: 'from-red-600 to-red-800',
      bg: 'bg-red-50'
    },
    paperCount: 7,
    materialCount: 4
  },
  {
    id: 'mechanical',
    name: 'Mechanical',
    fullName: 'Mechanical Engineering Department',
    description: 'Locomotives, rolling stock & maintenance',
    icon: 'wrench',
    color: {
      gradient: 'from-orange-600 to-red-700',
      bg: 'bg-orange-50'
    },
    paperCount: 5,
    materialCount: 3
  },
  {
    id: 'electrical',
    name: 'Electrical',
    fullName: 'Electrical Engineering Department',
    description: 'Traction, power supply & electrical systems',
    icon: 'bolt',
    color: {
      gradient: 'from-amber-600 to-orange-700',
      bg: 'bg-amber-50'
    },
    paperCount: 4,
    materialCount: 3
  },
  {
    id: 'commercial',
    name: 'Commercial',
    fullName: 'Commercial Department',
    description: 'Ticketing, freight & passenger services',
    icon: 'currency',
    color: {
      gradient: 'from-emerald-600 to-teal-700',
      bg: 'bg-emerald-50'
    },
    paperCount: 5,
    materialCount: 2
  },
  {
    id: 'personnel',
    name: 'Personnel',
    fullName: 'Personnel Department',
    description: 'HR, recruitment & employee management',
    icon: 'users',
    color: {
      gradient: 'from-blue-600 to-indigo-700',
      bg: 'bg-blue-50'
    },
    paperCount: 3,
    materialCount: 2
  },
  {
    id: 'operating',
    name: 'Operating',
    fullName: 'Operating Department',
    description: 'Train operations, scheduling & control',
    icon: 'train',
    color: {
      gradient: 'from-purple-600 to-violet-700',
      bg: 'bg-purple-50'
    },
    paperCount: 4,
    materialCount: 2
  },
  {
    id: 'snt',
    name: 'S&T',
    fullName: 'Signal & Telecommunication Department',
    description: 'Signaling, telecom & safety systems',
    icon: 'signal',
    color: {
      gradient: 'from-cyan-600 to-blue-700',
      bg: 'bg-cyan-50'
    },
    paperCount: 4,
    materialCount: 2
  },
  {
    id: 'metro',
    name: 'DFCCIL & Metro',
    fullName: 'DFCCIL & Metro Railways',
    description: 'Dedicated freight corridor & metro systems',
    icon: 'metro',
    color: {
      gradient: 'from-rose-600 to-pink-700',
      bg: 'bg-rose-50'
    },
    paperCount: 4,
    materialCount: 2
  }
];

export async function GET() {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return NextResponse.json({
      success: true,
      data: departments
    });
  } catch (error) {
    console.error('Error in departments API:', error);
    return NextResponse.json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to fetch departments'
      }
    }, { status: 500 });
  }
}
