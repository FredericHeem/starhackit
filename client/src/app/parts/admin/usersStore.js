import Reflux from 'reflux';
import usersActions from './usersActions';

import Debug from 'debug';
let debug = new Debug("users:store");

export default Reflux.createStore( {

    store: [],

    init() {
        this.listenTo( usersActions.getUsers.completed, gotUsers.bind( this ) );
    },

    getInitialState() {
        return this.store;
    }

} );

///////////////////
////

function gotUsers( users ) {
    debug(`gotUsers: ${JSON.stringify(users, null, 4)}`);
    this.store = users;
    doTrigger.call( this );
}


function doTrigger() {
    this.trigger( this.store );
}
