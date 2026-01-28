# Rail-Jee API Documentation

## Overview
This document outlines **all API endpoints** for the Rail-Jee Railway Exam Platform, including department selection, department details with lazy-loaded materials, and exam functionality.

**Total Endpoints**: 7 APIs (3 Department + 4 Exam)

---

## Base URL
```
Production: https://api.railjee.com/v1
Development: http://localhost:3000/api
```

---

## API Endpoints

## Department APIs

### 1. GET /api/departments

**Purpose**: Fetch list of all available departments (shown on department selection page)

**Request**:
```http
GET /api/departments
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "civil",
      "name": "Civil Engg",
      "fullName": "Civil Engineering Department",
      "description": "Infrastructure, bridges, tracks & construction",
      "icon": "building",
      "color": {
        "gradient": "from-red-600 to-red-800",
        "bg": "bg-red-50"
      },
      "paperCount": 7,
      "materialCount": 4
    },
    {
      "id": "mechanical",
      "name": "Mechanical",
      "fullName": "Mechanical Engineering Department",
      "description": "Locomotives, rolling stock & maintenance",
      "icon": "wrench",
      "color": {
        "gradient": "from-orange-600 to-red-700",
        "bg": "bg-orange-50"
      },
      "paperCount": 5,
      "materialCount": 3
    }
  ]
}
```

**Data Fields**:
| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique department identifier (used in URLs) |
| name | string | Short department name for display |
| fullName | string | Full department name |
| description | string | Brief department description |
| icon | string | Icon identifier (building, wrench, bolt, etc.) |
| color.gradient | string | Tailwind gradient classes for department theme |
| color.bg | string | Tailwind background color class |
| paperCount | number | Total number of exam papers available |
| materialCount | number | Total number of study materials available |

---

### 2. GET /api/departments/:deptId

**Purpose**: Fetch detailed information for a specific department including papers and filters (materials loaded separately for performance)

**Request**:
```http
GET /api/departments/civil
```

**Query Parameters** (optional):
| Parameter | Type | Description |
|-----------|------|-------------|
| examType | string | Filter papers by exam type (e.g., "RRB JE CBT-1") |
| subject | string | Filter papers by subject (e.g., "Mathematics") |

**Response**:
```json
{
  "success": true,
  "data": {
    "department": {
      "id": "civil",
      "name": "Civil Engg",
      "fullName": "Civil Engineering",
      "color": {
        "gradient": "from-red-600 to-red-800",
        "bg": "bg-red-50"
      }
    },
    "papers": [
      {
        "id": "je-civil-2024-1",
        "name": "RRB JE CBT-1",
        "description": "Junior Engineer Computer Based Test Stage 1",
        "year": "2024",
        "shift": "Shift 1",
        "questions": 100,
        "duration": 90,
        "attempts": 12500,
        "rating": 4.8,
        "isFree": true,
        "isNew": true,
        "subjects": ["Mathematics", "General Science", "Current Affairs"],
        "examId": "je"
      }
    ],
    "filters": {
      "examTypes": ["RRB JE CBT-1", "RRB SSE"],
      "subjects": ["Mathematics", "General Science", "Current Affairs", "English"]
    }
  }
}
```

**Data Fields**:

**department**:
| Field | Type | Description |
|-------|------|-------------|
| id | string | Department identifier |
| name | string | Short department name |
| fullName | string | Full department name |
| color.gradient | string | Tailwind gradient classes |
| color.bg | string | Tailwind background color class |

**papers[]**:
| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique paper identifier |
| name | string | Exam name (e.g., "RRB JE CBT-1") |
| description | string | Detailed exam description |
| year | string | Exam year |
| shift | string | Exam shift (Shift 1, Shift 2, Morning, etc.) |
| questions | number | Number of questions |
| duration | number | Duration in minutes |
| attempts | number | Number of students who attempted |
| rating | number | Average rating (0-5) |
| isFree | boolean | Whether the exam is free |
| isNew | boolean | Whether marked as new (optional) |
| subjects | string[] | Array of subjects covered |
| examId | string | Linked exam identifier for taking the test |

