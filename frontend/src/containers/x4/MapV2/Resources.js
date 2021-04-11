import React from 'react';
import {maps} from '../helpers';

const Resources = props => {
  if (!props.relativeResources) return null;

  const offsets = {
    ore: {x: props.transformation ? -27 : -60, z: props.transformation ? 40 : 90},
    silicon: {x: props.transformation ? -16 : -49, z: props.transformation ? 40 : 90},
    ice: {x: props.transformation ? -5 : -38, z: props.transformation ? 40 : 90},
    nividium: {x: props.transformation ? 6 : -27, z: props.transformation ? 40 : 90},
    hydrogen: {x: props.transformation ? -27 : -60, z: props.transformation ? 51 : 101},
    helium: {x: props.transformation ? -16 : -49, z: props.transformation ? 51 : 101},
    methane: {x: props.transformation ? -5 : -38, z: props.transformation ? 51 : 101}
  };

  return (
    <React.Fragment>
      {['ore', 'silicon', 'ice', 'hydrogen', 'helium', 'methane', 'nividium'].map(resource =>
        props.relativeResources[resource] && <React.Fragment key={Math.random()}>
          <rect x={props.adjusted.x + offsets[resource].x - 4.5}
                y={-props.adjusted.z + offsets[resource].z - 9}
                width="11" height="10" fill={maps.resourceColors[resource]}
                stroke={maps.resourceColors[resource]} strokeWidth="0" rx="3px"
          />
          <text textAnchor="middle" fontSize="11px" fill="black"
                x={props.adjusted.x + offsets[resource].x + 1}
                y={-props.adjusted.z + offsets[resource].z}>
            {props.relativeResources[resource] > 99 ? 99 : props.relativeResources[resource]}
          </text>
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default Resources;
