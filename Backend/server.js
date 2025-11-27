require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://saada-finance.vercel.app",
    process.env.FRONTEND_URL 
  ],
  credentials: true
}));
app.use(bodyParser.json());

// MongoDB Connection (Suggestion 2: Strict Env Check)
const MONGO_URI = process.env.MONGODB_URI;
if (!MONGO_URI) {
  console.error("FATAL ERROR: MONGODB_URI is not defined in .env file.");
  process.exit(1); 
}

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// --- SCHEMAS ---

// (Suggestion 3: Added recoveryPin)
const AdminSchema = new mongoose.Schema({
  name: String,
  username: { type: String, unique: true },
  password: { type: String, required: true }, 
  recoveryPin: { type: String, required: true }, // Secure reset
  role: { type: String, default: 'admin' }
});

const StudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  recoveryPin: { type: String, required: true }, // Secure reset
  accountBalance: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

// ... (Keep Class, SpecialFund, Transaction Schemas as they were) ...
const ClassSchema = new mongoose.Schema({
  name: String,
  accountBalance: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});
const SpecialFundSchema = new mongoose.Schema({
  name: String,
  description: String,
  accountBalance: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});
const TransactionSchema = new mongoose.Schema({
  entityId: String, 
  entityType: String, 
  amount: Number,
  type: String,
  date: String,
  reason: String,
  createdBy: String,
  createdAt: { type: Date, default: Date.now }
});

const Admin = mongoose.model('Admin', AdminSchema);
const Student = mongoose.model('Student', StudentSchema);
const Class = mongoose.model('Class', ClassSchema);
const SpecialFund = mongoose.model('SpecialFund', SpecialFundSchema);
const Transaction = mongoose.model('Transaction', TransactionSchema);

// --- ROUTES ---

// 1. Initialization (Seed)
app.post('/api/seed', async (req, res) => {
  const adminCount = await Admin.countDocuments();
  if (adminCount === 0) {
    // Added default pin '0000' for seeded admins
    await Admin.create([
      { name: 'Admin One', username: 'admin1', password: 'admin123', recoveryPin: '0000' },
      { name: 'Admin Two', username: 'admin2', password: 'admin223', recoveryPin: '0000' }
    ]);
  }
  res.json({ message: 'Database seeded successfully' });
});

// 2. Login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  
  // (Suggestion 6: Validation)
  if (!username || !password) return res.status(400).json({ success: false, message: 'Fields required' });

  const admin = await Admin.findOne({ username, password });
  if (admin) {
    return res.json({ 
      success: true, 
      user: { id: admin._id, name: admin.name, username: admin.username, role: 'admin' } 
    });
  }

  const student = await Student.findOne({ username, password });
  if (student) {
    return res.json({ 
      success: true, 
      user: { id: student._id, name: student.name, username: student.username, role: 'student' } 
    });
  }

  res.status(401).json({ success: false, message: 'Invalid credentials' });
});

