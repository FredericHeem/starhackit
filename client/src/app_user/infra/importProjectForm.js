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
import { buttonWizardBack, buttonHistoryBack } from "./wizardCreate";
import form from "components/form";
import { PROJECTS } from "./projectList";

const selection =
  ({ theme: { palette, shadows } }) =>
  ({ title, description, url, directory, onClick, ...leftover }) =>
    (
      <button
        {...leftover}
        onClick={() => onClick({ title, url, directory })}
        css={css`
          width: 100%;
          border: 1px none ${palette.grey[400]};
          box-shadow: ${shadows[2]};
          border-radius: 2px;
          padding: 0rem 1rem;
          cursor: pointer;
          background-color: transparent;
          text-align: start;
          max-width: 500px;
          :hover {
            box-shadow: ${shadows[5]};
          }
        `}
      >
        <h3>{title}</h3>
        <p>{description}</p>
      </button>
    );

export const importProjectCreateStore = (context) => {
  const { tr, history, alertStack, rest, emitter } = context;
  const asyncOpCreate = AsyncOp(context);

  const store = observable({
    project: {},
    modalOpenNewProjectFromTemplate: false,
    showNewProjectFromTemplate: action((show) => {
      store.modalOpenNewProjectFromTemplate = show;
    }),
    selectProjectTemplate: action((project) => {
      store.modalOpenNewProjectFromTemplate = false;
      emitter.emit("step.select", "Configuration", { pippo: "pippo" });
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
      emitter.emit("step.select", "Configuration", { pippo: "pippo" });
    }),
  });

  return store;
};
const projectId = (project) => `${project.url}${project.directory}`;

const modalNewFromTemplate = (context) => {
  const Modal = modal(context);
  const Button = button(context);
  const Selection = selection(context);

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
          {projects.map((project) => (
            <li key={projectId(project)}>
              <Selection
                {...project}
                data-template={projectId(project)}
                onClick={(project) => store.onSelectProject(project)}
              />
            </li>
          ))}
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
  const Selection = selection(context);
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
        projects={PROJECTS[storeProvider.providerName]}
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
          <Selection
            data-selection-project-import-existing
            title={tr.t("Import an existing infrastructure")}
            description="Choose this option to visualize an existing infrastructure."
            onClick={() => emitter.emit("step.select", "Configuration")}
          />
          <Selection
            data-selection-project-new-from-template
            title={tr.t("Create new infrastrucure from a template")}
            description="This option lets you create an infrastructure from a selection of ready made template."
            onClick={() => store.showNewProjectFromTemplate(true)}
          />
          {storeProvider.supportImport && (
            <Selection
              data-selection-project-import-from-cloud
              title={tr.t("Import from an OpenStack Cloud Provider")}
              description="Do you have an existing infrastructure on a cloud provider supporting the OpenStack API such as Red Hat, OVH, IBM etc...? Would you like to migrate this infractstructure ?  The new infrastructure code will be generated from your current inventory."
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
