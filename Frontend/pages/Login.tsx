import React, { useState } from 'react';
// @ts-ignore - Accessing updated context functions
import { useFinance } from '../context/FinanceContext';
import { useToast } from '../context/ToastContext'; // Import Toast
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Lock, User as UserIcon, ArrowRight, ShieldCheck, UserPlus, Hash, KeyRound } from 'lucide-react';

type AuthMode = 'login' | 'signup' | 'forgot-password';

export const Login: React.FC = () => {
  const { login, signup, resetPassword, isLoading } = useFinance();
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  // State for Mode Switching
  const [mode, setMode] = useState<AuthMode>('login');

  // Form Fields
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState(''); // Acts as "New Password" in reset mode
  const [pin, setPin] = useState(''); // Recovery Pin
  
  const [error, setError] = useState('');
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  // Helper to reset form when switching modes
  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setError('');
    setName('');
    setUsername('');
    setPassword('');
    setPin('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (mode === 'login') {
        if (!username || !password) {
            setError('Please fill in all fields');
            return;
        }
        const success = await login(username, password);
        if (success) {
            showToast('Welcome back!', 'success');
            // Check role from storage to direct correctly
            const stored = localStorage.getItem('Sa-ada_finance_user');
            const role = stored ? JSON.parse(stored).role : 'student';
            navigate(role === 'admin' ? '/admin/dashboard' : '/student/reports');
        } else {
            setError('Invalid username or password');
            showToast('Login failed', 'error');
        }
    } 
    else if (mode === 'signup') {
        if (!name || !username || !password || !pin) {
            setError('All fields including Recovery Pin are required');
            return;
        }
        const result = await signup(name, username, password, pin);
        if (result.success) {
            showToast('Account created successfully!', 'success');
            navigate('/student/reports');
        } else {
            setError(result.message || 'Signup failed');
            showToast(result.message || 'Signup failed', 'error');
        }
    }
    else if (mode === 'forgot-password') {
        if (!username || !pin || !password) {
            setError('All fields are required');
            return;
        }
        const result = await resetPassword(username, pin, password);
        if (result.success) {
            showToast('Password updated! Please login.', 'success');
            switchMode('login');
        } else {
            setError(result.message || 'Verification failed');
            showToast('Reset failed', 'error');
        }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-blue-50 via-white to-green-50 px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Header Section */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-2xl rotate-3 flex items-center justify-center shadow-blue-200 shadow-lg mb-6 transition-transform duration-300 hover:rotate-6 hover:scale-105">
            <img 
              src="/0 (3).png" 
              alt="Logo" 
              className="h-24 w-24 -rotate-5 object-contain brightness-0 invert" 
            />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-slate-900 tracking-tight">
            {mode === 'login' && 'Welcome back'}
            {mode === 'signup' && 'Create Account'}
            {mode === 'forgot-password' && 'Reset Password'}
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {mode === 'login' && "Sign in to your Sa'ada-Finance account"}
            {mode === 'signup' && "Create a student account to view reports"}
            {mode === 'forgot-password' && "Verify identity to reset password"}
          </p>
        </div>

        {/* Card Section */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-slate-200/60 p-8 sm:p-10 rounded-2xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Name Input (Signup Only) */}
            {mode === 'signup' && (
              <div className="group">
                <label className={`block text-sm font-medium transition-colors duration-200 ${focusedInput === 'name' ? 'text-blue-600' : 'text-slate-700'}`}>
                  Full Name
                </label>
                <div className="mt-1 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserPlus size={18} className={`transition-colors duration-200 ${focusedInput === 'name' ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-500'}`} />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onFocus={() => setFocusedInput('name')}
                    onBlur={() => setFocusedInput(null)}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 bg-slate-50/50 focus:bg-white placeholder-slate-400"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>
            )}

            {/* Username Input (All Modes) */}
            <div className="group">
              <label className={`block text-sm font-medium transition-colors duration-200 ${focusedInput === 'username' ? 'text-blue-600' : 'text-slate-700'}`}>
                Username
              </label>
              <div className="mt-1 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon size={18} className={`transition-colors duration-200 ${focusedInput === 'username' ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-500'}`} />
                </div>
                <input
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocusedInput('username')}
                  onBlur={() => setFocusedInput(null)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 bg-slate-50/50 focus:bg-white placeholder-slate-400"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            {/* Recovery Pin Input (Signup & Forgot Password) */}
            {(mode === 'signup' || mode === 'forgot-password') && (
              <div className="group">
                <label className={`block text-sm font-medium transition-colors duration-200 ${focusedInput === 'pin' ? 'text-blue-600' : 'text-slate-700'}`}>
                  Recovery Pin (Security)
                </label>
                <div className="mt-1 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Hash size={18} className={`transition-colors duration-200 ${focusedInput === 'pin' ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-500'}`} />
                  </div>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    onFocus={() => setFocusedInput('pin')}
                    onBlur={() => setFocusedInput(null)}
                    className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 bg-slate-50/50 focus:bg-white placeholder-slate-400"
                    placeholder="4-6 digit secret pin"
                  />
                </div>
              </div>
            )}

            {/* Password Input (All Modes) */}
            <div className="group">
              <label className={`block text-sm font-medium transition-colors duration-200 ${focusedInput === 'password' ? 'text-blue-600' : 'text-slate-700'}`}>
                {mode === 'forgot-password' ? 'New Password' : 'Password'}
              </label>
              <div className="mt-1 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {mode === 'forgot-password' ? (
                    <KeyRound size={18} className={`transition-colors duration-200 ${focusedInput === 'password' ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-500'}`} />
                  ) : (
                    <Lock size={18} className={`transition-colors duration-200 ${focusedInput === 'password' ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-500'}`} />
                  )}
                </div>
                <input
                  type="password"
                  autoComplete={mode === 'login' ? "current-password" : "new-password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedInput('password')}
                  onBlur={() => setFocusedInput(null)}
                  className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 bg-slate-50/50 focus:bg-white placeholder-slate-400"
                  placeholder={mode === 'forgot-password' ? "Enter new password" : "Enter your password"}
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="rounded-lg bg-red-50 p-3 border border-red-100 animate-[shake_0.5s_ease-in-out]">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <ShieldCheck className="h-5 w-5 text-red-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">{error}</h3>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div>
              <Button 
                type="submit"
                isLoading={isLoading}
                className="group w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-lg hover:shadow-blue-500/30 hover:-translate-y-0.5 active:translate-y-0"
              >
                {mode === 'login' && 'Sign in'}
                {mode === 'signup' && 'Create Account'}
                {mode === 'forgot-password' && 'Update Password'}
                {!isLoading && (
                  <ArrowRight 
                    size={18} 
                    className="ml-2 transition-transform duration-200 group-hover:translate-x-1" 
                  />
                )}
              </Button>
            </div>

            {/* Mode Toggles */}
            <div className="text-center space-y-3 pt-2">
                {mode === 'login' && (
                    <>
                        <button 
                            type="button"
                            onClick={() => switchMode('signup')}
                            className="text-sm text-slate-600 hover:text-blue-600 font-medium transition-colors"
                        >
                            Don't have an account? <span className="text-blue-600">Sign up</span>
                        </button>
                        <div className="block">
                            <button 
                                type="button"
                                onClick={() => switchMode('forgot-password')}
                                className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                Forgot your password?
                            </button>
                        </div>
                    </>
                )}
                {(mode === 'signup' || mode === 'forgot-password') && (
                    <button 
                        type="button"
                        onClick={() => switchMode('login')}
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
                    >
                        Back to Login
                    </button>
                )}
            </div>

          </form>
        </Card>
        
        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-slate-400">
            Secure Financial Management System &copy; {new Date().getFullYear()}
          </p>
        </div>
      </div>
    </div>
  );
};