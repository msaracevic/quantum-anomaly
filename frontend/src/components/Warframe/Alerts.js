import React, {Component} from 'react';

import TimeBlock from './TimeBlock';

const renderAlert = ({location, timeStart, timeEnd, faction, level, type, rewards}, index) => (
  <section className="warframe__alert warframe__column" key={index}>
    <p className="warframe__small">
      <span className="bold">{type}</span> at {location}
    </p>
    <p className="warframe__small">
      <span className="bold">{faction}</span> lvl. {level}
    </p>
    <TimeBlock timeStart={timeStart}
               timeEnd={timeEnd}
               className='warframe__small'/>
    <ul>
      {rewards.map((reward, index) => (
        <li className="warframe__reward" key={index}>{reward}</li>)
      )}
    </ul>
  </section>
);

export default class Alerts extends Component {
  render() {
    return (
      <section className="warframe__seperator warframe__columns">
        <h3 className="warframe__header">Alerts</h3>
        {this.props.alerts.map(renderAlert)}
      </section>
    );
  }
}
