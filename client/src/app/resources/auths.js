import {
    post,
    get
} from 'utils/http';

export function getCurrentUser() {
    return get('me');
}

export function signupOrLoginThirdParty(provider) {
    return get('auth/' + provider);
}

export function signupLocal(username, password, email) {
    return post('auth/register', {
        params: {
            username,
            password,
            email
        }
    });
}

export function loginLocal(payload) {
    return post('auth/login', {
        params: {
            username: payload.email,
            password: payload.password
        }
    });
}

export function logout() {
    return post('auth/logout');
}

export function verifyEmailCode(code) {
    return post('auth/verify_email_code/', {
        params: {
            code: code
        }
    });
}
