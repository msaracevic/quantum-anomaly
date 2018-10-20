import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import * as shipSelectorActions from '../../redux/eveFittingSimulatorActions';

class ShipView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shipId: this.props.match.params.shipId
    };
  };

  componentWillMount() {
    this.props.fetchShip(this.state.shipId).then(() => {
      console.log(this.props.eveFittingSimulatorReducer);
    });
  }

  renderDogmaAttribute(current = null, attribute) {
    let dogma = this.props.eveFittingSimulatorReducer.dogmaAttributesNamed,
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
    let slotNumber = this.props.eveFittingSimulatorReducer.dogmaAttributesNamed[type].value,
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
    if (this.props.eveFittingSimulatorReducer.shipFetched) {
      let ship  = this.props.eveFittingSimulatorReducer,
          dogma = ship.dogmaAttributesNamed;

      return (
        <article className="ship-view">
          <Link to='/eve-fitting-simulator' className='btn btn--secondary btn--back btn--seperated'>
            Back to ship selection
          </Link>
          <section className="ship-view__header">
            <div className={`ship-view__ship-image tech-level tech-level--${dogma['Meta Level'].value}`}>
              <img src={`https://image.eveonline.com/Render/${ship.type_id}_128.png`} alt="ship" />
            </div>
            <div className="ship_view__info">
              <h4 className="ship-view__title">{ship.name}</h4>
              <p dangerouslySetInnerHTML={{__html: ship.description}}></p>
            </div>
          </section>
          <section className='fitting'>
            <div className='fitting__equipment'>
              <h5 className='fitting__title'>Equipment</h5>
            </div>
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
    else return (<p>Please wait...</p>);
  }
}

const mapStateToProps    = state => state,
      mapDispatchToProps = {...shipSelectorActions};

export default connect(mapStateToProps, mapDispatchToProps)(ShipView);
