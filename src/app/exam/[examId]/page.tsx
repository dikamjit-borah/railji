
// Server component page for dynamic exam route
import { Suspense } from 'react';
import { default as ExamPageClient } from '@/components/ExamPageClient';
import LoadingState from '@/components/common/LoadingState';

interface PageProps {
  params: Promise<{ examId: string }>;
}

// Re-export generateStaticParams so this dynamic route can be statically exported
export { generateStaticParams } from './generateStaticParams';


export default async function Page({ params }: PageProps) {
  const { examId } = await params;
  return (
    <Suspense fallback={<LoadingState message="Loading exam..." />}>
      <ExamPageClient examId={examId} />
    </Suspense>
  );
}
