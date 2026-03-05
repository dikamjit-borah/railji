import Link from 'next/link';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import { createClient } from '@/lib/supabase/server';

export const metadata = {
  title: 'Privacy Policy - RailJee',
  description: 'Privacy Policy for RailJee - Railway Exam Preparation Platform',
};

export default async function PrivacyPolicyPage() {
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
            <span className="text-stone-700">Privacy Policy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-3">Privacy Policy</h1>
          <p className="text-stone-500 text-sm">Last updated: March 5, 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto prose-custom">

          <div className="space-y-10 text-stone-700 text-sm sm:text-base leading-relaxed">

            <div className="bg-orange-50 border border-orange-100 rounded-xl p-5 sm:p-6">
              <p className="text-stone-700">
                At <strong className="text-stone-900">RailJee</strong>, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our railway exam preparation platform. Please read this policy carefully.
              </p>
            </div>

            {/* Section 1 */}
            <Section title="1. Information We Collect">
              <SubSection title="1.1 Information You Provide">
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li><strong>Account Information:</strong> Name, email address, and profile photo when you register via Google OAuth or email/password.</li>
                  <li><strong>Profile Data:</strong> Any optional profile details you choose to add.</li>
                </ul>
              </SubSection>
              <SubSection title="1.2 Information Collected Automatically">
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  <li><strong>Exam Activity:</strong> Your answers, scores, time spent per question, and exam attempts to power your statistics dashboard.</li>
                  <li><strong>Usage Data:</strong> Pages visited, features used, and session duration to improve the platform.</li>
                  <li><strong>Device Information:</strong> Browser type, operating system, and IP address for security and analytics.</li>
                </ul>
              </SubSection>
            </Section>

            {/* Section 2 */}
            <Section title="2. How We Use Your Information">
              <ul className="list-disc pl-5 space-y-2">
                <li>To create and manage your account.</li>
                <li>To display your exam history, scores, and performance statistics.</li>
                <li>To improve our question bank, features, and overall platform experience.</li>
                <li>To send important service-related notifications (e.g., password resets).</li>
                <li>To detect and prevent fraud or unauthorized access.</li>
                <li>To comply with applicable legal obligations.</li>
              </ul>
              <p className="mt-4">We do <strong>not</strong> sell your personal information to third parties.</p>
            </Section>

            {/* Section 3 */}
            <Section title="3. Third-Party Services">
              <p>We use the following trusted third-party services:</p>
              <ul className="list-disc pl-5 space-y-2 mt-3">
                <li>
                  <strong>Supabase</strong> — Authentication and database storage. Your data is stored securely on Supabase infrastructure. See{' '}
                  <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">Supabase Privacy Policy</a>.
                </li>
                <li>
                  <strong>Google OAuth</strong> — If you sign in with Google, Google shares your name, email, and profile photo with us. See{' '}
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">Google Privacy Policy</a>.
                </li>
              </ul>
            </Section>

            {/* Section 4 */}
            <Section title="4. Data Storage and Security">
              <p>Your data is stored on secure servers provided by Supabase with industry-standard encryption at rest and in transit (TLS). We implement appropriate technical and organizational measures to protect your information. However, no method of transmission over the internet is 100% secure.</p>
            </Section>

            {/* Section 5 */}
            <Section title="5. Your Rights">
              <p>You have the right to:</p>
              <ul className="list-disc pl-5 space-y-2 mt-3">
                <li><strong>Access</strong> — Request a copy of the personal data we hold about you.</li>
                <li><strong>Correction</strong> — Request correction of inaccurate data.</li>
                <li><strong>Deletion</strong> — Request deletion of your account and associated data.</li>
                <li><strong>Portability</strong> — Request your data in a machine-readable format.</li>
              </ul>
              <p className="mt-4">To exercise any of these rights, contact us at <a href="mailto:support@railjee.com" className="text-orange-600 hover:underline">support@railjee.com</a>.</p>
            </Section>

            {/* Section 6 */}
            <Section title="6. Cookies">
              <p>We use essential cookies to maintain your login session. These are strictly necessary for the platform to function and cannot be disabled. We do not use advertising or tracking cookies.</p>
            </Section>

            {/* Section 7 */}
            <Section title="7. Children's Privacy">
              <p>RailJee is not directed at children under 13. We do not knowingly collect personal information from children under 13. If we discover such data has been collected, we will delete it promptly.</p>
            </Section>

            {/* Section 8 */}
            <Section title="8. Changes to This Policy">
              <p>We may update this Privacy Policy from time to time. When we do, we will update the "Last updated" date at the top. Continued use of RailJee after changes means you accept the updated policy.</p>
            </Section>

            {/* Section 9 */}
            <Section title="9. Contact Us">
              <p>If you have any questions or concerns about this Privacy Policy, please contact us:</p>
              <div className="mt-3 bg-stone-50 border border-stone-100 rounded-lg p-4">
                <p><strong>RailJee</strong></p>
                <p>Email: <a href="mailto:railjee.official@gmail.com" className="text-orange-600 hover:underline">railjee.official@gmail.com</a></p>
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

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <h3 className="font-semibold text-stone-800 mb-1">{title}</h3>
      {children}
    </div>
  );
}
