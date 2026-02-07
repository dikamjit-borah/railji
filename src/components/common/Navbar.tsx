'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export type NavbarVariant = 'home' | 'departments' | 'stats' | 'departmentDetail' | 'examResult';

interface NavbarProps {
  variant?: NavbarVariant;
  title?: string;
  subtitle?: string;
  backHref?: string;
  statsInfo?: string;
  paperName?: string;
}

export default function Navbar({
  variant = 'home',
  title,
  subtitle,
  backHref = '/',
  statsInfo,
  paperName
}: NavbarProps) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Home variant - Full navbar with navigation
  if (variant === 'home') {
    return <HomeNavbar 
      isMobileMenuOpen={isMobileMenuOpen}
      setIsMobileMenuOpen={setIsMobileMenuOpen}
      router={router}
    />;
  }

  // Departments variant - Simple header with back button
  if (variant === 'departments') {
    return (
      <header className="bg-[#FDF6E3]/80 backdrop-blur-md sticky top-0 z-50 border-b border-[#EDE4D3]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
            <Link href={backHref} className="flex items-center gap-2 sm:gap-3 group">
              <button className="p-1.5 sm:p-2 hover:bg-stone-100 rounded-lg sm:rounded-xl transition-all">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <div>
                <h1 className="text-sm sm:text-md font-bold text-stone-900">
                  {title || 'Select Department'}
                </h1>
                <p className="text-xxs sm:text-xs text-stone-500 hidden sm:block">
                  {subtitle || 'Choose your preparation area'}
                </p>
              </div>
            </Link>
            <Link href="/" className="transition-transform hover:scale-105">
              <img
                src="/images/logo.png"
                alt="RailJee Logo"
                className="h-8 sm:h-10 lg:h-12 w-auto"
              />
            </Link>
          </div>
        </div>
      </header>
    );
  }

  // Stats variant - Simple header with back button and stats info
  if (variant === 'stats') {
    return (
      <header className="bg-white border-b border-stone-100 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push(backHref)}
                className="p-2 hover:bg-stone-100 rounded-xl transition-colors"
              >
                <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-lg font-bold text-stone-900">
                  {title || 'Your Statistics'}
                </h1>
                <p className="text-xs text-stone-500">
                  {subtitle || 'Track your exam performance'}
                </p>
              </div>
            </div>
            {statsInfo && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-500 hidden sm:block">
                  {statsInfo}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>
    );
  }

  // Exam Result variant - Header with home button and clickable logo
  if (variant === 'examResult') {
    return (
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-2 sm:py-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div>
                <h1 className="text-sm sm:text-base font-bold text-stone-800">{title || 'Exam Completed'}</h1>
                <p className="text-xxs sm:text-xs text-stone-500">{subtitle || (paperName ? `Paper: ${paperName}` : '')}</p>
              </div>
            </div>
            <button
              onClick={() => router.push('/')}
              className="hover:opacity-80 transition-opacity cursor-pointer"
              aria-label="Go to home"
            >
              <img
                src="/images/logo.png"
                alt="RailJee Logo"
                className="h-8 sm:h-10 w-auto"
              />
            </button>
          </div>
        </div>
      </header>
    );
  }

  // Default fallback
  return null;
}

// Home Navbar Component
interface HomeNavbarProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  router: any;
}

function HomeNavbar({ isMobileMenuOpen, setIsMobileMenuOpen, router }: HomeNavbarProps) {
  const navItems = [
    { name: 'Tests', href: '#exams' },
    { name: 'Resources', href: '#features' },
    { name: 'My Stats', href: '/stats', isRoute: true },
    { name: 'About', href: '#about' },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center h-14 sm:h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <img
              src="/images/logo.png"
              alt="RailJee Logo"
              className="h-12 sm:h-14 lg:h-16 w-auto transition-transform group-hover:scale-105"
            />
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              item.isRoute ? (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-stone-600 hover:text-stone-900 font-medium transition-colors text-sm flex items-center gap-1.5"
                >
                  {item.name === 'My Stats' && (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  )}
                  {item.name}
                </Link>
              ) : (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-stone-600 hover:text-stone-900 font-medium transition-colors text-sm"
                >
                  {item.name}
                </a>
              )
            ))}
          </div>

          {/* CTA Button */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            <button
              onClick={() => router.push('/departments')}
              className="hidden sm:inline-flex px-4 lg:px-5 py-2 lg:py-2.5 text-xs sm:text-sm font-semibold text-white bg-orange-600 rounded-full hover:bg-orange-700 transition-all duration-300"
            >
              Start Preparing
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-1.5 sm:p-2 text-stone-600 hover:text-stone-900"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Mobile Menu */}
          <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md shadow-lg border-t border-gray-100 z-50 md:hidden px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto py-4">
              <div className="flex flex-col space-y-3">
                {navItems.map((item) => (
                  item.isRoute ? (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-stone-600 hover:text-stone-900 font-medium py-2 px-2 transition-colors flex items-center gap-2 rounded-lg hover:bg-stone-50"
                    >
                      {item.name === 'My Stats' && (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      )}
                      {item.name}
                    </Link>
                  ) : (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-stone-600 hover:text-stone-900 font-medium py-2 px-2 transition-colors rounded-lg hover:bg-stone-50"
                    >
                      {item.name}
                    </a>
                  )
                ))}
                <button
                  onClick={() => {
                    router.push('/departments');
                    setIsMobileMenuOpen(false);
                  }}
                  className="mt-2 px-5 py-2.5 text-sm font-semibold text-white bg-orange-600 rounded-full hover:bg-orange-700 transition-all"
                >
                  Start Preparing
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </nav>
  );
}
