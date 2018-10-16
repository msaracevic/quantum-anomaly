import React, {Component} from 'react';

// import * as helpers from './helpers-Efs';

export default class Ships extends Component {
  constructor(props) {
    super(props);
    this.state = {
      skills: []
    };
  }

  componentWillMount() {
    fetch('/api/get-all-skills')
      .then(response => response.json())
      .then(response => {
        this.setState({
          skills: response
        });
      });
  }

  render() {
    return (
      <div className="ships">
        Skills
      </div>
    );
  }
}
