export type Role = 'admin' | 'student';

export type TransactionType = 'deposit' | 'withdrawal';

export interface User {
  id: string; // MongoDB ID is string
  name: string;
  username: string;
  role: Role;
}

export interface Admin {
  _id?: string; // MongoDB ID
  id?: number | string;
  name: string;
  username: string;
  password?: string;
  role: 'admin';
  createdAt?: string;
}

export interface Student {
  _id?: string;
  id?: number | string; // Handle compatibility
  name: string;
  username: string;
  password?: string;
  accountBalance: number;
  createdAt: string;
}

export interface ClassEntity {
  _id?: string;
  id?: number | string;
  name: string;
  accountBalance: number;
  createdAt: string;
}

export interface Transaction {
  _id?: string;
  id?: number | string;
  entityId: number | string; // Changed to support String IDs
  entityType: 'student' | 'class';
  amount: number;
  type: TransactionType;
  date: string;
  reason: string;
  createdAt: string;
  entityName?: string;
}

export interface FinanceState {
  currentUser: User | null;
  admins: Admin[];
  students: Student[];
  classes: ClassEntity[];
  transactions: Transaction[];
  isLoading: boolean;
}

export interface FinanceContextType extends FinanceState {
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  // Admin Management
  addAdmin: (name: string, username: string, password: string) => Promise<void>;
  updateAdminPassword: (id: number | string, newPassword: string) => Promise<void>;
  updateAdminUsername: (id: number | string, newUsername: string) => Promise<void>;
  // Student Management
  addStudent: (name: string, username: string, password: string) => Promise<void>;
  updateStudentPassword: (id: number | string, newPassword: string) => Promise<void>;
  updateStudentUsername: (id: number | string, newUsername: string) => Promise<void>;
  deleteStudent: (id: number | string) => Promise<void>;
  // Class Management
  addClass: (name: string) => Promise<void>;
  deleteClass: (id: number | string) => Promise<void>;
  // Transactions
  addTransaction: (
    entityId: number | string,
    entityType: 'student' | 'class',
    amount: number,
    type: TransactionType,
    date: string,
    reason: string
  ) => Promise<void>;
  formatCurrency: (amount: number) => string;
}