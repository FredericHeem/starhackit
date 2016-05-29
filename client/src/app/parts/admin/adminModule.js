import React from 'react';
import {Route, IndexRoute} from 'react-router';
import {bindActionCreators} from 'redux';
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
          return connect(mapStateToProps)(UsersView);
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
function Routes(containers){
    return (
        <Route path="/admin">
            <IndexRoute component={containers.users()}/>
            <Route component={containers.users()} path="users"/>
            <Route component={containers.user()} path="users/:userId"/>
        </Route>
    )
}

export default function(rest) {
  let resources = Resources(rest)
  let actions = Actions(rest);
  let containers = Containers(actions, resources)
  let routes = Routes(containers);
  return {
      actions,
      reducers: Reducers(actions),
      containers,
      routes
  }
}
