import Link from 'next/link';
export default function Footer() {
  return (
    <footer className="bg-stone-900 text-white py-10 sm:py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4 sm:mb-6">
              <Link href="/" className="flex items-center space-x-2 group">
                <img
                  src="/images/logo.png"
                  alt="RailJee Logo"
                  className="h-12 sm:h-14 w-auto transition-transform group-hover:scale-105"
                />
              </Link>
            </div>
            <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
              Your trusted platform for railway exam preparation. Join thousands of successful candidates.
            </p>
          </div>
          
          {/* Departments */}
          <div>
            <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider mb-3 sm:mb-6">Departments</h3>
            <ul className="space-y-2 sm:space-y-4 text-stone-400">
              <li><Link href="/departments" className="hover:text-white transition-colors text-xs sm:text-sm">All Departments</Link></li>
              <li><Link href="/departments#civil" className="hover:text-white transition-colors text-xs sm:text-sm">Civil</Link></li>
              <li><Link href="/departments#mechanical" className="hover:text-white transition-colors text-xs sm:text-sm">Mechanical</Link></li>
              <li><Link href="/departments#electrical" className="hover:text-white transition-colors text-xs sm:text-sm">Electrical</Link></li>
            </ul>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider mb-3 sm:mb-6">Quick Links</h3>
            <ul className="space-y-2 sm:space-y-4 text-stone-400">
              <li><Link href="/#exams" className="hover:text-white transition-colors text-xs sm:text-sm">Practice Tests</Link></li>
              <li><Link href="/stats" className="hover:text-white transition-colors text-xs sm:text-sm">My Statistics</Link></li>
              <li><Link href="/#features" className="hover:text-white transition-colors text-xs sm:text-sm">Features</Link></li>
              <li><Link href="/#about" className="hover:text-white transition-colors text-xs sm:text-sm">About</Link></li>
            </ul>
          </div>
          
          {/* Company */}
          <div>
            <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider mb-3 sm:mb-6">Company</h3>
            <ul className="space-y-2 sm:space-y-4 text-stone-400">
              <li><Link href="/about" className="hover:text-white transition-colors text-xs sm:text-sm">About Us</Link></li>
              <li><a href="#contact" className="hover:text-white transition-colors text-xs sm:text-sm">Contact</a></li>
              <li><Link href="/privacy-policy" className="hover:text-white transition-colors text-xs sm:text-sm">Privacy Policy</Link></li>
              <li><Link href="/terms-of-service" className="hover:text-white transition-colors text-xs sm:text-sm">Terms of Service</Link></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-stone-800 mt-8 sm:mt-10 lg:mt-12 pt-6 sm:pt-8 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4">
          <p className="text-stone-500 text-xs sm:text-sm">&copy; 2026 RailJee. All rights reserved.</p>
          <p className="text-stone-500 text-xs sm:text-sm">
            Made with ❤️ by{' '}
            <a 
              href="https://backendandbeyond.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-stone-400 hover:text-white transition-colors underline decoration-dotted"
            >
              Backend & Beyond
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
