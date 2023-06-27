import { useEffect, useReducer } from 'react';
import Header from './components/Header';
import './index.css';
import Main from './components/Main';
import Error from './components/Error';
import Loader from './components/Loader';
import StartScreen from './components/StartScreen';
import Question from './components/Question';

function reducer(state, action) {
  switch (action.type) {
    case 'dataRecived':
      return { ...state, questions: action.payload, status: 'ready' };
    case 'dataFailed':
      return { ...state, status: 'error' };
    case 'start':
      return { ...state, status: 'active' };
    case 'newAswer':
      // !const question = state.questions[state.index]; ovo je isto kao dole
      //!array.at(index) - vraća element na određenoj poziciji u nizu
      //!isto kao i array[index]
      const question = state.questions.at(state.index);

      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points
      };
    default:
      throw new Error('No such action type');
  }
}

function App() {
  const [{ questions, status, index, answer }, dispatch] = useReducer(reducer, {
    questions: [],
    status: 'loading',
    index: 0,
    answer: null,
    points: 0
  });
  const numQuestions = questions.length;

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch('http://localhost:8080/questions');
        if (!res.ok) {
          throw new Error('Something went wrong');
        }
        const data = await res.json();
        dispatch({ type: 'dataRecived', payload: data });
      } catch (err) {
        dispatch({ type: 'dataFailed' });
      }
    };
    fetchQuestions();
  }, []);

  return (
    <div className='app'>
      <Header />
      <Main>
        {status === 'loading' && <Loader />}
        {status === 'error' && <Error />}
        {status === 'ready' && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === 'active' && (
          <Question
            question={questions[index]}
            dispatch={dispatch}
            answer={answer}
          />
        )}
      </Main>
    </div>
  );
}

export default App;
