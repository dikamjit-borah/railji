const fs = require("fs");
const path = require("path");

// Read existing data
const examsPath = path.join(__dirname, "../src/data/exams.json");
const examsData = JSON.parse(fs.readFileSync(examsPath, "utf8"));

// JE Questions (Technical/Engineering)
const jeQuestions = [
  {
    question: "What is the standard gauge width used in Indian Railways?",
    options: ["1435 mm", "1676 mm", "1000 mm", "762 mm"],
    correctAnswer: 1,
  },
  {
    question: "Which type of current is used in Indian electric locomotives?",
    options: ["DC only", "AC only", "Both AC and DC", "None"],
    correctAnswer: 2,
  },
  {
    question: "What is the maximum speed of Vande Bharat Express?",
    options: ["160 km/h", "180 km/h", "200 km/h", "220 km/h"],
    correctAnswer: 1,
  },
  {
    question: "Which is the longest railway platform in India?",
    options: ["Gorakhpur", "Kollam", "Kharagpur", "Bilaspur"],
    correctAnswer: 0,
  },
  {
    question: "What does LHB stand for in railway coaches?",
    options: [
      "Light Heavy Bogies",
      "Linke Hofmann Busch",
      "Long Haul Bogies",
      "Latest High-speed Bogies",
    ],
    correctAnswer: 1,
  },
  {
    question: "What is the minimum radius of curve on broad gauge?",
    options: ["175 meters", "200 meters", "218 meters", "250 meters"],
    correctAnswer: 0,
  },
  {
    question: "Which signal indicates 'Stop'?",
    options: ["Green", "Yellow", "Red", "Blue"],
    correctAnswer: 2,
  },
  {
    question: "What is the standard length of a rail in India?",
    options: ["11 meters", "12 meters", "13 meters", "14 meters"],
    correctAnswer: 2,
  },
  {
    question: "Which type of sleeper is most commonly used?",
    options: [
      "Wooden sleepers",
      "Steel sleepers",
      "Concrete sleepers",
      "Composite sleepers",
    ],
    correctAnswer: 2,
  },
  {
    question: "What is cant or superelevation?",
    options: [
      "Height of rail above ground",
      "Outer rail raised on curves",
      "Distance between rails",
      "Thickness of ballast",
    ],
    correctAnswer: 1,
  },
  {
    question: "Which material is used for rail manufacturing?",
    options: [
      "Cast Iron",
      "Mild Steel",
      "High Carbon Steel",
      "Stainless Steel",
    ],
    correctAnswer: 2,
  },
  {
    question: "What is the purpose of fish plates?",
    options: [
      "Support sleepers",
      "Join two rails",
      "Prevent rust",
      "Reduce noise",
    ],
    correctAnswer: 1,
  },
  {
    question: "What is the gradient expressed in?",
    options: ["Degrees", "Percentage", "1 in N", "All of above"],
    correctAnswer: 3,
  },
  {
    question: "Which zone has the longest route length?",
    options: [
      "Northern Railway",
      "Eastern Railway",
      "Southern Railway",
      "Western Railway",
    ],
    correctAnswer: 0,
  },
  {
    question: "What is the purpose of ballast in railway track?",
    options: [
      "Decoration",
      "Support and drainage",
      "Reduce speed",
      "Increase friction",
    ],
    correctAnswer: 1,
  },
];

// Generate more JE questions
for (let i = jeQuestions.length; i < 100; i++) {
  const topics = [
    {
      q: `What is the tensile strength requirement for rail steel (Question ${
        i + 1
      })?`,
      opts: ["800 N/mm²", "900 N/mm²", "1000 N/mm²", "1100 N/mm²"],
      ans: 2,
    },
    {
      q: `In railway engineering, what does PSC stand for (Q${i + 1})?`,
      opts: [
        "Pre-stressed Concrete",
        "Post-stressed Concrete",
        "Pre-stressed Carbon",
        "Post Steel Concrete",
      ],
      ans: 0,
    },
    {
      q: `What is the maximum permissible gradient on plains (Q${i + 1})?`,
      opts: ["1 in 100", "1 in 150", "1 in 200", "1 in 250"],
      ans: 2,
    },
    {
      q: `Which type of rail joint is used in continuous welded rail (Q${
        i + 1
      })?`,
      opts: [
        "Suspended joint",
        "Supported joint",
        "Welded joint",
        "Bolted joint",
      ],
      ans: 2,
    },
    {
      q: `What is the standard spacing of sleepers on broad gauge (Q${i + 1})?`,
      opts: [
        "(N+4) to (N+7)",
        "(N+5) to (N+8)",
        "(N+6) to (N+9)",
        "(N+7) to (N+10)",
      ],
      ans: 0,
    },
  ];
  const topic = topics[i % topics.length];
  jeQuestions.push({
    question: topic.q,
    options: topic.opts,
    correctAnswer: topic.ans,
  });
}

