import Link from 'next/link';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import { createClient } from '@/lib/supabase/server';
import { SITE_STATS } from '@/lib/constants/siteStats';

export const metadata = {
  title: "About Us | RailJee",
  description: "Bilingual exam preparation platform built for Indian Railway departmental promotional exams.",
};

const stats = [
  { value: SITE_STATS.departments, label: 'Departments Covered' },
  { value: SITE_STATS.examPapers, label: 'Exam Papers' },
  { value: SITE_STATS.practiceQuestions, label: 'Practice Questions' },
  { value: String(SITE_STATS.languagesSupported), label: 'Languages Supported' },
];

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" />
      </svg>
    ),
    title: 'Authentic Past Papers',
    desc: 'Real departmental promotional exam papers with year and railway zone metadata.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
      </svg>
    ),
    title: 'Bilingual Support',
    desc: 'Read questions in Hindi and English simultaneously. Clear visibility for every railway professional.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    title: 'Performance Tracking',
    desc: 'Track scores and progress across multiple attempts on your personal stats dashboard.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
    title: 'Built for Promotion',
    desc: 'Every paper and resource is curated specifically for departmental promotional exams.',
  },
];

const departments = ['Civil', 'Mechanical', 'Electrical', 'Commercial', 'Personnel', 'Operating', 'S&T'];

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
            Built for Indian Railway{' '}
            <span className="text-orange-600">Professionals</span>
          </h1>
          <p className="text-stone-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
            RailJee is a bilingual preparation platform built specifically for Indian Railway departmental promotional exams. Authentic papers. Smart practice. Real results.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="bg-[#faf9f7] rounded-2xl p-5 sm:p-6 border border-stone-100 text-center">
                <p className="text-2xl sm:text-3xl font-bold text-orange-600 mb-1">{stat.value}</p>
                <p className="text-xs sm:text-sm text-stone-500 leading-snug">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 bg-[#faf9f7]">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-orange-600 mb-3 block">Our Mission</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-4 leading-tight">
              Focused Preparation for Every Railway Employee
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed mb-3">
              Cracking a departmental promotional exam demands authentic past papers, department specific content, and consistent practice. RailJee brings all of that into one organized platform built around how these exams actually work.
            </p>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Our goal is to give every railway employee the tools needed to advance their career through merit based examination success.
            </p>
          </div>
          <div className="bg-white border-l-4 border-orange-500 rounded-r-2xl p-6 sm:p-8 shadow-sm">
            <blockquote className="text-lg sm:text-xl font-medium text-stone-900 leading-relaxed">
              &ldquo;Every railway employee deserves a fair shot at promotion. RailJee was built on that one belief.&rdquo;
            </blockquote>
            <p className="mt-4 text-sm text-stone-500">The RailJee Team</p>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8 sm:mb-10">
            <span className="text-xs font-semibold uppercase tracking-widest text-orange-600 mb-3 block">What We Offer</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">Everything You Need in One Place</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
            {features.map((item) => (
              <div key={item.title} className="bg-[#faf9f7] rounded-2xl border border-stone-100 hover:border-orange-200 hover:shadow-md transition-all duration-300 p-5 sm:p-6">
                <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 mb-3">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-stone-900 mb-1 text-sm sm:text-base">{item.title}</h3>
                <p className="text-stone-500 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 bg-[#faf9f7]">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-orange-600 mb-3 block">Our Story</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-6">Why We Built RailJee</h2>
          <div className="space-y-4 text-stone-600 text-sm sm:text-base leading-relaxed text-left">
            <p>
              Indian Railways is one of the largest employers in the world. Hundreds of thousands of employees across departments are eligible to advance through departmental promotional examinations. Yet preparation resources were scattered, outdated, or locked behind expensive coaching fees.
            </p>
            <p>
              RailJee was built to change that. We collected authentic past papers, organized them by department, added bilingual support, and wrapped everything in an exam simulating interface that mirrors actual departmental test conditions.
            </p>
            <p>
              Today RailJee helps thousands of railway employees practice with real papers, identify weak areas, and walk into exam halls with genuine confidence. Your hard work should be the only thing standing between you and your next promotion.
            </p>
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-orange-600 mb-3 block">Departments</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-6">Built Across Every Major Department</h2>
          <div className="flex flex-wrap justify-center gap-2">
            {departments.map((dept) => (
              <span key={dept} className="px-4 py-2 text-sm font-medium text-stone-700 bg-[#faf9f7] border border-stone-200 rounded-full">
                {dept}
              </span>
            ))}
          </div>
          <p className="mt-5 text-sm text-stone-400">
            New departments and exam papers are added regularly based on user demand.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 bg-[#faf9f7] border-t border-stone-100">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-3">Ready to Start Preparing?</h2>
          <p className="text-stone-500 text-sm sm:text-base mb-7">
            Join thousands of railway employees using RailJee to prepare for their departmental promotional exams.
          </p>
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
              Get Started
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
