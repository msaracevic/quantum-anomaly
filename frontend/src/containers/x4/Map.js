import React, {useEffect, useState} from 'react';
import {fetchX4Map} from '../../redux/x4Actions';
import {connect} from 'react-redux';
import './Map.scss';
import {maps} from './helpers';

const HEXSIZE = {x: 25, y: 43};
const HEXSIZE_SMALL = {x: 12.5, y: 21.5};
const HEX_OFFSET = {x: 12.5, y: 21.5};

const getHexagonPoints = (prop, type) => {
  const {x, y} = prop;
  const {x: hx, y: hy} = type === 'small' ? HEXSIZE_SMALL : HEXSIZE;
  return `${x - hx},${y - hy} ${x + hx},${y - hy} ${x + hx * 2},${y} ${x + hx},${y + hy} ${x - hx},${y + hy} ${x - hx * 2},${y} ${x - hx},${y - hy}`;
};

const resolveHexagonCenterByProps = (sectorPosition, sectorIndex, cluster) => {
  switch (sectorPosition) {
    case 'top-right':
      if (sectorIndex === 0) return {x: cluster.x + HEX_OFFSET.x, y: cluster.y - HEX_OFFSET.y};
      else return {x: cluster.x - HEX_OFFSET.x, y: cluster.y + HEX_OFFSET.y};
    case 'top-left':
      if (sectorIndex === 0) return {x: cluster.x - HEX_OFFSET.x, y: cluster.y - HEX_OFFSET.y};
      else return {x: cluster.x + HEX_OFFSET.x, y: cluster.y + HEX_OFFSET.y};
    case 'singular':
      return {x: cluster.x, y: cluster.y};
  }
};

const Sectors = props => (
  props.sectors.map((sector, index) => (
    <React.Fragment key={Math.random()}>
      {props.sectorsPosition !== 'singular' && !props.text && (
        <polyline className='map__hexagon'
                  fill={sector.name === 'Hatikvah\'s Choice I' ? maps.colors['hatikvah'].color : maps.colors[props.owner].color}
                  stroke={sector.name === 'Hatikvah\'s Choice I' ? maps.colors['hatikvah'].color : maps.colors[props.owner].color}
                  points={getHexagonPoints(resolveHexagonCenterByProps(props.sectorsPosition, index, props.position), 'small')}/>
      )}

      {props.sectorsPosition !== 'singular' && props.text && (
        <text textAnchor='middle'
              x={resolveHexagonCenterByProps(props.sectorsPosition, index, props.position).x}
              y={resolveHexagonCenterByProps(props.sectorsPosition, index, props.position).y - 8}
              className='map__sector-name'>
          {sector.name}
        </text>
      )}

      {props.sectorsPosition === 'singular' && !props.text && (
        <polyline className='map__hexagon'
                  fill={maps.colors[props.owner].color}
                  stroke={maps.colors[props.owner].border}
                  points={getHexagonPoints({x: props.position.x, y: props.position.y})}/>
      )}

      {props.sectorsPosition === 'singular' && props.text && (
        <text textAnchor='middle' x={props.position.x} y={props.position.y - 30} className='map__sector-name'>
          {sector.name}
        </text>
      )}
    </React.Fragment>
  ))
);

const Clusters = props => (
  Object.keys(props.x4.map.systems).map(key => (
    <React.Fragment key={Math.random()}>
      <polyline className='map__hexagon'
                fill='none'
                stroke={maps.colors[props.x4.map.systems[key].owner].border}
                points={getHexagonPoints(props.x4.map.systems[key].position)}/>
      {props.x4.map.systems[key].position.x !== -1000 && <Sectors {...props.x4.map.systems[key]} />}
    </React.Fragment>
  )));

const ClusterTexts = props => (
  Object.keys(props.x4.map.systems).map(key => (
    <React.Fragment key={Math.random()}>
      {props.x4.map.systems[key].position.x !== -1000 && <Sectors {...props.x4.map.systems[key]} text/>}
    </React.Fragment>
  )));

const Gates = props => (
  props.x4.map.gates.map(gate => (
    <React.Fragment key={Math.random()}>
      <circle cx={gate.origin.x} cy={gate.origin.y} fill='gray' stroke='white' strokeWidth='1' r='2'/>
      <circle cx={gate.destination.x} cy={gate.destination.y} fill='gray' stroke='white' strokeWidth='1' r='2'/>
      <line x1={gate.origin.x} y1={gate.origin.y}
            x2={gate.destination.x} y2={gate.destination.y} stroke='black'
            strokeWidth='2'/>
      <line x1={gate.origin.x} y1={gate.origin.y}
            x2={gate.destination.x} y2={gate.destination.y} stroke='white'
            strokeDasharray='1px'/>
    </React.Fragment>
  ))
);

const SuperHighways = props => (
  props.x4.map.superHighways.map(highway => (
    <React.Fragment key={Math.random()}>
      <circle cx={highway.origin.x} cy={highway.origin.y} fill='blue' stroke='white' strokeWidth='1' r='1'/>
      <circle cx={highway.destination.x} cy={highway.destination.y} fill='blue' stroke='white' strokeWidth='1' r='1'/>
      <line x1={highway.origin.x} y1={highway.origin.y}
            x2={highway.destination.x} y2={highway.destination.y}
            stroke='gray' strokeWidth='2'/>
      <line x1={highway.origin.x} y1={highway.origin.y}
            x2={highway.destination.x} y2={highway.destination.y}
            stroke='blue' strokeDasharray='1px'/>
    </React.Fragment>
  ))
);

const Map = (props) => {
  const [zoom, setZoom] = useState(150);

  useEffect(() => {
    if (!props.x4.map) {
      props.fetchX4Map();
    }
  }, [props.x4.map]);

  return (
    <div className='x4__map'>
      <h1>X4 Map</h1>
      <div className='x4__map-controls'>
        <span onClick={() => setZoom(zoom => zoom += 20)}>+</span>
        <span onClick={() => setZoom(zoom => zoom -= 20)}>-</span>
        <span onClick={() => props.fetchX4Map()}>R</span>
      </div>
      {props.x4.map && (
        <div className='x4__map-wrapper'>
          <svg width={`${zoom}%`} height={`${zoom}%`} viewBox={`20 -140 1200 1032`}>
            <Clusters {...props} />
            <Gates {...props} />
            <SuperHighways {...props} />
            <ClusterTexts {...props} />
          </svg>
        </div>
      )}
    </div>
  );
};

const mapStateToProps = state => ({x4: state.x4}),
  mapDispatchToProps = {fetchX4Map};

export default connect(mapStateToProps, mapDispatchToProps)(Map);


/*

function clicked(event) {
  let m = oMousePosSVG(event);
  console.log(m.x,m.y);
}

svg.addEventListener("click", clicked)

function oMousePosSVG(e) {
      var p = svg.createSVGPoint();
      p.x = e.clientX; p.y = e.clientY;
      var ctm = svg.getScreenCTM().inverse();
      var p =  p.matrixTransform(ctm);
      return p;
}

 */
