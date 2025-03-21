import React, { useState } from 'react';
// import './App.css';
import '../style/App.css'; // Corrected import statement

import axios from 'axios';
import Header from '../headerfooter/Header';
import Footer from '../headerfooter/Footer';

function App() {
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [testStarted, setTestStarted] = useState(false);
  const [answersSubmitted, setAnswersSubmitted] = useState(false);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [answers, setAnswers] = useState({});
  const [answerStatus, setAnswerStatus] = useState({});
  const [uploadedText, setUploadedText] = useState('');

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) {
      alert('Please upload a file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      setUploadedText(text); // Store uploaded text
    };
    reader.readAsText(file);
  };

  const generateQuestions = (text) => {
    const sentences = text.split('. ');
    const questions = sentences.map((sentence, index) => {
      const words = sentence.split(' ');
      const wordToBlank = words[Math.floor(Math.random() * words.length)];
      const question = sentence.replace(wordToBlank, '______');
      return {
        question: question,
        answer: wordToBlank
      };
    });
    return questions;
  };

  const handleGenerateTest = () => {
    if (uploadedText) {
      const questions = generateQuestions(uploadedText);
      setQuestions(questions);
      setTestStarted(true);
      setAnswersSubmitted(false); // Reset state for new test
      setScore(0); // Reset score for new test
      setAnswers({}); // Reset answers for new test
      setAnswerStatus({}); // Reset answer status for new test
    } else {
      alert('Please upload a file first.');
    }
  };

  const displayQuestions = () => {
    return questions.map((q, index) => (
      <div key={index} className="question">
        <p>{index + 1}. {q.question}</p>
        <input
          type="text"
          id={`answer${index}`}
          placeholder="Your answer"
          onChange={(e) => handleAnswerChange(index, e.target.value)}
          disabled={answersSubmitted} // Disable input fields after submitting answers
        />
        {answersSubmitted && (
          <div>
            <p style={{ color: answerStatus[index].correct ? 'green' : 'red' }}>
              {answerStatus[index].correct ? 'Correct' : 'Incorrect'}
            </p>
            <p style={{ color: 'red' }}>
              Your answer: {answerStatus[index].answer}
            </p>
            {answerStatus[index].correct ? '' : (
              <p style={{ color: 'green' }}>
                Correct answer: {q.answer}
              </p>
            )}
          </div>
        )}
      </div>
    ));
  };

  const handleAnswerChange = (index, answer) => {
    setAnswers((prevAnswers) => ({ ...prevAnswers, [index]: answer }));
  };

  const checkAnswers = () => {
    let score = 0;
    const answerStatus = {};
    questions.forEach((q, index) => {
      const userAnswer = answers[index];
      if (userAnswer && userAnswer.toLowerCase() === q.answer.toLowerCase()) {
        score++;
        answerStatus[index] = { correct: true, answer: userAnswer };
      } else {
        answerStatus[index] = { correct: false, answer: userAnswer };
      }
    });
    setScore(score);
    setAnswerStatus(answerStatus);
    setAnswersSubmitted(true);

    // Save the answer status to local storage
    localStorage.setItem('answerStatus', JSON.stringify(answerStatus));

    axios.post('/api/store-answers', { answers, score })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (


    <><Header /><div>
      
      <div className="projectinfo">
        <h4>Summer Internship: JOVAC FULL STACK WEB DEVELOPMENT</h4>
        <h4>Project 16: Customized test generator from notes</h4>
      </div>
      <div className="container2">
        <form onSubmit={(e) => e.preventDefault()}>
          <label htmlFor="noteInput">Upload your notes (text only):</label>
          <input type="file" id="noteInput" accept=".txt" onChange={handleFileUpload} />
          <button type="button" onClick={handleGenerateTest}>
            Generate Test
          </button>
        </form>
        {testStarted && (
          <div id="testContainer">
            <h2>Your Test</h2>
            <div id="questions">{displayQuestions()}</div>
            <button id="submitAnswers" onClick={checkAnswers}>
              Submit Answers
            </button>
            <div id="results">
              <h3>Your Score: {score} out of {questions.length}</h3>
            </div>
          </div>
        )}
      </div>
      
     
    </div>
    <Footer/>
    
    </>
  );
}

export default App;