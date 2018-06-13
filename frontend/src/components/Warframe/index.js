import React, {Component} from 'react';
import LoadingScreen from '../../componentsCommon/LoadingScreen';
import Tabs from '../../componentsCommon/Tabs';

import Alerts from './Alerts';
import Sortie from './Sortie';
import Invasions from './Invasions';
import Fissures from './Fissures';
import Cetus from './Cetus';
import Planets from './Planets';

const cetusTabHeader = (cetus) => {
  let label;
  cetus.day ? label = 'Day' : label = 'Night';
  if (cetus.timeDayNightRemaining.minutes < 5 && cetus.timeDayNightRemaining.hours === 0) {
    label += ` (${cetus.timeDayNightRemaining.minutes} min)`
  }
  return `Cetus - ${label}`;
};

const countableTabHeader = (label, object) => {
  let keys = Object.keys(object);
  return `${label} (${keys.map(key => object[key].length).reduce((total, currentLength) => total + currentLength)})`;
};

export default class Warframe extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  };

  getData() {
    fetch('/api/warframe')
      .then(response => response.json())
      .then(response => {
        this.setState({...response});
        console.log(response);
      });
  }

  componentWillMount() {
    this.getData();
    setInterval(this.getData.bind(this), 1000 * 60);
  }

  render() {
    if (Object.keys(this.state).length === 0) {
      return <LoadingScreen/>;
    } else {
      return (
        <article>
          <Tabs tabs={[{
            title:   `Alerts (${this.state.alerts.length})`,
            content: <Alerts alerts={this.state.alerts}/>
          }, {
            title:   countableTabHeader('Fissures', this.state.fissures),
            content: <Fissures fissures={this.state.fissures}/>
          }, {
            title:   countableTabHeader('Invasions', this.state.invasions),
            content: <Invasions invasions={this.state.invasions}/>
          }, {
            title:   cetusTabHeader(this.state.cetus),
            content: <Cetus cetus={this.state.cetus}/>
          }, {
            title:   `Sortie`,
            content: <Sortie sortie={this.state.sortie}/>
          }, {
            title:   `Planets`,
            content: <Planets planets={this.state.planets}/>
          }
          ]}/>
        </article>
      );
    }
  }
}
