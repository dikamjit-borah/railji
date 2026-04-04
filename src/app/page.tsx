import { createClient } from '@/lib/supabase/server';
import Navbar from '@/components/home/Navbar';
import Hero from '@/components/home/Hero';
import DepartmentShowcase from '@/components/home/DepartmentShowcase';
import ExamCards from '@/components/home/ExamCards';
import Features from '@/components/home/Features';
import HowItWorks from '@/components/home/HowItWorks';
import Testimonials from '@/components/home/Testimonials';
import Footer from '@/components/home/Footer';
import { API_ENDPOINTS } from '@/lib/apiConfig';
import { type TopPaper } from '@/lib/api';
import ExternalApiErrorTrigger from '@/components/common/ExternalApiErrorTrigger';

export default async function Home() {
  const supabase = await createClient();
  let externalApiError = false;

  const fetchDepartments = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.DEPARTMENTS, { next: { revalidate: 300 } });
      if (!response.ok) {
        externalApiError = true;
        return [] as any[];
      }

      const json = await response.json().catch(() => ({}));
      if (json?.success === false || !json?.data) {
        externalApiError = true;
        return [] as any[];
      }

      return (json.data ?? []) as any[];
    } catch {
      externalApiError = true;
      return [] as any[];
    }
  };

  const fetchTopPapers = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.TOP_PAPERS, { next: { revalidate: 300 } });
      if (!response.ok) {
        externalApiError = true;
        return [] as TopPaper[];
      }

      const json = await response.json().catch(() => ({}));
      if (json?.success === false || !json?.data) {
        externalApiError = true;
        return [] as TopPaper[];
      }

      return ((json.data ?? []) as TopPaper[]).slice(0, 6);
    } catch {
      externalApiError = true;
      return [] as TopPaper[];
    }
  };

  // Use getSession() — reads JWT from cookie without a network call to Supabase.
  // getUser() makes an external auth-server request on every load which adds
  // significant latency. The middleware has already validated the session, so
  // trusting the cookie-based session here is safe.
  // Run all three fetches in parallel to minimise total wait time.
  const [sessionResult, departments, papers] = await Promise.all([
    supabase.auth.getSession(),
    fetchDepartments(),
    fetchTopPapers(),
  ]);
  const user = sessionResult.data.session?.user ?? null;

  return (
    <main className="min-h-screen bg-white">
      <ExternalApiErrorTrigger shouldShow={externalApiError} />
      <Navbar user={user} />
      <Hero />
      <DepartmentShowcase departments={departments} />
      <ExamCards papers={papers} departments={departments} />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Footer />
    </main>
  );
}
