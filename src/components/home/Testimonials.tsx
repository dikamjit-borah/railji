'use client';

import { useState, useEffect } from 'react';

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const testimonials = [
    {
      quote: "Bilingual papers helped me prepare effectively. After 8 years as Technician, I cleared my JE Civil exam on first attempt!",
      name: "Rajesh Kumar",
      role: "Junior Engineer - Civil",
      location: "North Central Railway, Allahabad",
      avatar: "RK"
    },
    {
      quote: "Previous year papers matched exactly with the actual exam. Cleared CCTS exam with proper preparation strategy.",
      name: "Priya Singh",
      role: "Commercial Clerk (CCTS)",
      location: "Western Railway, Mumbai",
      avatar: "PS"
    },
    {
      quote: "S&T papers are comprehensive and updated. Cleared SSE exam after using these authentic departmental papers.",
      name: "Amit Sharma",
      role: "Senior Section Engineer - S&T",
      location: "Eastern Railway, Kolkata",
      avatar: "AS"
    },
    {
      quote: "Personnel department papers were well organized. Got promoted from Clerk to Assistant after thorough preparation.",
      name: "Sunita Verma",
      role: "Assistant - Personnel",
      location: "South Central Railway, Secunderabad",
      avatar: "SV"
    },
    {
      quote: "Mechanical papers with Hindi-English options saved my preparation time. Finally cleared JE Mechanical exam!",
      name: "Vikram Yadav",
      role: "Junior Engineer - Mechanical",
      location: "Northern Railway, Delhi",
      avatar: "VY"
    },
    {
      quote: "Operating department practice papers gave me real exam confidence. Promoted to Assistant Loco Pilot successfully.",
      name: "Ramesh Patel",
      role: "Assistant Loco Pilot",
      location: "Central Railway, Mumbai",
      avatar: "RP"
    }
  ];

  // Auto-rotation effect
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 2) % testimonials.length);
        setIsTransitioning(false);
      }, 200); // Fade out duration
    }, 5000); // Change every 5 seconds

    return () => clearInterval(interval);
  }, [isPaused, testimonials.length]);

  const nextTestimonial = () => {
    setIsPaused(true); // Pause auto-rotation when user manually navigates
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 2) % testimonials.length);
      setIsTransitioning(false);
    }, 200);
    
    // Resume auto-rotation after 5 seconds of inactivity
    setTimeout(() => setIsPaused(false), 5000);
  };

  const prevTestimonial = () => {
    setIsPaused(true); // Pause auto-rotation when user manually navigates
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 2 + testimonials.length) % testimonials.length);
      setIsTransitioning(false);
    }, 200);
    
    // Resume auto-rotation after 10 seconds of inactivity
    setTimeout(() => setIsPaused(false), 10000);
  };

  const goToTestimonialSet = (index: number) => {
    setIsPaused(true);
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentIndex(index * 2);
      setIsTransitioning(false);
    }, 200);
    
    // Resume auto-rotation after 10 seconds of inactivity
    setTimeout(() => setIsPaused(false), 10000);
  };

  return (
    <section id="about" className="py-12 sm:py-16 lg:py-28 px-4 sm:px-6 lg:px-8 bg-[#faf9f7]">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
          {/* Left - Success Stats */}
          <div className="relative">
            <div className="relative bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 rounded-2xl sm:rounded-3xl overflow-hidden aspect-[4/3] shadow-2xl">
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}></div>
              </div>

              {/* Content */}
              <div className="relative h-full flex flex-col justify-center items-center text-center px-6 sm:px-8 py-8">
                {/* Main stat */}
                <div className="mb-6 sm:mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-full mb-3 sm:mb-4 border-2 border-white/30">
                    <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-2">
                    10,000<span className="text-orange-200">+</span>
                  </div>
                  <p className="text-white/90 font-semibold text-base sm:text-lg">Railway Employees Promoted</p>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 gap-4 sm:gap-6 w-full max-w-sm">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20">
                    <div className="text-2xl sm:text-3xl font-bold text-white mb-1">85%</div>
                    <p className="text-white/80 text-xs sm:text-sm">Success Rate</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20">
                    <div className="text-2xl sm:text-3xl font-bold text-white mb-1">7+</div>
                    <p className="text-white/80 text-xs sm:text-sm">Departments</p>
                  </div>
                </div>

                {/* Trust badge */}
                <div className="mt-6 sm:mt-8 flex items-center gap-2 text-white/90">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm font-medium">Trusted by Indian Railways</span>
                </div>
              </div>

              {/* Decorative star */}
              <div className="hidden sm:block absolute top-4 right-4 w-10 h-10 sm:w-12 sm:h-12 text-white/30">
                <svg viewBox="0 0 100 100" fill="currentColor">
                  <path d="M50 0 L60 40 L100 50 L60 60 L50 100 L40 60 L0 50 L40 40 Z" />
                </svg>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6">
              <div className="bg-white rounded-full p-3 sm:p-4 shadow-xl border-4 border-orange-100">
                <div className="text-center">
                  <div className="text-xl sm:text-2xl font-bold text-orange-600">4.8★</div>
                  <p className="text-xs text-stone-600 font-medium">Rating</p>
                </div>
              </div>
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
            <div 
              className={`space-y-4 sm:space-y-5 transition-all duration-200 ease-in-out ${
                isTransitioning ? 'opacity-0 -translate-x-4' : 'opacity-100 translate-x-0'
              }`}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {[currentIndex, (currentIndex + 1) % testimonials.length].map((index) => (
                <div key={index} className="relative bg-gradient-to-br from-white to-orange-50/20 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-md hover:shadow-xl transition-all duration-300 border border-orange-100/50">
                  {/* Quote icon */}
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4 text-orange-200 opacity-40">
                    <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                    </svg>
                  </div>
                  <p className="text-stone-700 mb-3 sm:mb-4 leading-relaxed text-xs sm:text-sm relative z-10 pr-6">
                    &ldquo;{testimonials[index].quote}&rdquo;
                  </p>
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xs sm:text-sm flex-shrink-0 shadow-lg">
                      {testimonials[index].avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-stone-900 text-xs sm:text-sm">{testimonials[index].name}</div>
                      <div className="text-xs text-orange-600 font-medium mb-0.5">{testimonials[index].role}</div>
                      <div className="text-xs text-stone-500 truncate">{testimonials[index].location}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-3 sm:gap-4 mt-5 sm:mt-6">
              <div className="flex gap-1.5 sm:gap-2">
                {Array.from({ length: Math.ceil(testimonials.length / 2) }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToTestimonialSet(index)}
                    className={`h-1.5 sm:h-2 rounded-full transition-all ${
                      Math.floor(currentIndex / 2) === index ? 'bg-stone-900 w-5 sm:w-6' : 'bg-stone-300 w-1.5 sm:w-2'
                    }`}
                    aria-label={`Go to testimonial set ${index + 1}`}
                  />
                ))}
              </div>
              <div className="flex gap-2 ml-auto">
                <button
                  onClick={prevTestimonial}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-stone-300 flex items-center justify-center text-stone-600 hover:bg-stone-100 transition-colors"
                  aria-label="Previous testimonials"
                >
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextTestimonial}
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-stone-900 flex items-center justify-center text-white hover:bg-stone-800 transition-colors"
                  aria-label="Next testimonials"
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
