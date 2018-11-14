import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import LoadingScreen from '../../components/LoadingScreen';
import * as efsActions from '../../redux/efsActions';

class ShipView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shipId: this.props.match.params.shipId
    };
  };

  componentWillMount() {
    this.props.fetchShip(this.state.shipId)
      .then(() => {
        return this.props.fetchModuleGroups()
      })
      .then(() => {
        console.log(this.props.efsReducer);
      });
  }

  renderDogmaAttribute(current = null, attribute) {
    let dogma = this.props.efsReducer.ship.dogmaAttributesNamed,
        currentValue;

    if (!dogma[attribute]) return null;

    let attributeValue = dogma[attribute].value,
        units          = dogma[attribute].units;

    if (current) currentValue = dogma[current].value;
    if (!isNaN(currentValue)) currentValue = currentValue.toLocaleString('de-DE');
    if (!isNaN(attributeValue)) attributeValue = attributeValue.toLocaleString('de-DE');

    return (
      <div className='fitting__attribute'>
        <img className='fitting__icon' src={`/images/eve/icons/${attribute.replace(' ', '')}.png`} alt='icon' title={attribute} />
        {current ? `${currentValue} / ${attributeValue} ${units}` : `${attributeValue} ${units}`}
      </div>
    );
  }

  renderSlots(type) {
    let slotNumber = this.props.efsReducer.ship.dogmaAttributesNamed[type].value,
        slots      = [];

    for (let index = 0; index < slotNumber; index++) {
      slots.push(<p key={index}>
        Empty slot
      </p>);
    }

    return (
      <React.Fragment>
        <h5 className={type === 'High Slots' ? `fitting__title fitting__title--small` : `fitting__title`}>
          {type}
        </h5>
        {type === 'High Slots' ?
          <div className='fitting__subtitle'>{this.renderDogmaAttribute(null, 'Turret Hardpoints')} {this.renderDogmaAttribute(null, 'Launcher Hardpoints')}</div> : null}
        {slots}
      </React.Fragment>
    );
  }

  render() {
    if (this.props.efsReducer.ship) {
      const ship  = this.props.efsReducer.ship,
            dogma = ship.dogmaAttributesNamed;

      let groupNamePlural = this.props.efsReducer.currentGroup.name + 's';
      groupNamePlural     = groupNamePlural.replace('ss', 's');

      return (
        <article className="ship-view">
          <h2 className="ship-view__title">{ship.name}</h2>
          <Link to='/eve-fitting-simulator' className='link link--secondary'>
            back to {groupNamePlural}
          </Link>
          <section className="ship-view__header">
            <div className={`ship-view__ship-image tech-level tech-level--${dogma['Meta Level'].value}`}>
              <img src={`https://image.eveonline.com/Render/${ship.type_id}_128.png`} alt="ship" />
            </div>
          </section>
          <section className='fitting'>
            <div className='fitting__slots'>
              {this.renderSlots('High Slots')}
              {this.renderSlots('Medium Slots')}
              {this.renderSlots('Low Slots')}
              {this.renderSlots('Rig Slots')}
            </div>
            <div className='fitting__stats'>
              <h5 className='fitting__title'>Stats</h5>
              {this.renderDogmaAttribute('CPU Load', 'CPU Output')}
              {this.renderDogmaAttribute('Power Load', 'Powergrid Output')}
            </div>
          </section>
        </article>
      );
    }
    else return <LoadingScreen />;
  }
}

const mapStateToProps    = state => state,
      mapDispatchToProps = {...efsActions};

export default connect(mapStateToProps, mapDispatchToProps)(ShipView);
