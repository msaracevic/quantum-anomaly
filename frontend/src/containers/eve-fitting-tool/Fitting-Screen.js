import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import LoadingScreen from '../../components/LoadingScreen';
import * as efsActions from '../../redux/efsActions';

import Modules from './Modules';

class FittingScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shipId: this.props.match.params.shipId
    };
  }

  componentWillMount() {
    this.props.fetchShip(this.state.shipId);
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
    const ship  = this.props.efsReducer.ship || {},
          group = this.props.efsReducer.currentGroup || {},
          dogma = ship.dogmaAttributesNamed || {};

    return (
      <article className="fitting-main">
        <h2 className="fitting-main__title">{ship.name || 'Loading...'}</h2>
        <Link to='/eve-fitting-simulator' className='link link--secondary'>
          back to {`${group.name}s`.replace('ss', 's')}
        </Link>
        <section className="fitting-main__header">
          <div className={dogma['Meta Level'] && `fitting-main__image tech-level tech-level--${dogma['Meta Level'].value}`}>
            <img src={ship.type_id ? `https://image.eveonline.com/Render/${ship.type_id}_128.png` : '/images/placeholder.png'} alt="ship" />
          </div>
        </section>
        <section className="fitting-main__sections">
          <section className="fitting-main__modules">
            <Modules />
          </section>

          {this.props.efsReducer.ship &&
          <section className='fitting__slots'>
            {this.renderSlots('High Slots')}
            {this.renderSlots('Medium Slots')}
            {this.renderSlots('Low Slots')}
            {this.renderSlots('Rig Slots')}
          </section>
          }
          {this.props.efsReducer.ship &&
          <section className='fitting__stats'>
            <h5 className='fitting__title'>Stats</h5>
            {this.renderDogmaAttribute('CPU Load', 'CPU Output')}
            {this.renderDogmaAttribute('Power Load', 'Powergrid Output')}
          </section>
          }
        </section>
      </article>
    );
  }
}

const mapStateToProps    = state => state,
      mapDispatchToProps = {...efsActions};

export default connect(mapStateToProps, mapDispatchToProps)(FittingScreen);
