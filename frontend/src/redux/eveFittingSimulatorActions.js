import axios from 'axios';

export function fetchShipGroups() {
  return (dispatch) => {
    return axios.post('/api/eve-fitting-simulator/groups')
      .then(response => dispatch({type: 'FETCH_SHIP_GROUPS', payload: response.data}))
      .catch(err => console.log(err));
  };
}

export function fetchShipGroup(id) {
  return (dispatch) => {
    return axios.post('/api/eve-fitting-simulator/group', {id: id})
      .then(response => dispatch({type: 'FETCH_SHIP_GROUP', payload: response.data}))
      .catch(err => console.log(err));
  };
}

export function fetchShip(id) {
  return (dispatch) => {
    return axios.post('/api/eve-fitting-simulator/ship', {id: id})
      .then(response => dispatch({type: 'FETCH_SHIP', payload: response.data}))
      .catch(err => console.log(err));
  };
}
