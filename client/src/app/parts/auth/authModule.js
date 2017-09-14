import React, { createElement as h } from "react";
import { parse } from "qs";
import { observable, action } from "mobx";
import validate from "validate.js";
import logoutView from "./views/logoutView";
import registrationCompleteView from "./views/registrationCompleteView";
import resetPasswordView from "./views/resetPasswordView";
import rules from "services/rules";
import AsyncOp from "utils/asyncOp";
import asyncView from "components/AsyncView";

export default function(context) {
  const { rest } = context;
  const asyncOpCreate = AsyncOp(context);
  const AsyncView = asyncView(context);

  function redirect() {
    const nextPath = parse(window.location.search.slice(1)).nextPath || "/profile";
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
          const constraints = {
            username: rules.username,
            password: rules.password
          };
          const vErrors = validate(payload, constraints);
          if (vErrors) {
            this.errors = vErrors;
            return;
          }

          try {
            const response = await this.op.fetch(payload);
            const { token } = response;
            authStore.setToken(token);
            redirect();
          } catch (errors) {
            console.error("login ", errors);
            localStorage.removeItem("JWT");
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
          const constraints = {
            username: rules.username,
            email: rules.email,
            password: rules.password
          };
          const vErrors = validate(payload, constraints);
          if (vErrors) {
            this.errors = vErrors;
            return;
          }
          await this.op.fetch(payload);
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
          const constraints = {
            password: rules.password
          };
          const vErrors = validate(payload, constraints);
          if (vErrors) {
            this.errors = vErrors;
            return;
          }
          try {
            await this.op.fetch(payload);
            this.step = "SetNewPasswordDone";
          } catch (errors) {
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
          const constraints = {
            email: rules.email
          };
          const vErrors = validate(payload, constraints);
          if (vErrors) {
            this.errors = vErrors;
            return;
          }
          try {
            await this.op.fetch(payload);
            this.step = "CheckEmail";
          } catch (errors) {
            console.error(errors);
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
          component: (
            <AsyncView
              store={stores.login}
              getModule={() => import("./views/loginView")}
            />
          )
        })
      },
      {
        path: "/register",
        component: () => ({
          title: "Register",
          component: (
            <AsyncView
              store={stores.register}
              getModule={() => import("./views/registerView")}
            />
          )
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
          component: (
            <AsyncView
              store={stores.forgotPassword}
              getModule={() => import("./views/forgotView")}
            />
          )
        })
      },
      {
        path: "/resetPassword/:token",
        component: ({ params } = {}) => ({
          title: "Reset password",
          component: h(resetPasswordView(context), { store: stores.resetPassword, params })
        })
      },
      {
        path: "/verifyEmail/:code",
        component: () => ({
          title: "Verify Email",
          component: h(registrationCompleteView(context), { store: stores.verifyEmailCode }),
        }),
        action: ({ params }) =>
          stores.verifyEmailCode.execute({ code: params.code })
      }
    ];
  }

  const stores = Stores();

  return {
    stores: () => stores,
    routes: () => Routes(stores)
  };
}