**filters**:
| Field | Type | Description |
|-------|------|-------------|
| examTypes | string[] | Available exam types for filtering |
| subjects | string[] | Available subjects for filtering |

---

### 3. GET /api/departments/:deptId/materials

**Purpose**: Fetch study materials for a specific department (lazy-loaded when Materials tab is clicked)

**Request**:
```http
GET /api/departments/civil/materials
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "civil-notes-1",
      "name": "Structural Analysis Complete Notes",
      "type": "notes",
      "description": "Comprehensive notes covering all structural analysis concepts",
      "downloads": 8900,
      "rating": 4.8,
      "isFree": true,
      "contentType": "pdf",
      "contentUrl": "https://example.com/sample.pdf"
    }
  ]
}
```

**Data Fields**:
| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique material identifier |
| name | string | Material name |
| type | string | Material type (notes, book, video, guide) |
| description | string | Material description |
| downloads | number | Download count |
| rating | number | Average rating (0-5) |
| isFree | boolean | Whether the material is free |
| contentType | string | Content type (pdf, video) |
| contentUrl | string | URL to access the content |

---

## Exam APIs

### 4. GET /api/papers/top

**Purpose**: Fetch top 6 exam papers for homepage display

**Request**:
```http
GET /api/papers/top
```

**Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": "je",
      "name": "Junior Engineer (JE)",
      "description": "Technical exam for aspiring railway engineers covering civil, electrical, and mechanical engineering.",
      "duration": 120,
      "totalQuestions": 100,
      "department": "Engineering"
    },
    {
      "id": "ntpc",
      "name": "NTPC Graduate",
      "description": "Non-Technical Popular Categories exam for graduate-level railway positions.",
      "duration": 120,
      "totalQuestions": 100,
      "department": "Operations"
    }
  ]
}
```

**Data Fields**:
| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique exam identifier |
| name | string | Exam display name |
| description | string | Brief exam description |
| duration | number | Duration in minutes |
| totalQuestions | number | Total number of questions |
| department | string | Department category |

---

### 5. GET /api/exams/:examId

**Purpose**: Fetch exam preview details (shown before starting the exam)

**Request**:
```http
GET /api/exams/je
```

**Response**:
```json
{
  "success": true,
  "data": {
    "id": "je",
    "name": "Junior Engineer (JE)",
    "description": "Technical exam for aspiring railway engineers",
    "duration": 120,
    "totalQuestions": 100,
    "passingMarks": 40,
    "passingPercentage": 40,
    "negativeMarking": -0.33,
    "instructions": [
      "You must complete this test in one session - make sure your internet is reliable.",
      "1 mark awarded for a correct answer. Negative marking of -0.33 for each wrong answer.",
      "More you give the correct answer more chance to win the badge.",
      "If you don't earn a badge this time, you can retake this test once more."
    ],
    "studentsAttempted": 15600
  }
}
```

**Data Fields**:
| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique exam identifier |
| name | string | Exam display name |
| description | string | Brief exam description |
| duration | number | Duration in minutes |
| totalQuestions | number | Total number of questions |
| passingMarks | number | Minimum marks to pass |
| passingPercentage | number | Minimum percentage to pass |
| negativeMarking | number | Negative marks per wrong answer (e.g., -0.33) |
| instructions | string[] | Array of instruction strings |
| studentsAttempted | number | Total students who attempted this exam |

---

### 6. GET /api/exams/:examId/questions

**Purpose**: Fetch all exam questions with bilingual content (called when exam starts)

**Request**:
```http
GET /api/exams/je/questions
```

**Response**:
```json
{
  "success": true,
  "data": {
    "examId": "je",
    "questions": [
      {
        "id": 1,
        "question": {
          "en": "What is the standard gauge width used in Indian Railways?",
          "hi": "भारतीय रेलवे में प्रयोग होने वाली मानक गेज चौड़ाई क्या है?"
        },
        "options": {
          "en": ["1435 mm", "1676 mm", "1000 mm", "762 mm"],
          "hi": ["1435 मिमी", "1676 मिमी", "1000 मिमी", "762 मिमी"]
        },
        "correctAnswer": 1
      },
      {
        "id": 2,
        "question": {
          "en": "Which type of current is used in Indian electric locomotives?",
          "hi": "भारतीय विद्युत लोकोमोटिव में किस प्रकार की धारा का उपयोग किया जाता है?"
        },
        "options": {
          "en": ["DC only", "AC only", "Both AC and DC", "None"],
          "hi": ["केवल डीसी", "केवल एसी", "एसी और डीसी दोनों", "कोई नहीं"]
        },
        "correctAnswer": 2
      }
    ]
  }
}
```

**Data Fields**:
| Field | Type | Description |
|-------|------|-------------|
| examId | string | Exam identifier |
| questions | array | Array of question objects |
| questions[].id | number | Question number (1-based) |
| questions[].question.en | string | Question text in English |
| questions[].question.hi | string | Question text in Hindi |
| questions[].options.en | string[] | 4 options in English |
| questions[].options.hi | string[] | 4 options in Hindi |
| questions[].correctAnswer | number | Index of correct option (0-3) |

> **Note**: Frontend will prefetch this endpoint in the background while showing exam preview, enabling instant exam start.

---

### 6. POST /api/exams/:examId/submit

**Purpose**: Submit exam answers and receive calculated results

**Request**:
```http
POST /api/exams/je/submit
Content-Type: application/json

