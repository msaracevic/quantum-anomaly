import React, {Component} from 'react';
import {connect} from 'react-redux';

import * as shipSelectorActions from '../../redux/shipSelectorActions';

class ShipSelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeGroup: null
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
        return this.setState({activeGroup: this.props.shipSelectorReducer.shipGroups[0].id});
      })
      .then(() => {
        this.props.fetchShipGroup(this.state.activeGroup);
      });
  }

  static renderShips(groupInfo) {
    return (
      <React.Fragment>
        <h2>Ships in this group</h2>
        <div className="ship-selector__ships">
          {groupInfo.map(ship => (
            <div className="ship-selector__ship" key={ship.type_id}>
              <img src={`https://image.eveonline.com/Render/${ship.type_id}_128.png`} className="ship-selector__ship-image" alt="ship" />
              <h5>{ship.name}</h5>
            </div>
          ))}
        </div>
      </React.Fragment>
    );
  }


  render() {
    const shipGroups = this.props.shipSelectorReducer.shipGroups,
          groupInfo  = this.props.shipSelectorReducer.activeGroupInfo;
    return (
      <article className='ship-selector'>
        <h1>EVE Online Fitting Simulator</h1>
        <form onSubmit={this.onSubmit} className="form ship-selector__form">
          <div className="form__control">
            <select id="shipGroup" name="shipGroup" onChange={this.handleInputChange} required>
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
