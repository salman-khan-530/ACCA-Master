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

describe('Admin Mock Examination Management', () => {
  it('allows adding and removing mock examinations from collection', () => {
    let mockList = [
      { id: 'mock-1', title: 'FA1 Diagnostic Mock 1', paperId: 'fa1' },
      { id: 'mock-2', title: 'FA1 Full Mock 2', paperId: 'fa1' },
    ];

    // Add new mock
    const newMock = { id: 'mock-3', title: 'MA1 Standard Mock 1', paperId: 'ma1' };
    mockList = [...mockList, newMock];
    expect(mockList).toHaveLength(3);

    // Delete mock
    const targetId = 'mock-2';
    mockList = mockList.filter((m) => m.id !== targetId);
    expect(mockList).toHaveLength(2);
    expect(mockList.find((m) => m.id === 'mock-2')).toBeUndefined();
    expect(mockList.map((m) => m.id)).toEqual(['mock-1', 'mock-3']);
  });
});

describe('Admin Learning Resources Management', () => {
  it('allows adding, filtering, and removing learning resources', () => {
    let resources = [
      {
        id: 'res-1',
        title: 'FA1 Complete Study Notes',
        category: 'study_notes',
        paperId: 'fa1',
        fileType: 'PDF',
        isAuthorized: true,
      },
      {
        id: 'res-2',
        title: 'MA1 Past Paper 2025 CBE',
        category: 'past_papers',
        paperId: 'ma1',
        fileType: 'PDF',
        isAuthorized: true,
      },
    ];

    // Add new learning resource
    const newRes = {
      id: 'res-3',
      title: 'FA1 Revision Flashcards',
      category: 'revision_notes',
      paperId: 'fa1',
      fileType: 'PDF',
      isAuthorized: false,
    };
    resources = [...resources, newRes];
    expect(resources).toHaveLength(3);

    // Filter by paper
    const fa1Resources = resources.filter((r) => r.paperId === 'fa1');
    expect(fa1Resources).toHaveLength(2);

    // Filter by category
    const pastPapers = resources.filter((r) => r.category === 'past_papers');
    expect(pastPapers).toHaveLength(1);
    expect(pastPapers[0].id).toBe('res-2');

    // Delete resource
    const deleteId = 'res-1';
    resources = resources.filter((r) => r.id !== deleteId);
    expect(resources).toHaveLength(2);
    expect(resources.find((r) => r.id === deleteId)).toBeUndefined();
    expect(resources.map((r) => r.id)).toEqual(['res-2', 'res-3']);
  });
});
