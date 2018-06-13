import React, {Component} from 'react';

const renderResources = (resource) => (
  <li className="warframe__resource" key={resource}>
    <img src={`/images/resources/${resource.replace(/ /g, '')}.png`} alt={resource} />
    <span>{resource}</span>
  </li>
);

const renderPlanet = (planet) => (
  <div className="warframe__planet" key={planet.name}>
    <h3 className="warframe__header">{planet.name}</h3>
    <ul>{planet.resources.map(resource => renderResources(resource))}</ul>
  </div>
);

export default class Planets extends Component {
  render() {
    return (
      <section className="warframe__seperator warframe__planets">
        {this.props.planets.map(planet => renderPlanet(planet))}
      </section>
    );
  }
}
