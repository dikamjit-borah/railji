/**
 * RailJee Color Palette
 * Inspired by Vande Bharat Train Design
 * 
 * Color Scheme:
 * - Primary Orange: Vibrant train nose/accents
 * - Crimson Red: Geometric pattern
 * - Golden Yellow: Pattern highlights
 * - Silver/Slate: Train body
 * - Navy Blue: Window frames, accents
 * 
 * Usage Pages:
 * - Home (Hero, Features, HowItWorks, Testimonials, Footer)
 * - Department Selection
 * - Department Detail (Papers & Materials)
 * - Exam Screen (Active Exam, Question Palette)
 * - Submit Confirmation Modal
 * - Exam Result Screen
 * - Exam Review Screen
 */

export const colorPalette = {
  // ========================
  // VANDE BHARAT INSPIRED - PRIMARY COLORS
  // ========================
  primary: {
    // Vibrant Orange - Main brand color (from train nose/front)
    orange: {
      50: '#fff7ed',     // Light backgrounds
      100: '#ffedd5',    // Subtle highlights
      200: '#fed7aa',    // Hover states
      300: '#fdba74',    // Light accents
      400: '#fb923c',    // Active elements
      500: '#f97316',    // PRIMARY - Main brand color
      600: '#ea580c',    // Hover/active states
      700: '#c2410c',    // Dark accents
      800: '#9a3412',    // Text on light backgrounds
    },
    // Crimson Red - Secondary (from geometric pattern)
    crimson: {
      50: '#fef2f2',     // Light backgrounds
      100: '#fee2e2',    // Subtle highlights
      200: '#fecaca',    // Hover states
      400: '#f87171',    // Light accents
      500: '#ef4444',    // Secondary accent
      600: '#dc2626',    // PRIMARY CRIMSON
      700: '#b91c1c',    // Dark accents
      800: '#991b1b',    // Text
    },
    // Golden Yellow - Accent (from pattern highlights)
    golden: {
      50: '#fefce8',     // Light backgrounds
      100: '#fef9c3',    // Subtle highlights
      200: '#fef08a',    // Decorative elements
      400: '#facc15',    // Active accents
      500: '#eab308',    // PRIMARY GOLDEN
      600: '#ca8a04',    // Hover states
      700: '#a16207',    // Dark accents
    }
  },

  // ========================
  // NEUTRAL COLORS (Silver/Slate - Train body)
  // ========================
  neutral: {
    // Slate - Primary neutral (inspired by silver train body)
    slate: {
      50: '#f8fafc',     // Light backgrounds, cards
      100: '#f1f5f9',    // Secondary backgrounds, hover states
      200: '#e2e8f0',    // Borders, dividers
      300: '#cbd5e1',    // Secondary borders
      400: '#94a3b8',    // Tertiary text, icons
      500: '#64748b',    // Secondary text
      600: '#475569',    // Primary text (light bg)
      700: '#334155',    // Strong text
      800: '#1e293b',    // Hero text, headings
      900: '#0f172a',    // Dark buttons, Navy accents
    },
    // White & Black
    white: '#ffffff',
    black: '#000000',
  },

  // ========================
  // NAVY BLUE ACCENT (Window frames, accents)
  // ========================
  navy: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',      // Deep navy (window frames)
  },

  // ========================
  // STATUS COLORS
  // ========================
  status: {
    // Success - Correct answers, passed exams (using golden/orange tones)
    success: {
      light: '#fef9c3',   // golden-100
      main: '#eab308',    // golden-500
      dark: '#ca8a04',    // golden-600
      bg: '#fefce8',      // golden-50
      text: '#a16207',    // golden-700
    },
    // Error/Wrong - Wrong answers (using crimson)
    error: {
      light: '#fee2e2',   // crimson-100
      main: '#dc2626',    // crimson-600
      dark: '#b91c1c',    // crimson-700
      bg: '#fef2f2',      // crimson-50
      text: '#991b1b',    // crimson-800
    },
    // Warning - Flagged questions (using orange)
    warning: {
      light: '#ffedd5',   // orange-100
      main: '#f97316',    // orange-500
      dark: '#ea580c',    // orange-600
      bg: '#fff7ed',      // orange-50
      text: '#9a3412',    // orange-800
    },
    // Info - Answered questions (using navy)
    info: {
      light: '#dbeafe',   // navy-100
      main: '#3b82f6',    // navy-500
      dark: '#2563eb',    // navy-600
      bg: '#eff6ff',      // navy-50
      text: '#1e40af',    // navy-800
    }
  },

  // ========================
  // SEMANTIC COLORS (Usage-specific) - VANDE BHARAT THEME
  // ========================
  semantic: {
    // Backgrounds
    backgrounds: {
      page: 'from-slate-100 via-orange-50/20 to-slate-100',  // Main page gradient
      pageAlt: 'from-slate-50 to-white',                      // Alternative page gradient
      loadingScreen: 'from-slate-50 to-orange-50/30',         // Loading screens
      card: 'bg-white',                                        // Cards, modals
      cardHover: 'from-white to-orange-50/20',                // Card hover gradients
      cardSubtle: 'from-white via-white to-orange-50/30',     // Subtle card backgrounds
      section: 'bg-slate-50',                                  // Section backgrounds
      input: 'bg-slate-50',                                    // Input fields
    },

    // Text Colors
    text: {
      primary: 'text-slate-800',           // Main headings, important text
      secondary: 'text-slate-600',         // Body text, descriptions
      tertiary: 'text-slate-500',          // Subtle text, labels
      muted: 'text-slate-400',             // Placeholder, disabled text
      white: 'text-white',                 // Text on dark backgrounds
      brand: 'text-orange-600',            // Brand colored text
      success: 'text-golden-600',          // Success messages (golden)
      error: 'text-crimson-600',           // Error messages
      warning: 'text-orange-600',          // Warning messages
    },

    // Borders
    borders: {
      default: 'border-slate-200',         // Default borders
      light: 'border-slate-100',           // Subtle borders
      medium: 'border-slate-300',          // Medium borders
      active: 'border-orange-500',         // Active element borders
      success: 'border-golden-500',        // Success borders
      error: 'border-crimson-600',         // Error borders
      warning: 'border-orange-500',        // Warning borders
      info: 'border-navy-500',             // Info borders
    },

    // Buttons
    buttons: {
      primary: 'bg-slate-900 hover:bg-slate-800',                  // Primary CTA
      primaryGradient: 'from-orange-500 to-crimson-600',           // Primary gradient button
      secondary: 'bg-white border-slate-300 hover:bg-slate-100',   // Secondary button
      success: 'from-orange-500 to-orange-600',                    // Success action button
      danger: 'from-crimson-600 to-crimson-700',                   // Danger button
      ghost: 'hover:bg-slate-100',                                 // Ghost button
      disabled: 'opacity-40 cursor-not-allowed',                   // Disabled state
    },

    // Question States (Exam Screen)
    questionStates: {
      current: 'border-navy-500 bg-white ring-navy-300',           // Current question
      answered: 'bg-navy-500 text-white border-navy-500',          // Answered
      marked: 'bg-orange-500 text-white border-orange-500',        // Marked for review
      skipped: 'bg-slate-400 text-white border-slate-400',         // Skipped/Not answered
      notVisited: 'bg-slate-200 text-slate-600',                   // Not visited
      correct: 'border-golden-500 bg-golden-50',                   // Correct answer (review)
      correctBadge: 'bg-golden-500 text-white',                    // Correct badge
      wrong: 'border-crimson-600 bg-crimson-50',                   // Wrong answer (review)
      wrongBadge: 'bg-crimson-600 text-white',                     // Wrong badge
      selected: 'border-orange-500 bg-orange-50',                  // Selected option
      selectedBadge: 'bg-orange-500 text-white',                   // Selected badge
    },

    // Exam Header Colors
    examHeader: {
      correct: 'from-golden-500 to-orange-500',            // Correct answer header
      wrong: 'from-crimson-600 to-crimson-700',            // Wrong answer header
      skipped: 'from-orange-400 to-orange-500',            // Skipped question header
      active: 'from-orange-500 to-crimson-600',            // Active question header
      review: 'from-orange-500 to-orange-600',             // Review mode header
    },

    // Filter States
    filters: {
      active: 'bg-slate-800 text-white',                   // Active filter
      inactive: 'bg-slate-100 text-slate-600',             // Inactive filter
      hover: 'hover:bg-slate-200',                         // Filter hover
      correctActive: 'bg-golden-500 text-white',           // Correct filter active
      wrongActive: 'bg-crimson-600 text-white',            // Wrong filter active
      skippedActive: 'bg-orange-500 text-white',           // Skipped filter active
    },

    // Stats Cards
    stats: {
      correct: {
        bg: 'bg-navy-50',
        border: 'border-navy-500',
        text: 'text-navy-600',
        label: 'text-navy-700',
      },
      wrong: {
        bg: 'bg-crimson-50',
        border: 'border-crimson-600',
        text: 'text-crimson-600',
        label: 'text-crimson-700',
      },
      skipped: {
        bg: 'bg-slate-50',
        border: 'border-slate-400',
        text: 'text-slate-600',
        label: 'text-slate-700',
      },
      marked: {
        bg: 'bg-orange-50',
        border: 'border-orange-500',
        text: 'text-orange-600',
        label: 'text-orange-700',
      },
    },

    // Result Screen
    result: {
      passed: 'from-golden-500 to-orange-500',             // Passed badge
      failed: 'from-crimson-600 to-crimson-700',           // Failed badge
      cardIcons: {
        correct: 'bg-golden-100 text-golden-600',
        wrong: 'bg-crimson-100 text-crimson-600',
        skipped: 'bg-orange-100 text-orange-600',
        totalQuestions: 'bg-navy-100 text-navy-600',
        timeTaken: 'bg-slate-100 text-slate-600',
        answered: 'bg-orange-100 text-orange-600',
        negativeMarking: 'bg-crimson-100 text-crimson-600',
      }
    },

    // Department Colors
    departments: {
      headerGradient: 'from-orange-500 to-crimson-600',    // Department header
      cardHover: 'hover:shadow-xl hover:-translate-y-1',
      badgeSuccess: 'bg-golden-100 text-golden-700',
      badgeInfo: 'bg-navy-100 text-navy-700',
    }
  },

  // ========================
  // GRADIENTS (Pre-defined) - VANDE BHARAT THEME
  // ========================
  gradients: {
    page: 'bg-gradient-to-br from-slate-100 via-orange-50/20 to-slate-100',
    hero: 'bg-gradient-to-b from-slate-50 to-white',
    primary: 'bg-gradient-to-r from-orange-500 to-crimson-600',
    success: 'bg-gradient-to-r from-orange-500 to-orange-600',
    examHeader: 'bg-gradient-to-r from-orange-500 to-crimson-600',
    examHeaderCorrect: 'bg-gradient-to-r from-golden-500 to-orange-500',
    examHeaderWrong: 'bg-gradient-to-r from-crimson-600 to-crimson-700',
    examHeaderSkipped: 'bg-gradient-to-r from-orange-400 to-orange-500',
    cardHover: 'bg-gradient-to-br from-white to-orange-50/20',
    buttonPrimary: 'bg-gradient-to-r from-orange-500 to-crimson-600',
    resultPassed: 'bg-gradient-to-br from-golden-500 to-orange-500',
    resultFailed: 'bg-gradient-to-br from-crimson-600 to-crimson-700',
    progressBar: 'bg-gradient-to-r from-orange-500 to-crimson-500',
    vandeBharat: 'bg-gradient-to-r from-golden-400 via-orange-500 to-crimson-600',
  },

  // ========================
  // SHADOWS
  // ========================
  shadows: {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl',
  },

  // ========================
  // OPACITY VALUES
  // ========================
  opacity: {
    backdrop: 'bg-black/50',
    overlay: 'bg-black/50 backdrop-blur-sm',
    subtle: 'opacity-60',
    medium: 'opacity-75',
    strong: 'opacity-90',
  }
};

