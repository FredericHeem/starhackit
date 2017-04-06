import {createActionAsync, createReducerAsync} from 'redux-act-async';
import {connect} from 'react-redux';
import mobx from 'mobx';
import Alert from 'react-s-alert';
import Checkit from 'checkit';
import rules from 'services/rules';
import Debug from 'debug';

import ProfileView from './views/profileView';

const debug = new Debug("profile");

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
  const profile = Resources(rest);
  return {
    get: createActionAsync('PROFILE_GET', profile.get),
    update: createActionAsync('PROFILE_UPDATE', profile.update)
  }
}

function Reducers(actions) {
  return {
    profileGet: createReducerAsync(actions.get),
    profileUpdate: createReducerAsync(actions.update)
  }
}

function Containers(context, actions, stores) {
  return {
    profile() {
      const mapStateToProps = (state) => ({
        ...state.profile,
        store: stores.profile
       })
      return connect(mapStateToProps)(ProfileView(context));
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

export default function ({context, rest}) {
  const actions = Actions(rest);
  let stores;

  function Stores(dispatch, {tr}) {
    const profileStore = mobx.observable({
      language: 'US',
      errors: {},
      username: "",
      email: "",
      profile: {
        biography: ""
      },
      update: mobx.action(async function() {
        debug('updateProfile ');
        this.errors = {};
        const payload = {
          biography: this.profile.biography || ""
        }
        debug('updateProfile ', payload);

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
        try {
          const rule = new Checkit({
            biography: rules.biography
           });
          await rule.run(payload);
          await dispatch(actions.update(payload));
          successNotification();
        } catch (errors) {
          if (errors instanceof Checkit.Error) {
            this.errors = errors.toJSON()
          }
        }
      })
    })

    return {
      profile: profileStore
    }
  }

  function Middleware(actions) {
    function merge(profile, response) {
      profile.username = response.username
      profile.email = response.email
      profile.profile = response.profile || {biography: ""}
    }

    return () => next => action => {
      const {payload} = action;
      switch (action.type) {
        case actions.get.ok.getType():
        case actions.update.ok.getType():
          merge(stores.profile, payload.response);
          break;
        default:
      }
      return next(action)
    }
  }

  const containers = () => Containers(context, actions, stores)

  return {
    actions,
    createStores: (dispatch) => {stores = Stores(dispatch, context)},
    middlewares: [Middleware(actions)],
    reducers: Reducers(actions),
    containers,
    routes: (store) => Routes(containers(), store, actions)
  }
}
