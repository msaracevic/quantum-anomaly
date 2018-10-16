import React, {Component} from 'react';
import LoadingScreen from '../../../components/LoadingScreen';
import EpicArc from './EpicArc';

const renderArcOverview = (arc) => (
  <section key={arc.iconID} className="arcs__item arcs__overview-item">
    <a className="a arcs__header-link" href={`/epic-arcs/${arc.race}`}>
      <div className="arcs__faction-logo">
        <img src={`https://image.eveonline.com/Alliance/${arc.iconID}_128.png`} alt="faction logo"/>
      </div>
      <h2 className="arcs__title">{arc.name}</h2>
    </a>
    <ul className="arcs__rewards">
      <li>Starting agent - {arc.starter}</li>
      {arc.rewards.map((reward, index) => (
        <li key={index}>{reward}</li>
      ))}
    </ul>
    <p className="arcs__description">{arc.description}</p>
    <p><a className="a" href={`/epic-arcs/${arc.race}`}>Link to guide</a></p>
  </section>
);

export default class EpicArcs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      epicArcs: {}
    };
  };

  componentWillMount() {
    fetch('/api/get-epic-arcs')
      .then(response => response.json())
      .then(response => {
        this.setState({
          epicArcs: response
        });
      });
  }

  renderArc() {
    let faction = this.props.match.params.faction || false;
    if (!faction)
      return Object.keys(this.state.epicArcs).map(arc =>
        renderArcOverview(this.state.epicArcs[arc])
      );
    else return <EpicArc arc={this.state.epicArcs[faction]}/>;
  }

  render() {
    if (Object.keys(this.state.epicArcs).length === 0) {
      return <LoadingScreen/>;
    } else {
      return (
        <article className="arcs">
          {this.renderArc()}
        </article>
      );
    }
  }
}