// 3. Sign Up (Create Student)
app.post('/api/signup', async (req, res) => {
  const { name, username, password, recoveryPin } = req.body;

  // (Suggestion 6: Validation)
  if (!name || !username || !password || !recoveryPin) {
    return res.status(400).json({ success: false, message: 'All fields including Recovery Pin are required' });
  }

  try {
    const existing = await Student.findOne({ username });
    if (existing) return res.status(400).json({ success: false, message: 'Username taken' });

    const newStudent = new Student({ name, username, password, recoveryPin });
    await newStudent.save();

    res.json({ 
      success: true, 
      user: { id: newStudent._id, name: newStudent.name, username: newStudent.username, role: 'student' } 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 4. Reset Password (Verified)
app.post('/api/reset-password', async (req, res) => {
  const { username, recoveryPin, newPassword } = req.body;

  try {
    // Check if user exists with matching PIN
    let user = await Admin.findOne({ username, recoveryPin });
    if (!user) user = await Student.findOne({ username, recoveryPin });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid Username or Recovery Pin' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. Fetch All Data (Suggestion 1: Stop Data Leakage)
app.get('/api/data', async (req, res) => {
  try {
    // .select() excludes sensitive fields from the response
    const admins = await Admin.find().select('-password -recoveryPin -__v');
    const students = await Student.find().select('-password -recoveryPin -__v');
    const classes = await Class.find().select('-__v');
    const specialFunds = await SpecialFund.find().select('-__v');
    const transactions = await Transaction.find().sort({ createdAt: -1 }).select('-__v');
    
    res.json({ admins, students, classes, specialFunds, transactions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. CRUD Routes

// Students
app.post('/api/students', async (req, res) => {
  try {
    const newStudent = new Student(req.body);
    await newStudent.save();
    res.json(newStudent);
  } catch (err) { res.status(400).json({ error: err.message }); }
});
app.put('/api/students/:id', async (req, res) => {
  try {
    const updated = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) { res.status(400).json({ error: err.message }); }
});
app.delete('/api/students/:id', async (req, res) => {
  try { await Student.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); } 
  catch (err) { res.status(500).json({ error: err.message }); }
});

// Classes
app.post('/api/classes', async (req, res) => {
  try {
    const newClass = new Class(req.body);
    await newClass.save();
    res.json(newClass);
  } catch (err) { res.status(400).json({ error: err.message }); }
});
app.delete('/api/classes/:id', async (req, res) => {
  try { await Class.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); } 
  catch (err) { res.status(500).json({ error: err.message }); }
});

// Special Funds
app.post('/api/special-funds', async (req, res) => {
  try {
    const newFund = new SpecialFund(req.body);
    await newFund.save();
    res.json(newFund);
  } catch (err) { res.status(400).json({ error: err.message }); }
});
app.delete('/api/special-funds/:id', async (req, res) => {
  try { await SpecialFund.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); } 
  catch (err) { res.status(500).json({ error: err.message }); }
});

// Admins
app.post('/api/admins', async (req, res) => {
  try {
    const newAdmin = new Admin(req.body);
    await newAdmin.save();
    res.json(newAdmin);
  } catch (err) { res.status(400).json({ error: err.message }); }
});
app.put('/api/admins/:id', async (req, res) => {
  try {
    const updated = await Admin.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) { res.status(400).json({ error: err.message }); }
});
app.delete('/api/admins/:id', async (req, res) => {
  try { await Admin.findByIdAndDelete(req.params.id); res.json({ message: 'Deleted' }); } 
  catch (err) { res.status(500).json({ error: err.message }); }
});

// 5. Transactions (Updated with Audit Log)
app.post('/api/transactions', async (req, res) => {
  try {
    // validation
    const { entityId, entityType, amount, type, date, reason, createdBy } = req.body; // <--- Extract createdBy
    
    if (!entityId || !amount || !type || !date) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    const numAmount = Number(amount);

    const transaction = new Transaction({
      entityId, entityType, amount: numAmount, type, date, reason, createdBy // <--- Save it
    });
    await transaction.save();

    // (Suggestion 5 Skipped: Keeping your original balance update logic here)
    if (entityType === 'student') {
      const student = await Student.findById(entityId);
      if (student) {
        student.accountBalance = type === 'deposit' 
          ? student.accountBalance + numAmount 
          : student.accountBalance - numAmount;
        await student.save();
      }
    } else if (entityType === 'class') {
      const classEntity = await Class.findById(entityId);
      if (classEntity) {
        classEntity.accountBalance = type === 'deposit' 
          ? classEntity.accountBalance + numAmount 
          : classEntity.accountBalance - numAmount;
        await classEntity.save();
      }
    } else if (entityType === 'special') {
      const specialFund = await SpecialFund.findById(entityId);
      if (specialFund) {
        specialFund.accountBalance = type === 'deposit' 
          ? specialFund.accountBalance + numAmount 
          : specialFund.accountBalance - numAmount;
        await specialFund.save();
      }
    }

    res.json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sign Up Route (Creates a Student)
app.post('/api/signup', async (req, res) => {
  const { name, username, password } = req.body;
  try {
    // Check if username exists
    const existingAdmin = await Admin.findOne({ username });
    const existingStudent = await Student.findOne({ username });
    
    if (existingAdmin || existingStudent) {
      return res.status(400).json({ success: false, message: 'Username already taken' });
    }

    // Create new student
    const newStudent = new Student({ name, username, password });
    await newStudent.save();

    res.json({ 
      success: true, 
      user: { id: newStudent._id, name: newStudent.name, username: newStudent.username, role: 'student' } 
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Verify User & Reset Password
app.post('/api/reset-password', async (req, res) => {
  const { username, recoveryPin, newPassword } = req.body;
  
  try {
    // Check Admin
    let user = await Admin.findOne({ username, recoveryPin });
    if (!user) {
      // Check Student if Admin not found
      user = await Student.findOne({ username, recoveryPin });
    }

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid username or recovery pin' });
    }

    // Update Password
    user.password = newPassword; // In production, hash this with bcrypt!
    await user.save();

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Suggestion 5: Rate Limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);