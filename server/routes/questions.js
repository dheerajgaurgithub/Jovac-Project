const express = require('express');
const Question = require('../models/Question');

const router = express.Router();

// Get all questions
router.get('/', async (req, res) => {
    try {
        const questions = await Question.find();
        res.json(questions); // __v will be excluded due to schema options
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add a new question
router.post('/', async (req, res) => {
    const { question, options, correctOption } = req.body;

    const newQuestion = new Question({
        question,
        options,
        correctOption
    });

    try {
        const savedQuestion = await newQuestion.save();
        res.status(201).json(savedQuestion); // __v will be excluded due to schema options
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;