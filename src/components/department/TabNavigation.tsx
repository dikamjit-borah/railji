'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

interface TabNavigationProps {
  activeTab: 'papers' | 'materials';
  papersCount: number;
  loadingMaterials: boolean;
  materialsLoaded: boolean;
  hasAccess?: boolean;
  slug?: string;
  onTabChange: (tab: 'papers' | 'materials') => void;
  onPapersTabClick: () => void;
  designations?: string[];
  selectedDesignation?: string;
  onDesignationSelect?: (designation: string) => void;
}

export default function TabNavigation({
  activeTab,
  papersCount,
  loadingMaterials,
  materialsLoaded,
  hasAccess,
  slug,
  onTabChange,
  onPapersTabClick,
  designations = [],
  selectedDesignation = '',
  onDesignationSelect,
}: TabNavigationProps) {
  const [showDesignationDropdown, setShowDesignationDropdown] = useState(false);
  const designationDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (designationDropdownRef.current && !designationDropdownRef.current.contains(event.target as Node)) {
        setShowDesignationDropdown(false);
      }
    }
    if (showDesignationDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showDesignationDropdown]);

  return (
    <div className="mt-4 sm:mt-6 lg:mt-8 flex items-end justify-between border-b border-stone-200">
      <div className="flex gap-1 sm:gap-2 overflow-x-auto">
      <button
        onClick={onPapersTabClick}
        className={`px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 font-semibold text-sm sm:text-base lg:text-lg transition-all duration-200 border-b-2 whitespace-nowrap ${
          activeTab === 'papers'
            ? 'text-orange-600 border-b-orange-600'
            : 'text-stone-600 border-b-transparent hover:text-stone-900'
        }`}
      >
        <span className="flex items-center gap-1.5 sm:gap-2">
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="hidden xs:inline">{papersCount} Papers</span>
          <span className="xs:hidden">Papers</span>
        </span>
      </button>
      <button
        onClick={() => onTabChange('materials')}
        className={`px-3 sm:px-4 lg:px-6 py-2 sm:py-2.5 lg:py-3 font-semibold text-sm sm:text-base lg:text-lg transition-all duration-200 border-b-2 whitespace-nowrap ${
          activeTab === 'materials'
            ? 'text-orange-600 border-b-orange-600'
            : 'text-stone-600 border-b-transparent hover:text-stone-900'
        }`}
      >
        <span className="flex items-center gap-1.5 sm:gap-2">
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17s4.5 10.747 10 10.747c5.5 0 10-4.998 10-10.747S17.5 6.253 12 6.253z" />
          </svg>
          Materials
          {loadingMaterials && !materialsLoaded && (
            <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-stone-400"></div>
          )}
        </span>
      </button>
      </div>

      <div className="flex items-center gap-2 pb-2 shrink-0">
        {/* Designation Dropdown */}
        {designations.length > 0 && (
          <div className="relative group/desig" ref={designationDropdownRef}>
            {/* Tooltip — Option 3 */}
            <div className="absolute -top-8 right-0 pointer-events-none opacity-0 group-hover/desig:opacity-100 transition-opacity duration-200 z-50">
              <div className="bg-stone-800 text-white text-[11px] font-medium px-2 py-1 rounded-md whitespace-nowrap shadow-lg">
                Filter by designation
                <div className="absolute top-full right-3 border-4 border-transparent border-t-stone-800" />
              </div>
            </div>
            <button
              onClick={() => setShowDesignationDropdown(!showDesignationDropdown)}
              className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm border transition-all duration-200 max-w-[110px] sm:max-w-none sm:whitespace-nowrap ${
                selectedDesignation
                  ? 'bg-orange-50 border-orange-400 text-orange-700 shadow-sm'
                  : 'bg-stone-50 border-stone-300 text-stone-600 hover:border-stone-400 hover:text-stone-800 shadow-sm'
              }`}
            >
              {/* Option 2 — muted prefix + bold value */}
              <span className={`font-normal hidden sm:inline ${
                selectedDesignation ? 'text-orange-400' : 'text-stone-400'
              }`}>Post:</span>
              <span className="overflow-hidden sm:overflow-visible max-w-full sm:max-w-none">
                <span
                  key={selectedDesignation}
                  className={`inline-block whitespace-nowrap font-semibold ${
                    selectedDesignation ? 'animate-marquee sm:animate-none' : ''
                  }`}
                >
                  {selectedDesignation || 'All'}
                </span>
              </span>
              <svg
                className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-200 ${showDesignationDropdown ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showDesignationDropdown && (
              <div className="absolute top-full mt-1.5 right-0 bg-white rounded-xl shadow-2xl border border-stone-200 py-1.5 min-w-[180px] sm:min-w-[210px] z-50 max-h-[250px] sm:max-h-[300px] overflow-y-auto">
                {designations.map((designation) => (
                  <button
                    key={designation}
                    onClick={() => {
                      onDesignationSelect?.(designation);
                      setShowDesignationDropdown(false);
                    }}
                    className={`w-full text-left px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm hover:bg-orange-50 transition-colors ${
                      selectedDesignation === designation ? 'bg-orange-100 text-orange-700 font-semibold' : 'text-stone-700'
                    }`}
                  >
                    {designation}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {!hasAccess && (
        <div className="shrink-0 hidden sm:block">
          <Link
            href={`/subscription${slug ? `?from=/departments/${slug}` : ''}`}
            className="inline-flex items-center gap-1 px-1.5 py-1 sm:py-1.5 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white text-xs sm:text-sm font-bold rounded-lg shadow-md shadow-orange-300 ring-2 ring-orange-400 ring-offset-1 hover:shadow-lg hover:shadow-orange-300 hover:scale-105 active:scale-95 transition-all duration-200 whitespace-nowrap bounce-card pr-2"
          >
            <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="sm:hidden">Subscribe</span>
            <span className="hidden sm:inline">Subscribe Now</span>
          </Link>
        </div>
        )}
      </div>
    </div>
  );
}
