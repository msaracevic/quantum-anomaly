import React, {Component} from 'react';

import TimeBlock from './TimeBlock';

const isEndless = (type) => {
  return ['Defense', 'Survival', 'Interception'].indexOf(type) !== -1;
};

const renderFissure = (fissure, type) => (
  <section className="warframe__column" key={fissure.node.value}>
    <h3 className="warframe__header">{type.charAt(0).toUpperCase() + type.slice(1)} - {fissure.node.value}</h3>
    <p className="warframe__small">
      <span className="bold">Type:</span> {fissure.node.type}
      {isEndless(fissure.node.type) ? <span className="warframe__fissure-endless"> (endless) </span> : ''}
    </p>
    <p>
      <span className="bold">Enemy: </span> {fissure.node.enemy} 
    </p>
    <TimeBlock timeStart={fissure.timeStart} timeEnd={fissure.timeEnd}/>
  </section>
);

const renderFissures = (type, fissures) => {
  if (fissures.length !== 0) return fissures.map(fissure => renderFissure(fissure, type));
};

export default class Fissures extends Component {
  render() {
    return (
      <section className="warframe__seperator warframe__columns">
        {Object.keys(this.props.fissures).map(key => renderFissures(key, this.props.fissures[key]))}
      </section>
    );
  }
}
