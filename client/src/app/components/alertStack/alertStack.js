import * as React from "react";
import { observable } from "mobx";
import { observer } from "mobx-react";
import { keyframes } from "glamor";
import glamorous from "glamorous";

export default (context, { limit = 10 }) => {
  const store = observable({
    messages: [],
    setStatus(id, status) {
      store.messages.findIndex(message => {
        if (message.id === id) {
          message.status = status;
          return true;
        }
        return false;
      });
    },
    add(component) {
      const { messages } = store;
      console.log("add ", component);
      const message = {
        id: Math.random().toString(10).split(".")[1],
        component,
        status: "inserting"
      };
      component.attributes.onRemove = () => {
          store.remove(message.id);
      };
      if (messages.length >= limit) {
        store.remove(messages[0].id);
      }

      messages.push(message);
      setTimeout(() => store.setStatus(message.id, "inserted"), 400);
    },
    remove(id) {
      store.setStatus(id, "removing");
      store.messages.findIndex((message, idx) => {
        if (message.id === id) {
          setTimeout(() => store.messages.splice(idx, 1), 400);
          return true;
        }
        return false;
      });
    }
  });

  const AlertView = glamorous("div")({
    margin: 10,
    padding: 10,
    display: "flex",
    justifyContent: "space-between"
  });

  const animationFadeIn = keyframes({
    "0%": { transform: "scale(0.5)", opacity: 0 },
    "100%": { transform: "scale(1)", opacity: 1 }
  });
  const animationFadeOut = keyframes({
    "0%": { transform: "scale(1)", opacity: 1 },
    "100%": { transform: "scale(0)", opacity: 0 }
  });

  const animation = {
    inserting: {
      animation: `${animationFadeIn} 0.5s`
    },
    removing: {
      animation: `${animationFadeOut} 0.5s`
    }
  };

  const Alert = observer(function Alert({ message }) {
    const css = animation[message.status];
    const { component } = message;

    return (
      <AlertView css={css}>
        {component}
      </AlertView>
    );
  });

  const AlertsView = glamorous("div")({
    minWidth: 300,
    maxWidth: 600,
    position: "fixed",
    right: 20
  });

  function AlertStack() {
    return (
      <AlertsView>
        {store.messages.map((message, key) =>
          <Alert key={key} message={message} />
        )}
      </AlertsView>
    );
  }

  return {
    store,
    View: observer(AlertStack),
    add(message) {
      store.add(message);
    },
    remove(id) {
      store.remove(id);
    }
  };
};
