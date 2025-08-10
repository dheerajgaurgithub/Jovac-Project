const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const Test = require('../models/Test');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// Enhanced PDF parsing function with multiple question types
const parseQuestionsFromPDF = (text, questionType = 'mixed', maxQuestions = 10) => {
  console.log('Starting enhanced PDF parsing...');
  console.log('Question type:', questionType, 'Max questions:', maxQuestions);
  
  const questions = [];
  const seenQuestions = new Set();
  
  try {
    // Validate input
    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      console.log('Invalid or empty text provided');
      return [];
    }
    
    // Clean and prepare text for better parsing
    const cleanedText = text
      .replace(/\s+/g, ' ')  // Replace multiple spaces with single space
      .replace(/[\r\n]+/g, '. ')  // Replace line breaks with periods
      .trim();
    
    // Split into meaningful sentences (better quality)
    const sentences = cleanedText
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s && s.length >= 20 && s.length <= 200)  // Quality filter
      .filter(s => s.split(' ').length >= 5)  // At least 5 words
      .slice(0, 50);  // Limit for performance
    
    console.log('Quality sentences found:', sentences.length);
    
    if (sentences.length === 0) {
      console.log('No quality sentences found in PDF');
      return createFallbackQuestions(text, maxQuestions);
    }
    
    // Process sentences for question generation
    for (let i = 0; i < sentences.length && questions.length < maxQuestions; i++) {
      try {
        const sentence = sentences[i].trim();
        
        if (!sentence || sentence.length < 20) continue;
        
        const normalizedSentence = sentence.toLowerCase().replace(/[^\w\s]/g, '').trim();
        if (seenQuestions.has(normalizedSentence)) continue;
        
        // Determine what type of question to generate
        const questionTypes = getQuestionTypesToGenerate(questionType, questions.length, maxQuestions);
        if (!questionTypes || questionTypes.length === 0) continue;
        
        const selectedType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
        
        let question = null;
        
        try {
          if (selectedType === 'mcq') {
            question = generateMCQ(sentence);
          } else if (selectedType === 'fillblank') {
            question = generateFillBlank(sentence);
          } else if (selectedType === 'shortanswer') {
            question = generateShortAnswer(sentence);
          }
          
          if (question && question.question && question.correctAnswer) {
            questions.push(question);
            seenQuestions.add(normalizedSentence);
            console.log(`Generated ${selectedType} question: ${question.question.substring(0, 80)}...`);
          }
        } catch (questionError) {
          console.error('Error generating individual question:', questionError);
          continue;
        }
      } catch (contentError) {
        console.error('Error processing sentence:', contentError);
        continue;
      }
    }
    
    console.log(`Parsing complete. Generated ${questions.length} questions`);
    
    // If no questions generated, create fallback questions
    if (questions.length === 0) {
      console.log('No questions generated, creating fallback questions...');
      const fallbackQuestions = createFallbackQuestions(cleanedText, Math.min(3, maxQuestions));
      questions.push(...fallbackQuestions);
    }
    
    return questions;
  } catch (error) {
    console.error('Error in parseQuestionsFromPDF:', error);
    return createFallbackQuestions(text, Math.min(3, maxQuestions));
  }
};

// Helper function to determine question types to generate
const getQuestionTypesToGenerate = (preferredType, currentCount, maxQuestions) => {
  if (preferredType === 'mcq') return ['mcq'];
  if (preferredType === 'fillblank') return ['fillblank'];
  if (preferredType === 'shortanswer') return ['shortanswer'];
  
  // For mixed type, distribute evenly
  return ['mcq', 'fillblank', 'shortanswer'];
};

