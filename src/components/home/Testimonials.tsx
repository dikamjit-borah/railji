'use client';

import { useState } from 'react';

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      quote: "The bilingual exam papers helped me prepare effectively for the departmental exam. I got promoted from Technician to Junior Engineer in Civil department.",
      name: "Rajesh Kumar",
      role: "Junior Engineer - Civil",
      avatar: "RK"
    },
    {
      quote: "Having all departmental papers in one place saved me so much time. The authentic exam papers matched exactly what I faced in the actual exam.",
      name: "Priya Singh",
      role: "Commercial Inspector",
      avatar: "PS"
    },
    {
      quote: "The study materials and previous year papers for S&T department were comprehensive. Successfully cleared my SSE exam on first attempt!",
      name: "Amit Sharma",
      role: "Senior Section Engineer - S&T",
      avatar: "AS"
    }
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="about" className="py-12 sm:py-16 lg:py-28 px-4 sm:px-6 lg:px-8 bg-[#faf9f7]">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
          {/* Left - Image/Visual */}
          <div className="relative">
            <div className="relative bg-stone-200 rounded-2xl sm:rounded-3xl overflow-hidden aspect-[4/3]">
              {/* Railway themed visual */}
              <div className="absolute inset-0 bg-gradient-to-br from-stone-300 to-stone-200">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center px-4">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto mb-3 sm:mb-4 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                      </svg>
                    </div>
                    <p className="text-stone-600 font-medium text-sm sm:text-base">Join 10,000+ Students</p>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="hidden sm:block absolute top-4 right-4 w-10 h-10 sm:w-12 sm:h-12 text-orange-500">
                <svg viewBox="0 0 100 100" fill="currentColor">
                  <path d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z" />
                </svg>
              </div>
            </div>

            {/* Learn More Button */}
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 lg:top-6 lg:left-6">
              <button className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white text-stone-900 text-xs sm:text-sm font-medium rounded-full shadow-lg hover:shadow-xl transition-shadow">
                Learn more
              </button>
            </div>
          </div>

          {/* Right - Testimonials */}
          <div>
            <div className="flex items-start justify-between mb-6 sm:mb-8 gap-4">
              <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-stone-900 leading-tight">
                Success Stories from Railway Employees
              </h2>
              <a href="#" className="text-stone-600 hover:text-stone-900 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>

            {/* Testimonial Cards */}
            <div className="space-y-4 sm:space-y-6">
              {testimonials.slice(0, 2).map((testimonial, index) => (
                <div key={index} className="relative bg-gradient-to-br from-white to-orange-50/20 rounded-xl sm:rounded-2xl p-4 sm:p-5 lg:p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-orange-100/50">
                  {/* Quote icon */}
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 text-orange-200 opacity-50">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                    </svg>
                  </div>
                  <p className="text-stone-600 mb-4 sm:mb-6 leading-relaxed italic text-sm sm:text-base relative z-10">
                    &ldquo;{testimonial.quote}&rdquo;
                  </p>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base flex-shrink-0 shadow-lg">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-stone-900 text-sm sm:text-base">{testimonial.name}</div>
                      <div className="text-xs sm:text-sm text-orange-600 font-medium">{testimonial.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-3 sm:gap-4 mt-6 sm:mt-8">
              <div className="flex gap-1.5 sm:gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-1.5 sm:h-2 rounded-full transition-all ${
                      index === currentIndex ? 'bg-stone-900 w-5 sm:w-6' : 'bg-stone-300 w-1.5 sm:w-2'
                    }`}
                  />
                ))}
              </div>
              <div className="flex gap-2 ml-auto">
                <button
                  onClick={prevTestimonial}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-stone-300 flex items-center justify-center text-stone-600 hover:bg-stone-100 transition-colors"
                >
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextTestimonial}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-stone-900 flex items-center justify-center text-white hover:bg-stone-800 transition-colors"
                >
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
