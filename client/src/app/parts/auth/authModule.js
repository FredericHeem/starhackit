import _ from "lodash";
import { createElement as h } from 'react';
import { browserHistory } from "react-router";
import { parse } from "query-string";
import mobx from "mobx";
import Checkit from "checkit";
import loginView from "./views/loginView";
import logoutView from "./views/logoutView";
import forgotView from "./views/forgotView";
import registerView from "./views/registerView";
import registrationCompleteView from "./views/registrationCompleteView";
import resetPasswordView from "./views/resetPasswordView";
import appView from "./views/applicationView";
import rules from "services/rules";
import AsyncOp from 'utils/asyncOp';

function Resources(rest) {
  return {
    me() {
      return rest.get("me");
    },
    register(payload) {
      return rest.post("auth/register", payload);
    },
    login(payload) {
      return rest.post("auth/login", payload);
    },
    logout() {
      return rest.post("auth/logout");
    },
    verifyEmailCode(payload) {
      return rest.post("auth/verify_email_code/", payload);
    },
    requestPasswordReset(payload) {
      return rest.post("auth/reset_password", payload);
    },
    verifyResetPasswordToken(payload) {
      return rest.post("auth/verify_reset_password_token", payload);
    }
  };
}

function Containers(context, stores) {
  return {
    app() {
      return ({ children }) => h(appView(context), {
        authStore: stores.auth,
        themeStore: context.parts.theme.stores().sideBar,
        children
      })
    }
  };
}

function redirect() {
  const nextPath = parse(window.location.search).nextPath || "/app/profile";
  browserHistory.push(nextPath);
}

export default function (context) {
  const { rest } = context;
  const asyncOpCreate = AsyncOp(context);
  const resources = Resources(rest);

  function Stores() {
    const authStore = mobx.observable({
      authenticated: false,
      token: "",
      setAuthenticated() {
        authStore.authenticated = true;
      },
      setToken(token) {
        authStore.authenticated = true;
        authStore.token = token;
        localStorage.setItem("JWT", token);
      },
      getToken() {
        return authStore.token;
      },
      reset() {
        authStore.authenticated = false;
        authStore.token = ""
      }
    });

    return {
      auth: authStore,
      me: mobx.observable({
        fetch: async () => {
          try {
            await resources.me();
            authStore.setAuthenticated()
            const pathname = window.location.pathname;
            if (pathname === "/login") {
              // From social login
              redirect();
            }
          } catch (errors) {
            localStorage.removeItem("JWT");
          }
        },
      }),
      login: mobx.observable({
        username: "",
        password: "",
        errors: {},
        op: asyncOpCreate(resources.login),
        login: mobx.action(async function () {
          this.errors = {};
          const payload = {
            username: this.username.trim(),
            password: this.password
          };

          try {
            const rule = new Checkit(_.pick(rules, ["username", "password"]));
            await rule.run(payload);
            const response = await this.op.fetch(payload);
            console.log("response ", response)
            const { token } = response;
            authStore.setToken(token);
            redirect();
          } catch (errors) {
            if (errors instanceof Checkit.Error) {
              this.errors = errors.toJSON();
            } else {
              console.error("login ", errors)
              localStorage.removeItem("JWT");
            }
          }
        })
      }),
      register: mobx.observable({
        username: "",
        email: "",
        password: "",
        errors: {},
        op: asyncOpCreate(resources.register),
        register: mobx.action(async function () {
          this.errors = {};
          const payload = {
            username: this.username.trim(),
            email: this.email.trim(),
            password: this.password
          };
          try {
            const rule = new Checkit(
              _.pick(rules, ["username", "email", "password"])
            );
            await rule.run(payload);
            await this.op.fetch(payload);
          } catch (errors) {
            if (errors instanceof Checkit.Error) {
              this.errors = errors.toJSON();
            }
          }
        })
      }),
      logout: mobx.observable({
        op: asyncOpCreate(resources.logout),
        execute: mobx.action(async function () {
          localStorage.removeItem("JWT");
          await this.op.fetch();
          authStore.authenticated = false;
        })
      }),
      verifyEmailCode: mobx.observable({
        op: asyncOpCreate(resources.verifyEmailCode),
        execute: mobx.action(async function (param) {
          try {
            await this.op.fetch(param);
            browserHistory.push(`/login`);
          } catch (errors) {
            //
          }
        })
      }),
      resetPassword: mobx.observable({
        step: "SetPassword",
        password: "",
        errors: {},
        op: asyncOpCreate(resources.verifyResetPasswordToken),
        resetPassword: mobx.action(async function (token) {
          this.errors = {};
          const payload = {
            password: this.password,
            token
          };

          try {
            const rule = new Checkit(_.pick(rules, ["password"]));
            await rule.run(payload);

            await this.op.fetch(payload);
            this.step = "SetNewPasswordDone";
          } catch (errors) {
            if (errors instanceof Checkit.Error) {
              this.errors = errors.toJSON();
            }
            console.error("resetPassword ", errors)
          }
        })
      }),
      forgotPassword: mobx.observable({
        step: "SendPasswordResetEmail",
        email: "",
        errors: {},
        op: asyncOpCreate(resources.requestPasswordReset),
        requestPasswordReset: mobx.action(async function () {
          this.errors = {};
          const payload = {
            email: this.email.trim()
          };

          try {
            const rule = new Checkit(_.pick(rules, ["email"]));
            await rule.run(payload);
            await this.op.fetch(payload);
            this.step = "CheckEmail";
          } catch (errors) {
            console.error(errors)
            if (errors instanceof Checkit.Error) {
              console.log(errors.toJSON());
              this.errors = errors.toJSON();
            }
          }
        })
      })
    };
  }

  function Routes(containers, stores) {
    return {
      childRoutes: [
        {
          path: "login",
          component: () => h(loginView(context), { store: stores.login })
        },
        {
          path: "register",
          component: () => h(registerView(context), { store: stores.register }),
        },
        {
          path: "logout",
          component: () => h(logoutView(context), { authStore: stores.auth }),
          onEnter: () => stores.logout.execute()
        },
        {
          path: "forgot",
          component: () => h(forgotView(context), { store: stores.forgotPassword }),
        },
        {
          path: "resetPassword/:token",
          component: ({ params } = {}) => h(resetPasswordView(context), { store: stores.resetPassword, params }),
        },
        {
          path: "verifyEmail/:code",
          component: () => h(registrationCompleteView(context), { store: stores.verifyEmailCode }),
          onEnter: nextState => {
            stores.verifyEmailCode.execute({ code: nextState.params.code });
          }
        }
      ]
    };
  }
  const stores = Stores();
  const containers = () => Containers(context, stores);

  return {
    stores: () => stores,
    containers,
    routes: () => Routes(containers(), stores)
  };
}
