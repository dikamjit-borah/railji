'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAllExamAttempts, getUserStats, getExamAttempts, ExamAttempt } from '@/lib/examStorage';
import examData from '@/data/exams.json';
import Navbar from '@/components/common/Navbar';

// Department mapping for exams
const departments = [
  { id: 'all', name: 'All Departments', icon: '🚂' },
  { id: 'engineering', name: 'Engineering', icon: '⚙️', exams: ['je'] },
  { id: 'operations', name: 'Operations', icon: '🎛️', exams: ['ntpc'] },
  { id: 'commercial', name: 'Commercial', icon: '🏪', exams: ['jr-clerk'] },
  { id: 'electrical', name: 'Electrical', icon: '⚡', exams: [] },
  { id: 'signal', name: 'Signal & Telecom', icon: '📡', exams: [] },
  { id: 'medical', name: 'Medical', icon: '🏥', exams: [] },
  { id: 'accounts', name: 'Accounts', icon: '📊', exams: [] },
];

export default function StatsPage() {
  const router = useRouter();
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [allAttempts, setAllAttempts] = useState<{ [examId: string]: ExamAttempt[] }>({});
  const [stats, setStats] = useState<ReturnType<typeof getUserStats> | null>(null);
  const [selectedExam, setSelectedExam] = useState<string | null>(null);
  const [expandedAttempt, setExpandedAttempt] = useState<number | null>(null);

  useEffect(() => {
    // Load data from localStorage
    const attempts = getAllExamAttempts();
    const userStats = getUserStats();
    setAllAttempts(attempts);
    setStats(userStats);
  }, []);

  // Filter exams based on selected department
  const getFilteredExams = () => {
    if (selectedDepartment === 'all') {
      return examData.exams;
    }
    const dept = departments.find(d => d.id === selectedDepartment);
    if (!dept || !dept.exams) return [];
    return examData.exams.filter(exam => dept.exams?.includes(exam.id));
  };

  // Get attempts for filtered exams
  const getFilteredAttempts = (): ExamAttempt[] => {
    const filteredExams = getFilteredExams();
    const examIds = filteredExams.map(e => e.id);
    
    let attempts: ExamAttempt[] = [];
    examIds.forEach(id => {
      if (allAttempts[id]) {
        attempts = [...attempts, ...allAttempts[id]];
      }
    });
    
    // Sort by date (newest first)
    return attempts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  // Calculate department-specific stats
  const getDepartmentStats = () => {
    const attempts = getFilteredAttempts();
    if (attempts.length === 0) {
      return {
        totalAttempts: 0,
        totalPassed: 0,
        averageScore: 0,
        bestScore: 0,
        totalTime: 0,
        accuracy: 0,
      };
    }

    const totalAttempts = attempts.length;
    const totalPassed = attempts.filter(a => a.passed).length;
    const averageScore = attempts.reduce((sum, a) => sum + a.percentage, 0) / totalAttempts;
    const bestScore = Math.max(...attempts.map(a => a.percentage));
    const totalTime = attempts.reduce((sum, a) => sum + a.timeTaken, 0);
    const totalCorrect = attempts.reduce((sum, a) => sum + a.correctAnswers, 0);
    const totalQuestions = attempts.reduce((sum, a) => sum + a.totalQuestions, 0);
    const accuracy = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;

    return { totalAttempts, totalPassed, averageScore, bestScore, totalTime, accuracy };
  };

  const filteredAttempts = getFilteredAttempts();
  const deptStats = getDepartmentStats();

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Header */}
      <Navbar 
        variant="stats"
        title="My Statistics"
        subtitle="Track your exam performance"
        backHref="/"
        statsInfo={`${stats?.totalAttempts || 0} total attempts`}
      />

      {/* Department Filter - Horizontal Scroll */}
      <div className="bg-white border-b border-stone-100">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {departments.map(dept => (
              <button
                key={dept.id}
                onClick={() => {
                  setSelectedDepartment(dept.id);
                  setSelectedExam(null);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  selectedDepartment === dept.id
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                <span>{dept.icon}</span>
                <span className="text-sm font-medium">{dept.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* Stats Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {/* Total Attempts */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-stone-900">{deptStats.totalAttempts}</p>
            <p className="text-xs text-stone-500">Total Attempts</p>
          </div>

          {/* Pass Rate */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-stone-900">
              {deptStats.totalAttempts > 0 
                ? `${Math.round((deptStats.totalPassed / deptStats.totalAttempts) * 100)}%`
                : '0%'}
            </p>
            <p className="text-xs text-stone-500">Pass Rate</p>
          </div>

          {/* Best Score */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-stone-900">{deptStats.bestScore.toFixed(1)}%</p>
            <p className="text-xs text-stone-500">Best Score</p>
          </div>

          {/* Average Accuracy */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
            <p className="text-2xl font-bold text-stone-900">{deptStats.accuracy.toFixed(1)}%</p>
            <p className="text-xs text-stone-500">Accuracy</p>
          </div>
        </div>

        {/* Progress Visualization */}
        {deptStats.totalAttempts > 0 && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100 mb-6">
            <h3 className="font-bold text-stone-900 mb-4">Performance Overview</h3>
            
            {/* Progress Bars */}
            <div className="space-y-4">
              {/* Pass Rate Bar */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-stone-600">Pass Rate</span>
                  <span className="font-semibold text-stone-900">
                    {deptStats.totalPassed}/{deptStats.totalAttempts} passed
                  </span>
                </div>
                <div className="h-3 bg-stone-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full transition-all duration-500"
                    style={{ width: `${(deptStats.totalPassed / deptStats.totalAttempts) * 100}%` }}
                  />
                </div>
              </div>

              {/* Accuracy Bar */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-stone-600">Overall Accuracy</span>
                  <span className="font-semibold text-stone-900">{deptStats.accuracy.toFixed(1)}%</span>
                </div>
                <div className="h-3 bg-stone-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full transition-all duration-500"
                    style={{ width: `${deptStats.accuracy}%` }}
                  />
                </div>
              </div>

              {/* Average Score Bar */}
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-stone-600">Average Score</span>
                  <span className="font-semibold text-stone-900">{deptStats.averageScore.toFixed(1)}%</span>
                </div>
                <div className="h-3 bg-stone-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-orange-400 to-orange-500 rounded-full transition-all duration-500"
                    style={{ width: `${deptStats.averageScore}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Time Stats */}
            <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-stone-600">Total Time Spent</span>
              </div>
              <span className="font-bold text-stone-900">{formatTime(deptStats.totalTime)}</span>
            </div>
          </div>
        )}

        {/* Exam-wise Performance */}
        {getFilteredExams().length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 mb-6 overflow-hidden">
            <div className="p-4 border-b border-stone-100">
              <h3 className="font-bold text-stone-900">Exam Performance</h3>
            </div>
            <div className="divide-y divide-stone-100">
              {getFilteredExams().map(exam => {
                const examAttempts = allAttempts[exam.id] || [];
                const bestAttempt = examAttempts.length > 0 
                  ? examAttempts.reduce((best, curr) => curr.percentage > best.percentage ? curr : best)
                  : null;
                
                return (
                  <div 
                    key={exam.id}
                    onClick={() => setSelectedExam(selectedExam === exam.id ? null : exam.id)}
                    className="p-4 hover:bg-stone-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          examAttempts.length > 0 
                            ? 'bg-gradient-to-br from-orange-400 to-orange-500' 
                            : 'bg-stone-200'
                        }`}>
                          <svg className={`w-5 h-5 ${examAttempts.length > 0 ? 'text-white' : 'text-stone-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold text-stone-900">{exam.name}</h4>
                          <p className="text-xs text-stone-500">
                            {examAttempts.length} attempt{examAttempts.length !== 1 ? 's' : ''}
                            {bestAttempt && ` • Best: ${bestAttempt.percentage.toFixed(1)}%`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {bestAttempt && (
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            bestAttempt.passed 
                              ? 'bg-yellow-100 text-yellow-700' 
                              : 'bg-amber-100 text-amber-700'
                          }`}>
                            {bestAttempt.passed ? 'Passed' : 'In Progress'}
                          </span>
                        )}
                        <svg className={`w-5 h-5 text-stone-400 transition-transform ${selectedExam === exam.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>

                    {/* Expanded Exam Details */}
                    {selectedExam === exam.id && examAttempts.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-stone-100 space-y-3" onClick={e => e.stopPropagation()}>
                        {examAttempts.slice().reverse().map((attempt, idx) => (
                          <div 
                            key={idx}
                            onClick={() => setExpandedAttempt(expandedAttempt === idx ? null : idx)}
                            className={`p-3 rounded-xl border cursor-pointer transition-all ${
                              attempt.passed 
                                ? 'bg-yellow-50 border-yellow-200' 
                                : 'bg-stone-50 border-stone-200'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                                  attempt.passed ? 'bg-yellow-500 text-white' : 'bg-stone-300 text-stone-600'
                                }`}>
                                  #{attempt.attemptNumber}
                                </span>
                                <div>
                                  <p className="font-semibold text-stone-800">{attempt.percentage.toFixed(1)}%</p>
                                  <p className="text-xs text-stone-500">{formatDate(attempt.date)}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium text-stone-700">{attempt.correctAnswers}/{attempt.totalQuestions}</p>
                                <p className="text-xs text-stone-500">{formatTime(attempt.timeTaken)}</p>
                              </div>
                            </div>

                            {/* Expanded Attempt Details */}
                            {expandedAttempt === idx && (
                              <div className="mt-3 pt-3 border-t border-stone-200 grid grid-cols-3 gap-2">
                                <div className="text-center p-2 bg-white rounded-lg">
                                  <p className="text-lg font-bold text-yellow-600">{attempt.correctAnswers}</p>
                                  <p className="text-xs text-stone-500">Correct</p>
                                </div>
                                <div className="text-center p-2 bg-white rounded-lg">
                                  <p className="text-lg font-bold text-red-600">{attempt.wrongAnswers}</p>
                                  <p className="text-xs text-stone-500">Wrong</p>
                                </div>
                                <div className="text-center p-2 bg-white rounded-lg">
                                  <p className="text-lg font-bold text-amber-600">{attempt.skipped}</p>
                                  <p className="text-xs text-stone-500">Skipped</p>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                        
                        {/* Retake Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/exam/${exam.id}`);
                          }}
                          className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all"
                        >
                          Take Exam Again
                        </button>
                      </div>
                    )}

                    {/* No attempts message */}
                    {selectedExam === exam.id && examAttempts.length === 0 && (
                      <div className="mt-4 pt-4 border-t border-stone-100 text-center" onClick={e => e.stopPropagation()}>
                        <p className="text-sm text-stone-500 mb-3">You haven&apos;t attempted this exam yet</p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/exam/${exam.id}`);
                          }}
                          className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg transition-all"
                        >
                          Start Exam
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Recent Attempts Timeline */}
        {filteredAttempts.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
            <div className="p-4 border-b border-stone-100">
              <h3 className="font-bold text-stone-900">Recent Activity</h3>
            </div>
            <div className="p-4">
              <div className="space-y-4">
                {filteredAttempts.slice(0, 10).map((attempt, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    {/* Timeline Line */}
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${
                        attempt.passed ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      {idx < filteredAttempts.slice(0, 10).length - 1 && (
                        <div className="w-0.5 h-12 bg-stone-200 mt-1" />
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 pb-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-stone-900">{attempt.examName}</p>
                          <p className="text-xs text-stone-500">{formatDate(attempt.date)}</p>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${attempt.passed ? 'text-yellow-600' : 'text-red-600'}`}>
                            {attempt.percentage.toFixed(1)}%
                          </p>
                          <p className="text-xs text-stone-500">Attempt #{attempt.attemptNumber}</p>
                        </div>
                      </div>
                      
                      {/* Mini Stats */}
                      <div className="mt-2 flex gap-3 text-xs">
                        <span className="text-yellow-600">✓ {attempt.correctAnswers}</span>
                        <span className="text-red-600">✗ {attempt.wrongAnswers}</span>
                        <span className="text-amber-600">○ {attempt.skipped}</span>
                        <span className="text-stone-400">• {formatTime(attempt.timeTaken)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {deptStats.totalAttempts === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8 text-center">
            <div className="w-20 h-20 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-stone-800 mb-2">No Attempts Yet</h3>
            <p className="text-stone-500 mb-6 max-w-md mx-auto">
              {selectedDepartment === 'all' 
                ? 'Start taking exams to see your statistics and track your progress!'
                : `No exams attempted in ${departments.find(d => d.id === selectedDepartment)?.name}. Start practicing!`}
            </p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Browse Exams
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
