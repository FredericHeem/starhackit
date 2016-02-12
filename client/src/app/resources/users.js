import { get } from 'utils/http';

export function getProfile( userId ) {
    return get(`users/${userId}`);
}
