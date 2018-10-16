import React, {Component} from 'react';

import * as cookies from '../helpers/cookies';

function disableCookies() {
  cookies.deleteAllCookies();
  window.location.href = 'https://en.wikipedia.org/wiki/HTTP_cookie';
}

export default class Footer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: true
    };

    this.userAgree = this.userAgree.bind(this);
  }

  componentWillMount() {
    cookies.setCookie('cookiesAgree', 'true', '1000');
  }

  userAgree() {
    this.setState({
      visible: false
    });
  }

  render() {
    return (
      <div className={'cookies ' + (this.state.visible ? 'cookies--visible' : '')}>
        This website uses cookies. Cookies are being used only to run
        anonymous stats of this site usage, save your settings and see if you
        are logged in the website. By continuing to use this site you agree to
        outlined cookie policy.
        <div className="cookies__buttons">
          <button className="btn btn--cancel cookies__disable" onClick={disableCookies}>
            I don't agree
          </button>
          <button className="btn btn--cta cookies__agree" onClick={this.userAgree}>
            OK
          </button>
        </div>
      </div>
    );
  }
}
