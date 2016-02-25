import Immutable from 'immutable';
import { LOCATION_CHANGE} from 'react-router-redux';

let initialState = Immutable.fromJS({
    locationBeforeTransitions: undefined
});

export default (state = initialState, action) => {
    if (action.type === LOCATION_CHANGE) {
        return state.merge({
            locationBeforeTransitions: action.payload
        });
    }

    return state;
};
