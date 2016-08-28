import {bindActionCreators} from 'redux';
import {createActionAsync, createReducerAsync} from 'redux-act-async';
import {connect} from 'react-redux';
import ProfileView from './views/profileView';
import mobx from 'mobx';
import Alert from 'react-s-alert';
import Checkit from 'checkit';

import rules from 'services/rules';

import Debug from 'debug';
let debug = new Debug("profile");

function Resources(rest) {
  return {
    get() {
      return rest.get('me');
    },
    update(payload) {
      return rest.patch('me', payload);
    }
  }
}

function Actions(rest) {
  let profile = Resources(rest);
  return {
    get: createActionAsync('PROFILE_GET', profile.get),
    update: createActionAsync('PROFILE_UPDATE', profile.update, { rethrow: true })
  }
}

function Middleware(store, actions) {

  function merge(profile, response) {
    profile.username = response.username
    profile.email = response.email
    profile.profile = response.profile
  }

  return () => next => action => {
    const {payload} = action;
    switch (action.type) {
      case actions.get.ok.getType():
      case actions.update.ok.getType():
        debug("response ", payload.response);
        merge(store.profile, payload.response);
        break;
      default:
    }

    return next(action)
  }
}

function Reducers(actions) {
  return {
    profileGet: createReducerAsync(actions.get),
    profileUpdate: createReducerAsync(actions.update)
  }
}

function Stores({tr}, actions) {

  const profileStore = mobx.observable({
    language: 'US',
    errors: {},
    username: "",
    email: "",
    profile: {
      biography: ""
    },
    update: mobx.action(function(actions) {
      debug('updateProfile ');
      this.errors = {};
      const payload = {
        biography: this.profile.biography
      }

      function successNotification() {
        debug('updateProfile done');
        Alert.info(tr.t('Profile updated'), {
          position: 'top-right',
          effect: 'slide',
          timeout: 3e3,
          offset: 100
        });
        return true;
      }

      new Checkit({
        biography: rules.biography
      }).run(payload)
        .then(actions.update)
        .then(successNotification)
        .catch(errors => {
          debug('updateProfile errors: ', errors);
          if (errors instanceof Checkit.Error) {
            this.errors = errors.toJSON()
          }
        })
    })
  })

  return {
    profile: profileStore
  }
}

function Containers(context, actions, stores) {
  const mapDispatchToProps = (dispatch) => ({ actions: bindActionCreators(actions, dispatch) });
  return {
    profile() {
      const mapStateToProps = (state) => ({
        ...state.profile,
        store: stores.profile
       })
      return connect(mapStateToProps, mapDispatchToProps)(ProfileView(context));
    }
  }
}

function Routes(containers, store, actions) {
  return {
    path: 'profile',
    component: containers.profile(),
    onEnter: () => store.dispatch(actions.get())
  }
}

export default function (context, rest) {
  const actions = Actions(rest);
  const stores = Stores(context);
  const containers = Containers(context, actions, stores)

  return {
    actions,
    stores,
    middlewares: [Middleware(stores, actions)],
    reducers: Reducers(actions),
    containers,
    routes: (store) => Routes(containers, store, actions)
  }
}
