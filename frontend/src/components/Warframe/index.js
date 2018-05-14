import React, {Component} from 'react';
import LoadingScreen from '../../componentsCommon/LoadingScreen';

import Alerts from './Alerts';
import Sortie from './Sortie';
import Invasions from './Invasions';
import Fissures from './Fissures';
import Cetus from './Cetus';
import Resources from './Resources';

export default class WarframeStatus extends Component {
  constructor(props) {
    super(props);

    this.state = {
      status: {}
    };
  };

  getData() {
    fetch('/api/get-warframe-status')
      .then(response => response.json())
      .then(response => {
        this.setState({
          status: response
        });
        console.log(response);
      });
  }
  componentWillMount() {
    this.getData();
    setInterval(this.getData.bind(this), 1000 * 60);
  }

  render() {
    if (Object.keys(this.state.status).length === 0) {
      return <LoadingScreen/>;
    } else {
      return (
        <article>
          <Cetus cetus={this.state.status.cetus}/>
          <section className="warframe__columns warframe__seperator">
            <Alerts alerts={this.state.status.alerts}/>
            <Fissures fissures={this.state.status.fissures}/>
          </section>
          <section className="warframe__columns warframe__seperator">
            <Sortie sortie={this.state.status.sortie}/>
            <Invasions invasions={this.state.status.invasions}/>
          </section>
          <Resources planets={this.state.status.planets}/>
        </article>
      );
    }
  }
}
