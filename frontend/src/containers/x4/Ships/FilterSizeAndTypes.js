import React from 'react';
import {maps, separateWord} from '../helpers';

const FilterSizeAndTypes = props => (
  <React.Fragment>
    <div>
      <p className='bold'>Size of ships to display</p>
      {props.sizes.map(size => (
        <label className='label--row label--medium capitalize' key={size}>
          <input type='radio'
                 name='size'
                 value={size}
                 checked={size === props.size}
                 onChange={e => {
                   props.setActiveShields(null);
                   props.setActiveEngines(null);
                   props.setActiveThrusters(null);
                   props.setActiveType('all');
                   props.setSize(e.target.value);
                 }}/>
          {maps.size[size].replace('extralarge', 'XL')}
        </label>
      ))}
    </div>

    <div>
      <p className='bold'>Type of ships to display</p>
      {props.types.map(type => (
        <label className='label--row label--medium capitalize' key={type}>
          <input type='radio'
                 name='type'
                 value={type}
                 onChange={e => props.setActiveType(e.target.value)}
                 checked={props.activeType === type}/>
          {separateWord(type)}
        </label>
      ))}
    </div>
  </React.Fragment>
);

export default FilterSizeAndTypes;
