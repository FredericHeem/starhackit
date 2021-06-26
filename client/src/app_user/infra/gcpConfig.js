/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { observable, action } from "mobx";
import { observer } from "mobx-react";

import input from "mdlean/lib/input";

import fileInput from "mdlean/lib/fileInput";
import formGroup from "mdlean/lib/formGroup";

import IconUpload from "./assets/uploadIcon.svg";

import { providerCreateStore } from "./providerStore";
import {
  providerFormCreate,
  providerFormUpdate,
  providerConfigCreateFooter,
  providerConfigUpdateFooter,
} from "./providerConfigCommon";

export const createStoreGoogle = (
  context,
  { importProjectStore, gitCredentialStore, gitRepositoryStore }
) => {
  const core = providerCreateStore({
    context,
    defaultData: {},
    rules: {},
    importProjectStore,
    gitCredentialStore,
    gitRepositoryStore,
  });

  const store = observable({
    fileName: "",
    content: {},
    buildPayload: () => ({
      name: store.content.project_id,
      providerType: "google",
      providerName: "google",
      providerAuth: { credentials: store.content },
    }),
    get isDisabled() {
      return !store.content.project_id;
    },
    onChangeFile: (event) => {
      const file = event.target.files[0];
      if (file) {
        store.fileName = file.name;
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => {
          try {
            store.content = JSON.parse(reader.result);
          } catch (error) {
            //TODO display error
            store.error = "Error parsing file";
          }
        };

        reader.onerror = () => {
          //TODO display error
          console.log(reader.error);
        };
      } else {
        //TODO
        store.input = "";
      }
    },
    core,
  });

  return store;
};

const credentialFile =
  ({ theme: { palette } }) =>
  ({ fileName, content }) =>
    (
      <table
        css={css`
          border-collapse: collapse;
          td,
          th {
            border: 1px solid ${palette.grey[500]};
            padding: 0.5rem;
            text-align: left;
          }
        `}
      >
        <tbody>
          <tr>
            <th>Credential File</th>
            <td>{fileName}</td>
          </tr>
          <tr>
            <th>Project Name</th>
            <td>{content.project_id}</td>
          </tr>
          <tr>
            <th>Service Account</th>
            <td>{content.client_email}</td>
          </tr>
        </tbody>
      </table>
    );

const fileInputLabel =
  ({ tr, theme: { palette } }) =>
  ({}) =>
    (
      <div
        css={[
          css`
            display: flex;
            align-items: center;
            flex-direction: column;
            color: ${palette.text.primary};
            > * {
              margin: 1rem;
            }
            svg {
              height: 2rem;
              path {
                fill: ${palette.text.primary};
              }
            }
          `,
        ]}
      >
        <img src={IconUpload} alt="upload" />
        <span>{tr.t("Choose a credential file to upload")}</span>
      </div>
    );

export const gcpFormCreate = (context) => {
  const { tr } = context;
  const FormCreate = providerFormCreate(context);

  const FileInput = fileInput(context);
  const CredentialFile = credentialFile(context);
  const FileInputLabel = fileInputLabel(context);
  const Footer = providerConfigCreateFooter(context);

  return observer(({ store }) => (
    <FormCreate>
      <main>
        <p>
          GruCloud requires a read-only service account to scan a project's
          architecture. Please select the service account credential JSON file
          for the project that will be scanned. Follow the following steps to
          create and upload this file.
        </p>
        <ol
          css={css`
            > li {
              padding: 0.3rem 0;
            }
          `}
        >
          <li>
            <span>Visit the </span>
            <a
              href="https://console.cloud.google.com/iam-admin/serviceaccounts"
              target="_blank"
            >
              service account page
            </a>{" "}
            on the google cloud console
          </li>
          <li>Select your project</li>
          <li>
            Click on <em>CREATE SERVICE ACCOUNT</em>
          </li>
          <li>
            Set the <em>Service account name</em> to 'grucloud' for instance
          </li>
          <li>
            Click on <em>CREATE</em>
          </li>
          <li>Select the basic role 'Viewer'</li>
          <li>
            Click on <em>CONTINUE</em>
          </li>
          <li>
            Click on <em>DONE</em>
          </li>
          <li>
            Go to the <em>Actions</em> column, click on the three dot icon of
            the newly created service account
          </li>
          <li>
            Click on <em>Manage keys</em>
          </li>
          <li>
            Click on <em>ADD KEYS</em>, then <em>Create new key</em>
          </li>
          <li>
            Click on <em>CREATE</em> to download the credential file in JSON
            format.
          </li>
        </ol>
        <FileInput
          data-input-google-upload
          cssOverride={css`
            .filename-display {
              display: none;
            }
          `}
          component={<FileInputLabel />}
          name="file"
          accept="application/JSON"
          onChange={(evt) => store.onChangeFile(evt)}
        />

        {!store.isDisabled && (
          <CredentialFile fileName={store.fileName} content={store.content} />
        )}
      </main>
      <Footer store={store} />
    </FormCreate>
  ));
};

export const gcpFormEdit = (context) => {
  const { tr } = context;
  const FormUpdate = providerFormUpdate(context);
  const FormGroup = formGroup(context);
  const FileInput = fileInput(context);
  const Input = input(context, {
    cssOverride: css`
      input {
        width: 25rem;
      }
    `,
  });
  const CredentialFile = credentialFile(context);
  const FileInputLabel = fileInputLabel(context);
  const Footer = providerConfigUpdateFooter(context);

  return observer(({ store }) => (
    <FormUpdate>
      <header>
        <h2>{tr.t("Update GCP Infrastructure")}</h2>
      </header>
      <main>
        <FormGroup>
          <Input
            value={store.core.data.name}
            disabled={true}
            label={tr.t("Infrastrucure Name")}
          />
        </FormGroup>
        <FileInput
          data-input-google-upload
          cssOverride={css`
            .filename-display {
              display: none;
            }
          `}
          component={<FileInputLabel />}
          name="file"
          accept="application/JSON"
          onChange={(evt) => store.onChangeFile(evt)}
        />

        {!store.isDisabled && (
          <CredentialFile fileName={store.fileName} content={store.content} />
        )}
      </main>
      <Footer store={store} />
    </FormUpdate>
  ));
};
