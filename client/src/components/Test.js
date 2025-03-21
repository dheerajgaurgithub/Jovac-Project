import React, { useState } from 'react';
import axios from 'axios';

// style\Test.css

import '../style/Test.css'; // Corrected import statement




import Header from '../headerfooter/Header';
import Footer from '../headerfooter/Footer';

const Test = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [answersSubmitted, setAnswersSubmitted] = useState(false);
  const [answerStatus, setAnswerStatus] = useState({});

  // Function to fetch questions from the backend
  const fetchQuestions = async () => {
    setLoading(true);
    setError(null); // Reset error state before fetching
    try {
      const response = await axios.get('http://localhost:5000/api/questions');
      setQuestions(response.data);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setError('Failed to fetch questions. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (index, value) => {
    setAnswers((prevAnswers) => ({ ...prevAnswers, [index]: value }));
  };

  const checkAnswers = () => {
    let score = 0;
    const answerStatus = {};
    questions.forEach((q, index) => {
      const userAnswer = answers[index];
      // Check if the user's answer matches the correct option
      if (userAnswer !== undefined && userAnswer === q.correctOption) {
        score++;
        answerStatus[index] = { correct: true, answer: userAnswer };
      } else {
        answerStatus[index] = { correct: false, answer: userAnswer };
      }
    });
    setScore(score);
    setAnswerStatus(answerStatus);
    setAnswersSubmitted(true);
  };

  return (

    <>
    <Header />
    
    
    <div className="test-container">
      <h2>Your Test</h2>
      {loading && <div>Loading questions...</div>}
      {error && <div>{error}</div>}
      {questions.length === 0 && !loading && (
        <div>
          <p>No questions available.</p>
          <button onClick={fetchQuestions}>Generate Test</button>
        </div>
      )}
      {questions.length > 0 && (
        questions.map((q, index) => (
          <div key={index} className="question">
            <p>{index + 1}. {q.question}</p>
            <div className="options">
              {q.options.map((option, i) => (
                <div key={i}>
                  <input
                    type="radio"
                    name={`question${index}`}
                    value={i} // Store the index of the selected option
                    onChange={() => handleAnswerChange(index, i)} // Update the answer with the index
                    disabled={answersSubmitted} // Disable input fields after submitting answers
                  />
                  <label>{option}</label>
                </div>
              ))}
            </div>
            {answersSubmitted && (
              <div>
                <p style={{ color: answerStatus[index].correct ? 'green' : 'red' }}>
                  {answerStatus[index].correct ? 'Correct' : 'Incorrect'}
                </p>
                <p style={{ color: 'red' }}>
                  Your answer: {answerStatus[index].answer !== undefined ? q.options[answerStatus[index].answer] : 'No answer'}
                </p>
                {answerStatus[index].correct ? '' : (
                  <p style={{ color: 'green' }}>
                    Correct answer: {q.options[q.correctOption]}
                  </p>
                )}
              </div>
            )}
          </div>
        ))
      )}
      {answersSubmitted && (
        <div id="results">
          <h3>Your Score: {score} out of {questions.length}</h3>
        </div>
      )}
      {!answersSubmitted && questions.length > 0 && (
        <button onClick={checkAnswers}>
          Submit Answers
        </button>
      )}
    </div>
    
    
    
    <Footer/>
    </>
  );
};

export default Test;