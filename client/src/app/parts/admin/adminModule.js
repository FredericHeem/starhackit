import React from 'react';
import {Route, IndexRedirect} from 'react-router';
import { browserHistory } from 'react-router';
import {bindActionCreators} from 'redux';
import {createAction} from 'redux-act';
import {createActionAsync, createReducerAsync} from 'redux-act-async';
import {connect} from 'react-redux';
import UsersView from './usersView';
import UserView from './userView';
//import Debug from 'debug';
//let debug = new Debug("admin");

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

function Containers(actions, resources){
    const mapDispatchToProps = (dispatch) => ({actions: bindActionCreators(actions, dispatch)});
    return {
      users(){
          const mapStateToProps = () => ({resources})
          return connect(mapStateToProps, mapDispatchToProps)(UsersView);
      },
      user(){
          const mapStateToProps = (state) => ({
              usersGetOne: state.usersGetOne,
              usersGetAll: state.usersGetAll
          })
          //const mapStateToProps = () => ({resources})
          return connect(mapStateToProps, mapDispatchToProps)(UserView);
      }
    }
}

function Routes(containers, store, actions){
    return (
        <Route path="/admin">
            <IndexRedirect to="users" />
            <Route component={containers.users()} path="users"
              onEnter={() => store.dispatch(actions.getAll())}/>
            <Route component={containers.user()} path="users/:userId"
              onEnter={nextState => store.dispatch(actions.getOne(nextState.params.userId))}/>
        </Route>
    )
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

export default function(rest) {
  let resources = Resources(rest)
  let actions = Actions(rest);
  let containers = Containers(actions, resources)
  return {
      actions,
      reducers: Reducers(actions),
      containers,
      routes: (store) => Routes(containers, store, actions),
      middleware: Middleware(actions)
  }
}
