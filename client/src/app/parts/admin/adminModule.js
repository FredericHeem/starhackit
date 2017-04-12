import { browserHistory } from 'react-router';
import {bindActionCreators} from 'redux';
import {createAction} from 'redux-act';
import {createActionAsync, createReducerAsync} from 'redux-act-async';
import {connect} from 'react-redux';
import UserView from './userView';
import Users from './users';

export default function(context) {
  const {rest} = context;
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

  const resources = Resources(rest);

  const users = Users(context, {getAll: resources.getAll});

  function Actions(resources){
      return {
          selectOne: createAction('USER_SELECT'),
          getOne: createActionAsync('USER_GETONE', resources.getOne)
      }
  }

  function Reducers(actions){
    return {
      usersGetOne: createReducerAsync(actions.getOne)
    }
  }

  function Containers(context, actions){
      const mapDispatchToProps = (dispatch) => ({actions: bindActionCreators(actions, dispatch)});

      return {
        users(){
            const mapStateToProps = () => ({})
            return connect(mapStateToProps, mapDispatchToProps)(users.view);
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
                component: containers.users(),
                onEnter: () => users.store.selectPage(1)
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
      switch(action.type){
        case actions.selectOne.getType():{
          const userId = action.payload;
          browserHistory.push(`/admin/users/${userId}`)
        }
        break;
        default:
      }

      return next(action)
    }
    return middleware;
  }

  const actions = Actions(resources);
  const containers = Containers(context, actions);

  return {
      actions,
      reducers: Reducers(actions),
      containers,
      routes: (store) => Routes(containers, store, actions),
      middlewares: [Middleware(actions)]
  }
}
