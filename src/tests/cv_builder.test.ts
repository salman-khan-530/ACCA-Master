import { describe, it, expect } from 'vitest';
import {
  SAMPLE_CV_PROFILE,
  EMPTY_CV_PROFILE,
  ACCA_PAPERS_LIST,
  COMMON_ACCOUNTING_SKILLS,
  SUMMARY_PRESETS,
} from '../pages/CvBuilder/defaultCvData';

describe('Professional ACCA CV Maker', () => {
  it('loads valid sample trainee accountant CV profile', () => {
    expect(SAMPLE_CV_PROFILE.fullName).toBe('Alexander Wright');
    expect(SAMPLE_CV_PROFILE.jobTitle).toContain('ACCA');
    expect(SAMPLE_CV_PROFILE.accaPassedPapers.length).toBeGreaterThanOrEqual(9);
    expect(SAMPLE_CV_PROFILE.skills).toContain('IFRS & IAS Standards');
    expect(SAMPLE_CV_PROFILE.experiences.length).toBeGreaterThan(0);
    expect(SAMPLE_CV_PROFILE.education.length).toBeGreaterThan(0);
  });

  it('contains comprehensive ACCA examination syllabus papers across all tiers', () => {
    const paperCodes = ACCA_PAPERS_LIST.map((p) => p.code);
    // Foundations
    expect(paperCodes).toContain('FA1');
    expect(paperCodes).toContain('MA1');
    // Applied Knowledge
    expect(paperCodes).toContain('BT');
    expect(paperCodes).toContain('MA');
    expect(paperCodes).toContain('FA');
    // Applied Skills
    expect(paperCodes).toContain('FR');
    expect(paperCodes).toContain('AA');
    expect(paperCodes).toContain('FM');
    // Strategic Professional
    expect(paperCodes).toContain('SBL');
    expect(paperCodes).toContain('SBR');
  });

  it('provides key industry accounting skills in the competency bank', () => {
    expect(COMMON_ACCOUNTING_SKILLS).toContain('Double-Entry Bookkeeping');
    expect(COMMON_ACCOUNTING_SKILLS).toContain('Bank & GL Reconciliations');
    expect(COMMON_ACCOUNTING_SKILLS).toContain('QuickBooks Online');
    expect(COMMON_ACCOUNTING_SKILLS).toContain('Advanced Excel (VLOOKUP, Pivot, INDEX/MATCH)');
  });

  it('provides pre-written summaries with non-empty advice for trainees, finalists, and graduates', () => {
    expect(SUMMARY_PRESETS.length).toBe(3);
    SUMMARY_PRESETS.forEach((preset) => {
      expect(preset.title).toBeTruthy();
      expect(preset.text.length).toBeGreaterThan(50);
    });
  });

  it('supports photo display toggle and multiple photo shapes', () => {
    expect(EMPTY_CV_PROFILE.showPhoto).toBe(true);
    expect(['square', 'circle', 'rounded']).toContain(SAMPLE_CV_PROFILE.photoShape);
  });

  it('supports multiple professional themes with customized accent colors', () => {
    const validThemes = ['executive', 'classic', 'modern'];
    expect(validThemes).toContain(SAMPLE_CV_PROFILE.theme);
    expect(SAMPLE_CV_PROFILE.accentColor).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });

  it('sanitizes candidate full names for print/PDF export file titles', () => {
    const sanitizeName = (name: string) =>
      (name || 'ACCA_Candidate').trim().replace(/[^a-zA-Z0-9_-]/g, '_');

    expect(sanitizeName('Alexander Wright')).toBe('Alexander_Wright');
    expect(sanitizeName('John Doe Jr.')).toBe('John_Doe_Jr_');
    expect(sanitizeName('')).toBe('ACCA_Candidate');
  });
});
