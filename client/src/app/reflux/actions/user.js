import Reflux from 'reflux';

import users from 'resources/users';

let actions = Reflux.createActions( {
    getProfile: { asyncResult: true }
} );

export default actions;

actions.getProfile.listenAndPromise( users.getProfile );
