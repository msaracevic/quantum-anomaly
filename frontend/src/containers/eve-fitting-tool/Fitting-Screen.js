import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import * as efsActions from '../../redux/efsActions';

import Modules from './Modules';
import Slots from './Slots';

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

  render() {
    const ship  = this.props.efsReducer.ship || {},
          group = this.props.efsReducer.currentGroup || {},
          dogma = ship.dogmaAttributesNamed || {};

    return (
      <article className="fitting-main">
        <section className="fitting-main__header">
          <div className={dogma['Meta Level'] ? `fitting-main__image tech-level tech-level--${dogma['Meta Level'].value}` : 'fitting-main__image'}>
            <img src={ship.type_id ? `https://image.eveonline.com/Render/${ship.type_id}_128.png` : '/images/placeholder.png'} alt="ship" />
          </div>
          <div className="fitting-main__controls">
            <h2 className="fitting-main__title">{ship.name || 'Loading...'}</h2>
            <Link to='/eve-fitting-simulator' className='link link--secondary'>
              back to {`${group.name}s`.replace('ss', 's')}
            </Link>
          </div>
        </section>
        <section className="fitting-main__sections">
          <section className="fitting-main__modules">
            <Modules />
          </section>

          <section className="fitting-main__slots">
            <Slots ship={this.props.efsReducer.ship} />
          </section>

          <section className='fitting-main__stats'>
            <h5 className='fitting__title'>Stats</h5>
            {this.props.efsReducer.ship &&
            <React.Fragment>
              {this.renderDogmaAttribute('CPU Load', 'CPU Output')}
              {this.renderDogmaAttribute('Power Load', 'Powergrid Output')}
            </React.Fragment>
            }
          </section>
        </section>
      </article>
    );
  }
}

const mapStateToProps    = state => state,
      mapDispatchToProps = {...efsActions};

export default connect(mapStateToProps, mapDispatchToProps)(FittingScreen);
