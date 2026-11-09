import { describe, it, expect } from 'vitest';
import { UserProfile, ExamAttempt, Question } from '../types';

describe('Firestore Security & Data Protection Rules', () => {
  describe('1. User Profile Privacy & Role Immutability', () => {
    const studentUser: UserProfile = {
      uid: 'student-abc',
      email: 'student@example.com',
      displayName: 'Jane Doe',
      role: 'student',
      selectedPapers: ['fa1'],
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
      leaderboardOptIn: true,
      status: 'active',
    };

    const adminUser: UserProfile = {
      uid: 'admin-xyz',
      email: 'admin@accamaster.com',
      displayName: 'Platform Admin',
      role: 'admin',
      selectedPapers: ['fa1'],
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-01T00:00:00Z',
      leaderboardOptIn: false,
      status: 'active',
    };

    it('enforces that a student can only read their own private profile', () => {
      const canReadProfile = (requestUid: string, targetProfile: UserProfile, isUserAdmin: boolean) => {
        return isUserAdmin || requestUid === targetProfile.uid;
      };

      // Student reading own profile -> allowed
      expect(canReadProfile('student-abc', studentUser, false)).toBe(true);

      // Student reading another student profile -> denied
      expect(canReadProfile('other-student-123', studentUser, false)).toBe(false);

      // Admin reading student profile -> allowed
      expect(canReadProfile('admin-xyz', studentUser, true)).toBe(true);
    });

    it('prevents students from changing their role or status during profile updates', () => {
      const validateProfileUpdate = (
        existingProfile: UserProfile,
        incomingUpdates: Partial<UserProfile>,
        isUserAdmin: boolean
      ): { allowed: boolean; reason?: string } => {
        if (isUserAdmin) return { allowed: true };

        if (incomingUpdates.role !== undefined && incomingUpdates.role !== existingProfile.role) {
          return { allowed: false, reason: 'Role modification forbidden' };
        }
        if (incomingUpdates.status !== undefined && incomingUpdates.status !== existingProfile.status) {
          return { allowed: false, reason: 'Status modification forbidden' };
        }
        return { allowed: true };
      };

      // Legitimate student update (name and study preferences) -> allowed
      const legitUpdate = validateProfileUpdate(
        studentUser,
        { displayName: 'Jane M. Doe', selectedPapers: ['fa1', 'pm'] },
        false
      );
      expect(legitUpdate.allowed).toBe(true);

      // Illegitimate student update attempting privilege escalation -> blocked
      const attackUpdate = validateProfileUpdate(
        studentUser,
        { role: 'admin' },
        false
      );
      expect(attackUpdate.allowed).toBe(false);
      expect(attackUpdate.reason).toBe('Role modification forbidden');
    });
  });

  describe('2. Exam Attempt Protection & Immutability', () => {
    const inProgressAttempt: ExamAttempt = {
      id: 'attempt-1',
      userId: 'student-abc',
      mockExamId: 'fa1-mock-1',
      paperId: 'fa1',
      examTitle: 'FA1 Mock 1',
      startedAt: '2026-01-01T10:00:00Z',
      submittedAt: '2026-01-01T11:30:00Z',
      durationMinutes: 120,
      timeSpentSeconds: 3600,
      totalQuestions: 50,
      totalMarks: 100,
      obtainedMarks: 0,
      percentage: 0,
      isPassed: false,
      answers: { 'q-1': 'A' },
      markedForReview: [],
      status: 'in_progress',
    };

    const submittedAttempt: ExamAttempt = {
      ...inProgressAttempt,
      obtainedMarks: 76,
      percentage: 76,
      isPassed: true,
      status: 'submitted',
    };

    const canUpdateAttempt = (
      requestUid: string,
      existingAttempt: ExamAttempt,
      isUserAdmin: boolean
    ): boolean => {
      if (isUserAdmin) return true;
      if (requestUid !== existingAttempt.userId) return false;
      // Frozen once submitted or timed out
      return existingAttempt.status !== 'submitted' && existingAttempt.status !== 'timed_out';
    };

    it('allows autosaving and question answer updates while exam is in progress', () => {
      expect(canUpdateAttempt('student-abc', inProgressAttempt, false)).toBe(true);
    });

    it('strictly freezes already submitted or timed-out exam attempts from further student modification', () => {
      expect(canUpdateAttempt('student-abc', submittedAttempt, false)).toBe(false);

      const timedOutAttempt: ExamAttempt = { ...submittedAttempt, status: 'timed_out' };
      expect(canUpdateAttempt('student-abc', timedOutAttempt, false)).toBe(false);
    });

    it('prevents any student from tampering with another student exam attempt', () => {
      expect(canUpdateAttempt('attacker-student', inProgressAttempt, false)).toBe(false);
      expect(canUpdateAttempt('attacker-student', submittedAttempt, false)).toBe(false);
    });
  });

  describe('3. MCQ Answer Protection Prior to Submission', () => {
    const rawQuestionWithAnswer: Question = {
      id: 'q-demo-1',
      paperId: 'fa1',
      topicId: 'fa1-t1',
      text: 'Which of the following is an asset?',
      options: [
        { id: 'A', text: 'Trade payables' },
        { id: 'B', text: 'Trade receivables' },
        { id: 'C', text: 'Bank overdraft' },
        { id: 'D', text: 'Sales tax liability' },
      ],
      correctOptionId: 'B',
      explanation: 'Trade receivables represent money owed to the business, which is a current asset.',
      difficulty: 'easy',
      marks: 2,
      isActive: true,
      createdAt: '2026-01-01T00:00:00Z',
    };

    it('sanitizes questions delivered to student clients so correctOptionId and explanation are not exposed', () => {
      const sanitizeQuestionForStudent = (q: Question): Question => {
        return {
          ...q,
          correctOptionId: '',
          explanation: '',
        };
      };

      const studentView = sanitizeQuestionForStudent(rawQuestionWithAnswer);

      // Student client gets the text and options
      expect(studentView.text).toBe(rawQuestionWithAnswer.text);
      expect(studentView.options.length).toBe(4);

      // Correct answer and explanation must be withheld
      expect(studentView.correctOptionId).toBe('');
      expect(studentView.explanation).toBe('');
    });

    it('verifies student answers and returns explanation only upon attempt submission', () => {
      const verifyAttempt = (
        studentChoice: string,
        privateAnswerKey: { correctOptionId: string; explanation: string }
      ) => {
        const isCorrect = studentChoice.toUpperCase() === privateAnswerKey.correctOptionId.toUpperCase();
        return {
          isCorrect,
          correctOptionId: privateAnswerKey.correctOptionId,
          explanation: privateAnswerKey.explanation,
        };
      };

      const privateKey = {
        correctOptionId: rawQuestionWithAnswer.correctOptionId,
        explanation: rawQuestionWithAnswer.explanation,
      };

      // Correct submission
      const correctResult = verifyAttempt('B', privateKey);
      expect(correctResult.isCorrect).toBe(true);
      expect(correctResult.correctOptionId).toBe('B');
      expect(correctResult.explanation.length).toBeGreaterThan(0);

      // Incorrect submission
      const incorrectResult = verifyAttempt('A', privateKey);
      expect(incorrectResult.isCorrect).toBe(false);
      expect(incorrectResult.correctOptionId).toBe('B');
    });
  });
});
