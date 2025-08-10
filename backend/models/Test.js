const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['mcq', 'fillblank', 'shortanswer'],
    required: true
  },
  question: {
    type: String,
    required: true
  },
  options: [{
    type: String
  }],
  correctAnswer: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    default: 1
  }
});

const testSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  questions: [questionSchema],
  totalPoints: {
    type: Number,
    default: 0
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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

// Calculate total points before saving
testSchema.pre('save', function(next) {
  this.totalPoints = this.questions.reduce((total, question) => total + question.points, 0);
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Test', testSchema);
