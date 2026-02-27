'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Lottie from 'lottie-react';
import { API_ENDPOINTS } from '@/lib/apiConfig';
import { departmentCache } from '@/lib/departmentCache';
import LoadingScreen from '@/components/LoadingScreen';
import Navbar from '@/components/common/Navbar';
import departmentAnimation from '../../../public/animation/departmentList_animation/a/Main Scene.json';

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
// Map by department ID to ensure each department has unique icon
const getDepartmentIcon = (deptId: string, iconName?: string): React.ReactNode => {
  // Normalize department ID to lowercase and handle variations
  const normalizedId = (deptId || '').toLowerCase().trim();
  
  const departmentIcons: { [key: string]: React.ReactNode } = {
    civil: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
      </svg>
    ),
    mechanical: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    electrical: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    commercial: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
      </svg>
    ),
    personnel: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
    operating: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
    snt: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
      </svg>
    ),
    metro: (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5M3.75 3v18m16.5-18v18M9.75 9h4.5m-4.5 3h4.5m-4.5 3h4.5M3.75 18.75h16.5M4.5 21V3h15v18M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
      </svg>
    ),
  };

  // Return department-specific icon if available
  if (departmentIcons[normalizedId]) {
    return departmentIcons[normalizedId];
  }
  
  // Smart pattern matching for variations in department names
  if (normalizedId.includes('civil')) {
    return departmentIcons.civil;
  } else if (normalizedId.includes('mechanical') || normalizedId.includes('mech')) {
    return departmentIcons.mechanical;
  } else if (normalizedId.includes('electrical') || normalizedId.includes('elect')) {
    return departmentIcons.electrical;
  } else if (normalizedId.includes('commercial') || normalizedId.includes('comm')) {
    return departmentIcons.commercial;
  } else if (normalizedId.includes('personnel') || normalizedId.includes('person')) {
    return departmentIcons.personnel;
  } else if (normalizedId.includes('operating') || normalizedId.includes('operat')) {
    return departmentIcons.operating;
  } else if (normalizedId.includes('signal') || normalizedId.includes('telecom') || normalizedId.includes('s&t') || normalizedId.includes('snt')) {
    return departmentIcons.snt;
  } else if (normalizedId.includes('metro') || normalizedId.includes('dfccil')) {
    return departmentIcons.metro;
  }
  
  // Log unmatched department for debugging
  if (normalizedId) {
    console.log('Department icon not found for:', normalizedId, '- using fallback');
  }
  
  // Fallback to civil icon
  return departmentIcons.civil;
};

