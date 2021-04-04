import React, {Component} from 'react';
import './Time.scss';

const getTimeClass = (time) => {
  if (time.days === 0 && time.hours === 0) {
    if (time.minutes < 1) return 'time time--critical';
    if (time.minutes < 3) return 'time time--danger';
    if (time.minutes < 10) return 'time time--low';
  }
};

const getTimeString = (time, showSeconds = false) => {
  let days = time.days,
    hours = time.hours,
    minutes = time.minutes,
    seconds = time.seconds,
    timeString = '';

  if (time.days === 0 && time.hours === 0 && time.minutes < 5 && showSeconds) {
    timeString += `${minutes} minutes ${seconds} seconds`;
    timeString = timeString.replace('0 minutes ', '');
  } else {
    days += ' day';
    hours += ' hour';
    minutes += ' minute';

    if (time.days > 1) days += 's';
    if (time.hours > 1) hours += 's';
    if (time.minutes > 1) minutes += 's';

    if (time.days !== 0) timeString += days;
    if (time.hours !== 0) timeString += ` ${hours}`;

    timeString += ` ${minutes}`;

    if (time.days === 0 && time.hours === 0 && time.minutes === 0) {
      timeString = 'less than a minute';
    }
    timeString = timeString.replace('hour 0 minute', 'hour');
    timeString = timeString.replace('day 0 hour', 'day');
  }
  return timeString;
};

export default class Time extends Component {
  constructor(props) {
    super(props);
    /* 
     * This might be antipattern, but since this component is being used on lot's of places,
     * we don't want to send along so many functions to be able to do countdowns.
     */
    this.state = {
      time: this.props.time
    };
    if (this.props.showSeconds && this.state.time.minutes <= 5) {
      this.countdown();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.time !== this.state.time) {
      this.setState({time: nextProps.time});
    }
  }

  countdown() {
    setInterval(() => {
      let timeObject = this.state.time;
      if (timeObject.future) {
        timeObject.seconds--;
      }
      if (timeObject.seconds === -1) {
        timeObject.seconds = 59;
        timeObject.minutes--;
        if (timeObject.minutes === -1) {
          timeObject.minutes = 59;
          timeObject.hours--;
        }
        if (timeObject.hours === -1) {
          timeObject.hours = 23;
          timeObject.days--;
        }
      }
      if (timeObject.seconds === 0 && timeObject.minutes === 0 && timeObject.hours === 0 && timeObject.days === 0) {
        timeObject.future = false;
      }
      this.setState({time: timeObject});
    }, 1000);
  }

  render() {
    return (
      <span className={this.props.colorCode ? getTimeClass(this.state.time) : 'time'}>
        {getTimeString(this.state.time, this.props.showSeconds)}
      </span>
    );
  }
}
