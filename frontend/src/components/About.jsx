import React from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Paper,
  Chip,
  Divider,
  useTheme,
  alpha
} from '@mui/material';
import {
  School,
  Business,
  Assessment,
  TrendingUp,
  AutoAwesome,
  Analytics,
  Security,
  Devices
} from '@mui/icons-material';

const About = () => {
  const theme = useTheme();

  const useCases = [
    {
      icon: <School sx={{ fontSize: 48, color: 'primary.main' }} />,
      title: 'Educational Institutions',
      description: 'Perfect for schools, colleges, and universities to conduct online examinations and assessments.',
      color: theme.palette.primary.main
    },
    {
      icon: <Business sx={{ fontSize: 48, color: 'secondary.main' }} />,
      title: 'Corporate Training',
      description: 'Ideal for employee skill assessments, training evaluations, and certification programs.',
      color: theme.palette.secondary.main
    },
    {
      icon: <Assessment sx={{ fontSize: 48, color: 'success.main' }} />,
      title: 'Recruitment',
      description: 'Streamline your hiring process with automated technical and aptitude assessments.',
      color: theme.palette.success.main
    },
    {
      icon: <TrendingUp sx={{ fontSize: 48, color: 'warning.main' }} />,
      title: 'Skill Development',
      description: 'Track learning progress and measure skill improvement over time.',
      color: theme.palette.warning.main
    }
  ];

  const benefits = [
    {
      icon: <AutoAwesome sx={{ fontSize: 32, color: 'primary.main' }} />,
      title: 'AI-Powered Question Generation',
      description: 'Upload PDF documents and automatically extract questions using advanced AI algorithms. Supports MCQs, fill-in-the-blanks, and short answer questions.'
    },
    {
      icon: <Analytics sx={{ fontSize: 32, color: 'info.main' }} />,
      title: 'Real-time Analytics',
      description: 'Get instant insights into student performance with detailed analytics, progress tracking, and exportable reports for institutional records.'
    },
    {
      icon: <Security sx={{ fontSize: 32, color: 'success.main' }} />,
      title: 'Secure & Scalable',
      description: 'Built with security in mind, featuring role-based access control, encrypted data storage, and the ability to handle thousands of concurrent users.'
    },
    {
      icon: <Devices sx={{ fontSize: 32, color: 'secondary.main' }} />,
      title: 'User-Friendly Interface',
      description: 'Intuitive design that works seamlessly across all devices. Both administrators and students can navigate the platform with ease.'
    }
  ];

  const techStack = [
    { name: 'MongoDB', role: 'Database', color: '#47A248' },
    { name: 'Express.js', role: 'Backend', color: '#000000' },
    { name: 'React.js', role: 'Frontend', color: '#61DAFB' },
    { name: 'Node.js', role: 'Runtime', color: '#339933' }
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: { xs: 4, md: 8 } }}>
        {/* Hero Section */}
        <Box 
          textAlign="center" 
          mb={8}
          sx={{
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
            borderRadius: 4,
            py: 6,
            px: 3
          }}
        >
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
            About TestGenerator
          </Typography>
          <Typography 
            variant="h5" 
            color="text.secondary" 
            sx={{ 
              mb: 3,
              fontSize: { xs: '1.2rem', md: '1.5rem' },
              fontWeight: 300
            }}
          >
            Revolutionizing Test Creation and Management
          </Typography>
          <Chip 
            label="Powered by AI" 
            color="primary" 
            size="medium"
            sx={{ 
              fontSize: '1rem',
              height: 40,
              px: 2
            }}
          />
        </Box>

        {/* Mission Statement */}
        <Paper 
          elevation={8}
          sx={{ 
            p: { xs: 3, md: 6 }, 
            mb: 8, 
            background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: 'white',
            borderRadius: 3,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `radial-gradient(circle at top right, ${alpha('#ffffff', 0.1)} 0%, transparent 50%)`,
            }
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="h3" gutterBottom textAlign="center" fontWeight="bold">
              Our Mission
            </Typography>
            <Divider sx={{ bgcolor: 'white', opacity: 0.3, mb: 3, mx: 'auto', width: '20%' }} />
            <Typography 
              variant="body1" 
              textAlign="center" 
              sx={{ 
                fontSize: { xs: '1.1rem', md: '1.3rem' },
                lineHeight: 1.6,
                fontWeight: 300
              }}
            >
              To simplify and automate the test creation process while providing comprehensive 
              analytics and insights. We believe that effective assessment should be accessible, 
              efficient, and data-driven.
            </Typography>
          </Box>
        </Paper>

        {/* Key Benefits */}
        <Box mb={8}>
          <Typography 
            variant="h3" 
            gutterBottom 
            textAlign="center"
            sx={{ mb: 5, fontWeight: 'bold' }}
          >
            Why Choose TestGenerator?
          </Typography>
          <Grid container spacing={4}>
            {benefits.map((benefit, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Card 
                  sx={{ 
                    height: '100%',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: theme.shadows[8]
                    },
                    borderRadius: 3,
                    overflow: 'visible',
                    position: 'relative'
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        mb: 2,
                        '& .MuiSvgIcon-root': {
                          mr: 2,
                          p: 1,
                          borderRadius: '50%',
                          bgcolor: alpha(theme.palette.primary.main, 0.1)
                        }
                      }}
                    >
                      {benefit.icon}
                      <Typography variant="h5" fontWeight="bold" color="primary">
                        {benefit.title}
                      </Typography>
                    </Box>
                    <Typography 
                      variant="body1" 
                      color="text.secondary"
                      sx={{ lineHeight: 1.6 }}
                    >
                      {benefit.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Use Cases */}
        <Box mb={8}>
          <Typography 
            variant="h3" 
            gutterBottom 
            textAlign="center"
            sx={{ mb: 5, fontWeight: 'bold' }}
          >
            Perfect For
          </Typography>
          <Grid container spacing={4}>
            {useCases.map((useCase, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    textAlign: 'center',
                    transition: 'all 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: theme.shadows[12]
                    },
                    borderRadius: 3,
                    border: `2px solid ${alpha(useCase.color, 0.1)}`,
                    background: `linear-gradient(145deg, ${alpha(useCase.color, 0.02)} 0%, transparent 100%)`
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box 
                      sx={{ 
                        mb: 3,
                        '& .MuiSvgIcon-root': {
                          p: 2,
                          borderRadius: '50%',
                          bgcolor: alpha(useCase.color, 0.1),
                          border: `2px solid ${alpha(useCase.color, 0.2)}`
                        }
                      }}
                    >
                      {useCase.icon}
                    </Box>
                    <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ mb: 2 }}>
                      {useCase.title}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ lineHeight: 1.5 }}
                    >
                      {useCase.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Technology Stack */}
        <Paper 
          elevation={4}
          sx={{ 
            p: { xs: 4, md: 6 }, 
            borderRadius: 4,
            background: `linear-gradient(145deg, ${alpha(theme.palette.grey[50], 0.8)} 0%, ${alpha(theme.palette.grey[100], 0.4)} 100%)`,
            backdropFilter: 'blur(10px)'
          }}
        >
          <Typography 
            variant="h3" 
            gutterBottom 
            textAlign="center" 
            fontWeight="bold"
            sx={{ mb: 2 }}
          >
            Built with Modern Technology
          </Typography>
          <Typography 
            variant="h6" 
            textAlign="center" 
            color="text.secondary" 
            sx={{ 
              mb: 5,
              fontWeight: 300,
              fontSize: { xs: '1rem', md: '1.25rem' }
            }}
          >
            TestGenerator is built using the MERN stack for maximum performance and scalability
          </Typography>
          <Grid container spacing={4} justifyContent="center">
            {techStack.map((tech, index) => (
              <Grid item xs={6} sm={3} key={index}>
                <Box 
                  textAlign="center"
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    bgcolor: 'white',
                    boxShadow: theme.shadows[2],
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: theme.shadows[6]
                    }
                  }}
                >
                  <Typography 
                    variant="h6" 
                    fontWeight="bold"
                    sx={{ 
                      color: tech.color,
                      mb: 1
                    }}
                  >
                    {tech.name}
                  </Typography>
                  <Typography 
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontWeight: 500 }}
                  >
                    {tech.role}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default About;