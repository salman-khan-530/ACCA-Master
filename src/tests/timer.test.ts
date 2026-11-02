import { describe, it, expect } from 'vitest';

describe('CBE Countdown Timer Utilities', () => {
  const formatTimer = (totalSecs: number) => {
    const hours = Math.floor(totalSecs / 3600);
    const minutes = Math.floor((totalSecs % 3600) / 60);
    const seconds = totalSecs % 60;
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  it('formats minutes and seconds under an hour correctly', () => {
    expect(formatTimer(3599)).toBe('59:59');
    expect(formatTimer(300)).toBe('05:00');
    expect(formatTimer(45)).toBe('00:45');
    expect(formatTimer(0)).toBe('00:00');
  });

  it('formats hours for long full CBE examinations', () => {
    // 2 hours = 7200 seconds
    expect(formatTimer(7200)).toBe('02:00:00');
    // 3 hours = 10800 seconds (Applied Skills PM/TX/FR)
    expect(formatTimer(10800)).toBe('03:00:00');
  });

  it('accurately identifies time-critical state (< 5 minutes)', () => {
    const isCritical = (seconds: number) => seconds <= 300 && seconds > 0;
    expect(isCritical(301)).toBe(false);
    expect(isCritical(300)).toBe(true);
    expect(isCritical(60)).toBe(true);
    expect(isCritical(0)).toBe(false);
  });
});
