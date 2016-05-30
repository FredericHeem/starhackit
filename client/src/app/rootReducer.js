import _ from 'lodash';
import {
    combineReducers
} from 'redux';
import { routerReducer} from 'react-router-redux';

export default function(modules) {
    let reducers = _.reduce(modules, (acc, module, key) => {
        if (module.reducers) {
            acc[key] = combineReducers(module.reducers)
        }
        return acc;
    }, {});

    reducers.routing = routerReducer;

    return combineReducers(reducers)
}
