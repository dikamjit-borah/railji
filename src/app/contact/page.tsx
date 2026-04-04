import Link from 'next/link';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import { createClient } from '@/lib/supabase/server';
import ContactForm from './ContactForm';

export const metadata = {
  title: 'Contact Us | RailJee',
  description: 'Get in touch with the RailJee team. We\'re here to help with your railway exam preparation journey.',
};

const contactDetails = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
    title: 'Email Us',
    value: 'railjee.official@gmail.com',
    href: 'mailto:railjee.official@gmail.com',
    desc: 'We typically respond within 24–48 hours.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 01-.923 1.785A5.969 5.969 0 006 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337z" />
      </svg>
    ),
    title: 'Community & Feedback',
    value: 'WhatsApp Community',
    href: 'https://chat.whatsapp.com/EXAMPLELINK',
    desc: 'Interact, discuss, and prepare with fellow railway employees.',
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
    title: 'Report an Issue',
    value: 'railjee.official@gmail.com',
    href: 'mailto:railjee.official@gmail.com',
    desc: 'For urgent platform issues or abuse reports.',
  },
];

const faqs = [
  {
    q: 'How do I report a wrong question or answer?',
    a: 'Email us at railjee.official@gmail.com with the exam name, question number, and a brief explanation. We review all reports promptly.',
  },
  {
    q: 'Can I request content for a specific department or exam year?',
    a: 'Absolutely. Use the contact form or reach out directly and we\'ll prioritise based on demand.',
  },
  {
    q: 'How do I delete my account?',
    a: 'Email us directly at railjee.official@gmail.com to request account deletion. Our team will completely remove your data within 48 hours.',
  },
];

export default async function ContactPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen bg-white">
      <Navbar user={user} />

      {/* Hero */}
      <section className="bg-[#faf9f7] py-12 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-stone-100">
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-stone-500 mb-6">
            <Link href="/" className="hover:text-orange-600 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-stone-700">Contact Us</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 mb-4 leading-tight">
            We&apos;d Love to{' '}
            <span className="text-orange-600">Hear From You</span>
          </h1>
          <p className="text-stone-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
            Have a question, found a bug, or want to suggest new content? Reach out to us. Our team is happy to help every railway professional advance their career.
          </p>
        </div>
      </section>

      {/* Contact Cards */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-5 sm:gap-6 mb-14 sm:mb-16">
            {contactDetails.map((item) => (
              <a
                key={item.title}
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="group bg-[#faf9f7] border border-stone-100 rounded-2xl p-6 hover:border-orange-200 hover:bg-orange-50 transition-colors"
              >
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-orange-100 text-orange-600 mb-4 group-hover:bg-orange-200 transition-colors">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-stone-900 mb-1 text-sm sm:text-base">{item.title}</h3>
                <p className="text-orange-600 text-sm font-medium mb-2">{item.value}</p>
                <p className="text-stone-500 text-xs sm:text-sm leading-relaxed">{item.desc}</p>
              </a>
            ))}
          </div>

          {/* Form + FAQ Grid */}
          <div className="grid lg:grid-cols-5 gap-10 lg:gap-16 items-start">

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <span className="text-xs font-semibold uppercase tracking-widest text-orange-600 mb-3 block">Send a Message</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-6">Drop Us a Line</h2>

              <ContactForm />
            </div>

            {/* FAQ */}
            <div className="lg:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-orange-600 mb-3 block">FAQ</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-6">Common Questions</h2>
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <div key={faq.q} className="bg-[#faf9f7] border border-stone-100 rounded-xl p-4 sm:p-5">
                    <h4 className="font-semibold text-stone-900 text-sm mb-1.5">{faq.q}</h4>
                    <p className="text-stone-500 text-xs sm:text-sm leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-[#faf9f7] border-t border-stone-100">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 mb-4">
            Ready to Start Preparing?
          </h2>
          <p className="text-stone-600 text-sm sm:text-base mb-8 leading-relaxed">
            While you wait for our reply, start practicing with authentic exam questions across all major railway departments.
          </p>
          <Link
            href="/departments"
            className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            Browse Departments
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}
