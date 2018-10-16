export default function reducer(state = {shipGroups: null, groupInfo: null}, action) {
  switch (action.type) {
    case 'FETCH_SHIP_GROUPS': {
      return {
        ...state,
        shipGroups: action.payload
      };
    }
    case 'FETCH_SHIP_GROUP': {
      return {
        ...state,
        activeGroupInfo: action.payload
      };
    }
    default: {
      return {...state};
    }
  }
};
