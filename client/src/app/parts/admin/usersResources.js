import { get } from 'utils/http';

export default {
    getAll(data) {
        return get(`users/`, {params: data});
    }
};