export default function DepartmentsPage() {
  const router = useRouter();
  const [hoveredDept, setHoveredDept] = useState<string | null>(null);
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Color gradient mapping for different icons
  const colorMapping: { [key: string]: { gradient: string; bg: string } } = {
    building: { gradient: 'from-red-600 to-red-800', bg: 'bg-red-50' },
    wrench: { gradient: 'from-orange-600 to-red-700', bg: 'bg-orange-50' },
    bolt: { gradient: 'from-amber-600 to-orange-700', bg: 'bg-amber-50' },
    currency: { gradient: 'from-orange-600 to-orange-700', bg: 'bg-orange-50' },
    users: { gradient: 'from-blue-600 to-indigo-700', bg: 'bg-blue-50' },
    train: { gradient: 'from-purple-600 to-violet-700', bg: 'bg-purple-50' },
    signal: { gradient: 'from-cyan-600 to-blue-700', bg: 'bg-cyan-50' },
    metro: { gradient: 'from-red-600 to-red-700', bg: 'bg-red-50' }
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        // Check cache first (pre-fetched from home page)
        const cached = departmentCache.get();
        
        if (cached?.departments && cached.departments.length > 0) {
          const departmentsWithIcons: Department[] = cached.departments.map((dept: any) => {
            const deptId = dept.slug || dept.id || dept.departmentId || dept.name?.toLowerCase();
            
            return {
              id: deptId,
              name: dept.name || dept.fullName || 'Department',
              fullName: dept.fullName || dept.name || 'Department',
              description: dept.description || 'Department description',
              icon: getDepartmentIcon(deptId, dept.icon),
              color: colorMapping[dept.icon] || colorMapping.building,
              paperCount: dept.paperCount || 0,
              materialCount: dept.materialCount || 0,
              departmentId: dept.departmentId
            };
          });
          
          setDepartments(departmentsWithIcons);
          setLoading(false); // Immediately stop loading when using cache
          return; // Exit early, no need to fetch
        }
        
        // Only show loading screen if we need to fetch from API (cache miss)
        setLoading(true);
        setError(null);
        
        // Fetch from API if cache is empty (direct navigation)
        const response = await fetch(API_ENDPOINTS.DEPARTMENTS);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch departments: ${response.statusText}`);
        }
        
        const apiData = await response.json();
        
        // Map external API response to our format
        // New API structure: data is array of departments
        const departments = apiData.data || [];

        // Cache the departments data for detail page
        departmentCache.set({
          departments
        });
        
        const departmentsWithIcons: Department[] = departments.map((dept: any) => {
          const deptId = dept.slug || dept.id || dept.departmentId || dept.name?.toLowerCase();
          return {
            id: deptId,
            name: dept.name || dept.fullName || 'Department',
            fullName: dept.fullName || dept.name || 'Department',
            description: dept.description || 'Department description',
            icon: getDepartmentIcon(deptId, dept.icon),
            color: colorMapping[dept.icon] || colorMapping.building,
            paperCount: dept.paperCount || 0,
            materialCount: dept.materialCount || 0,
            departmentId: dept.departmentId
          };
        });
        
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
    // Navigate immediately for better UX, no artificial delay
    router.push(`/departments/${deptId}`);
  };

  // Loading state
  if (loading) {
    return (
      <>
        <LoadingScreen 
          isLoading={true} 
          message="Loading departments..." 
          animationPath="/animation/Train Animation.lottie/a/Main Scene.json"
        />
        <div className="min-h-screen bg-[#faf9f7]" />
      </>
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
    <>
      <style jsx>{`
        @keyframes subtleBounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }
        
        .bounce-card {
          animation: subtleBounce 3s ease-in-out infinite;
        }
      `}</style>
      
      <div className="min-h-screen bg-[#FDF6E3]">
        {/* Header */}
        <Navbar 
          variant="departments"
          title="Select Department"
          subtitle="Choose your preparation area"
          backHref="/"
        />

      {/* Main Content */}
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
          <div className="relative">
            <img 
              src="/images/train-svg.svg" 
              alt="Train" 
              className="h-10 sm:h-14 lg:h-24 w-auto mx-auto"
              style={{
                filter: 'brightness(0) saturate(100%) invert(27%) sepia(93%) saturate(2345%) hue-rotate(346deg) brightness(93%) contrast(101%)'
              }}
            />
          </div>
        </div>

        {/* Departments Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 pb-6">
          {departments.map((dept, index) => (
            <button
              key={dept.id}
              onClick={() => handleDepartmentClick(dept.id)}
              onMouseEnter={() => setHoveredDept(dept.id)}
              onMouseLeave={() => setHoveredDept(null)}
              className={`z-[1000] bounce-card group relative overflow-hidden rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 text-left transition-all duration-300 transform ${
                selectedDept === dept.id 
                  ? 'scale-95 opacity-50' 
                  : 'hover:scale-[1.02] hover:shadow-2xl'
              }`}
              style={{
                animationDelay: `${index * 0.2}s`,
                boxShadow: '0 8px 20px -4px rgba(0, 0, 0, 0.25), 0 12px 25px -5px rgba(0, 0, 0, 0.15)'
              }}
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${dept.color.gradient} transition-all duration-300`}></div>
              
              {/* Decorative Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-20 sm:w-32 h-20 sm:h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-16 sm:w-24 h-16 sm:h-24 bg-white rounded-full translate-y-1/2 -translate-x-1/2"></div>
              </div>

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col justify-between min-h-[110px] sm:min-h-[130px] lg:min-h-[140px]">
                <div>
                  <h3 className="text-sm sm:text-base lg:text-lg font-bold text-white mb-0.5 sm:mb-1 leading-tight">
                    {dept.name}
                  </h3>
                  <p className="text-white/70 text-xxs sm:text-xs line-clamp-2 hidden sm:block">
                    {dept.description}
                  </p>
                </div>

                <div className="flex items-end justify-between mt-2 sm:mt-3 lg:mt-4">
                  {/* Arrow */}
                  <div className={`w-7 h-7 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300 ${
                    hoveredDept === dept.id ? 'bg-white/30 translate-x-1' : ''
                  }`}>
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>

                  {/* Railway Emblem */}
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full border-2 border-yellow-400/80 bg-white/90 flex items-center justify-center shadow-lg transition-all duration-300 ${
                    hoveredDept === dept.id ? 'scale-110 rotate-6' : ''
                  }`}>
                    <div className="text-red-700 scale-75 sm:scale-90 lg:scale-100">
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

        {/* Decorative Track */}
        {/* <div className="mt-[-60px] relative left-1/2 right-1/2 -ml-[75vw] -mr-[75vw] w-[150vw] h-16 sm:h-80 overflow-hidden">
          <Lottie
            animationData={departmentAnimation}
            loop={true}
            className="w-full h-full object-cover"
          />
        </div> */}
      </main>
    </div>
    </>
  );
}
