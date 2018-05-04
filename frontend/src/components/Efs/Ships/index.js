import React, {Component} from 'react';

import LoadingScreen from '../../../componentsCommon/LoadingScreen';
import * as helpers from '../helpers';

const renderTankProfile = (profile) => (
  <div className="tank">
    {Object.keys(profile).map((key, index) => {
      return (
        <div className={`tank__item tank__item--${key}`} key={index}>
          <div className="tank__value">{profile[key]}%</div>
          <div className={`tank__strength tank__strength--${key}`} style={{width: profile[key] + '%'}}></div>
        </div>
      )
    })}
  </div>
);

const renderStatBlock = (ship, key) => {
  let statBlock = helpers.getStatObject(ship[key], key);
  return (
    <div className="efs__columns">
      <span className="efs__column efs__column--label bold">{statBlock.label}</span>
      <span className="efs__column efs__column--value">
        {statBlock.value} {statBlock.units}
      </span>
    </div>
  );
};

const renderShipSelector = (shipTypes, onChange) => (
  <section className="efs__selector">
    <span>Ship Type: </span>
    <select onChange={onChange} className="efs__selector">
      {shipTypes.map(option => (
        <option value={option} key={option}>{option}</option>
      ))}
    </select>
  </section>
);

const renderDefense = (ship) => (
  <div className="efs__columns efs__stat-section">
    <div className="efs__column">
      {renderStatBlock(ship, 'shieldCapacity')}
    </div>
    <div className="efs__column">
      {renderTankProfile(ship.shieldProfile)}
    </div>
    <div className="efs__column">
      {renderStatBlock(ship, 'armorHP')}
    </div>
    <div className="efs__column">
      {renderTankProfile(ship.armorProfile)}
    </div>
    <div className="efs__column">
      {renderStatBlock(ship, 'hp')}
    </div>
    <div className="efs__column">
      {renderTankProfile(ship.hullProfile)}
    </div>
  </div>
);

const renderOffense = (ship) => (
  <div className="efs__columns efs__stat-section">
    <div className="efs__column">
      {renderStatBlock(ship, 'upgradeSlotsLeft')}
      {renderStatBlock(ship, 'hiSlots')}
      {renderStatBlock(ship, 'medSlots')}
      {renderStatBlock(ship, 'lowSlots')}
    </div>
    <div className="efs__column">
      {renderStatBlock(ship, 'upgradeCapacity')}
      {renderStatBlock(ship, 'turretSlotsLeft')}
      {renderStatBlock(ship, 'launcherSlotsLeft')}
    </div>
  </div>
);

const renderSensors = (ship) => (
  <div className="efs__columns efs__stat-section">
    <div className="efs__column">
      {renderStatBlock(ship, 'scanResolution')}
      {renderStatBlock(ship, 'maxLockedTargets')}
    </div>
    <div className="efs__column">
      {renderStatBlock(ship, 'sensorStrength')}
      {renderStatBlock(ship, 'maxTargetRange')}
    </div>
  </div>
);

const renderMobility = (ship) => (
  <div className="efs__columns efs__stat-section">
    <div className="efs__column">
      {renderStatBlock(ship, 'align')}
      {renderStatBlock(ship, 'agility')}
      {renderStatBlock(ship, 'mass')}
    </div>
    <div className="efs__column">
      {renderStatBlock(ship, 'maxVelocity')}
      {renderStatBlock(ship, 'warpSpeedMultiplier')}
      {renderStatBlock(ship, 'capacity')}
    </div>
  </div>
);

const renderGeneral = (ship) => (
  <div className="efs__columns efs__stat-section">
    <span className="efs__column efs__column--label bold">CPU / Powergrid</span>
    <span className="efs__column efs__column--value">
      {ship.cpuOutput.toLocaleString()} tf / {ship.powerOutput.toLocaleString()} MW
    </span>
  </div>
);
const renderCapAndDrones = (ship) => (
  <div>
    {renderStatBlock(ship, 'capacitorCapacity')}
    {renderStatBlock(ship, 'droneBandwidth')}
    {renderStatBlock(ship, 'droneCapacity')}
  </div>
);

const renderTraits = (ship) => (
  Object.keys(ship.traits).map(traitType => (
    <div className="efs__stat-section" key={traitType}>
      <span className="bold">{traitType}</span>
      {traitType === 'Ship Bonus' ? '' : <span> per skill level</span>}
      <ul className='efs__traits'>
        {ship.traits[traitType].map((trait, index) => (
          <li className='efs__trait' key={index}>
            {trait.bonus}{helpers.getOperationSign(trait.unitID, trait)} {trait.bonusText}
          </li>
        ))}
      </ul>
    </div>
  ))
);

const renderShip = (ship) => (
  <article className={`efs__ship efs__ship--${ship.raceName.toLowerCase()}`}>
    <div className='efs__ship-inner'>
      <header className='efs__columns efs__header'>
        <div className="efs__column efs__ship-preview">
          <img src={`https://image.eveonline.com/Render/${ship.typeID}_64.png`} alt="ship"/>
        </div>
        <div className='efs__column efs__ship-info'>
          <h6 className="efs__ship-name">{ship.typeName}</h6>
          <p className="bold">{ship.groupName}</p>
          <p>{ship.metaLevel}</p>
        </div>
      </header>
      {renderGeneral(ship)}
      {renderCapAndDrones(ship)}
      {renderDefense(ship)}
      {renderOffense(ship)}
      {renderSensors(ship)}
      {renderMobility(ship)}
      {renderTraits(ship)}
    </div>
  </article>
);

export default class Ships extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ships:        [],
      currentGroup: ''
    };
    this.change = this.change.bind(this);
  }

  componentDidMount() {
    fetch('/api/get-all-ships')
      .then(response => response.json())
      .then(response => {
        this.setState({
          ships:        response,
          currentGroup: Object.keys(response)[0]
        });
        console.log(response.Battleship.Minmatar[3]);
      });
  }

  change(event) {
    this.setState({currentGroup: event.target.value});
  }

  render() {
    if (this.state.ships.length !== 0) {
      return (
        <section className="efs">
          {renderShipSelector(Object.keys(this.state.ships), this.change)}
          {Object.keys(this.state.ships[this.state.currentGroup]).map(race =>
            this.state.ships[this.state.currentGroup][race].map(ship => renderShip(ship))
          )}
        </section>
      );
    }
    else return <LoadingScreen/>;
  }
}
