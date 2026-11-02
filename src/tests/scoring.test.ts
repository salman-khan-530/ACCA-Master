import { describe, it, expect } from 'vitest';
import { Question } from '../types';

describe('Examination Scoring Logic', () => {
  const mockQuestions: Question[] = [
    {
      id: 'q1',
      paperId: 'fa1',
      topicId: 'fa1-t1',
      text: 'Question 1',
      options: [
        { id: 'A', text: 'Opt A' },
        { id: 'B', text: 'Opt B' },
      ],
      correctOptionId: 'B',
      explanation: 'Explanation 1',
      difficulty: 'easy',
      marks: 2,
      isActive: true,
      createdAt: '2026-01-01',
    },
    {
      id: 'q2',
      paperId: 'fa1',
      topicId: 'fa1-t2',
      text: 'Question 2',
      options: [
        { id: 'A', text: 'Opt A' },
        { id: 'B', text: 'Opt B' },
      ],
      correctOptionId: 'A',
      explanation: 'Explanation 2',
      difficulty: 'medium',
      marks: 2,
      isActive: true,
      createdAt: '2026-01-01',
    },
    {
      id: 'q3',
      paperId: 'fa1',
      topicId: 'fa1-t3',
      text: 'Question 3',
      options: [
        { id: 'A', text: 'Opt A' },
        { id: 'B', text: 'Opt B' },
      ],
      correctOptionId: 'B',
      explanation: 'Explanation 3',
      difficulty: 'hard',
      marks: 2,
      isActive: true,
      createdAt: '2026-01-01',
    },
  ];

  it('calculates 100% score when all questions are answered correctly', () => {
    const studentAnswers = {
      q1: 'B',
      q2: 'A',
      q3: 'B',
    };

    let obtainedMarks = 0;
    let totalMarks = 0;

    mockQuestions.forEach((q) => {
      totalMarks += q.marks;
      if (studentAnswers[q.id as keyof typeof studentAnswers] === q.correctOptionId) {
        obtainedMarks += q.marks;
      }
    });

    const percentage = Math.round((obtainedMarks / totalMarks) * 100);
    const isPassed = percentage >= 50;

    expect(totalMarks).toBe(6);
    expect(obtainedMarks).toBe(6);
    expect(percentage).toBe(100);
    expect(isPassed).toBe(true);
  });

  it('calculates passing status correctly at boundary pass mark (50%)', () => {
    // 2 questions with 2 marks each: 1 correct = 2/4 = 50%
    const twoQuestions = mockQuestions.slice(0, 2);
    const answers = { q1: 'B', q2: 'B' }; // q1 correct (B), q2 incorrect (correct is A)

    let obtained = 0;
    let total = 0;
    twoQuestions.forEach((q) => {
      total += q.marks;
      if (answers[q.id as keyof typeof answers] === q.correctOptionId) {
        obtained += q.marks;
      }
    });

    const pct = Math.round((obtained / total) * 100);
    const passed = pct >= 50;

    expect(obtained).toBe(2);
    expect(total).toBe(4);
    expect(pct).toBe(50);
    expect(passed).toBe(true);
  });

  it('correctly marks exam as failed when below 50%', () => {
    const answers = { q1: 'A', q2: 'B', q3: 'A' }; // all wrong

    let obtained = 0;
    let total = 0;
    mockQuestions.forEach((q) => {
      total += q.marks;
      if (answers[q.id as keyof typeof answers] === q.correctOptionId) {
        obtained += q.marks;
      }
    });

    const pct = Math.round((obtained / total) * 100);
    const passed = pct >= 50;

    expect(obtained).toBe(0);
    expect(pct).toBe(0);
    expect(passed).toBe(false);
  });
});
