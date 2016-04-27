import Actions from './profileActions'
import Reducers from './reducers/reducers';

export default function(rest) {
    let actions = Actions(rest);

    return {
        actions: actions,
        reducers: Reducers(actions)
    }
}
