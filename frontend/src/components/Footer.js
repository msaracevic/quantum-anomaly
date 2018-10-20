import React, {Component} from 'react';

export default class Footer extends Component {
  render() {
    return (
      <React.Fragment>
        Copyright © {new Date().getFullYear()} Quantum Anomaly
      </React.Fragment>
    );
  }
}
