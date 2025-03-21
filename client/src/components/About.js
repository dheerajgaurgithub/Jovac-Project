import React from 'react';

import '../style/About.css'; // Corrected import statement

import { Link } from 'react-router-dom';
import Header from '../headerfooter/Header';
import Footer from '../headerfooter/Footer';


function About() {
  const currentYear = new Date().getFullYear();

  return (
    <div>

      <Header/>
        <h1>About Us</h1>
      <main>
        <section className="about-us">
          <p>
            Welcome to TEST GENERATOR, your go-to solution for creating customized tests and assessments with ease!
            <br />
           we understand the importance of effective evaluation tools in education, training, and professional development. Our mission is to empower educators, trainers, and organizations by providing an intuitive and flexible platform for generating high-quality tests tailored to their unique needs.
          </p>
          <h2>Our Story</h2>
          <p>
            Founded in 2024, we was born out of a desire to simplify the process of test creation. We saw the challenges educators and trainers faced with traditional test-making methods and set out to create a tool that would streamline and enhance this process. Our team of dedicated professionals combines expertise in education technology and user experience design to deliver a platform that is both powerful and user-friendly.
          </p>
          <h2>What We Offer</h2>
          <p>
            1. Customizable Templates: Choose from a variety of templates to suit different assessment types, from multiple-choice and true/false questions to essays and practical scenarios.<br />
            2. Easy-to-Use Interface: Our user-friendly design ensures that you can create, modify, and deploy tests quickly and efficiently.<br />
            3. Advanced Features: Benefit from features like question randomization, automated grading, and detailed analytics to gain valuable insights into performance.<br />
            4. Secure and Reliable: We prioritize data security and reliability, ensuring that your assessments are safe and your results are accurate.
          </p>
          <h2>Our Vision</h2>
          <p>
            We envision a world where creating effective and engaging assessments is as simple as a few clicks. By continuously innovating and incorporating feedback from our users, we strive to be at the forefront of test generation technology, making high-quality assessments accessible to everyone.<br />
            <br />
            Thank you for choosing . We’re excited to support your testing needs and look forward to helping you achieve your goals!<br />
            <br />
            For any questions or feedback, feel free to contact us at <Link to="/contact" target="_blank">Contact Information</Link>
          </p>
        </section>
      </main>
      <Footer/>
      
    </div>
  );
}

export default About;