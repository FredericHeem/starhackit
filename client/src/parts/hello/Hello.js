/** @jsx jsx */
import { jsx } from "@emotion/core";
import { observer } from "mobx-react";
import { observable } from "mobx";

export default context => {
  const {
    tr,
    theme: { palette }
  } = context;

  const store = observable({
    show: false,
    toggle() {
      store.show = !store.show;
    },
    word: "World"
  });

  const Word = ({ store }) => <div>{store.word}</div>

  const Hello = observer(() => (
    <div
      css={{
        width: 300,
        padding: 20,
        border: `1px solid ${palette.borderColor}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        "> * ": {
          margin: 20
        }
      }}
    >
      <h2>{tr.t("Hello")}</h2>
      <button type="button" onClick={() => store.toggle()}>
        {store.show ? tr.t("Hide") : tr.t("Show")}
      </button>
      {store.show && <Word store={store} />}
    </div>
  ));

  return {
    routes: () => [
      {
        path: "",
        action: routerContext => {
          // Fetch data here
          return {
            title: "Hello",
            component: <Hello/>
          };
        }
      }
    ]
  };
};
