# MongoDB Setup Guide for Railje

## Overview

The Railje application now uses MongoDB to store exam and paper data. This document explains the database structure, setup process, and how to populate the database.

## Collections

### 1. Exams Collection

Stores metadata about each exam type.

**Collection Name:** `exams`

**Schema:**

```javascript
{
  examName: String,          // e.g., "junior_engineer"
  department: [String],      // e.g., ["mechanical", "signal", "electrical"]
  totalQuestions: Number,    // Total number of questions
  duration: Number,          // Duration in minutes
  description: String,       // Exam description
  status: String,            // "active", "inactive", or "draft"
  language: [String],        // e.g., ["en", "hi"]
  createdAt: Date,
  updatedAt: Date
}
```

**Example Document:**

```json
{
  "_id": "507f1f77bcf86cd799439012",
  "examName": "junior_engineer",
  "department": ["mechanical", "signal", "electrical"],
  "totalQuestions": 110,
  "duration": 120,
  "description": "Railway Junior Engineer examination",
  "status": "active",
  "language": ["en", "hi"],
  "createdAt": "2026-01-13T00:00:00Z",
  "updatedAt": "2026-01-13T00:00:00Z"
}
```

### 2. Papers Collection

Stores the actual questions for each exam and department.

**Collection Name:** `papers`

**Schema:**

```javascript
{
  examName: String,          // Must match an exam in exams collection
  department: String,        // One of the departments from the exam
  year: String,              // e.g., "january_2026"
  location: String,          // e.g., "New Delhi"
  questions: [
    {
      ques: String,          // Question in English
      ques_hi: String,       // Question in Hindi
      options: [
        {
          en: String,        // Option in English
          hi: String         // Option in Hindi
        }
      ],
      correct: Number        // Index of correct answer (0-3)
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

**Example Document:**

```json
{
  "_id": "507f1f77bcf86cd799439011",
  "examName": "junior_engineer",
  "department": "mechanical",
  "year": "january_2026",
  "location": "New Delhi",
  "questions": [
    {
      "ques": "What is the capital of India?",
      "ques_hi": "भारत की राजधानी क्या है?",
      "options": [
        { "en": "Mumbai", "hi": "मुंबई" },
        { "en": "New Delhi", "hi": "नई दिल्ली" },
        { "en": "Bangalore", "hi": "बेंगलुरु" },
        { "en": "Kolkata", "hi": "कोलकाता" }
      ],
      "correct": 1
    }
  ],
  "createdAt": "2026-01-13T00:00:00Z",
  "updatedAt": "2026-01-13T00:00:00Z"
}
```

## Setup Instructions

### 1. Install MongoDB

**Option A: Local Installation**

```bash
# Ubuntu/Debian
sudo apt-get install mongodb

# macOS
brew tap mongodb/brew
brew install mongodb-community
```

**Option B: MongoDB Atlas (Cloud)**

1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create a free cluster
3. Get your connection string

### 2. Configure Environment Variables

Create or update `.env.local`:

```env
# Local MongoDB
MONGODB_URI=mongodb://localhost:27017/railje

# OR MongoDB Atlas
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/railje?retryWrites=true&w=majority
```

### 3. Install Dependencies

Dependencies are already installed:

```bash
npm install mongodb mongoose
```

### 4. Start MongoDB (if using local)

```bash
# Ubuntu/Debian
sudo systemctl start mongodb

# macOS
brew services start mongodb-community
```

## API Endpoints

### Get All Exams

```
GET /api/exams
```

Returns all active exams.

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "examName": "junior_engineer",
      "department": ["mechanical", "signal", "electrical"],
      "totalQuestions": 110,
      "duration": 120,
      "description": "Railway Junior Engineer examination",
      "status": "active",
      "language": ["en", "hi"]
    }
  ]
}
```

### Get Exam by Name

```
GET /api/exams/[examName]
```

Returns a specific exam by name.

**Example:** `/api/exams/junior_engineer`

### Get Paper

```
GET /api/papers/[examName]/[department]
```

