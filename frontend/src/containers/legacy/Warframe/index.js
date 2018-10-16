import React, {Component} from 'react';
import LoadingScreen from '../../../components/LoadingScreen';
import Tabs from '../../../components/Tabs';

import Alerts from './Alerts';
import Sortie from './Sortie';
import Invasions from './Invasions';
import Fissures from './Fissures';
import Cetus from './Cetus';
import Planets from './Planets';

const UPDATE_FREQUNCY = 60 * 1000;

const cetusTabHeader = (cetus) => {
  let label;
  cetus.day ? label = 'D' : label = 'N';
  if (cetus.timeDayNightRemaining.minutes < 5 && cetus.timeDayNightRemaining.hours === 0) {
    label += `~ ${cetus.timeDayNightRemaining.minutes} min`
  }
  return `Cetus - (${label})`;
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
    tempDebug(true, false);
    fetch('/api/warframe')
      .then(response => response.json())
      .then(response => {
        response.lastUpdate = new Date();
        response.nextUpdate = new Date(response.lastUpdate.getTime() + UPDATE_FREQUNCY);
        this.setState({...response});
        tempDebug(false, response)
      });
  }

  componentWillMount() {
    this.getData();
    setInterval(this.getData.bind(this), UPDATE_FREQUNCY);
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
          <div className='warframe__update-info'>
            <span>
              Last update: {this.state.lastUpdate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}
            </span>
            <span>
              Next update: {this.state.nextUpdate.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}
            </span>
          </div>
        </article>
      );
    }
  }
}


function tempDebug (start, result) {
  if (start) {
    console.log(`Time: ${(()=>new Date())().getHours()}:${(()=>new Date())().getMinutes()}:${(()=>new Date())().getSeconds()}
Action: Getting data from /api/warframe`);
  }
  if (result) {
    console.log(`Time: ${(()=>new Date())().getHours()}:${(()=>new Date())().getMinutes()}:${(()=>new Date())().getSeconds()}
Action: Got reply from /api/warframe
Result: `);
    console.log(result);
  }
}
