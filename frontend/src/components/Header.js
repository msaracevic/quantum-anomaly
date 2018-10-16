import React, {Component} from 'react';

export default class Header extends Component {
  constructor(props) {
    super(props);
    this.state      = {
      visibleMobile: false
    };
    this.showMobile = this.showMobile.bind(this);
  }

  userLoggedIn() {
    return document.cookie.indexOf('loggedIn=') === -1;
  }

  showMobile() {
    this.setState({
      visibleMobile: !this.state.visibleMobile
    });
  }

  render() {
    return (
      <header className="page-content-header">
        <nav className={'navigation ' + (this.state.visibleMobile ? 'navigation--visible' : '')}>
          <span className="navigation__mobile" onClick={this.showMobile}></span>
          <div className="navigation__title"><a href="/">Quantum Anomaly</a>
          </div>
          <ul className="navigation__content">
            <li className="navigation__link">
              <a href="/eve-fitting-simulator" title="EVE Fitting Simulator">EVE Fitting Simulator</a>
            </li>
            <li className="navigation__link">
              <a href="/incursion-manager" title="EVE Incursions Manager">EVE Incursions</a>
            </li>
            <li className="navigation__link">
              <a href="/epic-arcs" title="EVE Epic Arcs">EVE Epic arcs</a>
            </li>
            <li className="navigation__link">
              <a href="/warframe">WarFrame</a>
            </li>
            {this.userLoggedIn() ? (
              <li className="navigation__link"><a href="/auth/google">Login</a></li>
            ) : (
              <li className="navigation__link"><a href="/logout">Logout</a></li>
            )}
          </ul>
        </nav>
      </header>
    );
  }
};
