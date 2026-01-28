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
    <div className="px-4 sm:px-6 lg:px-8 pb-6 lg:pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-1">
              {department.fullName} 👋
            </h1>
            <p className="text-teal-200 text-base lg:text-xl">
              {activeTab === 'papers' ? 'Choose a paper to start practicing' : 'Access study materials and resources'}
            </p>
          </div>
          <div className="flex items-center gap-4 text-white/80">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-sm lg:text-base font-medium">
                {activeTab === 'papers' ? `${filteredCount} Papers` : `${filteredCount} Materials`}
              </span>
            </div>
            <div className="h-6 w-px bg-white/20"></div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm lg:text-base font-medium">Free Access</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
