import React, {Component} from 'react';
import {connect} from 'react-redux';

import LoadingScreen from '../../components/LoadingScreen';
import * as efsActions from '../../redux/efsActions';

class Modules extends Component {
  constructor(props) {
    super(props);
    this.state  = {
      active: []
    };
    this.expand = this.expand.bind(this);
  }

  componentWillMount() {
    return this.props.fetchModuleGroups();
  }

  expand(e, id, level) {
    e.stopPropagation();
    let active = [...this.state.active];

    if (level === 0 && active[0] === id) {
      // if clicking on saem top level one, then remove it from expaneded
      active = [];
    } else if (level === 0) {
      // initial state and every other top level click
      active = [];
      active.push(id);
    } else if (active.length === level + 1 && active[level] === id) {
      // same element clicked, toogle
      active = active.slice(0, level);
    } else if (active.length === level) {
      // any click which is natural progression deeper into three
      active.push(id);
    } else if (active.length > level) {
      // in case of selecting something inside current tree, but higher than deepest expanded
      active = active.slice(0, level);
      active.push(id);
    }
    this.setState({active: active});
  }

  renderSubgroups(tree, level = 0) {
    const isVisible = this.state.active.indexOf(tree.id) !== -1;
    return (
      <li className={level === 0 ? 'modules__subgroup' : 'modules__subgroup modules__subgroup--border'} key={tree.id}>
        <button className="btn modules__expand-indicator" onClick={e => this.expand(e, tree.id, level)}>{isVisible ? '-' : '+'}</button>
        <p className="modules__subgroup-title" onClick={e => this.expand(e, tree.id, level)}>
          {tree.name}
        </p>
        {tree.subgroups ?
          <ul className={isVisible ? 'modules__subgroup-section modules__subgroup-section--expanded' : 'modules__subgroup-section'}>
            {tree.subgroups.map(subgroup => this.renderSubgroups(subgroup, level + 1))}
          </ul> :
          <ul className={isVisible ? 'modules__items modules__items--expanded' : 'modules__items'}>
            {tree.items.map(item =>
              <li className="modules__item" key={item.id}>
                <img className='modules__item-image'
                     src={isVisible ? `https://image.eveonline.com/Type/${item.id}_32.png` : '/images/placeholder.png'}
                     alt="ship" />
                <span>{item.name}</span>
              </li>
            )}
          </ul>
        }
      </li>
    );
  }

  renderModules(modules) {
    return (
      <React.Fragment>
        {modules.map(topLevelModule => (
          <ul className="modules__top-level-item" key={topLevelModule.id}>
            {this.renderSubgroups(topLevelModule)}
          </ul>
        ))}
      </React.Fragment>
    );
  }

  render() {
    const moduleGroups = this.props.efsReducer.moduleGroups;

    return (
      <div className="modules">
        <h5>Modules</h5>
        {moduleGroups ? this.renderModules(moduleGroups) : <LoadingScreen />}
      </div>
    );
  }
}

const mapStateToProps    = state => state,
      mapDispatchToProps = {...efsActions};

export default connect(mapStateToProps, mapDispatchToProps)(Modules);
