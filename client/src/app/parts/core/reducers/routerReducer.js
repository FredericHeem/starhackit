import Immutable from 'immutable';
import { LOCATION_CHANGE} from 'react-router-redux';

let initialState = Immutable.fromJS({
    locationBeforeTransitions: undefined
});

export default function(){
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
