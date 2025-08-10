import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  Box,
  Divider,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  IconButton,
  Chip,
  Fade,
  Slide,
  useTheme,
  alpha
} from '@mui/material';
import {
  PhotoCamera,
  Delete,
  Save,
  Person,
  School,
  Work,
  LocationOn,
  Phone,
  Email,
  LinkedIn,
  GitHub,
  Language,
  Edit,
  AccountCircle
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Profile = () => {
  const theme = useTheme();
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    bio: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    studentInfo: {
      course: '',
      year: '',
      rollNumber: '',
      department: '',
      university: ''
    },
    adminInfo: {
      department: '',
      position: '',
      employeeId: '',
      specialization: ''
    },
    socialLinks: {
      linkedin: '',
      github: '',
      website: ''
    },
    profileImage: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/profile');
      const userData = response.data;
      
      setProfileData({
        name: userData.name || '',
        email: userData.email || '',
        bio: userData.bio || '',
        phone: userData.phone || '',
        address: {
          street: userData.address?.street || '',
          city: userData.address?.city || '',
          state: userData.address?.state || '',
          zipCode: userData.address?.zipCode || '',
          country: userData.address?.country || ''
        },
        studentInfo: {
          course: userData.studentInfo?.course || '',
          year: userData.studentInfo?.year || '',
          rollNumber: userData.studentInfo?.rollNumber || '',
          department: userData.studentInfo?.department || '',
          university: userData.studentInfo?.university || ''
        },
        adminInfo: {
          department: userData.adminInfo?.department || '',
          position: userData.adminInfo?.position || '',
          employeeId: userData.adminInfo?.employeeId || '',
          specialization: userData.adminInfo?.specialization || ''
        },
        socialLinks: {
          linkedin: userData.socialLinks?.linkedin || '',
          github: userData.socialLinks?.github || '',
          website: userData.socialLinks?.website || ''
        },
        profileImage: userData.profileImage || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage({ type: 'error', text: 'Failed to load profile data' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (section, field, value) => {
    if (section) {
      setProfileData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('profileImage', file);

    try {
      setImageUploading(true);
      console.log('Uploading profile image...');
      
      const response = await axios.post('/profile/upload-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      console.log('Image upload response:', response.data);

      setProfileData(prev => ({
        ...prev,
        profileImage: response.data.profileImage
      }));

      const updatedUser = response.data.user || {
        ...user,
        profileImage: response.data.profileImage
      };
      
      console.log('Profile image uploaded, updating user context:', {
        oldImage: user.profileImage,
        newImage: response.data.profileImage,
        userRole: user.role
      });
      
      updateUser(updatedUser);
      
      setTimeout(() => {
        updateUser({...updatedUser, _forceRefresh: Date.now()});
      }, 100);

      setMessage({ type: 'success', text: 'Profile image updated successfully!' });
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to upload image' });
    } finally {
      setImageUploading(false);
    }
  };

  const handleDeleteImage = async () => {
    try {
      await axios.delete('/profile/delete-image');
      setProfileData(prev => ({
        ...prev,
        profileImage: ''
      }));
      setMessage({ type: 'success', text: 'Profile image deleted successfully!' });
    } catch (error) {
      console.error('Error deleting image:', error);
      setMessage({ type: 'error', text: 'Failed to delete image' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      console.log('Submitting profile update...');
      
      const updateData = {
        name: profileData.name,
        bio: profileData.bio,
        phone: profileData.phone,
        address: profileData.address,
        socialLinks: profileData.socialLinks
      };

      if (user.role === 'student') {
        updateData.studentInfo = profileData.studentInfo;
        console.log('Including student info:', updateData.studentInfo);
      } else if (user.role === 'admin') {
        updateData.adminInfo = profileData.adminInfo;
        console.log('Including admin info:', updateData.adminInfo);
      }

      console.log('Sending update data:', updateData);

      const response = await axios.put('/profile', updateData);
      console.log('Profile update response:', response.data);
      
      updateUser(response.data);
      await fetchProfile();
      
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to update profile' 
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profileData.name) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center', minHeight: '50vh', alignItems: 'center' }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" sx={{ mt: 2, color: 'text.secondary' }}>
            Loading your profile...
          </Typography>
        </Box>
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
          <Paper 
            elevation={0} 
            sx={{ 
              borderRadius: 4,
              overflow: 'hidden',
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
            }}
          >
            {/* Header Section */}
            <Box sx={{ 
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
              color: 'white',
              p: { xs: 3, md: 4 },
              textAlign: 'center'
            }}>
              <Typography 
                variant="h3" 
                gutterBottom 
                sx={{ 
                  fontWeight: 700,
                  fontSize: { xs: '2rem', md: '3rem' },
                  textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                }}
              >
                <AccountCircle sx={{ mr: 2, fontSize: 'inherit', verticalAlign: 'middle' }} />
                My Profile
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, fontWeight: 300 }}>
                Manage your personal information and preferences
              </Typography>
            </Box>

            <Box sx={{ p: { xs: 3, md: 4 } }}>
              {message.text && (
                <Slide direction="down" in={Boolean(message.text)} mountOnEnter unmountOnExit>
                  <Alert 
                    severity={message.type} 
                    sx={{ 
                      mb: 4,
                      borderRadius: 3,
                      '& .MuiAlert-icon': {
                        fontSize: '1.5rem'
                      }
                    }} 
                    onClose={() => setMessage({ type: '', text: '' })}
                  >
                    {message.text}
                  </Alert>
                </Slide>
              )}

              <form onSubmit={handleSubmit}>
                {/* Profile Image Section */}
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  mb: 5,
                  position: 'relative'
                }}>
                  <Box sx={{ position: 'relative', mb: 3 }}>
                    <Avatar
                      src={profileData.profileImage ? `http://localhost:5000/${profileData.profileImage}` : ''}
                      sx={{ 
                        width: { xs: 120, md: 160 }, 
                        height: { xs: 120, md: 160 },
                        border: `4px solid ${theme.palette.primary.main}`,
                        boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                        fontSize: '3rem',
                        fontWeight: 600,
                        background: `linear-gradient(135deg, ${theme.palette.primary.light}, ${theme.palette.primary.main})`
                      }}
                    >
                      {profileData.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <IconButton
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        background: theme.palette.primary.main,
                        color: 'white',
                        '&:hover': {
                          background: theme.palette.primary.dark,
                          transform: 'scale(1.1)'
                        },
                        transition: 'all 0.2s ease-in-out'
                      }}
                      size="small"
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="profile-image-upload"
                      type="file"
                      onChange={handleImageUpload}
                    />
                    <label htmlFor="profile-image-upload">
                      <Button
                        variant="contained"
                        component="span"
                        startIcon={imageUploading ? <CircularProgress size={20} color="inherit" /> : <PhotoCamera />}
                        disabled={imageUploading}
                        sx={{
                          borderRadius: 25,
                          px: 3,
                          py: 1.5,
                          textTransform: 'none',
                          fontWeight: 600,
                          boxShadow: '0 4px 14px 0 rgba(0,0,0,0.1)',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 6px 20px 0 rgba(0,0,0,0.15)'
                          },
                          transition: 'all 0.2s ease-in-out'
                        }}
                      >
                        {imageUploading ? 'Uploading...' : 'Upload Photo'}
                      </Button>
                    </label>
                    
                    {profileData.profileImage && (
                      <IconButton 
                        color="error" 
                        onClick={handleDeleteImage}
                        sx={{
                          borderRadius: 25,
                          px: 2,
                          border: `2px solid ${theme.palette.error.main}`,
                          '&:hover': {
                            background: alpha(theme.palette.error.main, 0.1),
                            transform: 'translateY(-2px)'
                          },
                          transition: 'all 0.2s ease-in-out'
                        }}
                      >
                        <Delete />
                      </IconButton>
                    )}
                  </Box>
                </Box>

                <Grid container spacing={4}>
                  {/* Basic Information */}
                  <Grid item xs={12}>
                    <Fade in timeout={1000}>
                      <Card 
                        elevation={0} 
                        sx={{ 
                          borderRadius: 3,
                          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                          background: 'rgba(255, 255, 255, 0.7)',
                          '&:hover': {
                            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                            transform: 'translateY(-2px)'
                          },
                          transition: 'all 0.3s ease-in-out'
                        }}
                      >
                        <CardContent sx={{ p: 4 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <Person sx={{ 
                              mr: 2, 
                              fontSize: '2rem',
                              color: theme.palette.primary.main,
                              background: alpha(theme.palette.primary.main, 0.1),
                              borderRadius: '50%',
                              p: 1
                            }} />
                            <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                              Basic Information
                            </Typography>
                          </Box>
                          
                          <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="Full Name"
                                value={profileData.name}
                                onChange={(e) => handleInputChange(null, 'name', e.target.value)}
                                required
                                variant="outlined"
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    '&:hover': {
                                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                                    },
                                    '&.Mui-focused': {
                                      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                                    }
                                  }
                                }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="Email"
                                value={profileData.email}
                                disabled
                                variant="outlined"
                                InputProps={{
                                  startAdornment: <Email sx={{ mr: 1, color: 'action.active' }} />
                                }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    background: alpha(theme.palette.grey[500], 0.05)
                                  }
                                }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="Phone Number"
                                value={profileData.phone}
                                onChange={(e) => handleInputChange(null, 'phone', e.target.value)}
                                variant="outlined"
                                InputProps={{
                                  startAdornment: <Phone sx={{ mr: 1, color: 'action.active' }} />
                                }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    '&:hover': {
                                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                                    }
                                  }
                                }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <Box sx={{ pt: 2 }}>
                                <Chip 
                                  label={user.role === 'admin' ? 'Administrator' : 'Student'} 
                                  color={user.role === 'admin' ? 'primary' : 'secondary'}
                                  variant="filled"
                                  sx={{
                                    fontSize: '1rem',
                                    fontWeight: 600,
                                    px: 2,
                                    py: 1,
                                    height: 'auto',
                                    borderRadius: 20
                                  }}
                                />
                              </Box>
                            </Grid>
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                label="Bio"
                                multiline
                                rows={4}
                                value={profileData.bio}
                                onChange={(e) => handleInputChange(null, 'bio', e.target.value)}
                                placeholder="Tell us about yourself..."
                                variant="outlined"
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    '&:hover': {
                                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                                    }
                                  }
                                }}
                              />
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Fade>
                  </Grid>

                  {/* Address Information */}
                  <Grid item xs={12}>
                    <Fade in timeout={1200}>
                      <Card 
                        elevation={0} 
                        sx={{ 
                          borderRadius: 3,
                          border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
                          background: 'rgba(255, 255, 255, 0.7)',
                          '&:hover': {
                            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                            transform: 'translateY(-2px)'
                          },
                          transition: 'all 0.3s ease-in-out'
                        }}
                      >
                        <CardContent sx={{ p: 4 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <LocationOn sx={{ 
                              mr: 2, 
                              fontSize: '2rem',
                              color: theme.palette.secondary.main,
                              background: alpha(theme.palette.secondary.main, 0.1),
                              borderRadius: '50%',
                              p: 1
                            }} />
                            <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.secondary.main }}>
                              Address Information
                            </Typography>
                          </Box>
                          
                          <Grid container spacing={3}>
                            <Grid item xs={12}>
                              <TextField
                                fullWidth
                                label="Street Address"
                                value={profileData.address.street}
                                onChange={(e) => handleInputChange('address', 'street', e.target.value)}
                                variant="outlined"
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    '&:hover': {
                                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                                    }
                                  }
                                }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="City"
                                value={profileData.address.city}
                                onChange={(e) => handleInputChange('address', 'city', e.target.value)}
                                variant="outlined"
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    '&:hover': {
                                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                                    }
                                  }
                                }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="State/Province"
                                value={profileData.address.state}
                                onChange={(e) => handleInputChange('address', 'state', e.target.value)}
                                variant="outlined"
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    '&:hover': {
                                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                                    }
                                  }
                                }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="ZIP/Postal Code"
                                value={profileData.address.zipCode}
                                onChange={(e) => handleInputChange('address', 'zipCode', e.target.value)}
                                variant="outlined"
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    '&:hover': {
                                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                                    }
                                  }
                                }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                              <TextField
                                fullWidth
                                label="Country"
                                value={profileData.address.country}
                                onChange={(e) => handleInputChange('address', 'country', e.target.value)}
                                variant="outlined"
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    '&:hover': {
                                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                                    }
                                  }
                                }}
                              />
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Fade>
                  </Grid>

                  {/* Role-specific Information */}
                  {user.role === 'student' && (
                    <Grid item xs={12}>
                      <Fade in timeout={1400}>
                        <Card 
                          elevation={0} 
                          sx={{ 
                            borderRadius: 3,
                            border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
                            background: `linear-gradient(135deg, rgba(255,255,255,0.9), ${alpha(theme.palette.success.light, 0.05)})`,
                            '&:hover': {
                              boxShadow: '0 8px 25px rgba(76, 175, 80, 0.2)',
                              transform: 'translateY(-2px)'
                            },
                            transition: 'all 0.3s ease-in-out'
                          }}
                        >
                          <CardContent sx={{ p: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                              <School sx={{ 
                                mr: 2, 
                                fontSize: '2rem',
                                color: theme.palette.success.main,
                                background: alpha(theme.palette.success.main, 0.1),
                                borderRadius: '50%',
                                p: 1
                              }} />
                              <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.success.main }}>
                                Academic Information
                              </Typography>
                            </Box>
                            
                            <Grid container spacing={3}>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  fullWidth
                                  label="Course/Program"
                                  value={profileData.studentInfo.course}
                                  onChange={(e) => handleInputChange('studentInfo', 'course', e.target.value)}
                                  placeholder="e.g., Computer Science"
                                  variant="outlined"
                                  sx={{
                                    '& .MuiOutlinedInput-root': {
                                      borderRadius: 2,
                                      background: 'rgba(255,255,255,0.8)',
                                      '&:hover': {
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                                      }
                                    }
                                  }}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  fullWidth
                                  label="Year/Semester"
                                  value={profileData.studentInfo.year}
                                  onChange={(e) => handleInputChange('studentInfo', 'year', e.target.value)}
                                  placeholder="e.g., 3rd Year"
                                  variant="outlined"
                                  sx={{
                                    '& .MuiOutlinedInput-root': {
                                      borderRadius: 2,
                                      background: 'rgba(255,255,255,0.8)',
                                      '&:hover': {
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                                      }
                                    }
                                  }}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  fullWidth
                                  label="Roll Number"
                                  value={profileData.studentInfo.rollNumber}
                                  onChange={(e) => handleInputChange('studentInfo', 'rollNumber', e.target.value)}
                                  variant="outlined"
                                  sx={{
                                    '& .MuiOutlinedInput-root': {
                                      borderRadius: 2,
                                      background: 'rgba(255,255,255,0.8)',
                                      '&:hover': {
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                                      }
                                    }
                                  }}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  fullWidth
                                  label="Department"
                                  value={profileData.studentInfo.department}
                                  onChange={(e) => handleInputChange('studentInfo', 'department', e.target.value)}
                                  variant="outlined"
                                  sx={{
                                    '& .MuiOutlinedInput-root': {
                                      borderRadius: 2,
                                      background: 'rgba(255,255,255,0.8)',
                                      '&:hover': {
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                                      }
                                    }
                                  }}
                                />
                              </Grid>
                              <Grid item xs={12}>
                                <TextField
                                  fullWidth
                                  label="University/Institution"
                                  value={profileData.studentInfo.university}
                                  onChange={(e) => handleInputChange('studentInfo', 'university', e.target.value)}
                                  variant="outlined"
                                  sx={{
                                    '& .MuiOutlinedInput-root': {
                                      borderRadius: 2,
                                      background: 'rgba(255,255,255,0.8)',
                                      '&:hover': {
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                                      }
                                    }
                                  }}
                                />
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      </Fade>
                    </Grid>
                  )}

                  {user.role === 'admin' && (
                    <Grid item xs={12}>
                      <Fade in timeout={1400}>
                        <Card 
                          elevation={0} 
                          sx={{ 
                            borderRadius: 3,
                            border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
                            background: `linear-gradient(135deg, rgba(255,255,255,0.9), ${alpha(theme.palette.info.light, 0.05)})`,
                            '&:hover': {
                              boxShadow: '0 8px 25px rgba(33, 150, 243, 0.2)',
                              transform: 'translateY(-2px)'
                            },
                            transition: 'all 0.3s ease-in-out'
                          }}
                        >
                          <CardContent sx={{ p: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                              <Work sx={{ 
                                mr: 2, 
                                fontSize: '2rem',
                                color: theme.palette.info.main,
                                background: alpha(theme.palette.info.main, 0.1),
                                borderRadius: '50%',
                                p: 1
                              }} />
                              <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.info.main }}>
                                Professional Information
                              </Typography>
                            </Box>
                            
                            <Grid container spacing={3}>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  fullWidth
                                  label="Department"
                                  value={profileData.adminInfo.department}
                                  onChange={(e) => handleInputChange('adminInfo', 'department', e.target.value)}
                                  variant="outlined"
                                  sx={{
                                    '& .MuiOutlinedInput-root': {
                                      borderRadius: 2,
                                      background: 'rgba(255,255,255,0.8)',
                                      '&:hover': {
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                                      }
                                    }
                                  }}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  fullWidth
                                  label="Position/Title"
                                  value={profileData.adminInfo.position}
                                  onChange={(e) => handleInputChange('adminInfo', 'position', e.target.value)}
                                  variant="outlined"
                                  sx={{
                                    '& .MuiOutlinedInput-root': {
                                      borderRadius: 2,
                                      background: 'rgba(255,255,255,0.8)',
                                      '&:hover': {
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                                      }
                                    }
                                  }}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  fullWidth
                                  label="Employee ID"
                                  value={profileData.adminInfo.employeeId}
                                  onChange={(e) => handleInputChange('adminInfo', 'employeeId', e.target.value)}
                                  variant="outlined"
                                  sx={{
                                    '& .MuiOutlinedInput-root': {
                                      borderRadius: 2,
                                      background: 'rgba(255,255,255,0.8)',
                                      '&:hover': {
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                                      }
                                    }
                                  }}
                                />
                              </Grid>
                              <Grid item xs={12} sm={6}>
                                <TextField
                                  fullWidth
                                  label="Specialization"
                                  value={profileData.adminInfo.specialization}
                                  onChange={(e) => handleInputChange('adminInfo', 'specialization', e.target.value)}
                                  variant="outlined"
                                  sx={{
                                    '& .MuiOutlinedInput-root': {
                                      borderRadius: 2,
                                      background: 'rgba(255,255,255,0.8)',
                                      '&:hover': {
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                                      }
                                    }
                                  }}
                                />
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      </Fade>
                    </Grid>
                  )}

                  {/* Social Links */}
                  <Grid item xs={12}>
                    <Fade in timeout={1600}>
                      <Card 
                        elevation={0} 
                        sx={{ 
                          borderRadius: 3,
                          border: `1px solid ${alpha(theme.palette.warning.main, 0.2)}`,
                          background: `linear-gradient(135deg, rgba(255,255,255,0.9), ${alpha(theme.palette.warning.light, 0.05)})`,
                          '&:hover': {
                            boxShadow: '0 8px 25px rgba(255, 152, 0, 0.2)',
                            transform: 'translateY(-2px)'
                          },
                          transition: 'all 0.3s ease-in-out'
                        }}
                      >
                        <CardContent sx={{ p: 4 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <Language sx={{ 
                              mr: 2, 
                              fontSize: '2rem',
                              color: theme.palette.warning.main,
                              background: alpha(theme.palette.warning.main, 0.1),
                              borderRadius: '50%',
                              p: 1
                            }} />
                            <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.warning.main }}>
                              Social Links
                            </Typography>
                          </Box>
                          
                          <Grid container spacing={3}>
                            <Grid item xs={12} sm={4}>
                              <TextField
                                fullWidth
                                label="LinkedIn"
                                value={profileData.socialLinks.linkedin}
                                onChange={(e) => handleInputChange('socialLinks', 'linkedin', e.target.value)}
                                variant="outlined"
                                InputProps={{
                                  startAdornment: <LinkedIn sx={{ mr: 1, color: '#0077B5' }} />
                                }}
                                placeholder="https://linkedin.com/in/username"
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    background: 'rgba(255,255,255,0.8)',
                                    '&:hover': {
                                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                                    }
                                  }
                                }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <TextField
                                fullWidth
                                label="GitHub"
                                value={profileData.socialLinks.github}
                                onChange={(e) => handleInputChange('socialLinks', 'github', e.target.value)}
                                variant="outlined"
                                InputProps={{
                                  startAdornment: <GitHub sx={{ mr: 1, color: '#333' }} />
                                }}
                                placeholder="https://github.com/username"
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    background: 'rgba(255,255,255,0.8)',
                                    '&:hover': {
                                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                                    }
                                  }
                                }}
                              />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                              <TextField
                                fullWidth
                                label="Website"
                                value={profileData.socialLinks.website}
                                onChange={(e) => handleInputChange('socialLinks', 'website', e.target.value)}
                                variant="outlined"
                                InputProps={{
                                  startAdornment: <Language sx={{ mr: 1, color: theme.palette.warning.main }} />
                                }}
                                placeholder="https://yourwebsite.com"
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    background: 'rgba(255,255,255,0.8)',
                                    '&:hover': {
                                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                                    }
                                  }
                                }}
                              />
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Fade>
                  </Grid>

                  {/* Submit Button */}
                  <Grid item xs={12}>
                    <Fade in timeout={1800}>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        mt: 4,
                        mb: 2
                      }}>
                        <Button
                          type="submit"
                          variant="contained"
                          size="large"
                          startIcon={loading ? <CircularProgress size={24} color="inherit" /> : <Save />}
                          disabled={loading}
                          sx={{
                            minWidth: 250,
                            py: 2,
                            px: 4,
                            borderRadius: 25,
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            textTransform: 'none',
                            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                            boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                            '&:hover': {
                              background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                              transform: 'translateY(-3px)',
                              boxShadow: '0 12px 35px rgba(0,0,0,0.3)'
                            },
                            '&:active': {
                              transform: 'translateY(-1px)'
                            },
                            '&:disabled': {
                              background: theme.palette.grey[400],
                              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                            },
                            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                          }}
                        >
                          {loading ? 'Updating Profile...' : 'Update Profile'}
                        </Button>
                      </Box>
                    </Fade>
                  </Grid>
                </Grid>
              </form>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default Profile;