// Create fallback questions when generation fails
const createFallbackQuestions = (text, maxQuestions) => {
  const questions = [];
  try {
    // Clean the text first
    const cleanText = text.replace(/\s+/g, ' ').trim();
    
    if (cleanText.length < 50) {
      // If text is too short, create generic questions
      questions.push({
        type: 'shortanswer',
        question: 'What is the main topic discussed in the uploaded document?',
        options: [],
        correctAnswer: 'Please provide the main topic based on the document content',
        points: 2
      });
      
      if (maxQuestions > 1) {
        questions.push({
          type: 'mcq',
          question: 'What type of document was uploaded?',
          options: [
            'Educational material',
            'Technical document', 
            'Research paper',
            'General information'
          ],
          correctAnswer: 'Educational material',
          points: 1
        });
      }
      
      return questions;
    }
    
    // Extract meaningful sentences for better fallback questions
    const sentences = cleanText
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s && s.length >= 30 && s.length <= 150)
      .slice(0, maxQuestions);
    
    for (let i = 0; i < Math.min(maxQuestions, sentences.length); i++) {
      const sentence = sentences[i];
      
      // Create different types of fallback questions
      if (i % 3 === 0) {
        // Short answer question
        questions.push({
          type: 'shortanswer',
          question: `Explain the key point made in this statement: "${sentence}"`,
          options: [],
          correctAnswer: 'Please provide an explanation based on the given statement',
          points: 2
        });
      } else if (i % 3 === 1) {
        // Fill-in-the-blank question
        const words = sentence.split(' ');
        if (words.length > 5) {
          const blankIndex = Math.floor(words.length / 2);
          const blankWord = words[blankIndex].replace(/[^a-zA-Z0-9]/g, '');
          const questionWords = [...words];
          questionWords[blankIndex] = '______';
          
          questions.push({
            type: 'fillblank',
            question: `Fill in the blank: "${questionWords.join(' ')}"`,
            options: [],
            correctAnswer: blankWord,
            points: 1
          });
        }
      } else {
        // MCQ question
        questions.push({
          type: 'mcq',
          question: `What is the main idea conveyed in: "${sentence}"?`,
          options: [
            'It presents important information',
            'It provides background context',
            'It offers a conclusion',
            'It raises a question'
          ],
          correctAnswer: 'It presents important information',
          points: 1
        });
      }
    }
    
    // Ensure we have at least one question
    if (questions.length === 0) {
      questions.push({
        type: 'shortanswer',
        question: 'What is the main topic or theme of the uploaded document?',
        options: [],
        correctAnswer: 'Please describe the main topic based on the document content',
        points: 2
      });
    }
    
  } catch (error) {
    console.error('Error creating fallback questions:', error);
    // Ultimate fallback
    questions.push({
      type: 'shortanswer',
      question: 'What information can you extract from the uploaded document?',
      options: [],
      correctAnswer: 'Please provide relevant information from the document',
      points: 2
    });
  }
  
  return questions.slice(0, maxQuestions);
};

// Generate Multiple Choice Question
const generateMCQ = (sentence) => {
  try {
    if (!sentence || typeof sentence !== 'string' || sentence.trim().length < 20) {
      return null;
    }
    
    // Clean the sentence
    const cleanSentence = sentence.trim().replace(/[^a-zA-Z0-9\s]/g, '');
    const words = cleanSentence.split(' ').filter(w => w && w.length > 3);
    
    if (words.length < 5) return null;
    
    // Find important words (nouns, longer words)
    const importantWords = words.filter(w => w.length > 4 && !/^(the|and|but|for|are|was|were|been|have|has|had|will|would|could|should)$/i.test(w));
    
    if (importantWords.length === 0) return null;
    
    const keyWord = importantWords[Math.floor(Math.random() * importantWords.length)];
    
    // Create a meaningful question
    const questionText = `Based on the following statement: "${sentence}", what role does "${keyWord}" play?`;
    
    // Generate meaningful options
    const correctAnswer = `${keyWord} is a central element in this context`;
    const wrongOptions = [
      `${keyWord} is mentioned but not important`,
      `${keyWord} contradicts the main point`,
      `${keyWord} is used incorrectly here`
    ];
    
    const allOptions = [correctAnswer, ...wrongOptions].sort(() => Math.random() - 0.5);
    
    return {
      question: questionText,
      type: 'mcq',
      options: allOptions,
      correctAnswer: correctAnswer,
      points: 1
    };
  } catch (error) {
    console.error('Error in generateMCQ:', error);
    return null;
  }
};

