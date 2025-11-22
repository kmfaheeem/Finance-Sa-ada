import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { UserPlus, Users, Trash2, PlusCircle, Key, UserCog, ShieldCheck, ShieldAlert } from 'lucide-react';

export const Actions: React.FC = () => {
  const { 
    addStudent, deleteStudent, 
    addClass, deleteClass, 
    updateStudentPassword, updateStudentUsername, 
    addAdmin, updateAdminPassword, updateAdminUsername, deleteAdmin,
    students, classes, admins, isLoading 
  } = useFinance();
  
  // --- Student Forms State ---
  const [studentName, setStudentName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [className, setClassName] = useState('');
  const [deleteStudentId, setDeleteStudentId] = useState('');
  const [deleteClassId, setDeleteClassId] = useState('');

  const [pwStudentId, setPwStudentId] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [userStudentId, setUserStudentId] = useState('');
  const [newUsername, setNewUsername] = useState('');

  // --- Admin Forms State ---
  const [adminName, setAdminName] = useState('');
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');

  const [pwAdminId, setPwAdminId] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [userAdminId, setUserAdminId] = useState('');
  const [newAdminUsername, setNewAdminUsername] = useState('');
  const [deleteAdminId, setDeleteAdminId] = useState('');

  // Handlers - Students & Classes
  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    await addStudent(studentName, username, password);
    setStudentName('');
    setUsername('');
    setPassword('');
  };

  const handleAddClass = async (e: React.FormEvent) => {
    e.preventDefault();
    await addClass(className);
    setClassName('');
  };

  const handleDeleteStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if(confirm('Are you sure? This action cannot be undone.')) {
      await deleteStudent(deleteStudentId);
      setDeleteStudentId('');
    }
  };

  const handleDeleteClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if(confirm('Are you sure? This action cannot be undone.')) {
      await deleteClass(deleteClassId);
      setDeleteClassId('');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if(pwStudentId && newPassword) {
        await updateStudentPassword(pwStudentId, newPassword);
        setPwStudentId('');
        setNewPassword('');
        alert('Student password updated successfully');
    }
  };

  const handleChangeUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    if(userStudentId && newUsername) {
        await updateStudentUsername(userStudentId, newUsername);
        setUserStudentId('');
        setNewUsername('');
        alert('Student username updated successfully');
    }
  };

  // Handlers - Admins
  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    await addAdmin(adminName, adminUser, adminPass);
    setAdminName('');
    setAdminUser('');
    setAdminPass('');
    alert('Admin added successfully');
  };

  const handleChangeAdminPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if(pwAdminId && newAdminPassword) {
        await updateAdminPassword(pwAdminId, newAdminPassword);
        setPwAdminId('');
        setNewAdminPassword('');
        alert('Admin password updated successfully');
    }
  };

  const handleChangeAdminUsername = async (e: React.FormEvent) => {
    e.preventDefault();
    if(userAdminId && newAdminUsername) {
        await updateAdminUsername(userAdminId, newAdminUsername);
        setUserAdminId('');
        setNewAdminUsername('');
        alert('Admin username updated successfully');
    }
  };

  const handleDeleteAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if(confirm('Are you sure you want to delete this admin? This action cannot be undone.')) {
      await deleteAdmin(deleteAdminId);
      setDeleteAdminId('');
      alert('Admin deleted successfully');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Administrative Actions</h1>
        <p className="text-slate-500">Manage students, classes, and system administrators.</p>
      </div>

      {/* SECTION: Admin Management */}
      <div className="border-b border-slate-200 pb-8">
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <ShieldCheck className="text-slate-800" /> 
          Admin Management
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Add Admin */}
          <Card className="bg-slate-50 border-slate-200">
            <div className="flex items-center gap-3 mb-4 text-slate-700">
              <UserPlus size={20} />
              <h3 className="font-semibold">Add New Admin</h3>
            </div>
            <form onSubmit={handleAddAdmin} className="space-y-3">
              <input 
                type="text" required value={adminName} onChange={e => setAdminName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm" placeholder="Name"
              />
              <input 
                type="text" required value={adminUser} onChange={e => setAdminUser(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm" placeholder="Username"
              />
              <input 
                type="password" required value={adminPass} onChange={e => setAdminPass(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm" placeholder="Password"
              />
              <Button type="submit" variant="secondary" className="w-full text-sm">Create Admin</Button>
            </form>
          </Card>

          {/* Edit Admin Password */}
          <Card className="bg-slate-50 border-slate-200">
             <div className="flex items-center gap-3 mb-4 text-slate-700">
              <Key size={20} />
              <h3 className="font-semibold">Admin Password</h3>
            </div>
            <form onSubmit={handleChangeAdminPassword} className="space-y-3">
              <select 
                required value={pwAdminId} onChange={e => setPwAdminId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              >
                <option value="">Select Admin...</option>
                {admins.map(a => <option key={a.id} value={a.id}>{a.name} (@{a.username})</option>)}
              </select>
              <input 
                type="password" required value={newAdminPassword} onChange={e => setNewAdminPassword(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm" placeholder="New Password"
              />
              <Button type="submit" variant="outline" className="w-full text-sm">Update Password</Button>
            </form>
          </Card>

          {/* Edit Admin Username */}
          <Card className="bg-slate-50 border-slate-200">
             <div className="flex items-center gap-3 mb-4 text-slate-700">
              <UserCog size={20} />
              <h3 className="font-semibold">Admin Username</h3>
            </div>
            <form onSubmit={handleChangeAdminUsername} className="space-y-3">
              <select 
                required value={userAdminId} onChange={e => setUserAdminId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              >
                <option value="">Select Admin...</option>
                {admins.map(a => <option key={a.id} value={a.id}>{a.name} (@{a.username})</option>)}
              </select>
              <input 
                type="text" required value={newAdminUsername} onChange={e => setNewAdminUsername(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm" placeholder="New Username"
              />
              <Button type="submit" variant="outline" className="w-full text-sm">Update Username</Button>
            </form>
          </Card>

          {/* Delete Admin */}
          <Card className="bg-slate-50 border-red-200">
             <div className="flex items-center gap-3 mb-4 text-red-700">
              <ShieldAlert size={20} />
              <h3 className="font-semibold">Delete Admin</h3>
            </div>
            <form onSubmit={handleDeleteAdmin} className="space-y-3">
              <select 
                required value={deleteAdminId} onChange={e => setDeleteAdminId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded text-sm"
              >
                <option value="">Select Admin...</option>
                {admins.map(a => (
                  <option key={a.id} value={a.id}>
                    {a.name} (@{a.username})
                  </option>
                ))}
              </select>
              <div className="h-[46px]"></div> {/* Spacer */}
              <Button type="submit" variant="danger" className="w-full text-sm">Delete Admin</Button>
            </form>
          </Card>
        </div>
      </div>

      {/* SECTION: Student & Class Management */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
           <Users className="text-slate-800" />
           Student & Class Management
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Add Student */}
          <Card>
            <div className="flex items-center gap-3 mb-4 text-blue-600">
              <UserPlus size={24} />
              <h2 className="text-lg font-semibold">Add New Student</h2>
            </div>
            <form onSubmit={handleAddStudent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input 
                  type="text" 
                  required 
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
                <input 
                  type="text" 
                  required 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="student_username"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Initial Password</label>
                <input 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="******"
                />
              </div>
              <Button type="submit" isLoading={isLoading} className="w-full">Create Student</Button>
            </form>
          </Card>

          {/* Add Class */}
          <Card>
            <div className="flex items-center gap-3 mb-4 text-emerald-600">
              <PlusCircle size={24} />
              <h2 className="text-lg font-semibold">Add New Class</h2>
            </div>
            <form onSubmit={handleAddClass} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Class Name</label>
                <input 
                  type="text" 
                  required 
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Grade 10 - Section B"
                />
              </div>
              <div className="h-[140px] hidden md:block"></div> {/* Spacer for grid alignment */}
              <Button type="submit" variant="primary" className="w-full bg-emerald-600 hover:bg-emerald-700" isLoading={isLoading}>Create Class</Button>
            </form>
          </Card>

          {/* Change Student Password */}
          <Card>
            <div className="flex items-center gap-3 mb-4 text-amber-600">
              <Key size={24} />
              <h2 className="text-lg font-semibold">Change Student Password</h2>
            </div>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Select Student</label>
                <select 
                  required
                  value={pwStudentId}
                  onChange={(e) => setPwStudentId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">-- Select Student --</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name} (@{s.username})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                <input 
                  type="password" 
                  required 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="New Password"
                />
              </div>
              <Button type="submit" variant="outline" className="w-full border-amber-300 text-amber-700 hover:bg-amber-50" isLoading={isLoading}>Update Password</Button>
            </form>
          </Card>

          {/* Change Student Username */}
          <Card>
            <div className="flex items-center gap-3 mb-4 text-purple-600">
              <UserCog size={24} />
              <h2 className="text-lg font-semibold">Change Student Username</h2>
            </div>
            <form onSubmit={handleChangeUsername} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Select Student</label>
                <select 
                  required
                  value={userStudentId}
                  onChange={(e) => setUserStudentId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">-- Select Student --</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name} (@{s.username})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">New Username</label>
                <input 
                  type="text" 
                  required 
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="New Username"
                />
              </div>
              <Button type="submit" variant="outline" className="w-full border-purple-300 text-purple-700 hover:bg-purple-50" isLoading={isLoading}>Update Username</Button>
            </form>
          </Card>

          {/* Delete Student */}
          <Card className="border-red-100">
            <div className="flex items-center gap-3 mb-4 text-red-600">
              <Users size={24} />
              <h2 className="text-lg font-semibold">Delete Student</h2>
            </div>
            <form onSubmit={handleDeleteStudent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Select Student</label>
                <select 
                  required
                  value={deleteStudentId}
                  onChange={(e) => setDeleteStudentId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">-- Select Student --</option>
                  {students.map(s => (
                    <option key={s.id} value={s.id}>{s.name} (@{s.username})</option>
                  ))}
                </select>
              </div>
              <Button type="submit" variant="danger" isLoading={isLoading} className="w-full">Delete Student</Button>
            </form>
          </Card>

          {/* Delete Class */}
          <Card className="border-red-100">
            <div className="flex items-center gap-3 mb-4 text-red-600">
              <Trash2 size={24} />
              <h2 className="text-lg font-semibold">Delete Class</h2>
            </div>
            <form onSubmit={handleDeleteClass} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Select Class</label>
                <select 
                  required
                  value={deleteClassId}
                  onChange={(e) => setDeleteClassId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="">-- Select Class --</option>
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <Button type="submit" variant="danger" isLoading={isLoading} className="w-full">Delete Class</Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};