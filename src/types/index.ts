export type UserRole = 'student' | 'admin';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  selectedPapers: string[]; // Paper IDs like 'fa1', 'pm'
  createdAt: string;
  updatedAt: string;
  photoURL?: string;
  leaderboardOptIn: boolean;
  status: 'active' | 'inactive';
}

export type PaperCategory = 'foundation' | 'skills' | 'professional';

export interface AccaPaper {
  id: string; // e.g. 'fa1'
  code: string; // e.g. 'FA1'
  name: string; // e.g. 'Recording Financial Transactions'
  category: PaperCategory;
  level: string; // e.g. 'Applied Knowledge' / 'Foundations in Accountancy'
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  totalTopics: number;
  totalQuestions: number;
  examDurationMinutes: number;
  passPercentage: number;
  isActive: boolean;
  order: number;
}

export interface Topic {
  id: string;
  paperId: string;
  name: string;
  code?: string;
  description: string;
  order: number;
  difficultyLevel: 'introductory' | 'intermediate' | 'advanced';
  questionCount: number;
  isActive: boolean;
}

export interface QuestionOption {
  id: string; // e.g. 'A', 'B', 'C', 'D'
  text: string;
}

export interface Question {
  id: string;
  paperId: string;
  topicId: string;
  text: string;
  options: QuestionOption[];
  correctOptionId: string; // e.g. 'A'
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  marks: number;
  imageUrl?: string;
  isActive: boolean;
  createdAt: string;
  syllabusReference?: string;
}

export interface QuestionAttempt {
  id: string;
  userId: string;
  paperId: string;
  topicId: string;
  questionId: string;
  selectedOptionId: string;
  isCorrect: boolean;
  timeSpentSeconds: number;
  timestamp: string;
  mode: 'practice' | 'mock_exam';
}

export interface SavedQuestion {
  id: string;
  userId: string;
  questionId: string;
  paperId: string;
  topicId: string;
  savedAt: string;
  notes?: string;
}

export interface MockExam {
  id: string;
  paperId: string;
  title: string;
  description: string;
  durationMinutes: number;
  totalMarks: number;
  passMarks: number;
  passPercentage: number;
  totalQuestions: number;
  questionIds: string[];
  isPublished: boolean;
  difficulty: 'standard' | 'challenging';
}

export interface ExamAttempt {
  id: string;
  userId: string;
  mockExamId: string;
  paperId: string;
  examTitle: string;
  startedAt: string;
  submittedAt?: string;
  durationMinutes: number;
  timeSpentSeconds: number;
  totalQuestions: number;
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  isPassed: boolean;
  answers: Record<string, string>; // questionId -> selectedOptionId
  markedForReview: string[]; // questionIds
  status: 'in_progress' | 'submitted' | 'timed_out';
}

export type ResourceCategory =
  | 'study_notes'
  | 'revision_notes'
  | 'books'
  | 'past_papers'
  | 'examiner_reports'
  | 'video_resources'
  | 'external_links';

export interface LearningResource {
  id: string;
  title: string;
  category: ResourceCategory;
  paperId: string;
  topicId?: string;
  description: string;
  fileUrl?: string;
  externalUrl?: string;
  authorOrPublisher: string;
  isAuthorized: boolean;
  fileType?: string;
  fileSize?: string;
  createdAt: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'normal' | 'important' | 'urgent';
  targetPaperId?: string;
  createdAt: string;
  isPublished: boolean;
}

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  photoURL?: string;
  totalPoints: number;
  completedExams: number;
  averageScore: number;
  totalQuestionsAttempted: number;
  correctAnswers: number;
  lastActive: string;
  rank?: number;
}
