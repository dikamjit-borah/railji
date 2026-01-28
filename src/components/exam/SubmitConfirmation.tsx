'use client';

interface SubmitConfirmationProps {
  totalQuestions: number;
  answeredCount: number;
  visitedCount: number;
  skippedCount: number;
  markedCount: number;
  answers: (number | null)[];
  markedForReview: boolean[];
  visitedQuestions: Set<number>;
  onSubmit: () => void;
  onCancel: () => void;
  onQuestionJump: (index: number) => void;
}

export default function SubmitConfirmation({
  totalQuestions,
  answeredCount,
  visitedCount,
  skippedCount,
  markedCount,
  answers,
  markedForReview,
  visitedQuestions,
  onSubmit,
  onCancel,
  onQuestionJump
}: SubmitConfirmationProps) {
  const getQuestionStatus = (index: number) => {
    const isAnswered = answers[index] !== null;
    const isMarked = markedForReview[index];
    
    if (isAnswered) return 'bg-emerald-500 text-white';
    if (isMarked) return 'bg-amber-500 text-white';
    if (visitedQuestions.has(index)) return 'bg-rose-500 text-white';
    return 'bg-stone-200 text-stone-600';
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-stone-100">
          <h2 className="text-xl font-bold text-stone-800 mb-1">Submit Exam Confirmation</h2>
          <p className="text-sm text-stone-500">Review your answers before final submission</p>
        </div>

        {/* Stats Summary */}
        <div className="p-5 bg-stone-50 border-b border-stone-100">
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-emerald-50 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-emerald-600">{answeredCount}</p>
              <p className="text-[10px] text-emerald-700 uppercase tracking-wide">Answered</p>
            </div>
            <div className="bg-stone-100 rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-stone-600">{visitedCount}</p>
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
          <div className="grid grid-cols-8 gap-2">
            {Array.from({ length: totalQuestions }).map((_, index) => {
              const statusColor = getQuestionStatus(index);

              return (
                <button
                  key={index}
                  onClick={() => {
                    onCancel();
                    onQuestionJump(index);
                  }}
                  className={`h-8 rounded-lg font-medium text-xs transition-all hover:scale-105 ${statusColor}`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
          
          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 mt-5 pt-4 border-t border-stone-100 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-emerald-500"></div>
              <span className="text-stone-600">Answered</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-rose-500"></div>
              <span className="text-stone-600">Not Answered</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-amber-500"></div>
              <span className="text-stone-600">For Review</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-stone-200"></div>
              <span className="text-stone-600">Not Visited</span>
            </div>
          </div>

          {/* Warning Message */}
          <div className="mt-5 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <p className="text-xs text-amber-800 text-center">
              ⚠️ You cannot change your answers after submission
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-5 border-t border-stone-100 bg-stone-50">
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 py-3 bg-white border-2 border-stone-300 text-stone-700 rounded-xl font-semibold hover:bg-stone-100 transition-all"
            >
              Go Back
            </button>
            <button
              onClick={onSubmit}
              className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Submit Exam
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
