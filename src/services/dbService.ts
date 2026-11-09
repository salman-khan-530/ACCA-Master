import {
  AccaPaper,
  Topic,
  Question,
  QuestionAttempt,
  SavedQuestion,
  MockExam,
  ExamAttempt,
  LearningResource,
  Announcement,
  LeaderboardEntry,
  UserProfile,
} from '../types';
import { ACCA_PAPERS } from '../data/papersData';
import { FA1_TOPICS } from '../data/fa1TopicsData';
import { SAMPLE_FA1_QUESTIONS } from '../data/sampleQuestionsData';
import { SAMPLE_MOCK_EXAMS } from '../data/mockExamsData';
import { SAMPLE_RESOURCES } from '../data/learningResourcesData';
import { SAMPLE_ANNOUNCEMENTS } from '../data/announcementsData';
import { firestore, isFirebaseConfigured } from './firebase';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';

// Storage keys for offline/local-fallback persistence
const STORAGE_KEYS = {
  PAPERS: 'acca_master_papers',
  TOPICS: 'acca_master_topics',
  QUESTIONS: 'acca_master_questions',
  QUESTION_ATTEMPTS: 'acca_master_question_attempts',
  SAVED_QUESTIONS: 'acca_master_saved_questions',
  MOCK_EXAMS: 'acca_master_mock_exams',
  EXAM_ATTEMPTS: 'acca_master_exam_attempts',
  RESOURCES: 'acca_master_resources',
  ANNOUNCEMENTS: 'acca_master_announcements',
  USERS: 'acca_master_users',
};

