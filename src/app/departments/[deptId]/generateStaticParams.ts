// This file enables static export for dynamic route [deptId]
export function generateStaticParams() {
  return [
    { deptId: 'civil' },
    { deptId: 'mechanical' },
    { deptId: 'electrical' },
    { deptId: 'commercial' },
    { deptId: 'personnel' },
    { deptId: 'operating' },
    { deptId: 'snt' },
    { deptId: 'metro' },
  ];
}