import _ from 'lodash';
import {
    combineReducers
} from 'redux-immutable';

export default function(modules) {

    let reducers = {};
    _.each(modules, (module) => {
        if (module.reducers) {
            reducers = _.merge(reducers, module.reducers)
        }
    });

    return combineReducers(reducers);
}