// ========================
// VANDE BHARAT COLOR REFERENCE
// ========================

/**
 * VANDE BHARAT TRAIN COLOR EXTRACTION:
 * 
 * 1. VIBRANT ORANGE (#f97316 → #ea580c)
 *    - Train nose/front section
 *    - Primary accent stripes
 *    - Main brand color for RailJee
 * 
 * 2. CRIMSON RED (#dc2626 → #b91c1c)
 *    - Geometric pattern on train body
 *    - Secondary accent color
 *    - Error states, wrong answers
 * 
 * 3. GOLDEN YELLOW (#eab308 → #ca8a04)
 *    - Pattern highlights
 *    - Success states, correct answers
 *    - Achievement badges
 * 
 * 4. METALLIC SILVER/SLATE (#64748b → #1e293b)
 *    - Train body
 *    - Neutral backgrounds
 *    - Text colors
 * 
 * 5. NAVY BLUE (#3b82f6 → #1e3a8a)
 *    - Window frames
 *    - Info states, answered questions
 *    - Deep accents
 * 
 * 6. WHITE (#ffffff)
 *    - Clean sections
 *    - Card backgrounds
 *    - Text on dark backgrounds
 */

/**
 * PAGE-SPECIFIC COLOR MAPPING (VANDE BHARAT THEME)
 * 
 * HOME PAGE:
 * - Hero: slate-900 (CTA), orange-600 (highlights), slate-50 backgrounds
 * - Features: orange gradients, white cards, slate text
 * - How It Works: orange-400 to orange-600 (step badges), slate backgrounds
 * - Testimonials: orange-400 to crimson-600 (avatars), orange-50/20 card tints
 * - Footer: slate-900 background, white text
 * 
 * DEPARTMENT SELECTION:
 * - Background: slate-100 via orange-50/20 to slate-100
 * - Cards: white with slate-100 borders
 * - Hover: orange-50/20 tints
 * - Badges: golden-100/700, navy-100/700
 * 
 * DEPARTMENT DETAIL:
 * - Header: orange-500 to crimson-600 gradient
 * - Tabs: slate-800 (active), slate-100 (inactive)
 * - Filters: slate-800 (active), slate-100 (inactive)
 * - Papers/Materials: white cards, slate borders
 * 
 * EXAM SCREEN (Active):
 * - Background: slate-100 via orange-50/20 to slate-100
 * - Header: orange-500 to crimson-600
 * - Question Header: orange-500 to crimson-600 (active)
 * - Timer: slate-100 (normal), crimson-100 (warning)
 * - Selected Answer: orange-500 border, orange-50 background
 * - Submit Button: orange-500 to crimson-600
 * - Question Palette: navy-500 (answered), orange-500 (marked), slate-400 (skipped)
 * 
 * EXAM REVIEW SCREEN:
 * - Correct Header: golden-500 to orange-500
 * - Wrong Header: crimson-600 to crimson-700
 * - Skipped Header: orange-400 to orange-500
 * - Correct Option: golden-500 border, golden-50 background
 * - Wrong Option: crimson-600 border, crimson-50 background
 * - Filters: golden-500 (correct), crimson-600 (wrong), orange-500 (skipped)
 * 
 * SUBMIT CONFIRMATION:
 * - Background overlay: black/50 backdrop-blur
 * - Stats: navy-50 (answered), slate-50 (skipped), orange-50 (marked)
 * - Questions: navy-500 (answered), orange-500 (marked), slate-400 (skipped)
 * - Actions: slate-300 border (cancel), orange-500 to crimson-600 (submit)
 * 
 * RESULT SCREEN:
 * - Passed Badge: golden-500 to orange-500
 * - Failed Badge: crimson-600 to crimson-700
 * - Stats Cards: golden-100 (correct), crimson-100 (wrong), orange-100 (skipped)
 * - Details: navy-100, slate-100, orange-100, crimson-100 icon backgrounds
 * - Actions: orange-500 to crimson-600 (review), slate-300 border (home)
 */

