import React from "react";
import PropTypes from "prop-types";
import { Notes, Heading } from "spectacle";
import { RevealableAnswers } from "./revealable-answers";
import styled from "styled-components";

export const QuestionSlide = (props) => {
  const {
    questionContainer,
    players,
    selectionsByPlayers,
    toggleAnswer,
    toggleRevealAnswer,
    revealedAnswers,
    partialResults
  } = props;
  const {
    question,
    answers
  } = questionContainer;

  const totalPoints = Math.max(Object.keys(partialResults)
    .map((playerId) => partialResults[playerId])
    .reduce((a, b) => a + b, 0), 1);

  const playWrongAnswer = () => {
    const audio = new Audio("negativeAnswer.mp3");
    audio.play();
  };

  return (
    <SlideContainer>
      <Heading size={5}>{question}</Heading>
      <RevealableAnswers
        answers={answers}
        players={players}
        selectionsByPlayers={selectionsByPlayers}
        toggleAnswer={toggleAnswer}
        toggleRevealAnswer={toggleRevealAnswer}
        revealedAnswers={revealedAnswers}
      />
      <PartialResultBarContainer>
        {Object.keys(partialResults).map((playerId) => (
          <PartialResultBar
            key={playerId}
            color={players[playerId].color}
            percentage={partialResults[playerId] / totalPoints}
          />
        ))}
      </PartialResultBarContainer>
      <Notes>
        <h4>Answers:</h4>
        <ol>
          {answers.map((answer, answerIndex) => {
            return (
              <li key={answerIndex}>{answer.title} - {answer.people}</li>
            );
          })}
        </ol>
        <h4>Zwischenstand vor dieser Frage: </h4>
        {Object.keys(partialResults).map((playerId) => (
          <p key={playerId}>{playerId} - {partialResults[playerId]}</p>
        ))}
        <WrongAnswerButton onClick={playWrongAnswer}>
          <img src="./wrongButton.png" alt="My_Logo" width="90" height="30" />
        </WrongAnswerButton>
      </Notes>
    </SlideContainer>
  );
};

QuestionSlide.propTypes = {
  partialResults: PropTypes.object.isRequired,
  players: PropTypes.object.isRequired,
  questionContainer: PropTypes.object.isRequired,
  questionIndex: PropTypes.number.isRequired,
  revealedAnswers: PropTypes.object.isRequired,
  selectionsByPlayers: PropTypes.object.isRequired,
  toggleAnswer: PropTypes.func.isRequired,
  toggleRevealAnswer: PropTypes.func.isRequired
};

const SlideContainer = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-content: space-between;
  align-items: stretch;
`;

const PartialResultBarContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 100px;
  border-radius: 20px;
  opacity: 0.3;
  overflow: hidden;
`;

const PartialResultBar = styled.div`
  height: 20px;
  background-color: ${(props) => props.color};
  flex: ${(props) => props.percentage};
`;

const WrongAnswerButton = styled.button`
  background: none;
  outline: none;
  border: none;
  right: 0;
  bottom: 0;
`;
