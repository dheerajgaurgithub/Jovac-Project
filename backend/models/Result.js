const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    required: false
  },
  userAnswer: {
    type: String,
    default: ''
  },
  correctAnswer: {
    type: String,
    default: ''
  },
  isCorrect: {
    type: Boolean,
    default: false
  },
  points: {
    type: Number,
    default: 0
  },
  earnedPoints: {
    type: Number,
    default: 0
  }
});

const resultSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  test: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: true
  },
  answers: [answerSchema],
  totalScore: {
    type: Number,
    default: 0
  },
  maxScore: {
    type: Number,
    default: 0
  },
  percentage: {
    type: Number,
    required: true
  },
  timeSpent: {
    type: Number, // in minutes
    default: 0
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['completed', 'timeout'],
    default: 'completed'
  }
});

// Calculate percentage before saving
resultSchema.pre('save', function(next) {
  if (this.maxScore > 0) {
    this.percentage = Math.round((this.totalScore / this.maxScore) * 100);
  } else {
    this.percentage = 0;
  }
  next();
});

module.exports = mongoose.model('Result', resultSchema);
