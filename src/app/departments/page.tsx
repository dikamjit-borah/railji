'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { API_ENDPOINTS } from '@/lib/apiConfig';
import { departmentCache } from '@/lib/departmentCache';
import Navbar from '@/components/common/Navbar';
import { getDepartmentIcon } from '@/lib/departmentIcons';
import { emitExternalApiError } from '@/lib/externalApiError';

const LoadingScreen = dynamic(() => import('@/components/LoadingScreen'), { ssr: false });

interface Department {
  id: string;
  departmentId?: string;
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

// Defined at module level — not recreated on every render
// Icons are defined in src/lib/departmentIcons.tsx

const COLOR_MAP: Record<string, { gradient: string; bg: string }> = {
  building: { gradient: 'from-red-600 to-red-800', bg: 'bg-red-50' },
  wrench:   { gradient: 'from-orange-600 to-red-700', bg: 'bg-orange-50' },
  bolt:     { gradient: 'from-amber-600 to-orange-700', bg: 'bg-amber-50' },
  currency: { gradient: 'from-orange-600 to-orange-700', bg: 'bg-orange-50' },
  users:    { gradient: 'from-blue-600 to-indigo-700', bg: 'bg-blue-50' },
  train:    { gradient: 'from-purple-600 to-violet-700', bg: 'bg-purple-50' },
  signal:   { gradient: 'from-cyan-600 to-blue-700', bg: 'bg-cyan-50' },
  metro:    { gradient: 'from-red-600 to-red-700', bg: 'bg-red-50' },
};

function mapDepartments(raw: any[]): Department[] {
  return raw.map((dept) => {
    const deptId = dept.slug || dept.id || dept.departmentId || dept.name?.toLowerCase();
    return {
      id: deptId,
      name: dept.name || dept.fullName || 'Department',
      fullName: dept.fullName || dept.name || 'Department',
      description: dept.description || 'Department description',
      icon: getDepartmentIcon(deptId),
      color: COLOR_MAP[dept.icon] ?? COLOR_MAP.building,
      paperCount: dept.paperCount || 0,
      materialCount: dept.materialCount || 0,
      departmentId: dept.departmentId,
    };
  });
}

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        // Check cache first (pre-fetched from home page)
        const cached = departmentCache.get();

        if (cached?.departments && cached.departments.length > 0) {
          setDepartments(mapDepartments(cached.departments));
          setLoading(false);
          return;
        }

        // Fetch from API on cache miss
        const response = await fetch(API_ENDPOINTS.DEPARTMENTS);
        if (!response.ok) {
          throw new Error(`Failed to fetch departments: ${response.statusText}`);
        }

        const apiData = await response.json();
        const raw = apiData.data || [];

        departmentCache.set({ departments: raw });
        setDepartments(mapDepartments(raw));
      } catch (err) {
        setError((err as Error).message || 'Failed to load departments');
        emitExternalApiError();
      } finally {
        setLoading(false);
      }
    };

    fetchDepartments();
  }, []);

  if (loading) {
    return (
      <>
        <LoadingScreen
          isLoading={true}
          message="Loading departments..."
          animationPath="/animation/Trainbasic.lottie/a/Scene.json"
        />
        <div className="min-h-screen bg-[#faf9f7]" />
      </>
    );
  }

  if (error) {
    return <div className="min-h-screen bg-[#faf9f7]" />;
  }

  return (
    <div className="min-h-screen bg-[#FDF6E3]">
      <Navbar
        variant="departments"
        title="Select Department"
        subtitle="Choose your preparation area"
        backHref="/"
      />

      <main className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Page Title */}
        <div className="text-center mb-4 sm:mb-6 lg:mb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-stone-900 mb-2 sm:mb-3">
            What are you preparing for?
          </h2>
          <p className="text-sm sm:text-base text-stone-600 max-w-2xl mx-auto px-4">
            Select your department to access specialized practice tests and study materials
          </p>
        </div>

        {/* Animated Train SVG */}
        <div className="flex justify-center mb-4 sm:mb-6 lg:mb-8">
          <img
            src="/images/train-svg.svg"
            alt="Train"
            className="h-14 lg:h-24 w-auto mx-auto"
            style={{
              filter: 'brightness(0) saturate(100%) invert(27%) sepia(93%) saturate(2345%) hue-rotate(346deg) brightness(93%) contrast(101%)',
            }}
          />
        </div>

        {/* Departments Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4 pb-6">
          {departments.map((dept, index) => (
            <Link
              key={dept.id}
              href={`/departments/${dept.id}`}
              className="bounce-card group relative overflow-hidden rounded-lg sm:rounded-2xl p-2 sm:p-4 lg:p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl active:scale-95 active:opacity-50"
              style={{
                animationDelay: `${index * 0.2}s`,
                boxShadow: '0 8px 20px -4px rgba(0,0,0,0.25), 0 12px 25px -5px rgba(0,0,0,0.15)',
              }}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${dept.color.gradient}`} />

              {/* Decorative Pattern */}
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 right-0 w-20 sm:w-32 h-20 sm:h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-16 sm:w-24 h-16 sm:h-24 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
              </div>

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col justify-between min-h-[90px] sm:min-h-[130px] lg:min-h-[140px]">
                <div>
                  <h3 className="text-sm sm:text-base lg:text-lg font-bold text-white mb-0.5 sm:mb-1 leading-tight">
                    {dept.name}
                  </h3>
                  <p className="text-white/70 text-xxs sm:text-xs line-clamp-2 sm:block">
                    {dept.description}
                  </p>
                </div>

                <div className="flex items-end justify-between mt-1.5 sm:mt-3 lg:mt-4">
                  {/* Arrow — animates with CSS group-hover, no JS state */}
                  <div className="w-6 h-6 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300 group-hover:bg-white/30 group-hover:translate-x-1">
                    <svg className="w-2.5 h-2.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>

                  {/* Railway Emblem — animates with CSS group-hover, no JS state */}
                  <div className="w-8 h-8 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full border-2 border-yellow-400/80 bg-white/90 flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <div className="text-red-700 scale-50 sm:scale-90 lg:scale-100">
                      {dept.icon}
                    </div>
                  </div>
                </div>
              </div>

              {/* Hover Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full transition-transform duration-700 group-hover:translate-x-full pointer-events-none" />
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
