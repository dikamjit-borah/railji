import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import DepartmentShowcase from '@/components/DepartmentShowcase';
import ExamCards from '@/components/ExamCards';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import Testimonials from '@/components/Testimonials';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <DepartmentShowcase />
      <ExamCards />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Footer />
    </main>
  );
}
