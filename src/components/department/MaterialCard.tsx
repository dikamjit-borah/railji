'use client';

interface Material {
  id: string;
  name: string;
  type: 'notes' | 'book' | 'video' | 'guide';
  description: string;
  downloads: number;
  rating: number;
  isFree: boolean;
  contentType: 'pdf' | 'video';
  contentUrl: string;
}

interface MaterialCardProps {
  material: Material;
  index: number;
  onSelect: (material: Material) => void;
}

const materialTypes = {
  notes: { label: 'Study Notes', icon: '📝', color: 'bg-blue-100 text-blue-700' },
  book: { label: 'Books', icon: '📚', color: 'bg-purple-100 text-purple-700' },
  video: { label: 'Video Lectures', icon: '🎥', color: 'bg-red-100 text-red-700' },
  guide: { label: 'Guides', icon: '📖', color: 'bg-green-100 text-green-700' },
};

const formatAttempts = (num: number) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
};

export default function MaterialCard({ material, index, onSelect }: MaterialCardProps) {
  return (
    <div
      onClick={() => onSelect(material)}
      className="relative w-full bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 text-left shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 group border border-stone-100 overflow-hidden cursor-pointer"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-600/20 to-orange-500/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10 rounded-xl sm:rounded-2xl">
        <div className="text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          <button className="bg-white text-orange-700 px-4 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-bold text-sm sm:text-base shadow-xl hover:shadow-2xl hover:scale-105 transition-all">
            {material.contentType === 'pdf' ? 'View PDF' : 'Watch Video'}
            <svg className="w-3 h-3 sm:w-4 sm:h-4 inline-block ml-1.5 sm:ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={material.contentType === 'pdf' ? "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" : "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z M21 12a9 9 0 11-18 0 9 9 0 0118 0z"} />
            </svg>
          </button>
        </div>
      </div>

      {/* Material Type Badge */}
      <div className="flex items-center justify-between mb-2 sm:mb-3">
        <div className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xxs sm:text-xs font-semibold ${materialTypes[material.type].color}`}>
          {materialTypes[material.type].icon} {materialTypes[material.type].label}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-base sm:text-lg font-bold text-stone-900 leading-tight group-hover:text-orange-700 transition-colors mb-1.5 sm:mb-2">
        {material.name}
      </h3>

      {/* Description */}
      <p className="text-stone-500 text-xxs sm:text-xs mb-3 sm:mb-4 line-clamp-2">
        {material.description}
      </p>

      {/* Divider */}
      <div className="border-t border-stone-100 pt-2 sm:pt-3">
        {/* Bottom Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 sm:gap-1.5 text-xxs sm:text-xs text-stone-600">
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>{formatAttempts(material.downloads)}</span>
          </div>
          <div className="flex items-center gap-0.5 sm:gap-1">
            <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <span className="text-xxs sm:text-xs font-semibold text-stone-700">{material.rating}</span>
          </div>
        </div>
      </div>

      {/* Free Badge */}
      <div className="absolute top-2 sm:top-3 right-2 sm:right-3 px-1.5 sm:px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-semibold bg-orange-500 text-white">
        FREE
      </div>
    </div>
  );
}
