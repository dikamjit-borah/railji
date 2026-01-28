'use client';

interface ExamPaper {
  id: string;
  name: string;
  description: string;
  year: string;
  shift: string;
  questions: number;
  duration: number;
  attempts: number;
  rating: number;
  isFree: boolean;
  isNew?: boolean;
  examId: string;
}

interface PaperCardProps {
  paper: ExamPaper;
  index: number;
  onSelect: (paper: ExamPaper) => void;
}

const formatAttempts = (num: number) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
};

export default function PaperCard({ paper, index, onSelect }: PaperCardProps) {
  return (
    <button
      onClick={() => onSelect(paper)}
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
    </button>
  );
}
