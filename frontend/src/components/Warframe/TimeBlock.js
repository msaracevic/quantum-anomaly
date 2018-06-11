import React, {Component} from 'react';

import Time from '../../componentsCommon/Time';

export default class Common extends Component {
  render() {
    let timeStart   = this.props.timeStart,
        timeEnd     = this.props.timeEnd,
        showSeconds = this.props.showSeconds || false;

    return (
      <p className={this.props.className}>
        <span className="bold">{timeStart.future ? 'Starts in' : 'Started'}: </span>
        <Time time={timeStart} showSeconds={showSeconds}/>{timeStart.future ? '' : ' ago'}<br/>
        <span className="bold">Ends in: </span><Time colorCode='true' time={timeEnd} showSeconds={showSeconds}/>
      </p>
    );
  }
}
