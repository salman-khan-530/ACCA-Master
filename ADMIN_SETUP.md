# ACCA Master — Administrator Setup & Management Guide

This document explains how platform owners securely initialize administrator accounts, assign administrative privileges, manage topics, and bulk-import examination questions.

---

## 1. Security Architecture: Role Assignment

In accordance with strict security standards, **admin roles are never assigned through the public registration form**. Any user who registers through `/register` is automatically assigned the `student` role.

### Setting Up the First Administrator

#### Method A: Instant Local Demo Evaluation (Out of the Box)
If running locally without live Firebase keys, log in immediately using the pre-seeded admin profile:
- Email: `admin@accamaster.com`
- Button: Click **"Demo Admin"** on the `/login` screen.
- Role: Pre-configured as `admin` with full access to `/admin`.

#### Method B: In Live Cloud Firestore
1. Create a student account normally through `/register` (e.g. `owner@yourdomain.com`).
2. Go to your **Firebase Console** -> **Firestore Database** -> `users` collection.
3. Locate the document matching your user's `UID`.
4. Edit the document field:
   ```json
   "role": "admin"
   ```
5. Refresh the browser and navigate to `/admin`.

#### Method C: Firebase Admin SDK / Custom Claims (Production)
Run a script using `firebase-admin` to set custom claims:
```javascript
import admin from 'firebase-admin';

admin.initializeApp();
const uid = "YOUR_ADMIN_USER_UID";

await admin.auth().setCustomUserClaims(uid, { admin: true });
console.log(`Administrator claims assigned to UID: ${uid}`);
```

---

## 2. Bulk Question Import using CSV

Administrators can bulk-upload hundreds of MCQs in seconds using our integrated CSV parser.

### Step 1: Download the Template
From the **Admin Console** -> **Question Bank** tab, click **"Download CSV Template"** or retrieve the template directly from `public/sample_questions_import_template.csv`.

### Step 2: CSV Columns Specification
| Column Header | Type | Example | Description |
| :--- | :--- | :--- | :--- |
| `id` | string | `fa1-import-101` | Unique question identifier |
| `paperId` | string | `fa1` | Matching ACCA paper ID (lowercase) |
| `topicId` | string | `fa1-t1` | Matching Topic ID (e.g., `fa1-t1`) |
| `text` | string | `"What is...?"` | Complete question text (enclosed in quotes) |
| `optionA` | string | `"Answer option A"` | Option A text |
| `optionB` | string | `"Answer option B"` | Option B text |
| `optionC` | string | `"Answer option C"` | Option C text |
| `optionD` | string | `"Answer option D"` | Option D text |
| `correctOption` | string | `B` | Option letter: `A`, `B`, `C`, or `D` |
| `difficulty` | string | `easy` | `easy`, `medium`, or `hard` |
| `marks` | number | `2` | Mark allocation (typically 2 for CBE) |
| `explanation` | string | `"Detailed reason..."`| Accounting teaching explanation |
| `syllabusReference`| string | `"FA1 Study Guide B.2"`| Syllabus outcome code |

### Step 3: Uploading & Validation
1. Click **"Upload CSV Questions"** in the Question Bank tab.
2. The client parser validates each line, verifies that option keys and texts exist, and commits the records to Cloud Firestore.
3. A success notification displays the exact number of imported and updated questions.

---

## 3. Managing Topics & Mock Examinations

### Adding Topics:
1. Navigate to **Admin Console** -> **Topics** tab.
2. Select target paper (e.g., `FA1` or `PM`).
3. Click **"Add New Topic"**, assign code and difficulty level, and save.

### Creating Timed Mock Examinations:
1. Navigate to **Admin Console** -> **Mock Examinations** tab.
2. Click **"Create Timed Mock"**.
3. Set Exam Title, Paper, Question count, Duration (in minutes), and Pass Percentage (standard 50%).
4. The system automatically links active questions and publishes the timed simulation to the student directory.
