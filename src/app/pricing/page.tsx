import Link from 'next/link';
import Navbar from '@/components/home/Navbar';
import Footer from '@/components/home/Footer';
import { createClient } from '@/lib/supabase/server';

export const metadata = {
  title: 'Pricing | RailJee',
  description: 'Affordable pricing plans for RailJee, the bilingual departmental promotional exam preparation platform for Indian Railway employees.',
};

const plans = [
  {
    name: 'Basic',
    price: '99',
    description: 'Great for getting started with exam preparation.',
    features: [
      'Access to 2 departments',
      '10 practice tests per month',
      'Bilingual question support',
      'Basic performance stats',
    ],
  },
  {
    name: 'Pro',
    price: '199',
    description: 'Perfect for serious exam preparation across departments.',
    popular: true,
    features: [
      'Access to all departments',
      'Unlimited practice tests',
      'Bilingual question support',
      'Detailed performance analytics',
      'Previous year paper access',
    ],
  },
  {
    name: 'Premium',
    price: '399',
    description: 'Complete preparation with every feature unlocked.',
    features: [
      'Everything in Pro',
      'Priority access to new papers',
      'Downloadable study materials',
      'Personalized weak area reports',
      'Email support within 24 hours',
    ],
  },
];

export default async function PricingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen bg-white">
      <Navbar user={user} />

      {/* Hero */}
      <section className="bg-[#faf9f7] py-12 sm:py-16 px-4 sm:px-6 lg:px-8 border-b border-stone-100">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-stone-500 mb-4">
            <Link href="/" className="hover:text-orange-600 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-stone-700">Pricing</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 mb-3">
            Simple, Affordable <span className="text-orange-600">Pricing</span>
          </h1>
          <p className="text-stone-600 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Choose a plan that fits your preparation needs. All plans include bilingual support and access to authentic past papers.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-[#faf9f7] rounded-2xl border p-6 sm:p-8 flex flex-col transition-all duration-300 hover:shadow-md ${
                  plan.popular
                    ? 'border-orange-300 hover:border-orange-400 ring-1 ring-orange-200'
                    : 'border-stone-100 hover:border-orange-200'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-600 text-white text-xs font-semibold px-4 py-1 rounded-full">
                    Most Popular
                  </span>
                )}

                <div className="mb-5">
                  <h3 className="text-lg font-bold text-stone-900 mb-1">{plan.name}</h3>
                  <p className="text-stone-500 text-xs sm:text-sm leading-relaxed">{plan.description}</p>
                </div>

                <div className="mb-6">
                  <span className="text-3xl sm:text-4xl font-bold text-stone-900">&#8377;{plan.price}</span>
                  <span className="text-stone-500 text-sm ml-1">/month</span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-stone-700">
                      <svg className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Link
                  href="/pricing/payment"
                  className={`block text-center font-semibold px-6 py-3 rounded-xl transition-colors text-sm sm:text-base ${
                    plan.popular
                      ? 'bg-orange-600 hover:bg-orange-700 text-white'
                      : 'bg-white hover:bg-stone-50 text-stone-900 border border-stone-200'
                  }`}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>

          {/* Note */}
          <div className="mt-10 text-center">
            <p className="text-stone-500 text-xs sm:text-sm">
              All prices are in Indian Rupees (INR). Plans auto-renew monthly. Cancel anytime.
            </p>
            <p className="text-stone-400 text-xs mt-2">
              Need help choosing?{' '}
              <Link href="/contact" className="text-orange-600 hover:underline">Contact us</Link>
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
