import {
    get,
    patch
} from 'utils/http';

export function getMyProfile() {
    return get('me');
}

export function updateMyProfile(packet) {
    return patch('me', {
        params: {
            username: packet.username,
            about: packet.about
        }
    });
}
