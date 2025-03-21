import React from 'react';
// import './Home.css'

import '../style/Home.css'; // Corrected import statement

import { Link } from 'react-router-dom';
import Header from '../headerfooter/Header';
import Footer from '../headerfooter/Footer';

function Home() {
  const currentYear = new Date().getFullYear();

  return (

    <><Header /><div>
     

      <main>
        <section className="hero">
          <div className="container3">
            <h2>Create and Manage Tests Effortlessly</h2>
            <p>Our test generator allows you to create customized tests in minutes on the basis of your upload notes. Whether you're an educator, a trainer, or just looking to quiz yourself, we have the tools you need.</p>
            <Link to="/app" className="cta-button">Get Started</Link>
          </div>
        </section>

        <section id="about" className="about">
          <div className="container">
            <h2>Info</h2>
            <p>Test Generator is designed to simplify the process of creating and managing tests. Our platform is user-friendly and packed with features to help you create high-quality tests quickly and efficiently.</p>
          </div>
        </section>

        <section id="features" className="features">
          <div className="container">
            <h2>Features</h2>
            <div className="feature">
              <h3>Customizable Tests</h3>
              <p>Design tests with various question types and customize them to meet your needs.</p>
            </div>
            <div className="feature">
              <h3>Real-Time Analytics</h3>
              <p>Track performance and analyze results with our real-time analytics tools.</p>
            </div>
            <div className="feature">
              <h3>User-Friendly Interface</h3>
              <p>Our intuitive interface makes it easy to create and manage tests without any hassle.</p>
            </div>
          </div>
        </section>

        <section id="contact" className="contact">
          <div className="container">
            <h2>Contact Us</h2>
            <p>If you have any questions or need support, feel free to <a href="mailto:rkx639849@gmail.com">email us</a>. We are here to help!</p>
          </div>
        </section>
      </main>

     
    </div>
    <Footer/>
    </>
  );
}

export default Home;