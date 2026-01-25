// This file enables static export for dynamic route [examId]
// Returns all exam IDs from exams.json
import examData from '@/data/exams.json';

export function generateStaticParams() {
  // If build tools cannot import JSON, hardcode the IDs:
  // return [ { examId: 'je' }, { examId: 'ntpc' }, { examId: 'jr-clerk' } ];
  if (Array.isArray(examData.exams)) {
    return examData.exams.map((exam: { id: string }) => ({ examId: exam.id }));
  }
  return [
    { examId: 'je' },
    { examId: 'ntpc' },
    { examId: 'jr-clerk' },
  ];
}
