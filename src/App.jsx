import React, { useState, useEffect } from 'react';
import Element from "./element";
import he from 'he';

function App() {
  const [questions, setQuestions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState({});
  const [pog, setPog] = useState(false);
  const [isScore, setIsScore] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const response = await fetch('https://opentdb.com/api.php?amount=5&category=31&difficulty=easy');
      const data = await response.json();
      const formattedQuestions = formatQuestions(data.results);
      setQuestions(formattedQuestions);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  const decodeHTML = (text) => {
    return he.decode(text);
  };

  const shuffleAnswers = (correctAnswer, incorrectAnswers) => {
    const allAnswers = [...incorrectAnswers, correctAnswer];
    const shuffledAnswers = allAnswers.sort(() => Math.random() - 0.5);
    return shuffledAnswers;
  };

  const formatQuestions = (rawQuestions) => {
    return rawQuestions.map((rawQuestion) => {
      const decodedQuestion = decodeHTML(rawQuestion.question);
      const decodedCorrectAnswer = decodeHTML(rawQuestion.correct_answer);
      const decodedIncorrectAnswers = rawQuestion.incorrect_answers.map((answer) => decodeHTML(answer));
      const shuffledAnswers = shuffleAnswers(decodedCorrectAnswer, decodedIncorrectAnswers);
      return {
        question: decodedQuestion,
        correct: decodedCorrectAnswer,
        incorrect: decodedIncorrectAnswers,
        shuffledAnswers: shuffledAnswers,
      };
    });
  };

  const CorrectAnswer = questions.map((element) => element.correct);

  const handleClick = () => {
    let newScore = 0;
    for (let i = 0; i < CorrectAnswer.length; i++) {
      if (CorrectAnswer[i] === selectedAnswer[i]) {
        newScore += 1;
      }
    }
    setPog(true);
    setScore(newScore);
    setIsScore(true);
  };

  const handlePlayAgain = () => {
    setPog(false);
    setIsScore(false);
    setSelectedAnswer({});
    fetchQuestions();
  };

  const handleAnswerChange = (index, answer) => {
    setSelectedAnswer((prevAnswer) => ({
      ...prevAnswer,
      [index]: answer
    }));
  };

  const totalQuestions = questions.length;
  const answeredQuestions = Object.keys(selectedAnswer).length;
  const isSubmitDisabled = answeredQuestions < totalQuestions;

  const DataElements = questions.map((element, index) => (
    <Element
      key={index}
      index={index}
      question={element.question}
      correct={element.correct}
      incorrect={element.incorrect}
      selectedAnswer={selectedAnswer[index]}
      handleAnswerChange={handleAnswerChange}
      isAnswered={pog}
      shuffledAnswers={element.shuffledAnswers}
    />
  ));

  return (
    <>
      {DataElements}
      <div className="con">
        {!pog && (
            <button onClick={handleClick} className={`herobtn ${isSubmitDisabled ? 'disabled' : ''}`} disabled={isSubmitDisabled}>
            Submit
            </button>
        )}
        {pog && (
            <button onClick={handlePlayAgain} className={`herobtn change`}>
            Play Again
            </button>
        )}
        {isScore && <p className='score change'>You scored {score}/{totalQuestions} correct answers</p>}
      </div>
    </>
  );
}

export default App;
