import Reflux from 'reflux';

import {
    getProfile
} from 'resources/users';

let actions = Reflux.createActions( {
    getProfile: { asyncResult: true }
} );

export default actions;

actions.getProfile.listenAndPromise( getProfile );
