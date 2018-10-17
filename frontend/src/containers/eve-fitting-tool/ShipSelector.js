import React, {Component} from 'react';
import {connect} from 'react-redux';

import * as shipSelectorActions from '../../redux/eveFittingSimulatorActions';

class ShipSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeGroup: this.props.eveFittingSimulatorReducer.group_id || null
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  };

  handleInputChange(e) {
    this.setState({activeGroup: e.target.value});
    this.props.fetchShipGroup(e.target.value);
  }

  componentWillMount() {
    this.props.fetchShipGroups()
      .then(() => {
        if (!this.state.activeGroup) return this.setState({activeGroup: this.props.eveFittingSimulatorReducer.shipGroups[0].id});
      })
      .then(() => {
        this.props.fetchShipGroup(this.state.activeGroup);
      });
  }

  static renderShips(groupInfo) {
    return (
      <div className="ship-selector__ships">
        {groupInfo.map(ship => (
          <a href={`/eve-fitting-simulator/${ship.type_id}`} className="ship-selector__ship" key={ship.type_id}>
            <div className={`ship-selector__ship-image tech-level tech-level--${ship.meta_level}`}>
              <img src={`https://image.eveonline.com/Render/${ship.type_id}_128.png`} alt="ship"/>
            </div>
            <h2 className='ship-selector__name'>{ship.name}</h2>
          </a>
        ))}
      </div>
    );
  }


  render() {
    const shipGroups = this.props.eveFittingSimulatorReducer.shipGroups,
          groupInfo  = this.props.eveFittingSimulatorReducer.activeGroupInfo;
    return (
      <article className='ship-selector'>
        <h1>EVE Online Fitting Simulator</h1>
        <form onSubmit={this.onSubmit} className="form ship-selector__form">
          <div className="form__control form__control--select">
            <select id="shipGroup" name="shipGroup" value={this.state.activeGroup || ''}
                    onChange={this.handleInputChange} required>
              {shipGroups ? shipGroups.map(group =>
                <option key={group.id} value={group.id}>{group.name}</option>) : null}
            </select>
            <label className="form__control-label" htmlFor="shipGroup">
              Ship group
            </label>
          </div>
        </form>
        {groupInfo ? ShipSelector.renderShips(groupInfo) : null}
      </article>
    );
  }
}

const mapStateToProps    = state => state,
      mapDispatchToProps = {...shipSelectorActions};

export default connect(mapStateToProps, mapDispatchToProps)(ShipSelector);
