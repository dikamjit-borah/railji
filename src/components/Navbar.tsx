'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Navbar() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: 'Tests', href: '#exams' },
    { name: 'Resources', href: '#features' },
    { name: 'My Stats', href: '/stats', isRoute: true },
    { name: 'About', href: '#about' },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <img
              src="/images/logo.png"
              alt="RailJee Logo"
              className="h-16 sm:h-16 w-auto transition-transform group-hover:scale-105"
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
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/departments')}
              className="hidden sm:inline-flex px-5 py-2.5 text-sm font-semibold text-stone-900 border border-stone-900 rounded-full hover:bg-stone-900 hover:text-white transition-all duration-300"
            >
              Start Preparing
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-stone-600 hover:text-stone-900"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                item.isRoute ? (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-stone-600 hover:text-stone-900 font-medium py-2 px-2 transition-colors flex items-center gap-2"
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
                    className="text-stone-600 hover:text-stone-900 font-medium py-2 px-2 transition-colors"
                  >
                    {item.name}
                  </a>
                )
              ))}
              <button
                onClick={() => router.push('/departments')}
                className="mt-2 px-5 py-2.5 text-sm font-semibold text-white bg-stone-900 rounded-full hover:bg-stone-800 transition-all"
              >
                Start Preparing
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
