'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Department {
  id: string;
  name: string;
  fullName: string;
  description: string;
  icon: React.ReactNode;
  color: {
    gradient: string;
    bg: string;
  };
  paperCount: number;
  materialCount: number;
}

interface ApiDepartment {
  id: string;
  name: string;
  fullName: string;
  description: string;
  icon: string;
  color: {
    gradient: string;
    bg: string;
  };
  paperCount: number;
  materialCount: number;
}

// Icon mapping based on icon identifier from API
const getIconComponent = (iconName: string): React.ReactNode => {
  const icons: { [key: string]: React.ReactNode } = {
    building: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
      </svg>
    ),
    wrench: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
      </svg>
    ),
    bolt: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    currency: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    ),
    users: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
    train: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
    signal: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.348 14.651a3.75 3.75 0 010-5.303m5.304 0a3.75 3.75 0 010 5.303m-7.425 2.122a6.75 6.75 0 010-9.546m9.546 0a6.75 6.75 0 010 9.546M5.106 18.894c-3.808-3.808-3.808-9.98 0-13.789m13.788 0c3.808 3.808 3.808 9.981 0 13.79M12 12h.008v.007H12V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
    metro: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
  };

  return icons[iconName] || icons.building;
};

export default function DepartmentsPage() {
  const router = useRouter();
  const [hoveredDept, setHoveredDept] = useState<string | null>(null);
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch from API
        const response = await fetch('/api/departments');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch departments: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        if (!result.success || !result.data) {
          throw new Error(result.error?.message || 'Failed to load departments');
        }
        
        const data = result.data;
        
        // Map API data to include icon components
        const departmentsWithIcons: Department[] = data.map((dept: ApiDepartment) => ({
          ...dept,
          icon: getIconComponent(dept.icon)
        }));
        
        setDepartments(departmentsWithIcons);
      } catch (err) {
        const error = err as Error;
        setError(error.message || 'Failed to load departments');
        console.error('Error fetching departments:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  const handleDepartmentClick = (deptId: string) => {
    setSelectedDept(deptId);
    // Add a small delay for the animation before navigating
    setTimeout(() => {
      router.push(`/departments/${deptId}`);
    }, 300);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
          <p className="text-stone-600 font-medium">Loading departments...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-stone-900 mb-2">Failed to Load</h2>
          <p className="text-stone-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl font-medium hover:shadow-lg transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <Link href="/" className="flex items-center gap-3 group">
              <button className="p-2 hover:bg-stone-100 rounded-xl transition-all">
                <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-stone-900">Select Department</h1>
                <p className="text-xs text-stone-500 hidden sm:block">Choose your preparation area</p>
              </div>
            </Link>
            <Link href="/" className="transition-transform hover:scale-105">
              <img
                src="/images/logo.png"
                alt="RailJee Logo"
                className="h-10 sm:h-12 w-auto"
              />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Page Title */}
        <div className="text-center mb-10 sm:mb-14">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 mb-4">
            What are you preparing for?
          </h2>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto">
            Select your department to access specialized practice tests and study materials
          </p>
        </div>

        

        {/* Animated Train SVG */}
        <div className="flex justify-center mb-10">
          <div className="relative">
            <img 
              src="/images/train-svg.svg" 
              alt="Train" 
              className="h-16 sm:h-20 lg:h-24 w-auto mx-auto"
              style={{
                filter: 'brightness(0) saturate(100%) invert(27%) sepia(93%) saturate(2345%) hue-rotate(346deg) brightness(93%) contrast(101%)'
              }}
            />
          </div>
        </div>

        {/* Departments Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {departments.map((dept, index) => (
            <button
              key={dept.id}
              onClick={() => handleDepartmentClick(dept.id)}
              onMouseEnter={() => setHoveredDept(dept.id)}
              onMouseLeave={() => setHoveredDept(null)}
              className={`group relative overflow-hidden rounded-2xl sm:rounded-3xl p-5 sm:p-6 text-left transition-all duration-300 transform ${
                selectedDept === dept.id 
                  ? 'scale-95 opacity-50' 
                  : 'hover:scale-[1.02] hover:shadow-2xl'
              }`}
              style={{
                animationDelay: `${index * 50}ms`
              }}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${dept.color.gradient} transition-all duration-300`}></div>
              
              {/* Decorative Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
              </div>

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col justify-between min-h-[140px] sm:min-h-[160px]">
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2 leading-tight">
                    {dept.name}
                  </h3>
                  <p className="text-white/70 text-xs sm:text-sm line-clamp-2 hidden sm:block">
                    {dept.description}
                  </p>
                </div>

                <div className="flex items-end justify-between mt-4">
                  {/* Arrow */}
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300 ${
                    hoveredDept === dept.id ? 'bg-white/30 translate-x-1' : ''
                  }`}>
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>

                  {/* Railway Emblem */}
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-yellow-400/80 bg-white/90 flex items-center justify-center shadow-lg transition-all duration-300 ${
                    hoveredDept === dept.id ? 'scale-110 rotate-6' : ''
                  }`}>
                    <div className="text-red-700">
                      {dept.icon}
                    </div>
                  </div>
                </div>
              </div>

              {/* Hover Shine Effect */}
              <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full transition-transform duration-700 ${
                hoveredDept === dept.id ? 'translate-x-full' : ''
              }`}></div>
            </button>
          ))}
        </div>

        {/* Bottom Info */}
        <div className="mt-12 sm:mt-16 text-center">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-md">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-stone-600 text-sm sm:text-base">
              <span className="font-semibold text-stone-900">{departments.length} Departments</span> available for practice
            </span>
          </div>
        </div>

        {/* Decorative Track */}
        <div className="mt-12 sm:mt-16 relative">
          <div className="h-3 bg-stone-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-emerald-500 w-1/3 rounded-full animate-pulse"></div>
          </div>
          <div className="flex justify-between mt-2 px-2">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="w-4 h-1 bg-stone-300 rounded"></div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
