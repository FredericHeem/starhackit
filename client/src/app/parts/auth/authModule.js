import trim from 'lodash/trim';
import pick from 'lodash/pick';
import {createActionAsync, createReducerAsync} from 'redux-act-async';
import {createAction, createReducer} from 'redux-act';
import {connect} from 'react-redux';
import {browserHistory} from 'react-router';
import {parse} from 'query-string'
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

function Resources(rest) {
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

function Actions(resources) {
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

function AuthReducer(actions) {
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

function Reducers(actions) {
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

function Containers(context, actions, stores) {
  return {
    login() {
      const mapStateToProps = (state) => ({
        authenticated: isAuthenticated(state),
        login: selectState(state).login,
        store: stores.login
      })
      return connect(mapStateToProps)(loginView(context));
    },
    register() {
      const mapStateToProps = (state) => ({
        register: selectState(state).register,
        store: stores.register
      })
      return connect(mapStateToProps)(registerView(context));
    },
    logout() {
      const mapStateToProps = (state) => ({
        authenticated: isAuthenticated(state)
      })
      return connect(mapStateToProps)(logoutView(context));
    },
    forgot() {
      const mapStateToProps = (state) => ({
        requestPasswordReset: selectState(state).requestPasswordReset,
        store: stores.forgotPassword
      });
      return connect(mapStateToProps)(forgotView(context));
    },
    resetPassword() {
      const mapStateToProps = (state) => ({
        verifyResetPasswordToken: selectState(state).verifyResetPasswordToken,
        store: stores.resetPassword
      })
      return connect(mapStateToProps)(resetPasswordView(context));
    },
    registrationComplete() {
      const mapStateToProps = (state) => ({ verifyEmailCode: selectState(state).verifyEmailCode })
      return connect(mapStateToProps)(registrationCompleteView(context));
    },
    app() {
      const mapStateToProps = (state) => ({
        authenticated: isAuthenticated(state)
      })
      return connect(mapStateToProps)(appView(context));
    }
  }
}

function redirect() {
  const nextPath = parse(window.location.search).nextPath || '/app/profile';
  browserHistory.push(nextPath);
}

function Routes(containers, stores) {
  return {
    childRoutes: [
      {
        path: 'login',
        component: containers.login()
      }, {
        path: 'register',
        component: containers.register()
      }, {
        path: 'logout',
        component: containers.logout(),
        onEnter: () => stores.logout.execute()
      }, {
        path: 'forgot',
        component: containers.forgot()
      }, {
        path: 'resetPassword/:token',
        component: containers.resetPassword()
      }, {
        path: 'verifyEmail/:code',
        component: containers.registrationComplete(),
        onEnter: nextState => {
          stores.verifyEmailCode.execute({ code: nextState.params.code })
        }
      }
    ]
  }
}

export default function ({context, rest}) {
  const resources = Resources(rest);
  let actions = Actions(resources);
  let stores;

  function Stores(dispatch) {
    return {
      me: mobx.observable({
        fetch: mobx.action(async function () {
          try {
            await dispatch(actions.me());
            const pathname = window.location.pathname;
            if (pathname === "/login") {
              // From social login
              redirect()
            }
          } catch (errors) {
            localStorage.removeItem("JWT");
          }
        }),
      }),
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
            const {response} = await dispatch(actions.login(payload));
            const {token} = response;
            localStorage.setItem("JWT", token);
            redirect()
          } catch (errors) {
            if (errors instanceof Checkit.Error) {
              this.errors = errors.toJSON()
            } else {
              localStorage.removeItem("JWT");
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
          } catch (errors) {
            if (errors instanceof Checkit.Error) {
              this.errors = errors.toJSON()
            }
          }
        }),
      }),
      logout: mobx.observable({
        execute: mobx.action(async function () {
            localStorage.removeItem("JWT");
            await dispatch(actions.logout());
        }),
      }),
      verifyEmailCode: mobx.observable({
        execute: mobx.action(async function (param) {
          try {
            await dispatch(actions.verifyEmailCode(param));
            browserHistory.push(`/login`);
          } catch (errors) {
            //
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
          } catch (errors) {
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
          } catch (errors) {
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
    stores: () => stores,
    createStores: (dispatch) => stores = Stores(dispatch, context),
    reducers: Reducers(actions),
    containers,
    routes: () => Routes(containers(), stores)
  }
}
