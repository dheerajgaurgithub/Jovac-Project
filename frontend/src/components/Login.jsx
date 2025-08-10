import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  Link as MuiLink,
  InputAdornment,
  IconButton,
  LinearProgress,
  Chip,
  Stack,
  Divider,
  Avatar,
  Card,
  CardContent
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Login as LoginIcon,
  Security,
  Speed,
  Analytics,
  AutoAwesome,
  AdminPanelSettings,
  School
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const features = [
    { icon: <Analytics />, text: 'Advanced Analytics' },
    { icon: <Speed />, text: 'Lightning Fast' },
    { icon: <Security />, text: 'Bank-level Security' }
  ];

  const quickLogin = (email, password) => {
    setFormData({ email, password });
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
        display: 'flex',
        alignItems: 'center',
        py: 4
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', gap: 4, alignItems: 'stretch', maxWidth: 1000, width: '100%' }}>
            
            {/* Left Side - Welcome Back Section */}
            <Box sx={{ flex: 1, display: { xs: 'none', md: 'flex' }, flexDirection: 'column', justifyContent: 'center' }}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 4,
                  color: 'white',
                  textAlign: 'center'
                }}
              >
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: 'rgba(255,255,255,0.2)',
                    mx: 'auto',
                    mb: 3,
                    fontSize: '2rem'
                  }}
                >
                  <AutoAwesome sx={{ fontSize: 40 }} />
                </Avatar>
                
                <Typography variant="h3" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
                  Welcome Back
                </Typography>
                
                <Typography variant="h6" sx={{ opacity: 0.9, mb: 4, lineHeight: 1.6 }}>
                  Access your TestGenerator dashboard and continue your testing journey
                </Typography>
                
                <Stack spacing={2} sx={{ mb: 4 }}>
                  {features.map((feature, index) => (
                    <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ width: 40, height: 40, bgcolor: 'rgba(255,255,255,0.2)' }}>
                        {feature.icon}
                      </Avatar>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {feature.text}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
                
                <Chip
                  label="✨ Trusted by 25K+ Users"
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.9rem'
                  }}
                />
              </Paper>
            </Box>

            {/* Right Side - Login Form */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Paper 
                elevation={20}
                sx={{ 
                  p: { xs: 3, sm: 4 }, 
                  borderRadius: 4,
                  background: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                }}
              >
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Avatar
                    sx={{
                      width: 56,
                      height: 56,
                      bgcolor: 'primary.main',
                      mx: 'auto',
                      mb: 2
                    }}
                  >
                    <LoginIcon sx={{ fontSize: 28 }} />
                  </Avatar>
                  
                  <Typography component="h1" variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'text.primary' }}>
                    Sign In
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    Access your account to continue
                  </Typography>
                </Box>
                
                {error && (
                  <Alert 
                    severity="error" 
                    sx={{ 
                      mb: 3,
                      borderRadius: 2,
                      '& .MuiAlert-icon': {
                        fontSize: 24
                      }
                    }}
                  >
                    {error}
                  </Alert>
                )}

                {loading && (
                  <Box sx={{ mb: 2 }}>
                    <LinearProgress 
                      sx={{ 
                        borderRadius: 1,
                        height: 6,
                        bgcolor: 'grey.200',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: 'primary.main'
                        }
                      }} 
                    />
                  </Box>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email color="action" />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: 'primary.main',
                        },
                        '&.Mui-focused fieldset': {
                          borderWidth: 2,
                        }
                      }
                    }}
                  />
                  
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        '&:hover fieldset': {
                          borderColor: 'primary.main',
                        },
                        '&.Mui-focused fieldset': {
                          borderWidth: 2,
                        }
                      }
                    }}
                  />
                  
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading}
                    sx={{ 
                      mt: 4, 
                      mb: 3,
                      py: 1.5,
                      borderRadius: 3,
                      fontWeight: 600,
                      fontSize: '1.1rem',
                      textTransform: 'none',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 35px rgba(102, 126, 234, 0.5)',
                      },
                      '&:disabled': {
                        background: 'grey.300',
                        transform: 'none',
                        boxShadow: 'none'
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Button>
                  
                  <Divider sx={{ my: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      or
                    </Typography>
                  </Divider>
                  
                  <Box textAlign="center" sx={{ mb: 3 }}>
                    <Typography variant="body1" color="text.secondary">
                      Don't have an account?{' '}
                      <MuiLink 
                        component={Link} 
                        to="/register"
                        sx={{
                          fontWeight: 600,
                          textDecoration: 'none',
                          color: 'primary.main',
                          '&:hover': {
                            textDecoration: 'underline',
                            color: 'primary.dark'
                          }
                        }}
                      >
                        Sign up here
                      </MuiLink>
                    </Typography>
                  </Box>
                </Box>
              </Paper>

              {/* Demo Credentials */}
              <Card 
                elevation={0}
                sx={{ 
                  mt: 3,
                  background: 'rgba(255,255,255,0.9)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: 3
                }}
              >
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Typography 
                    variant="h6" 
                    gutterBottom
                    sx={{ 
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1,
                      color: 'text.primary'
                    }}
                  >
                    <Security color="primary" /> Demo Credentials
                  </Typography>
                  <Divider sx={{ my: 2, bgcolor: 'primary.main' }} />
                  
                  <Stack spacing={2}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 2,
                        bgcolor: 'rgba(244, 67, 54, 0.1)',
                        borderRadius: 2,
                        border: '1px solid rgba(244, 67, 54, 0.2)'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AdminPanelSettings color="error" />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: 'error.dark' }}>
                            Admin Account
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            admin@testgen.com / admin123
                          </Typography>
                        </Box>
                      </Box>
                      <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        onClick={() => quickLogin('admin@testgen.com', 'admin123')}
                        sx={{ 
                          textTransform: 'none',
                          borderRadius: 2,
                          fontWeight: 500
                        }}
                      >
                        Quick Fill
                      </Button>
                    </Box>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: 2,
                        bgcolor: 'rgba(76, 175, 80, 0.1)',
                        borderRadius: 2,
                        border: '1px solid rgba(76, 175, 80, 0.2)'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <School color="success" />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.dark' }}>
                            Student Account
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Register with any email or use existing
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;