import axios from 'axios';

export function fetchX4Ships() {
  return (dispatch) => {
    return axios.get('/api/x4/ships')
      .then(response => dispatch({
        type: 'FETCH_X4_SHIPS',
        payload: response.data
      }))
      .catch(err => console.log(err));
  };
}

export function fetchX4Equipment() {
  return (dispatch) => {
    return axios.get('/api/x4/equipment')
      .then(response => dispatch({
        type: 'FETCH_X4_EQUIPMENT',
        payload: response.data
      }))
      .catch(err => console.log(err));
  };
}

export function fetchX4Map() {
  return (dispatch) => {
    return axios.get('/api/v2/x4/map')
      .then(response => dispatch({
        type: 'FETCH_X4_MAP',
        payload: response.data
      }))
      .catch(err => console.log(err));
  };
}

export function fetchX4Modifications() {
  return (dispatch) => {
    return axios.get('/api/x4/modifications')
      .then(response => dispatch({
        type: 'FETCH_X4_MODIFICATIONS',
        payload: response.data
      }))
      .catch(err => console.log(err));
  };
}
