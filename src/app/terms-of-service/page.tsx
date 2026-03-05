import Link from 'next/link';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import { createClient } from '@/lib/supabase/server';

export const metadata = {
  title: 'Terms of Service - RailJee',
  description: 'Terms of Service for RailJee - Railway Exam Preparation Platform',
};

export default async function TermsOfServicePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen bg-white">
      <Navbar user={user} />

      {/* Hero */}
      <section className="bg-[#faf9f7] py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-stone-100">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-sm text-stone-500 mb-4">
            <Link href="/" className="hover:text-orange-600 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-stone-700">Terms of Service</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-3">Terms of Service</h1>
          <p className="text-stone-500 text-sm">Last updated: March 5, 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">

          <div className="space-y-10 text-stone-700 text-sm sm:text-base leading-relaxed">

            <div className="bg-orange-50 border border-orange-100 rounded-xl p-5 sm:p-6">
              <p className="text-stone-700">
                Welcome to <strong className="text-stone-900">RailJee</strong>. By accessing or using our platform, you agree to be bound by these Terms of Service. Please read them carefully before using our services.
              </p>
            </div>

            {/* Section 1 */}
            <Section title="1. Acceptance of Terms">
              <p>By creating an account or using RailJee in any way, you confirm that you are at least 13 years of age, have read and understood these Terms, and agree to be legally bound by them. If you do not agree, please do not use the platform.</p>
            </Section>

            {/* Section 2 */}
            <Section title="2. Description of Service">
              <p>RailJee is an online railway examination preparation platform that provides:</p>
              <ul className="list-disc pl-5 space-y-2 mt-3">
                <li>Practice tests and mock exams for Indian Railway recruitment exams (RRB, NTPC, Group D, JE, etc.)</li>
                <li>Department-wise study materials and previous year papers</li>
                <li>Performance analytics and statistics dashboard</li>
                <li>Bilingual content (Hindi and English)</li>
              </ul>
              <p className="mt-3">We reserve the right to modify, suspend, or discontinue any part of the service at any time with or without notice.</p>
            </Section>

            {/* Section 3 */}
            <Section title="3. User Accounts">
              <ul className="list-disc pl-5 space-y-2">
                <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                <li>You are responsible for all activity that occurs under your account.</li>
                <li>You must notify us immediately of any unauthorized use of your account.</li>
                <li>One person may not maintain more than one account.</li>
                <li>We reserve the right to suspend or terminate accounts that violate these Terms.</li>
              </ul>
            </Section>

            {/* Section 4 */}
            <Section title="4. Acceptable Use">
              <p>You agree not to:</p>
              <ul className="list-disc pl-5 space-y-2 mt-3">
                <li>Copy, distribute, or reproduce exam questions, answers, or any content from RailJee without written permission.</li>
                <li>Use automated tools, bots, or scripts to access or scrape the platform.</li>
                <li>Attempt to reverse-engineer, decompile, or tamper with the platform.</li>
                <li>Share your account credentials with others.</li>
                <li>Use the platform for any unlawful purpose.</li>
                <li>Interfere with the proper functioning of the platform or other users' experience.</li>
                <li>Upload or transmit viruses, malware, or other harmful code.</li>
              </ul>
            </Section>

            {/* Section 5 */}
            <Section title="5. Intellectual Property">
              <p>All content on RailJee — including but not limited to exam questions, explanations, graphics, logos, and software — is owned by or licensed to RailJee and is protected by applicable intellectual property laws.</p>
              <p className="mt-3">You are granted a limited, non-exclusive, non-transferable license to access and use the platform for your personal, non-commercial exam preparation purposes only.</p>
            </Section>

            {/* Section 6 */}
            <Section title="6. Exam Content Accuracy">
              <p>While we strive to ensure the accuracy of all exam questions and answers, RailJee does not guarantee that all content is error-free or up to date with the latest Railway Board notifications. Always refer to official Railway Recruitment Board (RRB) publications for authoritative information.</p>
            </Section>

            {/* Section 7 */}
            <Section title="7. Disclaimer of Warranties">
              <p>RailJee is provided on an <strong>"as is"</strong> and <strong>"as available"</strong> basis without warranties of any kind, express or implied. We do not warrant that:</p>
              <ul className="list-disc pl-5 space-y-2 mt-3">
                <li>The service will be uninterrupted or error-free.</li>
                <li>Any specific exam results will be achieved by using this platform.</li>
                <li>The content is complete, accurate, or current at all times.</li>
              </ul>
            </Section>

            {/* Section 8 */}
            <Section title="8. Limitation of Liability">
              <p>To the fullest extent permitted by law, RailJee and its team shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use the platform, including but not limited to loss of data, loss of exam opportunity, or failure to succeed in any examination.</p>
            </Section>

            {/* Section 9 */}
            <Section title="9. Privacy">
              <p>Your use of RailJee is also governed by our{' '}
                <Link href="/privacy-policy" className="text-orange-600 hover:underline">Privacy Policy</Link>,
                which is incorporated into these Terms by reference.
              </p>
            </Section>

            {/* Section 10 */}
            <Section title="10. Termination">
              <p>We may suspend or terminate your access to RailJee at our discretion, without notice, if we believe you have violated these Terms. Upon termination, your right to use the platform immediately ceases. You may also delete your account at any time from your profile settings.</p>
            </Section>

            {/* Section 11 */}
            <Section title="11. Changes to Terms">
              <p>We reserve the right to modify these Terms at any time. When we make changes, we will update the "Last updated" date at the top of this page. Your continued use of RailJee after any changes constitutes your acceptance of the new Terms.</p>
            </Section>

            {/* Section 12 */}
            <Section title="12. Governing Law">
              <p>These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts located in India.</p>
            </Section>

            {/* Section 13 */}
            <Section title="13. Contact Us">
              <p>If you have questions about these Terms of Service, please contact us:</p>
              <div className="mt-3 bg-stone-50 border border-stone-100 rounded-lg p-4">
                <p><strong>RailJee</strong></p>
                <p>Email: <a href="mailto:support@railjee.com" className="text-orange-600 hover:underline">railjee.official@gmail.com</a></p>
              </div>
            </Section>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-lg sm:text-xl font-bold text-stone-900 mb-3 pb-2 border-b border-stone-100">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
