import Reflux from 'reflux';
import when from 'when';
import { get } from 'utils/http';

import baseUrl from 'utils/baseUrl';

let actions = Reflux.createActions( {
    getUsers: { asyncResult: true }
} );

actions.getUsers.listenAndPromise(getUsers);

function getUsers(data) {
    return when(
        get( baseUrl( `users/` ) )
    );
}

export default actions;
