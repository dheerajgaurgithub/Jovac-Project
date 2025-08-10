const express = require('express');
const mongoose = require('mongoose');
const Result = require('../models/Result');
const Test = require('../models/Test');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Submit test result - BULLETPROOF VERSION
router.post('/', auth, async (req, res) => {
  console.log('=== BULLETPROOF TEST SUBMISSION START ===');
  console.log('Request method:', req.method);
  console.log('Request URL:', req.originalUrl);
  console.log('Request headers:', JSON.stringify(req.headers, null, 2));
  console.log('Request body:', JSON.stringify(req.body, null, 2));
  
  try {
    const { testId, answers, timeSpent } = req.body;
    console.log('Raw request data:');
    console.log('- testId:', testId);
    console.log('- answers type:', typeof answers, 'length:', answers?.length);
    console.log('- timeSpent:', timeSpent);
    console.log('- userId:', req.user?._id);
    console.log('- user name:', req.user?.name);
    console.log('- user role:', req.user?.role);
    
    // Enhanced validation with detailed logging
    if (!testId) {
      console.log('ERROR: Test ID is missing');
      return res.status(400).json({ 
        message: 'Test ID required',
        details: 'testId field is missing from request body'
      });
    }
    
    if (!req.user?._id) {
      console.log('ERROR: User not authenticated');
      return res.status(401).json({ 
        message: 'User not authenticated',
        details: 'req.user is missing or invalid'
      });
    }
    
    console.log('✓ Basic validation passed');
    
    // Validate testId format
    if (!mongoose.Types.ObjectId.isValid(testId)) {
      console.log('ERROR: Invalid test ID format');
      return res.status(400).json({ 
        message: 'Invalid test ID format',
        details: 'testId must be a valid MongoDB ObjectId'
      });
    }
    
    console.log('✓ Test ID format validation passed');
    
    // Get test
    const test = await Test.findById(testId);
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }
    
    // Check duplicate
    const existing = await Result.findOne({ student: req.user._id, test: testId });
    if (existing) {
      return res.status(400).json({ message: 'Already submitted' });
    }
    
    // Process answers and calculate score
    let totalScore = 0;
    const maxScore = test.questions.length;
    const processedAnswers = [];
    
    console.log('Processing answers:', answers?.length || 0);
    
    if (answers && Array.isArray(answers)) {
      answers.forEach((answer, index) => {
        const question = test.questions.find(q => q._id.toString() === answer.questionId);
        
        if (question) {
          const isCorrect = question.correctAnswer && 
            answer.userAnswer && 
            answer.userAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
          
          const earnedPoints = isCorrect ? 1 : 0;
          totalScore += earnedPoints;
          
          processedAnswers.push({
            questionId: answer.questionId,
            userAnswer: answer.userAnswer || '',
            correctAnswer: question.correctAnswer || '',
            isCorrect,
            points: 1,
            earnedPoints
          });
          
          console.log(`Answer ${index + 1}: ${isCorrect ? 'CORRECT' : 'INCORRECT'}`);
        } else {
          console.log(`Question not found for ID: ${answer.questionId}`);
        }
      });
    }

    console.log(`Score calculation: ${totalScore}/${maxScore}`);

    // Calculate percentage (ensure it's always provided)
    const calculatedPercentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
    const finalPercentage = req.body.percentage !== undefined ? req.body.percentage : calculatedPercentage;
    
    console.log('Percentage calculation:', {
      fromFrontend: req.body.percentage,
      calculated: calculatedPercentage,
      final: finalPercentage
    });

    // Create result with guaranteed percentage field
    const resultData = {
      student: req.user._id,
      test: testId,
      answers: processedAnswers,
      totalScore: totalScore,
      maxScore: maxScore,
      percentage: finalPercentage,
      timeSpent: timeSpent || 0,
      status: 'completed'
    };
    
    console.log('Creating result with calculated data:', resultData);
    
    const result = new Result(resultData);
    await result.save();
    
    console.log('=== SUCCESS: Result saved with ID:', result._id);
    res.status(201).json({
      _id: result._id,
      student: result.student,
      test: result.test,
      totalScore: result.totalScore,
      maxScore: result.maxScore,
      percentage: result.percentage,
      timeSpent: result.timeSpent,
      submittedAt: result.submittedAt
    });
    
  } catch (error) {
    console.error('=== BULLETPROOF SUBMISSION ERROR ===');
    console.error('Error:', error.message);
    console.error('Stack:', error.stack);
    
    // Return simple error response
    res.status(500).json({ 
      message: 'Submission failed',
      error: error.message
    });
  }
});

// Get student's results
router.get('/my-results', auth, async (req, res) => {
  try {
    const results = await Result.find({ student: req.user._id })
      .populate('test', 'title description')
      .sort({ submittedAt: -1 });
    
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get specific result
router.get('/:id', auth, async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate('test', 'title description questions')
      .populate('student', 'name email');
    
    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }
    
    // Students can only view their own results
    if (req.user.role === 'student' && result.student._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }
    
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all results for a test (admin only)
router.get('/test/:testId', adminAuth, async (req, res) => {
  try {
    const results = await Result.find({ test: req.params.testId })
      .populate('student', 'name email')
      .populate('test', 'title')
      .sort({ submittedAt: -1 });
    
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all results (admin only)
router.get('/', adminAuth, async (req, res) => {
  try {
    const results = await Result.find()
      .populate('student', 'name email')
      .populate('test', 'title')
      .sort({ submittedAt: -1 });
    
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Export results as CSV (admin only)
router.get('/export/csv', adminAuth, async (req, res) => {
  try {
    const results = await Result.find()
      .populate('student', 'name email')
      .populate('test', 'title');
    
    let csv = 'Student Name,Student Email,Test Title,Score,Max Score,Percentage,Time Spent,Submitted At\n';
    
    results.forEach(result => {
      csv += `"${result.student.name}","${result.student.email}","${result.test.title}",${result.totalScore},${result.maxScore},${result.percentage}%,${result.timeSpent} min,"${result.submittedAt}"\n`;
    });
    
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=test-results.csv');
    res.send(csv);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
