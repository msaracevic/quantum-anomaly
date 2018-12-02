import React, {Component} from 'react';
import {connect} from 'react-redux';

import LoadingScreen from '../../components/LoadingScreen';
import * as efsActions from '../../redux/efsActions';

class Slots extends Component {
  renderHardpointNumber() {
    let usedGuns    = 0,
        usedMissile = 0,
        maxGuns     = 0,
        maxMissile  = 0;

    if (this.props.ship) {
      maxGuns    = this.props.ship.dogmaAttributesNamed['Turret Hardpoints'].value;
      maxMissile = this.props.ship.dogmaAttributesNamed['Launcher Hardpoints'].value;
    }

    return (
      <ul className="slots__hardpoints">
        <li className="slots__hardpoint">
          {usedGuns} / {maxGuns}
          <img className="slots__hardpoint-image" src={`/images/eve/icons/TurretHardpoints.png`} alt='icon' />
          Hardpoints
        </li>
        <li className="slots__hardpoint">
          {usedMissile} / {maxMissile}
          <img className="slots__hardpoint-image" src={`/images/eve/icons/LauncherHardpoints.png`} alt='icon' />
          Hardpoints
        </li>
      </ul>
    );
  }

  renderSlots(type) {
    let slots = [];

    if (this.props.ship) {
      for (let index=0; index < this.props.ship.dogmaAttributesNamed[type].value; index++) {
        slots.push('Empty Slot');
      }
    }

    return (
      <React.Fragment>
        <h5>{type}</h5>
        {type === 'High Slots' && this.renderHardpointNumber(0, 0)}
        <ul className="slots__items">
          {slots.length === 0 ? <LoadingScreen/> : slots.map((slot, index) =>
            <li className="slots__item" key={index}>
              {slot}
            </li>
          )}
        </ul>
      </React.Fragment>
    );
  }

  render() {
    return (
      <section className='slots'>
        {this.renderSlots('High Slots')}
        {this.renderSlots('Medium Slots')}
        {this.renderSlots('Low Slots')}
        {this.renderSlots('Rig Slots')}
      </section>
    );
  }
}

const mapStateToProps    = state => state,
      mapDispatchToProps = {...efsActions};

export default connect(mapStateToProps, mapDispatchToProps)(Slots);
