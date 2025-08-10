import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
  Paper,
  Container,
  Stepper,
  Step,
  StepLabel,
  useTheme,
  alpha,
  Divider,
  CircularProgress,
  Fade,
  Slide
} from '@mui/material';
import { 
  Timer, 
  Send, 
  NavigateNext, 
  NavigateBefore, 
  QuestionAnswer,
  CheckCircle,
  RadioButtonUnchecked,
  Assignment,
  Warning
} from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const TestTaking = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    fetchTest();
  }, [testId]);

  useEffect(() => {
    if (test && startTime) {
      const timer = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000 / 60);
        const remaining = test.duration - elapsed;
        
        if (remaining <= 0) {
          handleAutoSubmit();
        } else {
          setTimeLeft(remaining);
        }
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [test, startTime]);

  const fetchTest = async () => {
    try {
      const response = await axios.get(`/tests/${testId}`);
      setTest(response.data);
      setTimeLeft(response.data.duration);
      setStartTime(Date.now());
      setLoading(false);
    } catch (error) {
      setError('Failed to load test');
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNext = () => {
    if (currentQuestion < test.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    setShowSubmitDialog(true);
  };

  const handleAutoSubmit = () => {
    submitTest();
  };

  const submitTest = async () => {
    console.log('=== TEST SUBMISSION START ===');
    setSubmitting(true);
    setError('');
    
    try {
      // Check authentication first
      const token = localStorage.getItem('token');
      console.log('Auth token exists:', !!token);
      console.log('Auth token preview:', token ? `${token.substring(0, 20)}...` : 'none');
      
      // Check axios defaults
      console.log('Axios base URL:', axios.defaults.baseURL);
      console.log('Axios auth header:', axios.defaults.headers.common['Authorization'] ? 'present' : 'missing');
      
      // Validate data before submission
      if (!test || !test._id) {
        throw new Error('Test data is missing');
      }
      
      if (!startTime) {
        throw new Error('Start time is missing');
      }
      
      console.log('Test ID:', test._id);
      console.log('Current answers:', answers);
      console.log('Number of questions:', test.questions?.length || 0);
      
      const formattedAnswers = Object.entries(answers).map(([questionId, userAnswer]) => ({
        questionId,
        userAnswer: userAnswer || ''
      }));

      const timeSpent = Math.floor((Date.now() - startTime) / 1000 / 60);
      
      // Calculate score and percentage
      let correctAnswers = 0;
      const totalQuestions = test.questions.length;
      
      formattedAnswers.forEach(answer => {
        const question = test.questions.find(q => q._id === answer.questionId);
        if (question && question.correctAnswer && 
            answer.userAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim()) {
          correctAnswers++;
        }
      });
      
      const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
      
      console.log('Formatted answers:', formattedAnswers);
      console.log('Time spent:', timeSpent, 'minutes');
      console.log('Score calculation:', {
        correctAnswers,
        totalQuestions,
        percentage
      });
      
      const submissionData = {
        testId: test._id,
        answers: formattedAnswers,
        timeSpent,
        percentage
      };
      
      console.log('Submission data:', submissionData);
      console.log('Making request to:', `${axios.defaults.baseURL}/results`);
      
      // Test connectivity first
      console.log('Testing server connectivity...');
      try {
        const healthCheck = await axios.get('/auth/me');
        console.log('Server connectivity OK, user:', healthCheck.data?.name);
      } catch (healthError) {
        console.error('Server connectivity failed:', healthError);
        throw new Error('Cannot connect to server. Please check if the backend is running.');
      }
      
      const response = await axios.post('/results', submissionData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': axios.defaults.headers.common['Authorization']
        },
        timeout: 10000 // 10 second timeout
      });

      console.log('Submission response:', response.data);
      console.log('Submission successful!');

      navigate('/results', { 
        state: { 
          newResult: response.data,
          message: 'Test submitted successfully!' 
        }
      });
    } catch (error) {
      console.error('Test submission error:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: error.config
      });
      
      let errorMessage = 'Failed to submit test';
      
      if (error.response) {
        // Server responded with error status
        console.error('Server error response:', error.response.data);
        const status = error.response.status;
        const serverMessage = error.response.data?.message;
        
        if (status === 401) {
          errorMessage = 'Authentication failed. Please log in again.';
        } else if (status === 400) {
          errorMessage = serverMessage || 'Invalid submission data';
        } else if (status === 404) {
          errorMessage = 'Test not found or endpoint not available';
        } else if (status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else {
          errorMessage = serverMessage || `Server error: ${status}`;
        }
      } else if (error.request) {
        // Request was made but no response received
        console.error('No response received:', error.request);
        errorMessage = 'No response from server. Please check your connection and ensure the backend is running.';
      } else {
        // Something else happened
        console.error('Error message:', error.message);
        errorMessage = error.message || 'An unexpected error occurred';
      }
      
      setError(errorMessage);
      setSubmitting(false);
    }
  };

  const getProgress = () => {
    return ((currentQuestion + 1) / test.questions.length) * 100;
  };

  const getAnsweredCount = () => {
    return Object.keys(answers).length;
  };

  const formatTime = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  };

  const getTimeColor = () => {
    if (timeLeft <= 5) return 'error';
    if (timeLeft <= 10) return 'warning';
    return 'primary';
  };

  const getTimeIcon = () => {
    if (timeLeft <= 5) return <Warning />;
    return <Timer />;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box 
          display="flex" 
          flexDirection="column"
          justifyContent="center" 
          alignItems="center" 
          minHeight="60vh"
          gap={3}
        >
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" color="text.secondary">
            Loading test...
          </Typography>
          <Typography variant="body2" color="text.disabled">
            Please wait while we prepare your assessment
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert 
          severity="error" 
          sx={{ 
            borderRadius: 3,
            boxShadow: theme.shadows[3]
          }}
        >
          {error}
        </Alert>
      </Container>
    );
  }

  if (!test) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert 
          severity="error" 
          sx={{ 
            borderRadius: 3,
            boxShadow: theme.shadows[3]
          }}
        >
          Test not found
        </Alert>
      </Container>
    );
  }

  const question = test.questions[currentQuestion];

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header Section */}
      <Paper 
        elevation={0}
        sx={{ 
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
          color: 'white',
          p: 4,
          borderRadius: 4,
          mb: 4,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="7" cy="7" r="7"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            opacity: 0.3
          }
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" flexWrap="wrap" gap={2}>
            <Box>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                <Assignment sx={{ mr: 2, verticalAlign: 'middle' }} />
                {test.title}
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Question {currentQuestion + 1} of {test.questions.length}
              </Typography>
            </Box>
            
            <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
              <Chip
                icon={getTimeIcon()}
                label={`${formatTime(timeLeft)}`}
                color={getTimeColor()}
                variant="filled"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '0.875rem',
                  '& .MuiChip-icon': {
                    color: 'white'
                  }
                }}
              />
              <Box 
                sx={{ 
                  bgcolor: 'rgba(255,255,255,0.2)', 
                  px: 2, 
                  py: 1, 
                  borderRadius: 2,
                  textAlign: 'center'
                }}
              >
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Answered
                </Typography>
                <Typography variant="h6" fontWeight="bold">
                  {getAnsweredCount()}/{test.questions.length}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Paper>

      {/* Progress Section */}
      <Card 
        elevation={2}
        sx={{ 
          mb: 4, 
          borderRadius: 3,
          overflow: 'hidden'
        }}
      >
        <CardContent sx={{ pb: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="body1" fontWeight="500" color="primary">
              Progress: {Math.round(getProgress())}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {getAnsweredCount()} questions completed
            </Typography>
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={getProgress()} 
            sx={{ 
              height: 8,
              borderRadius: 4,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
              }
            }}
          />
        </CardContent>
      </Card>

      {/* Question Card */}
      <Fade in={true} timeout={300}>
        <Card 
          elevation={4}
          sx={{ 
            mb: 4,
            borderRadius: 3,
            border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
            overflow: 'hidden'
          }}
        >
          {/* Question Header */}
          <Box 
            sx={{ 
              background: `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.secondary.main, 0.05)})`,
              p: 3,
              borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`
            }}
          >
            <Box display="flex" alignItems="center" gap={2} mb={1}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '1.1rem'
                }}
              >
                {currentQuestion + 1}
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Question Type: {question.type.toUpperCase()}
                </Typography>
                <Chip 
                  size="small" 
                  label={answers[question._id] ? 'Answered' : 'Unanswered'}
                  color={answers[question._id] ? 'success' : 'default'}
                  icon={answers[question._id] ? <CheckCircle /> : <RadioButtonUnchecked />}
                  sx={{ mt: 0.5 }}
                />
              </Box>
            </Box>
          </Box>

          <CardContent sx={{ p: 4 }}>
            <Typography 
              variant="h5" 
              fontWeight="500"
              sx={{ 
                mb: 4, 
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                color: theme.palette.text.primary
              }}
            >
              <QuestionAnswer sx={{ mr: 2, verticalAlign: 'middle', color: theme.palette.primary.main }} />
              {question.question}
            </Typography>
            
            {question.type === 'mcq' && (
              <RadioGroup
                value={answers[question._id] || ''}
                onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                sx={{ mt: 3 }}
              >
                {question.options.map((option, index) => (
                  <Paper
                    key={index}
                    elevation={0}
                    sx={{
                      mb: 2,
                      border: `2px solid ${
                        answers[question._id] === option 
                          ? theme.palette.primary.main 
                          : alpha(theme.palette.divider, 0.2)
                      }`,
                      borderRadius: 3,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        borderColor: theme.palette.primary.main,
                        boxShadow: theme.shadows[2]
                      },
                      bgcolor: answers[question._id] === option 
                        ? alpha(theme.palette.primary.main, 0.05)
                        : 'transparent'
                    }}
                  >
                    <FormControlLabel
                      value={option}
                      control={
                        <Radio 
                          sx={{ 
                            ml: 2,
                            '&.Mui-checked': {
                              color: theme.palette.primary.main
                            }
                          }} 
                        />
                      }
                      label={
                        <Typography 
                          sx={{ 
                            ml: 1, 
                            py: 2,
                            pr: 3,
                            lineHeight: 1.5,
                            fontWeight: answers[question._id] === option ? 500 : 400
                          }}
                        >
                          <strong>{String.fromCharCode(65 + index)}.</strong> {option}
                        </Typography>
                      }
                      sx={{ 
                        width: '100%',
                        margin: 0,
                        alignItems: 'flex-start',
                        '& .MuiFormControlLabel-label': {
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                          width: '100%'
                        }
                      }}
                    />
                  </Paper>
                ))}
              </RadioGroup>
            )}
            
            {(question.type === 'fillblank' || question.type === 'shortanswer') && (
              <Box sx={{ mt: 3 }}>
                <Typography 
                  variant="subtitle1" 
                  fontWeight="500"
                  color="primary" 
                  sx={{ mb: 2 }}
                >
                  {question.type === 'fillblank' ? '✏️ Fill in the blank:' : '📝 Short Answer:'}
                </Typography>
                <TextField
                  fullWidth
                  multiline={question.type === 'shortanswer'}
                  rows={question.type === 'shortanswer' ? 6 : 1}
                  placeholder={
                    question.type === 'fillblank' 
                      ? 'Type your answer here...' 
                      : 'Provide a detailed answer...'
                  }
                  value={answers[question._id] || ''}
                  onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                  variant="outlined"
                  sx={{ 
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      fontSize: '1rem',
                      '&:hover fieldset': {
                        borderColor: theme.palette.primary.main
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: theme.palette.primary.main
                      }
                    }
                  }}
                />
              </Box>
            )}
          </CardContent>
        </Card>
      </Fade>

      {/* Navigation Section */}
      <Card 
        elevation={2}
        sx={{ 
          borderRadius: 3,
          overflow: 'hidden'
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Button
              variant="outlined"
              size="large"
              startIcon={<NavigateBefore />}
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              sx={{ 
                borderRadius: 2,
                px: 3,
                py: 1.5,
                fontWeight: 500
              }}
            >
              Previous
            </Button>
            
            <Box display="flex" alignItems="center" gap={1}>
              {Array.from({ length: Math.min(test.questions.length, 10) }, (_, i) => (
                <Box
                  key={i}
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    bgcolor: i === currentQuestion 
                      ? theme.palette.primary.main 
                      : alpha(theme.palette.primary.main, 0.2),
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
              {test.questions.length > 10 && (
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  +{test.questions.length - 10}
                </Typography>
              )}
            </Box>
            
            <Box display="flex" gap={2}>
              {currentQuestion < test.questions.length - 1 ? (
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<NavigateNext />}
                  onClick={handleNext}
                  sx={{ 
                    borderRadius: 2,
                    px: 3,
                    py: 1.5,
                    fontWeight: 500,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
                  }}
                >
                  Next
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="success"
                  size="large"
                  startIcon={<Send />}
                  onClick={handleSubmit}
                  sx={{ 
                    borderRadius: 2,
                    px: 3,
                    py: 1.5,
                    fontWeight: 500,
                    background: `linear-gradient(45deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`
                  }}
                >
                  Submit Test
                </Button>
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Enhanced Submit Dialog */}
      <Dialog 
        open={showSubmitDialog} 
        onClose={() => setShowSubmitDialog(false)}
        maxWidth="sm"
        fullWidth
        TransitionComponent={Slide}
        TransitionProps={{ direction: 'up' }}
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 3,
            boxShadow: theme.shadows[8]
          }
        }}
      >
        <DialogTitle sx={{ pb: 2 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}
            >
              <Send />
            </Box>
            <Typography variant="h5" fontWeight="bold">
              Submit Test
            </Typography>
          </Box>
        </DialogTitle>
        <Divider />
        
        <DialogContent sx={{ py: 3 }}>
          <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
            <Typography variant="body1">
              You have answered <strong>{getAnsweredCount()}</strong> out of <strong>{test.questions.length}</strong> questions.
            </Typography>
          </Alert>
          
          <Typography variant="body1" paragraph>
            Are you sure you want to submit your test?
          </Typography>
          <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
            ⚠️ Once submitted, you cannot make any changes to your answers.
          </Typography>
          
          {getAnsweredCount() < test.questions.length && (
            <Alert severity="warning" sx={{ mt: 2, borderRadius: 2 }}>
              You have <strong>{test.questions.length - getAnsweredCount()}</strong> unanswered questions.
            </Alert>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button 
            onClick={() => setShowSubmitDialog(false)}
            variant="outlined"
            size="large"
            sx={{ borderRadius: 2, px: 3 }}
          >
            Cancel
          </Button>
          <Button
            onClick={submitTest}
            variant="contained"
            color="success"
            size="large"
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <Send />}
            sx={{ 
              borderRadius: 2, 
              px: 3,
              background: `linear-gradient(45deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`
            }}
          >
            {submitting ? 'Submitting...' : 'Submit Test'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TestTaking;