import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Chip,
  Divider,
  ListItemIcon,
  ListItemText,
  Badge,
  Stack
} from '@mui/material';
import { 
  AccountCircle,
  Dashboard,
  ExitToApp,
  Person,
  Assessment,
  Notifications,
  Settings,
  AutoAwesome,
  Code,
  Info,
  Login,
  PersonAdd
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    handleClose();
  };

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}
    >
      <Toolbar sx={{ minHeight: { xs: 64, sm: 70 }, px: { xs: 2, sm: 3 } }}>
        <Typography 
          variant="h5" 
          component={Link} 
          to="/" 
          sx={{ 
            flexGrow: 1, 
            textDecoration: 'none', 
            color: 'inherit',
            fontWeight: 800,
            letterSpacing: '-0.5px',
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            '&:hover': {
              color: 'rgba(255,255,255,0.9)',
              transform: 'scale(1.02)',
              transition: 'all 0.2s ease'
            }
          }}
        >
          <AutoAwesome sx={{ fontSize: 28, color: '#ffd700' }} />
          TestGenerator
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {!user ? (
            <Stack direction="row" spacing={1} alignItems="center">
              <Button 
                color="inherit" 
                component={Link} 
                to="/about"
                startIcon={<Info />}
                sx={{ 
                  textTransform: 'none',
                  fontWeight: 500,
                  borderRadius: 2,
                  px: 2,
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.1)',
                    transform: 'translateY(-1px)',
                    transition: 'all 0.2s ease'
                  }
                }}
              >
                About
              </Button>
              <Button 
                color="inherit" 
                component={Link} 
                to="/features"
                startIcon={<Assessment />}
                sx={{ 
                  textTransform: 'none',
                  fontWeight: 500,
                  borderRadius: 2,
                  px: 2,
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.1)',
                    transform: 'translateY(-1px)',
                    transition: 'all 0.2s ease'
                  }
                }}
              >
                Features
              </Button>
              <Button 
                color="inherit" 
                component={Link} 
                to="/developers"
                startIcon={<Code />}
                sx={{ 
                  textTransform: 'none',
                  fontWeight: 500,
                  borderRadius: 2,
                  px: 2,
                  mr: 1,
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.1)',
                    transform: 'translateY(-1px)',
                    transition: 'all 0.2s ease'
                  }
                }}
              >
                Developers
              </Button>
              <Button 
                color="inherit" 
                component={Link} 
                to="/login"
                startIcon={<Login />}
                sx={{ 
                  textTransform: 'none',
                  fontWeight: 500,
                  borderRadius: 2,
                  px: 2,
                  mr: 1,
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.1)',
                    transform: 'translateY(-1px)',
                    transition: 'all 0.2s ease'
                  }
                }}
              >
                Login
              </Button>
              <Button 
                variant="contained" 
                component={Link} 
                to="/register"
                startIcon={<PersonAdd />}
                sx={{ 
                  bgcolor: 'white',
                  color: 'primary.main',
                  textTransform: 'none',
                  fontWeight: 600,
                  borderRadius: 3,
                  px: 3,
                  py: 1,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.95)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                    transition: 'all 0.2s ease'
                  }
                }}
              >
                Sign Up
              </Button>
            </Stack>
          ) : (
            <Stack direction="row" spacing={1} alignItems="center">
              <Button 
                color="inherit" 
                component={Link} 
                to={user.role === 'admin' ? '/admin' : '/dashboard'}
                startIcon={<Dashboard />}
                sx={{ 
                  textTransform: 'none',
                  fontWeight: 500,
                  borderRadius: 2,
                  px: 2,
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.1)',
                    transform: 'translateY(-1px)',
                    transition: 'all 0.2s ease'
                  }
                }}
              >
                Dashboard
              </Button>
              <Button 
                color="inherit" 
                component={Link} 
                to="/results" 
                startIcon={<Assessment />}
                sx={{ 
                  textTransform: 'none',
                  fontWeight: 500,
                  borderRadius: 2,
                  px: 2,
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.1)',
                    transform: 'translateY(-1px)',
                    transition: 'all 0.2s ease'
                  }
                }}
              >
                Results
              </Button>
              <Button 
                color="inherit" 
                component={Link} 
                to="/profile" 
                startIcon={<Person />}
                sx={{ 
                  textTransform: 'none',
                  fontWeight: 500,
                  borderRadius: 2,
                  px: 2,
                  mr: 1,
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.1)',
                    transform: 'translateY(-1px)',
                    transition: 'all 0.2s ease'
                  }
                }}
              >
                Profile
              </Button>
              
              <IconButton
                color="inherit"
                sx={{ 
                  mr: 1,
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.1)',
                    transform: 'scale(1.1)',
                    transition: 'all 0.2s ease'
                  }
                }}
              >
                <Badge badgeContent={3} color="error">
                  <Notifications />
                </Badge>
              </IconButton>

              <Box sx={{ position: 'relative' }}>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  color="inherit"
                  sx={{ 
                    p: 0.5,
                    border: '2px solid transparent',
                    borderRadius: '50%',
                    '&:hover': {
                      borderColor: 'rgba(255,255,255,0.3)',
                      transform: 'scale(1.05)',
                      transition: 'all 0.2s ease'
                    }
                  }}
                >
                  {(() => {
                    console.log('Navbar user data:', { 
                      name: user.name, 
                      role: user.role, 
                      profileImage: user.profileImage,
                      hasProfileImage: !!user.profileImage 
                    });
                    return user.profileImage ? (
                      <Avatar 
                        src={`https://jovac-project-2oqb.onrender.com/${user.profileImage}?t=${Date.now()}`}
                        alt={user.name}
                        sx={{ 
                          width: 36, 
                          height: 36,
                          border: '2px solid rgba(255,255,255,0.2)'
                        }}
                        key={user.profileImage}
                        onError={(e) => {
                          console.error('Avatar image failed to load:', e.target.src);
                        }}
                      />
                    ) : (
                      <Avatar sx={{ 
                        width: 36, 
                        height: 36, 
                        bgcolor: 'rgba(255,255,255,0.2)',
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '1.1rem'
                      }}>
                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                      </Avatar>
                    );
                  })()}
                </IconButton>
                
                <Chip
                  label={user.role}
                  size="small"
                  sx={{
                    position: 'absolute',
                    top: -8,
                    right: -8,
                    bgcolor: user.role === 'admin' ? 'error.main' : 'success.main',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '0.65rem',
                    height: 18,
                    '& .MuiChip-label': {
                      px: 1
                    }
                  }}
                />
              </Box>

              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                sx={{
                  mt: 1,
                  '& .MuiPaper-root': {
                    borderRadius: 3,
                    minWidth: 200,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                    border: '1px solid rgba(0,0,0,0.05)'
                  }
                }}
                MenuListProps={{
                  sx: { py: 1 }
                }}
              >
                <Box sx={{ px: 2, py: 1, mb: 1 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    {user.profileImage ? (
                      <Avatar 
                        src={`https://jovac-project-2oqb.onrender.com/${user.profileImage}?t=${Date.now()}`}
                        alt={user.name}
                        sx={{ width: 40, height: 40 }}
                      />
                    ) : (
                      <Avatar sx={{ 
                        width: 40, 
                        height: 40, 
                        bgcolor: 'primary.main',
                        fontWeight: 600
                      }}>
                        {user.name?.charAt(0)?.toUpperCase() || 'U'}
                      </Avatar>
                    )}
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {user.name}
                      </Typography>
                      <Chip
                        label={user.role.toUpperCase()}
                        size="small"
                        sx={{
                          bgcolor: user.role === 'admin' ? 'error.light' : 'success.light',
                          color: user.role === 'admin' ? 'error.dark' : 'success.dark',
                          fontWeight: 'bold',
                          fontSize: '0.7rem',
                          height: 20
                        }}
                      />
                    </Box>
                  </Stack>
                </Box>
                
                <Divider sx={{ my: 1 }} />
                
                <MenuItem 
                  onClick={handleClose}
                  component={Link}
                  to="/profile"
                  sx={{ 
                    py: 1.5,
                    borderRadius: 1,
                    mx: 1,
                    '&:hover': {
                      bgcolor: 'primary.light',
                      color: 'primary.contrastText'
                    }
                  }}
                >
                  <ListItemIcon>
                    <Person sx={{ color: 'inherit' }} />
                  </ListItemIcon>
                  <ListItemText primary="Profile Settings" />
                </MenuItem>
                
                <MenuItem 
                  onClick={handleClose}
                  sx={{ 
                    py: 1.5,
                    borderRadius: 1,
                    mx: 1,
                    '&:hover': {
                      bgcolor: 'grey.100'
                    }
                  }}
                >
                  <ListItemIcon>
                    <Settings />
                  </ListItemIcon>
                  <ListItemText primary="Account Settings" />
                </MenuItem>
                
                <Divider sx={{ my: 1 }} />
                
                <MenuItem 
                  onClick={handleLogout}
                  sx={{ 
                    py: 1.5,
                    borderRadius: 1,
                    mx: 1,
                    color: 'error.main',
                    '&:hover': {
                      bgcolor: 'error.light',
                      color: 'error.dark'
                    }
                  }}
                >
                  <ListItemIcon>
                    <ExitToApp sx={{ color: 'inherit' }} />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </MenuItem>
              </Menu>
            </Stack>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;