import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ExamCards from '@/components/ExamCards';
import Features from '@/components/Features';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <Hero />
      <ExamCards />
      <Features />
      <Footer />
    </main>
  );
}
