import Reflux from 'reflux';

import me from 'resources/me';

let actions = Reflux.createActions( {
    getMyProfile: { asyncResult: true },
    updateMyProfile: { asyncResult: true }
} );

export default actions;

actions.getMyProfile.listenAndPromise( me.getMyProfile );
actions.updateMyProfile.listenAndPromise( me.updateMyProfile );
