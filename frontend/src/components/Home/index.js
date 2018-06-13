import React, {Component} from 'react';

const homePageLinks = [{
  url:         '/epic-arcs',
  cover:       '/images/eve-logo.png',
  cbackground: 'black',
  label:       'Epic arcs guide',
  content:     'In depth guide for EVE Online epic arcs. Find info about all the related missions, enemies and rewards...'
}, {
  url:         '/incursion-manager',
  cover:       '/images/eve-logo.png',
  cbackground: 'black',
  label:       'Incursion manager',
  content:     'EVE Online current active incursions with system data...'
}, {
  url:         '/warframe',
  cover:       '/images/warframe-logo.png',
  cbackground: 'white',
  label:       'WarFrame',  
  content:     'Current status of ingame happening in Warframe...'
}];

const renderHomeLinks = (link) => (
  <li className="home__link-wrapper" key={link.url}>
    <a href={link.url} className="home__link">
      <p className={`home__img home__img--${link.cbackground}`}>
        <img src={link.cover} alt={link.url}/>
      </p>
      <p className="home__link-label">{link.label}</p>
      <p className="home__link-content">{link.content}</p>
    </a>
  </li>
);

export default class Index extends Component {
  render() {
    return (
      <article className="home">
        <ul className="home__links">
          {homePageLinks.map(link => renderHomeLinks(link))}
        </ul>
      </article>
    );
  }
}
