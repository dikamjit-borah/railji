'use client';

import Link from 'next/link';

interface TabNavigationProps {
  activeTab: 'papers' | 'materials';
  papersCount: number;
  loadingMaterials: boolean;
  materialsLoaded: boolean;
  hasAccess?: boolean;
  slug?: string;
  onTabChange: (tab: 'papers' | 'materials') => void;
  onPapersTabClick: () => void;
}

export default function TabNavigation({
  activeTab,
  papersCount,
  loadingMaterials,
  materialsLoaded,
  hasAccess,
  slug,
  onTabChange,
  onPapersTabClick
}: TabNavigationProps) {
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

      {!hasAccess && (
        <div className="pb-2 shrink-0">
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
  );
}
