import React from "react";
import { Deck, Heading, Slide } from "spectacle";

import createTheme from "spectacle/lib/themes/default";
import { QUESTIONS } from "./game_config/questions";
import { PLAYERS } from "./game_config/players";
import { QuestionSlide } from "./question-slide";

require("../../node_modules/normalize.css/normalize.css");

const theme = createTheme({
  primary: "white",
  secondary: "#1F2022",
  tertiary: "#03A9FC",
  quaternary: "#CECECE"
}, {
  primary: "Montserrat",
  secondary: "Helvetica"
});


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
      ...this.state.revealedAnswers[questionIndex],
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
      <Deck
        transition={["zoom", "slide"]}
        transitionDuration={500}
        theme={theme}
        align="flex-start flex-start"
      >
        <Slide transition={["zoom"]} bgColor="primary">
          <Heading size={1} fit caps lineHeight={1} textColor="secondary">
            👰 Das Hochzeitsduell 🤵
          </Heading>
        </Slide>
        <Slide transition={["zoom"]} bgColor="primary">
          <Heading size={1} fit caps lineHeight={1} textColor="secondary">
            Wir haben 50 Hochzeitsgäste gefragt.
            <br />Das sind ihre Antworten:
          </Heading>
        </Slide>

        {
          QUESTIONS.map((question, questionIndex) => (
            <Slide transition={["fade"]} key={questionIndex}>
              <QuestionSlide
                questionContainer={question}
                questionIndex={questionIndex}
                players={PLAYERS}
                selectionsByPlayers={this.state.selectionsByPlayers[questionIndex]}
                toggleAnswer={(playerId, answerIndex) => this.toggleQuestionAnswerForPlayer(questionIndex, answerIndex, playerId)}
                toggleRevealAnswer={(answerIndex) => this.toggleRevealAnswer(questionIndex, answerIndex)}
                revealedAnswers={this.state.revealedAnswers[questionIndex]}
              />
            </Slide>))
        }
      </Deck>
    );
  }
}
