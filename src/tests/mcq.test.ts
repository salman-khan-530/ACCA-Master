import { describe, it, expect } from 'vitest';
import { SAMPLE_FA1_QUESTIONS } from '../data/sampleQuestionsData';
import { FA1_TOPICS } from '../data/fa1TopicsData';

describe('FA1 Question Bank Integrity and Schema', () => {
  it('contains at least 20 comprehensive sample questions as specified', () => {
    expect(SAMPLE_FA1_QUESTIONS.length).toBeGreaterThanOrEqual(20);
  });

  it('ensures every question has exactly 4 options labeled A, B, C, D', () => {
    SAMPLE_FA1_QUESTIONS.forEach((q) => {
      expect(q.options.length).toBe(4);
      const optionIds = q.options.map((o) => o.id);
      expect(optionIds).toEqual(['A', 'B', 'C', 'D']);
      q.options.forEach((opt) => {
        expect(opt.text.trim().length).toBeGreaterThan(0);
      });
    });
  });

  it('ensures correctOptionId matches one of the provided options', () => {
    SAMPLE_FA1_QUESTIONS.forEach((q) => {
      const optionIds = q.options.map((o) => o.id);
      expect(optionIds).toContain(q.correctOptionId);
    });
  });

  it('ensures all questions contain comprehensive explanations', () => {
    SAMPLE_FA1_QUESTIONS.forEach((q) => {
      expect(q.explanation).toBeDefined();
      expect(q.explanation.length).toBeGreaterThan(20);
    });
  });

  it('ensures all questions map to an existing FA1 topic', () => {
    const validTopicIds = new Set(FA1_TOPICS.map((t) => t.id));
    SAMPLE_FA1_QUESTIONS.forEach((q) => {
      expect(validTopicIds.has(q.topicId)).toBe(true);
    });
  });
});
