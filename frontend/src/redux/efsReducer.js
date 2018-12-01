export default function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_SHIP_GROUPS': {
      return {
        ...state,
        shipGroups: action.payload
      };
    }
    case 'FETCH_CURRENT_SHIP_GROUP': {
      return {
        ...state,
        currentGroup: {...action.payload},
        ship:         null
      };
    }
    case 'FETCH_SHIP': {
      return {
        ...state,
        ship:         action.payload,
        currentGroup: {
          id:   action.payload.group_id,
          name: action.payload.group_name
        }
      };
    }
    case 'FETCH_MODULE_GROUPS': {
      return {
        ...state,
        moduleGroups: action.payload
      };
    }
    default: {
      return {...state};
    }
  }
};
