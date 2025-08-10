const express = require('express');
const User = require('../models/User');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all students (admin only)
router.get('/students', adminAuth, async (req, res) => {
  try {
    const students = await User.find({ role: 'student' })
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, bio } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, bio },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user stats
router.get('/stats', auth, async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const totalStudents = await User.countDocuments({ role: 'student' });
      const Test = require('../models/Test');
      const Result = require('../models/Result');
      
      const totalTests = await Test.countDocuments();
      const publishedTests = await Test.countDocuments({ isPublished: true });
      const totalResults = await Result.countDocuments();
      
      res.json({
        totalStudents,
        totalTests,
        publishedTests,
        totalResults
      });
    } else {
      const Result = require('../models/Result');
      const Test = require('../models/Test');
      
      const completedTests = await Result.countDocuments({ student: req.user._id });
      const availableTests = await Test.countDocuments({ isPublished: true });
      const avgScore = await Result.aggregate([
        { $match: { student: req.user._id } },
        { $group: { _id: null, avgScore: { $avg: '$percentage' } } }
      ]);
      
      res.json({
        completedTests,
        availableTests,
        averageScore: avgScore[0]?.avgScore || 0
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
