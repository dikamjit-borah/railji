'use client';

import { useState, useEffect } from 'react';
import DepartmentShowcase from '@/components/home/DepartmentShowcase';
import ExamCards from '@/components/home/ExamCards';
import Features from '@/components/home/Features';
import HowItWorks from '@/components/home/HowItWorks';
import Testimonials from '@/components/home/Testimonials';
import Footer from '@/components/home/Footer';
import LoadingScreen from '@/components/LoadingScreen';
import { API_ENDPOINTS } from '@/lib/apiConfig';
import { departmentCache } from '@/lib/departmentCache';
import { type TopPaper } from '@/lib/api';

export default function HomeClient() {
  const [isLoading, setIsLoading] = useState(true);
  const [topPapers, setTopPapers] = useState<TopPaper[]>([]);
  const [dataReady, setDataReady] = useState({
    departments: false,
    topPapers: false
  });

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        // Call both APIs in parallel
        const [departmentsResponse, topPapersResponse] = await Promise.all([
          // Fetch departments
          fetch(API_ENDPOINTS.DEPARTMENTS)
            .then(res => res.ok ? res.json() : Promise.reject('Departments fetch failed'))
            .then(apiData => {
              const departments = apiData.data || [];
              
              // Cache for other pages
              departmentCache.set({
                departments
              });
              
              return { success: true, data: departments };
            })
            .catch(error => {
              console.error('Departments fetch error:', error);
              return { success: false, data: [] };
            }),
          
          // Fetch top papers
          fetch(API_ENDPOINTS.TOP_PAPERS)
            .then(res => res.ok ? res.json() : Promise.reject('Top papers fetch failed'))
            .then(apiData => {
              const papers = apiData.data || [];
              setTopPapers(papers.slice(0, 6));
              return { success: true, data: papers };
            })
            .catch(error => {
              console.error('Top papers fetch error:', error);
              return { success: false, data: [] };
            })
        ]);

        // Mark both as ready
        setDataReady({
          departments: true,
          topPapers: true
        });

        // Small delay to ensure smooth transition
        setTimeout(() => {
          setIsLoading(false);
        }, 2000);
      } catch (error) {
        console.error('Error loading initial data:', error);
        // Even on error, stop loading to show the page
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  if (isLoading) {
    return <LoadingScreen isLoading={isLoading} message="Loading Rail-Jee..." />;
  }

  return (
    <>
      <DepartmentShowcase dataReady={dataReady.departments} />
      <ExamCards dataReady={dataReady.topPapers} papers={topPapers} />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Footer />
    </>
  );
}
