import type { Metadata } from 'next';
import SubscriptionPageClient from '@/components/subscription/SubscriptionPageClient';

export const metadata: Metadata = {
  title: 'Subscription Plans | Railjee',
  description: 'Choose a department and subscription duration to unlock Railjee premium papers.',
};

export default function SubscriptionPage() {
  return <SubscriptionPageClient />;
}
