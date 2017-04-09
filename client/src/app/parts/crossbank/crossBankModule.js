import {createActionAsync, createReducerAsync} from 'redux-act-async';
import {connect} from 'react-redux';
import mobx from 'mobx';
import dashboardScreen from './dashboardScreen';

export default function({context, rest}) {

  function Resources(rest){
    return {
      getCurrentUser() {
          return rest.get(`crossBank/getCurrentUser`);
      }
    }
  }

  const resources = Resources(rest);

  function Actions(resources){
      return {
          getCurrentUser: createActionAsync('GET_CURRENT_USER', resources.getCurrentUser)
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
          console.log("user get")
          try {
            const {response} = await dispatch(actions.getCurrentUser());
            console.log("user get response", response)
            this.data = response;
          } catch (error) {
            console.error("cannot get user ", error);
          }
        }),
      }),
    }
  }
  function Routes(containers, stores){
      return {
        path: 'crossbank',
        component: containers.dashboard(),
        onEnter: () => stores.user.get(),
        childRoutes : [
            {
                //path: '/dashboard',
                //component: containers.dashboard(),
                //onEnter: () => users.store.selectPage(1)
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
