import { NextResponse } from 'next/server';

// Top 6 exam papers for homepage
const topPapers = [
  {
    id: 'je',
    name: 'Junior Engineer (JE)',
    description: 'Technical exam for aspiring railway engineers covering civil, electrical, and mechanical engineering.',
    duration: 120,
    totalQuestions: 100,
    department: 'Engineering'
  },
  {
    id: 'ntpc',
    name: 'NTPC Graduate',
    description: 'Non-Technical Popular Categories exam for graduate-level railway positions.',
    duration: 120,
    totalQuestions: 100,
    department: 'Operations'
  },
  {
    id: 'group-d',
    name: 'Group D',
    description: 'Entry-level positions including Track Maintainer, Helper, and other Grade IV posts.',
    duration: 90,
    totalQuestions: 100,
    department: 'Maintenance'
  },
  {
    id: 'alp',
    name: 'Assistant Loco Pilot',
    description: 'Technical exam for locomotive pilot assistants with focus on mechanical aptitude.',
    duration: 120,
    totalQuestions: 75,
    department: 'Transportation'
  },
  {
    id: 'sse',
    name: 'Senior Section Engineer',
    description: 'Senior technical positions requiring expertise in specialized engineering domains.',
    duration: 120,
    totalQuestions: 100,
    department: 'Engineering'
  },
  {
    id: 'jr-clerk',
    name: 'Junior Clerk',
    description: 'Clerical and administrative positions focusing on typing and office skills.',
    duration: 90,
    totalQuestions: 100,
    department: 'Administration'
  }
];

export async function GET() {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    return NextResponse.json({
      success: true,
      data: topPapers
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'SERVER_ERROR',
          message: 'Failed to fetch top papers'
        }
      },
      { status: 500 }
    );
  }
}
