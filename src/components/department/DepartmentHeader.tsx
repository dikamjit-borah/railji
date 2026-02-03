'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

interface DepartmentHeaderProps {
  examTypes?: string[];
  subjects?: string[];
  onExamTypeSelect?: (examType: string) => void;
  onSubjectSelect?: (subject: string) => void;
}

export default function DepartmentHeader({ 
  examTypes = [], 
  subjects = [], 
  onExamTypeSelect,
  onSubjectSelect 
}: DepartmentHeaderProps) {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearch(false);
      }
    }

    if (showSearch) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showSearch]);

  // Filter exam types and subjects based on search query
  const filteredExamTypes = examTypes.filter(type =>
    type.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const filteredSubjects = subjects.filter(subject =>
    subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExamTypeClick = (examType: string) => {
    onExamTypeSelect?.(examType);
    setShowSearch(false);
    setSearchQuery('');
  };

  const handleSubjectClick = (subject: string) => {
    onSubjectSelect?.(subject);
    setShowSearch(false);
    setSearchQuery('');
  };

  const hasResults = filteredExamTypes.length > 0 || filteredSubjects.length > 0;

  return (
    <header className="pt-3 sm:pt-4 lg:pt-5 pb-2 sm:pb-3 px-3 sm:px-4 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-3 sm:gap-4">
          <Link href="/departments" className="p-1 sm:p-1.5 hover:bg-stone-200 rounded-lg transition-all">
            <svg className="w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-stone-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div className="flex items-center gap-3 sm:gap-4 flex-1 justify-end">
            <div className="relative w-full max-w-md" ref={searchRef}>
              {/* Search Input Button */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search papers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowSearch(true)}
                  className="w-full px-4 sm:px-5 py-2 sm:py-2.5 pr-10 sm:pr-12 bg-stone-100 border-2 border-transparent rounded-full focus:outline-none focus:bg-white focus:border-orange-500 text-sm sm:text-base text-stone-900 placeholder-stone-500 transition-all duration-200"
                />
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-stone-500 absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Search Dropdown */}
              {showSearch && hasResults && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg sm:rounded-xl shadow-2xl border border-stone-200 z-50 max-h-[400px] sm:max-h-[500px] overflow-y-auto">
                  {/* Previous Year Filters */}
                  {filteredExamTypes.length > 0 && (
                    <div className="py-2">
                      <div className="px-3 sm:px-4 py-1.5">
                        <h3 className="text-xs sm:text-sm font-semibold text-stone-500 uppercase tracking-wide">Previous Year</h3>
                      </div>
                      <div className="space-y-0.5">
                        {filteredExamTypes.map((examType) => (
                          <button
                            key={examType}
                            onClick={() => handleExamTypeClick(examType)}
                            className="w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-orange-50 transition-colors"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                </div>
                                <span className="font-medium text-stone-800 text-sm sm:text-base">{examType}</span>
                              </div>
                              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-stone-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Subjects Filters */}
                  {filteredSubjects.length > 0 && (
                    <div className="py-2 border-t border-stone-200">
                      <div className="px-3 sm:px-4 py-1.5">
                        <h3 className="text-xs sm:text-sm font-semibold text-stone-500 uppercase tracking-wide">Subjects</h3>
                      </div>
                      <div className="space-y-0.5">
                        {filteredSubjects.map((subject) => (
                          <button
                            key={subject}
                            onClick={() => handleSubjectClick(subject)}
                            className="w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-orange-50 transition-colors"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 sm:gap-3">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                  </svg>
                                </div>
                                <span className="font-medium text-stone-800 text-sm sm:text-base">{subject}</span>
                              </div>
                              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-stone-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <Link href="/" className="transition-transform hover:scale-105">
              <img
                src="/images/logo.png"
                alt="RailJee Logo"
                className="h-10 sm:h-12 lg:h-14 w-auto"
              />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
