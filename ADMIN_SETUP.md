# ACCA Master — Administrator Setup & Management Guide

This document explains how platform owners securely initialize administrator accounts, assign administrative privileges, manage topics, and bulk-import examination questions.

---

## 1. Security Architecture & Strict Role Separation

In accordance with strict production security standards:
- **Zero Public Admin Triggers**: There are **no** "Switch to Admin" buttons, public admin links, or role-elevation checkboxes visible to students or visitors.
- **Header Isolation**: The "Admin Console" link is dynamically rendered in the navigation header **only** when an authenticated user has `role: 'admin'`. Students see only their personal dashboard, practice tools, and bookmarks.
- **Route Guards (RBAC)**: If an unauthorized user attempts to navigate directly to `/admin`, `ProtectedRoute.tsx` intercepts the request and serves a `403 Access Denied` barrier with no option to elevate privileges.
- **Automatic Student Defaulting**: Every new account registered through `/register` is strictly created with `role: 'student'`.

---

## 2. Administrator Authentication & Setup

### A. Local / Offline Engine Testing
To test administrative capabilities in offline/local mode:
- Navigate to `/login`
- Enter Administrator Email: `admin@accamaster.com`
- Enter Password: `password123` (or any non-empty password)
- Click **Sign In**: The system recognizes the administrator record and automatically routes you to `/admin`.

### B. Live Production Setup (Firebase Authentication & Cloud Firestore)
When deploying to a live client domain:
1. Register the client's official email at `/register` (e.g. `director@accamaster.com`).
2. Open your **Firebase Console** -> **Firestore Database** -> `users` collection.
3. Open the document corresponding to the administrator's `uid`.
4. Change the `role` field value from `"student"` to `"admin"`:
   ```json
   {
     "role": "admin"
   }
   ```
5. The next time this user logs in, they are instantly recognized as an administrator and given access to `/admin`. Regular students will have zero access.

### C. Advanced Production Protection (Firebase Custom Claims)
For mission-critical deployments, admin roles can be enforced at the Firebase Auth token layer:
```javascript
import admin from 'firebase-admin';

admin.initializeApp();
const uid = "YOUR_ADMIN_USER_UID";

await admin.auth().setCustomUserClaims(uid, { role: 'admin' });
console.log(`Administrator token claims assigned to UID: ${uid}`);
```
The included `firestore.rules` file enforces that question creation, topic updates, and mock exam publishing require `request.auth.token.role == 'admin'`.

---

## 3. Bulk Question Import using CSV

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

## 4. Managing Topics & Mock Examinations

### Adding Topics:
1. Navigate to **Admin Console** -> **Topics** tab.
2. Select target paper (e.g., `FA1` or `PM`).
3. Click **"Add New Topic"**, assign code and difficulty level, and save.

### Creating Timed Mock Examinations:
1. Navigate to **Admin Console** -> **Mock Examinations** tab.
2. Click **"Create Timed Mock"**.
3. Set Exam Title, Paper, Question count, Duration (in minutes), and Pass Percentage (standard 50%).
4. The system automatically links active questions and publishes the timed simulation to the student directory.
