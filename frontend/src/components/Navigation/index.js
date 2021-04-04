import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import {NavLink} from 'react-router-dom';
import {deleteCookie, getCookie, setCookie} from '../../helpers/cookies';

import './Navigation.scss';

const setDarkMode = arg => arg ? setCookie('dark-mode') : deleteCookie('dark-mode')

const Navigation = () => {
  const [mobile, setMobile] = useState(false);
  const [darkMode] = useState(getCookie('dark-mode'));

  const closeMobileNavigation = event => {
    if (event.target.classname) event.target.className.indexOf('navigation') === -1 && setMobile(false);
  };

  useEffect(() => {
    window.addEventListener('click', closeMobileNavigation);
    return () => window.removeEventListener('click', closeMobileNavigation);
  });

  return (
    <nav className={clsx('navigation', {'navigation--visible': mobile})}>
      <span className='navigation__mobile' onClick={() => setMobile(!mobile)}/>
      <div className='navigation__title'><a href='/'>Quantum Anomaly</a>
      </div>
      <ul className='navigation__content'>
        <li className='navigation__link'>
          <NavLink to='/epic-arcs' title='EVE Epic Arcs'>
            EVE Epic Arcs
          </NavLink>
        </li>
        <li className='navigation__link'>
          <NavLink to='/x4/ships' title='X4 Ships' onClick={() => setMobile(!mobile)}>X4 Ships</NavLink>
        </li>
        <li className='navigation__link'>
          <NavLink to='/x4/map' title='X4 Map' onClick={() => setMobile(!mobile)}>X4 Map</NavLink>
        </li>
        <li className='navigation__link'>
          <NavLink to='/x4/resources' title='X4 Resources' onClick={() => setMobile(!mobile)}>X4 Resources</NavLink>
        </li>
        <li className='navigation__link'>
          <NavLink to='/x4/modifications' title='X4 Modifications' onClick={() => setMobile(!mobile)}>
            X4 Modifications
          </NavLink>
        </li>
        <li className='navigation__link'>
          <NavLink to='/x4/efficiency' title='X4 Efficiency' onClick={() => setMobile(!mobile)}>X4 Efficiency</NavLink>
        </li>
        {darkMode ? (
          <li className='navigation__link'>
            <a href={window.location.pathname} onClick={() => setDarkMode(false)}>Light mode</a>
          </li>
        ) : (
          <li className='navigation__link'>
            <a href={window.location.pathname} onClick={() => setDarkMode(true)}>Dark mode</a>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navigation;
