import React from 'react';
import Link from 'next/link';
import { getDepartmentIcon } from '@/lib/departmentIcons';

interface Department {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

interface DepartmentShowcaseProps {
  departments?: any[];
}

// ─── Icon Lookup ───────────────────────────────────────────────────────────────
// Icons are defined in src/lib/departmentIcons.tsx

export default function DepartmentShowcase({ departments: rawDepartments = [] }: DepartmentShowcaseProps) {
  const departments: Department[] = rawDepartments.map((dept: any) => {
    const deptId = dept.slug || dept.id || dept.departmentId || dept.name?.toLowerCase() || '';
    return {
      id: deptId,
      name: dept.name || dept.fullName || '',
      icon: getDepartmentIcon(deptId, 'w-10 h-10'),
      description: dept.description || 'Department',
    };
  });

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
          {departments.map((dept, index) => (
            <Link
              key={dept.id}
              href={`/departments/${dept.id}`}
              className="group relative block bg-gradient-to-br from-stone-50 to-stone-100/50 hover:from-white hover:to-stone-50 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 text-left border border-stone-200/50"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="mb-2 sm:mb-3 text-orange-600 transform group-hover:scale-110 transition-transform duration-300 [&>svg]:w-6 [&>svg]:h-6 sm:[&>svg]:w-10 sm:[&>svg]:h-10">{dept.icon}</div>
              <h3 className="font-bold text-stone-900 mb-0.5 sm:mb-1 text-xs sm:text-sm lg:text-base leading-tight">
                {dept.name}
              </h3>
              <p className="text-xs text-stone-500 leading-snug line-clamp-2">
                {dept.description}
              </p>

              {/* Arrow indicator */}
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/departments"
            className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 sm:py-4 bg-stone-900 text-white font-semibold rounded-full hover:bg-stone-800 transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            Browse All Departments
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
