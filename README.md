# ACCA Master — Complete ACCA Learning Platform & CBE Simulator

<p align="center">
  <strong>A modern, production-ready educational platform engineered for ACCA qualification candidates.</strong><br>
  Featuring authentic Computer Based Examination (CBE) simulations, topic-wise MCQ training, instant diagnostic scoring, student analytics, and an integrated administrator console.
</p>

---

## 🚀 Key Highlights & Architecture

- **Commercial-Grade Design**: Dark navy primary branding (`#0B192C`), crisp card surfaces, responsive layouts across desktop, tablet, and mobile.
- **18 ACCA Papers Fully Configured**:
  - **Foundation / Applied Knowledge**: FA1, FA2, MA1, MA2, FBT, FMA, FFA, LW
  - **Applied Skills**: PM, TX, FR, AA, FM
  - **Strategic Professional**: SBL, SBR, ATX, APM, AAA
- **Interactive MCQ Engine**: One question at a time, 4 configurable options, immediate accounting explanations, question navigator grid, and multi-filter practice (topic-wise, difficulty, unattempted, missed questions, bookmarked).
- **Timed CBE Mock Simulator**: Strict countdown timers, question review flags (`Mark for Review`), continuous autosaving, submission confirmation modals, and automatic submission upon timer expiration.
- **Diagnostic Results & Analytics**: Pass/fail badges (50% standard benchmark), confetti celebration, question-by-question review, Recharts score trends over time, and topic weakness detection.
- **Administrator Console**: Full topic management, question bank editor, bulk CSV question import with template download, mock exam generator, and student account status controls.
- **Dual-Mode Backend Engine**:
  - Connects seamlessly to **Firebase Auth** and **Cloud Firestore** when environment credentials are supplied.
  - Automatically activates a local reactive database engine with pre-seeded data when offline or during test-driving, ensuring 100% functionality out of the box without requiring manual setup.
- **Security & Authorization**: Role-Based Access Control (RBAC), protected student routes, protected admin routes, and strict `firestore.rules`.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS v4 |
| **Routing** | React Router v7 |
| **Icons & UI** | Lucide React, Canvas Confetti |
| **Visualizations** | Recharts (Area, Line, Bar, Progression analytics) |
| **State & Forms** | React Hook Form, Context API, Reactive LocalStorage Sync |
| **Backend & Database** | Firebase Authentication, Cloud Firestore, Security Rules |
| **Testing** | Vitest, React Testing Library, Jest DOM |

---

## 📁 Project Structure

