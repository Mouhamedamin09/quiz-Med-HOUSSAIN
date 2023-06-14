import React from 'react';

function Element(props) {
  const allAnswers = [...props.shuffledAnswers];

  const pog = props.isAnswered;
  const handleRadioChange = (event) => {
    const { value } = event.target;
    props.handleAnswerChange(props.index, value);
  };

  const isCorrect = (answer) => {
    return answer === props.correct;
  };

  return (
    <div className='container'>
      <h1 className='question'>{props.question}</h1>
      <div className='buttonContainer'>
        {allAnswers.map((answer, index) => (
          <label
            className={`answerLabel ${props.selectedAnswer === answer ? 'selected' : ''} ${
              pog ? (isCorrect(answer) ? 'Green' : 'Red') : ''
            }`}
            key={index}
          >
            <input
              type='radio'
              className='answerRadio'
              name={`question-${props.index}`}
              value={answer}
              checked={props.selectedAnswer === answer}
              onChange={handleRadioChange}
              disabled={pog}
            />
            {answer}
          </label>
        ))}
      </div>
      <hr />
    </div>
  );
}

export default Element;
