import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import LoadingScreen from '../../components/LoadingScreen';
import * as efsActions from '../../redux/efsActions';

class ShipSelector extends Component {
  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
  };

  componentWillMount() {
    this.props.fetchShipGroups()
      .then((data) => {
        // if we have current group assigned, use that, otherwise take first from previous payload
        this.props.fetchShipGroup(this.props.efsReducer.currentGroup.id || data.payload[0].id);
      });
  }

  handleInputChange(e) {
    this.props.fetchShipGroup(e.target.value);
  }

  static renderShips(currentGroupShips) {
    return (
      <div className="ship-selector__ships">
        {currentGroupShips.map(ship => (
          <Link to={`/eve-fitting-simulator/${ship.id}`} className="ship-selector__ship" key={ship.id}>
            <div className={`ship-selector__ship-image tech-level tech-level--${ship.meta_level}`}>
              <img src={`https://image.eveonline.com/Render/${ship.id}_128.png`} alt="ship" />
            </div>
            <h2 className='ship-selector__name'>{ship.name}</h2>
          </Link>
        ))}
      </div>
    );
  }


  render() {
    if (this.props.efsReducer.shipGroups) {
      const shipGroups        = this.props.efsReducer.shipGroups,
            currentGroupShips = this.props.efsReducer.currentGroup.ships;

      return (
        <article className='ship-selector'>
          <h1>EVE Online Fitting Simulator</h1>
          <form onSubmit={this.onSubmit} className="form ship-selector__form">
            <div className="form__control form__control--select">
              <select id="shipGroup" name="shipGroup" value={this.props.efsReducer.currentGroup.id || ''}
                      onChange={this.handleInputChange} required>
                {shipGroups ? shipGroups.map(group =>
                  <option key={group.id} value={group.id}>{group.name}</option>) : null}
              </select>
              <label className="form__control-label" htmlFor="shipGroup">
                Ship group
              </label>
            </div>
          </form>
          {currentGroupShips ? ShipSelector.renderShips(currentGroupShips) : null}
        </article>
      );
    } else return <LoadingScreen />;
  }
}

const mapStateToProps    = state => state,
      mapDispatchToProps = {...efsActions};

export default connect(mapStateToProps, mapDispatchToProps)(ShipSelector);
