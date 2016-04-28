import React from 'react';
import {Route, IndexRoute} from 'react-router';
import {connect} from 'react-redux';
import UsersView from './usersView';

function Resources(rest){
  return {
    getAll(data) {
        return rest.get(`users/`, data);
    }
  }
};

function Containers(resources){
    return {
      users(){
          const mapStateToProps = () => ({resources})
          return connect(mapStateToProps)(UsersView);
      },
    }
}
function Routes(containers){
    return (
        <Route path="/admin">
            <IndexRoute component={containers.users()}/>
        </Route>
    )
}

export default function(rest) {
    let resources = Resources(rest);
    let containers = Containers(resources);
    let routes = Routes(containers);
    return {
        routes,
        containers
    }
}
