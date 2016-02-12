import {
    post
} from 'utils/http';

export function requestPasswordReset(email) {
    return post('auth/reset_password', {
        params: {
            email
        }
    });
}

export function verifyResetPasswordToken(token, password) {
    return post('auth/verify_reset_password_token', {
        params: {
            token,
            password
        }
    });
}
