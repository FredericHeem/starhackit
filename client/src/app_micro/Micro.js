/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { observer } from "mobx-react";
import { observable } from "mobx";
import Context from "../context";
import App from "../app";
import createLink from "components/link";

export default async () => {
  const context = await Context();
  const { tr, palette } = context;
  const Link = createLink(context);

  const store = observable({
    show: false,
    toggle() {
      store.show = !store.show;
    }
  });

  const Menu = () => (
    <div
      css={css`
        display: flex;
        justify-content: flex-start;
        & * {
          margin: 10px;
        }
      `}
    >
      <Link to="/">Main</Link>
      <Link to="/page">Page</Link>
    </div>
  );

  const layout = () => ({ children }) => (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      `}
    >
      <header
        css={css`
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: ${palette.primary};
          color: ${palette.textPrimaryOnPrimary};
          & * {
            margin: 10px;
          }
        `}
      >
        <h2>Example App</h2>
        <Menu />
      </header>
      <main
        css={{
          flexGrow: 1,
          border: "1px dotted green"
        }}
      >
        {children}
      </main>
    </div>
  );

  const Intro = observer(() => (
    <div
      css={{
        margin: "20px",
        border: "1px dotted green"
      }}
    >
      <div>Edit app_micro/Micro.js to get started </div>
      <button type="button" onClick={() => store.toggle()}>
        {store.show ? tr.t("Hide") : tr.t("Show more info")}
      </button>
      {store.show && <div>More info here</div>}
    </div>
  ));

  const PageA = () => <div>PageA</div>;

  const routes = [
    {
      path: "/",
      action: () => ({
        title: "Intro",
        component: <Intro />
      })
    },
    {
      path: "/page",
      action: () => ({
        title: "Page",
        component: <PageA />
      })
    }
  ];

  return App({ context, routes, layout });
};
