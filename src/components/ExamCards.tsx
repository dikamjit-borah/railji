'use client';

import { useRouter } from 'next/navigation';
import examData from '@/data/exams.json';

export default function ExamCards() {
  const router = useRouter();

  const handleStartExam = (examId: string) => {
    router.push(`/exam/${examId}`);
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-white mb-12">
          Choose Your Exam
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {examData.exams.map((exam) => (
            <div
              key={exam.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {exam.name}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {exam.description}
                </p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Duration: {exam.duration} minutes</span>
                  </div>
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Questions: {exam.totalQuestions}</span>
                  </div>
                  <div className="flex items-center text-gray-700 dark:text-gray-300">
                    <svg className="w-5 h-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    <span>Passing: {exam.passingMarks}%</span>
                  </div>
                </div>
                
                <button
                  onClick={() => handleStartExam(exam.id)}
                  className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-md"
                >
                  Start Exam
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
