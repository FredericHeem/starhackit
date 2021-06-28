/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { observable, action } from "mobx";
import { observer } from "mobx-react";
import { get, or, pipe } from "rubico";
import { isEmpty } from "rubico/x";
import validate from "validate.js";
import modal from "mdlean/lib/modal";
import AsyncOp from "mdlean/lib/utils/asyncOp";
import button from "mdlean/lib/button";
import input from "mdlean/lib/input";
import formGroup from "mdlean/lib/formGroup";
import spinner from "mdlean/lib/spinner";
import { list, listItem } from "mdlean/lib/list";
import { buttonHistoryBack } from "./wizardCreate";
import form from "components/form";
import { PROJECTS } from "./projectList";

const projectId = (project) => `${project.url}${project.directory}`;

const projectItem = (context) => {
  const ListItem = listItem(context);
  const ProjectItem = ({ item, store, ...leftOver }) => (
    <ListItem onClick={() => store.onSelectProject(item)} {...leftOver} raised>
      <h3>{item.title}</h3>
      <p>{item.description}</p>
    </ListItem>
  );
  return ProjectItem;
};

const importTypeItem = (context) => {
  const ListItem = listItem(context);
  const ImportTypeItem = ({ item, onClick, ...leftOver }) => (
    <ListItem {...leftOver} onClick={() => onClick(item)} raised>
      <h3>{item.title}</h3>
      <p>{item.description}</p>
    </ListItem>
  );
  return ImportTypeItem;
};

export const importProjectCreateStore = (context) => {
  const { emitter } = context;

  const store = observable({
    project: {},
    modalOpenNewProjectFromTemplate: false,
    showNewProjectFromTemplate: action((show) => {
      store.modalOpenNewProjectFromTemplate = show;
    }),
    onSelectProject: (project) => {
      store.modalOpenNewProjectFromTemplate = false;
      store.project = project;
      emitter.emit("step.next");
    },
    modalImportFromCloud: false,
    showImportFromCloud: action((show) => {
      store.modalImportFromCloud = show;
    }),
    selectImportFormCloud: action((project) => {
      store.modalOpenNewProjectFromTemplate = false;
      emitter.emit("step.next", { pippo: "pippo" });
    }),
  });

  return store;
};

const modalNewFromTemplate = (context) => {
  const Modal = modal(context);
  const Button = button(context);
  const List = list(context);
  const ProjectItem = projectItem(context);

  return observer(({ store, projects = [] }) => (
    <Modal
      open={store.modalOpenNewProjectFromTemplate}
      onClose={() => {
        store.showNewProjectFromTemplate(false);
      }}
    >
      <header>New infrastructure from a template</header>
      <main
        css={css`
          margin: 1rem;
        `}
      >
        <p>Select an infrastructure template from the list below.</p>
        <ul
          css={css`
            > li {
              margin: 1rem 0;
            }
          `}
        >
          <List
            items={projects}
            toId={({ item }) => projectId(item)}
            itemRenderer={ProjectItem}
            store={store}
          />
        </ul>
      </main>
      <footer>
        <Button onClick={() => store.showNewProjectFromTemplate(false)}>
          Cancel
        </Button>
      </footer>
    </Modal>
  ));
};

const modalImportFromCloud = (context) => {
  const Modal = modal(context);
  const Button = button(context);

  return observer(({ store }) => (
    <Modal
      css={css`
        border: 1px red solid;
      `}
      open={store.modalImportFromCloud}
      onClose={() => {
        store.showNewProjectFromTemplate(false);
      }}
    >
      <header>Import from Cloud</header>
      <main
        css={css`
          border: 1px red solid;
        `}
      >
        TODO
      </main>
      <footer>
        <Button onClick={() => store.showImportFromCloud(false)}>Cancel</Button>
      </footer>
    </Modal>
  ));
};

export const importProjectForm = (context) => {
  const { tr, theme, emitter } = context;
  const ImportTypeItem = importTypeItem(context);
  const Form = form(context);
  const ButtonHistoryBack = buttonHistoryBack(context);
  const ModalNewFromTemplate = modalNewFromTemplate(context);
  const ModalImportFromCloud = modalImportFromCloud(context);

  return observer(({ store, storeProvider }) => (
    <Form
      data-form-import-project
      css={css`
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin: 0.5rem;
      `}
    >
      <ModalNewFromTemplate
        store={store}
        projects={PROJECTS[storeProvider.data.providerName]}
      />
      <ModalImportFromCloud store={store} />

      <header>
        <h2>{tr.t("Import Project")}</h2>
      </header>
      <main>
        <div
          css={css`
            display: flex;
            flex-direction: column;
            > button {
              margin: 1rem 0;
            }
          `}
        >
          <ImportTypeItem
            data-selection-project-import-existing
            item={{
              title: tr.t("Import an existing infrastructure"),
              description:
                "Choose this option to visualize an existing infrastructure.",
            }}
            onClick={() => emitter.emit("step.next")}
          />
          <ImportTypeItem
            data-selection-project-new-from-template
            item={{
              title: tr.t("Create new infrastrucure from a template"),
              description:
                "This option lets you create an infrastructure from a selection of ready made template.",
            }}
            onClick={() => store.showNewProjectFromTemplate(true)}
          />
          {storeProvider.supportImport && (
            <ImportTypeItem
              data-selection-project-import-from-cloud
              item={{
                title: tr.t("Import from an OpenStack Cloud Provider"),
                description:
                  "Do you have an existing infrastructure on a cloud provider supporting the OpenStack API such as Red Hat, OVH, IBM etc...? Would you like to migrate this infractstructure ?  The new infrastructure code will be generated from your current inventory.",
              }}
              onClick={() => store.showImportFromCloud(true)}
            />
          )}
        </div>
      </main>
      <footer>
        <ButtonHistoryBack />
      </footer>
    </Form>
  ));
};
