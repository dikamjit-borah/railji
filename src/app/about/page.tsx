import Link from 'next/link';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import { createClient } from '@/lib/supabase/server';

export const metadata = {
  title: 'About Us - RailJee',
  description: 'Learn about RailJee — the railway exam preparation platform built for Indian railway aspirants.',
};

export default async function AboutPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen bg-white">
      <Navbar user={user} />

      {/* Hero */}
      <section className="bg-[#faf9f7] py-12 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-stone-100">
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-stone-500 mb-6">
            <Link href="/" className="hover:text-orange-600 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-stone-700">About Us</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 mb-4 leading-tight">
            Built for Every{' '}
            <span className="text-orange-600">Railway Aspirant</span>
          </h1>
          <p className="text-stone-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
            RailJee is a free, focused exam preparation platform designed specifically for Indian Railway departmental examinations — helping candidates practice smarter and succeed faster.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-orange-600 mb-3 block">Our Mission</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-4 leading-tight">
                Democratizing Railway Exam Preparation
              </h2>
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed mb-4">
                Cracking a railway departmental exam requires access to the right resources — authentic past papers, department-specific content, and consistent practice. We built RailJee to make all of that freely accessible to every aspirant, regardless of their background or financial situation.
              </p>
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                Our goal is simple: give every railway employee and aspirant the tools they need to advance their career through merit-based examination success.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: '8+', label: 'Departments Covered' },
                { value: '1000+', label: 'Practice Questions' },
                { value: '2', label: 'Languages (Hindi & English)' },
                { value: '100%', label: 'Free to Use' },
              ].map((stat) => (
                <div key={stat.label} className="bg-[#faf9f7] rounded-2xl p-5 sm:p-6 border border-stone-100 text-center">
                  <p className="text-2xl sm:text-3xl font-bold text-orange-600 mb-1">{stat.value}</p>
                  <p className="text-xs sm:text-sm text-stone-500 leading-snug">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[#faf9f7]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 sm:mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-orange-600 mb-3 block">What We Offer</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">Everything in One Place</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
                  </svg>
                ),
                title: 'Authentic Past Papers',
                desc: 'Real departmental exam papers with year and location metadata for targeted practice.',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
                  </svg>
                ),
                title: 'Bilingual Content',
                desc: 'All questions and materials available in both Hindi and English.',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z" />
                  </svg>
                ),
                title: '8+ Departments',
                desc: 'Civil, Mechanical, Electrical, Commercial, Operating, S&T, Personnel, DFCCIL/Metro and more.',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zm9.75-9.75c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v16.5c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V3.375zm-9.75 9.75..." />
                  </svg>
                ),
                title: 'Performance Analytics',
                desc: 'Track your scores, time per question, and progress over multiple attempts.',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                  </svg>
                ),
                title: 'Study Materials',
                desc: 'Access study resources organized by department.',
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: 'Completely Free',
                desc: 'No paywalls, no premium tiers. Every feature is accessible to all users.',
              },
            ].map((item) => (
              <div key={item.title} className="bg-white rounded-2xl border border-stone-100 hover:border-orange-200 hover:shadow-md transition-all duration-300 p-5 sm:p-6">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 mb-4">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-stone-900 mb-2 text-sm sm:text-base">{item.title}</h3>
                <p className="text-stone-500 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-orange-600 mb-3 block">Our Story</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-6">Why We Built RailJee</h2>
          <div className="space-y-4 text-stone-600 text-sm sm:text-base leading-relaxed text-left">
            <p>
              Indian Railways is one of the largest employers in the world, with hundreds of thousands of employees across departments — each eligible to advance through departmental examinations. Yet the resources available to prepare for these exams were scattered, outdated, or locked behind expensive coaching fees.
            </p>
            <p>
              RailJee was born out of the simple belief that every railway employee deserves a fair shot at career advancement. We collected authentic past papers, organized them by department, added bilingual support, and wrapped it all in a clean, exam-simulating interface.
            </p>
            <p>
              Today, RailJee helps thousands of candidates practice with real exam papers, track their weak areas, and walk into exam halls with confidence. And it&apos;s free — because your hard work should be the only thing standing between you and your next promotion.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[#faf9f7] border-t border-stone-100">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-4">Ready to Start Preparing?</h2>
          <p className="text-stone-600 text-sm sm:text-base mb-8">Join thousands of railway aspirants already using RailJee to ace their departmental exams.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/departments"
              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold px-8 py-3 rounded-xl transition-colors text-sm sm:text-base"
            >
              Browse Departments
            </Link>
            <Link
              href="/auth/signup"
              className="bg-white hover:bg-stone-50 text-stone-900 font-semibold px-8 py-3 rounded-xl border border-stone-200 transition-colors text-sm sm:text-base"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
