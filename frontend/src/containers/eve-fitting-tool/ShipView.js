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

  renderDogmaAttribute(attribute) {
    let ship = this.props.eveFittingSimulatorReducer;
    return (
      <React.Fragment>
        {ship.dogmaAttributesNamed[attribute].value} {ship.dogmaAttributesNamed[attribute].units}
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
              <img src={`https://image.eveonline.com/Render/${ship.type_id}_128.png`} alt="ship"/>
            </div>
            <div className="ship_view__info">
              <h4>{ship.name}</h4>
              <p>
                CPU: {this.renderDogmaAttribute('CPU Output')}
              </p>
              <p>
                CPU: {this.renderDogmaAttribute('Powergrid Output')}
              </p>
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
