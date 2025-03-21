// src/components/ContactDetail.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../style/contactdetail.css'; // Corrected import statement

import Header from '../headerfooter/Header';
import Footer from '../headerfooter/Footer';

const ContactDetail = () => {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchContacts = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/contacts'); // Adjust the URL as needed
                setContacts(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchContacts();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <><Header />
        
        
        <div className='main'>
            <h2>Contact Persons</h2>
            {contacts.length === 0 ? (
                <p>No Contact found.</p>
            ) : (
                <ol>
                    {contacts.map((contact) => (
                        <li key={contact._id} className='list'>
                            <strong>Name:</strong> {contact.name} <br />
                            <strong>Email:</strong> {contact.email} <br />
                            <strong>Message:</strong> {contact.message}
                        </li>
                    ))}
                </ol>
            )}
        </div>
        <Footer/>
        </>
    );
};

export default ContactDetail;