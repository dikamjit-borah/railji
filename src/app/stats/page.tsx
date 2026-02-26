'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/common/Navbar';
import {
  STATS_DEPARTMENTS,
  getMockExamAttempts,
  computeOverviewStats,
  computePaperStats,
  computeScoreTrend,
  formatTimeTaken,
  getDepartmentName,
} from '@/lib/mockStatsData';
import type {
  ExamAttemptRecord,
  OverviewStats,
  PaperStats,
  ScoreTrendPoint,
} from '@/lib/statsTypes';

// ==================== SVG CHART COMPONENTS ====================

/** Score trend line chart - pure SVG */
function ScoreTrendChart({ data }: { data: ScoreTrendPoint[] }) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  if (data.length === 0) return null;

  const W = 100; // viewBox width %
  const H = 32;
  const PLOT_PAD = 6; // inset for data points so edge circles aren't clipped
  const PAD_Y = 5;
  const plotW = W - PLOT_PAD * 2;
  const plotH = H - PAD_Y * 2;
  const maxY = Math.max(100, ...data.map(d => d.percentage));

  const points = data.map((d, i) => ({
    x: PLOT_PAD + (data.length > 1 ? (i / (data.length - 1)) * plotW : plotW / 2),
    y: PAD_Y + plotH - (d.percentage / maxY) * plotH,
    ...d,
  }));

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const areaPath = `${linePath} L${points[points.length - 1].x},${PAD_Y + plotH} L${points[0].x},${PAD_Y + plotH} Z`;

  // Horizontal grid lines
  const gridLines = [0, 25, 50, 75, 100].map(pct => ({
    y: PAD_Y + plotH - (pct / maxY) * plotH,
    label: `${pct}%`,
  }));

  return (
    <div className="w-full">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f97316" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#f97316" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ea580c" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {gridLines.map((g, i) => (
          <g key={i}>
            <line x1={0} y1={g.y} x2={W} y2={g.y} stroke="#e7e5e4" strokeWidth="0.15" />
            <text x={0.8} y={g.y - 0.6} fill="#a8a29e" fontSize="1.5" textAnchor="start" opacity="0.75">{g.label}</text>
          </g>
        ))}

        {/* Area fill */}
        <path d={areaPath} fill="url(#areaGrad)" />

        {/* Line */}
        <path d={linePath} fill="none" stroke="url(#lineGrad)" strokeWidth="0.4" strokeLinecap="round" strokeLinejoin="round" />

        {/* Data points */}
        {points.map((p, i) => (
          <g
            key={i}
            onMouseEnter={() => setHoveredIdx(i)}
            onMouseLeave={() => setHoveredIdx(null)}
            style={{ cursor: 'pointer' }}
          >
            {/* Larger invisible hit area */}
            <circle cx={p.x} cy={p.y} r="3" fill="transparent" />
            <circle cx={p.x} cy={p.y} r="0.8" fill="white" stroke="#f97316" strokeWidth="0.3" />
            {p.isPassed && (
              <circle cx={p.x} cy={p.y} r="1.1" fill="none" stroke="#22c55e" strokeWidth="0.25" />
            )}
          </g>
        ))}

        {/* Hover tooltip */}
        {hoveredIdx !== null && (() => {
          const p = points[hoveredIdx];
          const rawLabel = `${p.paperName}`;
          const label = rawLabel.length > 40 ? rawLabel.slice(0, 39) + '…' : rawLabel;
          const tW = Math.min(label.length * 0.85 + 0.5, 88);
          const tH = 4;
          const tX = Math.min(Math.max(p.x - tW / 2, 1), W - 1 - tW);
          const tY = p.y - tH - 1.8 < PAD_Y ? p.y + 1.8 : p.y - tH - 1.8;
          return (
            <g style={{ pointerEvents: 'none' }}>
              <rect x={tX} y={tY} width={tW} height={tH} rx="0.8" fill="#1c1917" opacity="0.88" />
              <text
                x={tX + tW / 2}
                y={tY + 2.7}
                textAnchor="middle"
                fontSize="1.5"
                fill="white"
                fontWeight="500"
              >{label}</text>
            </g>
          );
        })()}
      </svg>
    </div>
  );
}

