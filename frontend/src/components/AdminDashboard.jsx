import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Alert,
  Avatar,
  Stack,
  Divider,
  Badge,
  Tooltip,
  LinearProgress,
  CardHeader,
  Fab,
  Zoom
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Upload,
  Visibility,
  GetApp,
  School,
  Assignment,
  People,
  Analytics,
  Dashboard as DashboardIcon,
  TrendingUp,
  AutoAwesome,
  CloudUpload,
  Save,
  Cancel,
  Preview,
  FileDownload,
  VisibilityOff,
  Quiz
} from '@mui/icons-material';
import axios from 'axios';

const AdminDashboard = () => {
  const [tests, setTests] = useState([]);
  const [students, setStudents] = useState([]);
  const [results, setResults] = useState([]);
  const [stats, setStats] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [testForm, setTestForm] = useState({
    title: '',
    description: '',
    duration: 60,
    questions: [],
    maxQuestions: 10,
    questionTypes: ['mcq', 'fillblank', 'shortanswer'],
    preferredType: 'mixed'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [testsRes, studentsRes, resultsRes, statsRes] = await Promise.all([
        axios.get('/tests'),
        axios.get('/users/students'),
        axios.get('/results'),
        axios.get('/users/stats')
      ]);
      
      setTests(testsRes.data);
      setStudents(studentsRes.data);
      setResults(resultsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load data');
    }
  };

  const handleCreateTest = () => {
    setSelectedTest(null);
    setTestForm({
      title: '',
      description: '',
      duration: 60,
      questions: [],
      maxQuestions: 10,
      questionTypes: ['mcq', 'fillblank', 'shortanswer'],
      preferredType: 'mixed'
    });
    setGeneratedQuestions([]);
    setOpenDialog(true);
  };

  const handleEditTest = (test) => {
    setSelectedTest(test);
    setTestForm({
      title: test.title,
      description: test.description,
      duration: test.duration,
      questions: test.questions,
      maxQuestions: test.questions.length || 10
    });
    setOpenDialog(true);
  };

  const handlePdfUpload = async () => {
    if (!pdfFile) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('pdf', pdfFile);
    formData.append('questionType', testForm.preferredType);
    formData.append('maxQuestions', testForm.maxQuestions);

    try {
      const response = await axios.post('/tests/upload-pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const newQuestions = response.data.questions.filter(newQ => 
        !testForm.questions.some(existingQ => 
          existingQ.question.toLowerCase().trim() === newQ.question.toLowerCase().trim()
        )
      );
      
      const availableSlots = testForm.maxQuestions - testForm.questions.length;
      const questionsToAdd = newQuestions.slice(0, availableSlots);
      
      setGeneratedQuestions(questionsToAdd);
      setTestForm(prev => ({
        ...prev,
        questions: [...prev.questions, ...questionsToAdd]
      }));
    } catch (error) {
      setError('Failed to process PDF');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTest = async () => {
    try {
      if (selectedTest) {
        await axios.put(`/tests/${selectedTest._id}`, testForm);
      } else {
        await axios.post('/tests', testForm);
      }
      setOpenDialog(false);
      fetchData();
    } catch (error) {
      setError('Failed to save test');
    }
  };

  const handleDeleteTest = async (testId) => {
    if (window.confirm('Are you sure you want to delete this test?')) {
      try {
        await axios.delete(`/tests/${testId}`);
        fetchData();
      } catch (error) {
        setError('Failed to delete test');
      }
    }
  };

  const handlePublishTest = async (testId, isPublished) => {
    try {
      await axios.patch(`/tests/${testId}/publish`, { isPublished: !isPublished });
      fetchData();
    } catch (error) {
      setError('Failed to update test status');
    }
  };

  const exportResults = async () => {
    try {
      const response = await axios.get('/results/export/csv', {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'test-results.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      setError('Failed to export results');
    }
  };

  const statsCards = [
    {
      title: 'Total Students',
      value: stats.totalStudents || 0,
      icon: <School />,
      color: 'primary',
      bgColor: 'rgba(25, 118, 210, 0.1)',
      trend: '+12%'
    },
    {
      title: 'Total Tests',
      value: stats.totalTests || 0,
      icon: <Assignment />,
      color: 'success',
      bgColor: 'rgba(46, 125, 50, 0.1)',
      trend: '+8%'
    },
    {
      title: 'Published Tests',
      value: stats.publishedTests || 0,
      icon: <Visibility />,
      color: 'warning',
      bgColor: 'rgba(237, 108, 2, 0.1)',
      trend: '+5%'
    },
    {
      title: 'Total Results',
      value: stats.totalResults || 0,
      icon: <Analytics />,
      color: 'error',
      bgColor: 'rgba(211, 47, 47, 0.1)',
      trend: '+25%'
    }
  ];

  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh',
      p: 3
    }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
          <Avatar
            sx={{
              width: 60,
              height: 60,
              bgcolor: 'primary.main',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
          >
            <DashboardIcon sx={{ fontSize: 32 }} />
          </Avatar>
          <Box>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 800,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                mb: 1
              }}
            >
              Admin Dashboard
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Manage tests, students, and monitor performance
            </Typography>
          </Box>
        </Stack>

        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              borderRadius: 3,
              boxShadow: '0 4px 12px rgba(211, 47, 47, 0.15)',
              '& .MuiAlert-icon': { fontSize: 24 }
            }} 
            onClose={() => setError('')}
          >
            {error}
          </Alert>
        )}
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statsCards.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 4,
                border: '1px solid rgba(0,0,0,0.08)',
                background: 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                }
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
                  <Box sx={{ flex: 1 }}>
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ fontWeight: 500, mb: 1 }}
                    >
                      {stat.title}
                    </Typography>
                    <Typography 
                      variant="h3" 
                      sx={{ 
                        fontWeight: 800,
                        color: `${stat.color}.main`,
                        mb: 1
                      }}
                    >
                      {stat.value.toLocaleString()}
                    </Typography>
                    <Chip
                      label={stat.trend}
                      size="small"
                      icon={<TrendingUp />}
                      sx={{
                        bgcolor: 'success.light',
                        color: 'success.dark',
                        fontWeight: 600,
                        fontSize: '0.75rem'
                      }}
                    />
                  </Box>
                  <Avatar
                    sx={{
                      width: 56,
                      height: 56,
                      bgcolor: stat.bgColor,
                      color: `${stat.color}.main`,
                      border: `2px solid rgba(0,0,0,0.05)`
                    }}
                  >
                    {stat.icon}
                  </Avatar>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Tests Management */}
      <Card 
        elevation={0}
        sx={{ 
          mb: 4,
          borderRadius: 4,
          border: '1px solid rgba(0,0,0,0.08)',
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              <Quiz />
            </Avatar>
          }
          title={
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Tests Management
            </Typography>
          }
          subheader="Create, edit, and manage your tests"
          action={
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleCreateTest}
              sx={{
                borderRadius: 3,
                px: 3,
                py: 1,
                fontWeight: 600,
                textTransform: 'none',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 35px rgba(102, 126, 234, 0.4)'
                }
              }}
            >
              Create Test
            </Button>
          }
          sx={{ pb: 1 }}
        />
        <Divider />
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'grey.50' }}>
                  <TableCell sx={{ fontWeight: 600, py: 2 }}>Title</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Duration</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Questions</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tests.map((test, index) => (
                  <TableRow 
                    key={test._id}
                    sx={{ 
                      '&:hover': { bgcolor: 'action.hover' },
                      borderLeft: `4px solid ${test.isPublished ? '#4caf50' : '#ff9800'}`
                    }}
                  >
                    <TableCell>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {test.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {test.description?.substring(0, 50)}...
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={`${test.duration} min`}
                        size="small"
                        sx={{ bgcolor: 'info.light', color: 'info.dark' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Badge badgeContent={test.questions.length} color="primary">
                        <Assignment color="action" />
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={test.isPublished ? 'Published' : 'Draft'}
                        color={test.isPublished ? 'success' : 'warning'}
                        variant="filled"
                        sx={{ fontWeight: 600 }}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Tooltip title="Edit Test">
                          <IconButton 
                            onClick={() => handleEditTest(test)}
                            sx={{
                              bgcolor: 'primary.light',
                              color: 'primary.dark',
                              '&:hover': { bgcolor: 'primary.main', color: 'white' }
                            }}
                          >
                            <Edit />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={test.isPublished ? 'Hide from Students' : 'Publish to Students'}>
                          <IconButton 
                            onClick={() => handlePublishTest(test._id, test.isPublished)}
                            sx={{
                              bgcolor: test.isPublished ? 'warning.light' : 'success.light',
                              color: test.isPublished ? 'warning.dark' : 'success.dark',
                              '&:hover': { 
                                bgcolor: test.isPublished ? 'warning.main' : 'success.main',
                                color: 'white'
                              }
                            }}
                          >
                            {test.isPublished ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Test">
                          <IconButton 
                            onClick={() => handleDeleteTest(test._id)}
                            sx={{
                              bgcolor: 'error.light',
                              color: 'error.dark',
                              '&:hover': { bgcolor: 'error.main', color: 'white' }
                            }}
                          >
                            <Delete />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Results Export */}
      <Card 
        elevation={0}
        sx={{
          borderRadius: 4,
          border: '1px solid rgba(0,0,0,0.08)',
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: 'success.main' }}>
              <FileDownload />
            </Avatar>
          }
          title={
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Results Management
            </Typography>
          }
          subheader="Export and analyze test results"
          action={
            <Button
              variant="outlined"
              startIcon={<GetApp />}
              onClick={exportResults}
              sx={{
                borderRadius: 3,
                px: 3,
                py: 1,
                fontWeight: 600,
                textTransform: 'none',
                borderWidth: 2,
                '&:hover': {
                  borderWidth: 2,
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
                }
              }}
            >
              Export CSV
            </Button>
          }
        />
      </Card>

      {/* Floating Action Button */}
      <Zoom in={true}>
        <Fab
          color="primary"
          aria-label="add"
          onClick={handleCreateTest}
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            '&:hover': {
              transform: 'scale(1.1)',
              boxShadow: '0 12px 35px rgba(102, 126, 234, 0.4)'
            }
          }}
        >
          <Add />
        </Fab>
      </Zoom>

      {/* Create/Edit Test Dialog */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
        maxWidth="md" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)'
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontWeight: 700,
          fontSize: '1.5rem'
        }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <AutoAwesome />
            {selectedTest ? 'Edit Test' : 'Create New Test'}
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          {loading && (
            <LinearProgress 
              sx={{ 
                mb: 2,
                borderRadius: 1,
                height: 6
              }} 
            />
          )}
          
          <TextField
            autoFocus
            margin="dense"
            label="Test Title"
            fullWidth
            variant="outlined"
            value={testForm.title}
            onChange={(e) => setTestForm({ ...testForm, title: e.target.value })}
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': { borderRadius: 2 }
            }}
          />
          
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={testForm.description}
            onChange={(e) => setTestForm({ ...testForm, description: e.target.value })}
            sx={{ 
              mb: 2,
              '& .MuiOutlinedInput-root': { borderRadius: 2 }
            }}
          />
          
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                label="Duration (minutes)"
                type="number"
                fullWidth
                variant="outlined"
                value={testForm.duration}
                onChange={(e) => setTestForm({ ...testForm, duration: parseInt(e.target.value) })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="dense"
                label="Max Questions"
                type="number"
                fullWidth
                variant="outlined"
                value={testForm.maxQuestions}
                onChange={(e) => setTestForm({ ...testForm, maxQuestions: parseInt(e.target.value) })}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                helperText="Maximum questions for this test"
              />
            </Grid>
          </Grid>

          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Question Type Preference</InputLabel>
            <Select
              value={testForm.preferredType}
              label="Question Type Preference"
              onChange={(e) => setTestForm({ ...testForm, preferredType: e.target.value })}
              sx={{ borderRadius: 2 }}
            >
              <MenuItem value="mixed">
                <Stack direction="row" alignItems="center" spacing={1}>
                  <AutoAwesome color="primary" />
                  <span>Mixed (All Types)</span>
                </Stack>
              </MenuItem>
              <MenuItem value="mcq">Multiple Choice Questions Only</MenuItem>
              <MenuItem value="fillblank">Fill-in-the-blank Only</MenuItem>
              <MenuItem value="shortanswer">Short Answer Only</MenuItem>
            </Select>
          </FormControl>
          
          {/* PDF Upload Section */}
          <Card 
            elevation={0}
            sx={{ 
              mb: 3,
              border: '2px dashed',
              borderColor: 'primary.light',
              borderRadius: 3,
              bgcolor: 'primary.light',
              color: 'primary.contrastText'
            }}
          >
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <CloudUpload sx={{ fontSize: 48, mb: 2, color: 'primary.main' }} />
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                Generate Questions from PDF
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Upload a PDF document to automatically generate questions
              </Typography>
              
              <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setPdfFile(e.target.files[0])}
                  style={{ display: 'none' }}
                  id="pdf-upload"
                />
                <label htmlFor="pdf-upload">
                  <Button 
                    variant="outlined" 
                    component="span" 
                    startIcon={<Upload />}
                    sx={{ borderRadius: 2 }}
                  >
                    Choose PDF
                  </Button>
                </label>
                {pdfFile && (
                  <Chip 
                    label={pdfFile.name} 
                    onDelete={() => setPdfFile(null)}
                    sx={{ maxWidth: 200 }}
                  />
                )}
                <Button
                  variant="contained"
                  onClick={handlePdfUpload}
                  disabled={!pdfFile || loading}
                  sx={{ borderRadius: 2 }}
                >
                  {loading ? 'Processing...' : 'Generate'}
                </Button>
              </Stack>
            </CardContent>
          </Card>

          {/* Questions Preview */}
          {testForm.questions.length > 0 && (
            <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3 }}>
              <CardHeader
                title={
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Questions Preview ({testForm.questions.length})
                  </Typography>
                }
                avatar={<Preview color="primary" />}
              />
              <Divider />
              <CardContent sx={{ maxHeight: 400, overflow: 'auto', p: 2 }}>
                <Stack spacing={2}>
                  {testForm.questions.map((question, index) => (
                    <Paper 
                      key={index} 
                      elevation={0}
                      sx={{ 
                        p: 2, 
                        border: '1px solid', 
                        borderColor: 'divider',
                        borderRadius: 2,
                        bgcolor: 'grey.50'
                      }}
                    >
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                        <Chip
                          label={question.type.toUpperCase()}
                          size="small"
                          color={question.type === 'mcq' ? 'primary' : question.type === 'fillblank' ? 'success' : 'warning'}
                          sx={{ fontWeight: 600 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          Question {index + 1}
                        </Typography>
                      </Stack>
                      <Typography variant="body1" sx={{ fontWeight: 500, mb: 1 }}>
                        {question.question}
                      </Typography>
                      {question.options.length > 0 && (
                        <Box sx={{ ml: 2 }}>
                          {question.options.map((option, optIndex) => (
                            <Typography key={optIndex} variant="body2" color="text.secondary">
                              {String.fromCharCode(97 + optIndex)}) {option}
                            </Typography>
                          ))}
                        </Box>
                      )}
                    </Paper>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, bgcolor: 'grey.50' }}>
          <Button 
            onClick={() => setOpenDialog(false)}
            startIcon={<Cancel />}
            sx={{ borderRadius: 2 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveTest} 
            variant="contained"
            startIcon={<Save />}
            sx={{ 
              borderRadius: 2,
              px: 3,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
          >
            {selectedTest ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminDashboard;