import trim from 'lodash/trim';
import pick from 'lodash/pick';
import {createActionAsync, createReducerAsync} from 'redux-act-async';
import {createAction, createReducer} from 'redux-act';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';
import {parse} from 'query-string'
import {race, take}  from 'redux-saga/effects'
import mobx from 'mobx';
import Checkit from 'checkit';
import loginView from './views/loginView';
import logoutView from './views/logoutView';
import forgotView from './views/forgotView';
import registerView from './views/registerView';
import registrationCompleteView from './views/registrationCompleteView';
import resetPasswordView from './views/resetPasswordView';
import appView from './views/applicationView';
import rules from 'services/rules';

function Resources(rest){
  return {
    me() {
        return rest.get('me');
    },
    register(payload) {
        return rest.post('auth/register', payload);
    },
    login(payload) {
        return rest.post('auth/login', payload);
    },
    logout() {
        return rest.post('auth/logout');
    },
    verifyEmailCode(payload) {
        return rest.post('auth/verify_email_code/', payload);
    },
    requestPasswordReset(payload) {
        return rest.post('auth/reset_password', payload);
    },
    verifyResetPasswordToken(payload) {
        return rest.post('auth/verify_reset_password_token', payload);
    }
  }
}

function Actions(resources){
    return {
        setToken: createAction('TOKEN_SET'),
        me: createActionAsync('ME', resources.me),
        login: createActionAsync('LOGIN', resources.login),
        logout: createActionAsync('LOGOUT', resources.logout),
        requestPasswordReset: createActionAsync('REQUEST_PASSWORD_RESET', resources.requestPasswordReset),
        register: createActionAsync('REGISTER', resources.register),
        verifyEmailCode: createActionAsync('VERIFY_EMAIL_CODE', resources.verifyEmailCode),
        verifyResetPasswordToken: createActionAsync('VERIFY_RESET_PASSWORD_TOKEN', resources.verifyResetPasswordToken)
    }
}

const defaultState = {
  authenticated: false
};

function AuthReducer(actions){
  return createReducer({
      [actions.setToken]: (state, payload) => ({
          ...state,
          token: payload
      }),
      [actions.me.ok]: (state) => ({
          ...state,
          authenticated: true
      }),
      [actions.login.ok]: (state, payload) => ({
          ...state,
          authenticated: true,
          token: payload.response.token
      }),
      [actions.login.error]: () => (defaultState),
      [actions.me.error]: () => (defaultState),
      [actions.logout.ok]: () => (defaultState),
      [actions.logout.error]: () => (defaultState)
  }, defaultState);
}

function Reducers(actions){
  return {
    auth: AuthReducer(actions),
    me: createReducerAsync(actions.me),
    login: createReducerAsync(actions.login),
    logout: createReducerAsync(actions.logout),
    register: createReducerAsync(actions.register),
    verifyEmailCode: createReducerAsync(actions.verifyEmailCode),
    requestPasswordReset: createReducerAsync(actions.requestPasswordReset),
    verifyResetPasswordToken: createReducerAsync(actions.verifyResetPasswordToken)
  }
}
let selectState = state => state.auth;
let isAuthenticated = state => selectState(state).auth.authenticated;

function Containers(context, actions, stores){
    return {
        login(){
            const mapStateToProps = (state) => ({
                authenticated: isAuthenticated(state),
                login: selectState(state).login,
                store: stores.login
            })
            return connect(mapStateToProps)(loginView(context));
        },
        register(){
            const mapStateToProps = (state) => ({
              register: selectState(state).register,
              store: stores.register
            })
            return connect(mapStateToProps)(registerView(context));
        },
        logout(){
            const mapStateToProps = (state) => ({
                authenticated: isAuthenticated(state)
            })
            return connect(mapStateToProps)(logoutView(context));
        },
        forgot(){
            const mapStateToProps = (state) => ({
              requestPasswordReset: selectState(state).requestPasswordReset,
              store: stores.forgotPassword
            });
            return connect(mapStateToProps)(forgotView(context));
        },
        resetPassword(){
            const mapStateToProps = (state) => ({
              verifyResetPasswordToken: selectState(state).verifyResetPasswordToken,
              store: stores.resetPassword
            })
            return connect(mapStateToProps)(resetPasswordView(context));
        },
        registrationComplete(){
            const mapStateToProps = (state) => ({verifyEmailCode: selectState(state).verifyEmailCode})
            return connect(mapStateToProps)(registrationCompleteView(context));
        },
        app(){
            const mapStateToProps = (state) => ({
                authenticated: isAuthenticated(state)
            })
            return connect(mapStateToProps)(appView(context));
        }
    }
}

function* runSagaActionAsync(actionAsync) {
  //console.log('runSagaActionAsync wait for ', actionAsync.request.getType());
  yield take(actionAsync.request.getType());
  //console.log('runSagaActionAsync rx ', actionAsync.request.getType());
  return yield race({
    ok: take(actionAsync.ok.getType()),
    error: take(actionAsync.error.getType())
  })
}

function redirect() {
  const nextPath = parse(window.location.search).nextPath || '/app/profile';
  browserHistory.push(nextPath);
}

/* eslint no-constant-condition: 0 */
function Sagas(actions) {
  return {
    me: function* saga() {
      while (true) {
        const {ok} = yield runSagaActionAsync(actions.me)
        if(ok){
          const pathname = window.location.pathname;
          if(pathname === "/login"){
            redirect()
          }
        } else {
          localStorage.removeItem("JWT");
        }
      }
    },
    login: function* saga() {
      while (true) {
        const {ok} = yield runSagaActionAsync(actions.login)
        if(ok){
          const {token} = ok.payload.response;
          localStorage.setItem("JWT", token);
          redirect()
        } else {
          localStorage.removeItem("JWT");
        }
      }
    },
    logout: function* saga() {
      while (true) {
        yield runSagaActionAsync(actions.logout)
        localStorage.removeItem("JWT");
      }
    },
    verifyEmailCode: function* saga() {
      while (true) {
        const {ok} = yield runSagaActionAsync(actions.verifyEmailCode)
        if(ok){
          browserHistory.push(`/login`);
        }
      }
    }
  }
}

function Routes(containers, store, actions){
    return {
      childRoutes : [
          {
              path: 'login',
              component: containers.login()
          }, {
              path: 'register',
              component: containers.register()
          }, {
              path: 'logout',
              component: containers.logout(),
              onEnter: () => store.dispatch(actions.logout())
          },{
              path: 'forgot',
              component: containers.forgot()
          },{
              path: 'resetPassword/:token',
              component: containers.resetPassword()
          },{
              path: 'verifyEmail/:code',
              component: containers.registrationComplete(),
              onEnter: nextState => {
                store.dispatch(actions.verifyEmailCode({code: nextState.params.code}))
              }
          }
      ]
    }
}

export default function({context, rest}) {
    const resources = Resources(rest);
    let actions = Actions(resources);
    let stores;

    function Stores(dispatch) {
      return {
        login: mobx.observable({
          username: "",
          password: "",
          errors: {},
          login: mobx.action(async function () {
            this.errors = {};
            let payload = {
              username: trim(this.username),
              password: this.password
            }

            try {
              const rule = new Checkit(pick(rules, 'username', 'password'));
              await rule.run(payload);
              await dispatch(actions.login(payload));
            } catch(errors){
              if (errors instanceof Checkit.Error) {
                this.errors = errors.toJSON()
              }
            }
          }),
        }),
        register: mobx.observable({
          username: "",
          email: "",
          password: "",
          errors: {},
          register: mobx.action(async function () {
            this.errors = {};
            let payload = {
              username: trim(this.username),
              email: trim(this.email),
              password: this.password
            }
            try {
              const rule = new Checkit(pick(rules, 'username', 'email', 'password'));
              await rule.run(payload);
              await dispatch(actions.register(payload));
            } catch(errors){
              if (errors instanceof Checkit.Error) {
                this.errors = errors.toJSON()
              }
            }
          }),
        }),
        resetPassword: mobx.observable({
          step: "SetPassword",
          password: "",
          errors: {},
          resetPassword: mobx.action(async function (token) {
            this.errors = {};
            let payload = {
              password: trim(this.password),
              token: token
            }

            try {
              const rule = new Checkit(pick(rules, 'password'));
              await rule.run(payload);
              await dispatch(actions.verifyResetPasswordToken(payload));
              this.step = "SetNewPasswordDone";
            } catch(errors){
              if (errors instanceof Checkit.Error) {
                this.errors = errors.toJSON()
              }
            }
          })
        }),
        forgotPassword: mobx.observable({
          step: "SendPasswordResetEmail",
          email: "",
          errors: {},
          requestPasswordReset: mobx.action(async function () {
            this.errors = {};
            let payload = {
              email: trim(this.email)
            }

            try {
              const rule = new Checkit(pick(rules, 'email'));
              await rule.run(payload);
              await dispatch(actions.requestPasswordReset(payload));
              this.step = "CheckEmail";
            } catch(errors){
              if (errors instanceof Checkit.Error) {
                console.log(errors.toJSON())
                this.errors = errors.toJSON()
              }
            }
          }),
        }),
      }
    }

    const containers = () => Containers(context, actions, stores)

    return {
        actions,
        createStores: (dispatch) => stores = Stores(dispatch, context),
        reducers: Reducers(actions),
        containers,
        routes: (store) => Routes(containers(), store, actions),
        sagas: Sagas(actions)
    }
}
