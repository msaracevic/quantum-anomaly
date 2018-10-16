import React, {Component} from 'react';

import Time from '../../../components/Time';

const renderCetus = (cetus) => (
  <section className="warframe__seperator">
    <p>
      <span>Currently it is </span>
      <span className={`warframe__icons warframe__icons--${cetus.day ? 'day' : 'night'} bold`}>
        {cetus.day ? 'day' : 'night'}
      </span>
      <span> for another </span>
      <span className="bold"><Time time={cetus.timeDayNightRemaining} showSeconds='true' colorCode='true'/></span>
    </p>
    <p>
      Ostrons bounties will refresh in <Time time={cetus.timeOstronBountyRemaining} showSeconds='true'/>
    </p>
  </section>
);

export default class Cetus extends Component {
  render() {
    return renderCetus(this.props.cetus);
  }
}
