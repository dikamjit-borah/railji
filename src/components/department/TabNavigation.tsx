'use client';

interface TabNavigationProps {
  activeTab: 'papers' | 'materials';
  papersCount: number;
  loadingMaterials: boolean;
  materialsLoaded: boolean;
  onTabChange: (tab: 'papers' | 'materials') => void;
  onPapersTabClick: () => void;
}

export default function TabNavigation({
  activeTab,
  papersCount,
  loadingMaterials,
  materialsLoaded,
  onTabChange,
  onPapersTabClick
}: TabNavigationProps) {
  return (
    <div className="mt-4 sm:mt-6 lg:mt-8 flex gap-1 sm:gap-2 border-b border-stone-200 overflow-x-auto">
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
            <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-white"></div>
          )}
        </span>
      </button>
    </div>
  );
}
