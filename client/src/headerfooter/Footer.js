// src/components/Footer.js
import React from 'react';
import './Footer.css'; // Optional: Create a CSS file for styling

// Import your icon images
import emailIcon from '../image/email.png'; // Replace with your actual path
import githubIcon from '../image/github.png'; // Replace with your actual path
import linkedinIcon from '../image/linkedin.png'; // Replace with your actual path
import youtubeIcon from '../image/youtube.png'; // Replace with your actual path

const Footer = ({ currentYear }) => {
    return (
        <footer>
            <div className="container">
                <p>&copy; {currentYear} TEST GENERATOR. All rights reserved.</p>
                <div className="social-links">
                    <a href="mailto:your-email@example.com" target="_blank" rel="noopener noreferrer">
                        <img src={emailIcon} alt="Email" className="social-icon" />
                    </a>
                    <a href="https://github.com/your-github-username" target="_blank" rel="noopener noreferrer">
                        <img src={githubIcon} alt="GitHub" className="social-icon" />
                    </a>
                    <a href="https://www.linkedin.com/in/your-linkedin-username" target="_blank" rel="noopener noreferrer">
                        <img src={linkedinIcon} alt="LinkedIn" className="social-icon" />
                    </a>
                    <a href="https://www.youtube.com/channel/your-youtube-channel" target="_blank" rel="noopener noreferrer">
                        <img src={youtubeIcon} alt="YouTube" className="social-icon" />
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;