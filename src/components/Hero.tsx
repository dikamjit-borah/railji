export default function Hero() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 dark:text-white mb-6">
            Master Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">
              Railway Exams
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Prepare for JE, NTPC, and Jr. Clerk exams with our comprehensive practice platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-4 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold text-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-xl">
              Start Practicing
            </button>
            <button className="px-8 py-4 rounded-lg border-2 border-blue-500 text-blue-500 font-bold text-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-300">
              Learn More
            </button>
          </div>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <div className="text-4xl font-bold text-blue-500 mb-2">45+</div>
            <div className="text-gray-600 dark:text-gray-300">Practice Questions</div>
          </div>
          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <div className="text-4xl font-bold text-indigo-500 mb-2">3</div>
            <div className="text-gray-600 dark:text-gray-300">Exam Categories</div>
          </div>
          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
            <div className="text-4xl font-bold text-purple-500 mb-2">100%</div>
            <div className="text-gray-600 dark:text-gray-300">Free Access</div>
          </div>
        </div>
      </div>
    </section>
  );
}
