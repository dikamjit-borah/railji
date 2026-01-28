'use client';

interface Question {
  id: number;
  question: {
    en: string;
    hi: string;
  };
  options: {
    en: string[];
    hi: string[];
  };
  correctAnswer: number;
}

interface ExamQuestionProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  selectedAnswer: number | null;
  onSelectAnswer: (optionIndex: number) => void;
}

export default function ExamQuestion({
  question,
  questionIndex,
  totalQuestions,
  selectedAnswer,
  onSelectAnswer
}: ExamQuestionProps) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          {/* Question Header */}
          <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-5 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center font-bold text-lg">
                  {questionIndex + 1}
                </span>
                <span className="text-sm">Question {questionIndex + 1} of {totalQuestions}</span>
              </div>
            </div>
          </div>

          {/* Question Text */}
          <div className="p-5 border-b border-stone-100">
            <p className="text-base font-semibold text-stone-800 leading-relaxed mb-2">
              {question.question.en}
            </p>
            <p className="text-sm text-stone-600 leading-relaxed bg-amber-50/50 p-3 rounded-lg border border-amber-100">
              {question.question.hi}
            </p>
          </div>

          {/* Options */}
          <div className="p-4 space-y-3">
            {question.options.en.map((option, optIndex) => {
              const optionLetter = String.fromCharCode(65 + optIndex);
              const isSelected = selectedAnswer === optIndex;

              return (
                <button
                  key={optIndex}
                  onClick={() => onSelectAnswer(optIndex)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                    isSelected
                      ? 'border-teal-500 bg-teal-50 shadow-md'
                      : 'border-stone-200 bg-white hover:border-teal-300 hover:bg-teal-50/30'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center font-bold text-base transition-all ${
                      isSelected
                        ? 'bg-teal-500 text-white'
                        : 'bg-stone-100 text-stone-600'
                    }`}>
                      {optionLetter}
                    </span>
                    <div className="flex-1 pt-1">
                      <p className={`text-sm font-medium mb-1 ${
                        isSelected ? 'text-teal-800' : 'text-stone-700'
                      }`}>
                        {option}
                      </p>
                      <p className={`text-xs ${
                        isSelected ? 'text-teal-600' : 'text-stone-500'
                      }`}>
                        {question.options.hi[optIndex]}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="flex-shrink-0 w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
