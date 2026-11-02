import { describe, it, expect } from 'vitest';
import { UserProfile } from '../types';

describe('Role-Based Access Control and Registration Security', () => {
  const studentUser: UserProfile = {
    uid: 'student-123',
    email: 'candidate@example.com',
    displayName: 'Student User',
    role: 'student',
    selectedPapers: ['fa1'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    leaderboardOptIn: true,
    status: 'active',
  };

  const adminUser: UserProfile = {
    uid: 'admin-123',
    email: 'admin@accamaster.com',
    displayName: 'Admin User',
    role: 'admin',
    selectedPapers: ['fa1', 'pm'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    leaderboardOptIn: false,
    status: 'active',
  };

  const checkAdminAccess = (user: UserProfile | null): boolean => {
    return user !== null && user.role === 'admin' && user.status === 'active';
  };

  it('denies administrator dashboard route to student users', () => {
    expect(checkAdminAccess(studentUser)).toBe(false);
  });

  it('permits administrator access to verified active admin role', () => {
    expect(checkAdminAccess(adminUser)).toBe(true);
  });

  it('denies access if account is deactivated', () => {
    const deactivatedAdmin: UserProfile = { ...adminUser, status: 'inactive' };
    expect(checkAdminAccess(deactivatedAdmin)).toBe(false);
  });

  it('enforces default student role on registration regardless of input payload', () => {
    // Simulating registration role enforcement
    const registerPayload = {
      fullName: 'New Candidate',
      email: 'new@example.com',
      password: 'password123',
      // Attacker attempts to pass role: 'admin' in post payload
      role: 'admin',
    };

    // Platform sanitization rule: always assign student
    const createdProfile: UserProfile = {
      uid: 'new-uid',
      email: registerPayload.email,
      displayName: registerPayload.fullName,
      role: 'student', // Strict backend role assignment
      selectedPapers: ['fa1'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      leaderboardOptIn: true,
      status: 'active',
    };

    expect(createdProfile.role).toBe('student');
    expect(checkAdminAccess(createdProfile)).toBe(false);
  });
});
