import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './components/App';
import About from './components/About';
import Contact from './components/Contact';
import Features from './components/Features';

import Home from './components/Home';
import Test from './components/Test'; // Adjust the path as necessary
import ContactDetail from './components/contactdetail'; // Adjusted to match the filename


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/features" element={<Features />} />
        <Route path="/app" element={<App />} />
        <Route path="/Test" element={<Test />} />
        <Route path="/contactdetail" element={<ContactDetail />} />


      </Routes>
    </BrowserRouter>
);