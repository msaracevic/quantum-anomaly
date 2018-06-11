import React, {Component} from 'react';

import TimeBlock from './TimeBlock';

const renderAlert = ({location, timeStart, timeEnd, faction, level, type, rewards}, index) => (
  <section className="warframe__alert warframe__column" key={index}>
    <h3 className="warframe__header">
      {location}
    </h3>
    <p className="warframe__small">
      <span className="bold">Type:</span> {type}
    </p>    
    <p>
      <span className="bold">Enemy:</span> {faction} lvl. {level}
    </p>
    <TimeBlock timeStart={timeStart} timeEnd={timeEnd}/>
    <p className="warframe__small bold">
      Rewards: 
    </p>
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
        {this.props.alerts.map(renderAlert)}
      </section>
    );
  }
}
