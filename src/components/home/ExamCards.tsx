'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { API_ENDPOINTS } from '@/lib/apiConfig';
import { useNavigation } from '@/components/NavigationProvider';
import { type TopPaper } from '@/lib/api';
import { departmentCache } from '@/lib/departmentCache';

// Function to get exam-specific icons based on multiple fields
const getExamIcon = (exam: TopPaper): React.ReactNode => {
  const departmentId = (exam.departmentId || '').toLowerCase().trim();
  const examName = (exam.name || '').toLowerCase().trim();
  const examType = (exam.examType || '').toLowerCase().trim();
  
  // Debug logging
  console.log('ExamCards - Dept:', departmentId, 'Name:', examName, 'Type:', examType);
  
  const iconLibrary = {
    civil: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
      </svg>
    ),
    mechanical: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    electrical: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
    signal: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
      </svg>
    ),
    commercial: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
      </svg>
    ),
    rrc: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
    ldce: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
      </svg>
    ),
    cbt: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
      </svg>
    ),
    time: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    train: (
      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
  };
  
  // Check exam name patterns for specific keywords
  const searchText = `${examName} ${examType} ${departmentId}`.toLowerCase();
  
  // Pattern matching based on exam content
  if (searchText.includes('signal') || searchText.includes('s&t') || searchText.includes('telecom')) {
    return iconLibrary.signal;
  }
  if (searchText.includes('mechanical') || searchText.includes('mech')) {
    return iconLibrary.mechanical;
  }
  if (searchText.includes('electrical') || searchText.includes('elect')) {
    return iconLibrary.electrical;
  }
  if (searchText.includes('civil')) {
    return iconLibrary.civil;
  }
  if (searchText.includes('ccts') || examType.includes('ccts')) {
    return iconLibrary.civil;
  }
  if (searchText.includes('commercial') || searchText.includes('comm')) {
    return iconLibrary.commercial;
  }
  if (searchText.includes('ldce')) {
    return iconLibrary.ldce;
  }
  if (searchText.includes('rrc') || searchText.includes('recruitment')) {
    return iconLibrary.rrc;
  }
  if (searchText.includes('cbt') || searchText.includes('computer based')) {
    return iconLibrary.cbt;
  }
  if (searchText.includes('time') || searchText.includes('distance') || searchText.includes('mock')) {
    return iconLibrary.time;
  }
  if (searchText.includes('train') || searchText.includes('coach') || searchText.includes('loco')) {
    return iconLibrary.train;
  }
  
  // Fallback based on index to ensure variety
  const fallbackIcons = [
    iconLibrary.mechanical,
    iconLibrary.electrical,
    iconLibrary.signal,
    iconLibrary.civil,
    iconLibrary.commercial,
    iconLibrary.rrc,
  ];
  
  // Use exam ID hash to consistently assign different icons
  const hash = exam._id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return fallbackIcons[hash % fallbackIcons.length];
};

// Resolve department name from cache by departmentId
const getDepartmentName = (departmentId: string): string => {
  if (!departmentId) return 'General';
  const cached = departmentCache.get();
  if (!cached) return 'General';
  const dept = cached.departments.find((d: any) =>
    d.departmentId === departmentId || d.id === departmentId || d.slug === departmentId
  );
  return dept?.name || dept?.departmentName || 'General';
};

interface ExamCardsProps {
  dataReady?: boolean;
  papers?: TopPaper[];
}

