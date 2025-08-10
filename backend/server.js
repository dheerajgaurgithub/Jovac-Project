const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Import routes
const authRoutes = require('./routes/auth');
const testRoutes = require('./routes/tests');
const userRoutes = require('./routes/users');
const resultRoutes = require('./routes/results');
const profileRoutes = require('./routes/profile');

dotenv.config();

const app = express();

// Middleware - CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'https://jovac-project-lilac.vercel.app',
    'https://jovac-project-2oqb.onrender.com'
  ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Root route - API information
app.get('/', (req, res) => {
  res.json({
    message: 'Jovac Project API is running successfully!',
    version: '1.0.0',
    status: 'active',
    endpoints: {
      auth: '/api/auth',
      tests: '/api/tests',
      users: '/api/users',
      results: '/api/results',
      profile: '/api/profile'
    },
    documentation: 'Visit the respective endpoints for API functionality'
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/users', userRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/profile', profileRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://coder9265:ggiOkjdFWXhLDb5P@cluster0.anx0dkl.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected successfully'))
.catch((err) => console.error('MongoDB connection error:', err));

// Seed admin user
const seedAdmin = async () => {
  const User = require('./models/User');
  const bcrypt = require('bcryptjs');
  
  try {
    const adminExists = await User.findOne({ email: 'admin@testgen.com' });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 12);
      const admin = new User({
        name: 'System Administrator',
        email: 'admin@testgen.com',
        password: hashedPassword,
        role: 'admin'
      });
      await admin.save();
      console.log('Admin user seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding admin:', error);
  }
};

// Initialize admin after DB connection
mongoose.connection.once('open', () => {
  seedAdmin();
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
