import Reflux from 'reflux';
import ga from 'react-ga';

import authActions from 'actions/auth';

export default Reflux.createStore( {

    init() {
        //User
        this.listenTo( authActions.signupOrLoginThirdParty.completed, analytics.bind( this, 'Users', 'signupOrLoginThirdParty' ) );
        this.listenTo( authActions.signupLocal.completed, analytics.bind( this, 'Users', 'signupLocal' ) );
        this.listenTo( authActions.loginLocal.completed, analytics.bind( this, 'Users', 'loginLocal' ) );
    }
} );


//////////////////////////
//// Private

function analytics( category, action ) {
    ga.event( {
        category,
        action
    } );
}
