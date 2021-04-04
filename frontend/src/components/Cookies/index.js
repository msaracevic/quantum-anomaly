import React, {useState} from 'react';
import {deleteAllCookies, getCookie, setCookie} from '../../helpers/cookies';
import './Cookies.scss';

const disableCookies = () => {
  deleteAllCookies();
  window.location.href = 'https://en.wikipedia.org/wiki/HTTP_cookie';
};

const enableCookies = setShow => {
  setCookie('cookiesAgree', 'true', '525600');
  setShow(false);
};

const Cookies = () => {
  const [show, setShow] = useState(!getCookie('cookiesAgree'));

  if (show) {
    window.addEventListener('beforeunload', function (e) {
      if (!getCookie('cookiesAgree')) deleteAllCookies();
      delete e['returnValue'];
    });
  }

  return show ? (
    <div className='cookies'>
      <div className='cookies__inner'>
        This website uses cookies. Cookies that we use are set from Google Tag Manager (GTM) and we
        use them for analytics of this website.<br/><br/>
        Data we collect via GTM:<br/><br/>
        <ul className='ul--links'>
          <li>Visited url on our website, time when it was opened and how long you spent on that url</li>
          <li>Referring url, in other words how did you find our website</li>
          <li>Name and version of your browser and operating system</li>
          <li>Your current IP address at the time of the visit</li>
          <li>Information about your screen resolution, JavaScript support, etc...</li>
        </ul>
        <div className='cookies__buttons'>
          <button className='link link--secondary' onClick={disableCookies}>I don't agree</button>
          <button className='btn btn--cta' onClick={() => enableCookies(setShow)}>OK
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default Cookies;
