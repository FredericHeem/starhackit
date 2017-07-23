import { createElement as h } from "react";
import { parse } from "query-string";
import { observable, action } from "mobx";
import Checkit from "checkit";
import loginView from "./views/loginView";
import logoutView from "./views/logoutView";
import forgotView from "./views/forgotView";
import registerView from "./views/registerView";
import registrationCompleteView from "./views/registrationCompleteView";
import resetPasswordView from "./views/resetPasswordView";
import appView from "./views/applicationView";
import rules from "services/rules";
import AsyncOp from "utils/asyncOp";

function Containers(context, stores) {
  return {
    app() {
      return ({ children }) =>
        h(appView(context), {
          authStore: stores.auth,
          themeStore: context.parts.theme.stores().sideBar,
          children
        });
    }
  };
}

export default function(context) {
  const { rest } = context;
  const asyncOpCreate = AsyncOp(context);

  function redirect() {
    const nextPath = parse(window.location.search).nextPath || "/app/profile";
    context.history.push(nextPath);
  }
  function Stores() {
    const authStore = observable({
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
        authStore.token = "";
      }
    });

    return {
      auth: authStore,
      me: observable({
        fetch: async () => {
          try {
            await rest.get("me");
            authStore.setAuthenticated();
            const pathname = window.location.pathname;
            if (pathname === "/login") {
              // From social login
              redirect();
            }
          } catch (errors) {
            localStorage.removeItem("JWT");
          }
        }
      }),
      login: observable({
        username: "",
        password: "",
        errors: {},
        op: asyncOpCreate(payload => rest.post("auth/login", payload)),
        login: action(async function() {
          this.errors = {};
          const payload = {
            username: this.username.trim(),
            password: this.password
          };

          try {
            const rule = new Checkit({
              username: rules.username,
              password: rules.password
            });
            await rule.run(payload);
            const response = await this.op.fetch(payload);
            const { token } = response;
            authStore.setToken(token);
            redirect();
          } catch (errors) {
            if (errors instanceof Checkit.Error) {
              this.errors = errors.toJSON();
            } else {
              console.error("login ", errors);
              localStorage.removeItem("JWT");
            }
          }
        })
      }),
      register: observable({
        username: "",
        email: "",
        password: "",
        errors: {},
        op: asyncOpCreate(payload => rest.post("auth/register", payload)),
        register: action(async function() {
          this.errors = {};
          const payload = {
            username: this.username.trim(),
            email: this.email.trim(),
            password: this.password
          };
          try {
            const rule = new Checkit({
              username: rules.username,
              email: rules.email,
              password: rules.password
            });
            await rule.run(payload);
            await this.op.fetch(payload);
          } catch (errors) {
            if (errors instanceof Checkit.Error) {
              this.errors = errors.toJSON();
            }
          }
        })
      }),
      logout: observable({
        op: asyncOpCreate(() => rest.post("auth/logout")),
        execute: action(async function() {
          localStorage.removeItem("JWT");
          await this.op.fetch();
          authStore.authenticated = false;
        })
      }),
      verifyEmailCode: observable({
        op: asyncOpCreate(payload =>
          rest.post("auth/verify_email_code", payload)
        ),
        execute: action(async function(param) {
          try {
            await this.op.fetch(param);
            context.history.push(`/login`);
          } catch (errors) {
            //
          }
        })
      }),
      resetPassword: observable({
        step: "SetPassword",
        password: "",
        errors: {},
        op: asyncOpCreate(payload =>
          rest.post("auth/verify_reset_password_token", payload)
        ),
        resetPassword: action(async function(token) {
          this.errors = {};
          const payload = {
            password: this.password,
            token
          };

          try {
            const rule = new Checkit({ password: rules.password });
            await rule.run(payload);

            await this.op.fetch(payload);
            this.step = "SetNewPasswordDone";
          } catch (errors) {
            if (errors instanceof Checkit.Error) {
              this.errors = errors.toJSON();
            }
            console.error("resetPassword ", errors);
          }
        })
      }),
      forgotPassword: observable({
        step: "SendPasswordResetEmail",
        email: "",
        errors: {},
        op: asyncOpCreate(payload => rest.post("auth/reset_password", payload)),
        requestPasswordReset: action(async function() {
          this.errors = {};
          const payload = {
            email: this.email.trim()
          };

          try {
            const rule = new Checkit({ email: rules.email });
            await rule.run(payload);
            await this.op.fetch(payload);
            this.step = "CheckEmail";
          } catch (errors) {
            console.error(errors);
            if (errors instanceof Checkit.Error) {
              console.log(errors.toJSON());
              this.errors = errors.toJSON();
            }
          }
        })
      })
    };
  }

  function Routes(stores) {
    return [
      {
        path: "/login",
        component: () => ({
          title: "Login",
          component: h(loginView(context), { store: stores.login })
        })
      },
      {
        path: "/register",
        component: () => ({
          title: "Register",
          component: h(registerView(context), { store: stores.register })
        })
      },
      {
        path: "/logout",
        component: () => ({
          title: "Logout",
          component: h(logoutView(context), { store: stores.auth })
        }),
        action: () => stores.logout.execute()
      },
      {
        path: "/forgot",
        component: () => ({
          title: "Forgot password",
          component: h(forgotView(context), { store: stores.forgotPassword })
        })
      },
      {
        path: "/resetPassword/:token",
        component: ({ params } = {}) => ({
          title: "Reset password",
          component: h(resetPasswordView(context), {
            store: stores.resetPassword,
            params
          })
        })
      },
      {
        path: "/verifyEmail/:code",
        component: () => ({
          title: "Verify Email",
          component: h(registrationCompleteView(context), {
            store: stores.verifyEmailCode
          })
        }),
        action: ({ params }) =>
          stores.verifyEmailCode.execute({ code: params.code })
      }
    ];
  }

  const stores = Stores();
  const containers = () => Containers(context, stores);

  return {
    stores: () => stores,
    containers,
    routes: () => Routes(stores)
  };
}
