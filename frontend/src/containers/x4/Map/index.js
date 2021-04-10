import React, {useEffect, useRef, useState} from 'react';
import {fetchX4Map} from '../../../redux/x4Actions';
import {connect} from 'react-redux';

import {backgroundLabelRectWidth, getHexagonPoints, maps, resolveHexagonCenterByProps} from '../helpers';
import Stations from './Stations';
import Resources from './Resources';
import {Gates, SuperHighways} from './Travel';

import './Map.scss';
import {seo} from '../../../helpers';
import {Link} from 'react-router-dom';

const Sectors = props => (
  props.sectors.map((sector, index) => {
    let sectorOwner = props.owner;
    const backgroundWidth = (sector.name.length * 3.7) - backgroundLabelRectWidth(sector.name);
    if (sector.name === 'Hatikvah\'s Choice I') sectorOwner = 'hatikvah';
    if (sector.name === 'Hewa\'s Twin IV The Cove') sectorOwner = 'none';

    const {sectorsPosition, position} = props;
    const color = sectorsPosition !== 'singular' ? maps.colors[sectorOwner].border : maps.colors[props.owner].border;

    return (
      <React.Fragment key={Math.random()}>
        {sectorsPosition !== 'singular' && !props.text && (
          <polyline fill='#000020'
                    stroke={color}
                    strokeWidth='1.3'
                    points={getHexagonPoints(resolveHexagonCenterByProps(sectorsPosition, index, position), 'small')}/>
        )}

        {sectorsPosition !== 'singular' && props.text && (
          <>
            <rect x={resolveHexagonCenterByProps(sectorsPosition, index, position).x - backgroundWidth / 2}
                  y={resolveHexagonCenterByProps(sectorsPosition, index, position).y - 16}
                  width={backgroundWidth} height='6' fill='black'
                  stroke={color} strokeWidth='0.2'/>
            <text textAnchor='middle' fontSize='7px' fill='white'
                  x={resolveHexagonCenterByProps(sectorsPosition, index, position).x}
                  y={resolveHexagonCenterByProps(sectorsPosition, index, position).y - 11}>
              {sector.name}
            </text>
            <Resources resources={sector.resources} {...resolveHexagonCenterByProps(sectorsPosition, index, position)}
                       small/>
          </>
        )}

        {sectorsPosition === 'singular' && !props.text && (
          <polyline fill='#000022' stroke={color} strokeWidth='1.3'
                    points={getHexagonPoints({x: position.x, y: position.y})}/>
        )}

        {sectorsPosition === 'singular' && props.text && (
          <>
            <rect x={position.x - backgroundWidth / 2} y={position.y - 37}
                  width={backgroundWidth} height='6' fill='black'
                  stroke={color} strokeWidth='0.2'/>
            <text textAnchor='middle' fontSize='7px' fill='white' x={position.x} y={position.y - 32}>
              {sector.name}
            </text>
            <Resources resources={sector.resources} {...position}/>
          </>
        )}
      </React.Fragment>
    );
  })
);

const Clusters = props => (
  props.x4.map.systems.map(system => (
    <React.Fragment key={Math.random()}>
      {system.position.x !== -1000 && <Sectors {...system} />}
      <polyline fill='none'
                strokeWidth='1.3'
                stroke={maps.colors[system.owner].border}
                points={getHexagonPoints(system.position)}/>
    </React.Fragment>
  )));

const ClusterTexts = props => (
  props.x4.map.systems.map(system => (
    <React.Fragment key={Math.random()}>
      {system.position.x !== -1000 && <Sectors {...system} text/>}
    </React.Fragment>
  )));

