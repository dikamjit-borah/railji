# Railje - Railway Exam Platform

A modern, elegant landing page and exam platform for railway exams built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🎯 **Three Main Exams**: Junior Engineer (JE), NTPC, and Junior Clerk
- ⏱️ **Timed Exams**: Realistic exam environment with countdown timer
- 📝 **15 Questions per Exam**: Comprehensive demo question sets with answers
- 🎨 **Modern UI**: Clean and elegant design with dark mode support
- 📱 **Responsive**: Works seamlessly on all devices
- ✅ **Instant Feedback**: Get immediate results with detailed explanations
- 🔄 **Retake Option**: Practice as many times as you want

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Hooks

## Getting Started

### Prerequisites

- Node.js 18.0 or higher
- npm, yarn, pnpm, or bun

### Installation

1. Install dependencies:

\`\`\`bash
npm install
\`\`\`

2. Run the development server:

\`\`\`bash
npm run dev
\`\`\`

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

\`\`\`
Railje/
├── src/
│ ├── app/
│ │ ├── layout.tsx # Root layout
│ │ ├── page.tsx # Landing page
│ │ └── globals.css # Global styles
│ ├── components/
│ │ ├── Navbar.tsx # Navigation with exam buttons
│ │ ├── Hero.tsx # Hero section
│ │ ├── ExamCards.tsx # Exam selection cards
│ │ ├── ExamModal.tsx # Exam interface
│ │ ├── Features.tsx # Features section
│ │ └── Footer.tsx # Footer
│ └── data/
│ └── exams.json # Exam data and questions
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
\`\`\`

## Exam Details

### Junior Engineer (JE)

- **Duration**: 90 minutes
- **Questions**: 15 technical questions
- **Topics**: Railway engineering, signals, tracks, locomotives

### NTPC (Graduate Level)

- **Duration**: 90 minutes
- **Questions**: 15 general knowledge questions
- **Topics**: Railways, GK, reasoning, mathematics

### Junior Clerk

- **Duration**: 60 minutes
- **Questions**: 15 clerical questions
- **Topics**: Computer basics, English, mathematics

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Features Overview

1. **Landing Page**: Modern hero section with statistics and feature highlights
2. **Exam Cards**: Visual cards for each exam with details
3. **Exam Modal**:
   - Preview screen with exam details and instructions
   - Timed exam interface
   - Question navigation
   - Answer selection
   - Results page with detailed explanations

## Customization

### Adding More Questions

Edit `src/data/exams.json` to add or modify questions:

\`\`\`json
{
"questions": {
"je": [
{
"id": 1,
"question": "Your question here?",
"options": ["Option 1", "Option 2", "Option 3", "Option 4"],
"correctAnswer": 0,
"explanation": "Explanation here"
}
]
}
}
\`\`\`

### Styling

Modify `tailwind.config.ts` to customize colors, fonts, and other design tokens.

## License

This project is created for educational purposes.

## Support

For issues or questions, please open an issue in the repository.