Returns the latest paper for a specific exam and department.

**Example:** `/api/papers/junior_engineer/mechanical`

## Exam Page URL Format

The exam page URL follows this pattern:

```
/exam/[examName]_[department]
```

**Examples:**

- `/exam/junior_engineer_mechanical`
- `/exam/junior_engineer_signal`
- `/exam/junior_engineer_electrical`

## Populating the Database

### Using MongoDB Compass (GUI)

1. Download MongoDB Compass from https://www.mongodb.com/products/compass
2. Connect to your MongoDB instance
3. Create database: `railje`
4. Create collections: `exams` and `papers`
5. Insert documents using the JSON examples above

### Using MongoDB Shell

```bash
# Connect to MongoDB
mongosh

# Switch to railje database
use railje

# Insert an exam
db.exams.insertOne({
  examName: "junior_engineer",
  department: ["mechanical", "signal", "electrical"],
  totalQuestions: 110,
  duration: 120,
  description: "Railway Junior Engineer examination",
  status: "active",
  language: ["en", "hi"],
  createdAt: new Date(),
  updatedAt: new Date()
})

# Insert a paper
db.papers.insertOne({
  examName: "junior_engineer",
  department: "mechanical",
  year: "january_2026",
  location: "New Delhi",
  questions: [
    {
      ques: "What is the capital of India?",
      ques_hi: "भारत की राजधानी क्या है?",
      options: [
        { en: "Mumbai", hi: "मुंबई" },
        { en: "New Delhi", hi: "नई दिल्ली" },
        { en: "Bangalore", hi: "बेंगलुरु" },
        { en: "Kolkata", hi: "कोलकाता" }
      ],
      correct: 1
    }
  ],
  createdAt: new Date(),
  updatedAt: new Date()
})
```

### Using Node.js Script

Create a file `scripts/populate-db.js`:

```javascript
const mongoose = require("mongoose");
const Exam = require("../src/models/Exam").default;
const Paper = require("../src/models/Paper").default;

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/railje";

async function populateDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Insert exam
    const exam = await Exam.create({
      examName: "junior_engineer",
      department: ["mechanical", "signal", "electrical"],
      totalQuestions: 110,
      duration: 120,
      description: "Railway Junior Engineer examination",
      status: "active",
      language: ["en", "hi"],
    });
    console.log("Exam created:", exam.examName);

    // Insert paper
    const paper = await Paper.create({
      examName: "junior_engineer",
      department: "mechanical",
      year: "january_2026",
      location: "New Delhi",
      questions: [
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
      ],
    });
    console.log("Paper created:", paper.department);

    await mongoose.disconnect();
    console.log("Database populated successfully!");
  } catch (error) {
    console.error("Error populating database:", error);
    process.exit(1);
  }
}

populateDatabase();
```

Run the script:

```bash
node scripts/populate-db.js
```

## Exam Scoring System

The application uses the following scoring system:

- **Correct Answer:** +1 mark
- **Wrong Answer:** -1/3 mark (negative marking)
- **Skipped Question:** 0 marks (no penalty)
- **Passing Criteria:** 40% of total marks

## Migration from JSON

If you have existing JSON data in `src/data/exams.json`, you'll need to:

1. Transform the data structure to match the MongoDB schema
2. Upload to MongoDB using one of the methods above
3. Update the homepage (`src/components/ExamCards.tsx`) to fetch from the API instead of JSON

## Troubleshooting

### Connection Issues

If you see connection errors:

1. Check if MongoDB is running: `sudo systemctl status mongodb`
2. Verify the connection string in `.env.local`
3. Check firewall settings

### Schema Validation Errors

Ensure all required fields are present:

- Each question must have exactly 4 options
- `correct` must be between 0-3
- All bilingual fields (en/hi) must be provided

### API Not Working

1. Restart the dev server: `npm run dev`
2. Check the terminal for errors
3. Verify MongoDB connection in server logs

## Additional Resources

- [MongoDB Documentation](https://docs.mongodb.com/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
