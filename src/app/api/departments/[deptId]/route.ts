import { NextResponse } from 'next/server';

// Mock data for department details
const departmentData: { [key: string]: any } = {
  civil: {
    department: {
      id: 'civil',
      name: 'Civil Engg',
      fullName: 'Civil Engineering',
      color: {
        gradient: 'from-red-600 to-red-800',
        bg: 'bg-red-50'
      }
    },
    papers: [
      { id: 'je-civil-2024-1', name: 'RRB JE CBT-1', description: 'Junior Engineer Computer Based Test Stage 1', year: '2024', shift: 'Shift 1', questions: 100, duration: 90, attempts: 12500, rating: 4.8, isFree: true, isNew: true, subjects: ['Mathematics', 'General Science', 'Current Affairs'], examId: 'je' },
      { id: 'je-civil-2024-2', name: 'RRB JE CBT-1', description: 'Junior Engineer Computer Based Test Stage 1', year: '2024', shift: 'Shift 2', questions: 100, duration: 90, attempts: 8900, rating: 4.7, isFree: true, subjects: ['Mathematics', 'General Science', 'Current Affairs'], examId: 'je' },
      { id: 'je-civil-2023-1', name: 'RRB JE CBT-1', description: 'Junior Engineer Computer Based Test Stage 1', year: '2023', shift: 'Shift 1', questions: 100, duration: 90, attempts: 25600, rating: 4.9, isFree: true, subjects: ['Mathematics', 'General Science', 'Current Affairs'], examId: 'je' },
      { id: 'je-civil-2023-2', name: 'RRB JE CBT-1', description: 'Junior Engineer Computer Based Test Stage 1', year: '2023', shift: 'Shift 2', questions: 100, duration: 90, attempts: 18700, rating: 4.6, isFree: true, subjects: ['Mathematics', 'General Science', 'Current Affairs'], examId: 'je' },
      { id: 'je-civil-2022-1', name: 'RRB JE CBT-1', description: 'Junior Engineer Computer Based Test Stage 1', year: '2022', shift: 'Shift 1', questions: 100, duration: 90, attempts: 34200, rating: 4.8, isFree: true, subjects: ['Mathematics', 'General Science', 'Current Affairs'], examId: 'je' },
      { id: 'sse-civil-2024', name: 'RRB SSE', description: 'Senior Section Engineer Technical', year: '2024', shift: 'Morning', questions: 150, duration: 120, attempts: 5600, rating: 4.5, isFree: true, isNew: true, subjects: ['Mathematics', 'General Science', 'English'], examId: 'je' },
      { id: 'sse-civil-2023', name: 'RRB SSE', description: 'Senior Section Engineer Technical', year: '2023', shift: 'Morning', questions: 150, duration: 120, attempts: 12300, rating: 4.7, isFree: true, subjects: ['Mathematics', 'General Science', 'English'], examId: 'je' },
    ],
    filters: {
      examTypes: ['RRB JE CBT-1', 'RRB SSE'],
      subjects: ['Mathematics', 'General Science', 'Current Affairs', 'English']
    }
  },
  mechanical: {
    department: {
      id: 'mechanical',
      name: 'Mechanical',
      fullName: 'Mechanical Engineering',
      color: {
        gradient: 'from-orange-600 to-red-700',
        bg: 'bg-orange-50'
      }
    },
    papers: [
      { id: 'je-mech-2024-1', name: 'RRB JE CBT-1', description: 'Junior Engineer Mechanical', year: '2024', shift: 'Shift 1', questions: 100, duration: 90, attempts: 15600, rating: 4.8, isFree: true, isNew: true, subjects: ['Mathematics', 'General Science', 'Computer'], examId: 'je' },
      { id: 'je-mech-2024-2', name: 'RRB JE CBT-1', description: 'Junior Engineer Mechanical', year: '2024', shift: 'Shift 2', questions: 100, duration: 90, attempts: 11200, rating: 4.7, isFree: true, subjects: ['Mathematics', 'General Science', 'Computer'], examId: 'je' },
      { id: 'je-mech-2023-1', name: 'RRB JE CBT-1', description: 'Junior Engineer Mechanical', year: '2023', shift: 'Shift 1', questions: 100, duration: 90, attempts: 28900, rating: 4.9, isFree: true, subjects: ['Mathematics', 'General Science', 'Computer'], examId: 'je' },
      { id: 'alp-mech-2024', name: 'RRB ALP', description: 'Assistant Loco Pilot Technical', year: '2024', shift: 'All Shifts', questions: 75, duration: 60, attempts: 45000, rating: 4.8, isFree: true, isNew: true, subjects: ['Mathematics', 'English', 'General Science'], examId: 'je' },
      { id: 'alp-mech-2023', name: 'RRB ALP', description: 'Assistant Loco Pilot Technical', year: '2023', shift: 'All Shifts', questions: 75, duration: 60, attempts: 67000, rating: 4.9, isFree: true, subjects: ['Mathematics', 'English', 'General Science'], examId: 'je' },
    ],
    filters: {
      examTypes: ['RRB JE CBT-1', 'RRB ALP'],
      subjects: ['Mathematics', 'General Science', 'Computer', 'English']
    }
  },
  electrical: {
    department: {
      id: 'electrical',
      name: 'Electrical',
      fullName: 'Electrical Engineering',
      color: {
        gradient: 'from-amber-600 to-orange-700',
        bg: 'bg-amber-50'
      }
    },
    papers: [
      { id: 'je-elec-2024-1', name: 'RRB JE CBT-1', description: 'Junior Engineer Electrical', year: '2024', shift: 'Shift 1', questions: 100, duration: 90, attempts: 18900, rating: 4.8, isFree: true, isNew: true, subjects: ['Mathematics', 'General Science', 'English'], examId: 'je' },
      { id: 'je-elec-2024-2', name: 'RRB JE CBT-1', description: 'Junior Engineer Electrical', year: '2024', shift: 'Shift 2', questions: 100, duration: 90, attempts: 14500, rating: 4.7, isFree: true, subjects: ['Mathematics', 'General Science', 'English'], examId: 'je' },
      { id: 'je-elec-2023-1', name: 'RRB JE CBT-1', description: 'Junior Engineer Electrical', year: '2023', shift: 'Shift 1', questions: 100, duration: 90, attempts: 32100, rating: 4.9, isFree: true, subjects: ['Mathematics', 'General Science', 'English'], examId: 'je' },
      { id: 'technician-elec-2024', name: 'RRB Technician', description: 'Technician Grade III Electrical', year: '2024', shift: 'Morning', questions: 100, duration: 90, attempts: 22000, rating: 4.6, isFree: true, isNew: true, subjects: ['Mathematics', 'General Science', 'Current Affairs'], examId: 'je' },
    ],
    filters: {
      examTypes: ['RRB JE CBT-1', 'RRB Technician'],
      subjects: ['Mathematics', 'General Science', 'English', 'Current Affairs']
    }
  },
  commercial: {
    department: {
      id: 'commercial',
      name: 'Commercial',
      fullName: 'Commercial Department',
      color: {
        gradient: 'from-emerald-600 to-teal-700',
        bg: 'bg-emerald-50'
      }
    },
    papers: [
      { id: 'ntpc-2024-1', name: 'RRB NTPC CBT-1', description: 'Non-Technical Popular Categories', year: '2024', shift: 'Shift 1', questions: 100, duration: 90, attempts: 89000, rating: 4.9, isFree: true, isNew: true, subjects: ['English', 'Mathematics', 'General Science', 'Current Affairs'], examId: 'ntpc' },
      { id: 'ntpc-2024-2', name: 'RRB NTPC CBT-1', description: 'Non-Technical Popular Categories', year: '2024', shift: 'Shift 2', questions: 100, duration: 90, attempts: 76000, rating: 4.8, isFree: true, subjects: ['English', 'Mathematics', 'General Science', 'Current Affairs'], examId: 'ntpc' },
      { id: 'ntpc-2023-1', name: 'RRB NTPC CBT-1', description: 'Non-Technical Popular Categories', year: '2023', shift: 'Shift 1', questions: 100, duration: 90, attempts: 125000, rating: 4.9, isFree: true, subjects: ['English', 'Mathematics', 'General Science', 'Current Affairs'], examId: 'ntpc' },
      { id: 'clerk-2024', name: 'Junior Clerk', description: 'Clerical Cadre Examination', year: '2024', shift: 'Morning', questions: 100, duration: 90, attempts: 45000, rating: 4.7, isFree: true, isNew: true, subjects: ['English', 'Computer', 'Current Affairs'], examId: 'jr-clerk' },
      { id: 'tc-2024', name: 'Ticket Collector', description: 'TC/CC Examination', year: '2024', shift: 'All Shifts', questions: 100, duration: 90, attempts: 38000, rating: 4.6, isFree: true, subjects: ['English', 'Mathematics', 'Current Affairs'], examId: 'ntpc' },
    ],
    filters: {
      examTypes: ['RRB NTPC CBT-1', 'Junior Clerk', 'Ticket Collector'],
      subjects: ['English', 'Mathematics', 'General Science', 'Current Affairs', 'Computer']
    }
  },
  personnel: {
    department: {
      id: 'personnel',
      name: 'Personnel',
      fullName: 'Personnel Department',
      color: {
        gradient: 'from-blue-600 to-indigo-700',
        bg: 'bg-blue-50'
      }
    },
    papers: [
      { id: 'ntpc-personnel-2024', name: 'RRB NTPC CBT-1', description: 'Personnel & Administrative', year: '2024', shift: 'Shift 1', questions: 100, duration: 90, attempts: 34000, rating: 4.7, isFree: true, isNew: true, subjects: ['English', 'Mathematics', 'Current Affairs', 'Computer'], examId: 'ntpc' },
      { id: 'clerk-personnel-2024', name: 'Junior Clerk', description: 'Personnel Clerk Examination', year: '2024', shift: 'Morning', questions: 100, duration: 90, attempts: 28000, rating: 4.6, isFree: true, subjects: ['English', 'Computer', 'Current Affairs'], examId: 'jr-clerk' },
      { id: 'ntpc-personnel-2023', name: 'RRB NTPC CBT-1', description: 'Personnel & Administrative', year: '2023', shift: 'Shift 1', questions: 100, duration: 90, attempts: 56000, rating: 4.8, isFree: true, subjects: ['English', 'Mathematics', 'Current Affairs', 'Computer'], examId: 'ntpc' },
    ],
    filters: {
      examTypes: ['RRB NTPC CBT-1', 'Junior Clerk'],
      subjects: ['English', 'Mathematics', 'Current Affairs', 'Computer']
    }
  },
  operating: {
    department: {
      id: 'operating',
      name: 'Operating',
      fullName: 'Operating Department',
      color: {
        gradient: 'from-purple-600 to-violet-700',
        bg: 'bg-purple-50'
      }
    },
    papers: [
      { id: 'alp-2024-1', name: 'RRB ALP CBT-1', description: 'Assistant Loco Pilot Stage 1', year: '2024', shift: 'Shift 1', questions: 75, duration: 60, attempts: 78000, rating: 4.9, isFree: true, isNew: true, subjects: ['Mathematics', 'English', 'General Science'], examId: 'je' },
      { id: 'alp-2024-2', name: 'RRB ALP CBT-1', description: 'Assistant Loco Pilot Stage 1', year: '2024', shift: 'Shift 2', questions: 75, duration: 60, attempts: 65000, rating: 4.8, isFree: true, subjects: ['Mathematics', 'English', 'General Science'], examId: 'je' },
      { id: 'alp-2023-1', name: 'RRB ALP CBT-1', description: 'Assistant Loco Pilot Stage 1', year: '2023', shift: 'Shift 1', questions: 75, duration: 60, attempts: 112000, rating: 4.9, isFree: true, subjects: ['Mathematics', 'English', 'General Science'], examId: 'je' },
      { id: 'guard-2024', name: 'Train Guard', description: 'Goods Guard Examination', year: '2024', shift: 'Morning', questions: 100, duration: 90, attempts: 23000, rating: 4.5, isFree: true, isNew: true, subjects: ['English', 'Current Affairs', 'Mathematics'], examId: 'je' },
    ],
    filters: {
      examTypes: ['RRB ALP CBT-1', 'Train Guard'],
      subjects: ['Mathematics', 'English', 'General Science', 'Current Affairs']
    }
  },
  snt: {
    department: {
      id: 'snt',
      name: 'S&T',
      fullName: 'Signal & Telecommunication',
      color: {
        gradient: 'from-cyan-600 to-blue-700',
        bg: 'bg-cyan-50'
      }
    },
    papers: [
      { id: 'je-snt-2024-1', name: 'RRB JE S&T', description: 'Junior Engineer Signal & Telecom', year: '2024', shift: 'Shift 1', questions: 100, duration: 90, attempts: 8900, rating: 4.7, isFree: true, isNew: true, subjects: ['Mathematics', 'Computer', 'General Science'], examId: 'je' },
      { id: 'je-snt-2024-2', name: 'RRB JE S&T', description: 'Junior Engineer Signal & Telecom', year: '2024', shift: 'Shift 2', questions: 100, duration: 90, attempts: 7200, rating: 4.6, isFree: true, subjects: ['Mathematics', 'Computer', 'General Science'], examId: 'je' },
      { id: 'je-snt-2023', name: 'RRB JE S&T', description: 'Junior Engineer Signal & Telecom', year: '2023', shift: 'Shift 1', questions: 100, duration: 90, attempts: 15600, rating: 4.8, isFree: true, subjects: ['Mathematics', 'Computer', 'General Science'], examId: 'je' },
      { id: 'tech-snt-2024', name: 'Technician S&T', description: 'Technician Grade III S&T', year: '2024', shift: 'Morning', questions: 100, duration: 90, attempts: 12000, rating: 4.5, isFree: true, subjects: ['Mathematics', 'Computer', 'English'], examId: 'je' },
    ],
    filters: {
      examTypes: ['RRB JE S&T', 'Technician S&T'],
      subjects: ['Mathematics', 'Computer', 'General Science', 'English']
    }
  },
  metro: {
    department: {
      id: 'metro',
      name: 'DFCCIL & Metro',
      fullName: 'DFCCIL & Metro Railways',
      color: {
        gradient: 'from-rose-600 to-pink-700',
        bg: 'bg-rose-50'
      }
    },
    papers: [
      { id: 'dfccil-je-2024', name: 'DFCCIL JE', description: 'Junior Engineer DFCCIL', year: '2024', shift: 'CBT', questions: 100, duration: 90, attempts: 6700, rating: 4.6, isFree: true, isNew: true, subjects: ['Mathematics', 'General Science', 'English'], examId: 'je' },
      { id: 'metro-je-2024', name: 'Metro Rail JE', description: 'Junior Engineer Metro', year: '2024', shift: 'CBT', questions: 100, duration: 90, attempts: 8900, rating: 4.7, isFree: true, isNew: true, subjects: ['Mathematics', 'General Science', 'English'], examId: 'je' },
      { id: 'dfccil-exec-2024', name: 'DFCCIL Executive', description: 'Executive Civil/Electrical', year: '2024', shift: 'CBT', questions: 120, duration: 120, attempts: 4500, rating: 4.5, isFree: true, subjects: ['Mathematics', 'English', 'Current Affairs'], examId: 'je' },
      { id: 'metro-tech-2024', name: 'Metro Technician', description: 'Maintainer/Technician Metro', year: '2024', shift: 'CBT', questions: 100, duration: 90, attempts: 15000, rating: 4.6, isFree: true, subjects: ['Mathematics', 'General Science', 'Computer'], examId: 'je' },
    ],
    filters: {
      examTypes: ['DFCCIL JE', 'Metro Rail JE', 'DFCCIL Executive', 'Metro Technician'],
      subjects: ['Mathematics', 'General Science', 'English', 'Current Affairs', 'Computer']
    }
  }
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ deptId: string }> }
) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 100));
  
  const { deptId } = await params;
  const department = departmentData[deptId];
  
  if (!department) {
    return NextResponse.json({
      success: false,
      error: {
        code: 'DEPARTMENT_NOT_FOUND',
        message: 'The requested department does not exist.'
      }
    }, { status: 404 });
  }

  // Parse query params for filtering
  const { searchParams } = new URL(request.url);
  const examType = searchParams.get('examType');
  const subject = searchParams.get('subject');

  let filteredPapers = [...department.papers];

  // Apply filters
  if (examType && examType !== 'All') {
    filteredPapers = filteredPapers.filter((paper: any) => paper.name === examType);
  }
  
  if (subject && subject !== 'All') {
    filteredPapers = filteredPapers.filter((paper: any) => 
      paper.subjects && paper.subjects.includes(subject)
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      department: department.department,
      papers: filteredPapers,
      filters: department.filters
    }
  });
}
