/* @jsxImportSource @emotion/react */
import { createElement as h } from "react";

import { wizardCreate } from "./wizardCreate";
import createInfraDetail from "./infraDetail";
import { awsFormEdit } from "./awsConfig";
import { gcpFormEdit } from "./gcpConfig";
import { azureFormEdit } from "./azureConfig";
import { ovhFormEdit } from "./ovhConfig";

import { createInfraDelete } from "./infraDelete";
import { createInfraList } from "./infraList";

export const createRoutes = ({ context, stores }) => {
  return [
    {
      path: "",
      protected: true,
      action: (routerContext) => {
        stores.infra.get();
        return {
          routerContext,
          title: "My Infra",
          component: h(createInfraList(context), {
            title: "Create",
            store: stores.infra,
          }),
        };
      },
    },
    {
      path: "/create",
      protected: true,
      action: (routerContext) => {
        return {
          routerContext,
          title: "Create Infrastructure",
          component: h(wizardCreate({ context, stores }), {
            title: "Create",
            buttonTitle: "Create Infrastructure",
          }),
        };
      },
    },
    {
      path: "/detail/:id/aws/edit",
      protected: true,
      action: async (routerContext) => {
        stores.wizard.infraSettingsStore.setData(window.history.state.usr);
        stores.wizard.aws.core.setData(window.history.state.usr);
        return {
          routerContext,
          title: "Edit Aws Infrastructure",
          component: h(awsFormEdit(context), {
            store: stores.wizard.aws,
            infraSettingsStore: stores.wizard.infraSettingsStore,
          }),
        };
      },
    },
    {
      path: "/detail/:id/google/edit",
      protected: true,
      action: async (routerContext) => {
        stores.wizard.infraSettingsStore.setData(window.history.state.usr);
        stores.wizard.google.core.setData(window.history.state.usr);
        return {
          routerContext,
          title: "Edit GCP Infrastructure",
          component: h(gcpFormEdit(context), {
            store: stores.wizard.google,
            infraSettingsStore: stores.wizard.infraSettingsStore,
          }),
        };
      },
    },
    {
      path: "/detail/:id/azure/edit",
      protected: true,
      action: async (routerContext) => {
        stores.wizard.infraSettingsStore.setData(window.history.state.usr);
        stores.wizard.azure.core.setData(window.history.state.usr);
        return {
          routerContext,
          title: "Edit Azure Infrastructure",
          component: h(azureFormEdit(context), {
            store: stores.wizard.azure,
            infraSettingsStore: stores.wizard.infraSettingsStore,
          }),
        };
      },
    },
    {
      path: "/detail/:id/ovh/edit",
      protected: true,
      action: async (routerContext) => {
        stores.wizard.infraSettingsStore.setData(window.history.state.usr);
        stores.wizard.ovh.core.setData(window.history.state.usr);
        return {
          routerContext,
          title: "Edit OVH Infrastructure",
          component: h(ovhFormEdit(context), {
            store: stores.wizard.ovh,
            infraSettingsStore: stores.wizard.infraSettingsStore,
          }),
        };
      },
    },
    {
      path: "/detail/:id/delete",
      protected: true,
      action: (routerContext) => {
        stores.delete.setData(window.history.state.usr);
        return {
          routerContext,
          title: "Delete Infrastructure",
          component: h(createInfraDelete(context), {
            store: stores.delete,
          }),
        };
      },
    },
    {
      path: "/detail/:id",
      protected: true,
      action: async (routerContext) => {
        await stores.infraDetail.getById(routerContext.params.id);
        return {
          routerContext,
          title: "Infrastructure Detail",
          component: h(createInfraDetail(context), {
            store: stores.infraDetail,
            detail: window.history.state.usr,
          }),
        };
      },
    },
  ];
};