// ========================
// TAILWIND CSS CLASS MAPPINGS
// ========================

export const tailwindColors = {
  // Primary Orange (replaces emerald/teal)
  'orange-50': '#fff7ed',
  'orange-100': '#ffedd5',
  'orange-200': '#fed7aa',
  'orange-300': '#fdba74',
  'orange-400': '#fb923c',
  'orange-500': '#f97316',
  'orange-600': '#ea580c',
  'orange-700': '#c2410c',
  'orange-800': '#9a3412',

  // Crimson Red (replaces rose/pink)
  'red-50': '#fef2f2',
  'red-100': '#fee2e2',
  'red-200': '#fecaca',
  'red-400': '#f87171',
  'red-500': '#ef4444',
  'red-600': '#dc2626',
  'red-700': '#b91c1c',
  'red-800': '#991b1b',

  // Golden Yellow (replaces amber for success)
  'yellow-50': '#fefce8',
  'yellow-100': '#fef9c3',
  'yellow-200': '#fef08a',
  'yellow-400': '#facc15',
  'yellow-500': '#eab308',
  'yellow-600': '#ca8a04',
  'yellow-700': '#a16207',

  // Slate (replaces stone)
  'slate-50': '#f8fafc',
  'slate-100': '#f1f5f9',
  'slate-200': '#e2e8f0',
  'slate-300': '#cbd5e1',
  'slate-400': '#94a3b8',
  'slate-500': '#64748b',
  'slate-600': '#475569',
  'slate-700': '#334155',
  'slate-800': '#1e293b',
  'slate-900': '#0f172a',

  // Navy Blue (replaces sky/blue)
  'blue-50': '#eff6ff',
  'blue-100': '#dbeafe',
  'blue-200': '#bfdbfe',
  'blue-400': '#60a5fa',
  'blue-500': '#3b82f6',
  'blue-600': '#2563eb',
  'blue-700': '#1d4ed8',
  'blue-800': '#1e40af',
  'blue-900': '#1e3a8a',
};

export default colorPalette;
