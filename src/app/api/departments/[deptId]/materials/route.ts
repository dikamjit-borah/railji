import { NextResponse } from 'next/server';

// Mock materials data for each department
const materialsData: { [key: string]: any[] } = {
  civil: [
    { id: 'civil-notes-1', name: 'Structural Analysis Complete Notes', type: 'notes', description: 'Comprehensive notes covering all structural analysis concepts', downloads: 8900, rating: 4.8, isFree: true, contentType: 'pdf', contentUrl: 'https://pdfobject.com/pdf/sample.pdf' },
    { id: 'civil-book-1', name: 'RCC Design Handbook', type: 'book', description: 'Complete guide to reinforced concrete design', downloads: 5600, rating: 4.7, isFree: true, contentType: 'pdf', contentUrl: 'https://pdfobject.com/pdf/sample.pdf' },
    { id: 'civil-video-1', name: 'Surveying Fundamentals Series', type: 'video', description: '15-part video series on surveying basics', downloads: 12300, rating: 4.9, isFree: true, contentType: 'video', contentUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
    { id: 'civil-guide-1', name: 'Exam Preparation Guide 2024', type: 'guide', description: 'Step-by-step guide for RRB JE preparation', downloads: 7800, rating: 4.6, isFree: true, contentType: 'pdf', contentUrl: 'https://pdfobject.com/pdf/sample.pdf' },
  ],
  mechanical: [
    { id: 'mech-notes-1', name: 'Thermodynamics Complete Notes', type: 'notes', description: 'All thermodynamics concepts explained', downloads: 9200, rating: 4.8, isFree: true, contentType: 'pdf', contentUrl: 'https://pdfobject.com/pdf/sample.pdf' },
    { id: 'mech-book-1', name: 'Mechanical Engineering Handbook', type: 'book', description: 'Reference handbook for all mechanical topics', downloads: 6100, rating: 4.7, isFree: true, contentType: 'pdf', contentUrl: 'https://pdfobject.com/pdf/sample.pdf' },
    { id: 'mech-video-1', name: 'Machine Design Lectures', type: 'video', description: 'Complete machine design course', downloads: 11500, rating: 4.9, isFree: true, contentType: 'video', contentUrl: 'https://www.youtube.com/embed/jNQXAC9IVRw' },
  ],
  electrical: [
    { id: 'elec-notes-1', name: 'Power Systems Notes', type: 'notes', description: 'Detailed power systems study material', downloads: 8700, rating: 4.8, isFree: true, contentType: 'pdf', contentUrl: 'https://pdfobject.com/pdf/sample.pdf' },
    { id: 'elec-book-1', name: 'Electrical Machines Guide', type: 'book', description: 'Complete guide to electrical machines', downloads: 5400, rating: 4.6, isFree: true, contentType: 'pdf', contentUrl: 'https://pdfobject.com/pdf/sample.pdf' },
    { id: 'elec-video-1', name: 'Circuit Analysis Video Series', type: 'video', description: '20-part circuit analysis tutorial', downloads: 13200, rating: 4.9, isFree: true, contentType: 'video', contentUrl: 'https://www.youtube.com/embed/9vQkLfD6nei' },
  ],
  commercial: [
    { id: 'comm-notes-1', name: 'General Awareness Notes', type: 'notes', description: 'Current affairs and GA preparation', downloads: 15600, rating: 4.7, isFree: true, contentType: 'pdf', contentUrl: 'https://pdfobject.com/pdf/sample.pdf' },
    { id: 'comm-guide-1', name: 'NTPC Exam Strategy Guide', type: 'guide', description: 'Proven strategies for NTPC exam', downloads: 12300, rating: 4.8, isFree: true, contentType: 'video', contentUrl: 'https://www.youtube.com/embed/ZZ5LpwO-An4' },
  ],
  personnel: [
    { id: 'pers-notes-1', name: 'Administrative Procedures Notes', type: 'notes', description: 'Railway administrative procedures', downloads: 6200, rating: 4.6, isFree: true, contentType: 'pdf', contentUrl: 'https://pdfobject.com/pdf/sample.pdf' },
    { id: 'pers-guide-1', name: 'Personnel Exam Guide', type: 'guide', description: 'Complete exam preparation guide', downloads: 8900, rating: 4.7, isFree: true, contentType: 'video', contentUrl: 'https://www.youtube.com/embed/aqz-KE-bpKQ' },
  ],
  operating: [
    { id: 'oper-notes-1', name: 'Railway Operations Notes', type: 'notes', description: 'Railway operations and safety', downloads: 7800, rating: 4.7, isFree: true, contentType: 'pdf', contentUrl: 'https://pdfobject.com/pdf/sample.pdf' },
    { id: 'oper-video-1', name: 'ALP Training Videos', type: 'video', description: 'ALP role and responsibilities', downloads: 14500, rating: 4.8, isFree: true, contentType: 'video', contentUrl: 'https://www.youtube.com/embed/2Xc3p-vHBJ4' },
  ],
  snt: [
    { id: 'snt-notes-1', name: 'Signal Systems Notes', type: 'notes', description: 'Signal and telecommunication systems', downloads: 5600, rating: 4.7, isFree: true, contentType: 'pdf', contentUrl: 'https://pdfobject.com/pdf/sample.pdf' },
    { id: 'snt-book-1', name: 'S&T Technical Manual', type: 'book', description: 'Technical reference manual', downloads: 4200, rating: 4.6, isFree: true, contentType: 'video', contentUrl: 'https://www.youtube.com/embed/tYzMGcUty6s' },
  ],
  metro: [
    { id: 'metro-notes-1', name: 'Metro Rail Systems Notes', type: 'notes', description: 'Metro rail operations and systems', downloads: 6800, rating: 4.7, isFree: true, contentType: 'pdf', contentUrl: 'https://pdfobject.com/pdf/sample.pdf' },
    { id: 'metro-guide-1', name: 'DFCCIL Exam Guide', type: 'guide', description: 'DFCCIL exam preparation', downloads: 7200, rating: 4.6, isFree: true, contentType: 'video', contentUrl: 'https://www.youtube.com/embed/kffacxfA7g4' },
  ],
};

export async function GET(
  request: Request,
  { params }: { params: { deptId: string } }
) {
  try {
    const { deptId } = params;

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    const materials = materialsData[deptId] || [];

    return NextResponse.json({
      success: true,
      data: materials
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Failed to fetch materials'
        }
      },
      { status: 500 }
    );
  }
}
