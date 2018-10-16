import React, {Component} from 'react';

const renderMissionSegment = (label, value) => (
  <div className="arcs__info-segment">
    <span className="arcs__info-label arcs__info-label--bold arcs__info-label--mission">{label}:</span>
    <div className="arcs__info">{value}</div>
  </div>
);

const renderMissionPocketWave = (wave) => {
  return wave.enemies.map((enemies, index) => (
    <div className="mission__row" key={index}>
      <div className="mission__count">{enemies.number} </div>
      <div className="mission__enemies">
        <span> x {enemies.name}</span>
        <p className="mission__secondary-info mission__secondary-info--padded">{enemies.effect}</p>
      </div>
    </div>
  ));
};

const renderMissionPocket = (pocket) => {
  return pocket.map((wave, index) => (
    <div className="mission__wave" key={index}>
      <div className="mission__wave-title">
        {index === 0 ? ('Initial wave') : (`Wave ${index}`)} at {wave.range}
        {wave.lastTrigger ? ', last one is trigger' : ''}
        {wave.note ? `, ${wave.note}` : ''}
      </div>
      {renderMissionPocketWave(wave)}
    </div>
  ));
};

const renderMissionPockets = (pockets) => {
  return pockets.map((pocket, index) => (
    <section className="mission__pocket" key={index}>
      <p className="mission__pocket-title">{index === 0 ? ('Initial pocket') : (`Pocket ${index}`)}</p>
      {renderMissionPocket(pocket)}
    </section>
  ));
};

const renderControl = (label, enabled, fn) => (
  <button className="mission__control" disabled={!enabled} onClick={fn}>{label}</button>
);

const renderMissionInfo = (mission) => (
  <section className="mission">
    <div className="mission__column">
      {renderMissionSegment('Agent', mission.agent)}
      {renderMissionSegment('Location', mission.agentLocation)}
      {renderMissionSegment('Type', mission.type)}
      {renderMissionSegment('Description', mission.description)}
      {renderMissionSegment('Destination', mission.destination)}
      {renderMissionSegment('Objective', mission.completed)}
      {mission.enemy ? renderMissionSegment('Enemy', mission.enemy) : ''}
      {renderMissionSegment('Tips', mission.tip)}
    </div>
    <div className="mission__column">
      {renderMissionPockets(mission.pockets || [])}
    </div>
  </section>
);

const renderMissions = (missions, states) => (
  <section className="arcs__item">
    <div className="arcs__info-segment arcs__info-segment--margin">
      <div className="arcs__info-label arcs__info-label--bold arcs__info-label--mission">
        <span>Mission:</span>
        <div>
          {renderControl('◀', states.currentDisplayed !== 0, states.prevMission)}
          {renderControl('▶', states.currentDisplayed !== (states.missionsLenght - 1), states.nextMission)}
        </div>
      </div>
      <div className="arcs__info">
        <select className="mission__selector" onChange={states.expandMission} value={states.currentDisplayed}>
          {missions.map((mission, index) => (
            <option value={index} key={index}>{index + 1}. {mission.name}</option>
          ))}
        </select>
      </div>
    </div>
    {renderMissionInfo(missions[states.currentDisplayed], states)}
  </section>
);

export default class Mission extends Component {
  constructor(props) {
    super(props);

    this.state = {currentDisplayed: 0};

    this.expandMission = this.expandMission.bind(this);
    this.nextMission   = this.nextMission.bind(this);
    this.prevMission   = this.prevMission.bind(this);
  };

  expandMission(event) {
    this.setState({currentDisplayed: parseInt(event.target.value, 10)});
  }

  nextMission() {
    this.setState({currentDisplayed: this.state.currentDisplayed + 1});
  }

  prevMission() {
    this.setState({currentDisplayed: this.state.currentDisplayed - 1});
  }

  render() {
    return renderMissions(this.props.missions, {
      currentDisplayed: this.state.currentDisplayed,
      expandMission:    this.expandMission,
      nextMission:      this.nextMission,
      prevMission:      this.prevMission,
      missionsLenght:   this.props.missions.length
    });
  }
}
