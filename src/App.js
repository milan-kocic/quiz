import { useEffect, useReducer } from 'react';
import Header from './components/Header';
import './index.css';
import Main from './components/Main';
import Error from './components/Error';
import Loader from './components/Loader';
import StartScreen from './components/StartScreen';
import Question from './components/Question';
import NextButton from './components/NextButton';
import Progress from './components/Progress';
import FinishScreen from './components/FinishScreen';

function reducer(state, action) {
  switch (action.type) {
    case 'dataRecived':
      return { ...state, questions: action.payload, status: 'ready' };
    case 'dataFailed':
      return { ...state, status: 'error' };
    case 'start':
      return { ...state, status: 'active' };
    case 'newAnswer':
      //! const question = state.questions[state.index]; ovo je isto kao dole
      //! array.at(index) - vraća element na određenoj poziciji u nizu
      //! isto kao i array[index]
      const question = state.questions.at(state.index);
      // pišemo state.questions jer je state objekat, a questions je svojstvo objekta state
      // state se nalazi u App.js u useReducer hook-u i ima svojstvo questions
      // state je drugi parametar u useReducer hook-u i možemo da mu pristupimo preko state.questions ili state.status
      // ili state.index ili state.answer ili state.points ili state.highscore, bez state ne možemo da pristupimo svojstvima objekta state
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points
      };
    case 'nextQuestion':
      return { ...state, index: state.index + 1, answer: null };
    case 'finish':
      return {
        ...state,
        status: 'finished',
        highscore:
          state.points > state.highscore ? state.points : state.highscore
      };

    case 'restart':
      // return { ...initialState, questions: state.questions, status: 'ready' };
      // ili ovako dole (kao da je initialState objekat) - spread operator će da prepiše sve vrednosti iz initialState objekta,
      // a onda će da prepiše i questions i status iz state objekta
      // (ovo je isto kao da smo napisali initialState.questions i initialState.status) -
      // ovo je isto kao i gore sa initialState objektom samo što je ovde kraće napisano (kraći zapis) - ...initialState (spread operator)

      return {
        ...state,
        status: 'ready',
        index: 0,
        answer: null,
        points: 0,
        highscore: 0
      };

    default:
      throw new Error('No such action type');
  }
}

function App() {
  const [{ questions, status, index, answer, points, highscore }, dispatch] =
    useReducer(reducer, {
      questions: [],
      status: 'loading',
      index: 0,
      answer: null,
      points: 0,
      highscore: 0
    });
  const numQuestions = questions.length;
  const questionPoints = questions.reduce(
    (acc, question) => acc + question.points,
    0
  );

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
          <>
            <Progress
              index={index}
              numQuestions={numQuestions}
              questionPoints={questionPoints}
              points={points}
              answer={answer}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <NextButton
              dispatch={dispatch}
              answer={answer}
              numQuestions={numQuestions}
              index={index}
            />
          </>
        )}
        {status === 'finished' && (
          <FinishScreen
            points={points}
            questionPoints={questionPoints}
            highscore={highscore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}

export default App;
