import React from 'react';
import {
  Box,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Paper,
  Chip,
  Stack,
  Divider,
  Avatar
} from '@mui/material';
import {
  School,
  Assessment,
  Analytics,
  Security,
  AutoAwesome,
  Speed,
  Groups,
  CloudUpload
} from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Landing = () => {
  const features = [
    {
      icon: <School sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: 'Easy Test Creation',
      description: 'Create tests manually or auto-generate from PDF documents with AI-powered question extraction.',
      chip: 'AI-Powered'
    },
    {
      icon: <Assessment sx={{ fontSize: 48, color: 'success.main' }} />,
      title: 'Multiple Question Types',
      description: 'Support for MCQs, Fill-in-the-blanks, and Short Answer questions with automatic grading.',
      chip: 'Versatile'
    },
    {
      icon: <Analytics sx={{ fontSize: 48, color: 'warning.main' }} />,
      title: 'Real-time Analytics',
      description: 'Track student performance with detailed analytics and exportable reports.',
      chip: 'Live Data'
    },
    {
      icon: <Security sx={{ fontSize: 48, color: 'error.main' }} />,
      title: 'Secure & Reliable',
      description: 'Role-based access control with secure authentication and data protection.',
      chip: 'Enterprise'
    }
  ];

  const stats = [
    { number: '50K+', label: 'Tests Created' },
    { number: '25K+', label: 'Active Users' },
    { number: '99.9%', label: 'Uptime' },
    { number: '4.9/5', label: 'User Rating' }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Paper
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
          color: 'white',
          py: { xs: 6, md: 10 },
          mb: 8,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.1)',
            zIndex: 1
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Stack spacing={4} alignItems="center">
            <Box>
              <Typography 
                variant="h1" 
                component="h1" 
                gutterBottom 
                sx={{ 
                  fontWeight: 800,
                  fontSize: { xs: '2.5rem', md: '4rem' },
                  letterSpacing: '-0.02em',
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}
              >
                TestGenerator
              </Typography>
              <Chip
                icon={<AutoAwesome />}
                label="AI-Powered Platform"
                variant="filled"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 'bold',
                  mb: 2
                }}
              />
            </Box>
            
            <Typography 
              variant="h4" 
              component="h2" 
              gutterBottom 
              sx={{ 
                fontWeight: 300,
                maxWidth: '800px',
                fontSize: { xs: '1.5rem', md: '2rem' }
              }}
            >
              Transform Your Testing Experience
            </Typography>
            
            <Typography 
              variant="h6" 
              sx={{ 
                mb: 4, 
                maxWidth: '600px',
                opacity: 0.95,
                lineHeight: 1.6
              }}
            >
              Streamline your test creation process with automated question generation from PDFs,
              comprehensive analytics, and seamless student management.
            </Typography>
            
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 2 }}>
              <Button
                variant="contained"
                size="large"
                component={Link}
                to="/register"
                startIcon={<Groups />}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  py: 2,
                  px: 4,
                  borderRadius: 3,
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                  '&:hover': { 
                    bgcolor: 'grey.100',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 35px rgba(0,0,0,0.2)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Get Started as Student
              </Button>
              <Button
                variant="outlined"
                size="large"
                component={Link}
                to="/login"
                startIcon={<Security />}
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  py: 2,
                  px: 4,
                  borderRadius: 3,
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  borderWidth: 2,
                  '&:hover': { 
                    borderColor: 'white', 
                    bgcolor: 'rgba(255,255,255,0.15)',
                    transform: 'translateY(-2px)',
                    borderWidth: 2
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Admin Login
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Paper>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Grid container spacing={4}>
          {stats.map((stat, index) => (
            <Grid item xs={6} md={3} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  bgcolor: 'transparent',
                  borderRadius: 2
                }}
              >
                <Typography
                  variant="h3"
                  component="div"
                  sx={{
                    fontWeight: 800,
                    color: 'primary.main',
                    mb: 1
                  }}
                >
                  {stat.number}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontWeight: 500 }}
                >
                  {stat.label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Box textAlign="center" sx={{ mb: 6 }}>
          <Typography 
            variant="h2" 
            component="h2" 
            gutterBottom
            sx={{
              fontWeight: 700,
              fontSize: { xs: '2rem', md: '3rem' },
              color: 'text.primary'
            }}
          >
            Key Features
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ 
              maxWidth: '600px',
              mx: 'auto',
              mb: 2
            }}
          >
            Everything you need to create, manage, and analyze tests efficiently
          </Typography>
          <Divider sx={{ maxWidth: 100, mx: 'auto', bgcolor: 'primary.main', height: 3 }} />
        </Box>
        
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card 
                elevation={0}
                sx={{ 
                  height: '100%',
                  textAlign: 'center',
                  p: 3,
                  borderRadius: 4,
                  border: '1px solid',
                  borderColor: 'grey.200',
                  position: 'relative',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    borderColor: 'primary.main'
                  }
                }}
              >
                <CardContent sx={{ pb: 1 }}>
                  <Box sx={{ mb: 3, position: 'relative' }}>
                    <Avatar
                      sx={{
                        width: 80,
                        height: 80,
                        bgcolor: 'grey.50',
                        mx: 'auto',
                        mb: 2,
                        border: '3px solid',
                        borderColor: 'grey.200'
                      }}
                    >
                      {feature.icon}
                    </Avatar>
                    <Chip
                      label={feature.chip}
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: -10,
                        right: -10,
                        bgcolor: 'primary.main',
                        color: 'white',
                        fontWeight: 'bold'
                      }}
                    />
                  </Box>
                  <Typography 
                    variant="h5" 
                    component="h3" 
                    gutterBottom
                    sx={{ fontWeight: 600, mb: 2 }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ lineHeight: 1.6 }}
                  >
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Paper 
        elevation={0}
        sx={{ 
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          color: 'white',
          py: 8,
          mb: 4
        }}
      >
        <Container maxWidth="md" textAlign="center">
          <Typography 
            variant="h3" 
            component="h2" 
            gutterBottom
            sx={{ 
              fontWeight: 700,
              mb: 3,
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            Ready to Transform Your Testing Process?
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 4,
              opacity: 0.95,
              maxWidth: '500px',
              mx: 'auto',
              lineHeight: 1.6
            }}
          >
            Join thousands of educators and organizations using TestGenerator
            to create better assessments and track student progress.
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button
              variant="contained"
              size="large"
              component={Link}
              to="/register"
              startIcon={<Speed />}
              sx={{
                bgcolor: 'white',
                color: 'primary.main',
                py: 2,
                px: 4,
                borderRadius: 3,
                fontWeight: 'bold',
                fontSize: '1.1rem',
                boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
                '&:hover': { 
                  bgcolor: 'grey.100',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              Start Free Trial
            </Button>
            <Button
              variant="outlined"
              size="large"
              component={Link}
              to="/features"
              startIcon={<CloudUpload />}
              sx={{
                borderColor: 'white',
                color: 'white',
                py: 2,
                px: 4,
                borderRadius: 3,
                fontWeight: 'bold',
                fontSize: '1.1rem',
                borderWidth: 2,
                '&:hover': { 
                  borderColor: 'white', 
                  bgcolor: 'rgba(255,255,255,0.15)',
                  transform: 'translateY(-2px)',
                  borderWidth: 2
                }
              }}
            >
              Learn More
            </Button>
          </Stack>
        </Container>
      </Paper>

      {/* Demo Credentials */}
      <Container maxWidth="sm" sx={{ mb: 4 }}>
        <Card 
          elevation={0}
          sx={{ 
            bgcolor: 'info.light', 
            color: 'info.contrastText',
            borderRadius: 3,
            border: '1px solid',
            borderColor: 'info.main'
          }}
        >
          <CardContent sx={{ textAlign: 'center', py: 3 }}>
            <Typography 
              variant="h5" 
              gutterBottom
              sx={{ 
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 1
              }}
            >
              <Security /> Demo Credentials
            </Typography>
            <Divider sx={{ my: 2, bgcolor: 'info.main' }} />
            <Stack spacing={1}>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                <strong>Admin:</strong> admin@testgen.com / admin123
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                <strong>Student:</strong> Register with any email
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default Landing;