import {
    post,
    get
} from 'utils/http';

export default {
    me() {
        return get('me');
    },
    signupLocal(payload) {
        return post('auth/register', {
            params: {
                username: payload.username,
                password: payload.password,
                email: payload.email
            }
        });
    },
    loginLocal(payload) {
        return post('auth/login', {
            params: {
                username: payload.email,
                password: payload.password
            }
        });
    },
    logout() {
        return post('auth/logout');
    },
    verifyEmailCode(code) {
        return post('auth/verify_email_code/', {
            params: {
                code: code
            }
        });
    },
    requestPasswordReset(email) {
        return post('auth/reset_password', {
            params: {
                email
            }
        });
    },
    verifyResetPasswordToken(token, password) {
        return post('auth/verify_reset_password_token', {
            params: {
                token,
                password
            }
        });
    }
};
