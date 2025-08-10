const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },
  bio: {
    type: String,
    default: ''
  },
  profileImage: {
    type: String,
    default: ''
  },
  // Common fields for both student and admin
  phone: {
    type: String,
    default: ''
  },
  address: {
    street: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    zipCode: { type: String, default: '' },
    country: { type: String, default: '' }
  },
  // Student-specific fields
  studentInfo: {
    course: { type: String, default: '' },
    year: { type: String, default: '' },
    rollNumber: { type: String, default: '' },
    department: { type: String, default: '' },
    university: { type: String, default: '' }
  },
  // Admin-specific fields
  adminInfo: {
    department: { type: String, default: '' },
    position: { type: String, default: '' },
    employeeId: { type: String, default: '' },
    specialization: { type: String, default: '' }
  },
  // Social links
  socialLinks: {
    linkedin: { type: String, default: '' },
    github: { type: String, default: '' },
    website: { type: String, default: '' }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('User', userSchema);
