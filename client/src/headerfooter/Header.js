// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Optional: Create a CSS file for styling

import icon from '../image/test.png'; // Adjust the path as necessary

const Header = () => {
    return (
        <header>
            <div className="header-title">
                <h1>TEST GENERATOR</h1>
            </div>
            <div className="container5">
                <div className="logo">
                    <img src={icon} alt="YouTube" className="header-icon" />
                </div>
                <nav>
                    <ul>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/app">App</Link></li>
                        <li><Link to="/test">Test</Link></li>
                        <li><Link to="/about">About</Link></li>
                        <li><Link to="/contact">Contact</Link></li>
                        <li><Link to="/features">Features</Link></li>
                        <li><Link to="/contactdetail">ContactDetails</Link></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;