// Initialize seed data if not present in localStorage
const initializeLocalStorage = () => {
  if (typeof window === 'undefined') return;

  if (!localStorage.getItem(STORAGE_KEYS.PAPERS)) {
    localStorage.setItem(STORAGE_KEYS.PAPERS, JSON.stringify(ACCA_PAPERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.TOPICS)) {
    localStorage.setItem(STORAGE_KEYS.TOPICS, JSON.stringify(FA1_TOPICS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.QUESTIONS)) {
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(SAMPLE_FA1_QUESTIONS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.MOCK_EXAMS)) {
    localStorage.setItem(STORAGE_KEYS.MOCK_EXAMS, JSON.stringify(SAMPLE_MOCK_EXAMS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.RESOURCES)) {
    localStorage.setItem(STORAGE_KEYS.RESOURCES, JSON.stringify(SAMPLE_RESOURCES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS)) {
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(SAMPLE_ANNOUNCEMENTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    // Initial demo users for offline test-drive
    const initialUsers: UserProfile[] = [
      {
        uid: 'demo-student-id',
        email: 'student@accamaster.com',
        displayName: 'Alex Morgan',
        role: 'student',
        selectedPapers: ['fa1', 'pm'],
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        leaderboardOptIn: true,
        status: 'active',
      },
      {
        uid: 'demo-admin-id',
        email: 'admin@accamaster.com',
        displayName: 'Senior Admin',
        role: 'admin',
        selectedPapers: ['fa1', 'pm', 'sbl'],
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        leaderboardOptIn: false,
        status: 'active',
      },
      {
        uid: 'student-2-id',
        email: 'sarah.j@example.com',
        displayName: 'Sarah Jenkins',
        role: 'student',
        selectedPapers: ['fa1'],
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        leaderboardOptIn: true,
        status: 'active',
      },
      {
        uid: 'student-3-id',
        email: 'david.k@example.com',
        displayName: 'David Kim',
        role: 'student',
        selectedPapers: ['fa1', 'fr'],
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
        leaderboardOptIn: true,
        status: 'active',
      },
    ];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialUsers));
  }

  // Pre-seed some realistic historical attempts for demo student
  if (!localStorage.getItem(STORAGE_KEYS.QUESTION_ATTEMPTS)) {
    const sampleAttempts: QuestionAttempt[] = [
      {
        id: 'att-1',
        userId: 'demo-student-id',
        paperId: 'fa1',
        topicId: 'fa1-t1',
        questionId: 'fa1-q01',
        selectedOptionId: 'C',
        isCorrect: true,
        timeSpentSeconds: 45,
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        mode: 'practice',
      },
      {
        id: 'att-2',
        userId: 'demo-student-id',
        paperId: 'fa1',
        topicId: 'fa1-t1',
        questionId: 'fa1-q02',
        selectedOptionId: 'B',
        isCorrect: true,
        timeSpentSeconds: 38,
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        mode: 'practice',
      },
      {
        id: 'att-3',
        userId: 'demo-student-id',
        paperId: 'fa1',
        topicId: 'fa1-t2',
        questionId: 'fa1-q05',
        selectedOptionId: 'B',
        isCorrect: true,
        timeSpentSeconds: 50,
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        mode: 'practice',
      },
      {
        id: 'att-4',
        userId: 'demo-student-id',
        paperId: 'fa1',
        topicId: 'fa1-t2',
        questionId: 'fa1-q06',
        selectedOptionId: 'B',
        isCorrect: false,
        timeSpentSeconds: 85,
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        mode: 'practice',
      },
      {
        id: 'att-5',
        userId: 'demo-student-id',
        paperId: 'fa1',
        topicId: 'fa1-t7',
        questionId: 'fa1-q22',
        selectedOptionId: 'A',
        isCorrect: true,
        timeSpentSeconds: 95,
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        mode: 'practice',
      },
      // Student 2 attempts for leaderboard
      {
        id: 'att-s2-1',
        userId: 'student-2-id',
        paperId: 'fa1',
        topicId: 'fa1-t1',
        questionId: 'fa1-q01',
        selectedOptionId: 'C',
        isCorrect: true,
        timeSpentSeconds: 40,
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        mode: 'practice',
      },
      {
        id: 'att-s2-2',
        userId: 'student-2-id',
        paperId: 'fa1',
        topicId: 'fa1-t2',
        questionId: 'fa1-q05',
        selectedOptionId: 'B',
        isCorrect: true,
        timeSpentSeconds: 30,
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        mode: 'practice',
      },
    ];
    localStorage.setItem(STORAGE_KEYS.QUESTION_ATTEMPTS, JSON.stringify(sampleAttempts));
  }

  if (!localStorage.getItem(STORAGE_KEYS.EXAM_ATTEMPTS)) {
    const sampleExamAttempts: ExamAttempt[] = [
      {
        id: 'exam-att-demo-1',
        userId: 'demo-student-id',
        mockExamId: 'fa1-mock-1',
        paperId: 'fa1',
        examTitle: 'FA1 Comprehensive Standard Mock Exam 1',
        startedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        submittedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 48 * 60 * 1000).toISOString(),
        durationMinutes: 60,
        timeSpentSeconds: 2880,
        totalQuestions: 20,
        totalMarks: 40,
        obtainedMarks: 32,
        percentage: 80,
        isPassed: true,
        answers: {
          'fa1-q01': 'C',
          'fa1-q02': 'B',
          'fa1-q03': 'C',
          'fa1-q04': 'A',
          'fa1-q05': 'B',
          'fa1-q06': 'C',
          'fa1-q07': 'B',
          'fa1-q08': 'A',
          'fa1-q09': 'B',
          'fa1-q10': 'B',
          'fa1-q11': 'B',
          'fa1-q12': 'B',
          'fa1-q13': 'C',
          'fa1-q14': 'A',
          'fa1-q15': 'C',
          'fa1-q16': 'A', // Incorrect (correct is B)
          'fa1-q17': 'A',
          'fa1-q18': 'A', // Incorrect (correct is B)
          'fa1-q19': 'B',
          'fa1-q20': 'A', // Incorrect (correct is C)
        },
        markedForReview: ['fa1-q16', 'fa1-q18'],
        status: 'submitted',
      },
      {
        id: 'exam-att-s2-1',
        userId: 'student-2-id',
        mockExamId: 'fa1-mock-1',
        paperId: 'fa1',
        examTitle: 'FA1 Comprehensive Standard Mock Exam 1',
        startedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        submittedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 52 * 60 * 1000).toISOString(),
        durationMinutes: 60,
        timeSpentSeconds: 3120,
        totalQuestions: 20,
        totalMarks: 40,
        obtainedMarks: 36,
        percentage: 90,
        isPassed: true,
        answers: {},
        markedForReview: [],
        status: 'submitted',
      },
    ];
    localStorage.setItem(STORAGE_KEYS.EXAM_ATTEMPTS, JSON.stringify(sampleExamAttempts));
  }

  if (!localStorage.getItem(STORAGE_KEYS.SAVED_QUESTIONS)) {
    const sampleSaved: SavedQuestion[] = [
      {
        id: 'saved-1',
        userId: 'demo-student-id',
        questionId: 'fa1-q06',
        paperId: 'fa1',
        topicId: 'fa1-t2',
        savedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Review non-current asset purchase ledger postings vs inventory purchase account',
      },
      {
        id: 'saved-2',
        userId: 'demo-student-id',
        questionId: 'fa1-q22',
        paperId: 'fa1',
        topicId: 'fa1-t7',
        savedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Transposition difference is always divisible by 9',
      },
    ];
    localStorage.setItem(STORAGE_KEYS.SAVED_QUESTIONS, JSON.stringify(sampleSaved));
  }
};

// Auto-seed on load
initializeLocalStorage();

// Helper to get local data
const getLocal = <T>(key: string, defaultValue: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch {
    return defaultValue;
  }
};

const setLocal = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('LocalStorage write error:', err);
  }
};

