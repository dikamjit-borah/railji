import Link from 'next/link';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import { createClient } from '@/lib/supabase/server';

export const metadata = {
  title: 'Refund & Cancellation Policy | RailJee',
  description: 'Refund and Cancellation Policy for RailJee, the bilingual departmental promotional exam preparation platform for Indian Railway employees.',
};

export default async function RefundPolicyPage() {
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
            <span className="text-stone-700">Refund & Cancellation Policy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-3">Refund & Cancellation Policy</h1>
          <p className="text-stone-500 text-sm">Last updated: April 1, 2026</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="space-y-10 text-stone-700 text-sm sm:text-base leading-relaxed">

            {/* Intro banner */}
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-5 sm:p-6">
              <p className="text-stone-700">
                At <strong className="text-stone-900">RailJee</strong>, we want every user to have a smooth and satisfying experience. This policy outlines the terms under which refunds and cancellations are handled for paid subscription plans on our platform.
              </p>
            </div>

            <Section title="1. Overview">
              <p>
                RailJee offers paid subscription plans that provide access to premium features such as unlimited practice tests, detailed analytics, and downloadable study materials. We understand that plans may not always meet your expectations, and we have put together a fair and transparent refund process.
              </p>
              <p className="mt-3">
                Please review the sections below to understand your eligibility for a refund and how to submit a request.
              </p>
            </Section>

            <Section title="2. Eligibility for Refund">
              <p>You may be eligible for a full refund if all of the following conditions are met:</p>
              <ul className="list-disc pl-5 space-y-2 mt-3">
                <li>Your refund request is submitted within <strong>7 days</strong> of the original purchase date.</li>
                <li>You have not used any premium features included in the plan (such as taking practice tests, accessing study materials, or viewing analytics reports).</li>
                <li>Your account is in good standing and has not been suspended or terminated for a violation of our Terms of Service.</li>
              </ul>
              <p className="mt-3">
                Refund eligibility is determined based on usage records in our system. If no premium activity is detected on your account within the 7-day window, your request will be approved.
              </p>
            </Section>

            <Section title="3. Non-Refundable Cases">
              <p>Refunds will not be provided in the following situations:</p>
              <ul className="list-disc pl-5 space-y-2 mt-3">
                <li>The subscription plan has been partially or fully used (for example, practice tests attempted, papers downloaded, or analytics viewed).</li>
                <li>The plan was purchased at a discounted or promotional price.</li>
                <li>The refund request is made after the 7-day eligibility window has passed.</li>
                <li>The account was terminated due to a breach of our Terms of Service.</li>
              </ul>
            </Section>

            <Section title="4. Payment Failure">
              <p>
                If a payment was deducted from your account but the transaction did not complete successfully on our end, the amount will be automatically reversed to your original payment method within <strong>5 to 7 business days</strong>.
              </p>
              <p className="mt-3">
                If you do not see the reversal reflected in your account within 7 business days, please contact us at{' '}
                <a href="mailto:railjee.official@gmail.com" className="text-orange-600 hover:underline">railjee.official@gmail.com</a>{' '}
                with your transaction ID and payment details so we can look into it and resolve the issue promptly.
              </p>
            </Section>

            <Section title="5. How to Request a Refund">
              <p>To submit a refund request, send an email to:</p>
              <div className="mt-4 bg-stone-50 border border-stone-100 rounded-xl p-5">
                <p className="font-semibold text-stone-900 mb-2">
                  Email:{' '}
                  <a href="mailto:railjee.official@gmail.com" className="text-orange-600 hover:underline">
                    railjee.official@gmail.com
                  </a>
                </p>
                <p className="text-stone-600 text-sm">Please include the following details in your email:</p>
                <ul className="list-disc pl-5 space-y-1 mt-2 text-stone-600 text-sm">
                  <li>Your registered email address</li>
                  <li>Order ID or transaction reference number</li>
                  <li>Date of purchase</li>
                  <li>Reason for requesting a refund</li>
                </ul>
              </div>
              <p className="mt-3">
                Our team will review your request and respond within 48 hours with an update on the status of your refund.
              </p>
            </Section>

            <Section title="6. Processing Time">
              <p>
                Once your refund request has been reviewed and approved, the refund will be processed within <strong>7 to 10 business days</strong>. The refund will be credited back to the original payment method used during the purchase.
              </p>
              <p className="mt-3">
                Please note that the actual time for the refund to appear in your account may vary depending on your bank or payment provider.
              </p>
            </Section>

            <Section title="7. Contact Us">
              <p>
                If you have any questions or concerns about this Refund and Cancellation Policy, or if you need assistance with a payment issue, please reach out to us:
              </p>
              <div className="mt-4 bg-stone-50 border border-stone-100 rounded-xl p-5">
                <p className="font-semibold text-stone-900 mb-1">RailJee</p>
                <p className="text-stone-600 text-sm">
                  Email:{' '}
                  <a href="mailto:railjee.official@gmail.com" className="text-orange-600 hover:underline">
                    railjee.official@gmail.com
                  </a>
                </p>
                <p className="text-stone-500 text-xs mt-2">Business hours: Monday to Saturday, 10:00 AM to 6:00 PM IST. We aim to respond within 48 hours.</p>
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
