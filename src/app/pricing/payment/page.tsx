'use client';

import Link from 'next/link';

export default function PaymentComingSoonPage() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        {/* Info Card */}
        <div className="bg-[#faf9f7] rounded-2xl border border-stone-100 p-8 sm:p-10">
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 mx-auto mb-5">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.74-5.74m0 0L12 2.1l6.32 7.33m-12.06 0h12.06M3.75 21h16.5" />
            </svg>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-3">
            Payment <span className="text-orange-600">Coming Soon</span>
          </h1>

          <p className="text-stone-600 text-sm sm:text-base leading-relaxed mb-6">
            We are currently building a secure and seamless payment experience for you. This feature will be available shortly.
          </p>

          {/* Status Card */}
          <div className="bg-white rounded-xl border border-orange-100 p-5 mb-6">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
              </span>
              <span className="text-sm font-semibold text-stone-900">Under Development</span>
            </div>
            <p className="text-stone-500 text-xs sm:text-sm leading-relaxed">
              Our team is working on integrating a safe payment gateway. You will be notified once payments go live.
            </p>
          </div>

          {/* Back Button */}
          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm sm:text-base"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Pricing
          </Link>
        </div>

        {/* Help text */}
        <p className="mt-6 text-stone-400 text-xs sm:text-sm">
          Have questions?{' '}
          <Link href="/contact" className="text-orange-600 hover:underline">Contact us</Link>
        </p>
      </div>
    </main>
  );
}
