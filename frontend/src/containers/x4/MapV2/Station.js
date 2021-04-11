import React from 'react';
import {maps} from '../helpers';

const EquipmentDock = props => (
  <React.Fragment>
    <path d="M 4 9 C 6 7, 8 9, 6 11" stroke={props.color} strokeWidth="1.2px" fill="transparent"/>
    <path d="M 10 3 C 8 5, 10 7, 12 5" stroke={props.color} strokeWidth="1.2px" fill="transparent"/>
    <line x1="6" y1="9" x2="10" y2="5" stroke={props.color} strokeWidth="1.5px"/>
  </React.Fragment>
);

const TradeStation = props => (
  <React.Fragment>
    <text textAnchor="middle" fill={props.color} x="7" y="11.5"
          fontSize="12.2px" fontFamily="Sans-Serif" fontStyle="italic" fontWeight="bold">
      C
    </text>
    <text textAnchor="middle" fontSize="4.5px" fontStyle="italic" fontFamily="Sans-Serif" fontWeight="bold"
          fill={props.color} x="8.5" y="8.5">
      R
    </text>
  </React.Fragment>
);

const Wharf = props => (
  <React.Fragment>
    <polyline fill={props.color} stroke={props.color} points="6,8 8,7.5 10,8 8,5 6,8 8,7.5"/>
  </React.Fragment>
);

const Shipyard = props => (
  <React.Fragment>
    <polyline fill={props.color} stroke={props.color} points="6,7.5 8,6.5 10,7.5 8,3.5 6,7.5 8,6.5"/>
    <rect x="5.5" y="8.5" width="5px" height="1.5px" fill={props.color}/>
    <rect x="5.5" y="10.5" width="5px" height="1.5px" fill={props.color}/>
  </React.Fragment>
);


const Station = props => {
  const scale = `scale(${props.stationScale})`;
  const translateX = parseInt((props.adjusted.x - 8 * props.stationScale) / props.stationScale, 10);
  const translateY = parseInt((-props.adjusted.z - 8 * props.stationScale) / props.stationScale, 10);
  return (
    <g transform={`${scale} translate(${translateX}, ${translateY})`} id={props.id}>
      <polyline stroke={maps.colors[props.owner].border} fill="none" points="5,1 11,1 14.5,7 11,13 5,13 1.5,7 5,1"/>
      {props.tags === 'tradestation' &&
      <TradeStation color={maps.colors[props.owner].border}/>}
      {props.tags === 'equipmentdock' &&
      <EquipmentDock color={maps.colors[props.owner].border}/>}
      {props.tags === 'wharf' &&
      <Wharf color={maps.colors[props.owner].border}/>}
      {props.tags === 'shipyard' &&
      <Shipyard color={maps.colors[props.owner].border}/>}
    </g>
  );
};

export default Station;
