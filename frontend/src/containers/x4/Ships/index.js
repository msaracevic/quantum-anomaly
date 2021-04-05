import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import clsx from 'clsx';

import {fetchX4Equipment, fetchX4Ships} from '../../../redux/x4Actions';
import {seo} from '../../../helpers';
import {fillOntoShip} from '../x4-fitting-tool';
import {maps} from '../helpers';

import FilterSizeAndTypes from './FilterSizeAndTypes';
import FilterRacesAndShipVariation from './FilterRacesAndShipVariation';
import ShipRow from './ShipRow';

import './Ships.scss';
import {sortShips} from '../ship-sorter';

const RadioGroups = props => {
  if (props.items.length === 0) return null;

  const mkGroups = {};
  props.items.forEach(item => {
    let base = item.name.replace(/ Mk\d/, '');
    let race = 'GEN';
    if (item.name.indexOf('Thrusters') === -1) {
      base = item.name.replace(/ Mk\d/, '').replace(/\w\w\w /, '');
      race = item.name.substring(0, 3);
    }
    if (!mkGroups[base]) mkGroups[base] = {};
    if (!mkGroups[base][race]) mkGroups[base][race] = [];
    let mk = item.name.replace(base, '').trim().replace('  ', ' ');
    if (mk.length < 4) mk = `GEN ${mk}`;
    mkGroups[base][race].push({...item, mk});
  });
  const groupRandomName = Math.random();

  return (
    <React.Fragment>
      {Object.keys(mkGroups).map(baseKey => (
        <div className='x4-ships__radio-group' key={baseKey}>
          <p className='bold'>{baseKey}</p>
          {Object.keys(mkGroups[baseKey]).map(raceKey => (
            <div key={raceKey}>
              {mkGroups[baseKey][raceKey].map(item => (
                <label className='monospace' key={item.id}>
                  <input type='radio'
                         name={groupRandomName}
                         value={item.id}
                         onChange={e => props.onChange(e.target.value)}/>
                  {item.mk}
                </label>
              ))}
            </div>
          ))}
        </div>
      ))}
    </React.Fragment>
  );
};

