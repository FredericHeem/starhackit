import { browserHistory } from 'react-router';
import {bindActionCreators} from 'redux';
import {createAction} from 'redux-act';
import {createActionAsync, createReducerAsync} from 'redux-act-async';
import {connect} from 'react-redux';
import UsersView from './usersView';
import UserView from './userView';

function Resources(rest){
  return {
    getAll(data) {
        return rest.get(`users/`, data);
    },
    getOne(id, data) {
        return rest.get(`users/${id}`, data);
    }
  }
}

function Actions(rest){
    let users = Resources(rest);
    return {
        selectOne: createAction('USER_SELECT'),
        getAll: createActionAsync('USER_GETALL', users.getAll),
        getOne: createActionAsync('USER_GETONE', users.getOne)
    }
}

function Reducers(actions){
  return {
    usersGetAll: createReducerAsync(actions.getAll),
    usersGetOne: createReducerAsync(actions.getOne)
  }
}

function Containers(context, actions, resources){
    const mapDispatchToProps = (dispatch) => ({actions: bindActionCreators(actions, dispatch)});
    return {
      users(){
          const mapStateToProps = () => ({})
          return connect(mapStateToProps, mapDispatchToProps)(UsersView({resources, ...context}));
      },
      user(){
          const mapStateToProps = (state) => ({
              usersGetOne: state.admin.usersGetOne
          })
          return connect(mapStateToProps, mapDispatchToProps)(UserView(context));
      }
    }
}

function Routes(containers, store, actions){
    return {
      childRoutes : [
          {
              path: 'users',
              component: containers.users()
          }, {
              path: 'users/:userId',
              component: containers.user(),
              onEnter: nextState => store.dispatch(actions.getOne(nextState.params.userId))
          }
      ]
    }
}

function Middleware(actions){
  const middleware = () => next => action => {
    if(action.type === actions.selectOne.getType()){
      let userId = action.payload;
      browserHistory.push(`/admin/users/${userId}`)
    }

    return next(action)
  }
  return middleware;
}

export default function({context, rest}) {
  let resources = Resources(rest)
  let actions = Actions(rest);
  let containers = Containers(context, actions, resources)
  return {
      actions,
      reducers: Reducers(actions),
      containers,
      routes: (store) => Routes(containers, store, actions),
      middlewares: [Middleware(actions)]
  }
}
