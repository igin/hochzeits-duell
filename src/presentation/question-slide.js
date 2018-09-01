import React from "react";
import PropTypes from "prop-types";
import { Notes, Heading } from "spectacle";
import { RevealableAnswers } from "./revealable-answers";

export const QuestionSlide = (props) => {
  const {
    questionContainer,
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
    <div>
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
    </div>
  );
};

QuestionSlide.propTypes = {
  players: PropTypes.array.isRequired,
  questionContainer: PropTypes.object.isRequired,
  questionIndex: PropTypes.number.isRequired,
  revealedAnswers: PropTypes.object.isRequired,
  selectionsByPlayers: PropTypes.object.isRequired,
  toggleAnswer: PropTypes.func.isRequired,
  toggleRevealAnswer: PropTypes.func.isRequired
};
