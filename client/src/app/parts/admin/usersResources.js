import when from 'when';
import { get } from 'utils/http';

import baseUrl from 'utils/baseUrl';

export default {
    getAll(data) {
        return when(
            get( baseUrl( `users/` ), {params: data})
        );
    }
};
