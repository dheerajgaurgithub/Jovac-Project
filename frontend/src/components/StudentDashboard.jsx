import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Avatar,
  Divider,
  LinearProgress,
  Container,
  useTheme,
  alpha
} from '@mui/material';
import {
  PlayArrow,
  Assignment,
  CheckCircle,
  Schedule,
  TrendingUp,
  Person,
  Visibility,
  EmojiEvents,
  StarBorder
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const StudentDashboard = () => {
  const [tests, setTests] = useState([]);
  const [results, setResults] = useState([]);
  const [stats, setStats] = useState({});
  const [profileDialog, setProfileDialog] = useState(false);
  const [profile, setProfile] = useState({ name: '', bio: '' });
  const [error, setError] = useState('');
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    fetchData();
    if (user) {
      setProfile({ name: user.name, bio: user.bio || '' });
    }
  }, [user]);

  const fetchData = async () => {
    try {
      console.log('StudentDashboard: Fetching data...');
      
      // Fetch data with individual error handling
      let testsData = [];
      let resultsData = [];
      let statsData = {};
      
      try {
        const testsRes = await axios.get('/tests');
        testsData = testsRes.data || [];
        console.log('Tests fetched:', testsData.length);
      } catch (error) {
        console.error('Error fetching tests:', error);
        testsData = [];
      }
      
      try {
        const resultsRes = await axios.get('/results/my-results');
        resultsData = resultsRes.data || [];
        console.log('Results fetched:', resultsData.length);
      } catch (error) {
        console.error('Error fetching results:', error);
        resultsData = [];
      }
      
      try {
        const statsRes = await axios.get('/users/stats');
        statsData = statsRes.data || {};
        console.log('Stats fetched:', statsData);
      } catch (error) {
        console.error('Error fetching stats:', error);
        statsData = {};
      }
      
      setTests(testsData);
      setResults(resultsData);
      setStats(statsData);
      
      console.log('StudentDashboard: Data fetch complete');
    } catch (error) {
      console.error('Error in fetchData:', error);
      setError('Failed to load some data');
    }
  };

  const handleStartTest = (testId) => {
    navigate(`/test/${testId}`);
  };

  const handleUpdateProfile = async () => {
    try {
      await axios.put('/users/profile', profile);
      setProfileDialog(false);
      // Refresh user data if needed
    } catch (error) {
      setError('Failed to update profile');
    }
  };

  const getTestStatus = (testId) => {
    try {
      const result = results.find(r => r.test && r.test._id === testId);
      return result ? 'completed' : 'available';
    } catch (error) {
      console.error('Error getting test status:', error);
      return 'available';
    }
  };

  const getTestScore = (testId) => {
    try {
      const result = results.find(r => r.test && r.test._id === testId);
      return result ? `${result.percentage || 0}%` : null;
    } catch (error) {
      console.error('Error getting test score:', error);
      return null;
    }
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 85) return theme.palette.success.main;
    if (percentage >= 70) return theme.palette.info.main;
    if (percentage >= 50) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  try {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Hero Section */}
        <Box 
          sx={{ 
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            borderRadius: 4,
            p: 4,
            mb: 4,
            color: 'white',
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
            <Box display="flex" alignItems="center" mb={2}>
              <Avatar 
                sx={{ 
                  width: 64, 
                  height: 64, 
                  mr: 3,
                  bgcolor: alpha(theme.palette.common.white, 0.2),
                  fontSize: '1.5rem'
                }}
              >
                {user?.name?.charAt(0) || 'S'}
              </Avatar>
              <Box>
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                  Welcome back, {user?.name || 'Student'}!
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                  Ready to continue your learning journey?
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: 2,
              boxShadow: theme.shadows[3]
            }} 
            onClose={() => setError('')}
          >
            {error}
          </Alert>
        )}

        {/* Enhanced Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                height: '100%',
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                color: 'white',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: theme.shadows[8]
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                      Available Tests
                    </Typography>
                    <Typography variant="h3" fontWeight="bold">
                      {stats.availableTests || 0}
                    </Typography>
                  </Box>
                  <Assignment sx={{ fontSize: 48, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                height: '100%',
                background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
                color: 'white',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: theme.shadows[8]
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                      Completed
                    </Typography>
                    <Typography variant="h3" fontWeight="bold">
                      {stats.completedTests || 0}
                    </Typography>
                  </Box>
                  <CheckCircle sx={{ fontSize: 48, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                height: '100%',
                background: `linear-gradient(135deg, ${theme.palette.info.main}, ${theme.palette.info.dark})`,
                color: 'white',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: theme.shadows[8]
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                      Average Score
                    </Typography>
                    <Typography variant="h3" fontWeight="bold">
                      {Math.round(stats.averageScore || 0)}%
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={stats.averageScore || 0}
                      sx={{ 
                        mt: 1,
                        height: 6,
                        borderRadius: 3,
                        bgcolor: alpha(theme.palette.common.white, 0.3),
                        '& .MuiLinearProgress-bar': {
                          bgcolor: 'white'
                        }
                      }}
                    />
                  </Box>
                  <TrendingUp sx={{ fontSize: 48, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                height: '100%',
                background: `linear-gradient(135deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
                color: 'white',
                cursor: 'pointer',
                transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: theme.shadows[8]
                }
              }}
              onClick={() => setProfileDialog(true)}
            >
              <CardContent sx={{ p: 3 }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="body2" sx={{ opacity: 0.8, mb: 1 }}>
                      Profile
                    </Typography>
                    <Typography variant="h6" fontWeight="bold">
                      Edit Profile
                    </Typography>
                  </Box>
                  <Person sx={{ fontSize: 48, opacity: 0.8 }} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Available Tests Section */}
        <Card 
          sx={{ 
            mb: 4, 
            borderRadius: 3,
            boxShadow: theme.shadows[4],
            overflow: 'hidden'
          }}
        >
          <Box 
            sx={{ 
              background: `linear-gradient(90deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
              p: 3
            }}
          >
            <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
              <Assignment sx={{ mr: 2, verticalAlign: 'middle' }} />
              Available Tests
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Choose from the available tests below to start your assessment
            </Typography>
          </Box>
          
          <CardContent sx={{ p: 3 }}>
            {tests.length === 0 ? (
              <Box textAlign="center" py={6}>
                <StarBorder sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No tests available at the moment.
                </Typography>
                <Typography variant="body2" color="text.disabled">
                  Check back later for new assessments!
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={3}>
                {tests.map((test) => {
                  const status = getTestStatus(test._id);
                  const score = getTestScore(test._id);
                  
                  return (
                    <Grid item xs={12} md={6} lg={4} key={test._id}>
                      <Card 
                        variant="outlined"
                        sx={{
                          height: '100%',
                          borderRadius: 3,
                          transition: 'all 0.3s ease-in-out',
                          border: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: theme.shadows[8],
                            borderColor: theme.palette.primary.main
                          }
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Typography variant="h5" fontWeight="bold" gutterBottom>
                            {test.title}
                          </Typography>
                          <Typography color="text.secondary" paragraph sx={{ minHeight: 60 }}>
                            {test.description}
                          </Typography>
                          
                          <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
                            <Chip
                              icon={<Schedule />}
                              label={`${test.duration} min`}
                              size="small"
                              variant="outlined"
                              sx={{ borderRadius: 2 }}
                            />
                            <Chip
                              icon={<Assignment />}
                              label={`${test.questions.length} questions`}
                              size="small"
                              variant="outlined"
                              sx={{ borderRadius: 2 }}
                            />
                            <Chip
                              label={status === 'completed' ? 'Completed' : 'Available'}
                              color={status === 'completed' ? 'success' : 'primary'}
                              size="small"
                              sx={{ borderRadius: 2 }}
                            />
                          </Box>
                          
                          {score && (
                            <Box 
                              sx={{ 
                                p: 2, 
                                borderRadius: 2,
                                bgcolor: alpha(theme.palette.success.main, 0.1),
                                border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`
                              }}
                            >
                              <Typography variant="body2" color="success.main" fontWeight="bold">
                                <EmojiEvents sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                                Your Score: {score}
                              </Typography>
                            </Box>
                          )}
                        </CardContent>
                        
                        <CardActions sx={{ p: 3, pt: 0 }}>
                          {status === 'completed' ? (
                            <Button
                              component={Link}
                              to="/results"
                              variant="outlined"
                              size="large"
                              fullWidth
                              startIcon={<Visibility />}
                              sx={{ borderRadius: 2, py: 1.5 }}
                            >
                              View Result
                            </Button>
                          ) : (
                            <Button
                              variant="contained"
                              size="large"
                              fullWidth
                              startIcon={<PlayArrow />}
                              onClick={() => handleStartTest(test._id)}
                              sx={{ 
                                borderRadius: 2, 
                                py: 1.5,
                                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                                '&:hover': {
                                  background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`
                                }
                              }}
                            >
                              Start Test
                            </Button>
                          )}
                        </CardActions>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            )}
          </CardContent>
        </Card>

        {/* Recent Results Section */}
        <Card 
          sx={{ 
            borderRadius: 3,
            boxShadow: theme.shadows[4],
            overflow: 'hidden'
          }}
        >
          <Box 
            sx={{ 
              background: `linear-gradient(90deg, ${alpha(theme.palette.success.main, 0.1)}, ${alpha(theme.palette.info.main, 0.1)})`,
              p: 3
            }}
          >
            <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
              <TrendingUp sx={{ mr: 2, verticalAlign: 'middle' }} />
              Recent Results
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Track your progress and performance over time
            </Typography>
          </Box>
          
          <CardContent sx={{ p: 0 }}>
            {results.length === 0 ? (
              <Box textAlign="center" py={6}>
                <CheckCircle sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                  No test results yet
                </Typography>
                <Typography variant="body2" color="text.disabled">
                  Take a test to see your results here
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.05) }}>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>Test</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>Score</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>Percentage</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {results.slice(0, 5).map((result, index) => (
                      <TableRow 
                        key={result._id}
                        sx={{ 
                          '&:hover': { 
                            bgcolor: alpha(theme.palette.primary.main, 0.02) 
                          },
                          '&:nth-of-type(even)': {
                            bgcolor: alpha(theme.palette.grey[500], 0.02)
                          }
                        }}
                      >
                        <TableCell sx={{ fontWeight: 500 }}>
                          {result.test.title}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="bold">
                            {result.totalScore}/{result.maxScore}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`${result.percentage}%`}
                            size="small"
                            sx={{
                              bgcolor: alpha(getScoreColor(result.percentage), 0.1),
                              color: getScoreColor(result.percentage),
                              fontWeight: 'bold',
                              borderRadius: 2
                            }}
                          />
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
                          <Button
                            component={Link}
                            to={`/results`}
                            size="small"
                            variant="outlined"
                            startIcon={<Visibility />}
                            sx={{ borderRadius: 2 }}
                          >
                            View Details
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
            
            {results.length > 5 && (
              <Box textAlign="center" p={3}>
                <Button 
                  component={Link} 
                  to="/results" 
                  variant="contained"
                  size="large"
                  sx={{ borderRadius: 2, px: 4 }}
                >
                  View All Results
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Enhanced Profile Dialog */}
        <Dialog 
          open={profileDialog} 
          onClose={() => setProfileDialog(false)} 
          maxWidth="sm" 
          fullWidth
          sx={{
            '& .MuiDialog-paper': {
              borderRadius: 3,
              boxShadow: theme.shadows[8]
            }
          }}
        >
          <DialogTitle sx={{ pb: 1 }}>
            <Box display="flex" alignItems="center">
              <Avatar sx={{ mr: 2, bgcolor: theme.palette.primary.main }}>
                <Person />
              </Avatar>
              <Typography variant="h5" fontWeight="bold">
                Edit Profile
              </Typography>
            </Box>
          </DialogTitle>
          <Divider />
          
          <DialogContent sx={{ pt: 3 }}>
            <TextField
              autoFocus
              margin="dense"
              label="Full Name"
              fullWidth
              variant="outlined"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              sx={{ 
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />
            <TextField
              margin="dense"
              label="Bio"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              placeholder="Tell us about yourself..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2
                }
              }}
            />
          </DialogContent>
          
          <DialogActions sx={{ p: 3, pt: 2 }}>
            <Button 
              onClick={() => setProfileDialog(false)}
              variant="outlined"
              sx={{ borderRadius: 2, px: 3 }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateProfile} 
              variant="contained"
              sx={{ 
                borderRadius: 2, 
                px: 3,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`
              }}
            >
              Update Profile
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    );
  } catch (error) {
    console.error('StudentDashboard render error:', error);
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Student Dashboard
        </Typography>
        <Alert 
          severity="error" 
          sx={{ 
            mt: 2,
            borderRadius: 2,
            boxShadow: theme.shadows[3]
          }}
        >
          Something went wrong loading the dashboard. Please refresh the page.
        </Alert>
      </Container>
    );
  }
};

export default StudentDashboard;