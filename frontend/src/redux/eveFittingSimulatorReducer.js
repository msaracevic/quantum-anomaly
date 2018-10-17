export default function reducer(state = {shipGroups: null, groupInfo: null}, action) {
  switch (action.type) {
    case 'FETCH_SHIP_GROUPS': {
      return {
        shipGroups: action.payload
      };
    }
    case 'FETCH_SHIP_GROUP': {
      return {
        ...state,
        activeGroupInfo: action.payload
      };
    }
    case 'FETCH_SHIP': {
      return {
        ...state,
        ...action.payload,
        shipFetched: true
      };
    }
    default: {
      return {...state};
    }
  }
};
