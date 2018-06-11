import React, {Component} from 'react';
import LoadingScreen from '../../componentsCommon/LoadingScreen';
import Tabs from '../../componentsCommon/Tabs';

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
      let alertCount = this.state.status.alerts.length,
          cetusDay   = this.state.status.cetus.day ? 'Day' : 'Night';
      return (
        <article>
          <Tabs tabs={[{
            title:   `Cetus (${cetusDay})`,
            content: <Cetus cetus={this.state.status.cetus}/>
          }, {
            title:   `Alerts (${alertCount})`,
            content: <Alerts alerts={this.state.status.alerts}/>
          }, {
            title:   `Fissures`,
            content: <Fissures fissures={this.state.status.fissures}/>
          }, {
            title:   `Sortie`,
            content: <Sortie sortie={this.state.status.sortie}/>
          }, {
            title:   `Invasions`,
            content: <Invasions invasions={this.state.status.invasions}/>
          }, {
            title:   `Resources`,
            content: <Resources planets={this.state.status.planets}/>
          }
          ]}/>
        </article>
      );
    }
  }
}
