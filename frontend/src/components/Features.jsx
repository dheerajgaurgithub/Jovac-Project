import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Button,
  Chip,
  Divider,
  Collapse,
  useTheme,
  alpha,
  IconButton
} from '@mui/material';
import {
  AutoAwesome,
  Security,
  Analytics,
  CloudUpload,
  Timer,
  Assessment,
  People,
  GetApp,
  CheckCircle,
  ExpandMore,
  ExpandLess,
  Rocket,
  Star
} from '@mui/icons-material';

const Features = () => {
  const theme = useTheme();
  const [expandedCard, setExpandedCard] = useState(null);

  const handleCardExpand = (index) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  const features = [
    {
      icon: <AutoAwesome sx={{ fontSize: 48 }} />,
      title: 'AI-Powered Question Generation',
      description: 'Upload PDF documents and automatically extract questions using advanced AI algorithms.',
      details: [
        'Multiple Choice Questions (MCQs)',
        'Fill-in-the-blank questions',
        'Short answer questions',
        'Automatic answer detection',
        'Question categorization'
      ],
      color: theme.palette.primary.main,
      gradient: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
      badge: 'AI Powered'
    },
    {
      icon: <Security sx={{ fontSize: 48 }} />,
      title: 'Secure Authentication',
      description: 'Role-based access control with JWT authentication and password encryption.',
      details: [
        'JWT token-based authentication',
        'Password hashing with bcrypt',
        'Role-based permissions',
        'Session management',
        'Secure API endpoints'
      ],
      color: theme.palette.success.main,
      gradient: `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`,
      badge: 'Enterprise Security'
    },
    {
      icon: <Analytics sx={{ fontSize: 48 }} />,
      title: 'Comprehensive Analytics',
      description: 'Real-time insights and detailed performance analytics for students and administrators.',
      details: [
        'Student performance tracking',
        'Test completion statistics',
        'Score distribution analysis',
        'Time-based analytics',
        'Progress monitoring'
      ],
      color: theme.palette.info.main,
      gradient: `linear-gradient(135deg, ${theme.palette.info.main} 0%, ${theme.palette.info.dark} 100%)`,
      badge: 'Real-time'
    },
    {
      icon: <CloudUpload sx={{ fontSize: 48 }} />,
      title: 'Easy Test Creation',
      description: 'Create tests manually or generate from PDFs with intuitive interface.',
      details: [
        'Drag-and-drop PDF upload',
        'Manual question creation',
        'Question editing and review',
        'Test preview functionality',
        'Bulk question import'
      ],
      color: theme.palette.secondary.main,
      gradient: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.secondary.dark} 100%)`,
      badge: 'User Friendly'
    },
    {
      icon: <Timer sx={{ fontSize: 48 }} />,
      title: 'Timed Assessments',
      description: 'Set time limits for tests with automatic submission and real-time countdown.',
      details: [
        'Customizable time limits',
        'Real-time countdown timer',
        'Auto-submission on timeout',
        'Time tracking per question',
        'Pause and resume functionality'
      ],
      color: theme.palette.warning.main,
      gradient: `linear-gradient(135deg, ${theme.palette.warning.main} 0%, ${theme.palette.warning.dark} 100%)`,
      badge: 'Smart Timing'
    },
    {
      icon: <Assessment sx={{ fontSize: 48 }} />,
      title: 'Automatic Grading',
      description: 'Intelligent grading system with support for different question types.',
      details: [
        'MCQ auto-grading',
        'Fill-in-the-blank scoring',
        'Keyword-based short answer grading',
        'Partial credit assignment',
        'Grade calculation and reporting'
      ],
      color: theme.palette.error.main,
      gradient: `linear-gradient(135deg, ${theme.palette.error.main} 0%, ${theme.palette.error.dark} 100%)`,
      badge: 'Intelligent'
    },
    {
      icon: <People sx={{ fontSize: 48 }} />,
      title: 'Student Management',
      description: 'Comprehensive student database with profile management and progress tracking.',
      details: [
        'Student registration system',
        'Profile management',
        'Test history tracking',
        'Performance analytics',
        'Bulk student operations'
      ],
      color: '#9C27B0',
      gradient: 'linear-gradient(135deg, #9C27B0 0%, #673AB7 100%)',
      badge: 'Comprehensive'
    },
    {
      icon: <GetApp sx={{ fontSize: 48 }} />,
      title: 'Export & Reporting',
      description: 'Export results and generate comprehensive reports for institutional records.',
      details: [
        'CSV export functionality',
        'Detailed result reports',
        'Performance summaries',
        'Custom report generation',
        'Data visualization'
      ],
      color: '#607D8B',
      gradient: 'linear-gradient(135deg, #607D8B 0%, #455A64 100%)',
      badge: 'Professional'
    }
  ];

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
            px: 3,
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 2 }}>
            <Chip 
              icon={<Star />}
              label="Feature Rich Platform" 
              color="primary" 
              sx={{ mb: 3, fontSize: '0.9rem' }}
            />
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
              Powerful Features
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
              Everything you need for comprehensive test management
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ maxWidth: 600, mx: 'auto' }}
            >
              Discover our comprehensive suite of features designed to make test creation, 
              management, and analysis effortless and efficient.
            </Typography>
          </Box>
        </Box>

        {/* Enhanced Features Grid */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} lg={6} key={index}>
              <Card 
                sx={{ 
                  height: 'auto',
                  position: 'relative',
                  overflow: 'visible',
                  borderRadius: 3,
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: expandedCard === index ? 'scale(1.02)' : 'scale(1)',
                  boxShadow: expandedCard === index ? theme.shadows[12] : theme.shadows[2],
                  border: `1px solid ${alpha(feature.color, 0.1)}`,
                  '&:hover': {
                    boxShadow: theme.shadows[8],
                    '& .feature-icon': {
                      transform: 'rotate(5deg) scale(1.1)'
                    }
                  }
                }}
              >
                {/* Feature Badge */}
                <Chip
                  label={feature.badge}
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    bgcolor: feature.color,
                    color: 'white',
                    fontWeight: 'bold',
                    zIndex: 2
                  }}
                />

                <CardContent sx={{ p: 4 }}>
                  {/* Header Section */}
                  <Box sx={{ mb: 3 }}>
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        mb: 2,
                        position: 'relative'
                      }}
                    >
                      <Box
                        className="feature-icon"
                        sx={{
                          p: 2,
                          borderRadius: '50%',
                          background: feature.gradient,
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 3,
                          transition: 'transform 0.3s ease',
                          boxShadow: `0 4px 20px ${alpha(feature.color, 0.3)}`
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography 
                          variant="h5" 
                          fontWeight="bold"
                          sx={{ 
                            color: feature.color,
                            mb: 0.5
                          }}
                        >
                          {feature.title}
                        </Typography>
                      </Box>
                      <IconButton
                        onClick={() => handleCardExpand(index)}
                        sx={{
                          bgcolor: alpha(feature.color, 0.1),
                          '&:hover': {
                            bgcolor: alpha(feature.color, 0.2)
                          }
                        }}
                      >
                        {expandedCard === index ? (
                          <ExpandLess sx={{ color: feature.color }} />
                        ) : (
                          <ExpandMore sx={{ color: feature.color }} />
                        )}
                      </IconButton>
                    </Box>
                    
                    <Typography 
                      variant="body1" 
                      color="text.secondary" 
                      sx={{ 
                        lineHeight: 1.6,
                        fontSize: '1.1rem'
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </Box>

                  {/* Expandable Details */}
                  <Collapse in={expandedCard === index}>
                    <Box>
                      <Divider sx={{ mb: 2 }} />
                      <Typography 
                        variant="subtitle2" 
                        fontWeight="bold" 
                        sx={{ mb: 2, color: feature.color }}
                      >
                        Key Capabilities:
                      </Typography>
                      <List dense sx={{ '& .MuiListItem-root': { py: 0.5 } }}>
                        {feature.details.map((detail, detailIndex) => (
                          <ListItem 
                            key={detailIndex}
                            sx={{
                              pl: 0,
                              transition: 'all 0.2s ease',
                              '&:hover': {
                                bgcolor: alpha(feature.color, 0.05),
                                borderRadius: 1
                              }
                            }}
                          >
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              <CheckCircle 
                                sx={{ 
                                  fontSize: 20,
                                  color: feature.color
                                }} 
                              />
                            </ListItemIcon>
                            <ListItemText 
                              primary={detail}
                              primaryTypographyProps={{ 
                                variant: 'body2',
                                fontWeight: 500
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </Box>
                  </Collapse>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Enhanced Call to Action */}
        <Paper 
          elevation={8}
          sx={{ 
            p: { xs: 4, md: 6 }, 
            textAlign: 'center',
            borderRadius: 4,
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -50,
              right: -50,
              width: 200,
              height: 200,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${alpha('#ffffff', 0.1)} 0%, transparent 70%)`,
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: -30,
              left: -30,
              width: 150,
              height: 150,
              borderRadius: '50%',
              background: `radial-gradient(circle, ${alpha('#ffffff', 0.05)} 0%, transparent 70%)`,
            }
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Rocket sx={{ fontSize: 60, mb: 2, opacity: 0.9 }} />
            <Typography variant="h3" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>
              Ready to Get Started?
            </Typography>
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 4, 
                opacity: 0.9,
                fontWeight: 300,
                maxWidth: 600,
                mx: 'auto'
              }}
            >
              Experience all these powerful features and transform your testing process with TestGenerator
            </Typography>
            
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: { xs: 'column', md: 'row' },
                justifyContent: 'center', 
                alignItems: 'center',
                gap: 3,
                mb: 3
              }}
            >
              <Button
                variant="contained"
                size="large"
                sx={{
                  bgcolor: 'white',
                  color: theme.palette.primary.main,
                  px: 4,
                  py: 1.5,
                  fontWeight: 'bold',
                  '&:hover': {
                    bgcolor: alpha('#ffffff', 0.9),
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Start Free Trial
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    bgcolor: alpha('#ffffff', 0.1),
                    borderColor: 'white'
                  }
                }}
              >
                View Demo
              </Button>
            </Box>

            <Divider sx={{ bgcolor: alpha('#ffffff', 0.3), mb: 3 }} />
            
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              <strong>Demo Credentials:</strong> admin@testgen.com / admin123
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Features;