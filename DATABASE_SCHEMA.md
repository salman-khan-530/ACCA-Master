# ACCA Master — Cloud Firestore Database Schema Architecture

This document outlines the collection schemas, document relationships, indexing requirements, and security isolation rules used in **ACCA Master**.

---

## 1. Collections Overview

| Collection Name | Document ID | Purpose | Write Permissions | Read Permissions |
| :--- | :--- | :--- | :--- | :--- |
| `users` | `uid` (Firebase Auth UID) | Candidate & Admin user profiles | Owner (non-role fields) / Admin | Authenticated |
| `papers` | `paperId` (e.g., `fa1`, `pm`) | 18 ACCA Qualification papers | Admin only | Public |
| `topics` | `topicId` (e.g., `fa1-t1`) | Syllabus topic modules | Admin only | Public |
| `questions` | `questionId` (e.g., `fa1-q01`) | MCQ Question bank | Admin only | Public |
| `question_attempts` | `attemptId` (UUID) | Individual question practice attempts | Owner UID | Owner / Admin |
| `mock_exams` | `mockId` (e.g., `fa1-mock-1`) | Timed CBE exam configurations | Admin only | Public |
| `exam_attempts` | `attemptId` (UUID) | Completed/in-progress mock attempts | Owner UID | Owner / Admin |
| `saved_questions` | `savedId` (UUID) | Student question bookmarks | Owner UID | Owner / Admin |
| `resources` | `resourceId` | Notes, books, examiner reports | Admin only | Public |
| `announcements` | `announcementId` | Platform announcements & alerts | Admin only | Public |

---

## 2. Document Data Models

### 2.1. `users` Collection (`/users/{uid}`)
```json
{
  "uid": "user_123456789",
  "email": "student@accamaster.com",
  "displayName": "Alex Morgan",
  "role": "student", // "student" | "admin"
  "selectedPapers": ["fa1", "pm"],
  "leaderboardOptIn": true,
  "status": "active", // "active" | "inactive"
  "createdAt": "2026-01-01T12:00:00Z",
  "updatedAt": "2026-02-01T14:30:00Z"
}
```

### 2.2. `papers` Collection (`/papers/{paperId}`)
```json
{
  "id": "fa1",
  "code": "FA1",
  "name": "Recording Financial Transactions",
  "category": "foundation", // "foundation" | "skills" | "professional"
  "level": "Foundations in Accountancy (Introductory)",
  "shortDescription": "Core double-entry bookkeeping, banking, sales tax and reconciliations.",
  "fullDescription": "Detailed syllabus description...",
  "iconName": "ReceiptText",
  "totalTopics": 8,
  "totalQuestions": 25,
  "examDurationMinutes": 120,
  "passPercentage": 50,
  "isActive": true,
  "order": 1
}
```

### 2.3. `topics` Collection (`/topics/{topicId}`)
```json
{
  "id": "fa1-t1",
  "paperId": "fa1",
  "name": "Types of Business Organizations and Documentation",
  "code": "FA1-T01",
  "description": "Sole proprietorships, partnerships, limited liability companies...",
  "order": 1,
  "difficultyLevel": "introductory", // "introductory" | "intermediate" | "advanced"
  "questionCount": 4,
  "isActive": true
}
```

### 2.4. `questions` Collection (`/questions/{questionId}`)
```json
{
  "id": "fa1-q01",
  "paperId": "fa1",
  "topicId": "fa1-t1",
  "text": "Which of the following business entities has a separate legal personality from its owners?",
  "options": [
    { "id": "A", "text": "Sole proprietorship" },
    { "id": "B", "text": "General partnership" },
    { "id": "C", "text": "Limited liability company" },
    { "id": "D", "text": "Informal unincorporated association" }
  ],
  "correctOptionId": "C",
  "explanation": "A limited liability company is recognized by law as an independent legal entity distinct from its shareholders...",
  "difficulty": "easy", // "easy" | "medium" | "hard"
  "marks": 2,
  "syllabusReference": "FA1 Study Guide A.1",
  "isActive": true,
  "createdAt": "2026-01-10T10:00:00Z"
}
```

### 2.5. `question_attempts` Collection (`/question_attempts/{attemptId}`)
```json
{
  "id": "att-1707000000000",
  "userId": "user_123456789",
  "paperId": "fa1",
  "topicId": "fa1-t1",
  "questionId": "fa1-q01",
  "selectedOptionId": "C",
  "isCorrect": true,
  "timeSpentSeconds": 45,
  "timestamp": "2026-02-01T10:15:00Z",
  "mode": "practice" // "practice" | "mock_exam"
}
```

### 2.6. `mock_exams` Collection (`/mock_exams/{mockId}`)
```json
{
  "id": "fa1-mock-1",
  "paperId": "fa1",
  "title": "FA1 Comprehensive Standard Mock Exam 1",
  "description": "Full-scope 20-question timed simulation reflecting official CBE test format...",
  "durationMinutes": 60,
  "totalQuestions": 20,
  "totalMarks": 40,
  "passMarks": 20,
  "passPercentage": 50,
  "difficulty": "standard",
  "isPublished": true,
  "questionIds": ["fa1-q01", "fa1-q02", "fa1-q03", "..."]
}
```

### 2.7. `exam_attempts` Collection (`/exam_attempts/{attemptId}`)
```json
{
  "id": "exam-att-1707000000000",
  "userId": "user_123456789",
  "mockExamId": "fa1-mock-1",
  "paperId": "fa1",
  "examTitle": "FA1 Comprehensive Standard Mock Exam 1",
  "startedAt": "2026-02-01T14:00:00Z",
  "submittedAt": "2026-02-01T14:48:00Z",
  "durationMinutes": 60,
  "timeSpentSeconds": 2880,
  "totalQuestions": 20,
  "totalMarks": 40,
  "obtainedMarks": 32,
  "percentage": 80,
  "isPassed": true,
  "answers": {
    "fa1-q01": "C",
    "fa1-q02": "B"
  },
  "markedForReview": ["fa1-q16"],
  "status": "submitted" // "in_progress" | "submitted" | "timed_out"
}
```

---

## 3. Composite Indexes Configuration

The required Firestore indexes are committed in `firestore.indexes.json`:
1. `question_attempts`: `(userId ASC, timestamp DESC)`
2. `exam_attempts`: `(userId ASC, startedAt DESC)`
3. `questions`: `(paperId ASC, topicId ASC)`
4. `topics`: `(paperId ASC, order ASC)`
