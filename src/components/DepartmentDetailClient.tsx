'use client';

import { useRouter } from 'next/navigation';
import { useState, useMemo, useEffect } from 'react';
import { API_ENDPOINTS } from '@/lib/apiConfig';
import { departmentCache } from '@/lib/departmentCache';
import { ExamPaper, Material, DepartmentInfo, DepartmentData } from '@/lib/types';
import LoadingState from './common/LoadingState';
import ErrorScreen from './common/ErrorScreen';
import DepartmentHeader from './department/DepartmentHeader';
import DepartmentBanner from './department/DepartmentBanner';
import TabNavigation from './department/TabNavigation';
import FilterSection from './department/FilterSection';
import PaperCard from './department/PaperCard';
import MaterialCard from './department/MaterialCard';
import MaterialViewer from './department/MaterialViewer';

interface DepartmentDetailClientProps {
  slug: string;
}

export default function DepartmentDetailClient({ slug }: DepartmentDetailClientProps) {
  const router = useRouter();

  const [selectedExamType, setSelectedExamType] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'papers' | 'materials'>('papers');
  const [selectedMaterialType, setSelectedMaterialType] = useState<string>('All');
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [showOthersDropdown, setShowOthersDropdown] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [showSubjectsDropdown, setShowSubjectsDropdown] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'date'>('date');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  
  // API state
  const [departmentData, setDepartmentData] = useState<DepartmentData | null>(null);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingPapers, setLoadingPapers] = useState(false);
  const [loadingMaterials, setLoadingMaterials] = useState(false);
  const [materialsLoaded, setMaterialsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [externalDeptId, setExternalDeptId] = useState<string>('');
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [generalDeptId, setGeneralDeptId] = useState<string>('');

  // Fetch department data from API
  useEffect(() => {
    const fetchDepartmentData = async () => {
      try {
        // Use different loading states for initial vs filter changes
        if (isInitialLoad) {
          setLoading(true);
        } else {
          setLoadingPapers(true);
          // Clear current papers when filter changes
          if (departmentData) {
            setDepartmentData({
              ...departmentData,
              papers: []
            });
          }
        }
        setError(null);
        
        // Determine the department ID to use
        let apiDeptId = externalDeptId;
        let currentDept: any = null;
        
        // Try to get department from cache first
        if (!apiDeptId) {
          const cachedDept = departmentCache.findDepartment(slug);
          
          if (cachedDept) {
            // Found in cache, use it
            apiDeptId = cachedDept.departmentId || cachedDept.id;
            currentDept = cachedDept;
            setExternalDeptId(apiDeptId);
            
            // Also get generalDeptId from cache
            const cachedGeneralDeptId = departmentCache.getGeneralDeptId();
            if (cachedGeneralDeptId && isInitialLoad) {
              setGeneralDeptId(cachedGeneralDeptId);
            }
          } else {
            // Not in cache, fetch from API
            const deptsResponse = await fetch(API_ENDPOINTS.DEPARTMENTS);
            
            if (!deptsResponse.ok) {
              throw new Error(`Failed to fetch departments: ${deptsResponse.statusText}`);
            }
            
            const deptsData = await deptsResponse.json();
            const departments = deptsData.data?.departments || [];
            const metadata = deptsData.data?.metadata || {};
            
            // Cache the data for future use
            departmentCache.set({
              departments,
              metadata: {
                generalDeptId: metadata.general?.departmentId,
                ...metadata
              }
            });
            
            // Find the matching department by slug
            currentDept = departments.find((dept: any) => 
              dept.slug === slug || 
              dept.id === slug ||
              dept.departmentId === slug
            );
            
            if (!currentDept) {
              throw new Error('Department not found');
            }
            
            apiDeptId = currentDept.departmentId || currentDept.id;
            setExternalDeptId(apiDeptId);
            
            // Store generalDeptId
            if (metadata.general?.departmentId && isInitialLoad) {
              setGeneralDeptId(metadata.general.departmentId);
            }
          }
        } else {
          // If we already have the apiDeptId, still get currentDept from cache for display
          currentDept = departmentCache.findDepartment(slug);
        }
        
        // Build API URL with paperCode parameter if filter is selected
        // Use generalDeptId for subject filters, otherwise use current department ID
        const deptIdForApi = (selectedSubject !== 'All' && generalDeptId) ? generalDeptId : apiDeptId;
        let papersUrl = API_ENDPOINTS.PAPERS(deptIdForApi);
        
        if (selectedSubject !== 'All') {
          // Subject filter: Show only "general" paperType papers
          papersUrl += `?paperCode=${selectedSubject}&paperType=general`;
        } else if (selectedExamType !== 'All') {
          // Previous year filter: Show only "full" paperType papers
          papersUrl += `?paperCode=${selectedExamType}&paperType=sectional`;
        } else {
          // Default (All): Show only "full" paperType papers
          papersUrl += `?paperType=full`;
        }
        
        // Fetch papers from external API
        const papersResponse = await fetch(papersUrl);
        
        if (!papersResponse.ok) {
          throw new Error(`Failed to fetch papers: ${papersResponse.statusText}`);
        }
        
        const papersData = await papersResponse.json();
        
        // Extract filters from metadata
        const metadata = papersData.data?.metadata || {};
        const paperCodes = metadata.paperCodes || { general: [], nonGeneral: [] };
        const generalFilters = paperCodes.general || [];
        const mainFilters = paperCodes.nonGeneral || [];
        
        // Transform external API papers to match our interface
        const transformedPapers: ExamPaper[] = papersData.data?.papers?.map((paper: any) => ({
          id: paper.paperId || paper._id,
          name: paper.name,
          description: paper.description,
          year: paper.year?.toString() || '2023',
          shift: paper.shift || 'Morning',
          questions: paper.totalQuestions || paper.questions || 100,
          duration: paper.duration || 90,
          attempts: Math.floor(Math.random() * 5000) + 1000,
          rating: paper.rating || 4.0,
          isFree: paper.isFree !== undefined ? paper.isFree : false,
          isNew: paper.isNew || false,
          subjects: [],
          examId: paper.paperId || paper._id,
          paperCode: paper.paperCode,
          type: paper.type || paper.paperType,
          zones: paper.zones,
          examType: paper.examType,
          totalQuestions: paper.totalQuestions,
          passMarks: paper.passMarks,
          negativeMarking: paper.negativeMarking
        })) || [];
        
        // Map department data
        const departmentInfo: DepartmentInfo = {
          id: slug,
          name: currentDept?.name || currentDept?.departmentName || 'Department',
          fullName: currentDept?.fullName || currentDept?.name || currentDept?.departmentName || 'Department',
          color: currentDept?.color || {
            gradient: 'from-orange-600 to-red-700',
            bg: 'bg-orange-50'
          },
          departmentId: apiDeptId
        };
        
        setDepartmentData({
          department: departmentInfo,
          papers: transformedPapers,
          filters: {
            examTypes: mainFilters.length > 0 ? mainFilters : [],
            subjects: generalFilters.length > 0 ? generalFilters : []
          }
        });
        
        // Prefetch materials in the background
        setTimeout(() => {
          fetchMaterials();
        }, 500);
      } catch (err) {
        const error = err as Error;
        setError(error.message || 'Failed to load department data');
        console.error('Error fetching department data:', err);
      } finally {
        setLoading(false);
        setLoadingPapers(false);
        setIsInitialLoad(false);
      }
    };

    fetchDepartmentData();
  }, [slug, selectedExamType, selectedSubject]);

  // Fetch materials data (lazy loaded)
  const fetchMaterials = async () => {
    if (materialsLoaded) return; // Don't fetch if already loaded
    
    try {
      setLoadingMaterials(true);
      
      const response = await fetch(`/api/departments/${slug}/materials`);
      
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

  // Define main exam types to show as buttons (first 2 from nonGeneral)
  const mainExamTypes = useMemo(() => {
    return availableExamTypes.slice(0, 2);
  }, [availableExamTypes]);

  // Get all unique exam types
  const allExamTypes = useMemo(() => {
    return availableExamTypes;
  }, [availableExamTypes]);

  // Get other exam types (remaining items after first 2, shown in dropdown)
  const otherExamTypes = useMemo(() => {
    return availableExamTypes.slice(2);
  }, [availableExamTypes]);

  // Get all unique subjects
  const allSubjects = useMemo(() => {
    return availableSubjects;
  }, [availableSubjects]);

  const filteredPapers = useMemo(() => {
    // Papers are already filtered by API, just apply sorting
    return [...papers].sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else {
        // Sort by date (year and shift)
        const yearA = typeof a.year === 'string' ? a.year : a.year.toString();
        const yearB = typeof b.year === 'string' ? b.year : b.year.toString();
        const yearCompare = yearB.localeCompare(yearA);
        if (yearCompare !== 0) return yearCompare;
        return b.shift.localeCompare(a.shift);
      }
    });
  }, [papers, sortBy]);

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
    return <LoadingState message="Loading department data..." />;
  }

  // Error state
  if (error || !department) {
    return (
      <ErrorScreen
        title="Failed to Load"
        message={error || 'Department not found'}
        onRetry={() => window.location.reload()}
      />
    );
  }

  const handlePaperSelect = (paper: ExamPaper) => {
    // Navigate with 'general' slug if general filter is active, otherwise use current department slug
    const deptSlug = selectedSubject !== 'All' ? 'general' : slug;
    router.push(`/exam/${paper.examId}?dept=${deptSlug}`);
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
    <div className="min-h-screen bg-[#faf9f7]">
      <DepartmentHeader 
        examTypes={availableExamTypes}
        subjects={availableSubjects}
        onExamTypeSelect={(type) => {
          setSelectedExamType(type);
          setSelectedSubject('All');
        }}
        onSubjectSelect={(subject) => {
          setSelectedSubject(subject);
          setSelectedExamType('All');
        }}
      />

      <DepartmentBanner
        department={department}
        activeTab={activeTab}
        filteredCount={activeTab === 'papers' ? filteredPapers.length : filteredMaterials.length}
      />

      <div className="px-3 sm:px-4 lg:px-8 pb-4 sm:pb-6 lg:pb-8">
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
          setSelectedSubject('All'); // Reset subject when exam type changes
          setShowOthersDropdown(false);
        }}
        onSubjectChange={(subject) => {
          setSelectedSubject(subject);
          if (subject !== 'All') {
            setSelectedExamType('All'); // Reset exam type when subject is selected
          }
        }}
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
      <main className="px-3 sm:px-4 lg:px-8 pb-8 sm:pb-10 lg:pb-12 relative">
        <div className="max-w-7xl mx-auto">
          {activeTab === 'papers' ? (
            <>
              {/* Loading Overlay */}
              {loadingPapers && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl">
                  <div className="flex flex-col items-center gap-3">
                    <svg className="animate-spin h-10 w-10 text-orange-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-stone-700 font-medium">Loading papers...</span>
                  </div>
                </div>
              )}
              {/* Results Count */}
              <div className="flex items-center justify-between mb-4 sm:mb-5 lg:mb-6">
                <p className="text-stone-600 text-sm sm:text-base">
                  Showing <span className="font-semibold text-stone-900 text-base sm:text-lg">{filteredPapers.length}</span> {filteredPapers.length === 1 ? 'paper' : 'papers'}
                </p>
                <div className="hidden lg:flex items-center gap-3 text-stone-700 text-sm relative">
                  <button 
                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                    className="px-4 py-2 rounded-lg hover:bg-stone-200 transition-colors flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                    </svg>
                    Sort by: {sortBy === 'name' ? 'Name' : 'Date'}
                    <svg className={`w-4 h-4 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {showSortDropdown && (
                    <div className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-2xl border border-stone-200 py-2 min-w-[150px] z-50">
                      <button
                        onClick={() => {
                          setSortBy('date');
                          setShowSortDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-orange-50 transition-colors ${
                          sortBy === 'date'
                            ? 'bg-orange-50 text-orange-700 font-medium'
                            : 'text-stone-700'
                        }`}
                      >
                        Date
                      </button>
                      <button
                        onClick={() => {
                          setSortBy('name');
                          setShowSortDropdown(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm hover:bg-orange-50 transition-colors ${
                          sortBy === 'name'
                            ? 'bg-orange-50 text-orange-700 font-medium'
                            : 'text-stone-700'
                        }`}
                      >
                        Name
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Papers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {filteredPapers.length === 0 ? (
                  <div className="md:col-span-2 lg:col-span-3 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-10 text-center">
                    <svg className="w-12 h-12 sm:w-16 sm:h-16 text-orange-300 mx-auto mb-3 sm:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">No papers found</h3>
                    <p className="text-sm sm:text-base text-orange-200">Try adjusting your filters</p>
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
            </>
          ) : (
            <>
              {/* Materials Results Count */}
              <div className="flex items-center justify-between mb-4 sm:mb-5 lg:mb-6">
                <p className="text-orange-200 text-sm sm:text-base">
                  Showing <span className="font-semibold text-white text-base sm:text-lg">{filteredMaterials.length}</span> {filteredMaterials.length === 1 ? 'material' : 'materials'}
                </p>
              </div>

              {/* Materials Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {filteredMaterials.length === 0 ? (
                  <div className="md:col-span-2 lg:col-span-3 bg-white/10 backdrop-blur-sm rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-10 text-center">
                    <svg className="w-12 h-12 sm:w-16 sm:h-16 text-orange-300 mx-auto mb-3 sm:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">No materials found</h3>
                    <p className="text-sm sm:text-base text-orange-200">Try adjusting your filters</p>
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