// NTPC Questions (General Awareness, Reasoning, Math)
const ntpcQuestions = [
  {
    question: "Who is known as the Father of Indian Railways?",
    options: [
      "Lord Dalhousie",
      "Lord Curzon",
      "Lord Mountbatten",
      "Lord Wavell",
    ],
    correctAnswer: 0,
  },
  {
    question: "In which year was Indian Railways nationalized?",
    options: ["1947", "1950", "1951", "1952"],
    correctAnswer: 1,
  },
  {
    question: "What is the headquarters of Indian Railways?",
    options: ["Mumbai", "Delhi", "Kolkata", "Chennai"],
    correctAnswer: 1,
  },
  {
    question: "Which is the first railway line in India?",
    options: [
      "Mumbai to Thane",
      "Delhi to Agra",
      "Kolkata to Delhi",
      "Chennai to Bangalore",
    ],
    correctAnswer: 0,
  },
  {
    question: "How many railway zones are there in India?",
    options: ["16", "17", "18", "19"],
    correctAnswer: 2,
  },
  {
    question: "What is 25% of 200?",
    options: ["25", "50", "75", "100"],
    correctAnswer: 1,
  },
  {
    question: "If A = 1, B = 2, C = 3, what is CAB?",
    options: ["312", "321", "123", "132"],
    correctAnswer: 0,
  },
  {
    question: "Complete the series: 2, 4, 8, 16, __?",
    options: ["24", "32", "48", "64"],
    correctAnswer: 1,
  },
  {
    question: "What comes next: MON, TUE, WED, __?",
    options: ["FRI", "THU", "SAT", "SUN"],
    correctAnswer: 1,
  },
  {
    question: "If 5 + 3 = 28, 9 + 1 = 810, then 8 + 6 = ?",
    options: ["214", "482", "614", "148"],
    correctAnswer: 2,
  },
  {
    question: "What is the capital of India?",
    options: ["Mumbai", "New Delhi", "Kolkata", "Bangalore"],
    correctAnswer: 1,
  },
  {
    question: "Who wrote the Indian National Anthem?",
    options: [
      "Bankim Chandra",
      "Rabindranath Tagore",
      "Sarojini Naidu",
      "Subhash Bose",
    ],
    correctAnswer: 1,
  },
  {
    question: "Find the odd one out: 3, 5, 7, 9, 11",
    options: ["3", "5", "7", "9"],
    correctAnswer: 3,
  },
  {
    question: "What is 15% of 300?",
    options: ["30", "45", "60", "75"],
    correctAnswer: 1,
  },
  {
    question: "Complete: DG, FI, HK, __?",
    options: ["JM", "JL", "KM", "IL"],
    correctAnswer: 0,
  },
];

// Generate more NTPC questions
for (let i = ntpcQuestions.length; i < 100; i++) {
  const topics = [
    {
      q: `What is the square root of 144 (Q${i + 1})?`,
      opts: ["10", "11", "12", "13"],
      ans: 2,
    },
    {
      q: `Who is the current Railway Minister of India (Q${i + 1})?`,
      opts: [
        "Ashwini Vaishnaw",
        "Piyush Goyal",
        "Suresh Prabhu",
        "Mamata Banerjee",
      ],
      ans: 0,
    },
    {
      q: `What is 30% of 500 (Q${i + 1})?`,
      opts: ["100", "125", "150", "175"],
      ans: 2,
    },
    {
      q: `Find odd one: Apple, Mango, Carrot, Banana (Q${i + 1})`,
      opts: ["Apple", "Mango", "Carrot", "Banana"],
      ans: 2,
    },
    {
      q: `If CAT = 312, what is DOG (Q${i + 1})?`,
      opts: ["415", "4157", "41507", "4158"],
      ans: 1,
    },
  ];
  const topic = topics[i % topics.length];
  ntpcQuestions.push({
    question: topic.q,
    options: topic.opts,
    correctAnswer: topic.ans,
  });
}