// Generate Fill-in-the-blank Question
const generateFillBlank = (sentence) => {
  try {
    if (!sentence || typeof sentence !== 'string' || sentence.trim().length < 20) {
      return null;
    }
    
    // Clean and prepare sentence
    const cleanSentence = sentence.trim();
    const words = cleanSentence.split(' ').filter(w => w && w.length > 2);
    
    if (words.length < 6) return null;
    
    // Find meaningful words to blank out (avoid articles, prepositions)
    const meaningfulWords = words
      .map((word, index) => ({ word: word.replace(/[^a-zA-Z0-9]/g, ''), index, original: word }))
      .filter(item => 
        item.word.length > 3 && 
        !/^(the|and|but|for|are|was|were|been|have|has|had|will|would|could|should|with|from|they|this|that|when|where|what|how)$/i.test(item.word)
      )
      .filter(item => item.index > 0 && item.index < words.length - 1);  // Avoid first and last words
    
    if (meaningfulWords.length === 0) return null;
    
    // Select a word to blank out
    const selectedItem = meaningfulWords[Math.floor(Math.random() * meaningfulWords.length)];
    const blankWord = selectedItem.word;
    
    // Create the question by replacing the word with blank
    const questionWords = [...words];
    questionWords[selectedItem.index] = '______';
    const questionText = `Fill in the blank: "${questionWords.join(' ')}"`;
    
    return {
      question: questionText,
      type: 'fillblank',
      correctAnswer: blankWord,
      points: 1,
      options: []
    };
  } catch (error) {
    console.error('Error in generateFillBlank:', error);
    return null;
  }
};

// Generate Short Answer Question
const generateShortAnswer = (sentence) => {
  try {
    if (!sentence || typeof sentence !== 'string' || sentence.trim().length < 20) {
      return null;
    }
    
    const cleanSentence = sentence.trim();
    const words = cleanSentence.split(' ').filter(w => w && w.length > 2);
    
    if (words.length < 5) return null;
    
    // Generate contextual questions based on sentence content
    const questionTypes = [
      () => `What is the main point being made in this statement: "${cleanSentence}"?`,
      () => `Explain the key concept discussed in: "${cleanSentence}"`,
      () => `What conclusion can be drawn from: "${cleanSentence}"?`,
      () => `Summarize the important information in: "${cleanSentence}"`
    ];
    
    const selectedQuestionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
    const questionText = selectedQuestionType();
    
    // Generate a meaningful answer based on key concepts
    const keyWords = words
      .filter(w => w.length > 3 && !/^(the|and|but|for|are|was|were|been|have|has|had|will|would|could|should|with|from|they|this|that)$/i.test(w))
      .slice(0, 8);
    
    const answer = keyWords.length > 0 
      ? `The key concepts include: ${keyWords.join(', ')}`
      : 'Please provide a comprehensive answer based on the given statement';
    
    return {
      question: questionText,
      type: 'shortanswer',
      correctAnswer: answer,
      points: 2,
      options: []
    };
  } catch (error) {
    console.error('Error in generateShortAnswer:', error);
    return null;
  }
};

