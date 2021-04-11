import React, {useEffect, useRef, useState} from 'react';
import {fetchX4Map} from '../../../redux/x4Actions';
import {connect, ReactReduxContext} from 'react-redux';

import './Map.scss';
import {seo} from '../../../helpers';
import {Link} from 'react-router-dom';
import {backgroundLabelRectWidth, getHexagonPointsV2, maps} from '../helpers';
import Station from './Station';
import Resources from './Resources';

const Map = (props) => {
  const [scale, setScale] = useState(3);
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
    if (e.deltaY < 0 && scale > 8) return null;
    if (e.deltaY > 0 && scale < 2) return null;
    e.deltaY < 0
      ? setScale(prevScale => prevScale < 8 ? prevScale + 1 : 8)
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
      metaDescription: 'X4 Foundations, Split Vendetta and Cradle of Humanity map.'
      //keywords: `${props.x4.map.systems.map(system => system.sectors.map(sector => sector.name).join(', '))}`
    });
  }, [props.x4.map]);

  return (
    <div className="x4__map">
      <h1>X4 Map v4.0</h1>
      {props.x4.map && (
        <React.Fragment>
          <div className="x4__map-controls">
            <Link to={'/x4/resources'} className="link">Go to resource table</Link>
            <span onClick={() => setShowLegend(!showLegend)}>
              {showLegend ? 'Hide' : 'Show'} legend
            </span>
          </div>
          <div ref={wrapper} className="x4__map-wrapper">
            {showLegend && <div className="x4__legend">
              All locations are approximate <br/>
              Use mouse to move and zoom <br/>
              Resource numbers are explained in resource table
              <div className="x4__resources">
                <p style={{'background': maps.resourceColors.ore}}>Ore</p>
                <p style={{'background': maps.resourceColors.silicon}}>Silicon</p>
                <p style={{'background': maps.resourceColors.ice}}>Ice</p>
                <p style={{'background': maps.resourceColors.hydrogen}}>Hydrogen</p>
                <p style={{'background': maps.resourceColors.helium}}>Helium</p>
                <p style={{'background': maps.resourceColors.methane}}>Methane</p>
                <p style={{'background': maps.resourceColors.nividium}}>Nividium</p>
              </div>
            </div>}
            <svg ref={svg} width="100%" height="100%" viewBox="-2800 -1800 5300 5000"
                 version="1.1" xmlns="http://www.w3.org/2000/svg"
                 style={{transform: `scale(${scale}) translate(${moved.x}px, ${moved.y}px)`}}>

              {props.x4.map.clusters.map(cluster => cluster.sectors.map(sector => (
                <polyline key={sector.name}
                          stroke={sector.owner ? maps.colors[sector.owner].border : 'gray'}
                          strokeWidth="2"
                          fill={sector.owner ? maps.colors[sector.owner].border : 'gray'}
                          fillOpacity='0.2'
                          points={getHexagonPointsV2({
                            x: sector.adjusted.x,
                            y: -sector.adjusted.z
                          }, cluster.sectors.length < 2 ? 1 : 2)}/>
              )))}

              {props.x4.map.clusters.map(cluster => {
                let color = cluster.sectors[0].owner ? maps.colors[cluster.sectors[0].owner].border : 'gray'
                if (cluster.id === 'Cluster_29_macro') color = maps.colors['argon'].border;
                return <polyline key={cluster.id}
                                 fill="none"
                                 stroke={color}
                                 strokeWidth="2"
                                 points={getHexagonPointsV2({x: cluster.position.x, y: -cluster.position.z})}/>
              })}

              {props.x4.map.clusters.map(cluster => cluster.sectors.map(sector =>
                sector.zones && sector.zones.map((zone, index) =>
                  <React.Fragment key={`${zone.zoneReference}-${index}`}>
                    {zone.ref === 'gates' && <circle cx={zone.adjusted.x}
                                                     cy={-zone.adjusted.z}
                                                     fill="gray"
                                                     stroke="white"
                                                     strokeWidth="1"
                                                     r="3"/>}
                  </React.Fragment>
                )))}

              {props.x4.map.clusters.map(cluster => cluster.sectors.map(sector =>
                sector.stations && sector.stations.map((station, index) =>
                  <Station key={station.id} {...station} stationScale={scale === 1 ? 2.5 : 1.5} index={index}/>
                )))}

              {props.x4.map.connections.gates.map(gateConnection => (
                <React.Fragment key={gateConnection.source}>
                  <line x1={gateConnection.start.x} y1={-gateConnection.start.z}
                        x2={gateConnection.end.x} y2={-gateConnection.end.z} stroke="black"
                        strokeWidth="5"/>
                  <line x1={gateConnection.start.x} y1={-gateConnection.start.z}
                        x2={gateConnection.end.x} y2={-gateConnection.end.z} stroke="white"
                        strokeWidth="3" strokeDasharray="2"/>
                </React.Fragment>
              ))}

              {props.x4.map.clusters.map(cluster => cluster.sectors.map(sector =>
                <Resources {...sector} key={sector.id}/>
              ))}

              {props.x4.map.clusters.map(cluster => cluster.sectors.map(sector => {
                const backgroundWidth = (sector.name.length * 3) - backgroundLabelRectWidth(sector.name);
                const verticalOffset = sector.transformation ? 45 : 95;
                return (
                  <React.Fragment key={sector.name}>
                    <rect x={sector.adjusted.x - backgroundWidth}
                          y={-sector.adjusted.z - verticalOffset}
                          width={backgroundWidth * 2} height="13"
                          fill="black"
                          stroke={sector.owner ? maps.colors[sector.owner].border : 'white'}
                          strokeWidth="1"/>
                    <text x={sector.adjusted.x}
                          y={-sector.adjusted.z - verticalOffset + 10}
                          fontSize="12px" textAnchor="middle" fill="white">
                      {sector.name}
                    </text>
                    <text x={sector.adjusted.x}
                          y={-sector.adjusted.z - verticalOffset + 25}
                          fontSize="12px" textAnchor="middle" fill="white">
                      {cluster.id}
                    </text>
                    <text x={sector.adjusted.x}
                          y={-sector.adjusted.z - verticalOffset + 40}
                          fontSize="12px" textAnchor="middle" fill="white">
                      {sector.id}
                    </text>
                  </React.Fragment>
                );
              }))}
            </svg>
          </div>
          <div style={{textAlign: 'right', padding: '3px'}}>
            <span>Special thank you to Allectus, DeadAir and UniTrader from Egosoft discord for helping&nbsp;&nbsp;</span>
            <button onClick={downloadSvgFile} className="btn btn--cta">Click here to download as svg</button>
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

const mapStateToProps = state => ({x4: state.x4}),
  mapDispatchToProps = {fetchX4Map};

export default connect(mapStateToProps, mapDispatchToProps)(Map);