{
  "answers": [1, 2, null, 0, 3, null, 1, 2, 0, 1],
  "timeTaken": 5400
}
```

**Request Body**:
| Field | Type | Description |
|-------|------|-------------|
| answers | array | Array of selected option indices. Each element is either a number (0-3) for answered questions or `null` for skipped questions. Array length must match `totalQuestions` |
| timeTaken | number | Total time taken in seconds |

**Response**:
```json
{
  "success": true,
  "data": {
    "score": 67.67,
    "percentage": 67.67,
    "passed": true,
    "correctAnswers": 72,
    "wrongAnswers": 15,
    "skipped": 13
  }
}
```

**Response Data**:
| Field | Type | Description |
|-------|------|-------------|
| score | number | Final score after applying negative marking (e.g., 67.67) |
| percentage | number | Score as percentage (e.g., 67.67%) |
| passed | boolean | Whether user passed (based on passingPercentage) |
| correctAnswers | number | Count of correctly answered questions |
| wrongAnswers | number | Count of incorrectly answered questions |
| skipped | number | Count of skipped questions (null answers) |

**Score Calculation Logic**:
- Correct answer: +1 mark
- Wrong answer: -0.33 marks (negative marking)
- Skipped: 0 marks
- Passing criteria: 40% or above

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "error": {
    "code": "EXAM_NOT_FOUND",
    "message": "The requested exam does not exist"
  }
}
```

**Common Error Codes**:
| Code | HTTP Status | Description |
|------|-------------|-------------|
| EXAM_NOT_FOUND | 404 | Exam ID doesn't exist |
| INVALID_REQUEST | 400 | Request body is malformed or missing required fields |
| SERVER_ERROR | 500 | Internal server error |

---

## Implementation Notes

### For Backend Engineers:

1. **Database Structure**:
   - Store exams with metadata (id, name, duration, etc.)
   - Store questions separately linked to examId
   - Support bilingual content (en/hi) for questions and options

2. **Score Calculation**:
   - Implement server-side calculation: `(correct × 1) + (wrong × -0.33)`
   - Round to 2 decimal places
   - Determine pass/fail based on exam's `passingPercentage`

3. **Performance**:
   - Cache exam details (GET /exams/:examId) - changes infrequently
   - Questions endpoint should be fast (<200ms) as it's in critical path
   - Consider compression for questions response (typically 100+ questions)

4. **Security**:
   - Validate that answers array length matches exam's totalQuestions
   - Validate answer indices are 0-3 or null
   - Rate limit submission endpoint to prevent abuse

5. **Response Times**:
   - GET /exams/:examId → Target: <100ms
   - GET /exams/:examId/questions → Target: <200ms
   - POST /exams/:examId/submit → Target: <300ms

---

*Document Version: 3.0*  
*Last Updated: January 28, 2026*  
*Total Endpoints: 6 (2 Department APIs + 4 Exam APIs)*
