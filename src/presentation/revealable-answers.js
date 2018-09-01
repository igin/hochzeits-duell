import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";


export class RevealableAnswers extends React.Component {
  render() {
    const {
      answers,
      players,
      selectionsByPlayers,
      toggleAnswer,
      toggleRevealAnswer,
      revealedAnswers
    } = this.props;


    const playerHeaders = Object.keys(players).map((playerId) => players[playerId].emoji);
    const headers = [
      "Reveal",
      "",
      "Antwort",
      "👥",
      ...playerHeaders
    ];

    return (
      <table>
        <thead>
          <tr>
            {headers.map((header, index) => <th key={index}>{header}</th>)}
          </tr>
        </thead>
        <tbody>
          {
            answers.map((answer, answerIndex) => {
              const aPlayerHasSelected = Object.keys(players)
                .some((playerId) => selectionsByPlayers[playerId][answerIndex]);
              const revealed = aPlayerHasSelected || revealedAnswers[answerIndex];

              return (
                <tr key={answerIndex} className={revealed ? "visible" : ""}>
                  <td onClick={() => toggleRevealAnswer(answerIndex)}>Reveal</td>
                  <td>{answerIndex + 1}</td>
                  <td><AnswerTitle>{answer.title}</AnswerTitle></td>
                  <td>{answer.people}</td>
                  {Object.keys(players).map((playerId, playerIndex) => {
                    const answerSelectedByPlayer = selectionsByPlayers[playerId][answerIndex];

                    return (
                      <td key={playerIndex} onClick={() => toggleAnswer(playerId, answerIndex)}>
                        {answerSelectedByPlayer && players[playerId].emoji}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          }
        </tbody>
      </table>
    );
  }
}

RevealableAnswers.propTypes = {
  answers: PropTypes.array.isRequired,
  players: PropTypes.object.isRequired,
  revealedAnswers: PropTypes.object.isRequired,
  selectionsByPlayers: PropTypes.object.isRequired,
  toggleAnswer: PropTypes.func.isRequired,
  toggleRevealAnswer: PropTypes.func.isRequired
};

const AnswerTitle = styled.span`
  opacity: 0.1;
  
  .visible & {
    opacity: 1.0;
  }
`;

