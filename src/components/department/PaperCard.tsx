import Link from 'next/link';
import { ExamPaper } from '@/lib/types';

interface PaperCardProps {
  paper: ExamPaper;
  index: number;
  href: string;
  isLocked?: boolean;
  upgradeHref?: string;
  departmentName?: string;
}

const formatAttempts = (num: number | undefined) => {
  if (!num) return '0';
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
};

export default function PaperCard({
  paper,
  index,
  href,
  isLocked = false,
  upgradeHref,
  departmentName,
}: PaperCardProps) {
  const targetHref = isLocked && upgradeHref ? upgradeHref : href;
  const requiredPlanCopy = `${departmentName || 'This'} dept. subscription required`;

  return (
    <Link
      href={targetHref}
      className="relative w-full bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 text-left shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 group border border-stone-100 overflow-hidden block"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Hover Overlay */}
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20 rounded-xl sm:rounded-2xl ${
          isLocked
            ? 'bg-[#FFF8F3]/90 backdrop-blur-[3px]'
            : 'bg-gradient-to-br from-orange-600/20 to-orange-500/20 backdrop-blur-[2px]'
        }`}
      >
        {isLocked ? (
          <div className="flex flex-col items-center justify-center text-center transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 w-full px-3 sm:px-4">
            <div className="w-9 h-9 sm:w-14 sm:h-14 rounded-full bg-white flex items-center justify-center shadow-[0_8px_24px_rgba(207,93,69,0.15)] mb-2 sm:mb-3">
              <svg className="w-5 h-5 sm:w-7 sm:h-7 text-[#CF5D49]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <h4 className="text-stone-900 text-sm sm:text-lg font-bold tracking-tight mb-1 sm:mb-1.5">
              Subscribe to Attempt
            </h4>
            <p className="text-stone-500 text-[10px] sm:text-xs mb-2.5 sm:mb-4 leading-snug">
              {requiredPlanCopy}
            </p>
            <div className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 sm:px-7 sm:py-3 bg-gradient-to-r from-[#D75C37] to-[#DF7F2D] text-white font-semibold text-xs sm:text-sm shadow-[0_8px_20px_rgba(215,92,55,0.3)]">
               <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13"><path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm0 2h14v2H5v-2z"/></svg>
              <span>Upgrade Plan</span>
            </div>
          </div>
        ) : (
          <div className="text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <div className="bg-white text-orange-700 px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
              Start Exam
              <svg className="w-3 h-3 sm:w-4 sm:h-4 inline-block ml-1.5 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
            <p className="text-white text-xxs sm:text-xs mt-1.5 sm:mt-2 opacity-90">{paper.questions} Questions · {paper.duration} Minutes</p>
          </div>
        )}
      </div>

      {/* Instructor Row */}
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-xxs sm:text-xs text-stone-400">Instructor</span>
          <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center">
            <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          </div>
        </div>
        {(isLocked || paper.isNew) && (
          <div className="flex items-center gap-1.5 sm:gap-2">
            {isLocked && (
              <span className="inline-flex items-center gap-1 sm:gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-[#EAB8AF] bg-[#FDF1EE] text-[#CF5D49] text-[9px] sm:text-xs font-semibold leading-none">
                <svg className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8.25 10.5V7.875a3.75 3.75 0 117.5 0V10.5m-9 0h10.5a1.5 1.5 0 011.5 1.5v6a1.5 1.5 0 01-1.5 1.5H6.75a1.5 1.5 0 01-1.5-1.5v-6a1.5 1.5 0 011.5-1.5z" />
                </svg>
                Locked
              </span>
            )}
            {paper.isNew && (
              <span className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-xl text-[9px] sm:text-xs font-bold leading-none bg-orange-500 text-white">
                NEW
              </span>
            )}
          </div>
        )}
      </div>

      {/* Title & Price Row */}
      <div className="flex items-start justify-between gap-2 sm:gap-3 mb-1.5 sm:mb-2">
        <h3
          className="text-sm sm:text-lg font-bold text-stone-900 leading-tight group-hover:text-orange-700 transition-colors truncate"
          style={{ maxWidth: '100%' }}
          title={paper.name}
        >
          {paper.name}
        </h3>
        {
          paper.isFree && ( 
            <div className="text-right flex-shrink-0">
              {/* <div className="text-[9px] sm:text-[10px] text-stone-400 line-through">₹299</div> */}
              <div className="text-[10px] sm:text-base font-bold text-orange-600 border border-stone-200 bg-stone-50 px-1 sm:px-2 py-px sm:py-0.5 rounded">
                Free
              </div>
            </div>
          )
        }
        
      </div>

      {/* Description */}
      <p
        className="text-stone-500 text-xxs sm:text-xs mb-2 sm:mb-3 line-clamp-2 overflow-hidden text-ellipsis"
        style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
        title={paper.description}
      >
        {paper.description}
      </p>

      {/* Stats */}
      <div className="space-y-1 sm:space-y-1.5 mb-2 sm:mb-3">
        <div className="flex items-center gap-1 sm:gap-1.5 text-xxs sm:text-xs text-stone-600">
          <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{paper.year} · {paper.shift}</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-1.5 text-xxs sm:text-xs text-stone-600">
          <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span>{paper.questions} questions · {paper.duration} min</span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-stone-100 pt-2 sm:pt-3">
        {/* Bottom Row */}
        <div className="flex items-center justify-between">
          <span className="text-xxs sm:text-xs text-stone-400">
            {formatAttempts(paper.usersAttempted)} people attempted
          </span>
          <div className="flex items-center gap-0.5 sm:gap-1">
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="text-xxs sm:text-xs font-semibold text-stone-700">{paper.rating}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
