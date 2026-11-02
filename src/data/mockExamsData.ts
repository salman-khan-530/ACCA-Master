import { MockExam } from '../types';

export const SAMPLE_MOCK_EXAMS: MockExam[] = [
  {
    id: 'fa1-mock-1',
    paperId: 'fa1',
    title: 'FA1 Comprehensive Standard Mock Exam 1',
    description: 'Full-scope 20-question timed simulation reflecting standard ACCA CBE (Computer Based Examination) test format covering business docs, double-entry, daybooks, sales tax, payroll, and reconciliations.',
    durationMinutes: 60,
    totalQuestions: 20,
    totalMarks: 40,
    passMarks: 20,
    passPercentage: 50,
    difficulty: 'standard',
    isPublished: true,
    questionIds: [
      'fa1-q01', 'fa1-q02', 'fa1-q03', 'fa1-q04',
      'fa1-q05', 'fa1-q06', 'fa1-q07', 'fa1-q08',
      'fa1-q09', 'fa1-q10', 'fa1-q11', 'fa1-q12',
      'fa1-q13', 'fa1-q14', 'fa1-q15', 'fa1-q16',
      'fa1-q17', 'fa1-q18', 'fa1-q19', 'fa1-q20',
    ],
  },
  {
    id: 'fa1-mock-2',
    paperId: 'fa1',
    title: 'FA1 Advanced Speed & Error Correction Mock 2',
    description: 'Challenging 15-question sprint concentrating on complex double-entry, VAT calculations, payroll journal postings, trial balance suspense errors, and bank reconciliations.',
    durationMinutes: 45,
    totalQuestions: 15,
    totalMarks: 30,
    passMarks: 15,
    passPercentage: 50,
    difficulty: 'challenging',
    isPublished: true,
    questionIds: [
      'fa1-q06', 'fa1-q08', 'fa1-q11', 'fa1-q12',
      'fa1-q16', 'fa1-q17', 'fa1-q18', 'fa1-q19',
      'fa1-q20', 'fa1-q21', 'fa1-q22', 'fa1-q23',
      'fa1-q24', 'fa1-q25', 'fa1-q05',
    ],
  },
];