const Map = (props) => {
  const [scale, setScale] = useState(1);
  const [moved, setMoved] = useState({x: 0, y: 0});
  const [showLegend, setShowLegend] = useState(false);

  const svg = useRef();
  const wrapper = useRef();
  let moving = false;

  useEffect(() => {
    if (!props.x4.map) {
      props.fetchX4Map();
      // setInterval(() => props.fetchX4Map(), 3000);
    }
  }, [props.x4.map]);

  let startPosition;
  let dx = 0;
  let dy = 0;
  let currentPosition;

  const mouseDownHandler = e => {
    const tag = e.target.tagName;
    const isWrapper = e.target.className === 'x4__map-wrapper';
    if (tag !== 'svg' && tag !== 'line' && tag !== 'circle' && tag !== 'polyline' && tag !== 'rect' && !isWrapper) return;
    wrapper.current.style.cursor = 'grabbing';
    moving = true;
    let currentTransform = svg.current.style.transform.match(/translate\((.*?)\)/)[1];
    if (currentTransform === '0px') currentTransform = '0px, 0px'; // firefox being special snowflake here
    currentPosition = currentTransform.replace(/px/g, '').split(', ');
    startPosition = {x: e.clientX, y: e.clientY};
  };

  const mouseMoveHandler = e => {
    if (moving) {
      dx = (e.clientX - startPosition.x) / (scale);
      dy = (e.clientY - startPosition.y) / (scale);
      setMoved({x: parseFloat(currentPosition[0]) + dx, y: parseFloat(currentPosition[1]) + dy});
    }
  };

  const mouseUpHandler = () => {
    if (moving) {
      moving = false;
      wrapper.current.style.cursor = 'grab';
    }
  };

  const wheelHandler = e => {
    e.preventDefault();
    if (e.deltaY < 0 && scale > 5) return null;
    if (e.deltaY > 0 && scale < 2) return null;
    e.deltaY < 0
      ? setScale(prevScale => prevScale < 5 ? prevScale + 1 : 5)
      : setScale(prevScale => prevScale > 1 ? prevScale - 1 : 1);
  };

  const downloadSvgFile = () => {
    const element = document.createElement('a');
    const svgAsString = svg.current.outerHTML.toString().replace(/style="(.*?)"/, '');
    const file = new Blob([svgAsString], {type: 'image/svg+xml'});
    element.href = URL.createObjectURL(file);
    element.download = 'x4-map.svg';
    document.body.appendChild(element);
    element.click();
  };

  useEffect(() => {
    if (!props.x4.map) return;
    addEventListener('mousedown', mouseDownHandler);
    addEventListener('mousemove', mouseMoveHandler);
    addEventListener('mouseup', mouseUpHandler);
    wrapper.current.addEventListener('wheel', wheelHandler);
    return () => {
      removeEventListener('mousedown', mouseDownHandler);
      removeEventListener('mousemove', mouseMoveHandler);
      removeEventListener('mouseup', mouseUpHandler);
      if (wrapper.current) wrapper.current.removeEventListener('wheel', wheelHandler);
    };
  }, [props.x4.map, scale]);

  useEffect(() => {
    if (props.x4.map) seo({
      title: 'X4 Foundations Map',
      metaDescription: 'X4 Foundations, Split Vendetta and Cradle of Humanity map.',
      keywords: `${props.x4.map.systems.map(system => system.sectors.map(sector => sector.name).join(', '))}`
    });
  }, [props.x4.map]);

  return (
    <div className='x4__map'>
      <h1>X4 Map v4.0</h1>
      {props.x4.map && (
        <React.Fragment>
          <div className='x4__map-controls'>
            <Link to={'/x4/resources'} className='link'>Go to resource table</Link>
            <span onClick={() => setShowLegend(!showLegend)}>
              {showLegend ? 'Hide' : 'Show'} legend
            </span>
          </div>
          <div ref={wrapper} className='x4__map-wrapper'>
            {showLegend && <div className='x4__legend'>
              All locations are approximate <br/>
              Use mouse to move and zoom <br/>
              Resource numbers are explained in resource table
              <div className='x4__resources'>
                <p style={{'background': maps.resourceColors.ore}}>Ore</p>
                <p style={{'background': maps.resourceColors.silicon}}>Silicon</p>
                <p style={{'background': maps.resourceColors.ice}}>Ice</p>
                <p style={{'background': maps.resourceColors.hydrogen}}>Hydrogen</p>
                <p style={{'background': maps.resourceColors.helium}}>Helium</p>
                <p style={{'background': maps.resourceColors.methane}}>Methane</p>
                <p style={{'background': maps.resourceColors.nividium}}>Nividium</p>
              </div>
            </div>}
            <svg ref={svg} width='100%' height='100%' viewBox='-400 -160 2200 1150'
                 version="1.1" xmlns="http://www.w3.org/2000/svg"
                 style={{transform: `scale(${scale}) translate(${moved.x}px, ${moved.y}px)`}}>
              <Clusters {...props} />
              <Stations {...props} stationScale={scale === 1 ? 1.3 : 1}/>
              <Gates {...props} />
              <SuperHighways {...props} />
              <ClusterTexts {...props} />
            </svg>
          </div>
          <div style={{textAlign: 'right', padding: '3px'}}>
            <span>Special thank you to Allectus, DeadAir and UniTrader from Egosoft discord for helping&nbsp;&nbsp;</span>
            <button onClick={downloadSvgFile} className='btn btn--cta'>Click here to download as svg</button>
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

const mapStateToProps = state => ({x4: state.x4}),
  mapDispatchToProps = {fetchX4Map};

export default connect(mapStateToProps, mapDispatchToProps)(Map);
