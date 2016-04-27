import { createActionAsync} from 'redux-act-async';
import ProfileResources from './profileResources';

export default function(rest){
    let profile = ProfileResources(rest);
    return {
        get: createActionAsync('PROFILE_GET', profile.get),
        update: createActionAsync('PROFILE_UPDATE', profile.update)
    }
}
