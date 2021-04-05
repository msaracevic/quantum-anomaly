import React from 'react';
import {float, int, maps, separateWord, translateRace} from '../helpers';

const Armaments = props => {
  const {extralarge, large, medium, small} = props.ship.armaments[props.type];
  if (extralarge === 0 && large === 0 && medium === 0 && small === 0) return '';
  return (
    <span>
      {extralarge !== 0 && <span className='x4__armament-item'>{extralarge} XL</span>}
      {extralarge !== 0 && large !== 0 && <br/>}
      {large !== 0 && <span className='x4__armament-item'>{large} Large</span>}
      {large !== 0 && medium !== 0 && <br/>}
      {medium !== 0 && <span className='x4__armament-item'>{medium} Medium</span>}
      {medium !== 0 && small !== 0 && <br/>}
      {small !== 0 && <span className='x4__armament-item'>{small} Small</span>}
   </span>
  );
};

const ShipRow = ({ship}) => (
  <tr>
    <td>
      <div className='x4-ships__ship-name'>
        <div className='x4-ships__ship-image'>
          <img src={`/images/x4/${ship.id}.jpg`} alt={ship.name}/>
          {ship.description && (
            <div className='x4-ships__ship-description' title={ship.description.replace(/\\n/g, ' ')}>?</div>
          )}
        </div>
        <div className='capitalize'>
          <span className='bold'>{ship.name}</span><br/>
          {translateRace(ship.race)} {separateWord(ship.type)}<br/>
          Manufactured by {maps.factions[ship.manufacturer] || ship.manufacturer}
        </div>
      </div>
    </td>
    <td className='number'>
      {int(ship.hull)} MJ<br/>
      {int(ship.mass)} t
    </td>
    <td className='number'>
      {int(ship.shield.max)} MJ<br/>
      {int(ship.shield.rate)} MJ/s
      {ship.class === 'ship_s' && (<React.Fragment><br/>{int(ship.shield.delay)} s delay</React.Fragment>)}
    </td>
    <td className='number'>
      {int(ship.speed.forward)} m/s<br/>
      <span className='unit-shifted'>{int(ship.speed.acceleration)} m/s²</span>
    </td>
    <td className='number'>
      {int(ship.speed.boost.speed)} m/s<br/>
      {int(ship.speed.boost.attack)} s<br/>
      {int(ship.speed.boost.duration)} s / {int(ship.speed.boost.release)} s
    </td>
    <td className='number'>
      {int(ship.speed.travel.speed)} m/s<br/>
      {int(ship.speed.travel.attack)} s<br/>
      {int(ship.speed.travel.charge)} s / {int(ship.speed.travel.release)} s
    </td>
    <td className='center'>
      {float(ship.speed.pitch)} °/s<br/>{float(ship.speed.roll)} °/s<br/>{float(ship.speed.yaw)} °/s
    </td>
    <td className='center'>
      <Armaments ship={ship} type='weapons'/>
    </td>
    <td className='center'>
      <Armaments ship={ship} type='turrets'/>
    </td>
    <td className='number'>
      {ship.storage.missile} Missiles<br/>
      {ship.storage.countermeasure} Cntermeas
    </td>
    <td className='number'>
      {ship.storage.unit || 0} Drones
    </td>
    <td className='number'>
      {ship.storage.people} Crew<br/>
      {ship.storage.deployable || 0} items
    </td>
    <td className='number'>
      <span className='unit-shifted'>{int(ship.storage.capacity)} m³</span><br/>
      <span className='value capitalize'>
        {ship.storage.capacityType === 'container solid liquid' ? 'any' : ship.storage.capacityType}
      </span>
    </td>
    <td className='number'>
      {ship.shipstorage.dock_m} Medium<br/>
      {ship.shipstorage.dock_s} Small
    </td>
    <td className='number'>
      {ship.manufacturer !== 'khaak' && (
        <React.Fragment>
          {Math.floor(ship.production.time / 60)} min {ship.production.time % 60} s <br/>
          {ship.production.primary.ware.map(item => (
            <div className='x4__materials-list' key={Math.random()}>
              <span className='label capitalize'>{separateWord(item.ware)}</span>
              <span> {int(item.amount)}</span><br/>
            </div>
          ))}
        </React.Fragment>
      )}
    </td>
  </tr>
);

export default ShipRow;
