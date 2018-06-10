import React, {Component} from 'react';

const renderNodes = (invasions) => (
  invasions.map(invasion => (
      <section className="warframe__invasion-planet warframe__column" key={invasion.node.value}>
        <header className="warframe__invasion-parties">
          <span className="warframe__invasion-party warframe__invasion-party--attacker">{invasion.defender}</span>
          <span className="warframe__invasion-party warframe__invasion-party--planet">{invasion.node.value} ({invasion.planet})</span>
          <span className="warframe__invasion-party warframe__invasion-party--defender">{invasion.attacker}</span>
        </header>
        <div className={`warframe__invasion-total warframe__invasion-total--${invasion.attacker.toLowerCase()}`}>
          <span className={`warframe__invasion-current warframe__invasion-current--${invasion.defender.toLowerCase()}`} style={{right: invasion.status + '%'}}></span>
          <span className="warframe__invasion-zero"></span>
        </div>
        <div className="warframe__invasion-parties">
          <ul className="warframe__invasion-party warframe__invasion-party--attacker-rewards">
            {invasion.attackerRewards.map((reward, index) => (
              <li key={index}>{reward}</li>
            ))}
          </ul>
          <ul className="warframe__invasion-party warframe__invasion-party--defender-rewards">
            {invasion.defenderRewards.map((reward, index) => (
              <li key={index}>{reward}</li>
            ))}
          </ul>
        </div>
      </section>
    )
  )
);

export default class Invasions extends Component {
  render() {
    return (
      <section className="warframe__seperator warframe__columns">
        <h3 className="warframe__header">Invasions</h3>
        {Object.keys(this.props.invasions).map(key =>
          renderNodes(this.props.invasions[key])
        )}
      </section>
    );
  }
}
