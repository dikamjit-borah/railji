'use client';

interface DepartmentInfo {
  fullName: string;
}

interface DepartmentBannerProps {
  department: DepartmentInfo;
  activeTab: 'papers' | 'materials';
  filteredCount: number;
}

export default function DepartmentBanner({ department, activeTab, filteredCount }: DepartmentBannerProps) {
  return (
    <div className="px-3 sm:px-4 lg:px-8 pb-4 sm:pb-5 lg:pb-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 mb-1">
              {department.fullName}
            </h1>
            <p className="text-stone-600 text-sm sm:text-base lg:text-lg">
              {activeTab === 'papers' ? 'Choose a paper to start practicing' : 'Access study materials and resources'}
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-3 sm:gap-4 text-stone-600">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-xs sm:text-sm lg:text-base font-medium">
                {activeTab === 'papers' ? `${filteredCount} Papers` : `${filteredCount} Materials`}
              </span>
            </div>
            <div className="h-4 sm:h-6 w-px bg-stone-300"></div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-xs sm:text-sm lg:text-base font-medium">Free Access</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
