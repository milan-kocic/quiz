import React from 'react';

function Question({ questions }) {
  return <div>{questions[0].question}</div>;
}

export default Question;
