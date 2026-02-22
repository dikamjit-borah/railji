'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface NavbarProps {
  user?: any;
}

export default function Navbar({ user }: NavbarProps) {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

          {/* Auth/CTA Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {user ? (
              <Link
                href="/departments"
                className="px-4 lg:px-5 py-2 lg:py-2.5 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-full hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
              >
                Go to Exams
              </Link>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 lg:px-5 py-2 lg:py-2.5 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-full hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
                >
                  Sign Up
                </Link>
              </>
            )}

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
