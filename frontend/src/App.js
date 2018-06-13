import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Header from './componentsCommon/Header';
import Footer from './componentsCommon/Footer';
import UnderConstruction from './componentsCommon/UnderConstruction';
import NotFound from './componentsCommon/NotFound';

import Home from './components/Home/';
import EfsShips from './components/Efs/Ships/';
import Skills from './components/Efs/Skills/';
import OverviewEpicArcs from './components/EpicArcs/';
import Incursions from './components/Incursions/';
import Warframe from './components/Warframe/';

const App = () => (
  <div>
    <Header />
    <main className="page-content-main">
      <Switch>
        <Route exact path='/' component={Home}/>
        <Route path='/efs-ships' component={EfsShips}/>
        <Route path='/efs-fitting-screen/:shipID' component={UnderConstruction}/>
        <Route path='/skills' component={Skills}/>
        <Route path='/epic-arcs/:faction' component={OverviewEpicArcs}/>
        <Route path='/epic-arcs/' component={OverviewEpicArcs}/>
        <Route path='/incursion-manager' component={Incursions}/>
        <Route path='/warframe' component={Warframe}/>
        <Route path="*" component={NotFound}/>
      </Switch>
    </main>
    <Footer />
  </div>
);

export default App;
