'use client';

import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '@/lib/apiConfig';
import { useNavigation } from '@/components/NavigationProvider';
import { departmentCache } from '@/lib/departmentCache';

interface Department {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

interface DepartmentShowcaseProps {
  dataReady?: boolean;
}

// Icon mapping for departments - using SVG icons to match departments page
// Map by department ID to ensure each department has unique icon
const getDepartmentIcon = (deptId: string, iconName?: string): React.ReactNode => {
  // Normalize department ID to lowercase and handle variations
  const normalizedId = (deptId || '').toLowerCase().trim();
  
  const departmentIcons: { [key: string]: React.ReactNode } = {
    civil: (
      <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
      </svg>
    ),
    mechanical: (
      <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    electrical: (
      <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    commercial: (
      <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
      </svg>
    ),
    personnel: (
      <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
    operating: (
      <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
    snt: (
      <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
      </svg>
    ),
    metro: (
      <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
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
  
  // Fallback to civil icon if department not found
  return departmentIcons.civil;
};

export default function DepartmentShowcase({ dataReady = false }: DepartmentShowcaseProps) {
  const { navigate } = useNavigation();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [isLoading, setIsLoading] = useState(!dataReady);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        // Check cache (should be populated by home page)
        const cached = departmentCache.get();
        if (cached?.departments) {
          // Map cached data to display format
          const mappedDepts = cached.departments.map((dept: any) => {
            const deptId = dept.slug || dept.id || dept.departmentId || dept.name?.toLowerCase();
            console.log('Department mapping:', { 
              original: dept, 
              extractedId: deptId,
              slug: dept.slug,
              id: dept.id,
              departmentId: dept.departmentId,
              name: dept.name
            });
            return {
              id: deptId,
              name: dept.name || dept.fullName,
              icon: getDepartmentIcon(deptId, dept.icon),
              description: dept.description || 'Department'
            };
          });
          setDepartments(mappedDepts);
          setIsLoading(false);
          return;
        }

        // If dataReady is true but no cache, wait a bit (race condition)
        if (dataReady) {
          setTimeout(fetchDepartments, 100);
          return;
        }

        // Fetch from API if no cache
        const response = await fetch(API_ENDPOINTS.DEPARTMENTS);
        if (!response.ok) {
          throw new Error('Failed to fetch departments');
        }

        const apiData = await response.json();
        const departmentsData = apiData.data || [];

        // Cache the data
        departmentCache.set({
          departments: departmentsData
        });

        // Map to display format
        const mappedDepts = departmentsData.map((dept: any) => {
          const deptId = dept.slug || dept.id || dept.departmentId || dept.name?.toLowerCase();
          return {
            id: deptId,
            name: dept.name || dept.fullName,
            icon: getDepartmentIcon(deptId, dept.icon),
            description: dept.description || 'Department'
          };
        });

        setDepartments(mappedDepts);
      } catch (error) {
        console.error('Error fetching departments:', error);
        // Fallback to empty array on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchDepartments();
  }, [dataReady]);

  return (
    <section className="py-12 sm:py-16 lg:py-28 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-stone-900 mb-3 sm:mb-4 lg:mb-6">
            All Departments, One Platform
          </h2>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed px-4">
            Whether you&apos;re in technical, commercial, or administrative roles, find exam papers and resources specific to your department.
          </p>
        </div>

        {/* Departments Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-8 sm:mb-12">
          {isLoading ? (
            // Loading skeleton
            Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="bg-stone-100 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 animate-pulse"
              >
                <div className="w-10 h-10 bg-stone-200 rounded mb-2 sm:mb-3"></div>
                <div className="h-4 bg-stone-200 rounded mb-2 w-3/4"></div>
                <div className="h-3 bg-stone-200 rounded w-full"></div>
              </div>
            ))
          ) : (
            departments.map((dept, index) => (
            <button
              key={dept.id}
              onClick={() => navigate(`/departments/${dept.id}`)}
              className="group relative bg-gradient-to-br from-stone-50 to-stone-100/50 hover:from-white hover:to-stone-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 text-left border border-stone-200/50"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="mb-2 sm:mb-3 text-orange-600 transform group-hover:scale-110 transition-transform duration-300">{dept.icon}</div>
              <h3 className="font-bold text-stone-900 mb-0.5 sm:mb-1 text-xs sm:text-sm lg:text-base leading-tight">
                {dept.name}
              </h3>
              <p className="text-xs text-stone-500 leading-snug">
                {dept.description}
              </p>
              
              {/* Arrow indicator */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))
          )}
        </div>

        {/* CTA */}
        <div className="text-center">
          <button
            onClick={() => navigate('/departments')}
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-stone-900 text-white font-semibold rounded-full hover:bg-stone-800 transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            Browse All Departments
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
