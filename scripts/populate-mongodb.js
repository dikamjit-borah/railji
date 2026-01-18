const mongoose = require("mongoose");
require("dotenv").config({ path: ".env.local" });

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/railje";

// Define schemas inline since we can't import ES modules directly
const ExamSchema = new mongoose.Schema(
  {
    examName: { type: String, required: true, index: true },
    department: { type: [String], required: true },
    totalQuestions: { type: Number, required: true },
    duration: { type: Number, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["active", "inactive", "draft"],
      default: "active",
    },
    language: { type: [String], default: ["en", "hi"] },
  },
  { timestamps: true }
);

const PaperSchema = new mongoose.Schema(
  {
    examName: { type: String, required: true, index: true },
    department: { type: String, required: true, index: true },
    year: { type: String, required: true },
    location: { type: String, required: true },
    questions: [
      {
        ques: { type: String, required: true },
        ques_hi: { type: String, required: true },
        options: [
          {
            en: { type: String, required: true },
            hi: { type: String, required: true },
          },
        ],
        correct: { type: Number, required: true, min: 0, max: 3 },
      },
    ],
  },
  { timestamps: true }
);

const Exam = mongoose.models.Exam || mongoose.model("Exam", ExamSchema);
const Paper = mongoose.models.Paper || mongoose.model("Paper", PaperSchema);

// Sample data
const sampleExams = [
  {
    examName: "junior_engineer",
    department: ["mechanical", "signal", "electrical"],
    totalQuestions: 100,
    duration: 120,
    description:
      "Railway Junior Engineer examination covering technical and general knowledge",
    status: "active",
    language: ["en", "hi"],
  },
  {
    examName: "group_d",
    department: ["general"],
    totalQuestions: 100,
    duration: 90,
    description: "Railway Group D examination for various posts",
    status: "active",
    language: ["en", "hi"],
  },
];

const samplePapers = [
  {
    examName: "junior_engineer",
    department: "mechanical",
    year: "january_2026",
    location: "New Delhi",
    questions: [
      {
        ques: "What is the SI unit of force?",
        ques_hi: "बल की SI इकाई क्या है?",
        options: [
          { en: "Joule", hi: "जूल" },
          { en: "Newton", hi: "न्यूटन" },
          { en: "Watt", hi: "वाट" },
          { en: "Pascal", hi: "पास्कल" },
        ],
        correct: 1,
      },
      {
        ques: "What is the capital of India?",
        ques_hi: "भारत की राजधानी क्या है?",
        options: [
          { en: "Mumbai", hi: "मुंबई" },
          { en: "New Delhi", hi: "नई दिल्ली" },
          { en: "Bangalore", hi: "बेंगलुरु" },
          { en: "Kolkata", hi: "कोलकाता" },
        ],
        correct: 1,
      },
      {
        ques: "Which gas is most abundant in Earth's atmosphere?",
        ques_hi: "पृथ्वी के वायुमंडल में सबसे अधिक कौन सी गैस है?",
        options: [
          { en: "Oxygen", hi: "ऑक्सीजन" },
          { en: "Carbon Dioxide", hi: "कार्बन डाइऑक्साइड" },
          { en: "Nitrogen", hi: "नाइट्रोजन" },
          { en: "Hydrogen", hi: "हाइड्रोजन" },
        ],
        correct: 2,
      },
    ],
  },
  {
    examName: "group_d",
    department: "general",
    year: "january_2026",
    location: "Mumbai",
    questions: [
      {
        ques: "Who is known as the Father of the Nation in India?",
        ques_hi: "भारत में राष्ट्रपिता के रूप में किसे जाना जाता है?",
        options: [
          { en: "Jawaharlal Nehru", hi: "जवाहरलाल नेहरू" },
          { en: "Mahatma Gandhi", hi: "महात्मा गांधी" },
          { en: "Subhas Chandra Bose", hi: "सुभाष चंद्र बोस" },
          { en: "Sardar Patel", hi: "सरदार पटेल" },
        ],
        correct: 1,
      },
      {
        ques: "What is 15 + 25?",
        ques_hi: "15 + 25 क्या है?",
        options: [
          { en: "30", hi: "30" },
          { en: "35", hi: "35" },
          { en: "40", hi: "40" },
          { en: "45", hi: "45" },
        ],
        correct: 2,
      },
    ],
  },
];

async function populateDatabase() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB successfully!");

    // Clear existing data
    console.log("\nClearing existing data...");
    await Exam.deleteMany({});
    await Paper.deleteMany({});
    console.log("Existing data cleared.");

    // Insert exams
    console.log("\nInserting exams...");
    for (const examData of sampleExams) {
      const exam = await Exam.create(examData);
      console.log(`✓ Created exam: ${exam.examName}`);
    }

    // Insert papers
    console.log("\nInserting papers...");
    for (const paperData of samplePapers) {
      const paper = await Paper.create(paperData);
      console.log(
        `✓ Created paper: ${paper.examName} - ${paper.department} (${paper.questions.length} questions)`
      );
    }

    console.log("\n✅ Database populated successfully!");
    console.log("\nSummary:");
    const examCount = await Exam.countDocuments();
    const paperCount = await Paper.countDocuments();
    console.log(`- Exams: ${examCount}`);
    console.log(`- Papers: ${paperCount}`);

    await mongoose.disconnect();
    console.log("\nDisconnected from MongoDB.");
  } catch (error) {
    console.error("\n❌ Error populating database:", error);
    process.exit(1);
  }
}

populateDatabase();
