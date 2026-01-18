'use client';

import { useState, useEffect } from 'react';
import examData from '@/data/exams.json';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface ExamModalProps {
  examId: string;
  onClose: () => void;
}

export default function ExamModal({ examId, onClose }: ExamModalProps) {
  const [isStarted, setIsStarted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const exam = examData.exams.find(e => e.id === examId);
  const questions = examData.questions[examId as keyof typeof examData.questions] as Question[];

  useEffect(() => {
    if (exam && isStarted && !showResults) {
      setTimeLeft(exam.duration * 60);
    }
  }, [exam, isStarted, showResults]);

  useEffect(() => {
    if (timeLeft > 0 && isStarted && !showResults) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && isStarted && !showResults) {
      handleSubmit();
    }
  }, [timeLeft, isStarted, showResults]);

  const handleStart = () => {
    setIsStarted(true);
    setSelectedAnswers(new Array(questions.length).fill(null));
  };

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswer) {
        correct++;
      }
    });
    return {
      correct,
      total: questions.length,
      percentage: Math.round((correct / questions.length) * 100)
    };
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!exam || !questions) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {!isStarted ? (
          <div className="p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {exam.name}
                </h2>
                <p className="text-gray-600 dark:text-gray-300">{exam.description}</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="bg-blue-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Exam Details:</h3>
              <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                <li>• Total Questions: {exam.totalQuestions}</li>
                <li>• Duration: {exam.duration} minutes</li>
                <li>• Passing Marks: {exam.passingMarks}%</li>
                <li>• Each question carries equal marks</li>
              </ul>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4 mb-6">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Instructions:</h4>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>• Read each question carefully before answering</li>
                <li>• You can navigate between questions using Next/Previous buttons</li>
                <li>• The exam will auto-submit when time expires</li>
                <li>• You can review your answers after submission</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleStart}
                className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-md"
              >
                Start Exam
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 dark:text-gray-300 dark:border-gray-600 font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : showResults ? (
          <div className="p-8">
            <div className="text-center mb-8">
              <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-4 ${
                calculateScore().percentage >= exam.passingMarks
                  ? 'bg-green-100 text-green-500'
                  : 'bg-red-100 text-red-500'
              }`}>
                <span className="text-4xl font-bold">{calculateScore().percentage}%</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {calculateScore().percentage >= exam.passingMarks ? 'Congratulations!' : 'Keep Practicing!'}
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                You scored {calculateScore().correct} out of {calculateScore().total} questions
              </p>
            </div>

            <div className="space-y-6 mb-8">
              {questions.map((question, index) => (
                <div key={question.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-blue-500 text-white font-bold text-sm">
                      {index + 1}
                    </span>
                    <p className="text-gray-900 dark:text-white font-medium flex-1">
                      {question.question}
                    </p>
                  </div>

                  <div className="space-y-2 ml-11">
                    {question.options.map((option, optIndex) => (
                      <div
                        key={optIndex}
                        className={`p-3 rounded-lg ${
                          optIndex === question.correctAnswer
                            ? 'bg-green-100 dark:bg-green-900/30 border-2 border-green-500'
                            : selectedAnswers[index] === optIndex
                            ? 'bg-red-100 dark:bg-red-900/30 border-2 border-red-500'
                            : 'bg-white dark:bg-gray-600'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {optIndex === question.correctAnswer && (
                            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                          )}
                          {selectedAnswers[index] === optIndex && optIndex !== question.correctAnswer && (
                            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                          )}
                          <span className="text-gray-800 dark:text-gray-200">{option}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {question.explanation && (
                    <div className="mt-4 ml-11 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        <span className="font-semibold">Explanation:</span> {question.explanation}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setIsStarted(false);
                  setShowResults(false);
                  setCurrentQuestion(0);
                  setSelectedAnswers([]);
                }}
                className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-md"
              >
                Retake Exam
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 dark:text-gray-300 dark:border-gray-600 font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Question {currentQuestion + 1} of {questions.length}
                </h3>
                <div className="flex gap-4 mt-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Answered: {selectedAnswers.filter(a => a !== null).length}/{questions.length}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-2xl font-bold ${timeLeft < 300 ? 'text-red-500' : 'text-blue-500'}`}>
                  {formatTime(timeLeft)}
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Time Remaining</span>
              </div>
            </div>

            <div className="mb-8">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 mb-6">
                <p className="text-lg text-gray-900 dark:text-white font-medium">
                  {questions[currentQuestion].question}
                </p>
              </div>

              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                      selectedAnswers[currentQuestion] === index
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30'
                        : 'border-gray-300 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedAnswers[currentQuestion] === index
                          ? 'border-blue-500 bg-blue-500'
                          : 'border-gray-400'
                      }`}>
                        {selectedAnswers[currentQuestion] === index && (
                          <div className="w-3 h-3 rounded-full bg-white"></div>
                        )}
                      </div>
                      <span className="text-gray-800 dark:text-gray-200">{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <button
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
                className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 dark:text-gray-300 dark:border-gray-600 font-semibold hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <div className="flex gap-2">
                {questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestion(index)}
                    className={`w-8 h-8 rounded-full text-sm font-semibold ${
                      index === currentQuestion
                        ? 'bg-blue-500 text-white'
                        : selectedAnswers[index] !== null
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

              {currentQuestion === questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white font-bold hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-md"
                >
                  Submit
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-md"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
