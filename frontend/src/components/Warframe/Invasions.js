import React, {Component} from 'react';

const renderReward = (reward) => (
  <li className="warframe__invasion-reward" key={reward} title={reward}>
    {reward.replace('1 x', '')}
  </li>
);

const renderInvasions = (invasion) => (
  <section className="warframe__column" key={invasion.node}>
    <h3 className="warframe__header">
      {invasion.node} ({invasion.planet})
    </h3>
    <div className={`warframe__invasion warframe__invasion--${invasion.attacker.toLowerCase()}`}>
      <span className={`warframe__invasion-current warframe__invasion-current--${invasion.defender.toLowerCase()}`}
            style={{right: invasion.status + '%'}}></span>
      <span className="warframe__invasion-zero"></span>
    </div>
    <div className="warframe__invasion-factions">
      <div className="warframe__small warframe__invasion-faction">
        <span className="bold">{invasion.defender}</span>
        <ul>
          {invasion.attackerRewards.map(reward => renderReward(reward))}
        </ul>
      </div>
      <div className="warframe__small warframe__invasion-faction">
        <span className="bold">{invasion.attacker}</span>
        <ul>
          {invasion.defenderRewards.map(reward => renderReward(reward))}
        </ul>
      </div>
    </div>
  </section>
);

export default class Invasions extends Component {
  render() {
    return (
      <section className="warframe__seperator warframe__columns">
        {Object.keys(this.props.invasions).map(key =>
          this.props.invasions[key].map(invasion => renderInvasions(invasion))
        )}
      </section>
    );
  }
}