```text
ACCA-Master/
├── public/
│   ├── favicon.svg                       # Original ACCA Master emblem
│   ├── sample_questions_import_template.csv # Downloadable CSV template for question import
│   └── _redirects                        # SPA routing for static hosts
├── src/
│   ├── components/
│   │   ├── common/                       # Logo, ProtectedRoute
│   │   └── layout/                       # Header, Footer, Layout wrapper
│   ├── contexts/
│   │   └── AuthContext.tsx               # Dual-mode Firebase/Local authentication
│   ├── data/
│   │   ├── papersData.ts                 # All 18 ACCA papers with metadata
│   │   ├── fa1TopicsData.ts              # 8 structured FA1 syllabus topics
│   │   ├── sampleQuestionsData.ts        # 25+ comprehensive original sample MCQs
│   │   ├── mockExamsData.ts              # Timed CBE mock configurations
│   │   ├── learningResourcesData.ts      # Study notes, books, examiner reports
│   │   └── announcementsData.ts          # Broadcast announcements
│   ├── pages/
│   │   ├── Home/HomePage.tsx             # Public homepage & hero showcase
│   │   ├── Auth/                         # Login, Register, Forgot Password, Profile
│   │   ├── Student/                      # Dashboard, Analytics, Saved Questions
│   │   ├── Papers/                       # 18 Papers catalogue, PaperDashboard, TopicDetail
│   │   ├── Practice/McqPractice.tsx      # Comprehensive MCQ Practice engine
│   │   ├── Examination/                  # Mock list, Timed simulator, Diagnostic results
│   │   ├── Resources/ResourcesPage.tsx   # Study library & examiner insights
│   │   ├── Leaderboard/LeaderboardPage.tsx# Student rankings with privacy toggle
│   │   ├── Admin/AdminDashboard.tsx      # Administrator console & CSV import
│   │   ├── About/AboutPage.tsx           # Mission & open education values
│   │   └── Contact/ContactPage.tsx       # Inquiries & student study community
│   ├── services/
│   │   ├── firebase.ts                   # Firebase initialization & detection
│   │   └── dbService.ts                  # Unified data engine (Firestore & client seed)
│   ├── tests/
│   │   ├── setup.ts                      # Vitest test environment
│   │   ├── scoring.test.ts               # Exam scoring & pass/fail tests
│   │   ├── timer.test.ts                 # CBE timer countdown tests
│   │   ├── mcq.test.ts                   # Question bank integrity tests
│   │   └── rbac.test.ts                  # Access control & registration security tests
│   ├── types/index.ts                    # TypeScript models & schemas
│   ├── App.tsx                           # Router and layout integration
│   ├── main.tsx                          # App mount entry point
│   └── index.css                         # Tailwind CSS base styles
├── firestore.rules                       # Firestore security rules
├── firestore.indexes.json                # Firestore composite index configuration
├── DATABASE_SCHEMA.md                    # Detailed collection schema documentation
├── ADMIN_SETUP.md                        # Administrator setup & CSV import guide
├── DEPLOYMENT.md                         # Production deployment instructions
├── .env.example                          # Environment variable template
└── package.json                          # Package scripts and dependencies
```

---

## 🏃 Getting Started (Local Development)

### 1. Clone & Install Dependencies
```bash
git clone <repository-url>
cd ACCA-Master
npm install
```

### 2. Configure Environment (Optional)
If connecting to your live Firebase project, create a `.env` file from the provided template:
```bash
cp .env.example .env
```
Populate `.env` with your Firebase credentials:
```bash
VITE_FIREBASE_API_KEY="AIzaSy..."
VITE_FIREBASE_AUTH_DOMAIN="your-app.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-app-id"
VITE_FIREBASE_STORAGE_BUCKET="your-app.appspot.com"
VITE_FIREBASE_MESSAGING_SENDER_ID="123456789012"
VITE_FIREBASE_APP_ID="1:123456789012:web:abcdef"
```
*(If no `.env` is supplied, the platform automatically boots in Local Client Mode with full state persistence).*

### 3. Start the Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 🧪 Testing Suite

Automated tests are executed via **Vitest**:
```bash
npm run test
```

### Tests Covered:
- **Scoring & Pass/Fail Calculations**: Verifies 100% score calculation, 50% boundary pass marks, and failing determinations.
- **CBE Countdown Timer**: Verifies minute/second formatting, hour display for long exams, and critical time threshold flags (< 5 minutes).
- **Question Bank Data Integrity**: Validates that all 25 sample questions have 4 valid options, correct answer keys, and accounting explanations.
- **Role-Based Access Control**: Validates that standard students are blocked from `/admin`, while verified administrators receive access.

---

## 🔒 Evaluation Accounts (Quick Logins)

On the `/login` screen, two fast-evaluation buttons allow immediate testing:
1. **Demo Student**: Logs in as *Alex Morgan* to view historical question attempts, pass rates, saved questions, and mock exam results.
2. **Demo Admin**: Logs in as *Senior Admin* with immediate access to the `/admin` console to manage topics, test CSV uploads, and create mock tests.

---

## 📜 Disclaimer

**ACCA Master** is an independent open educational learning platform. ACCA, FIA, Foundations in Accountancy, and related qualification abbreviations are registered trademarks of the Association of Chartered Certified Accountants. ACCA Master is not affiliated with, authorized, or endorsed by ACCA.
