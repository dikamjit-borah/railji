'use client';

type QuestionStatus = 'current' | 'answered' | 'marked' | 'not-answered' | 'not-visited';

interface QuestionPaletteProps {
  totalQuestions: number;
  currentQuestionIndex: number;
  answers: (number | null)[];
  markedForReview: boolean[];
  visitedQuestions: Set<number>;
  onQuestionJump: (index: number) => void;
  showMobile?: boolean;
  onCloseMobile?: () => void;
}

export default function QuestionPalette({
  totalQuestions,
  currentQuestionIndex,
  answers,
  markedForReview,
  visitedQuestions,
  onQuestionJump,
  showMobile = false,
  onCloseMobile
}: QuestionPaletteProps) {
  const getQuestionStatus = (index: number): QuestionStatus => {
    if (index === currentQuestionIndex) return 'current';
    if (answers[index] !== null) return 'answered';
    if (markedForReview[index]) return 'marked';
    if (visitedQuestions.has(index)) return 'not-answered';
    return 'not-visited';
  };

  const getStatusColor = (status: QuestionStatus): string => {
    switch (status) {
      case 'current':
        return 'bg-blue-500 text-white border-blue-600';
      case 'answered':
        return 'bg-emerald-500 text-white';
      case 'marked':
        return 'bg-amber-500 text-white';
      case 'not-answered':
        return 'bg-rose-500 text-white';
      case 'not-visited':
        return 'bg-stone-200 text-stone-600';
      default:
        return 'bg-stone-200 text-stone-600';
    }
  };

  const answeredCount = answers.filter(a => a !== null).length;
  const markedCount = markedForReview.filter(Boolean).length;
  const skippedCount = answers.filter(a => a === null).length;

  const content = (
    <>
      {/* Stats Summary */}
      <div className="p-5 bg-stone-50 border-b border-stone-100">
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-emerald-50 rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-emerald-600">{answeredCount}</p>
            <p className="text-[10px] text-emerald-700 uppercase tracking-wide">Answered</p>
          </div>
          <div className="bg-stone-100 rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-stone-600">{visitedQuestions.size}</p>
            <p className="text-[10px] text-stone-700 uppercase tracking-wide">Visited</p>
          </div>
          <div className="bg-rose-50 rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-rose-600">{skippedCount}</p>
            <p className="text-[10px] text-rose-700 uppercase tracking-wide">Skipped</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-3 text-center">
            <p className="text-xl font-bold text-amber-600">{markedCount}</p>
            <p className="text-[10px] text-amber-700 uppercase tracking-wide">Review</p>
          </div>
        </div>
      </div>

      {/* Question Overview */}
      <div className="flex-1 overflow-y-auto p-5">
        <p className="text-xs text-stone-500 uppercase tracking-wide mb-3 font-medium">Question Overview</p>
        <div className="grid grid-cols-4 gap-3">
          {Array.from({ length: totalQuestions }).map((_, index) => {
            const status = getQuestionStatus(index);
            const isAnswered = answers[index] !== null;
            const isMarked = markedForReview[index];
            const isVisited = visitedQuestions.has(index);
            const isCurrent = index === currentQuestionIndex;
            
            let buttonStyle = 'border-2 border-stone-300 text-stone-600 bg-white';
            if (isCurrent) {
              buttonStyle = 'border-2 border-teal-500 bg-teal-500 text-white';
            } else if (isAnswered) {
              buttonStyle = 'border-2 border-emerald-500 bg-emerald-500 text-white';
            } else if (isMarked) {
              buttonStyle = 'border-2 border-amber-500 bg-amber-500 text-white';
            } else if (isVisited) {
              buttonStyle = 'border-2 border-rose-500 bg-rose-500 text-white';
            }

            return (
              <button
                key={index}
                onClick={() => {
                  onQuestionJump(index);
                  if (showMobile && onCloseMobile) {
                    onCloseMobile();
                  }
                }}
                className={`h-11 w-11 rounded-full font-semibold transition-all text-sm mx-auto ${buttonStyle}`}
              >
                {index + 1}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-stone-100 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-emerald-500 border-2 border-emerald-500"></div>
            <span className="text-stone-600">Answered</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-rose-500 border-2 border-rose-500"></div>
            <span className="text-stone-600">Not Answered</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-amber-500 border-2 border-amber-500"></div>
            <span className="text-stone-600">Mark of Review</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-white border-2 border-stone-300"></div>
            <span className="text-stone-600">Not Visited</span>
          </div>
        </div>
      </div>
    </>
  );

  // Mobile version - Drawer from right
  if (showMobile) {
    return (
      <div 
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onCloseMobile}
      >
        <div 
          className="absolute top-0 right-0 bottom-0 w-72 sm:w-80 bg-white shadow-2xl flex flex-col animate-slide-right"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-stone-100 bg-stone-50">
            <button
              onClick={onCloseMobile}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-stone-200 transition-colors"
            >
              <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="text-right">
              <h3 className="font-bold text-stone-800">Theory Questions</h3>
              <p className="text-xs text-stone-500">Question : {totalQuestions} Answered : {answeredCount}</p>
            </div>
          </div>
          {content}
        </div>
      </div>
    );
  }

  // Desktop version - only render on desktop screens
  // On mobile, return null when drawer is closed
  return null;
}
