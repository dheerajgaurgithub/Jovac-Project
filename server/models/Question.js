const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    options: { type: [String], required: true },
    correctOption: { type: Number, required: true }
}, {
    toJSON: { virtuals: true, versionKey: false }, // Exclude __v field
    toObject: { virtuals: true, versionKey: false } // Exclude __v field when converting to object
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;