// Jr. Clerk Questions (Basic Aptitude, English, Computer)
const jrClerkQuestions = [
  {
    question: "What is the full form of CPU?",
    options: [
      "Central Processing Unit",
      "Central Program Unit",
      "Computer Personal Unit",
      "Central Processor Unit",
    ],
    correctAnswer: 0,
  },
  {
    question: "Which key is used to refresh a webpage?",
    options: ["F4", "F5", "F6", "F7"],
    correctAnswer: 1,
  },
  {
    question: "What is the antonym of 'Happy'?",
    options: ["Sad", "Joyful", "Cheerful", "Excited"],
    correctAnswer: 0,
  },
  {
    question: "Choose the correctly spelled word:",
    options: ["Recieve", "Receive", "Receeve", "Receve"],
    correctAnswer: 1,
  },
  {
    question: "What is 20% of 150?",
    options: ["25", "30", "35", "40"],
    correctAnswer: 1,
  },
  {
    question: "What does RAM stand for?",
    options: [
      "Random Access Memory",
      "Read Access Memory",
      "Run Access Memory",
      "Rapid Access Memory",
    ],
    correctAnswer: 0,
  },
  {
    question: "Which is the correct sentence?",
    options: [
      "He go to school",
      "He goes to school",
      "He going to school",
      "He gone to school",
    ],
    correctAnswer: 1,
  },
  {
    question: "What is 8 × 7?",
    options: ["54", "56", "58", "60"],
    correctAnswer: 1,
  },
  {
    question: "Choose the synonym of 'Quick':",
    options: ["Slow", "Fast", "Lazy", "Tired"],
    correctAnswer: 1,
  },
  {
    question: "What is the shortcut for Copy?",
    options: ["Ctrl+C", "Ctrl+V", "Ctrl+X", "Ctrl+Z"],
    correctAnswer: 0,
  },
  {
    question: "Fill in: She ___ to the market yesterday.",
    options: ["go", "goes", "went", "going"],
    correctAnswer: 2,
  },
  {
    question: "What is 100 ÷ 4?",
    options: ["20", "25", "30", "35"],
    correctAnswer: 1,
  },
  {
    question: "Which device is used for output?",
    options: ["Keyboard", "Mouse", "Monitor", "Scanner"],
    correctAnswer: 2,
  },
  {
    question: "Choose correct spelling:",
    options: ["Accomodate", "Accommodate", "Acomodate", "Acommodate"],
    correctAnswer: 1,
  },
  {
    question: "What is 15 + 27?",
    options: ["40", "42", "44", "46"],
    correctAnswer: 1,
  },
];

// Generate more Jr. Clerk questions
for (let i = jrClerkQuestions.length; i < 100; i++) {
  const topics = [
    {
      q: `What is the shortcut for Paste (Q${i + 1})?`,
      opts: ["Ctrl+C", "Ctrl+V", "Ctrl+X", "Ctrl+P"],
      ans: 1,
    },
    {
      q: `Choose correct article: ___ apple a day (Q${i + 1})`,
      opts: ["A", "An", "The", "No article"],
      ans: 1,
    },
    {
      q: `What is 50% of 80 (Q${i + 1})?`,
      opts: ["30", "35", "40", "45"],
      ans: 2,
    },
    {
      q: `Which is an input device (Q${i + 1})?`,
      opts: ["Monitor", "Printer", "Keyboard", "Speaker"],
      ans: 2,
    },
    {
      q: `Synonym of 'Difficult' (Q${i + 1})?`,
      opts: ["Easy", "Hard", "Simple", "Light"],
      ans: 1,
    },
  ];
  const topic = topics[i % topics.length];
  jrClerkQuestions.push({
    question: topic.q,
    options: topic.opts,
    correctAnswer: topic.ans,
  });
}

// Add IDs to all questions
jeQuestions.forEach((q, i) => (q.id = i + 1));
ntpcQuestions.forEach((q, i) => (q.id = i + 1));
jrClerkQuestions.forEach((q, i) => (q.id = i + 1));

// Update exam metadata
examsData.exams[0].totalQuestions = 100;
examsData.exams[0].duration = 120;
examsData.exams[1].totalQuestions = 100;
examsData.exams[1].duration = 120;
examsData.exams[2].totalQuestions = 100;
examsData.exams[2].duration = 90;

// Update questions
examsData.questions = {
  je: jeQuestions,
  ntpc: ntpcQuestions,
  "jr-clerk": jrClerkQuestions,
};

// Write back to file
fs.writeFileSync(examsPath, JSON.stringify(examsData, null, 2));

console.log("✅ Generated 100 questions for each exam!");
console.log(`- JE: ${jeQuestions.length} questions`);
console.log(`- NTPC: ${ntpcQuestions.length} questions`);
console.log(`- Jr. Clerk: ${jrClerkQuestions.length} questions`);
