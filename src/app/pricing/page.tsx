import type { Metadata } from 'next';
import SubscriptionPageClient from '@/components/subscription/SubscriptionPageClient';

export const metadata: Metadata = {
  title: 'Pricing | RailJee',
  description: 'Affordable pricing plans for RailJee, the bilingual departmental promotional exam preparation platform for Indian Railway employees.',
};

export default function PricingPage() {
  return <SubscriptionPageClient />;
}
