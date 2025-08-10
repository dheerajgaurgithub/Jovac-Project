import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Paper,
  Chip,
  Button,
  Divider,
  Tab,
  Tabs,
  Avatar,
  IconButton,
  Tooltip,
  useTheme,
  alpha,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Code,
  Storage,
  Web,
  Security,
  Person,
  Launch,
  GitHub,
  LinkedIn,
  Email,
  School,
  ExpandMore,
  Api,
  Terminal,
  Language,
  DataObject
} from '@mui/icons-material';

const Developers = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const technologies = [
    { name: 'React.js', category: 'Frontend', color: '#61DAFB', icon: '⚛️' },
    { name: 'Material-UI', category: 'UI Framework', color: '#007FFF', icon: '🎨' },
    { name: 'Node.js', category: 'Backend', color: '#339933', icon: '🟢' },
    { name: 'Express.js', category: 'Web Framework', color: '#000000', icon: '🚀' },
    { name: 'MongoDB', category: 'Database', color: '#47A248', icon: '🍃' },
    { name: 'JWT', category: 'Authentication', color: '#000000', icon: '🔐' },
    { name: 'Multer', category: 'File Upload', color: '#FF6B35', icon: '📁' },
    { name: 'PDF-Parse', category: 'Document Processing', color: '#FF0000', icon: '📄' },
    { name: 'Bcrypt', category: 'Security', color: '#4A90E2', icon: '🛡️' },
    { name: 'Axios', category: 'HTTP Client', color: '#5A29E4', icon: '🌐' }
  ];

  const architectureComponents = [
    {
      icon: <Web sx={{ fontSize: 48 }} />,
      title: 'Frontend (React.js)',
      description: 'Modern, responsive user interface built with React.js and Material-UI',
      features: [
        'Component-based architecture',
        'State management with Context API',
        'Responsive design',
        'Real-time updates'
      ],
      color: theme.palette.primary.main,
      gradient: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`
    },
    {
      icon: <Code sx={{ fontSize: 48 }} />,
      title: 'Backend (Node.js)',
      description: 'RESTful API server built with Express.js and Node.js',
      features: [
        'RESTful API design',
        'Middleware architecture',
        'File upload handling',
        'PDF processing'
      ],
      color: theme.palette.success.main,
      gradient: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`
    },
    {
      icon: <Storage sx={{ fontSize: 48 }} />,
      title: 'Database (MongoDB)',
      description: 'NoSQL database for flexible data storage and retrieval',
      features: [
        'Document-based storage',
        'Flexible schema design',
        'Efficient querying',
        'Scalable architecture'
      ],
      color: theme.palette.warning.main,
      gradient: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`
    },
    {
      icon: <Security sx={{ fontSize: 48 }} />,
      title: 'Security Layer',
      description: 'Comprehensive security implementation for data protection',
      features: [
        'JWT authentication',
        'Password hashing',
        'Role-based access',
        'Input validation'
      ],
      color: theme.palette.error.main,
      gradient: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`
    }
  ];

  const apiEndpoints = [
    {
      category: 'Authentication',
      icon: <Security />,
      color: theme.palette.primary.main,
      endpoints: [
        { method: 'POST', path: '/api/auth/login', description: 'User login' },
        { method: 'POST', path: '/api/auth/register', description: 'User registration' },
        { method: 'GET', path: '/api/auth/me', description: 'Get current user' }
      ]
    },
    {
      category: 'Tests Management',
      icon: <Api />,
      color: theme.palette.success.main,
      endpoints: [
        { method: 'GET', path: '/api/tests', description: 'Get all tests' },
        { method: 'POST', path: '/api/tests', description: 'Create new test' },
        { method: 'PUT', path: '/api/tests/:id', description: 'Update test' },
        { method: 'DELETE', path: '/api/tests/:id', description: 'Delete test' },
        { method: 'POST', path: '/api/tests/upload-pdf', description: 'Upload PDF' }
      ]
    },
    {
      category: 'Results & Analytics',
      icon: <DataObject />,
      color: theme.palette.info.main,
      endpoints: [
        { method: 'GET', path: '/api/results', description: 'Get all results' },
        { method: 'POST', path: '/api/results', description: 'Submit result' },
        { method: 'GET', path: '/api/results/my-results', description: 'Get user results' },
        { method: 'GET', path: '/api/results/export/csv', description: 'Export to CSV' }
      ]
    },
    {
      category: 'User Management',
      icon: <Person />,
      color: theme.palette.secondary.main,
      endpoints: [
        { method: 'GET', path: '/api/users/students', description: 'Get all students' },
        { method: 'PUT', path: '/api/users/profile', description: 'Update profile' },
        { method: 'GET', path: '/api/users/stats', description: 'Get user stats' }
      ]
    }
  ];

  const getMethodColor = (method) => {
    switch (method) {
      case 'GET': return theme.palette.info.main;
      case 'POST': return theme.palette.success.main;
      case 'PUT': return theme.palette.warning.main;
      case 'DELETE': return theme.palette.error.main;
      default: return theme.palette.grey[500];
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: { xs: 4, md: 8 } }}>
        {/* Enhanced Header */}
        <Box 
          textAlign="center" 
          mb={8}
          sx={{
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.secondary.main, 0.05)} 100%)`,
            borderRadius: 4,
            py: { xs: 4, md: 6 },
            px: 3
          }}
        >
          <Code sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom 
            fontWeight="bold"
            sx={{
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2
            }}
          >
            For Developers
          </Typography>
          <Typography 
            variant="h5" 
            color="text.secondary"
            sx={{ 
              fontSize: { xs: '1.2rem', md: '1.5rem' },
              fontWeight: 300,
              mb: 3
            }}
          >
            Technical documentation and API reference for the TestGenerator platform
          </Typography>
        </Box>

        {/* Enhanced Developer Attribution */}
        <Paper 
          elevation={8}
          sx={{ 
            p: { xs: 3, md: 4 }, 
            mb: 6, 
            borderRadius: 4,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
              <Avatar 
                sx={{ 
                  width: 80, 
                  height: 80, 
                  bgcolor: 'white',
                  color: 'primary.main',
                  mr: 3,
                  fontSize: '2rem'
                }}
              >
                👨‍💻
              </Avatar>
              <Box textAlign="left">
                <Typography variant="h4" gutterBottom fontWeight="bold">
                  Dheeraj Gaur
                </Typography>
                <Typography variant="h6" sx={{ opacity: 0.9, mb: 1 }}>
                  Full Stack Developer
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <School sx={{ fontSize: 20 }} />
                  <Typography variant="body1">
                    BTech CSE, GLA University, Mathura
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ bgcolor: alpha('#ffffff', 0.3), mb: 3 }} />

            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<Launch />}
                href="https://dheerajgaurofficial.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  fontWeight: 'bold',
                  '&:hover': {
                    bgcolor: alpha('#ffffff', 0.9),
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                View Portfolio
              </Button>
              <Tooltip title="GitHub">
                <IconButton 
                  sx={{ 
                    bgcolor: alpha('#ffffff', 0.1),
                    color: 'white',
                    '&:hover': { bgcolor: alpha('#ffffff', 0.2) }
                  }}
                >
                  <GitHub />
                </IconButton>
              </Tooltip>
              <Tooltip title="LinkedIn">
                <IconButton 
                  sx={{ 
                    bgcolor: alpha('#ffffff', 0.1),
                    color: 'white',
                    '&:hover': { bgcolor: alpha('#ffffff', 0.2) }
                  }}
                >
                  <LinkedIn />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Paper>

        {/* Enhanced Technology Stack */}
        <Box mb={8}>
          <Typography 
            variant="h3" 
            gutterBottom 
            textAlign="center" 
            fontWeight="bold"
            sx={{ mb: 4 }}
          >
            Technology Stack
          </Typography>
          <Grid container spacing={3}>
            {technologies.map((tech, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    textAlign: 'center',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    border: `2px solid ${alpha(tech.color, 0.2)}`,
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: theme.shadows[8],
                      borderColor: tech.color
                    }
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h4" sx={{ mb: 1 }}>
                      {tech.icon}
                    </Typography>
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                      {tech.name}
                    </Typography>
                    <Chip 
                      label={tech.category} 
                      size="small"
                      sx={{ 
                        bgcolor: alpha(tech.color, 0.1),
                        color: tech.color,
                        fontWeight: 'bold'
                      }}
                    />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Enhanced Architecture */}
        <Box mb={8}>
          <Typography 
            variant="h3" 
            gutterBottom 
            textAlign="center" 
            fontWeight="bold"
            sx={{ mb: 4 }}
          >
            System Architecture
          </Typography>
          <Grid container spacing={4}>
            {architectureComponents.map((component, index) => (
              <Grid item xs={12} lg={6} key={index}>
                <Card 
                  sx={{ 
                    height: '100%',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[8]
                    },
                    border: `1px solid ${alpha(component.color, 0.2)}`
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: '50%',
                          background: component.gradient,
                          color: 'white',
                          mr: 3,
                          boxShadow: `0 4px 20px ${alpha(component.color, 0.3)}`
                        }}
                      >
                        {component.icon}
                      </Box>
                      <Typography variant="h5" fontWeight="bold" color={component.color}>
                        {component.title}
                      </Typography>
                    </Box>
                    
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                      {component.description}
                    </Typography>
                    
                    <Box>
                      {component.features.map((feature, featureIndex) => (
                        <Box key={featureIndex} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <Box
                            sx={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              bgcolor: component.color,
                              mr: 2
                            }}
                          />
                          <Typography variant="body2" fontWeight={500}>
                            {feature}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Enhanced API Documentation */}
        <Paper elevation={4} sx={{ borderRadius: 4, overflow: 'hidden', mb: 6 }}>
          <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 3, textAlign: 'center' }}>
            <Api sx={{ fontSize: 40, mb: 2 }} />
            <Typography variant="h4" fontWeight="bold">
              API Documentation
            </Typography>
            <Typography variant="body1" sx={{ opacity: 0.9 }}>
              RESTful API endpoints for seamless integration
            </Typography>
          </Box>

          <Box sx={{ p: 4 }}>
            {apiEndpoints.map((section, sectionIndex) => (
              <Accordion key={sectionIndex} sx={{ mb: 2, borderRadius: 2 }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: '50%',
                        bgcolor: alpha(section.color, 0.1),
                        color: section.color,
                        mr: 2
                      }}
                    >
                      {section.icon}
                    </Box>
                    <Typography variant="h6" fontWeight="bold" color={section.color}>
                      {section.category}
                    </Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    {section.endpoints.map((endpoint, endpointIndex) => (
                      <Grid item xs={12} key={endpointIndex}>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            bgcolor: alpha(getMethodColor(endpoint.method), 0.05),
                            border: `1px solid ${alpha(getMethodColor(endpoint.method), 0.2)}`
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Chip
                              label={endpoint.method}
                              size="small"
                              sx={{
                                bgcolor: getMethodColor(endpoint.method),
                                color: 'white',
                                fontWeight: 'bold',
                                mr: 2,
                                minWidth: 60
                              }}
                            />
                            <Typography variant="code" fontFamily="monospace" fontWeight="bold">
                              {endpoint.path}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {endpoint.description}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Paper>

        {/* Enhanced Installation Guide */}
        <Paper 
          elevation={4}
          sx={{ 
            borderRadius: 4,
            background: `linear-gradient(145deg, ${alpha(theme.palette.grey[900], 0.05)} 0%, ${alpha(theme.palette.grey[100], 0.8)} 100%)`
          }}
        >
          <Box sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Terminal sx={{ fontSize: 40, color: 'primary.main', mb: 2 }} />
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Quick Start Guide
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Get up and running in minutes with our simple setup process
              </Typography>
            </Box>

            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%', bgcolor: '#1e1e1e', color: '#f0f0f0', borderRadius: 3 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: '#4fc3f7' }}>
                      Backend Setup
                    </Typography>
                    <Box 
                      component="pre" 
                      sx={{ 
                        fontFamily: 'monospace',
                        fontSize: '0.9rem',
                        lineHeight: 1.6,
                        margin: 0,
                        whiteSpace: 'pre-wrap'
                      }}
                    >
{`$ cd backend
$ npm install
$ npm run dev

# Server running on port 5000`}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card sx={{ height: '100%', bgcolor: '#1e1e1e', color: '#f0f0f0', borderRadius: 3 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: '#4fc3f7' }}>
                      Frontend Setup
                    </Typography>
                    <Box 
                      component="pre" 
                      sx={{ 
                        fontFamily: 'monospace',
                        fontSize: '0.9rem',
                        lineHeight: 1.6,
                        margin: 0,
                        whiteSpace: 'pre-wrap'
                      }}
                    >
{`$ cd frontend
$ npm install
$ npm run dev

# App running on port 3000`}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Box sx={{ mt: 4, p: 3, bgcolor: alpha(theme.palette.info.main, 0.1), borderRadius: 2 }}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2, color: 'info.main' }}>
                📋 Prerequisites
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Make sure MongoDB is running on localhost:27017 or update the connection string in the .env file.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip label="Node.js 16+" size="small" />
                <Chip label="MongoDB 5.0+" size="small" />
                <Chip label="NPM/Yarn" size="small" />
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Developers;