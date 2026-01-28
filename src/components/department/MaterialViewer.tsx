'use client';

interface Material {
  id: string;
  name: string;
  type: 'notes' | 'book' | 'video' | 'guide';
  description: string;
  downloads: number;
  rating: number;
  contentType: 'pdf' | 'video';
  contentUrl: string;
}

interface MaterialViewerProps {
  material: Material;
  onClose: () => void;
}

const formatAttempts = (num: number) => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
};

export default function MaterialViewer({ material, onClose }: MaterialViewerProps) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-stone-200 flex-shrink-0">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold text-stone-900 truncate">{material.name}</h2>
            <p className="text-stone-500 text-sm mt-1 line-clamp-2">{material.description}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-stone-100 rounded-lg transition-colors flex-shrink-0 ml-4"
          >
            <svg className="w-6 h-6 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-hidden bg-stone-50 flex items-center justify-center">
          {material.contentType === 'pdf' ? (
            <iframe
              src={material.contentUrl}
              className="w-full h-full"
              title={material.name}
            />
          ) : (
            <iframe
              width="100%"
              height="100%"
              src={material.contentUrl}
              title={material.name}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-stone-200 bg-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span className="text-sm font-semibold text-stone-700">{material.rating}</span>
            </div>
            <span className="text-xs text-stone-500">{formatAttempts(material.downloads)} downloads</span>
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
