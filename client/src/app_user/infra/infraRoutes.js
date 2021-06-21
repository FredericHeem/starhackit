/* @jsxImportSource @emotion/react */
import { createElement as h } from "react";

import wizardCreate from "./wizardCreate";
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
        stores.create.reset();
        return {
          routerContext,
          title: "Create Infrastructure",
          component: h(wizardCreate(context), {
            title: "Create",
            buttonTitle: "Create Infrastructure",
            store: stores.create,
            //TODO check
            onClick: () => stores.create.create(),
          }),
        };
      },
    },
    {
      path: "/detail/:id/aws/edit",
      protected: true,
      action: async (routerContext) => {
        stores.aws.setData(window.history.state.usr);
        return {
          routerContext,
          title: "Edit Aws Infrastructure",
          component: h(awsFormEdit(context), {
            store: stores.aws,
          }),
        };
      },
    },
    {
      path: "/detail/:id/google/edit",
      protected: true,
      action: async (routerContext) => {
        stores.google.setData(window.history.state.usr);
        return {
          routerContext,
          title: "Edit GCP Infrastructure",
          component: h(gcpFormEdit(context), {
            store: stores.google,
          }),
        };
      },
    },
    {
      path: "/detail/:id/azure/edit",
      protected: true,
      action: async (routerContext) => {
        stores.azure.setData(window.history.state.usr);
        return {
          routerContext,
          title: "Edit Azure Infrastructure",
          component: h(azureFormEdit(context), {
            store: stores.azure,
          }),
        };
      },
    },
    //TODO change to ovh
    {
      path: "/detail/:id/openstack/edit",
      protected: true,
      action: async (routerContext) => {
        stores.ovh.setData(window.history.state.usr);
        return {
          routerContext,
          title: "Edit OVH Infrastructure",
          component: h(ovhFormEdit(context), {
            store: stores.ovh,
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
