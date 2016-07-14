import {bindActionCreators} from 'redux';
import {createActionAsync, createReducerAsync} from 'redux-act-async';
import {connect} from 'react-redux';
import ProfileView from './views/profileView';
import {createReducer} from 'redux-act';

function Resources(rest){
  return {
    get() {
        return rest.get('me');
    },
    update(payload) {
        return rest.patch('me', payload);
    }
  }
}

function Actions(rest){
    let profile = Resources(rest);
    return {
        get: createActionAsync('PROFILE_GET', profile.get),
        update: createActionAsync('PROFILE_UPDATE', profile.update, {rethrow: true})
    }
}

function ProfileReducer(actions){
  return createReducer({
      [actions.get.ok]: (state, payload) => ({
        data: payload
      }),
      [actions.update.ok]: (state, payload) => ({
        data: payload
      })
  }, {});
}

function Reducers(actions){
  return {
    profile: ProfileReducer(actions),
    profileGet: createReducerAsync(actions.get),
    profileUpdate: createReducerAsync(actions.update)
  }
}

let selectProfile = state => state.profile;

function Containers(actions){
    const mapDispatchToProps = (dispatch) => ({actions: bindActionCreators(actions, dispatch)});
    return {
        profile(){
            const mapStateToProps = (state) => selectProfile(state)
            return connect(mapStateToProps, mapDispatchToProps)(ProfileView);
        }
    }
}

function Routes(containers, store, actions){
    return {
      path:'profile',
      component: containers.profile(),
      onEnter: () => store.dispatch(actions.get())
    }
}

export default function(rest) {
    let actions = Actions(rest);
    let containers = Containers(actions)

    return {
        actions,
        reducers: Reducers(actions),
        containers,
        routes: (store) => Routes(containers, store, actions)
    }
}
