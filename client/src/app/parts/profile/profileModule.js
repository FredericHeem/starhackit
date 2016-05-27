import React from 'react';
import {Route} from 'react-router';
import {bindActionCreators} from 'redux';
import {createActionAsync, createReducerAsync} from 'redux-act-async';
import {connect} from 'react-redux';
import ProfileView from './views/profileView';

function Resources(rest){
  return {
    get() {
        return rest.get('me');
    },
    update(payload) {
        return rest.patch('me', payload);
    }
  }
};

function Actions(rest){
    let profile = Resources(rest);
    return {
        get: createActionAsync('PROFILE_GET', profile.get),
        update: createActionAsync('PROFILE_UPDATE', profile.update)
    }
}

function Reducers(actions){
  return {
    profile: createReducerAsync(actions.get),
    profileUpdate: createReducerAsync(actions.update),
  }
}
function Containers(actions){
    const mapDispatchToProps = (dispatch) => ({actions: bindActionCreators(actions, dispatch)});
    return {
        profile(){
            const mapStateToProps = (state) => ({
                profile: state.profile,
                profileUpdate: state.profileUpdate
            })
            return connect(mapStateToProps, mapDispatchToProps)(ProfileView);
        }

    }
}

function Routes(containers){
    return (
        <Route component={containers.profile()} path="profile"/>
    )
}

export default function(rest) {
    let actions = Actions(rest);
    let containers = Containers(actions)
    let routes = Routes(containers);
    return {
        actions,
        reducers: Reducers(actions),
        containers,
        routes
    }
}
