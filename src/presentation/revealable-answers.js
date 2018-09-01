import React from "react";
import { List, ListItem } from "spectacle";
import styled from "styled-components";

export class RevealableAnswers extends React.Component {
  constructor() {
    super();

    this.state = {
      revealedAnswers: []
    };
  }

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
                <tr key={answerIndex} className={revealed ? "visible" : "" }>
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


    // return (
    //
    //
    //
    //
    //   <List>
    //     {
    //       answers.map((answer, index) => {
    //         const isRevealed = this.state.revealedAnswers.indexOf(index) !== -1;
    //
    //         return (
    //           <ListItem key={index}
    //             style={{
    //               opacity: isRevealed ? 1.0 : 0.1
    //             }}
    //           >
    //             <span onClick={() => {
    //               if (!isRevealed) {
    //                 this.setState({
    //                   revealedAnswers: [...this.state.revealedAnswers, index]
    //                 });
    //               }
    //             }}
    //             >{answer.title} - {answer.people}</span>
    //           </ListItem>
    //         );
    //       })
    //     }
    //   </List>
    // );
  }
}

const AnswerTitle = styled.span`
  opacity: 0.1;
  
  .visible & {
    opacity: 1.0;
  }
`;

