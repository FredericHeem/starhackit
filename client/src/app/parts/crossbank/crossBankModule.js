import {createActionAsync, createReducerAsync} from 'redux-act-async';
import {connect} from 'react-redux';
import mobx from 'mobx';
import {browserHistory} from 'react-router';
import dashboardScreen from './dashboardScreen';

export default function({context, rest}) {

  function Resources(rest){
    return {
      getCurrentUser() {
          return rest.get(`crossBank/getCurrentUser`);
      },
      authCallback(query) {
          return rest.get(`crossBank/authCallback`, query);
      }
    }
  }

  const resources = Resources(rest);

  function Actions(resources){
      return {
          getCurrentUser: createActionAsync('GET_CURRENT_USER', resources.getCurrentUser),
          authCallback: createActionAsync('AUTH_CALLBACK', resources.authCallback)
      }
  }

  function Reducers(actions){
    return {
      getCurrentUser: createReducerAsync(actions.getCurrentUser)
    }
  }

  function Containers(context, stores){
      return {
        dashboard(){
            const mapStateToProps = () => ({
              user: stores.user
            })
            return connect(mapStateToProps)(dashboardScreen(context));
        }
      }
  }

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
    }
  }
  function Routes(containers, stores){
      return {
        path: 'crossbank',
        childRoutes : [
            {
                path: 'dashboard',
                component: containers.dashboard(),
                onEnter: () => stores.user.get(),
            },
            {
                path: 'authCallback',
                component: containers.dashboard(),
                onEnter: (nextState) => stores.user.authCallback(nextState.location.query)
            }
        ]
      }
  }

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
