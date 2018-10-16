import React, {Component} from 'react';

import Time from '../../../components/Time';

const renderMissions = (mission, index) => (
  <section className="warframe__sortie-mission" key={index}>
    <h3 className="warframe__header">
      {mission.node.value}
    </h3>
    <p className="warframe__small">
      <span className="bold">Type:</span> {mission.type}
    </p>
    <p>
      <span className="bold">Enemy:</span> lvl. {mission.level}
    </p>
    <p className="warframe__small bold">{mission.effect}</p>
  </section>
);

const renderSortieInfo = (sortie) => (
  <section className="warframe__sortie">
    <p className="warframe__small">
      <span className="bold">Boss:</span> {sortie.boss}
    </p>    
    <p className="warframe__small">
      <span className="bold">Enemy:</span> {sortie.enemy}
    </p>
    <p className="warframe__small">
      <span className="bold">Ends in:</span> <Time time={sortie.timeEnd}/>
    </p>
    <section className="warframe__columns">
      {sortie.missions.map(renderMissions)}
    </section>
  </section>
);

const renderExpired = () => (
  <p className="warframe__small">
    Previous sortie just expired, new information coming in next few minutes
  </p>
);

const renderSortie = (sortie) => (
  <section className="warframe__seperator">
    {sortie.expired ? renderExpired() : renderSortieInfo(sortie)}
  </section>
);

export default class Sortie extends Component {
  render() {
    return renderSortie(this.props.sortie);
  }
}
