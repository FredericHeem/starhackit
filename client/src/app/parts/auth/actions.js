import { createActionAsync} from 'redux-act-async';
import auth from 'resources/auths';

export default {
    me: createActionAsync('ME', auth.me),
    login: createActionAsync('LOGIN', auth.loginLocal),
    logout: createActionAsync('LOGOUT', auth.logout),
    requestPasswordReset: createActionAsync('PASSWORD_RESET', auth.requestPasswordReset),
    signup: createActionAsync('SIGNUP', auth.signupLocal),
    verifyEmailCode: createActionAsync('VERIFY_EMAIL_CODE', auth.verifyEmailCode)
}