// Upload PDF and generate questions
router.post('/upload-pdf', adminAuth, upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No PDF file uploaded' });
    }

    const { questionType = 'mixed', maxQuestions = 10 } = req.body;
    console.log('Processing PDF file:', req.file.originalname);
    console.log('Question type preference:', questionType);
    console.log('Max questions requested:', maxQuestions);
    
    // Enhanced error handling for file operations
    let dataBuffer;
    let pdfData;
    
    try {
      dataBuffer = require('fs').readFileSync(req.file.path);
      console.log('File read successfully, size:', dataBuffer.length);
    } catch (fileError) {
      console.error('Error reading PDF file:', fileError);
      return res.status(400).json({ message: 'Error reading PDF file' });
    }
    
    try {
      pdfData = await pdfParse(dataBuffer);
      console.log('PDF parsed successfully, text length:', pdfData.text.length);
    } catch (parseError) {
      console.error('Error parsing PDF:', parseError);
      return res.status(400).json({ message: 'Error parsing PDF file' });
    }
    
    console.log('PDF text preview:', pdfData.text.substring(0, 500));
    
    // Enhanced question generation with better error handling
    let questions = [];
    try {
      questions = parseQuestionsFromPDF(pdfData.text, questionType, parseInt(maxQuestions));
      console.log('Generated questions count:', questions.length);
      
      // Ensure we always return valid questions
      if (!questions || questions.length === 0) {
        console.log('No questions generated, creating basic fallback...');
        questions = [{
          type: 'shortanswer',
          question: 'Based on the uploaded document, what is the main topic discussed?',
          options: [],
          correctAnswer: 'Please provide the correct answer based on the document content',
          points: 2
        }];
      }
    } catch (questionError) {
      console.error('Error generating questions:', questionError);
      // Provide fallback questions
      questions = [{
        type: 'shortanswer',
        question: 'Based on the uploaded document, what is the main topic discussed?',
        options: [],
        correctAnswer: 'Please provide the correct answer based on the document content',
        points: 2
      }];
    }
    
    // Clean up uploaded file safely
    try {
      require('fs').unlinkSync(req.file.path);
      console.log('Uploaded file cleaned up successfully');
    } catch (cleanupError) {
      console.error('Error cleaning up file:', cleanupError);
      // Don't fail the request for cleanup errors
    }
    
    res.json({ questions });
  } catch (error) {
    console.error('PDF processing error:', error);
    
    // Clean up file if it exists
    if (req.file && req.file.path) {
      try {
        require('fs').unlinkSync(req.file.path);
      } catch (cleanupError) {
        console.error('Error cleaning up file after error:', cleanupError);
      }
    }
    
    res.status(500).json({ 
      message: 'Error processing PDF',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Create test
router.post('/', adminAuth, async (req, res) => {
  try {
    const { title, description, duration, questions } = req.body;
    
    const test = new Test({
      title,
      description,
      duration,
      questions,
      createdBy: req.user._id,
      // Auto-publish if test has questions
      isPublished: questions && questions.length > 0
    });
    
    await test.save();
    console.log(`Test created: ${title}, Published: ${test.isPublished}, Questions: ${questions?.length || 0}`);
    res.status(201).json(test);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all tests (admin gets all, students get published only)
router.get('/', auth, async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'student') {
      query.isPublished = true;
    }
    
    console.log(`Fetching tests for ${req.user.role}: ${req.user.name}`);
    console.log('Query:', query);
    
    const tests = await Test.find(query)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });
    
    console.log(`Found ${tests.length} tests for ${req.user.role}`);
    if (req.user.role === 'student') {
      console.log('Published tests:', tests.map(t => ({ title: t.title, isPublished: t.isPublished })));
    }
    
    res.json(tests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single test
router.get('/:id', auth, async (req, res) => {
  try {
    const test = await Test.findById(req.params.id).populate('createdBy', 'name');
    
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }
    
    // Students can only access published tests
    if (req.user.role === 'student' && !test.isPublished) {
      return res.status(403).json({ message: 'Test not available' });
    }
    
    res.json(test);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update test
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const test = await Test.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }
    
    res.json(test);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete test
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const test = await Test.findByIdAndDelete(req.params.id);
    
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }
    
    res.json({ message: 'Test deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Publish/Unpublish test
router.patch('/:id/publish', adminAuth, async (req, res) => {
  try {
    const { isPublished } = req.body;
    
    const test = await Test.findByIdAndUpdate(
      req.params.id,
      { isPublished },
      { new: true }
    );
    
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }
    
    res.json(test);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
