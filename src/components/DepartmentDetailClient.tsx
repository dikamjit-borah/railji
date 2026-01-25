'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useMemo } from 'react';

interface ExamPaper {
  id: string;
  name: string;
  description: string;
  year: string;
  shift: string;
  questions: number;
  duration: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  attempts: number;
  rating: number;
  isFree: boolean;
  isNew?: boolean;
}

interface DepartmentInfo {
  name: string;
  fullName: string;
  color: string;
  bgColor: string;
  papers: ExamPaper[];
}

const departmentData: { [key: string]: DepartmentInfo } = {
  civil: {
    name: 'Civil Engg',
    fullName: 'Civil Engineering',
    color: 'from-red-600 to-red-800',
    bgColor: 'bg-red-50',
    papers: [
      { id: 'je-civil-2024-1', name: 'RRB JE CBT-1', description: 'Junior Engineer Computer Based Test Stage 1', year: '2024', shift: 'Shift 1', questions: 100, duration: 90, difficulty: 'Medium', attempts: 12500, rating: 4.8, isFree: true, isNew: true },
      { id: 'je-civil-2024-2', name: 'RRB JE CBT-1', description: 'Junior Engineer Computer Based Test Stage 1', year: '2024', shift: 'Shift 2', questions: 100, duration: 90, difficulty: 'Medium', attempts: 8900, rating: 4.7, isFree: true },
      { id: 'je-civil-2023-1', name: 'RRB JE CBT-1', description: 'Junior Engineer Computer Based Test Stage 1', year: '2023', shift: 'Shift 1', questions: 100, duration: 90, difficulty: 'Hard', attempts: 25600, rating: 4.9, isFree: true },
      { id: 'je-civil-2023-2', name: 'RRB JE CBT-1', description: 'Junior Engineer Computer Based Test Stage 1', year: '2023', shift: 'Shift 2', questions: 100, duration: 90, difficulty: 'Medium', attempts: 18700, rating: 4.6, isFree: true },
      { id: 'je-civil-2022-1', name: 'RRB JE CBT-1', description: 'Junior Engineer Computer Based Test Stage 1', year: '2022', shift: 'Shift 1', questions: 100, duration: 90, difficulty: 'Medium', attempts: 34200, rating: 4.8, isFree: true },
      { id: 'sse-civil-2024', name: 'RRB SSE', description: 'Senior Section Engineer Technical', year: '2024', shift: 'Morning', questions: 150, duration: 120, difficulty: 'Hard', attempts: 5600, rating: 4.5, isFree: true, isNew: true },
      { id: 'sse-civil-2023', name: 'RRB SSE', description: 'Senior Section Engineer Technical', year: '2023', shift: 'Morning', questions: 150, duration: 120, difficulty: 'Hard', attempts: 12300, rating: 4.7, isFree: true },
    ]
  },
  mechanical: {
    name: 'Mechanical',
    fullName: 'Mechanical Engineering',
    color: 'from-orange-600 to-red-700',
    bgColor: 'bg-orange-50',
    papers: [
      { id: 'je-mech-2024-1', name: 'RRB JE CBT-1', description: 'Junior Engineer Mechanical', year: '2024', shift: 'Shift 1', questions: 100, duration: 90, difficulty: 'Medium', attempts: 15600, rating: 4.8, isFree: true, isNew: true },
      { id: 'je-mech-2024-2', name: 'RRB JE CBT-1', description: 'Junior Engineer Mechanical', year: '2024', shift: 'Shift 2', questions: 100, duration: 90, difficulty: 'Hard', attempts: 11200, rating: 4.7, isFree: true },
      { id: 'je-mech-2023-1', name: 'RRB JE CBT-1', description: 'Junior Engineer Mechanical', year: '2023', shift: 'Shift 1', questions: 100, duration: 90, difficulty: 'Medium', attempts: 28900, rating: 4.9, isFree: true },
      { id: 'alp-mech-2024', name: 'RRB ALP', description: 'Assistant Loco Pilot Technical', year: '2024', shift: 'All Shifts', questions: 75, duration: 60, difficulty: 'Medium', attempts: 45000, rating: 4.8, isFree: true, isNew: true },
      { id: 'alp-mech-2023', name: 'RRB ALP', description: 'Assistant Loco Pilot Technical', year: '2023', shift: 'All Shifts', questions: 75, duration: 60, difficulty: 'Medium', attempts: 67000, rating: 4.9, isFree: true },
    ]
  },
  electrical: {
    name: 'Electrical',
    fullName: 'Electrical Engineering',
    color: 'from-amber-600 to-orange-700',
    bgColor: 'bg-amber-50',
    papers: [
      { id: 'je-elec-2024-1', name: 'RRB JE CBT-1', description: 'Junior Engineer Electrical', year: '2024', shift: 'Shift 1', questions: 100, duration: 90, difficulty: 'Medium', attempts: 18900, rating: 4.8, isFree: true, isNew: true },
      { id: 'je-elec-2024-2', name: 'RRB JE CBT-1', description: 'Junior Engineer Electrical', year: '2024', shift: 'Shift 2', questions: 100, duration: 90, difficulty: 'Hard', attempts: 14500, rating: 4.7, isFree: true },
      { id: 'je-elec-2023-1', name: 'RRB JE CBT-1', description: 'Junior Engineer Electrical', year: '2023', shift: 'Shift 1', questions: 100, duration: 90, difficulty: 'Medium', attempts: 32100, rating: 4.9, isFree: true },
      { id: 'technician-elec-2024', name: 'RRB Technician', description: 'Technician Grade III Electrical', year: '2024', shift: 'Morning', questions: 100, duration: 90, difficulty: 'Easy', attempts: 22000, rating: 4.6, isFree: true, isNew: true },
    ]
  },
  commercial: {
    name: 'Commercial',
    fullName: 'Commercial Department',
    color: 'from-emerald-600 to-teal-700',
    bgColor: 'bg-emerald-50',
    papers: [
      { id: 'ntpc-2024-1', name: 'RRB NTPC CBT-1', description: 'Non-Technical Popular Categories', year: '2024', shift: 'Shift 1', questions: 100, duration: 90, difficulty: 'Medium', attempts: 89000, rating: 4.9, isFree: true, isNew: true },
      { id: 'ntpc-2024-2', name: 'RRB NTPC CBT-1', description: 'Non-Technical Popular Categories', year: '2024', shift: 'Shift 2', questions: 100, duration: 90, difficulty: 'Medium', attempts: 76000, rating: 4.8, isFree: true },
      { id: 'ntpc-2023-1', name: 'RRB NTPC CBT-1', description: 'Non-Technical Popular Categories', year: '2023', shift: 'Shift 1', questions: 100, duration: 90, difficulty: 'Medium', attempts: 125000, rating: 4.9, isFree: true },
      { id: 'clerk-2024', name: 'Junior Clerk', description: 'Clerical Cadre Examination', year: '2024', shift: 'Morning', questions: 100, duration: 90, difficulty: 'Easy', attempts: 45000, rating: 4.7, isFree: true, isNew: true },
      { id: 'tc-2024', name: 'Ticket Collector', description: 'TC/CC Examination', year: '2024', shift: 'All Shifts', questions: 100, duration: 90, difficulty: 'Medium', attempts: 38000, rating: 4.6, isFree: true },
    ]
  },
  personnel: {
    name: 'Personnel',
    fullName: 'Personnel Department',
    color: 'from-blue-600 to-indigo-700',
    bgColor: 'bg-blue-50',
    papers: [
      { id: 'ntpc-personnel-2024', name: 'RRB NTPC CBT-1', description: 'Personnel & Administrative', year: '2024', shift: 'Shift 1', questions: 100, duration: 90, difficulty: 'Medium', attempts: 34000, rating: 4.7, isFree: true, isNew: true },
      { id: 'clerk-personnel-2024', name: 'Junior Clerk', description: 'Personnel Clerk Examination', year: '2024', shift: 'Morning', questions: 100, duration: 90, difficulty: 'Easy', attempts: 28000, rating: 4.6, isFree: true },
      { id: 'ntpc-personnel-2023', name: 'RRB NTPC CBT-1', description: 'Personnel & Administrative', year: '2023', shift: 'Shift 1', questions: 100, duration: 90, difficulty: 'Medium', attempts: 56000, rating: 4.8, isFree: true },
    ]
  },
  operating: {
    name: 'Operating',
    fullName: 'Operating Department',
    color: 'from-purple-600 to-violet-700',
    bgColor: 'bg-purple-50',
    papers: [
      { id: 'alp-2024-1', name: 'RRB ALP CBT-1', description: 'Assistant Loco Pilot Stage 1', year: '2024', shift: 'Shift 1', questions: 75, duration: 60, difficulty: 'Medium', attempts: 78000, rating: 4.9, isFree: true, isNew: true },
      { id: 'alp-2024-2', name: 'RRB ALP CBT-1', description: 'Assistant Loco Pilot Stage 1', year: '2024', shift: 'Shift 2', questions: 75, duration: 60, difficulty: 'Medium', attempts: 65000, rating: 4.8, isFree: true },
      { id: 'alp-2023-1', name: 'RRB ALP CBT-1', description: 'Assistant Loco Pilot Stage 1', year: '2023', shift: 'Shift 1', questions: 75, duration: 60, difficulty: 'Hard', attempts: 112000, rating: 4.9, isFree: true },
      { id: 'guard-2024', name: 'Train Guard', description: 'Goods Guard Examination', year: '2024', shift: 'Morning', questions: 100, duration: 90, difficulty: 'Medium', attempts: 23000, rating: 4.5, isFree: true, isNew: true },
    ]
  },
  snt: {
    name: 'S&T',
    fullName: 'Signal & Telecommunication',
    color: 'from-cyan-600 to-blue-700',
    bgColor: 'bg-cyan-50',
    papers: [
      { id: 'je-snt-2024-1', name: 'RRB JE S&T', description: 'Junior Engineer Signal & Telecom', year: '2024', shift: 'Shift 1', questions: 100, duration: 90, difficulty: 'Hard', attempts: 8900, rating: 4.7, isFree: true, isNew: true },
      { id: 'je-snt-2024-2', name: 'RRB JE S&T', description: 'Junior Engineer Signal & Telecom', year: '2024', shift: 'Shift 2', questions: 100, duration: 90, difficulty: 'Hard', attempts: 7200, rating: 4.6, isFree: true },
      { id: 'je-snt-2023', name: 'RRB JE S&T', description: 'Junior Engineer Signal & Telecom', year: '2023', shift: 'Shift 1', questions: 100, duration: 90, difficulty: 'Medium', attempts: 15600, rating: 4.8, isFree: true },
      { id: 'tech-snt-2024', name: 'Technician S&T', description: 'Technician Grade III S&T', year: '2024', shift: 'Morning', questions: 100, duration: 90, difficulty: 'Medium', attempts: 12000, rating: 4.5, isFree: true },
    ]
  },
  metro: {
    name: 'DFCCIL & Metro',
    fullName: 'DFCCIL & Metro Railways',
    color: 'from-rose-600 to-pink-700',
    bgColor: 'bg-rose-50',
    papers: [
      { id: 'dfccil-je-2024', name: 'DFCCIL JE', description: 'Junior Engineer DFCCIL', year: '2024', shift: 'CBT', questions: 100, duration: 90, difficulty: 'Hard', attempts: 6700, rating: 4.6, isFree: true, isNew: true },
      { id: 'metro-je-2024', name: 'Metro Rail JE', description: 'Junior Engineer Metro', year: '2024', shift: 'CBT', questions: 100, duration: 90, difficulty: 'Hard', attempts: 8900, rating: 4.7, isFree: true, isNew: true },
      { id: 'dfccil-exec-2024', name: 'DFCCIL Executive', description: 'Executive Civil/Electrical', year: '2024', shift: 'CBT', questions: 120, duration: 120, difficulty: 'Hard', attempts: 4500, rating: 4.5, isFree: true },
      { id: 'metro-tech-2024', name: 'Metro Technician', description: 'Maintainer/Technician Metro', year: '2024', shift: 'CBT', questions: 100, duration: 90, difficulty: 'Medium', attempts: 15000, rating: 4.6, isFree: true },
    ]
  }
};

