'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

interface ExamPaper {
  id: string;
  name: string;
  description: string;
  year: string;
  shift: string;
  questions: number;
  duration: number;
}

interface DepartmentHeaderProps {
  papers?: ExamPaper[];
  onPaperSelect?: (paperId: string) => void;
}

export default function DepartmentHeader({ papers = [], onPaperSelect }: DepartmentHeaderProps) {
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

  const filteredPapers = papers.filter(paper =>
    paper.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    paper.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `${paper.year} ${paper.shift}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePaperClick = (paperId: string) => {
    onPaperSelect?.(paperId);
    setShowSearch(false);
    setSearchQuery('');
  };

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
              {showSearch && filteredPapers.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg sm:rounded-xl shadow-2xl border border-stone-200 z-50 max-h-[400px] sm:max-h-[500px] overflow-y-auto">
                  {/* Papers List */}
                  <div className="py-1 sm:py-2">
                    {filteredPapers.map((paper) => (
                      <button
                        key={paper.id}
                        onClick={() => handlePaperClick(paper.id)}
                        className="w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-orange-50 transition-colors border-b border-stone-100 last:border-b-0"
                      >
                        <div className="flex items-start justify-between gap-2 sm:gap-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-stone-800 text-xs sm:text-sm mb-1 truncate">{paper.name}</h4>
                            <p className="text-xxs sm:text-xs text-stone-500 mb-1 line-clamp-1">{paper.description}</p>
                            <div className="flex items-center gap-2 sm:gap-3 text-xxs sm:text-xs text-stone-400">
                              <span className="flex items-center gap-0.5 sm:gap-1">
                                <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {paper.year} • {paper.shift}
                              </span>
                              <span className="flex items-center gap-0.5 sm:gap-1">
                                <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                {paper.questions} Q
                              </span>
                              <span className="flex items-center gap-0.5 sm:gap-1">
                                <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {paper.duration}m
                              </span>
                            </div>
                          </div>
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-stone-400 flex-shrink-0 mt-0.5 sm:mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </button>
                    ))}
                  </div>
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
