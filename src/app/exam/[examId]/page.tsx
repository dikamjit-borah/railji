
// Server component page for dynamic exam route

interface PageProps {
  params: Promise<{ examId: string }>;
}

import { default as ExamPageClient } from '@/components/ExamPageClient';

// Re-export generateStaticParams so this dynamic route can be statically exported
export { generateStaticParams } from './generateStaticParams';


export default async function Page({ params }: PageProps) {
  const { examId } = await params;
  return <ExamPageClient examId={examId} />;
}
