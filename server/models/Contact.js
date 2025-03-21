// models/Contact.js
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true }
}, {
    toJSON: { virtuals: true, versionKey: false }, // Exclude __v field
    toObject: { virtuals: true, versionKey: false } // Exclude __v field when converting to object
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;