interface DepartmentDetailClientProps {
  deptId: string;
}

const difficulties = ['All', 'Easy', 'Medium', 'Hard'] as const;

const getDifficultyColor = (difficulty: string) => {
  switch (difficulty) {
    case 'Easy': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'Medium': return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'Hard': return 'bg-red-100 text-red-700 border-red-200';
    default: return 'bg-stone-100 text-stone-700 border-stone-200';
  }
};

const formatAttempts = (num: number) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
};

export default function DepartmentDetailClient({ deptId }: DepartmentDetailClientProps) {
  const router = useRouter();

  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [selectedExamType, setSelectedExamType] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');

  const department = departmentData[deptId];

  // Get unique filter values
  const years = useMemo(() => {
    if (!department) return [];
    const uniqueYears = [...new Set(department.papers.map(p => p.year))].sort((a, b) => b.localeCompare(a));
    return ['All', ...uniqueYears];
  }, [department]);

  const examTypes = useMemo(() => {
    if (!department) return [];
    const uniqueTypes = [...new Set(department.papers.map(p => p.name))];
    return ['All', ...uniqueTypes];
  }, [department]);

  const filteredPapers = useMemo(() => {
    if (!department) return [];
    return department.papers.filter(paper => {
      const matchYear = selectedYear === 'All' || paper.year === selectedYear;
      const matchType = selectedExamType === 'All' || paper.name === selectedExamType;
      const matchDifficulty = selectedDifficulty === 'All' || paper.difficulty === selectedDifficulty;
      return matchYear && matchType && matchDifficulty;
    });
  }, [department, selectedYear, selectedExamType, selectedDifficulty]);

  if (!department) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-stone-900 mb-4">Department not found</h1>
          <Link href="/departments" className="text-emerald-600 hover:underline">
            Go back to departments
          </Link>
        </div>
      </div>
    );
  }

  const handlePaperSelect = (paperId: string) => {
    // Map department paper IDs to exam IDs in exams.json
    let examId = 'je'; // default

    if (paperId.includes('je-') || paperId.includes('sse-')) {
      examId = 'je';
    } else if (paperId.includes('ntpc-')) {
      examId = 'ntpc';
    } else if (paperId.includes('clerk-') || paperId.includes('tc-')) {
      examId = 'jr-clerk';
    } else if (paperId.includes('alp-') || paperId.includes('guard-')) {
      examId = 'je'; // Using JE for ALP/Guard for now
    } else if (paperId.includes('tech-')) {
      examId = 'je';
    } else if (paperId.includes('dfccil-') || paperId.includes('metro-')) {
      examId = 'je';
    }

    router.push(`/exam/${examId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-900 via-teal-800 to-teal-900">
      {/* Header */}
      <header className="pt-6 pb-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <Link href="/departments" className="p-2 hover:bg-white/10 rounded-xl transition-all">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-white/10 rounded-xl transition-all">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              <button className="p-2 hover:bg-white/10 rounded-xl transition-all">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
              <Link href="/" className="transition-transform hover:scale-105">
                <img
                  src="/images/logo.png"
                  alt="RailJee Logo"
                  className="h-14 sm:h-14 w-auto"
                />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Greeting Section */}
      <div className="px-4 sm:px-6 lg:px-8 pb-6 lg:pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-1">
                {department.fullName} 👋
              </h1>
              <p className="text-teal-200 text-base lg:text-xl">Choose a paper to start practicing</p>
            </div>
            <div className="flex items-center gap-4 text-white/80">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span className="text-sm lg:text-base font-medium">{filteredPapers.length} Papers</span>
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

      {/* Filter Tabs */}
      <div className="px-4 sm:px-6 lg:px-8 pb-8 lg:pb-10">
        <div className="max-w-7xl mx-auto space-y-4">
          {/* Year Filter */}
          <div>
            <label className="text-teal-200 text-sm font-medium mb-2 block lg:hidden">Filter by Year</label>
            <div className="flex flex-wrap gap-2 lg:gap-3">
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => setSelectedYear(year)}
                  className={`px-4 lg:px-6 py-2 lg:py-2.5 rounded-full text-sm lg:text-base font-medium whitespace-nowrap transition-all duration-200 ${
                    selectedYear === year
                      ? 'bg-white text-teal-900 shadow-lg'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {year === 'All' ? 'All Years' : year}
                </button>
              ))}
            </div>
          </div>

          {/* Exam Type & Difficulty Filters - Side by Side on Large Screens */}
          <div className="grid lg:grid-cols-2 gap-4">
            {/* Exam Type Filter */}
            <div>
              <label className="text-teal-200 text-sm font-medium mb-2 block lg:hidden">Exam Type</label>
              <div className="flex flex-wrap gap-2 lg:gap-3">
                {examTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedExamType(type)}
                    className={`px-4 lg:px-6 py-2 lg:py-2.5 rounded-full text-sm lg:text-base font-medium whitespace-nowrap transition-all duration-200 ${
                      selectedExamType === type
                        ? 'bg-emerald-400 text-teal-900 shadow-lg'
                        : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                    }`}
                  >
                    {type === 'All' ? 'All Exams' : type}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="text-teal-200 text-sm font-medium mb-2 block lg:hidden">Difficulty</label>
              <div className="flex flex-wrap gap-2 lg:gap-3">
                {difficulties.map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`px-4 lg:px-6 py-2 lg:py-2.5 rounded-full text-sm lg:text-base font-medium whitespace-nowrap transition-all duration-200 ${
                      selectedDifficulty === diff
                        ? 'bg-amber-400 text-teal-900 shadow-lg'
                        : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                    }`}
                  >
                    {diff === 'All' ? 'All Levels' : diff}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Papers List */}
      <main className="px-4 sm:px-6 lg:px-8 pb-12 lg:pb-16">
        <div className="max-w-7xl mx-auto">
          {/* Results Count */}
          <div className="flex items-center justify-between mb-6 lg:mb-8">
            <p className="text-teal-200 text-base lg:text-lg">
              Showing <span className="font-semibold text-white text-lg lg:text-xl">{filteredPapers.length}</span> {filteredPapers.length === 1 ? 'paper' : 'papers'}
            </p>
            <div className="hidden lg:flex items-center gap-3 text-teal-200 text-sm">
              <button className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                </svg>
                Sort by
              </button>
            </div>
          </div>

          {/* Papers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5">
            {filteredPapers.length === 0 ? (
              <div className="md:col-span-2 xl:col-span-3 bg-white/10 backdrop-blur-sm rounded-2xl p-10 text-center">
                <svg className="w-16 h-16 text-teal-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-xl font-semibold text-white mb-2">No papers found</h3>
                <p className="text-teal-200">Try adjusting your filters</p>
              </div>
            ) : (
              filteredPapers.map((paper, index) => (
                <button
                  key={paper.id}
                  onClick={() => handlePaperSelect(paper.id)}
                  className="relative w-full bg-white rounded-2xl p-4 text-left shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 group border border-stone-100 overflow-hidden"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-600/20 to-emerald-600/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10 rounded-2xl">
                    <div className="text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <div className="bg-white text-teal-700 px-6 py-3 rounded-xl font-bold text-base shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
                        Start Exam
                        <svg className="w-4 h-4 inline-block ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </div>
                      <p className="text-white text-xs mt-2 opacity-90">{paper.questions} Questions · {paper.duration} Minutes</p>
                    </div>
                  </div>

                  {/* Instructor Row */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-stone-400">Instructor</span>
                      <div className="w-5 h-5 rounded-full bg-gradient-to-br from-teal-400 to-emerald-500 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                      </div>
                    </div>
                    {paper.isNew && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500 text-white">
                        NEW
                      </span>
                    )}
                  </div>

                  {/* Title & Price Row */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-lg font-bold text-stone-900 leading-tight group-hover:text-teal-700 transition-colors">
                      {paper.name}
                    </h3>
                    <div className="text-right flex-shrink-0">
                      <div className="text-[10px] text-stone-400 line-through">₹299</div>
                      <div className="text-base font-bold text-emerald-600 border border-stone-200 bg-stone-50 px-2 py-0.5 rounded">
                        Free
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-stone-500 text-xs mb-3 line-clamp-2">
                    {paper.description}
                  </p>

                  {/* Stats */}
                  <div className="space-y-1.5 mb-3">
                    <div className="flex items-center gap-1.5 text-xs text-stone-600">
                      <svg className="w-3.5 h-3.5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{paper.year} · {paper.shift}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-stone-600">
                      <svg className="w-3.5 h-3.5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>{paper.questions} questions · {paper.duration} min</span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-stone-100 pt-3">
                    {/* Bottom Row */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-stone-400">
                        {formatAttempts(paper.attempts)} people attempted
                      </span>
                      <div className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        <span className="text-xs font-semibold text-stone-700">{paper.rating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Difficulty Badge - Bottom Right Corner */}
                  <div className={`absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-medium ${getDifficultyColor(paper.difficulty)}`}>
                    {paper.difficulty}
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Bottom Stats */}
          <div className="mt-10 lg:mt-14 grid grid-cols-3 gap-3 lg:gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl lg:rounded-2xl p-4 lg:p-6 text-center hover:bg-white/15 transition-colors">
              <div className="text-2xl lg:text-4xl font-bold text-white mb-1">{department.papers.length}</div>
              <div className="text-xs lg:text-sm text-teal-200">Total Papers</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl lg:rounded-2xl p-4 lg:p-6 text-center hover:bg-white/15 transition-colors">
              <div className="text-2xl lg:text-4xl font-bold text-white mb-1">
                {department.papers.filter(p => p.isNew).length}
              </div>
              <div className="text-xs lg:text-sm text-teal-200">New Papers</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl lg:rounded-2xl p-4 lg:p-6 text-center hover:bg-white/15 transition-colors">
              <div className="text-2xl lg:text-4xl font-bold text-emerald-400 mb-1">100%</div>
              <div className="text-xs lg:text-sm text-teal-200">Free Access</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

