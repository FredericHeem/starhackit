import Reflux from 'reflux';
import userActions from 'actions/user';

export default Reflux.createStore( {

    store: null,

    init() {
        this.listenTo( userActions.getProfile.completed, gotProfile.bind( this ) );
    },

    getInitialState() {
        return this.store;
    }

} );

///////////////////
////

function gotProfile( profile ) {
    this.store = profile;
    doTrigger.call( this );
}


function doTrigger() {
    this.trigger( this.store );
}