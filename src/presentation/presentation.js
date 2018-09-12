import React from "react";
import { Deck, Heading, Slide } from "spectacle";
import md5 from "blueimp-md5";
import styled from "styled-components";
import { hot } from "react-hot-loader";

import createTheme from "spectacle/lib/themes/default";
import { QUESTIONS } from "./game_config/questions";
import { PLAYERS } from "./game_config/players";
import { QuestionSlide } from "./question-slide";
import { ResultsSlide } from "./results-slide";
import { computeTotalPointsPerPlayer, computePartialPointsUntilQuestion } from "./game-state";

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

const positiveAnswer = require("./audio/positiveAnswer.m4a");

class Presentation extends React.Component {
  constructor() {
    super();

    const currentSetupHash = md5(JSON.stringify(QUESTIONS)) + md5(JSON.stringify(PLAYERS));
    const storedSetupHash = localStorage.getItem("presentation_setup_hash");

    const storedState = localStorage.getItem("presentation_state");
    if (storedState && currentSetupHash === storedSetupHash) {
      this.state = JSON.parse(storedState);
    } else {
      localStorage.setItem("presentation_setup_hash", currentSetupHash);

      this.state = this.makeInitialState();

      localStorage.setItem("presentation_state", JSON.stringify(this.state));
    }
  }

  componentDidMount() {
    window.addEventListener("storage", (event) => {
      if (event.key === "presentation_state") {
        this.setState(JSON.parse(localStorage.getItem("presentation_state")));
      }
    });
  }

  componentDidUpdate() {
    localStorage.setItem("presentation_state", JSON.stringify(this.state));
  }


  reInitializeState() {
    const currentSetupHash = md5(JSON.stringify(QUESTIONS)) + md5(JSON.stringify(PLAYERS));
    localStorage.setItem("presentation_setup_hash", currentSetupHash);

    this.setState(this.makeInitialState());

    localStorage.setItem("presentation_state", JSON.stringify(this.state));
  }

  makeInitialState() {
    const initialSelections = QUESTIONS.map(() => {
      const selectionByPlayer = {};
      Object.keys(PLAYERS).forEach((playerId) => {
        selectionByPlayer[playerId] = {};
      });
      return selectionByPlayer;
    });

    return {
      selectionsByPlayers: initialSelections,
      revealedAnswers: QUESTIONS.map(() => ({}))
    };
  }

  toggleQuestionAnswerForPlayer(questionIndex, answerIndex, playerId) {
    const newSelections = [...this.state.selectionsByPlayers];
    const newQuestionAnswers = { ...newSelections[questionIndex] };
    const selectedAnswers = newQuestionAnswers[playerId];
    selectedAnswers[answerIndex] = !selectedAnswers[answerIndex];
    if (selectedAnswers[answerIndex]) {
      const audio = new Audio(positiveAnswer);
      audio.play();
    }

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
      <div>
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
                  partialResults={computePartialPointsUntilQuestion(PLAYERS, this.state.selectionsByPlayers, questionIndex)}
                  questionContainer={question}
                  questionIndex={questionIndex}
                  players={PLAYERS}
                  selectionsByPlayers={this.state.selectionsByPlayers[questionIndex]}
                  toggleAnswer={(playerId, answerIndex) => this.toggleQuestionAnswerForPlayer(questionIndex, answerIndex, playerId)}
                  toggleRevealAnswer={(answerIndex) => this.toggleRevealAnswer(questionIndex, answerIndex)}
                  revealedAnswers={this.state.revealedAnswers[questionIndex]}
                />
              </Slide>
            ))
          }
          <Slide>
            <Heading>
              Und der Sieger ist:
            </Heading>
          </Slide>
          <Slide>
            <ResultsSlide
              players={PLAYERS}
              playerPoints={computeTotalPointsPerPlayer(PLAYERS, this.state.selectionsByPlayers)}
            />
          </Slide>
        </Deck>
        <ResetButton
          onClick={() => this.reInitializeState()}
        >
          🔄
        </ResetButton>
      </div>
    );
  }
}

const ResetButton = styled.button`
  background: none;
  outline: none;
  border: none;
  margin-top: 200px;
  opacity: 0.2;
  position: fixed;
  right: 0;
  bottom: 0;
`;

export default hot(module)(() => <Presentation />);
