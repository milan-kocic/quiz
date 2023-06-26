import React from 'react';

function StartScreen({ numQuestions, dispatch }) {
  return (
    <div className='start'>
      <h2>Добродошли у дечији квиз!</h2>
      <h3>{numQuestions} питања за тестирање</h3>
      <button
        className='btn btn-ui'
        onClick={() => dispatch({ type: 'start' })}
      >
        Почетак
      </button>
    </div>
  );
}

export default StartScreen;
