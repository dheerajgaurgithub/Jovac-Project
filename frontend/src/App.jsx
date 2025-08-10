import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container } from '@mui/material';
import Navbar from './components/Navbar';
import Landing from './components/Landing';
import Login from './components/Login';
import Register from './components/Register';
import AdminDashboard from './components/AdminDashboard';
import StudentDashboard from './components/StudentDashboard';
import TestTaking from './components/TestTaking';
import Results from './components/Results';
import About from './components/About';
import Features from './components/Features';
import Developers from './components/Developers';
import Profile from './components/Profile';
import { AuthProvider, useAuth } from './context/AuthContext';
import './App.css';

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
          <Route path="/developers" element={<Developers />} />
          <Route 
            path="/profile" 
            element={user ? <Profile /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/login" 
            element={!user ? <Login /> : <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} />} 
          />
          <Route 
            path="/register" 
            element={!user ? <Register /> : <Navigate to="/dashboard" />} 
          />
          <Route 
            path="/admin/*" 
            element={user && user.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/dashboard" 
            element={user && user.role === 'student' ? <StudentDashboard /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/test/:testId" 
            element={user && user.role === 'student' ? <TestTaking /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/results" 
            element={user ? <Results /> : <Navigate to="/login" />} 
          />
        </Routes>
      </Container>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
