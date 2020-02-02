import React, {Component} from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames';
import ReactTooltip from 'react-tooltip';

import LoadingScreen from '../../components/LoadingScreen';
import * as efsActions from '../../redux/efsActions';

const CPU_ID = 48,
  PG_ID = 11,
  CPU_USAGE_ID = 50,
  PG_USAGE_ID = 30;

class Modules extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: [],
      showT1: true,
      showT2: true,
      showFaction: false,
      showOfficer: false
    };

    this.expand = this.expand.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentDidMount() {
    this.props.fetchModuleGroups();
  }

  handleInputChange(e) {
    this.setState({[e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value});
  }

  expand(e, id, level, hasOnlyItems) {
    e.stopPropagation();
    let active = [...this.state.active],
      currentLength = active.length;

    if (level === 0 && active[0] === id) active = []; // if clicking on same top level one, then remove it from expanded
    else if (level === 0) { // initial state and every other top level click
      active = [];
      active.push(id);
    }
    else if (currentLength === level + 1 && active[level] === id) active = active.slice(0, level); // same element, toggle
    else if (currentLength === level) active.push(id); // any click which is natural progression deeper into tree
    else if (currentLength > level) { // in case of selecting something inside current tree, but higher than deepest expanded
      active = active.slice(0, level);
      active.push(id);
    }

    this.setState({active: active});
    if (hasOnlyItems) this.props.fetchModuleGroup(id);
  }

  isVisible(module) {
    let show = true,
      meta = module.meta_level;

    if (!this.state.showT1 && meta < 5) show = false;
    if (!this.state.showT2 && meta === 5) show = false;
    if (!this.state.showFaction && (meta > 5 && meta <= 9)) show = false;
    if (!this.state.showOfficer && (meta > 9)) show = false;

    return show;
  }

  renderCpuPG(module) {
    const cpu = module.data.dogma_attributes[CPU_USAGE_ID] || 0,
      pg = module.data.dogma_attributes[PG_USAGE_ID] || 0,
      {dogma_attributes: shipAttributes} = this.props.ship;

    return (
      <React.Fragment>
        <div className={classNames('modules__dogma', {'modules__dogma--overfit': shipAttributes[CPU_ID] < cpu})}>
          CPU: {cpu.toLocaleString('de-DE')}
        </div>
        <div className={classNames('modules__dogma', {'modules__dogma--overfit': shipAttributes[PG_ID] < pg})}>
          Powergrid: {pg.toLocaleString('de-DE')}
        </div>
      </React.Fragment>
    );
  }

  renderModules(modules) {
    return Object.keys(modules).map(key => (
      <React.Fragment key={key}>
        <h5>{key}</h5>
        <ul>
          {modules[key].map(module =>
            <li className={this.isVisible(module) ? 'modules__item' : 'modules__item modules__item--hidden'}
                data-tip={`${module.name}`}
                key={module.id}>
              <img className="modules__item-image"
                   src={`https://image.eveonline.com/Type/${module.id}_32.png`}
                   alt="module.name"/>
              <span className="modules__item-label">
                {module.name}<br/>
                {this.renderCpuPG(module)}
              </span>
            </li>
          )}
        </ul>
        <ReactTooltip place="left" type="dark" effect="solid" multiline={true} className='modules__tooltip'/>
      </React.Fragment>
    ));
  }

  renderFilters() {
    return (
      <section className="modules__filters">
        <label className={classNames('modules__checkbox', {'modules__checkbox--active': this.state.showT1})}>
          <input type="checkbox" name="showT1" onChange={this.handleInputChange} defaultChecked={this.state.showT1}/>
          T1
        </label>
        <label className={classNames('modules__checkbox', {'modules__checkbox--active': this.state.showT2})}>
          <input type="checkbox" name="showT2" onChange={this.handleInputChange} defaultChecked={this.state.showT2}/>
          T2
        </label>
        <label className={classNames('modules__checkbox', {'modules__checkbox--active': this.state.showFaction})}>
          <input type="checkbox" name="showFaction" onChange={this.handleInputChange}
                 defaultChecked={this.state.showFaction}/>
          Faction
        </label>
        <label className={classNames('modules__checkbox', {'modules__checkbox--active': this.state.showOfficer})}>
          <input type="checkbox" name="showOfficer" onChange={this.handleInputChange}
                 defaultChecked={this.state.showOfficer}/>
          Officer
        </label>
      </section>
    );
  }

  renderSubgroups(tree, level = 0) {
    const isVisible = this.state.active.indexOf(tree.id) !== -1,
      hasOnlyItems = !tree.subgroups;

    return (
      <li key={tree.id}>
        <p className={'modules__group-title'} onClick={e => this.expand(e, tree.id, level, hasOnlyItems)}>
          {tree.name}
        </p>
        {tree.subgroups &&
        <ul className={classNames('modules__group', {'modules__group--expanded': isVisible})}>
          {tree.subgroups.map(subgroup => this.renderSubgroups(subgroup, level + 1))}
        </ul>
        }
      </li>
    );
  }

  renderModuleGroups(modules) {
    return (
      <React.Fragment>
        {modules.map(topLevelModule => <ul key={topLevelModule.id}>{this.renderSubgroups(topLevelModule)}</ul>)}
      </React.Fragment>
    );
  }

  render() {
    const {moduleGroups, modules} = this.props;

    return (
      <section className="modules">
        <div className="modules__groups">
          <h5>Module groups</h5>
          {this.renderFilters()}
          {moduleGroups ? this.renderModuleGroups(moduleGroups) : <LoadingScreen/>}
        </div>
        <div className="modules__items">
          {modules && this.renderModules(modules)}
        </div>
      </section>
    );
  }
}

const mapStateToProps = state => state.efs,
  mapDispatchToProps = {...efsActions};

export default connect(mapStateToProps, mapDispatchToProps)(Modules);
