import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import LoadingScreen from '../../components/LoadingScreen';
import * as efsActions from '../../redux/efsActions';

class SelectionScreen extends Component {
  constructor(props) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
  };

  componentWillMount() {
    this.props.fetchShipGroups()
      .then(shipGroups => {
        if (this.props.efsReducer.currentGroup) {
          // in some other parts of app, we can get group preselected, in that case just refresh the
          // ships from this group
          this.props.fetchShipGroup(this.props.efsReducer.currentGroup.id);
        }
        else {
          // otherwise if there is no group preset, fire up ajax to server to get all groups and
          // then get details for the first group from response array
          this.props.fetchShipGroup(shipGroups.payload[0].id);
        }
      });
  }

  handleInputChange(e) {
    this.props.fetchShipGroup(e.target.value);
  }

  static renderShips(ships) {
    return (
      <div className="selection-screen__ships">
        {ships.map(ship => (
          <Link to={`/eve-fitting-simulator/${ship.id}`} className="selection-screen__ship" key={ship.id}>
            <div className={`selection-screen__ship-image tech-level tech-level--${ship.meta_level}`}>
              <img src={`https://image.eveonline.com/Render/${ship.id}_128.png`} alt="ship" />
            </div>
            <h2 className='selection-screen__name'>{ship.name}</h2>
          </Link>
        ))}
      </div>
    );
  }

  render() {
    const groups       = this.props.efsReducer.shipGroups || [],
          currentGroup = this.props.efsReducer.currentGroup || {};

    return (
      <article className='selection-screen'>
        <h1>EVE Online Fitting Simulator</h1>
        <form onSubmit={this.onSubmit} className="form selection-screen__form">
          <div className="form__control form__control--select">
            <select id="shipGroup"
                    name="shipGroup"
                    value={currentGroup.id || ''}
                    onChange={this.handleInputChange}
                    required>
              {groups.map(group => <option key={group.id} value={group.id}>{group.name}</option>)}
            </select>
            <label className="form__control-label" htmlFor="shipGroup">
              Ship group
            </label>
          </div>
        </form>
        {currentGroup.ships ? SelectionScreen.renderShips(currentGroup.ships) : <LoadingScreen />}
      </article>
    );
  }
}

const mapStateToProps    = state => state,
      mapDispatchToProps = {...efsActions};

export default connect(mapStateToProps, mapDispatchToProps)(SelectionScreen);
