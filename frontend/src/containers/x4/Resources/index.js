import React, {useEffect, useState} from 'react';
import {fetchX4Map} from '../../../redux/x4Actions';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';

import {maps} from '../helpers';
import {dynamicSortMultiple, seo} from '../../../helpers';
import './Resources.scss';

export const ResourcesTable = props => {
  const [sort, setSort] = useState('name');
  const [showEmpty, setShowEmpty] = useState('false');
  const [sectors, setSectors] = useState([]);
  const sortBy = arg => setSort(arg === sort ? `-${arg}` : arg);

  useEffect(() => {
    setSectors([...sectors].sort(dynamicSortMultiple(sort, 'name', 'owner')));
  }, [sort]);

  useEffect(() => {
    if (!props.x4.map) {
      props.fetchX4Map();
    } else {
      const orderedSectors = [];
      props.x4.map.systems.forEach(system => system.sectors.forEach(sector =>
        orderedSectors.push({
          id: sector.id,
          name: sector.name,
          owner: system.owner,
          ore: sector.resources && sector.resources.ore > 0 ? sector.resources.ore : null,
          silicon: sector.resources && sector.resources.silicon > 0 ? sector.resources.silicon : null,
          ice: sector.resources && sector.resources.ice > 0 ? sector.resources.ice : null,
          hydrogen: sector.resources && sector.resources.hydrogen > 0 ? sector.resources.hydrogen : null,
          helium: sector.resources && sector.resources.helium > 0 ? sector.resources.helium : null,
          methane: sector.resources && sector.resources.methane > 0 ? sector.resources.methane : null,
          nividium: sector.resources && sector.resources.nividium > 0 ? sector.resources.nividium : null,
          // yea... I know, fix later...
          empty: !(sector.resources && (
            sector.resources.ore ||
            sector.resources.silicon ||
            sector.resources.ice ||
            sector.resources.hydrogen ||
            sector.resources.helium ||
            sector.resources.methane ||
            sector.resources.nividium
          ))
        })
      ));
      orderedSectors.sort(dynamicSortMultiple('name', 'owner'));
      seo({
        title: 'X4 Foundations Resource Table',
        metaDescription: 'X4 Foundations, Split Vendetta and Cradle of Humanity resource table.',
        keywords: `${orderedSectors.map(sector => sector.name).join(',')}`
      });
      setSectors(orderedSectors);
    }
  }, [props.x4.map]);

  return (
    <div className='x4-resources-table'>
      <h1>X4 Resource table v4.0</h1>
      {props.x4.map && (
        <React.Fragment>
          <div className='x4__map-controls'>
            <Link to={'/x4/map'} className='link'>Go to interactive map</Link>
            <span onClick={() => setShowEmpty(!showEmpty)}>
              {!showEmpty ? 'Hide' : 'Show'} empty systems
            </span>
          </div>
          <div className='x4-resources-table__wrapper'>
            <span className='x4-resources-table__method muted'>Method explained under the table</span>
            <table>
              <thead>
              <tr>
                <th onClick={() => sortBy('name')}>System</th>
                <th onClick={() => sortBy('owner')}>Owner</th>
                <th onClick={() => sortBy('ore')} className='number'>Ore</th>
                <th onClick={() => sortBy('silicon')} className='number'>Silicon</th>
                <th onClick={() => sortBy('ice')} className='number'>Ice</th>
                <th onClick={() => sortBy('hydrogen')} className='number'>Hydrogen</th>
                <th onClick={() => sortBy('helium')} className='number'>Helium</th>
                <th onClick={() => sortBy('methane')} className='number'>Methane</th>
                <th onClick={() => sortBy('nividium')} className='number'>Nividium</th>
              </tr>
              </thead>
              <tbody>
              {sectors.map(sector => (
                <React.Fragment key={sector.id}>
                  {(!sector.empty || !showEmpty) && (
                    <tr>
                      <td title={sector.id}>{sector.name}</td>
                      <td>{maps.factions[sector.owner] || 'Neutral'}</td>

                      {['ore', 'silicon', 'ice', 'hydrogen', 'helium', 'methane', 'nividium'].map(resource => (
                        <td className='number' key={`${sector.id}${resource}`}>
                          {sector[resource]
                            ? <span title={resource}
                                    style={{borderColor: maps.resourceColors[resource]}}>{sector[resource]}</span>
                            : null
                          }
                        </td>
                      ))}
                    </tr>
                  )}
                </React.Fragment>
              ))}
              </tbody>
            </table>
          </div>
          <p>
            The game defines regions in each system. This is reference table which describes which resources you might
            find in each sector. The game describes cylinders, spheres, spline tubes and cubes as potential region which
            can have resources. For each of those regions volume was calculated and multiplied by density of the field.
            <span className='bold'> Falloff zones</span> were ignored in calculations. They will most likely be added in
            future. This means that extremes are a bit skewed, but still should provide good relative idea of what is
            where
            and how much of it is there.
          </p>
          <p>
            After that for each region we can have asteroids or a nebula. For each asteroid yield was calculated
            together
            with density of those type of asteroids, including their noise level average. For each nebula similar was
            done, but game doesn't apply same rules there, so calculation is just based on region size
          </p>
          <p>
            Each zone can be have resources in either one of these states: lowest, verylow, low, medium, high and very
            high.
            These describe one more density modifier for asteroids and gather speed factor for nebula. They also
            describe
            replenish time for each zone. <span className='bold'>Replenish times</span> were ignored in calculations.
          </p>
          <p>
            At the end for each system, each of the resources was added together in total tally. Largest number of each
            resource was calculated on universe level. Since that number is fairly large for some systems which have
            large
            zones, that number was halved and set as "100 points". Since it could happen that a system might have more
            zones,
            there was risk of getting over 100 points, so maximum was limited to 99 and rest of the systems are in
            relation
            to that number.
          </p>
          <h3>Things to be aware of</h3>
          <ul className='ul--packed'>
            <li>
              Just because something is high number of points, doesn't mean it is feasible, for example
              Nopileos' Fortune II region is normal purposes practically infinite in size, so take that information
              into consideration.
            </li>
            <li>
              Each resource is tracked on it's own, 99 Ore and 99 Nividium doesn't mean there is as much Nividium as
              Ore.
              It only means that this is biggest yield of both of them. Highest theoretical Ore yield is about 4
              trillion
              units, while for Nividium is about 2 billion.
            </li>
            <li>
              File used for calculation are available here: <a href='/api/x4/resources' className='link'
                                                               target='_blank'>Resources
              data</a>
            </li>
            <li>
              Full map data is available here: <a href='/api/x4/map' className='link' target='_blank'>Map data</a>
            </li>
            <li>
              Special thank you to <a href='https://www.nexusmods.com/users/2663?tab=user+files' className='link'
                                      target='_blank'>Allectus</a>,
              DeadAir and UniTrader from Egosoft discord for helping with calculations
            </li>
          </ul>
        </React.Fragment>
      )}
    </div>
  );
};

const mapStateToProps = state => ({x4: state.x4}),
  mapDispatchToProps = {fetchX4Map};

export default connect(mapStateToProps, mapDispatchToProps)(ResourcesTable);
