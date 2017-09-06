import React from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import glamorous from "glamorous";

export default context => {
  const { tr, theme } = context;
  const { palette } = theme;

  const store = observable({
    show: false,
    toggle(){
      store.show = !store.show;
    },
    word: "World"
  });

  const HelloView = glamorous("div")({
    width: 300,
    padding: 20,
    border: `1px solid ${palette.borderColor}`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    "> * " : {
      margin: 20
    }
  });

  function Word({store}){
    return (<div>{store.word}</div>)
  }

  function Hello() {
    return (
      <HelloView>
        <h2>{tr.t("Hello")}</h2>
        <button onClick={() => store.toggle()}>{store.show ? tr.t("Hide") : tr.t("Show")}</button>
        {store.show && <Word store={store} />}
      </HelloView>
    );
  }
  return {
    store,
    view: observer(Hello)
  }
};
