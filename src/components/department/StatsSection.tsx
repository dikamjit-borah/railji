'use client';

interface StatsSectionProps {
  totalCount: number;
  newCount?: number;
  notesCount?: number;
  type: 'papers' | 'materials';
}

export default function StatsSection({ totalCount, newCount, notesCount, type }: StatsSectionProps) {
  if (type === 'papers') {
    return (
      <div className="mt-10 lg:mt-14 grid grid-cols-3 gap-3 lg:gap-6">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl lg:rounded-2xl p-4 lg:p-6 text-center hover:bg-white/15 transition-colors">
          <div className="text-2xl lg:text-4xl font-bold text-white mb-1">{totalCount}</div>
          <div className="text-xs lg:text-sm text-teal-200">Total Papers</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl lg:rounded-2xl p-4 lg:p-6 text-center hover:bg-white/15 transition-colors">
          <div className="text-2xl lg:text-4xl font-bold text-white mb-1">{newCount || 0}</div>
          <div className="text-xs lg:text-sm text-teal-200">New Papers</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl lg:rounded-2xl p-4 lg:p-6 text-center hover:bg-white/15 transition-colors">
          <div className="text-2xl lg:text-4xl font-bold text-emerald-400 mb-1">100%</div>
          <div className="text-xs lg:text-sm text-teal-200">Free Access</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10 lg:mt-14 grid grid-cols-3 gap-3 lg:gap-6">
      <div className="bg-white/10 backdrop-blur-sm rounded-xl lg:rounded-2xl p-4 lg:p-6 text-center hover:bg-white/15 transition-colors">
        <div className="text-2xl lg:text-4xl font-bold text-white mb-1">{totalCount}</div>
        <div className="text-xs lg:text-sm text-teal-200">Total Materials</div>
      </div>
      <div className="bg-white/10 backdrop-blur-sm rounded-xl lg:rounded-2xl p-4 lg:p-6 text-center hover:bg-white/15 transition-colors">
        <div className="text-2xl lg:text-4xl font-bold text-white mb-1">{notesCount || 0}</div>
        <div className="text-xs lg:text-sm text-teal-200">Study Notes</div>
      </div>
      <div className="bg-white/10 backdrop-blur-sm rounded-xl lg:rounded-2xl p-4 lg:p-6 text-center hover:bg-white/15 transition-colors">
        <div className="text-2xl lg:text-4xl font-bold text-emerald-400 mb-1">100%</div>
        <div className="text-xs lg:text-sm text-teal-200">Free Access</div>
      </div>
    </div>
  );
}