const Ships = (props) => {
  const [size, setSize] = useState('ship_xl');
  const [race, setRace] = useState({
    atf: true,
    arg: true,
    par: true,
    spl: true,
    tel: true,
    ter: true,
    yak: true,
    xen: true,
    kha: true
  });
  const [shipVariation, setShipVariation] = useState({BV: true, VA: true, ST: true, RD: true});
  const [types, setTypes] = useState([]);
  const [ships, setShips] = useState([]);
  const [sort, setSort] = useState('name');

  const [shields, setShields] = useState([]);
  const [activeShield, setActiveShield] = useState(null);
  const [engines, setEngines] = useState([]);
  const [activeEngine, setActiveEngine] = useState(null);
  const [thrusters, setThrusters] = useState([]);
  const [activeThruster, setActiveThruster] = useState(null);
  const [activeType, setActiveType] = useState('all');

  const sortBy = arg => setSort(arg === sort ? `-${arg}` : arg);

  useEffect(() => {
    if (!props.x4.ships) props.fetchX4Ships().then(() => props.fetchX4Equipment());

    if (props.x4.ships) {
      const ships = props.x4.ships[size];
      const availableTypes = ['all'];
      Object.keys(ships).forEach(key => (availableTypes.indexOf(ships[key].type) === -1 && availableTypes.push(ships[key].type)));
      setTypes(availableTypes);

      const allShips = Object.keys(props.x4.ships).map(size => Object.keys(props.x4.ships[size]).map(ship => props.x4.ships[size][ship].name));
      seo({
        title: 'X4 Ship Previewer',
        metaDescription: 'X4 Foundations, Split Vendetta and Cradle of Humanity ships previewer.',
        keywords: `${allShips}`
      });
    }

    if (props.x4.equipment) {
      const equipment = props.x4.equipment[maps.size[size]];
      const eligibleShields = [];
      const eligibleEngines = [];
      const eligibleThrusters = [];

      Object.keys(equipment).forEach(key => {
        equipment[key].class === 'shield' && eligibleShields.push({name: equipment[key].name, id: key});
        equipment[key].class === 'engine' && eligibleEngines.push({name: equipment[key].name, id: key});
        equipment[key].class === 'thruster' && eligibleThrusters.push({name: equipment[key].name, id: key});
      });

      setShields(() => eligibleShields);
      setEngines(() => eligibleEngines);
      setThrusters(() => eligibleThrusters);
    }
  }, [props.x4, size]);

  useEffect(() => {
    if (props.x4.ships && props.x4.equipment) {
      const shipCollection = [];
      Object.keys(props.x4.ships[size]).map(id => {
        let ship = {...props.x4.ships[size][id]};
        if (!race[ship.race]) return null;
        if (!shipVariation[ship.shortvariation]) return null;
        if (activeType && activeType !== 'all' && ship.type !== activeType) return null;
        if (activeShield) ship = fillOntoShip(ship, props.x4.equipment, maps.size[size], [activeShield]);
        if (activeEngine) ship = fillOntoShip(ship, props.x4.equipment, maps.size[size], [activeEngine]);
        if (activeThruster) ship = fillOntoShip(ship, props.x4.equipment, maps.size[size], [activeThruster]);
        shipCollection.push(ship);
      });

      setShips(sortShips(shipCollection, sort));
    }
  }, [props.x4, size, activeEngine, activeShield, activeThruster, activeType, shipVariation, race]);

  useEffect(() => {
    if (ships.length) setShips(sortShips(ships, sort));
  }, [sort]);

  return (
    <div className={clsx('x4-ships')}>
      <h1>X4 Ship Previewer</h1>
      <FilterSizeAndTypes sizes={['ship_xl', 'ship_l', 'ship_m', 'ship_s']}
                          setSize={setSize}
                          setActiveShields={setActiveShield}
                          setActiveEngines={setActiveEngine}
                          setActiveThrusters={setActiveThruster}
                          setActiveType={setActiveType}
                          activeType={activeType}
                          size={size}
                          types={types}
      />

      <FilterRacesAndShipVariation setRace={setRace} setShipVariation={setShipVariation}/>

      <p className='divider divider--tm'/>
      <div className='x4-ships__equipment'>
        <RadioGroups items={[...engines]} onChange={setActiveEngine}/>
      </div>
      <div className='x4-ships__equipment'>
        <RadioGroups items={[...shields]} onChange={setActiveShield}/>
        <RadioGroups items={[...thrusters]} onChange={setActiveThruster}/>
      </div>
      <p className='divider'/>

      <div className='x4-ships__table-wrapper'>
        <table>
          <thead>
          <tr>
            <th onClick={() => sortBy('name')}>
              Name
            </th>
            <th className='number' onClick={() => sortBy('hull')}>
              Hull<br/><span className='muted'>Mass</span>
            </th>
            <th className='number' onClick={() => sortBy('shield')}>
              Shields<br/><span className='muted'>Recharge</span>
            </th>
            <th className='number' onClick={() => sortBy('speed')}>
              Speed<br/><span className='muted'>Acceleration</span>
            </th>
            <th className='number' onClick={() => sortBy('boostSpeed')}>
              Boost<br/>
              <span className='muted' title='Time needed to reach full boost speed'>Attack</span><br/>
              <span className='muted'
                    title='Time needed to drain shields/return to normal speed'>Duration/Release</span>
            </th>
            <th className='number' onClick={() => sortBy('travelSpeed')}>
              Travel<br/>
              <span className='muted' title='Time needed to reach full travel speed'>Attack</span><br/>
              <span className='muted'
                    title='Time needed to activate travel drive/return to normal speed'>Charge/Release</span>
            </th>
            <th className='center' onClick={() => sortBy('pitch')}>
              Manuverability<br/><span className='muted'>Pitch/Roll/Yaw</span>
            </th>
            <th className='center' onClick={() => sortBy('weapons')}>
              Weapons
            </th>
            <th className='center' onClick={() => sortBy('turrets')}>
              Turrets
            </th>
            <th className='number' onClick={() => sortBy('missiles')}>
              Missiles<br/><span className='muted'>Cntermeas.</span>
            </th>
            <th className='number' onClick={() => sortBy('drones')}>
              Drones
            </th>
            <th className='number' onClick={() => sortBy('crew')}>
              Crew<br/><span className='muted'>Deployables</span>
            </th>
            <th className='number' onClick={() => sortBy('storage')}>
              Cargo<br/><span className='muted'>Type</span>
            </th>
            <th className='number'onClick={() => sortBy('dock')}>
              Dock<br/><span className='muted'>Medium/Small</span>
            </th>
            <th className='number'>Building<br/><span className='muted'>Time/Mats</span></th>
          </tr>
          </thead>
          <tbody>
          {ships.map(ship => <ShipRow key={ship.id} ship={ship}/>)}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const mapStateToProps = state => ({x4: state.x4}),
  mapDispatchToProps = {fetchX4Ships, fetchX4Equipment};

export default connect(mapStateToProps, mapDispatchToProps)(Ships);
