'use client';

import { useState, useEffect } from 'react';
import DepartmentShowcase from '@/components/home/DepartmentShowcase';
import ExamCards from '@/components/home/ExamCards';
import Features from '@/components/home/Features';
import HowItWorks from '@/components/home/HowItWorks';
import Testimonials from '@/components/home/Testimonials';
import Footer from '@/components/home/Footer';
import { API_ENDPOINTS } from '@/lib/apiConfig';
import { departmentCache } from '@/lib/departmentCache';
import { type TopPaper } from '@/lib/api';

export default function HomeClient() {
  const [topPapers, setTopPapers] = useState<TopPaper[]>([]);
  const [dataReady, setDataReady] = useState({
    departments: false,
    topPapers: false
  });

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        await Promise.all([
          fetch(API_ENDPOINTS.DEPARTMENTS)
            .then(res => res.ok ? res.json() : Promise.reject('Departments fetch failed'))
            .then(apiData => {
              const departments = apiData.data || [];
              departmentCache.set({ departments });
              setDataReady(prev => ({ ...prev, departments: true }));
            })
            .catch(error => {
              console.error('Departments fetch error:', error);
              setDataReady(prev => ({ ...prev, departments: true }));
            }),

          fetch(API_ENDPOINTS.TOP_PAPERS)
            .then(res => res.ok ? res.json() : Promise.reject('Top papers fetch failed'))
            .then(apiData => {
              const papers = apiData.data || [];
              setTopPapers(papers.slice(0, 6));
              setDataReady(prev => ({ ...prev, topPapers: true }));
            })
            .catch(error => {
              console.error('Top papers fetch error:', error);
              setDataReady(prev => ({ ...prev, topPapers: true }));
            }),
        ]);
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    };

    loadInitialData();
  }, []);

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
