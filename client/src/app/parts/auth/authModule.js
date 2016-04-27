import Actions from './authActions'
import Reducers from './reducers/reducers';
import Middleware from './authMiddleware';

export default function(rest) {
    let actions = Actions(rest);

    return {
        actions: actions,
        reducers: Reducers(actions),
        middleware: Middleware(actions)
    }
}
