import React, {Component} from 'react';

export default class LoadingScreen extends Component {
  render() {
    return (
      <div className="loading-screen">
        <p className="loading-screen__message">
          Loading content, please wait
        </p>
      </div>
    );
  }
}
