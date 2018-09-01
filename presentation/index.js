// Import React
import React from 'react';

// Import Spectacle Core tags
import {
  Deck,
  Heading,
  ListItem,
  List,
  Slide,
  Notes
} from 'spectacle';

// Import theme
import createTheme from 'spectacle/lib/themes/default';
import { RevealableAnswers } from './revealable-answers';

// Require CSS
require('normalize.css');

const theme = createTheme({
  primary: 'white',
  secondary: '#1F2022',
  tertiary: '#03A9FC',
  quaternary: '#CECECE'
}, {
  primary: 'Montserrat',
  secondary: 'Helvetica'
});

const PLAYERS = {
  'bettina': {
    name: 'Bettina',
    emoji: '👰'
  },
  'nick': {
    name: 'Nick',
    emoji: '🤵'
  }
};

const QUESTIONS = [
  {
    'question': 'Nennen sie die Lieblingsfarbe von Nick',
    'answers': [
      {
        'title': 'Grün',
        'people': 8
      },
      {
        'title': 'Blau',
        'people': 6
      },
      {
        'title': 'Violet',
        'people': 6
      }
    ]
  },
  {
    'question': 'Nennen sie eine Tätigkeit die Nick besser kann als Bettina',
    'answers': [
      {
        'title': 'Waschen',
        'people': 8
      },
      {
        'title': 'Schlafen',
        'people': 6
      },
      {
        'title': 'Kochen',
        'people': 6
      }
    ]
  }
];


const renderSlide = (props) => {
  const {
    questionContainer,
    index,
    players,
    selectionsByPlayers,
    toggleAnswer,
    toggleRevealAnswer,
    revealedAnswers
  } = props;
  const {
    question,
    answers
  } = questionContainer;

  return (
    <Slide transition={['fade']} key={index}>
      <Heading size={3}>{question}</Heading>
      <RevealableAnswers
        answers={answers}
        players={players}
        selectionsByPlayers={selectionsByPlayers}
        toggleAnswer={toggleAnswer}
        toggleRevealAnswer={toggleRevealAnswer}
        revealedAnswers={revealedAnswers}
      />
      <Notes>
        <h4>Answers:</h4>
        <ol>
          {answers.map((answer, answerIndex) => {
            return (
              <li key={answerIndex}>{answer.title} - {answer.people}</li>
            );
          })}
        </ol>
      </Notes>
    </Slide>
  );
};

export default class Presentation extends React.Component {
  constructor() {
    super();

    const initialSelections = QUESTIONS.map(() => {
      const selectionByPlayer = {};
      Object.keys(PLAYERS).forEach((playerId) => {
        selectionByPlayer[playerId] = { 1: true, 2: true };
      });
      return selectionByPlayer;
    });

    this.state = {
      selectionsByPlayers: initialSelections,
      revealedAnswers: QUESTIONS.map(() => ({}))
    };
  }

  toggleQuestionAnswerForPlayer(questionIndex, answerIndex, playerId) {
    const newSelections = [...this.state.selectionsByPlayers];
    const newQuestionAnswers = { ...newSelections[questionIndex] };
    const selectedAnswers = newQuestionAnswers[playerId];
    selectedAnswers[answerIndex] = !selectedAnswers[answerIndex];
    newSelections[questionIndex] = newQuestionAnswers;
    this.setState({
      selectionsByPlayers: newSelections
    });
  }

  toggleRevealAnswer(questionIndex, answerIndex) {
    const newRevealedQuestionAnswers = {
      ...
        this.state.revealedAnswers[questionIndex],
      [answerIndex]: !this.state.revealedAnswers[questionIndex][answerIndex]
    };
    const newRevealedAnswers = [
      ...this.state.revealedAnswers
    ];
    newRevealedAnswers[questionIndex] = newRevealedQuestionAnswers;

    this.setState({
      revealedAnswers: newRevealedAnswers
    });
  }


  render() {
    return (
      <Deck transition={['zoom', 'slide']} transitionDuration={500} theme={theme}>
        <Slide transition={['zoom']} bgColor="primary">
          <Heading size={1} fit caps lineHeight={1} textColor="secondary">
            👰 Das Hochzeitsduell 🤵
          </Heading>
        </Slide>
        <Slide transition={['zoom']} bgColor="primary">
          <Heading size={1} fit caps lineHeight={1} textColor="secondary">
            Wir haben 50 Hochzeitsgäste gefragt.
            <br />Das sind ihre Antworten:
          </Heading>
        </Slide>

        {
          QUESTIONS.map((question, index) => renderSlide({
            questionContainer: question,
            index,
            players: PLAYERS,
            selectionsByPlayers: this.state.selectionsByPlayers[index],
            toggleAnswer: (playerId, answerIndex) => this.toggleQuestionAnswerForPlayer(index, answerIndex, playerId),
            toggleRevealAnswer: (answerIndex) => this.toggleRevealAnswer(index, answerIndex),
            revealedAnswers: this.state.revealedAnswers[index]
          }))
        }
      </Deck>
    );
  }
}
