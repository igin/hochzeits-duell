const NUMBER_OF_ANSWERS_SHOWN = 5;

const computePointsPerPlayer = (players, selectionsByPlayers) => {
  const playerPoints = {};
  const playerIds = Object.keys(players);
  playerIds.forEach((playerId) => {
    const playerSelections = selectionsByPlayers.map((question) => question[playerId]);
    const pointsPerQuestion = playerSelections.map((questionAnswers) => {
      const selectedAnswers = Object.keys(questionAnswers)
        .filter((answerIndex) => questionAnswers[answerIndex] === true)
        .map((key) => Number(key));
      const answers = selectedAnswers.length === 0 ? [NUMBER_OF_ANSWERS_SHOWN] : selectedAnswers;
      const bestAnswer = Math.min(...answers);
      return NUMBER_OF_ANSWERS_SHOWN - bestAnswer;
    });
    playerPoints[playerId] = pointsPerQuestion.reduce((acc, sum) => acc + sum, 0);
  });

  return playerPoints;
};

export const computePartialPointsUntilQuestion = (players, selectionsByPlayers, questionIndex) => {
  const partialSelections = selectionsByPlayers.slice(0, questionIndex);
  return computePointsPerPlayer(players, partialSelections);
};

export const computeTotalPointsPerPlayer = (players, selectionsByPlayers) => {
  const playerPoints = computePointsPerPlayer(players, selectionsByPlayers);
  const playerIds = Object.keys(players);
  const points = playerIds.map((playerId) => playerPoints[playerId]);
  if (points.length > 1 && points.every((point) => point === points[0])) {
    playerPoints[playerIds[0]] += 1;
  }
  return playerPoints;
};

export const sortAndTrimAnswers = (questions) => {
  return questions.map((question) => {
    const newAnswers = question.answers.sort((answerA, answerB) => {
      const peopleA = answerA.people;
      const peopleB = answerB.people;
      return peopleA > peopleB ? -1 : 1;
    }).slice(0, NUMBER_OF_ANSWERS_SHOWN);

    return {
      ...question,
      answers: newAnswers
    };
  });
};
