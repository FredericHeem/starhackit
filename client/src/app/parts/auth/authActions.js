import { createActionAsync} from 'redux-act-async';
import { createAction} from 'redux-act';
import AuthResources from './authResources';

export default function(rest){
    let auth = AuthResources(rest);
    return {
        setToken: createAction('TOKEN_SET'),
        me: createActionAsync('ME', auth.me),
        login: createActionAsync('LOGIN', auth.login),
        logout: createActionAsync('LOGOUT', auth.logout),
        requestPasswordReset: createActionAsync('PASSWORD_RESET', auth.requestPasswordReset),
        signup: createActionAsync('SIGNUP', auth.register),
        verifyEmailCode: createActionAsync('VERIFY_EMAIL_CODE', auth.verifyEmailCode)
    }
}
