import {
    get,
    patch
} from 'utils/http';

export default {
    getMyProfile() {
        return get('me');
    },
    updateMyProfile(packet) {
        return patch('me', {
            params: {
                username: packet.username,
                about: packet.about
            }
        });
    }
};
