import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";

const ANIMATION_TIME = 10;

export class ResultsSlide extends React.Component {
  constructor(props) {
    super();

    const animatedPlayerPoints = {};
    Object.keys(props.players).forEach((playerId) => {
      animatedPlayerPoints[playerId] = 0;
    });

    this.state = {
      animationActive: false,
      playerPointsAnimated: animatedPlayerPoints,
      targetAnimationTimes: { ...animatedPlayerPoints }
    };
  }

  componentDidMount() {
    window.setTimeout(() => {
      this.setState({
        animationActive: true
      });

      const {
        players,
        playerPoints
      } = this.props;

      const animationStartTime = new Date();
      const maxPoints = Math.max(1, ...Object.keys(playerPoints)
        .map((playerId) => playerPoints[playerId]));

      const playerAnimationDurations = {};
      Object.keys(players).forEach((playerId) => {
        const totalPlayerPoints = playerPoints[playerId];
        const pointsRatio = totalPlayerPoints / maxPoints;
        playerAnimationDurations[playerId] = pointsRatio * ANIMATION_TIME * 1000;
      });

      const animate = () => {
        const pointsAnimated = {};
        Object.keys(players).forEach((playerId) => {
          const animationTime = playerAnimationDurations[playerId];
          const animationProgress = Math.min(1.0, (new Date() - animationStartTime) / animationTime);
          pointsAnimated[playerId] = Math.ceil(animationProgress * playerPoints[playerId]);
        });

        this.setState({
          playerPointsAnimated: pointsAnimated
        });

        if (new Date() - animationStartTime <= ANIMATION_TIME * 1000) {
          this.animationHandle = requestAnimationFrame(animate);
        }
      };

      this.animationHandle = requestAnimationFrame(animate);
    }, 100);
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.animationHandle);
  }

  render() {
    const {
      playerPoints,
      players
    } = this.props;

    const maxPoints = Math.max(1, ...Object.keys(playerPoints)
      .map((playerId) => playerPoints[playerId]));

    return (
      <ResultsContainer>
        {Object.keys(players).map((playerId) => {
          const totalPlayerPoints = playerPoints[playerId];
          const player = players[playerId];

          return (
            <PlayerResults key={playerId}>
              <ResultsBar
                color={player.color}
                pointsRatio={totalPlayerPoints / maxPoints}
                animationActive={this.state.animationActive}
              >
                {this.state.playerPointsAnimated[playerId]}
              </ResultsBar>
              <span>
                {player.emoji} {player.name}
              </span>
            </PlayerResults>
          );
        })}
      </ResultsContainer>
    );
  }
}

ResultsSlide.propTypes = {
  playerPoints: PropTypes.object.isRequired,
  players: PropTypes.object.isRequired
};

const ResultsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  min-height: 600px;
`;

const PlayerResults = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const ResultsBar = styled.div`
  border-radius: 20px;
  padding-top: 20px;
  margin: 50px;
  flex: 1;
  background-color: ${(props) => props.color};
  transition: height ${(props) => ANIMATION_TIME * props.pointsRatio}s linear;
  height: ${(props) => props.animationActive ? 50 + props.pointsRatio * 300 : 50}px;
`;
