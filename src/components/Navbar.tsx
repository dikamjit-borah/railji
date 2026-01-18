'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Navbar() {
  const router = useRouter();

  const exams = [
    { id: 'je', name: 'JE' },
    { id: 'ntpc', name: 'NTPC' },
    { id: 'jr-clerk', name: 'Jr. Clerk' }
  ];

  const handleExamClick = (examId: string) => {
    router.push(`/exam/${examId}`);
  };

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">R</span>
              </div>
              <span className="text-2xl font-bold text-gray-800 dark:text-white">
                Railje
              </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            {exams.map((exam) => (
              <button
                key={exam.id}
                onClick={() => handleExamClick(exam.id)}
                className="px-2 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-md"
              >
                {exam.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
