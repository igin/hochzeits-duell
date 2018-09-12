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
      "",
      "Antwort",
      "👥",
      ...playerHeaders,
      ""
    ];

    return (
      <AnswerTable>
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

              const title = revealed ? answer.title : answer.title.split("").map(() => "_").join(" ");

              return (
                <tr key={answerIndex} className={revealed ? "visible" : ""}>
                  <td>{answerIndex + 1}</td>
                  <td><AnswerTitle>{title}</AnswerTitle></td>
                  <td>{answer.people}</td>
                  {Object.keys(players).map((playerId, playerIndex) => {
                    const answerSelectedByPlayer = selectionsByPlayers[playerId][answerIndex];

                    return (
                      <td key={playerIndex} onClick={() => toggleAnswer(playerId, answerIndex)}>
                        <EmojiButton selected={answerSelectedByPlayer}>
                          {players[playerId].emoji}
                        </EmojiButton>
                      </td>
                    );
                  })}
                  <td>
                    <RevealButton onClick={() => toggleRevealAnswer(answerIndex)}>👁️</RevealButton>
                  </td>
                </tr>
              );
            })
          }
        </tbody>
      </AnswerTable>
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

const RevealButton = styled.button`
  border: none;
  outline: none;
  
  opacity: 0.1;
  background-color: aliceblue;
  border-radius: 50%;
  text-align: center;
  
  transition: opacity 1s;
  
  &:hover {
    opacity: 0.8;
  }
`;

const EmojiButton = styled.button`
  border: none;
  background: none;
  outline: none;
  transition: opacity 0.3s;
  opacity: ${(props) => props.selected ? 1.0 : 0.0};
  
  &:hover {
    opacity: ${(props) => props.selected ? 1.0 : 0.3};
  }
`;

const AnswerTitle = styled.span`
  opacity: 0.3;
  transition: opacity 1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform-origin: center center;
  
  .visible & {
    opacity: 1.0;
    -webkit-transform: scale3d(5, 5, 5);
    transform: rotate(180deg);
  }
`;

const AnswerTable = styled.table`
  flex: 1;
  margin-top: 150px;
  
  td {
    padding-top: 10px;
    padding-bottom: 10px;
    border: none;
  }
  
  tr:nth-child(even) {
    background-color: aliceblue;
  }
`;