export const dbService = {
  // --- ACCA PAPERS ---
  async getPapers(): Promise<AccaPaper[]> {
    if (isFirebaseConfigured() && firestore) {
      try {
        const snap = await getDocs(collection(firestore, 'papers'));
        if (!snap.empty) {
          return snap.docs.map((d) => d.data() as AccaPaper).sort((a, b) => a.order - b.order);
        }
      } catch (err) {
        console.warn('Firestore getPapers fallback:', err);
      }
    }
    return getLocal<AccaPaper[]>(STORAGE_KEYS.PAPERS, ACCA_PAPERS).sort((a, b) => a.order - b.order);
  },

  async getPaperById(id: string): Promise<AccaPaper | undefined> {
    const papers = await this.getPapers();
    return papers.find((p) => p.id.toLowerCase() === id.toLowerCase());
  },

  async updatePaper(id: string, updates: Partial<AccaPaper>): Promise<void> {
    if (isFirebaseConfigured() && firestore) {
      try {
        await updateDoc(doc(firestore, 'papers', id), updates);
      } catch (err) {
        console.warn('Firestore updatePaper fallback:', err);
      }
    }
    const papers = getLocal<AccaPaper[]>(STORAGE_KEYS.PAPERS, ACCA_PAPERS);
    const idx = papers.findIndex((p) => p.id === id);
    if (idx !== -1) {
      papers[idx] = { ...papers[idx], ...updates };
      setLocal(STORAGE_KEYS.PAPERS, papers);
    }
  },

  // --- TOPICS ---
  async getTopics(paperId: string): Promise<Topic[]> {
    if (isFirebaseConfigured() && firestore) {
      try {
        const q = query(
          collection(firestore, 'topics'),
          where('paperId', '==', paperId),
          orderBy('order', 'asc')
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          return snap.docs.map((d) => d.data() as Topic);
        }
      } catch (err) {
        console.warn('Firestore getTopics fallback:', err);
      }
    }
    const allTopics = getLocal<Topic[]>(STORAGE_KEYS.TOPICS, FA1_TOPICS);
    return allTopics
      .filter((t) => t.paperId.toLowerCase() === paperId.toLowerCase())
      .sort((a, b) => a.order - b.order);
  },

  async getTopicById(topicId: string): Promise<Topic | undefined> {
    const allTopics = getLocal<Topic[]>(STORAGE_KEYS.TOPICS, FA1_TOPICS);
    return allTopics.find((t) => t.id === topicId);
  },

  async addTopic(topic: Topic): Promise<void> {
    if (isFirebaseConfigured() && firestore) {
      try {
        await setDoc(doc(firestore, 'topics', topic.id), topic);
      } catch (err) {
        console.warn('Firestore addTopic fallback:', err);
      }
    }
    const topics = getLocal<Topic[]>(STORAGE_KEYS.TOPICS, FA1_TOPICS);
    topics.push(topic);
    setLocal(STORAGE_KEYS.TOPICS, topics);
  },

  async updateTopic(topicId: string, updates: Partial<Topic>): Promise<void> {
    if (isFirebaseConfigured() && firestore) {
      try {
        await updateDoc(doc(firestore, 'topics', topicId), updates);
      } catch (err) {
        console.warn('Firestore updateTopic fallback:', err);
      }
    }
    const topics = getLocal<Topic[]>(STORAGE_KEYS.TOPICS, FA1_TOPICS);
    const idx = topics.findIndex((t) => t.id === topicId);
    if (idx !== -1) {
      topics[idx] = { ...topics[idx], ...updates };
      setLocal(STORAGE_KEYS.TOPICS, topics);
    }
  },

  async deleteTopic(topicId: string): Promise<void> {
    if (isFirebaseConfigured() && firestore) {
      try {
        await deleteDoc(doc(firestore, 'topics', topicId));
      } catch (err) {
        console.warn('Firestore deleteTopic fallback:', err);
      }
    }
    const topics = getLocal<Topic[]>(STORAGE_KEYS.TOPICS, FA1_TOPICS);
    setLocal(
      STORAGE_KEYS.TOPICS,
      topics.filter((t) => t.id !== topicId)
    );
  },

  // --- QUESTIONS ---
  async getQuestions(
    paperId?: string,
    topicId?: string,
    includeAnswers: boolean = false
  ): Promise<Question[]> {
    if (isFirebaseConfigured() && firestore) {
      try {
        let q = collection(firestore, 'questions') as any;
        if (paperId && topicId) {
          q = query(
            collection(firestore, 'questions'),
            where('paperId', '==', paperId),
            where('topicId', '==', topicId)
          );
        } else if (paperId) {
          q = query(collection(firestore, 'questions'), where('paperId', '==', paperId));
        }
        const snap = await getDocs(q);
        if (!snap.empty) {
          const publicQuestions = snap.docs.map((d) => {
            const data = d.data() as Question;
            // Ensure answers are strictly sanitized unless admin request
            if (!includeAnswers) {
              return {
                ...data,
                correctOptionId: '',
                explanation: '',
              };
            }
            return data;
          });

          // If admin requested full answer data, merge from question_answers collection
          if (includeAnswers) {
            const answerSnaps = await getDocs(collection(firestore, 'question_answers'));
            const answerMap = new Map<string, { correctOptionId: string; explanation: string }>();
            answerSnaps.forEach((docSnap) => {
              const ansData = docSnap.data();
              answerMap.set(docSnap.id, {
                correctOptionId: ansData.correctOptionId || '',
                explanation: ansData.explanation || '',
              });
            });

            return publicQuestions.map((pq) => {
              const ans = answerMap.get(pq.id);
              return ans
                ? { ...pq, correctOptionId: ans.correctOptionId, explanation: ans.explanation }
                : pq;
            });
          }

          return publicQuestions;
        }
      } catch (err) {
        console.warn('Firestore getQuestions fallback:', err);
      }
    }

    let questions = getLocal<Question[]>(STORAGE_KEYS.QUESTIONS, SAMPLE_FA1_QUESTIONS);
    if (paperId) {
      questions = questions.filter((q) => q.paperId.toLowerCase() === paperId.toLowerCase());
    }
    if (topicId) {
      questions = questions.filter((q) => q.topicId.toLowerCase() === topicId.toLowerCase());
    }

    if (!includeAnswers) {
      // In student practice/exam mode, strip out correct answer keys from question list
      return questions.map((q) => ({
        ...q,
        correctOptionId: '',
        explanation: '',
      }));
    }

    return questions;
  },

  async getQuestionById(id: string, includeAnswers: boolean = false): Promise<Question | undefined> {
    const questions = await this.getQuestions(undefined, undefined, includeAnswers);
    return questions.find((q) => q.id === id);
  },

  async addQuestion(question: Question): Promise<void> {
    if (isFirebaseConfigured() && firestore) {
      try {
        // Separate public question data from private answer data
        const { correctOptionId, explanation, ...publicData } = question;
        await setDoc(doc(firestore, 'questions', question.id), publicData);
        await setDoc(doc(firestore, 'question_answers', question.id), {
          questionId: question.id,
          correctOptionId: correctOptionId || 'A',
          explanation: explanation || '',
          updatedAt: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Firestore addQuestion fallback:', err);
      }
    }
    const questions = getLocal<Question[]>(STORAGE_KEYS.QUESTIONS, SAMPLE_FA1_QUESTIONS);
    questions.push(question);
    setLocal(STORAGE_KEYS.QUESTIONS, questions);
  },

  async updateQuestion(id: string, updates: Partial<Question>): Promise<void> {
    if (isFirebaseConfigured() && firestore) {
      try {
        const publicUpdates: any = { ...updates };
        delete publicUpdates.correctOptionId;
        delete publicUpdates.explanation;

        if (Object.keys(publicUpdates).length > 0) {
          await updateDoc(doc(firestore, 'questions', id), publicUpdates);
        }

        if (updates.correctOptionId !== undefined || updates.explanation !== undefined) {
          const ansUpdates: any = { updatedAt: new Date().toISOString() };
          if (updates.correctOptionId !== undefined) ansUpdates.correctOptionId = updates.correctOptionId;
          if (updates.explanation !== undefined) ansUpdates.explanation = updates.explanation;
          await setDoc(doc(firestore, 'question_answers', id), ansUpdates, { merge: true });
        }
      } catch (err) {
        console.warn('Firestore updateQuestion fallback:', err);
      }
    }
    const questions = getLocal<Question[]>(STORAGE_KEYS.QUESTIONS, SAMPLE_FA1_QUESTIONS);
    const idx = questions.findIndex((q) => q.id === id);
    if (idx !== -1) {
      questions[idx] = { ...questions[idx], ...updates };
      setLocal(STORAGE_KEYS.QUESTIONS, questions);
    }
  },

  async deleteQuestion(id: string): Promise<void> {
    if (isFirebaseConfigured() && firestore) {
      try {
        await Promise.all([
          deleteDoc(doc(firestore, 'questions', id)),
          deleteDoc(doc(firestore, 'question_answers', id)),
        ]);
      } catch (err) {
        console.warn('Firestore deleteQuestion fallback:', err);
      }
    }
    const questions = getLocal<Question[]>(STORAGE_KEYS.QUESTIONS, SAMPLE_FA1_QUESTIONS);
    setLocal(
      STORAGE_KEYS.QUESTIONS,
      questions.filter((q) => q.id !== id)
    );
  },

  async importQuestions(newQuestions: Question[]): Promise<number> {
    if (isFirebaseConfigured() && firestore) {
      for (const q of newQuestions) {
        try {
          const { correctOptionId, explanation, ...publicData } = q;
          await setDoc(doc(firestore, 'questions', q.id), publicData);
          await setDoc(doc(firestore, 'question_answers', q.id), {
            questionId: q.id,
            correctOptionId: correctOptionId || 'A',
            explanation: explanation || '',
            updatedAt: new Date().toISOString(),
          });
        } catch (err) {
          console.warn('Firestore batch question import item error:', err);
        }
      }
    }
    const questions = getLocal<Question[]>(STORAGE_KEYS.QUESTIONS, SAMPLE_FA1_QUESTIONS);
    const existingIds = new Set(questions.map((q) => q.id));
    let addedCount = 0;
    for (const q of newQuestions) {
      if (!existingIds.has(q.id)) {
        questions.push(q);
        addedCount++;
      } else {
        const idx = questions.findIndex((item) => item.id === q.id);
        questions[idx] = q;
      }
    }
    setLocal(STORAGE_KEYS.QUESTIONS, questions);
    return addedCount;
  },

  // --- SECURE MCQ ANSWER VERIFICATION & PRACTICE ATTEMPTS ---
  async verifyAndRecordQuestionAttempt(input: {
    userId: string;
    paperId: string;
    topicId: string;
    questionId: string;
    selectedOptionId: string;
    timeSpentSeconds: number;
    mode: 'practice' | 'mock_exam';
  }): Promise<{ isCorrect: boolean; correctOptionId: string; explanation: string }> {
    const attemptId = `${input.userId}_${input.questionId}`;
    let isCorrect = false;
    let correctOptionId = 'A';
    let explanation = '';

    // First, locate the authentic correct answer
    if (isFirebaseConfigured() && firestore) {
      try {
        // Record the attempt first to satisfy the exists() security rule
        const initialAttempt: QuestionAttempt = {
          id: attemptId,
          userId: input.userId,
          paperId: input.paperId,
          topicId: input.topicId,
          questionId: input.questionId,
          selectedOptionId: input.selectedOptionId,
          isCorrect: false, // will update once evaluated
          timeSpentSeconds: input.timeSpentSeconds,
          timestamp: new Date().toISOString(),
          mode: input.mode,
        };
        await setDoc(doc(firestore, 'question_attempts', attemptId), initialAttempt);

        // Fetch answer document (permitted now that question_attempts doc exists)
        const ansSnap = await getDoc(doc(firestore, 'question_answers', input.questionId));
        if (ansSnap.exists()) {
          const ansData = ansSnap.data();
          correctOptionId = ansData.correctOptionId;
          explanation = ansData.explanation || '';
          isCorrect = input.selectedOptionId.toUpperCase() === correctOptionId.toUpperCase();

          // Update attempt with final verified result
          await updateDoc(doc(firestore, 'question_attempts', attemptId), { isCorrect });
        }
      } catch (err) {
        console.warn('Firestore verifyAndRecordQuestionAttempt fallback:', err);
      }
    }

    // Local / fallback matching if offline or not found
    if (!explanation) {
      const allLocal = getLocal<Question[]>(STORAGE_KEYS.QUESTIONS, SAMPLE_FA1_QUESTIONS);
      const matched = allLocal.find((q) => q.id === input.questionId);
      if (matched) {
        correctOptionId = matched.correctOptionId;
        explanation = matched.explanation;
        isCorrect = input.selectedOptionId.toUpperCase() === correctOptionId.toUpperCase();
      }
    }

    // Persist locally for session consistency
    const attempt: QuestionAttempt = {
      id: attemptId,
      userId: input.userId,
      paperId: input.paperId,
      topicId: input.topicId,
      questionId: input.questionId,
      selectedOptionId: input.selectedOptionId,
      isCorrect,
      timeSpentSeconds: input.timeSpentSeconds,
      timestamp: new Date().toISOString(),
      mode: input.mode,
    };
    const attempts = getLocal<QuestionAttempt[]>(STORAGE_KEYS.QUESTION_ATTEMPTS, []);
    const existingIdx = attempts.findIndex((a) => a.id === attemptId);
    if (existingIdx !== -1) {
      attempts[existingIdx] = attempt;
    } else {
      attempts.push(attempt);
    }
    setLocal(STORAGE_KEYS.QUESTION_ATTEMPTS, attempts);

    return { isCorrect, correctOptionId, explanation };
  },

  // --- QUESTION ATTEMPTS ---
  async recordQuestionAttempt(attempt: QuestionAttempt): Promise<void> {
    if (isFirebaseConfigured() && firestore) {
      try {
        await setDoc(doc(firestore, 'question_attempts', attempt.id), attempt);
      } catch (err) {
        console.warn('Firestore recordQuestionAttempt fallback:', err);
      }
    }
    const attempts = getLocal<QuestionAttempt[]>(STORAGE_KEYS.QUESTION_ATTEMPTS, []);
    attempts.push(attempt);
    setLocal(STORAGE_KEYS.QUESTION_ATTEMPTS, attempts);
  },

  async getUserQuestionAttempts(userId: string, paperId?: string): Promise<QuestionAttempt[]> {
    if (isFirebaseConfigured() && firestore) {
      try {
        let q = query(
          collection(firestore, 'question_attempts'),
          where('userId', '==', userId),
          orderBy('timestamp', 'desc')
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          const list = snap.docs.map((d) => d.data() as QuestionAttempt);
          return paperId ? list.filter((a) => a.paperId === paperId) : list;
        }
      } catch (err) {
        console.warn('Firestore getUserQuestionAttempts fallback:', err);
      }
    }
    const all = getLocal<QuestionAttempt[]>(STORAGE_KEYS.QUESTION_ATTEMPTS, []);
    return all
      .filter((a) => a.userId === userId && (!paperId || a.paperId === paperId))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },

  // --- SAVED QUESTIONS ---
  async getSavedQuestions(userId: string, paperId?: string): Promise<SavedQuestion[]> {
    if (isFirebaseConfigured() && firestore) {
      try {
        const q = query(collection(firestore, 'saved_questions'), where('userId', '==', userId));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const list = snap.docs.map((d) => d.data() as SavedQuestion);
          return paperId ? list.filter((s) => s.paperId === paperId) : list;
        }
      } catch (err) {
        console.warn('Firestore getSavedQuestions fallback:', err);
      }
    }
    const list = getLocal<SavedQuestion[]>(STORAGE_KEYS.SAVED_QUESTIONS, []);
    return list.filter((s) => s.userId === userId && (!paperId || s.paperId === paperId));
  },

  async saveQuestion(saved: SavedQuestion): Promise<void> {
    if (isFirebaseConfigured() && firestore) {
      try {
        await setDoc(doc(firestore, 'saved_questions', saved.id), saved);
      } catch (err) {
        console.warn('Firestore saveQuestion fallback:', err);
      }
    }
    const list = getLocal<SavedQuestion[]>(STORAGE_KEYS.SAVED_QUESTIONS, []);
    if (!list.some((s) => s.userId === saved.userId && s.questionId === saved.questionId)) {
      list.push(saved);
      setLocal(STORAGE_KEYS.SAVED_QUESTIONS, list);
    }
  },

  async removeSavedQuestion(userId: string, questionId: string): Promise<void> {
    const list = getLocal<SavedQuestion[]>(STORAGE_KEYS.SAVED_QUESTIONS, []);
    const target = list.find((s) => s.userId === userId && s.questionId === questionId);
    if (target && isFirebaseConfigured() && firestore) {
      try {
        await deleteDoc(doc(firestore, 'saved_questions', target.id));
      } catch (err) {
        console.warn('Firestore removeSavedQuestion fallback:', err);
      }
    }
    setLocal(
      STORAGE_KEYS.SAVED_QUESTIONS,
      list.filter((s) => !(s.userId === userId && s.questionId === questionId))
    );
  },

  async isQuestionSaved(userId: string, questionId: string): Promise<boolean> {
    const list = await this.getSavedQuestions(userId);
    return list.some((s) => s.questionId === questionId);
  },

  // --- MOCK EXAMS ---
  async getMockExams(paperId?: string): Promise<MockExam[]> {
    if (isFirebaseConfigured() && firestore) {
      try {
        let q = collection(firestore, 'mock_exams') as any;
        if (paperId) {
          q = query(collection(firestore, 'mock_exams'), where('paperId', '==', paperId));
        }
        const snap = await getDocs(q);
        if (!snap.empty) {
          return snap.docs.map((d) => d.data() as MockExam);
        }
      } catch (err) {
        console.warn('Firestore getMockExams fallback:', err);
      }
    }
    const exams = getLocal<MockExam[]>(STORAGE_KEYS.MOCK_EXAMS, SAMPLE_MOCK_EXAMS);
    return paperId ? exams.filter((e) => e.paperId === paperId) : exams;
  },

  async getMockExamById(id: string): Promise<MockExam | undefined> {
    const exams = await this.getMockExams();
    return exams.find((e) => e.id === id);
  },

  async addMockExam(exam: MockExam): Promise<void> {
    if (isFirebaseConfigured() && firestore) {
      try {
        await setDoc(doc(firestore, 'mock_exams', exam.id), exam);
      } catch (err) {
        console.warn('Firestore addMockExam fallback:', err);
      }
    }
    const exams = getLocal<MockExam[]>(STORAGE_KEYS.MOCK_EXAMS, SAMPLE_MOCK_EXAMS);
    exams.push(exam);
    setLocal(STORAGE_KEYS.MOCK_EXAMS, exams);
  },

  async updateMockExam(id: string, updates: Partial<MockExam>): Promise<void> {
    if (isFirebaseConfigured() && firestore) {
      try {
        await updateDoc(doc(firestore, 'mock_exams', id), updates);
      } catch (err) {
        console.warn('Firestore updateMockExam fallback:', err);
      }
    }
    const exams = getLocal<MockExam[]>(STORAGE_KEYS.MOCK_EXAMS, SAMPLE_MOCK_EXAMS);
    const idx = exams.findIndex((e) => e.id === id);
    if (idx !== -1) {
      exams[idx] = { ...exams[idx], ...updates };
      setLocal(STORAGE_KEYS.MOCK_EXAMS, exams);
    }
  },

  // --- EXAM ATTEMPTS ---
  async recordExamAttempt(attempt: ExamAttempt): Promise<void> {
    if (isFirebaseConfigured() && firestore) {
      try {
        await setDoc(doc(firestore, 'exam_attempts', attempt.id), attempt);
      } catch (err) {
        console.warn('Firestore recordExamAttempt fallback:', err);
      }
    }
    const list = getLocal<ExamAttempt[]>(STORAGE_KEYS.EXAM_ATTEMPTS, []);
    const idx = list.findIndex((a) => a.id === attempt.id);
    if (idx !== -1) {
      list[idx] = attempt;
    } else {
      list.push(attempt);
    }
    setLocal(STORAGE_KEYS.EXAM_ATTEMPTS, list);
  },

  async scoreAndRecordExamAttempt(input: {
    id: string;
    userId: string;
    mockExamId: string;
    paperId: string;
    examTitle: string;
    startedAt: string;
    durationMinutes: number;
    timeSpentSeconds: number;
    totalQuestions: number;
    passPercentage: number;
    answers: Record<string, string>;
    markedForReview: string[];
    status: 'submitted' | 'timed_out';
  }): Promise<ExamAttempt> {
    const fullQuestions = await this.getQuestions(input.paperId, undefined, true);
    const qMap = new Map(fullQuestions.map((q) => [q.id, q]));

    let obtainedMarks = 0;
    let totalMarks = 0;

    fullQuestions.forEach((q) => {
      totalMarks += q.marks;
      const studentAns = input.answers[q.id];
      if (studentAns && studentAns.toUpperCase() === q.correctOptionId?.toUpperCase()) {
        obtainedMarks += q.marks;
      }
    });

    const percentage = totalMarks > 0 ? Math.round((obtainedMarks / totalMarks) * 100) : 0;
    const isPassed = percentage >= input.passPercentage;

    const attemptRecord: ExamAttempt = {
      id: input.id,
      userId: input.userId,
      mockExamId: input.mockExamId,
      paperId: input.paperId,
      examTitle: input.examTitle,
      startedAt: input.startedAt,
      submittedAt: new Date().toISOString(),
      durationMinutes: input.durationMinutes,
      timeSpentSeconds: input.timeSpentSeconds,
      totalQuestions: input.totalQuestions,
      totalMarks,
      obtainedMarks,
      percentage,
      isPassed,
      answers: input.answers,
      markedForReview: input.markedForReview,
      status: input.status,
    };

    await this.recordExamAttempt(attemptRecord);
    return attemptRecord;
  },

  async getUserExamAttempts(userId: string, paperId?: string): Promise<ExamAttempt[]> {
    if (isFirebaseConfigured() && firestore) {
      try {
        const q = query(
          collection(firestore, 'exam_attempts'),
          where('userId', '==', userId),
          orderBy('startedAt', 'desc')
        );
        const snap = await getDocs(q);
        if (!snap.empty) {
          const list = snap.docs.map((d) => d.data() as ExamAttempt);
          return paperId ? list.filter((a) => a.paperId === paperId) : list;
        }
      } catch (err) {
        console.warn('Firestore getUserExamAttempts fallback:', err);
      }
    }
    const all = getLocal<ExamAttempt[]>(STORAGE_KEYS.EXAM_ATTEMPTS, []);
    return all
      .filter((a) => a.userId === userId && (!paperId || a.paperId === paperId))
      .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
  },

  async getExamAttemptById(attemptId: string): Promise<ExamAttempt | undefined> {
    if (isFirebaseConfigured() && firestore) {
      try {
        const snap = await getDoc(doc(firestore, 'exam_attempts', attemptId));
        if (snap.exists()) {
          return snap.data() as ExamAttempt;
        }
      } catch (err) {
        console.warn('Firestore getExamAttemptById fallback:', err);
      }
    }
    const list = getLocal<ExamAttempt[]>(STORAGE_KEYS.EXAM_ATTEMPTS, []);
    return list.find((a) => a.id === attemptId);
  },

  async getQuestionsForReview(paperId: string, attemptId: string): Promise<Question[]> {
    const attempt = await this.getExamAttemptById(attemptId);
    if (!attempt || (attempt.status !== 'submitted' && attempt.status !== 'timed_out')) {
      return this.getQuestions(paperId, undefined, false);
    }
    return this.getQuestions(paperId, undefined, true);
  },

  // --- LEADERBOARD ---
  async getLeaderboard(paperId?: string): Promise<LeaderboardEntry[]> {
    const users = getLocal<UserProfile[]>(STORAGE_KEYS.USERS, []);
    const examAttempts = getLocal<ExamAttempt[]>(STORAGE_KEYS.EXAM_ATTEMPTS, []);
    const qAttempts = getLocal<QuestionAttempt[]>(STORAGE_KEYS.QUESTION_ATTEMPTS, []);

    const eligibleUsers = users.filter((u) => u.leaderboardOptIn !== false && u.status === 'active');

    const leaderboard: LeaderboardEntry[] = eligibleUsers.map((user) => {
      const userExams = examAttempts.filter(
        (ea) => ea.userId === user.uid && ea.status === 'submitted' && (!paperId || ea.paperId === paperId)
      );
      const userQAttempts = qAttempts.filter(
        (qa) => qa.userId === user.uid && (!paperId || qa.paperId === paperId)
      );

      const correctQ = userQAttempts.filter((q) => q.isCorrect).length;
      const totalQ = userQAttempts.length;

      // Points formula: 10 pts per correct MCQ + 50 pts per passed Mock Exam + obtained exam marks
      let points = correctQ * 10;
      let totalExamMarks = 0;
      userExams.forEach((e) => {
        totalExamMarks += e.obtainedMarks;
        if (e.isPassed) points += 50;
      });
      points += totalExamMarks;

      const avgScore = userExams.length > 0
        ? Math.round(userExams.reduce((acc, curr) => acc + curr.percentage, 0) / userExams.length)
        : totalQ > 0 ? Math.round((correctQ / totalQ) * 100) : 0;

      return {
        userId: user.uid,
        displayName: user.displayName || 'ACCA Scholar',
        photoURL: user.photoURL,
        totalPoints: points,
        completedExams: userExams.length,
        averageScore: avgScore,
        totalQuestionsAttempted: totalQ,
        correctAnswers: correctQ,
        lastActive: user.updatedAt || user.createdAt,
      };
    });

    // Sort descending by points, then by average score
    leaderboard.sort((a, b) => b.totalPoints - a.totalPoints || b.averageScore - a.averageScore);

    return leaderboard.map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));
  },

  // --- LEARNING RESOURCES ---
  async getResources(paperId?: string, category?: string): Promise<LearningResource[]> {
    if (isFirebaseConfigured() && firestore) {
      try {
        const snap = await getDocs(collection(firestore, 'resources'));
        if (!snap.empty) {
          let list = snap.docs.map((d) => d.data() as LearningResource);
          if (paperId) list = list.filter((r) => r.paperId === paperId);
          if (category) list = list.filter((r) => r.category === category);
          return list;
        }
      } catch (err) {
        console.warn('Firestore getResources fallback:', err);
      }
    }
    let list = getLocal<LearningResource[]>(STORAGE_KEYS.RESOURCES, SAMPLE_RESOURCES);
    if (paperId) list = list.filter((r) => r.paperId === paperId);
    if (category) list = list.filter((r) => r.category === category);
    return list;
  },

  async addResource(resource: LearningResource): Promise<void> {
    if (isFirebaseConfigured() && firestore) {
      try {
        await setDoc(doc(firestore, 'resources', resource.id), resource);
      } catch (err) {
        console.warn('Firestore addResource fallback:', err);
      }
    }
    const list = getLocal<LearningResource[]>(STORAGE_KEYS.RESOURCES, SAMPLE_RESOURCES);
    list.push(resource);
    setLocal(STORAGE_KEYS.RESOURCES, list);
  },

  async updateResource(id: string, updates: Partial<LearningResource>): Promise<void> {
    if (isFirebaseConfigured() && firestore) {
      try {
        await updateDoc(doc(firestore, 'resources', id), updates);
      } catch (err) {
        console.warn('Firestore updateResource fallback:', err);
      }
    }
    const list = getLocal<LearningResource[]>(STORAGE_KEYS.RESOURCES, SAMPLE_RESOURCES);
    const idx = list.findIndex((r) => r.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates };
      setLocal(STORAGE_KEYS.RESOURCES, list);
    }
  },

  async deleteResource(id: string): Promise<void> {
    if (isFirebaseConfigured() && firestore) {
      try {
        await deleteDoc(doc(firestore, 'resources', id));
      } catch (err) {
        console.warn('Firestore deleteResource fallback:', err);
      }
    }
    const list = getLocal<LearningResource[]>(STORAGE_KEYS.RESOURCES, SAMPLE_RESOURCES);
    setLocal(
      STORAGE_KEYS.RESOURCES,
      list.filter((r) => r.id !== id)
    );
  },

  // --- ANNOUNCEMENTS ---
  async getAnnouncements(): Promise<Announcement[]> {
    if (isFirebaseConfigured() && firestore) {
      try {
        const snap = await getDocs(collection(firestore, 'announcements'));
        if (!snap.empty) {
          return snap.docs
            .map((d) => d.data() as Announcement)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        }
      } catch (err) {
        console.warn('Firestore getAnnouncements fallback:', err);
      }
    }
    return getLocal<Announcement[]>(STORAGE_KEYS.ANNOUNCEMENTS, SAMPLE_ANNOUNCEMENTS).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  async addAnnouncement(announcement: Announcement): Promise<void> {
    if (isFirebaseConfigured() && firestore) {
      try {
        await setDoc(doc(firestore, 'announcements', announcement.id), announcement);
      } catch (err) {
        console.warn('Firestore addAnnouncement fallback:', err);
      }
    }
    const list = getLocal<Announcement[]>(STORAGE_KEYS.ANNOUNCEMENTS, SAMPLE_ANNOUNCEMENTS);
    list.unshift(announcement);
    setLocal(STORAGE_KEYS.ANNOUNCEMENTS, list);
  },

  async updateAnnouncement(id: string, updates: Partial<Announcement>): Promise<void> {
    if (isFirebaseConfigured() && firestore) {
      try {
        await updateDoc(doc(firestore, 'announcements', id), updates);
      } catch (err) {
        console.warn('Firestore updateAnnouncement fallback:', err);
      }
    }
    const list = getLocal<Announcement[]>(STORAGE_KEYS.ANNOUNCEMENTS, SAMPLE_ANNOUNCEMENTS);
    const idx = list.findIndex((a) => a.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates };
      setLocal(STORAGE_KEYS.ANNOUNCEMENTS, list);
    }
  },

  // --- USERS MANAGEMENT (Admin) ---
  async getAllUsers(): Promise<UserProfile[]> {
    if (isFirebaseConfigured() && firestore) {
      try {
        const snap = await getDocs(collection(firestore, 'users'));
        if (!snap.empty) {
          return snap.docs.map((d) => d.data() as UserProfile);
        }
      } catch (err) {
        console.warn('Firestore getAllUsers fallback:', err);
      }
    }
    return getLocal<UserProfile[]>(STORAGE_KEYS.USERS, []);
  },

  async updateUserStatus(uid: string, status: 'active' | 'inactive'): Promise<void> {
    if (isFirebaseConfigured() && firestore) {
      try {
        await updateDoc(doc(firestore, 'users', uid), { status });
      } catch (err) {
        console.warn('Firestore updateUserStatus fallback:', err);
      }
    }
    const users = getLocal<UserProfile[]>(STORAGE_KEYS.USERS, []);
    const idx = users.findIndex((u) => u.uid === uid);
    if (idx !== -1) {
      users[idx].status = status;
      users[idx].updatedAt = new Date().toISOString();
      setLocal(STORAGE_KEYS.USERS, users);
    }
  },

  async updateUserProfile(uid: string, updates: Partial<UserProfile>): Promise<void> {
    if (isFirebaseConfigured() && firestore) {
      try {
        await updateDoc(doc(firestore, 'users', uid), updates);
      } catch (err) {
        console.warn('Firestore updateUserProfile fallback:', err);
      }
    }
    const users = getLocal<UserProfile[]>(STORAGE_KEYS.USERS, []);
    const idx = users.findIndex((u) => u.uid === uid);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updates, updatedAt: new Date().toISOString() };
      setLocal(STORAGE_KEYS.USERS, users);
    }
  },
};
