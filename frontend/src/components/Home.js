import React, {Component} from 'react';

// WARNING: Has to be mapped according to the application router
const initialState = {
  'Eve Online': [{
    url:     '/eve-fitting-simulator',
    cover:   '/images/eve-logo.png',
    label:   'Eve fitting simulator',
    content: 'Still work in progress, idea being to offer same features as in-game fitting tool, just better...'
  },{
    url:     '/epic-arcs',
    cover:   '/images/eve-logo.png',
    label:   'Epic arcs guide',
    content: 'In depth guide for EVE Online level 4 epic arc missions. Find all about the related missions, enemies, rewards, what to bring and how to start them...'
  }, {
    url:     '/incursion-manager',
    cover:   '/images/eve-logo.png',
    label:   'Incursion manager',
    content: 'Current active incursion constellations with filled system data like dockable stations, incursion type per system, etc...'
  }],
  'Warframe':   [{
    url:     '/warframe',
    cover:   '/images/warframe-logo.png',
    label:   'Warframe',
    content: 'Current things happening in Warframe, like alerts, fissures, invasions, etc...'
  }]
};

export default class Index extends Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  render() {
    return (
      <article className="home">
        {Object.keys(this.state).map(key => (
          <React.Fragment key={key}>
            <h2>{key}</h2>
            <div className="home__links">
              {this.state[key].map(item => (
                <a href={item.url} className="home__link" key={item.url}>
                  <img src={item.cover} alt={item.url} />
                  <h4 className="home__link-label">{item.label}</h4>
                  <p>{item.content}</p>
                </a>
              ))}
            </div>
          </React.Fragment>
        ))}
      </article>
    );
  }
}
