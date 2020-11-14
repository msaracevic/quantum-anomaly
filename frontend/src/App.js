import React, {Component} from 'react';
import {Redirect, Route, Switch, withRouter} from 'react-router-dom';

import {connect} from 'react-redux';
import * as authActions from './redux/authActions';
import * as auth from './auth';

import {updateCanonical} from './helpers';

import Navigation from './components/Navigation';
import Footer from './components/Footer';
import NotFound from './components/NotFound';
import Home from './components/Home';
import Cookies from './components/Cookies';

import EpicArcsOverview from './containers/epic-arcs/Overview';
import EpicArc from './containers/epic-arcs/Arc';
import X4ShipEfficiency from './containers/x4/ShipEfficiency';
import X4Map from './containers/x4/Map';
import X4OldShipEfficiency from './containers/x4/OldShipEfficiency';
import X4 from './containers/x4';

class App extends Component {
  componentDidMount() {
    if (auth.isLoggedIn()) this.props.getUserInfo();
    updateCanonical();
    this.props.history.listen(updateCanonical);
  }

  render() {
    return (
      <React.Fragment>
        <header className='page-content-header'>
          <Navigation/>
        </header>
        <main className='page-content-main'>
          <Cookies/>
          <Switch>
            <Route exact path='/' component={Home}/>
            <Route exact path='/epic-arcs/:faction(amarr|caldari|gallente|minmatar)/:mission' component={EpicArc}/>
            <Route exact path='/epic-arcs/:faction(amarr|caldari|gallente|minmatar)' component={EpicArc}/>
            <Route exact path='/epic-arcs' render={props => <EpicArcsOverview {...props}/>}/>
            <Route exact path='/x4/efficiency/old' render={props => <X4OldShipEfficiency {...props}/>}/>
            <Route exact path='/x4/efficiency/' render={props => <X4ShipEfficiency {...props}/>}/>
            <Route exact path='/x4/ships' render={props => <X4 {...props}/>}/>
            <Route exact path='/x4/map' render={props => <X4Map {...props}/>}/>
            <Route exact path='/x4-ships'><Redirect to='/x4/ships'/></Route>
            <Route path='*' component={NotFound}/>
          </Switch>
        </main>
        <footer className='page-content-footer'>
          <Footer/>
        </footer>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => state.auth,
  mapDispatchToProps = {...authActions};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
