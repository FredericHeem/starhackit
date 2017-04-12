import {createActionAsync, createReducerAsync} from 'redux-act-async';
import {connect} from 'react-redux';
import mobx from 'mobx';
import {browserHistory} from 'react-router';
import dashboardScreen from './dashboardScreen';

export default function(context) {
  const {rest} = context;
  const Resources = (rest) => ({
       getCurrentUser: () => rest.get(`crossBank/getCurrentUser`),
       getAccounts: () => rest.get(`crossBank/accounts`),
       authCallback: (query) => rest.get(`crossBank/authCallback`, query)
  })

  const resources = Resources(rest);

  const Actions = (resources) => ({
          getCurrentUser: createActionAsync('GET_CURRENT_USER', resources.getCurrentUser),
          getAccounts: createActionAsync('GET_ACCOUNT', resources.getAccounts),
          authCallback: createActionAsync('AUTH_CALLBACK', resources.authCallback)
  })

  const Reducers = (actions) => ({
      getCurrentUser: createReducerAsync(actions.getCurrentUser),
      getAccounts: createReducerAsync(actions.getAccounts)
  })

  const Containers = (context, stores) => ({
        dashboard: () => {
            const mapStateToProps = () => ({
              ...stores
            })
            return connect(mapStateToProps)(dashboardScreen(context));
        }
  })

  function Stores(dispatch, actions) {
    return {
      user: mobx.observable({
        data: {},
        get: mobx.action(async function () {
          try {
            const {response} = await dispatch(actions.getCurrentUser());
            //console.log("user get response", response)
            this.data = response;
          } catch (error) {
            console.error("cannot get user ", error);
          }
        }),
        authCallback: mobx.action(async function (query) {
          try {
            await dispatch(actions.authCallback(query));
            browserHistory.replace(`/crossbank/dashboard`);
          } catch (error) {
            console.error("cannot get authCallback ", error);
            browserHistory.push(`/login`);
          }
        }),
      }),
      accounts: mobx.observable({
        data: [],
        get: mobx.action(async function () {
          try {
            const {response} = await dispatch(actions.getAccounts());
            console.log("accounts get response", response)
            this.data = response;
          } catch (error) {
            console.error("cannot get accounts ", error);
          }
        })
      })
    }
  }

  const Routes = (containers, stores) => ({
      path: 'crossbank',
      childRoutes : [
          {
              path: 'dashboard',
              component: containers.dashboard(),
              onEnter: () => {
                stores.user.get();
                stores.accounts.get();
              }
          },
          {
              path: 'authCallback',
              component: containers.dashboard(), //TODO Loading
              onEnter: (nextState) => stores.user.authCallback(nextState.location.query)
          }
      ]
  })

  let stores; //Mobx stores
  const actions = Actions(resources);
  const containers = () => Containers(context, stores);

  return {
      actions,
      reducers: Reducers(actions),
      containers,
      stores: () => stores,
      createStores: (dispatch) => {stores = Stores(dispatch, actions)},
      routes: () => Routes(containers(), stores, actions),
  }
}
