import React, {useEffect, useState} from 'react';
import {fetchX4Equipment, fetchX4Ships} from '../../../redux/x4Actions';
import {connect} from 'react-redux';
import {fillOntoShip} from '../x4-fitting-tool';
import {float, getSizeLabel, int, separateWord, translateRace} from '../helpers';
import {sortShips} from '../ship-sorter';
import Description from './Description';
import './ShipEfficiency.scss';

const LARGE_SHIP_EXTRA_TRAVEL = 10;
const ENGINE_RACES = ['arg', 'par', 'spl', 'tel', 'ter'];

const ShipEfficiency = (props) => {
  const [race, setRace] = useState('arg');
  const [distance, setDistance] = useState(1000);
  const [jumpGates, setJumpGates] = useState(4);
  const [percentHighway, setPercentHighway] = useState(80);
  const [highwaySpeed, setHighwaySpeed] = useState(13500);
  const [results, setResults] = useState([]);
  const [sort, setSort] = useState('tradeScore');

  const sortBy = arg => setSort(arg === sort ? `-${arg}` : arg);

  useEffect(() => {
    if (results.length) setResults(sortShips(results, sort));
  }, [sort]);

  useEffect(() => {
    if (!props.x4.ships) props.fetchX4Ships().then(() => props.fetchX4Equipment());

    if (props.x4.ships && props.x4.equipment) {
      let shipCollection = [];
      const extraNormalTravelDistance = jumpGates * LARGE_SHIP_EXTRA_TRAVEL;
      const highwayDistance = distance * percentHighway / 100;

      Object.keys(props.x4.ships.ship_l).forEach(key => {
        let ship = props.x4.ships.ship_l[key];
        if (ship.type === 'freighter') {
          ship = {...fillOntoShip(ship, props.x4.equipment, 'large', [`engine_${race}_l_travel_01_mk1`])};
          ship.accelerationTime = ship.speed.forward / ship.speed.acceleration;
          ship.travelTime = distance * 1000 / ship.speed.travel.speed + extraNormalTravelDistance * 1000 / ship.speed.forward;
          ship.tradeScore = ship.storage.capacity / ship.travelTime;
          shipCollection.push(ship);
        }
      });

      Object.keys(props.x4.ships.ship_m).forEach(key => {
        let ship = props.x4.ships.ship_m[key];
        if (ship.type === 'transporter') {
          ship = {...fillOntoShip(ship, props.x4.equipment, 'medium', [`engine_${race}_m_travel_01_mk3`])};
          ship.accelerationTime = ship.speed.forward / ship.speed.acceleration;
          ship.travelTime = (distance - highwayDistance) * 1000 / ship.speed.travel.speed + highwayDistance * 1000 / highwaySpeed;
          ship.tradeScore = ship.storage.capacity / ship.travelTime;
          shipCollection.push(ship);
        }
      });

      Object.keys(props.x4.ships.ship_s).forEach(key => {
        let ship = props.x4.ships.ship_s[key];
        if (ship.type === 'courier') {
          ship = {...fillOntoShip(ship, props.x4.equipment, 'small', [`engine_${race}_s_travel_01_mk3`])};
          ship.accelerationTime = ship.speed.forward / ship.speed.acceleration;
          ship.travelTime = (distance - highwayDistance) * 1000 / ship.speed.travel.speed + highwayDistance * 1000 / highwaySpeed;
          ship.tradeScore = ship.storage.capacity / ship.travelTime;
          shipCollection.push(ship);
        }
      });
      shipCollection.sort((a, b) => (a.tradeScore < b.tradeScore) ? 1 : ((b.tradeScore < a.tradeScore) ? -1 : 0));
      shipCollection.forEach((ship, index) => ship.tradeIndex = index + 1);

      setResults(sortShips(shipCollection, sort));
    }
  }, [props.x4.equipment, race, distance, jumpGates, percentHighway, highwaySpeed]);

  return (
    <div className='x4-efficiency'>
      <h1>X4 Ship Efficiency</h1>
      <p className='muted'>Explanation of values is under the table. Still not fully adjusted for v4.0. Time to reach full speed is also not yet in calculation.</p>

      <div className='flex'>
        <div>
          <p className='bold'>Variables used for calculations</p>
          <label>
            <input type='number' defaultValue='1000' min='10' max='10000'
                   onChange={e => setDistance(parseInt(e.target.value, 10))}/> km of total whole trip
          </label>
          <label>
            <input type='number' defaultValue='4' min='0' max='15'
                   onChange={e => setJumpGates(parseInt(e.target.value, 10))}/> jump gates
          </label>
          <label>
            <input type='number' defaultValue='80' min='0' max='100'
                   onChange={e => setPercentHighway(parseInt(e.target.value, 10))}/> percent of travel on highway
          </label>
          <label>
            <input type='number' defaultValue='13500' min='10000' max='15000'
                   onChange={e => setHighwaySpeed(parseInt(e.target.value, 10))}/> m/s highway speed
          </label>
        </div>
        <div>
          <p className='bold'>Travel engines you want to use (highest Mk available for class)</p>
          {ENGINE_RACES.map((race, index) => (
            <label className='label--row' key={race}>
              <input type='radio'
                     name='engines'
                     value={race}
                     defaultChecked={index === 0}
                     onChange={e => setRace(race)}/> {translateRace(race)}
            </label>
          ))}
        </div>
      </div>

      <div className='x4-efficiency__table-wrapper'>
        <table>
          <thead>
          <tr>
            <th onClick={() => sortBy('tradeScore')} className='number'>#</th>
            <th onClick={() => sortBy('name')}>Ship</th>
            <th onClick={() => sortBy('class')} className='number'>Size</th>
            <th onClick={() => sortBy('storage')} className='number'>Storage</th>
            <th onClick={() => sortBy('speed')} className='number'>
              Speed<br/>
              <span className='muted'>Time to reach</span>
            </th>
            <th onClick={() => sortBy('travelSpeed')} className='number'>
              Travel<br/>
              <span className='muted'>Time to reach</span>
            </th>
            <th onClick={() => sortBy('travelTime')} className='number'>Time</th>
            <th onClick={() => sortBy('tradeScore')} className='number'>Throughput</th>
          </tr>
          </thead>
          <tbody>
          {results.map(ship => (
            <tr key={Math.random()}>
              {console.log(ship)}
              <td className='number'>{ship.tradeIndex}.</td>
              <td className='capitalize'>
                <span className='bold'>{ship.name}</span><br/>
                {translateRace(ship.race)} {separateWord(ship.type)}
              </td>
              <td className='number capitalize'>
                {getSizeLabel(ship.class)}
              </td>
              <td className='number'>
                {int(ship.storage.capacity)}m³
              </td>
              <td className='number'>
                {int(ship.speed.forward)} m/s<br/>
                {int(ship.accelerationTime)} s
              </td>
              <td className='number'>
                {int(ship.speed.travel.speed)} m/s<br/>
                {int(ship.speed.travel.attack)} s
              </td>
              <td className='number'>
                {int(ship.travelTime)} s
              </td>
              <td className='number'>
                {float(ship.tradeScore)} m³/s
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
      <Description/>
    </div>
  );
};

const mapStateToProps = state => ({x4: state.x4}),
  mapDispatchToProps = {fetchX4Ships, fetchX4Equipment};

export default connect(mapStateToProps, mapDispatchToProps)(ShipEfficiency);
