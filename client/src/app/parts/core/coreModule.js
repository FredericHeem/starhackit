import Immutable from 'immutable';
import { LOCATION_CHANGE} from 'react-router-redux';

// Reducers
let initialState = Immutable.fromJS({
    locationBeforeTransitions: undefined
});

function RouterReducer(){
    return (state = initialState, action) => {
        console.log('action.type: ', action.type)
        if (action.type === LOCATION_CHANGE) {
            return state.merge({
                locationBeforeTransitions: action.payload
            });
        }

        return state;
    };
}
function Reducers(){
  return {
    router: RouterReducer()
  }
}


// Part
export default function() {
  let reducers = Reducers();
  return {
    reducers
  }
}
