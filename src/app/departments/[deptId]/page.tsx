import DepartmentDetailClient from '@/components/DepartmentDetailClient';

interface PageProps {
  params: Promise<{ deptId: string }>;
}

// Re-export generateStaticParams so this dynamic route can be statically exported
export { generateStaticParams } from './generateStaticParams';

export default async function DepartmentDetailPage({ params }: PageProps) {
  const { deptId } = await params;
  return <DepartmentDetailClient deptId={deptId} />;
}
