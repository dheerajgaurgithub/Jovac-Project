import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Grid,
  Paper,
  Container,
  Avatar,
  Divider,
  LinearProgress,
  Fade,
  Slide,
  Zoom,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
  CircularProgress
} from '@mui/material';
import {
  Visibility,
  GetApp,
  CheckCircle,
  Cancel,
  Schedule,
  Assessment,
  TrendingUp,
  School,
  Person,
  Close,
  Download,
  Analytics,
  Quiz,
  EmojiEvents,
  Star,
  Timeline
} from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Results = () => {
  const theme = useTheme();
  const [results, setResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [detailDialog, setDetailDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const { user } = useAuth();
  const location = useLocation();

  useEffect(() => {
    fetchResults();
    
    // Show success message if redirected from test submission
    if (location.state?.message) {
      console.log(location.state.message);
    }
  }, []);

  const fetchResults = async () => {
    try {
      const endpoint = user.role === 'admin' ? '/results' : '/results/my-results';
      const response = await axios.get(endpoint);
      setResults(response.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to load results');
      setLoading(false);
    }
  };

  const handleViewDetails = async (resultId) => {
    try {
      const response = await axios.get(`/results/${resultId}`);
      setSelectedResult(response.data);
      setDetailDialog(true);
    } catch (error) {
      setError('Failed to load result details');
    }
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'success';
    if (percentage >= 60) return 'warning';
    return 'error';
  };

  const getGrade = (percentage) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 50) return 'D';
    return 'F';
  };

  const getGradeIcon = (percentage) => {
    if (percentage >= 90) return <EmojiEvents sx={{ color: '#FFD700' }} />;
    if (percentage >= 80) return <Star sx={{ color: theme.palette.success.main }} />;
    if (percentage >= 60) return <TrendingUp sx={{ color: theme.palette.warning.main }} />;
    return <Timeline sx={{ color: theme.palette.error.main }} />;
  };

  const calculateStats = () => {
    if (results.length === 0) return { average: 0, highest: 0, lowest: 0, totalTests: 0 };
    
    const percentages = results.map(r => r.percentage);
    return {
      average: Math.round(percentages.reduce((a, b) => a + b, 0) / percentages.length),
      highest: Math.max(...percentages),
      lowest: Math.min(...percentages),
      totalTests: results.length
    };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress size={60} thickness={4} sx={{ mb: 3 }} />
          <Typography variant="h6" color="text.secondary">
            Loading your results...
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Please wait while we fetch your test results
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Fade in>
          <Alert 
            severity="error" 
            sx={{ 
              borderRadius: 3,
              '& .MuiAlert-icon': { fontSize: '2rem' }
            }}
          >
            <Typography variant="h6">Error Loading Results</Typography>
            <Typography>{error}</Typography>
          </Alert>
        </Fade>
      </Container>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.light, 0.1)} 0%, ${alpha(theme.palette.secondary.light, 0.05)} 100%)`,
      py: 4
    }}>
      <Container maxWidth="lg">
        <Fade in timeout={800}>
          <Box>
            {/* Header Section */}
            <Paper 
              elevation={0} 
              sx={{ 
                p: 4, 
                mb: 4, 
                borderRadius: 4,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                color: 'white',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Assessment sx={{ fontSize: '3rem', mr: 2 }} />
                  <Typography variant="h3" sx={{ fontWeight: 700 }}>
                    {user.role === 'admin' ? 'All Test Results' : 'My Test Results'}
                  </Typography>
                </Box>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  {user.role === 'admin' 
                    ? 'Comprehensive overview of all student test performances' 
                    : 'Track your progress and performance across all tests'
                  }
                </Typography>
              </Box>
              
              {/* Decorative elements */}
              <Box sx={{
                position: 'absolute',
                top: -50,
                right: -50,
                width: 200,
                height: 200,
                borderRadius: '50%',
                background: alpha(theme.palette.primary.light, 0.1),
                zIndex: 0
              }} />
            </Paper>

            {/* Stats Section for Students */}
            {user.role !== 'admin' && results.length > 0 && (
              <Slide direction="up" in timeout={1000}>
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ 
                      p: 3, 
                      textAlign: 'center',
                      borderRadius: 3,
                      background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)}, ${alpha(theme.palette.success.light, 0.05)})`,
                      border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 25px rgba(76, 175, 80, 0.2)'
                      },
                      transition: 'all 0.3s ease'
                    }}>
                      <Avatar sx={{ 
                        width: 60, 
                        height: 60, 
                        mx: 'auto', 
                        mb: 2,
                        background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`
                      }}>
                        <Quiz sx={{ fontSize: '2rem' }} />
                      </Avatar>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.success.main }}>
                        {stats.totalTests}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Tests Completed
                      </Typography>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ 
                      p: 3, 
                      textAlign: 'center',
                      borderRadius: 3,
                      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.primary.light, 0.05)})`,
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 25px rgba(25, 118, 210, 0.2)'
                      },
                      transition: 'all 0.3s ease'
                    }}>
                      <Avatar sx={{ 
                        width: 60, 
                        height: 60, 
                        mx: 'auto', 
                        mb: 2,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
                      }}>
                        <Analytics sx={{ fontSize: '2rem' }} />
                      </Avatar>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                        {stats.average}%
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Average Score
                      </Typography>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ 
                      p: 3, 
                      textAlign: 'center',
                      borderRadius: 3,
                      background: `linear-gradient(135deg, ${alpha(theme.palette.warning.main, 0.1)}, ${alpha(theme.palette.warning.light, 0.05)})`,
                      border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 25px rgba(255, 152, 0, 0.2)'
                      },
                      transition: 'all 0.3s ease'
                    }}>
                      <Avatar sx={{ 
                        width: 60, 
                        height: 60, 
                        mx: 'auto', 
                        mb: 2,
                        background: `linear-gradient(135deg, ${theme.palette.warning.main}, ${theme.palette.warning.dark})`
                      }}>
                        <EmojiEvents sx={{ fontSize: '2rem' }} />
                      </Avatar>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.warning.main }}>
                        {stats.highest}%
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Highest Score
                      </Typography>
                    </Card>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ 
                      p: 3, 
                      textAlign: 'center',
                      borderRadius: 3,
                      background: `linear-gradient(135deg, ${alpha(theme.palette.info.main, 0.1)}, ${alpha(theme.palette.info.light, 0.05)})`,
                      border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 25px rgba(33, 150, 243, 0.2)'
                      },
                      transition: 'all 0.3s ease'
                    }}>
                      <Avatar sx={{ 
                        width: 60, 
                        height: 60, 
                        mx: 'auto', 
                        mb: 2,
                        background: `linear-gradient(135deg, ${theme.palette.info.main}, ${theme.palette.info.dark})`
                      }}>
                        <TrendingUp sx={{ fontSize: '2rem' }} />
                      </Avatar>
                      <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.info.main }}>
                        {getGrade(stats.average)}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        Current Grade
                      </Typography>
                    </Card>
                  </Grid>
                </Grid>
              </Slide>
            )}

            {/* Results Table */}
            {results.length === 0 ? (
              <Fade in timeout={1200}>
                <Card sx={{ 
                  borderRadius: 4,
                  background: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                }}>
                  <CardContent sx={{ p: 6, textAlign: 'center' }}>
                    <Avatar sx={{ 
                      width: 100, 
                      height: 100, 
                      mx: 'auto', 
                      mb: 3,
                      background: alpha(theme.palette.primary.main, 0.1)
                    }}>
                      <Assessment sx={{ fontSize: '3rem', color: theme.palette.primary.main }} />
                    </Avatar>
                    <Typography variant="h5" gutterBottom color="text.primary" sx={{ fontWeight: 600 }}>
                      {user.role === 'admin' ? 'No Results Available' : 'No Tests Completed Yet'}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                      {user.role === 'admin' 
                        ? 'No test results are available yet. Results will appear here once students start taking tests.' 
                        : 'You haven\'t taken any tests yet. Visit your dashboard to start your first test and see your results here.'
                      }
                    </Typography>
                    {user.role !== 'admin' && (
                      <Button 
                        variant="contained" 
                        size="large" 
                        sx={{
                          borderRadius: 25,
                          px: 4,
                          py: 1.5,
                          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                          '&:hover': {
                            background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 25px rgba(0,0,0,0.2)'
                          }
                        }}
                      >
                        <School sx={{ mr: 1 }} />
                        Go to Dashboard
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Fade>
            ) : (
              <Zoom in timeout={1400}>
                <Card sx={{ 
                  borderRadius: 4,
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                  overflow: 'hidden'
                }}>
                  <Box sx={{ 
                    p: 3, 
                    background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.secondary.main, 0.02)})`,
                    borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                  }}>
                    <Typography variant="h5" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                      <Assessment sx={{ mr: 2, color: theme.palette.primary.main }} />
                      Test Results Overview
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Detailed performance analysis and scores
                    </Typography>
                  </Box>
                  
                  <CardContent sx={{ p: 0 }}>
                    <TableContainer>
                      <Table>
                        <TableHead>
                          <TableRow sx={{ 
                            background: alpha(theme.palette.grey[50], 0.8),
                            '& .MuiTableCell-head': {
                              fontWeight: 700,
                              color: theme.palette.text.primary,
                              borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`
                            }
                          }}>
                            {user.role === 'admin' && (
                              <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                  <Person sx={{ mr: 1, fontSize: '1.2rem' }} />
                                  Student
                                </Box>
                              </TableCell>
                            )}
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Quiz sx={{ mr: 1, fontSize: '1.2rem' }} />
                                Test
                              </Box>
                            </TableCell>
                            <TableCell>Score</TableCell>
                            <TableCell>Percentage</TableCell>
                            <TableCell>Grade</TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Schedule sx={{ mr: 1, fontSize: '1.2rem' }} />
                                Time
                              </Box>
                            </TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {results.map((result, index) => (
                            <Fade in timeout={500 + index * 100} key={result._id}>
                              <TableRow sx={{
                                '&:hover': {
                                  background: alpha(theme.palette.primary.main, 0.04),
                                  transform: 'scale(1.01)',
                                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                                },
                                transition: 'all 0.2s ease',
                                cursor: 'pointer'
                              }}>
                                {user.role === 'admin' && (
                                  <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                      <Avatar sx={{ 
                                        width: 40, 
                                        height: 40, 
                                        mr: 2,
                                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
                                      }}>
                                        {result.student?.name?.charAt(0)?.toUpperCase() || 'U'}
                                      </Avatar>
                                      <Box>
                                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                          {result.student?.name || 'Unknown'}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                          {result.student?.email || ''}
                                        </Typography>
                                      </Box>
                                    </Box>
                                  </TableCell>
                                )}
                                <TableCell>
                                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    {result.test?.title || 'Unknown Test'}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                    {result.totalScore}
                                    <Typography component="span" color="text.secondary">
                                      /{result.maxScore}
                                    </Typography>
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Chip
                                      label={`${result.percentage}%`}
                                      color={getScoreColor(result.percentage)}
                                      size="small"
                                      sx={{ 
                                        fontWeight: 700,
                                        minWidth: 65
                                      }}
                                    />
                                    <LinearProgress
                                      variant="determinate"
                                      value={result.percentage}
                                      color={getScoreColor(result.percentage)}
                                      sx={{ 
                                        width: 60, 
                                        height: 6,
                                        borderRadius: 3
                                      }}
                                    />
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    {getGradeIcon(result.percentage)}
                                    <Typography 
                                      variant="body1" 
                                      sx={{ 
                                        fontWeight: 700,
                                        color: `${getScoreColor(result.percentage)}.main`
                                      }}
                                    >
                                      {getGrade(result.percentage)}
                                    </Typography>
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  <Box display="flex" alignItems="center">
                                    <Schedule sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                                    <Typography variant="body2">
                                      {result.timeSpent} min
                                    </Typography>
                                  </Box>
                                </TableCell>
                                <TableCell>
                                  <Typography variant="body2">
                                    {new Date(result.submittedAt).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric'
                                    })}
                                  </Typography>
                                </TableCell>
                                <TableCell>
                                  <Tooltip title="View detailed results">
                                    <Button
                                      size="small"
                                      variant="contained"
                                      startIcon={<Visibility />}
                                      onClick={() => handleViewDetails(result._id)}
                                      sx={{
                                        borderRadius: 20,
                                        textTransform: 'none',
                                        minWidth: 90,
                                        background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                        '&:hover': {
                                          background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                                          transform: 'translateY(-2px)',
                                          boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                                        }
                                      }}
                                    >
                                      View
                                    </Button>
                                  </Tooltip>
                                </TableCell>
                              </TableRow>
                            </Fade>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Card>
              </Zoom>
            )}
          </Box>
        </Fade>

        {/* Enhanced Result Detail Dialog */}
        <Dialog 
          open={detailDialog} 
          onClose={() => setDetailDialog(false)} 
          maxWidth="lg" 
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)'
            }
          }}
        >
          <DialogTitle sx={{ 
            p: 0,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            color: 'white'
          }}>
            <Box sx={{ 
              p: 3, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Assessment sx={{ mr: 2, fontSize: '2rem' }} />
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    Test Result Details
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Comprehensive performance analysis
                  </Typography>
                </Box>
              </Box>
              <IconButton 
                onClick={() => setDetailDialog(false)}
                sx={{ 
                  color: 'white',
                  '&:hover': {
                    background: alpha(theme.palette.common.white, 0.1)
                  }
                }}
              >
                <Close />
              </IconButton>
            </Box>
          </DialogTitle>
          
          <DialogContent sx={{ p: 4 }}>
            {selectedResult && (
              <Box>
                {/* Enhanced Summary */}
                <Paper sx={{ 
                  p: 4, 
                  mb: 4,
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.secondary.main, 0.02)})`,
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
                }}>
                  <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} md={8}>
                      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                        {selectedResult.test.title}
                      </Typography>
                      {user.role === 'admin' && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Avatar sx={{ 
                            width: 32, 
                            height: 32, 
                            mr: 1,
                            background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`
                          }}>
                            {selectedResult.student.name.charAt(0).toUpperCase()}
                          </Avatar>
                          <Typography variant="h6" color="text.secondary">
                            Student: {selectedResult.student.name}
                          </Typography>
                        </Box>
                      )}
                      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Schedule sx={{ mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body1">
                            Time: {selectedResult.timeSpent} minutes
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Quiz sx={{ mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body1">
                            Questions: {selectedResult.answers.length}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <Box textAlign="center">
                        <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
                          <CircularProgress
                            variant="determinate"
                            value={selectedResult.percentage}
                            size={120}
                            thickness={8}
                            color={getScoreColor(selectedResult.percentage)}
                            sx={{
                              '& .MuiCircularProgress-circle': {
                                strokeLinecap: 'round',
                              },
                            }}
                          />
                          <Box
                            sx={{
                              top: 0,
                              left: 0,
                              bottom: 0,
                              right: 0,
                              position: 'absolute',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexDirection: 'column'
                            }}
                          >
                            <Typography variant="h4" sx={{ 
                              fontWeight: 700,
                              color: `${getScoreColor(selectedResult.percentage)}.main`
                            }}>
                              {selectedResult.percentage}%
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Typography variant="h6" color="text.secondary" gutterBottom>
                          {selectedResult.totalScore}/{selectedResult.maxScore} points
                        </Typography>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                          {getGradeIcon(selectedResult.percentage)}
                          <Typography variant="h5" sx={{ 
                            fontWeight: 700,
                            color: `${getScoreColor(selectedResult.percentage)}.main`
                          }}>
                            Grade: {getGrade(selectedResult.percentage)}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Enhanced Question-wise Results */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h5" gutterBottom sx={{ 
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    <Analytics sx={{ mr: 2, color: theme.palette.primary.main }} />
                    Question-wise Analysis
                  </Typography>
                  <Divider sx={{ mb: 3 }} />
                  
                  <Box sx={{ maxHeight: 600, overflow: 'auto', pr: 1 }}>
                    {selectedResult.answers.map((answer, index) => {
                      const question = selectedResult.test.questions.find(q => q._id === answer.questionId);
                      
                      return (
                        <Zoom in timeout={200 + index * 50} key={index}>
                          <Card sx={{ 
                            mb: 3,
                            borderRadius: 3,
                            border: `2px solid ${answer.isCorrect ? alpha(theme.palette.success.main, 0.3) : alpha(theme.palette.error.main, 0.3)}`,
                            background: answer.isCorrect 
                              ? `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.05)}, rgba(255,255,255,0.9))`
                              : `linear-gradient(135deg, ${alpha(theme.palette.error.main, 0.05)}, rgba(255,255,255,0.9))`,
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: `0 8px 25px ${answer.isCorrect ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)'}`
                            },
                            transition: 'all 0.3s ease'
                          }}>
                            <CardContent sx={{ p: 3 }}>
                              <Box display="flex" alignItems="flex-start" gap={2}>
                                <Box sx={{ 
                                  display: 'flex', 
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  width: 50,
                                  height: 50,
                                  borderRadius: '50%',
                                  background: answer.isCorrect 
                                    ? `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`
                                    : `linear-gradient(135deg, ${theme.palette.error.main}, ${theme.palette.error.dark})`,
                                  color: 'white',
                                  flexShrink: 0
                                }}>
                                  {answer.isCorrect ? (
                                    <CheckCircle sx={{ fontSize: '1.5rem' }} />
                                  ) : (
                                    <Cancel sx={{ fontSize: '1.5rem' }} />
                                  )}
                                </Box>
                                
                                <Box flex={1}>
                                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                                    <Chip
                                      label={`Question ${index + 1}`}
                                      color="primary"
                                      variant="outlined"
                                      sx={{ fontWeight: 600 }}
                                    />
                                    <Chip
                                      label={question?.type?.toUpperCase() || 'UNKNOWN'}
                                      size="small"
                                      sx={{ 
                                        background: alpha(theme.palette.info.main, 0.1),
                                        color: theme.palette.info.main,
                                        fontWeight: 600
                                      }}
                                    />
                                  </Box>
                                  
                                  <Typography variant="h6" gutterBottom sx={{ 
                                    fontWeight: 600,
                                    color: theme.palette.text.primary,
                                    lineHeight: 1.4
                                  }}>
                                    {question?.question || 'Question not found'}
                                  </Typography>
                                  
                                  <Grid container spacing={2} sx={{ mt: 1 }}>
                                    <Grid item xs={12} sm={6}>
                                      <Paper sx={{ 
                                        p: 2, 
                                        borderRadius: 2,
                                        background: answer.isCorrect 
                                          ? alpha(theme.palette.success.main, 0.1)
                                          : alpha(theme.palette.error.main, 0.1),
                                        border: `1px solid ${answer.isCorrect 
                                          ? alpha(theme.palette.success.main, 0.3)
                                          : alpha(theme.palette.error.main, 0.3)}`
                                      }}>
                                        <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontWeight: 600 }}>
                                          Your Answer:
                                        </Typography>
                                        <Typography 
                                          variant="body1" 
                                          sx={{ 
                                            fontWeight: 600,
                                            color: answer.isCorrect ? 'success.main' : 'error.main'
                                          }}
                                        >
                                          {answer.userAnswer || 'No answer provided'}
                                        </Typography>
                                      </Paper>
                                    </Grid>
                                    
                                    {!answer.isCorrect && (
                                      <Grid item xs={12} sm={6}>
                                        <Paper sx={{ 
                                          p: 2, 
                                          borderRadius: 2,
                                          background: alpha(theme.palette.success.main, 0.1),
                                          border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`
                                        }}>
                                          <Typography variant="body2" color="text.secondary" gutterBottom sx={{ fontWeight: 600 }}>
                                            Correct Answer:
                                          </Typography>
                                          <Typography variant="body1" sx={{ 
                                            fontWeight: 600,
                                            color: 'success.main'
                                          }}>
                                            {answer.correctAnswer}
                                          </Typography>
                                        </Paper>
                                      </Grid>
                                    )}
                                  </Grid>
                                  
                                  <Box sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center',
                                    mt: 2,
                                    pt: 2,
                                    borderTop: `1px solid ${alpha(theme.palette.grey[300], 0.5)}`
                                  }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                      <Chip
                                        label={`${answer.earnedPoints}/${answer.points} points`}
                                        color={answer.isCorrect ? 'success' : 'error'}
                                        size="small"
                                        sx={{ fontWeight: 600 }}
                                      />
                                      <Typography variant="caption" color="text.secondary">
                                        Weight: {((answer.points / selectedResult.maxScore) * 100).toFixed(1)}%
                                      </Typography>
                                    </Box>
                                    
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                      <LinearProgress
                                        variant="determinate"
                                        value={(answer.earnedPoints / answer.points) * 100}
                                        color={answer.isCorrect ? 'success' : 'error'}
                                        sx={{ 
                                          width: 80, 
                                          height: 8,
                                          borderRadius: 4,
                                          mr: 1
                                        }}
                                      />
                                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                        {Math.round((answer.earnedPoints / answer.points) * 100)}%
                                      </Typography>
                                    </Box>
                                  </Box>
                                </Box>
                              </Box>
                            </CardContent>
                          </Card>
                        </Zoom>
                      );
                    })}
                  </Box>
                </Box>
              </Box>
            )}
          </DialogContent>
          
          <DialogActions sx={{ 
            p: 3, 
            background: alpha(theme.palette.grey[50], 0.8),
            borderTop: `1px solid ${alpha(theme.palette.grey[300], 0.5)}`
          }}>
            <Button
              startIcon={<Download />}
              variant="outlined"
              sx={{
                borderRadius: 25,
                px: 3,
                textTransform: 'none',
                fontWeight: 600
              }}
            >
              Download Report
            </Button>
            <Button 
              onClick={() => setDetailDialog(false)}
              variant="contained"
              sx={{
                borderRadius: 25,
                px: 4,
                textTransform: 'none',
                fontWeight: 600,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`
                }
              }}
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Results;