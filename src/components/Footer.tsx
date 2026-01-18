export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">R</span>
              </div>
              <span className="text-2xl font-bold">Railje</span>
            </div>
            <p className="text-gray-400">
              Your trusted platform for railway exam preparation
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Exams</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Junior Engineer</a></li>
              <li><a href="#" className="hover:text-white transition-colors">NTPC</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Junior Clerk</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Study Material</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Practice Tests</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Previous Papers</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2026 Railje. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
