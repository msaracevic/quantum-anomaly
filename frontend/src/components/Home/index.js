import React from 'react';
import './Home.scss';

const menuItems = [{
  url: '/epic-arcs',
  cover: '/images/eve-logo.png',
  label: 'EVE Online: Epic arcs guide',
  content: 'In depth guide for EVE Online level 4 epic arc missions. Find all about the related missions, enemies, rewards, what to bring and how to start them...'
},{
  url: '/x4/map',
  cover: '/images/x4/logo.png',
  label: 'X4 Foundations: Map',
  content: 'Complete X4 map, together with X4 Split Vendetta and Cradle of Humanity systems (v4.0).'
},{
  url: '/x4/resources',
  cover: '/images/x4/logo.png',
  label: 'X4 Foundations: Resources',
  content: 'Supplement table to X4 map, gives table overview of resources available in the game.'
},{
  url: '/x4/ships',
  cover: '/images/x4/logo.png',
  label: 'X4 Foundations: Ships',
  content: 'List of ships with their stats. Still work in progress with aim at offering same equiping options as in game so that you can use this application to validate your fits beforehand.'
},{
  url: '/x4/efficiency',
  cover: '/images/x4/logo.png',
  label: 'X4 Foundations: Efficiency',
  content: 'Analysis of trading ships currently in X4 Foundations version 3.3.'
}];

const Home = () => (
  <article className='home'>
    <h1>Quantum Anomaly Gaming Community</h1>
    <p>Quantum Anomaly is gaming community originating from playing EVE Online together. In time we started also
      playing other games and we use this website as source of information. We have decided to share some of that
      information publicly with other gamers.</p>
    {menuItems.map(({url, cover, label, content}) => (
      <a href={url} className='home__link' key={url}>
        <div className='home__header'>
          <img src={cover} alt={url}/>
        </div>
        <div className='home__content'>
          <h4 className='home__title'>{label}</h4>
          <p>{content}</p>
        </div>
      </a>
    ))}
  </article>
);

export default Home;
