'use client';

import { useEffect, useRef } from 'react';

// Paper type filter options:
// - 'full': Previous Year (complete papers)
// - 'sectional': Section-wise papers by paper code
// - 'general': General papers common across departments
type PaperTypeFilter = 'full' | 'sectional' | 'general';

interface FilterSectionProps {
  activeTab: 'papers' | 'materials';
  // Papers filters
  paperTypeFilter?: PaperTypeFilter;
  selectedPaperCode?: string;
  mainExamTypes?: string[];
  allExamTypes?: string[];
  otherExamTypes?: string[];
  allGeneralPapers?: string[];
  showOthersDropdown?: boolean;
  showGeneralDropdown?: boolean;
  loadingPapers?: boolean;
  onFullPaperClick?: () => void;
  onSectionalPaperSelect?: (code: string) => void;
  onGeneralPaperSelect?: (code: string) => void;
  onToggleOthersDropdown?: () => void;
  onToggleGeneralDropdown?: () => void;
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
  paperTypeFilter = 'full',
  selectedPaperCode = '',
  mainExamTypes = [],
  allExamTypes = [],
  otherExamTypes = [],
  allGeneralPapers = [],
  showOthersDropdown = false,
  showGeneralDropdown = false,
  loadingPapers = false,
  onFullPaperClick,
  onSectionalPaperSelect,
  onGeneralPaperSelect,
  onToggleOthersDropdown,
  onToggleGeneralDropdown,
  selectedMaterialType,
  materialTypeOptions = [],
  onMaterialTypeChange
}: FilterSectionProps) {
  const othersDropdownRef = useRef<HTMLDivElement>(null);
  const generalDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (othersDropdownRef.current && !othersDropdownRef.current.contains(event.target as Node)) {
        if (showOthersDropdown && onToggleOthersDropdown) {
          onToggleOthersDropdown();
        }
      }
      if (generalDropdownRef.current && !generalDropdownRef.current.contains(event.target as Node)) {
        if (showGeneralDropdown && onToggleGeneralDropdown) {
          onToggleGeneralDropdown();
        }
      }
    }

    if (showOthersDropdown || showGeneralDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showOthersDropdown, showGeneralDropdown, onToggleOthersDropdown, onToggleGeneralDropdown]);

  if (activeTab === 'papers') {
    return (
      <div className="px-3 sm:px-4 lg:px-8 pb-4 sm:pb-6 lg:pb-8">
        <div className="max-w-7xl mx-auto">
          {loadingPapers && (
            <div className="flex items-center justify-center py-2 mb-3">
              <div className="flex items-center gap-2 text-orange-600">
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-sm font-medium">Loading papers...</span>
              </div>
            </div>
          )}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {/* Previous Year (Full Paper) Button */}
            <button
              onClick={() => {
                onFullPaperClick?.();
              }}
              className={`px-2.5 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded-full text-xxs sm:text-xs lg:text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                paperTypeFilter === 'full'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
              }`}
            >
              Previous Year
            </button>

            {/* Sectional Paper Buttons - Show first 3 */}
            {mainExamTypes.slice(0, 3).map((type) => {
              const isAvailable = allExamTypes.includes(type);
              if (!isAvailable) return null;
              return (
                <button
                  key={type}
                  onClick={() => {
                    onSectionalPaperSelect?.(type);
                  }}
                  className={`px-2.5 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded-full text-xxs sm:text-xs lg:text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    paperTypeFilter === 'sectional' && selectedPaperCode === type
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                  }`}
                >
                  {type}
                </button>
              );
            })}

            {/* Others Dropdown - Contains remaining sectional paper types */}
            {otherExamTypes.length > 0 && (
              <div className="relative" ref={othersDropdownRef}>
                <button
                  onClick={() => {
                    onToggleOthersDropdown?.();
                    if (showGeneralDropdown && onToggleGeneralDropdown) {
                      onToggleGeneralDropdown();
                    }
                  }}
                  className={`px-2.5 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded-full text-xxs sm:text-xs lg:text-sm font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-1 sm:gap-1.5 ${
                    paperTypeFilter === 'sectional' && otherExamTypes.includes(selectedPaperCode)
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                  }`}
                >
                  Others
                  <svg
                    className={`w-2.5 h-2.5 sm:w-3 sm:h-3 transition-transform duration-200 ${
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
                  <div className="absolute top-full mt-1.5 left-0 bg-white rounded-lg sm:rounded-xl shadow-2xl border border-stone-200 py-1 sm:py-2 w-[140px] sm:w-[160px] lg:w-[180px] z-50 max-h-[250px] sm:max-h-[300px] overflow-y-auto">
                    {otherExamTypes.map((type) => (
                      <button
                        key={type}
                        onClick={() => {
                          onSectionalPaperSelect?.(type);
                          onToggleOthersDropdown?.();
                        }}
                        className={`w-full text-left px-2.5 sm:px-3 py-1.5 sm:py-2 text-xxs sm:text-xs hover:bg-orange-50 transition-colors ${
                          paperTypeFilter === 'sectional' && selectedPaperCode === type
                            ? 'bg-orange-50 text-orange-700 font-medium'
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

            {/* General Papers Dropdown - Pushed to the right */}
            {allGeneralPapers.length > 0 && (
              <div className="relative ml-auto" ref={generalDropdownRef}>
                <button
                  onClick={() => {
                    onToggleGeneralDropdown?.();
                    if (showOthersDropdown && onToggleOthersDropdown) {
                      onToggleOthersDropdown();
                    }
                  }}
                  className={`px-2.5 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded-full text-xxs sm:text-xs lg:text-sm font-medium whitespace-nowrap transition-all duration-200 flex items-center gap-1 sm:gap-1.5 ${
                    paperTypeFilter === 'general'
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                  }`}
                >
                  {paperTypeFilter === 'general' && selectedPaperCode ? selectedPaperCode : 'General'}
                  <svg
                    className={`w-2.5 h-2.5 sm:w-3 sm:h-3 transition-transform duration-200 ${
                      showGeneralDropdown ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* General Papers Dropdown Menu */}
                {showGeneralDropdown && (
                  <div className="absolute top-full mt-1.5 right-0 bg-white rounded-lg sm:rounded-xl shadow-2xl border border-stone-200 py-1 sm:py-2 w-[140px] sm:w-[160px] lg:w-[180px] z-50 max-h-[250px] sm:max-h-[300px] overflow-y-auto">
                    {allGeneralPapers.map((paper) => (
                      <button
                        key={paper}
                        onClick={() => {
                          onGeneralPaperSelect?.(paper);
                          onToggleGeneralDropdown?.();
                        }}
                        className={`w-full text-left px-2.5 sm:px-3 py-1.5 sm:py-2 text-xxs sm:text-xs hover:bg-amber-50 transition-colors ${
                          paperTypeFilter === 'general' && selectedPaperCode === paper
                            ? 'bg-amber-50 text-amber-700 font-medium'
                            : 'text-stone-700'
                        }`}
                      >
                        {paper}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Materials filter
  return (
    <div className="px-3 sm:px-4 lg:px-8 pb-4 sm:pb-6 lg:pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {materialTypeOptions.map((type) => (
            <button
              key={type}
              onClick={() => onMaterialTypeChange?.(type)}
              className={`px-2.5 sm:px-3 lg:px-4 py-1 sm:py-1.5 lg:py-2 rounded-full text-xxs sm:text-xs lg:text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                selectedMaterialType === type
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
              }`}
            >
              {type === 'All' ? 'All Materials' : materialTypes[type as keyof typeof materialTypes]?.label || type}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
