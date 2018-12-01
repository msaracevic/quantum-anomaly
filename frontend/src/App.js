import React from 'react';
import {Switch, Route} from 'react-router-dom';

import Navigation from './components/Navigation';
import Footer from './components/Footer';
// import UnderConstruction from './components/UnderConstruction';
import NotFound from './components/NotFound';

import Home from './components/Home';
import ShipSelector from './containers/eve-fitting-tool/Selection-Screen';
import ShipView from './containers/eve-fitting-tool/ShipView';

import Skills from './containers/legacy/Efs/Skills/';
import OverviewEpicArcs from './containers/legacy/EpicArcs/';
import Incursions from './containers/legacy/Incursions/';
import Warframe from './containers/legacy/Warframe/';

const App = () => (
  <React.Fragment>
    <header className="page-content-header">
      <Navigation />
    </header>
    <main className="page-content-main">
      <Switch>
        <Route exact path='/' component={Home} />
        <Route exact path='/eve-fitting-simulator' component={ShipSelector} />
        <Route exact path='/eve-fitting-simulator/:shipId' component={ShipView} />
        <Route path='/skills' component={Skills} />
        <Route path='/epic-arcs/:faction' component={OverviewEpicArcs} />
        <Route path='/epic-arcs/' component={OverviewEpicArcs} />
        <Route path='/incursion-manager' component={Incursions} />
        <Route path='/warframe' component={Warframe} />
        <Route path="*" component={NotFound} />
      </Switch>
    </main>
    <footer className="page-content-footer">
      <Footer />
    </footer>
  </React.Fragment>
);

export default App;
