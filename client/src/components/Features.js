import React, { useState, useRef } from 'react';
import Header from '../headerfooter/Header';
import Footer from '../headerfooter/Footer';
import '../style/Features.css'; // Corrected import statement


function Features() {
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [testSubmitted, setTestSubmitted] = useState(false);
  const questionsDivRef = useRef(null);

  const handleAddQuestion = async () => {
    const question = document.getElementById('question').value;
    const options = [
      document.getElementById('option1').value,
      document.getElementById('option2').value,
      document.getElementById('option3').value,
      document.getElementById('option4').value
    ];
    const correctOption = parseInt(document.getElementById('correct-option').value) - 1;

    if (question && options.every(option => option) && correctOption >= 0 && correctOption < 4) {
      const newQuestion = { question, options, correctOption };

      try {
        const response = await fetch('http://localhost:5000/api/questions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newQuestion),
        });

        if (response.ok) {
          const savedQuestion = await response.json();
          setQuestions([...questions, savedQuestion]);
          alert('Question added successfully!');
        } else {
          const errorData = await response.json();
          alert(`Error: ${errorData.message}`);
        }
      } catch (error) {
        console.error('Error adding question:', error);
        alert('Failed to add question. Please try again.');
      }
    } else {
      alert('Please fill all fields correctly.');
    }
  };

  const handleAnswerChange = (index, value) => {
    const updatedAnswers = [...userAnswers];
    updatedAnswers[index] = value;
    setUserAnswers(updatedAnswers);
  };

  const handleSubmitTest = () => {
    const calculatedScore = questions.reduce((total, q, index) => {
      return total + (userAnswers[index] === q.correctOption ? 1 : 0);
    }, 0);
    setScore(calculatedScore);
    setTestSubmitted(true);
  };

  const displayTestPreview = () => {
    return (
      <div id="test-preview">
        {questions.map((q, index) => (
          <div key={index} className="question-item">
            <strong>Q{index + 1}:</strong> {q.question}<br />
            {q.options.map((opt, i) => (
              <div key={i}>
                <input
                  type="radio"
                  name={`q${index}`}
                  value={i}
                  onChange={() => handleAnswerChange(index, i)}
                /> {opt}
              </div>
            ))}
            <br />
          </div>
        ))}
        <button onClick={handleSubmitTest}>Submit Test</button>
        {testSubmitted && <div id="result">You scored {score} out of {questions.length}</div>}
      </div>
    );
  };

  return (

    <><Header />
    <div className="container1">
      <div id="test-creator">
        <h2>Create a Test</h2>
        <div id="question-container">
          <input type="text" id="question" placeholder="Enter question" />
          <input type="text" id="option1" placeholder="Option 1" />
          <input type="text" id="option2" placeholder="Option 2" />
          <input type="text" id="option3" placeholder="Option 3" />
          <input type="text" id="option4" placeholder="Option 4" />
          <input type="number" id="correct-option" placeholder="Correct Option (1-4)" />
          <br />
          <button onClick={handleAddQuestion}>Add Question</button>
        </div>
        <h2>Test Preview</h2>
        {questions.length > 0 && (
          <div>
            {displayTestPreview()}
          </div>
        )}
      </div>
    </div>
    <Footer/>
    </>
  );
}

export default Features;