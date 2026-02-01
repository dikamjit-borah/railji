export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      title: 'Choose Your Department',
      description: 'Select from 8 railway departments including Civil, Mechanical, Electrical, and more based on your current role or career goals.',
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
        </svg>
      )
    },
    {
      number: '02',
      title: 'Access Exam Papers',
      description: 'Browse authentic departmental exam papers organized by year and location. All papers available in both Hindi and English.',
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      )
    },
    {
      number: '03',
      title: 'Take Practice Exams',
      description: 'Attempt full-length exam papers with realistic timing and conditions. Switch between Hindi and English during the exam.',
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      number: '04',
      title: 'Review & Improve',
      description: 'Get instant results with detailed explanations. Download study materials and PDFs to strengthen your preparation.',
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      )
    }
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-stone-50 to-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-stone-900 mb-3 sm:mb-4 lg:mb-6">
            How It Works
          </h2>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed px-4">
            Get started with your departmental exam preparation in four simple steps
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 lg:gap-6">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector Line - Desktop only */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-orange-200 to-transparent -translate-x-1/2 z-0"></div>
              )}
              
              {/* Step Card */}
              <div className="relative bg-gradient-to-br from-white via-white to-orange-50/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-stone-100 hover:border-orange-200 hover:-translate-y-1">
                {/* Number Badge */}
                <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-400 to-orange-600 text-white font-bold text-base sm:text-lg rounded-full mb-3 sm:mb-4 shadow-md">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="text-orange-600 mb-3 sm:mb-4">
                  {step.icon}
                </div>

                {/* Content */}
                <h3 className="text-sm sm:text-xl font-bold text-stone-900 mb-1.5 sm:mb-3 leading-tight">
                  {step.title}
                </h3>
                <p className="text-stone-600 text-xs leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 sm:mt-12 lg:mt-16 text-center">
          <p className="text-stone-600 mb-4 sm:mb-6 text-sm sm:text-base">
            Ready to advance your railway career?
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
            <a
              href="/departments"
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-stone-900 text-white font-semibold rounded-full hover:bg-stone-800 transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
            >
              Start Practicing Now
            </a>
            <a
              href="#exams"
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-stone-900 font-semibold rounded-full border-2 border-stone-200 hover:border-stone-300 transition-all duration-300 text-sm sm:text-base"
            >
              View Popular Exams
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
