export default function Features() {
  const features = [
    {
      title: 'Multiple Departments',
      description: 'Access exam papers from Civil, Mechanical, Electrical, Commercial, Personnel, Operating, S&T, and DFCCIL/Metro departments',
      icon: (
        <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
        </svg>
      )
    },
    {
      title: 'Bilingual Support',
      description: 'All exam papers and questions available in both Hindi and English for comfortable learning',
      icon: (
        <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
        </svg>
      )
    },
    {
      title: 'Authentic Exam Papers',
      description: 'Real departmental exam papers with year, location, and department information for targeted practice',
      icon: (
        <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
        </svg>
      )
    },
    {
      title: 'Study Materials',
      description: 'Download PDFs and access study resources organized by department for comprehensive preparation',
      icon: (
        <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
      )
    }
  ];

  return (
    <section id="features" className="py-12 sm:py-16 lg:py-28 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-stone-900 mb-3 sm:mb-4 lg:mb-6">
            Everything You Need to Excel
          </h2>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed px-4">
            RailJee provides comprehensive resources for railway departmental exams. Practice with authentic papers, access bilingual content, and study department-specific materials all in one place.
          </p>
        </div>
        
        {/* Features Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 lg:gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group text-center bg-gradient-to-br from-white to-stone-50/50 p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-stone-100 hover:border-orange-200 hover:shadow-lg transition-all duration-300"
            >
              {/* Icon Container */}
              <div className="relative inline-flex items-center justify-center mb-3 sm:mb-5">
                <div className="w-14 h-14 sm:w-20 sm:h-20 bg-gradient-to-br from-stone-100 to-stone-200/50 rounded-xl sm:rounded-2xl flex items-center justify-center text-stone-700 group-hover:from-stone-900 group-hover:to-stone-800 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-md">
                  {feature.icon}
                </div>
                {/* Arrow indicator */}
                <div className="absolute -bottom-1.5 -right-1.5 sm:-bottom-2 sm:-right-2 w-5 h-5 sm:w-7 sm:h-7 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-500 transition-all duration-300 shadow-sm">
                  <svg className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-orange-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                  </svg>
                </div>
              </div>
              
              <h3 className="text-sm sm:text-lg font-bold text-stone-900 mb-1.5 sm:mb-3 leading-tight">
                {feature.title}
              </h3>
              <p className="text-stone-600 text-xs leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
