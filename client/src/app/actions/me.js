import Reflux from 'reflux';

import {
    getMyProfile,
    updateMyProfile
} from 'resources/me';

let actions = Reflux.createActions( {
    getMyProfile: { asyncResult: true },
    updateMyProfile: { asyncResult: true }
} );

export default actions;

actions.getMyProfile.listenAndPromise( getMyProfile );
actions.updateMyProfile.listenAndPromise( updateMyProfile );
