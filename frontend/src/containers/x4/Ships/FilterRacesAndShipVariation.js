import React from 'react';
import {maps} from '../helpers';

const FilterRacesAndShipVariation = props => (
  <React.Fragment>
    <div>
      <p className='bold'>Race of ships to display</p>
      {maps.race.map(mapRace => (
        <label className='label--row label--small' key={mapRace.value}>
          <input type='checkbox'
                 onChange={e => props.setRace(race => ({...race, ...{[mapRace.value]: e.target.checked}}))}
                 defaultChecked
          />
          {mapRace.label}
        </label>
      ))}
    </div>

    <div>
      <p className='bold'>Variation of ships to display</p>
      {maps.variations.map(variation => (
        <label className='label--row label--medium' key={variation.value}>
          <input type='checkbox'
                 onChange={e => props.setShipVariation(subtype => ({...subtype, ...{[variation.value]: e.target.checked}}))}
                 defaultChecked
          />
          {variation.label}
        </label>
      ))}
    </div>
  </React.Fragment>
);

export default FilterRacesAndShipVariation;
