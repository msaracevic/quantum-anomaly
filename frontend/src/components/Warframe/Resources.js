import React, {Component} from 'react';

const renderResources = (resource) => (
  <div className="warframe__resource" key={resource}>
    <img src={`/images/resources/${resource.replace(/ /g, '')}.png`} alt={resource} />
    <span>{resource}</span>
  </div>
);

const renderPlanet = (planet) => (
  <div className="warframe__planet" key={planet.name}>
    <h4 className="warframe__planet-name">{planet.name}</h4>
    <div className="warframe__resources">
      {planet.resources.map(resource => renderResources(resource))}
    </div>
  </div>
);

export default class Resources extends Component {
  render() {
    const planets = this.props.planets;
    return (
      <section className="warframe__seperator warframe__planets">
        {planets.map(planet => renderPlanet(planet))}
      </section>
    );
  }
}
