import React, {useEffect} from 'react';
import {fetchX4Modifications} from '../../../redux/x4Actions';
import {connect} from 'react-redux';

import './Modifications.scss';
import {float} from '../helpers';

const splitWords = arg => arg.replace('length', ' length')
  .replace('time', ' time')
  .replace('duration', ' duration')
  .replace('capacity', ' capacity')
  .replace('speed', ' speed')
  .replace('hull', '  hull')
  .replace('range', ' range')
  .replace('travel', ' travel ')
  .replace('recharge', ' recharge ')
  .replace('thrust', ' thrust')
  .replace(/  /g, '');

const percent = arg => `${float((parseFloat(arg.min) - 1) * 100)} to ${float((parseFloat(arg.max) - 1) * 100)}%`;
const chance = arg => `${float((parseFloat(arg)) * 100)}%`;

const RenderModifications = props => {
  return (
    <div className='x4-modifications__types'>
      <h4 className='capitalize'>{props.category} {splitWords(props.type)}</h4>
      <div className='x4-modifications__mods'>
        {props.mods.map(mod => (
          <div key={mod.ware} className='x4-modifications__mod'>
            <span className='bold'>{mod.name}</span><span
            className='muted'> - {mod.description.split(' - ')[1]}</span><br/>
            <span className='x4-modifications__label'>
              {props.category} {mod.description.split(' - ')[0].replace(' Mod', '')}
            </span>
            <span className='x4-modifications__values'>{percent({min: mod.min, max: mod.max})}</span><br/>
            {mod.bonus && (
              <div className='x4-modifications__bonus'>
                <span>Up to {mod.bonus.max} extra modifiers</span>
                {Object.keys(mod.bonus).map(key => {
                  if (key === 'chance' || key === 'max') return null;
                  else return (
                    <div key={key}>
                      <span className='x4-modifications__label'>
                        {props.category} {splitWords(key)}
                      </span>
                      <span className='x4-modifications__values'>
                        {percent({min: mod.bonus[key].min, max: mod.bonus[key].max})}
                      </span><br/>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const RenderModificationsGroups = props => {
  const {modifications} = props;

  return (
    <React.Fragment>
      {Object.keys(modifications.weapon).map(key =>
        <RenderModifications key={key} type={key} category='weapon' mods={modifications.weapon[key]}/>)}
      {Object.keys(modifications.engine).map(key =>
        <RenderModifications key={key} type={key} category='engine' mods={modifications.engine[key]}/>)}
      {Object.keys(modifications.ship).map(key =>
        <RenderModifications key={key} type={key} category='ship' mods={modifications.ship[key]}/>)}
      {Object.keys(modifications.shield).map(key =>
        <RenderModifications key={key} type={key} category='shield' mods={modifications.shield[key]}/>)}
    </React.Fragment>
  );
};

const Modifications = props => {
  useEffect(() => {
    if (!props.x4.modifications) {
      props.fetchX4Modifications();
    }
  }, [props.x4.modifications]);

  return (
    <div className='x4-modifications'>
      <h1>X4 Modifications</h1>
      {props.x4.modifications && <RenderModificationsGroups modifications={props.x4.modifications.equipmentmods}/>}
    </div>
  );
};

const mapStateToProps = state => ({x4: state.x4}),
  mapDispatchToProps = {fetchX4Modifications};

export default connect(mapStateToProps, mapDispatchToProps)(Modifications);
