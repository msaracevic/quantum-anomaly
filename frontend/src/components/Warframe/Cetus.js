import React, {Component} from 'react';

import Time from '../../componentsCommon/Time';

const renderCetus = (cetus) => (
  <section className="warframe__cetus warframe__seperator">
    <h3 className="warframe__header">Cetus information</h3>
    <p className="warframe__small">
      <span>Currently it is </span>
      <span className={cetus.day ? 'warframe__icons warframe__icons--day bold' : 'warframe__icons warframe__icons--night bold'}>
        {cetus.day ? 'day' : 'night'}
      </span>
      <span> for another </span>
      <span className="bold"><Time time={cetus.timeDayNightRemaining} showSeconds='true' colorCode='true'/></span>
    </p>
    <p className="warframe__small">
      Ostrons bounties will refresh in <Time time={cetus.timeOstronBountyRemaining} showSeconds='true'/>
    </p>
  </section>
);

export default class Cetus extends Component {
  render() {
    return renderCetus(this.props.cetus);
  }
}