import {get} from 'utils/http';

export default {
    getProfile(userId) {
        return get(`users/${userId}`);
    }
};