export default function ExamCards({ dataReady = false, papers = [] }: ExamCardsProps) {
  const { navigate } = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [topExams, setTopExams] = useState<TopPaper[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Fetch top papers on mount (only if not already loaded by home page)
  useEffect(() => {
    const fetchData = async () => {
      // If papers are provided as prop, use them
      if (papers && papers.length > 0) {
        setTopExams(papers);
        setLoading(false);
      } else if (!dataReady) {
        // Otherwise fetch if not handled by parent
        try {
          const response = await fetch(API_ENDPOINTS.TOP_PAPERS);
          if (!response.ok) {
            throw new Error('Failed to fetch top papers');
          }
          const apiData = await response.json();
          const fetchedPapers = apiData.data || [];
          setTopExams(fetchedPapers.slice(0, 6));
        } catch (error) {
          console.error('Failed to load top papers:', error);
        } finally {
          setLoading(false);
        }
      } else {
        // Data is being handled by parent, just wait
        setLoading(false);
      }
    };

    fetchData();
  }, [dataReady, papers]);

  // Detect screen size for mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const totalSlides = topExams.length;
  const visibleCards = isMobile ? 1 : 3;
  const maxIndex = totalSlides - visibleCards;

  const handleStartExam = (examId: string, departmentSlug?: string) => {
    if (departmentSlug) {
      navigate(`/exam/${examId}?dept=${departmentSlug}`);
    } else {
      navigate(`/exam/${examId}`);
    }
  };

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  }, [maxIndex]);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(Math.min(index, maxIndex));
  };

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 4000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setIsAutoPlaying(false);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      nextSlide();
    }
    if (touchStart - touchEnd < -75) {
      prevSlide();
    }
    setTimeout(() => setIsAutoPlaying(true), 5000);
  };

  if (loading) {
    return (
      <section id="exams" className="py-12 sm:py-16 lg:py-28 px-4 sm:px-6 lg:px-8 bg-[#faf9f7]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 lg:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-stone-900 mb-3 sm:mb-4 lg:mb-6">
              Choose Your Exam
            </h2>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed px-4">
              Select from our top Railway Recruitment Board exam papers and start your preparation journey
            </p>
          </div>
          <div className="flex items-center justify-center py-8 sm:py-12">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-stone-900"></div>
          </div>
        </div>
      </section>
    );
  }

  if (topExams.length === 0) {
    return null;
  }

  return (
    <section id="exams" className="py-12 sm:py-16 lg:py-28 px-4 sm:px-6 lg:px-8 bg-[#faf9f7]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-10 lg:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-stone-900 mb-3 sm:mb-4 lg:mb-6">
            Choose Your Exam
          </h2>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed px-4">
            Select from our top Railway Recruitment Board exam papers and start your preparation journey
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={() => {
              prevSlide();
              setIsAutoPlaying(false);
              setTimeout(() => setIsAutoPlaying(true), 5000);
            }}
            className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 lg:-translate-x-6 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full shadow-lg border border-stone-200 items-center justify-center text-stone-700 hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all duration-300"
            aria-label="Previous slide"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={() => {
              nextSlide();
              setIsAutoPlaying(false);
              setTimeout(() => setIsAutoPlaying(true), 5000);
            }}
            className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 lg:translate-x-6 z-10 w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full shadow-lg border border-stone-200 items-center justify-center text-stone-700 hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all duration-300"
            aria-label="Next slide"
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Cards Container */}
          <div 
            className="overflow-hidden mx-2 sm:mx-6 lg:mx-8"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div 
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * (100 / visibleCards)}%)` }}
            >
              {topExams.map((exam, index) => (
                <div
                  key={exam._id}
                  className="w-full md:w-1/3 flex-shrink-0 px-2 sm:px-3"
                  style={{ minWidth: isMobile ? '100%' : '33.333%' }}
                >
                  <div
                    className="group bg-white border border-stone-200 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 hover:border-stone-300 hover:shadow-xl transition-all duration-300 h-full flex flex-col"
                  >
                    {/* Header with Icon */}
                    <div className="flex items-start justify-between mb-4 sm:mb-5">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-stone-100 rounded-lg sm:rounded-xl flex items-center justify-center text-stone-700 group-hover:bg-stone-900 group-hover:text-white transition-all duration-300">
                        {getExamIcon(exam)}
                      </div>
                    </div>

                    {/* Department Tag */}
                    <div className="mb-2 sm:mb-3">
                      <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 bg-orange-50 border border-orange-200 rounded-full text-xs font-medium text-orange-700">
                        <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        {getDepartmentName(exam.departmentId)}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-stone-900 mb-2 group-hover:text-orange-600 transition-colors leading-tight">
                      {exam.name}
                    </h3>
                    <p className="text-stone-600 text-xs sm:text-sm mb-4 sm:mb-5 leading-relaxed flex-grow">
                      {exam.description}
                    </p>
                    
                    {/* Stats Row */}
                    <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5 text-xs sm:text-sm">
                      <div className="flex items-center gap-1 sm:gap-1.5 text-stone-500">
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{exam.duration} min</span>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-1.5 text-stone-500">
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>{exam.totalQuestions} Qs</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => handleStartExam(exam.paperId || exam._id, exam.departmentId)}
                      className="w-full px-4 sm:px-5 py-2.5 sm:py-3 rounded-full border-2 border-stone-900 text-stone-900 font-semibold text-xs sm:text-sm hover:bg-stone-900 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group/btn"
                    >
                      Start Practice
                      <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination Dots */}
          <div className="flex justify-center items-center gap-1.5 sm:gap-2 mt-6 sm:mt-8">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  goToSlide(index);
                  setIsAutoPlaying(false);
                  setTimeout(() => setIsAutoPlaying(true), 5000);
                }}
                className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                  currentIndex === index 
                    ? 'w-6 sm:w-8 bg-stone-900' 
                    : 'w-1.5 sm:w-2 bg-stone-300 hover:bg-stone-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* View All Link */}
          <div className="text-center mt-6 sm:mt-8 lg:mt-10">
            <button
              onClick={() => navigate('/departments')}
              className="inline-flex items-center gap-2 text-stone-700 font-medium hover:text-orange-600 transition-colors group text-sm sm:text-base"
            >
              View All Exams
              <svg className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
