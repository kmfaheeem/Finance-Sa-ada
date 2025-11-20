import { Student, ClassEntity, Transaction, Admin } from '../types';

// Generate 1 student as requested, with 0 balance
export const INITIAL_STUDENTS: Student[] = [
  {
    id: 1,
    name: 'Student 1',
    username: 'student1',
    password: 'password1',
    accountBalance: 0,
    createdAt: new Date().toISOString(),
  }
];

// Pre-defined Admins (kept as is)
export const INITIAL_ADMINS: Admin[] = [
  { id: 1, name: 'Admin One', username: 'admin1', password: 'admin123', role: 'admin' },
  { id: 2, name: 'Admin Two', username: 'admin2', password: 'admin223', role: 'admin' },
];

// Classes with 0 balance
export const INITIAL_CLASSES: ClassEntity[] = [
  { id: 1, name: 'Class 10A', accountBalance: 0, createdAt: new Date().toISOString() },
  { id: 2, name: 'Class 10B', accountBalance: 0, createdAt: new Date().toISOString() },
  { id: 3, name: 'Science Club', accountBalance: 0, createdAt: new Date().toISOString() },
];

// Clear all transaction history
export const INITIAL_TRANSACTIONS: Transaction[] = [];