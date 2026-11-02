import { Announcement } from '../types';

export const SAMPLE_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'ACCA Master 2026 CBE Simulation Engine Launched',
    content: 'Welcome to ACCA Master! Our interactive mock examination engine is now live with real-time countdown timers, question status tracking, and instant detailed explanations for FA1.',
    priority: 'urgent',
    createdAt: '2026-02-01T08:00:00Z',
    isPublished: true,
  },
  {
    id: 'ann-2',
    title: 'New FA1 Topic Questions Added to Question Bank',
    content: 'Over 25 newly crafted practice questions covering Trial Balance and Error Correction, VAT calculations, and Bank Reconciliations have been added to the FA1 syllabus module.',
    priority: 'important',
    targetPaperId: 'fa1',
    createdAt: '2026-02-02T10:30:00Z',
    isPublished: true,
  },
  {
    id: 'ann-3',
    title: 'Study Community WhatsApp Groups & Weekly Masterclasses',
    content: 'Connect with fellow ACCA aspirants in our moderated WhatsApp study community and join weekly live doubt-solving sessions.',
    priority: 'normal',
    createdAt: '2026-02-03T15:00:00Z',
    isPublished: true,
  },
];
