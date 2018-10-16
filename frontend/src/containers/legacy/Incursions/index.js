import React, {Component} from 'react';
import LoadingScreen from '../../../components/LoadingScreen';

export default class Incursions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      incursions: {},
      expanded:   {}
    };

    this.expandStations = this.expandStations.bind(this);
  };

  expandStations(systemId) {
    const expanded     = this.state.expanded;
    expanded[systemId] = !expanded[systemId];
    this.setState({
      expanded: expanded
    });
  }

  componentWillMount() {
    fetch('/api/get-incursions')
      .then(response => response.json())
      .then(response => this.setState({
        incursions: response
      }));
  }

  expandStationsButton(systemId) {
    return (
      <button className="btn btn--cta btn--small incursion__toggle"
              onClick={() => this.expandStations(systemId)}
              title="Toggle stations">S</button>
    );
  }

  stationsClassName(systemId) {
    return !this.state.expanded[systemId] ? 'systems__cell--hidden' : 'systems__cell systems__cell--stations';
  }

  static stationRows(stations) {
    return stations.map(
      ({
         stationID:   id,
         stationName: name,
         hasRepairs
       }) => (
        <p className="systems__station" key={id}>
          {name} {hasRepairs ? '+' : ''}
        </p>
      )
    );
  }

  systemsRows(systems) {
    return systems.map(
      ({
         solarSystemID:   systemId,
         incursionType:   type,
         solarSystemName: name,
         stations,
         security,
         radius
       }) => (
        <div className="systems__row" key={systemId}>
          <span className="systems__cell">{type}</span>
          <span className="systems__cell systems__cell--name">
            {name} {stations.length > 0 ? this.expandStationsButton(systemId) : ''}
          </span>
          <span className="systems__cell">{security}</span>
          <span className="systems__cell">{radius}</span>
          <span className={this.stationsClassName(systemId)}>
            {Incursions.stationRows(stations)}
          </span>
        </div>
      )
    );
  }

  incursions(incursions) {
    return incursions.map(incursion => {
      const factionId     = incursion['factionID'],
            factionName   = incursion['factionName']  || "Null security space",
            constellation = incursion['constellationName'],
            influence     = incursion['influence'],
            state         = incursion['state'],
            hasBoss       = incursion['hasBoss'],
            systems       = incursion['systems'],
            constImg      = `https://image.eveonline.com/Alliance/${factionId || 500000}_128.png`;

      return (
        <article className="incursion" key={incursion['constellationID']}>
          <header className="incursion__header">
            <div className="incursion__header-image">
              <img className="responsive" src={constImg} alt={constellation} />
            </div>
            <div className="incursion__header-text">
              <h4>{constellation}</h4>
              <h6>{factionName}</h6>
            </div>
          </header>
          <section className="box">
            <span className="box__label">Influence: </span>
            <span className="box__value">{influence}%</span>
          </section>
          <section className="box">
            <span className="box__label">State: </span>
            <span className="box__value">{state} {hasBoss ? '*' : ''}</span>
          </section>
          <article className="systems">
            <header className="systems__header">
              <span className="systems__cell">Type</span>
              <span className="systems__cell systems__cell--name">System</span>
              <span className="systems__cell">Security</span>
              <span className="systems__cell">Radius</span>
            </header>
            <section className="systems-rows">
              {this.systemsRows(systems)}
            </section>
          </article>
        </article>
      );
    });
  }

  render() {
    if (Object.keys(this.state.incursions).length === 0) {
      return <LoadingScreen />;
    } else {
      return (
        <article className="incursions">
          <h1>Incursions</h1>
          {this.incursions(this.state.incursions)}
        </article>
      );
    }
  }
}
