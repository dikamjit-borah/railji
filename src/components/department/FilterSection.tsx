'use client';

interface FilterSectionProps {
  activeTab: 'papers' | 'materials';
  // Papers filters
  selectedExamType?: string;
  selectedSubject?: string;
  mainExamTypes?: string[];
  allExamTypes?: string[];
  otherExamTypes?: string[];
  allSubjects?: string[];
  showOthersDropdown?: boolean;
  showSubjectsDropdown?: boolean;
  onExamTypeChange?: (type: string) => void;
  onSubjectChange?: (subject: string) => void;
  onToggleOthersDropdown?: () => void;
  onToggleSubjectsDropdown?: () => void;
  // Materials filters
  selectedMaterialType?: string;
  materialTypeOptions?: string[];
  onMaterialTypeChange?: (type: string) => void;
}

const materialTypes = {
  notes: { label: 'Study Notes' },
  book: { label: 'Books' },
  video: { label: 'Video Lectures' },
  guide: { label: 'Guides' },
};

export default function FilterSection({
  activeTab,
  selectedExamType,
  selectedSubject,
  mainExamTypes = [],
  allExamTypes = [],
  otherExamTypes = [],
  allSubjects = [],
  showOthersDropdown = false,
  showSubjectsDropdown = false,
  onExamTypeChange,
  onSubjectChange,
  onToggleOthersDropdown,
  onToggleSubjectsDropdown,
  selectedMaterialType,
  materialTypeOptions = [],
  onMaterialTypeChange
}: FilterSectionProps) {
  if (activeTab === 'papers') {
    return (
      <div className="px-4 sm:px-6 lg:px-8 pb-8 lg:pb-10">
        <div className="max-w-7xl mx-auto space-y-4">
          <div>
            <label className="text-teal-200 text-sm font-medium mb-2 block lg:hidden">Exam Type</label>
            <div className="flex flex-wrap gap-2 lg:gap-3">
              {/* Full Paper Button */}
              <button
                onClick={() => {
                  onExamTypeChange?.('All');
                  if (showOthersDropdown && onToggleOthersDropdown) {
                    onToggleOthersDropdown();
                  }
                }}
                className={`px-4 lg:px-6 py-2 lg:py-2.5 rounded-full text-sm lg:text-base font-medium whitespace-nowrap transition-all duration-200 ${
                  selectedExamType === 'All'
                    ? 'bg-emerald-400 text-teal-900 shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                }`}
              >
                Full Paper
              </button>

              {/* Main Exam Type Buttons */}
              {mainExamTypes.map((type) => {
                const isAvailable = allExamTypes.includes(type);
                if (!isAvailable) return null;
                return (
                  <button
                    key={type}
                    onClick={() => {
                      onExamTypeChange?.(type);
                      if (showOthersDropdown && onToggleOthersDropdown) {
                        onToggleOthersDropdown();
                      }
                    }}
                    className={`px-4 lg:px-6 py-2 lg:py-2.5 rounded-full text-sm lg:text-base font-medium whitespace-nowrap transition-all duration-200 ${
                      selectedExamType === type
                        ? 'bg-emerald-400 text-teal-900 shadow-lg'
                        : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                    }`}
                  >
                    {type}
                  </button>
                );
              })}

              {/* Others Dropdown */}
              {otherExamTypes.length > 0 && (
                <div className="relative">
                  <button
                    onClick={() => {
                      onToggleOthersDropdown?.();
                      if (showSubjectsDropdown && onToggleSubjectsDropdown) {
                        onToggleSubjectsDropdown();
                      }
                    }}
                    className={`px-4 lg:px-6 py-2 lg:py-2.5 rounded-full text-sm lg:text-base font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
                      otherExamTypes.includes(selectedExamType || '')
                        ? 'bg-emerald-400 text-teal-900 shadow-lg'
                        : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                    }`}
                  >
                    Others
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${
                        showOthersDropdown ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {showOthersDropdown && (
                    <div className="absolute top-full mt-2 left-0 bg-white rounded-xl shadow-2xl border border-stone-200 py-2 min-w-[200px] z-50 max-h-[300px] overflow-y-auto">
                      {otherExamTypes.map((type) => (
                        <button
                          key={type}
                          onClick={() => {
                            onExamTypeChange?.(type);
                            onToggleOthersDropdown?.();
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm hover:bg-emerald-50 transition-colors ${
                            selectedExamType === type
                              ? 'bg-emerald-50 text-emerald-700 font-medium'
                              : 'text-stone-700'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* General Subjects Dropdown */}
              {allSubjects.length > 0 && (
                <div className="relative">
                  <button
                    onClick={() => {
                      onToggleSubjectsDropdown?.();
                      if (showOthersDropdown && onToggleOthersDropdown) {
                        onToggleOthersDropdown();
                      }
                    }}
                    className={`px-4 lg:px-6 py-2 lg:py-2.5 rounded-full text-sm lg:text-base font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-2 ${
                      selectedSubject !== 'All'
                        ? 'bg-amber-400 text-teal-900 shadow-lg'
                        : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                    }`}
                  >
                    {selectedSubject === 'All' ? 'General' : selectedSubject}
                    <svg
                      className={`w-4 h-4 transition-transform duration-200 ${
                        showSubjectsDropdown ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Subjects Dropdown Menu */}
                  {showSubjectsDropdown && (
                    <div className="absolute top-full mt-2 left-0 bg-white rounded-xl shadow-2xl border border-stone-200 py-2 min-w-[200px] z-50 max-h-[300px] overflow-y-auto">
                      <button
                        onClick={() => {
                          onSubjectChange?.('All');
                          onToggleSubjectsDropdown?.();
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-amber-50 transition-colors ${
                          selectedSubject === 'All'
                            ? 'bg-amber-50 text-amber-700 font-medium'
                            : 'text-stone-700'
                        }`}
                      >
                        All Subjects
                      </button>
                      {allSubjects.map((subject) => (
                        <button
                          key={subject}
                          onClick={() => {
                            onSubjectChange?.(subject);
                            onToggleSubjectsDropdown?.();
                          }}
                          className={`w-full text-left px-4 py-2.5 text-sm hover:bg-amber-50 transition-colors ${
                            selectedSubject === subject
                              ? 'bg-amber-50 text-amber-700 font-medium'
                              : 'text-stone-700'
                          }`}
                        >
                          {subject}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Materials filter
  return (
    <div className="px-4 sm:px-6 lg:px-8 pb-8 lg:pb-10">
      <div className="max-w-7xl mx-auto space-y-4">
        <div>
          <label className="text-teal-200 text-sm font-medium mb-2 block lg:hidden">Filter by Type</label>
          <div className="flex flex-wrap gap-2 lg:gap-3">
            {materialTypeOptions.map((type) => (
              <button
                key={type}
                onClick={() => onMaterialTypeChange?.(type)}
                className={`px-4 lg:px-6 py-2 lg:py-2.5 rounded-full text-sm lg:text-base font-medium whitespace-nowrap transition-all duration-200 ${
                  selectedMaterialType === type
                    ? 'bg-emerald-400 text-teal-900 shadow-lg'
                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                }`}
              >
                {type === 'All' ? 'All Materials' : materialTypes[type as keyof typeof materialTypes]?.label || type}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
