'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useState, useMemo, useEffect } from 'react';
import DepartmentHeader from './department/DepartmentHeader';
import DepartmentBanner from './department/DepartmentBanner';
import TabNavigation from './department/TabNavigation';
import FilterSection from './department/FilterSection';
import PaperCard from './department/PaperCard';
import MaterialCard from './department/MaterialCard';
import StatsSection from './department/StatsSection';
import MaterialViewer from './department/MaterialViewer';

interface ExamPaper {
  id: string;
  name: string;
  description: string;
  year: string;
  shift: string;
  questions: number;
  duration: number;
  attempts: number;
  rating: number;
  isFree: boolean;
  isNew?: boolean;
  subjects?: string[];
  examId: string;
}

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

interface DepartmentInfo {
  id: string;
  name: string;
  fullName: string;
  color: {
    gradient: string;
    bg: string;
  };
}

interface DepartmentData {
  department: DepartmentInfo;
  papers: ExamPaper[];
  filters: {
    examTypes: string[];
    subjects: string[];
  };
}

interface DepartmentDetailClientProps {
  deptId: string;
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

export default function DepartmentDetailClient({ deptId }: DepartmentDetailClientProps) {
  const router = useRouter();

  const [selectedExamType, setSelectedExamType] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'papers' | 'materials'>('papers');
  const [selectedMaterialType, setSelectedMaterialType] = useState<string>('All');
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [showOthersDropdown, setShowOthersDropdown] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [showSubjectsDropdown, setShowSubjectsDropdown] = useState(false);
  
  // API state
  const [departmentData, setDepartmentData] = useState<DepartmentData | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMaterials, setLoadingMaterials] = useState(false);
  const [materialsLoaded, setMaterialsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch department data from API
  useEffect(() => {
    const fetchDepartmentData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/departments/${deptId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch department data: ${response.statusText}`);
        }
        
        const result = await response.json();
        
        if (!result.success || !result.data) {
          throw new Error(result.error?.message || 'Failed to load department data');
        }
        
        setDepartmentData(result.data);
        
        // Prefetch materials in the background after page loads
        setTimeout(() => {
          fetchMaterials();
        }, 500);
      } catch (err) {
        const error = err as Error;
        setError(error.message || 'Failed to load department data');
        console.error('Error fetching department data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartmentData();
  }, [deptId]);

  // Fetch materials data (lazy loaded)
  const fetchMaterials = async () => {
    if (materialsLoaded) return; // Don't fetch if already loaded
    
    try {
      setLoadingMaterials(true);
      
      const response = await fetch(`/api/departments/${deptId}/materials`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch materials: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        setMaterials(result.data);
        setMaterialsLoaded(true);
      }
    } catch (err) {
      console.error('Error fetching materials:', err);
      // Don't show error to user, materials are optional
    } finally {
      setLoadingMaterials(false);
    }
  };

  const department = departmentData?.department;
  const papers = departmentData?.papers || [];
  const availableExamTypes = departmentData?.filters.examTypes || [];
  const availableSubjects = departmentData?.filters.subjects || [];

  // Define main exam types to show as buttons
  const mainExamTypes = ['RRB JE CBT-1', 'RRB NTPC CBT-1', 'RRB ALP CBT-1'];

  // Get all unique exam types
  const allExamTypes = useMemo(() => {
    return availableExamTypes;
  }, [availableExamTypes]);

  // Get other exam types (not in main filters)
  const otherExamTypes = useMemo(() => {
    return allExamTypes.filter(type => !mainExamTypes.includes(type));
  }, [allExamTypes, mainExamTypes]);

  // Get all unique subjects
  const allSubjects = useMemo(() => {
    return availableSubjects;
  }, [availableSubjects]);

  const filteredPapers = useMemo(() => {
    return papers.filter(paper => {
      const matchType = selectedExamType === 'All' || paper.name === selectedExamType;
      const matchSubject = selectedSubject === 'All' || (paper.subjects && paper.subjects.includes(selectedSubject));
      return matchType && matchSubject;
    });
  }, [papers, selectedExamType, selectedSubject]);

  const materialTypeOptions = useMemo(() => {
    const types = [...new Set(materials.map(m => m.type))];
    return ['All', ...types];
  }, [materials]);

  const filteredMaterials = useMemo(() => {
    return materials.filter(material => {
      const matchType = selectedMaterialType === 'All' || material.type === selectedMaterialType;
      return matchType;
    });
  }, [materials, selectedMaterialType]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-teal-900 via-teal-800 to-teal-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
          <p className="text-white font-medium">Loading department data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !department) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-teal-900 via-teal-800 to-teal-900 flex items-center justify-center">
        <div className="text-center max-w-md px-4">
          <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-2xl font-bold text-white mb-2">Failed to Load</h2>
          <p className="text-white/80 mb-6">{error || 'Department not found'}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-white text-teal-900 rounded-xl font-medium hover:shadow-lg transition-all"
            >
              Try Again
            </button>
            <Link
              href="/departments"
              className="px-6 py-3 bg-white/10 backdrop-blur text-white rounded-xl font-medium hover:bg-white/20 transition-all"
            >
              Go Back
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!department) {
    return (
      <div className="min-h-screen bg-[#faf9f7] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-stone-900 mb-4">Department not found</h1>
          <Link href="/departments" className="text-emerald-600 hover:underline">
            Go back to departments
          </Link>
        </div>
      </div>
    );
  }

  const handlePaperSelect = (paper: ExamPaper) => {
    // Use examId directly from the paper object provided by API
    router.push(`/exam/${paper.examId}`);
  };

  const handleTabChange = (tab: 'papers' | 'materials') => {
    setActiveTab(tab);
    if (tab === 'materials' && !materialsLoaded && !loadingMaterials) {
      fetchMaterials();
    }
  };

  const handlePapersTabClick = () => {
    setActiveTab('papers');
    setSelectedExamType('All');
    setSelectedSubject('All');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-900 via-teal-800 to-teal-900">
      <DepartmentHeader />

      <DepartmentBanner
        department={department}
        activeTab={activeTab}
        filteredCount={activeTab === 'papers' ? filteredPapers.length : filteredMaterials.length}
      />

      <div className="px-4 sm:px-6 lg:px-8 pb-6 lg:pb-8">
        <div className="max-w-7xl mx-auto">
          <TabNavigation
            activeTab={activeTab}
            papersCount={filteredPapers.length}
            loadingMaterials={loadingMaterials}
            materialsLoaded={materialsLoaded}
            onTabChange={handleTabChange}
            onPapersTabClick={handlePapersTabClick}
          />
        </div>
      </div>

      <FilterSection
        activeTab={activeTab}
        selectedExamType={selectedExamType}
        selectedSubject={selectedSubject}
        mainExamTypes={mainExamTypes}
        allExamTypes={allExamTypes}
        otherExamTypes={otherExamTypes}
        allSubjects={allSubjects}
        showOthersDropdown={showOthersDropdown}
        showSubjectsDropdown={showSubjectsDropdown}
        onExamTypeChange={(type) => {
          setSelectedExamType(type);
          setShowOthersDropdown(false);
        }}
        onSubjectChange={setSelectedSubject}
        onToggleOthersDropdown={() => {
          setShowOthersDropdown(!showOthersDropdown);
          setShowSubjectsDropdown(false);
        }}
        onToggleSubjectsDropdown={() => {
          setShowSubjectsDropdown(!showSubjectsDropdown);
          setShowOthersDropdown(false);
        }}
        selectedMaterialType={selectedMaterialType}
        materialTypeOptions={materialTypeOptions}
        onMaterialTypeChange={setSelectedMaterialType}
      />

      {/* Papers/Materials List */}
      <main className="px-4 sm:px-6 lg:px-8 pb-12 lg:pb-16">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'papers' ? (
            <>
              {/* Results Count */}
              <div className="flex items-center justify-between mb-6 lg:mb-8">
                <p className="text-teal-200 text-base lg:text-lg">
                  Showing <span className="font-semibold text-white text-lg lg:text-xl">{filteredPapers.length}</span> {filteredPapers.length === 1 ? 'paper' : 'papers'}
                </p>
                <div className="hidden lg:flex items-center gap-3 text-teal-200 text-sm">
                  <button className="px-4 py-2 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                    </svg>
                    Sort by
                  </button>
                </div>
              </div>

              {/* Papers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5">
                {filteredPapers.length === 0 ? (
                  <div className="md:col-span-2 xl:col-span-3 bg-white/10 backdrop-blur-sm rounded-2xl p-10 text-center">
                    <svg className="w-16 h-16 text-teal-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-xl font-semibold text-white mb-2">No papers found</h3>
                    <p className="text-teal-200">Try adjusting your filters</p>
                  </div>
                ) : (
                  filteredPapers.map((paper, index) => (
                    <PaperCard
                      key={paper.id}
                      paper={paper}
                      index={index}
                      onSelect={handlePaperSelect}
                    />
                  ))
                )}
              </div>

              <StatsSection
                totalCount={papers.length}
                newCount={papers.filter(p => p.isNew).length}
                type="papers"
              />
            </>
          ) : (
            <>
              {/* Materials Results Count */}
              <div className="flex items-center justify-between mb-6 lg:mb-8">
                <p className="text-teal-200 text-base lg:text-lg">
                  Showing <span className="font-semibold text-white text-lg lg:text-xl">{filteredMaterials.length}</span> {filteredMaterials.length === 1 ? 'material' : 'materials'}
                </p>
              </div>

              {/* Materials Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5">
                {filteredMaterials.length === 0 ? (
                  <div className="md:col-span-2 xl:col-span-3 bg-white/10 backdrop-blur-sm rounded-2xl p-10 text-center">
                    <svg className="w-16 h-16 text-teal-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-xl font-semibold text-white mb-2">No materials found</h3>
                    <p className="text-teal-200">Try adjusting your filters</p>
                  </div>
                ) : (
                  filteredMaterials.map((material, index) => (
                    <MaterialCard
                      key={material.id}
                      material={material}
                      index={index}
                      onSelect={setSelectedMaterial}
                    />
                  ))
                )}
              </div>

              <StatsSection
                totalCount={materials.length}
                notesCount={materials.filter(m => m.type === 'notes').length}
                type="materials"
              />
            </>
          )}
        </div>
      </main>

      {/* Material Viewer Modal */}
      {selectedMaterial && (
        <MaterialViewer
          material={selectedMaterial}
          onClose={() => setSelectedMaterial(null)}
        />
      )}
    </div>
  );
}