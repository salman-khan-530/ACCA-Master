import { describe, it, expect } from 'vitest';
import { Question } from '../types';

describe('Admin CSV Duplicate Detection Algorithm', () => {
  const existingQuestions: Question[] = [
    {
      id: 'q-001',
      paperId: 'fa1',
      topicId: 'fa1-t1',
      text: 'What is the accounting equation?',
      options: [
        { id: 'A', text: 'Assets = Capital + Liabilities' },
        { id: 'B', text: 'Assets = Capital - Liabilities' },
      ],
      correctOptionId: 'A',
      explanation: 'Fundamental balance sheet equation.',
      difficulty: 'easy',
      marks: 2,
      isActive: true,
      createdAt: '2026-01-01T00:00:00.000Z',
    },
    {
      id: 'q-002',
      paperId: 'fa1',
      topicId: 'fa1-t2',
      text: 'Which account has a normal debit balance?',
      options: [
        { id: 'A', text: 'Purchases' },
        { id: 'B', text: 'Sales' },
      ],
      correctOptionId: 'A',
      explanation: 'Expenses normally have debit balances.',
      difficulty: 'easy',
      marks: 2,
      isActive: true,
      createdAt: '2026-01-01T00:00:00.000Z',
    },
  ];

  it('detects duplicate ID when incoming question matches existing question ID', () => {
    const incomingId = 'Q-001'; // Case-insensitive test
    const isDuplicate = existingQuestions.some(
      (q) => q.id.toLowerCase() === incomingId.toLowerCase()
    );
    expect(isDuplicate).toBe(true);
  });

  it('allows new unique question ID', () => {
    const incomingId = 'q-003';
    const isDuplicate = existingQuestions.some(
      (q) => q.id.toLowerCase() === incomingId.toLowerCase()
    );
    expect(isDuplicate).toBe(false);
  });

  it('detects duplicate text content across questions', () => {
    const incomingText = ' What is the accounting equation?  '; // Whitespace tolerance test
    const isDuplicateText = existingQuestions.some(
      (q) => q.text.trim().toLowerCase() === incomingText.trim().toLowerCase()
    );
    expect(isDuplicateText).toBe(true);
  });

  it('detects internal duplicate IDs within the same import CSV batch', () => {
    const batch = ['csv-q1', 'csv-q2', 'CSV-Q1'];
    const seen = new Set<string>();
    const duplicates: string[] = [];

    batch.forEach((id) => {
      const lower = id.toLowerCase();
      if (seen.has(lower)) {
        duplicates.push(id);
      }
      seen.add(lower);
    });

    expect(duplicates).toHaveLength(1);
    expect(duplicates[0]).toBe('CSV-Q1');
  });
});

describe('Student Dashboard Progress Calculation', () => {
  it('correctly detects weak topics with accuracy below 60%', () => {
    const attempts = [
      { topicId: 'fa1-t1', isCorrect: false },
      { topicId: 'fa1-t1', isCorrect: false },
      { topicId: 'fa1-t1', isCorrect: true }, // 1/3 = 33% -> weak
      { topicId: 'fa1-t2', isCorrect: true },
      { topicId: 'fa1-t2', isCorrect: true },
      { topicId: 'fa1-t2', isCorrect: true }, // 3/3 = 100% -> strong
    ];

    const stats: Record<string, { total: number; correct: number }> = {};
    attempts.forEach((a) => {
      if (!stats[a.topicId]) stats[a.topicId] = { total: 0, correct: 0 };
      stats[a.topicId].total += 1;
      if (a.isCorrect) stats[a.topicId].correct += 1;
    });

    const weakTopics = Object.keys(stats).filter((t) => {
      const s = stats[t];
      return s.total >= 2 && s.correct / s.total < 0.6;
    });

    expect(weakTopics).toEqual(['fa1-t1']);
  });
});