/** Horizontal bar for paper performance */
function PaperBar({ paper, maxPct }: { paper: PaperStats; maxPct: number }) {
  const barWidth = maxPct > 0 ? (paper.bestPercentage / maxPct) * 100 : 0;
  const dept = STATS_DEPARTMENTS.find(d => d.id === paper.departmentId);
  
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-stone-700 font-medium truncate max-w-[60%]">{paper.paperName}</span>
        <span className="text-xs font-bold text-stone-800">{paper.bestPercentage.toFixed(1)}%</span>
      </div>
      <div className="h-2.5 bg-stone-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${dept?.color || 'from-orange-500 to-orange-600'} transition-all duration-700`}
          style={{ width: `${barWidth}%` }}
        />
      </div>
      <div className="flex items-center gap-2 text-[10px] text-stone-400">
        <span>{paper.totalAttempts} attempt{paper.totalAttempts !== 1 ? 's' : ''}</span>
        <span>&bull;</span>
        <span>Avg: {paper.averagePercentage.toFixed(1)}%</span>
        {paper.hasPassed && (
          <>
            <span>&bull;</span>
            <span className="text-green-600 font-semibold">&#10003; Passed</span>
          </>
        )}
      </div>
    </div>
  );
}

// ==================== MAIN COMPONENT ====================

