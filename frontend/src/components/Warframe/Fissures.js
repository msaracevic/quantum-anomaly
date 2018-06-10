import React, {Component} from 'react';

import TimeBlock from './TimeBlock';

const renderFissure = (fissure) => (
  <section className="warframe__fissure" key={fissure.node.value}>
    <p className="warframe__small">
      <span className="bold">{fissure.node.type}</span>
      <span> at {fissure.node.value} against </span>
      <span className="bold">{fissure.node.enemy}</span>
    </p>
    <TimeBlock timeStart={fissure.timeStart} 
               timeEnd={fissure.timeEnd} 
               className='warframe__small'/>
  </section>
);

const renderFissures = (label, fissures) => (
  <div className="warframe__fissures warframe__column" key={label}>
    <h3 className="warframe__header">{label} fissures</h3>
    {fissures.length !== 0 ? fissures.map(fissure => renderFissure(fissure)) : 'None at the moment'}
  </div>
);

export default class Fissures extends Component {
  render() {
    return (
      <section className="warframe__seperator warframe__columns">
        {Object.keys(this.props.fissures)
          .map(key => renderFissures(key, this.props.fissures[key]))}
      </section>
    );
  }
}
