import React, {useEffect, useState} from 'react';
import classnames from 'classnames';
import './Navigation.scss';

const Navigation = () => {
  const [mobile, setMobile] = useState(false);
  const userLoggedIn = document.cookie.indexOf('loggedIn=') === -1;

  const closeMobileNavigation = event => {
    event.target.className.indexOf('navigation') === -1 && setMobile(false);
  };

  useEffect(() => {
    window.addEventListener('click', closeMobileNavigation);
    return () => window.removeEventListener('click', closeMobileNavigation);
  });

  return (
    <nav className={classnames('navigation', {'navigation--visible': mobile})}>
      <span className='navigation__mobile' onClick={() => setMobile(!mobile)}/>
      <div className='navigation__title'><a href='/'>Quantum Anomaly</a>
      </div>
      <ul className='navigation__content'>
        <li className='navigation__link'><a href='/epic-arcs' title='EVE Epic Arcs'>EVE Epic Arcs</a></li>
        <li className='navigation__link'><a href='/x4/ships' title='X4 Ships'>X4 Ships</a></li>
        <li className='navigation__link'><a href='/x4/efficiency' title='X4 Ships'>X4 Efficiency</a></li>
        {userLoggedIn ? (
          <li className='navigation__link'><a href='/auth/google'>Login</a></li>
        ) : (
          <li className='navigation__link'><a href='/logout'>Logout</a></li>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;
