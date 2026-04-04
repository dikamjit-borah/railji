interface DepartmentInfo {
  fullName: string;
  hasAccess?: boolean;
}

interface DepartmentBannerProps {
  department: DepartmentInfo;
  activeTab: 'papers' | 'materials';
  filteredCount: number;
  slug?: string;
}

export default function DepartmentBanner({ department, activeTab, filteredCount, slug }: DepartmentBannerProps) {
  return (
    <div className="px-3 sm:px-4 lg:px-8 pb-4 sm:pb-5 lg:pb-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
          <div className="flex flex-col sm:block">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 flex items-center gap-2">
              {department.fullName}
              {!department.hasAccess && (
                <svg className="w-5 h-5 sm:w-8 sm:h-8 text-stone-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              )}
            </h1>
            <div className="flex items-center justify-between gap-2 mt-1">
              <p className="text-stone-600 text-sm sm:text-base lg:text-lg">
                {activeTab === 'papers'
                  ? <>Choose a paper to start<br className="sm:hidden" /> practicing</>
                  : <>Access study materials<br className="sm:hidden" /> and resources</>}
              </p>
              {/* Subscribe button — mobile only, aligned to description row */}
              {!department.hasAccess && (
                <a
                  href={`/subscription${slug ? `?from=/departments/${slug}` : ''}`}
                  className="sm:hidden shrink-0 inline-flex items-center gap-0.5 px-2 py-1 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white text-[11px] font-bold rounded-md shadow-sm shadow-orange-300 ring-1 ring-orange-400 ring-offset-1 transition-all duration-200 whitespace-nowrap"
                >
                  <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Subscribe
                </a>
              )}
            </div>
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
              {department.hasAccess ? (
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
              <span className={`text-xs sm:text-sm lg:text-base font-medium ${department.hasAccess ? 'text-green-600' : ''}`}>
                {department.hasAccess ? 'Subscribed' : 'Preview'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
