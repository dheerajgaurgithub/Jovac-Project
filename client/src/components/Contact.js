import React, { useState } from 'react';
// import './Contact.css';

import '../style/Contact.css'; // Corrected import statement

import axios from 'axios'; // Import axios for making HTTP requests
import Header from '../headerfooter/Header';
import Footer from '../headerfooter/Footer';

function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [formMessage, setFormMessage] = useState('');
  const [formMessageColor, setFormMessageColor] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (name === '' || email === '' || message === '') {
      setFormMessage('Please fill out all fields.');
      setFormMessageColor('red');
      return;
    }

    try {
      // Send the contact data to the backend
      await axios.post('http://localhost:5000/api/contacts', {
        name,
        email,
        message
      });

      setFormMessage('Thank you for your message! We will get back to you soon.');
      setFormMessageColor('green');

      // Reset the form
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      setFormMessage('There was an error sending your message. Please try again later.');
      setFormMessageColor('red');
    }
  };

  return (
    <><div>
      <Header />
      <h1>Contact Us</h1>
      <main>
        <section className="contact-info1">
          <h2>Team Member</h2>
          <p><strong>Name:</strong> Rahul</p>
          <p><strong>Address:</strong> GLA University , Mathura</p>
          <p><strong>Email:</strong> <a href="mailto:developer@example.com">rahul.gla2_cs23@gla.ac.in</a></p>
          <p><strong>Contact Number:</strong> +91 6397457320</p>
        </section>

        <section className="contact-info1">
          <h2>Team Member</h2>
          <p><strong>Name:</strong> Dheeraj Gaur</p>
          <p><strong>Address:</strong> GLA University , Mathura </p>
          <p><strong>Email:</strong> <a href="mailto:developer@example.com">dheeraj.gaur_cs23@gla.ac.in</a></p>
          <p><strong>Contact Number:</strong> +91 6397684456</p>
        </section>

        <section className="contact-info1">
          <h2>Team Member</h2>
          <p><strong>Name:</strong> Neelesh Shakya</p>
          <p><strong>Address:</strong> GLA University , Mathura </p>
          <p><strong>Email:</strong> <a href="mailto:developer@example.com">neelesh.shakya_cs23@gla.ac.in</a></p>
          <p><strong>Contact Number:</strong> +91 8077505513</p>
        </section>

        <section className="contact-info1">
          <h2>Team Member</h2>
          <p><strong>Name:</strong> Divesh Singh</p>
          <p><strong>Address:</strong> GLA University , Mathura </p>
          <p><strong>Email:</strong> <a href="mailto:developer@example.com">divesh.singh_cs23@gla.ac.in</a></p>
          <p><strong>Contact Number:</strong> +91 7238036254</p>
        </section>
        {/* Other team members' sections */}
        <section className="contact-form">
          <h2>Send Us a Message</h2>
          <form id="contactForm" onSubmit={handleSubmit}>
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" value={name} onChange={(event) => setName(event.target.value)} required />

            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" value={email} onChange={(event) => setEmail(event.target.value)} required />

            <label htmlFor="message">Message:</label>
            <textarea id="message" name="message" value={message} onChange={(event) => setMessage(event.target.value)} rows="4" required></textarea>

            <button type="submit">Send Message</button>
          </form>
          <p id="formMessage" style={{ color: formMessageColor }}>{formMessage}</p>
        </section>
      </main>

    </div><Footer /></>

  );
}

export default Contact;