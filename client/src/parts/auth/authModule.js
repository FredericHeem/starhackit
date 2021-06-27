import React, { createElement as h } from "react";
import { observable, action } from "mobx";
import AsyncOp from "mdlean/lib/utils/asyncOp";
import asyncView from "components/AsyncView";
import logoutView from "./views/logoutView";
import registrationCompleteView from "./views/registrationCompleteView";
import { redirect } from "./authUtils";

export default function (context, partParam) {
  const { rest, history, config, emitter } = context;
  const layout = partParam.Layout(context);
  const asyncOpCreate = AsyncOp(context);
  const AsyncView = asyncView(context);
  const authStore = observable({
    authenticated: false,
    setAuthenticated() {
      authStore.authenticated = true;
    },
    setToken(token) {
      authStore.authenticated = true;
      localStorage.setItem("JWT", token);
    },
    reset() {
      authStore.authenticated = false;
      localStorage.removeItem("JWT");
    },
    redirectFromSocialLogin: async () => {
      try {
        await rest.get("me");
        authStore.setAuthenticated();
        redirect(history, config);
      } catch (errors) {
        authStore.reset();
      }
    },
  });

  emitter.on("login.ok", ({ token }) => {
    authStore.setToken(token);
    redirect(history, config);
  });

  function Stores() {
    return {
      auth: authStore,
      logout: observable({
        op: asyncOpCreate(() => rest.post("auth/logout")),
        execute: action(async function () {
          authStore.reset();
          await this.op.fetch();
        }),
      }),
      verifyEmailCode: observable({
        op: asyncOpCreate((payload) =>
          rest.post("auth/verify_email_code", payload)
        ),
        execute: action(async function (param) {
          try {
            await this.op.fetch(param);
            context.history.push(`login`);
          } catch (errors) {
            //
          }
        }),
      }),
    };
  }

  function Routes(stores) {
    return [
      {
        path: "",
        children: [
          {
            path: "/login",
            action: async (routerContext) => {
              await authStore.redirectFromSocialLogin();
              return {
                routerContext,
                title: "Login",
                layout,
                component: (
                  <AsyncView
                    authStore={authStore}
                    getModule={() => import("./views/loginView")}
                  />
                ),
              };
            },
          },
          {
            path: "/register",
            action: (routerContext) => ({
              title: "Register",
              routerContext,
              layout,
              component: (
                <AsyncView getModule={() => import("./views/registerView")} />
              ),
            }),
          },
          {
            path: "/logout",
            action: (routerContext) => {
              stores.logout.execute();
              return {
                routerContext,
                title: "Logout",
                layout,
                component: h(logoutView(context), { store: stores.auth }),
              };
            },
          },
          {
            path: "/forgot",
            action: (routerContext) => ({
              routerContext,
              title: "Forgot password",
              layout,
              component: (
                <AsyncView getModule={() => import("./views/forgotView")} />
              ),
            }),
          },
          {
            path: "/resetPassword/:token",
            action: (routerContext) => ({
              routerContext,
              title: "Reset password",
              layout,
              component: (
                <AsyncView
                  params={routerContext.params}
                  getModule={() => import("./views/resetPasswordView")}
                />
              ),
            }),
          },
          {
            path: "/verifyEmail/:code",
            action: (routerContext) => {
              stores.verifyEmailCode.execute({
                code: routerContext.params.code,
              });
              return {
                routerContext,
                title: "Verify Email",
                layout,
                component: h(registrationCompleteView(context), {
                  store: stores.verifyEmailCode,
                }),
              };
            },
          },
        ],
      },
    ];
  }

  const stores = Stores();

  return {
    stores: () => stores,
    routes: () => Routes(stores),
  };
}