export default function StatsPage() {
  const router = useRouter();
  const [selectedDept, setSelectedDept] = useState('all');
  const [expandedPaper, setExpandedPaper] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [historyView, setHistoryView] = useState<'history' | 'activity'>('history');
  const [trendPaperId, setTrendPaperId] = useState('all');

  useEffect(() => {
    // Simulate async data loading (future: replace with API call)
    setIsLoaded(true);
  }, []);

  // Memoized derived data
  const attempts = useMemo(() => getMockExamAttempts(selectedDept), [selectedDept]);
  const overview = useMemo(() => computeOverviewStats(attempts), [attempts]);
  const papers = useMemo(() => computePaperStats(attempts), [attempts]);

  const maxPaperPct = useMemo(
    () => Math.max(1, ...papers.map(p => p.bestPercentage)),
    [papers]
  );

  // Filtered attempts for Score Trend based on selected paper
  const filteredTrendAttempts = useMemo(() => {
    if (trendPaperId === 'all') return attempts;
    const [pId, dId] = trendPaperId.split('|');
    return attempts.filter(a => a.paperId === pId && a.departmentId === dId);
  }, [attempts, trendPaperId]);
  const filteredScoreTrend = useMemo(() => computeScoreTrend(filteredTrendAttempts), [filteredTrendAttempts]);

  // Active departments (ones that have at least 1 attempt), excluding 'all'
  const activeDepts = useMemo(() => {
    const allAttempts = getMockExamAttempts();
    const deptIds = new Set(allAttempts.map(a => a.departmentId));
    return STATS_DEPARTMENTS.filter(d => d.id !== 'all' && deptIds.has(d.id));
  }, []);

  // Auto-select the first department on load
  useEffect(() => {
    if (activeDepts.length > 0 && selectedDept === 'all') {
      setSelectedDept(activeDepts[0].id);
    }
  }, [activeDepts]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
    });
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center">
        <div className="animate-pulse text-stone-400">Loading stats...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Header */}
      <Navbar
        variant="stats"
        title="My Statistics"
        subtitle="Track your exam performance"
        backHref="/"
        statsInfo={`${overview.totalAttempts} total attempts`}
      />

      {/* Department Filter */}
      <div className="bg-white border-b border-stone-100 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {activeDepts.map(dept => (
              <button
                key={dept.id}
                onClick={() => {
                  setSelectedDept(dept.id);
                  setExpandedPaper(null);
                  setHistoryView('history');
                  setTrendPaperId('all');
                }}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all text-sm font-medium ${
                  selectedDept === dept.id
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-200/50'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {dept.id === 'GENERAL' ? 'General' : dept.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">

        {/* =============== STATS OVERVIEW CARDS =============== */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Total Attempts */}
          <div className="bg-white rounded-xl p-3 shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center mb-2">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-lg font-bold text-stone-900">{overview.totalAttempts}</p>
            <p className="text-[11px] text-stone-500">Total Attempts</p>
          </div>

          {/* Pass Rate */}
          <div className="bg-white rounded-xl p-3 shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center mb-2">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-lg font-bold text-stone-900">{overview.passRate.toFixed(0)}%</p>
            <p className="text-[11px] text-stone-500">Pass Rate ({overview.totalPassed}/{overview.totalAttempts})</p>
          </div>

          {/* Best Score */}
          <div className="bg-white rounded-xl p-3 shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-2">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <p className="text-lg font-bold text-stone-900">{overview.bestScore.toFixed(1)}%</p>
            <p className="text-[11px] text-stone-500">Best Score</p>
          </div>

          {/* Average Accuracy */}
          <div className="bg-white rounded-xl p-3 shadow-sm border border-stone-100 hover:shadow-md transition-shadow">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center mb-2">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-lg font-bold text-stone-900">{overview.averageAccuracy.toFixed(1)}%</p>
            <p className="text-[11px] text-stone-500">Avg Accuracy</p>
          </div>
        </div>

        {/* =============== CHARTS ROW =============== */}
        {overview.totalAttempts > 0 && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
            <div className="flex items-start justify-between mb-4 gap-3">
              <div className="min-w-0">
                <h3 className="font-bold text-stone-900">Score Trend</h3>
                <p className="text-xs text-stone-500">
                  {trendPaperId === 'all'
                    ? `All ${filteredScoreTrend.length} attempts`
                    : `${filteredScoreTrend.length} attempt${filteredScoreTrend.length !== 1 ? 's' : ''} for selected paper`}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <select
                  value={trendPaperId}
                  onChange={e => setTrendPaperId(e.target.value)}
                  className="text-xs border border-stone-200 rounded-lg px-2 py-1 bg-white text-stone-700 focus:outline-none focus:ring-1 focus:ring-orange-400 max-w-[220px] truncate"
                >
                  <option value="all">All Papers</option>
                  {papers.map(p => (
                    <option key={p.paperId + p.departmentId} value={`${p.paperId}|${p.departmentId}`}>
                      {p.paperName}
                    </option>
                  ))}
                </select>
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                    <span className="text-stone-500">Score %</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500 ring-1 ring-green-300" />
                    <span className="text-stone-500">Passed</span>
                  </div>
                </div>
              </div>
            </div>
            <ScoreTrendChart data={filteredScoreTrend} />
          </div>
        )}

        {/* =============== EXAM HISTORY / RECENT ACTIVITY =============== */}
        {papers.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
            {/* Toggle header */}
            <div className="p-4 border-b border-stone-100 flex items-center justify-between gap-3">
              <div className="flex bg-stone-100 rounded-xl p-1 gap-1">
                <button
                  onClick={() => { setHistoryView('history'); setExpandedPaper(null); }}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                    historyView === 'history'
                      ? 'bg-white text-stone-900 shadow-sm'
                      : 'text-stone-500 hover:text-stone-700'
                  }`}
                >
                  Exam History
                </button>
                <button
                  onClick={() => { setHistoryView('activity'); }}
                  className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                    historyView === 'activity'
                      ? 'bg-white text-stone-900 shadow-sm'
                      : 'text-stone-500 hover:text-stone-700'
                  }`}
                >
                  Recent Activity
                </button>
              </div>
              <span className="text-xs text-stone-400">
                {historyView === 'history'
                  ? `${papers.length} paper${papers.length !== 1 ? 's' : ''}`
                  : `${attempts.length} attempt${attempts.length !== 1 ? 's' : ''}`}
              </span>
            </div>
            {/* Exam History view */}
            {historyView === 'history' && (<>
            <div className="divide-y divide-stone-100 overflow-y-auto max-h-[420px]">
              {papers.map(paper => {
                const isExpanded = expandedPaper === (paper.paperId + paper.departmentId);
                const deptInfo = STATS_DEPARTMENTS.find(d => d.id === paper.departmentId);

                return (
                  <div key={paper.paperId + paper.departmentId}>
                    {/* Paper row */}
                    <button
                      onClick={() => setExpandedPaper(isExpanded ? null : paper.paperId + paper.departmentId)}
                      className="w-full p-4 hover:bg-stone-50 transition-colors text-left"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center bg-gradient-to-br ${deptInfo?.color || 'from-orange-500 to-orange-600'}`}>
                            <span className="text-lg">{deptInfo?.icon || '📄'}</span>
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-semibold text-stone-900 truncate">{paper.paperName}</h4>
                            <div className="flex items-center gap-2 text-xs text-stone-500 mt-0.5">
                              <span>{paper.totalAttempts} attempt{paper.totalAttempts !== 1 ? 's' : ''}</span>
                              <span>&bull;</span>
                              <span>Best: {paper.bestPercentage.toFixed(1)}%</span>
                              <span>&bull;</span>
                              <span>{formatDate(paper.lastAttempted)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {paper.hasPassed && (
                            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                              Passed
                            </span>
                          )}
                          <svg className={`w-5 h-5 text-stone-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </button>

                    {/* Expanded attempts */}
                    {isExpanded && (
                      <div className="px-4 pb-4 space-y-2">
                        {paper.attempts.slice().reverse().map((attempt, idx) => (
                          <div
                            key={attempt._id}
                            className={`p-3 rounded-xl border transition-all ${
                              attempt.isPassed
                                ? 'bg-green-50 border-green-200'
                                : 'bg-stone-50 border-stone-200'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                                  attempt.isPassed ? 'bg-green-500 text-white' : 'bg-stone-300 text-stone-600'
                                }`}>
                                  #{paper.attempts.length - idx}
                                </span>
                                <div>
                                  <p className="font-semibold text-stone-800">{attempt.percentage.toFixed(1)}%</p>
                                  <p className="text-xs text-stone-500">{formatDateTime(attempt.createdAt)}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <div className="text-right hidden sm:block">
                                  <p className="text-sm font-medium text-stone-700">
                                    {attempt.correctAnswers}/{attempt.totalQuestions}
                                  </p>
                                  <p className="text-xs text-stone-500">{formatTimeTaken(attempt.timeTaken)}</p>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    router.push(`/exam/result/${attempt.examId}`);
                                  }}
                                  className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-semibold hover:shadow-md transition-all"
                                >
                                  View Result
                                </button>
                              </div>
                            </div>

                            {/* Mini stats row */}
                            <div className="mt-2 flex gap-3 text-xs sm:hidden">
                              <span className="text-green-600">&#10003; {attempt.correctAnswers}</span>
                              <span className="text-red-600">&#10007; {attempt.incorrectAnswers}</span>
                              <span className="text-stone-400">&#9675; {attempt.unattemptedQuestions}</span>
                              <span className="text-stone-400 ml-auto">{formatTimeTaken(attempt.timeTaken)}</span>
                            </div>
                          </div>
                        ))}

                        {/* Retake Button */}
                        <button
                          onClick={() => router.push(`/departments`)}
                          className="w-full py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-semibold text-sm transition-all"
                        >
                          Take Another Exam
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            </>)}

            {/* Recent Activity view */}
            {historyView === 'activity' && (<>
            <div className="p-4 overflow-y-auto max-h-[420px]">
              <div className="space-y-1">
                {attempts.map((attempt, idx, arr) => (
                  <div key={attempt._id} className="flex items-start gap-4">
                    {/* Timeline line */}
                    <div className="flex flex-col items-center pt-1">
                      <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                        attempt.isPassed ? 'bg-green-500' : 'bg-orange-400'
                      }`} />
                      {idx < arr.length - 1 && (
                        <div className="w-0.5 h-14 bg-stone-200 mt-1" />
                      )}
                    </div>
                    {/* Content */}
                    <div className="flex-1 pb-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="font-semibold text-stone-900 text-sm truncate">{attempt.paperName}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-stone-400">{formatDateTime(attempt.createdAt)}</span>
                            <span className="text-xs px-1.5 py-0.5 rounded bg-stone-100 text-stone-500">
                              {getDepartmentName(attempt.departmentId)}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <p className={`text-sm font-bold ${attempt.isPassed ? 'text-green-600' : 'text-orange-600'}`}>
                            {attempt.percentage.toFixed(1)}%
                          </p>
                          <button
                            onClick={() => router.push(`/exam/result/${attempt.examId}`)}
                            className="p-1.5 rounded-lg hover:bg-stone-100 transition-colors"
                            title="View Result"
                          >
                            <svg className="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="mt-1.5 flex gap-3 text-xs">
                        <span className="text-green-600">&#10003; {attempt.correctAnswers}</span>
                        <span className="text-red-600">&#10007; {attempt.incorrectAnswers}</span>
                        <span className="text-stone-400">&#9675; {attempt.unattemptedQuestions}</span>
                        <span className="text-stone-400">&bull; {formatTimeTaken(attempt.timeTaken)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            </>)}
          </div>
        )}

        {/* =============== PAPER-WISE PERFORMANCE (BAR CHART) =============== */}
        {papers.length > 0 && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-stone-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-stone-900">Paper-wise Best Scores</h3>
                <p className="text-xs text-stone-500">{papers.length} unique paper{papers.length !== 1 ? 's' : ''} attempted</p>
              </div>
            </div>
            <div className="space-y-4 overflow-y-auto max-h-[360px] pr-1">
              {papers.map(paper => (
                <PaperBar key={paper.paperId + paper.departmentId} paper={paper} maxPct={maxPaperPct} />
              ))}
            </div>
          </div>
        )}

        {/* =============== EMPTY STATE =============== */}
        {overview.totalAttempts === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8 text-center">
            <div className="w-20 h-20 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-stone-800 mb-2">No Attempts Yet</h3>
            <p className="text-stone-500 mb-6 max-w-md mx-auto">
              {selectedDept === 'all'
                ? 'Start taking exams to see your statistics and track your progress!'
                : `No exams attempted in ${STATS_DEPARTMENTS.find(d => d.id === selectedDept)?.name}. Start practicing!`}
            </p>
            <button
              onClick={() => router.push('/departments')}
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
