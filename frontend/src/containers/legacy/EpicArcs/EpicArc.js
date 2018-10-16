import React, {Component} from 'react';

import Missions from './EpicArcMissions';

const renderList = (label, values) => (
  <section className="arcs__info-segment">
    <span className="arcs__info-label arcs__info-label--bold">{label}:</span>
    <ul className="arcs__info">
      {values.map((value, index) => (
        <li key={index}>{value}</li>
      ))}
    </ul>
  </section>
);

const renderHeader = (arc) => (
  <section className="arcs__item">
    <header className="arcs__header">
      <div className="arcs__faction-logo">
        <img src={`https://image.eveonline.com/Alliance/${arc.iconID}_128.png`} alt="faction logo"/>
      </div>
      <h2 className="arcs__title arcs__title--big">{arc.name}</h2>
    </header>
    <section className="arcs__info-segment">
      <span className="arcs__info-label arcs__info-label--bold">Agent:</span>
      <span className="arcs__info">{arc.starter}</span>
    </section>
    {renderList('Rewards', arc.rewards)}
    {renderList('Notes', arc.notes)}
  </section>
);

const renderGeneral = (arc) => (
  <section className="arcs__item">
    <h4 className="arcs__subtitle">General info</h4>
    <p className="arcs__description">{arc.global}</p>
    <p className="arcs__description">{arc.description}</p>
  </section>
);

export default class EpicArc extends Component {
  render() {
    return (
      <article>
        {renderHeader(this.props.arc)}
        {renderGeneral(this.props.arc)}
        <Missions missions={this.props.arc.missions}/>
      </article>
    );
  }
}
