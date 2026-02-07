import { Suspense } from 'react';
import ExamResultClient from '@/components/ExamResultClient';
import LoadingState from '@/components/common/LoadingState';

interface ExamResultPageProps {
  params: {
    examId: string;
  };
}

export default function ExamResultPage({ params }: ExamResultPageProps) {
  return (
    <Suspense fallback={<LoadingState message="Loading exam results..." />}>
      <ExamResultClient examId={params.examId} />
    </Suspense>
  );
}
