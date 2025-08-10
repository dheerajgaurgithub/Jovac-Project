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
  Person,
  Email,
  Lock,
  PersonAdd,
  CheckCircle,
  Cancel,
  School,
  Security,
  Speed,
  AutoAwesome
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { register } = useAuth();
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

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    const result = await register(formData.name, formData.email, formData.password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const getPasswordStrength = (password) => {
    if (password.length === 0) return { strength: 0, label: '', color: 'default' };
    if (password.length < 4) return { strength: 25, label: 'Weak', color: 'error' };
    if (password.length < 6) return { strength: 50, label: 'Fair', color: 'warning' };
    if (password.length < 8) return { strength: 75, label: 'Good', color: 'info' };
    return { strength: 100, label: 'Strong', color: 'success' };
  };

  const passwordStrength = getPasswordStrength(formData.password);
  const passwordsMatch = formData.confirmPassword && formData.password === formData.confirmPassword;

  const features = [
    { icon: <Speed />, text: 'Quick Setup' },
    { icon: <Security />, text: 'Secure Access' },
    { icon: <School />, text: 'Student Dashboard' }
  ];

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
            
            {/* Left Side - Welcome Section */}
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
                  Join TestGenerator
                </Typography>
                
                <Typography variant="h6" sx={{ opacity: 0.9, mb: 4, lineHeight: 1.6 }}>
                  Create your student account and start taking tests with our AI-powered platform
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
                  label="✨ Free Forever"
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.9rem'
                  }}
                />
              </Paper>
            </Box>

            {/* Right Side - Registration Form */}
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
                    <PersonAdd sx={{ fontSize: 28 }} />
                  </Avatar>
                  
                  <Typography component="h1" variant="h4" gutterBottom sx={{ fontWeight: 700, color: 'text.primary' }}>
                    Create Account
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    Join thousands of students using TestGenerator
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
                    id="name"
                    label="Full Name"
                    name="name"
                    autoComplete="name"
                    autoFocus
                    value={formData.name}
                    onChange={handleChange}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person color="action" />
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
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
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
                    autoComplete="new-password"
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

                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <Box sx={{ mt: 1, mb: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          Password Strength:
                        </Typography>
                        <Chip
                          label={passwordStrength.label}
                          size="small"
                          color={passwordStrength.color}
                          sx={{ fontWeight: 'bold', fontSize: '0.7rem' }}
                        />
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={passwordStrength.strength}
                        color={passwordStrength.color}
                        sx={{
                          height: 4,
                          borderRadius: 2,
                          bgcolor: 'grey.200'
                        }}
                      />
                    </Box>
                  )}
                  
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={formData.confirmPassword && !passwordsMatch}
                    helperText={formData.confirmPassword && !passwordsMatch ? 'Passwords do not match' : ''}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle confirm password visibility"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                          >
                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                          {formData.confirmPassword && (
                            <Box sx={{ ml: 1 }}>
                              {passwordsMatch ? (
                                <CheckCircle color="success" />
                              ) : (
                                <Cancel color="error" />
                              )}
                            </Box>
                          )}
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
                    disabled={loading || !passwordsMatch}
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
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                  
                  <Divider sx={{ my: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      or
                    </Typography>
                  </Divider>
                  
                  <Box textAlign="center">
                    <Typography variant="body1" color="text.secondary">
                      Already have an account?{' '}
                      <MuiLink 
                        component={Link} 
                        to="/login"
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
                        Sign in here
                      </MuiLink>
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Register;